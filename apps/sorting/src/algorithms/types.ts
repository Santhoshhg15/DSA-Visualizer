export interface SortStep {
  id: number;
  type:
    | 'compare'
    | 'swap'
    | 'no-swap'
    | 'mark-sorted'
    | 'set-min'
    | 'set-key'
    | 'shift'
    | 'place-key'
    | 'set-pivot'
    | 'partition-start'
    | 'partition-complete'
    | 'merge-start'
    | 'merge-compare'
    | 'merge-place'
    | 'merge-complete'
    | 'recurse-left'
    | 'recurse-right'
    | 'base-case'
    | 'complete';

  // Full array state at this step
  arraySnapshot: number[];

  // Visual states (indices)
  comparingIndices: number[];     // amber #FFB800
  swappingIndices: number[];      // orange #FF6B00
  sortedIndices: number[];        // green #00C896
  pivotIndex: number | null;      // purple #7C3AED
  minIndex: number | null;        // pink #EC4899 (selection sort)
  keyIndex: number | null;        // pink #EC4899 (insertion sort key)
  shiftingIndices: number[];      // cyan #0891B2 (insertion shift)
  mergeLeftIndices: number[];     // left subarray in merge
  mergeRightIndices: number[];    // right subarray in merge
  mergeRange: [number, number] | null; // [left, right] current merge range
  iIndex?: number | null;         // i pointer for Quick Sort
  jIndex?: number | null;         // j pointer for Quick Sort

  // Trace
  description: string;
  codeLineActive: number;
  codeLineActivePseudo?: number;

  // Stats at this step
  comparisons?: number;
  swaps?: number;
  accesses?: number;
  pass?: number;
  arrayAccesses?: number;
  currentPass?: number;

  // Recursion tree snapshot (merge sort / quick sort only)
  recursionTree?: RecursionTreeSnapshot;
}

// ─── Recursion Tree Types ────────────────────────────────────────────────────

export type RecursionNodeState =
  | 'pending'        // not yet reached
  | 'active'         // currently executing
  | 'splitting'      // being divided
  | 'left-done'      // left child complete
  | 'merging'        // merge phase active
  | 'partitioning'   // quick sort partition in progress
  | 'done';          // fully sorted/placed

export interface RecursionNode {
  id: string;           // e.g. "merge-0-7", "quick-2-5"
  type: 'merge' | 'quick';
  left: number;         // left index
  right: number;        // right index
  mid?: number;         // mid index (merge only)
  pivot?: number;       // pivot index (quick only)
  pivotValue?: number;  // pivot value (quick only)
  subarray: number[];   // values at this range
  state: RecursionNodeState;
  parentId: string | null;
  leftChildId: string | null;
  rightChildId: string | null;
  depth: number;        // 0 = root
  isBaseCase: boolean;  // single element
}

export interface RecursionTreeSnapshot {
  nodes: Record<string, RecursionNode>;
  activeNodeId: string | null;
  rootId: string | null;
  maxDepth: number;
}
