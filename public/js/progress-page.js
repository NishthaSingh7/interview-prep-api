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
          <span class="stacked-legend-pct">${seg.value} · ${Math.round(width)}%</span>
        </div>`;
    })
    .join("");

  return `
    <div class="stacked-bar-wrap">
      <div class="stacked-bar" role="img" aria-label="Pattern distribution">${chunks}</div>
      <div class="stacked-legend">${legend}</div>
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

function difficultyBarChart(byDifficulty, difficultyTotals) {
  const items = [
    { label: "Easy", done: byDifficulty.Easy || 0, total: difficultyTotals.Easy, cls: "fill-easy", color: "var(--easy)" },
    { label: "Medium", done: byDifficulty.Medium || 0, total: difficultyTotals.Medium, cls: "fill-medium", color: "var(--medium)" },
    { label: "Hard", done: byDifficulty.Hard || 0, total: difficultyTotals.Hard, cls: "fill-hard", color: "var(--hard)" },
  ];
  const max = Math.max(...items.map((i) => i.total), 1);

  return `
    <div class="difficulty-bar-chart">
      ${items
        .map(
          (i) => `
        <div class="difficulty-bar-row">
          <span class="difficulty-bar-label">${i.label}</span>
          <div class="difficulty-bar-track">
            <div class="difficulty-bar-cap" style="width: ${(i.total / max) * 100}%"></div>
            <div class="difficulty-bar-fill ${i.cls}" style="width: ${(i.done / max) * 100}%"></div>
          </div>
          <span class="difficulty-bar-val">${i.done}/${i.total}</span>
        </div>`,
        )
        .join("")}
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

function badgeRingVisual(badge, totalDone) {
  const pctVal = badge.pct;
  return `
    <div class="visual-ring" title="${totalDone} solved · ${pctVal}% toward ${badge.label}">
      ${donutChart(
        [
          { value: pctVal, className: "chart-seg-accent" },
          { value: Math.max(100 - pctVal, 0), className: "chart-seg-muted" },
        ],
        { size: 130, stroke: 14, centerLabel: badge.icon, centerSub: "" },
      )}
      <span class="viz-micro">${pctVal}% → ${escapeHtml(badge.label)}</span>
    </div>`;
}

function nextBadgeMosaic(totalDone, badge) {
  const target = badge.target || 10;
  const cols = target <= 10 ? target : target <= 25 ? 10 : 15;
  const cells = Array.from({ length: target }, (_, i) => {
    const lit = i < totalDone;
    return `<span class="mosaic-cell${lit ? " lit" : ""}" style="--cell-color:${badge.color}"></span>`;
  }).join("");
  return `
    <div class="mosaic-wrap">
      <div class="mosaic-track" style="--mosaic-cols:${cols}">${cells}</div>
      <span class="viz-micro">${totalDone} of ${target} wins toward ${escapeHtml(badge.label)}</span>
    </div>`;
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

function streakFlamesVisual(streak) {
  const max = 7;
  return `
    <div class="flame-block">
      <div class="flame-row">
        ${Array.from({ length: max }, (_, i) => `<span class="flame${i < streak ? " lit" : ""}"></span>`).join("")}
      </div>
      <span class="viz-micro">${streak ? `${streak} day${streak === 1 ? "" : "s"} in a row` : "Solve today to start a streak"}</span>
    </div>`;
}

function difficultyColumnsVisual(byDifficulty) {
  const easy = byDifficulty.Easy || 0;
  const medium = byDifficulty.Medium || 0;
  const hard = byDifficulty.Hard || 0;
  const max = Math.max(easy, medium, hard, 1);
  const col = (val, cls, label) => {
    const h = Math.max(12, Math.round((val / max) * 100));
    return `<div class="diff-col" title="${label}: ${val}">
      <span class="diff-col-val">${val}</span>
      <div class="diff-col-bar ${cls}" style="height:${h}%"></div>
      <span class="diff-col-label ${cls}">${label}</span>
    </div>`;
  };
  return `<div class="diff-cols">${col(easy, "easy", "Easy")}${col(medium, "medium", "Med")}${col(hard, "hard", "Hard")}</div>`;
}

function visualBoard(data) {
  const { totalDone, streak, byDifficulty } = data;
  const badge = getNextBadgeProgress(totalDone);

  return `
    <div class="visual-board panel">
      <div class="visual-board-grid">
        <div class="visual-tile visual-tile-ring visual-span-2">
          ${tileLabel("Next badge")}
          ${vizHint("Ring fills as you approach the next unlock")}
          ${badgeRingVisual(badge, totalDone)}
          ${nextBadgeMosaic(totalDone, badge)}
        </div>
        <div class="visual-tile visual-tile-streak">
          ${tileLabel("Streak")}
          ${vizHint("One lit flame = one active day")}
          ${streakFlamesVisual(streak)}
        </div>
        <div class="visual-tile visual-tile-diff">
          ${tileLabel("Difficulty")}
          ${vizHint("Taller bar = more solved at that level")}
          ${difficultyColumnsVisual(byDifficulty)}
        </div>
        <div class="visual-tile visual-tile-trail visual-span-full">
          ${tileLabel("Badge path")}
          ${vizHint("Glow = earned · Gray = still locked · Numbers = solves needed")}
          ${badgeTrailVisual(totalDone)}
        </div>
      </div>
    </div>`;
}

function calendarLegend() {
  return `<div class="cal-legend">
    <span>Less</span>
    <span class="cal-cell cal-l0"></span>
    <span class="cal-cell cal-l1"></span>
    <span class="cal-cell cal-l2"></span>
    <span class="cal-cell cal-l3"></span>
    <span>More</span>
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

  const dayMap = new Map();
  for (const dateStr of completedDates) {
    if (!dateStr) continue;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const key = d.getTime();
    dayMap.set(key, (dayMap.get(key) || 0) + 1);
  }

  const cells = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const cell = new Date(start);
      cell.setDate(cell.getDate() + w * 7 + d);
      if (cell > today) continue;
      const count = dayMap.get(cell.getTime()) || 0;
      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
      const title = cell.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + `: ${count}`;
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

  const user = Auth.getUser();
  const totalDone = stats.totalCompleted || 0;
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

  return {
    user,
    stats,
    patterns,
    progressEntries,
    totalDone,
    overallPct: pct(totalDone, Insights.TOTAL_PROBLEMS),
    byDifficulty,
    difficultyTotals,
    patternDone,
    patternTotals,
    completedDates,
    streak,
    weakest,
    insight,
    nextUp,
  };
}

function renderOverview(container, data) {
  const { byDifficulty, patterns, patternDone, patternTotals, completedDates, difficultyTotals } = data;

  const difficultySegments = [
    { value: byDifficulty.Easy || 0, className: "chart-seg-easy", label: "Easy" },
    { value: byDifficulty.Medium || 0, className: "chart-seg-medium", label: "Medium" },
    { value: byDifficulty.Hard || 0, className: "chart-seg-hard", label: "Hard" },
  ];
  const difficultyTotal = difficultySegments.reduce((sum, s) => sum + s.value, 0);

  container.innerHTML = `
    ${visualBoard(data)}

    <div class="viz-grid viz-grid-wide">
      ${vizPanel("📅 Calendar", grindCalendar(completedDates, 18), "viz-cal", "Each square = one day · darker teal = more solved")}
      ${vizPanel("▦ Patterns", patternHeatGrid(patterns, patternDone, patternTotals), "viz-patterns", "Brighter = more done in that pattern · hover for full name")}
    </div>

    <div class="viz-grid">
      ${vizPanel("📊 Daily", activityChart(completedDates, 14), "viz-bars", "Bar height = problems finished that day")}
      ${vizPanel("📈 Growth", cumulativeLineChart(completedDates, 10), "viz-line", "Line going up = your total solved over time")}
    </div>

    <div class="viz-grid">
      ${vizPanel(
        "◐ Difficulty",
        `<div class="viz-split-labeled">
          ${difficultyBarChart(byDifficulty, difficultyTotals)}
          <div class="chart-card-donut">
            ${donutChart(difficultySegments, { size: 120, stroke: 14, centerLabel: difficultyTotal, centerSub: "total" })}
            ${chartLegend(
              difficultySegments.map((seg) => ({
                className: seg.className.replace("chart-seg-", "chart-legend-"),
                label: seg.label,
                value: seg.value,
              })),
            )}
          </div>
        </div>`,
        "viz-diff",
        "Bars = solved vs available · donut = your easy/med/hard split",
      )}
      ${vizPanel("🎨 Mix", patternStackedBar(patterns, patternDone), "viz-stack", "Each color = share of your solves in that pattern")}
    </div>`;
}

function milestoneGridPlan(totalDone) {
  const thresholds = typeof Milestones !== "undefined" ? Milestones.THRESHOLDS : [];
  if (!thresholds.length) return "";

  const items = thresholds
    .map((m) => {
      const earned = totalDone >= m.count;
      const progress = Math.min(100, Math.round((totalDone / m.count) * 100));
      return `
        <div class="milestone-grid-item ${earned ? "earned" : "locked"}" style="--milestone-color: ${m.color}">
          <div class="milestone-grid-ring" style="--ring-pct: ${progress}%">
            <span class="milestone-grid-icon" aria-hidden="true">${m.icon}</span>
          </div>
          <span class="milestone-grid-label">${escapeHtml(m.label)}</span>
          <span class="milestone-grid-meta">${earned ? "Unlocked ✓" : `${totalDone} / ${m.count}`}</span>
        </div>`;
    })
    .join("");

  return `
    <div class="stats-card panel milestone-grid-card">
      <h3>Badge milestones</h3>
      <p class="plan-desc">Badges unlock at 10, 25, 45, 60, 75, 90, and 100 — on your own clock, not a race to 300.</p>
      <div class="milestone-grid">${items}</div>
    </div>`;
}

function renderPlan(container, data) {
  const {
    user,
    totalDone,
    byDifficulty,
    difficultyTotals,
    patterns,
    patternDone,
    patternTotals,
    progressEntries,
    insight,
    nextUp,
    streak,
    completedDates,
  } = data;

  const badge = getNextBadgeProgress(totalDone);
  const thisWeek = weekSolveCount(completedDates);

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

  container.innerHTML = `
    <p class="plan-greeting">Hey ${escapeHtml(user?.name || "there")} — your numbers, badges, and what to do next.</p>
    <div class="plan-summary panel">
      <div class="plan-summary-stat">
        <span class="plan-summary-val">${totalDone}</span>
        <span class="plan-summary-label">problems done</span>
      </div>
      <div class="plan-summary-stat">
        <span class="plan-summary-val">${streak}</span>
        <span class="plan-summary-label">day streak</span>
      </div>
      <div class="plan-summary-stat">
        <span class="plan-summary-val">${thisWeek}</span>
        <span class="plan-summary-label">this week</span>
      </div>
      <div class="plan-summary-stat plan-summary-next" style="--badge-color: ${badge.color}">
        <span class="plan-summary-val">${badge.remaining || "✓"}</span>
        <span class="plan-summary-label">to ${escapeHtml(badge.label)}</span>
      </div>
    </div>

    ${milestoneGridPlan(totalDone)}

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

    await loadFocusPanels(data.patterns, data.patternDone);

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
