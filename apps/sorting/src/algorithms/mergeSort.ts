import type { SortStep } from './types';

export function generateMergeSortSteps(inputArr: number[]): SortStep[] {
  const arr = [...inputArr];
  const steps: SortStep[] = [];
  let stepId = 0;

  // Stats
  let comparisons = 0;
  let swaps = 0; // Merge Sort has no swaps in comparison-based terms, only array writes/overwrites.
  let arrayAccesses = 0;

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

  // Helper recursive function
  const runMergeSort = (l: number, r: number) => {
    // Base Case Check
    steps.push({
      id: stepId++,
      type: 'base-case',
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
      mergeRange: [l, r],
      description: `Checking base case for subarray arr[${l}..${r}].`,
      codeLineActive: 3,
      ...getStats(),
    });

    if (l >= r) {
      return;
    }

    const mid = Math.floor(l + (r - l) / 2);
    
    // Compute mid
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
      mergeRange: [l, r],
      description: `Mid point calculated mid = ${mid}.`,
      codeLineActive: 4,
      ...getStats(),
    });

    // Recurse Left
    steps.push({
      id: stepId++,
      type: 'recurse-left',
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
      mergeRange: [l, mid],
      description: `Recursing on left partition arr[${l}..${mid}].`,
      codeLineActive: 5,
      ...getStats(),
    });
    runMergeSort(l, mid);

    // Recurse Right
    steps.push({
      id: stepId++,
      type: 'recurse-right',
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
      mergeRange: [mid + 1, r],
      description: `Recursing on right partition arr[${mid + 1}..${r}].`,
      codeLineActive: 6,
      ...getStats(),
    });
    runMergeSort(mid + 1, r);

    // Merge halves
    steps.push({
      id: stepId++,
      type: 'merge-start',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      pivotIndex: null,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: Array.from({ length: mid - l + 1 }, (_, i) => l + i),
      mergeRightIndices: Array.from({ length: r - mid }, (_, i) => mid + 1 + i),
      mergeRange: [l, r],
      description: `Merging sorted sub-arrays arr[${l}..${mid}] and arr[${mid + 1}..${r}].`,
      codeLineActive: 7,
      ...getStats(),
    });
    
    merge(l, mid, r);
  };

  const merge = (left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    // Create temp arrays
    const leftArr = new Array(n1);
    const rightArr = new Array(n2);

    // Copy to temp arrays
    for (let i = 0; i < n1; i++) {
      leftArr[i] = arr[left + i];
      arrayAccesses += 2; // read arr[left+i], write leftArr[i]
    }
    for (let j = 0; j < n2; j++) {
      rightArr[j] = arr[mid + 1 + j];
      arrayAccesses += 2; // read arr[mid+1+j], write rightArr[j]
    }

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
      mergeLeftIndices: Array.from({ length: n1 }, (_, i) => left + i),
      mergeRightIndices: Array.from({ length: n2 }, (_, i) => mid + 1 + i),
      mergeRange: [left, right],
      description: `Copied subarrays to temporary memory.`,
      codeLineActive: 15,
      ...getStats(),
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < n1 && j < n2) {
      comparisons++;
      arrayAccesses += 2; // read leftArr[i] and rightArr[j]

      // Compare
      steps.push({
        id: stepId++,
        type: 'merge-compare',
        arraySnapshot: [...arr],
        comparingIndices: [left + i, mid + 1 + j],
        swappingIndices: [],
        sortedIndices: [],
        pivotIndex: null,
        minIndex: null,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: Array.from({ length: n1 - i }, (_, idx) => left + i + idx),
        mergeRightIndices: Array.from({ length: n2 - j }, (_, idx) => mid + 1 + j + idx),
        mergeRange: [left, right],
        description: `Comparing leftArr[${i}] = ${leftArr[i]} and rightArr[${j}] = ${rightArr[j]}.`,
        codeLineActive: 21,
        ...getStats(),
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        arrayAccesses += 2; // read leftArr[i], write arr[k]
        
        steps.push({
          id: stepId++,
          type: 'merge-place',
          arraySnapshot: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [],
          pivotIndex: null,
          minIndex: null,
          keyIndex: null,
          shiftingIndices: [],
          mergeLeftIndices: Array.from({ length: n1 - i }, (_, idx) => left + i + idx),
          mergeRightIndices: Array.from({ length: n2 - j }, (_, idx) => mid + 1 + j + idx),
          mergeRange: [left, right],
          description: `Placing left element ${leftArr[i]} at position ${k}.`,
          codeLineActive: 22,
          ...getStats(),
        });
        i++;
      } else {
        arr[k] = rightArr[j];
        arrayAccesses += 2; // read rightArr[j], write arr[k]

        steps.push({
          id: stepId++,
          type: 'merge-place',
          arraySnapshot: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [],
          pivotIndex: null,
          minIndex: null,
          keyIndex: null,
          shiftingIndices: [],
          mergeLeftIndices: Array.from({ length: n1 - i }, (_, idx) => left + i + idx),
          mergeRightIndices: Array.from({ length: n2 - j }, (_, idx) => mid + 1 + j + idx),
          mergeRange: [left, right],
          description: `Placing right element ${rightArr[j]} at position ${k}.`,
          codeLineActive: 25,
          ...getStats(),
        });
        j++;
      }
      k++;
    }

    // Remaining items of leftArr
    while (i < n1) {
      arr[k] = leftArr[i];
      arrayAccesses += 2;

      steps.push({
        id: stepId++,
        type: 'merge-place',
        arraySnapshot: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [],
        pivotIndex: null,
        minIndex: null,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [left + i],
        mergeRightIndices: [],
        mergeRange: [left, right],
        description: `Copying remaining left element ${leftArr[i]} to index ${k}.`,
        codeLineActive: 31,
        ...getStats(),
      });
      i++;
      k++;
    }

    // Remaining items of rightArr
    while (j < n2) {
      arr[k] = rightArr[j];
      arrayAccesses += 2;

      steps.push({
        id: stepId++,
        type: 'merge-place',
        arraySnapshot: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [],
        pivotIndex: null,
        minIndex: null,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [mid + 1 + j],
        mergeRange: [left, right],
        description: `Copying remaining right element ${rightArr[j]} to index ${k}.`,
        codeLineActive: 35,
        ...getStats(),
      });
      j++;
      k++;
    }

    // Merge complete step
    steps.push({
      id: stepId++,
      type: 'merge-complete',
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
      mergeRange: [left, right],
      description: `Merged subarray arr[${left}..${right}] successfully.`,
      codeLineActive: 38,
      ...getStats(),
    });
  };

  runMergeSort(0, arr.length - 1);

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
    description: `✓ Merge Sort complete! ${comparisons} comparisons made.`,
    codeLineActive: 1,
    ...getStats(),
  });

  return steps;
}
