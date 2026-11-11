// 4-Point Pedagogical Concept Primer for every DSA Topic
const TOPIC_CONCEPT_POINTS = {
  // SEARCHING
  'linear-search': [
    '1. Core Principle: Sequentially examines every element in the array from index 0 to N-1 until target is matched.',
    '2. Invariant: At any step i, all elements in slice arr[0..i-1] have been verified to not equal target.',
    '3. Complexity: Best case Ω(1) if target is at index 0; Worst case O(N) if target is at end or absent; Space O(1).',
    '4. Key Takeaway: Does not require sorted data; default search mechanism underlying Python’s `in` keyword.'
  ],
  'binary-search': [
    '1. Core Principle: Divide & Conquer on sorted arrays; compares target with mid-point and eliminates half the search space.',
    '2. Invariant: Search interval [low..high] is guaranteed to contain target if it exists; recalculate mid = (low + high) // 2.',
    '3. Complexity: Best case Ω(1); Average & Worst case O(log N); Space O(1) iterative or O(log N) recursive.',
    '4. Key Takeaway: Requires pre-sorted array; guard against integer overflow in languages without arbitrary precision.'
  ],
  'jump-search': [
    '1. Core Principle: Jumps ahead in fixed block steps of √N, then performs backwards or linear search within the block.',
    '2. Invariant: Once arr[curr] >= target, the target is guaranteed to reside in interval [prev..curr].',
    '3. Complexity: Time O(√N) optimal step size; Space O(1); sits between Linear O(N) and Binary Search O(log N).',
    '4. Key Takeaway: Beneficial in systems where backward seeking is expensive or sequential reads are optimized.'
  ],
  'ternary-search': [
    '1. Core Principle: Divides sorted range into three equal segments using two midpoints (m1 and m2), discarding two-thirds.',
    '2. Invariant: Range [low..high] shrinks to [low..m1-1], [m1+1..m2-1], or [m2+1..high] based on target comparisons.',
    '3. Complexity: Time O(log₃ N) = O(log N); performs 2 comparisons per step (4 log₃ N vs 2 log₂ N in binary search).',
    '4. Key Takeaway: Primarily celebrated for finding unimodal extrema (peaks and troughs) in mathematical functions.'
  ],

  // POINTERS
  'two-pointers': [
    '1. Core Principle: Uses two directional pointers (Left at start, Right at end) converging inward to find a target sum.',
    '2. Invariant: Because array is sorted, if sum < target, incrementing Left increases sum; if sum > target, decrementing Right decreases sum.',
    '3. Complexity: Time O(N) single pass after sorting; Space O(1) auxiliary memory.',
    '4. Key Takeaway: Eliminates nested O(N²) loops into a single linear O(N) pass for pair and partition problems.'
  ],
  'sliding-window': [
    '1. Core Principle: Maintains a contiguous subarray window of size K, sliding it forward one element at a time.',
    '2. Invariant: When moving window from [i..i+K-1] to [i+1..i+K], subtract outgoing element arr[i] and add incoming arr[i+K].',
    '3. Complexity: Time O(N) linear time; avoids recomputing sum from scratch which would take O(N × K); Space O(1).',
    '4. Key Takeaway: Fundamental pattern for subarray sums, longest substrings, and rolling average calculations.'
  ],

  // SORTING
  'quick-sort': [
    '1. Core Principle: Divide & Conquer paradigm that partitions array around a chosen pivot element.',
    '2. Invariant: Lomuto partition places pivot at its finalized index; all elements to left are ≤ pivot, all to right are ≥ pivot.',
    '3. Complexity: Average Θ(N log N); Worst case O(N²) with poor pivot choices (sorted array); Space O(log N) stack.',
    '4. Key Takeaway: Cache-friendly and fastest general-purpose comparison sort in practice; in-place and unstable.'
  ],
  'merge-sort': [
    '1. Core Principle: Recursively splits array into halves until size 1, then merges sorted halves back together.',
    '2. Invariant: At each merge step, two sorted subarrays are combined into a single sorted subarray using two pointers.',
    '3. Complexity: Guaranteed Θ(N log N) in all cases (best, average, worst); Space O(N) auxiliary merge buffer.',
    '4. Key Takeaway: Stable sort; ideal for linked lists and external sorting where sequential streaming is paramount.'
  ],
  'bubble-sort': [
    '1. Core Principle: Repeatedly steps through list, compares adjacent elements, and swaps them if out of order.',
    '2. Invariant: After pass i, the i-th largest element is guaranteed to bubble up to its final position at the end.',
    '3. Complexity: Best case Ω(N) with early-exit flag; Average and Worst O(N²); Space O(1) in-place.',
    '4. Key Takeaway: Stable sort; serves as foundational pedagogy for understanding inversions and adjacent swaps.'
  ],
  'insertion-sort': [
    '1. Core Principle: Builds sorted array one element at a time by picking next item and shifting it into correct position.',
    '2. Invariant: At step i, prefix subarray arr[0..i] is fully sorted, though not necessarily in final array positions.',
    '3. Complexity: Best case Ω(N) on nearly-sorted data; Worst O(N²) on reversed data; Space O(1).',
    '4. Key Takeaway: Adaptive and stable; used internally by Timsort (Python’s sort) for small subarray segments (<64 items).'
  ],
  'selection-sort': [
    '1. Core Principle: Divides array into sorted and unsorted segments; repeatedly scans unsorted segment for minimum element.',
    '2. Invariant: After pass i, prefix arr[0..i] holds the i smallest elements of the entire array in final sorted order.',
    '3. Complexity: Always Θ(N²) comparisons regardless of initial data order; exactly N swaps; Space O(1).',
    '4. Key Takeaway: Minimizes the total number of swaps (at most N); useful when memory write operations are costly.'
  ],

  // STACK
  'stack-ops': [
    '1. Core Principle: LIFO (Last-In, First-Out) linear collection where additions and removals occur exclusively at the TOP.',
    '2. Invariant: The most recently pushed item is always the first candidate to be inspected or removed.',
    '3. Complexity: push() O(1), pop() O(1), peek() O(1); Space O(N) storage.',
    '4. Key Takeaway: Essential for recursion call stacks, undo/redo buffers, syntax parsing, and browser history.'
  ],
  'valid-parentheses': [
    '1. Core Principle: Uses a stack to verify that opening brackets `(`, `{`, `[` are closed by matching brackets in correct order.',
    '2. Invariant: Every closing bracket must match the most recently unclosed opening bracket sitting on top of the stack.',
    '3. Complexity: Time O(N) single pass over characters; Space O(N) worst case (e.g., all open brackets).',
    '4. Key Takeaway: Foundational LeetCode #20 problem; models compiler syntax tree validation and AST bracket scoping.'
  ],

  // QUEUE
  'queue-ops': [
    '1. Core Principle: FIFO (First-In, First-Out) linear collection where insertions occur at REAR and removals at FRONT.',
    '2. Invariant: Elements depart in the exact chronological sequence they arrived, maintaining arrival ordering.',
    '3. Complexity: enqueue() O(1), dequeue() O(1), front() O(1); Space O(N).',
    '4. Key Takeaway: Heart of BFS graph traversal, printer spools, CPU job scheduling, and asynchronous message buffers.'
  ],
  'circular-queue': [
    '1. Core Principle: Uses a fixed-size array where the end wraps around to the beginning using modulo arithmetic.',
    '2. Invariant: Pointer advancement: rear = (rear + 1) % capacity; front = (front + 1) % capacity.',
    '3. Complexity: O(1) enqueue and dequeue without shifting elements; eliminates linear O(N) memory drift.',
    '4. Key Takeaway: Memory-efficient ring buffer used in OS kernel audio streams, network packet buffers, and IPC.'
  ],

  // TREES & BST
  'bst-inorder': [
    '1. Core Principle: Depth-First traversal visiting nodes in order: Left Subtree ➔ Current Root ➔ Right Subtree.',
    '2. Invariant: In a valid Binary Search Tree, In-Order traversal strictly outputs keys in ascending sorted order.',
    '3. Complexity: Time O(N) visits every node once; Space O(H) call stack where H is tree height (log N to N).',
    '4. Key Takeaway: The gold standard test to validate whether a binary tree satisfies the BST invariant.'
  ],
  'bst-search': [
    '1. Core Principle: Recursively or iteratively compares target key with current node, branching left if smaller, right if larger.',
    '2. Invariant: Subtree property: all keys in left subtree < root.val < all keys in right subtree.',
    '3. Complexity: Best/Average O(log N) for balanced trees; Worst O(N) for degenerate skewed linked-list trees; Space O(1).',
    '4. Key Takeaway: Forms the basis of efficient dynamic set dictionaries and AVL/Red-Black self-balancing trees.'
  ],
  'bst-insert': [
    '1. Core Principle: Traverses down tree using BST property until reaching a null child pointer, then links the new node.',
    '2. Invariant: Preserves the BST invariant at every ancestor along the insertion path from root to leaf.',
    '3. Complexity: Average O(log N); Worst case O(N) if inserted in strictly ascending order without rebalancing.',
    '4. Key Takeaway: Duplicates are either disallowed or mapped to an element frequency counter.'
  ],
  'binary-tree-traversals': [
    '1. Core Principle: Four foundational ways to visit every node: Pre-order (NLR), In-order (LNR), Post-order (LRN), Level-order (BFS).',
    '2. Invariant: Pre-order processes root first (cloning/serialization); Post-order processes children first (deletion/bottom-up DP).',
    '3. Complexity: Time O(N) for all traversals; Space O(H) for DFS, O(W) for BFS queue where W is maximum tree width.',
    '4. Key Takeaway: Deeply foundational for tree recursion, expression trees, and syntax evaluation.'
  ],
  'invert-binary-tree': [
    '1. Core Principle: Recursively swaps the left and right child pointers of every node in the binary tree.',
    '2. Invariant: For every node in the tree, its new left child is the inverted old right child, and vice versa.',
    '3. Complexity: Time O(N) since each node is visited once; Space O(H) recursion stack.',
    '4. Key Takeaway: The famous Homebrew author interview question (LeetCode #226); models geometric tree reflection.'
  ],

  // GRAPHS
  'graph-bfs': [
    '1. Core Principle: Explores graph level-by-level (breadth-first) from a start vertex using a FIFO Queue.',
    '2. Invariant: All vertices at distance k hops are completely explored before any vertex at distance k+1.',
    '3. Complexity: Time O(V + E); Space O(V) for visited set and exploration queue.',
    '4. Key Takeaway: Guarantees shortest path in unweighted graphs; basis of web crawlers and social network degrees of separation.'
  ],
  'graph-dfs': [
    '1. Core Principle: Explores as deeply as possible along each branch before backtracking, utilizing recursion or explicit stack.',
    '2. Invariant: Explores the complete reachable component of a branch before returning to previous intersection.',
    '3. Complexity: Time O(V + E); Space O(V) recursion stack depth in worst case.',
    '4. Key Takeaway: Used for topological sorting, cycle detection, strongly connected components, and maze generation.'
  ],
  'graph-dijkstra': [
    '1. Core Principle: Finds shortest paths from single source to all vertices in a non-negative weighted graph.',
    '2. Invariant: Greedy choice: vertex with smallest tentative distance is finalized and its edges relaxed.',
    '3. Complexity: Time O((V + E) log V) with min-priority queue; Space O(V) distance and visited tables.',
    '4. Key Takeaway: Cannot handle negative edge weights (requires Bellman-Ford); foundation of GPS routing and OSPF network protocols.'
  ],

  // DYNAMIC PROGRAMMING
  'dp-fibonacci': [
    '1. Core Principle: Solves Fibonacci by breaking into overlapping subproblems and memoizing/tabulating results.',
    '2. Invariant: Optimal substructure: fib(n) = fib(n-1) + fib(n-2); subproblem results cached to prevent 2ⁿ recomputation.',
    '3. Complexity: Time O(N) linear time vs O(2ⁿ) naive recursion; Space O(N) table or O(1) rolling state.',
    '4. Key Takeaway: The gateway problem into dynamic programming; demonstrates the power of trading memory for time.'
  ],
  'dp-knapsack': [
    '1. Core Principle: 0/1 Knapsack: Decide whether to include or exclude each item to maximize value within capacity W.',
    '2. Invariant: dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]]); state depends strictly on previous row.',
    '3. Complexity: Pseudo-polynomial Time O(N × W); Space O(N × W) table (compressible to O(W) rolling array).',
    '4. Key Takeaway: Classic NP-complete optimization problem; models resource allocation, budget constraints, and portfolio selection.'
  ],

  // GREEDY
  'greedy-activity': [
    '1. Core Principle: Selects the maximum number of mutually compatible activities by sorting by earliest finish time.',
    '2. Invariant: Greedy Choice Property: Picking the activity that finishes earliest leaves maximum available time for remaining tasks.',
    '3. Complexity: Time O(N log N) dominated by sorting; linear O(N) selection pass; Space O(1).',
    '4. Key Takeaway: Proves greedy choice yields global optimum without backtracking; classic interval scheduling theorem.'
  ],
  'greedy-coin-change': [
    '1. Core Principle: Greedily selects the largest available coin denomination that does not exceed the remaining target balance.',
    '2. Invariant: At each step, remaining amount = remaining amount - chosen coin value until reaching 0.',
    '3. Complexity: Time O(K) where K is number of coin denominations; Space O(1).',
    '4. Key Takeaway: Optimal for canonical coin systems (USD, Euro, INR); fails for arbitrary denominations (requires DP).'
  ]
};
