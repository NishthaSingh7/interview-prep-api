/* Journey Map charts — ECharts, data stays in-browser */
const ProgressCharts = (() => {
  const charts = new Map();
  let lastData = null;

  function disposeAll() {
    charts.forEach((c) => c.dispose());
    charts.clear();
  }

  function themeColors() {
    const style = getComputedStyle(document.documentElement);
    const pick = (v, fallback) => style.getPropertyValue(v).trim() || fallback;
    const dark = document.documentElement.getAttribute("data-theme") === "dark";

    return {
      text: pick("--text", dark ? "#e6edf3" : "#1a2332"),
      muted: pick("--muted", "#8b949e"),
      easy: pick("--easy", dark ? "#3fb950" : "#047857"),
      accent: pick("--accent", dark ? "#f0883e" : "#d97706"),
      surface: pick("--surface", dark ? "#161b22" : "#faf8f4"),
      border: pick("--border", dark ? "#30363d" : "#b8b0a3"),
      empty: dark ? "#21262d" : "#ddd8ce",
      font: "Inter, sans-serif",
      mono: "JetBrains Mono, monospace",
    };
  }

  function isoDay(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function mount(id, option) {
    const el = document.getElementById(id);
    if (!el || typeof echarts === "undefined") return null;

    const existing = charts.get(id);
    if (existing) existing.dispose();

    const chart = echarts.init(el, null, { renderer: "canvas" });
    chart.setOption(option);
    charts.set(id, chart);
    return chart;
  }

  function axisStyle(colors) {
    return {
      axisLine: { lineStyle: { color: colors.border } },
      axisTick: { show: false },
      axisLabel: { color: colors.muted, fontSize: 10, fontFamily: colors.mono },
      splitLine: { lineStyle: { color: colors.border, opacity: 0.35 } },
    };
  }

  function initCalendarHeatmap(id, completedDates, timezone = "Asia/Kolkata") {
    const colors = themeColors();
    const activeKeys = Insights.uniqueDateKeysInTimezone(completedDates, timezone);
    const todayKey = Insights.dateKeyInTimezone(new Date(), timezone);
    const [ty, tm, td] = todayKey.split("-").map(Number);
    const today = new Date(ty, tm - 1, td);
    const weeks = 26;
    const start = new Date(today);
    start.setDate(start.getDate() - weeks * 7 + 1);

    const data = [];
    let activeTotal = 0;
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const key = Insights.dateKeyInTimezone(d, timezone);
      const active = activeKeys.has(key) ? 1 : 0;
      if (active) activeTotal += 1;
      data.push([key, active]);
    }

    mount(id, {
      backgroundColor: "transparent",
      animationDuration: 600,
      tooltip: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textStyle: { color: colors.text, fontSize: 12 },
        formatter(p) {
          const showed = p.data[1] === 1;
          return `${p.data[0]}<br/><span style="color:${showed ? colors.easy : colors.muted}">${showed ? "Showed up" : "Rest day"}</span>`;
        },
      },
      visualMap: {
        show: false,
        min: 0,
        max: 1,
        inRange: { color: [colors.empty, colors.easy] },
      },
      calendar: {
        top: 36,
        left: 48,
        right: 16,
        bottom: 8,
        range: [Insights.dateKeyInTimezone(start, timezone), todayKey],
        cellSize: [11, 11],
        orient: "horizontal",
        itemStyle: {
          borderWidth: 2,
          borderColor: colors.surface,
          borderRadius: 2,
        },
        dayLabel: {
          firstDay: 0,
          nameMap: ["S", "M", "T", "W", "T", "F", "S"],
          color: colors.muted,
          fontSize: 9,
          fontFamily: colors.mono,
        },
        monthLabel: {
          color: colors.muted,
          fontSize: 10,
          fontFamily: colors.mono,
        },
        yearLabel: { show: false },
      },
      series: [
        {
          type: "heatmap",
          coordinateSystem: "calendar",
          data,
        },
      ],
      graphic: [
        {
          type: "text",
          right: 12,
          top: 8,
          style: {
            text: `${activeTotal} active days`,
            fill: colors.accent,
            font: `600 11px ${colors.mono}`,
          },
        },
      ],
    });
  }

  function initConsistencyBars(id, completedDates, days = 14) {
    const colors = themeColors();
    const daySet = Insights.uniqueDayKeys(completedDates);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const labels = [];
    const values = [];
    let activeCount = 0;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const active = daySet.has(Insights.dayKey(d)) ? 1 : 0;
      if (active) activeCount += 1;
      labels.push(d.toLocaleDateString(undefined, { weekday: "short" }));
      values.push(active);
    }

    mount(id, {
      backgroundColor: "transparent",
      animationDuration: 500,
      grid: { top: 28, left: 8, right: 8, bottom: 28, containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textStyle: { color: colors.text, fontSize: 12 },
        formatter(params) {
          const p = params[0];
          return `${p.name}<br/><span style="color:${p.value ? colors.easy : colors.muted}">${p.value ? "Showed up" : "No activity"}</span>`;
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        ...axisStyle(colors),
      },
      yAxis: {
        type: "value",
        max: 1,
        show: false,
      },
      series: [
        {
          type: "bar",
          data: values.map((v) => ({
            value: v,
            itemStyle: {
              color: v ? colors.easy : colors.empty,
              borderRadius: v ? [4, 4, 0, 0] : [2, 2, 0, 0],
            },
          })),
          barWidth: "55%",
        },
      ],
      graphic: [
        {
          type: "text",
          right: 8,
          top: 4,
          style: {
            text: `${activeCount}/${days} days`,
            fill: colors.muted,
            font: `500 10px ${colors.mono}`,
          },
        },
      ],
    });
  }

  function formatWeekRange(startKey, endKey) {
    const fmt = (key) => {
      const [y, m, d] = key.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    };
    if (startKey === endKey) return fmt(endKey);
    return `${fmt(startKey)}–${fmt(endKey)}`;
  }

  function initWeeklyHabit(id, completedDates, timezone = "Asia/Kolkata", weekCount = 10) {
    const colors = themeColors();
    const activeKeys = Insights.uniqueDateKeysInTimezone(completedDates, timezone);
    const todayKey = Insights.dateKeyInTimezone(new Date(), timezone);

    const labels = [];
    const values = [];

    // Each bar = calendar week Mon–Sun in the user's timezone.
    const thisMonday = Insights.mondayOfWeekKey(todayKey, timezone);

    for (let i = weekCount - 1; i >= 0; i--) {
      const weekStart = Insights.addDaysKey(thisMonday, -i * 7);
      const weekEnd = Insights.addDaysKey(weekStart, 6);

      let active = 0;
      for (const key of activeKeys) {
        if (key >= weekStart && key <= weekEnd) active += 1;
      }

      labels.push(formatWeekRange(weekStart, weekEnd));
      values.push(active);
    }

    mount(id, {
      backgroundColor: "transparent",
      animationDuration: 600,
      grid: { top: 32, left: 8, right: 8, bottom: 28, containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textStyle: { color: colors.text, fontSize: 12 },
        formatter(params) {
          const p = params[0];
          return `${p.name}<br/><strong style="color:${colors.easy}">${p.value} active night${p.value === 1 ? "" : "s"}</strong> / 7 this week`;
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        ...axisStyle(colors),
      },
      yAxis: {
        type: "value",
        max: 7,
        interval: 1,
        ...axisStyle(colors),
      },
      series: [
        {
          type: "bar",
          data: values.map((v) => ({
            value: v,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  { offset: 0, color: colors.empty },
                  { offset: 1, color: v >= 5 ? colors.easy : colors.accent },
                ],
              },
              borderRadius: [4, 4, 0, 0],
            },
          })),
          barWidth: "50%",
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: colors.easy, type: "dashed", opacity: 0.45 },
            label: { show: false },
            data: [{ yAxis: 5 }],
          },
        },
      ],
      graphic: [
        {
          type: "text",
          right: 8,
          top: 4,
          style: {
            text: "goal: 5+ nights / week",
            fill: colors.muted,
            font: `500 10px ${colors.mono}`,
          },
        },
      ],
    });
  }

  function shortPatternName(name) {
    if (name.length <= 14) return name;
    return `${name.slice(0, 13)}…`;
  }

  function initPatternBars(id, patterns, patternDone, patternTotals) {
    const colors = themeColors();
    const sorted = [...patterns].sort(
      (a, b) => (patternDone[b._id] || 0) - (patternDone[a._id] || 0),
    );

    const names = sorted.map((p) => shortPatternName(p.name));
    const done = sorted.map((p) => patternDone[p._id] || 0);
    const totals = sorted.map((p) => patternTotals[p._id] || Unlocks.PROBLEMS_PER_PATTERN);

    const height = Math.max(280, sorted.length * 16);

    const el = document.getElementById(id);
    if (el) el.style.height = `${height}px`;

    mount(id, {
      backgroundColor: "transparent",
      animationDuration: 500,
      grid: { top: 12, left: 4, right: 28, bottom: 8, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textStyle: { color: colors.text, fontSize: 12 },
        formatter(params) {
          const p = params[0];
          const i = p.dataIndex;
          const pct = totals[i] ? Math.round((done[i] / totals[i]) * 100) : 0;
          return `${sorted[i].name}<br/><span style="color:${colors.easy}">${done[i]} solved</span> · ${pct}% breadth`;
        },
      },
      xAxis: {
        type: "value",
        max: Math.max(...totals, 15),
        ...axisStyle(colors),
      },
      yAxis: {
        type: "category",
        data: names,
        inverse: true,
        axisLabel: {
          color: colors.muted,
          fontSize: 9,
          fontFamily: colors.mono,
          width: 88,
          overflow: "truncate",
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          data: done.map((v, i) => ({
            value: v,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: colors.empty },
                  { offset: 1, color: v > 0 ? colors.easy : colors.empty },
                ],
              },
              borderRadius: [0, 4, 4, 0],
            },
          })),
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: colors.empty,
            borderRadius: [0, 4, 4, 0],
          },
        },
      ],
    });
  }

  function initMonthCompare(id, thisMonth, lastMonth) {
    const colors = themeColors();
    const labels = ["Last month", "This month"];
    const values = [lastMonth, thisMonth];

    mount(id, {
      backgroundColor: "transparent",
      animationDuration: 500,
      grid: { top: 28, left: 8, right: 8, bottom: 28, containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textStyle: { color: colors.text, fontSize: 12 },
        formatter(params) {
          const p = params[0];
          return `${p.name}<br/><strong style="color:${colors.easy}">${p.value} active night${p.value === 1 ? "" : "s"}</strong>`;
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        ...axisStyle(colors),
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        ...axisStyle(colors),
      },
      series: [
        {
          type: "bar",
          data: values.map((v, i) => ({
            value: v,
            itemStyle: {
              color: i === 1 ? colors.easy : colors.empty,
              borderRadius: [4, 4, 0, 0],
            },
          })),
          barWidth: "42%",
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: colors.accent, type: "dashed", opacity: 0.5 },
            label: {
              show: true,
              formatter: () => {
                const delta = thisMonth - lastMonth;
                if (delta > 0) return `+${delta} vs last month`;
                if (delta < 0) return `${delta} vs last month`;
                return "even vs last month";
              },
              color: colors.muted,
              fontSize: 10,
              fontFamily: colors.mono,
            },
            data: [{ yAxis: Math.max(thisMonth, lastMonth, 1) }],
          },
        },
      ],
    });
  }

  function initStreakGauge(id, streak) {
    const colors = themeColors();
    const goal = Math.max(streak, 7);

    mount(id, {
      backgroundColor: "transparent",
      series: [
        {
          type: "gauge",
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: goal,
          radius: "92%",
          center: ["50%", "58%"],
          progress: {
            show: true,
            width: 10,
            itemStyle: { color: colors.easy },
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[1, colors.empty]],
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          title: {
            offsetCenter: [0, "28%"],
            fontSize: 11,
            color: colors.muted,
            fontFamily: colors.mono,
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, "-2%"],
            fontSize: 28,
            fontWeight: 700,
            fontFamily: colors.mono,
            color: colors.easy,
            formatter: "{value}",
          },
          data: [{ value: streak, name: streak === 1 ? "day streak" : "day streak" }],
        },
      ],
    });
  }

  function initBadgeGauge(id, badge, totalDone) {
    const colors = themeColors();

    mount(id, {
      backgroundColor: "transparent",
      series: [
        {
          type: "gauge",
          startAngle: 220,
          endAngle: -40,
          min: 0,
          max: 100,
          radius: "88%",
          center: ["50%", "55%"],
          progress: {
            show: true,
            width: 12,
            itemStyle: { color: badge.color || colors.accent },
          },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [[1, colors.empty]],
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          title: {
            offsetCenter: [0, "72%"],
            fontSize: 10,
            color: colors.muted,
            fontFamily: colors.mono,
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, "8%"],
            fontSize: 22,
            formatter: () => badge.icon,
          },
          data: [
            {
              value: badge.pct,
              name: `${totalDone}/${badge.target} → ${badge.label}`,
            },
          ],
        },
      ],
    });
  }

  function renderJourneyMap(data) {
    lastData = data;
    const { completedDates, streak, stats, timezone } = data;
    const tz = timezone || "Asia/Kolkata";

    requestAnimationFrame(() => {
      if (document.getElementById("echart-calendar")) {
        initCalendarHeatmap("echart-calendar", completedDates, tz);
      }
      if (document.getElementById("echart-month-compare")) {
        initMonthCompare(
          "echart-month-compare",
          stats?.activeDaysThisMonth ?? 0,
          stats?.activeDaysLastMonth ?? 0,
        );
      }
      if (document.getElementById("echart-streak")) {
        initStreakGauge("echart-streak", streak);
      }
      if (document.getElementById("echart-weekly")) {
        initWeeklyHabit("echart-weekly", completedDates, tz, 10);
      }
      resizeAll();
    });
  }

  function renderGamePlan(data) {
    lastData = data;
    const { patterns, patternDone, patternTotals } = data;

    requestAnimationFrame(() => {
      if (document.getElementById("echart-patterns")) {
        initPatternBars("echart-patterns", patterns, patternDone, patternTotals);
      }
      resizeAll();
    });
  }

  function resizeAll() {
    charts.forEach((c) => c.resize());
  }

  function rerender() {
    if (!lastData) return;
    renderJourneyMap(lastData);
    renderGamePlan(lastData);
  }

  function bindThemeRefresh() {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      if (btn.dataset.echartsBound) return;
      btn.dataset.echartsBound = "true";
      btn.addEventListener("click", () => setTimeout(rerender, 80));
    });
    window.addEventListener("resize", resizeAll);
  }

  return { disposeAll, renderJourneyMap, renderGamePlan, resizeAll, rerender, bindThemeRefresh };
})();
