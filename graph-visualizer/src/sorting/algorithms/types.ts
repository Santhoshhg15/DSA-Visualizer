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

  // Trace
  description: string;
  codeLineActive: number;

  // Stats at this step
  comparisons?: number;
  swaps?: number;
  accesses?: number;
  pass?: number;
  arrayAccesses?: number;
  currentPass?: number;
}
