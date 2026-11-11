import { DSATopic } from '../types/dsa';

export const DSA_TOPICS: DSATopic[] = [
  // --- Sorting Algorithms ---
  {
    id: 'quick-sort',
    title: 'Quick Sort (Partitioning)',
    category: 'sorting',
    difficulty: 'Medium',
    leetcodeNumber: 912,
    leetcodeTitle: 'Sort an Array',
    summary: 'Divide-and-conquer algorithm that selects a "pivot" element and partitions array into sub-arrays of smaller and greater elements.',
    complexity: {
      bestTime: 'Ω(N log N)',
      avgTime: 'Θ(N log N)',
      worstTime: 'O(N²)',
      space: 'O(log N)',
      inPlace: true,
      stability: 'Unstable'
    },
    keyTakeaways: [
      'Picks a pivot, places it into its final sorted position via partitioning.',
      'Lomuto and Hoare are standard partitioning schemes; Lomuto is cleaner for teaching.',
      'Worst case occurs when pivot choices are highly unbalanced (e.g. sorted input with last-element pivot).'
    ],
    pythonTip: 'Python uses Timsort in list.sort(), but quicksort partition principles are essential for Quickselect (finding the k-th smallest item in O(N) average time).'
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort (Divide & Conquer)',
    category: 'sorting',
    difficulty: 'Medium',
    leetcodeNumber: 912,
    leetcodeTitle: 'Sort an Array',
    summary: 'Guaranteed O(N log N) recursive sorting algorithm that divides array in halves, sorts each half, and merges them back in linear time.',
    complexity: {
      bestTime: 'Ω(N log N)',
      avgTime: 'Θ(N log N)',
      worstTime: 'O(N log N)',
      space: 'O(N)',
      inPlace: false,
      stability: 'Stable'
    },
    keyTakeaways: [
      'Always splits array into two halves until length <= 1, then merges.',
      'Guarantees O(N log N) performance regardless of input distribution.',
      'Requires auxiliary array memory for the merge stage.'
    ],
    pythonTip: 'Merge Sort is stable: equal keys maintain their relative order. This is a foundational property used in Python’s hybrid Timsort.'
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'Easy',
    leetcodeNumber: 75,
    leetcodeTitle: 'Sort Colors (Fundamental Comparison)',
    summary: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Largest element "bubbles" up to the end.',
    complexity: {
      bestTime: 'Ω(N)',
      avgTime: 'Θ(N²)',
      worstTime: 'O(N²)',
      space: 'O(1)',
      inPlace: true,
      stability: 'Stable'
    },
    keyTakeaways: [
      'Simple pairwise comparisons moving from left to right.',
      'Optimized with a swapped boolean flag to terminate early on sorted input in O(N).',
      'At the end of pass i, the i-th largest element is permanently in its sorted position.'
    ],
    pythonTip: 'In Python, swapping two elements is idiomatic: arr[j], arr[j+1] = arr[j+1], arr[j] without needing a temporary variable.'
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'sorting',
    difficulty: 'Easy',
    summary: 'Builds the final sorted array one item at a time by repeatedly picking the next item and inserting it into its correct position among previously sorted elements.',
    complexity: {
      bestTime: 'Ω(N)',
      avgTime: 'Θ(N²)',
      worstTime: 'O(N²)',
      space: 'O(1)',
      inPlace: true,
      stability: 'Stable'
    },
    keyTakeaways: [
      'Extremely efficient for small arrays (N <= 32) and nearly sorted datasets.',
      'In-place and stable: shifts elements right to make room for insertion.'
    ],
    pythonTip: 'Python uses Insertion Sort internally for small chunks (runs) inside Timsort because of minimal overhead and cache locality.'
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    category: 'sorting',
    difficulty: 'Easy',
    summary: 'Divides list into sorted and unsorted regions; continuously finds minimum element in unsorted region and swaps it to the front.',
    complexity: {
      bestTime: 'Ω(N²)',
      avgTime: 'Θ(N²)',
      worstTime: 'O(N²)',
      space: 'O(1)',
      inPlace: true,
      stability: 'Unstable'
    },
    keyTakeaways: [
      'Makes at most O(N) swaps, useful when memory write operations are expensive.',
      'Always makes O(N²) comparisons regardless of input ordering.'
    ],
    pythonTip: 'Selection sort does not adapt to pre-sorted input; it always scans the rest of the array.'
  },
  {
    id: 'heap-sort',
    title: 'Heap Sort',
    category: 'sorting',
    difficulty: 'Medium',
    leetcodeNumber: 215,
    leetcodeTitle: 'Kth Largest Element in an Array',
    summary: 'Converts array into a Max-Heap binary tree, then repeatedly extracts max element and rebuilds heap.',
    complexity: {
      bestTime: 'Ω(N log N)',
      avgTime: 'Θ(N log N)',
      worstTime: 'O(N log N)',
      space: 'O(1)',
      inPlace: true,
      stability: 'Unstable'
    },
    keyTakeaways: [
      'In-place O(N log N) sorting using binary heap heapify operations.',
      'Building max-heap takes O(N) time; extracting N elements takes O(N log N).'
    ],
    pythonTip: 'Python provides the built-in heapq module (which implements a min-heap by default).'
  },

  // --- Non-Linear Data Structures (Trees) ---
  {
    id: 'bst',
    title: 'Binary Search Tree (BST)',
    category: 'trees',
    difficulty: 'Medium',
    leetcodeNumber: 701,
    leetcodeTitle: 'Insert into a Binary Search Tree',
    summary: 'Hierarchical node structure where left descendants have keys strictly less than the node, and right descendants have keys strictly greater.',
    complexity: {
      bestTime: 'Ω(log N)',
      avgTime: 'Θ(log N)',
      worstTime: 'O(N)',
      space: 'O(N)',
      inPlace: true
    },
    keyTakeaways: [
      'Enables fast lookup, insertion, and deletion in O(log N) average time.',
      'Degenerates into a linked list of height O(N) if elements are inserted in sorted order.',
      'In-Order Traversal (Left -> Root -> Right) visits elements in strictly sorted ascending order!'
    ],
    pythonTip: 'In Python, BST nodes are typically modeled with a simple class: class TreeNode: def __init__(self, val=0, left=None, right=None).'
  },
  {
    id: 'avl-tree',
    title: 'AVL Tree (Self-Balancing)',
    category: 'trees',
    difficulty: 'Hard',
    leetcodeNumber: 110,
    leetcodeTitle: 'Balanced Binary Tree',
    summary: 'Self-balancing BST where the difference in heights of left and right subtrees (Balance Factor) never exceeds 1 for every node.',
    complexity: {
      bestTime: 'Ω(log N)',
      avgTime: 'Θ(log N)',
      worstTime: 'O(log N)',
      space: 'O(N)',
      inPlace: true
    },
    keyTakeaways: [
      'Guarantees strict O(log N) height via Left (LL), Right (RR), Left-Right (LR), and Right-Left (RL) rotations.',
      'Strictly balanced compared to Red-Black trees, making lookups faster at the cost of slightly slower insertions.'
    ],
    pythonTip: 'Computing balance factor: height(node.left) - height(node.right). If |BF| > 1, apply rotations.'
  },
  {
    id: 'binary-tree-traversals',
    title: 'Binary Tree Traversals (DFS/BFS)',
    category: 'trees',
    difficulty: 'Medium',
    leetcodeNumber: 102,
    leetcodeTitle: 'Binary Tree Level Order Traversal',
    summary: 'Systematic methods for visiting every node in a binary tree: In-Order, Pre-Order, Post-Order, and Breadth-First (Level-Order).',
    complexity: {
      bestTime: 'Ω(N)',
      avgTime: 'Θ(N)',
      worstTime: 'O(N)',
      space: 'O(H) / O(N)',
      inPlace: false
    },
    keyTakeaways: [
      'Pre-Order: Root -> Left -> Right (used for cloning / serialization).',
      'In-Order: Left -> Root -> Right (produces sorted order in BST).',
      'Post-Order: Left -> Right -> Root (used for deleting tree / bottom-up calculations).',
      'Level-Order: FIFO Queue visiting nodes layer by layer.'
    ],
    pythonTip: 'Use collections.deque for O(1) popleft() operations during BFS level-order traversal.'
  },

  // --- Searching Algorithms ---
  {
    id: 'binary-search',
    title: 'Binary Search (Pointers)',
    category: 'searching',
    difficulty: 'Easy',
    leetcodeNumber: 704,
    leetcodeTitle: 'Binary Search',
    summary: 'Efficient search algorithm on a sorted array that halves search space at each comparison by checking middle element against target.',
    complexity: {
      bestTime: 'Ω(1)',
      avgTime: 'Θ(log N)',
      worstTime: 'O(log N)',
      space: 'O(1)',
      inPlace: true
    },
    keyTakeaways: [
      'Requires array to be monotonically sorted.',
      'Calculates mid = (low + high) // 2 (or low + (high - low) // 2 to avoid overflow in static languages).',
      'Discards half of the remaining array with each comparison.'
    ],
    pythonTip: 'Python provides bisect_left and bisect_right from the standard bisect module for production binary searches.'
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers Technique',
    category: 'searching',
    difficulty: 'Medium',
    leetcodeNumber: 167,
    leetcodeTitle: 'Two Sum II - Input Array Is Sorted',
    summary: 'Uses two pointers traversing from both ends or in the same direction to solve problems in O(N) time with O(1) space.',
    complexity: {
      bestTime: 'Ω(1)',
      avgTime: 'Θ(N)',
      worstTime: 'O(N)',
      space: 'O(1)',
      inPlace: true
    },
    keyTakeaways: [
      'Shrinks search range by moving left pointer right when sum is too small, or right pointer left when sum is too big.',
      'Reduces brute-force O(N²) search to linear O(N).'
    ],
    pythonTip: 'Classic pattern: left, right = 0, len(arr) - 1. Loop while left < right.'
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window Pattern',
    category: 'searching',
    difficulty: 'Medium',
    leetcodeNumber: 3,
    leetcodeTitle: 'Longest Substring Without Repeating Characters',
    summary: 'Maintains a running contiguous sub-segment across an array or string to compute maximum, minimum, or matching constraints in linear time.',
    complexity: {
      bestTime: 'Ω(N)',
      avgTime: 'Θ(N)',
      worstTime: 'O(N)',
      space: 'O(K)',
      inPlace: false
    },
    keyTakeaways: [
      'Window expands by advancing the right pointer, and contracts by advancing the left pointer.',
      'Replaces quadratic nested loops with a single pass where both pointers move at most N times.'
    ],
    pythonTip: 'Pair sliding window with a collections.Counter or hash map to maintain frequency counts.'
  },

  // --- Linear Data Structures ---
  {
    id: 'singly-linked-list',
    title: 'Singly Linked List',
    category: 'linear',
    difficulty: 'Easy',
    leetcodeNumber: 206,
    leetcodeTitle: 'Reverse Linked List',
    summary: 'Sequence of data nodes where each node stores a value and a reference pointer to the subsequent node in memory.',
    complexity: {
      bestTime: 'Ω(1) (Insert Head)',
      avgTime: 'Θ(N) (Access)',
      worstTime: 'O(N)',
      space: 'O(N)',
      inPlace: true
    },
    keyTakeaways: [
      'Dynamic size without memory reallocation; fast O(1) prepend.',
      'No random access: accessing element at index k requires traversing k pointers.',
      'Reversal requires three pointers: prev, curr, and next_node.'
    ],
    pythonTip: 'Three-pointer reversal in Python: prev = None; curr = head; while curr: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt.'
  },
  {
    id: 'stack',
    title: 'Stack (LIFO)',
    category: 'linear',
    difficulty: 'Easy',
    leetcodeNumber: 20,
    leetcodeTitle: 'Valid Parentheses',
    summary: 'Last-In-First-Out linear structure supporting O(1) push, pop, and top inspection operations.',
    complexity: {
      bestTime: 'Ω(1)',
      avgTime: 'Θ(1)',
      worstTime: 'O(1)',
      space: 'O(N)',
      inPlace: true
    },
    keyTakeaways: [
      'LIFO discipline: the last element added is the first one removed.',
      'Underpins function call stacks, parenthesis matching, monotonic stack problems, and DFS.'
    ],
    pythonTip: 'Python lists are optimized as dynamic stacks: append() for push, pop() for pop in amortized O(1) time.'
  },
  {
    id: 'queue',
    title: 'Queue & Circular Queue (FIFO)',
    category: 'linear',
    difficulty: 'Medium',
    leetcodeNumber: 622,
    leetcodeTitle: 'Design Circular Queue',
    summary: 'First-In-First-Out data structure where elements are added at rear and removed from front. Circular queues reuse empty slots to avoid memory drift.',
    complexity: {
      bestTime: 'Ω(1)',
      avgTime: 'Θ(1)',
      worstTime: 'O(1)',
      space: 'O(N)',
      inPlace: true
    },
    keyTakeaways: [
      'FIFO discipline: elements exit in exact order of arrival.',
      'Using a standard Python list for queue pop(0) is slow O(N) because all remaining elements shift left.',
      'collections.deque provides O(1) popleft() and append().'
    ],
    pythonTip: 'Always import from collections import deque in Python for queues and BFS.'
  },

  // --- Graph Algorithms ---
  {
    id: 'bfs',
    title: 'Breadth-First Search (BFS)',
    category: 'graphs',
    difficulty: 'Medium',
    leetcodeNumber: 200,
    leetcodeTitle: 'Number of Islands',
    summary: 'Explores graph layer by layer using a FIFO queue, finding shortest path in unweighted graphs.',
    complexity: {
      bestTime: 'Ω(V + E)',
      avgTime: 'Θ(V + E)',
      worstTime: 'O(V + E)',
      space: 'O(V)',
      inPlace: false
    },
    keyTakeaways: [
      'Visits all neighbors at depth d before moving to depth d+1.',
      'Requires a visited set or boolean array to avoid infinite loops in cyclic graphs.'
    ],
    pythonTip: 'Standard template: q = deque([start]); visited = {start}; while q: node = q.popleft(); for nei in graph[node]: ...'
  },
  {
    id: 'dfs',
    title: 'Depth-First Search (DFS)',
    category: 'graphs',
    difficulty: 'Medium',
    leetcodeNumber: 547,
    leetcodeTitle: 'Number of Provinces',
    summary: 'Traverses as deep as possible along each branch before backtracking using recursion or an explicit stack.',
    complexity: {
      bestTime: 'Ω(V + E)',
      avgTime: 'Θ(V + E)',
      worstTime: 'O(V + E)',
      space: 'O(V)',
      inPlace: false
    },
    keyTakeaways: [
      'Ideal for topological sorting, cycle detection, and connected components.',
      'Call stack grows to O(V) in deep or linear graphs.'
    ],
    pythonTip: 'Watch out for Python’s default recursion limit (sys.getrecursionlimit() is 1000). Use sys.setrecursionlimit() or an iterative stack for deep trees.'
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Shortest Path",
    category: 'graphs',
    difficulty: 'Hard',
    leetcodeNumber: 743,
    leetcodeTitle: 'Network Delay Time',
    summary: 'Greedy algorithm that finds single-source shortest paths in a weighted graph with non-negative edge weights using a Priority Queue.',
    complexity: {
      bestTime: 'Ω(E log V)',
      avgTime: 'Θ(E log V)',
      worstTime: 'O(E log V)',
      space: 'O(V)',
      inPlace: false
    },
    keyTakeaways: [
      'Greedily selects the unvisited node with minimum tentative distance from source.',
      'Cannot handle negative edge weights (use Bellman-Ford for negative weights).'
    ],
    pythonTip: 'Use heapq.heappush(pq, (distance, node)) and heapq.heappop(pq) to implement min-priority queue in Python.'
  },

  // --- Advanced & Paradigms ---
  {
    id: 'n-queens',
    title: 'N-Queens (Backtracking)',
    category: 'advanced',
    difficulty: 'Hard',
    leetcodeNumber: 51,
    leetcodeTitle: 'N-Queens',
    summary: 'Classic backtracking problem of placing N non-attacking queens on an N×N chessboard.',
    complexity: {
      bestTime: 'Ω(N!)',
      avgTime: 'Θ(N!)',
      worstTime: 'O(N!)',
      space: 'O(N)',
      inPlace: false
    },
    keyTakeaways: [
      'Places queens row by row. If conflict detected on column or diagonals, backtracks.',
      'Diagonal tracks: (row - col) for main diagonals and (row + col) for anti-diagonals.'
    ],
    pythonTip: 'Track attacked columns and diagonals with three sets: cols = set(), diag1 = set(), diag2 = set(). Check validity in O(1) time.'
  },
  {
    id: 'knapsack-dp',
    title: '0/1 Knapsack (Dynamic Programming)',
    category: 'advanced',
    difficulty: 'Medium',
    leetcodeNumber: 416,
    leetcodeTitle: 'Partition Equal Subset Sum',
    summary: 'Selects items with given weights and values to maximize total value without exceeding knapsack capacity W.',
    complexity: {
      bestTime: 'Ω(N * W)',
      avgTime: 'Θ(N * W)',
      worstTime: 'O(N * W)',
      space: 'O(W)',
      inPlace: false
    },
    keyTakeaways: [
      'Optimal substructure and overlapping subproblems.',
      'State transition: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i]).',
      'Can be space-optimized from 2D matrix O(N*W) to 1D array O(W) iterating backwards.'
    ],
    pythonTip: 'Iterate backwards in 1D array: for w in range(W, wt - 1, -1) to prevent reusing the same item multiple times.'
  }
];

export const CATEGORIES_CONFIG = [
  { id: 'sorting', label: 'Sorting Algorithms', icon: 'BarChart2', count: 6 },
  { id: 'trees', label: 'Non-Linear (Trees & BST)', icon: 'GitFork', count: 3 },
  { id: 'searching', label: 'Searching & Pointers', icon: 'Search', count: 3 },
  { id: 'linear', label: 'Linear Data Structures', icon: 'Layers', count: 3 },
  { id: 'graphs', label: 'Graph Algorithms', icon: 'Network', count: 3 },
  { id: 'advanced', label: 'Advanced & Paradigms', icon: 'Cpu', count: 2 },
];
