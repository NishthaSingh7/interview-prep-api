const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const GFG = (path) => `https://www.geeksforgeeks.org/problems/${path}/1`;
const IB = (path) => `https://www.interviewbit.com/problems/${path}/`;
const HR = (path) => `https://www.hackerrank.com/challenges/${path}/problem`;

const extraRows = [
  // Sliding Window
  ["sliding-window", "Smallest Window Containing All Characters", "Medium", GFG("smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621"), "GeeksforGeeks", ["string", "sliding-window"]],
  ["sliding-window", "Count Occurrences of Anagram", "Medium", GFG("count-occurences-of-anagrams5839"), "GeeksforGeeks", ["string", "sliding-window"]],
  ["sliding-window", "Subarray with Given Sum", "Medium", GFG("subarray-with-given-sum-1587115621"), "GeeksforGeeks", ["array", "sliding-window"]],
  ["sliding-window", "Longest Substring with K Unique Characters", "Medium", "https://leetcode.com/problems/subarrays-with-k-different-integers/", "LeetCode", ["string", "sliding-window"]],
  ["sliding-window", "Maximum of All Subarrays of Size K", "Medium", GFG("maximum-of-all-subarrays-of-size-k3101"), "GeeksforGeeks", ["array", "sliding-window"]],
  // Two Pointers
  ["two-pointers", "Pair with Given Difference", "Easy", GFG("pairs-with-difference-k1713"), "GeeksforGeeks", ["array", "two-pointers"]],
  ["two-pointers", "Triplets with Sum in Given Range", "Medium", GFG("count-triplets-with-sum-smaller-than-x5549"), "GeeksforGeeks", ["array", "two-pointers"]],
  ["two-pointers", "Remove Duplicates from Sorted Array II", "Medium", "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/", "LeetCode", ["array", "two-pointers"]],
  ["two-pointers", "Partition Array According to Pivot", "Medium", "https://leetcode.com/problems/partition-array-according-to-pivot/", "LeetCode", ["two-pointers", "variant"]],
  ["two-pointers", "3Sum Closest", "Medium", "https://leetcode.com/problems/3sum-closest/", "LeetCode", ["two-pointers", "variant"]],
  // Fast & Slow Pointers
  ["fast-slow-pointers", "Detect Loop in Linked List", "Easy", GFG("detect-loop-in-linked-list"), "GeeksforGeeks", ["linked-list", "fast-slow-pointers"]],
  ["fast-slow-pointers", "Find Length of Loop", "Medium", GFG("find-length-of-loop"), "GeeksforGeeks", ["linked-list", "fast-slow-pointers"]],
  ["fast-slow-pointers", "Start of Loop in Linked List", "Medium", "https://leetcode.com/problems/linked-list-cycle-ii/", "LeetCode", ["linked-list", "fast-slow-pointers"]],
  ["fast-slow-pointers", "Floyd Cycle Detection (Array)", "Medium", "https://leetcode.com/problems/find-the-duplicate-number/", "LeetCode", ["array", "fast-slow-pointers"]],
  ["fast-slow-pointers", "Middle Element of Linked List", "Easy", GFG("finding-middle-element-in-a-linked-list"), "GeeksforGeeks", ["fast-slow-pointers", "linked-list"]],
  // Merge Intervals
  ["merge-intervals", "Overlapping Intervals", "Medium", GFG("overlapping-intervals"), "GeeksforGeeks", ["intervals"]],
  ["merge-intervals", "Insert Interval in Sorted List", "Medium", "https://leetcode.com/problems/insert-interval/", "LeetCode", ["intervals", "variant"]],
  ["merge-intervals", "Merge Overlapping Subintervals", "Medium", GFG("overlapping-intervals"), "GeeksforGeeks", ["array", "intervals"]],
  ["merge-intervals", "Attend Meetings (Max Overlap)", "Medium", GFG("n-meetings-in-one-room-1587115620"), "GeeksforGeeks", ["array", "intervals"]],
  ["merge-intervals", "Minimum Platforms Required", "Medium", GFG("minimum-platforms-1587115620"), "GeeksforGeeks", ["intervals", "variant"]],
  // Cyclic Sort
  ["cyclic-sort", "Find Missing in Array (1 to N)", "Easy", GFG("missing-number-in-array"), "GeeksforGeeks", ["cyclic-sort"]],
  ["cyclic-sort", "Find All Duplicates (1 to N)", "Medium", "https://leetcode.com/problems/find-all-duplicates-in-an-array/", "LeetCode", ["array", "cyclic-sort"]],
  ["cyclic-sort", "First Missing Positive (Cyclic)", "Hard", "https://leetcode.com/problems/first-missing-positive/", "LeetCode", ["array", "cyclic-sort"]],
  ["cyclic-sort", "Find Duplicate in Array (Index Marking)", "Medium", "https://leetcode.com/problems/find-the-duplicate-number/", "LeetCode", ["array", "cyclic-sort"]],
  ["cyclic-sort", "Sort Array by Cyclic Swaps", "Medium", "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/", "LeetCode", ["cyclic-sort", "variant"]],
  // Island/Matrix Traversal
  ["island-matrix-traversal", "Flood Fill", "Easy", GFG("flood-fill-algorithm1856"), "GeeksforGeeks", ["matrix", "dfs"]],
  ["island-matrix-traversal", "Count Distinct Islands", "Medium", "https://leetcode.com/problems/number-of-distinct-islands/", "LeetCode", ["matrix", "dfs", "variant"]],
  ["island-matrix-traversal", "Number of Enclaves", "Medium", GFG("number-of-enclaves"), "GeeksforGeeks", ["matrix", "dfs"]],
  ["island-matrix-traversal", "Replace O's with X's", "Medium", GFG("replace-os-with-xs"), "GeeksforGeeks", ["matrix", "dfs", "variant"]],
  ["island-matrix-traversal", "Rotten Oranges (Multi-source BFS)", "Medium", GFG("rotten-oranges"), "GeeksforGeeks", ["matrix", "bfs"]],
  // In-place Reversal Linked List
  ["in-place-reversal-linked-list", "Reverse a Linked List", "Easy", GFG("reverse-a-linked-list"), "GeeksforGeeks", ["linked-list"]],
  ["in-place-reversal-linked-list", "Reverse Nodes in K-Group (GFG)", "Hard", GFG("reverse-a-linked-list-in-groups-of-given-size"), "GeeksforGeeks", ["linked-list", "variant"]],
  ["in-place-reversal-linked-list", "Add 1 to Linked List Number", "Medium", GFG("add-1-to-a-number-represented-as-linked-list"), "GeeksforGeeks", ["linked-list"]],
  ["in-place-reversal-linked-list", "Reverse Alternate K Nodes", "Medium", GFG("given-a-linked-list-reverse-alternate-nodes-and-append-at-the-end"), "GeeksforGeeks", ["linked-list"]],
  ["in-place-reversal-linked-list", "Palindrome Linked List (Reverse Half)", "Easy", "https://leetcode.com/problems/palindrome-linked-list/", "LeetCode", ["linked-list", "variant"]],
  // BFS
  ["breadth-first-search", "Level Order Traversal", "Medium", GFG("level-order-traversal"), "GeeksforGeeks", ["tree", "bfs"]],
  ["breadth-first-search", "Zigzag Level Order", "Medium", "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", "LeetCode", ["tree", "bfs", "variant"]],
  ["breadth-first-search", "Word Ladder Length", "Hard", "https://leetcode.com/problems/word-ladder/", "LeetCode", ["graph", "bfs"]],
  ["breadth-first-search", "Knight Minimum Moves", "Medium", GFG("knight-walk4521"), "GeeksforGeeks", ["graph", "bfs"]],
  ["breadth-first-search", "Shortest Path in Maze", "Medium", "https://leetcode.com/problems/shortest-path-in-binary-matrix/", "LeetCode", ["graph", "bfs", "variant"]],
  // DFS
  ["depth-first-search", "Path Sum in Binary Tree", "Easy", GFG("root-to-leaf-paths"), "GeeksforGeeks", ["tree", "dfs"]],
  ["depth-first-search", "All Root-to-Leaf Paths", "Medium", "https://leetcode.com/problems/binary-tree-paths/", "LeetCode", ["tree", "dfs"]],
  ["depth-first-search", "Word Search in Grid", "Medium", GFG("word-search"), "GeeksforGeeks", ["matrix", "dfs"]],
  ["depth-first-search", "Number of Islands (DFS)", "Medium", GFG("find-the-number-of-islands"), "GeeksforGeeks", ["graph", "matrix", "dfs"]],
  ["depth-first-search", "Course Schedule (Cycle Detection)", "Medium", "https://leetcode.com/problems/course-schedule/", "LeetCode", ["graph", "dfs"]],
  // Two Heaps
  ["two-heaps", "Median in a Stream", "Hard", "https://leetcode.com/problems/find-median-from-data-stream/", "LeetCode", ["heap"]],
  ["two-heaps", "Sliding Window Median (IB)", "Hard", "https://leetcode.com/problems/sliding-window-median/", "LeetCode", ["heap", "variant"]],
  ["two-heaps", "Kth Largest in Stream", "Easy", GFG("kth-largest-element-in-a-stream2220"), "GeeksforGeeks", ["heap"]],
  ["two-heaps", "Rearrange String (No Adjacent Same)", "Medium", GFG("rearrange-characters"), "GeeksforGeeks", ["heap", "variant"]],
  ["two-heaps", "Schedule Tasks with Cooling", "Medium", "https://leetcode.com/problems/task-scheduler/", "LeetCode", ["heap", "variant"]],
  // Subsets
  ["subsets", "Generate All Subsets", "Medium", GFG("power-set"), "GeeksforGeeks", ["backtracking"]],
  ["subsets", "Subset Sum Exists", "Medium", "https://www.geeksforgeeks.org/problems/subset-sum-problem/1", "GeeksforGeeks", ["backtracking", "variant"]],
  ["subsets", "Permutations of String", "Medium", GFG("permutations-of-a-given-string"), "GeeksforGeeks", ["backtracking"]],
  ["subsets", "Combination Sum (Distinct Use)", "Medium", "https://leetcode.com/problems/combination-sum/", "LeetCode", ["backtracking"]],
  ["subsets", "Generate Valid Parentheses", "Medium", GFG("generate-all-possible-parentheses"), "GeeksforGeeks", ["backtracking", "variant"]],
  // Modified Binary Search
  ["modified-binary-search", "Search in Rotated Array", "Medium", GFG("search-in-a-rotated-array"), "GeeksforGeeks", ["binary-search"]],
  ["modified-binary-search", "First and Last Position", "Medium", "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", "LeetCode", ["binary-search", "variant"]],
  ["modified-binary-search", "Square Root (Binary Search)", "Easy", GFG("square-root"), "GeeksforGeeks", ["binary-search", "variant"]],
  ["modified-binary-search", "Aggressive Cows (Binary Search Answer)", "Hard", "https://www.geeksforgeeks.org/problems/aggressive-cows/1", "GeeksforGeeks", ["binary-search", "variant"]],
  ["modified-binary-search", "Minimum Days to Make Bouquets", "Medium", "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/", "LeetCode", ["binary-search", "variant"]],
  // Bitwise XOR
  ["bitwise-xor", "Find Two Unique Numbers", "Medium", GFG("two-numbers-with-odd-occurrences5846"), "GeeksforGeeks", ["bit-manipulation"]],
  ["bitwise-xor", "Single Number (XOR)", "Easy", GFG("single-number"), "GeeksforGeeks", ["bit-manipulation"]],
  ["bitwise-xor", "Count Set Bits", "Easy", "https://leetcode.com/problems/counting-bits/", "LeetCode", ["bit-manipulation"]],
  ["bitwise-xor", "XOR from L to R", "Medium", "https://leetcode.com/problems/xor-queries-of-a-subarray/", "LeetCode", ["bit-manipulation"]],
  ["bitwise-xor", "Maximum XOR Pair", "Medium", "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/", "LeetCode", ["bit-manipulation", "variant"]],
  // Top K Elements
  ["top-k-elements", "Kth Largest Element", "Medium", GFG("k-largest-elements"), "GeeksforGeeks", ["heap"]],
  ["top-k-elements", "Top K Frequent Numbers", "Medium", "https://leetcode.com/problems/top-k-frequent-elements/", "LeetCode", ["heap"]],
  ["top-k-elements", "K Closest Points", "Medium", GFG("k-closest-points-to-origin"), "GeeksforGeeks", ["heap"]],
  ["top-k-elements", "Sort by Frequency", "Medium", "https://leetcode.com/problems/top-k-frequent-elements/", "LeetCode", ["heap", "variant"]],
  ["top-k-elements", "Kth Smallest in Row-wise Sorted Matrix", "Medium", "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/", "LeetCode", ["heap", "variant"]],
  // K-way Merge
  ["k-way-merge", "Merge K Sorted Arrays", "Hard", GFG("merge-k-sorted-arrays"), "GeeksforGeeks", ["merge"]],
  ["k-way-merge", "Merge Two Sorted Lists (GFG)", "Easy", GFG("merge-two-sorted-linked-lists"), "GeeksforGeeks", ["merge"]],
  ["k-way-merge", "Merge K Sorted Lists (IB)", "Hard", "https://leetcode.com/problems/merge-k-sorted-lists/", "LeetCode", ["merge"]],
  ["k-way-merge", "Smallest Range from K Lists", "Hard", "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/", "LeetCode", ["merge", "variant"]],
  ["k-way-merge", "Merge Sorted Arrays Without Extra Space", "Hard", GFG("merge-two-sorted-arrays"), "GeeksforGeeks", ["merge", "variant"]],
  // Topological Sort
  ["topological-sort", "Topological Sort of DAG", "Medium", GFG("topological-sort"), "GeeksforGeeks", ["graph"]],
  ["topological-sort", "Course Schedule Possible", "Medium", "https://leetcode.com/problems/course-schedule/", "LeetCode", ["graph"]],
  ["topological-sort", "Alien Dictionary Order", "Hard", GFG("alien-dictionary"), "GeeksforGeeks", ["graph", "topological-sort"]],
  ["topological-sort", "Sequence Reconstruction Check", "Medium", GFG("prerequisite-tasks"), "GeeksforGeeks", ["graph", "topological-sort"]],
  ["topological-sort", "Longest Path in DAG", "Medium", "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", "LeetCode", ["graph", "variant"]],
  // 0/1 Knapsack
  ["knapsack-01", "0/1 Knapsack Problem", "Medium", GFG("0-1-knapsack-problem"), "GeeksforGeeks", ["dynamic-programming"]],
  ["knapsack-01", "Subset Sum (Knapsack)", "Medium", "https://www.geeksforgeeks.org/problems/subset-sum-problem/1", "GeeksforGeeks", ["dynamic-programming"]],
  ["knapsack-01", "Equal Sum Partition", "Medium", "https://leetcode.com/problems/partition-equal-subset-sum/", "LeetCode", ["dynamic-programming"]],
  ["knapsack-01", "Coin Change Ways", "Medium", "https://leetcode.com/problems/coin-change/", "LeetCode", ["dynamic-programming"]],
  ["knapsack-01", "Target Sum (Assign +/-)", "Medium", GFG("target-sum"), "GeeksforGeeks", ["dynamic-programming", "variant"]],
  // LCS
  ["longest-common-substring", "LCS of Two Strings", "Medium", GFG("longest-common-subsequence"), "GeeksforGeeks", ["dynamic-programming"]],
  ["longest-common-substring", "Edit Distance (Levenshtein)", "Medium", "https://leetcode.com/problems/edit-distance/", "LeetCode", ["dynamic-programming"]],
  ["longest-common-substring", "Longest Common Substring Length", "Medium", GFG("longest-common-substring"), "GeeksforGeeks", ["dynamic-programming"]],
  ["longest-common-substring", "Shortest Common Supersequence", "Hard", "https://leetcode.com/problems/shortest-common-supersequence/", "LeetCode", ["dynamic-programming"]],
  ["longest-common-substring", "Distinct Subsequences Count", "Hard", "https://leetcode.com/problems/distinct-subsequences/", "LeetCode", ["dynamic-programming"]],
  // Dynamic Programming
  ["dynamic-programming", "Fibonacci (DP)", "Easy", GFG("nth-fibonacci-number1335"), "GeeksforGeeks", ["dynamic-programming"]],
  ["dynamic-programming", "Climb Stairs (Ways)", "Easy", "https://leetcode.com/problems/climbing-stairs/", "LeetCode", ["dynamic-programming"]],
  ["dynamic-programming", "House Robber (Linear)", "Medium", GFG("stickler-theif-1587115621"), "GeeksforGeeks", ["dynamic-programming"]],
  ["dynamic-programming", "Decode Ways Count", "Medium", "https://leetcode.com/problems/decode-ways/", "LeetCode", ["dynamic-programming"]],
  ["dynamic-programming", "Word Break Possible", "Medium", GFG("word-break"), "GeeksforGeeks", ["dynamic-programming", "variant"]],
  // Greedy
  ["greedy-technique", "Activity Selection", "Medium", GFG("activity-selection-1587115620"), "GeeksforGeeks", ["greedy"]],
  ["greedy-technique", "Jump Game Reachable", "Medium", "https://leetcode.com/problems/jump-game/", "LeetCode", ["greedy"]],
  ["greedy-technique", "Gas Station Circuit", "Medium", GFG("circular-tour-1587115620"), "GeeksforGeeks", ["greedy"]],
  ["greedy-technique", "Partition Labels (Greedy)", "Medium", "https://leetcode.com/problems/partition-labels/", "LeetCode", ["greedy"]],
  ["greedy-technique", "Minimum Coins (Greedy)", "Medium", GFG("number-of-coins1824"), "GeeksforGeeks", ["greedy"]],
];

const extraProblems = extraRows.map(([patternSlug, title, difficulty, link, source, tags]) => {
  const base = {
    patternSlug,
    title,
    slug: `${patternSlug}-ext-${slugify(title)}`,
    difficulty,
    source,
    tags,
  };
  if (source === "LeetCode") {
    return { ...base, leetcodeLink: link };
  }
  return { ...base, practiceLink: link };
});

module.exports = { extraProblems };
