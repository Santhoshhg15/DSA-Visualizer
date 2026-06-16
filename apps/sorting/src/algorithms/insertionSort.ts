import type { SortStep } from './types';

export function generateInsertionSortSteps(inputArr: number[]): SortStep[] {
  const arr = [...inputArr];
  const n = arr.length;
  const steps: SortStep[] = [];
  let stepId = 0;

  // Stats
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  const sortedIndices: number[] = [0]; // Index 0 starts sorted

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
    sortedIndices: [0],
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

  for (let i = 1; i < n; i++) {
    // Outer loop, set key
    const key = arr[i];
    arrayAccesses++;
    steps.push({
      id: stepId++,
      type: 'set-key',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: null,
      minIndex: null,
      keyIndex: i,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: null,
      description: `key = arr[${i}] = ${key}. Inserting key into sorted portion arr[0..${i - 1}].`,
      codeLineActive: 4,
      ...getStats(i),
    });

    let j = i - 1;
    steps.push({
      id: stepId++,
      type: 'set-key',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: null,
      minIndex: null,
      keyIndex: i,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: null,
      description: `Starting comparison index j = i - 1 = ${j}.`,
      codeLineActive: 5,
      ...getStats(i),
    });

    // While loop execution
    while (j >= 0) {
      comparisons++;
      arrayAccesses += 2; // read arr[j] and key (key is local, but reading arr[j] is access)
      
      steps.push({
        id: stepId++,
        type: 'compare',
        arraySnapshot: [...arr],
        comparingIndices: [j],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: null,
        minIndex: null,
        keyIndex: i,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [],
        mergeRange: null,
        description: `Comparing arr[j = ${j}] = ${arr[j]} with key = ${key}.`,
        codeLineActive: 6,
        ...getStats(i),
      });

      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        arrayAccesses += 2; // read arr[j], write arr[j+1]

        steps.push({
          id: stepId++,
          type: 'shift',
          arraySnapshot: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [...sortedIndices],
          pivotIndex: null,
          minIndex: null,
          keyIndex: i,
          shiftingIndices: [j],
          mergeLeftIndices: [],
          mergeRightIndices: [],
          mergeRange: null,
          description: `arr[${j}] = ${arr[j]} > key = ${key}. Shifting arr[${j}] to position ${j + 1}.`,
          codeLineActive: 7,
          ...getStats(i),
        });

        j--;
        steps.push({
          id: stepId++,
          type: 'shift',
          arraySnapshot: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [...sortedIndices],
          pivotIndex: null,
          minIndex: null,
          keyIndex: i,
          shiftingIndices: [],
          mergeLeftIndices: [],
          mergeRightIndices: [],
          mergeRange: null,
          description: `Decrementing j to ${j}.`,
          codeLineActive: 8,
          ...getStats(i),
        });
      } else {
        break;
      }
    }

    // Place key
    arr[j + 1] = key;
    arrayAccesses++; // write key

    steps.push({
      id: stepId++,
      type: 'place-key',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: null,
      minIndex: null,
      keyIndex: j + 1,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: null,
      description: `Placing key = ${key} at index ${j + 1}.`,
      codeLineActive: 10,
      ...getStats(i),
    });

    // Mark sorted
    if (!sortedIndices.includes(i)) {
      sortedIndices.push(i);
    }
    // Sort array elements up to i visually
    const currentSorted = [];
    for (let k = 0; k <= i; k++) {
      currentSorted.push(k);
    }

    steps.push({
      id: stepId++,
      type: 'mark-sorted',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...currentSorted],
      pivotIndex: null,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: null,
      description: `Subarray arr[0..${i}] is now sorted.`,
      codeLineActive: 3,
      ...getStats(i),
    });
  }

  // Ensure all indices are sorted
  const finalSorted = Array.from({ length: n }, (_, idx) => idx);

  steps.push({
    id: stepId++,
    type: 'complete',
    arraySnapshot: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: finalSorted,
    pivotIndex: null,
    minIndex: null,
    keyIndex: null,
    shiftingIndices: [],
    mergeLeftIndices: [],
    mergeRightIndices: [],
    mergeRange: null,
    description: `✓ Insertion Sort complete! ${comparisons} comparisons, 0 swaps made.`,
    codeLineActive: 1,
    ...getStats(n - 1),
  });

  return steps;
}
