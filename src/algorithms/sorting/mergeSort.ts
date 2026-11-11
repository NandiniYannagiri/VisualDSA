import { VisualStep } from '../../types/algorithm';

export function generateMergeSortSteps(initialArray: number[]): VisualStep<number[]>[] {
  const steps: VisualStep<number[]>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedRanges: [number, number][] = [];

  function getSortedIndices(): number[] {
    const set = new Set<number>();
    for (const [start, end] of sortedRanges) {
      for (let i = start; i <= end; i++) set.add(i);
    }
    return Array.from(set);
  }

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
    } = {},
    customData?: any
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
        sorted: getSortedIndices(),
        active: highlights.active || [],
        auxiliary: highlights.auxiliary || []
      },
      metrics: {
        comparisons,
        swaps,
        operations: comparisons + swaps
      },
      custom: customData
    });
  }

  pushStep(
    1,
    'Starting Merge Sort (Divide and Conquer).',
    `Initial array of ${n} elements. Splitting into halves until single elements are reached.`
  );

  function mergeSort(left: number, right: number) {
    pushStep(
      2,
      `Checking condition: left (${left}) < right (${right}).`,
      left < right ? `Array range [${left}..${right}] can be divided.` : `Base case: range [${left}..${right}] is size 1.`,
      { left, right }
    );

    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      pushStep(
        3,
        `Calculated midpoint: mid = (${left} + ${right}) // 2 = ${mid}.`,
        `Splitting into left half [${left}..${mid}] and right half [${mid + 1}..${right}].`,
        { left, mid, right },
        { active: [mid] }
      );

      pushStep(
        6,
        `Recursively calling merge_sort(arr, ${left}, ${mid}) on left half.`,
        `Dividing left subarray further.`,
        { left, right: mid }
      );
      mergeSort(left, mid);

      pushStep(
        7,
        `Recursively calling merge_sort(arr, ${mid + 1}, ${right}) on right half.`,
        `Dividing right subarray further.`,
        { left: mid + 1, right }
      );
      mergeSort(mid + 1, right);

      pushStep(
        10,
        `Both halves sorted. Now calling merge(arr, ${left}, ${mid}, ${right}).`,
        `Merging sorted left [${left}..${mid}] and sorted right [${mid + 1}..${right}] in sorted order.`,
        { left, mid, right }
      );
      merge(left, mid, right);
    }
  }

  function merge(left: number, mid: number, right: number) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);

    pushStep(
      13,
      `Created auxiliary copies: L = [${L.join(', ')}], R = [${R.join(', ')}].`,
      `Pointers i and j will track positions in L and R; pointer k writes back to main array at index ${left}.`,
      { left, mid, right, k: left },
      { auxiliary: Array.from({ length: right - left + 1 }, (_, idx) => left + idx) },
      { L, R }
    );

    let i = 0;
    let j = 0;
    let k = left;

    while (i < L.length && j < R.length) {
      comparisons++;
      pushStep(
        19,
        `Comparing L[${i}] (${L[i]}) and R[${j}] (${R[j]}).`,
        L[i] <= R[j]
          ? `${L[i]} <= ${R[j]}: Taking ${L[i]} from Left subarray and placing at arr[${k}].`
          : `${R[j]} < ${L[i]}: Taking ${R[j]} from Right subarray and placing at arr[${k}].`,
        { left, mid, right, k, i, j },
        { comparing: [k] },
        { L, R, activeL: i, activeR: j }
      );

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        swaps++;
        pushStep(
          20,
          `Wrote arr[${k}] = ${L[i]} from L[${i}].`,
          `Advancing L pointer i to ${i + 1} and target pointer k to ${k + 1}.`,
          { k, i, j },
          { swapping: [k] },
          { L, R }
        );
        i++;
      } else {
        arr[k] = R[j];
        swaps++;
        pushStep(
          23,
          `Wrote arr[${k}] = ${R[j]} from R[${j}].`,
          `Advancing R pointer j to ${j + 1} and target pointer k to ${k + 1}.`,
          { k, i, j },
          { swapping: [k] },
          { L, R }
        );
        j++;
      }
      k++;
    }

    // Flush remaining L
    while (i < L.length) {
      arr[k] = L[i];
      swaps++;
      pushStep(
        28,
        `Copying remaining element from Left array: arr[${k}] = ${L[i]}.`,
        `Right array was exhausted; flushing remaining sorted elements from L.`,
        { k, i },
        { swapping: [k] },
        { L, R }
      );
      i++;
      k++;
    }

    // Flush remaining R
    while (j < R.length) {
      arr[k] = R[j];
      swaps++;
      pushStep(
        31,
        `Copying remaining element from Right array: arr[${k}] = ${R[j]}.`,
        `Left array was exhausted; flushing remaining sorted elements from R.`,
        { k, j },
        { swapping: [k] },
        { L, R }
      );
      j++;
      k++;
    }

    sortedRanges.push([left, right]);
    pushStep(
      10,
      `Merged range [${left}..${right}] successfully: [${arr.slice(left, right + 1).join(', ')}].`,
      `This sub-segment is now fully ordered.`,
      { left, right }
    );
  }

  mergeSort(0, n - 1);

  pushStep(
    11,
    'Merge Sort complete! Array is sorted.',
    `Final array: [${arr.join(', ')}]. Comparisons: ${comparisons}, writes: ${swaps}.`
  );

  for (const s of steps) {
    s.totalSteps = steps.length;
  }

  return steps;
}
