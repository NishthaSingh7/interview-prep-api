const TOTAL_PROBLEMS = 365;
const PROBLEMS_PER_PATTERN = 18;
const FIRST_TIER_PATTERN_COUNT = 10;
const FIRST_TIER_TOTAL = Math.ceil(365 * (10 / 20));
const ADVANCED_PATTERNS_UNLOCK_RATIO = 0.7;
const HARD_UNLOCK_RATIO = 0.15;

const ADVANCED_PATTERNS_REQUIRED = Math.ceil(FIRST_TIER_TOTAL * ADVANCED_PATTERNS_UNLOCK_RATIO);
const HARD_UNLOCK_REQUIRED = Math.ceil(TOTAL_PROBLEMS * HARD_UNLOCK_RATIO);

function computeUnlockState(totalDone, firstTierDone) {
  return {
    totalProblems: TOTAL_PROBLEMS,
    problemsPerPattern: PROBLEMS_PER_PATTERN,
    firstTierTotal: FIRST_TIER_TOTAL,
    advancedPatternsUnlocked: firstTierDone >= ADVANCED_PATTERNS_REQUIRED,
    hardUnlocked: totalDone >= HARD_UNLOCK_REQUIRED,
    advancedPatternsRequired: ADVANCED_PATTERNS_REQUIRED,
    hardUnlockRequired: HARD_UNLOCK_REQUIRED,
    firstTierDone,
    totalDone,
  };
}

function getPatternOrder(pattern) {
  if (!pattern) return 99;
  return pattern.order ?? 99;
}

function isAdvancedPattern(pattern) {
  return getPatternOrder(pattern) > FIRST_TIER_PATTERN_COUNT;
}

function isProblemLocked() {
  return false;
}

function getLockReason(problem, unlockState) {
  if (problem.difficulty === "Hard" && !unlockState.hardUnlocked) {
    const left = unlockState.hardUnlockRequired - unlockState.totalDone;
    return `Complete ${left} more problem${left === 1 ? "" : "s"} (${unlockState.hardUnlockRequired} total, 15%) to unlock Hard`;
  }
  if (isAdvancedPattern(problem.patternId) && !unlockState.advancedPatternsUnlocked) {
    const left = unlockState.advancedPatternsRequired - unlockState.firstTierDone;
    return `Complete ${left} more in patterns 1–10 (70%) to unlock this pattern`;
  }
  return "";
}

module.exports = {
  TOTAL_PROBLEMS,
  PROBLEMS_PER_PATTERN,
  FIRST_TIER_PATTERN_COUNT,
  FIRST_TIER_TOTAL,
  ADVANCED_PATTERNS_REQUIRED,
  HARD_UNLOCK_REQUIRED,
  computeUnlockState,
  isAdvancedPattern,
  isProblemLocked,
  getLockReason,
  getPatternOrder,
};
