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

function donutChart(segments, options = {}) {
  const size = options.size || 140;
  const stroke = options.stroke || 14;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const centerLabel = options.centerLabel ?? "";
  const centerSub = options.centerSub ?? "";

  if (!total) {
    return `
      <div class="chart-donut" style="--chart-size: ${size}px">
        <svg viewBox="0 0 ${size} ${size}" class="chart-donut-svg" aria-hidden="true">
          <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" class="chart-donut-track" stroke-width="${stroke}" />
        </svg>
        <div class="chart-donut-center">
          <span class="chart-donut-value">${escapeHtml(String(centerLabel))}</span>
          ${centerSub ? `<span class="chart-donut-sub">${escapeHtml(centerSub)}</span>` : ""}
        </div>
      </div>`;
  }

  let accumulated = 0;
  const arcs = segments
    .filter((seg) => seg.value > 0)
    .map((seg) => {
      const fraction = seg.value / total;
      const dash = fraction * circumference;
      const dashOffset = -accumulated * circumference;
      accumulated += fraction;
      const linecap = segments.length > 1 ? "butt" : "round";
      return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" class="chart-donut-seg ${seg.className}" stroke-width="${stroke}" stroke-linecap="${linecap}" stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${dashOffset}" />`;
    })
    .join("");

  return `
    <div class="chart-donut" style="--chart-size: ${size}px">
      <svg viewBox="0 0 ${size} ${size}" class="chart-donut-svg" aria-hidden="true">
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" class="chart-donut-track" stroke-width="${stroke}" />
        ${arcs}
      </svg>
      <div class="chart-donut-center">
        <span class="chart-donut-value">${escapeHtml(String(centerLabel))}</span>
        ${centerSub ? `<span class="chart-donut-sub">${escapeHtml(centerSub)}</span>` : ""}
      </div>
    </div>`;
}

function chartLegend(items) {
  return `
    <ul class="chart-legend">
      ${items
        .map(
          (item) => `
        <li class="chart-legend-item">
          <span class="chart-legend-swatch ${item.className}"></span>
          <span class="chart-legend-label">${escapeHtml(item.label)}</span>
          <span class="chart-legend-value">${item.value}</span>
        </li>`,
        )
        .join("")}
    </ul>`;
}

function activityChart(completedDates, days = 14) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({ time: d.getTime(), count: 0, label: d.toLocaleDateString(undefined, { weekday: "narrow" }) });
  }

  for (const dateStr of completedDates) {
    if (!dateStr) continue;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const bucket = buckets.find((b) => b.time === d.getTime());
    if (bucket) bucket.count += 1;
  }

  const max = Math.max(...buckets.map((b) => b.count), 1);
  const bars = buckets
    .map((b) => {
      const height = b.count ? Math.max(12, Math.round((b.count / max) * 100)) : 4;
      const title = `${b.count} solved`;
      return `
        <div class="activity-bar-col" title="${title}">
          <span class="activity-bar-count">${b.count || ""}</span>
          <div class="activity-bar" style="height: ${height}%">
            <div class="activity-bar-fill${b.count ? "" : " activity-bar-empty"}"></div>
          </div>
          <span class="activity-bar-label">${b.label}</span>
        </div>`;
    })
    .join("");

  const weekTotal = buckets.reduce((sum, b) => sum + b.count, 0);

  return `
    <div class="activity-chart">
      <div class="activity-bars">${bars}</div>
      <p class="chart-caption">${weekTotal} problem${weekTotal === 1 ? "" : "s"} in the last ${days} days</p>
    </div>`;
}

function patternStackedBar(patterns, patternDone) {
  const segments = patterns
    .map((p) => ({ name: p.name, value: patternDone[p._id] || 0 }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (!total) {
    return `<div class="stacked-bar stacked-bar-empty"><span>No pattern data yet</span></div>`;
  }

  const palette = ["seg-1", "seg-2", "seg-3", "seg-4", "seg-5", "seg-6", "seg-7", "seg-8"];
  const chunks = segments
    .map((seg, i) => {
      const width = (seg.value / total) * 100;
      return `<div class="stacked-bar-seg ${palette[i % palette.length]}" style="width: ${width}%" title="${escapeHtml(seg.name)}: ${seg.value}"></div>`;
    })
    .join("");

  const legend = segments
    .slice(0, 6)
    .map((seg, i) => {
      const width = (seg.value / total) * 100;
      return `
        <div class="stacked-legend-item">
          <span class="stacked-legend-swatch ${palette[i % palette.length]}"></span>
          <span class="stacked-legend-name">${escapeHtml(seg.name)}</span>
          <span class="stacked-legend-pct">${Math.round(width)}%</span>
        </div>`;
    })
    .join("");

  return `
    <div class="stacked-bar-wrap">
      <div class="stacked-bar" role="img" aria-label="Pattern distribution">${chunks}</div>
      <div class="stacked-legend">${legend}</div>
    </div>`;
}

async function loadFocusPanels(patterns, patternDone) {
  const unlockState = Unlocks.getClientState(patternDone, patterns);

  Focus.renderContinue(
    document.getElementById("continueSession"),
    document.getElementById("continueSessionDetail"),
    patterns,
  );

  Focus.renderUnlockBanners(unlockState, "unlockBanners");
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

    const patternTotals = Insights.patternTotalsFromList(patterns);
    const completedDates = progressEntries.map((e) => e.completedAt || e.updatedAt);
    const streak = Insights.computeStreak(completedDates);
    const weakest = Insights.getWeakestPattern(patterns, patternDone, patternTotals);
    const insight = Insights.getInsightMessage(stats, streak);
    const nextUp = Insights.getNextUpSuggestion(weakest);

    await loadFocusPanels(patterns, patternDone);

    if (typeof Milestones !== "undefined") {
      Milestones.update(totalDone);
    }

    const patternBars = patterns
      .map((p) => {
        const done = patternDone[p._id] || 0;
        const total = patternTotals[p._id] || Unlocks.PROBLEMS_PER_PATTERN;
        return barRow(p.name, done, total);
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

    const difficultySegments = [
      { value: byDifficulty.Easy || 0, className: "chart-seg-easy", label: "Easy" },
      { value: byDifficulty.Medium || 0, className: "chart-seg-medium", label: "Medium" },
      { value: byDifficulty.Hard || 0, className: "chart-seg-hard", label: "Hard" },
    ];
    const difficultyTotal = difficultySegments.reduce((sum, s) => sum + s.value, 0);

    container.innerHTML = `
      <div class="progress-hero panel">
        <div class="progress-hero-visual">
          ${donutChart([{ value: totalDone, className: "chart-seg-accent" }, { value: Math.max(Insights.TOTAL_PROBLEMS - totalDone, 0), className: "chart-seg-muted" }], {
            size: 160,
            stroke: 16,
            centerLabel: `${overallPct}%`,
            centerSub: "complete",
          })}
        </div>
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

      <div class="charts-grid">
        <div class="stats-card panel chart-card">
          <h3>Activity · last 14 days</h3>
          ${activityChart(completedDates, 14)}
        </div>
        <div class="stats-card panel chart-card">
          <h3>Difficulty mix</h3>
          <div class="chart-card-body chart-card-donut">
            ${donutChart(difficultySegments, {
              size: 130,
              stroke: 14,
              centerLabel: difficultyTotal,
              centerSub: "solved",
            })}
            ${chartLegend(
              difficultySegments.map((seg) => ({
                className: seg.className.replace("chart-seg-", "chart-legend-"),
                label: seg.label,
                value: seg.value,
              })),
            )}
          </div>
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
        <div class="pattern-chart-intro">
          ${patternStackedBar(patterns, patternDone)}
        </div>
        <div class="pattern-bars">${patternBars}</div>
      </div>`;

    if (typeof Milestones !== "undefined") {
      Milestones.update(totalDone);
    }
  } catch (err) {
    container.innerHTML = `<div class="empty-state panel">Failed to load progress: ${escapeHtml(err.message)}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await Nav.init();
  if (!Nav.requireAuth()) return;
  await Push.initSettingsPanel();
  loadDashboard();
});
