import { VisualStep } from '../../types/algorithm';

export function generateBubbleSortSteps(initialArray: number[]): VisualStep<number[]>[] {
  const steps: VisualStep<number[]>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set<number>();

  function pushStep(
    activeLine: number,
    description: string,
    subDescription: string,
    pointers: Record<string, number | string | null> = {},
    highlights: {
      comparing?: number[];
      swapping?: number[];
      active?: number[];
    } = {}
  ) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      state: [...arr],
      activeLine,
      description,
      subDescription,
      pointers,
      highlights: {
        comparing: highlights.comparing || [],
        swapping: highlights.swapping || [],
        sorted: Array.from(sortedIndices),
        active: highlights.active || []
      },
      metrics: {
        comparisons,
        swaps,
        operations: comparisons + swaps
      }
    });
  }

  pushStep(
    1,
    'Starting Bubble Sort.',
    `Array of ${n} elements. Adjacent elements will be compared and swapped if out of order.`
  );

  for (let i = 0; i < n; i++) {
    let swapped = false;
    pushStep(
      3,
      `Pass i = ${i}: Initializing swapped = False.`,
      `Pass #${i + 1} will bubble the largest unsorted element to index ${n - 1 - i}.`,
      { i }
    );

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      pushStep(
        6,
        `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
        arr[j] > arr[j + 1]
          ? `${arr[j]} > ${arr[j + 1]}: Condition true. Swap needed!`
          : `${arr[j]} <= ${arr[j + 1]}: Condition false. In correct order.`,
        { i, j, 'j+1': j + 1 },
        { comparing: [j, j + 1] }
      );

      if (arr[j] > arr[j + 1]) {
        swaps++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        pushStep(
          8,
          `Swapped arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
          `Set swapped = True.`,
          { i, j, 'j+1': j + 1 },
          { swapping: [j, j + 1] }
        );
      }
    }

    sortedIndices.add(n - 1 - i);
    pushStep(
      11,
      `Element arr[${n - 1 - i}] (${arr[n - 1 - i]}) is now in its finalized position.`,
      swapped ? `Elements were swapped in this pass. Continuing.` : `No swaps occurred in this pass! Array is already sorted.`,
      { finalized: n - 1 - i }
    );

    if (!swapped) {
      pushStep(
        13,
        'Optimization triggered: No swaps occurred during the pass.',
        'Array is fully sorted early! Terminating algorithm in O(N) best case.'
      );
      break;
    }
  }

  for (let idx = 0; idx < n; idx++) sortedIndices.add(idx);

  pushStep(
    14,
    'Bubble Sort complete! All elements are sorted.',
    `Final array: [${arr.join(', ')}]. Total comparisons: ${comparisons}, swaps: ${swaps}.`
  );

  for (const s of steps) s.totalSteps = steps.length;
  return steps;
}
