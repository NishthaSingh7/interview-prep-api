function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function pct(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

function barRow(label, done, total, colorClass = "") {
  const percent = pct(done, total);
  return `
    <div class="stat-bar-row">
      <div class="stat-bar-meta">
        <span class="stat-bar-label">${escapeHtml(label)}</span>
        <span class="stat-bar-value">${done} / ${total} · ${percent}%</span>
      </div>
      <div class="stat-bar-track">
        <div class="stat-bar-fill ${colorClass}" style="width: ${percent}%"></div>
      </div>
    </div>`;
}

async function loadDashboard() {
  const container = document.getElementById("progressDashboard");
  if (!container) return;

  try {
    const [{ data: stats }, { data: patterns }, { data: progressEntries }, easyRes, mediumRes, hardRes] =
      await Promise.all([
        Auth.api("/api/v1/progress/stats"),
        Auth.api("/api/v1/patterns"),
        Auth.api("/api/v1/progress?status=done"),
        Auth.api("/api/v1/problems?difficulty=Easy&limit=1"),
        Auth.api("/api/v1/problems?difficulty=Medium&limit=1"),
        Auth.api("/api/v1/problems?difficulty=Hard&limit=1"),
      ]);

    const user = Auth.getUser();
    const totalDone = stats.totalCompleted || 0;
    const overallPct = pct(totalDone, Insights.TOTAL_PROBLEMS);
    const byDifficulty = stats.byDifficulty || { Easy: 0, Medium: 0, Hard: 0 };
    const difficultyTotals = {
      Easy: easyRes.total || 0,
      Medium: mediumRes.total || 0,
      Hard: hardRes.total || 0,
    };

    const patternDone = {};
    for (const entry of progressEntries) {
      const problem = entry.problemId;
      if (!problem) continue;
      const pid = problem.patternId?._id || problem.patternId;
      if (pid) patternDone[pid] = (patternDone[pid] || 0) + 1;
    }

    const completedDates = progressEntries.map((e) => e.completedAt || e.updatedAt);
    const streak = Insights.computeStreak(completedDates);
    const weakest = Insights.getWeakestPattern(patterns, patternDone);
    const insight = Insights.getInsightMessage(stats, streak);
    const nextUp = Insights.getNextUpSuggestion(weakest);

    const patternBars = patterns
      .map((p) => {
        const done = patternDone[p._id] || 0;
        return barRow(p.name, done, Unlocks.PROBLEMS_PER_PATTERN);
      })
      .join("");

    const recent = progressEntries.slice(0, 5);
    const recentHtml = recent.length
      ? recent
          .map((entry) => {
            const p = entry.problemId;
            if (!p) return "";
            const date = entry.completedAt
              ? new Date(entry.completedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "—";
            return `
              <li class="recent-item">
                <span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                <span class="recent-title">${escapeHtml(p.title)}</span>
                <span class="recent-date">${date}</span>
              </li>`;
          })
          .join("")
      : '<li class="recent-empty">No problems completed yet — your first win goes here.</li>';

    container.innerHTML = `
      <div class="progress-hero panel">
        <div class="progress-hero-main">
          <p class="progress-greeting">Hey ${escapeHtml(user?.name || "there")}</p>
          <div class="progress-ring-large">
            <strong>${totalDone}</strong>
            <span class="progress-ring-of">of ${Insights.TOTAL_PROBLEMS}</span>
          </div>
          <p class="progress-pct-label">${overallPct}% complete</p>
          <div class="progress-bar-wrap progress-bar-wrap-lg">
            <div class="progress-bar" style="width: ${overallPct}%"></div>
          </div>
        </div>
        <div class="progress-hero-stats">
          <div class="mini-stat">
            <span class="mini-stat-value">${streak}</span>
            <span class="mini-stat-label">day streak</span>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-value">${byDifficulty.Easy || 0}</span>
            <span class="mini-stat-label">easy done</span>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-value">${byDifficulty.Medium || 0}</span>
            <span class="mini-stat-label">medium done</span>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-value">${byDifficulty.Hard || 0}</span>
            <span class="mini-stat-label">hard done</span>
          </div>
        </div>
      </div>

      <div class="insight-grid">
        <div class="insight-card panel">
          <h3>Your insight</h3>
          <p class="insight-text">${escapeHtml(insight)}</p>
        </div>
        <div class="insight-card panel insight-next">
          <h3>Up next</h3>
          <p class="insight-next-title">${escapeHtml(nextUp.title)}</p>
          <p class="insight-text">${escapeHtml(nextUp.detail)}</p>
          <a href="${nextUp.href}" class="btn btn-primary btn-sm">${escapeHtml(nextUp.cta)}</a>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stats-card panel">
          <h3>By difficulty</h3>
          ${barRow("Easy", byDifficulty.Easy || 0, difficultyTotals.Easy, "fill-easy")}
          ${barRow("Medium", byDifficulty.Medium || 0, difficultyTotals.Medium, "fill-medium")}
          ${barRow("Hard", byDifficulty.Hard || 0, difficultyTotals.Hard, "fill-hard")}
        </div>
        <div class="stats-card panel">
          <h3>Recent wins</h3>
          <ul class="recent-list">${recentHtml}</ul>
        </div>
      </div>

      <div class="stats-card panel pattern-breakdown">
        <h3>By pattern</h3>
        <div class="pattern-bars">${patternBars}</div>
      </div>`;
  } catch (err) {
    container.innerHTML = `<div class="empty-state panel">Failed to load progress: ${escapeHtml(err.message)}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Nav.init();
  if (!Nav.requireAuth()) return;
  loadDashboard();
});
