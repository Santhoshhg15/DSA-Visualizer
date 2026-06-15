import type { SortStep } from './types';

export function generateQuickSortSteps(inputArr: number[]): SortStep[] {
  const arr = [...inputArr];
  const n = arr.length;
  const steps: SortStep[] = [];
  let stepId = 0;

  // Stats
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  const sortedIndices: number[] = [];

  const getStats = () => ({
    comparisons,
    swaps,
    accesses: arrayAccesses,
    pass: 0
  });

  // Step 0: Initial State
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
    ...getStats(),
  });

  const runQuickSort = (low: number, high: number) => {
    // Base case check
    steps.push({
      id: stepId++,
      type: 'base-case',
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
      mergeRange: [low, high],
      description: `Checking range validity for partition arr[${low}..${high}].`,
      codeLineActive: 3,
      ...getStats(),
    });

    if (low < high) {
      // Partition
      const pIdx = partition(low, high);

      // Recurse left
      steps.push({
        id: stepId++,
        type: 'recurse-left',
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
        mergeRange: [low, pIdx - 1],
        description: `Recursing on left partition arr[${low}..${pIdx - 1}].`,
        codeLineActive: 5,
        ...getStats(),
      });
      runQuickSort(low, pIdx - 1);

      // Recurse right
      steps.push({
        id: stepId++,
        type: 'recurse-right',
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
        mergeRange: [pIdx + 1, high],
        description: `Recursing on right partition arr[${pIdx + 1}..${high}].`,
        codeLineActive: 6,
        ...getStats(),
      });
      runQuickSort(pIdx + 1, high);
    } else {
      if (low >= 0 && low < n && !sortedIndices.includes(low)) {
        sortedIndices.push(low);
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
          mergeRange: [low, high],
          description: `Element arr[${low}] = ${arr[low]} is sorted (base case partition).`,
          codeLineActive: 3,
          ...getStats(),
        });
      }
    }
  };

  const partition = (low: number, high: number): number => {
    // Set pivot
    const pivot = arr[high];
    arrayAccesses++;
    
    steps.push({
      id: stepId++,
      type: 'set-pivot',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: high,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: [low, high],
      description: `Choosing pivot = arr[high] = arr[${high}] = ${pivot}.`,
      codeLineActive: 11,
      ...getStats(),
    });

    let i = low - 1;
    steps.push({
      id: stepId++,
      type: 'compare',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: high,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: [low, high],
      description: `Initialized partition boundary index i = low - 1 = ${i}.`,
      codeLineActive: 12,
      ...getStats(),
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      arrayAccesses += 2; // read arr[j] and pivot

      steps.push({
        id: stepId++,
        type: 'compare',
        arraySnapshot: [...arr],
        comparingIndices: [j],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: high,
        minIndex: null,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [],
        mergeRange: [low, high],
        description: `Comparing arr[${j}] = ${arr[j]} with pivot = ${pivot}.`,
        codeLineActive: 14,
        ...getStats(),
      });

      if (arr[j] <= pivot) {
        i++;
        steps.push({
          id: stepId++,
          type: 'compare',
          arraySnapshot: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [...sortedIndices],
          pivotIndex: high,
          minIndex: null,
          keyIndex: null,
          shiftingIndices: [],
          mergeLeftIndices: [],
          mergeRightIndices: [],
          mergeRange: [low, high],
          description: `arr[${j}] = ${arr[j]} ≤ pivot. Incrementing boundary index i to ${i}.`,
          codeLineActive: 15,
          ...getStats(),
        });

        // Swap arr[i] and arr[j]
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        swaps++;
        arrayAccesses += 4;

        steps.push({
          id: stepId++,
          type: 'swap',
          arraySnapshot: [...arr],
          comparingIndices: [],
          swappingIndices: [i, j],
          sortedIndices: [...sortedIndices],
          pivotIndex: high,
          minIndex: null,
          keyIndex: null,
          shiftingIndices: [],
          mergeLeftIndices: [],
          mergeRightIndices: [],
          mergeRange: [low, high],
          description: `Swapping elements at index i = ${i} and j = ${j} (arr[${i}] ↔ arr[${j}]).`,
          codeLineActive: 16,
          ...getStats(),
        });
      }
    }

    // Place pivot
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    swaps++;
    arrayAccesses += 4;

    steps.push({
      id: stepId++,
      type: 'partition-complete',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [i + 1, high],
      sortedIndices: [...sortedIndices],
      pivotIndex: i + 1,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: [low, high],
      description: `Placing pivot = ${pivot} at its correct position. Swapping arr[${i + 1}] and arr[${high}].`,
      codeLineActive: 21,
      ...getStats(),
    });

    sortedIndices.push(i + 1);

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
      mergeRange: [low, high],
      description: `Pivot element ${pivot} is now sorted at index ${i + 1}.`,
      codeLineActive: 24,
      ...getStats(),
    });

    return i + 1;
  };

  runQuickSort(0, arr.length - 1);

  // Mark all elements sorted at the end
  const finalSorted = Array.from({ length: arr.length }, (_, idx) => idx);

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
    description: `✓ Quick Sort complete! ${comparisons} comparisons, ${swaps} swaps made.`,
    codeLineActive: 1,
    ...getStats(),
  });

  return steps;
}
