import type { SortStep, RecursionNode, RecursionTreeSnapshot } from './types';

// ─── Pre-build complete merge tree ──────────────────────────────────────────
function buildMergeTree(
  arr: number[],
  left: number,
  right: number,
  parentId: string | null,
  depth: number,
  nodes: Record<string, RecursionNode>,
  maxDepthRef: { val: number }
): string {
  const id = `merge-${left}-${right}`;
  const subarray = arr.slice(left, right + 1);
  const isBaseCase = left >= right;
  if (depth > maxDepthRef.val) maxDepthRef.val = depth;

  nodes[id] = {
    id,
    type: 'merge',
    left,
    right,
    subarray,
    state: 'pending',
    parentId,
    leftChildId: null,
    rightChildId: null,
    depth,
    isBaseCase,
  };

  if (!isBaseCase) {
    const mid = Math.floor((left + right) / 2);
    nodes[id].mid = mid;
    const leftId = buildMergeTree(arr, left, mid, id, depth + 1, nodes, maxDepthRef);
    const rightId = buildMergeTree(arr, mid + 1, right, id, depth + 1, nodes, maxDepthRef);
    nodes[id].leftChildId = leftId;
    nodes[id].rightChildId = rightId;
  }

  return id;
}

function cloneTree(nodes: Record<string, RecursionNode>): Record<string, RecursionNode> {
  return JSON.parse(JSON.stringify(nodes));
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function generateMergeSortSteps(inputArr: number[]): SortStep[] {
  const arr = [...inputArr];
  const steps: SortStep[] = [];
  let stepId = 0;

  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;

  const getStats = () => ({
    comparisons,
    swaps,
    accesses: arrayAccesses,
    pass: 0,
  });

  // Pre-build full recursion tree in 'pending' state
  const treeNodes: Record<string, RecursionNode> = {};
  const maxDepthRef = { val: 0 };
  const rootId = arr.length > 0 ? buildMergeTree(arr, 0, arr.length - 1, null, 0, treeNodes, maxDepthRef) : null;

  const makeSnapshot = (activeNodeId: string | null): RecursionTreeSnapshot => ({
    nodes: cloneTree(treeNodes),
    activeNodeId,
    rootId,
    maxDepth: maxDepthRef.val,
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
    recursionTree: makeSnapshot(null),
    ...getStats(),
  });

  const runMergeSort = (l: number, r: number) => {
    const nodeId = `merge-${l}-${r}`;

    // Mark active
    treeNodes[nodeId].state = 'active';

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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    if (l >= r) {
      treeNodes[nodeId].state = 'done';
      treeNodes[nodeId].isBaseCase = true;
      return;
    }

    const mid = Math.floor(l + (r - l) / 2);
    treeNodes[nodeId].mid = mid;
    treeNodes[nodeId].state = 'splitting';

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
      recursionTree: makeSnapshot(nodeId),
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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });
    runMergeSort(l, mid);

    treeNodes[nodeId].state = 'left-done';

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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });
    runMergeSort(mid + 1, r);

    // Merge
    treeNodes[nodeId].state = 'merging';
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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    merge(l, mid, r, nodeId);
  };

  const merge = (left: number, mid: number, right: number, nodeId: string) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const leftArr = new Array(n1);
    const rightArr = new Array(n2);

    for (let i = 0; i < n1; i++) {
      leftArr[i] = arr[left + i];
      arrayAccesses += 2;
    }
    for (let j = 0; j < n2; j++) {
      rightArr[j] = arr[mid + 1 + j];
      arrayAccesses += 2;
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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
      comparisons++;
      arrayAccesses += 2;

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
        recursionTree: makeSnapshot(nodeId),
        ...getStats(),
      });

      if (leftArr[i] <= rightArr[j]) {
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
          mergeLeftIndices: Array.from({ length: n1 - i }, (_, idx) => left + i + idx),
          mergeRightIndices: Array.from({ length: n2 - j }, (_, idx) => mid + 1 + j + idx),
          mergeRange: [left, right],
          description: `Placing left element ${leftArr[i]} at position ${k}.`,
          codeLineActive: 22,
          recursionTree: makeSnapshot(nodeId),
          ...getStats(),
        });
        i++;
      } else {
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
          mergeLeftIndices: Array.from({ length: n1 - i }, (_, idx) => left + i + idx),
          mergeRightIndices: Array.from({ length: n2 - j }, (_, idx) => mid + 1 + j + idx),
          mergeRange: [left, right],
          description: `Placing right element ${rightArr[j]} at position ${k}.`,
          codeLineActive: 25,
          recursionTree: makeSnapshot(nodeId),
          ...getStats(),
        });
        j++;
      }
      k++;
    }

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
        recursionTree: makeSnapshot(nodeId),
        ...getStats(),
      });
      i++; k++;
    }

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
        recursionTree: makeSnapshot(nodeId),
        ...getStats(),
      });
      j++; k++;
    }

    // Update subarray in tree node to reflect merged result
    treeNodes[nodeId].subarray = arr.slice(left, right + 1);
    treeNodes[nodeId].state = 'done';

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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });
  };

  runMergeSort(0, arr.length - 1);

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
    recursionTree: makeSnapshot(null),
    ...getStats(),
  });

  return steps;
}
