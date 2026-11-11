import sys
import os

HTML_PATH = r"D:\Nandini\Work Space\VisualDSA\index.html"
PREVIEW_PATH = r"D:\Nandini\Work Space\VisualDSA\preview.html"

with open(HTML_PATH, "r", encoding="utf-8") as f:
    text = f.read()

head_part = text[:text.find("// B. Searching Steps (Linear, Binary, Jump, and Ternary Search)")]
foot_part = text[text.find("// Mount to DOM"):]

middle_code = '''// B. Searching Steps (Linear, Binary, Jump, and Ternary Search)
    function generateSearchingSteps(algoId, initialArr, target) {
      const steps = [];
      const needsSort = algoId !== 'linear-search';
      const arr = needsSort ? [...initialArr].sort((a,b)=>a-b) : [...initialArr];
      const n = arr.length;
      let comparisons = 0;

      function push(activeLine, desc, subDesc, pointers = {}, hl = {}) {
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
          metrics: { comparisons }
        });
      }

      if (algoId === 'linear-search') {
        push(1, `Starting Linear Search for target = ${target}.`, `Scanning array sequentially from index 0 to ${n-1}.`, { i: 0, target }, { active: [0] });
        let found = false;
        for (let i = 0; i < n; i++) {
          comparisons++;
          const isMatch = arr[i] === target;
          push(3, `Comparing arr[${i}] (${arr[i]}) with target (${target}).`,
            isMatch ? `MATCH FOUND: arr[${i}] == ${target}!` : `arr[${i}] != ${target}. Advancing to next index.`,
            { i, target },
            isMatch ? { comparing: [i], sorted: [i] } : { comparing: [i] }
          );
          if (isMatch) {
            found = true;
            push(4, `Linear Search Succeeded! Target ${target} located at index ${i}.`, `Total comparisons made: ${comparisons}.`, { i, target }, { sorted: [i] });
            break;
          }
        }
        if (!found) {
          push(5, `Target ${target} was NOT found in the array.`, `Checked all ${n} elements. Returning -1. Total comparisons: ${comparisons}.`, { target }, { dimmed: Array.from({length: n}, (_, idx) => idx) });
        }
      } else if (algoId === 'binary-search') {
        push(1, `Starting Binary Search for target = ${target}.`, `Array is sorted: [${arr.join(', ')}]. Search interval begins [0..${n-1}].`, { low: 0, high: n - 1, target });
        let low = 0, high = n - 1, found = false;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const dimmed = [];
          for (let i = 0; i < low; i++) dimmed.push(i);
          for (let i = high + 1; i < n; i++) dimmed.push(i);

          push(5, `Calculated midpoint: mid = (${low} + ${high}) // 2 = ${mid} (arr[mid] = ${arr[mid]}).`, `Active window: [${low}..${high}]. Checking if arr[${mid}] == ${target}.`, { low, mid, high, target }, { active: [mid], dimmed });
          comparisons++;
          if (arr[mid] === target) {
            found = true;
            push(7, `TARGET FOUND: arr[${mid}] == ${target}!`, `Binary search succeeded at index ${mid} with only ${comparisons} comparisons.`, { low, mid, high, target }, { sorted: [mid], dimmed });
            break;
          } else if (arr[mid] < target) {
            push(9, `arr[${mid}] (${arr[mid]}) < target (${target}). Target must lie to the RIGHT.`, `Eliminating left half [${low}..${mid}]. Updating low = ${mid + 1}.`, { low: mid + 1, mid, high, target }, { comparing: [mid], dimmed });
            low = mid + 1;
          } else {
            push(11, `arr[${mid}] (${arr[mid]}) > target (${target}). Target must lie to the LEFT.`, `Eliminating right half [${mid}..${high}]. Updating high = ${mid - 1}.`, { low, mid, high: mid - 1, target }, { comparing: [mid], dimmed });
            high = mid - 1;
          }
        }
        if (!found) {
          push(12, `Target ${target} was NOT found in the array.`, `low (${low}) > high (${high}): Search interval exhausted. Returning -1.`, { low, high, target }, { dimmed: Array.from({length: n}, (_, idx) => idx) });
        }
      } else if (algoId === 'jump-search') {
        const step = Math.max(1, Math.floor(Math.sqrt(n)));
        push(2, `Starting Jump Search for target = ${target}.`, `Optimal block jump step = √(${n}) ≈ ${step}. Jumping across sorted array.`, { prev: 0, step, target });
        let prev = 0, curr = step, found = false;

        while (curr < n && arr[Math.min(curr, n) - 1] < target) {
          comparisons++;
          const blockHl = Array.from({ length: Math.min(curr, n) - prev }, (_, i) => prev + i);
          push(6, `Jumped block: arr[${Math.min(curr, n) - 1}] (${arr[Math.min(curr, n) - 1]}) < target (${target}).`, `Target is larger than block boundary. Jumping ahead by ${step} elements.`, { prev, curr: Math.min(curr, n) - 1, step, target }, { active: blockHl });
          prev = curr;
          curr += step;
        }

        const endBound = Math.min(curr, n);
        push(10, `Target may lie within block indices [${prev}..${endBound - 1}].`, `arr[${endBound - 1}] >= ${target}. Starting linear search within block.`, { prev, curr: endBound - 1, target }, { active: Array.from({ length: endBound - prev }, (_, i) => prev + i) });

        while (prev < endBound) {
          comparisons++;
          const isMatch = arr[prev] === target;
          push(10, `Inspecting arr[${prev}] (${arr[prev]}).`, isMatch ? `MATCH FOUND: arr[${prev}] == ${target}!` : `${arr[prev]} < ${target}. Advancing.`, { prev, target }, isMatch ? { sorted: [prev] } : { comparing: [prev] });
          if (isMatch) {
            found = true;
            push(14, `Jump Search Succeeded! Target ${target} located at index ${prev}.`, `Completed in O(√N) time with ${comparisons} comparisons.`, { prev, target }, { sorted: [prev] });
            break;
          }
          prev++;
        }
        if (!found) {
          push(15, `Target ${target} NOT found in array.`, `Block linear search exhausted. Returning -1.`, { target }, { dimmed: Array.from({length: n}, (_, idx) => idx) });
        }
      } else if (algoId === 'ternary-search') {
        push(1, `Starting Ternary Search for target = ${target}.`, `Divides search space into 3 equal segments using two midpoints (mid1, mid2).`, { low: 0, high: n - 1, target });
        let low = 0, high = n - 1, found = false;
        while (low <= high) {
          const mid1 = low + Math.floor((high - low) / 3);
          const mid2 = high - Math.floor((high - low) / 3);
          const dimmed = [];
          for (let i = 0; i < low; i++) dimmed.push(i);
          for (let i = high + 1; i < n; i++) dimmed.push(i);

          push(2, `Calculated mid1 = ${mid1} (${arr[mid1]}) and mid2 = ${mid2} (${arr[mid2]}).`, `Trisecting interval into [${low}..${mid1}], [${mid1+1}..${mid2-1}], and [${mid2}..${high}].`, { low, mid1, mid2, high, target }, { active: [mid1, mid2], dimmed });

          comparisons++;
          if (arr[mid1] === target) {
            found = true;
            push(5, `TARGET FOUND at mid1: arr[${mid1}] == ${target}!`, `Found in O(log₃ N) time!`, { low, mid1, mid2, high, target }, { sorted: [mid1], dimmed });
            break;
          }
          comparisons++;
          if (arr[mid2] === target) {
            found = true;
            push(6, `TARGET FOUND at mid2: arr[${mid2}] == ${target}!`, `Found in O(log₃ N) time!`, { low, mid1, mid2, high, target }, { sorted: [mid2], dimmed });
            break;
          }

          if (target < arr[mid1]) {
            push(8, `target (${target}) < arr[mid1] (${arr[mid1]}). Target lies in FIRST third.`, `Discarding middle and right segments. Updating high = ${mid1 - 1}.`, { low, mid1, mid2, high: mid1 - 1, target }, { comparing: [mid1], dimmed });
            high = mid1 - 1;
          } else if (target > arr[mid2]) {
            push(10, `target (${target}) > arr[mid2] (${arr[mid2]}). Target lies in THIRD segment.`, `Discarding left and middle segments. Updating low = ${mid2 + 1}.`, { low: mid2 + 1, mid1, mid2, high, target }, { comparing: [mid2], dimmed });
            low = mid2 + 1;
          } else {
            push(12, `Target lies in MIDDLE segment [${mid1 + 1}..${mid2 - 1}].`, `Discarding outer segments. Updating low = ${mid1 + 1}, high = ${mid2 - 1}.`, { low: mid1 + 1, mid1, mid2, high: mid2 - 1, target }, { comparing: [mid1, mid2], dimmed });
            low = mid1 + 1;
            high = mid2 - 1;
          }
        }
        if (!found) {
          push(14, `Target ${target} was NOT found in the array.`, `Search interval exhausted. Returning -1.`, { target }, { dimmed: Array.from({length: n}, (_, idx) => idx) });
        }
      }

      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // B2. Two Pointers & Sliding Window Steps (Dedicated Domain)
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
          metrics: { comparisons },
          custom
        });
      }

      if (algoId === 'two-pointers') {
        push(1, `Two Pointers Technique: Searching for two numbers that sum to ${targetVal}.`, `Array is sorted in ascending order: [${arr.join(', ')}]. Left starts at 0, Right starts at ${n-1}.`, { left: 0, right: n - 1, target: targetVal });
        let left = 0, right = n - 1, found = false;
        while (left < right) {
          const sum = arr[left] + arr[right];
          comparisons++;
          push(5, `Comparing pair arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${sum}.`,
            sum === targetVal
              ? `MATCH FOUND! Sum ${sum} matches target ${targetVal}.`
              : sum < targetVal
              ? `Sum ${sum} < ${targetVal}: Sum is too small. Incrementing left pointer (+1).`
              : `Sum ${sum} > ${targetVal}: Sum is too large. Decrementing right pointer (-1).`,
            { left, right, sum, target: targetVal },
            sum === targetVal ? { sorted: [left, right] } : { active: [left, right] },
            { sum, targetVal }
          );
          if (sum === targetVal) {
            found = true;
            push(6, `PAIR FOUND: arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) == ${targetVal}!`, `Solved in O(N) time with O(1) extra space!`, { left, right, target: targetVal }, { sorted: [left, right] }, { sum, targetVal });
            break;
          } else if (sum < targetVal) {
            left++;
          } else {
            right--;
          }
        }
        if (!found) {
          push(11, `No two elements in the array sum up to ${targetVal}.`, 'Pointers met without finding a matching pair. Returning empty list.', { target: targetVal });
        }
      } else {
        // Sliding Window
        const k = Math.max(1, Math.min(windowK, n));
        push(1, `Sliding Window: Computing maximum sum contiguous subarray of fixed size K = ${k}.`, `Initializing window across first ${k} elements.`, { k });
        let windowSum = 0;
        for (let i = 0; i < k; i++) windowSum += arr[i];
        let maxSum = windowSum;

        const initHl = Array.from({ length: k }, (_, i) => i);
        push(4, `Initial Window [0..${k-1}]: Sum = ${windowSum}.`, `Max sum initialized to ${maxSum}. Now sliding window forward by 1 at each step.`, { left: 0, right: k - 1, windowSum, maxSum }, { active: initHl }, { windowSum, maxSum, windowRange: [0, k - 1] });

        for (let i = k; i < n; i++) {
          const outgoing = arr[i - k];
          const incoming = arr[i];
          windowSum = windowSum - outgoing + incoming;
          const isNewMax = windowSum > maxSum;
          if (isNewMax) maxSum = windowSum;

          const windowHl = Array.from({ length: k }, (_, idx) => i - k + 1 + idx);
          push(7, `Slid window to [${i - k + 1}..${i}]: Subtracted ${outgoing}, added ${incoming}.`,
            `Current Window Sum = ${windowSum}. ${isNewMax ? `NEW MAXIMUM SUM RECORDED: ${maxSum}!` : `Max sum remains ${maxSum}.`}`,
            { left: i - k + 1, right: i, windowSum, maxSum },
            { active: windowHl },
            { windowSum, maxSum, windowRange: [i - k + 1, i] }
          );
        }

        push(9, `Sliding Window Complete! Maximum subarray sum of size ${k} is ${maxSum}.`, `Found in single linear O(N) pass.`, { maxSum }, {}, { maxSum });
      }

      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // C. Stack Steps (Push, Pop, Peek, Matching)
    function generateStackSteps(initialItems = [15, 30, 45], action = null) {
      const steps = [];
      const items = [...initialItems];

      function push(activeLine, desc, subDesc, activeIdx = null) {
        steps.push({
          stepIndex: steps.length, totalSteps: 0,
          state: [...items], activeLine, description: desc, subDescription: subDesc,
          custom: { activeIdx }
        });
      }

      if (action && action.type === 'push') {
        push(3, `Preparing to push element (${action.val}) onto stack.`, `Current stack size: ${items.length}. Top: ${items.length > 0 ? items[items.length - 1] : 'Empty'}.`);
        items.push(action.val);
        push(4, `push(${action.val}): Element added to top of stack.`, `Appended ${action.val} in O(1) time. New top of stack is ${action.val}.`, items.length - 1);
      } else if (action && action.type === 'pop') {
        if (items.length === 0) {
          push(6, 'Stack Underflow! Cannot pop from an empty stack.', 'Stack is already empty. Operation returned None.');
        } else {
          const topVal = items[items.length - 1];
          push(5, `Preparing to pop top element (${topVal}) from stack.`, `Inspecting top of stack before removal.`);
          const popped = items.pop();
          push(7, `pop(): Removed top element (${popped}) from stack.`, `Removed in O(1) time. New top is ${items.length > 0 ? items[items.length - 1] : 'Empty'}.`);
        }
      } else if (action && action.type === 'peek') {
        if (items.length === 0) {
          push(9, 'peek(): Stack is empty.', 'No elements to peek.');
        } else {
          push(9, `peek(): Top element is ${items[items.length - 1]}.`, 'Stack contents remain completely untouched in O(1) time.', items.length - 1);
        }
      } else {
        push(1, 'Stack initialized with LIFO (Last-In-First-Out) discipline.', `Current elements: [${items.join(', ')}]. Top element is ${items.length > 0 ? items[items.length - 1] : 'Empty'}.`);
        items.push(60);
        push(4, 'push(60): Element added to top of stack.', 'Appended 60 to the end of the list in O(1) time.', items.length - 1);
        push(9, `peek(): Inspecting top element without removing it.`, `Top element is ${items[items.length - 1]}. Stack untouched.`, items.length - 1);
        const popped = items.pop();
        push(7, `pop(): Removed top element (${popped}) from stack.`, `Removed 60 in O(1) time. New top is ${items.length > 0 ? items[items.length - 1] : 'Empty'}.`);
      }

      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // D. Queue Steps (FIFO)
    function generateQueueSteps(initialItems = [10, 20, 30], action = null) {
      const steps = [];
      const items = [...initialItems];

      function push(activeLine, desc, subDesc, activeIdx = null) {
        steps.push({
          stepIndex: steps.length, totalSteps: 0,
          state: [...items], activeLine, description: desc, subDescription: subDesc,
          custom: { activeIdx }
        });
      }

      if (action && action.type === 'enqueue') {
        push(4, `Preparing to enqueue element (${action.val}) at rear.`, `Current queue size: ${items.length}. Front: ${items[0] !== undefined ? items[0] : 'Empty'}.`);
        items.push(action.val);
        push(5, `enqueue(${action.val}): Element appended at REAR of queue.`, `Inserted ${action.val} at tail in O(1) time.`, items.length - 1);
      } else if (action && action.type === 'dequeue') {
        if (items.length === 0) {
          push(7, 'Queue Underflow! Cannot dequeue from empty queue.', 'Buffer has no elements.');
        } else {
          const frontVal = items[0];
          push(6, `Preparing to dequeue front element (${frontVal}).`, `Inspecting head before removal.`);
          const dequeued = items.shift();
          push(8, `dequeue(): Removed front element (${dequeued}) from head.`, `FIFO discipline: oldest element exits first. New front is ${items[0] !== undefined ? items[0] : 'Empty'}.`, 0);
        }
      } else if (action && action.type === 'front') {
        if (items.length === 0) {
          push(10, 'front(): Queue is empty.', 'No items.');
        } else {
          push(10, `front(): Front element is ${items[0]}.`, 'Queue contents remain untouched.', 0);
        }
      } else {
        push(2, 'Queue initialized with FIFO (First-In-First-Out) discipline.', `Front is ${items[0] !== undefined ? items[0] : 'None'}, Rear is ${items[items.length - 1] !== undefined ? items[items.length - 1] : 'None'}.`);
        items.push(40);
        push(5, 'enqueue(40): Element appended at REAR of queue.', `Inserted 40 at the tail. Queue size: ${items.length}.`, items.length - 1);
        const dequeued = items.shift();
        push(8, `dequeue(): Removed front element (${dequeued}) from head.`, `FIFO principle: oldest element exits first. New front is ${items[0] !== undefined ? items[0] : 'Empty'}.`, 0);
      }

      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // E. BST Steps (Tree Layout, Insert, Search, In-Order)
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
      function assignCoords(n, x, y, dx) {
        if (!n) return;
        n.x = x; n.y = y;
        if (n.left) assignCoords(n.left, x - dx, y + 65, Math.max(25, dx * 0.55));
        if (n.right) assignCoords(n.right, x + dx, y + 65, Math.max(25, dx * 0.55));
      }
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

    function generateBSTInOrderSteps(root) {
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

      push(1, 'Starting In-Order Traversal (Left -> Root -> Right).', 'In-Order traversal on a valid BST always yields ascending sorted keys!');
      function traverse(n) {
        if (!n) return;
        push(4, `Descending into LEFT subtree of node ${n.val}.`, 'Following Left -> Root -> Right.', n.id, 'comparing');
        traverse(n.left);
        visited.push(n.val);
        push(5, `Processed node ${n.val}: Appended to sequence [${visited.join(', ')}].`, 'Left finished; recording current root value.', n.id, 'sorted');
        push(6, `Descending into RIGHT subtree of node ${n.val}.`, 'Following Left -> Root -> Right.', n.id, 'comparing');
        traverse(n.right);
      }
      traverse(root);
      push(8, 'In-Order Traversal Complete!', `Sorted Output: [${visited.join(', ')}]. Naturally sorted in O(N).`);
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

    // F. Graph Steps (BFS & DFS)
    function generateGraphSteps(type = 'bfs', startNode = 'A') {
      const steps = [];
      const graphNodes = [
        { id: 'A', x: 180, y: 70 },
        { id: 'B', x: 350, y: 60 },
        { id: 'C', x: 520, y: 70 },
        { id: 'D', x: 180, y: 220 },
        { id: 'E', x: 350, y: 230 },
        { id: 'F', x: 520, y: 220 }
      ];
      const graphEdges = [
        { u: 'A', v: 'B', w: 4 }, { u: 'A', v: 'D', w: 2 },
        { u: 'B', v: 'C', w: 5 }, { u: 'B', v: 'E', w: 1 },
        { u: 'C', v: 'F', w: 3 }, { u: 'D', v: 'E', w: 8 },
        { u: 'E', v: 'F', w: 6 }
      ];

      const visited = [];
      const queueOrStack = [];

      function push(activeLine, desc, subDesc, activeNode = null) {
        steps.push({
          stepIndex: steps.length, totalSteps: 0,
          state: { nodes: graphNodes, edges: graphEdges, visited: [...visited], queue: [...queueOrStack] },
          activeLine, description: desc, subDescription: subDesc,
          custom: { activeNode }
        });
      }

      const start = graphNodes.some(n => n.id === startNode) ? startNode : 'A';

      if (type === 'bfs') {
        push(1, `Breadth-First Search (BFS) initialized from Start Node "${start}".`, 'Using FIFO queue to explore layer by layer.');
        visited.push(start); queueOrStack.push(start);
        push(4, `Enqueued starting node "${start}" and marked as visited.`, `Queue: ["${start}"].`, start);
        
        while (queueOrStack.length > 0) {
          const curr = queueOrStack.shift();
          push(8, `Dequeued node "${curr}" for neighborhood exploration.`, `Inspecting all unvisited adjacent neighbors of ${curr}.`, curr);
          const neighbors = graphEdges.filter(e => e.u === curr || e.v === curr).map(e => e.u === curr ? e.v : e.u);
          for (let nei of neighbors) {
            if (!visited.includes(nei)) {
              visited.push(nei);
              queueOrStack.push(nei);
              push(12, `Discovered neighbor "${nei}". Marked visited and added to FIFO queue.`, `Queue: [${queueOrStack.join(', ')}].`, nei);
            }
          }
        }
        push(14, 'BFS Graph Traversal Complete!', `Visited sequence: [${visited.join(' ➔ ')}]. Shortest hops verified.`);
      } else {
        // DFS
        push(1, `Depth-First Search (DFS) initialized from Start Node "${start}".`, 'Traversing deeply down each branch before backtracking.');
        const dfsVisited = new Set();
        function dfs(u) {
          dfsVisited.add(u);
          visited.push(u);
          push(5, `DFS reached node "${u}".`, `Call stack frame active. Visited order: [${visited.join(' ➔ ')}].`, u);
          const neighbors = graphEdges.filter(e => e.u === u || e.v === u).map(e => e.u === u ? e.v : e.u);
          for (let nei of neighbors) {
            if (!dfsVisited.has(nei)) {
              dfs(nei);
            }
          }
        }
        dfs(start);
        for (let node of graphNodes) {
          if (!dfsVisited.has(node.id)) {
            dfs(node.id);
          }
        }
        push(10, 'DFS Traversal Complete!', `Traversal order: [${visited.join(' ➔ ')}].`);
      }

      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // G. Dynamic Programming Steps (Fibonacci / Knapsack Grid)
    function generateDPSteps(n = 6) {
      const steps = [];
      const validN = Math.max(2, Math.min(12, n));
      const dp = Array(validN + 1).fill(0);

      function push(activeLine, desc, subDesc, activeIdx = null) {
        steps.push({
          stepIndex: steps.length, totalSteps: 0,
          state: [...dp], activeLine, description: desc, subDescription: subDesc,
          custom: { activeIdx }
        });
      }

      push(1, `Computing Fibonacci(${validN}) via Dynamic Programming (Tabulation).`, `Allocated 1D DP table of size ${validN + 1}. Base cases initialized.`);
      dp[0] = 0; dp[1] = 1;
      push(4, 'Base cases set: dp[0] = 0, dp[1] = 1.', 'Subproblems 0 and 1 solved directly in O(1).', 1);

      for (let i = 2; i <= validN; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        push(6, `Calculated dp[${i}] = dp[${i-1}] (${dp[i-1]}) + dp[${i-2}] (${dp[i-2]}) = ${dp[i]}.`, `Optimal substructure: solved in O(1) from prior cached table entries.`, i);
      }

      push(7, `Fibonacci(${validN}) = ${dp[validN]} computed in linear O(N) time with zero duplicate work!`, `Final DP Table: [${dp.join(', ')}].`);
      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // H. Greedy Steps (Interval / Coin Change)
    function generateGreedySteps(preset = 'standard') {
      const steps = [];
      let intervals;
      if (preset === 'dense') {
        intervals = [
          { id: 1, s: 1, e: 4, label: 'Act 1 [1-4]' },
          { id: 2, s: 2, e: 5, label: 'Act 2 [2-5]' },
          { id: 3, s: 3, e: 6, label: 'Act 3 [3-6]' },
          { id: 4, s: 5, e: 8, label: 'Act 4 [5-8]' },
          { id: 5, s: 7, e: 10, label: 'Act 5 [7-10]' }
        ];
      } else {
        intervals = [
          { id: 1, s: 1, e: 3, label: 'Act 1 [1-3]' },
          { id: 2, s: 2, e: 5, label: 'Act 2 [2-5]' },
          { id: 3, s: 4, e: 7, label: 'Act 3 [4-7]' },
          { id: 4, s: 6, e: 9, label: 'Act 4 [6-9]' },
          { id: 5, s: 8, e: 10, label: 'Act 5 [8-10]' }
        ];
      }
      const selected = [];

      function push(activeLine, desc, subDesc, currId = null) {
        steps.push({
          stepIndex: steps.length, totalSteps: 0,
          state: { intervals, selected: [...selected] },
          activeLine, description: desc, subDescription: subDesc,
          custom: { currId }
        });
      }

      push(2, 'Greedy Activity Selection: Sorting activities by earliest finish time.', 'Greedy choice: pick activity that finishes earliest, maximizing remaining time.');
      selected.push(intervals[0]);
      push(4, `Selected Act 1 (finishes earliest at time ${intervals[0].e}).`, `First activity committed. Next must start at or after time ${intervals[0].e}.`, intervals[0].id);

      for (let i = 1; i < intervals.length; i++) {
        const act = intervals[i];
        const lastEnd = selected[selected.length - 1].e;
        if (act.s >= lastEnd) {
          selected.push(act);
          push(8, `Act ${act.id} starts at ${act.s} >= ${lastEnd}. ACCEPTED!`, `Non-overlapping condition met. Selected count: ${selected.length}.`, act.id);
        } else {
          push(7, `Act ${act.id} starts at ${act.s} < ${lastEnd}. REJECTED (Conflict).`, `Cannot overlap with previous active interval ending at ${lastEnd}.`, act.id);
        }
      }

      push(9, `Greedy Selection Complete! Maximum mutually compatible activities: ${selected.length}.`, `Selected: ${selected.map(a => a.label).join(', ')}.`);
      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // =========================================================================
    // 4. MAIN APP COMPONENT
    // =========================================================================
    function VisualDSAMasterApp() {
      const [currentTopicId, setCurrentTopicId] = useState('quick-sort');
      const [isHubOpen, setIsHubOpen] = useState(false);
      const [sidebarOpen, setSidebarOpen] = useState(true);
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

      // Shared Array dataset for sorting & searching
      const [arrData, setArrData] = useState([45, 12, 85, 32, 89, 39, 67, 24, 71, 18]);
      const [targetVal, setTargetVal] = useState(39);

      // Dedicated Two Pointers & Sliding Window State
      const [pointersArr, setPointersArr] = useState([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
      const [pointersTarget, setPointersTarget] = useState(61);
      const [windowK, setWindowK] = useState(3);

      // Stack state
      const [stackData, setStackData] = useState([15, 30, 45]);
      const [stackInputVal, setStackInputVal] = useState('60');

      // Queue state
      const [queueData, setQueueData] = useState([10, 20, 30]);
      const [queueInputVal, setQueueInputVal] = useState('40');

      // BST custom interactive state
      const [bstTree, setBstTree] = useState(createDefaultBST);
      const [bstCustomSteps, setBstCustomSteps] = useState(null);
      const [bstInputVal, setBstInputVal] = useState('25');

      // Graph state
      const [graphStartNode, setGraphStartNode] = useState('A');

      // DP state
      const [dpN, setDpN] = useState(6);

      // Greedy state
      const [greedyPreset, setGreedyPreset] = useState('standard');

      // Timeline Playback
      const [stepIdx, setStepIdx] = useState(0);
      const [isPlaying, setIsPlaying] = useState(false);
      const [speed, setSpeed] = useState(1);
      const timerRef = useRef(null);

      // Universal Custom Input Modal
      const [isCustomInputModalOpen, setIsCustomInputModalOpen] = useState(false);
      const [modalArrInput, setModalArrInput] = useState('45, 12, 85, 32, 89, 39, 67, 24, 71, 18');
      const [modalTargetInput, setModalTargetInput] = useState('39');
      const [modalPointersArrInput, setModalPointersArrInput] = useState('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
      const [modalPointersTargetInput, setModalPointersTargetInput] = useState('61');
      const [modalWindowKInput, setModalWindowKInput] = useState('3');
      const [modalStackInput, setModalStackInput] = useState('15, 30, 45');
      const [modalQueueInput, setModalQueueInput] = useState('10, 20, 30');
      const [modalBstInput, setModalBstInput] = useState('50, 30, 70, 20, 40, 60, 80');
      const [modalDpNInput, setModalDpNInput] = useState('6');

      // Current Topic Meta
      const currentTopic = useMemo(() => {
        return ALL_TOPICS.find(t => t.id === currentTopicId) || ALL_TOPICS[0];
      }, [currentTopicId]);

      // Steps Generation Factory
      const steps = useMemo(() => {
        const stage = currentTopic.stageType;
        if (stage === 'sorting') {
          return generateSortingSteps(currentTopic.id, arrData);
        }
        if (stage === 'searching') {
          return generateSearchingSteps(currentTopic.id, arrData, targetVal);
        }
        if (stage === 'pointers') {
          return generatePointersSteps(currentTopic.id, pointersArr, pointersTarget, windowK);
        }
        if (stage === 'stack') {
          return generateStackSteps(stackData);
        }
        if (stage === 'queue') {
          return generateQueueSteps(queueData);
        }
        if (stage === 'bst') {
          if (bstCustomSteps) return bstCustomSteps;
          return generateBSTInOrderSteps(bstTree);
        }
        if (stage === 'graph') {
          return generateGraphSteps(currentTopic.id === 'graph-dfs' ? 'dfs' : 'bfs', graphStartNode);
        }
        if (stage === 'greedy') {
          return generateGreedySteps(greedyPreset);
        }
        if (stage === 'dp') {
          return generateDPSteps(dpN);
        }
        return generateSortingSteps('quick-sort', arrData);
      }, [currentTopic, arrData, targetVal, pointersArr, pointersTarget, windowK, stackData, queueData, bstTree, bstCustomSteps, graphStartNode, greedyPreset, dpN]);

      // Reset when topic or steps change
      useEffect(() => {
        setStepIdx(0);
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }, [steps]);

      // Playback ticker
      useEffect(() => {
        if (!isPlaying) {
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }
        const interval = Math.max(80, Math.floor(700 / speed));
        timerRef.current = setInterval(() => {
          setStepIdx(prev => {
            if (prev >= steps.length - 1) {
              setIsPlaying(false);
              return prev;
            }
            return prev + 1;
          });
        }, interval);
        return () => clearInterval(timerRef.current);
      }, [isPlaying, speed, steps.length]);

      // Keyboard Controls
      useEffect(() => {
        function onKey(e) {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
          if (e.code === 'Space') {
            e.preventDefault();
            setIsPlaying(p => !p);
          } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            setIsPlaying(false);
            setStepIdx(p => Math.min(steps.length - 1, p + 1));
          } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            setIsPlaying(false);
            setStepIdx(p => Math.max(0, p - 1));
          } else if (e.code === 'KeyR') {
            e.preventDefault();
            setIsPlaying(false);
            setStepIdx(0);
          }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [steps.length]);

      const currentStep = steps[stepIdx] || steps[0];

      // Handle Topic Select from Hub or Sidebar
      const selectTopic = (id) => {
        setCurrentTopicId(id);
        setBstCustomSteps(null);
        setIsHubOpen(false);
        setStepIdx(0);
      };

      // Interactive BST Handlers
      const handleBSTInsertNode = () => {
        const val = parseInt(bstInputVal, 10);
        if (isNaN(val)) return;

        const cloned = cloneBST(bstTree);
        function ins(node) {
          if (!node) return { id: `n-${val}`, val, x: 350, y: 50, depth: 0, left: null, right: null };
          if (val < node.val) {
            if (!node.left) node.left = { id: `n-${val}`, val, x: node.x - 50, y: node.y + 70, depth: node.depth + 1, left: null, right: null };
            else ins(node.left);
          } else if (val > node.val) {
            if (!node.right) node.right = { id: `n-${val}`, val, x: node.x + 50, y: node.y + 70, depth: node.depth + 1, left: null, right: null };
            else ins(node.right);
          }
          return node;
        }
        ins(cloned);
        const layout = flattenBST(cloned);

        const custom = [
          {
            stepIndex: 0, totalSteps: 2,
            state: { root: bstTree, allNodes: flattenBST(bstTree).nodes, edges: flattenBST(bstTree).edges },
            activeLine: 7, description: `Traversing BST to insert ${val}.`, subDescription: 'Comparing root to find insertion branch.',
            custom: { activeNodeId: null }
          },
          {
            stepIndex: 1, totalSteps: 2,
            state: { root: cloned, allNodes: layout.nodes, edges: layout.edges },
            activeLine: 11, description: `Successfully inserted node (${val}) into BST!`, subDescription: 'Left < Root < Right invariant maintained.',
            custom: { activeNodeId: `n-${val}`, highlightType: 'sorted' }
          }
        ];
        setBstTree(cloned);
        setBstCustomSteps(custom);
        setStepIdx(0);
      };

      const handleBSTSearchNode = () => {
        const val = parseInt(bstInputVal, 10);
        if (isNaN(val)) return;
        const searchSteps = generateBSTSearchSteps(bstTree, val);
        setBstCustomSteps(searchSteps);
        setStepIdx(0);
      };

      const handleBSTInOrder = () => {
        setBstCustomSteps(generateBSTInOrderSteps(bstTree));
        setStepIdx(0);
      };

      // Interactive Stack Handlers
      const handleStackPush = () => {
        const val = parseInt(stackInputVal, 10);
        if (isNaN(val)) return;
        const newStack = [...stackData, val];
        setStackData(newStack);
        setStepIdx(0);
      };

      const handleStackPop = () => {
        if (stackData.length === 0) return;
        const newStack = stackData.slice(0, -1);
        setStackData(newStack);
        setStepIdx(0);
      };

      const handleStackPeek = () => {
        // Just trigger steps that highlight the top item
        setStepIdx(Math.max(0, steps.length - 2));
      };

      // Interactive Queue Handlers
      const handleQueueEnqueue = () => {
        const val = parseInt(queueInputVal, 10);
        if (isNaN(val)) return;
        const newQueue = [...queueData, val];
        setQueueData(newQueue);
        setStepIdx(0);
      };

      const handleQueueDequeue = () => {
        if (queueData.length === 0) return;
        const newQueue = queueData.slice(1);
        setQueueData(newQueue);
        setStepIdx(0);
      };

      const handleQueueFront = () => {
        setStepIdx(0);
      };

      // Open Custom Input Modal with prefilled values
      const handleOpenCustomInputModal = () => {
        setModalArrInput(arrData.join(', '));
        setModalTargetInput(targetVal.toString());
        setModalPointersArrInput(pointersArr.join(', '));
        setModalPointersTargetInput(pointersTarget.toString());
        setModalWindowKInput(windowK.toString());
        setModalStackInput(stackData.join(', '));
        setModalQueueInput(queueData.join(', '));
        setModalDpNInput(dpN.toString());
        setIsCustomInputModalOpen(true);
      };

      // Apply Custom Input Modal
      const handleApplyCustomInputModal = () => {
        const stage = currentTopic.stageType;
        if (stage === 'sorting') {
          const parsed = modalArrInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
          if (parsed.length > 0) setArrData(parsed);
        } else if (stage === 'searching') {
          const parsed = modalArrInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
          const t = parseInt(modalTargetInput, 10);
          if (parsed.length > 0) setArrData(parsed);
          if (!isNaN(t)) setTargetVal(t);
        } else if (stage === 'pointers') {
          const parsed = modalPointersArrInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
          if (parsed.length > 0) setPointersArr(parsed);
          const pt = parseInt(modalPointersTargetInput, 10);
          if (!isNaN(pt)) setPointersTarget(pt);
          const wk = parseInt(modalWindowKInput, 10);
          if (!isNaN(wk)) setWindowK(Math.max(1, wk));
        } else if (stage === 'stack') {
          const parsed = modalStackInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
          if (parsed.length > 0) setStackData(parsed);
        } else if (stage === 'queue') {
          const parsed = modalQueueInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
          if (parsed.length > 0) setQueueData(parsed);
        } else if (stage === 'bst') {
          const parsed = modalBstInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
          if (parsed.length > 0) {
            const newTree = buildBSTFromValues(parsed);
            if (newTree) {
              setBstTree(newTree);
              setBstCustomSteps(null);
            }
          }
        } else if (stage === 'dp') {
          const n = parseInt(modalDpNInput, 10);
          if (!isNaN(n)) setDpN(Math.max(2, Math.min(12, n)));
        }
        setIsCustomInputModalOpen(false);
        setStepIdx(0);
      };

      // Filtered Topics for Hub
      const filteredHubTopics = useMemo(() => {
        return ALL_TOPICS.filter(t => {
          const matchCat = selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
          const matchQ = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
          return matchCat && matchQ;
        });
      }, [searchQuery, selectedCategoryFilter]);

      const pythonCode = CODE_LIBRARY[currentTopic.id] || CODE_LIBRARY['quick-sort'];
      const codeLines = pythonCode.split('\\n');

      return (
        <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans">
          
          {/* ===================================================================
              TOP NAVBAR
              =================================================================== */}
          <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between select-none z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(p => !p)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Toggle Sidebar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsHubOpen(true)}>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  Visual<span className="text-white">DSA</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Python Tracing Edition
                </span>
              </div>
            </div>

            {/* Current Active Topic Title & Quick Category Pill */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Current Domain:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                <span>{DSA_CATEGORIES.find(c => c.id === currentTopic.category)?.icon || '📚'}</span>
                <span>{DSA_CATEGORIES.find(c => c.id === currentTopic.category)?.name}</span>
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-bold text-sky-400">{currentTopic.title}</span>
            </div>

            {/* Actions: Topic Explorer Hub & Custom Input Modal Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenCustomInputModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/40 text-xs font-bold transition shadow-sm"
                title="Input Custom Data for Current Topic"
              >
                <span>✏️</span>
                <span>Custom Input</span>
              </button>

              <button
                onClick={() => setIsHubOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Explore All Topics</span>
              </button>
            </div>
          </header>

          {/* ===================================================================
              MAIN WORKSPACE: SIDEBAR + VISUAL STAGE + THEORY/CODE
              =================================================================== */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* COLLAPSIBLE SIDEBAR: TOPIC SELECTOR */}
            {sidebarOpen && (
              <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">DSA Curriculum</span>
                  <button
                    onClick={() => setIsHubOpen(true)}
                    className="text-[11px] font-semibold text-sky-400 hover:underline"
                  >
                    Catalog Hub ➔
                  </button>
                </div>

                {/* Categorized List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                  {DSA_CATEGORIES.map(category => {
                    const catTopics = ALL_TOPICS.filter(t => t.category === category.id);
                    if (catTopics.length === 0) return null;

                    return (
                      <div key={category.id} className="space-y-1">
                        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">({catTopics.length})</span>
                        </div>

                        <div className="space-y-0.5">
                          {catTopics.map(topic => {
                            const isCurrent = topic.id === currentTopicId;
                            return (
                              <button
                                key={topic.id}
                                onClick={() => selectTopic(topic.id)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                                  isCurrent
                                    ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                              >
                                <span className="truncate">{topic.title}</span>
                                {topic.difficulty && (
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                    topic.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-950/60' :
                                    topic.difficulty === 'Medium' ? 'text-amber-400 bg-amber-950/60' :
                                    'text-rose-400 bg-rose-950/60'
                                  }`}>
                                    {topic.difficulty}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </aside>
            )}

            {/* VISUALIZATION STAGE (CENTER) */}
            <main className="flex-1 flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden relative p-4">
              
              {/* Stage Type 1: Sorting Bars */}
              {currentTopic.stageType === 'sorting' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white uppercase">{currentTopic.title} Stage</span>
                      <span className="text-amber-400">■ Comparing</span>
                      <span className="text-rose-500">■ Swapping</span>
                      <span className="text-sky-400">■ Pivot</span>
                      <span className="text-emerald-400">■ Sorted</span>
                    </div>
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                    >
                      ✏️ Edit Array
                    </button>
                  </div>

                  {/* Animated Gliding Bars Stage */}
                  <div className="flex-1 w-full relative min-h-[260px] my-2 overflow-hidden px-4">
                    {(() => {
                      const displayArray = (currentStep && Array.isArray(currentStep.state)) ? currentStep.state : arrData;
                      const total = displayArray.length;
                      const maxVal = Math.max(...displayArray.map(x => typeof x === 'object' && x !== null ? x.val : x), 100);
                      const pointers = currentStep?.pointers || {};

                      return (
                        <div className="w-full h-full relative">
                          {/* 1. Anchored Pointers above each slot */}
                          <div className="w-full h-8 absolute top-0 left-0 right-0 pointer-events-none z-30">
                            {Array.from({ length: total }, (_, slotIdx) => {
                              const tagList = [];
                              if (pointers.pivot === slotIdx) tagList.push('pivot');
                              if (pointers.i === slotIdx) tagList.push('i');
                              if (pointers.j === slotIdx) tagList.push('j');
                              if (pointers.min === slotIdx) tagList.push('min');
                              if (pointers.k === slotIdx) tagList.push('k');
                              if (tagList.length === 0) return null;

                              return (
                                <div
                                  key={slotIdx}
                                  style={{
                                    position: 'absolute',
                                    left: `${(slotIdx / total) * 100}%`,
                                    width: `${100 / total}%`,
                                    top: 0
                                  }}
                                  className="flex flex-col items-center justify-start pointer-events-none"
                                >
                                  <div className="flex gap-0.5">
                                    {tagList.map(t => (
                                      <span key={t} className={`text-[10px] font-mono font-extrabold px-1 rounded shadow ${
                                        t === 'pivot' ? 'bg-sky-400 text-slate-950' : t === 'min' ? 'bg-purple-500 text-white' : 'bg-amber-400 text-slate-950'
                                      }`}>
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-amber-400" />
                                </div>
                              );
                            })}
                          </div>

                          {/* 2. Gliding Bars using persistent keys and left positioning */}
                          {displayArray.map((item, slotIdx) => {
                            const val = typeof item === 'object' && item !== null ? item.val : item;
                            const itemId = typeof item === 'object' && item !== null ? item.id : `bar-${slotIdx}-${val}`;
                            const heightPercent = Math.max((val / maxVal) * 78, 14);

                            const isComparing = currentStep?.highlights?.comparing?.includes(slotIdx);
                            const isSwapping = currentStep?.highlights?.swapping?.includes(slotIdx);
                            const isSorted = currentStep?.highlights?.sorted?.includes(slotIdx);
                            const isPivot = pointers.pivot === slotIdx;

                            let bg = 'bg-slate-700/80 border-slate-600 text-slate-200';
                            if (isSwapping) bg = 'bg-rose-500 border-rose-300 text-rose-100 shadow-[0_0_22px_rgba(244,63,94,0.8)]';
                            else if (isComparing) bg = 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_16px_rgba(251,191,36,0.6)]';
                            else if (isPivot) bg = 'bg-sky-400 border-sky-300 text-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.6)]';
                            else if (isSorted) bg = 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]';

                            const slotPercent = 100 / total;

                            return (
                              <div
                                key={itemId}
                                style={{
                                  position: 'absolute',
                                  left: `calc(${slotIdx * slotPercent}% + 3px)`,
                                  width: `calc(${slotPercent}% - 6px)`,
                                  bottom: '26px',
                                  height: `${heightPercent}%`,
                                  transform: isSwapping ? 'translateY(-14px) scale(1.04)' : 'translateY(0) scale(1)',
                                  transition: 'left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.45s ease, height 0.3s ease, background-color 0.25s ease, box-shadow 0.25s ease',
                                  zIndex: isSwapping ? 25 : isPivot ? 15 : 5
                                }}
                                className={`rounded-t-lg border flex flex-col items-center justify-start pt-1.5 font-mono text-xs font-bold algo-bar select-none ${bg}`}
                              >
                                <span>{val}</span>
                              </div>
                            );
                          })}

                          {/* 3. Fixed Slot indices [0]..[N-1] */}
                          <div className="w-full flex items-center absolute bottom-0 left-0 right-0 pointer-events-none">
                            {Array.from({ length: total }, (_, i) => (
                              <div key={i} style={{ width: `${100 / total}%` }} className="text-center text-[10px] font-mono text-slate-500">
                                [{i}]
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Stage Type 2: Searching Interval Boxes (Enhanced with complete pointer badges & glowing highlights) */}
              {currentTopic.stageType === 'searching' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                      <span className="font-bold text-white uppercase">{currentTopic.title} Stage</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        Target = {targetVal}
                      </span>
                      <span className="text-slate-400">
                        Comparisons: <span className="font-bold text-sky-400">{currentStep?.metrics?.comparisons ?? 0}</span>
                      </span>
                      <button
                        onClick={handleOpenCustomInputModal}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                      >
                        ✏️ Custom Input
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-6 py-6">
                    <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl px-4">
                      {(((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : arrData)).map((val, idx) => {
                        const pointers = currentStep?.pointers || {};
                        const isI = pointers.i === idx;
                        const isLow = pointers.low === idx;
                        const isMid = pointers.mid === idx;
                        const isMid1 = pointers.mid1 === idx;
                        const isMid2 = pointers.mid2 === idx;
                        const isHigh = pointers.high === idx;
                        const isPrev = pointers.prev === idx;
                        const isCurr = pointers.curr === idx;

                        const isComparing = currentStep?.highlights?.comparing?.includes(idx);
                        const isSorted = currentStep?.highlights?.sorted?.includes(idx);
                        const isActive = currentStep?.highlights?.active?.includes(idx);
                        const isDimmed = currentStep?.highlights?.dimmed?.includes(idx);

                        let border = 'border-slate-700', bg = 'bg-slate-800', text = 'text-slate-200', transform = '', ring = '';
                        if (isSorted) {
                          border = 'border-emerald-400';
                          bg = 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/40';
                          text = 'text-slate-950';
                          transform = 'scale-110';
                          ring = 'ring-2 ring-emerald-300';
                        } else if (isComparing) {
                          border = 'border-amber-400';
                          bg = 'bg-amber-500/25 text-amber-200 font-bold shadow-lg shadow-amber-500/20';
                          text = 'text-amber-200';
                          transform = 'scale-105';
                          ring = 'ring-2 ring-amber-400/60';
                        } else if (isMid || isMid1 || isMid2) {
                          border = 'border-sky-400';
                          bg = 'bg-sky-500/25 text-sky-200 font-bold shadow-lg shadow-sky-500/20';
                          text = 'text-sky-200';
                          transform = 'scale-105';
                          ring = 'ring-2 ring-sky-400/60';
                        } else if (isActive) {
                          border = 'border-indigo-400';
                          bg = 'bg-indigo-600/30 text-indigo-200 font-bold';
                          text = 'text-indigo-200';
                        } else if (isDimmed) {
                          border = 'border-slate-800';
                          bg = 'bg-slate-900/40 text-slate-600 line-through opacity-40';
                          text = 'text-slate-600';
                        }

                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5 transition-all duration-300">
                            {/* Pointer Badges Stack */}
                            <div className="h-6 flex items-center justify-center gap-1 font-mono text-[10px] font-bold">
                              {isI && <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow">i</span>}
                              {isLow && <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white shadow">low</span>}
                              {isMid && <span className="px-1.5 py-0.5 rounded bg-sky-400 text-slate-950 shadow">mid</span>}
                              {isMid1 && <span className="px-1.5 py-0.5 rounded bg-teal-400 text-slate-950 shadow">mid1</span>}
                              {isMid2 && <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 shadow">mid2</span>}
                              {isHigh && <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white shadow">high</span>}
                              {isPrev && <span className="px-1.5 py-0.5 rounded bg-violet-500 text-white shadow">prev</span>}
                              {isCurr && <span className="px-1.5 py-0.5 rounded bg-fuchsia-500 text-white shadow">curr</span>}
                            </div>

                            {/* Element Box */}
                            <div className={`w-14 h-16 rounded-xl border flex flex-col items-center justify-center font-mono text-base shadow transition-all duration-300 ${border} ${bg} ${text} ${transform} ${ring}`}>
                              <span>{val}</span>
                            </div>

                            {/* Index Number */}
                            <span className="text-[10px] font-mono text-slate-500 font-semibold">[{idx}]</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Target Status Banner */}
                    <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono">
                      <span className="text-slate-400">Search Target:</span>
                      <span className="font-bold text-amber-400">{targetVal}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-400">Status:</span>
                      {currentStep?.highlights?.sorted?.length > 0 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          ✓ Found at index {currentStep.highlights.sorted[0]}!
                        </span>
                      ) : currentStep?.highlights?.dimmed?.length >= arrData.length ? (
                        <span className="text-rose-400 font-bold">✗ Not Found in Array</span>
                      ) : (
                        <span className="text-sky-300">Searching active interval...</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Stage Type 3: Two Pointers & Sliding Window (Dedicated Domain) */}
              {currentTopic.stageType === 'pointers' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      <span className="font-bold text-white uppercase tracking-wider">{currentTopic.title}</span>
                    </div>
                    {currentTopic.id === 'two-pointers' ? (
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                          Target Sum = {pointersTarget}
                        </span>
                        {currentStep?.custom?.sum !== undefined && (
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-mono border border-slate-700">
                            Current Sum: <span className="font-bold text-amber-400">{currentStep.custom.sum}</span>
                          </span>
                        )}
                        <button
                          onClick={handleOpenCustomInputModal}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                        >
                          ✏️ Custom Data
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                          Window Size K = {windowK}
                        </span>
                        {currentStep?.custom?.windowSum !== undefined && (
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-mono border border-slate-700">
                            Window Sum: <span className="font-bold text-sky-400">{currentStep.custom.windowSum}</span>
                          </span>
                        )}
                        {currentStep?.custom?.maxSum !== undefined && (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            Max Sum = {currentStep.custom.maxSum}
                          </span>
                        )}
                        <button
                          onClick={handleOpenCustomInputModal}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                        >
                          ✏️ Custom Data
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Center Interactive Visualization Canvas */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 py-6">
                    
                    {/* Two Pointers HUD Card */}
                    {currentTopic.id === 'two-pointers' && (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-6 shadow-xl">
                        <div className="flex items-center gap-3 font-mono">
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-indigo-400 font-bold uppercase">Left (arr[L])</span>
                            <span className="text-xl font-bold text-indigo-300">
                              {currentStep?.pointers?.left !== undefined && currentStep.state ? currentStep.state[currentStep.pointers.left] : '-'}
                            </span>
                          </div>
                          <span className="text-lg text-slate-500 font-bold">+</span>
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-rose-400 font-bold uppercase">Right (arr[R])</span>
                            <span className="text-xl font-bold text-rose-300">
                              {currentStep?.pointers?.right !== undefined && currentStep.state ? currentStep.state[currentStep.pointers.right] : '-'}
                            </span>
                          </div>
                          <span className="text-lg text-slate-500 font-bold">=</span>
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-amber-400 font-bold uppercase">Sum</span>
                            <span className="text-2xl font-black text-amber-400">
                              {currentStep?.custom?.sum ?? '-'}
                            </span>
                          </div>
                        </div>

                        <div className="h-10 w-[1px] bg-slate-800"></div>

                        <div className="flex flex-col text-xs font-mono">
                          <span className="text-slate-400">Target Comparison:</span>
                          {currentStep?.custom?.sum !== undefined && (
                            currentStep.custom.sum === pointersTarget ? (
                              <span className="text-emerald-400 font-bold text-sm">🎉 Sum == Target ({pointersTarget})! MATCH!</span>
                            ) : currentStep.custom.sum < pointersTarget ? (
                              <span className="text-indigo-400 font-bold">Sum &lt; Target ({pointersTarget}) ➔ Increment Left (L++)</span>
                            ) : (
                              <span className="text-rose-400 font-bold">Sum &gt; Target ({pointersTarget}) ➔ Decrement Right (R--)</span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sliding Window HUD Card */}
                    {currentTopic.id === 'sliding-window' && (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-6 shadow-xl font-mono text-xs">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Active Window</span>
                            <span className="text-base font-bold text-sky-400">
                              {currentStep?.custom?.windowRange ? `[${currentStep.custom.windowRange[0]} .. ${currentStep.custom.windowRange[1]}]` : '-'}
                            </span>
                          </div>
                          <div className="h-8 w-[1px] bg-slate-800"></div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Window Sum</span>
                            <span className="text-xl font-bold text-sky-300">
                              {currentStep?.custom?.windowSum ?? '-'}
                            </span>
                          </div>
                          <div className="h-8 w-[1px] bg-slate-800"></div>
                          <div>
                            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Running Max Sum</span>
                            <span className="text-2xl font-black text-emerald-400">
                              {currentStep?.custom?.maxSum ?? '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Array Elements Display */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl px-4">
                      {(((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : pointersArr)).map((val, idx) => {
                        const pointers = currentStep?.pointers || {};
                        const isLeft = pointers.left === idx;
                        const isRight = pointers.right === idx;
                        const isWindowElem = currentStep?.highlights?.active?.includes(idx);
                        const isSorted = currentStep?.highlights?.sorted?.includes(idx);

                        let border = 'border-slate-700', bg = 'bg-slate-800', text = 'text-slate-200', transform = '', ring = '';
                        if (isSorted) {
                          border = 'border-emerald-400';
                          bg = 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/40';
                          text = 'text-slate-950';
                          transform = 'scale-110';
                          ring = 'ring-2 ring-emerald-300';
                        } else if (isLeft) {
                          border = 'border-indigo-400';
                          bg = 'bg-indigo-600/30 text-indigo-200 font-bold';
                          text = 'text-indigo-200';
                          transform = 'scale-105';
                          ring = 'ring-2 ring-indigo-400/60';
                        } else if (isRight) {
                          border = 'border-rose-400';
                          bg = 'bg-rose-600/30 text-rose-200 font-bold';
                          text = 'text-rose-200';
                          transform = 'scale-105';
                          ring = 'ring-2 ring-rose-400/60';
                        } else if (isWindowElem) {
                          border = 'border-sky-400';
                          bg = 'bg-sky-500/20 text-sky-200 font-semibold';
                          text = 'text-sky-200';
                          ring = 'ring-1 ring-sky-400/40';
                        }

                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5 transition-all duration-300">
                            <div className="h-6 flex items-center justify-center gap-1 font-mono text-[10px] font-bold">
                              {isLeft && <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white shadow">L (left)</span>}
                              {isRight && <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white shadow">R (right)</span>}
                              {isWindowElem && !isLeft && !isRight && currentTopic.id === 'sliding-window' && (
                                <span className="px-1 py-0.5 rounded bg-sky-500/30 text-sky-300 text-[9px]">win</span>
                              )}
                            </div>

                            <div className={`w-14 h-16 rounded-xl border flex flex-col items-center justify-center font-mono text-base shadow transition-all duration-300 ${border} ${bg} ${text} ${transform} ${ring}`}>
                              <span>{val}</span>
                            </div>

                            <span className="text-[10px] font-mono text-slate-500 font-semibold">[{idx}]</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Stage Type 4: BST Tree Canvas */}
              {currentTopic.stageType === 'bst' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="font-bold text-white uppercase">Binary Search Tree Interactive Stage</span>
                    <div className="flex items-center gap-3">
                      <span>Nodes: {flattenBST(bstTree).nodes.length}</span>
                      <button
                        onClick={handleOpenCustomInputModal}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                      >
                        ✏️ Custom Tree
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center relative">
                    <svg viewBox="0 0 700 320" className="w-full h-full max-h-[340px]">
                      {flattenBST(bstTree).edges.map(e => (
                        <g key={e.from + e.to}>
                          <line x1={e.fromN.x} y1={e.fromN.y} x2={e.toN.x} y2={e.toN.y} stroke="#334155" strokeWidth="2" />
                          <text x={(e.fromN.x + e.toN.x)/2 + (e.dir === 'L' ? -10 : 10)} y={(e.fromN.y + e.toN.y)/2} fill="#64748b" fontSize="10" fontFamily="monospace">
                            {e.dir}
                          </text>
                        </g>
                      ))}

                      {flattenBST(bstTree).nodes.map(n => {
                        const isActive = currentStep?.custom?.activeNodeId === n.id;
                        const isSorted = currentStep?.custom?.highlightType === 'sorted' && isActive;
                        const isComp = currentStep?.custom?.highlightType === 'comparing' && isActive;

                        let fill = '#1e293b', stroke = '#475569', text = '#e2e8f0';
                        if (isSorted) { fill = '#10b981'; stroke = '#34d399'; text = '#020617'; }
                        else if (isComp) { fill = '#f59e0b'; stroke = '#fbbf24'; text = '#020617'; }
                        else if (isActive) { fill = '#0284c7'; stroke = '#38bdf8'; text = '#ffffff'; }

                        return (
                          <g key={n.id}>
                            <circle cx={n.x} cy={n.y} r="20" fill={fill} stroke={stroke} strokeWidth={isActive ? '3' : '2'} className="tree-node-circle" />
                            <text x={n.x} y={n.y + 4.5} textAnchor="middle" fill={text} fontSize="12" fontWeight="bold" fontFamily="monospace">
                              {n.val}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {currentStep?.state?.output && (
                    <div className="p-2 rounded bg-slate-900 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono">
                      <span className="text-emerald-400 font-bold">In-Order Result:</span>
                      <span className="text-emerald-200">[{currentStep.state.output.join(', ')}]</span>
                    </div>
                  )}
                </div>
              )}

              {/* Stage Type 5: Stack LIFO Canvas */}
              {currentTopic.stageType === 'stack' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="font-bold text-white uppercase">LIFO Call Stack Visualization</span>
                    <div className="flex items-center gap-3">
                      <span>Top of Stack ➔</span>
                      <button
                        onClick={handleOpenCustomInputModal}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                      >
                        ✏️ Custom Stack
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-end pb-8">
                    <div className="w-52 border-b-4 border-l-4 border-r-4 border-slate-700 rounded-b-2xl p-3 flex flex-col-reverse gap-2 bg-slate-900/60 min-h-[220px]">
                      {((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : stackData).map((val, idx, arr) => (
                        <div
                          key={idx}
                          className="w-full py-2.5 rounded-lg bg-indigo-600/30 border border-indigo-400 text-indigo-200 font-mono text-sm font-bold text-center shadow transition-all duration-300"
                        >
                          {val} {idx === arr.length - 1 ? '◀ (TOP)' : ''}
                        </div>
                      ))}
                      {((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : stackData).length === 0 && (
                        <div className="text-xs text-slate-500 text-center py-6 font-mono">[ Empty Stack ]</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Stage Type 6: Queue FIFO Canvas */}
              {currentTopic.stageType === 'queue' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="font-bold text-white uppercase">FIFO Buffer Stream</span>
                    <div className="flex items-center gap-3">
                      <span>Front ➔ Rear</span>
                      <button
                        onClick={handleOpenCustomInputModal}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                      >
                        ✏️ Custom Queue
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center border-t-2 border-b-2 border-slate-700 py-4 px-6 gap-3 bg-slate-900/40 rounded-xl">
                      <span className="text-xs font-mono text-emerald-400 font-bold">FRONT ➔</span>
                      {((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : queueData).map((val, idx) => (
                        <div
                          key={idx}
                          className="w-14 h-14 rounded-xl bg-sky-600/30 border border-sky-400 text-sky-200 font-mono text-sm font-bold flex items-center justify-center shadow transition-all duration-300"
                        >
                          {val}
                        </div>
                      ))}
                      {((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : queueData).length === 0 && (
                        <div className="text-xs text-slate-500 font-mono px-4">[ Empty Queue ]</div>
                      )}
                      <span className="text-xs font-mono text-amber-400 font-bold">➔ REAR</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage Type 7: Graph Canvas (BFS & DFS) */}
              {currentTopic.stageType === 'graph' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="font-bold text-white uppercase">Graph Connectivity & Shortest Path Canvas</span>
                    <div className="flex items-center gap-3">
                      <span>Visited: [{(currentStep?.state?.visited || []).join(' ➔ ')}]</span>
                      <button
                        onClick={handleOpenCustomInputModal}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                      >
                        ✏️ Start Node
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <svg viewBox="0 0 700 300" className="w-full h-full max-h-[320px]">
                      {(currentStep?.state?.edges || []).map((e, idx) => {
                        const n1 = (currentStep?.state?.nodes || []).find(n => n.id === e.u);
                        const n2 = (currentStep?.state?.nodes || []).find(n => n.id === e.v);
                        if (!n1 || !n2) return null;
                        return (
                          <g key={idx}>
                            <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke="#334155" strokeWidth="2" />
                            <text x={(n1.x+n2.x)/2} y={(n1.y+n2.y)/2 - 5} fill="#94a3b8" fontSize="11" fontFamily="monospace">
                              {e.w}
                            </text>
                          </g>
                        );
                      })}

                      {(currentStep?.state?.nodes || []).map(n => {
                        const isVisited = (currentStep?.state?.visited || []).includes(n.id);
                        const isActive = currentStep?.custom?.activeNode === n.id;
                        let fill = '#1e293b', stroke = '#475569';
                        if (isActive) { fill = '#f59e0b'; stroke = '#fbbf24'; }
                        else if (isVisited) { fill = '#10b981'; stroke = '#34d399'; }

                        return (
                          <g key={n.id}>
                            <circle cx={n.x} cy={n.y} r="20" fill={fill} stroke={stroke} strokeWidth="2" />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                              {n.id}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              )}

              {/* Stage Type 8: Dynamic Programming Table */}
              {currentTopic.stageType === 'dp' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="font-bold text-white uppercase">Dynamic Programming Memoization Table</span>
                    <div className="flex items-center gap-3">
                      <span>N = {dpN}</span>
                      <button
                        onClick={handleOpenCustomInputModal}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                      >
                        ✏️ Custom N
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
                      {((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : []).map((val, idx) => {
                        const isActive = currentStep?.custom?.activeIdx === idx;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-mono text-slate-500">dp[{idx}]</span>
                            <div className={`w-14 h-14 rounded-xl border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                              isActive ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-lg shadow-amber-500/30' : 'bg-slate-800 border-slate-700 text-slate-200'
                            }`}>
                              {val}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Stage Type 9: Greedy Intervals */}
              {currentTopic.stageType === 'greedy' && (
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="font-bold text-white uppercase">Greedy Non-Overlapping Timeline</span>
                    <div className="flex items-center gap-3">
                      <span>Selected: {(currentStep?.state?.selected || []).length}</span>
                      <button
                        onClick={handleOpenCustomInputModal}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-[11px] font-semibold"
                      >
                        ✏️ Intervals Preset
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-2.5">
                    {(currentStep?.state?.intervals || []).map(act => {
                      const isSel = (currentStep?.state?.selected || []).some(s => s.id === act.id);
                      return (
                        <div
                          key={act.id}
                          className={`w-80 px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center justify-between border transition-all duration-300 ${
                            isSel ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20' : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          <span>{act.label}</span>
                          <span>{isSel ? '✓ SELECTED' : 'CONFLICT'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </main>

            {/* RIGHT PANEL (THEORY, SYNCHRONIZED CODE TRACING, COMPLEXITY) */}
            <aside className="w-80 lg:w-96 bg-slate-900/60 overflow-y-auto p-3.5 space-y-3.5 shrink-0">
              
              {/* Pedagogical Step Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>Pedagogical Step Breakdown</span>
                  <span className="text-sky-400 font-mono">Step {stepIdx + 1}/{steps.length}</span>
                </div>
                <p className="text-xs font-semibold text-slate-100 leading-snug">
                  {currentStep?.description}
                </p>
                {currentStep?.subDescription && (
                  <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                    {currentStep.subDescription}
                  </p>
                )}
              </div>

              {/* Complexity Meter */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                <span className="text-xs font-bold uppercase text-slate-400 block">Complexity Meter</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Best Time</span>
                    <span className="text-emerald-400 font-bold">{currentTopic.complexity.best}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Worst Time</span>
                    <span className="text-rose-400 font-bold">{currentTopic.complexity.worst}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Space</span>
                    <span className="text-purple-400 font-bold">{currentTopic.complexity.space}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Stability</span>
                    <span className="text-sky-400 font-bold">{currentTopic.complexity.stability || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Synchronized Code Tracing */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-72">
                <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs font-mono">
                  <span className="text-sky-400 font-bold">Python Synchronized Code</span>
                  <span className="text-[10px] text-slate-400">Line: {currentStep?.activeLine || 1}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-5">
                  {codeLines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isActive = lineNum === currentStep?.activeLine;
                    return (
                      <div
                        key={lineNum}
                        className={`flex items-start px-2 py-0.5 rounded ${isActive ? 'active-code-line text-sky-200 font-semibold' : 'text-slate-300'}`}
                      >
                        <span className="w-6 shrink-0 text-slate-600 select-none text-[10px]">{lineNum}</span>
                        <pre className="overflow-x-auto whitespace-pre"><code>{line || ' '}</code></pre>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Python Tip */}
              <div className="bg-sky-950/40 border border-sky-500/20 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                <span className="text-[11px] uppercase font-bold text-sky-400 block">Python Trainer Tip:</span>
                <p className="font-mono text-[11px] text-slate-300">{currentTopic.pythonTip}</p>
              </div>
            </aside>
          </div>

          {/* ===================================================================
              GLOBAL BOTTOM DOCKED PLAYBACK CONTROLLER & CONTEXTUAL INPUTS
              =================================================================== */}
          <footer className="bg-slate-900 border-t border-slate-800 p-3 flex flex-col gap-2 select-none z-20">
            {/* Timeline Progress Scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 w-12 text-right">
                {stepIdx + 1}/{steps.length}
              </span>
              <input
                type="range"
                min="0"
                max={Math.max(0, steps.length - 1)}
                value={stepIdx}
                onChange={e => { setIsPlaying(false); setStepIdx(parseInt(e.target.value, 10)); }}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Contextual Input Controls For Every Topic Domain */}
              <div className="flex items-center gap-2">
                
                {/* Searching Contextual Controls */}
                {currentTopic.stageType === 'searching' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Target:</span>
                    <input
                      type="number"
                      value={targetVal}
                      onChange={e => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setTargetVal(val);
                      }}
                      className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-center text-amber-400 font-bold"
                    />
                    <button
                      onClick={() => {
                        const r = [];
                        while (r.length < 10) {
                          const v = Math.floor(Math.random() * 85) + 12;
                          if (!r.includes(v)) r.push(v);
                        }
                        setArrData(r);
                        setTargetVal(r[4]);
                        setStepIdx(0);
                      }}
                      className="px-2 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                    >
                      Randomize
                    </button>
                    <button
                      onClick={() => {
                        const sorted = [12, 18, 24, 32, 39, 45, 67, 71, 85, 89];
                        setArrData(sorted);
                        setTargetVal(39);
                        setStepIdx(0);
                      }}
                      className="px-2 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                    >
                      Sorted
                    </button>
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded flex items-center gap-1"
                    >
                      ✏️ Custom Data
                    </button>
                  </div>
                )}

                {/* Two Pointers & Window Contextual Controls */}
                {currentTopic.stageType === 'pointers' && (
                  <div className="flex items-center gap-2">
                    {currentTopic.id === 'two-pointers' ? (
                      <>
                        <span className="text-xs font-mono text-slate-400">Target Sum:</span>
                        <input
                          type="number"
                          value={pointersTarget}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) setPointersTarget(val);
                          }}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-center text-indigo-400 font-bold"
                        />
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-mono text-slate-400">Window K:</span>
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={windowK}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) setWindowK(Math.max(1, Math.min(8, val)));
                          }}
                          className="w-14 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-center text-sky-400 font-bold"
                        />
                      </>
                    )}
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded flex items-center gap-1"
                    >
                      ✏️ Custom Data
                    </button>
                  </div>
                )}

                {/* Sorting Contextual Controls */}
                {currentTopic.stageType === 'sorting' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const r = [];
                        while (r.length < 10) {
                          const v = Math.floor(Math.random() * 85) + 12;
                          if (!r.includes(v)) r.push(v);
                        }
                        setArrData(r);
                        setStepIdx(0);
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                    >
                      Randomize
                    </button>
                    <button
                      onClick={() => { setArrData([10, 20, 30, 40, 50, 60, 70, 80, 90]); setStepIdx(0); }}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                    >
                      Sorted
                    </button>
                    <button
                      onClick={() => { setArrData([90, 80, 70, 60, 50, 40, 30, 20, 10]); setStepIdx(0); }}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                    >
                      Reversed
                    </button>
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded-lg flex items-center gap-1"
                    >
                      ✏️ Custom Array
                    </button>
                  </div>
                )}

                {/* BST Contextual Controls */}
                {currentTopic.stageType === 'bst' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={bstInputVal}
                      onChange={e => setBstInputVal(e.target.value)}
                      className="w-14 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-center font-mono"
                    />
                    <button
                      onClick={handleBSTInsertNode}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                    >
                      + Insert
                    </button>
                    <button
                      onClick={handleBSTSearchNode}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded"
                    >
                      🔍 Search
                    </button>
                    <button
                      onClick={handleBSTInOrder}
                      className="px-2.5 py-1 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded"
                    >
                      In-Order
                    </button>
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded"
                    >
                      ✏️ Custom Tree
                    </button>
                  </div>
                )}

                {/* Stack Contextual Controls */}
                {currentTopic.stageType === 'stack' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={stackInputVal}
                      onChange={e => setStackInputVal(e.target.value)}
                      placeholder="Val"
                      className="w-14 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-center font-mono"
                    />
                    <button
                      onClick={handleStackPush}
                      className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                    >
                      + Push
                    </button>
                    <button
                      onClick={handleStackPop}
                      className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded"
                    >
                      - Pop
                    </button>
                    <button
                      onClick={handleStackPeek}
                      className="px-2 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                    >
                      Peek
                    </button>
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded"
                    >
                      ✏️ Custom Stack
                    </button>
                  </div>
                )}

                {/* Queue Contextual Controls */}
                {currentTopic.stageType === 'queue' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={queueInputVal}
                      onChange={e => setQueueInputVal(e.target.value)}
                      placeholder="Val"
                      className="w-14 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-center font-mono"
                    />
                    <button
                      onClick={handleQueueEnqueue}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                    >
                      + Enqueue
                    </button>
                    <button
                      onClick={handleQueueDequeue}
                      className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded"
                    >
                      - Dequeue
                    </button>
                    <button
                      onClick={handleQueueFront}
                      className="px-2 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                    >
                      Front
                    </button>
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded"
                    >
                      ✏️ Custom Queue
                    </button>
                  </div>
                )}

                {/* Graph Contextual Controls */}
                {currentTopic.stageType === 'graph' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Start:</span>
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(n => (
                      <button
                        key={n}
                        onClick={() => { setGraphStartNode(n); setStepIdx(0); }}
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                          graphStartNode === n ? 'bg-sky-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded ml-2"
                    >
                      ✏️ Custom Graph
                    </button>
                  </div>
                )}

                {/* DP Contextual Controls */}
                {currentTopic.stageType === 'dp' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Fibonacci N:</span>
                    <input
                      type="number"
                      min="2"
                      max="12"
                      value={dpN}
                      onChange={e => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setDpN(Math.max(2, Math.min(12, val)));
                      }}
                      className="w-14 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-center text-amber-400 font-bold"
                    />
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded"
                    >
                      ✏️ Custom DP
                    </button>
                  </div>
                )}

                {/* Greedy Contextual Controls */}
                {currentTopic.stageType === 'greedy' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Preset:</span>
                    <button
                      onClick={() => { setGreedyPreset('standard'); setStepIdx(0); }}
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        greedyPreset === 'standard' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => { setGreedyPreset('dense'); setStepIdx(0); }}
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        greedyPreset === 'dense' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Dense
                    </button>
                    <button
                      onClick={handleOpenCustomInputModal}
                      className="px-2.5 py-1 text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded"
                    >
                      ✏️ Custom Intervals
                    </button>
                  </div>
                )}

              </div>

              {/* Main Playback Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsPlaying(false); setStepIdx(0); }}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
                  title="Reset (R)"
                >
                  ⏮ Reset
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setStepIdx(p => Math.max(0, p - 1)); }}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
                  title="Step Backward (←)"
                >
                  ◀ Step
                </button>
                <button
                  onClick={() => setIsPlaying(p => !p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                    isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-sky-500 text-slate-950'
                  }`}
                  title="Play / Pause (Space)"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setStepIdx(p => Math.min(steps.length - 1, p + 1)); }}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
                  title="Step Forward (→)"
                >
                  Step ▶
                </button>
              </div>

              {/* Speed Multiplier Buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-[10px]">
                <span className="text-slate-500 px-1">Speed:</span>
                {[0.5, 1, 1.5, 2].map(s => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-1.5 py-0.5 rounded ${speed === s ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </footer>

          {/* ===================================================================
              FULL SCREEN TOPIC CATALOG EXPLORER (HUB MODAL)
              =================================================================== */}
          {isHubOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col p-4 md:p-8 animate-in fade-in duration-200">
              <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Hub Header */}
                <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                      <span>VisualDSA Interactive Learning Hub</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      Select any Data Structure or Algorithm to trace line-by-line in Python
                    </p>
                  </div>
                  <button
                    onClick={() => setIsHubOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-4 border-b border-slate-800 flex flex-wrap items-center gap-3 bg-slate-950/50">
                  <div className="flex-1 min-w-[240px]">
                    <input
                      type="text"
                      placeholder="Search algorithm, topic, or LeetCode #..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    <button
                      onClick={() => setSelectedCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedCategoryFilter === 'all'
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      All Domains
                    </button>
                    {DSA_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 whitespace-nowrap transition ${
                          selectedCategoryFilter === cat.id
                            ? 'bg-sky-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Cards Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHubTopics.map(topic => {
                    const isCurrent = topic.id === currentTopicId;
                    return (
                      <div
                        key={topic.id}
                        onClick={() => selectTopic(topic.id)}
                        className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-sky-950/40 border-sky-400 ring-2 ring-sky-400/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {DSA_CATEGORIES.find(c => c.id === topic.category)?.name}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              topic.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              topic.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}>
                              {topic.difficulty}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition">
                            {topic.title}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-2">
                            {topic.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>Worst: <strong className="text-slate-200">{topic.complexity.worst}</strong></span>
                          <span className="text-sky-400 font-semibold group-hover:underline">Launch Visualizer ➔</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}

          {/* ===================================================================
              UNIVERSAL CUSTOM INPUT MODAL (CUSTOM USER DATA FOR EVERY SECTION)
              =================================================================== */}
          {isCustomInputModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 flex flex-col gap-4 text-slate-100">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{DSA_CATEGORIES.find(c => c.id === currentTopic.category)?.icon || '✏️'}</span>
                    <div>
                      <h3 className="text-base font-bold text-white">Custom User Input</h3>
                      <p className="text-xs text-slate-400 font-mono">Domain: {currentTopic.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCustomInputModalOpen(false)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Form Fields Tailored to Active Topic Stage */}
                <div className="space-y-4 py-2 text-xs font-mono">
                  
                  {/* Sorting Input Fields */}
                  {currentTopic.stageType === 'sorting' && (
                    <div className="space-y-2">
                      <label className="text-slate-300 block font-bold">
                        Array Elements (comma-separated numbers):
                      </label>
                      <input
                        type="text"
                        value={modalArrInput}
                        onChange={e => setModalArrInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-sky-300 font-mono focus:outline-none focus:border-sky-500"
                        placeholder="e.g. 45, 12, 85, 32, 89, 39, 67, 24, 71, 18"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-500 self-center">Presets:</span>
                        <button
                          onClick={() => setModalArrInput('10, 20, 30, 40, 50, 60, 70, 80')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                        >
                          Already Sorted
                        </button>
                        <button
                          onClick={() => setModalArrInput('80, 70, 60, 50, 40, 30, 20, 10')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                        >
                          Reversed
                        </button>
                        <button
                          onClick={() => setModalArrInput('5, 2, 8, 2, 5, 1, 9, 8')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                        >
                          Duplicates
                        </button>
                        <button
                          onClick={() => setModalArrInput('10, 20, 40, 30, 50, 60, 80, 70')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                        >
                          Nearly Sorted
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Searching Input Fields */}
                  {currentTopic.stageType === 'searching' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-300 block font-bold mb-1">
                          Array Elements (comma-separated):
                        </label>
                        <input
                          type="text"
                          value={modalArrInput}
                          onChange={e => setModalArrInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-sky-300 font-mono focus:outline-none focus:border-sky-500"
                          placeholder="e.g. 12, 18, 24, 32, 39, 45, 67, 71, 85, 89"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 block font-bold mb-1">
                          Target Value to Search:
                        </label>
                        <input
                          type="number"
                          value={modalTargetInput}
                          onChange={e => setModalTargetInput(e.target.value)}
                          className="w-32 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-amber-400 font-bold font-mono focus:outline-none focus:border-amber-400"
                          placeholder="e.g. 39"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-500 self-center">Presets:</span>
                        <button
                          onClick={() => { setModalArrInput('12, 18, 24, 32, 39, 45, 67, 71, 85, 89'); setModalTargetInput('39'); }}
                          className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px]"
                        >
                          Target Present (39)
                        </button>
                        <button
                          onClick={() => { setModalArrInput('12, 18, 24, 32, 39, 45, 67, 71, 85, 89'); setModalTargetInput('99'); }}
                          className="px-2 py-0.5 rounded bg-slate-800 text-rose-400 text-[10px]"
                        >
                          Target Absent (99)
                        </button>
                        <button
                          onClick={() => { setModalArrInput('5, 10, 15, 20, 25'); setModalTargetInput('15'); }}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                        >
                          Small (5 items)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Two Pointers & Sliding Window Input Fields */}
                  {currentTopic.stageType === 'pointers' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-300 block font-bold mb-1">
                          Array Elements (comma-separated):
                        </label>
                        <input
                          type="text"
                          value={modalPointersArrInput}
                          onChange={e => setModalPointersArrInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-sky-300 font-mono focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      {currentTopic.id === 'two-pointers' ? (
                        <div>
                          <label className="text-slate-300 block font-bold mb-1">
                            Target Pair Sum:
                          </label>
                          <input
                            type="number"
                            value={modalPointersTargetInput}
                            onChange={e => setModalPointersTargetInput(e.target.value)}
                            className="w-32 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-indigo-400 font-bold font-mono focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-slate-300 block font-bold mb-1">
                            Window Size K (1 to 8):
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="8"
                            value={modalWindowKInput}
                            onChange={e => setModalWindowKInput(e.target.value)}
                            className="w-32 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-sky-400 font-bold font-mono focus:outline-none focus:border-sky-400"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stack Input Fields */}
                  {currentTopic.stageType === 'stack' && (
                    <div className="space-y-2">
                      <label className="text-slate-300 block font-bold">
                        Initial Stack Elements (Bottom to Top):
                      </label>
                      <input
                        type="text"
                        value={modalStackInput}
                        onChange={e => setModalStackInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. 15, 30, 45"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setModalStackInput('10, 20, 30, 40, 50')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                        >
                          Deep Stack
                        </button>
                        <button
                          onClick={() => setModalStackInput('42')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                        >
                          Single Element
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Queue Input Fields */}
                  {currentTopic.stageType === 'queue' && (
                    <div className="space-y-2">
                      <label className="text-slate-300 block font-bold">
                        Initial Queue Elements (Front to Rear):
                      </label>
                      <input
                        type="text"
                        value={modalQueueInput}
                        onChange={e => setModalQueueInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. 10, 20, 30"
                      />
                    </div>
                  )}

                  {/* BST Input Fields */}
                  {currentTopic.stageType === 'bst' && (
                    <div className="space-y-2">
                      <label className="text-slate-300 block font-bold">
                        BST Keys to Construct Tree (comma-separated):
                      </label>
                      <input
                        type="text"
                        value={modalBstInput}
                        onChange={e => setModalBstInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-teal-300 font-mono focus:outline-none focus:border-teal-500"
                        placeholder="e.g. 50, 30, 70, 20, 40, 60, 80"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setModalBstInput('50, 30, 70, 20, 40, 60, 80')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                        >
                          Balanced 7 Nodes
                        </button>
                        <button
                          onClick={() => setModalBstInput('40, 20, 60, 10, 30, 50, 70')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                        >
                          Full Binary Tree
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Graph Input Fields */}
                  {currentTopic.stageType === 'graph' && (
                    <div className="space-y-2">
                      <label className="text-slate-300 block font-bold">
                        Select Traversal Starting Node:
                      </label>
                      <div className="flex gap-2">
                        {['A', 'B', 'C', 'D', 'E', 'F'].map(n => (
                          <button
                            key={n}
                            onClick={() => setGraphStartNode(n)}
                            className={`w-10 h-10 rounded-xl font-mono text-sm font-bold border transition ${
                              graphStartNode === n ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-slate-950 border-slate-700 text-slate-300'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DP Input Fields */}
                  {currentTopic.stageType === 'dp' && (
                    <div className="space-y-2">
                      <label className="text-slate-300 block font-bold">
                        Fibonacci Sequence Index N (2 to 12):
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="12"
                        value={modalDpNInput}
                        onChange={e => setModalDpNInput(e.target.value)}
                        className="w-32 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-amber-400 font-bold font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  {/* Greedy Input Fields */}
                  {currentTopic.stageType === 'greedy' && (
                    <div className="space-y-2">
                      <label className="text-slate-300 block font-bold">
                        Interval Schedule Preset:
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setGreedyPreset('standard')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            greedyPreset === 'standard' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          Standard 5 Activities
                        </button>
                        <button
                          onClick={() => setGreedyPreset('dense')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            greedyPreset === 'dense' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          Dense / High Conflict
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <button
                    onClick={() => {
                      setModalArrInput('45, 12, 85, 32, 89, 39, 67, 24, 71, 18');
                      setModalTargetInput('39');
                      setModalPointersArrInput('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
                      setModalPointersTargetInput('61');
                      setModalWindowKInput('3');
                      setModalStackInput('15, 30, 45');
                      setModalQueueInput('10, 20, 30');
                      setModalBstInput('50, 30, 70, 20, 40, 60, 80');
                      setModalDpNInput('6');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono"
                  >
                    Load Defaults
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCustomInputModalOpen(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyCustomInputModal}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                    >
                      Apply & Visualize ➔
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      );
    }
'''

full_html = head_part + middle_code + foot_part

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(full_html)

with open(PREVIEW_PATH, "w", encoding="utf-8") as f:
    f.write(full_html)

print("VisualDSA index.html and preview.html successfully updated! Total length:", len(full_html))
