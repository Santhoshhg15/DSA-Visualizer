import type { SortStep } from './types';

export function generateBubbleSortSteps(inputArr: number[]): SortStep[] {
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

  // Step 0: Initial Array
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
    // Outer loop start
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
      description: `Pass ${i + 1} of ${n - 1}. Bubbling largest unsorted element to position ${n - i - 1}.`,
      codeLineActive: 3,
      ...getStats(i + 1),
    });

    let swapped = false;
    // Highlight swapped initialization
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
      description: `Setting swapped flag to false.`,
      codeLineActive: 4,
      ...getStats(i + 1),
    });

    for (let j = 0; j < n - i - 1; j++) {
      // Comparison Step
      comparisons++;
      arrayAccesses += 2;
      steps.push({
        id: stepId++,
        type: 'compare',
        arraySnapshot: [...arr],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: null,
        minIndex: null,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [],
        mergeRange: null,
        description: `Comparing arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}.`,
        codeLineActive: 6,
        ...getStats(i + 1),
      });

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        arrayAccesses += 4; // 2 reads, 2 writes
        swapped = true;

        steps.push({
          id: stepId++,
          type: 'swap',
          arraySnapshot: [...arr],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          pivotIndex: null,
          minIndex: null,
          keyIndex: null,
          shiftingIndices: [],
          mergeLeftIndices: [],
          mergeRightIndices: [],
          mergeRange: null,
          description: `arr[${j}] = ${arr[j + 1]} > arr[${j + 1}] = ${arr[j]}. Swapping elements.`,
          codeLineActive: 7, // temp = arr[j] / start swap
          ...getStats(i + 1),
        });

        // Swapped flag true
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
          description: `Swapped happened. Setting swapped = true.`,
          codeLineActive: 10,
          ...getStats(i + 1),
        });
      } else {
        steps.push({
          id: stepId++,
          type: 'no-swap',
          arraySnapshot: [...arr],
          comparingIndices: [j, j + 1],
          swappingIndices: [],
          sortedIndices: [...sortedIndices],
          pivotIndex: null,
          minIndex: null,
          keyIndex: null,
          shiftingIndices: [],
          mergeLeftIndices: [],
          mergeRightIndices: [],
          mergeRange: null,
          description: `arr[${j}] = ${arr[j]} ≤ arr[${j + 1}] = ${arr[j + 1]}. No swap needed.`,
          codeLineActive: 6,
          ...getStats(i + 1),
        });
      }
    }

    // Mark sorted
    sortedIndices.push(n - i - 1);
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
      description: `Element ${arr[n - i - 1]} is now in its correct sorted position at index ${n - i - 1}.`,
      codeLineActive: 3,
      ...getStats(i + 1),
    });

    // Check early termination
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
      description: `Checking if any swap occurred. swapped = ${swapped}.`,
      codeLineActive: 13,
      ...getStats(i + 1),
    });

    if (!swapped) {
      // Add all remaining elements to sortedIndices
      for (let k = 0; k < n; k++) {
        if (!sortedIndices.includes(k)) sortedIndices.push(k);
      }
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
        description: `No swaps in this pass. Array is already sorted! Early exit.`,
        codeLineActive: 13,
        ...getStats(i + 1),
      });
      break;
    }
  }

  // Ensure all indices are marked sorted at the end
  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) sortedIndices.push(k);
  }

  // Complete step
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
    description: `✓ Bubble Sort complete! ${comparisons} comparisons, ${swaps} swaps made.`,
    codeLineActive: 1,
    ...getStats(n - 1),
  });

  return steps;
}
