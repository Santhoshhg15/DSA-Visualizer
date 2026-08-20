import type { ProblemMeta, Step } from '../problems/types';

export const COUNT_SUBSETS_META: ProblemMeta = {
  id: 'count-subsets-sum',
  name: 'Count Subsets with Sum = K',
  category: '2D DP',
  description: 'Count total number of subsets that sum to target K using top-down memoization.',
  javaCode: [
    'public int countSubsets(int[] arr, int k) {',
    '    int n = arr.length;',
    '    int[][] dp = new int[n][k + 1];',
    '    for (int[] row : dp) {',
    '        Arrays.fill(row, -1);',
    '    }',
    '    return solve(arr, n - 1, k, dp);',
    '}',
    '',
    'public int solve(int[] arr, int index, int k, int[][] dp) {',
    '    if (k == 0) {',
    '        return 1;',
    '    }',
    '    if (index < 0) {',
    '        return 0;',
    '    }',
    '    if (dp[index][k] != -1) {',
    '        return dp[index][k];',
    '    }',
    '    int notTake = solve(arr, index - 1, k, dp);',
    '    int take = 0;',
    '    if (arr[index] <= k) {',
    '        take = solve(arr, index - 1, k - arr[index], dp);',
    '    }',
    '    return dp[index][k] = take + notTake;',
    '}',
  ],
  pseudoCode: [
    'function countSubsets(arr, k):',
    '    create dp table of size n x (k+1), fill with -1',
    '    return solve(arr, last index, k, dp)',
    '',
    'function solve(arr, index, k, dp):',
    '    if k reaches 0: found a valid subset, return 1',
    '    if index goes below 0: no elements left, return 0',
    '    if dp[index][k] already computed: return it (memo hit)',
    '    notTake = solve without using arr[index]',
    '    take = 0',
    '    if arr[index] fits in remaining sum k:',
    '        take = solve using arr[index]',
    '    store and return take + notTake',
  ],
  recurrence: 'solve(i,k) = solve(i-1,k) + solve(i-1,k-arr[i])\nBase: k=0 → 1, i<0 → 0\nMemo: if dp[i][k] ≠ -1, return cached',
  baseCases: 'k=0 → 1 (subset found), index<0 → 0 (exhausted array)',
  timeComplexity: 'O(n × k)',
  spaceComplexity: 'O(n × k + n)',
};

// ─── Trace Builder ────────────────────────────────────────────────────────────

export function buildCountSubsetsTrace(arr: number[], k: number): Step[] {
  const steps: Step[] = [];
  const n = arr.length;
  if (n === 0) return steps;

  // Live memo table: null = not yet computed, number = already computed
  const table: (number | null)[][] = Array.from({ length: n }, () =>
    new Array(k + 1).fill(null)
  );

  const callStack: { index: number; k: number }[] = [];
  let cellsComputed = 0;
  let memoHits = 0;

  // ─── Snapshot helpers ────────────────────────────────────────────────────
  const snapTable = (): (number | null)[][] => table.map((r) => [...r]);
  const snapStack = (): { index: number; k: number }[] =>
    callStack.map((f) => ({ ...f }));

  // Flatten table row-by-row for dpArray (n × (k+1))
  const flatDp = (): (number | null)[] => table.flat();

  const makeStep = (
    overrides: Partial<Step> & {
      type: Step['type'];
      msg: string;
      codeLineActiveJava: number;
      codeLineActivePseudo: number;
    }
  ): Step => ({
    dpArray: flatDp(),
    activeIndex: -1,
    fromIndices: [],
    activeCell: null,
    sourceCells: [],
    inProgressCell: null,
    memoHitCell: null,
    returnValue: null,
    callStack: snapStack(),
    dpTable: snapTable(),
    subsetArr: [...arr],
    subsetK: k,
    memoStats: { cellsComputed, memoHits },
    codeLineActive: overrides.codeLineActiveJava,
    ...overrides,
  });

  // Defensive safety check
  const MAX_STEPS = 5000;
  const pushStep = (
    overrides: Partial<Step> & {
      type: Step['type'];
      msg: string;
      codeLineActiveJava: number;
      codeLineActivePseudo: number;
    }
  ) => {
    if (steps.length >= MAX_STEPS) {
      steps.push(
        makeStep({
          ...overrides,
          type: 'done',
          msg: 'Trace exceeded maximum step limit — input too large or a bug occurred. Try smaller inputs.',
        })
      );
      throw new Error('STEP_LIMIT');
    }
    steps.push(makeStep(overrides));
  };

  // Step 0 — init
  pushStep({
    type: 'init',
    codeLineActiveJava: 3,
    codeLineActivePseudo: 2,
    msg: `Initialize dp[${n}][${k + 1}] filled with -1 (uncomputed). Call solve(index=${n - 1}, k=${k}).`,
  });

  // ─── Recursive solve ─────────────────────────────────────────────────────
  function solve(index: number, targetK: number): number {
    callStack.push({ index, k: targetK });

    // Entering the call
    pushStep({
      type: 'call',
      codeLineActiveJava: 10,
      codeLineActivePseudo: 5,
      activeCell: index >= 0 ? [index, targetK] : null,
      inProgressCell: index >= 0 ? [index, targetK] : null,
      msg: `→ solve(index=${index}, k=${targetK})`,
    });

    // Base case 1: targetK == 0 (MUST come first)
    if (targetK === 0) {
      pushStep({
        type: 'base-case',
        codeLineActiveJava: 11,
        codeLineActivePseudo: 6,
        activeCell: index >= 0 ? [index, 0] : null,
        returnValue: 1,
        msg: `k = 0 → empty subset sums to 0. Return 1.`,
      });
      callStack.pop();
      return 1;
    }

    // Base case 2: index < 0
    if (index < 0) {
      pushStep({
        type: 'base-case',
        codeLineActiveJava: 14,
        codeLineActivePseudo: 7,
        activeCell: null,
        returnValue: 0,
        msg: `index < 0, array exhausted but k=${targetK} not reached. Return 0.`,
      });
      callStack.pop();
      return 0;
    }

    // Memo hit check (consistent null check)
    if (table[index][targetK] !== null) {
      const cached = table[index][targetK] as number;
      memoHits++;
      pushStep({
        type: 'memo-hit',
        codeLineActiveJava: 17,
        codeLineActivePseudo: 8,
        activeCell: [index, targetK],
        memoHitCell: [index, targetK],
        returnValue: cached,
        memoStats: { cellsComputed, memoHits },
        msg: `MEMO HIT! dp[${index}][${targetK}] = ${cached} already computed. Return cached value.`,
      });
      callStack.pop();
      return cached;
    }

    // Compute: notTake
    pushStep({
      type: 'compute-nottake',
      codeLineActiveJava: 20,
      codeLineActivePseudo: 9,
      activeCell: [index, targetK],
      inProgressCell: [index, targetK],
      msg: `Exclude arr[${index}]=${arr[index]}: recurse → solve(${index - 1}, ${targetK})`,
    });
    const notTake = solve(index - 1, targetK);

    // Compute: take (if feasible, arr[index] <= targetK)
    let take = 0;
    if (arr[index] <= targetK) {
      pushStep({
        type: 'compute-take',
        codeLineActiveJava: 22,
        codeLineActivePseudo: 11,
        activeCell: [index, targetK],
        inProgressCell: [index, targetK],
        msg: `Include arr[${index}]=${arr[index]}: recurse → solve(${index - 1}, ${targetK - arr[index]})`,
      });
      take = solve(index - 1, targetK - arr[index]);
    } else {
      pushStep({
        type: 'compute-take',
        codeLineActiveJava: 22,
        codeLineActivePseudo: 10,
        activeCell: [index, targetK],
        inProgressCell: [index, targetK],
        msg: `arr[${index}]=${arr[index]} > k=${targetK} → cannot include. take = 0.`,
      });
    }

    const result = take + notTake;
    table[index][targetK] = result;
    cellsComputed++;

    pushStep({
      type: 'return',
      codeLineActiveJava: 25,
      codeLineActivePseudo: 13,
      activeCell: [index, targetK],
      sourceCells: [
        ...(index - 1 >= 0
          ? ([[index - 1, targetK]] as [number, number][])
          : []),
        ...(arr[index] <= targetK && index - 1 >= 0
          ? ([[index - 1, targetK - arr[index]]] as [number, number][])
          : []),
      ],
      returnValue: result,
      memoStats: { cellsComputed, memoHits },
      msg: `dp[${index}][${targetK}] = notTake(${notTake}) + take(${take}) = ${result} ← stored in memo table.`,
    });

    callStack.pop();
    return result;
  }

  try {
    const finalResult = solve(n - 1, k);

    // Final done step
    pushStep({
      type: 'done',
      codeLineActiveJava: 7,
      codeLineActivePseudo: 3,
      activeCell: [n - 1, k],
      returnValue: finalResult,
      memoStats: { cellsComputed, memoHits },
      msg: `Answer: ${finalResult} subset(s) sum to ${k}. Cells computed: ${cellsComputed}, Memo hits: ${memoHits}.`,
    });
  } catch (err: any) {
    if (err.message !== 'STEP_LIMIT') {
      throw err;
    }
  }

  return steps;
}
