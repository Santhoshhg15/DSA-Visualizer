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
        pivotValue: !isBaseCase && low < arr.length ? arr[low] : undefined,
        pivot: !isBaseCase && low < arr.length ? low : undefined,
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
    iIndex: null,
    jIndex: null,
    description: 'Initial array state before sorting.',
    codeLineActive: 1,
    codeLineActivePseudo: 1,
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
      iIndex: null,
      jIndex: null,
      description: `Checking range validity for partition arr[${low}..${high}].`,
      codeLineActive: 2,
      codeLineActivePseudo: 2,
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    if (low < high) {
      // Mark partitioning
      treeNodes[nodeId].state = 'partitioning';
      treeNodes[nodeId].pivotValue = arr[low];
      treeNodes[nodeId].pivot = low;

      steps.push({
        id: stepId++,
        type: 'partition-start',
        arraySnapshot: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: low,
        minIndex: null,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [],
        mergeRange: [low, high],
        iIndex: null,
        jIndex: null,
        description: `Calling partition(arr, ${low}, ${high})`,
        codeLineActive: 3,
        codeLineActivePseudo: 3,
        recursionTree: makeSnapshot(nodeId),
        ...getStats(),
      });

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
        iIndex: null,
        jIndex: null,
        description: `Recurse left: quickSort(arr, ${low}, ${pIdx - 1})`,
        codeLineActive: 4,
        codeLineActivePseudo: 4,
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
        iIndex: null,
        jIndex: null,
        description: `Recurse right: quickSort(arr, ${pIdx + 1}, ${high})`,
        codeLineActive: 5,
        codeLineActivePseudo: 5,
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
          iIndex: null,
          jIndex: null,
          description: `Element arr[${low}] = ${arr[low]} is sorted (base case partition).`,
          codeLineActive: 2,
          codeLineActivePseudo: 2,
          recursionTree: makeSnapshot(nodeId),
          ...getStats(),
        });
      }
    }
  };

  const partition = (low: number, high: number, nodeId: string): number => {
    const pivot = arr[low];
    arrayAccesses++;

    steps.push({
      id: stepId++,
      type: 'set-pivot',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: low,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: [low, high],
      iIndex: low,
      jIndex: high,
      description: `Pivot = arr[${low}] = ${pivot} (first element of range [${low}..${high}])`,
      codeLineActive: 10,
      codeLineActivePseudo: 8,
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    let i = low;
    let j = high;

    steps.push({
      id: stepId++,
      type: 'compare',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: low,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: [low, high],
      iIndex: i,
      jIndex: j,
      description: `Initialized pointers i = ${low}, j = ${high}.`,
      codeLineActive: 11,
      codeLineActivePseudo: 9,
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    while (i < j) {
      steps.push({
        id: stepId++,
        type: 'compare',
        arraySnapshot: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: low,
        minIndex: null,
        keyIndex: null,
        shiftingIndices: [],
        mergeLeftIndices: [],
        mergeRightIndices: [],
        mergeRange: [low, high],
        iIndex: i,
        jIndex: j,
        description: `Checking while(i < j): i=${i} < j=${j}.`,
        codeLineActive: 13,
        codeLineActivePseudo: 10,
        recursionTree: makeSnapshot(nodeId),
        ...getStats(),
      });

      // Inner while 1: i-scan
      while (i <= high - 1) {
        comparisons++;
        arrayAccesses += 2;
        const satisfies = arr[i] <= pivot;

        if (satisfies) {
          steps.push({
            id: stepId++,
            type: 'compare',
            arraySnapshot: [...arr],
            comparingIndices: [i],
            swappingIndices: [],
            sortedIndices: [...sortedIndices],
            pivotIndex: low,
            minIndex: null,
            keyIndex: null,
            shiftingIndices: [],
            mergeLeftIndices: [],
            mergeRightIndices: [],
            mergeRange: [low, high],
            iIndex: i,
            jIndex: j,
            description: `i=${i}: arr[${i}]=${arr[i]} ≤ pivot ${pivot} → move i right`,
            codeLineActive: 14,
            codeLineActivePseudo: 11,
            recursionTree: makeSnapshot(nodeId),
            ...getStats(),
          });
          i++;
          steps.push({
            id: stepId++,
            type: 'compare',
            arraySnapshot: [...arr],
            comparingIndices: [],
            swappingIndices: [],
            sortedIndices: [...sortedIndices],
            pivotIndex: low,
            minIndex: null,
            keyIndex: null,
            shiftingIndices: [],
            mergeLeftIndices: [],
            mergeRightIndices: [],
            mergeRange: [low, high],
            iIndex: i,
            jIndex: j,
            description: `Incremented i to ${i}.`,
            codeLineActive: 15,
            codeLineActivePseudo: 11,
            recursionTree: makeSnapshot(nodeId),
            ...getStats(),
          });
        } else {
          steps.push({
            id: stepId++,
            type: 'compare',
            arraySnapshot: [...arr],
            comparingIndices: [i],
            swappingIndices: [],
            sortedIndices: [...sortedIndices],
            pivotIndex: low,
            minIndex: null,
            keyIndex: null,
            shiftingIndices: [],
            mergeLeftIndices: [],
            mergeRightIndices: [],
            mergeRange: [low, high],
            iIndex: i,
            jIndex: j,
            description: `i=${i}: arr[${i}]=${arr[i]} > pivot ${pivot} → stop, found element > pivot`,
            codeLineActive: 14,
            codeLineActivePseudo: 11,
            recursionTree: makeSnapshot(nodeId),
            ...getStats(),
          });
          break;
        }
      }

      // Inner while 2: j-scan
      while (j >= low + 1) {
        comparisons++;
        arrayAccesses += 2;
        const satisfies = arr[j] > pivot;

        if (satisfies) {
          steps.push({
            id: stepId++,
            type: 'compare',
            arraySnapshot: [...arr],
            comparingIndices: [j],
            swappingIndices: [],
            sortedIndices: [...sortedIndices],
            pivotIndex: low,
            minIndex: null,
            keyIndex: null,
            shiftingIndices: [],
            mergeLeftIndices: [],
            mergeRightIndices: [],
            mergeRange: [low, high],
            iIndex: i,
            jIndex: j,
            description: `j=${j}: arr[${j}]=${arr[j]} > pivot ${pivot} → move j left`,
            codeLineActive: 17,
            codeLineActivePseudo: 12,
            recursionTree: makeSnapshot(nodeId),
            ...getStats(),
          });
          j--;
          steps.push({
            id: stepId++,
            type: 'compare',
            arraySnapshot: [...arr],
            comparingIndices: [],
            swappingIndices: [],
            sortedIndices: [...sortedIndices],
            pivotIndex: low,
            minIndex: null,
            keyIndex: null,
            shiftingIndices: [],
            mergeLeftIndices: [],
            mergeRightIndices: [],
            mergeRange: [low, high],
            iIndex: i,
            jIndex: j,
            description: `Decremented j to ${j}.`,
            codeLineActive: 18,
            codeLineActivePseudo: 12,
            recursionTree: makeSnapshot(nodeId),
            ...getStats(),
          });
        } else {
          steps.push({
            id: stepId++,
            type: 'compare',
            arraySnapshot: [...arr],
            comparingIndices: [j],
            swappingIndices: [],
            sortedIndices: [...sortedIndices],
            pivotIndex: low,
            minIndex: null,
            keyIndex: null,
            shiftingIndices: [],
            mergeLeftIndices: [],
            mergeRightIndices: [],
            mergeRange: [low, high],
            iIndex: i,
            jIndex: j,
            description: `j=${j}: arr[${j}]=${arr[j]} ≤ pivot ${pivot} → stop, found element ≤ pivot`,
            codeLineActive: 17,
            codeLineActivePseudo: 12,
            recursionTree: makeSnapshot(nodeId),
            ...getStats(),
          });
          break;
        }
      }

      // Check if swap needed
      if (i < j) {
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
          pivotIndex: low,
          minIndex: null,
          keyIndex: null,
          shiftingIndices: [],
          mergeLeftIndices: [],
          mergeRightIndices: [],
          mergeRange: [low, high],
          iIndex: i,
          jIndex: j,
          description: `i=${i} < j=${j} → swap arr[${i}]=${arr[i]} with arr[${j}]=${arr[j]}`,
          codeLineActive: 21,
          codeLineActivePseudo: 13,
          recursionTree: makeSnapshot(nodeId),
          ...getStats(),
        });
      }
    }

    // Place pivot in final position
    const temp = arr[low];
    arr[low] = arr[j];
    arr[j] = temp;
    swaps++;
    arrayAccesses += 4;

    steps.push({
      id: stepId++,
      type: 'swap',
      arraySnapshot: [...arr],
      comparingIndices: [],
      swappingIndices: [low, j],
      sortedIndices: [...sortedIndices],
      pivotIndex: j,
      minIndex: null,
      keyIndex: null,
      shiftingIndices: [],
      mergeLeftIndices: [],
      mergeRightIndices: [],
      mergeRange: [low, high],
      iIndex: i,
      jIndex: j,
      description: `Place pivot in final position: swap arr[${low}]=${pivot} with arr[${j}]=${arr[j]} → pivot settles at index ${j}`,
      codeLineActive: 27,
      codeLineActivePseudo: 14,
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    if (!sortedIndices.includes(j)) {
      sortedIndices.push(j);
    }
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
      iIndex: null,
      jIndex: null,
      description: `Index ${j} is now correctly placed (pivot ${pivot})`,
      codeLineActive: 29,
      codeLineActivePseudo: 15,
      recursionTree: makeSnapshot(nodeId),
      ...getStats(),
    });

    return j;
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
    iIndex: null,
    jIndex: null,
    description: `✓ Quick Sort complete! ${comparisons} comparisons, ${swaps} swaps made.`,
    codeLineActive: 1,
    codeLineActivePseudo: 1,
    recursionTree: makeSnapshot(null),
    ...getStats(),
  });

  return steps;
}
