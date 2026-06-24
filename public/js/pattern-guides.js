/**
 * Study notes for each DSA pattern — shown in the pattern info modal.
 */
const PatternGuides = {
  guides: {
    "sliding-window": {
      description:
        "Sliding window maintains a contiguous subarray or substring and moves its boundaries to track the best valid window. Expand the right edge to grow the window, then shrink from the left when a constraint is violated. This avoids recomputing everything from scratch for every starting position.",
      clues: [
        "Problem asks about a contiguous subarray or substring (not any subsequence).",
        "You need the longest, shortest, or count of windows that satisfy a condition.",
        "Brute force would check every start/end pair — O(n²) feels too slow.",
        "Keywords: \"at most K distinct\", \"minimum window\", \"longest without repeating\".",
        "Input is a string or array and the answer depends on a running aggregate (sum, count, frequency).",
      ],
      types: [
        "Fixed-size window — window length K is given; slide both pointers together.",
        "Variable-size window — expand until invalid, shrink until valid again.",
        "Count valid windows — increment answer each time the window becomes valid.",
        "Maximum/minimum in window — combine with monotonic deque for min/max queries.",
        "At-most / exactly-K variants — use inclusion-exclusion (exactly K = atMost(K) - atMost(K-1)).",
      ],
      disguises: [
        {
          question: "Longest substring without repeating characters",
          mapsTo: "Variable-size sliding window — expand right, shrink left while a duplicate exists in the window",
        },
        {
          question: "Minimum size subarray sum ≥ target",
          mapsTo: "Variable-size sliding window — grow until sum is enough, then shrink to minimize length",
        },
        {
          question: "Max sum of any contiguous subarray of size K",
          mapsTo: "Fixed-size sliding window — maintain sum of K elements and slide both pointers together",
        },
        {
          question: "Permutation in string / find all anagrams in a string",
          mapsTo: "Fixed-size sliding window + frequency map — compare window counts to target pattern",
        },
      ],
      pseudocode: `left = 0
for right from 0 to n - 1:
    add nums[right] to window state (sum, counts, etc.)
    while window is invalid:
        remove nums[left] from window state
        left += 1
    update answer with current window (length, count, etc.)
return answer

// Fixed-size variant: once right - left + 1 == K, update then advance left`,
      tips: [
        "Use a hash map for character/element frequencies; a running sum for numeric windows.",
        "Shrink the left pointer while invalid — do not skip this loop or you miss optimal windows.",
        "For \"exactly K\", compute atMost(K) minus atMost(K-1) instead of one tricky loop.",
        "Update the answer after the window is valid, not before you finish shrinking.",
        "Watch off-by-one: \"length\" vs \"count of windows\" vs \"number of characters added\".",
      ],
      complexity: "O(n) time — each element enters and leaves the window once; O(k) space for frequency map where k is alphabet or distinct count.",
    },

    "two-pointers": {
      description:
        "Two pointers scan a sequence from opposite ends or chase each other in the same direction. On sorted data, moving the pointer that moves you toward the target eliminates large chunks of the search space at once. Same-direction pointers also support in-place compaction and merging without extra arrays.",
      clues: [
        "Input is sorted (or can be sorted) and you need pairs or triplets with a target sum.",
        "Palindrome check or reverse comparison from both ends of a string.",
        "Remove duplicates in-place or partition array into two groups.",
        "Merge two sorted arrays or lists in linear time.",
        "Brute force pair checking is O(n²) but the array structure suggests a linear scan.",
      ],
      types: [
        "Opposite ends — left at start, right at end; move based on comparison to target.",
        "Same direction (chase) — fast and slow, or read/write for in-place filtering.",
        "Three-sum / four-sum — fix one element, two-pointer the remainder.",
        "Partitioning — Dutch national flag (three pointers) for three-way split.",
        "Linked list — find middle, check palindrome, or detect intersection.",
      ],
      disguises: [
        {
          question: "Two sum on a sorted array",
          mapsTo: "Opposite-end two pointers — move left or right based on whether sum is too small or too large",
        },
        {
          question: "Valid palindrome (ignore non-alphanumeric)",
          mapsTo: "Opposite-end two pointers — compare chars from both ends moving inward",
        },
        {
          question: "Remove duplicates from sorted array in-place",
          mapsTo: "Same-direction write pointer — overwrite valid region as read pointer scans ahead",
        },
        {
          question: "3Sum / find triplets that sum to zero",
          mapsTo: "Fix one index + two pointers on the sorted remainder",
        },
      ],
      pseudocode: `left = 0, right = n - 1
sort array if needed
while left < right:
    sum = arr[left] + arr[right]
    if sum == target: record pair; move both pointers
    else if sum < target: left += 1
    else: right -= 1
return result

// Same-direction: write = 0; for read in 0..n-1: if valid: arr[write++] = arr[read]`,
      tips: [
        "Sort first when the problem allows it — enables the opposite-ends template.",
        "Skip duplicate values after finding a valid triplet to avoid duplicate results.",
        "For in-place removal, the write pointer tracks where the next kept element goes.",
        "On unsorted pair problems, consider a hash map instead of two pointers.",
        "Draw pointer positions on paper — easy to move the wrong one under pressure.",
      ],
      complexity: "O(n) time for two-pass scan on sorted data; O(n log n) if sorting is required; O(1) extra space.",
    },

    "fast-slow-pointers": {
      description:
        "Two pointers move through a linked structure at different speeds — slow advances one step, fast advances two. If a cycle exists, fast eventually laps slow and they meet. The same technique finds the middle node and the start of a cycle without counting length first.",
      clues: [
        "Linked list problem mentioning cycle detection or finding the middle.",
        "Need to find cycle entry point or length without extra memory.",
        "Detect duplicate in a sequence where values act as next-index pointers.",
        "Find if a number sequence eventually repeats (Happy Number).",
        "Space must be O(1) and a hash set feels like cheating.",
      ],
      types: [
        "Cycle detection — Floyd's tortoise and hare; meeting means cycle exists.",
        "Cycle start — after meeting, reset one pointer to head; advance both one step.",
        "Middle node — when fast reaches end, slow is at middle (even length: second middle).",
        "Palindrome linked list — find middle, reverse second half, compare.",
        "Implicit linked list — array indices as next pointers (duplicate number, happy number).",
      ],
      disguises: [
        {
          question: "Linked list cycle detection",
          mapsTo: "Floyd's fast & slow pointers — if they meet, a cycle exists",
        },
        {
          question: "Find the middle node of a linked list",
          mapsTo: "Slow moves 1 step, fast moves 2 — when fast ends, slow is at middle",
        },
        {
          question: "Find the start of a linked list cycle",
          mapsTo: "After meeting inside cycle, reset one pointer to head; advance both 1 step until they meet at start",
        },
        {
          question: "Happy number / detect repeating sequence",
          mapsTo: "Fast & slow on implicit linked structure defined by next(value) function",
        },
      ],
      pseudocode: `slow = head, fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: cycle detected

// Cycle start: reset slow to head; move both one step until they meet
// Middle: same loop; when fast hits end, slow is middle`,
      tips: [
        "Always check fast and fast.next before advancing fast by two — avoids null errors.",
        "After detecting a cycle, the distance from head to cycle start equals distance from meeting point to cycle start.",
        "For middle-of-list with even length, clarify whether you want the first or second middle.",
        "Works on arrays when index i jumps to nums[i] — treat it as an implicit linked list.",
        "Combine with in-place reversal for palindrome checks on linked lists.",
      ],
      complexity: "O(n) time, O(1) extra space.",
    },

    "merge-intervals": {
      description:
        "Sort intervals by start time, then merge overlapping ones in a single pass. Compare each interval with the last merged interval — if they overlap, extend the end; otherwise start a new interval. This pattern handles scheduling conflicts, room allocation, and inserting a new interval into an existing set.",
      clues: [
        "Input is a list of intervals [start, end] with overlap or scheduling language.",
        "Output is merged intervals, minimum rooms, or maximum concurrent events.",
        "Need to insert a new interval and merge the result.",
        "Problem mentions meetings, appointments, time ranges, or calendar events.",
        "After sorting by start, only the last merged interval can overlap the current one.",
      ],
      types: [
        "Basic merge — sort by start, extend end when overlapping.",
        "Insert interval — merge in one pass or binary search then merge.",
        "Meeting rooms I — sort by start, track max concurrent with min-heap of end times.",
        "Meeting rooms II — sort all start and end events on a timeline.",
        "Interval intersection — two pointers through two sorted interval lists.",
      ],
      disguises: [
        {
          question: "Merge overlapping intervals",
          mapsTo: "Sort by start, extend end of last merged interval when current overlaps",
        },
        {
          question: "Insert interval into a sorted non-overlapping list",
          mapsTo: "Find overlap region, merge affected intervals, splice result back in",
        },
        {
          question: "Meeting rooms II — minimum rooms needed",
          mapsTo: "Sort starts and ends (or use min-heap of end times) to track concurrent overlaps",
        },
        {
          question: "Non-overlapping intervals — max count you can attend",
          mapsTo: "Greedy sort by end time, but overlap detection is merge-intervals thinking",
        },
      ],
      pseudocode: `sort intervals by start time
merged = empty list
for each interval [s, e] in intervals:
    if merged is empty or s > merged.last.end:
        append [s, e] to merged
    else:
        merged.last.end = max(merged.last.end, e)
return merged

// Overlap check: current.start <= previous.end (confirm inclusive vs exclusive)`,
      tips: [
        "Clarify inclusive vs exclusive bounds — [1,5] and [5,10] may or may not overlap.",
        "Draw intervals on a number line when logic feels fuzzy.",
        "For meeting rooms, a min-heap of end times tracks active meetings efficiently.",
        "Separate start/end events and sweep the timeline for room-count problems.",
        "Sorting by end time instead of start helps greedy \"fit most activities\" variants.",
      ],
      complexity: "O(n log n) time for sorting; O(n) merge pass; O(n) space for output.",
    },

    "cyclic-sort": {
      description:
        "When values lie in the range [1, n] (or [0, n-1]), each number belongs at a known index. Swap each element into its correct position in place — like counting sort but using swaps. After one pass, the array is sorted and missing or duplicate values stand out at a glance.",
      clues: [
        "Array contains numbers in range 1 to n (or 0 to n-1) with possible duplicates or gaps.",
        "Find missing number, duplicate, or first number that doesn't match its index.",
        "Constraint: O(n) time and O(1) extra space with in-place modification allowed.",
        "Numbers are a permutation or near-permutation of a known range.",
        "Sorting the whole array works but feels like overkill for the given constraints.",
      ],
      types: [
        "Standard cyclic sort — place nums[i] at index nums[i] - 1.",
        "Find missing number — after sort, first index where nums[i] !== i + 1.",
        "Find all duplicates — collect indices where nums[i] !== i + 1.",
        "First missing positive — only swap values in range [1, n].",
        "Find duplicate (Floyd) — when swaps are awkward, use fast/slow on index graph.",
      ],
      disguises: [
        {
          question: "Find missing number in range [1, n]",
          mapsTo: "Cyclic sort — place each value at index value-1, scan for index where nums[i] !== i+1",
        },
        {
          question: "Find all duplicates in array of 1..n",
          mapsTo: "Cyclic sort — values that try to sit at an already-correct index are duplicates",
        },
        {
          question: "First missing positive",
          mapsTo: "Cyclic sort on array with values in valid index range after normalization",
        },
        {
          question: "Find the duplicate number (one duplicate, O(1) space)",
          mapsTo: "Cyclic sort OR fast/slow pointers — problem often allows either pattern",
        },
      ],
      pseudocode: `i = 0
while i < n:
    correct = nums[i] - 1   // for 1-indexed values
    if nums[i] != nums[correct]:
        swap nums[i] with nums[correct]
    else:
        i += 1
// scan: first i where nums[i] != i + 1 reveals missing/duplicate`,
      tips: [
        "Correct index for value v is v - 1 for 1-indexed ranges, or v for 0-indexed.",
        "Only swap when nums[i] != nums[correct] — prevents infinite loops on duplicates.",
        "Skip values outside [1, n] when finding first missing positive.",
        "Tell the interviewer you are modifying the input — cyclic sort requires it.",
        "If duplicates break swapping, switch to Floyd's cycle detection on indices.",
      ],
      complexity: "O(n) time — each element moves at most once to its slot; O(1) extra space.",
    },

    "island-matrix-traversal": {
      description:
        "Treat a 2D grid as a map and explore connected cells via DFS or BFS. Each time you find an unvisited target cell (land, '1', fresh orange), start a traversal and mark all connected neighbors. Count traversals for islands, propagate for infection spread, or use BFS for shortest steps in an unweighted grid.",
      clues: [
        "Input is a 2D matrix of 0s/1s, characters, or colors.",
        "Count connected components, islands, or distinct regions.",
        "Flood fill, paint bucket, or spread from a source cell.",
        "Shortest path in a grid with uniform step cost.",
        "Keywords: grid, matrix, neighbors, four-directional, surrounded region.",
      ],
      types: [
        "Count islands — DFS/BFS each '1', increment count, mark visited.",
        "Flood fill — recolor connected component from click position.",
        "Rotting oranges — multi-source BFS with time levels.",
        "Max area of island — track size during DFS.",
        "Surrounded regions — DFS from border 'O's, flip inner captures.",
      ],
      disguises: [
        {
          question: "Number of islands",
          mapsTo: "DFS/BFS flood fill — each unvisited '1' starts a new island traversal",
        },
        {
          question: "Max area of island / count enclave cells",
          mapsTo: "DFS/BFS from each land cell, track visited cells and area",
        },
        {
          question: "Rotting oranges / spread from multiple sources",
          mapsTo: "Multi-source BFS on grid — enqueue all sources, expand level by level",
        },
        {
          question: "Shortest path in binary maze",
          mapsTo: "BFS on grid — first time you reach target is shortest in unweighted grid",
        },
      ],
      pseudocode: `for each cell (r, c) in grid:
    if cell is target and not visited:
        count += 1
        dfs(r, c):
            mark (r, c) visited
            for each neighbor in 4 directions:
                if in bounds and is target and not visited:
                    dfs(neighbor)

// BFS variant: enqueue start; while queue: dequeue, enqueue unvisited neighbors`,
      tips: [
        "Mark visited immediately when entering a cell — prevents infinite loops.",
        "Use directions = [[0,1],[1,0],[0,-1],[-1,0]] to avoid copy-paste errors.",
        "Mutating the grid in place ('0' or '#') is faster than a separate visited set.",
        "Multi-source BFS: enqueue all sources first, then process level by level.",
        "For shortest path, BFS guarantees minimum steps; DFS does not.",
      ],
      complexity: "O(rows × cols) time and space for visited tracking in worst case.",
    },

    "in-place-reversal-linked-list": {
      description:
        "Reverse linked list pointers iteratively with three variables: prev, curr, and next. Each step points curr.next to prev and advances all three. Variants reverse the whole list, a subrange between positions, or k nodes at a time while reconnecting segment boundaries.",
      clues: [
        "Explicitly asks to reverse a linked list or a portion of it.",
        "Reverse nodes in groups of k, or reverse between positions m and n.",
        "Reorder list (find middle, reverse second half, merge alternately).",
        "Space must be O(1) — no new list or stack of nodes.",
        "Pointer manipulation on singly linked nodes.",
      ],
      types: [
        "Full reversal — iterative three-pointer loop (prev, curr, next).",
        "Reverse between positions — find sublist head/tail, reverse segment, reconnect.",
        "Reverse in k-groups — reverse each group, link group tails to next group heads.",
        "Palindrome check — reverse second half, compare, optionally restore.",
        "Add two numbers / reorder — reverse to simplify traversal direction.",
      ],
      disguises: [
        {
          question: "Reverse linked list",
          mapsTo: "In-place reversal — prev/curr/next pointer walk flipping next links",
        },
        {
          question: "Reverse linked list II (reverse nodes from position L to R)",
          mapsTo: "Find segment boundaries, reverse that sublist, reconnect head/tail",
        },
        {
          question: "Reverse nodes in k-group",
          mapsTo: "Repeated in-place reversal on each k-length segment",
        },
        {
          question: "Palindrome linked list",
          mapsTo: "Find middle with fast/slow, reverse second half, compare with two pointers",
        },
      ],
      pseudocode: `prev = null, curr = head
while curr:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
return prev   // new head

// Partial reverse: stop at position n; reconnect prev segment to new head`,
      tips: [
        "Draw the list with pointer arrows before coding — easy to lose the tail link.",
        "Use a dummy node before head when the head might change after reversal.",
        "Save the node after the sublist (successor) before reversing so you can reconnect.",
        "Iterative reversal is O(1) space; recursive works but uses O(n) stack.",
        "For k-groups, check if k nodes remain before reversing each group.",
      ],
      complexity: "O(n) time, O(1) extra space for iterative reversal.",
    },

    "breadth-first-search": {
      description:
        "BFS explores a graph or tree level by level using a queue. Enqueue the start node, then repeatedly dequeue, process, and enqueue unvisited neighbors. On unweighted graphs, the first time you reach a node guarantees the shortest path in number of edges.",
      clues: [
        "Shortest path or minimum steps in an unweighted graph or grid.",
        "Level-order traversal of a tree.",
        "Minimum transformations to reach a target (word ladder, lock puzzle).",
        "Spread or infection modeled as simultaneous expansion from multiple sources.",
        "All nodes at distance K from a source.",
      ],
      types: [
        "Standard BFS — queue, visited set, process in FIFO order.",
        "Level-order traversal — track queue size per level for level-by-level output.",
        "Multi-source BFS — enqueue all sources initially (rotting oranges).",
        "0-1 BFS — deque for graphs with 0-weight and 1-weight edges.",
        "Bidirectional BFS — search from both start and goal to reduce explored nodes.",
      ],
      disguises: [
        {
          question: "Binary tree level order traversal",
          mapsTo: "BFS with queue — process all nodes at current depth before moving to next level",
        },
        {
          question: "Shortest path in unweighted graph",
          mapsTo: "BFS from source — first visit marks shortest distance",
        },
        {
          question: "Word ladder — minimum transformations",
          mapsTo: "BFS on implicit graph where edges connect words differing by one letter",
        },
        {
          question: "Minimum moves in knight / grid with obstacles",
          mapsTo: "BFS on state space (position, optional extra state like keys held)",
        },
      ],
      pseudocode: `queue = [start]
visited = {start}
while queue not empty:
    node = dequeue
    for each neighbor of node:
        if neighbor not in visited:
            visited.add(neighbor)
            enqueue neighbor
            record distance / parent for path reconstruction
return result`,
      tips: [
        "Mark visited when enqueueing, not when dequeuing — prevents duplicate queue entries.",
        "For level-order, snapshot queue.size() before processing each level.",
        "Store parent pointers or distances during BFS to reconstruct shortest paths.",
        "On trees, visited is optional — pass depth as a parameter instead.",
        "Bidirectional BFS helps when the branching factor is large and target is known.",
      ],
      complexity: "O(V + E) time for graphs; O(V) space for queue and visited set.",
    },

    "depth-first-search": {
      description:
        "DFS explores as deep as possible before backtracking, using recursion or an explicit stack. It naturally handles path exploration, cycle detection, connected components, and tree structure. Backtrack by undoing choices when you need all paths or combinations rather than just reachability.",
      clues: [
        "Explore all paths, permutations, or combinations.",
        "Detect cycles in a directed or undirected graph.",
        "Count or collect connected components.",
        "Tree problems where you need to process subtrees before or after the node.",
        "Maze exploration, exhaustive search with pruning.",
      ],
      types: [
        "Recursive DFS — base case on null or visited; recurse on neighbors.",
        "Iterative DFS — explicit stack to avoid deep recursion limits.",
        "Backtracking — choose, explore, unchoose for subsets and permutations.",
        "Topological sort — DFS post-order, reverse for dependency ordering.",
        "Path sum / all paths — accumulate path, backtrack when returning.",
      ],
      disguises: [
        {
          question: "Number of connected components in undirected graph",
          mapsTo: "DFS from each unvisited node — each start launches one component",
        },
        {
          question: "Path sum II — all root-to-leaf paths with target sum",
          mapsTo: "DFS with backtracking — push on way down, pop on way up",
        },
        {
          question: "Course schedule — can you finish all courses?",
          mapsTo: "DFS cycle detection on directed graph (or topological sort)",
        },
        {
          question: "Clone graph",
          mapsTo: "DFS/BFS with hash map from original node to clone",
        },
      ],
      pseudocode: `function dfs(node, visited):
    if node is null or node in visited: return
    visited.add(node)
    process node
    for each neighbor of node:
        dfs(neighbor, visited)

// Backtracking variant:
// path.add(choice); dfs(next); path.remove(last)`,
      tips: [
        "Recursive DFS is natural on trees; switch to iterative stack on very deep graphs.",
        "For backtracking, copy the path into results at base case (path is reused).",
        "Use three-color marking (white/gray/black) for cycle detection in directed graphs.",
        "Post-order DFS on trees handles bottom-up aggregation (height, diameter).",
        "Watch stack overflow on large inputs — iterative DFS is safer in production.",
      ],
      complexity: "O(V + E) time for graphs; O(h) recursion stack for tree height h.",
    },

    "two-heaps": {
      description:
        "Maintain a max-heap for the lower half and a min-heap for the upper half of a stream. Keep sizes balanced so the lower half has at most one extra element. The median is always available at the heap tops in O(1) after each balanced insert.",
      clues: [
        "Running median of a number stream.",
        "Sliding window median.",
        "Partition a stream so you can instantly read the middle value.",
        "Balance two halves: smaller values in one structure, larger in another.",
        "Sliding window where you need the median of the last K elements.",
      ],
      types: [
        "Running median — two heaps, rebalance after each insert.",
        "Sliding window median — two heaps with lazy deletion of expired elements.",
        "Sliding window median — multiset or balanced BST as alternative.",
        "Find median from data stream — classic two-heap template.",
        "Partition around median — lower max-heap + upper min-heap for quick access.",
      ],
      disguises: [
        {
          question: "Find median from data stream",
          mapsTo: "Two heaps — max-heap for lower half, min-heap for upper half, rebalance after each insert",
        },
        {
          question: "Sliding window median",
          mapsTo: "Two heaps + lazy deletion (or balanced BST) to support window sliding",
        },
        {
          question: "IPO — pick k projects maximizing capital",
          mapsTo: "Min-heap of affordable projects + max-heap of profits (two-heap style partitioning)",
        },
        {
          question: "Find median of each sliding window of size K",
          mapsTo: "Two heaps or multiset — keep running median as window moves",
        },
      ],
      pseudocode: `maxHeap = lower half (largest of lower at top)
minHeap = upper half (smallest of upper at top)

on insert(x):
    add x to appropriate heap
    rebalance: if size diff > 1, move top from larger to smaller
median = maxHeap.top if odd count
         else average of both tops

// Rebalance: while maxHeap.size > minHeap.size + 1: move top`,
      tips: [
        "JavaScript has no native heap — use a small heap class or sorted array for interviews.",
        "Max-heap stores negatives in JS min-heap libraries to simulate max-heap.",
        "Lazy deletion: mark removed values and clean heap tops when they surface.",
        "Keep the invariant: every element in maxHeap <= every element in minHeap.",
        "After rebalance, size difference should be at most 1.",
      ],
      complexity: "O(log n) per insert; O(1) to read median; O(n) space for stored elements.",
    },

    subsets: {
      description:
        "Generate all subsets, combinations, or permutations by building a decision tree. At each step, include or exclude the current element, then recurse to the next index. Backtrack by undoing the choice after exploring the branch to reuse the same path buffer.",
      clues: [
        "Generate all subsets, combinations, or permutations.",
        "Find all paths, partitions, or groupings of a set.",
        "Search a decision tree with choose / explore / unchoose structure.",
        "Constraint or target sum satisfied by picking elements.",
        "Input size is small (n <= 20) suggesting exponential enumeration.",
      ],
      types: [
        "Subsets / power set — include or skip each element; 2^n results.",
        "Combinations — start next search from index + 1 to avoid duplicates.",
        "Permutations — swap elements or track used[] array; n! results.",
        "Combination sum — allow or disallow reusing the same element.",
        "Partition / palindrome partitioning — cut string at each position, recurse on remainder.",
      ],
      disguises: [
        {
          question: "Subsets / power set",
          mapsTo: "Backtracking — include or skip each element at every index",
        },
        {
          question: "Combination sum I & II",
          mapsTo: "Backtracking with start index — avoid duplicate combos, optional reuse rules",
        },
        {
          question: "Permutations",
          mapsTo: "Backtracking with used[] or swap-based DFS — build order one slot at a time",
        },
        {
          question: "Palindrome partitioning",
          mapsTo: "Backtracking — try every cut position, recurse on remaining substring",
        },
      ],
      pseudocode: `result = []
function backtrack(index, path):
    if index == n:
        result.add(copy of path)
        return
    path.add(nums[index])
    backtrack(index + 1, path)    // include
    path.remove(last)
    backtrack(index + 1, path)  // exclude

// Combinations: backtrack(i + 1, path) after include to skip reuse`,
      tips: [
        "Copy path into result at base case — the path array is mutated in place.",
        "Sort input first to skip duplicate branches (same value at same tree level).",
        "Prune early when remaining elements cannot reach the target sum.",
        "Subsets: 2^n; permutations: n! — mention expected output size to the interviewer.",
        "Template: choose → explore → unchoose; one line per phase keeps code clean.",
      ],
      complexity: "O(2^n) or O(n!) time depending on variant; O(n) recursion depth.",
    },

    "modified-binary-search": {
      description:
        "Binary search works on any monotonic predicate, not just sorted arrays. Narrow left and right bounds until the answer is found — find first/last occurrence, search rotated arrays, or binary search on the answer space (minimum capacity, maximum speed).",
      clues: [
        "Sorted or rotated sorted array — find target or insertion point.",
        "Find first or last occurrence of a value.",
        "Minimize the maximum or maximize the minimum — answer space is monotonic.",
        "Search on answer rather than index: \"minimum speed to finish in H hours\".",
        "O(log n) required where n is array length or answer range.",
      ],
      types: [
        "Classic binary search — exact match in sorted array.",
        "First/last occurrence — when nums[mid] == target, record and search left/right.",
        "Rotated sorted array — identify sorted half, decide which side to search.",
        "Binary search on answer — predicate(can(mid)) is monotonic.",
        "Search in 2D matrix — treat row-major order as one sorted array.",
      ],
      disguises: [
        {
          question: "Search in rotated sorted array",
          mapsTo: "Modified binary search — identify sorted half, discard the other",
        },
        {
          question: "Find first and last position of target",
          mapsTo: "Binary search for leftmost and rightmost boundary (first true / last true)",
        },
        {
          question: "Koko eating bananas / minimum speed",
          mapsTo: "Binary search on answer space — monotonic predicate 'can finish in H hours?'",
        },
        {
          question: "Find peak element",
          mapsTo: "Binary search on slope — move toward the larger neighbor",
        },
      ],
      pseudocode: `left = 0, right = n - 1
while left <= right:
    mid = left + (right - left) / 2
    if condition(mid) is true:
        record answer
        right = mid - 1   // first true: go left; last true: go right
    else:
        left = mid + 1
return answer

// Answer-space: left = min feasible, right = max feasible; check predicate(mid)`,
      tips: [
        "Use mid = left + floor((right - left) / 2) to avoid integer overflow.",
        "For \"first true\" in a boolean array, record answer when true and search left.",
        "Rotated array: one half is always sorted — compare target with that half's bounds.",
        "Binary search on answer requires proving the predicate is monotonic.",
        "Loop invariant: answer is always in [left, right]; use <= until you narrow to one.",
      ],
      complexity: "O(log n) time per search; O(1) extra space.",
    },

    "bitwise-xor": {
      description:
        "XOR cancels equal pairs: a ^ a = 0 and a ^ 0 = a. XOR all elements to find the one unique value when every other appears twice. Combine with bit masks and shifts to isolate bits, count set bits, or split numbers into groups.",
      clues: [
        "Find the single number that appears once; all others appear twice.",
        "Find two unique numbers when all others appear twice.",
        "Missing number in range [0, n] or [1, n] with O(1) space.",
        "Swap without temp variable, or detect differing bits between numbers.",
        "Constraints suggest O(n) time and O(1) space without hash maps.",
      ],
      types: [
        "Single unique — XOR entire array.",
        "Two uniques — XOR all, find a set bit, partition and XOR each group.",
        "Missing number — XOR index i with nums[i], or XOR 1..n with all nums.",
        "Bit counting — n & (n-1) clears lowest set bit; count until zero.",
        "Power of two — n > 0 and (n & (n-1)) == 0.",
      ],
      disguises: [
        {
          question: "Single number (every element appears twice except one)",
          mapsTo: "XOR all values — pairs cancel, leftover is the unique",
        },
        {
          question: "Missing number in range 0..n",
          mapsTo: "XOR index i with nums[i], or XOR full range 0..n with all nums",
        },
        {
          question: "Two single numbers in array where others appear twice",
          mapsTo: "XOR all, isolate a set bit, partition into two groups and XOR each",
        },
        {
          question: "Maximum XOR of two numbers in array",
          mapsTo: "Bit trie / greedy bit building from MSB to LSB",
        },
      ],
      pseudocode: `xor = 0
for each num in nums:
    xor ^= num
return xor   // single unique

// Two uniques:
xorAll = XOR of all
bit = xorAll & (-xorAll)   // isolate rightmost set bit
group0 = XOR nums where (num & bit == 0)
group1 = xorAll ^ group0`,
      tips: [
        "XOR is commutative and associative — order does not matter.",
        "a ^ a = 0 and a ^ 0 = a are the two identities to remember.",
        "To find two uniques, any set bit in xorAll splits the numbers into two groups.",
        "Combine with shifts for problems like reverse bits or hamming distance.",
        "Watch for integer overflow in languages with fixed-width ints; JS is safe.",
      ],
      complexity: "O(n) time, O(1) extra space for single-pass XOR.",
    },

    "top-k-elements": {
      description:
        "Find the K largest, smallest, or most frequent elements without fully sorting. A size-K heap keeps only the best candidates — O(n log k) instead of O(n log n). Quickselect offers O(n) average for a one-shot Kth element; bucket sort helps when value range is small.",
      clues: [
        "K largest, K smallest, or Kth element in an array or stream.",
        "Top K frequent words or elements.",
        "K closest points to origin or to a target.",
        "K pairs with smallest sums from two arrays.",
        "K is much smaller than n, or streaming data prevents full sort.",
      ],
      types: [
        "K largest — min-heap of size K (root is weakest of top K).",
        "K smallest — max-heap of size K.",
        "Top K frequent — frequency map + min-heap by frequency.",
        "Kth largest — quickselect or min-heap of size K.",
        "K closest points — max-heap of size K ordered by distance.",
      ],
      disguises: [
        {
          question: "Kth largest element in array",
          mapsTo: "Min-heap of size K — root is the Kth largest",
        },
        {
          question: "Top K frequent elements",
          mapsTo: "Frequency map + min-heap of size K on frequency",
        },
        {
          question: "K closest points to origin",
          mapsTo: "Max-heap of size K on distance — evict farthest when heap is full",
        },
        {
          question: "Find K pairs with smallest sums from two sorted arrays",
          mapsTo: "Min-heap seeded with (nums1[0], nums2[j]) pairs, expand lazily",
        },
      ],
      pseudocode: `heap = min-heap of size K
for each num in nums:
    add num to heap
    if heap.size > K: remove heap minimum
return heap contents   // K largest

// Kth largest: after loop, heap.top is the answer
// Frequency: map counts, heap by count, keep top K`,
      tips: [
        "Min-heap for K largest — evict the smallest when size exceeds K.",
        "If K is close to n, full sort may be simpler and fast enough.",
        "Bucket sort by frequency works when values are bounded (e.g., 1 to 10^4).",
        "Quickselect modifies the array — mention that or copy first.",
        "For strings, tie-break by lex order when frequencies are equal.",
      ],
      complexity: "O(n log k) with size-K heap; O(n) average with quickselect; O(n) space for heap.",
    },

    "k-way-merge": {
      description:
        "Merge K sorted lists or arrays by always picking the smallest current head among all lists. A min-heap of size K holds one pointer per list — pop the minimum, advance that list, push the next value. Also applies to merging K sorted arrays and smallest-range-covering-K-lists problems.",
      clues: [
        "Merge K sorted linked lists or arrays into one sorted output.",
        "Find the Kth smallest in a sorted matrix (row-wise sorted).",
        "Smallest range covering at least one element from each of K lists.",
        "Multiple sorted streams must be combined efficiently.",
        "Heap size K or log K factor appears in expected complexity.",
      ],
      types: [
        "K-way merge with heap — pop min, push next from same list.",
        "Divide and conquer merge — merge pairs recursively; also O(N log K).",
        "Kth smallest in sorted matrix — heap of row heads.",
        "Smallest range — min-heap + track current max in window.",
        "External merge sort — merge K sorted file chunks.",
      ],
      disguises: [
        {
          question: "Merge K sorted lists",
          mapsTo: "Min-heap of list heads — pop smallest, push that list's next node",
        },
        {
          question: "Merge K sorted arrays",
          mapsTo: "Same heap pattern with (value, arrayIndex, elementIndex) tuples",
        },
        {
          question: "Smallest range covering one element from each of K lists",
          mapsTo: "K-way merge with tracking current max in window + shrink range",
        },
        {
          question: "Find Kth smallest in sorted matrix",
          mapsTo: "K-way merge from first column, or binary search on value space",
        },
      ],
      pseudocode: `heap = min-heap
push (value, listIndex, elemIndex) for first element of each list
result = []
while heap not empty:
    (val, i, j) = pop min
    append val to result
    if list i has element at j + 1:
        push (lists[i][j+1], i, j+1)
return result`,
      tips: [
        "Store (value, list index, position) in the heap — not just the value.",
        "Check for empty lists at initialization — skip them.",
        "Divide-and-conquer pair merge avoids heap overhead and is also O(N log K).",
        "For smallest range, update range when heap size equals K and track max element.",
        "JavaScript: use a custom comparator on [value, listIdx, elemIdx] tuples.",
      ],
      complexity: "O(N log K) time where N is total elements across K lists; O(K) heap space.",
    },

    "topological-sort": {
      description:
        "Order nodes in a directed acyclic graph so every edge goes from earlier to later. Kahn's algorithm (BFS on in-degree zero nodes) or DFS post-order both work. If you cannot process all nodes, a cycle exists and no valid ordering is possible.",
      clues: [
        "Prerequisites, dependencies, or \"must come before\" constraints.",
        "Course schedule — can you finish all courses?",
        "Build order, task ordering, or compilation dependency chain.",
        "Directed graph where order matters and cycles mean impossible.",
        "Alien dictionary or custom character order from sorted words.",
      ],
      types: [
        "Kahn's algorithm — BFS, in-degree count, enqueue zeros.",
        "DFS post-order — recurse neighbors, push node after visiting, reverse.",
        "Course schedule I — detect if valid ordering exists.",
        "Course schedule II — return one valid ordering.",
        "Longest path in DAG — DP on topological order.",
      ],
      disguises: [
        {
          question: "Course schedule I — can you finish all courses?",
          mapsTo: "Topological sort / Kahn's BFS — cycle means impossible",
        },
        {
          question: "Course schedule II — return a valid order",
          mapsTo: "Topological sort — output order when in-degree hits 0",
        },
        {
          question: "Alien dictionary — sorted order of characters",
          mapsTo: "Build graph from adjacent words, topological sort the letters",
        },
        {
          question: "Sequence reconstruction — is order unique?",
          mapsTo: "Topological sort + verify only one valid choice at each step",
        },
      ],
      pseudocode: `build adjacency list and inDegree for each node
queue = all nodes with inDegree 0
order = []
while queue not empty:
    node = dequeue
    order.add(node)
    for neighbor in adj[node]:
        inDegree[neighbor] -= 1
        if inDegree[neighbor] == 0: enqueue neighbor
return order if order.size == n else []   // cycle if not all processed`,
      tips: [
        "Kahn's BFS makes cycle detection easy — processed count < n means cycle.",
        "DFS approach: use gray/black coloring; gray neighbor means back edge (cycle).",
        "Map problem entities (course names) to 0..n-1 indices for array-based in-degree.",
        "For all topological orders, backtrack with available zero in-degree nodes.",
        "Topological sort only applies to DAGs — confirm direction of edges.",
      ],
      complexity: "O(V + E) time and O(V + E) space for adjacency list and in-degree.",
    },

    "knapsack-01": {
      description:
        "Each item can be taken at most once — choose a subset maximizing value without exceeding weight capacity. Build a DP table where dp[w] is the best value achievable with capacity w. Iterate items outer loop, capacities inner loop backwards to prevent using the same item twice per row.",
      clues: [
        "Pick items with weight and value; each item at most once.",
        "Target sum or subset sum — can you reach exactly W?",
        "Partition equal subset sum — split into two equal groups.",
        "Maximize value with a weight or capacity limit.",
        "Small item count but capacity suggests O(n × W) DP is acceptable.",
      ],
      types: [
        "0/1 knapsack — take or skip each item once.",
        "Subset sum — weights only; check if dp[target] is reachable.",
        "Partition equal subset — subset sum to total/2.",
        "Count subsets with sum W — dp counts paths instead of max value.",
        "Unbounded knapsack — inner loop forwards (items reusable).",
      ],
      disguises: [
        {
          question: "0/1 Knapsack — max value with weight limit W",
          mapsTo: "DP table dp[capacity] = best value using items so far, iterate weights backward",
        },
        {
          question: "Partition equal subset sum",
          mapsTo: "0/1 knapsack — can you fill capacity target/2?",
        },
        {
          question: "Target sum with + and - signs",
          mapsTo: "Subset-sum DP — count ways to reach target with +/- assignments",
        },
        {
          question: "Coin change II — count combinations (unbounded knapsack variant)",
          mapsTo: "DP on amount — outer loop coins, inner forward on amounts",
        },
      ],
      pseudocode: `dp[0..W] = 0
for each item (weight, value):
    for w from W down to weight:
        take = dp[w - weight] + value
        skip = dp[w]
        dp[w] = max(skip, take)
return dp[W]

// Subset sum: dp[w] = true if achievable; start dp[0] = true`,
      tips: [
        "Iterate w backwards in 0/1 knapsack — forward allows reusing the same item.",
        "Space optimize to 1D array when only previous row matters.",
        "Subset sum: if total is odd, equal partition is impossible immediately.",
        "If W is huge (10^9), DP won't fit — look for greedy or meet-in-the-middle.",
        "Track parent pointers in dp if you must reconstruct which items were chosen.",
      ],
      complexity: "O(n × W) time and O(W) space with 1D optimization; n items, capacity W.",
    },

    "longest-common-substring": {
      description:
        "Compare two strings or sequences with 2D dynamic programming. When characters match, extend the diagonal; on mismatch, substring problems reset while subsequence problems take the max of left or top. Variants include longest common subsequence, edit distance, and longest palindromic substring.",
      clues: [
        "Two strings compared — common subsequence, substring, or edit distance.",
        "Minimum insertions/deletions to transform one string to another.",
        "Longest palindromic substring or subsequence.",
        "2D table where dp[i][j] depends on dp[i-1][j-1] or neighbors.",
        "Grid or string DP with matching character condition.",
      ],
      types: [
        "Longest common subsequence (LCS) — mismatch: max(left, top).",
        "Longest common substring — mismatch: reset to 0; track global max.",
        "Edit distance (Levenshtein) — insert, delete, replace on mismatch.",
        "Longest palindromic substring — expand around center or DP on intervals.",
        "Shortest common supersequence — build on LCS length.",
      ],
      disguises: [
        {
          question: "Longest common subsequence",
          mapsTo: "2D DP — match adds 1 to diagonal, else max(top, left)",
        },
        {
          question: "Longest common substring",
          mapsTo: "2D DP — match extends diagonal, mismatch resets to 0",
        },
        {
          question: "Edit distance (Levenshtein)",
          mapsTo: "2D DP — insert/delete/replace costs on mismatch",
        },
        {
          question: "Longest palindromic subsequence",
          mapsTo: "LCS-style DP on s and reverse(s), or interval DP on substring",
        },
      ],
      pseudocode: `dp[m+1][n+1] initialized to 0
for i from 1 to m:
    for j from 1 to n:
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1   // LCS/substring variant
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])   // LCS
            // substring: dp[i][j] = 0
return dp[m][n] or max over table`,
      tips: [
        "Substring vs subsequence: mismatch resets cell to 0 only for substring.",
        "Edit distance adds 1 + min(insert, delete, replace) on mismatch.",
        "Roll to 1D row when only the previous row is needed — save space.",
        "Palindrome substring: try each center (and even/odd pairs) with expand.",
        "Print reconstruction: backtrack from dp[m][n] following which cell was used.",
      ],
      complexity: "O(m × n) time and space; O(n) space with rolling array optimization.",
    },

    "dynamic-programming": {
      description:
        "Break a problem into overlapping subproblems with optimal substructure. Define a state, write a recurrence relating each state to smaller ones, and fill a table bottom-up or memoize top-down. Use when brute force recurses into the same states repeatedly.",
      clues: [
        "Count ways, minimum cost, maximum profit, or can/cannot reach target.",
        "Brute force recursion repeats the same sub-states.",
        "Choices at each step affect future options — optimal substructure.",
        "Keywords: maximum, minimum, number of ways, longest, shortest with constraints.",
        "Problem has sequential decisions or grid paths with cost.",
      ],
      types: [
        "1D DP — climbing stairs, house robber, coin change.",
        "2D DP — grid paths, two-string problems, knapsack tables.",
        "Interval DP — burst balloons, matrix chain multiplication.",
        "State machine DP — buy/sell stock with cooldown or fees.",
        "Bitmask DP — traveling salesman on small n (2^n states).",
      ],
      disguises: [
        {
          question: "Climbing stairs — count ways to reach top",
          mapsTo: "1D DP — dp[i] = dp[i-1] + dp[i-2] (Fibonacci overlap)",
        },
        {
          question: "House robber — max money without adjacent houses",
          mapsTo: "1D DP — dp[i] = max(dp[i-1], nums[i] + dp[i-2])",
        },
        {
          question: "Coin change — minimum coins for amount",
          mapsTo: "Unbounded knapsack DP — dp[amount] = min over coins",
        },
        {
          question: "Longest increasing subsequence",
          mapsTo: "DP O(n²) or patience sorting O(n log n) — pick based on constraints",
        },
      ],
      pseudocode: `define state dp[i] or dp[i][j]
set base cases (dp[0], first row/column)
for i in order where dependencies are ready:
    for each choice at i:
        dp[i] = best of (dp[prev] + cost) over valid transitions
return dp[target index]

// Top-down: memo[key] = result if memo has key else compute and store`,
      tips: [
        "Define state in English before coding — \"dp[i] = max value using first i items\".",
        "Draw the table for a tiny example to verify recurrence direction.",
        "Reduce dimensions when only previous row or column is needed.",
        "If state is unclear, write brute force recursion first, then memoize.",
        "Iterate order matters — ensure sub-states are computed before dependents.",
      ],
      complexity: "Depends on state space — typically O(n) to O(n²) or O(n × W); O(states) space.",
    },

    "greedy-technique": {
      description:
        "Make the locally best choice at each step and hope it yields a global optimum. Often requires sorting by a key criterion — earliest finish time, highest ratio, or nearest deadline. Greedy works when an exchange argument proves no better solution is blocked by an early choice.",
      clues: [
        "Scheduling, intervals, or \"pick the best available now\" decisions.",
        "Minimum number of arrows, platforms, or resources to cover all items.",
        "Fractional knapsack — take best value-to-weight ratio first.",
        "Local optimal choice seems obviously safe; problem has matroid-like structure.",
        "DP feels heavy but a sort-and-scan approach might suffice.",
      ],
      types: [
        "Activity selection — sort by end time, greedily pick non-overlapping.",
        "Interval covering — sort starts, extend reach with minimum additions.",
        "Huffman coding — merge two smallest frequencies repeatedly.",
        "Jump game — track farthest reachable index.",
        "Task scheduler / rearrange string — frequency-based greedy with cooldown.",
      ],
      disguises: [
        {
          question: "Non-overlapping intervals — maximum count",
          mapsTo: "Greedy — sort by end time, take next compatible interval",
        },
        {
          question: "Jump game — can you reach the last index?",
          mapsTo: "Greedy — track farthest reachable index as you scan",
        },
        {
          question: "Gas station circuit",
          mapsTo: "Greedy — total gas vs total cost; start from station after first deficit",
        },
        {
          question: "Assign cookies to children — maximize content children",
          mapsTo: "Greedy — sort both arrays, match smallest sufficient cookie",
        },
      ],
      pseudocode: `sort items by greedy key (end time, ratio, deadline)
result = 0
lastEnd = -infinity
for each item in sorted order:
    if item satisfies feasibility (start >= lastEnd):
        result += 1
        lastEnd = item.end
return result`,
      tips: [
        "If greedy fails, try a counterexample quickly — then switch to DP.",
        "Sort key is everything; wrong sort criterion breaks the proof.",
        "Activity selection: sort by finish time, not start time.",
        "Pair greedy with heaps when you need the \"best current\" choice repeatedly.",
        "State the greedy rule aloud and justify it before coding.",
      ],
      complexity: "Often O(n log n) from sorting; sometimes O(n) with pre-sorted input.",
    },
  },

  get(slug) {
    return this.guides[slug] || null;
  },
};

if (typeof window !== "undefined") {
  window.PatternGuides = PatternGuides;
}
