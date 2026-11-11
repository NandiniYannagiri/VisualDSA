    // =========================================================================
    // 1. COMPLETE MASTER CURRICULUM DEFINITIONS & METADATA
    // =========================================================================
    const DSA_CATEGORIES = [
      { id: 'searching', name: 'Searching Algorithms', icon: '🔍', count: 4, desc: 'Target lookup: Linear, Binary, Jump, and Ternary Search' },
      { id: 'comparison-sorting', name: 'Comparison Sorting', icon: '📊', count: 6, desc: 'Bubble, Selection, Insertion, Merge, Quick, and Heap Sort' },
      { id: 'non-comparison-sorting', name: 'Non-Comparison Sorting', icon: '🔢', count: 3, desc: 'Count Sort, Bucket Sort, and Radix Sort (Linear Time)' },
      { id: 'pointers', name: 'Two Pointers & Window', icon: '🎯', count: 2, desc: 'Converging pointers, sliding ranges, and subsegment constraints' },
      { id: 'stack', name: 'Stack (LIFO)', icon: '🥞', count: 2, desc: 'Last-In-First-Out disciplines, call stacks & parentheses matching' },
      { id: 'queue', name: 'Queue (FIFO)', icon: '🚶‍♂️', count: 2, desc: 'First-In-First-Out buffers, circular queues & deque buffers' },
      { id: 'trees', name: 'Binary Trees', icon: '🌲', count: 3, desc: 'Preorder, Inorder, and Postorder Tree Traversals' },
      { id: 'bst', name: 'Binary Search Trees (BST)', icon: '🌳', count: 3, desc: 'Insertion in BST, Deletion in BST, and Searching in BST' },
      { id: 'graphs', name: 'Graph Algorithms', icon: '🕸️', count: 3, desc: 'Node connectivity, BFS, DFS, and Dijkstra shortest paths' },
      { id: 'dp', name: 'Dynamic Programming (DP)', icon: '🧩', count: 2, desc: 'Overlapping subproblems, memoization & 2D decision matrices' },
      { id: 'greedy', name: 'Greedy Paradigms', icon: '⚡', count: 2, desc: 'Locally optimal choices leading to global solutions' },
    ];

    const ALL_TOPICS = [
      // --- SEARCHING ---
      {
        id: 'linear-search',
        title: 'Linear Search',
        category: 'searching',
        difficulty: 'Easy',
        leetcode: 704,
        stageType: 'searching',
        summary: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
        complexity: { best: 'Ω(1)', avg: 'Θ(N)', worst: 'O(N)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Python `in` keyword on lists executes linear search under the hood.'
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        category: 'searching',
        difficulty: 'Easy',
        leetcode: 704,
        stageType: 'searching',
        summary: 'Halves the search space at each step on a monotonically sorted array.',
        complexity: { best: 'Ω(1)', avg: 'Θ(log N)', worst: 'O(log N)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Use `bisect.bisect_left` and `bisect.bisect_right` from Python standard library.'
      },
      {
        id: 'jump-search',
        title: 'Jump Search',
        category: 'searching',
        difficulty: 'Medium',
        leetcode: 704,
        stageType: 'searching',
        summary: 'Jumps ahead by fixed blocks of √N elements, then performs backward linear search.',
        complexity: { best: 'Ω(1)', avg: 'Θ(√N)', worst: 'O(√N)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Optimal jump step size is mathematically proven to be √N.'
      },
      {
        id: 'ternary-search',
        title: 'Ternary Search',
        category: 'searching',
        difficulty: 'Medium',
        leetcode: 704,
        stageType: 'searching',
        summary: 'Divides the sorted range into three equal segments using two midpoints (mid1, mid2).',
        complexity: { best: 'Ω(1)', avg: 'Θ(log₃ N)', worst: 'O(log₃ N)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Widely used in competitive programming to find unimodal function extrema.'
      },

      // --- COMPARISON SORTING ALGORITHMS ---
      // (Order: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort)
      {
        id: 'bubble-sort',
        title: 'Bubble Sort',
        category: 'comparison-sorting',
        difficulty: 'Easy',
        leetcode: 912,
        stageType: 'sorting',
        summary: 'Repeatedly steps through the list, compares adjacent elements and swaps them if in wrong order.',
        complexity: { best: 'Ω(N)', avg: 'Θ(N²)', worst: 'O(N²)', space: 'O(1)', stability: 'Stable' },
        pythonTip: 'An optimized flag tracks whether any swaps occurred; if none, terminates early in O(N).'
      },
      {
        id: 'selection-sort',
        title: 'Selection Sort',
        category: 'comparison-sorting',
        difficulty: 'Easy',
        leetcode: 912,
        stageType: 'sorting',
        summary: 'Divides the list into sorted and unsorted sublists, repeatedly finding the minimum from unsorted.',
        complexity: { best: 'Ω(N²)', avg: 'Θ(N²)', worst: 'O(N²)', space: 'O(1)', stability: 'Unstable' },
        pythonTip: 'Minimizes total memory writes to exactly N-1 swaps, useful when write cycles are expensive.'
      },
      {
        id: 'insertion-sort',
        title: 'Insertion Sort',
        category: 'comparison-sorting',
        difficulty: 'Easy',
        leetcode: 147,
        stageType: 'sorting',
        summary: 'Iteratively builds the sorted array one element at a time by shifting larger elements right.',
        complexity: { best: 'Ω(N)', avg: 'Θ(N²)', worst: 'O(N²)', space: 'O(1)', stability: 'Stable' },
        pythonTip: 'Highly efficient for nearly sorted arrays and small arrays (used by Timsort for partitions < 64).'
      },
      {
        id: 'merge-sort',
        title: 'Merge Sort',
        category: 'comparison-sorting',
        difficulty: 'Medium',
        leetcode: 912,
        stageType: 'sorting',
        summary: 'Divide-and-conquer algorithm dividing array in halves, recursively sorting and merging.',
        complexity: { best: 'Ω(N log N)', avg: 'Θ(N log N)', worst: 'O(N log N)', space: 'O(N)', stability: 'Stable' },
        pythonTip: 'Standard library Timsort in Python is a hybrid derived from Merge Sort and Insertion Sort.'
      },
      {
        id: 'quick-sort',
        title: 'Quick Sort',
        category: 'comparison-sorting',
        difficulty: 'Medium',
        leetcode: 912,
        stageType: 'sorting',
        summary: 'Picks a pivot element and partitions array into elements smaller and greater than the pivot.',
        complexity: { best: 'Ω(N log N)', avg: 'Θ(N log N)', worst: 'O(N²)', space: 'O(log N)', stability: 'Unstable' },
        pythonTip: 'Quickselect (derived from quicksort partition) finds the k-th smallest element in O(N) average time.'
      },
      {
        id: 'heap-sort',
        title: 'Heap Sort',
        category: 'comparison-sorting',
        difficulty: 'Medium',
        leetcode: 912,
        stageType: 'sorting',
        summary: 'Builds a binary max-heap, then repeatedly extracts maximum to the end of the array.',
        complexity: { best: 'Ω(N log N)', avg: 'Θ(N log N)', worst: 'O(N log N)', space: 'O(1)', stability: 'Unstable' },
        pythonTip: 'Python heapq module provides a min-heap by default; negate values or write max-heapify for max-heaps.'
      },

      // --- NON-COMPARISON SORTING ALGORITHMS ---
      // (Order: Count Sort, Bucket Sort, Radix Sort)
      {
        id: 'count-sort',
        title: 'Count Sort (Counting Sort)',
        category: 'non-comparison-sorting',
        difficulty: 'Medium',
        leetcode: 1122,
        stageType: 'count-sort',
        summary: 'Counts occurrences of each unique value in a frequency tally array, avoiding pairwise comparisons.',
        complexity: { best: 'Ω(N + K)', avg: 'Θ(N + K)', worst: 'O(N + K)', space: 'O(K)', stability: 'Stable' },
        pythonTip: 'Super-linear speed O(N) when maximum key range K is proportional to array size N.'
      },
      {
        id: 'bucket-sort',
        title: 'Bucket Sort',
        category: 'non-comparison-sorting',
        difficulty: 'Medium',
        leetcode: 164,
        stageType: 'bucket-sort',
        summary: 'Distributes elements into a set of discrete value buckets, sorts each bucket, and gathers.',
        complexity: { best: 'Ω(N + K)', avg: 'Θ(N + K)', worst: 'O(N²)', space: 'O(N + K)', stability: 'Stable' },
        pythonTip: 'Optimal for uniform distributions across continuous intervals [0, 1) or integer ranges.'
      },
      {
        id: 'radix-sort',
        title: 'Radix Sort (LSD)',
        category: 'non-comparison-sorting',
        difficulty: 'Hard',
        leetcode: 164,
        stageType: 'radix-sort',
        summary: 'Sorts data digit-by-digit from least significant to most significant using stable sub-sorts.',
        complexity: { best: 'Ω(N · d)', avg: 'Θ(N · d)', worst: 'O(N · d)', space: 'O(N + k)', stability: 'Stable' },
        pythonTip: 'Processes numbers or fixed-length strings in linear time without any comparison operations.'
      },

      // --- TWO POINTERS & SLIDING WINDOW ---
      {
        id: 'two-pointers',
        title: 'Two Pointers (Target Sum)',
        category: 'pointers',
        difficulty: 'Easy',
        leetcode: 167,
        stageType: 'pointers',
        summary: 'Uses converging left and right indices on sorted array to find pairs matching a target sum.',
        complexity: { best: 'Ω(1)', avg: 'Θ(N)', worst: 'O(N)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Eliminates quadratic pair search down to a single O(N) linear sweep.'
      },
      {
        id: 'sliding-window',
        title: 'Sliding Window (Max Sum Subarray)',
        category: 'pointers',
        difficulty: 'Medium',
        leetcode: 209,
        stageType: 'pointers',
        summary: 'Maintains an active window of size K, adding incoming elements and subtracting outgoing elements.',
        complexity: { best: 'Ω(N)', avg: 'Θ(N)', worst: 'O(N)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Avoids recalculating window sums from scratch, reducing O(N*K) down to O(N).'
      },

      // --- STACK (LIFO) ---
      {
        id: 'stack-ops',
        title: 'Array Stack (Push/Pop LIFO)',
        category: 'stack',
        difficulty: 'Easy',
        leetcode: 155,
        stageType: 'stack',
        summary: 'Last-In-First-Out data structure supporting constant time push, pop, and top inspection.',
        complexity: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)', space: 'O(N)', stability: 'N/A' },
        pythonTip: 'Python `list.append()` and `list.pop()` implement an O(1) amortized stack.'
      },
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses Scanner',
        category: 'stack',
        difficulty: 'Easy',
        leetcode: 20,
        stageType: 'stack',
        summary: 'Validates balanced nested delimiters (), {}, [] by pushing openers and popping on closers.',
        complexity: { best: 'Ω(N)', avg: 'Θ(N)', worst: 'O(N)', space: 'O(N)', stability: 'N/A' },
        pythonTip: 'A dictionary matching closers to openers simplifies parsing into 4 lines of Python.'
      },

      // --- QUEUE (FIFO) ---
      {
        id: 'queue-ops',
        title: 'Array Queue (FIFO Discipline)',
        category: 'queue',
        difficulty: 'Easy',
        leetcode: 225,
        stageType: 'queue',
        summary: 'First-In-First-Out data structure inserting at the rear and evicting from the front.',
        complexity: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)', space: 'O(N)', stability: 'N/A' },
        pythonTip: 'Use `collections.deque` instead of `list` to avoid O(N) pop(0) memory shifts.'
      },
      {
        id: 'circular-queue',
        title: 'Circular Ring Buffer Queue',
        category: 'queue',
        difficulty: 'Medium',
        leetcode: 622,
        stageType: 'queue',
        summary: 'Fixed-capacity ring buffer connecting rear back to front with modulo arithmetic ((rear + 1) % cap).',
        complexity: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)', space: 'O(capacity)', stability: 'N/A' },
        pythonTip: 'Zero memory allocation overhead after initialization; ideal for hardware stream buffers.'
      },

      // --- BINARY TREES ---
      {
        id: 'tree-preorder',
        title: 'Preorder Traversal',
        category: 'trees',
        difficulty: 'Easy',
        leetcode: 144,
        stageType: 'trees',
        summary: 'Visits Root first, then recursively explores Left subtree, then Right subtree (Root ➔ Left ➔ Right).',
        complexity: { best: 'Ω(N)', avg: 'Θ(N)', worst: 'O(N)', space: 'O(H)', stability: 'N/A' },
        pythonTip: 'Preorder sequence is fundamentally used to clone, serialize, or dump binary trees into linear storage.'
      },
      {
        id: 'tree-inorder',
        title: 'Inorder Traversal',
        category: 'trees',
        difficulty: 'Easy',
        leetcode: 94,
        stageType: 'trees',
        summary: 'Recursively explores Left subtree, visits current Root node, then explores Right subtree (Left ➔ Root ➔ Right).',
        complexity: { best: 'Ω(N)', avg: 'Θ(N)', worst: 'O(N)', space: 'O(H)', stability: 'N/A' },
        pythonTip: 'On any valid Binary Search Tree, Inorder traversal always produces nodes in strictly ascending sorted order.'
      },
      {
        id: 'tree-postorder',
        title: 'Postorder Traversal',
        category: 'trees',
        difficulty: 'Easy',
        leetcode: 145,
        stageType: 'trees',
        summary: 'Recursively explores Left subtree, then Right subtree, and finally processes current Root node (Left ➔ Right ➔ Root).',
        complexity: { best: 'Ω(N)', avg: 'Θ(N)', worst: 'O(N)', space: 'O(H)', stability: 'N/A' },
        pythonTip: 'Ideal for bottom-up deletion of trees, postfix arithmetic expression evaluation, and directory space calculation.'
      },

      // --- BINARY SEARCH TREES (BST) ---
      {
        id: 'bst-insert',
        title: 'Insertion in BST',
        category: 'bst',
        difficulty: 'Medium',
        leetcode: 701,
        stageType: 'bst',
        summary: 'Inserts a new value into the BST by descending left or right according to BST invariant and attaching as a new leaf.',
        complexity: { best: 'Ω(log N)', avg: 'Θ(log N)', worst: 'O(N)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Maintains BST ordering property: all left descendants < node.val < all right descendants.'
      },
      {
        id: 'bst-delete',
        title: 'Deletion in BST',
        category: 'bst',
        difficulty: 'Medium',
        leetcode: 450,
        stageType: 'bst',
        summary: 'Removes a key from BST handling 3 cases: leaf node, 1 child node, or 2 children (replace with in-order successor).',
        complexity: { best: 'Ω(log N)', avg: 'Θ(log N)', worst: 'O(N)', space: 'O(H)', stability: 'N/A' },
        pythonTip: 'When deleting a node with 2 children, replace its value with in-order successor (min in right subtree) and delete successor.'
      },
      {
        id: 'bst-search',
        title: 'Searching in BST',
        category: 'bst',
        difficulty: 'Easy',
        leetcode: 700,
        stageType: 'bst',
        summary: 'Efficiently searches for a key by halving candidates at each step using the BST ordering property.',
        complexity: { best: 'Ω(1)', avg: 'Θ(log N)', worst: 'O(N)', space: 'O(H)', stability: 'N/A' },
        pythonTip: 'Achieves logarithmic O(log N) lookup on balanced trees; worst case O(N) on skewed linked lists.'
      },

      // --- GRAPH ALGORITHMS ---
      {
        id: 'graph-bfs',
        title: 'Breadth-First Search (BFS)',
        category: 'graphs',
        difficulty: 'Medium',
        leetcode: 102,
        stageType: 'graph',
        summary: 'Level-order graph exploration using a FIFO queue, discovering shortest paths on unweighted graphs.',
        complexity: { best: 'Ω(V + E)', avg: 'Θ(V + E)', worst: 'O(V + E)', space: 'O(V)', stability: 'N/A' },
        pythonTip: 'Always mark visited nodes upon pushing to queue, never upon popping, to prevent duplicates.'
      },
      {
        id: 'graph-dfs',
        title: 'Depth-First Search (DFS)',
        category: 'graphs',
        difficulty: 'Medium',
        leetcode: 200,
        stageType: 'graph',
        summary: 'Explores as far as possible along each branch before backtracking using recursive call stack.',
        complexity: { best: 'Ω(V + E)', avg: 'Θ(V + E)', worst: 'O(V + E)', space: 'O(V)', stability: 'N/A' },
        pythonTip: 'Can detect cycles in directed graphs using a 3-color state system (white, gray, black).'
      },
      {
        id: 'graph-dijkstra',
        title: "Dijkstra's Shortest Path Algorithm",
        category: 'graphs',
        difficulty: 'Hard',
        leetcode: 743,
        stageType: 'graph',
        summary: 'Greedily finds the shortest path from single source to all vertices on non-negative weighted graphs.',
        complexity: { best: 'Ω(E log V)', avg: 'Θ(E log V)', worst: 'O(E log V)', space: 'O(V)', stability: 'N/A' },
        pythonTip: 'Pair with `heapq` priority queue storing `(distance, node)` tuples for O((V + E) log V).'
      },

      // --- DYNAMIC PROGRAMMING ---
      {
        id: 'dp-fibonacci',
        title: 'Fibonacci Tabulation & Memoization',
        category: 'dp',
        difficulty: 'Easy',
        leetcode: 509,
        stageType: 'dp',
        summary: 'Demonstrates overlapping subproblems: converts exponential O(2^N) recursion into linear O(N) table.',
        complexity: { best: 'Ω(N)', avg: 'Θ(N)', worst: 'O(N)', space: 'O(1) with 2 vars', stability: 'N/A' },
        pythonTip: 'Use `@functools.lru_cache(None)` to memoize any naive recursive Python function automatically.'
      },
      {
        id: 'dp-knapsack',
        title: '0/1 Knapsack 2D Decision Matrix',
        category: 'dp',
        difficulty: 'Medium',
        leetcode: 416,
        stageType: 'dp',
        summary: 'Finds optimal subset of items maximizing total value without exceeding knapsack capacity W.',
        complexity: { best: 'Ω(N · W)', avg: 'Θ(N · W)', worst: 'O(N · W)', space: 'O(N · W)', stability: 'N/A' },
        pythonTip: 'Can be space-optimized from 2D array down to a 1D rolling array traversing backwards from W to wt.'
      },

      // --- GREEDY PARADIGMS ---
      {
        id: 'greedy-activity',
        title: 'Activity Selection / Interval Scheduling',
        category: 'greedy',
        difficulty: 'Medium',
        leetcode: 435,
        stageType: 'greedy',
        summary: 'Greedily selects non-overlapping activities by always picking the activity with earliest finish time.',
        complexity: { best: 'Ω(N log N)', avg: 'Θ(N log N)', worst: 'O(N log N)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Sorting intervals by their ending time (`key=lambda x: x[1]`) guarantees mathematical optimality.'
      },
      {
        id: 'greedy-coin-change',
        title: 'Greedy Coin Change (Canonical)',
        category: 'greedy',
        difficulty: 'Medium',
        leetcode: 322,
        stageType: 'greedy',
        summary: 'Always selects the largest coin denomination that does not exceed remaining change balance.',
        complexity: { best: 'Ω(K)', avg: 'Θ(K)', worst: 'O(K)', space: 'O(1)', stability: 'N/A' },
        pythonTip: 'Optimal for canonical coin systems (USD, Euro, INR); arbitrary denominations require DP.'
      }
    ];
