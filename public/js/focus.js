const Focus = (() => {
  const SESSION_KEY = "afterhours_home_session";

  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function buildSummary(saved, patterns = []) {
    if (!saved) return null;

    const parts = [];
    if (saved.patternSlug) {
      const pattern = patterns.find((p) => p.slug === saved.patternSlug);
      parts.push(pattern?.name || "Pattern");
    }
    if (saved.difficulty) parts.push(saved.difficulty);
    if (saved.search) parts.push(`"${saved.search}"`);
    if (saved.page > 1) parts.push(`Page ${saved.page}`);

    if (!parts.length) return null;
    return { parts, label: parts.join(" · "), saved };
  }

  function sessionSummary(patterns = []) {
    return buildSummary(readSession(), patterns);
  }

  function sessionSummaryFromState(state, patterns = []) {
    if (!state) return null;
    return buildSummary(
      {
        patternSlug: state.patternSlug || "",
        difficulty: state.difficulty || "",
        search: state.search || "",
        page: state.page > 0 ? state.page : 1,
      },
      patterns,
    );
  }

  function renderContinue(panel, detailEl, patterns, state) {
    if (!panel || !detailEl) return false;

    const summary = state ? sessionSummaryFromState(state, patterns) : sessionSummary(patterns);
    if (!summary) {
      panel.hidden = true;
      return false;
    }

    detailEl.textContent = summary.label;
    panel.hidden = false;
    return true;
  }

  function patternOrderForTonight(patterns, patternDone, patternTotals, tonightShuffle = 0) {
    const weakest = Insights.getWeakestPattern(patterns, patternDone, patternTotals);
    const ids = patterns.map((p) => p._id);
    if (!weakest) return ids;

    const rest = ids.filter((id) => id !== weakest.pattern._id);
    if (tonightShuffle > 0) {
      const offset = tonightShuffle % (rest.length + 1);
      const rotated = [...rest.slice(offset), ...rest.slice(0, offset)];
      return [weakest.pattern._id, ...rotated];
    }
    return [weakest.pattern._id, ...rest];
  }

  async function fetchTonightsProblem({
    patterns,
    patternDone,
    patternTotals,
    progressMap,
    unlockState,
    tonightShuffle = 0,
    apiFn,
  }) {
    if (!patterns.length) return null;

    const unlock = unlockState || Unlocks.getClientState(patternDone, patterns);
    const api = apiFn || ((path) => Auth.api(path));

    if (Auth.isLoggedIn()) {
      for (const pid of patternOrderForTonight(patterns, patternDone, patternTotals, tonightShuffle)) {
        const pattern = patterns.find((p) => p._id === pid);
        if (!pattern) continue;
        if (Unlocks.isAdvancedPattern(pattern) && !unlock.advancedPatternsUnlocked) continue;

        const { data } = await api(`/api/v1/problems?patternId=${pid}&limit=50`);
        const open = data.filter(
          (p) => !progressMap.has(p._id) && !Unlocks.isProblemLocked(p, unlock),
        );
        if (!open.length) continue;

        const weakest = Insights.getWeakestPattern(patterns, patternDone, patternTotals);
        const pick =
          tonightShuffle > 0 ? open[Math.floor(Math.random() * open.length)] : open[0];
        const done = patternDone[pid] || 0;
        const total = patternTotals[pid] || Unlocks.PROBLEMS_PER_PATTERN;

        return {
          problem: pick,
          patternSlug: pattern.slug,
          reason:
            weakest && pid === weakest.pattern._id
              ? `Weakest pattern · ${done}/${total} done`
              : `Next up · ${pattern.name}`,
        };
      }
    }

    const page = (tonightShuffle % 4) + 1;
    const { data } = await api(`/api/v1/problems?difficulty=Easy&limit=50&page=${page}`);
    const open = data.filter((p) => !Unlocks.isProblemLocked(p, unlock));
    if (!open.length) return null;

    const pick = open[Math.floor(Math.random() * open.length)];
    return {
      problem: pick,
      patternSlug: pick.patternId?.slug || "",
      reason: Auth.isLoggedIn()
        ? "Warm-up pick — patterns may be complete"
        : "Warm-up pick · sign in to personalize",
    };
  }

  function renderTonightsProblem(result, ids) {
    const panel = document.getElementById(ids.panel);
    if (!panel) return;

    if (!result?.problem) {
      panel.hidden = true;
      return;
    }

    const { problem, reason } = result;
    const patternName = problem.patternId?.name || "—";
    const url = problem.leetcodeLink || problem.practiceLink;
    const source = problem.source || (problem.leetcodeLink ? "LeetCode" : "Practice");

    const reasonEl = document.getElementById(ids.reason);
    const titleEl = document.getElementById(ids.title);
    const metaEl = document.getElementById(ids.meta);
    const linkEl = document.getElementById(ids.link);

    if (reasonEl) reasonEl.textContent = reason;
    if (titleEl) titleEl.textContent = problem.title;
    if (metaEl) metaEl.textContent = `${problem.difficulty} · ${patternName}`;

    if (linkEl) {
      if (url) {
        linkEl.href = url;
        linkEl.textContent = `Open on ${source} ↗`;
        linkEl.hidden = false;
      } else {
        linkEl.hidden = true;
      }
    }

    panel.hidden = false;
    return result;
  }

  function tonightDeepLink(result) {
    if (!result?.patternSlug) return "/";
    return `/?pattern=${encodeURIComponent(result.patternSlug)}&tonight=1`;
  }

  function renderTodayCard({ completedDates = [], tonightResult = null, tonightIds = null } = {}) {
    const card = document.getElementById("todayCard");
    if (!card) return;

    const streak = Insights.computeStreak(completedDates);
    const todayDone = Insights.completedToday(completedDates);
    const statusEl = document.getElementById("todayStatus");
    const bodyEl = document.getElementById("todayBody");

    if (todayDone) {
      if (statusEl) {
        statusEl.textContent = "Today's win logged";
        statusEl.className = "today-status today-status-done";
      }
      if (bodyEl) {
        bodyEl.innerHTML = `
          <p class="today-done-msg">${streak}-day streak · you showed up today. Same time tomorrow.</p>`;
      }
      card.hidden = false;
      const tonightPanel = tonightIds?.panel ? document.getElementById(tonightIds.panel) : null;
      if (tonightPanel) tonightPanel.hidden = true;
      return;
    }

    if (statusEl) {
      statusEl.textContent = "Tonight's one problem";
      statusEl.className = "today-status";
    }
    if (bodyEl) {
      bodyEl.innerHTML = `<p class="today-hint">One quality rep after work — mark done when you finish.</p>`;
    }
    card.hidden = false;

    if (tonightResult && tonightIds) {
      renderTonightsProblem(tonightResult, tonightIds);
    }
  }

  function renderUnlockBanners(unlockState, wrapId = "unlockBanners") {
    const wrap = document.getElementById(wrapId);
    if (!wrap || !unlockState) return;

    if (!Auth.isLoggedIn()) {
      wrap.hidden = true;
      wrap.innerHTML = "";
      return;
    }

    const u = unlockState;
    const parts = [];

    if (!u.hardUnlocked) {
      const left = u.hardUnlockRequired - u.totalDone;
      parts.push(
        `<div class="unlock-banner"><span class="lock-icon" aria-hidden="true">🔒</span> Hard problems unlock after ${u.hardUnlockRequired} solves — <strong>${left} to go</strong></div>`,
      );
    }
    if (!u.advancedPatternsUnlocked) {
      const left = u.advancedPatternsRequired - u.firstTierDone;
      parts.push(
        `<div class="unlock-banner"><span class="lock-icon" aria-hidden="true">🔒</span> Patterns 11–20 unlock after ${u.advancedPatternsRequired} in tier 1 — <strong>${left} more in patterns 1–10</strong></div>`,
      );
    }

    wrap.innerHTML = parts.join("");
    wrap.hidden = parts.length === 0;
  }

  return {
    SESSION_KEY,
    readSession,
    buildSummary,
    sessionSummary,
    sessionSummaryFromState,
    renderContinue,
    fetchTonightsProblem,
    renderTonightsProblem,
    renderTodayCard,
    tonightDeepLink,
    renderUnlockBanners,
  };
})();
