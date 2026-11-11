import { VisualStep } from '../../types/algorithm';

export function generateQuickSortSteps(initialArray: number[]): VisualStep<number[]>[] {
  const steps: VisualStep<number[]>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  function pushStep(
    activeLine: number,
    description: string,
    subDescription: string,
    pointers: Record<string, number | string | null> = {},
    highlights: {
      comparing?: number[];
      swapping?: number[];
      active?: number[];
      auxiliary?: number[];
    } = {}
  ) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0, // will patch at the end
      state: [...arr],
      activeLine,
      description,
      subDescription,
      pointers,
      highlights: {
        comparing: highlights.comparing || [],
        swapping: highlights.swapping || [],
        sorted: Array.from(sortedIndices),
        active: highlights.active || [],
        auxiliary: highlights.auxiliary || []
      },
      metrics: {
        comparisons,
        swaps,
        operations: comparisons + swaps
      }
    });
  }

  // Initial step
  pushStep(
    1,
    'Starting Quick Sort with Lomuto partitioning.',
    `Initial array of ${n} elements loaded. Pivot will be chosen from the end of each subarray.`
  );

  function quickSort(low: number, high: number) {
    pushStep(
      2,
      `Checking recursive condition: low (${low}) < high (${high}).`,
      low < high
        ? `Subarray [${low}..${high}] has ${high - low + 1} elements. Proceeding to partition.`
        : `Subarray [${low}..${high}] has size <= 1. Base case reached.`,
      { low, high }
    );

    if (low < high) {
      pushStep(
        4,
        `Calling partition(arr, ${low}, ${high}).`,
        `Selecting pivot and partitioning elements smaller than or equal to pivot to the left.`,
        { low, high }
      );

      const pIdx = partition(low, high);
      sortedIndices.add(pIdx);

      pushStep(
        4,
        `Pivot placed permanently at index ${pIdx} (value: ${arr[pIdx]}).`,
        `All elements to its left are <= ${arr[pIdx]}, and elements to its right are >= ${arr[pIdx]}.`,
        { pivot: pIdx }
      );

      pushStep(
        7,
        `Recursively sorting left subarray [${low}..${pIdx - 1}].`,
        pIdx - 1 >= low ? `Sorting ${pIdx - low} elements on the left.` : `Left subarray is empty.`,
        { low, high: pIdx - 1 }
      );
      quickSort(low, pIdx - 1);

      pushStep(
        8,
        `Recursively sorting right subarray [${pIdx + 1}..${high}].`,
        high >= pIdx + 1 ? `Sorting ${high - pIdx} elements on the right.` : `Right subarray is empty.`,
        { low: pIdx + 1, high }
      );
      quickSort(pIdx + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
      pushStep(
        2,
        `Single element at index ${low} (value: ${arr[low]}) is trivially sorted.`,
        `Base case: single-item subarray requires no sorting.`,
        { low, high }
      );
    }
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    pushStep(
      11,
      `Pivot chosen: arr[${high}] = ${pivot}.`,
      `Boundary pointer i initialized to ${i} (elements <= pivot will precede i).`,
      { low, high, pivot: high, i: i >= 0 ? i : 'None' },
      { active: [high] }
    );

    for (let j = low; j < high; j++) {
      comparisons++;
      pushStep(
        15,
        `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}).`,
        arr[j] <= pivot
          ? `${arr[j]} <= ${pivot}: Element belongs on left partition. Incrementing i.`
          : `${arr[j]} > ${pivot}: Element stays on right side.`,
        { low, high, pivot: high, i: i >= 0 ? i : 'None', j },
        { comparing: [j, high], active: [high] }
      );

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          swaps++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          pushStep(
            17,
            `Swapped arr[${i}] and arr[${j}]: [${arr[i]}, ${arr[j]}].`,
            `Moved element <= pivot to left boundary index i=${i}.`,
            { low, high, pivot: high, i, j },
            { swapping: [i, j], active: [high] }
          );
        }
      }
    }

    // Place pivot at i + 1
    swaps++;
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    pushStep(
      20,
      `Moving pivot to final slot: swap arr[${i + 1}] (${arr[i + 1]}) and arr[${high}] (${arr[high]}).`,
      `Pivot ${pivot} is now correctly positioned between smaller and greater elements.`,
      { pivot: i + 1, low, high },
      { swapping: [i + 1, high] }
    );

    pushStep(
      21,
      `Partition complete. Returning pivot index ${i + 1}.`,
      `Left partition: indices [${low}..${i}], Right partition: indices [${i + 2}..${high}].`,
      { pivot: i + 1 }
    );

    return i + 1;
  }

  quickSort(0, n - 1);

  // Mark all sorted
  for (let idx = 0; idx < n; idx++) {
    sortedIndices.add(idx);
  }

  pushStep(
    9,
    'Quick Sort complete! Entire array is fully sorted in ascending order.',
    `Final array: [${arr.join(', ')}]. Total comparisons: ${comparisons}, swaps: ${swaps}.`
  );

  // Patch totalSteps
  for (let s of steps) {
    s.totalSteps = steps.length;
  }

  return steps;
}
