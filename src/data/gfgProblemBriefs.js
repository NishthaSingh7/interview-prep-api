/**
 * Accurate briefs for GFG / variant problems — keyed by problem slug.
 * Used when LeetCode link is absent or does not match the title.
 */
const GFG_PROBLEM_BRIEFS = {
  "two-pointers-ext-triplets-with-sum-in-given-range": {
    scenario:
      "Count how many triplets in the array have a sum in the inclusive range [a, b]. Each triplet uses three distinct indices i < j < k.",
    given: "Integer array `arr`, and integers `a` and `b` defining the sum range.",
    output: "The count of triplets whose sum satisfies a ≤ sum ≤ b.",
    constraints: "Array may contain duplicates depending on platform; use three distinct indices.",
    examples: [
      {
        input: "arr = [2, 3, 4, 5], a = 6, b = 10",
        output: "1",
        explanation: "Only triplet (2, 3, 4) has sum 9, which lies in [6, 10].",
      },
      {
        input: "arr = [1, 2, 3, 4], a = 5, b = 7",
        output: "2",
        explanation: "Triplets (1,2,3) sum 6 and (1,2,4) sum 7 both qualify.",
      },
    ],
  },
  "sliding-window-ext-longest-substring-with-k-unique-characters": {
    scenario: "Find the length of the longest substring that contains at most K distinct characters.",
    given: "String `s` and integer `K`.",
    output: "Maximum length of a valid substring.",
    constraints: "K is at least 1. Substring must be contiguous.",
    examples: [
      {
        input: 's = "araaci", K = 2',
        output: "4",
        explanation: 'Longest valid substring is "araa" with characters a and r.',
      },
      {
        input: 's = "araaci", K = 1',
        output: "2",
        explanation: 'Longest with one distinct char is "aa".',
      },
    ],
  },
  "sliding-window-maximum-sum-subarray-of-size-k": {
    scenario: "Find the maximum sum among all contiguous subarrays of exactly length K.",
    given: "Integer array `nums` and integer `K`.",
    output: "Maximum sum of any length-K subarray.",
    constraints: "K is between 1 and nums.length.",
    examples: [
      { input: "nums = [2, 1, 5, 1, 3, 2], K = 3", output: "9", explanation: "Subarray [5,1,3] sums to 9." },
      { input: "nums = [2, 3, 4], K = 1", output: "4", explanation: "Best single element is 4." },
    ],
  },
  "sliding-window-ext-smallest-window-containing-all-characters": {
    scenario: "Find the smallest substring of `s` that contains every character from `t` (including duplicates).",
    given: "Strings `s` and `t`.",
    output: "Length of the minimum window, or 0 if impossible.",
    constraints: "Both strings use lowercase letters.",
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: "4", explanation: 'Minimum window is "BANC".' },
      { input: 's = "a", t = "a"', output: "1", explanation: "The whole string works." },
    ],
  },
  "sliding-window-ext-count-occurrences-of-anagram": {
    scenario: "Count how many substrings of `txt` are anagrams of `pat`.",
    given: "Strings `txt` and `pat`.",
    output: "Number of anagram substrings in txt.",
    constraints: "Compare substrings of length pat.length.",
    examples: [
      { input: 'txt = "forxxorfxdofr", pat = "for"', output: "3", explanation: "Three anagram windows of for." },
      { input: 'txt = "aabaabaa", pat = "aaba"', output: "4", explanation: "Four matching windows." },
    ],
  },
  "sliding-window-ext-subarray-with-given-sum": {
    scenario: "Find a contiguous subarray whose sum equals the target (non-negative numbers).",
    given: "Array of non-negative integers and target sum.",
    output: "1-based start and end indices of any valid subarray, or indicate not found.",
    constraints: "Elements are non-negative.",
    examples: [
      { input: "arr = [1, 2, 3, 7, 5], sum = 12", output: "[2, 4]", explanation: "Subarray [2,3,7] sums to 12." },
      { input: "arr = [1, 2, 3, 4, 5], sum = 15", output: "[1, 5]", explanation: "Whole array sums to 15." },
    ],
  },
  "sliding-window-ext-maximum-of-all-subarrays-of-size-k": {
    scenario: "For every sliding window of size K, report the maximum element in that window.",
    given: "Integer array `arr` and integer `K`.",
    output: "Array of maximums for each window position.",
    constraints: "1 ≤ K ≤ arr.length.",
    examples: [
      { input: "arr = [1, 3, -1, -3, 5, 3, 6, 7], K = 3", output: "[3, 3, 5, 5, 6, 7]", explanation: "Max of each length-3 window." },
      { input: "arr = [1], K = 1", output: "[1]", explanation: "Single window." },
    ],
  },
  "two-pointers-ext-pair-with-given-difference": {
    scenario: "Find whether any pair in the array has absolute difference equal to K.",
    given: "Integer array `arr` and integer `K`.",
    output: "true if such a pair exists, else false.",
    constraints: "Distinct indices; absolute difference.",
    examples: [
      { input: "arr = [5, 20, 3, 2, 5, 80], K = 78", output: "true", explanation: "Pair (2, 80) has difference 78." },
      { input: "arr = [1, 5, 3, 4, 2], K = 3", output: "true", explanation: "Pair (1, 4) works." },
    ],
  },
  "merge-intervals-ext-minimum-platforms-required": {
    scenario: "Find the minimum number of railway platforms needed so no train waits.",
    given: "Arrival and departure times of trains.",
    output: "Minimum platform count.",
    constraints: "Times are in sorted or unsorted order depending on input format.",
    examples: [
      { input: "arr = [900, 940, 950, 1100, 1500, 1800], dep = [910, 1200, 1120, 1130, 1900, 2000]", output: "3", explanation: "Three trains overlap at peak." },
      { input: "arr = [900, 940], dep = [910, 1200]", output: "1", explanation: "No overlap." },
    ],
  },
  "knapsack-01-ext-0-1-knapsack-problem": {
    scenario: "Maximize total value by picking items with weight and value, each item at most once, within capacity W.",
    given: "Weights array, values array, and capacity `W`.",
    output: "Maximum achievable value.",
    constraints: "Each item can be taken 0 or 1 times.",
    examples: [
      { input: "wt = [1,3,4,5], val = [1,4,5,7], W = 7", output: "9", explanation: "Pick items with wt 3+4, value 4+5=9." },
      { input: "wt = [2], val = [3], W = 1", output: "0", explanation: "Cannot fit any item." },
    ],
  },
};

/** Slugs where leetcodeLink exists but must NOT drive the brief (title ≠ linked problem). */
const SKIP_LEETCODE_BRIEF_SLUGS = new Set([
  "two-pointers-ext-triplets-with-sum-in-given-range",
  "sliding-window-ext-longest-substring-with-k-unique-characters",
  "two-pointers-ext-remove-duplicates-from-sorted-array-ii",
  "cyclic-sort-ext-sort-array-by-cyclic-swaps",
  "in-place-reversal-linked-list-ext-add-1-to-linked-list-number",
  "in-place-reversal-linked-list-ext-palindrome-linked-list-reverse-half",
  "fast-slow-pointers-ext-start-of-loop-in-linked-list",
  "merge-intervals-ext-insert-interval-in-sorted-list",
  "top-k-elements-ext-sort-by-frequency",
  "topological-sort-ext-longest-path-in-dag",
  "greedy-technique-ext-minimum-coins-greedy",
  "breadth-first-search-ext-shortest-path-in-maze",
  "breadth-first-search-ext-word-ladder-length",
  "two-heaps-ext-median-in-a-stream",
  "two-heaps-ext-sliding-window-median-ib",
  "two-heaps-ext-schedule-tasks-with-cooling",
  "k-way-merge-ext-smallest-range-from-k-lists",
  "k-way-merge-ext-merge-k-sorted-lists-ib",
  "top-k-elements-ext-top-k-frequent-numbers",
  "top-k-elements-ext-kth-smallest-in-row-wise-sorted-matrix",
  "bitwise-xor-ext-maximum-xor-pair",
  "bitwise-xor-ext-count-set-bits",
  "knapsack-01-ext-coin-change-ways",
  "longest-common-substring-ext-edit-distance-levenshtein",
  "longest-common-substring-ext-shortest-common-supersequence",
  "dynamic-programming-ext-climb-stairs-ways",
  "dynamic-programming-ext-decode-ways-count",
  "greedy-technique-ext-jump-game-reachable",
  "greedy-technique-ext-partition-labels-greedy",
  "subsets-ext-combination-sum-distinct-use",
  "depth-first-search-ext-course-schedule-cycle-detection",
  "topological-sort-ext-course-schedule-possible",
  "topological-sort-ext-alien-dictionary-order",
  "cyclic-sort-ext-first-missing-positive-cyclic",
  "bitwise-xor-missing-number",
  "greedy-technique-non-overlapping-intervals",
  "greedy-technique-minimum-number-of-arrows-to-burst-balloons",
  "greedy-technique-merge-triplets-to-form-target-triplet",
  "knapsack-01-split-array-largest-sum",
]);

module.exports = { GFG_PROBLEM_BRIEFS, SKIP_LEETCODE_BRIEF_SLUGS };
