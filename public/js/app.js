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
  consistencyStats: null,
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

function getCompletedDates() {
  return state.progressEntries.map((e) => e.completedAt || e.updatedAt).filter(Boolean);
}

function updateHomeProgressSnippet() {
  const el = $("#homeProgressSnippet");
  if (!el || !Auth.isLoggedIn()) return;

  const dates = getCompletedDates();
  const stats = state.consistencyStats;
  const streak = stats?.streak ?? Insights.computeStreak(dates);
  el.textContent = Insights.formatConsistencySnippet(dates, streak, {
    activeDaysThisMonth: stats?.activeDaysThisMonth,
    completedToday: stats?.completedToday,
  });
}

async function refreshConsistencyStats() {
  if (!Auth.isLoggedIn()) return;
  try {
    const { data } = await api("/api/v1/progress/stats");
    state.consistencyStats = data;
    updateHomeProgressSnippet();
  } catch {
    /* keep client-side fallback */
  }
}

async function loadTonightsProblem() {
  if (typeof Focus === "undefined") return null;

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
    if (result?.patternSlug) {
      try {
        localStorage.setItem("afterhours_tonight_slug", result.patternSlug);
      } catch {
        /* ignore */
      }
    }
    const dates = getCompletedDates();
    Focus.renderTodayCard({
      completedDates: dates,
      tonightResult: result,
      tonightIds: TONIGHT_IDS,
    });
    if (!Insights.completedToday(dates)) {
      Focus.renderTonightsProblem(result, TONIGHT_IDS);
    }
    if (typeof Analytics !== "undefined") {
      Analytics.track("tonight_problem_view", { pattern: result?.patternSlug || "" });
    }
    return result;
  } catch {
    const panel = $("#tonightsProblem");
    if (panel) panel.hidden = true;
    return null;
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
    el.textContent = `${done} solved`;
  } else {
    el.textContent = `${Unlocks.TOTAL_PROBLEMS} problems`;
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
    const [{ data }, { data: stats }] = await Promise.all([
      api("/api/v1/progress?status=done"),
      api("/api/v1/progress/stats"),
    ]);
    state.consistencyStats = stats;
    state.progressMap.clear();
    state.patternDone = {};
    state.progressEntries = data;

    data.forEach((entry) => {
      const problem = entry.problemId;
      if (!problem) return;
      const problemId = problem._id;
      state.progressMap.set(problemId, { id: entry._id, status: entry.status, notes: entry.notes || "" });

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
      countEl.textContent = Auth.isLoggedIn() ? `${done} solved` : `${Unlocks.TOTAL_PROBLEMS} problems`;
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
          <td class="col-title">
            <span>${escapeHtml(p.title)}</span>
            ${isDone && progress?.id ? `<button type="button" class="notes-btn" data-progress-id="${progress.id}" data-problem-id="${p._id}" title="Add notes">📝</button>` : ""}
            ${locked ? `<span class="lock-hint">${escapeHtml(lockReason)}</span>` : ""}
          </td>
          <td class="col-difficulty"><span class="badge ${difficultyClass(p.difficulty)}">${p.difficulty}</span></td>
          <td class="col-pattern">
            <span>${escapeHtml(p.patternId?.name || "—")}</span>
            ${p.patternId?.slug ? `<button type="button" class="pattern-info-btn table-info-btn" data-slug="${p.patternId.slug}" aria-label="About ${escapeHtml(p.patternId.name)}" title="Pattern guide">i</button>` : ""}
          </td>
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

  container.querySelectorAll(".notes-btn").forEach((btn) => {
    btn.addEventListener("click", () => openNotesModal(btn.dataset.progressId, btn.dataset.problemId));
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
      state.progressMap.set(problemId, { id: data._id, status: "done", notes: data.notes || "" });

      const problem = state.problems.find((p) => p._id === problemId);
      if (problem) {
        state.progressEntries.unshift({
          _id: data._id,
          problemId: problem,
          completedAt: data.completedAt || new Date().toISOString(),
          status: "done",
          reviewAt: data.reviewAt,
        });
      }
      const pid = problem?.patternId?._id || problem?.patternId;
      if (pid) state.patternDone[pid] = (state.patternDone[pid] || 0) + 1;

      const newDone = getTotalDone();
      const crossed =
        typeof Milestones !== "undefined" ? Milestones.getNewlyCrossed(prevDone, newDone) : null;

      if (problem?.difficulty && !crossed) {
        Motivation.show({
          difficulty: problem.difficulty,
          problemTitle: problem.title,
          type: "done",
        });
        if (typeof Analytics !== "undefined") {
          Analytics.track("check_in", { difficulty: problem.difficulty });
        }
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
    await refreshConsistencyStats();
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
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("pattern");
  if (!slug) return;
  const btn = document.querySelector(`.pattern-btn[data-slug="${slug}"]`);
  if (btn) btn.click();
}

function openNotesModal(progressId, problemId) {
  const entry = state.progressEntries.find((e) => e._id === progressId);
  const progress = state.progressMap.get(problemId);
  const existing = progress?.notes || entry?.notes || "";

  const modal = document.createElement("div");
  modal.className = "motivation-modal notes-modal";
  modal.innerHTML = `
    <div class="motivation-backdrop" data-notes-close></div>
    <div class="motivation-dialog" role="dialog" aria-modal="true">
      <h3 class="motivation-headline">Problem notes</h3>
      <p class="motivation-message">What clicked, what stuck, what to revisit — quality over checkbox speed.</p>
      <textarea id="notesInput" class="notes-input" rows="4" maxlength="500" placeholder="Edge case I missed, approach that worked…"></textarea>
      <div class="motivation-actions">
        <button type="button" class="btn btn-ghost btn-sm" data-notes-close>Cancel</button>
        <button type="button" class="btn btn-primary btn-sm" id="notesSaveBtn">Save</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  document.body.classList.add("motivation-open");
  modal.querySelector("#notesInput").value = existing;

  const close = () => {
    modal.remove();
    document.body.classList.remove("motivation-open");
  };

  modal.querySelectorAll("[data-notes-close]").forEach((el) => el.addEventListener("click", close));

  modal.querySelector("#notesSaveBtn").addEventListener("click", async () => {
    const notes = modal.querySelector("#notesInput").value.trim();
    try {
      await api(`/api/v1/progress/${progressId}`, {
        method: "PUT",
        body: JSON.stringify({ notes }),
      });
      if (progress) progress.notes = notes;
      if (entry) entry.notes = notes;
      close();
    } catch (err) {
      alert(err.message);
    }
  });
}

function initPatternDrawer() {
  const toggle = $("#patternDrawerToggle");
  const sidebar = $("#patternSidebar");
  const backdrop = $("#patternDrawerBackdrop");
  if (!toggle || !sidebar) return;

  const setOpen = (open) => {
    sidebar.classList.toggle("sidebar-open", open);
    if (backdrop) backdrop.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("pattern-drawer-open", open);
  };

  toggle.addEventListener("click", () => setOpen(!sidebar.classList.contains("sidebar-open")));
  backdrop?.addEventListener("click", () => setOpen(false));
}

function initPwaInstall() {
  const banner = $("#pwaInstallBanner");
  const installBtn = $("#pwaInstallBtn");
  const dismissBtn = $("#pwaInstallDismiss");
  if (!banner) return;

  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    try {
      if (localStorage.getItem("afterhours_pwa_dismissed")) return;
    } catch {
      /* ignore */
    }
    banner.hidden = false;
  });

  installBtn?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.hidden = true;
  });

  dismissBtn?.addEventListener("click", () => {
    banner.hidden = true;
    try {
      localStorage.setItem("afterhours_pwa_dismissed", "1");
    } catch {
      /* ignore */
    }
  });
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
  if (typeof DailyQuote !== "undefined") DailyQuote.render();
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
    if (typeof Onboarding !== "undefined") Onboarding.init();
    initPatternDrawer();
    initPwaInstall();
  } catch (err) {
    $("#problemsContainer").innerHTML = `<div class="empty-state">Failed to load: ${escapeHtml(err.message)}</div>`;
  }
}

init();
