const state = {
  patterns: [],
  problems: [],
  page: 1,
  pages: 1,
  total: 0,
  limit: 50,
  difficulty: "",
  patternId: "",
  patternSlug: "",
  search: "",
  progressMap: new Map(),
  patternTotals: {},
  patternDone: {},
  unlockState: null,
  progressEntries: [],
  tonightShuffle: 0,
};

const SESSION_KEY = typeof Focus !== "undefined" ? Focus.SESSION_KEY : "afterhours_home_session";

const TONIGHT_IDS = {
  panel: "tonightsProblem",
  reason: "tonightsReason",
  title: "tonightsTitle",
  meta: "tonightsMeta",
  link: "tonightsLink",
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function difficultyClass(d) {
  return d.toLowerCase();
}

function getTotalDone() {
  return Object.values(state.patternDone).reduce((a, b) => a + b, 0);
}

function updateMilestones(prevCount) {
  if (typeof Milestones === "undefined") return;
  Milestones.update(getTotalDone(), prevCount);
}

function updateAuthUI() {
  const loggedIn = Auth.isLoggedIn();
  const loginPrompt = $("#loginPrompt");
  const progressLink = $("#homeProgressLink");
  const progressSnippet = $("#homeProgressSnippet");

  if (loginPrompt) loginPrompt.hidden = loggedIn;
  if (progressLink) progressLink.hidden = !loggedIn;
  if (progressSnippet) progressSnippet.hidden = !loggedIn;

  if (!loggedIn && typeof Milestones !== "undefined") {
    Milestones.renderHeaderBadges(0);
  }

  Nav.updateAuthNav();
  Nav.bindLogout({
    onLogout: () => {
      state.progressMap.clear();
      state.patternDone = {};
      updateHomeProgressSnippet();
    },
  });
  updateHomeProgressSnippet();
}

function persistSession() {
  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        patternId: state.patternId,
        patternSlug: state.patternSlug,
        difficulty: state.difficulty,
        search: state.search,
        page: state.page,
      }),
    );
  } catch {
    /* ignore quota / private mode */
  }
  updateContinueSession();
}

function updateContinueSession() {
  if (typeof Focus === "undefined") return;
  Focus.renderContinue(
    $("#continueSession"),
    $("#continueSessionDetail"),
    state.patterns,
    state,
  );
}

function restoreSession() {
  if (new URLSearchParams(window.location.search).get("pattern")) return false;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    state.patternId = saved.patternId || "";
    state.patternSlug = saved.patternSlug || "";
    state.difficulty = saved.difficulty || "";
    state.search = saved.search || "";
    state.page = saved.page > 0 ? saved.page : 1;
    return true;
  } catch {
    return false;
  }
}

function applySessionUI() {
  const searchInput = $("#searchInput");
  if (searchInput) searchInput.value = state.search;

  $$("#difficultyFilters .filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.difficulty === state.difficulty);
  });

  $$(".pattern-btn").forEach((btn) => btn.classList.remove("active"));

  if (state.patternSlug) {
    const btn = document.querySelector(`.pattern-btn[data-slug="${state.patternSlug}"]`);
    if (btn && !btn.disabled) {
      btn.classList.add("active");
      return;
    }
    state.patternId = "";
    state.patternSlug = "";
  }

  const allBtn = document.querySelector('.pattern-btn[data-slug=""]');
  if (allBtn) allBtn.classList.add("active");
}

function updateHomeProgressSnippet() {
  const el = $("#homeProgressSnippet");
  if (!el || !Auth.isLoggedIn()) return;

  const done = getTotalDone();
  const total = Unlocks.TOTAL_PROBLEMS;
  const percent = total ? Math.round((done / total) * 100) : 0;
  el.textContent = `${done} of ${total} solved · ${percent}%`;
}

async function loadTonightsProblem() {
  if (typeof Focus === "undefined") return;

  try {
    const result = await Focus.fetchTonightsProblem({
      patterns: state.patterns,
      patternDone: state.patternDone,
      patternTotals: state.patternTotals,
      progressMap: state.progressMap,
      unlockState: state.unlockState,
      tonightShuffle: state.tonightShuffle,
      apiFn: (path) => api(path),
    });
    Focus.renderTonightsProblem(result, TONIGHT_IDS);
  } catch {
    const panel = $("#tonightsProblem");
    if (panel) panel.hidden = true;
  }
}

async function loadPatterns() {
  const { data } = await api("/api/v1/patterns");
  state.patterns = data;

  for (const p of data) {
    state.patternTotals[p._id] = p.problemCount ?? Unlocks.PROBLEMS_PER_PATTERN;
  }

  const list = $("#patternList");
  data.forEach((p) => {
    const li = document.createElement("li");
    li.className = "pattern-item";
    const done = state.patternDone[p._id] || 0;
    const total = state.patternTotals[p._id] || Unlocks.PROBLEMS_PER_PATTERN;
    li.innerHTML = `
      <button class="pattern-btn" data-id="${p._id}" data-slug="${p.slug}">
        <span class="pattern-name">${escapeHtml(p.name)}</span>
        <span class="pattern-count">${Auth.isLoggedIn() ? `${done}/${total}` : total}</span>
      </button>
      <button
        type="button"
        class="pattern-info-btn"
        data-slug="${p.slug}"
        aria-label="About ${escapeHtml(p.name)}"
        title="About ${escapeHtml(p.name)}"
      >i</button>`;
    list.appendChild(li);
  });

  updateAllPatternCount();
}

function updateAllPatternCount() {
  const el = $("#allPatternCount");
  if (Auth.isLoggedIn()) {
    const done = Object.values(state.patternDone).reduce((a, b) => a + b, 0);
    el.textContent = `${done}/${Unlocks.TOTAL_PROBLEMS}`;
  } else {
    el.textContent = String(Unlocks.TOTAL_PROBLEMS);
  }
}

async function loadProgress() {
  if (!Auth.isLoggedIn()) {
    state.progressMap.clear();
    state.patternDone = {};
    state.progressEntries = [];
    updateProgressUI();
    return;
  }

  try {
    const { data } = await api("/api/v1/progress?status=done");
    state.progressMap.clear();
    state.patternDone = {};
    state.progressEntries = data;

    data.forEach((entry) => {
      const problem = entry.problemId;
      if (!problem) return;
      const problemId = problem._id;
      state.progressMap.set(problemId, { id: entry._id, status: entry.status });

      const pid = problem.patternId?._id || problem.patternId;
      if (pid) {
        state.patternDone[pid] = (state.patternDone[pid] || 0) + 1;
      }
    });

    updateProgressUI();
    refreshPatternCounts();
    updateUnlockState();
    if (state.problems.length) renderProblems();
    updateHomeProgressSnippet();
    await loadTonightsProblem();
  } catch {
    Auth.clearSession();
    updateAuthUI();
  }
}

function updateUnlockState() {
  state.unlockState = Unlocks.getClientState(state.patternDone, state.patterns);
  refreshPatternLocks();
}

function refreshPatternLocks() {
  if (!state.unlockState) return;
  $$(".pattern-btn").forEach((btn) => {
    if (!btn.dataset.id) return;
    const pattern = state.patterns.find((p) => p._id === btn.dataset.id);
    const locked = pattern && Unlocks.isAdvancedPattern(pattern) && !state.unlockState.advancedPatternsUnlocked;
    btn.classList.toggle("pattern-locked", locked);
    btn.disabled = locked;
    const nameEl = btn.querySelector(".pattern-name");
    if (nameEl && !nameEl.dataset.baseName) {
      nameEl.dataset.baseName = nameEl.textContent.replace(/^🔒\s*/, "");
    }
    if (nameEl) {
      nameEl.textContent = locked ? `🔒 ${nameEl.dataset.baseName}` : nameEl.dataset.baseName;
    }
  });
}

function practiceLinkHtml(problem) {
  const url = problem.leetcodeLink || problem.practiceLink;
  if (!url) return `<span class="muted-text">—</span>`;
  const source = problem.source || (problem.leetcodeLink ? "LeetCode" : "Practice");
  return `<a href="${url}" target="_blank" rel="noopener" class="link-btn">${escapeHtml(source)} ↗</a>`;
}
function updateProgressUI(milestonePrevCount) {
  if (!Auth.isLoggedIn()) return;
  updateHomeProgressSnippet();
  updateMilestones(milestonePrevCount);
}

function refreshPatternCounts() {
  $$(".pattern-btn").forEach((btn) => {
    const countEl = btn.querySelector(".pattern-count");
    if (!countEl) return;

    if (btn.dataset.id === "") {
      const done = Object.values(state.patternDone).reduce((a, b) => a + b, 0);
      countEl.textContent = Auth.isLoggedIn()
        ? `${done}/${Unlocks.TOTAL_PROBLEMS}`
        : String(Unlocks.TOTAL_PROBLEMS);
      return;
    }

    const total = state.patternTotals[btn.dataset.id] || Unlocks.PROBLEMS_PER_PATTERN;
    const done = state.patternDone[btn.dataset.id] || 0;
    countEl.textContent = Auth.isLoggedIn() ? `${done}/${total}` : String(total);
  });
}

async function loadProblems() {
  const params = new URLSearchParams({
    page: state.page,
    limit: state.limit,
  });
  if (state.difficulty) params.set("difficulty", state.difficulty);
  if (state.patternId) params.set("patternId", state.patternId);
  if (state.search) params.set("search", state.search);

  const { data, total, pages, page } = await api(`/api/v1/problems?${params}`);
  state.problems = data;
  state.total = total;
  state.pages = pages;
  state.page = page;

  if (state.patternId) {
    const pattern = state.patterns.find((p) => p._id === state.patternId);
    $("#viewTitle").textContent = pattern?.name || "Problems";
  } else {
    $("#viewTitle").textContent = "All Problems";
  }

  updateProgressUI();
  renderProblems();
  renderPagination();
}

function renderProblems() {
  const container = $("#problemsContainer");

  if (!state.problems.length) {
    container.innerHTML = '<div class="empty-state">No problems found.</div>';
    return;
  }

  const loggedIn = Auth.isLoggedIn();
  const offset = (state.page - 1) * state.limit;

  if (!state.unlockState) {
    state.unlockState = Unlocks.getClientState(state.patternDone, state.patterns);
  }

  const rows = state.problems
    .map((p, i) => {
      const isDone = state.progressMap.has(p._id);
      const progress = state.progressMap.get(p._id);
      const locked = Unlocks.isProblemLocked(p, state.unlockState);
      const lockReason = locked ? Unlocks.getLockReason(p, state.unlockState) : "";
      const link = practiceLinkHtml(p);

      let statusCell;
      if (!loggedIn) {
        statusCell = `<span class="status-icon">${isDone ? "✓" : "○"}</span>`;
      } else if (locked) {
        statusCell = `<span class="lock-cell" title="${escapeHtml(lockReason)}">🔒</span>`;
      } else {
        statusCell = `<input type="checkbox" class="done-check" data-id="${p._id}" data-progress-id="${progress?.id || ""}" ${isDone ? "checked" : ""} aria-label="Mark done" />`;
      }

      return `
        <tr class="problem-row ${isDone ? "row-done" : ""} ${locked ? "row-locked" : ""}" data-id="${p._id}">
          <td class="col-status">${statusCell}</td>
          <td class="col-num">${offset + i + 1}</td>
          <td class="col-title"><span>${escapeHtml(p.title)}</span>${locked ? `<span class="lock-hint">${escapeHtml(lockReason)}</span>` : ""}</td>
          <td class="col-difficulty"><span class="badge ${difficultyClass(p.difficulty)}">${p.difficulty}</span></td>
          <td class="col-pattern">${escapeHtml(p.patternId?.name || "—")}</td>
          <td class="col-link">${locked ? `<span class="muted-text" title="${escapeHtml(lockReason)}">locked</span>` : link}</td>
        </tr>`;
    })
    .join("");

  container.innerHTML = `
    <div class="table-wrap">
      <table class="problem-table">
        <thead>
          <tr>
            <th class="col-status">Done</th>
            <th class="col-num">#</th>
            <th class="col-title">Title</th>
            <th class="col-difficulty">Difficulty</th>
            <th class="col-pattern">Pattern</th>
            <th class="col-link">Practice</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  container.querySelectorAll(".done-check").forEach((cb) => {
    cb.addEventListener("change", () => toggleProgress(cb));
  });
}

function renderPagination() {
  const pag = $("#pagination");
  if (state.pages <= 1) {
    pag.hidden = true;
    return;
  }
  pag.hidden = false;
  $("#pageInfo").textContent = `Page ${state.page} of ${state.pages}`;
  $("#prevPage").disabled = state.page <= 1;
  $("#nextPage").disabled = state.page >= state.pages;
}

async function toggleProgress(checkbox) {
  const problemId = checkbox.dataset.id;
  const isChecked = checkbox.checked;
  const prevDone = getTotalDone();

  try {
    if (isChecked) {
      const { data } = await api("/api/v1/progress", {
        method: "POST",
        body: JSON.stringify({ problemId, status: "done" }),
      });
      state.progressMap.set(problemId, { id: data._id, status: "done" });

      const problem = state.problems.find((p) => p._id === problemId);
      const pid = problem?.patternId?._id || problem?.patternId;
      if (pid) state.patternDone[pid] = (state.patternDone[pid] || 0) + 1;

      if (problem?.difficulty) {
        Motivation.show({
          difficulty: problem.difficulty,
          problemTitle: problem.title,
          type: "done",
        });
      }
    } else {
      const progress = state.progressMap.get(problemId);
      if (progress?.id) {
        await api(`/api/v1/progress/${progress.id}`, { method: "DELETE" });
      }
      state.progressMap.delete(problemId);

      const problem = state.problems.find((p) => p._id === problemId);
      const pid = problem?.patternId?._id || problem?.patternId;
      if (pid && state.patternDone[pid]) state.patternDone[pid]--;

      if (problem?.difficulty) {
        Motivation.show({
          difficulty: problem.difficulty,
          problemTitle: problem.title,
          type: "redo",
        });
      }
    }

    updateProgressUI(isChecked ? prevDone : undefined);
    refreshPatternCounts();
    updateUnlockState();
    renderProblems();
    loadTonightsProblem();
  } catch (err) {
    checkbox.checked = !isChecked;
    alert(err.message);
  }
}

async function api(path, options = {}) {
  return Auth.api(path, options);
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

document.addEventListener("click", (e) => {
  const infoBtn = e.target.closest(".pattern-info-btn");
  if (infoBtn) {
    e.preventDefault();
    e.stopPropagation();
    const pattern = state.patterns.find((p) => p.slug === infoBtn.dataset.slug);
    if (pattern && typeof PatternInfo !== "undefined") {
      PatternInfo.open(pattern);
    }
    return;
  }

  const patternBtn = e.target.closest(".pattern-btn");
  if (patternBtn && !patternBtn.disabled) {
    $$(".pattern-btn").forEach((b) => b.classList.remove("active"));
    patternBtn.classList.add("active");
    state.patternId = patternBtn.dataset.id || "";
    state.patternSlug = patternBtn.dataset.slug || "";
    state.page = 1;
    persistSession();
    loadProblems();
  }

  const diffBtn = e.target.closest(".filter-btn");
  if (diffBtn?.closest("#difficultyFilters")) {
    $$("#difficultyFilters .filter-btn").forEach((b) => b.classList.remove("active"));
    diffBtn.classList.add("active");
    state.difficulty = diffBtn.dataset.difficulty || "";
    state.page = 1;
    persistSession();
    loadProblems();
  }
});

$("#tonightsShuffle")?.addEventListener("click", () => {
  state.tonightShuffle += 1;
  loadTonightsProblem();
});

$("#searchInput").addEventListener(
  "input",
  debounce((e) => {
    state.search = e.target.value.trim();
    state.page = 1;
    persistSession();
    loadProblems();
  }, 350),
);

$("#prevPage").addEventListener("click", () => {
  if (state.page > 1) {
    state.page--;
    persistSession();
    loadProblems();
  }
});

$("#nextPage").addEventListener("click", () => {
  if (state.page < state.pages) {
    state.page++;
    persistSession();
    loadProblems();
  }
});


function selectPatternFromUrl() {
  const slug = new URLSearchParams(window.location.search).get("pattern");
  if (!slug) return;
  const btn = document.querySelector(`.pattern-btn[data-slug="${slug}"]`);
  if (btn) btn.click();
}

async function init() {
  await Nav.init({
    onLogout: () => {
      state.progressMap.clear();
      state.patternDone = {};
      state.progressEntries = [];
    },
  });
  updateAuthUI();
  if (Auth.isLoggedIn() && typeof Push !== "undefined") {
    Push.startClientReminderChecker();
  }
  try {
    const hasPatternParam = new URLSearchParams(window.location.search).get("pattern");
    const restoredSession = !hasPatternParam && restoreSession();

    await loadPatterns();

    if (restoredSession) applySessionUI();

    if (Auth.isLoggedIn()) {
      await loadProgress();
    }

    if (!hasPatternParam) {
      await loadProblems();
    }

    updateUnlockState();
    refreshPatternCounts();
    if (state.problems.length) renderProblems();
    selectPatternFromUrl();
    updateContinueSession();
    await loadTonightsProblem();
  } catch (err) {
    $("#problemsContainer").innerHTML = `<div class="empty-state">Failed to load: ${escapeHtml(err.message)}</div>`;
  }
}

init();
