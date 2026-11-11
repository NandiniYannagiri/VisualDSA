import { VisualStep } from '../../types/algorithm';

export interface BSTNode {
  id: string;
  val: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x: number;
  y: number;
  depth: number;
}

export interface BSTState {
  root: BSTNode | null;
  allNodes: BSTNode[];
  edges: Array<{ from: string; to: string; direction: 'left' | 'right' }>;
  traversalOutput?: number[];
  targetFound?: boolean;
}

// Compute tree layout coordinates dynamically
export function calculateTreeLayout(root: BSTNode | null, containerWidth: number = 700): {
  nodes: BSTNode[];
  edges: Array<{ from: string; to: string; direction: 'left' | 'right' }>;
} {
  if (!root) return { nodes: [], edges: [] };

  const nodes: BSTNode[] = [];
  const edges: Array<{ from: string; to: string; direction: 'left' | 'right' }> = [];

  function layoutHelper(node: BSTNode, x: number, y: number, depth: number, spread: number) {
    node.x = x;
    node.y = y;
    node.depth = depth;
    nodes.push(node);

    const nextSpread = Math.max(spread / 1.9, 28);
    const nextY = y + 70;

    if (node.left) {
      edges.push({ from: node.id, to: node.left.id, direction: 'left' });
      layoutHelper(node.left, x - spread, nextY, depth + 1, nextSpread);
    }
    if (node.right) {
      edges.push({ from: node.id, to: node.right.id, direction: 'right' });
      layoutHelper(node.right, x + spread, nextY, depth + 1, nextSpread);
    }
  }

  layoutHelper(root, containerWidth / 2, 50, 0, containerWidth / 4.2);
  return { nodes, edges };
}

// Helper to clone BST
export function cloneBST(node: BSTNode | null): BSTNode | null {
  if (!node) return null;
  return {
    id: node.id,
    val: node.val,
    x: node.x,
    y: node.y,
    depth: node.depth,
    left: cloneBST(node.left),
    right: cloneBST(node.right)
  };
}

// Initial default tree
export function createSampleBST(): BSTNode {
  const values = [50, 30, 70, 20, 40, 60, 80];
  let root: BSTNode | null = null;

  for (const v of values) {
    root = rawInsert(root, v);
  }
  return root!;
}

function rawInsert(root: BSTNode | null, val: number): BSTNode {
  if (!root) {
    return {
      id: `node-${val}-${Math.random().toString(36).substr(2, 5)}`,
      val,
      left: null,
      right: null,
      x: 0,
      y: 0,
      depth: 0
    };
  }
  if (val < root.val) {
    root.left = rawInsert(root.left, val);
  } else if (val > root.val) {
    root.right = rawInsert(root.right, val);
  }
  return root;
}

// 1. Generate Insert Steps
export function generateBSTInsertSteps(initialRoot: BSTNode | null, newVal: number): VisualStep<BSTState>[] {
  const steps: VisualStep<BSTState>[] = [];
  let rootCopy = cloneBST(initialRoot);

  function pushStep(
    activeLine: number,
    description: string,
    subDescription: string,
    activeNodeId: string | null = null,
    highlightType: 'comparing' | 'swapping' | 'sorted' | 'active' = 'active'
  ) {
    const layout = calculateTreeLayout(rootCopy);
    const highlights: Record<string, any> = {};
    if (activeNodeId) {
      highlights[highlightType] = [activeNodeId];
    }

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      state: {
        root: cloneBST(rootCopy),
        allNodes: layout.nodes,
        edges: layout.edges
      },
      activeLine,
      description,
      subDescription,
      custom: {
        activeNodeId,
        highlightType,
        targetVal: newVal
      }
    });
  }

  pushStep(
    7,
    `Initiating insertion of value ${newVal} into Binary Search Tree.`,
    `Algorithm compares ${newVal} against each node starting from root to find insertion slot.`
  );

  if (!rootCopy) {
    rootCopy = {
      id: `node-${newVal}-${Date.now()}`,
      val: newVal,
      left: null,
      right: null,
      x: 350,
      y: 50,
      depth: 0
    };
    pushStep(
      8,
      `Tree is empty. Created new root node with value ${newVal}.`,
      `TreeNode(${newVal}) allocated at root level.`,
      rootCopy.id,
      'sorted'
    );
  } else {
    let curr: BSTNode = rootCopy;
    let parent: BSTNode | null = null;
    let direction: 'left' | 'right' = 'left';

    while (curr) {
      parent = curr;
      pushStep(
        10,
        `Comparing insert value ${newVal} with current node ${curr.val}.`,
        newVal < curr.val
          ? `${newVal} < ${curr.val}: Branching LEFT.`
          : newVal > curr.val
          ? `${newVal} > ${curr.val}: Branching RIGHT.`
          : `${newVal} == ${curr.val}: Duplicate value detected.`,
        curr.id,
        'comparing'
      );

      if (newVal < curr.val) {
        if (!curr.left) {
          direction = 'left';
          break;
        }
        curr = curr.left;
      } else if (newVal > curr.val) {
        if (!curr.right) {
          direction = 'right';
          break;
        }
        curr = curr.right;
      } else {
        pushStep(
          14,
          `Value ${newVal} already exists in BST.`,
          `Binary Search Trees typically maintain unique keys. No insertion performed.`,
          curr.id,
          'swapping'
        );
        for (const s of steps) s.totalSteps = steps.length;
        return steps;
      }
    }

    const newNode: BSTNode = {
      id: `node-${newVal}-${Date.now()}`,
      val: newVal,
      left: null,
      right: null,
      x: 0,
      y: 0,
      depth: (parent?.depth || 0) + 1
    };

    if (direction === 'left') {
      parent!.left = newNode;
      pushStep(
        11,
        `Attached node ${newVal} as LEFT child of node ${parent!.val}.`,
        `BST property preserved: left child (${newVal}) < parent (${parent!.val}).`,
        newNode.id,
        'sorted'
      );
    } else {
      parent!.right = newNode;
      pushStep(
        13,
        `Attached node ${newVal} as RIGHT child of node ${parent!.val}.`,
        `BST property preserved: right child (${newVal}) > parent (${parent!.val}).`,
        newNode.id,
        'sorted'
      );
    }
  }

  pushStep(
    14,
    `Insertion of ${newVal} complete!`,
    `Binary Search Tree property remains valid across all subtrees.`
  );

  for (const s of steps) s.totalSteps = steps.length;
  return steps;
}

// 2. Generate Search Steps
export function generateBSTSearchSteps(root: BSTNode | null, targetVal: number): VisualStep<BSTState>[] {
  const steps: VisualStep<BSTState>[] = [];
  const layout = calculateTreeLayout(root);

  function pushStep(
    activeLine: number,
    description: string,
    subDescription: string,
    activeNodeId: string | null = null,
    highlightType: 'comparing' | 'swapping' | 'sorted' | 'active' = 'active',
    found: boolean = false
  ) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      state: {
        root: cloneBST(root),
        allNodes: layout.nodes,
        edges: layout.edges,
        targetFound: found
      },
      activeLine,
      description,
      subDescription,
      custom: {
        activeNodeId,
        highlightType,
        targetVal
      }
    });
  }

  pushStep(
    16,
    `Searching for target key ${targetVal} in BST.`,
    `Starting search at root node.`
  );

  let curr = root;
  while (curr) {
    pushStep(
      18,
      `Inspecting node with value ${curr.val}. Comparing with target ${targetVal}.`,
      curr.val === targetVal
        ? `Match found! ${curr.val} == ${targetVal}.`
        : targetVal < curr.val
        ? `${targetVal} < ${curr.val}: Target is smaller, descending LEFT.`
        : `${targetVal} > ${curr.val}: Target is larger, descending RIGHT.`,
      curr.id,
      'comparing'
    );

    if (curr.val === targetVal) {
      pushStep(
        20,
        `SUCCESS: Target ${targetVal} located in BST!`,
        `Node returned in O(depth) time.`,
        curr.id,
        'sorted',
        true
      );
      for (const s of steps) s.totalSteps = steps.length;
      return steps;
    } else if (targetVal < curr.val) {
      curr = curr.left;
    } else {
      curr = curr.right;
    }
  }

  pushStep(
    25,
    `Target key ${targetVal} was NOT found in the BST.`,
    `Reached a null pointer. The value does not exist in the tree.`,
    null,
    'swapping',
    false
  );

  for (const s of steps) s.totalSteps = steps.length;
  return steps;
}

// 3. Generate In-Order Traversal Steps
export function generateBSTInOrderSteps(root: BSTNode | null): VisualStep<BSTState>[] {
  const steps: VisualStep<BSTState>[] = [];
  const layout = calculateTreeLayout(root);
  const visitedOrder: number[] = [];
  const visitedNodeIds = new Set<string>();

  function pushStep(
    activeLine: number,
    description: string,
    subDescription: string,
    activeNodeId: string | null = null,
    highlightType: 'comparing' | 'swapping' | 'sorted' | 'active' = 'active'
  ) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      state: {
        root: cloneBST(root),
        allNodes: layout.nodes,
        edges: layout.edges,
        traversalOutput: [...visitedOrder]
      },
      activeLine,
      description,
      subDescription,
      custom: {
        activeNodeId,
        highlightType,
        visitedNodeIds: Array.from(visitedNodeIds)
      }
    });
  }

  pushStep(
    27,
    `Starting In-Order Traversal (Left -> Root -> Right).`,
    `In-Order traversal on a valid BST always produces keys in strictly ascending order!`
  );

  function dfs(node: BSTNode | null) {
    if (!node) {
      pushStep(
        31,
        `Reached None (base case). Backtracking.`,
        `Subtree is empty.`
      );
      return;
    }

    pushStep(
      32,
      `Visiting node ${node.val}: Recursively traversing LEFT subtree.`,
      `Following Left -> Root -> Right order.`,
      node.id,
      'active'
    );
    dfs(node.left);

    // Process Root
    visitedOrder.push(node.val);
    visitedNodeIds.add(node.id);
    pushStep(
      33,
      `Processed node ${node.val}: Appended to output list [${visitedOrder.join(', ')}].`,
      `Left subtree finished. Recording current node value.`,
      node.id,
      'sorted'
    );

    pushStep(
      34,
      `Recursively traversing RIGHT subtree of node ${node.val}.`,
      `Following Left -> Root -> Right order.`,
      node.id,
      'active'
    );
    dfs(node.right);
  }

  dfs(root);

  pushStep(
    36,
    `In-Order Traversal Complete!`,
    `Final sorted sequence: [${visitedOrder.join(', ')}]. Notice how it naturally sorts the BST keys.`
  );

  for (const s of steps) s.totalSteps = steps.length;
  return steps;
}
