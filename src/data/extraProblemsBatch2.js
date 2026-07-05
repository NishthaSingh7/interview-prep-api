const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const LC = (slug) => `https://leetcode.com/problems/${slug}/`;

/** 65 additional problems → 365 total with base 200 + extra 100 + batch2 65 */
const batch2Rows = [
  // Sliding Window (+4)
  ["sliding-window", "Find All Anagrams in a String", "Medium", LC("find-all-anagrams-in-a-string"), "LeetCode", ["string", "sliding-window"]],
  ["sliding-window", "Minimum Window Substring", "Hard", LC("minimum-window-substring"), "LeetCode", ["string", "sliding-window"]],
  ["sliding-window", "Grumpy Bookstore Owner", "Medium", LC("grumpy-bookstore-owner"), "LeetCode", ["array", "sliding-window"]],
  ["sliding-window", "Get Equal Substrings Within Budget", "Medium", LC("get-equal-substrings-within-budget"), "LeetCode", ["string", "sliding-window"]],

  // Two Pointers (+4)
  ["two-pointers", "Two Sum", "Easy", LC("two-sum"), "LeetCode", ["array", "two-pointers"]],
  ["two-pointers", "Valid Palindrome II", "Easy", LC("valid-palindrome-ii"), "LeetCode", ["string", "two-pointers"]],
  ["two-pointers", "Move Zeroes", "Easy", LC("move-zeroes"), "LeetCode", ["array", "two-pointers"]],
  ["two-pointers", "Is Subsequence", "Easy", LC("is-subsequence"), "LeetCode", ["string", "two-pointers"]],

  // Fast & Slow Pointers (+3)
  ["fast-slow-pointers", "Remove Linked List Elements", "Easy", LC("remove-linked-list-elements"), "LeetCode", ["linked-list"]],
  ["fast-slow-pointers", "Remove Nth Node From End of List", "Medium", LC("remove-nth-node-from-end-of-list"), "LeetCode", ["linked-list"]],
  ["fast-slow-pointers", "Intersection of Two Linked Lists", "Easy", LC("intersection-of-two-linked-lists"), "LeetCode", ["linked-list"]],

  // Merge Intervals (+3)
  ["merge-intervals", "Summary Ranges", "Easy", LC("summary-ranges"), "LeetCode", ["array", "intervals"]],
  ["merge-intervals", "Teemo Attacking", "Easy", LC("teemo-attacking"), "LeetCode", ["array", "intervals"]],
  ["merge-intervals", "My Calendar I", "Medium", LC("my-calendar-i"), "LeetCode", ["intervals"]],

  // Cyclic Sort (+3)
  ["cyclic-sort", "Contains Duplicate", "Easy", LC("contains-duplicate"), "LeetCode", ["array", "cyclic-sort"]],
  ["cyclic-sort", "First Bad Version", "Easy", LC("first-bad-version"), "LeetCode", ["array", "cyclic-sort"]],
  ["cyclic-sort", "Guess Number Higher or Lower", "Easy", LC("guess-number-higher-or-lower"), "LeetCode", ["array", "cyclic-sort"]],

  // Island / Matrix (+4)
  ["island-matrix-traversal", "Spiral Matrix", "Medium", LC("spiral-matrix"), "LeetCode", ["matrix"]],
  ["island-matrix-traversal", "Set Matrix Zeroes", "Medium", LC("set-matrix-zeroes"), "LeetCode", ["matrix"]],
  ["island-matrix-traversal", "Rotate Image", "Medium", LC("rotate-image"), "LeetCode", ["matrix"]],
  ["island-matrix-traversal", "Valid Sudoku", "Medium", LC("valid-sudoku"), "LeetCode", ["matrix"]],

  // In-place Linked List Reversal (+3)
  ["in-place-reversal-linked-list", "Copy List with Random Pointer", "Medium", LC("copy-list-with-random-pointer"), "LeetCode", ["linked-list"]],
  ["in-place-reversal-linked-list", "Delete Node in a Linked List", "Medium", LC("delete-node-in-a-linked-list"), "LeetCode", ["linked-list"]],
  ["in-place-reversal-linked-list", "Convert Binary Number in a Linked List to Integer", "Easy", LC("convert-binary-number-in-a-linked-list-to-integer"), "LeetCode", ["linked-list"]],

  // BFS (+3)
  ["breadth-first-search", "Nearest Exit from Entrance in Maze", "Medium", LC("nearest-exit-from-entrance-in-maze"), "LeetCode", ["graph", "bfs"]],
  ["breadth-first-search", "Shortest Path with Alternating Colors", "Medium", LC("shortest-path-with-alternating-colors"), "LeetCode", ["graph", "bfs"]],
  ["breadth-first-search", "01 Matrix", "Medium", LC("01-matrix"), "LeetCode", ["matrix", "bfs"]],

  // DFS (+3)
  ["depth-first-search", "Path Sum III", "Medium", LC("path-sum-iii"), "LeetCode", ["tree", "dfs"]],
  ["depth-first-search", "Sum Root to Leaf Numbers", "Medium", LC("sum-root-to-leaf-numbers"), "LeetCode", ["tree", "dfs"]],
  ["depth-first-search", "Binary Tree Right Side View", "Medium", LC("binary-tree-right-side-view"), "LeetCode", ["tree", "dfs"]],

  // Two Heaps (+3)
  ["two-heaps", "Find K Closest Elements", "Medium", LC("find-k-closest-elements"), "LeetCode", ["heap"]],
  ["two-heaps", "Last Stone Weight", "Easy", LC("last-stone-weight"), "LeetCode", ["heap"]],
  ["two-heaps", "Majority Element", "Easy", LC("majority-element"), "LeetCode", ["heap"]],

  // Subsets (+3)
  ["subsets", "Combination Sum III", "Medium", LC("combination-sum-iii"), "LeetCode", ["backtracking"]],
  ["subsets", "Restore IP Addresses", "Medium", LC("restore-ip-addresses"), "LeetCode", ["backtracking"]],
  ["subsets", "Valid Anagram", "Easy", LC("valid-anagram"), "LeetCode", ["backtracking"]],

  // Modified Binary Search (+4)
  ["modified-binary-search", "Search in Rotated Sorted Array II", "Medium", LC("search-in-rotated-sorted-array-ii"), "LeetCode", ["binary-search"]],
  ["modified-binary-search", "Find Minimum in Rotated Sorted Array II", "Hard", LC("find-minimum-in-rotated-sorted-array-ii"), "LeetCode", ["binary-search"]],
  ["modified-binary-search", "Search a 2D Matrix II", "Medium", LC("search-a-2d-matrix-ii"), "LeetCode", ["binary-search"]],
  ["modified-binary-search", "Sqrt(x)", "Easy", LC("sqrtx"), "LeetCode", ["binary-search"]],

  // Bitwise XOR (+3)
  ["bitwise-xor", "Power of Two", "Easy", LC("power-of-two"), "LeetCode", ["bit-manipulation"]],
  ["bitwise-xor", "Hamming Distance", "Easy", LC("hamming-distance"), "LeetCode", ["bit-manipulation"]],
  ["bitwise-xor", "Number Complement", "Easy", LC("number-complement"), "LeetCode", ["bit-manipulation"]],

  // Top K Elements (+3)
  ["top-k-elements", "Group Anagrams", "Medium", LC("group-anagrams"), "LeetCode", ["heap"]],
  ["top-k-elements", "Ransom Note", "Easy", LC("ransom-note"), "LeetCode", ["heap"]],
  ["top-k-elements", "Isomorphic Strings", "Easy", LC("isomorphic-strings"), "LeetCode", ["heap"]],

  // K-way Merge (+3)
  ["k-way-merge", "Merge Strings Alternately", "Easy", LC("merge-strings-alternately"), "LeetCode", ["merge"]],
  ["k-way-merge", "Multiply Strings", "Medium", LC("multiply-strings"), "LeetCode", ["merge"]],
  ["k-way-merge", "Add Strings", "Easy", LC("add-strings"), "LeetCode", ["merge"]],

  // Topological Sort (+3)
  ["topological-sort", "Find All Possible Recipes from Given Supplies", "Medium", LC("find-all-possible-recipes-from-given-supplies"), "LeetCode", ["graph", "topological-sort"]],
  ["topological-sort", "Loud and Rich", "Medium", LC("loud-and-rich"), "LeetCode", ["graph", "topological-sort"]],
  ["topological-sort", "Parallel Courses III", "Hard", LC("parallel-courses-iii"), "LeetCode", ["graph", "topological-sort"]],

  // 0/1 Knapsack (+3)
  ["knapsack-01", "Integer Break", "Medium", LC("integer-break"), "LeetCode", ["dynamic-programming"]],
  ["knapsack-01", "Minimum Cost For Tickets", "Medium", LC("minimum-cost-for-tickets"), "LeetCode", ["dynamic-programming"]],
  ["knapsack-01", "Maximal Square", "Medium", LC("maximal-square"), "LeetCode", ["dynamic-programming"]],

  // LCS (+3)
  ["longest-common-substring", "Longest Palindromic Substring", "Medium", LC("longest-palindromic-substring"), "LeetCode", ["dynamic-programming"]],
  ["longest-common-substring", "String to Integer (atoi)", "Medium", LC("string-to-integer-atoi"), "LeetCode", ["dynamic-programming"]],
  ["longest-common-substring", "Count and Say", "Medium", LC("count-and-say"), "LeetCode", ["dynamic-programming"]],

  // Dynamic Programming (+4)
  ["dynamic-programming", "Min Cost Climbing Stairs", "Easy", LC("min-cost-climbing-stairs"), "LeetCode", ["dynamic-programming"]],
  ["dynamic-programming", "Delete and Earn", "Medium", LC("delete-and-earn"), "LeetCode", ["dynamic-programming"]],
  ["dynamic-programming", "Product of Array Except Self", "Medium", LC("product-of-array-except-self"), "LeetCode", ["array", "dynamic-programming"]],
  ["dynamic-programming", "Maximum Product Subarray", "Medium", LC("maximum-product-subarray"), "LeetCode", ["dynamic-programming"]],

  // Greedy (+3)
  ["greedy-technique", "Best Time to Buy and Sell Stock II", "Medium", LC("best-time-to-buy-and-sell-stock-ii"), "LeetCode", ["greedy"]],
  ["greedy-technique", "Assign Cookies", "Easy", LC("assign-cookies"), "LeetCode", ["greedy"]],
  ["greedy-technique", "Lemonade Change", "Easy", LC("lemonade-change"), "LeetCode", ["greedy"]],
];

if (batch2Rows.length !== 65) {
  throw new Error(`Expected 65 batch2 problems, got ${batch2Rows.length}`);
}

const extraProblemsBatch2 = batch2Rows.map(([patternSlug, title, difficulty, link, source, tags]) => {
  const base = {
    patternSlug,
    title,
    slug: `${patternSlug}-batch2-${slugify(title)}`,
    difficulty,
    source,
    tags,
  };
  if (source === "LeetCode") {
    return { ...base, leetcodeLink: link };
  }
  return { ...base, practiceLink: link };
});

module.exports = { extraProblemsBatch2 };
