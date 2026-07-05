const Unlocks = {
  TOTAL_PROBLEMS: 365,
  PROBLEMS_PER_PATTERN: 18,
  FIRST_TIER_PATTERN_COUNT: 10,
  FIRST_TIER_TOTAL: 183,
  HARD_UNLOCK_RATIO: 0.15,
  ADVANCED_PATTERNS_UNLOCK_RATIO: 0.7,
  HARD_UNLOCK_REQUIRED: Math.ceil(365 * 0.15),
  ADVANCED_PATTERNS_REQUIRED: Math.ceil(183 * 0.7),

  catalogTotal(patterns = [], patternTotals = {}) {
    if (!patterns.length) return this.TOTAL_PROBLEMS;
    const sum = patterns.reduce(
      (n, p) => n + (patternTotals[p._id] ?? p.problemCount ?? 0),
      0,
    );
    return sum > 0 ? sum : this.TOTAL_PROBLEMS;
  },

  firstTierTotal(patterns = [], patternTotals = {}) {
    const tier = patterns.filter((p) => (p.order ?? 99) <= this.FIRST_TIER_PATTERN_COUNT);
    if (!tier.length) return this.FIRST_TIER_TOTAL;
    const sum = tier.reduce(
      (n, p) => n + (patternTotals[p._id] ?? p.problemCount ?? 0),
      0,
    );
    return sum > 0 ? sum : this.FIRST_TIER_TOTAL;
  },

  compute(firstTierDone, totalDone, patterns = [], patternTotals = {}) {
    const totalProblems = this.catalogTotal(patterns, patternTotals);
    const firstTierTotal = this.firstTierTotal(patterns, patternTotals);
    const hardUnlockRequired = Math.ceil(totalProblems * this.HARD_UNLOCK_RATIO);
    const advancedPatternsRequired = Math.ceil(firstTierTotal * this.ADVANCED_PATTERNS_UNLOCK_RATIO);

    return {
      totalProblems,
      problemsPerPattern: this.PROBLEMS_PER_PATTERN,
      firstTierTotal,
      advancedPatternsUnlocked: firstTierDone >= advancedPatternsRequired,
      hardUnlocked: totalDone >= hardUnlockRequired,
      advancedPatternsRequired,
      hardUnlockRequired,
      firstTierDone,
      totalDone,
    };
  },

  isAdvancedPattern(pattern) {
    return (pattern?.order ?? 99) > this.FIRST_TIER_PATTERN_COUNT;
  },

  isProblemLocked(problem, unlockState) {
    if (!Auth.isLoggedIn()) {
      if (problem.difficulty === "Hard") return true;
      const pattern = problem.patternId;
      if (pattern && this.isAdvancedPattern(pattern)) return true;
      return false;
    }
    if (problem.difficulty === "Hard" && !unlockState.hardUnlocked) return true;
    const pattern = problem.patternId;
    if (pattern && this.isAdvancedPattern(pattern) && !unlockState.advancedPatternsUnlocked) {
      return true;
    }
    return false;
  },

  getLockReason(problem, unlockState) {
    if (problem.difficulty === "Hard" && !unlockState.hardUnlocked) {
      const left = Math.max(0, unlockState.hardUnlockRequired - unlockState.totalDone);
      return `Solve ${left} more (${unlockState.hardUnlockRequired} total) to unlock Hard`;
    }
    if (
      problem.patternId &&
      this.isAdvancedPattern(problem.patternId) &&
      !unlockState.advancedPatternsUnlocked
    ) {
      const left = Math.max(0, unlockState.advancedPatternsRequired - unlockState.firstTierDone);
      return `Complete ${left} more in patterns 1–10 to unlock advanced patterns`;
    }
    return "";
  },

  getClientState(patternDone, patterns, patternTotals = {}) {
    const firstTierIds = new Set(patterns.slice(0, this.FIRST_TIER_PATTERN_COUNT).map((p) => p._id));
    let firstTierDone = 0;
    let totalDone = 0;
    for (const [pid, count] of Object.entries(patternDone)) {
      totalDone += count;
      if (firstTierIds.has(pid)) firstTierDone += count;
    }
    const totals = Object.keys(patternTotals).length
      ? patternTotals
      : Object.fromEntries(patterns.map((p) => [p._id, p.problemCount ?? 0]));
    return this.compute(firstTierDone, totalDone, patterns, totals);
  },
};
