const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const GFG = (path) => `https://www.geeksforgeeks.org/problems/${path}/1`;

/**
 * Data-structure fundamentals from GeeksforGeeks (not pattern variants).
 * Each row still belongs to a nearby coding pattern so seed/unlocks keep working.
 */
const dsRows = [
  // Arrays
  ["two-pointers", "Second Largest in Array", "Easy", GFG("second-largest3735"), ["array"]],
  ["two-pointers", "Move All Zeroes to End", "Easy", GFG("move-all-zeroes-to-end-of-array0751"), ["array"]],
  ["two-pointers", "Union of Two Arrays", "Easy", GFG("union-of-two-arrays3538"), ["array"]],
  ["cyclic-sort", "Sort Array of 0s 1s and 2s", "Easy", GFG("sort-an-array-of-0s-1s-and-2s4231"), ["array"]],
  ["greedy-technique", "Array Leaders", "Easy", GFG("leaders-in-an-array-1587115620"), ["array"]],
  ["sliding-window", "Rotate Array by D Places", "Easy", GFG("rotate-array-by-n-elements-1587115621"), ["array"]],
  ["dynamic-programming", "Kadane's Algorithm", "Medium", GFG("kadanes-algorithm-1587115620"), ["array"]],
  ["two-pointers", "Check If Two Arrays Are Equal", "Easy", GFG("check-if-two-arrays-are-equal-or-not3847"), ["array"]],

  // Strings
  ["two-pointers", "Palindrome String", "Easy", GFG("palindrome-string0817"), ["string"]],
  ["two-pointers", "Reverse a String", "Easy", GFG("reverse-a-string"), ["string"]],
  ["two-pointers", "Check Anagram", "Easy", GFG("anagram-1587115620"), ["string"]],
  ["sliding-window", "Longest Palindrome in a String", "Medium", GFG("longest-palindrome-in-a-string3411"), ["string"]],
  ["greedy-technique", "Roman Number to Integer", "Easy", GFG("roman-number-to-integer3201"), ["string"]],
  ["two-pointers", "Non Repeating Character", "Easy", GFG("non-repeating-character-1587115620"), ["string"]],
  ["modified-binary-search", "Implement Atoi", "Medium", GFG("implement-atoi"), ["string"]],

  // Linked lists
  ["fast-slow-pointers", "Nth Node from End of Linked List", "Easy", GFG("nth-node-from-end-of-linked-list"), ["linked-list"]],
  ["fast-slow-pointers", "Remove Loop in Linked List", "Medium", GFG("remove-loop-in-linked-list"), ["linked-list"]],
  ["fast-slow-pointers", "Intersection Point of Y Linked Lists", "Medium", GFG("intersection-point-in-y-shapped-linked-lists"), ["linked-list"]],
  ["in-place-reversal-linked-list", "Add 1 to a Linked List Number", "Medium", GFG("add-1-to-a-number-represented-as-linked-list"), ["linked-list"]],
  ["k-way-merge", "Add Two Numbers as Linked Lists", "Medium", GFG("add-two-numbers-represented-by-linked-lists"), ["linked-list"]],
  ["in-place-reversal-linked-list", "Flattening a Linked List", "Medium", GFG("flattening-a-linked-list"), ["linked-list"]],

  // Stacks
  ["greedy-technique", "Next Greater Element", "Medium", GFG("next-larger-element-1587115620"), ["stack", "array"]],
  ["greedy-technique", "Parenthesis Checker", "Easy", GFG("parenthesis-checker2744"), ["stack", "string"]],
  ["greedy-technique", "Stock Span Problem", "Medium", GFG("stock-span-problem-1587115621"), ["stack", "array"]],
  ["greedy-technique", "Evaluation of Postfix Expression", "Medium", GFG("evaluation-of-postfix-expression1735"), ["stack"]],
  ["greedy-technique", "Get Min from Stack", "Medium", GFG("get-min-at-pop"), ["stack"]],
  ["greedy-technique", "Sort a Stack", "Medium", GFG("sort-a-stack"), ["stack"]],
  ["greedy-technique", "Delete Middle of Stack", "Easy", GFG("delete-middle-element-of-a-stack"), ["stack"]],
  ["greedy-technique", "The Celebrity Problem", "Medium", GFG("the-celebrity-problem"), ["stack"]],
  ["greedy-technique", "Largest Rectangle in Histogram", "Hard", GFG("maximum-rectangular-area-in-a-histogram-1587115620"), ["stack", "array"]],

  // Queues
  ["breadth-first-search", "Queue Reversal", "Easy", GFG("queue-reversal"), ["queue"]],
  ["breadth-first-search", "Reverse First K of Queue", "Easy", GFG("reverse-first-k-elements-of-queue"), ["queue"]],
  ["sliding-window", "First Non-Repeating Character in Stream", "Medium", GFG("first-non-repeating-character-in-a-stream1216"), ["queue", "string"]],
  ["breadth-first-search", "Queue Using Two Stacks", "Easy", GFG("queue-using-two-stacks"), ["queue", "stack"]],
  ["greedy-technique", "Stack Using Two Queues", "Easy", GFG("stack-using-two-queues"), ["stack", "queue"]],
  ["breadth-first-search", "Generate Binary Numbers", "Easy", GFG("generate-binary-numbers-1587115620"), ["queue"]],

  // Trees
  ["depth-first-search", "Inorder Traversal", "Easy", GFG("inorder-traversal"), ["tree", "dfs"]],
  ["depth-first-search", "Preorder Traversal", "Easy", GFG("preorder-traversal"), ["tree", "dfs"]],
  ["depth-first-search", "Height of Binary Tree", "Easy", GFG("height-of-binary-tree"), ["tree", "dfs"]],
  ["depth-first-search", "Diameter of Binary Tree", "Medium", GFG("diameter-of-binary-tree"), ["tree", "dfs"]],
  ["depth-first-search", "Check for BST", "Easy", GFG("check-for-bst"), ["tree", "dfs"]],
  ["depth-first-search", "Lowest Common Ancestor in BST", "Easy", GFG("lowest-common-ancestor-in-a-bst"), ["tree", "dfs"]],
  ["breadth-first-search", "Left View of Binary Tree", "Easy", GFG("left-view-of-binary-tree"), ["tree", "bfs"]],
  ["breadth-first-search", "Top View of Binary Tree", "Medium", GFG("top-view-of-binary-tree"), ["tree", "bfs"]],
  ["breadth-first-search", "Bottom View of Binary Tree", "Medium", GFG("bottom-view-of-binary-tree"), ["tree", "bfs"]],
  ["breadth-first-search", "Boundary Traversal of Binary Tree", "Medium", GFG("boundary-traversal-of-binary-tree"), ["tree", "bfs"]],
  ["top-k-elements", "Kth Largest in BST", "Easy", GFG("kth-largest-element-in-bst"), ["tree", "heap"]],

  // Graphs — GFG graph sheet, not tree/matrix pattern leftovers
  ["breadth-first-search", "BFS of Graph", "Easy", GFG("bfs-traversal-of-graph"), ["graph", "bfs"]],
  ["depth-first-search", "DFS of Graph", "Easy", GFG("depth-first-traversal-for-a-graph"), ["graph", "dfs"]],
  ["depth-first-search", "Undirected Graph Cycle", "Medium", GFG("detect-cycle-in-an-undirected-graph"), ["graph", "dfs"]],
  ["depth-first-search", "Directed Graph Cycle", "Medium", GFG("detect-cycle-in-a-directed-graph"), ["graph", "dfs"]],
  ["breadth-first-search", "Dijkstra Algorithm", "Medium", GFG("implementing-dijkstra-set-1-adjacency-matrix"), ["graph", "bfs"]],
  ["breadth-first-search", "Shortest Path in Undirected Graph", "Medium", GFG("shortest-path-in-undirected-graph"), ["graph", "bfs"]],
  ["breadth-first-search", "Bipartite Graph", "Medium", GFG("bipartite-graph"), ["graph", "bfs"]],
  ["greedy-technique", "Bellman Ford Algorithm", "Medium", GFG("distance-from-the-source-bellman-ford-algorithm"), ["graph"]],
  ["dynamic-programming", "Floyd Warshall Algorithm", "Medium", GFG("implementing-floyd-warshall2042"), ["graph"]],
  ["greedy-technique", "Minimum Spanning Tree (Kruskal)", "Medium", GFG("minimum-spanning-tree-kruskals-algorithm"), ["graph"]],
  ["greedy-technique", "Minimum Spanning Tree (Prim)", "Medium", GFG("minimum-spanning-tree"), ["graph"]],
  ["topological-sort", "Prerequisite Tasks", "Medium", GFG("prerequisite-tasks"), ["graph", "topological-sort"]],
  ["breadth-first-search", "Knight Walk", "Medium", GFG("knight-walk4521"), ["graph", "bfs"]],
  ["island-matrix-traversal", "Find the Number of Islands", "Medium", GFG("find-the-number-of-islands"), ["graph", "matrix", "dfs"]],

  // Heaps
  ["top-k-elements", "Kth Largest Element in Array (Heap)", "Easy", GFG("kth-largest-element5034"), ["heap", "array"]],
  ["top-k-elements", "Kth Smallest Element", "Medium", GFG("kth-smallest-element5635"), ["heap", "array"]],
  ["two-heaps", "Kth Largest in a Stream", "Medium", GFG("kth-largest-element-in-a-stream2220"), ["heap"]],
  ["two-heaps", "Minimum Cost of Ropes", "Easy", GFG("minimum-cost-of-ropes-1587115620"), ["heap"]],
  ["top-k-elements", "Heap Sort", "Medium", GFG("heap-sort"), ["heap"]],

  // Matrix
  ["island-matrix-traversal", "Spirally Traversing a Matrix", "Medium", GFG("spirally-traversing-a-matrix-1587115621"), ["matrix"]],
  ["island-matrix-traversal", "Rotate Matrix by 90 Degrees", "Medium", GFG("rotate-by-90-degree-1587115621"), ["matrix"]],
  ["modified-binary-search", "Search in a Matrix", "Easy", GFG("search-in-a-matrix17201720"), ["matrix", "binary-search"]],
  ["modified-binary-search", "Row with Max 1s", "Medium", GFG("row-with-max-1s0023"), ["matrix", "binary-search"]],

  // Math
  ["bitwise-xor", "LCM and GCD", "Easy", GFG("lcm-and-gcd4516"), ["math"]],
  ["bitwise-xor", "Prime Number Check", "Easy", GFG("prime-number2314"), ["math"]],
  ["bitwise-xor", "Is Binary Number Multiple of 3", "Medium", GFG("is-binary-number-multiple-of-30654"), ["math"]],
];

const dsProblems = dsRows.map(([patternSlug, title, difficulty, link, tags]) => ({
  patternSlug,
  title,
  slug: `ds-${patternSlug}-${slugify(title)}`,
  difficulty,
  source: "GeeksforGeeks",
  tags,
  practiceLink: link,
}));

module.exports = { dsProblems };
