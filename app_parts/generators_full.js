// Full Suite of DSA Step Generators for All 32 Topics
// =========================================================

// 1. POINTERS GENERATOR
function generatePointersSteps(algoId, initialArr, targetVal, windowK = 3) {
  const steps = [];
  const arr = algoId === 'two-pointers' ? [...initialArr].sort((a,b)=>a-b) : [...initialArr];
  const n = arr.length;
  let comparisons = 0;

  function push(activeLine, desc, subDesc, pointers = {}, hl = {}, custom = {}) {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: [...arr], activeLine, description: desc, subDescription: subDesc,
      pointers,
      highlights: {
        comparing: hl.comparing || [],
        sorted: hl.sorted || [],
        active: hl.active || [],
        dimmed: hl.dimmed || []
      },
      metrics: { comparisons, calc: custom.calc || '' },
      custom
    });
  }

  if (algoId === 'two-pointers') {
    push(1, `Two Pointers Technique: Searching for two numbers that sum to ${targetVal}.`, `Array sorted ascending: [${arr.join(', ')}]. Left starts at 0, Right at ${n-1}.`, { left: 0, right: n - 1, target: targetVal }, {}, { calc: `L=0 (${arr[0]}), R=${n-1} (${arr[n-1]})` });
    let left = 0, right = n - 1, found = false;
    while (left < right) {
      const sum = arr[left] + arr[right];
      comparisons++;
      const calcMsg = `A[L](${arr[left]}) + A[R](${arr[right]}) = ${sum} ${sum === targetVal ? '== Target (FOUND!)' : sum < targetVal ? `< Target ${targetVal} ➔ Advance L++` : `> Target ${targetVal} ➔ Move R--`}`;
      push(5, `Comparing pair arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${sum}.`,
        sum === targetVal
          ? `MATCH FOUND! Sum ${sum} matches target ${targetVal}.`
          : sum < targetVal
          ? `Sum ${sum} < ${targetVal}: Sum too small. Incrementing Left pointer (+1).`
          : `Sum ${sum} > ${targetVal}: Sum too large. Decrementing Right pointer (-1).`,
        { left, right, sum, target: targetVal, found: sum === targetVal },
        sum === targetVal ? { sorted: [left, right] } : { active: [left, right] },
        { sum, targetVal, calc: calcMsg }
      );
      if (sum === targetVal) {
        found = true;
        push(6, `PAIR FOUND: arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) == ${targetVal}!`, `Solved in O(N) linear time with O(1) auxiliary space!`, { left, right, target: targetVal, found: true }, { sorted: [left, right] }, { sum, targetVal, calc: `Solved! Target ${targetVal} achieved.` });
        break;
      } else if (sum < targetVal) {
        left++;
      } else {
        right--;
      }
    }
    if (!found) {
      push(11, `No two elements in the array sum up to ${targetVal}.`, 'Pointers met without finding a matching pair. Returning empty list.', { target: targetVal }, {}, { calc: 'No pair matches target' });
    }
  } else {
    // Sliding Window
    const k = Math.max(1, Math.min(windowK, n));
    push(1, `Sliding Window: Computing maximum sum contiguous subarray of fixed size K = ${k}.`, `Initializing window across first ${k} elements.`, { left: 0, right: k - 1, start: 0, end: k - 1, k }, {}, { calc: `Initializing window of size K=${k}` });
    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += arr[i];
    let maxSum = windowSum;

    const initHl = Array.from({ length: k }, (_, i) => i);
    push(4, `Initial Window [0..${k-1}]: Sum = ${windowSum}.`, `Max sum initialized to ${maxSum}. Sliding window forward by 1 at each step.`, { left: 0, right: k - 1, start: 0, end: k - 1, windowSum, maxSum }, { active: initHl }, { windowSum, maxSum, calc: `Window [0..${k-1}] Sum: ${windowSum} (Max: ${maxSum})` });

    for (let i = k; i < n; i++) {
      const outgoing = arr[i - k];
      const incoming = arr[i];
      windowSum = windowSum - outgoing + incoming;
      const isNewMax = windowSum > maxSum;
      if (isNewMax) maxSum = windowSum;

      const windowHl = Array.from({ length: k }, (_, idx) => i - k + 1 + idx);
      const startIdx = i - k + 1;
      push(7, `Slid window to [${startIdx}..${i}]: Subtracted ${outgoing}, added ${incoming}.`,
        `Current Window Sum = ${windowSum}. ${isNewMax ? `NEW MAXIMUM RECORDED: ${maxSum}!` : `Max sum remains ${maxSum}.`}`,
        { left: startIdx, right: i, start: startIdx, end: i, windowSum, maxSum },
        { active: windowHl },
        { windowSum, maxSum, calc: `Window [${startIdx}..${i}] Sum: ${windowSum} (Max: ${maxSum})` }
      );
    }

    push(9, `Sliding Window Complete! Maximum subarray sum of size ${k} is ${maxSum}.`, `Found in single linear O(N) pass.`, { maxSum }, {}, { calc: `Final Max Subarray Sum = ${maxSum}` });
  }

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

// 2. STACK GENERATOR (STACK-OPS & VALID-PARENTHESES)
function generateStackSteps(algoId, initialItems = [15, 30, 45]) {
  const steps = [];

  if (algoId === 'valid-parentheses') {
    const expr = "({[]})";
    const chars = expr.split('');
    const stack = [];
    const mapping = { ')': '(', '}': '{', ']': '[' };

    function pushV(activeLine, desc, subDesc, charIdx = 0, isMatch = false) {
      steps.push({
        stepIndex: steps.length, totalSteps: 0,
        state: [...stack], activeLine, description: desc, subDescription: subDesc,
        custom: { expr, charIdx, isMatch, stackType: 'parens' }
      });
    }

    pushV(1, 'Valid Parentheses: Testing string "({[]})" for balanced nesting.', 'Using a LIFO stack to verify every closer matches the nearest opener.', 0);

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (['(', '{', '['].includes(ch)) {
        stack.push(ch);
        pushV(5, `Scanner at '${ch}' (Index ${i}): Opening bracket. Pushed onto Stack.`, `Stack depth: ${stack.length}. Current stack: [${stack.join(', ')}].`, i);
      } else {
        const top = stack.length > 0 ? stack[stack.length - 1] : null;
        if (top === mapping[ch]) {
          const popped = stack.pop();
          pushV(9, `Scanner at '${ch}' (Index ${i}): Closing bracket matches top opener '${popped}'. POPPED!`, `Bracket pair '${popped}' & '${ch}' successfully matched.`, i, true);
        } else {
          pushV(11, `Scanner at '${ch}' (Index ${i}): Mismatch with stack top '${top}'. INVALID!`, 'Brackets unbalanced.', i, false);
          break;
        }
      }
    }

    pushV(13, 'Valid Parentheses Check Complete: Stack is empty ➔ VALID BALANCED EXPRESSION!', 'All brackets correctly nested and closed in O(N) time.', chars.length, true);

  } else {
    // stack-ops
    const items = [...initialItems];

    function pushS(activeLine, desc, subDesc, activeIdx = null) {
      steps.push({
        stepIndex: steps.length, totalSteps: 0,
        state: [...items], activeLine, description: desc, subDescription: subDesc,
        custom: { activeIdx, stackType: 'ops' }
      });
    }

    pushS(1, 'Stack initialized with LIFO (Last-In, First-Out) discipline.', `Current stack: [${items.join(', ')}]. Top element is ${items.length > 0 ? items[items.length - 1] : 'Empty'}.`);
    
    items.push(60);
    pushS(4, 'push(60): Element added to top of stack.', `Pushed 60 in O(1) time. New stack size: ${items.length}. Top is 60.`, items.length - 1);
    
    pushS(8, 'peek(): Inspecting top element without removing it.', `Top element is ${items[items.length - 1]}. Stack untouched in O(1).`, items.length - 1);
    
    const p1 = items.pop();
    pushS(6, `pop(): Removed top element (${p1}) from stack.`, `Popped in O(1) time. New top is ${items.length > 0 ? items[items.length - 1] : 'Empty'}.`);
    
    items.push(75);
    pushS(4, 'push(75): Element added to top of stack.', `Pushed 75 in O(1) time. New top of stack is 75.`, items.length - 1);
    
    const p2 = items.pop();
    pushS(6, `pop(): Removed top element (${p2}) from stack.`, `Popped 75. Stack size returned to ${items.length}.`);
  }

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

// 3. QUEUE GENERATOR (QUEUE-OPS & CIRCULAR-QUEUE)
function generateQueueSteps(algoId, initialItems = [10, 20, 30]) {
  const steps = [];

  if (algoId === 'circular-queue') {
    const capacity = 5;
    const buffer = Array(capacity).fill(null);
    let front = 0, rear = 0, size = 0;

    function pushC(activeLine, desc, subDesc) {
      steps.push({
        stepIndex: steps.length, totalSteps: 0,
        state: [...buffer], activeLine, description: desc, subDescription: subDesc,
        custom: { front, rear, size, capacity, queueType: 'circular' }
      });
    }

    pushC(1, `Circular Queue initialized with fixed capacity = ${capacity}.`, `Front=0, Rear=0, Size=0. Array elements wrap around using (rear + 1) % ${capacity}.`);

    const toEnqueue = [12, 24, 36, 48];
    for (let val of toEnqueue) {
      buffer[rear] = val;
      rear = (rear + 1) % capacity;
      size++;
      pushC(8, `enqueue(${val}): Inserted at index ${(rear - 1 + capacity) % capacity}. Rear advanced to ${rear}.`, `Size: ${size}/${capacity}. Front is at ${front} (${buffer[front]}).`);
    }

    // Dequeue 2 elements
    const d1 = buffer[front];
    buffer[front] = null;
    front = (front + 1) % capacity;
    size--;
    pushC(14, `dequeue(): Removed front element (${d1}). Front advanced to ${front}.`, `Size decreased to ${size}/${capacity}.`);

    // Enqueue 2 more to demonstrate wrap-around!
    const wrapVals = [60, 72];
    for (let val of wrapVals) {
      const prevRear = rear;
      buffer[rear] = val;
      rear = (rear + 1) % capacity;
      size++;
      pushC(8, `enqueue(${val}): WRAPPED AROUND! Inserted at slot ${prevRear}. Rear now at ${rear}.`, `Circular buffer eliminated unused space at beginning of array.`);
    }

  } else {
    // queue-ops
    const items = [...initialItems];

    function pushQ(activeLine, desc, subDesc, activeIdx = null) {
      steps.push({
        stepIndex: steps.length, totalSteps: 0,
        state: [...items], activeLine, description: desc, subDescription: subDesc,
        custom: { activeIdx, queueType: 'ops' }
      });
    }

    pushQ(1, 'Queue initialized with FIFO (First-In, First-Out) discipline.', `Current queue: [${items.join(', ')}]. Front element is ${items[0]}.`);
    
    items.push(40);
    pushQ(4, 'enqueue(40): Element appended at rear of queue.', `Added 40 in O(1) time. Queue: [${items.join(', ')}].`, items.length - 1);
    
    pushQ(8, `front(): Inspecting front element without removal.`, `Front element is ${items[0]}. Chronologically oldest item in queue.`);
    
    const d1 = items.shift();
    pushQ(6, `dequeue(): Removed front element (${d1}) from queue.`, `Departed in O(1) time. New front is ${items[0]}.`);
    
    items.push(50);
    pushQ(4, 'enqueue(50): Appended 50 at rear.', `New rear is 50. Total elements: ${items.length}.`, items.length - 1);
    
    const d2 = items.shift();
    pushQ(6, `dequeue(): Removed front element (${d2}).`, `Queue size now ${items.length}. Remaining: [${items.join(', ')}].`);
  }

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

// 4. TREES & BST HELPERS
function createDefaultBST() {
  return {
    id: 'n-50', val: 50, x: 350, y: 50, depth: 0,
    left: {
      id: 'n-30', val: 30, x: 220, y: 120, depth: 1,
      left: { id: 'n-20', val: 20, x: 150, y: 190, depth: 2, left: null, right: null },
      right: { id: 'n-40', val: 40, x: 290, y: 190, depth: 2, left: null, right: null }
    },
    right: {
      id: 'n-70', val: 70, x: 480, y: 120, depth: 1,
      left: { id: 'n-60', val: 60, x: 410, y: 190, depth: 2, left: null, right: null },
      right: { id: 'n-80', val: 80, x: 550, y: 190, depth: 2, left: null, right: null }
    }
  };
}

function assignCoords(n, x, y, dx) {
  if (!n) return;
  n.x = x; n.y = y;
  if (n.left) assignCoords(n.left, x - dx, y + 65, Math.max(25, dx * 0.55));
  if (n.right) assignCoords(n.right, x + dx, y + 65, Math.max(25, dx * 0.55));
}

function buildBSTFromValues(vals) {
  if (!vals || vals.length === 0) return null;
  function insert(node, val) {
    if (!node) {
      return { id: `n-${val}-${Math.random().toString(36).substr(2, 4)}`, val, x: 350, y: 50, depth: 0, left: null, right: null };
    }
    if (val < node.val) {
      node.left = insert(node.left, val);
    } else if (val > node.val) {
      node.right = insert(node.right, val);
    }
    return node;
  }
  let root = null;
  for (let v of vals) root = insert(root, v);
  assignCoords(root, 350, 50, 130);
  return root;
}

function flattenBST(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];
  function dfs(n) {
    if (!n) return;
    nodes.push(n);
    if (n.left) { edges.push({ from: n.id, to: n.left.id, dir: 'L', fromN: n, toN: n.left }); dfs(n.left); }
    if (n.right) { edges.push({ from: n.id, to: n.right.id, dir: 'R', fromN: n, toN: n.right }); dfs(n.right); }
  }
  dfs(root);
  return { nodes, edges };
}

function cloneBST(n) {
  if (!n) return null;
  return { id: n.id, val: n.val, x: n.x, y: n.y, depth: n.depth, left: cloneBST(n.left), right: cloneBST(n.right) };
}

function generatePreOrderSteps(root) {
  const steps = [];
  const layout = flattenBST(root);
  const visited = [];

  function push(activeLine, desc, subDesc, activeId, type = 'active') {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: { root: cloneBST(root), allNodes: layout.nodes, edges: layout.edges, output: [...visited] },
      activeLine, description: desc, subDescription: subDesc,
      custom: { activeNodeId: activeId, highlightType: type }
    });
  }

  push(1, 'Starting Pre-Order Traversal (Root ➔ Left ➔ Right).', 'Depth-first search: process current root before descending to subtrees.', root ? root.id : null, 'comparing');

  function traverse(n) {
    if (!n) return;
    visited.push(n.val);
    push(4, `Visited ROOT node (${n.val}). Appended to sequence: [${visited.join(', ')}].`, 'Root processed. Next: recursively explore left subtree.', n.id, 'sorted');
    if (n.left) {
      push(5, `Descending into LEFT child (${n.left.val}) of node (${n.val}).`, 'Recursive call dfs(node.left).', n.left.id, 'comparing');
      traverse(n.left);
    }
    if (n.right) {
      push(6, `Descending into RIGHT child (${n.right.val}) of node (${n.val}).`, 'Recursive call dfs(node.right).', n.right.id, 'comparing');
      traverse(n.right);
    }
  }

  traverse(root);
  push(8, `Pre-Order Traversal Complete! Final Sequence: [${visited.join(' ➔ ')}].`, `Visited ${visited.length} nodes in O(N) time with O(H) recursion stack space.`, root ? root.id : null, 'sorted');
  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

function generateInOrderSteps(root) {
  const steps = [];
  const layout = flattenBST(root);
  const visited = [];

  function push(activeLine, desc, subDesc, activeId, type = 'active') {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: { root: cloneBST(root), allNodes: layout.nodes, edges: layout.edges, output: [...visited] },
      activeLine, description: desc, subDescription: subDesc,
      custom: { activeNodeId: activeId, highlightType: type }
    });
  }

  push(1, 'Starting In-Order Traversal (Left ➔ Root ➔ Right).', 'In-Order traversal on a valid BST always yields ascending sorted keys!', root ? root.id : null, 'comparing');

  function traverse(n) {
    if (!n) return;
    if (n.left) {
      push(4, `Descending into LEFT child (${n.left.val}) of node (${n.val}).`, 'Recursive call dfs(node.left) to reach smallest keys first.', n.left.id, 'comparing');
      traverse(n.left);
    }
    visited.push(n.val);
    push(5, `Visited current node (${n.val}). Appended to sequence: [${visited.join(', ')}].`, 'Left subtree finished; recording current node value.', n.id, 'sorted');
    if (n.right) {
      push(6, `Descending into RIGHT child (${n.right.val}) of node (${n.val}).`, 'Recursive call dfs(node.right).', n.right.id, 'comparing');
      traverse(n.right);
    }
  }

  traverse(root);
  push(8, `In-Order Traversal Complete! Final Sequence: [${visited.join(' ➔ ')}].`, `Visited ${visited.length} nodes in O(N) time. Sorted keys in ascending order!`, root ? root.id : null, 'sorted');
  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

function generatePostOrderSteps(root) {
  const steps = [];
  const layout = flattenBST(root);
  const visited = [];

  function push(activeLine, desc, subDesc, activeId, type = 'active') {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: { root: cloneBST(root), allNodes: layout.nodes, edges: layout.edges, output: [...visited] },
      activeLine, description: desc, subDescription: subDesc,
      custom: { activeNodeId: activeId, highlightType: type }
    });
  }

  push(1, 'Starting Post-Order Traversal (Left ➔ Right ➔ Root).', 'Bottom-up DFS: both subtrees are completely processed before root node is visited.', root ? root.id : null, 'comparing');

  function traverse(n) {
    if (!n) return;
    if (n.left) {
      push(4, `Descending into LEFT child (${n.left.val}) of node (${n.val}).`, 'Recursive call dfs(node.left).', n.left.id, 'comparing');
      traverse(n.left);
    }
    if (n.right) {
      push(5, `Descending into RIGHT child (${n.right.val}) of node (${n.val}).`, 'Recursive call dfs(node.right).', n.right.id, 'comparing');
      traverse(n.right);
    }
    visited.push(n.val);
    push(6, `Both subtrees finished! Visited node (${n.val}). Appended: [${visited.join(', ')}].`, 'Recording root value after all descendants.', n.id, 'sorted');
  }

  traverse(root);
  push(8, `Post-Order Traversal Complete! Final Sequence: [${visited.join(' ➔ ')}].`, `Visited ${visited.length} nodes in O(N) time with O(H) recursion stack space.`, root ? root.id : null, 'sorted');
  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

function generateBSTSearchSteps(root, target) {
  const steps = [];
  const layout = flattenBST(root);
  let curr = root;
  let found = false;

  function push(activeLine, desc, subDesc, activeId, type = 'active') {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: { root: cloneBST(root), allNodes: layout.nodes, edges: layout.edges },
      activeLine, description: desc, subDescription: subDesc,
      custom: { activeNodeId: activeId, highlightType: type }
    });
  }

  push(1, `Starting BST search for target key = ${target}.`, `Beginning traversal at root node (${root ? root.val : 'empty'}).`, root ? root.id : null, 'comparing');

  while (curr) {
    if (curr.val === target) {
      found = true;
      push(4, `TARGET FOUND: Node (${curr.val}) matches search target ${target}!`, `Located in O(log N) time!`, curr.id, 'sorted');
      break;
    } else if (target < curr.val) {
      push(6, `Target ${target} < current node ${curr.val}. Branching LEFT.`, `By BST invariant, smaller keys reside in the left subtree.`, curr.id, 'comparing');
      curr = curr.left;
    } else {
      push(8, `Target ${target} > current node ${curr.val}. Branching RIGHT.`, `By BST invariant, larger keys reside in the right subtree.`, curr.id, 'comparing');
      curr = curr.right;
    }
  }

  if (!found) {
    push(10, `Target ${target} was NOT found in the BST.`, `Hit a null pointer. Target key does not exist in the tree.`, null);
  }

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

function generateBSTInsertSteps(rootTree, valToInsert = 25) {
  const root = cloneBST(rootTree);
  const steps = [];

  function pushT(activeLine, desc, subDesc, activeId, type = 'active', currentTree = null) {
    const curRoot = currentTree || root;
    const curLayout = flattenBST(curRoot);
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: { root: cloneBST(curRoot), allNodes: curLayout.nodes, edges: curLayout.edges },
      activeLine, description: desc, subDescription: subDesc,
      custom: { activeNodeId: activeId, highlightType: type }
    });
  }

  pushT(1, `BST Insert: Inserting key (${valToInsert}) into tree.`, 'Descending tree using BST property to find insertion spot: val < node ➔ Left, val > node ➔ Right.', root ? root.id : null, 'comparing');

  let curr = root;
  let parent = null;
  let dir = '';

  while (curr) {
    parent = curr;
    if (valToInsert === curr.val) {
      pushT(4, `Key (${valToInsert}) already exists in BST at node (${curr.val})!`, 'Duplicate keys are omitted in standard BST.', curr.id, 'sorted');
      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    } else if (valToInsert < curr.val) {
      pushT(5, `${valToInsert} < current node (${curr.val}). Branching LEFT.`, 'Preserving BST ordering: smaller values go to the left.', curr.id, 'comparing');
      curr = curr.left;
      dir = 'left';
    } else {
      pushT(7, `${valToInsert} > current node (${curr.val}). Branching RIGHT.`, 'Preserving BST ordering: larger values go to the right.', curr.id, 'comparing');
      curr = curr.right;
      dir = 'right';
    }
  }

  const newNode = {
    id: `n-${valToInsert}-${Date.now()}`,
    val: valToInsert,
    x: parent ? (dir === 'left' ? parent.x - 45 : parent.x + 45) : 350,
    y: parent ? parent.y + 65 : 50,
    depth: parent ? parent.depth + 1 : 0,
    left: null,
    right: null
  };

  if (parent) {
    if (dir === 'left') parent.left = newNode;
    else parent.right = newNode;
  }
  assignCoords(root, 350, 50, 130);

  pushT(9, `INSERTED (${valToInsert}) as ${dir.toUpperCase()} child of node (${parent ? parent.val : 'root'})!`, 'BST property preserved at all ancestors in O(log N) average time.', newNode.id, 'sorted', root);

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

function generateBSTDeleteSteps(rootTree, valToDelete = 30) {
  const root = cloneBST(rootTree);
  const steps = [];

  function pushT(activeLine, desc, subDesc, activeId, type = 'active', currentTree = null) {
    const curRoot = currentTree || root;
    const curLayout = flattenBST(curRoot);
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: { root: cloneBST(curRoot), allNodes: curLayout.nodes, edges: curLayout.edges },
      activeLine, description: desc, subDescription: subDesc,
      custom: { activeNodeId: activeId, highlightType: type }
    });
  }

  pushT(1, `BST Deletion: Deleting key (${valToDelete}) from BST.`, 'Searching for target node to delete using BST binary search.', root ? root.id : null, 'comparing');

  let curr = root;
  let parent = null;
  let dir = '';

  while (curr && curr.val !== valToDelete) {
    parent = curr;
    if (valToDelete < curr.val) {
      pushT(4, `Key ${valToDelete} < current node (${curr.val}). Searching LEFT subtree.`, 'Following BST invariant.', curr.id, 'comparing');
      curr = curr.left;
      dir = 'left';
    } else {
      pushT(6, `Key ${valToDelete} > current node (${curr.val}). Searching RIGHT subtree.`, 'Following BST invariant.', curr.id, 'comparing');
      curr = curr.right;
      dir = 'right';
    }
  }

  if (!curr) {
    pushT(8, `Target key (${valToDelete}) NOT found in BST!`, 'No node was modified.', null, 'active');
    for (let s of steps) s.totalSteps = steps.length;
    return steps;
  }

  pushT(9, `TARGET FOUND: Node (${curr.val}) located. Evaluating deletion cases.`, 'Determining strategy: 0 children (leaf), 1 child, or 2 children.', curr.id, 'sorted');

  // Case 1: Leaf node (no children)
  if (!curr.left && !curr.right) {
    pushT(12, `Case 1: Node (${curr.val}) is a LEAF node (0 children).`, 'Simply removing the leaf pointer from parent.', curr.id, 'comparing');
    if (!parent) {
      pushT(14, `Deleted root node (${curr.val}). Tree is now empty!`, 'O(log N) deletion complete.', null, 'active', { id: 'empty', val: 0, left: null, right: null });
    } else {
      if (dir === 'left') parent.left = null;
      else parent.right = null;
      assignCoords(root, 350, 50, 130);
      pushT(14, `Node (${curr.val}) REMOVED from parent (${parent.val})!`, 'Leaf deletion complete in O(log N) time.', parent.id, 'sorted', root);
    }
  }
  // Case 2: One child
  else if (!curr.left || !curr.right) {
    const child = curr.left ? curr.left : curr.right;
    pushT(15, `Case 2: Node (${curr.val}) has ONE child (${child.val}).`, `Replacing node with its child (${child.val}).`, curr.id, 'comparing');
    if (!parent) {
      assignCoords(child, 350, 50, 130);
      pushT(17, `Replaced root with child (${child.val})!`, 'Single-child deletion complete.', child.id, 'sorted', child);
    } else {
      if (dir === 'left') parent.left = child;
      else parent.right = child;
      assignCoords(root, 350, 50, 130);
      pushT(17, `Node (${curr.val}) bypassed! Child (${child.val}) attached to parent (${parent.val}).`, 'BST ordering preserved.', child.id, 'sorted', root);
    }
  }
  // Case 3: Two children
  else {
    pushT(19, `Case 3: Node (${curr.val}) has TWO children (${curr.left.val} and ${curr.right.val}).`, 'Finding in-order successor: minimum value in right subtree.', curr.id, 'comparing');
    let succParent = curr;
    let succ = curr.right;
    while (succ.left) {
      succParent = succ;
      succ = succ.left;
    }
    pushT(21, `Found In-Order Successor = (${succ.val}) in right subtree.`, `Successor (${succ.val}) is the smallest key greater than (${curr.val}).`, succ.id, 'comparing');
    curr.val = succ.val;
    pushT(23, `Copied successor value (${succ.val}) into node position. Now removing duplicate successor leaf...`, 'Relinking right subtree.', curr.id, 'sorted', root);
    if (succParent !== curr) {
      succParent.left = succ.right;
    } else {
      succParent.right = succ.right;
    }
    assignCoords(root, 350, 50, 130);
    pushT(25, `DELETION COMPLETE: Node replaced with (${succ.val}). BST invariant fully preserved!`, 'O(log N) deletion finished with valid binary search ordering.', curr.id, 'sorted', root);
  }

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

// 5. TREES & BST DISPATCHER
function generateTreeSteps(topicId, rootTree, targetVal = 40) {
  const root = cloneBST(rootTree);
  if (topicId === 'tree-preorder' || topicId === 'preorder-traversal' || topicId === 'binary-tree-traversals') {
    return generatePreOrderSteps(root);
  } else if (topicId === 'tree-inorder' || topicId === 'inorder-traversal' || topicId === 'bst-inorder') {
    return generateInOrderSteps(root);
  } else if (topicId === 'tree-postorder' || topicId === 'postorder-traversal') {
    return generatePostOrderSteps(root);
  } else if (topicId === 'bst-insert') {
    const val = (typeof targetVal === 'number' && !isNaN(targetVal)) ? targetVal : 25;
    return generateBSTInsertSteps(root, val);
  } else if (topicId === 'bst-delete') {
    const val = (typeof targetVal === 'number' && !isNaN(targetVal)) ? targetVal : 30;
    return generateBSTDeleteSteps(root, val);
  } else if (topicId === 'bst-search') {
    const target = (typeof targetVal === 'number' && !isNaN(targetVal)) ? targetVal : 60;
    return generateBSTSearchSteps(root, target);
  } else {
    return generateInOrderSteps(root);
  }
}

// 6. GRAPH GENERATOR (BFS, DFS, DIJKSTRA)
function generateGraphSteps(type = 'bfs', startNode = 'A') {
  const steps = [];
  const graphNodes = [
    { id: 'A', x: 120, y: 70 },
    { id: 'B', x: 280, y: 60 },
    { id: 'C', x: 440, y: 70 },
    { id: 'D', x: 120, y: 220 },
    { id: 'E', x: 280, y: 230 },
    { id: 'F', x: 440, y: 220 }
  ];
  const graphEdges = [
    { u: 'A', v: 'B', w: 4 }, { u: 'A', v: 'D', w: 2 },
    { u: 'B', v: 'C', w: 5 }, { u: 'B', v: 'E', w: 1 },
    { u: 'C', v: 'F', w: 3 }, { u: 'D', v: 'E', w: 8 },
    { u: 'E', v: 'F', w: 6 }
  ];

  const visited = [];
  const queueOrStack = [];
  const distances = { A: Infinity, B: Infinity, C: Infinity, D: Infinity, E: Infinity, F: Infinity };

  function pushG(activeLine, desc, subDesc, activeNode = null, edgeActive = null) {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: { nodes: graphNodes, edges: graphEdges, visited: [...visited], queue: [...queueOrStack], distances: { ...distances } },
      activeLine, description: desc, subDescription: subDesc,
      custom: { activeNode, edgeActive, graphType: type }
    });
  }

  const start = graphNodes.some(n => n.id === startNode) ? startNode : 'A';

  if (type === 'bfs') {
    pushG(1, `Breadth-First Search (BFS) started from node "${start}".`, 'Using FIFO Queue to explore layer-by-layer.', start);
    visited.push(start); queueOrStack.push(start);
    pushG(4, `Enqueued start node "${start}" and marked as visited.`, `Queue: ["${start}"].`, start);

    while (queueOrStack.length > 0) {
      const curr = queueOrStack.shift();
      pushG(8, `Dequeued node "${curr}" for neighborhood exploration.`, `Inspecting adjacent edges of ${curr}.`, curr);
      const neighbors = graphEdges.filter(e => e.u === curr || e.v === curr).map(e => ({ nei: e.u === curr ? e.v : e.u, edge: e }));
      for (let { nei, edge } of neighbors) {
        if (!visited.includes(nei)) {
          visited.push(nei);
          queueOrStack.push(nei);
          pushG(12, `Discovered unvisited neighbor "${nei}" via edge (${curr}-${nei}). Enqueued!`, `FIFO Queue: [${queueOrStack.join(', ')}].`, nei, `${edge.u}-${edge.v}`);
        }
      }
    }
    pushG(14, 'BFS Traversal Complete!', `Visited order: [${visited.join(' ➔ ')}]. All reachable vertices explored in O(V+E).`);

  } else if (type === 'dijkstra') {
    distances[start] = 0;
    pushG(1, `Dijkstra's Shortest Path Algorithm from Source "${start}".`, 'Initializing distance table: dist[A]=0, all others=∞.', start);
    const unvisited = new Set(graphNodes.map(n => n.id));

    while (unvisited.size > 0) {
      let curr = null;
      let minD = Infinity;
      for (let u of unvisited) {
        if (distances[u] < minD) { minD = distances[u]; curr = u; }
      }
      if (!curr || minD === Infinity) break;
      unvisited.delete(curr);
      visited.push(curr);
      pushG(6, `Selected node "${curr}" with minimum distance ${minD}. Finalizing shortest path.`, `Shortest distance to ${curr} is confirmed as ${minD}.`, curr);

      const incidentEdges = graphEdges.filter(e => e.u === curr || e.v === curr);
      for (let edge of incidentEdges) {
        const nei = edge.u === curr ? edge.v : e.u;
        if (unvisited.has(nei)) {
          const newD = distances[curr] + edge.w;
          if (newD < distances[nei]) {
            distances[nei] = newD;
            pushG(11, `Relaxed edge (${curr} ➔ ${nei}, w=${edge.w}): Updated dist[${nei}] = ${newD}!`, `New shorter path found: ${distances[curr]} + ${edge.w} = ${newD}.`, nei, `${edge.u}-${edge.v}`);
          }
        }
      }
    }
    pushG(15, `Dijkstra Complete! Final Shortest Paths from ${start}: ${JSON.stringify(distances).replace(/["{}]/g, '')}.`, 'Optimal shortest paths computed in O((V+E) log V).');

  } else {
    // dfs
    pushG(1, `Depth-First Search (DFS) started from node "${start}".`, 'Traversing deeply down each branch with recursion stack.', start);
    const dfsVisited = new Set();
    function dfs(u) {
      dfsVisited.add(u);
      visited.push(u);
      pushG(5, `DFS visited node "${u}". Pushed onto call stack.`, `Visited sequence: [${visited.join(' ➔ ')}].`, u);
      const neighbors = graphEdges.filter(e => e.u === u || e.v === u).map(e => e.u === u ? e.v : e.u);
      for (let nei of neighbors) {
        if (!dfsVisited.has(nei)) {
          dfs(nei);
        }
      }
    }
    dfs(start);
    pushG(10, 'DFS Traversal Complete!', `Traversal order: [${visited.join(' ➔ ')}]. Backtracked to start in O(V+E).`);
  }

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

// 7. DP GENERATOR (FIBONACCI & KNAPSACK)
function generateDPSteps(type = 'fibonacci', n = 6) {
  const steps = [];

  if (type === 'knapsack') {
    const weights = [2, 3, 4, 5];
    const values = [3, 4, 5, 8];
    const W = 6;
    const numItems = weights.length;
    const dp = Array.from({ length: numItems + 1 }, () => Array(W + 1).fill(0));

    function pushK(activeLine, desc, subDesc, row = 0, col = 0) {
      steps.push({
        stepIndex: steps.length, totalSteps: 0,
        state: { dp: dp.map(r => [...r]), weights, values, W, numItems },
        activeLine, description: desc, subDescription: subDesc,
        custom: { row, col, dpType: 'knapsack' }
      });
    }

    pushK(1, '0/1 Knapsack: Maximizing value within capacity W=6 using 4 items.', 'dp[i][w] = max(exclude item, include item).', 0, 0);

    for (let i = 1; i <= numItems; i++) {
      const wt = weights[i - 1];
      const val = values[i - 1];
      for (let w = 1; w <= W; w++) {
        if (wt <= w) {
          const excludeVal = dp[i - 1][w];
          const includeVal = val + dp[i - 1][w - wt];
          dp[i][w] = Math.max(excludeVal, includeVal);
          pushK(7, `Item ${i} (wt=${wt}, val=${val}) at capacity ${w}: max(exclude=${excludeVal}, include=${includeVal}) ➔ ${dp[i][w]}.`, `Optimal decision stored at dp[${i}][${w}].`, i, w);
        } else {
          dp[i][w] = dp[i - 1][w];
          pushK(9, `Item ${i} (wt=${wt}) exceeds capacity ${w}. Excluded ➔ dp[${i}][${w}] = ${dp[i][w]}.`, 'Carrying over optimal solution without item.', i, w);
        }
      }
    }

    pushK(11, `Knapsack Complete! Maximum attainable value for capacity ${W} is ${dp[numItems][W]}!`, 'Solved via 2D DP memoization in O(N × W) time.', numItems, W);

  } else {
    // fibonacci
    const validN = Math.max(2, Math.min(10, n));
    const dp = Array(validN + 1).fill(0);

    function pushF(activeLine, desc, subDesc, activeIdx = null) {
      steps.push({
        stepIndex: steps.length, totalSteps: 0,
        state: [...dp], activeLine, description: desc, subDescription: subDesc,
        custom: { activeIdx, validN, dpType: 'fibonacci' }
      });
    }

    pushF(1, `Fibonacci Tabulation: Computing F(${validN}) iteratively.`, `Allocated DP array of size ${validN + 1}. Base cases initialized.`, 0);
    dp[0] = 0; dp[1] = 1;
    pushF(4, 'Base cases set: dp[0] = 0, dp[1] = 1.', 'Subproblems 0 and 1 solved in O(1).', 1);

    for (let i = 2; i <= validN; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      pushF(6, `Calculated dp[${i}] = dp[${i-1}] (${dp[i-1]}) + dp[${i-2}] (${dp[i-2]}) = ${dp[i]}.`, `Optimal substructure: instant O(1) sum from previous cached entries.`, i);
    }

    pushF(7, `Fibonacci(${validN}) = ${dp[validN]} computed in linear O(N) time with ZERO redundant work!`, `Final DP Table: [${dp.join(', ')}].`, validN);
  }

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

// 8. GREEDY GENERATOR (ACTIVITY SELECTION & COIN CHANGE)
function generateGreedySteps(type = 'activity', preset = 'standard') {
  const steps = [];

  if (type === 'coin-change') {
    const coins = [50, 20, 10, 5, 1];
    let amount = 87;
    const initialAmount = 87;
    const chosenCoins = [];

    function pushC(activeLine, desc, subDesc, currentCoin = null) {
      steps.push({
        stepIndex: steps.length, totalSteps: 0,
        state: { coins, amount, chosenCoins: [...chosenCoins], initialAmount },
        activeLine, description: desc, subDescription: subDesc,
        custom: { currentCoin, greedyType: 'coin-change' }
      });
    }

    pushC(1, `Greedy Coin Change: Making change for 87¢ using denominations [50, 20, 10, 5, 1].`, 'Greedy choice: pick the largest coin <= remaining amount at each step.', null);

    for (let c of coins) {
      while (amount >= c) {
        amount -= c;
        chosenCoins.push(c);
        pushC(6, `Chose coin ${c}¢! Remaining balance: ${amount}¢.`, `Total coins collected: [${chosenCoins.join('¢, ')}¢].`, c);
      }
    }

    pushC(8, `Greedy Coin Change Complete! Made 87¢ with minimum ${chosenCoins.length} coins: [${chosenCoins.join('¢, ')}¢].`, 'Greedy strategy yields global optimum for standard currency denominations in O(K) time.', null);

  } else {
    // activity selection
    const intervals = [
      { id: 1, s: 1, e: 3, label: 'Act 1 [1-3]' },
      { id: 2, s: 2, e: 5, label: 'Act 2 [2-5]' },
      { id: 3, s: 4, e: 7, label: 'Act 3 [4-7]' },
      { id: 4, s: 6, e: 9, label: 'Act 4 [6-9]' },
      { id: 5, s: 8, e: 10, label: 'Act 5 [8-10]' }
    ];
    const selected = [];
    const rejected = [];

    function pushA(activeLine, desc, subDesc, currId = null) {
      steps.push({
        stepIndex: steps.length, totalSteps: 0,
        state: { intervals, selected: [...selected], rejected: [...rejected] },
        activeLine, description: desc, subDescription: subDesc,
        custom: { currId, greedyType: 'activity' }
      });
    }

    pushA(1, 'Greedy Activity Selection: Activities pre-sorted by earliest finish time.', 'Greedy rule: Always pick activity finishing earliest to maximize remaining time window.');
    selected.push(intervals[0]);
    pushA(4, `Selected Act 1 (finishes earliest at time ${intervals[0].e}).`, `First activity committed. Next candidate must start >= ${intervals[0].e}.`, intervals[0].id);

    for (let i = 1; i < intervals.length; i++) {
      const act = intervals[i];
      const lastEnd = selected[selected.length - 1].e;
      if (act.s >= lastEnd) {
        selected.push(act);
        pushA(8, `Act ${act.id} starts at ${act.s} >= ${lastEnd}. ACCEPTED! (Non-overlapping)`, `Committed. Selected count: ${selected.length}. Next start must be >= ${act.e}.`, act.id);
      } else {
        rejected.push(act.id);
        pushA(7, `Act ${act.id} starts at ${act.s} < ${lastEnd}. REJECTED! (Time conflict)`, `Overlaps with currently running interval ending at ${lastEnd}.`, act.id);
      }
    }

    pushA(9, `Activity Selection Complete! Max compatible activities: ${selected.length} out of ${intervals.length}.`, `Selected: ${selected.map(a => a.label).join(', ')}. Optimal in O(N log N).`);
  }

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}


// =========================================================
// 8. NON-COMPARISON SORTING GENERATORS
// =========================================================

function generateCountSortSteps(initialArr) {
  const steps = [];
  const rawVals = initialArr.map(v => typeof v === 'object' && v !== null ? v.val : v);
  let minVal = Math.min(...rawVals);
  let maxVal = Math.max(...rawVals);
  const k = maxVal - minVal + 1;

  let currentArr = rawVals.map((v, idx) => ({ id: `bar-${idx}-${v}`, val: v }));
  let count = new Array(k).fill(0);
  let output = new Array(rawVals.length).fill(null);

  function push(activeLine, desc, subDesc, pointers = {}, hl = {}) {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: currentArr.map(x => ({ ...x })),
      activeLine, description: desc, subDescription: subDesc,
      pointers,
      highlights: {
        active: hl.active || [],
        sorted: hl.sorted || []
      },
      custom: {
        type: 'count-sort',
        minVal,
        maxVal,
        countArray: [...count],
        outputArray: [...output]
      }
    });
  }

  push(1, 'Starting Count Sort (Counting Sort).', `Key range: min=${minVal}, max=${maxVal} (K=${k} distinct buckets). Non-comparison sorting.`, {});

  // 1. Tally counts
  for (let i = 0; i < rawVals.length; i++) {
    const val = currentArr[i].val;
    const countIdx = val - minVal;
    count[countIdx]++;
    push(11, `Counting occurrences: arr[${i}] = ${val}.`, `Incrementing count[${countIdx}] (value ${val}) to ${count[countIdx]}.`, { i }, { active: [i] });
  }

  push(13, 'Frequency tally complete.', `All ${rawVals.length} elements mapped into frequency buckets. Next: cumulative prefix sum.`, {});

  // 2. Cumulative prefix sum
  for (let i = 1; i < k; i++) {
    count[i] += count[i - 1];
    push(16, `Computing cumulative prefix sum for count[${i}].`, `count[${i}] += count[${i - 1}] => ${count[i]} (items <= ${minVal + i}).`, {});
  }

  push(18, 'Prefix sums computed.', 'Each entry in count[x] now indicates the 1-based index where value x belongs.', {});

  // 3. Build output array stably
  const sortedIds = [];
  for (let i = rawVals.length - 1; i >= 0; i--) {
    const item = currentArr[i];
    const countIdx = item.val - minVal;
    const destIdx = count[countIdx] - 1;
    output[destIdx] = item.val;
    count[countIdx]--;
    push(21, `Placing arr[${i}] = ${item.val} into output[${destIdx}].`, `Decremented count[${countIdx}] to ${count[countIdx]}. Stably positioned.`, { i }, { active: [i] });
  }

  // 4. Copy back to currentArr
  for (let i = 0; i < rawVals.length; i++) {
    currentArr[i] = { id: `bar-${i}-${output[i]}`, val: output[i] };
    sortedIds.push(i);
    push(25, `Copying sorted element ${output[i]} back to arr[${i}].`, `Index ${i} is now firmly established.`, { i }, { sorted: [...sortedIds] });
  }

  push(27, 'Count Sort Complete!', `Sorted in O(N + K) linear time without any comparison operations.`, {}, { sorted: currentArr.map((_, idx) => idx) });

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

function generateBucketSortSteps(initialArr) {
  const steps = [];
  const rawVals = initialArr.map(v => typeof v === 'object' && v !== null ? v.val : v);
  const n = rawVals.length;
  const minVal = Math.min(...rawVals);
  const maxVal = Math.max(...rawVals);
  const numBuckets = 5;
  const bucketRange = Math.max(1, Math.floor((maxVal - minVal) / numBuckets) + 1);

  let currentArr = rawVals.map((v, idx) => ({ id: `bar-${idx}-${v}`, val: v }));
  let buckets = Array.from({ length: numBuckets }, () => []);

  function push(activeLine, desc, subDesc, pointers = {}, hl = {}) {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: currentArr.map(x => ({ ...x })),
      activeLine, description: desc, subDescription: subDesc,
      pointers,
      highlights: {
        active: hl.active || [],
        sorted: hl.sorted || []
      },
      custom: {
        type: 'bucket-sort',
        numBuckets,
        bucketRange,
        minVal,
        buckets: buckets.map(b => [...b])
      }
    });
  }

  push(1, 'Starting Bucket Sort.', `Distributing ${n} values across ${numBuckets} continuous partition buckets.`, {});

  // 1. Scatter into buckets
  for (let i = 0; i < n; i++) {
    const val = currentArr[i].val;
    const bIdx = Math.min(numBuckets - 1, Math.floor((val - minVal) / bucketRange));
    buckets[bIdx].push(val);
    push(11, `Scatter: placing arr[${i}] = ${val} into Bucket ${bIdx}.`, `Bucket ${bIdx} range: [${minVal + bIdx * bucketRange} .. ${minVal + (bIdx + 1) * bucketRange - 1}].`, { i }, { active: [i] });
  }

  push(13, 'Scatter phase complete.', `All ${n} items placed into corresponding buckets. Next: sort each non-empty bucket.`, {});

  // 2. Sort each bucket
  for (let b = 0; b < numBuckets; b++) {
    if (buckets[b].length > 1) {
      buckets[b].sort((a, b) => a - b);
      push(16, `Sorted Bucket ${b} items in-place.`, `Bucket ${b} elements: [${buckets[b].join(', ')}].`, {});
    }
  }

  // 3. Gather phase
  const sortedIds = [];
  let outIdx = 0;
  for (let b = 0; b < numBuckets; b++) {
    for (let x of buckets[b]) {
      currentArr[outIdx] = { id: `bar-${outIdx}-${x}`, val: x };
      sortedIds.push(outIdx);
      push(23, `Gather: copying ${x} from Bucket ${b} back to arr[${outIdx}].`, `Array index ${outIdx} finalized.`, { i: outIdx }, { sorted: [...sortedIds] });
      outIdx++;
    }
  }

  push(26, 'Bucket Sort Complete!', `Gather complete! Array fully sorted in O(N + K) expected time.`, {}, { sorted: currentArr.map((_, idx) => idx) });

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

function generateRadixSortSteps(initialArr) {
  const steps = [];
  let rawVals = initialArr.map(v => typeof v === 'object' && v !== null ? v.val : v);
  const n = rawVals.length;
  const maxVal = Math.max(...rawVals);

  let currentArr = rawVals.map((v, idx) => ({ id: `bar-${idx}-${v}`, val: v }));
  let digitBuckets = Array.from({ length: 10 }, () => []);

  function push(activeLine, desc, subDesc, pointers = {}, hl = {}, extra = {}) {
    steps.push({
      stepIndex: steps.length, totalSteps: 0,
      state: currentArr.map(x => ({ ...x })),
      activeLine, description: desc, subDescription: subDesc,
      pointers,
      highlights: {
        active: hl.active || [],
        sorted: hl.sorted || []
      },
      custom: {
        type: 'radix-sort',
        maxVal,
        exp: extra.exp || 1,
        passName: extra.passName || 'Units (1s)',
        digitBuckets: digitBuckets.map(b => [...b])
      }
    });
  }

  push(20, 'Starting Radix Sort (LSD).', `Maximum value is ${maxVal}. Will process digit passes from least to most significant.`, {});

  let exp = 1;
  while (Math.floor(maxVal / exp) > 0) {
    const passName = exp === 1 ? 'Units (1s place)' : exp === 10 ? 'Tens (10s place)' : 'Hundreds (100s place)';
    digitBuckets = Array.from({ length: 10 }, () => []);

    push(6, `Beginning Pass for ${passName}.`, `Distributing elements into 10 digit buckets (0 to 9).`, {}, {}, { exp, passName });

    // Tally and distribute into 10 digit buckets
    for (let i = 0; i < n; i++) {
      const val = currentArr[i].val;
      const digit = Math.floor(val / exp) % 10;
      digitBuckets[digit].push(val);
      push(8, `Tallying arr[${i}] = ${val}: digit at ${passName} is ${digit}.`, `Routing ${val} to Digit Bucket [${digit}].`, { i }, { active: [i] }, { exp, passName });
    }

    // Gather from digit buckets back to array
    let writeIdx = 0;
    for (let d = 0; d < 10; d++) {
      for (let val of digitBuckets[d]) {
        currentArr[writeIdx] = { id: `bar-${writeIdx}-${val}`, val };
        push(18, `Gathering from Bucket [${d}]: restoring ${val} to arr[${writeIdx}].`, `Maintains stable order of previous passes.`, { i: writeIdx }, { active: [writeIdx] }, { exp, passName });
        writeIdx++;
      }
    }

    push(19, `Pass for ${passName} Completed.`, `Array is now stably ordered with respect to all digits up to ${exp}s place.`, {}, {}, { exp, passName });
    exp *= 10;
  }

  push(26, 'Radix Sort Complete!', `All digit passes finished! Array is fully sorted in O(N · d) linear time.`, {}, { sorted: currentArr.map((_, idx) => idx) });

  for (let s of steps) s.totalSteps = steps.length;
  return steps;
}

