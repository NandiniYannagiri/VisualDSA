import { VisualStep } from '../../types/algorithm';

export function generateBinarySearchSteps(initialArray: number[], target: number): VisualStep<number[]>[] {
  // Binary search requires a sorted array
  const arr = [...initialArray].sort((a, b) => a - b);
  const steps: VisualStep<number[]>[] = [];
  const n = arr.length;
  let low = 0;
  let high = n - 1;
  let comparisons = 0;

  function pushStep(
    activeLine: number,
    description: string,
    subDescription: string,
    pointers: Record<string, number | string | null> = {},
    highlights: {
      comparing?: number[];
      sorted?: number[];
      active?: number[];
      dimmed?: number[];
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
        sorted: highlights.sorted || [],
        active: highlights.active || [],
        dimmed: highlights.dimmed || []
      },
      metrics: {
        comparisons,
        operations: comparisons
      },
      custom: { target }
    });
  }

  pushStep(
    1,
    `Starting Binary Search for target ${target} on sorted array of ${n} elements.`,
    `Binary search halves search space each iteration in O(log N) time.`
  );

  let foundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const dimmedIndices: number[] = [];
    for (let i = 0; i < low; i++) dimmedIndices.push(i);
    for (let i = high + 1; i < n; i++) dimmedIndices.push(i);

    pushStep(
      5,
      `Calculated midpoint: mid = (${low} + ${high}) // 2 = ${mid} (value: ${arr[mid]}).`,
      `Current active search window: indices [${low}..${high}]. Checking arr[${mid}].`,
      { low, mid, high, target },
      { active: [mid], dimmed: dimmedIndices }
    );

    comparisons++;
    if (arr[mid] === target) {
      foundIndex = mid;
      pushStep(
        9,
        `TARGET FOUND: arr[${mid}] == ${target}!`,
        `Binary search succeeded at index ${mid} with only ${comparisons} comparison(s).`,
        { low, mid, high, target },
        { sorted: [mid], dimmed: dimmedIndices }
      );
      break;
    } else if (arr[mid] < target) {
      pushStep(
        13,
        `arr[${mid}] (${arr[mid]}) < target (${target}). Target must lie to the RIGHT.`,
        `Eliminating left half [${low}..${mid}]. Updating low = mid + 1 = ${mid + 1}.`,
        { low, mid, high, target },
        { comparing: [mid], dimmed: dimmedIndices }
      );
      low = mid + 1;
    } else {
      pushStep(
        17,
        `arr[${mid}] (${arr[mid]}) > target (${target}). Target must lie to the LEFT.`,
        `Eliminating right half [${mid}..${high}]. Updating high = mid - 1 = ${mid - 1}.`,
        { low, mid, high, target },
        { comparing: [mid], dimmed: dimmedIndices }
      );
      high = mid - 1;
    }
  }

  if (foundIndex === -1) {
    const allDimmed = Array.from({ length: n }, (_, i) => i);
    pushStep(
      19,
      `Target ${target} was NOT found in the array.`,
      `low (${low}) > high (${high}): Search interval is exhausted. Returning -1.`,
      { low, high, target },
      { dimmed: allDimmed }
    );
  }

  for (const s of steps) s.totalSteps = steps.length;
  return steps;
}
