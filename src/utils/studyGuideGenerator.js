/**
 * Generates full Study-route guides (separate from Solve brief popups).
 */
const { buildProblemBrief } = require("./problemBrief");
const { resolveStudyApproach } = require("./studyApproachResolver");

const PATTERN_META = {
  "sliding-window": {
    name: "Sliding Window",
    optimal: "Sliding Window",
    naive: "Brute Force (check every subarray)",
    naiveDetail:
      "Enumerate every contiguous subarray or substring, compute the required statistic for each, and keep the best answer. Correct but O(n²) or worse.",
    optimalDetail:
      "Maintain a window with left and right pointers. Expand right to grow the window, shrink left when a constraint breaks, and update the answer whenever the window is valid.",
    codeTemplate: (fn) => `function ${fn}(nums, k) {
  let left = 0;
  let best = 0;
  // window state: sum, counts, etc.

  for (let right = 0; right < nums.length; right++) {
    // add nums[right] to window

    while (/* window invalid */) {
      // remove nums[left]
      left++;
    }

    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  },
  "two-pointers": {
    name: "Two Pointers",
    optimal: "Two Pointers",
    naive: "Brute Force (all pairs or triplets)",
    naiveDetail:
      "Check all pairs or triplets with nested loops. Works on unsorted data but costs O(n²) or O(n³) time and extra bookkeeping for duplicates.",
    optimalDetail:
      "Use two indices scanning the array — often from opposite ends on sorted data, or read/write pointers for in-place work. Each pointer move eliminates many bad candidates at once.",
    codeTemplate: (fn) => `function ${fn}(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    // compare or swap based on nums[left] and nums[right]
    if (/* condition met */) {
      left++;
      right--;
    } else if (/* move left */) {
      left++;
    } else {
      right--;
    }
  }
  return /* answer */;
}`,
  },
  "fast-slow-pointers": {
    name: "Fast & Slow Pointers",
    optimal: "Floyd's Fast & Slow Pointers",
    naive: "Hash set of visited nodes",
    naiveDetail: "Track every visited node or state in a set. Simple to code but O(n) extra space.",
    optimalDetail:
      "Advance slow one step and fast two steps. If there is a cycle they meet; for middle-finding, when fast hits the end, slow is at the midpoint.",
    codeTemplate: (fn) => `function ${fn}(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true; // cycle
  }
  return false;
}`,
  },
  "merge-intervals": {
    name: "Merge Intervals",
    optimal: "Sort and Merge",
    naive: "Compare all pairs of intervals",
    naiveDetail: "Check every pair for overlap and merge repeatedly until stable. Easy to get wrong on transitive overlaps.",
    optimalDetail: "Sort intervals by start time, then sweep once merging when current interval overlaps the previous.",
    codeTemplate: (fn) => `function ${fn}(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}`,
  },
  "cyclic-sort": {
    name: "Cyclic Sort",
    optimal: "Cyclic Sort (place each value at index value-1)",
    naive: "Extra array or hash map",
    naiveDetail: "Copy values into a new array or use a map to track presence. O(n) time but O(n) space.",
    optimalDetail:
      "Each number belongs at index num-1. Swap nums[i] to its correct position; only move i forward when nums[i] is wrong.",
    codeTemplate: (fn) => `function ${fn}(nums) {
  let i = 0;
  while (i < nums.length) {
    const correct = nums[i] - 1;
    if (nums[i] !== nums[correct]) {
      [nums[i], nums[correct]] = [nums[correct], nums[i]];
    } else {
      i++;
    }
  }
}`,
  },
  "island-matrix-traversal": {
    name: "Island / Matrix Traversal",
    optimal: "DFS or BFS on grid",
    naive: "Flood fill every unvisited cell",
    naiveDetail: "For each cell, if not visited, run DFS/BFS to mark the component. Standard graph traversal on implicit grid graph.",
    optimalDetail:
      "Same traversal but prune early: check bounds, visited state, and problem-specific conditions before recursing or enqueuing.",
    codeTemplate: (fn) => `function ${fn}(grid) {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === "0") return;
    grid[r][c] = "0";
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") { count++; dfs(r, c); }
    }
  }
  return count;
}`,
  },
  "in-place-reversal-linked-list": {
    name: "In-place Linked List Reversal",
    optimal: "Iterative pointer reversal",
    naive: "Stack or array of values",
    naiveDetail: "Push all values, pop into new order. O(n) space.",
    optimalDetail: "Reverse links in place with prev, curr, next pointers — O(1) space.",
    codeTemplate: (fn) => `function ${fn}(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
  },
  "breadth-first-search": {
    name: "Breadth-First Search",
    optimal: "BFS with queue",
    naive: "DFS with deep recursion",
    naiveDetail: "DFS can work but BFS guarantees shortest path in unweighted graphs.",
    optimalDetail: "Queue nodes level by level; track distance or state when first dequeued.",
    codeTemplate: (fn) => `function ${fn}(start) {
  const queue = [start];
  const visited = new Set([start]);
  while (queue.length) {
    const node = queue.shift();
    for (const nei of neighbors(node)) {
      if (!visited.has(nei)) {
        visited.add(nei);
        queue.push(nei);
      }
    }
  }
}`,
  },
  "depth-first-search": {
    name: "Depth-First Search",
    optimal: "DFS (recursive or stack)",
    naive: "Generate all paths",
    naiveDetail: "Enumerate every path explicitly — exponential.",
    optimalDetail: "Explore one branch fully, backtrack, mark visited to avoid cycles.",
    codeTemplate: (fn) => `function ${fn}(node, visited = new Set()) {
  if (!node || visited.has(node)) return;
  visited.add(node);
  for (const child of node.children) {
    ${fn}(child, visited);
  }
}`,
  },
  "two-heaps": {
    name: "Two Heaps",
    optimal: "Max-heap + min-heap",
    naive: "Sort on every insert",
    naiveDetail: "Keep full sorted list — O(n log n) per operation.",
    optimalDetail: "Max-heap for lower half, min-heap for upper half; balance sizes to read median in O(1).",
    codeTemplate: (fn) => `function ${fn}() {
  // maxHeap for lower half, minHeap for upper half
}`,
  },
  subsets: {
    name: "Subsets / Backtracking",
    optimal: "Backtracking",
    naive: "Iterative bitmask",
    naiveDetail: "Generate all 2^n subsets — fine for small n.",
    optimalDetail: "Choose / skip each element recursively; prune when constraint violated.",
    codeTemplate: (fn) => `function ${fn}(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
  },
  "modified-binary-search": {
    name: "Modified Binary Search",
    optimal: "Binary search on answer or rotated array",
    naive: "Linear scan",
    naiveDetail: "Scan entire array O(n).",
    optimalDetail: "Maintain lo/hi; compare mid with bounds or feasibility predicate.",
    codeTemplate: (fn) => `function ${fn}(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  },
  "bitwise-xor": {
    name: "Bitwise XOR",
    optimal: "XOR cancellation",
    naive: "Hash map counts",
    naiveDetail: "Count frequencies — O(n) space.",
    optimalDetail: "a ^ a = 0; XOR all numbers — duplicates cancel, unique remains.",
    codeTemplate: (fn) => `function ${fn}(nums) {
  return nums.reduce((acc, n) => acc ^ n, 0);
}`,
  },
  "top-k-elements": {
    name: "Top K Elements",
    optimal: "Min-heap of size K",
    naive: "Full sort",
    naiveDetail: "Sort and take first k — O(n log n).",
    optimalDetail: "Heap of size k: push, pop smallest when size > k. O(n log k).",
    codeTemplate: (fn) => `function ${fn}(nums, k) {
  // maintain min-heap of size k
}`,
  },
  "k-way-merge": {
    name: "K-way Merge",
    optimal: "Min-heap over k heads",
    naive: "Merge two at a time",
    naiveDetail: "Repeated pairwise merge — slower than heap.",
    optimalDetail: "Push head of each list into heap; pop smallest, advance that list.",
    codeTemplate: (fn) => `function ${fn}(lists) {
  // min-heap of {val, listIndex, node}
}`,
  },
  "topological-sort": {
    name: "Topological Sort",
    optimal: "Kahn's BFS or DFS post-order",
    naive: "Try all orderings",
    naiveDetail: "Permutation check — factorial time.",
    optimalDetail: "Track indegree; queue zero-indegree nodes; peel layers.",
    codeTemplate: (fn) => `function ${fn}(n, edges) {
  // build graph, indegree, BFS queue
}`,
  },
  "knapsack-01": {
    name: "0/1 Knapsack",
    optimal: "DP table",
    naive: "Recursion without memo",
    naiveDetail: "Try include/exclude each item — exponential.",
    optimalDetail: "dp[i][w] = max value using first i items with capacity w.",
    codeTemplate: (fn) => `function ${fn}(weights, values, capacity) {
  const dp = Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}`,
  },
  "longest-common-substring": {
    name: "Longest Common Subsequence",
    optimal: "2D DP",
    naive: "Recursive LCS",
    naiveDetail: "Recompute subproblems — exponential without memo.",
    optimalDetail: "dp[i][j] = LCS length of first i chars of A and first j of B.",
    codeTemplate: (fn) => `function ${fn}(a, b) {
  const dp = Array(a.length + 1).fill(0).map(() => Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[a.length][b.length];
}`,
  },
  "dynamic-programming": {
    name: "Dynamic Programming",
    optimal: "Tabulation or memoization",
    naive: "Pure recursion",
    naiveDetail: "Overlapping subproblems recomputed — slow.",
    optimalDetail: "Define state, recurrence, base cases; fill table bottom-up or top-down with cache.",
    codeTemplate: (fn) => `function ${fn}(n) {
  const dp = Array(n + 1).fill(0);
  dp[0] = /* base */;
  for (let i = 1; i <= n; i++) {
    dp[i] = /* recurrence using dp[i-1], etc. */;
  }
  return dp[n];
}`,
  },
  "greedy-technique": {
    name: "Greedy",
    optimal: "Greedy choice + proof",
    naive: "Try all combinations",
    naiveDetail: "Exhaustive search over choices.",
    optimalDetail: "Sort or prioritize locally best option; prove it never blocks global optimum.",
    codeTemplate: (fn) => `function ${fn}(nums) {
  nums.sort((a, b) => a - b);
  // greedy scan
}`,
  },
};

const TITLE_GUIDES = {
  "sort colors": require("../data/studyGuideOverrides/sort-colors"),
};

function fnName(slug) {
  const base = slug.split("-").slice(1).join("_") || "solve";
  return base.replace(/[^a-z0-9_]/gi, "_").replace(/^(\d)/, "_$1") || "solve";
}

function parseArrayFromExample(input = "") {
  const m = String(input).match(/=\s*(\[[^\]]*\])/);
  if (!m) return null;
  try {
    return JSON.parse(m[1].replace(/'/g, '"'));
  } catch {
    return null;
  }
}

function estimateReadMin(sections) {
  let words = 0;
  for (const s of sections) {
    for (const b of s.blocks || []) {
      if (b.text) words += b.text.split(/\s+/).length;
      if (b.items) words += b.items.join(" ").split(/\s+/).length;
      if (b.steps) words += b.steps.join(" ").split(/\s+/).length;
    }
  }
  return Math.max(5, Math.min(15, Math.round(words / 180)));
}

function buildStatement(problem, brief) {
  const constraints = brief.constraints
    ? brief.constraints.split(/(?<=[.!])\s+/).filter(Boolean)
    : ["See examples for valid input sizes and value ranges."];

  const descriptionParts = [];
  if (brief.given) descriptionParts.push(brief.given.replace(/^You are given /i, "You are given "));
  if (brief.output) descriptionParts.push(brief.output);

  return {
    description: descriptionParts.join(" ").trim() || brief.scenario,
    examples: (brief.examples || []).map((ex) => ({
      input: ex.input,
      output: ex.output,
      explanation: ex.explanation || "",
    })),
    constraints,
    followUp: problem.difficulty === "Hard" ? "Can you optimize time or space further?" : null,
  };
}

function walkthroughSteps(example, patternSlug, approachIndex) {
  const arr = parseArrayFromExample(example.input);
  const steps = [`Input: ${example.input}`, `Expected output: ${example.output}`];

  if (arr && arr.length && approachIndex === 0) {
    steps.push(`Brute force would try every valid combination or scan every subarray — at least ${arr.length}² operations in the worst case.`);
    return steps;
  }

  if (arr && arr.length <= 12 && patternSlug === "two-pointers" && /sort color/i.test(example.input + example.output)) {
    steps.push("Use three pointers: low=0, mid=0, high=n-1.");
    steps.push(`Start with array [${arr.join(", ")}]. Scan mid from left.`);
    steps.push("0 → swap into low region; 1 → advance mid; 2 → swap with high and re-check mid.");
    steps.push(`Result matches ${example.output}.`);
    return steps;
  }

  if (arr && arr.length <= 10) {
    steps.push(`Scan the data: [${arr.join(", ")}].`);
    steps.push("Apply the optimal pattern step by step, updating pointers or state after each element.");
    steps.push(`When finished, verify the result equals ${example.output}.`);
    return steps;
  }

  steps.push(example.explanation || "Trace the algorithm on this sample until the output matches.");
  return steps;
}

const APPROACH1_DIAGRAM = {
  "sliding-window": "brute-force-subarrays",
  "two-pointers": "brute-force-pairs",
  "fast-slow-pointers": "hash-set",
  "merge-intervals": "brute-force-pairs",
  "cyclic-sort": "full-sort",
  "island-matrix-traversal": "grid",
  "in-place-reversal-linked-list": "linked-list-copy",
  "breadth-first-search": "recursion-tree",
  "depth-first-search": "recursion-tree",
  "two-heaps": "full-sort",
  subsets: "backtracking",
  "modified-binary-search": "linear-scan",
  "bitwise-xor": "hash-set",
  "top-k-elements": "full-sort",
  "k-way-merge": "full-sort",
  "topological-sort": "backtracking",
  "knapsack-01": "recursion-tree",
  "longest-common-substring": "recursion-tree",
  "dynamic-programming": "recursion-tree",
  "greedy-technique": "backtracking",
};

const APPROACH2_DIAGRAM = {
  "sliding-window": "sliding-window",
  "two-pointers": "two-pointers",
  "fast-slow-pointers": "fast-slow",
  "merge-intervals": "intervals",
  "cyclic-sort": "cyclic-sort",
  "island-matrix-traversal": "grid-dfs",
  "in-place-reversal-linked-list": "linked-list",
  "breadth-first-search": "bfs",
  "depth-first-search": "dfs",
  "two-heaps": "heap",
  subsets: "backtracking",
  "modified-binary-search": "binary-search",
  "bitwise-xor": "xor",
  "top-k-elements": "heap",
  "k-way-merge": "k-way-merge",
  "topological-sort": "topological",
  "knapsack-01": "dp",
  "longest-common-substring": "dp",
  "dynamic-programming": "dp",
  "greedy-technique": "greedy",
};

function diagramTypeApproach1(patternSlug, title) {
  if (/sort color/i.test(title)) return "counting";
  return APPROACH1_DIAGRAM[patternSlug] || "linear-scan";
}

function diagramTypeApproach2(patternSlug, title) {
  if (/sort color/i.test(title)) return "dutch-flag";
  return APPROACH2_DIAGRAM[patternSlug] || "linear-scan";
}

function buildSections(problem, patternSlug, brief, patternMeta) {
  const meta = { ...(patternMeta || PATTERN_META["dynamic-programming"]) };
  const custom = resolveStudyApproach(problem, patternSlug);
  if (custom) {
    meta.optimal = custom.optimal;
    meta.optimalDetail = custom.optimalDetail;
  }

  const ex = brief.examples?.[0];
  const fn = fnName(problem.slug);
  const algoSteps = custom?.steps || patternAlgorithmSteps(patternSlug, problem.title);

  return [
    {
      id: "understanding",
      title: "Understanding the Problem",
      blocks: [
        {
          type: "p",
          text: `${problem.title} is a ${problem.difficulty} problem in the ${meta.name} pattern. ${brief.scenario || "Read the statement and examples carefully before choosing an approach."}`,
        },
        {
          type: "p",
          text: `Before coding, ask: what structure in the input can we exploit? For ${meta.name} problems, the signal is usually in the title, constraints, or whether brute force would revisit the same work.`,
        },
        {
          type: "h3",
          text: "What approaches might work?",
        },
        {
          type: "ul",
          items: [
            `${meta.naive} — ${meta.naiveDetail}`,
            `${meta.optimal} — ${meta.optimalDetail}`,
            problem.difficulty === "Hard" ? "Hybrid: combine this pattern with a heap, hash map, or DP table if the naive pattern alone is insufficient." : null,
          ].filter(Boolean),
        },
        {
          type: "h3",
          text: "Key constraints to watch",
        },
        {
          type: "ul",
          items: buildStatement(problem, brief).constraints,
        },
      ],
    },
    {
      id: "approach-1",
      title: `Approach 1: ${meta.naive}`,
      diagramType: diagramTypeApproach1(patternSlug, problem.title),
      blocks: [
        { type: "h3", text: "Intuition" },
        { type: "p", text: meta.naiveDetail },
        {
          type: "h3",
          text: "Algorithm",
        },
        {
          type: "ol",
          items: [
            "Identify the brute-force search space (all subarrays, pairs, paths, etc.).",
            "Check each candidate against the problem condition.",
            "Track the best valid answer.",
          ],
        },
        ...(ex
          ? [{ type: "h3", text: "Example walkthrough" }, { type: "walkthrough", steps: walkthroughSteps(ex, patternSlug, 0) }]
          : []),
        {
          type: "complexity",
          time: problem.difficulty === "Easy" ? "O(n²) typical for nested scans." : "O(n²) or O(n³) depending on how many nested loops you need.",
          space: "O(1) to O(n) extra space for bookkeeping.",
        },
        {
          type: "p",
          text: "Brute force helps you verify test cases, but interviews expect the pattern-based optimization below.",
        },
      ],
    },
    {
      id: "approach-2",
      title: `Approach 2: ${meta.optimal}`,
      diagramType: diagramTypeApproach2(patternSlug, problem.title),
      blocks: [
        { type: "h3", text: "Intuition" },
        { type: "p", text: meta.optimalDetail },
        {
          type: "h3",
          text: "Algorithm",
        },
        {
          type: "ol",
          items: algoSteps,
        },
        ...(ex
          ? [{ type: "h3", text: "Example walkthrough" }, { type: "walkthrough", steps: walkthroughSteps(ex, patternSlug, 1) }]
          : []),
        { type: "h3", text: "Code" },
        { type: "code", lang: "javascript", text: meta.codeTemplate(fn) },
        {
          type: "complexity",
          time: patternTime(patternSlug),
          space: patternSpace(patternSlug),
        },
        {
          type: "callout",
          text: `For ${problem.title}, state the invariant out loud in interviews — what each pointer or DP state means after every step.`,
        },
      ],
    },
  ];
}

function patternAlgorithmSteps(patternSlug, title) {
  const t = title.toLowerCase();
  if (/sort color/i.test(t)) {
    return [
      "Initialize low = 0, mid = 0, high = n - 1.",
      "While mid <= high: 0 → swap with low, advance both; 1 → mid++; 2 → swap with high, high--.",
      "Stop when mid passes high — array is partitioned.",
    ];
  }
  const generic = {
    "sliding-window": [
      "Set left = 0.",
      "Expand right across the array, updating window state.",
      "While the window is invalid, shrink from the left.",
      "Update the answer whenever the window satisfies the problem rule.",
    ],
    "two-pointers": [
      "Place pointers according to the variant (opposite ends or same direction).",
      "Move the pointer that makes progress toward the target or valid partition.",
      "Stop when pointers cross or the array is fully processed.",
    ],
  };
  return generic[patternSlug] || [
    "Initialize pattern-specific state (pointers, heap, DP table).",
    "Process each element once when possible.",
    "Return the accumulated answer.",
  ];
}

function patternTime(slug) {
  const map = {
    "sliding-window": "O(n) — each index enters and leaves the window once.",
    "two-pointers": "O(n) after sorting, or O(n) single pass when already sorted.",
    "modified-binary-search": "O(log n) per search on the answer space or sorted array.",
    "dynamic-programming": "O(n) to O(n²) depending on state dimensions.",
  };
  return map[slug] || "O(n) to O(n log n) for typical optimal solutions.";
}

function patternSpace(slug) {
  const map = {
    "sliding-window": "O(k) for frequency map or O(1) for sum-only windows.",
    "two-pointers": "O(1) extra space for in-place pointer moves.",
    "dynamic-programming": "O(n) or O(n²) for the DP table; often optimizable to O(1) or O(n).",
  };
  return map[slug] || "O(1) to O(n) depending on auxiliary structures.";
}

function generateGuide(problem, pattern) {
  const titleKey = problem.title.toLowerCase().trim();
  if (TITLE_GUIDES[titleKey]) {
    const custom = TITLE_GUIDES[titleKey];
    return { ...custom, slug: problem.slug, title: problem.title };
  }

  const brief = buildProblemBrief({
    slug: problem.slug,
    title: problem.title,
    tags: problem.tags || [],
    difficulty: problem.difficulty,
    leetcodeLink: problem.leetcodeLink,
    practiceLink: problem.practiceLink,
  });

  const patternMeta = PATTERN_META[pattern.slug] || PATTERN_META["dynamic-programming"];
  const statement = buildStatement(problem, brief);
  const sections = buildSections(problem, pattern.slug, brief, patternMeta);

  return {
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty,
    patternName: pattern.name,
    readMin: estimateReadMin(sections),
    updated: "2026-07-03",
    tags: problem.tags || [],
    statement,
    sections,
  };
}

function generateAllGuides(problems, patterns) {
  const patternBySlug = Object.fromEntries(patterns.map((p) => [p.slug, p]));
  const guides = {};

  for (const problem of problems) {
    const pattern = patternBySlug[problem.patternSlug];
    if (!pattern) continue;
    guides[problem.slug] = generateGuide(problem, pattern);
  }

  return { version: 1, generatedAt: new Date().toISOString(), count: Object.keys(guides).length, guides };
}

module.exports = { generateGuide, generateAllGuides, PATTERN_META };
