/**
 * Problem-specific study approach steps — avoids generic pattern text for mismatched titles.
 */

const PROBLEM_APPROACHES = {
  "two-pointers-ext-triplets-with-sum-in-given-range": {
    optimal: "Sort + Two Pointers (Count in Range)",
    optimalDetail:
      "Sort the array. Count triplets with sum ≤ b, subtract count with sum < a. For each fixed anchor i, use two pointers on the rest to count pairs efficiently — not the same as finding triplets that sum to zero.",
    steps: [
      "Sort arr ascending.",
      "Define countLessThan(target): for each i, two-pointer count pairs (j,k) with arr[i]+arr[j]+arr[k] < target.",
      "Answer = countLessThan(b) − countLessThan(a − 1).",
      "When sum is too large at (j,k), move k left; when sum ≤ target, all pairs between j and k work — add (k−j) and move j right.",
    ],
  },
  "two-pointers-3sum": {
    optimal: "Sort + Anchor + Two Pointers",
    optimalDetail:
      "Fix one number as anchor (discipline bhai), then run classic Two Sum with two pointers on the remaining sorted array to find pairs that complete sum to zero.",
    steps: [
      "Sort nums.",
      "For each index i (anchor): set left = i+1, right = n−1.",
      "If nums[i]+nums[left]+nums[right] === 0: record triplet, skip duplicates, move both pointers.",
      "If sum < 0: left++; if sum > 0: right--.",
      "Skip duplicate anchor values to avoid repeated triplets.",
    ],
  },
  "two-pointers-4sum": {
    optimal: "Sort + Double Anchor + Two Pointers",
    optimalDetail: "Fix two numbers in outer loops, then two-pointer search for the remaining pair targeting (target − a − b).",
    steps: [
      "Sort nums.",
      "Two outer loops fix indices i and j (i < j).",
      "Two pointers on j+1..n−1 for remaining pair sum.",
      "Skip duplicates at each level.",
    ],
  },
  "two-pointers-sort-colors": {
    optimal: "Dutch National Flag (Three Pointers)",
    optimalDetail: "Maintain low, mid, high regions for 0, 1, 2. Single pass in-place partition.",
    steps: [
      "low = 0, mid = 0, high = n − 1.",
      "While mid ≤ high: 0 → swap with low; 1 → mid++; 2 → swap with high.",
      "Re-check mid after swapping with high.",
    ],
  },
  "sliding-window-ext-longest-substring-with-k-unique-characters": {
    optimal: "Sliding Window + Frequency Map",
    optimalDetail: "Expand window while distinct count ≤ K; shrink from left when distinct exceeds K.",
    steps: [
      "Track character counts in the window.",
      "Expand right; if distinct > K, shrink left until valid.",
      "Track max window length.",
    ],
  },
};

function titleKey(title) {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

function resolveStudyApproach(problem, patternSlug) {
  if (PROBLEM_APPROACHES[problem.slug]) {
    return PROBLEM_APPROACHES[problem.slug];
  }

  const t = titleKey(problem.title);

  if (/triplets? with sum in given range|triplets? with sum between/i.test(t)) {
    return PROBLEM_APPROACHES["two-pointers-ext-triplets-with-sum-in-given-range"];
  }
  if (t === "3sum") return PROBLEM_APPROACHES["two-pointers-3sum"];
  if (t === "4sum") return PROBLEM_APPROACHES["two-pointers-4sum"];
  if (/sort colors/i.test(t)) return PROBLEM_APPROACHES["two-pointers-sort-colors"];
  if (/longest substring with k unique|at most k distinct/i.test(t)) {
    return PROBLEM_APPROACHES["sliding-window-ext-longest-substring-with-k-unique-characters"];
  }
  if (/two sum ii/i.test(t)) {
    return {
      optimal: "Opposite-End Two Pointers",
      optimalDetail: "Sorted array: left at start, right at end. Move the pointer that fixes the sum toward target.",
      steps: [
        "left = 0, right = n − 1.",
        "If sum equals target: return 1-based indices.",
        "If sum too small: left++; if too large: right--.",
      ],
    };
  }
  if (/container with most water/i.test(t)) {
    return {
      optimal: "Two Pointers (Max Area)",
      optimalDetail: "Start at both ends. Always move the shorter line inward — the shorter side limits height.",
      steps: [
        "left = 0, right = n − 1, track max area.",
        "Area = min(height[left], height[right]) × (right − left).",
        "Move pointer at the shorter height.",
      ],
    };
  }
  if (/trapping rain|rain water/i.test(t)) {
    return {
      optimal: "Two Pointers or Prefix Max",
      optimalDetail: "Water at i = min(leftMax, rightMax) − height[i] when positive.",
      steps: [
        "Track leftMax scanning from left, rightMax from right.",
        "Or two pointers with running max from both sides.",
        "Sum trapped water at each index.",
      ],
    };
  }
  if (/merge triplets to form target/i.test(t)) {
    return {
      optimal: "Greedy Filter + Max Check",
      optimalDetail: "Keep triplets that fit inside target bounds; track running max per coordinate.",
      steps: [
        "Filter triplets where each value ≤ target's corresponding value.",
        "Track max seen at indices 0, 1, 2 across kept triplets.",
        "Target reachable iff all three maxes equal target.",
      ],
    };
  }

  return null;
}

module.exports = { resolveStudyApproach, PROBLEM_APPROACHES };
