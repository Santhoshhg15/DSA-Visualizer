import type { SortStep, RecursionNode, RecursionTreeSnapshot } from './types';

function cloneTree(nodes: Record<string, RecursionNode>): Record<string, RecursionNode> {
  return JSON.parse(JSON.stringify(nodes));
}

export function generateQuickSortSteps(inputArr: number[]): SortStep[] {
  const arr = [...inputArr];
  const n = arr.length;
  const steps: SortStep[] = [];
  let stepId = 0;

  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  const sortedIndices: number[] = [];

  const getStats = () => ({
    comparisons,
    swaps,
    accesses: arrayAccesses,
    pass: 0,
  });

  // Lazily built tree
  const treeNodes: Record<string, RecursionNode> = {};
  const maxDepthRef = { val: 0 };

  // Register a node when we first enter it
  const registerNode = (
    low: number,
    high: number,
    parentId: string | null,
    depth: number
  ): string => {
    const id = `quick-${low}-${high}`;
    if (!treeNodes[id]) {
      const isBaseCase = low >= high;
      if (depth > maxDepthRef.val) maxDepthRef.val = depth;
      treeNodes[id] = {
        id,
        type: 'quick',
        left: low,
        right: high,
        subarray: arr.slice(low, Math.max(low, high) + 1),
        state: 'active',
        parentId,
        leftChildId: null,
        rightChildId: null,
        depth,
        isBaseCase,
        pivotValue: !isBaseCase && high < arr.length ? arr[high] : undefined,
        pivot: !isBaseCase && high < arr.length ? high : undefined,
      };
      // Wire up parent
      if (parentId && treeNodes[parentId]) {
        if (treeNodes[parentId].leftChildId === null) {
          treeNodes[parentId].leftChildId = id;
        } else {
          treeNodes[parentId].rightChildId = id;
        }
      }
    }
    return id;
  };

  const rootId = n > 0 ? `quick-0-${n - 1}` : null;

  const makeSnapshot = (activeNodeId: string | null): RecursionTreeSnapshot => ({
    nodes: cloneTree(treeNodes),
    activeNodeId,
    rootId,
    maxDepth: maxDepthRef.val,
  });

  // Step 0: initial
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

  const runQuickSort = (low: number, high: number, parentId: string | null, depth: number) => {
    const nodeId = registerNode(low, high, parentId, depth);

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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    if (low < high) {
      // Mark partitioning
      treeNodes[nodeId].state = 'partitioning';
      treeNodes[nodeId].pivotValue = arr[high];
      treeNodes[nodeId].pivot = high;

      const pIdx = partition(low, high, nodeId);

      // Register child nodes
      if (low <= pIdx - 1) registerNode(low, pIdx - 1, nodeId, depth + 1);
      if (pIdx + 1 <= high) registerNode(pIdx + 1, high, nodeId, depth + 1);

      treeNodes[nodeId].state = 'active';

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
        recursionTree: makeSnapshot(nodeId),
        ...getStats(),
      });
      runQuickSort(low, pIdx - 1, nodeId, depth + 1);

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
        recursionTree: makeSnapshot(nodeId),
        ...getStats(),
      });
      runQuickSort(pIdx + 1, high, nodeId, depth + 1);

      treeNodes[nodeId].state = 'done';
    } else {
      treeNodes[nodeId].state = 'done';
      treeNodes[nodeId].isBaseCase = true;

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
          recursionTree: makeSnapshot(nodeId),
          ...getStats(),
        });
      }
    }
  };

  const partition = (low: number, high: number, nodeId: string): number => {
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
      recursionTree: makeSnapshot(nodeId),
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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      arrayAccesses += 2;

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
        recursionTree: makeSnapshot(nodeId),
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
          recursionTree: makeSnapshot(nodeId),
          ...getStats(),
        });

        const temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        swaps++; arrayAccesses += 4;

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
          description: `Swapping elements at index i = ${i} and j = ${j}.`,
          codeLineActive: 16,
          recursionTree: makeSnapshot(nodeId),
          ...getStats(),
        });
      }
    }

    // Place pivot
    const temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    swaps++; arrayAccesses += 4;

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
      recursionTree: makeSnapshot(nodeId),
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
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    return i + 1;
  };

  runQuickSort(0, arr.length - 1, null, 0);

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
    recursionTree: makeSnapshot(null),
    ...getStats(),
  });

  return steps;
}
