import { VisualStep } from '../../types/algorithm';

export interface ListNodeItem {
  id: string;
  val: number;
  nextId: string | null;
}

export function generateReverseLinkedListSteps(initialValues: number[]): VisualStep<ListNodeItem[]>[] {
  const steps: VisualStep<ListNodeItem[]>[] = [];
  const nodes: ListNodeItem[] = initialValues.map((v, idx) => ({
    id: `node-${idx}`,
    val: v,
    nextId: idx < initialValues.length - 1 ? `node-${idx + 1}` : null
  }));

  function cloneNodes(list: ListNodeItem[]): ListNodeItem[] {
    return list.map(n => ({ ...n }));
  }

  function pushStep(
    activeLine: number,
    description: string,
    subDescription: string,
    currentNodes: ListNodeItem[],
    pointers: Record<string, string | null> = {},
    highlights: { active?: string[]; comparing?: string[]; sorted?: string[] } = {}
  ) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      state: cloneNodes(currentNodes),
      activeLine,
      description,
      subDescription,
      pointers,
      custom: {
        nodeHighlights: highlights
      }
    });
  }

  pushStep(
    1,
    'Starting Three-Pointer In-Place Linked List Reversal.',
    'Pointers: prev = None, curr = head. We will reverse one pointer link per iteration.',
    nodes,
    { prev: 'None', curr: nodes[0]?.id || 'None', head: nodes[0]?.id || 'None' }
  );

  let currentList = cloneNodes(nodes);
  let prevId: string | null = null;
  let currIndex = 0;

  while (currIndex < currentList.length) {
    const currNode = currentList[currIndex];
    const nxtId = currNode.nextId;

    pushStep(
      11,
      `Step 1: Stored next node reference (nxt = curr.next).`,
      `nxt points to ${nxtId ? `node(${nxtId})` : 'None'}. Preserves reference before reversing current pointer.`,
      currentList,
      { prev: prevId, curr: currNode.id, nxt: nxtId },
      { active: [currNode.id] }
    );

    // Reverse link
    currNode.nextId = prevId;

    pushStep(
      12,
      `Step 2: Reversed link: curr.next = prev.`,
      `Node(${currNode.val}) now points backwards to ${prevId ? `node(${prevId})` : 'None (new end of list)'}.`,
      currentList,
      { prev: prevId, curr: currNode.id, nxt: nxtId },
      { sorted: [currNode.id] }
    );

    // Advance pointers
    prevId = currNode.id;
    currIndex++;

    pushStep(
      13,
      `Step 3: Advanced pointers: prev = curr, curr = nxt.`,
      `Shifted sliding pointer window forward by one node.`,
      currentList,
      { prev: prevId, curr: nxtId }
    );
  }

  pushStep(
    16,
    `Linked list reversal completed successfully!`,
    `Returning prev as the new head of the reversed list.`,
    currentList,
    { newHead: prevId }
  );

  for (const s of steps) s.totalSteps = steps.length;
  return steps;
}
