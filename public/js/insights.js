const Insights = {
  TOTAL_PROBLEMS: 300,

  computeStreak(completedDates) {
    const days = new Set(
      completedDates
        .filter(Boolean)
        .map((d) => {
          const date = new Date(d);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        }),
    );

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

  getInsightMessage(stats, streak) {
    const { totalCompleted, byDifficulty } = stats;
    const pct = Math.round((totalCompleted / this.TOTAL_PROBLEMS) * 100);

    if (totalCompleted === 0) {
      return "Your journey starts with one checkbox. Pick an easy problem tonight and log your first win.";
    }
    if (totalCompleted === 1) {
      return "First problem down. Most people never get this far — you're already ahead.";
    }
    if (pct >= 100) {
      return "300/300. You ran the full AfterHours curriculum. Time to redo, optimize, and mock interviews.";
    }
    if (pct >= 75) {
      return "You're in the final stretch. The last 25% is where interview confidence becomes real.";
    }
    if (pct >= 50) {
      return "Halfway there. Your pattern recognition is compounding — keep the nightly reps going.";
    }
    if (streak >= 7) {
      return `${streak}-day streak. Consistency beats cramming — you're building interview muscle memory.`;
    }
    if (streak >= 3) {
      return `${streak} days in a row. This rhythm is exactly what separates prepared candidates from everyone else.`;
    }
    if ((byDifficulty?.Hard || 0) === 0 && totalCompleted >= 10) {
      return "Solid easy and medium reps. Consider tackling a hard problem this week to level up.";
    }
    if ((byDifficulty?.Easy || 0) > (byDifficulty?.Medium || 0) * 2) {
      return "Strong on easy wins. Mix in more medium problems to sharpen your interview edge.";
    }
    return `${pct}% complete. Show up after hours, stack small wins, and the graph will climb.`;
  },

  getNextUpSuggestion(weakest) {
    if (!weakest) {
      return {
        title: "Start anywhere",
        detail: "Pick a pattern from the sidebar and solve your first problem tonight.",
        cta: "Browse problems",
        href: "/",
      };
    }

    const { pattern, done, total } = weakest;
    const remaining = total - done;

    if (remaining <= 0) {
      return {
        title: "Explore a new pattern",
        detail: "This pattern is complete. Branch out and keep your reps diverse.",
        cta: "View all problems",
        href: "/",
      };
    }

    return {
      title: pattern.name,
      detail: `${done}/${total} done in this pattern — ${remaining} left. Focus here to balance your progress.`,
      cta: "Solve next in pattern",
      href: `/?pattern=${pattern.slug}`,
    };
  },
};
