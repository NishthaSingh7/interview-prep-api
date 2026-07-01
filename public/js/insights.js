const Insights = {
  TOTAL_PROBLEMS: 300,

  dayKey(dateInput) {
    const d = new Date(dateInput);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  },

  dateKeyInTimezone(dateInput, timezone = "Asia/Kolkata") {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(dateInput)).map((p) => [p.type, p.value]),
    );
    return `${parts.year}-${parts.month}-${parts.day}`;
  },

  uniqueDateKeysInTimezone(completedDates, timezone = "Asia/Kolkata") {
    const keys = new Set();
    for (const raw of completedDates) {
      if (!raw) continue;
      keys.add(this.dateKeyInTimezone(raw, timezone));
    }
    return keys;
  },

  prevDateKey(dateKey) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() - 1);
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
  },

  streakInTimezone(completedDates, timezone = "Asia/Kolkata") {
    const keys = this.uniqueDateKeysInTimezone(completedDates, timezone);
    if (!keys.size) return 0;

    let cursor = this.dateKeyInTimezone(new Date(), timezone);
    if (!keys.has(cursor)) {
      cursor = this.prevDateKey(cursor);
    }

    let streak = 0;
    while (keys.has(cursor)) {
      streak++;
      cursor = this.prevDateKey(cursor);
    }
    return streak;
  },

  activeDaysThisWeekInTimezone(completedDates, timezone = "Asia/Kolkata") {
    const keys = [...this.uniqueDateKeysInTimezone(completedDates, timezone)].sort();
    if (!keys.length) return 0;

    const todayKey = this.dateKeyInTimezone(new Date(), timezone);
    const [y, m, d] = todayKey.split("-").map(Number);
    const start = new Date(Date.UTC(y, m - 1, d));
    start.setUTCDate(start.getUTCDate() - 6);
    const startKey = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, "0")}-${String(start.getUTCDate()).padStart(2, "0")}`;

    return keys.filter((k) => k >= startKey && k <= todayKey).length;
  },

  activeDaysThisMonthInTimezone(completedDates, timezone = "Asia/Kolkata") {
    const nowKey = this.dateKeyInTimezone(new Date(), timezone);
    const prefix = nowKey.slice(0, 7);
    return [...this.uniqueDateKeysInTimezone(completedDates, timezone)].filter((k) =>
      k.startsWith(prefix),
    ).length;
  },

  activeDaysLastMonthInTimezone(completedDates, timezone = "Asia/Kolkata") {
    const nowKey = this.dateKeyInTimezone(new Date(), timezone);
    const [y, m] = nowKey.split("-").map(Number);
    let year = y;
    let month = m - 1;
    if (month <= 0) {
      month += 12;
      year -= 1;
    }
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    return [...this.uniqueDateKeysInTimezone(completedDates, timezone)].filter((k) =>
      k.startsWith(prefix),
    ).length;
  },

  uniqueDayKeys(completedDates) {
    return new Set(
      completedDates
        .filter(Boolean)
        .map((d) => this.dayKey(d)),
    );
  },

  computeStreak(completedDates) {
    const days = this.uniqueDayKeys(completedDates);
    if (!days.size) return 0;

    const oneDay = 86400000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let cursor = today.getTime();
    if (!days.has(cursor)) {
      cursor = today.getTime() - oneDay;
    }

    let streak = 0;
    while (days.has(cursor)) {
      streak++;
      cursor -= oneDay;
    }

    return streak;
  },

  completedToday(completedDates) {
    const today = this.dayKey(new Date());
    return completedDates.some((d) => d && this.dayKey(d) === today);
  },

  activeDaysInRange(completedDates, startMs, endMs) {
    const days = this.uniqueDayKeys(completedDates);
    let count = 0;
    for (const key of days) {
      if (key >= startMs && key <= endMs) count++;
    }
    return count;
  },

  activeDaysThisWeek(completedDates) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return this.activeDaysInRange(completedDates, start.getTime(), today.getTime());
  },

  activeDaysThisMonth(completedDates) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.activeDaysInRange(completedDates, start.getTime(), today.getTime());
  },

  formatConsistencySnippet(completedDates, streak, opts = {}) {
    const s = streak ?? this.computeStreak(completedDates);
    const monthDays = opts.activeDaysThisMonth ?? this.activeDaysThisMonth(completedDates);
    const todayDone = opts.completedToday ?? this.completedToday(completedDates);
    const best = opts.bestStreak ?? 0;

    if (!completedDates.length) {
      return "Tonight's win: waiting for you";
    }
    if (s === 0 && best > 0) {
      return `Best streak: ${best} days · showed up ${monthDays} days this month · ${todayDone ? "today logged" : "tonight's win pending"}`;
    }
    if (todayDone) {
      return `${s}-day streak · showed up ${monthDays} days this month · today's win logged`;
    }
    return `${s}-day streak · showed up ${monthDays} days this month · tonight's win pending`;
  },

  getWeakestPattern(patterns, patternDone, patternTotals = {}) {
    let weakest = null;
    let lowestRatio = 2;

    for (const pattern of patterns) {
      const done = patternDone[pattern._id] || 0;
      const total =
        patternTotals[pattern._id] ?? pattern.problemCount ?? Unlocks?.PROBLEMS_PER_PATTERN ?? 15;
      if (total <= 0 || done >= total) continue;

      const ratio = done / total;
      if (ratio < lowestRatio) {
        lowestRatio = ratio;
        weakest = { pattern, done, total, ratio };
      }
    }

    return weakest;
  },

  patternTotalsFromList(patterns) {
    const totals = {};
    for (const pattern of patterns) {
      totals[pattern._id] = pattern.problemCount ?? Unlocks?.PROBLEMS_PER_PATTERN ?? 15;
    }
    return totals;
  },

  getInsightMessage(stats, streak, completedDates = [], opts = {}) {
    const { totalCompleted, byDifficulty, daysSinceLastActive, bestStreak } = stats;
    const todayDone = this.completedToday(completedDates);
    const idle = daysSinceLastActive ?? opts.daysSinceLastActive;

    if (idle !== null && idle >= 2 && !todayDone) {
      const best = bestStreak ?? streak;
      return best > 0
        ? `Welcome back — you already proved you can hit a ${best}-day streak. One problem tonight restarts the rhythm.`
        : "Welcome back. One problem tonight is enough — consistency beats catching up in one night.";
    }

    if (totalCompleted === 0) {
      return "Your journey starts with one problem tonight. Pick one, solve it, and log your first win.";
    }
    if (todayDone && streak >= 7) {
      return `${streak}-day streak and today's win is logged. Consistency is your edge — same time tomorrow.`;
    }
    if (todayDone && streak >= 3) {
      return `${streak} days in a row with today's rep done. You're building the habit that interviews reward.`;
    }
    if (todayDone) {
      return "Today's win is logged. Rest up — your brain is wiring what you just solved.";
    }
    if (streak >= 7) {
      return `${streak}-day streak on the line. One problem tonight keeps the chain alive.`;
    }
    if (streak >= 3) {
      return `${streak} days strong. Show up tonight and keep the rhythm going.`;
    }
    if (totalCompleted === 1) {
      return "First win logged. Come back tomorrow — one problem at a time is the whole strategy.";
    }
    if ((byDifficulty?.Hard || 0) === 0 && totalCompleted >= 10) {
      return "Solid easy and medium reps. When you're ready, one hard problem a week builds real depth.";
    }
    if ((byDifficulty?.Easy || 0) > (byDifficulty?.Medium || 0) * 2) {
      return "Strong on fundamentals. Balance with a medium problem when you have the energy.";
    }
    return "One quality problem after work beats ten rushed ones. Pick tonight's and show up.";
  },

  getNextUpSuggestion(weakest) {
    if (!weakest) {
      return {
        title: "Start anywhere",
        detail: "Pick a pattern from the sidebar and solve one problem tonight.",
        cta: "Browse problems",
        href: "/",
      };
    }

    const { pattern, done, total } = weakest;
    const remaining = total - done;

    if (remaining <= 0) {
      return {
        title: "Explore a new pattern",
        detail: "This pattern is complete. Branch out for breadth on your next night.",
        cta: "View all problems",
        href: "/",
      };
    }

    return {
      title: pattern.name,
      detail: `${done} done in this pattern — ${remaining} left. A good focus for tonight's single rep.`,
      cta: "Solve in pattern",
      href: `/?pattern=${pattern.slug}`,
    };
  },
};
