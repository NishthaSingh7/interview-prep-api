const NOTES_CHAR_LIMIT = 2000;

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
    bestStreak: stats?.bestStreak,
  });
  renderHomeHabitBanners(stats);
}

function renderHomeHabitBanners(stats) {
  if (!stats) return;

  let freezeEl = document.getElementById("homeStreakFreeze");
  if (stats.canUseStreakFreeze) {
    if (!freezeEl) {
      const anchor = document.getElementById("homeProgressSnippet")?.parentElement;
      if (!anchor) return;
      freezeEl = document.createElement("div");
      freezeEl.id = "homeStreakFreeze";
      freezeEl.className = "streak-freeze-banner panel";
      anchor.insertAdjacentElement("afterend", freezeEl);
    }
    freezeEl.hidden = false;
    freezeEl.innerHTML = `
      <p><strong>Streak freeze available</strong> — cover yesterday without losing your chain.</p>
      <button type="button" class="btn btn-primary btn-sm" id="homeUseStreakFreezeBtn">Use streak freeze</button>`;
    const btn = freezeEl.querySelector("#homeUseStreakFreezeBtn");
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        try {
          await api("/api/v1/progress/streak-freeze", { method: "POST" });
          await refreshConsistencyStats();
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
        }
      });
    }
  } else if (freezeEl) {
    freezeEl.hidden = true;
  }
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
            ${locked ? `<span class="lock-hint">${escapeHtml(lockReason)}</span>` : ""}
          </td>
          <td class="col-notes">${notesButtonHtml(p, isDone, progress, locked)}</td>
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
            <th class="col-notes">Notes</th>
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
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openNotesModal(btn.dataset.problemId);
    });
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
        await refreshConsistencyStats();
        const ctxQuote =
          typeof DailyQuote !== "undefined"
            ? DailyQuote.getQuoteForContext({
                event: "checkin",
                streak: state.consistencyStats?.streak,
              })
            : null;
        Motivation.show({
          difficulty: problem.difficulty,
          problemTitle: problem.title,
          type: "done",
          contextQuote: ctxQuote,
        });
        if (typeof DailyQuote !== "undefined") {
          DailyQuote.render(document.getElementById("dailyQuote"), {
            event: "checkin",
            streak: state.consistencyStats?.streak,
          });
        }
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

function notesIconSvg(saved = false) {
  if (saved) {
    return `<svg class="notes-icon notes-icon-saved" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
      <path d="M3.5 2.5h6l3 3V13a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
      <path d="M9.5 2.5V6H13" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
      <path d="M5 8.25h6M5 10.25h6M5 12.25h4" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
    </svg>`;
  }
  return `<svg class="notes-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
    <path d="M3.5 2.5h6l3 3V13a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/>
    <path d="M9.5 2.5V6H13" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/>
    <path d="M5 8.5h6M5 10.5h4" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
  </svg>`;
}

function notesButtonHtml(p, isDone, progress, locked) {
  if (!Auth.isLoggedIn()) return '<span class="muted-text">—</span>';
  if (locked) return '<span class="muted-text">—</span>';

  const hasNotes = Boolean(progress?.notes?.trim());
  const title = isDone
    ? hasNotes
      ? "View or edit your notes"
      : "Add tips for next time"
    : "Mark done first to save notes";

  const savedClass = hasNotes ? " notes-btn-saved" : "";

  return `<button type="button" class="notes-btn${savedClass}" data-problem-id="${p._id}" data-progress-id="${progress?.id || ""}" data-done="${isDone ? "1" : "0"}" title="${escapeHtml(title)}" aria-label="Notes for ${escapeHtml(p.title)}">${notesIconSvg(hasNotes)}</button>`;
}

function openNotesModal(problemId) {
  const problem = state.problems.find((p) => p._id === problemId);
  if (!problem) return;

  const progress = state.progressMap.get(problemId);
  const progressId = progress?.id;
  const isDone = state.progressMap.has(problemId);
  const entry = progressId
    ? state.progressEntries.find((e) => e._id === progressId)
    : null;
  const existing = progress?.notes || entry?.notes || "";
  const hasExisting = Boolean(existing.trim());

  const modal = document.createElement("div");
  modal.className = "motivation-modal notes-modal";
  modal.innerHTML = `
    <div class="motivation-backdrop" data-notes-close></div>
    <div class="motivation-dialog" role="dialog" aria-modal="true" aria-labelledby="notesModalTitle">
      <button type="button" class="motivation-close" data-notes-close aria-label="Close">&times;</button>
      <p class="motivation-kicker">your notes</p>
      <h3 class="motivation-headline" id="notesModalTitle">${escapeHtml(problem.title)}</h3>
      <p class="motivation-message" id="notesModalHint"></p>
      <div id="notesViewPanel" class="notes-view-panel" hidden>
        <p class="notes-readout" id="notesDisplay"></p>
      </div>
      <div id="notesEditPanel" class="notes-edit-panel" hidden>
        <textarea id="notesInput" class="notes-input" rows="5" maxlength="${NOTES_CHAR_LIMIT}" placeholder="e.g. Two-pointer from both ends; watch empty array edge case…"></textarea>
        <p class="notes-char-count" id="notesCharCount" aria-live="polite"></p>
      </div>
      <div class="motivation-actions">
        <button type="button" class="btn btn-ghost btn-sm" id="notesCloseBtn">Close</button>
        <button type="button" class="btn btn-ghost btn-sm" id="notesEditBtn" hidden>Edit</button>
        <button type="button" class="btn btn-ghost btn-sm" id="notesCancelEditBtn" hidden>Cancel</button>
        <button type="button" class="btn btn-primary btn-sm" id="notesSaveBtn" hidden>Save notes</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  document.body.classList.add("motivation-open");

  const hintEl = modal.querySelector("#notesModalHint");
  const viewPanel = modal.querySelector("#notesViewPanel");
  const editPanel = modal.querySelector("#notesEditPanel");
  const displayEl = modal.querySelector("#notesDisplay");
  const inputEl = modal.querySelector("#notesInput");
  const closeBtn = modal.querySelector("#notesCloseBtn");
  const editBtn = modal.querySelector("#notesEditBtn");
  const cancelEditBtn = modal.querySelector("#notesCancelEditBtn");
  const saveBtn = modal.querySelector("#notesSaveBtn");
  const charCountEl = modal.querySelector("#notesCharCount");

  inputEl.value = existing;
  displayEl.textContent = existing;

  function updateCharCount() {
    const len = inputEl.value.length;
    charCountEl.textContent = `${len} / ${NOTES_CHAR_LIMIT}`;
  }

  inputEl.addEventListener("input", updateCharCount);

  const close = () => {
    modal.remove();
    document.body.classList.remove("motivation-open");
  };

  modal.querySelectorAll("[data-notes-close]").forEach((el) => el.addEventListener("click", close));
  closeBtn.addEventListener("click", close);

  function setMode(mode) {
    const isView = mode === "view";
    viewPanel.hidden = !isView;
    editPanel.hidden = isView;
    closeBtn.hidden = !isView;
    editBtn.hidden = !isView;
    cancelEditBtn.hidden = isView;
    saveBtn.hidden = isView;

    if (isView) {
      hintEl.textContent = "Your saved notes for this problem.";
      displayEl.textContent = inputEl.value.trim() || existing;
    } else if (!isDone) {
      hintEl.textContent =
        "Check this problem off when you finish solving it, then come back here to save your notes.";
      inputEl.disabled = true;
    } else {
      hintEl.textContent = hasExisting
        ? "Update your tricks, edge cases, or approach."
        : "Tricks, edge cases, or approaches — saved to your account for next time.";
      inputEl.disabled = false;
      updateCharCount();
      inputEl.focus();
    }
  }

  if (!isDone) {
    setMode("edit");
    saveBtn.hidden = true;
    cancelEditBtn.hidden = true;
    closeBtn.hidden = false;
    return;
  }

  if (!progressId) return;

  if (hasExisting) {
    setMode("view");
  } else {
    setMode("edit");
    closeBtn.hidden = true;
  }

  editBtn.addEventListener("click", () => setMode("edit"));

  cancelEditBtn.addEventListener("click", () => {
    if (hasExisting || inputEl.value.trim()) {
      inputEl.value = existing;
      if (hasExisting) {
        setMode("view");
      } else {
        close();
      }
    } else {
      close();
    }
  });

  saveBtn.addEventListener("click", async () => {
    const notes = inputEl.value.trim();
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving…";

    try {
      await api(`/api/v1/progress/${progressId}`, {
        method: "PUT",
        body: JSON.stringify({ notes }),
      });
      if (progress) progress.notes = notes;
      if (entry) entry.notes = notes;
      close();
      renderProblems();
    } catch (err) {
      alert(err.message || "Could not save notes. Try again.");
      saveBtn.disabled = false;
      saveBtn.textContent = "Save notes";
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
      if (typeof DailyQuote !== "undefined") {
        DailyQuote.render(undefined, {
          daysSinceLastActive: state.consistencyStats?.daysSinceLastActive,
          streak: state.consistencyStats?.streak,
        });
      }
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
