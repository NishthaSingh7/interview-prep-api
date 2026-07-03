const STRUCTURE_LABELS = {
  array: "arrays",
  string: "strings",
  "linked-list": "linked lists",
  tree: "trees",
  graph: "graphs",
  heap: "heaps",
  matrix: "grids and matrices",
  math: "number theory",
  dfs: "depth-first search",
  bfs: "breadth-first search",
};

const PATTERN_SKIP = new Set([
  "sliding-window",
  "two-pointers",
  "fast-slow-pointers",
  "intervals",
  "cyclic-sort",
  "dfs",
  "bfs",
  "backtracking",
  "binary-search",
  "bit-manipulation",
  "merge",
  "topological-sort",
  "dynamic-programming",
  "greedy",
  "variant",
]);

function primaryTopic(tags = []) {
  const structural = tags.find((t) => STRUCTURE_LABELS[t] && !PATTERN_SKIP.has(t));
  if (structural) return STRUCTURE_LABELS[structural];
  if (tags.includes("matrix")) return "grids and matrices";
  if (tags.includes("graph") || tags.includes("dfs") || tags.includes("bfs")) return "graphs";
  return "data structures";
}

function titlePhrase(title) {
  return title
    .replace(/\s+(I|II|III|IV|V|VI)$/i, "")
    .replace(/\bK\b/g, "k")
    .trim();
}

/** Hand-written plain-English summaries for well-known problem families (not copied from external sites). */
const TITLE_HINTS = [
  [/two sum/i, "Find two values in a collection that add up to a given target — usually by tracking what you have already seen."],
  [/3sum|4sum/i, "Find groups of numbers in a list that sum to zero (or a target), without repeating the same combination."],
  [/palindrome/i, "Check or build something that reads the same forward and backward — often by comparing from both ends."],
  [/linked list cycle/i, "Detect whether a linked list loops back on itself, typically with two pointers moving at different speeds."],
  [/reverse linked list/i, "Flip the direction of links in a chain of nodes, usually in place with a few pointers."],
  [/merge interval/i, "Combine overlapping time ranges into a clean, non-overlapping schedule."],
  [/meeting room/i, "Decide whether a person can attend all meetings, or how many rooms are needed when meetings overlap."],
  [/binary search/i, "Search a sorted space by repeatedly cutting the range in half."],
  [/subarray|substring/i, "Work with a contiguous chunk of an array or string — often optimizing length, sum, or uniqueness."],
  [/island/i, "Count or measure connected groups of cells in a grid, like patches of land surrounded by water."],
  [/tree|binary tree/i, "Navigate a hierarchical structure of nodes — often with recursion or a queue/stack."],
  [/graph|course schedule|topological/i, "Model relationships between items and find valid orderings or paths."],
  [/heap|kth largest|top k|median/i, "Keep track of the best or worst candidates efficiently using a priority structure."],
  [/dynamic programming|coin change|house robber|climb/i, "Break the task into overlapping smaller decisions and reuse answers instead of recomputing."],
  [/backtrack|permutation|combination|subset/i, "Explore possible choices, undo wrong paths, and collect valid arrangements."],
  [/rotting orange|shortest path/i, "Spread or travel through a grid in the fewest steps, layer by layer or level by level."],
  [/rain water|trapping/i, "Figure out how much water can be held between barriers of different heights."],
  [/duplicate|missing number/i, "Find values that are repeated or absent when the input follows a simple numeric pattern."],
  [/sort color|dutch flag/i, "Rearrange items into groups (like low / mid / high) without a full sort."],
  [/valid anagram|permutation in string/i, "Compare character counts or windows to see if one string can be rearranged into another."],
  [/stock|buy and sell/i, "Track prices over days to maximize profit under buying/selling rules."],
  [/window maximum|sliding/i, "Maintain a moving range over the data and answer questions about that range quickly."],
];

function hintFromTitle(title) {
  for (const [regex, text] of TITLE_HINTS) {
    if (regex.test(title)) return text;
  }
  return null;
}

function buildProblemSummary({ title, patternName = "", tags = [], difficulty = "Medium" } = {}) {
  const topic = titlePhrase(title);
  const hint = hintFromTitle(title);
  const structure = primaryTopic(tags);
  const pattern = patternName || "core interview patterns";
  const level =
    difficulty === "Easy"
      ? "A good warm-up"
      : difficulty === "Hard"
        ? "A deeper challenge"
        : "A solid practice problem";

  if (hint) {
    return `${level}: ${hint} You will lean on ${pattern.toLowerCase()} while working with ${structure}.`;
  }

  return `${level} built around “${topic}”. Read what is being asked, note the constraints, then apply ${pattern.toLowerCase()} on ${structure} until the approach feels natural.`;
}

function withSummary(problem) {
  if (!problem) return problem;
  const doc = problem.toObject ? problem.toObject() : { ...problem };
  if (!doc.summary || !doc.summary.trim()) {
    doc.summary = buildProblemSummary({
      title: doc.title,
      patternName: doc.patternId?.name || doc.patternName || "",
      tags: doc.tags || [],
      difficulty: doc.difficulty,
    });
  }
  return doc;
}

module.exports = { buildProblemSummary, withSummary, primaryTopic, titlePhrase };
