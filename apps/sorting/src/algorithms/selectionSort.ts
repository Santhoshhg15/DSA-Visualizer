import type { SortStep } from './types';

export function generateSelectionSortSteps(inputArr: number[]): SortStep[] {
  const arr = [...inputArr];
  const n = arr.length;
  const steps: SortStep[] = [];
  let stepId = 0;

  // Stats
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  const sortedIndices: number[] = [];

  const getStats = (pass: number) => ({
    comparisons,
    swaps,
    accesses: arrayAccesses,
    pass
  });

  // Step 0: Initial state
  steps.push({
    id: stepId++,
    type: 'compare',
    arraySnapshot: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    pivotIndex: null,
    minIndex: null,
    keyIndex: null,
    shiftingIndices: [],
    mergeLeftIndices: [],
    mergeRightIndices: [],
    mergeRange: null,
    description: 'Initial array state before sorting.',
    codeLineActive: 1,
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    currentPass: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    // Outer loop
    steps.push({
      id: stepId++,
      type: 'compare',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: null,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: null,
      description: `Finding minimum element in unsorted portion arr[${i}..${n - 1}].`,
      codeLineActive: 3,
      ...getStats(i + 1),
    });

    let minIdx = i;
    arrayAccesses++;
    steps.push({
      id: stepId++,
      type: 'set-min',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: null,
      minIndex: minIdx,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: null,
      description: `Assuming arr[${i}] = ${arr[i]} is the minimum.`,
      codeLineActive: 4,
      ...getStats(i + 1),
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      arrayAccesses += 2;
      steps.push({
        id: stepId++,
        type: 'compare',
        arraySnapshot: [...arr],
        comparingIndices: [j, minIdx],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: null,
        minIndex: minIdx,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [],
        mergeRange: null,
        description: `Comparing arr[${j}] = ${arr[j]} with current min arr[${minIdx}] = ${arr[minIdx]}.`,
        codeLineActive: 6,
        ...getStats(i + 1),
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        arrayAccesses++;
        steps.push({
          id: stepId++,
          type: 'set-min',
          arraySnapshot: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [...sortedIndices],
          pivotIndex: null,
          minIndex: minIdx,
          keyIndex: null,
          shiftingIndices: [],
          mergeLeftIndices: [],
          mergeRightIndices: [],
          mergeRange: null,
          description: `arr[${j}] = ${arr[j]} < arr[${minIdx}] = ${arr[minIdx]}. New minimum at index ${j}.`,
          codeLineActive: 7,
          ...getStats(i + 1),
        });
      }
    }

    // Check minIdx != i
    steps.push({
      id: stepId++,
      type: 'compare',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: null,
      minIndex: minIdx,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: null,
      description: `Checking if minimum index is different from boundary index. minIdx = ${minIdx}, i = ${i}.`,
      codeLineActive: 10,
      ...getStats(i + 1),
    });

    if (minIdx !== i) {
      const temp = arr[minIdx];
      arr[minIdx] = arr[i];
      arr[i] = temp;
      swaps++;
      arrayAccesses += 4;

      steps.push({
        id: stepId++,
        type: 'swap',
        arraySnapshot: [...arr],
        comparingIndices: [],
        swappingIndices: [i, minIdx],
        sortedIndices: [...sortedIndices],
        pivotIndex: null,
        minIndex: minIdx,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [],
        mergeRange: null,
        description: `Placing minimum element ${arr[i]} at index ${i}. Swapping arr[${i}] and arr[${minIdx}].`,
        codeLineActive: 11,
        ...getStats(i + 1),
      });
    } else {
      steps.push({
        id: stepId++,
        type: 'no-swap',
        arraySnapshot: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: null,
        minIndex: minIdx,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [],
        mergeRange: null,
        description: `Minimum element ${arr[i]} is already at correct position ${i}. No swap needed.`,
        codeLineActive: 10,
        ...getStats(i + 1),
      });
    }

    sortedIndices.push(i);
    steps.push({
      id: stepId++,
      type: 'mark-sorted',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: null,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: null,
      description: `arr[${i}] = ${arr[i]} is now sorted.`,
      codeLineActive: 3,
      ...getStats(i + 1),
    });
  }

  // Last element is automatically sorted
  sortedIndices.push(n - 1);
  steps.push({
    id: stepId++,
    type: 'complete',
    arraySnapshot: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
    pivotIndex: null,
    minIndex: null,
    keyIndex: null,
    shiftingIndices: [],
    mergeLeftIndices: [],
    mergeRightIndices: [],
    mergeRange: null,
    description: `✓ Selection Sort complete! ${comparisons} comparisons, ${swaps} swaps made.`,
    codeLineActive: 1,
    ...getStats(n - 1),
  });

  return steps;
}
