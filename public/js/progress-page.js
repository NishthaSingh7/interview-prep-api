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

function countBarRow(label, done, total, colorClass = "") {
  const width = total ? pct(done, total) : done ? 100 : 0;
  return `
    <div class="stat-bar-row stat-bar-row-counts">
      <div class="stat-bar-meta">
        <span class="stat-bar-label">${escapeHtml(label)}</span>
        <span class="stat-bar-value">${done} solved · ${total} in bank</span>
      </div>
      <div class="stat-bar-track">
        <div class="stat-bar-fill ${colorClass}" style="width: ${width}%"></div>
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
      return `
        <div class="activity-bar-col" title="${b.count} on ${b.label}">
          <span class="activity-bar-count">${b.count || ""}</span>
          <div class="activity-bar" style="height: ${height}%">
            <div class="activity-bar-fill${b.count ? "" : " activity-bar-empty"}"></div>
          </div>
          <span class="activity-bar-label">${b.label}</span>
        </div>`;
    })
    .join("");

  const periodTotal = buckets.reduce((sum, b) => sum + b.count, 0);

  return `
    <div class="activity-chart">
      <div class="activity-bars">${bars}</div>
      <p class="chart-caption">${periodTotal} problem${periodTotal === 1 ? "" : "s"} in the last ${days} days</p>
    </div>`;
}

function consistencyWeekChart(completedDates, days = 14) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daySet = Insights.uniqueDayKeys(completedDates);

  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({
      time: d.getTime(),
      active: daySet.has(d.getTime()),
      label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
    });
  }

  const bars = buckets
    .map((b) => {
      const height = b.active ? 100 : 8;
      return `
        <div class="activity-bar-col" title="${b.active ? "Showed up" : "No activity"}">
          <span class="activity-bar-count">${b.active ? "✓" : ""}</span>
          <div class="activity-bar" style="height: ${height}%">
            <div class="activity-bar-fill${b.active ? "" : " activity-bar-empty"}"></div>
          </div>
          <span class="activity-bar-label">${b.label}</span>
        </div>`;
    })
    .join("");

  const activeCount = buckets.filter((b) => b.active).length;

  return `
    <div class="activity-chart">
      <div class="activity-bars">${bars}</div>
      <p class="chart-caption">${activeCount} active day${activeCount === 1 ? "" : "s"} in the last ${days} days</p>
    </div>`;
}

function weeklyActiveDaysChart(completedDates, weekCount = 8) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daySet = Insights.uniqueDayKeys(completedDates);

  const buckets = [];
  for (let i = weekCount - 1; i >= 0; i--) {
    const end = new Date(today);
    end.setDate(end.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    let active = 0;
    for (const key of daySet) {
      if (key >= start.getTime() && key <= end.getTime()) active++;
    }

    buckets.push({
      active,
      label: end.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    });
  }

  const max = Math.max(...buckets.map((b) => b.active), 1);
  const bars = buckets
    .map((b) => {
      const height = b.active ? Math.max(12, Math.round((b.active / max) * 100)) : 8;
      return `
        <div class="activity-bar-col" title="${b.active} active day${b.active === 1 ? "" : "s"}">
          <span class="activity-bar-count">${b.active || ""}</span>
          <div class="activity-bar" style="height: ${height}%">
            <div class="activity-bar-fill${b.active ? "" : " activity-bar-empty"}"></div>
          </div>
          <span class="activity-bar-label">${b.label}</span>
        </div>`;
    })
    .join("");

  return `
    <div class="activity-chart">
      <div class="activity-bars">${bars}</div>
      <p class="chart-caption">Active days per week — consistency over volume</p>
    </div>`;
}

function weekSolveCount(completedDates) {
  const weekAgo = Date.now() - 7 * 86400000;
  return completedDates.filter((d) => d && new Date(d).getTime() >= weekAgo).length;
}

function cumulativeLineChart(completedDates, weekCount = 10) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = [];
  for (let i = weekCount - 1; i >= 0; i--) {
    const end = new Date(today);
    end.setDate(end.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    buckets.push({
      start,
      end,
      count: 0,
      label: end.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    });
  }

  let baseline = 0;
  for (const dateStr of completedDates) {
    if (!dateStr) continue;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    if (d < buckets[0].start) baseline++;
  }

  for (const dateStr of completedDates) {
    if (!dateStr) continue;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    for (const b of buckets) {
      if (d >= b.start && d <= b.end) {
        b.count++;
        break;
      }
    }
  }

  let cum = baseline;
  const points = buckets.map((b) => {
    cum += b.count;
    return { ...b, cumulative: cum };
  });

  const maxY = Math.max(...points.map((p) => p.cumulative), 1);
  const w = 400;
  const h = 160;
  const pad = { t: 16, r: 12, b: 28, l: 32 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  if (points.length === 1) {
    points.push({ ...points[0], cumulative: points[0].cumulative, label: "" });
  }

  const coords = points.map((p, i) => ({
    x: pad.l + (i / (points.length - 1)) * innerW,
    y: pad.t + innerH - (p.cumulative / maxY) * innerH,
    ...p,
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${pad.t + innerH} L ${coords[0].x.toFixed(1)} ${pad.t + innerH} Z`;
  const gridLines = [0, 1, 2, 3]
    .map((i) => {
      const y = pad.t + (innerH / 3) * i;
      const val = Math.round(maxY - (maxY / 3) * i);
      return `
        <line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${w - pad.r}" y2="${y.toFixed(1)}" class="line-chart-grid" />
        <text x="${pad.l - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" class="line-chart-axis">${val}</text>`;
    })
    .join("");
  const dots = coords
    .filter((c) => c.label)
    .map((c) => `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="4" class="line-chart-dot" />`)
    .join("");
  const labels = coords
    .filter((c) => c.label)
    .map((c) => `<text x="${c.x.toFixed(1)}" y="${h - 6}" text-anchor="middle" class="line-chart-label">${c.label}</text>`)
    .join("");

  const latest = points[points.length - 1]?.cumulative || 0;

  return `
    <div class="line-chart-wrap">
      <svg viewBox="0 0 ${w} ${h}" class="line-chart-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Total problems solved over time">
        <defs>
          <linearGradient id="mapCumGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${areaPath}" class="line-chart-area" fill="url(#mapCumGrad)" />
        <path d="${linePath}" class="line-chart-line" fill="none" />
        ${dots}
        ${labels}
      </svg>
      <p class="chart-caption">${latest} total solved — line goes up as you log more</p>
    </div>`;
}

function getNextBadgeProgress(totalDone) {
  if (typeof Milestones === "undefined") {
    return { label: "Night Shift", pct: 0, remaining: 10, icon: "◎", color: "#fbbf24", target: 10 };
  }
  const next = Milestones.getNext(totalDone);
  if (!next) {
    const last = Milestones.THRESHOLDS[Milestones.THRESHOLDS.length - 1];
    return { label: last.label, pct: 100, remaining: 0, icon: last.icon, color: last.color, target: last.count };
  }
  return {
    label: next.label,
    pct: Math.min(100, Math.round((totalDone / next.count) * 100)),
    remaining: Math.max(next.count - totalDone, 0),
    icon: next.icon,
    color: next.color,
    target: next.count,
  };
}

function seededRandom(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function abbrevPattern(name) {
  const w = name.split(/[\s/&]+/).filter(Boolean);
  if (w.length <= 1) return name.slice(0, 6);
  return w.map((x) => x[0]).join("").slice(0, 4).toUpperCase();
}

function vizHint(text) {
  return `<p class="viz-hint">${escapeHtml(text)}</p>`;
}

function tileLabel(text) {
  return `<span class="tile-label">${escapeHtml(text)}</span>`;
}

function badgeJourneySection(totalDone) {
  const badge = getNextBadgeProgress(totalDone);
  const nextLine =
    badge.remaining > 0
      ? `${badge.remaining} more win${badge.remaining === 1 ? "" : "s"} until ${badge.icon} ${badge.label}`
      : "Every badge on the path is yours — keep the habit alive.";

  return `
    <div class="viz-panel panel viz-badges">
      <span class="viz-panel-tag">Your path</span>
      ${vizHint("Lit badges = earned · gray = still ahead on your journey")}
      <p class="badge-next-line">${escapeHtml(nextLine)}</p>
      ${badgeTrailVisual(totalDone)}
    </div>`;
}

function weeklyRecapCard(stats) {
  const week = stats.activeDaysThisWeek ?? 0;
  const streak = stats.streak ?? 0;
  const best = Math.max(stats.bestStreak ?? 0, streak);
  const month = stats.activeDaysThisMonth ?? 0;
  const delta = stats.monthDelta ?? 0;
  const weekPct = Math.round((week / 7) * 100);

  let monthLine;
  const monthLabel = month === 1 ? "1 active night" : `${month} active nights`;
  if (delta > 0) {
    monthLine = `${monthLabel} this month · +${delta} vs last month`;
  } else if (delta < 0) {
    monthLine = `${monthLabel} this month · ${delta} vs last month`;
  } else {
    monthLine = `${monthLabel} this month · even with last month`;
  }

  return `
    <div class="weekly-recap-card panel">
      <div class="weekly-recap-head">
        <div>
          <p class="weekly-recap-kicker">Weekly recap</p>
          <h3>Your rhythm this week</h3>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" id="shareStreakBtn">Share streak</button>
      </div>

      <div class="weekly-recap-grid">
        <div class="weekly-recap-stat">
          <span class="weekly-recap-val">${week}<span class="weekly-recap-denom">/7</span></span>
          <span class="weekly-recap-label">active nights</span>
          <div class="weekly-recap-bar" aria-hidden="true">
            <span class="weekly-recap-bar-fill" style="width: ${weekPct}%"></span>
          </div>
        </div>
        <div class="weekly-recap-stat">
          <span class="weekly-recap-val">${streak}</span>
          <span class="weekly-recap-label">day streak</span>
        </div>
        <div class="weekly-recap-stat">
          <span class="weekly-recap-val">${best}</span>
          <span class="weekly-recap-label">best streak</span>
        </div>
      </div>

      <p class="weekly-recap-foot">${escapeHtml(monthLine)}</p>
    </div>`;
}

function streakFreezeBanner(stats) {
  if (!stats.canUseStreakFreeze) return "";
  const credits = stats.streakFreezeCredits ?? 0;
  return `
    <div class="streak-freeze-banner panel" id="streakFreezeBanner">
      <p><strong>Streak freeze ready</strong> — cover yesterday once without breaking your chain. ${credits} credit available (earn 1/month after 5 active nights).</p>
      <button type="button" class="btn btn-primary btn-sm" id="useStreakFreezeBtn">Use streak freeze</button>
    </div>`;
}

function interviewGoalCard(interview) {
  if (!interview) return "";
  return `
    <div class="interview-goal-card panel">
      <p class="interview-goal-kicker">Interview goal</p>
      <h3>${interview.nightsLeft} nights until target</h3>
      <p class="insight-text">${escapeHtml(interview.message)}</p>
      <p class="interview-goal-meta">Date: ${escapeHtml(interview.interviewDate)} · ${interview.activeNightsThisWeek}/7 active this week</p>
    </div>`;
}

function renderOverview(container, data) {
  if (typeof ProgressCharts !== "undefined") ProgressCharts.disposeAll();

  container.innerHTML = `
    ${weeklyRecapCard(data.stats)}
    ${streakFreezeBanner(data.stats)}

    ${vizPanel(
      "Consistency calendar",
      '<div id="echart-calendar" class="echart-host echart-host-calendar"></div>',
      "viz-cal-hero",
      "Green squares = nights you showed up · hover any day for details",
    )}

    ${vizPanel(
      "This month vs last",
      '<div id="echart-month-compare" class="echart-host echart-host-sm"></div>',
      "viz-month",
      "Active nights — consistency over volume",
    )}

    <div class="viz-grid viz-grid-duo">
      ${vizPanel(
        "Streak",
        '<div id="echart-streak" class="echart-host echart-host-gauge"></div>',
        "viz-streak",
        "Solve today to keep the chain alive",
      )}
      ${vizPanel(
        "Weekly rhythm",
        '<div id="echart-weekly" class="echart-host echart-host-sm"></div>',
        "viz-weekly",
        "Each bar = 7 nights in that date range · max 7 per bar · dashed line = 5-night goal",
      )}
    </div>

    ${badgeJourneySection(data.totalDone)}`;

  if (typeof ProgressCharts !== "undefined") {
    ProgressCharts.renderJourneyMap(data);
    ProgressCharts.bindThemeRefresh();
  }

  bindStreakFreezeAction(data);
  bindShareStreakAction(data);
}

async function bindStreakFreezeAction(data) {
  const btn = document.getElementById("useStreakFreezeBtn");
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = "1";

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    try {
      await Auth.api("/api/v1/progress/streak-freeze", { method: "POST" });
      const fresh = await fetchProgressData();
      const overviewEl = document.getElementById("progressOverview");
      if (overviewEl) renderOverview(overviewEl, fresh);
    } catch (err) {
      alert(err.message);
      btn.disabled = false;
    }
  });
}

function bindShareStreakAction(data) {
  const btn = document.getElementById("shareStreakBtn");
  if (!btn || btn.dataset.bound || typeof ShareCards === "undefined") return;
  btn.dataset.bound = "1";

  btn.addEventListener("click", async () => {
    const result = await ShareCards.share({
      streak: data.stats.streak,
      bestStreak: data.stats.bestStreak,
      activeDaysThisWeek: data.stats.activeDaysThisWeek,
    });
    if (result === "copied") btn.textContent = "Copied!";
  });
}
function badgeTrailVisual(totalDone) {
  const thresholds = typeof Milestones !== "undefined" ? Milestones.THRESHOLDS : [];
  const parts = [];
  thresholds.forEach((m, i) => {
    const earned = totalDone >= m.count;
    parts.push(`
      <span class="trail-wrap">
        <span class="trail-node${earned ? " earned" : ""}" style="--node-color:${m.color}" title="${escapeHtml(m.label)}">
          ${m.icon}
        </span>
        <span class="trail-meta">${m.count}</span>
        <span class="trail-name">${escapeHtml(m.label)}</span>
      </span>`);
    if (i < thresholds.length - 1) parts.push('<span class="trail-line"></span>');
  });
  return `<div class="badge-trail">${parts.join("")}</div>`;
}

function calendarLegend() {
  return `<div class="cal-legend cal-legend-binary">
    <span>Missed</span>
    <span class="cal-cell cal-l0"></span>
    <span class="cal-cell cal-l1"></span>
    <span>Showed up</span>
  </div>`;
}

function patternHeatGrid(patterns, patternDone, patternTotals) {
  const hasAny = patterns.some((p) => (patternDone[p._id] || 0) > 0);
  if (!hasAny) {
    return `<div class="pattern-heat-grid pattern-heat-empty"><span class="heat-empty-icon">◎</span></div>`;
  }

  return `<div class="pattern-heat-grid">${patterns
    .map((p) => {
      const done = patternDone[p._id] || 0;
      const total = patternTotals[p._id] || Unlocks.PROBLEMS_PER_PATTERN;
      const fill = pct(done, total);
      const level = fill === 0 ? 0 : fill < 34 ? 1 : fill < 67 ? 2 : 3;
      return `<div class="heat-tile lvl-${level}" style="--fill:${fill}%" title="${escapeHtml(p.name)}: ${done}/${total}">
      <div class="heat-tile-glow"></div>
      <span class="heat-tile-abbr">${escapeHtml(abbrevPattern(p.name))}</span>
    </div>`;
    })
    .join("")}</div>`;
}

function grindCalendar(completedDates, weeks = 18) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - weeks * 7 + 1);

  const daySet = Insights.uniqueDayKeys(completedDates);

  const cells = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const cell = new Date(start);
      cell.setDate(cell.getDate() + w * 7 + d);
      if (cell > today) continue;
      const active = daySet.has(cell.getTime());
      const level = active ? 1 : 0;
      const title =
        cell.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
        `: ${active ? "showed up" : "rest day"}`;
      cells.push(`<span class="cal-cell cal-l${level}" title="${title}"></span>`);
    }
  }

  return `<div class="grind-calendar"><div class="cal-grid">${cells.join("")}</div>${calendarLegend()}</div>`;
}

function vizPanel(tag, content, className = "", hint = "") {
  return `
    <div class="viz-panel panel ${className}">
      <span class="viz-panel-tag">${escapeHtml(tag)}</span>
      ${hint ? vizHint(hint) : ""}
      ${content}
    </div>`;
}

function resolveHabitMetrics(stats, completedDates, timezone) {
  const hasProgress = completedDates.length > 0 || (stats.totalCompleted || 0) > 0;
  const apiLooksEmpty =
    hasProgress &&
    (stats.streak ?? 0) === 0 &&
    (stats.activeDaysThisWeek ?? 0) === 0 &&
    (stats.activeDaysThisMonth ?? 0) === 0;

  if (!apiLooksEmpty) {
    const streak = stats.streak ?? 0;
    return {
      streak,
      bestStreak: Math.max(stats.bestStreak ?? 0, streak),
      activeDaysThisWeek: stats.activeDaysThisWeek ?? 0,
      activeDaysThisMonth: stats.activeDaysThisMonth ?? 0,
      monthDelta: stats.monthDelta ?? 0,
    };
  }

  const streak = Insights.streakInTimezone(completedDates, timezone);
  const activeDaysThisWeek = Insights.activeDaysThisWeekInTimezone(completedDates, timezone);
  const activeDaysThisMonth = Insights.activeDaysThisMonthInTimezone(completedDates, timezone);
  const activeDaysLastMonth = Insights.activeDaysLastMonthInTimezone(completedDates, timezone);

  return {
    streak,
    bestStreak: Math.max(stats.bestStreak ?? 0, streak),
    activeDaysThisWeek,
    activeDaysThisMonth,
    monthDelta: activeDaysThisMonth - activeDaysLastMonth,
  };
}

async function fetchProgressData() {
  const [{ data: stats }, { data: patterns }, { data: progressEntries }, easyRes, mediumRes, hardRes] =
    await Promise.all([
      Auth.api("/api/v1/progress/stats"),
      Auth.api("/api/v1/patterns"),
      Auth.api("/api/v1/progress?status=done"),
      Auth.api("/api/v1/problems?difficulty=Easy&limit=1"),
      Auth.api("/api/v1/problems?difficulty=Medium&limit=1"),
      Auth.api("/api/v1/problems?difficulty=Hard&limit=1"),
    ]);

  let timezone = stats.timezone || (typeof Push !== "undefined" ? Push.getTimezone() : "Asia/Kolkata");
  try {
    const { data: prefs } = await Auth.api("/api/v1/reminders/preferences");
    if (prefs?.timezone) timezone = prefs.timezone;
  } catch {
    /* prefs optional */
  }

  const user = Auth.getUser();
  const totalDone = Math.max(stats.totalCompleted || 0, progressEntries.length);
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
  const completedDates = progressEntries.map((e) => e.completedAt || e.updatedAt || e.createdAt).filter(Boolean);
  const habit = resolveHabitMetrics(stats, completedDates, timezone);

  const streak = habit.streak;
  const activeDaysThisWeek = habit.activeDaysThisWeek;
  const activeDaysThisMonth = habit.activeDaysThisMonth;

  const mergedStats = {
    ...stats,
    streak: habit.streak,
    bestStreak: habit.bestStreak,
    activeDaysThisWeek: habit.activeDaysThisWeek,
    activeDaysThisMonth: habit.activeDaysThisMonth,
    monthDelta: habit.monthDelta,
    timezone,
  };

  const weakest = Insights.getWeakestPattern(patterns, patternDone, patternTotals);
  const insight = Insights.getInsightMessage(mergedStats, streak, completedDates, {
    daysSinceLastActive: stats.daysSinceLastActive,
  });
  const nextUp = Insights.getNextUpSuggestion(weakest);

  return {
    user,
    stats: mergedStats,
    patterns,
    progressEntries,
    totalDone,
    byDifficulty,
    difficultyTotals,
    patternDone,
    patternTotals,
    completedDates,
    streak,
    activeDaysThisWeek,
    activeDaysThisMonth,
    weakest,
    insight,
    nextUp,
    timezone,
  };
}

function renderPlan(container, data) {
  const {
    user,
    totalDone,
    byDifficulty,
    difficultyTotals,
    progressEntries,
    insight,
    nextUp,
    activeDaysThisWeek,
    activeDaysThisMonth,
    weakest,
  } = data;

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
    <p class="plan-greeting">Hey ${escapeHtml(user?.name || "there")} — what to work on tonight.</p>

    ${interviewGoalCard(data.stats.interview)}

    <div class="plan-summary panel plan-summary-trio">
      <div class="plan-summary-stat">
        <span class="plan-summary-val">${activeDaysThisWeek}/7</span>
        <span class="plan-summary-label">active nights this week</span>
      </div>
      <div class="plan-summary-stat">
        <span class="plan-summary-val">${activeDaysThisMonth}</span>
        <span class="plan-summary-label">active nights this month</span>
      </div>
      <div class="plan-summary-stat plan-summary-muted">
        <span class="plan-summary-val">${totalDone}</span>
        <span class="plan-summary-label">lifetime solves</span>
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
      ${disguiseHint(weakest)}
    </div>

    ${vizPanel(
      "Pattern breadth",
      '<div id="echart-patterns" class="echart-host echart-host-patterns"></div>',
      "viz-patterns-plan",
      "See where you have reps vs gaps — pairs with Up next above",
    )}

    <div class="stats-grid">
      <div class="stats-card panel stats-card-compact">
        <h3>By difficulty</h3>
        <p class="plan-desc">Counts only — breadth matters more than percentages.</p>
        ${countBarRow("Easy", byDifficulty.Easy || 0, difficultyTotals.Easy, "fill-easy")}
        ${countBarRow("Medium", byDifficulty.Medium || 0, difficultyTotals.Medium, "fill-medium")}
        ${countBarRow("Hard", byDifficulty.Hard || 0, difficultyTotals.Hard, "fill-hard")}
      </div>
      <div class="stats-card panel">
        <h3>Recent wins</h3>
        <ul class="recent-list">${recentHtml}</ul>
      </div>
    </div>`;

  if (typeof ProgressCharts !== "undefined") {
    ProgressCharts.renderGamePlan(data);
  }
}

async function loadFocusPanels(data) {
  const { patterns, patternDone, patternTotals, progressEntries, completedDates } = data;
  const unlockState = Unlocks.getClientState(patternDone, patterns);
  const session = typeof Focus !== "undefined" ? Focus.readSession() : null;

  Focus.renderContinue(
    document.getElementById("continueSession"),
    document.getElementById("continueSessionDetail"),
    patterns,
    session
      ? {
          patternSlug: session.patternSlug || "",
          difficulty: session.difficulty || "",
          search: session.search || "",
          page: session.page > 0 ? session.page : 1,
        }
      : null,
  );

  Focus.renderUnlockBanners(unlockState, "unlockBanners");
  renderReviewQueue(progressEntries);

  if (typeof Focus === "undefined") return;

  const progressMap = new Map();
  progressEntries.forEach((entry) => {
    const p = entry.problemId;
    if (p?._id) progressMap.set(p._id, { id: entry._id, status: entry.status });
  });

  const tonightIds = {
    panel: "tonightsProblem",
    reason: "tonightsReason",
    title: "tonightsTitle",
    meta: "tonightsMeta",
    link: "tonightsLink",
  };

  try {
    const result = await Focus.fetchTonightsProblem({
      patterns,
      patternDone,
      patternTotals,
      progressMap,
      unlockState,
      tonightShuffle: 0,
      apiFn: (path) => Auth.api(path),
    });
    if (result?.patternSlug) {
      try {
        localStorage.setItem("afterhours_tonight_slug", result.patternSlug);
      } catch {
        /* ignore */
      }
    }
    Focus.renderTodayCard({ completedDates, tonightResult: result, tonightIds });
    if (!Insights.completedToday(completedDates)) {
      Focus.renderTonightsProblem(result, tonightIds);
    }
  } catch {
    /* ignore */
  }
}

function renderReviewQueue(progressEntries) {
  const panel = document.getElementById("reviewQueue");
  const list = document.getElementById("reviewQueueList");
  if (!panel || !list) return;

  const now = Date.now();
  const due = progressEntries.filter((entry) => {
    if (!entry.reviewAt) return false;
    return new Date(entry.reviewAt).getTime() <= now;
  });

  if (!due.length) {
    panel.hidden = true;
    list.innerHTML = "";
    return;
  }

  list.innerHTML = due
    .slice(0, 8)
    .map((entry) => {
      const p = entry.problemId;
      if (!p) return "";
      const url = p.leetcodeLink || p.practiceLink || "#";
      return `
        <li class="recent-item">
          <span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
          <span class="recent-title">${escapeHtml(p.title)}</span>
          <a href="${url}" class="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">Review ↗</a>
        </li>`;
    })
    .join("");

  panel.hidden = false;
}

function disguiseHint(weakest) {
  if (!weakest?.pattern?.slug || typeof PatternGuides === "undefined") return "";
  const guide = PatternGuides.get(weakest.pattern.slug);
  const disguise = guide?.disguises?.[0];
  if (!disguise) return "";
  const text =
    typeof disguise === "string"
      ? disguise
      : disguise.mapsTo || disguise.question || "";
  return `
    <div class="insight-card panel insight-disguise">
      <h3>Pattern in disguise</h3>
      <p class="insight-text"><strong>${escapeHtml(weakest.pattern.name)}</strong> — ${escapeHtml(text)}</p>
    </div>`;
}

const TAB_KEY = "afterhours_progress_tab";

function getTabFromHash() {
  const hash = location.hash.replace("#", "");
  return hash === "plan" ? "plan" : "map";
}

function switchProgressTab(tab) {
  const mapPanel = document.getElementById("progressTabMap");
  const planPanel = document.getElementById("progressTabPlan");
  const tabMap = document.getElementById("tabMap");
  const tabPlan = document.getElementById("tabPlan");
  if (!mapPanel || !planPanel || !tabMap || !tabPlan) return;

  const isMap = tab === "map";

  mapPanel.hidden = !isMap;
  planPanel.hidden = isMap;

  tabMap.classList.toggle("active", isMap);
  tabPlan.classList.toggle("active", !isMap);
  tabMap.setAttribute("aria-selected", String(isMap));
  tabPlan.setAttribute("aria-selected", String(!isMap));

  try {
    sessionStorage.setItem(TAB_KEY, tab);
  } catch {
    /* ignore */
  }

  if (location.hash !== `#${tab}`) {
    history.replaceState(null, "", `#${tab}`);
  }

  if (isMap && typeof ProgressCharts !== "undefined") {
    setTimeout(() => ProgressCharts.resizeAll(), 50);
  } else if (!isMap && typeof ProgressCharts !== "undefined") {
    setTimeout(() => ProgressCharts.resizeAll(), 50);
  }
}

function initProgressTabs() {
  const tabBar = document.querySelector(".progress-tabs");
  if (!tabBar) return;

  tabBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".progress-tab");
    if (!btn) return;
    switchProgressTab(btn.dataset.tab);
  });

  let initial = getTabFromHash();
  try {
    if (!location.hash) {
      const saved = sessionStorage.getItem(TAB_KEY);
      if (saved === "plan" || saved === "map") initial = saved;
    }
  } catch {
    /* ignore */
  }

  switchProgressTab(initial);
  window.addEventListener("hashchange", () => switchProgressTab(getTabFromHash()));
}

async function loadProgress() {
  const overviewEl = document.getElementById("progressOverview");
  const planEl = document.getElementById("progressPlan");
  if (!overviewEl || !planEl) return;

  try {
    const data = await fetchProgressData();

    renderOverview(overviewEl, data);
    renderPlan(planEl, data);

    await loadFocusPanels(data);

    if (typeof Milestones !== "undefined") {
      Milestones.update(data.totalDone);
    }
  } catch (err) {
    const msg = `<div class="empty-state panel">Failed to load progress: ${escapeHtml(err.message)}</div>`;
    overviewEl.innerHTML = msg;
    planEl.innerHTML = msg;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await Nav.init();
  if (!Nav.requireAuth()) return;
  initProgressTabs();
  await Push.initSettingsPanel();
  loadProgress();
});
