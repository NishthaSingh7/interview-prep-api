const NOTES_CHAR_LIMIT = 2000;
const STARS_KEY = "afterhours_starred";

const state = {
  patterns: [],
  structures: [],
  structureCatalogTotal: 0,
  sidebarMode: "patterns",
  problems: [],
  page: 1,
  pages: 1,
  total: 0,
  limit: 50,
  difficulty: "",
  statusFilter: "",
  patternId: "",
  patternSlug: "",
  structureSlug: "",
  search: "",
  progressMap: new Map(),
  patternTotals: {},
  patternDone: {},
  structureDone: {},
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

  const overview = $("#sidebarProgressOverview");
  if (overview) overview.hidden = !loggedIn;

  Nav.updateAuthNav();
  Nav.bindLogout({
    onLogout: () => {
      state.progressMap.clear();
      state.patternDone = {};
      updateHomeProgressSnippet();
    },
  });
  const statusFilters = $("#statusFilters");
  if (statusFilters) statusFilters.hidden = !loggedIn;
  updateHomeProgressSnippet();
}

function formatSidebarCount(done, total) {
  if (!Auth.isLoggedIn()) return String(total);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `${done}/${total} · ${pct}%`;
}

function countUniqueStructureSolves() {
  const allTags = new Set(state.structures.flatMap((s) => s.tags));
  const ids = new Set();
  for (const entry of state.progressEntries) {
    const tags = entry.problemId?.tags || [];
    if (tags.some((tag) => allTags.has(tag))) {
      ids.add(String(entry.problemId?._id || entry.problemId));
    }
  }
  return ids.size;
}

function recomputeStructureDone() {
  state.structureDone = {};
  for (const structure of state.structures) {
    state.structureDone[structure.slug] = 0;
  }
  for (const entry of state.progressEntries) {
    const tags = entry.problemId?.tags || [];
    for (const structure of state.structures) {
      if (structure.tags.some((tag) => tags.includes(tag))) {
        state.structureDone[structure.slug] = (state.structureDone[structure.slug] || 0) + 1;
      }
    }
  }
}

function getCatalogTotal() {
  return Unlocks.catalogTotal(state.patterns, state.patternTotals);
}

function updateSidebarOverview() {
  const overview = $("#sidebarProgressOverview");
  if (!overview) return;
  overview.hidden = !Auth.isLoggedIn();
  if (!Auth.isLoggedIn()) return;

  const title = $("#sidebarProgressTitle");
  const pctEl = $("#sidebarProgressPct");
  const fill = $("#sidebarProgressFill");
  const meta = $("#sidebarProgressMeta");
  if (!title || !pctEl || !fill || !meta) return;

  if (state.sidebarMode === "patterns") {
    const done = getTotalDone();
    const total = getCatalogTotal();
    const pct = total ? Math.round((done / total) * 100) : 0;
    title.textContent = "Coding patterns";
    pctEl.textContent = `${pct}%`;
    fill.style.width = `${pct}%`;
    meta.textContent = `${done} of ${total} problems completed`;
    return;
  }

  const done = countUniqueStructureSolves();
  const total = state.structureCatalogTotal || 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  title.textContent = "Data structures";
  pctEl.textContent = `${pct}%`;
  fill.style.width = `${pct}%`;
  meta.textContent = `${done} of ${total} problems completed`;
}

function persistSession() {
  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        sidebarMode: state.sidebarMode,
        patternId: state.patternId,
        patternSlug: state.patternSlug,
        structureSlug: state.structureSlug,
        difficulty: state.difficulty,
        statusFilter: state.statusFilter,
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
    null,
    $("#todayContinueLink"),
    state.patterns,
    state,
  );
}

function restoreSession() {
  if (new URLSearchParams(window.location.search).get("pattern")) return false;
  if (new URLSearchParams(window.location.search).get("structure")) return false;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    state.sidebarMode = saved.sidebarMode === "structures" ? "structures" : "patterns";
    state.patternId = saved.patternId || "";
    state.patternSlug = saved.patternSlug || "";
    state.structureSlug = saved.structureSlug || "";
    state.difficulty = saved.difficulty || "";
    state.statusFilter = saved.statusFilter || "";
    state.search = saved.search || "";
    state.page = saved.page > 0 ? saved.page : 1;
    return true;
  } catch {
    return false;
  }
}

function reconcileSessionFilters() {
  let changed = false;
  const patternBySlug = state.patternSlug
    ? state.patterns.find((p) => p.slug === state.patternSlug)
    : null;

  if (state.patternId) {
    const patternById = state.patterns.find((p) => p._id === state.patternId);
    if (!patternById) {
      if (patternBySlug) {
        state.patternId = patternBySlug._id;
      } else {
        state.patternId = "";
        state.patternSlug = "";
      }
      changed = true;
    } else if (state.patternSlug && patternById.slug !== state.patternSlug) {
      state.patternSlug = patternById.slug;
      changed = true;
    }
  } else if (patternBySlug) {
    state.patternId = patternBySlug._id;
    changed = true;
  }

  if (state.structureSlug && !state.structures.some((s) => s.slug === state.structureSlug)) {
    state.structureSlug = "";
    if (state.sidebarMode === "structures") state.sidebarMode = "patterns";
    changed = true;
  }

  if (changed) persistSession();
}

function applySessionUI() {
  const searchInput = $("#searchInput");
  if (searchInput) searchInput.value = state.search;

  $$("#difficultyFilters .filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.difficulty === state.difficulty);
  });

  $$("#statusFilters .filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.status === state.statusFilter);
  });

  setSidebarMode(state.sidebarMode, { skipLoad: true });

  $$(".pattern-btn").forEach((btn) => btn.classList.remove("active"));

  if (state.sidebarMode === "structures" && state.structureSlug) {
    const btn = document.querySelector(
      `.pattern-btn[data-structure="${CSS.escape(state.structureSlug)}"]`,
    );
    if (btn) {
      btn.classList.add("active");
      state.patternId = "";
      state.patternSlug = "";
      return;
    }
    state.structureSlug = "";
  }

  if (state.sidebarMode === "patterns" && state.patternSlug) {
    const btn = document.querySelector(`.pattern-btn[data-slug="${CSS.escape(state.patternSlug)}"]`);
    if (btn && !btn.disabled) {
      btn.classList.add("active");
      state.patternId = btn.dataset.id || "";
      return;
    }
    state.patternId = "";
    state.patternSlug = "";
  } else if (state.sidebarMode === "patterns" && state.patternId) {
    const pattern = state.patterns.find((p) => p._id === state.patternId);
    if (pattern) {
      state.patternSlug = pattern.slug || "";
      const btn = document.querySelector(`.pattern-btn[data-slug="${CSS.escape(state.patternSlug)}"]`);
      if (btn && !btn.disabled) {
        btn.classList.add("active");
        return;
      }
    }
    state.patternId = "";
    state.patternSlug = "";
  }

  const allBtn = document.querySelector('.pattern-btn[data-slug=""][data-structure=""]');
  if (allBtn) allBtn.classList.add("active");
  state.patternId = "";
  state.patternSlug = "";
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
    if (!Insights.completedToday(dates) && !Focus.isSolvePage()) {
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

async function loadStructureStats() {
  try {
    const { data, catalogTotal } = await api("/api/v1/problems/structure-stats");
    state.structures = data || [];
    state.structureCatalogTotal = catalogTotal || 0;
    recomputeStructureDone();
  } catch {
    state.structures = [];
    state.structureCatalogTotal = 0;
  }
}

function renderPatternSidebarList() {
  const list = $("#patternList");
  if (!list) return;

  list.innerHTML = `
    <li>
      <button class="pattern-btn${!state.patternId && !state.structureSlug ? " active" : ""}" data-id="" data-slug="" data-structure="">
        <span class="pattern-name">All Patterns</span>
        <span class="pattern-count" id="allPatternCount"></span>
      </button>
    </li>`;

  state.patterns.forEach((p) => {
    const li = document.createElement("li");
    li.className = "pattern-item";
    const done = state.patternDone[p._id] || 0;
    const total = state.patternTotals[p._id] || Unlocks.PROBLEMS_PER_PATTERN;
    const active = state.patternId === p._id;
    li.innerHTML = `
      <button class="pattern-btn${active ? " active" : ""}" data-id="${p._id}" data-slug="${p.slug}" data-structure="">
        <span class="pattern-name">${escapeHtml(p.name)}</span>
        <span class="pattern-count">${formatSidebarCount(done, total)}</span>
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
  refreshPatternLocks();
}

function renderStructureSidebarList() {
  const list = $("#patternList");
  if (!list) return;

  list.innerHTML = `
    <li>
      <button class="pattern-btn${!state.structureSlug ? " active" : ""}" data-id="" data-slug="" data-structure="">
        <span class="pattern-name">All Data Structures</span>
        <span class="pattern-count" id="allPatternCount"></span>
      </button>
    </li>`;

  state.structures.forEach((structure) => {
    const li = document.createElement("li");
    li.className = "pattern-item pattern-item-structure";
    const done = state.structureDone[structure.slug] || 0;
    const total = structure.total || 0;
    const active = state.structureSlug === structure.slug;
    li.innerHTML = `
      <button class="pattern-btn${active ? " active" : ""}" data-id="" data-slug="" data-structure="${structure.slug}">
        <span class="pattern-name">${escapeHtml(structure.name)}</span>
        <span class="pattern-count">${formatSidebarCount(done, total)}</span>
      </button>`;
    list.appendChild(li);
  });

  updateAllStructureCount();
}

function setSidebarMode(mode, options = {}) {
  state.sidebarMode = mode === "structures" ? "structures" : "patterns";

  $$(".sidebar-mode-btn").forEach((btn) => {
    const active = btn.dataset.sidebarMode === state.sidebarMode;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  const title = $("#sidebarTitle");
  const badge = $("#sidebarBadge");
  if (title) title.textContent = state.sidebarMode === "structures" ? "Data Structures" : "Patterns";
  if (badge) {
    badge.textContent =
      state.sidebarMode === "structures" ? String(state.structures.length) : "20";
  }

  if (state.sidebarMode === "structures") {
    state.patternId = "";
    state.patternSlug = "";
    renderStructureSidebarList();
  } else {
    state.structureSlug = "";
    renderPatternSidebarList();
  }

  updateSidebarOverview();

  if (!options.skipLoad) {
    state.page = 1;
    persistSession();
    loadProblems();
  }
}

async function loadPatterns() {
  const { data } = await api("/api/v1/patterns");
  state.patterns = data;

  for (const p of data) {
    state.patternTotals[p._id] = p.problemCount ?? Unlocks.PROBLEMS_PER_PATTERN;
  }

  if (state.sidebarMode === "patterns") {
    renderPatternSidebarList();
  }
  updateAllPatternCount();
}

function updateAllPatternCount() {
  const el = $("#allPatternCount");
  if (!el) return;
  if (state.sidebarMode === "structures") {
    updateAllStructureCount();
    return;
  }
  if (Auth.isLoggedIn()) {
    const done = getTotalDone();
    const total = getCatalogTotal();
    el.textContent = formatSidebarCount(done, total);
  } else {
    el.textContent = `${getCatalogTotal()} problems`;
  }
}

function updateAllStructureCount() {
  const el = $("#allPatternCount");
  if (!el) return;
  const total = state.structureCatalogTotal || 0;
  if (Auth.isLoggedIn()) {
    el.textContent = formatSidebarCount(countUniqueStructureSolves(), total);
  } else {
    el.textContent = `${total} problems`;
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

    recomputeStructureDone();

    updateProgressUI();
    refreshPatternCounts();
    refreshStructureCounts();
    updateSidebarOverview();
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
  state.unlockState = Unlocks.getClientState(state.patternDone, state.patterns, state.patternTotals);
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
  if (!url) return `<span class="table-icon-muted">—</span>`;
  const source = problem.source || (problem.leetcodeLink ? "LeetCode" : "Practice");
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="table-icon-btn table-icon-btn-practice" aria-label="Open on ${escapeHtml(source)}" title="Open on ${escapeHtml(source)}">${iconExternalLink()}</a>`;
}

function getStarredSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STARS_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveStarredSet(stars) {
  localStorage.setItem(STARS_KEY, JSON.stringify([...stars]));
}

function iconExternalLink() {
  return `<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M11 3h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 12 17 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M15 11v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}

function iconStar(filled = false) {
  if (filled) {
    return `<svg class="star-icon star-icon-filled" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M10 2.5l2.35 4.76 5.25.77-3.8 3.7.9 5.23L10 14.77l-4.7 2.47.9-5.23-3.8-3.7 5.25-.77L10 2.5Z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
    </svg>`;
  }
  return `<svg class="star-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M10 2.5l2.35 4.76 5.25.77-3.8 3.7.9 5.23L10 14.77l-4.7 2.47.9-5.23-3.8-3.7 5.25-.77L10 2.5Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`;
}

function starButtonHtml(problem) {
  const starred = getStarredSet().has(problem._id);
  const cls = starred ? "table-icon-btn star-btn star-btn-on" : "table-icon-btn star-btn";
  const label = starred ? "Remove from starred" : "Star this problem";
  return `<button type="button" class="${cls}" data-star-id="${problem._id}" aria-label="${label}" title="${label}" aria-pressed="${starred}">${iconStar(starred)}</button>`;
}

function difficultyLabelHtml(d) {
  const cls = difficultyClass(d);
  return `<span class="diff-label diff-label-${cls}">${escapeHtml(d)}</span>`;
}
function updateProgressUI(milestonePrevCount) {
  if (!Auth.isLoggedIn()) return;
  updateHomeProgressSnippet();
  updateMilestones(milestonePrevCount);
}

function refreshPatternCounts() {
  if (state.sidebarMode !== "patterns") return;
  $$(".pattern-btn").forEach((btn) => {
    const countEl = btn.querySelector(".pattern-count");
    if (!countEl) return;

    if (!btn.dataset.id && !btn.dataset.structure) {
      updateAllPatternCount();
      return;
    }

    const total = state.patternTotals[btn.dataset.id] || Unlocks.PROBLEMS_PER_PATTERN;
    const done = state.patternDone[btn.dataset.id] || 0;
    countEl.textContent = formatSidebarCount(done, total);
  });
}

function refreshStructureCounts() {
  if (state.sidebarMode !== "structures") return;
  $$(".pattern-btn").forEach((btn) => {
    const countEl = btn.querySelector(".pattern-count");
    if (!countEl) return;

    if (!btn.dataset.structure) {
      updateAllStructureCount();
      return;
    }

    const structure = state.structures.find((s) => s.slug === btn.dataset.structure);
    if (!structure) return;
    const done = state.structureDone[structure.slug] || 0;
    countEl.textContent = formatSidebarCount(done, structure.total);
  });
}

async function loadProblems() {
  const clientStatusFilter = state.statusFilter && Auth.isLoggedIn();
  const params = new URLSearchParams({
    page: clientStatusFilter ? 1 : state.page,
    limit: clientStatusFilter ? 500 : state.limit,
  });
  if (state.difficulty) params.set("difficulty", state.difficulty);
  if (state.patternId) params.set("patternId", state.patternId);
  if (state.structureSlug) params.set("structure", state.structureSlug);
  if (state.search) params.set("search", state.search);

  const { data, total, pages, page } = await api(`/api/v1/problems?${params}`);

  const stalePattern =
    state.patternId && !state.patterns.some((p) => p._id === state.patternId);
  const staleStructure =
    state.structureSlug && !state.structures.some((s) => s.slug === state.structureSlug);
  if (total === 0 && (stalePattern || staleStructure)) {
    if (stalePattern) {
      state.patternId = "";
      state.patternSlug = "";
    }
    if (staleStructure) state.structureSlug = "";
    persistSession();
    return loadProblems();
  }

  let problems = data;
  if (clientStatusFilter) {
    const filtered = data.filter((p) =>
      state.statusFilter === "solved"
        ? state.progressMap.has(p._id)
        : !state.progressMap.has(p._id),
    );
    state.total = filtered.length;
    state.pages = Math.max(1, Math.ceil(filtered.length / state.limit));
    state.page = Math.min(state.page, state.pages);
    const start = (state.page - 1) * state.limit;
    problems = filtered.slice(start, start + state.limit);
  } else {
    state.total = total;
    state.pages = pages;
    state.page = page;
  }

  state.problems = problems;

  if (state.structureSlug) {
    const structure = state.structures.find((s) => s.slug === state.structureSlug);
    $("#viewTitle").textContent = structure?.name || "Data Structures";
  } else if (state.patternId) {
    const pattern = state.patterns.find((p) => p._id === state.patternId);
    $("#viewTitle").textContent = pattern?.name || "Problems";
  } else if (state.sidebarMode === "structures") {
    $("#viewTitle").textContent = "All Data Structures";
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
    const emptyMsg =
      state.statusFilter === "solved"
        ? "No solved problems match these filters."
        : state.statusFilter === "unsolved"
          ? "No unsolved problems match these filters."
          : "No problems found.";
    container.innerHTML = `<div class="empty-state">${emptyMsg}</div>`;
    return;
  }

  const loggedIn = Auth.isLoggedIn();
  const offset = (state.page - 1) * state.limit;

  if (!state.unlockState) {
    state.unlockState = Unlocks.getClientState(state.patternDone, state.patterns, state.patternTotals);
  }

  const starred = getStarredSet();

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
        <tr class="problem-row ${isDone ? "row-done" : ""} ${locked ? "row-locked" : ""} ${starred.has(p._id) ? "row-starred" : ""}" data-id="${p._id}">
          <td class="col-status">${statusCell}</td>
          <td class="col-num">${offset + i + 1}</td>
          <td class="col-title">
            <span class="problem-title-text">${escapeHtml(p.title)}</span>
            ${locked ? `<span class="lock-hint">${escapeHtml(lockReason)}</span>` : ""}
          </td>
          <td class="col-difficulty">${difficultyLabelHtml(p.difficulty)}</td>
          <td class="col-brief">${ProblemDescription.iconButton(p, "table-icon-btn problem-desc-btn")}</td>
          <td class="col-practice">${locked ? `<span class="table-icon-muted" title="${escapeHtml(lockReason)}">—</span>` : link}</td>
          <td class="col-actions">
            <div class="table-actions">${notesButtonHtml(p, isDone, progress, locked)}${starButtonHtml(p)}</div>
          </td>
        </tr>`;
    })
    .join("");

  container.innerHTML = `
    <div class="table-wrap solve-table-wrap">
      <table class="problem-table solve-table">
        <thead>
          <tr>
            <th class="col-status" aria-label="Status"></th>
            <th class="col-num">#</th>
            <th class="col-title">Problem</th>
            <th class="col-difficulty">Difficulty</th>
            <th class="col-brief" aria-label="Brief">Brief</th>
            <th class="col-practice">Practice</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  const byId = new Map(state.problems.map((p) => [p._id, p]));
  ProblemDescription.bindButtons(container, byId);

  container.querySelectorAll(".done-check").forEach((cb) => {
    cb.addEventListener("change", () => toggleProgress(cb));
  });

  container.querySelectorAll(".notes-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openNotesModal(btn.dataset.problemId);
    });
  });

  container.querySelectorAll(".star-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const stars = getStarredSet();
      if (stars.has(btn.dataset.starId)) stars.delete(btn.dataset.starId);
      else stars.add(btn.dataset.starId);
      saveStarredSet(stars);
      renderProblems();
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

        try {
          const pattern = problem.patternId;
          sessionStorage.setItem(
            "afterhours_last_solve",
            JSON.stringify({
              problemId: problem._id,
              title: problem.title,
              difficulty: problem.difficulty,
              patternSlug: pattern?.slug || "",
              patternName: pattern?.name || "",
            }),
          );
        } catch {
          /* ignore */
        }
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
    refreshStructureCounts();
    updateSidebarOverview();
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

    if (state.sidebarMode === "structures") {
      state.structureSlug = patternBtn.dataset.structure || "";
      state.patternId = "";
      state.patternSlug = "";
    } else {
      state.patternId = patternBtn.dataset.id || "";
      state.patternSlug = patternBtn.dataset.slug || "";
      state.structureSlug = "";
    }

    state.page = 1;
    persistSession();
    loadProblems();
  }

  const modeBtn = e.target.closest(".sidebar-mode-btn");
  if (modeBtn) {
    const mode = modeBtn.dataset.sidebarMode;
    if (mode && mode !== state.sidebarMode) {
      setSidebarMode(mode);
    }
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

  const statusBtn = e.target.closest(".filter-btn");
  if (statusBtn?.closest("#statusFilters")) {
    $$("#statusFilters .filter-btn").forEach((b) => b.classList.remove("active"));
    statusBtn.classList.add("active");
    state.statusFilter = statusBtn.dataset.status || "";
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
  const structure = params.get("structure");
  if (structure) {
    setSidebarMode("structures", { skipLoad: true });
    const btn = document.querySelector(`.pattern-btn[data-structure="${CSS.escape(structure)}"]`);
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }

  const slug = params.get("pattern");
  if (!slug) return false;
  setSidebarMode("patterns", { skipLoad: true });
  const btn = document.querySelector(`.pattern-btn[data-slug="${CSS.escape(slug)}"]`);
  if (btn) {
    btn.click();
    return true;
  }
  return false;
}

function notesIconSvg(saved = false) {
  if (saved) {
    return `<svg class="action-icon action-icon-saved" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M6 3.5h6.5L16 7v9.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
      <path d="M11.5 3.5V7H16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
      <path d="M7.25 9.5h5.5M7.25 11.75h5.5M7.25 14h3.5" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
      <path d="M12.5 14.25 14 16l2.75-3" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  return `<svg class="action-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M6 3.5h6.5L16 7v9.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M11.5 3.5V7H16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M7.25 9.5h5.5M7.25 11.75h3.75" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M13.5 12.5 15 14l1.75-2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
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

  return `<button type="button" class="table-icon-btn notes-btn${savedClass}" data-problem-id="${p._id}" data-progress-id="${progress?.id || ""}" data-done="${isDone ? "1" : "0"}" title="${escapeHtml(title)}" aria-label="Notes for ${escapeHtml(p.title)}">${notesIconSvg(hasNotes)}</button>`;
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
    const hasBrowseParam =
      new URLSearchParams(window.location.search).get("pattern") ||
      new URLSearchParams(window.location.search).get("structure");
    const restoredSession = !hasBrowseParam && restoreSession();

    await Promise.all([loadPatterns(), loadStructureStats()]);
    reconcileSessionFilters();

    if (restoredSession) applySessionUI();
    else setSidebarMode(state.sidebarMode, { skipLoad: true });

    if (Auth.isLoggedIn()) {
      await loadProgress();
      if (typeof DailyQuote !== "undefined") {
        DailyQuote.render(undefined, {
          daysSinceLastActive: state.consistencyStats?.daysSinceLastActive,
          streak: state.consistencyStats?.streak,
        });
      }
    }

    if (!hasBrowseParam) {
      await loadProblems();
    }

    updateUnlockState();
    refreshPatternCounts();
    refreshStructureCounts();
    updateSidebarOverview();
    if (state.problems.length) renderProblems();
    const urlFilterApplied = selectPatternFromUrl();
    if (hasBrowseParam && !urlFilterApplied) {
      await loadProblems();
    }
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
