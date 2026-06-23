const Unlocks = {
  TOTAL_PROBLEMS: 300,
  PROBLEMS_PER_PATTERN: 15,
  FIRST_TIER_PATTERN_COUNT: 10,
  FIRST_TIER_TOTAL: 150,
  HARD_UNLOCK_RATIO: 0.15,
  ADVANCED_PATTERNS_UNLOCK_RATIO: 0.7,
  HARD_UNLOCK_REQUIRED: Math.ceil(300 * 0.15),
  ADVANCED_PATTERNS_REQUIRED: Math.ceil(150 * 0.7),

  compute(firstTierDone, totalDone) {
    return {
      totalProblems: this.TOTAL_PROBLEMS,
      problemsPerPattern: this.PROBLEMS_PER_PATTERN,
      firstTierTotal: this.FIRST_TIER_TOTAL,
      advancedPatternsUnlocked: firstTierDone >= this.ADVANCED_PATTERNS_REQUIRED,
      hardUnlocked: totalDone >= this.HARD_UNLOCK_REQUIRED,
      advancedPatternsRequired: this.ADVANCED_PATTERNS_REQUIRED,
      hardUnlockRequired: this.HARD_UNLOCK_REQUIRED,
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
    const hardPct = Math.round(this.HARD_UNLOCK_RATIO * 100);
    const tierPct = Math.round(this.ADVANCED_PATTERNS_UNLOCK_RATIO * 100);

    if (problem.difficulty === "Hard" && !unlockState.hardUnlocked) {
      const left = Math.max(0, unlockState.hardUnlockRequired - unlockState.totalDone);
      return `Solve ${left} more (${unlockState.hardUnlockRequired} total · ${hardPct}%) to unlock Hard`;
    }
    if (
      problem.patternId &&
      this.isAdvancedPattern(problem.patternId) &&
      !unlockState.advancedPatternsUnlocked
    ) {
      const left = Math.max(0, unlockState.advancedPatternsRequired - unlockState.firstTierDone);
      return `Complete ${left} more in patterns 1–10 (${tierPct}%) to unlock advanced patterns`;
    }
    return "";
  },

  getClientState(patternDone, patterns) {
    const firstTierIds = new Set(patterns.slice(0, this.FIRST_TIER_PATTERN_COUNT).map((p) => p._id));
    let firstTierDone = 0;
    let totalDone = 0;
    for (const [pid, count] of Object.entries(patternDone)) {
      totalDone += count;
      if (firstTierIds.has(pid)) firstTierDone += count;
    }
    return this.compute(firstTierDone, totalDone);
  },
};
