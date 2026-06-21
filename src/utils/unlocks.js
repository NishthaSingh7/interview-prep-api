const TOTAL_PROBLEMS = 300;
const PROBLEMS_PER_PATTERN = 15;
const FIRST_TIER_PATTERN_COUNT = 10;
const FIRST_TIER_TOTAL = FIRST_TIER_PATTERN_COUNT * PROBLEMS_PER_PATTERN;
const ADVANCED_PATTERNS_UNLOCK_RATIO = 0.5;
const HARD_UNLOCK_RATIO = 0.25;

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

function isProblemLocked(problem, unlockState) {
  const pattern = problem.patternId;
  if (problem.difficulty === "Hard" && !unlockState.hardUnlocked) return true;
  if (isAdvancedPattern(pattern) && !unlockState.advancedPatternsUnlocked) return true;
  return false;
}

function getLockReason(problem, unlockState) {
  if (problem.difficulty === "Hard" && !unlockState.hardUnlocked) {
    const left = unlockState.hardUnlockRequired - unlockState.totalDone;
    return `Complete ${left} more problem${left === 1 ? "" : "s"} (${unlockState.hardUnlockRequired} total, 25%) to unlock Hard`;
  }
  if (isAdvancedPattern(problem.patternId) && !unlockState.advancedPatternsUnlocked) {
    const left = unlockState.advancedPatternsRequired - unlockState.firstTierDone;
    return `Complete ${left} more in patterns 1–10 (50%) to unlock this pattern`;
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
