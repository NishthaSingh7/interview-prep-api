const { primaryTopic } = require("./problemSummary");

let STATIC_BRIEFS = null;
try {
  STATIC_BRIEFS = require("../data/staticProblemBriefs.json").briefs;
} catch {
  STATIC_BRIEFS = null;
}

let GFG_BRIEFS = {};
try {
  GFG_BRIEFS = require("../data/gfgProblemBriefs").GFG_PROBLEM_BRIEFS;
} catch {
  /* optional until built */
}

let SLUG_BRIEFS = {};
try {
  SLUG_BRIEFS = require("../data/problemBriefBySlug").PROBLEM_BRIEF_BY_SLUG;
} catch {
  /* optional until generated */
}

const EXAMPLE_POOLS = {
  array: {
    given: "An integer array `nums` and any extra parameters described in the title.",
    constraints: "Array length is at least 1. Values fit in standard 32-bit integer range unless the title says otherwise.",
  },
  string: {
    given: "A string `s` (and sometimes a second string or integer parameter).",
    constraints: "The string uses lowercase English letters unless noted. Length is at least 1.",
  },
  "linked-list": {
    given: "The head node of a singly linked list (and extra parameters if the title mentions them).",
    constraints: "List length is between 0 and about 10⁴ nodes. Node values are integers.",
  },
  matrix: {
    given: "A 2D grid `grid` where each cell is 0, 1, or another value described in the title.",
    constraints: "Grid has at least 1 row and 1 column. Dimensions are moderate (roughly up to 200×200).",
  },
  tree: {
    given: "The root of a binary tree (and optional parameters like target value or depth).",
    constraints: "Tree has between 0 and about 10⁴ nodes. Node values are integers.",
  },
  graph: {
    given: "A graph described as nodes/edges, an adjacency list, or a grid you treat as a graph.",
    constraints: "Graph size is moderate. Cycles may or may not exist — read the scenario.",
  },
  heap: {
    given: "A collection of numbers (array or stream) and often an integer `k` or capacity.",
    constraints: "Return the top/bottom k items or a running median as described in the title.",
  },
  math: {
    given: "One or more integers described in the title.",
    constraints: "Watch for overflow and edge cases like 0, 1, or negative values.",
  },
};

/** Exact briefs keyed by distinctive title phrases — original wording, concrete IO. */
const TITLE_BRIEFS = {
  "maximum average subarray i": {
    scenario: "Find the contiguous subarray of fixed length k with the highest average value.",
    given: "Integer array `nums` and integer `k`.",
    output: "The maximum average value (as a float).",
    constraints: "Subarray length must be exactly k.",
    examples: [
      { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75", explanation: "Subarray [12,-5,-6,50] averages to 12.75." },
      { input: "nums = [5], k = 1", output: "5.0", explanation: "Only one window exists." },
    ],
  },
  "maximum sum subarray of size k": {
    scenario: "Find the contiguous subarray of length k with the largest sum.",
    given: "Integer array `nums` and integer `k`.",
    output: "Maximum sum among all length-k subarrays.",
    constraints: "k is at least 1 and at most nums.length.",
    examples: [
      { input: "nums = [2, 1, 5, 1, 3, 2], k = 3", output: "9", explanation: "Window [5,1,3] sums to 9." },
      { input: "nums = [2, 3, 4], k = 1", output: "4", explanation: "Best single element is 4." },
    ],
  },
  "two sum ii": {
    scenario: "In a sorted array, find two numbers that add up to a target.",
    given: "Sorted integer array `numbers` and integer `target`.",
    output: "Two 1-based indices of the pair (smaller index first).",
    constraints: "Exactly one solution exists.",
    examples: [
      { input: "numbers = [2,7,11,15], target = 9", output: "[1, 2]", explanation: "2 + 7 = 9." },
      { input: "numbers = [2,3,4], target = 6", output: "[1, 3]", explanation: "2 + 4 = 6." },
    ],
  },
  "3sum": {
    scenario: "Find all unique triplets in the array that sum to zero.",
    given: "Integer array `nums`.",
    output: "List of triplets [a,b,c] where a+b+c=0, no duplicates.",
    constraints: "Solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Two valid triplets." },
      { input: "nums = [0,1,1]", output: "[]", explanation: "No triplet sums to 0." },
    ],
  },
  "4sum": {
    scenario: "Find all unique quadruplets that sum to a target value.",
    given: "Integer array `nums` and integer `target`.",
    output: "List of quadruplets [a,b,c,d] with a+b+c+d = target.",
    constraints: "No duplicate quadruplets in the answer.",
    examples: [
      { input: "nums = [1,0,-1,0,-2,2], target = 0", output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]", explanation: "Three distinct quadruplets." },
      { input: "nums = [2,2,2,2,2], target = 8", output: "[[2,2,2,2]]", explanation: "Only one combination." },
    ],
  },
  "valid palindrome": {
    scenario: "Check if a string reads the same forward and backward, ignoring non-alphanumeric characters and case.",
    given: "String `s`.",
    output: "Boolean — true if palindrome, else false.",
    constraints: "Consider only letters and digits; compare case-insensitively.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: "Reads the same both ways." },
      { input: 's = "race a car"', output: "false", explanation: "Not a palindrome." },
    ],
  },
  "minimum size subarray sum": {
    scenario: "Find the shortest contiguous subarray whose sum is at least a target.",
    given: "Integer array `nums` and integer `target`.",
    output: "Minimum length, or 0 if impossible.",
    constraints: "All nums elements are positive.",
    examples: [
      { input: "nums = [2,3,1,2,4,3], target = 7", output: "2", explanation: "[4,3] has sum 7." },
      { input: "nums = [1,4,4], target = 4", output: "1", explanation: "Single element 4 works." },
    ],
  },
  "fruit into baskets": {
    scenario: "Pick fruits from a row of trees, but you may only carry two types at once. Find the longest stretch you can collect.",
    given: "Integer array `fruits` where each value is a fruit type.",
    output: "Maximum number of trees in a valid contiguous pick.",
    constraints: "At most 2 distinct fruit types in the window.",
    examples: [
      { input: "fruits = [1,2,1]", output: "3", explanation: "Pick all three trees." },
      { input: "fruits = [0,1,2,2]", output: "3", explanation: "Best window is [1,2,2]." },
    ],
  },
  "sliding window maximum": {
    scenario: "For every sliding window of size k, report the largest value inside that window.",
    given: "Integer array `nums` and integer `k`.",
    output: "Array of maximums, one per window position.",
    constraints: "1 ≤ k ≤ nums.length.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]", explanation: "Max of each length-3 window." },
      { input: "nums = [1], k = 1", output: "[1]", explanation: "Single window." },
    ],
  },
  "missing number": {
    scenario: "An array contains n distinct numbers from 0 to n, but one is missing. Find it.",
    given: "Array `nums` of length n with values from 0..n except one missing.",
    output: "The missing integer.",
    constraints: "Use O(n) time and O(1) extra space if possible.",
    examples: [
      { input: "nums = [3,0,1]", output: "2", explanation: "0,1,2,3 expected — 2 is missing." },
      { input: "nums = [0,1]", output: "2", explanation: "2 is missing from [0,1,2]." },
    ],
  },
  "coin change": {
    scenario: "Make a target amount using the fewest coins possible.",
    given: "Integer array `coins` (denominations) and integer `amount`.",
    output: "Minimum number of coins, or -1 if impossible.",
    constraints: "Each coin value can be reused.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5+5+1." },
      { input: "coins = [2], amount = 3", output: "-1", explanation: "Cannot make 3 with only 2s." },
    ],
  },
  "house robber": {
    scenario: "Rob houses along a street, but you cannot rob two adjacent houses.",
    given: "Array `nums` where nums[i] is money in house i.",
    output: "Maximum money without robbing neighbors.",
    constraints: "Adjacent houses cannot both be chosen.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob houses 0 and 2: 1+3=4." },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "2+9+1=12." },
    ],
  },
  "climbing stairs": {
    scenario: "You can climb 1 or 2 steps at a time. How many distinct ways to reach the top?",
    given: "Integer `n` — number of steps.",
    output: "Count of distinct climb sequences.",
    constraints: "1 ≤ n ≤ 45.",
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1 or 2." },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." },
    ],
  },
  "course schedule": {
    scenario: "Can you finish all courses when some depend on others?",
    given: "Number of courses `numCourses` and prerequisite pairs `prerequisites`.",
    output: "true if all courses can be finished, else false.",
    constraints: "Detect if a cycle exists in prerequisites.",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take 0 then 1." },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "Circular dependency." },
    ],
  },
  "rotting oranges": {
    scenario: "Fresh oranges rot when touching rotten ones each minute. How long until all fresh ones rot?",
    given: "Grid with 0=empty, 1=fresh, 2=rotten.",
    output: "Minutes until no fresh orange remains, or -1 if impossible.",
    constraints: "Rot spreads to 4-directional neighbors each minute.",
    examples: [
      { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4", explanation: "All fresh rot in 4 minutes." },
      { input: "grid = [[0,2]]", output: "0", explanation: "No fresh oranges." },
    ],
  },
  "kth largest element in an array": {
    scenario: "Find the k-th largest value in an unsorted array.",
    given: "Integer array `nums` and integer `k`.",
    output: "The k-th largest element (not k-th distinct).",
    constraints: "k is between 1 and nums.length.",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "Sorted desc: 6,5,4... 2nd is 5." },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4", explanation: "4th largest is 4." },
    ],
  },
  "merge two sorted lists": {
    scenario: "Combine two sorted linked lists into one sorted list.",
    given: "Heads of two sorted linked lists `list1` and `list2`.",
    output: "Head of the merged sorted list.",
    constraints: "Merge in sorted order.",
    examples: [
      { input: "list1 = 1→2→4, list2 = 1→3→4", output: "1→1→2→3→4→4", explanation: "Standard merge." },
      { input: "list1 = null, list2 = 0", output: "0", explanation: "One list empty." },
    ],
  },
  "binary search": {
    scenario: "Find the index of a target in a sorted array.",
    given: "Sorted array `nums` and integer `target`.",
    output: "Index of target, or -1 if absent.",
    constraints: "O(log n) time.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 is at index 4." },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 not present." },
    ],
  },
  "middle of the linked list": {
    scenario: "Find the middle node of a singly linked list. For even length, return the second middle node.",
    given: "Head of a singly linked list.",
    output: "The middle node.",
    constraints: "Use fast/slow pointers.",
    examples: [
      { input: "head = 1→2→3→4→5", output: "3", explanation: "Odd length middle." },
      { input: "head = 1→2→3→4→5→6", output: "4", explanation: "Even length: second middle." },
    ],
  },
  "middle element of linked list": {
    scenario: "Find the middle node of a singly linked list. For even length, return the second middle node.",
    given: "Head of a singly linked list.",
    output: "The middle node (or its value).",
    constraints: "Use fast/slow pointers.",
    examples: [
      { input: "head = 1→2→3→4→5", output: "3", explanation: "Odd length middle." },
      { input: "head = 1→2→3→4→5→6", output: "4", explanation: "Even length: second middle." },
    ],
  },
  "meeting rooms": {
    scenario: "Can one person attend all meetings without time conflicts?",
    given: "Array `intervals` where each interval is [start, end].",
    output: "true if all meetings can be attended, else false.",
    constraints: "Meetings overlap if one starts before another ends.",
    examples: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", output: "false", explanation: "Overlaps with [0,30]." },
      { input: "intervals = [[7,10],[2,4]]", output: "true", explanation: "No overlap." },
    ],
  },
  "meeting rooms ii": {
    scenario: "Find the minimum number of conference rooms needed so every meeting can be held.",
    given: "Array `intervals` of meeting [start, end] times.",
    output: "Minimum room count.",
    constraints: "A room can host back-to-back non-overlapping meetings.",
    examples: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2", explanation: "Two rooms at peak." },
      { input: "intervals = [[7,10],[2,4]]", output: "1", explanation: "No overlap." },
    ],
  },
};

const FAMILY_BRIEFS = [
  {
    test: /two sum(?! ii)/i,
    brief: () => ({
      scenario: "Pick two different positions in a number list so their values add up to a target.",
      given: "Integer array `nums` and integer `target`.",
      output: "Two indices `i` and `j` (i ≠ j) where nums[i] + nums[j] = target.",
      constraints: "Exactly one valid pair exists. You cannot reuse the same index twice.",
      examples: [
        { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "2 + 7 = 9." },
        { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "2 + 4 = 6." },
      ],
    }),
  },
  {
    test: /longest substring without repeating/i,
    brief: () => ({
      scenario: "Find the length of the longest chunk of a string where no character repeats.",
      given: "String `s`.",
      output: "A single integer — the maximum length of a substring with all unique characters.",
      constraints: "String length up to about 5×10⁴.",
      examples: [
        { input: 's = "abcabcbb"', output: "3", explanation: 'Longest substring is "abc".' },
        { input: 's = "bbbbb"', output: "1", explanation: 'Only one distinct character at a time.' },
      ],
    }),
  },
  {
    test: /merge interval/i,
    brief: () => ({
      scenario: "Combine overlapping time ranges into non-overlapping blocks.",
      given: "Array of intervals `intervals` where each is [start, end].",
      output: "Merged, non-overlapping intervals sorted by start.",
      constraints: "Intervals are inclusive.",
      examples: [
        { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] merge." },
        { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Touching ends merge." },
      ],
    }),
  },
  {
    test: /number of islands/i,
    brief: () => ({
      scenario: "Count separate connected land regions in a grid.",
      given: "2D grid `grid` with '1' (land) and '0' (water).",
      output: "Integer count of islands.",
      constraints: "4-directional connectivity only.",
      examples: [
        { input: 'grid = [["1","1","0"],["0","1","0"],["1","0","1"]]', output: "3", explanation: "Three land patches." },
        { input: 'grid = [["1","1","1"],["0","1","0"],["1","1","1"]]', output: "1", explanation: "One connected island." },
      ],
    }),
  },
  {
    test: /reverse linked list/i,
    brief: () => ({
      scenario: "Reverse the order of nodes in a linked list.",
      given: "Head of a singly linked list.",
      output: "Head of the reversed list.",
      constraints: "The list should be reversed in place.",
      examples: [
        { input: "head = 1→2→3→null", output: "3→2→1→null", explanation: "Pointers reversed in place." },
        { input: "head = null", output: "null", explanation: "Empty list." },
      ],
    }),
  },
  {
    test: /linked list cycle(?! ii)/i,
    brief: () => ({
      scenario: "Detect whether a linked list contains a cycle.",
      given: "Head of a singly linked list.",
      output: "true if a cycle exists, else false.",
      constraints: "A cycle means some node is reachable again by following next pointers.",
      examples: [
        { input: "3→2→0→-4, tail points back to node 2", output: "true", explanation: "Cycle detected." },
        { input: "1→2→null", output: "false", explanation: "Ends at null." },
      ],
    }),
  },
  {
    test: /middle (of the |element of )?linked list/i,
    brief: () => ({
      scenario: "Find the middle node of a singly linked list. For even length, return the second middle node.",
      given: "Head of a singly linked list.",
      output: "The middle node.",
      constraints: "Use fast/slow pointers; O(n) time, O(1) space.",
      examples: [
        { input: "head = 1→2→3→4→5", output: "3", explanation: "Odd length middle." },
        { input: "head = 1→2→3→4→5→6", output: "4", explanation: "Even length: second middle." },
      ],
    }),
  },
  {
    test: /meeting rooms(?! iii)/i,
    brief: (title) => {
      const isII = /ii\b|2\b/i.test(title);
      return isII
        ? {
            scenario: "Find the minimum number of conference rooms needed so every meeting can be held.",
            given: "Array `intervals` of meeting [start, end] times.",
            output: "Minimum room count.",
            constraints: "A room can host back-to-back non-overlapping meetings.",
            examples: [
              { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2", explanation: "Two rooms at peak." },
              { input: "intervals = [[7,10],[2,4]]", output: "1", explanation: "No overlap." },
            ],
          }
        : {
            scenario: "Can one person attend all meetings without time conflicts?",
            given: "Array `intervals` where each interval is [start, end].",
            output: "true if all meetings can be attended, else false.",
            constraints: "Meetings overlap if one starts before another ends.",
            examples: [
              { input: "intervals = [[0,30],[5,10],[15,20]]", output: "false", explanation: "Overlaps." },
              { input: "intervals = [[7,10],[2,4]]", output: "true", explanation: "No overlap." },
            ],
          };
    },
  },
  {
    test: /linked list cycle ii|start of loop/i,
    brief: () => ({
      scenario: "Find the node where a cycle begins in a linked list.",
      given: "Head of a linked list that may contain a cycle.",
      output: "The node where the cycle starts, or null if no cycle.",
      constraints: "Floyd's algorithm — find entrance to cycle.",
      examples: [
        { input: "3→2→0→-4, tail points to node 2", output: "node 2", explanation: "Cycle starts at 2." },
        { input: "head = 1→2→null", output: "null", explanation: "No cycle." },
      ],
    }),
  },
  {
    test: /trapping rain|rain water/i,
    brief: () => ({
      scenario: "How much water gets trapped between bars of different heights?",
      given: "Array `height` of bar heights.",
      output: "Total trapped water units.",
      constraints: "Water needs walls on both sides.",
      examples: [
        { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "Six units trapped." },
        { input: "height = [4,2,0,3,2,5]", output: "9", explanation: "Nine units trapped." },
      ],
    }),
  },
];

function inferTopic(title = "", tags = []) {
  const t = title.toLowerCase();
  if (/linked list|list node|linked-list/i.test(t) || tags.includes("linked-list")) return "linked-list";
  if (/interval|meeting room|platform/i.test(t) || tags.includes("intervals")) return "intervals";
  if (/binary tree|tree node|bst|root of/i.test(t) || tags.includes("tree")) return "tree";
  if (/graph|course schedule|topological|alien dictionary/i.test(t) || tags.includes("graph")) return "graph";
  if (/grid|matrix|island|maze|2d/i.test(t) || tags.includes("matrix")) return "matrix";
  if (/string|substring|anagram|parentheses|word /i.test(t) || tags.includes("string")) return "string";
  if (/heap|priority queue|median.*stream|kth largest|top k/i.test(t) || tags.includes("heap")) return "heap";
  for (const key of ["array", "string", "linked-list", "matrix", "tree", "graph", "heap", "math"]) {
    if (tags.includes(key)) return key;
  }
  return "array";
}

function pickPool(tags = [], title = "") {
  const topic = inferTopic(title, tags);
  if (topic === "intervals") {
    return {
      given: "Array of intervals where each interval is [start, end].",
      constraints: "Intervals may need sorting or merging depending on the task.",
    };
  }
  return EXAMPLE_POOLS[topic] || EXAMPLE_POOLS.array;
}

function verbFromTitle(title) {
  const t = title.toLowerCase();
  if (/^find|^search|^locate/.test(t)) return "find";
  if (/^count|^number of/.test(t)) return "count";
  if (/^merge|^combine/.test(t)) return "merge";
  if (/^reverse/.test(t)) return "reverse";
  if (/^valid|^check|^is /.test(t)) return "validate";
  if (/^maximum|^minimum|^max |^min |largest|smallest/.test(t)) return "optimize";
  if (/^longest|^shortest/.test(t)) return "measure";
  if (/^sort/.test(t)) return "sort";
  if (/^clone|^copy/.test(t)) return "copy";
  if (/path|route|course|ladder|word ladder/.test(t)) return "path";
  if (/permutation|combination|subset|parentheses|queens/.test(t)) return "enumerate";
  if (/rob |climb|coin|target sum|partition/.test(t)) return "dp";
  return "solve";
}

function normalizeTitleKey(title) {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

function isVagueExample(ex) {
  if (!ex?.input || !ex?.output) return true;
  const vague =
    /expected|answer for|result for|optimal value|corresponding|see problem|boundary answer|handle without|still valid|smaller instance|plug values|edge.case answer|trace pointers step/i;
  return vague.test(ex.output) || vague.test(ex.input);
}

function isApproachyScenario(text) {
  if (!text) return true;
  return /using the|approach|pattern|lean on|warm-up|before (you )?cod|read the samples|external practice|work with .+ using|two pointers|sliding window|bottom-up|top-down|heap thinking|follow next pointers|your task:/i.test(
    text,
  );
}

function briefNeedsRefresh(brief) {
  if (brief?.fromLeetcode && brief?.scenario?.length > 80) return false;
  if (!brief?.scenario || !Array.isArray(brief.examples) || brief.examples.length < 2) return true;
  if (isApproachyScenario(brief.scenario)) return true;
  if (brief.scenario.length < 80) return true;
  return brief.examples.some(isVagueExample);
}

function concreteExamples(title, tags, verb, difficulty) {
  const t = title.toLowerCase();
  const structure = primaryTopic(tags);

  if (/palindrome/i.test(t) && verb === "validate") {
    return [
      { input: 's = "aba"', output: "true", explanation: "Reads same both ways." },
      { input: 's = "ab"', output: "false", explanation: "Not a palindrome." },
    ];
  }

  if (/anagram|permutation in string/i.test(t)) {
    return [
      { input: 's1 = "anagram", s2 = "nagaram"', output: "true", explanation: "Same character counts." },
      { input: 's1 = "rat", s2 = "car"', output: "false", explanation: "Different letters." },
    ];
  }

  if (verb === "validate") {
    return [
      { input: 's = "abc"', output: "true", explanation: "Meets the rule for this input." },
      { input: 's = "axc"', output: "false", explanation: "Fails the rule." },
    ];
  }

  if (verb === "count" || /number of/i.test(t)) {
    return [
      { input: "nums = [1, 1, 2, 2, 3]", output: "3", explanation: "Three distinct values counted." },
      { input: "nums = [5, 5, 5]", output: "1", explanation: "Only one distinct value." },
    ];
  }

  if (verb === "measure" || /longest|shortest|minimum depth|maximum depth/i.test(t)) {
    if (structure.includes("string")) {
      return [
        { input: 's = "abcabcbb"', output: "3", explanation: "Length of best substring/window." },
        { input: 's = "bbbbb"', output: "1", explanation: "Shortest/longest degenerate case." },
      ];
    }
    if (structure.includes("tree")) {
      return [
        { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "Depth/height/diameter per problem rule." },
        { input: "root = [1,null,2]", output: "2", explanation: "Skewed tree case." },
      ];
    }
    return [
      { input: "nums = [1, 2, 3, 4, 5]", output: "3", explanation: "Length/size of best subarray or path." },
      { input: "nums = [1]", output: "1", explanation: "Single element baseline." },
    ];
  }

  if (verb === "optimize") {
    const wantsMin = /minimum|min |smallest|shortest/i.test(t);
    return wantsMin
      ? [
          { input: "nums = [3, 1, 4, 1, 5, 9, 2, 6]", output: "1", explanation: "Smallest optimal value." },
          { input: "nums = [10, 9, 8]", output: "8", explanation: "Another valid small case." },
        ]
      : [
          { input: "nums = [3, 1, 4, 1, 5, 9, 2, 6]", output: "9", explanation: "Largest optimal value." },
          { input: "nums = [1, 2, 3]", output: "3", explanation: "Small array maximum." },
        ];
  }

  if (verb === "reverse" || structure.includes("linked list")) {
    return [
      { input: "head = 1→2→3→4→null", output: "4→3→2→1→null", explanation: "Reversed pointer chain." },
      { input: "head = 1→null", output: "1→null", explanation: "Single node unchanged structurally." },
    ];
  }

  if (verb === "merge" || /merge|combine/i.test(t)) {
    return [
      { input: "a = [1,3,5], b = [2,4,6]", output: "[1,2,3,4,5,6]", explanation: "Sorted merge result." },
      { input: "a = [], b = [0]", output: "[0]", explanation: "One side empty." },
    ];
  }

  if (verb === "sort" || /sort color/i.test(t)) {
    return [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]", explanation: "Rearranged in required order." },
      { input: "nums = [2,0,1]", output: "[0,1,2]", explanation: "Three-way partition result." },
    ];
  }

  if (verb === "find" || /search/i.test(t)) {
    return [
      { input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0", output: "4", explanation: "Target index or value found." },
      { input: "nums = [1, 3, 5, 7], target = 6", output: "-1", explanation: "Target absent." },
    ];
  }

  if (structure.includes("grid") || structure.includes("matrix") || tags.includes("matrix")) {
    return [
      { input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: "2", explanation: "Grid traversal result." },
      { input: 'grid = [["0"]]', output: "0", explanation: "Single cell grid." },
    ];
  }

  if (structure.includes("graph") || tags.includes("graph") || tags.includes("bfs") || tags.includes("dfs")) {
    return [
      { input: "n = 3, edges = [[0,1],[1,2]]", output: "true", explanation: "Graph property or path exists." },
      { input: "n = 3, edges = [[0,1],[1,2],[2,0]]", output: "false", explanation: "Alternate graph configuration." },
    ];
  }

  if (verb === "enumerate" || tags.includes("backtracking")) {
    return [
      { input: "nums = [1,2]", output: "[[1,2],[2,1]]", explanation: "All valid arrangements listed." },
      { input: "nums = [1]", output: "[[1]]", explanation: "Single element base case." },
    ];
  }

  if (verb === "dp" || tags.includes("dynamic-programming")) {
    return [
      { input: "nums = [1,2,3], target = 4", output: "3", explanation: "Optimal DP answer for sample." },
      { input: "nums = [2], target = 1", output: "0", explanation: "Impossible or zero ways case." },
    ];
  }

  if (structure.includes("string")) {
    return [
      { input: 's = "hello", k = 2', output: '"llo"', explanation: "Transformed string output." },
      { input: 's = "a", k = 1', output: '"a"', explanation: "Minimal string case." },
    ];
  }

  if (verb === "path" || /shortest path|word ladder|rotting/i.test(t)) {
    return [
      { input: "start = 0, end = 3, graph = [[1,2],[2],[3],[]]", output: "2", explanation: "Shortest steps or path length." },
      { input: "start = 0, end = 0", output: "0", explanation: "Already at destination." },
    ];
  }

  return [
    { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "Indices or value solving the task." },
    { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "Second valid sample case." },
  ];
}

function outputLine(title, verb) {
  const t = title.toLowerCase();

  switch (verb) {
    case "find":
      if (/two sum/i.test(t)) return "Two indices where the numbers at those positions add up to the target.";
      if (/kth|top k|largest|smallest|median/i.test(t)) return "The ranked or selected value described in the title.";
      if (/index|position|missing|duplicate|search/i.test(t)) return "The index or value you need to locate.";
      return "The element, index, or structure that answers the question.";
    case "count":
      return "How many valid items the question asks for.";
    case "merge":
      return "The merged or combined result.";
    case "reverse":
      return "The reversed list, string, or array.";
    case "validate":
      return "true if the input meets the condition, otherwise false.";
    case "optimize":
      if (/minimum|min |smallest|shortest/i.test(t)) return "The smallest possible value that satisfies the question.";
      return "The largest possible value that satisfies the question.";
    case "measure":
      return "The length, size, or amount the question asks for.";
    case "sort":
      return "The rearranged array or list in the required order.";
    case "enumerate":
      return "Every valid combination, permutation, or arrangement.";
    case "dp":
      return "The best total, count, or number of ways described in the title.";
    case "path":
      return "The shortest distance, reachability answer, or ordering the question asks for.";
    default:
      return "The final answer the question asks for.";
  }
}

function formatGiven(given) {
  if (!given) return "";
  let g = given.trim();
  if (/^you are given/i.test(g)) return g.endsWith(".") ? g : `${g}.`;
  if (/^(an?|the)\s/i.test(g)) {
    g = `You are given ${g.charAt(0).toLowerCase()}${g.slice(1)}`;
  } else {
    g = `You are given ${g.charAt(0).toLowerCase()}${g.slice(1)}`;
  }
  return g.endsWith(".") ? g : `${g}.`;
}

function formatOutput(output) {
  if (!output) return "";
  let o = output.trim();
  if (/^return\b/i.test(o)) return o.endsWith(".") ? o : `${o}.`;
  if (/^boolean\s*[—–-]\s*/i.test(o)) {
    o = o.replace(/^boolean\s*[—–-]\s*/i, "");
    return `Return ${o.charAt(0).toLowerCase()}${o.slice(1)}`.replace(/\.?$/, ".");
  }
  return `Return ${o.charAt(0).toLowerCase()}${o.slice(1)}`.replace(/\.?$/, ".");
}

function questionDescription(given, output) {
  const parts = [formatGiven(given), formatOutput(output)].filter(Boolean);
  if (!parts.length) return "Use the test cases below to see what to compute.";
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function finalizeBrief(brief) {
  const scenario =
    brief.scenario?.trim() || questionDescription(brief.given, brief.output);
  return {
    ...brief,
    scenario,
  };
}

function buildProblemBrief({ slug, title, tags = [], difficulty = "Medium", leetcodeLink, practiceLink } = {}) {
  const key = normalizeTitleKey(title);

  if (slug && SLUG_BRIEFS[slug]) {
    return finalizeBrief({ ...SLUG_BRIEFS[slug] });
  }

  if (slug && STATIC_BRIEFS?.[slug]) {
    const cached = STATIC_BRIEFS[slug];
    if (!briefNeedsRefresh(cached)) return finalizeBrief({ ...cached });
  }

  if (slug && GFG_BRIEFS[slug]) {
    return finalizeBrief({ ...GFG_BRIEFS[slug] });
  }

  if (TITLE_BRIEFS[key]) return finalizeBrief({ ...TITLE_BRIEFS[key] });

  for (const family of FAMILY_BRIEFS) {
    if (family.test.test(title)) return finalizeBrief(family.brief(title, difficulty));
  }

  const pool = pickPool(tags, title);
  const verb = verbFromTitle(title);

  return finalizeBrief({
    given: pool.given,
    output: outputLine(title, verb),
    constraints: pool.constraints,
    examples: concreteExamples(title, tags, verb, difficulty),
    scenario: `Solve "${title}" — ${outputLine(title, verb).replace(/^Return /i, "return ")}`,
  });
}

function withBrief(problem) {
  if (!problem) return problem;
  const doc = problem.toObject ? problem.toObject() : { ...problem };

  if (briefNeedsRefresh(doc.brief)) {
    doc.brief = buildProblemBrief({
      slug: doc.slug,
      title: doc.title,
      tags: doc.tags || [],
      difficulty: doc.difficulty,
      leetcodeLink: doc.leetcodeLink,
      practiceLink: doc.practiceLink,
    });
  }

  if (!doc.summary?.trim()) doc.summary = doc.brief.scenario;
  return doc;
}

module.exports = { buildProblemBrief, withBrief, briefNeedsRefresh, isVagueExample };
