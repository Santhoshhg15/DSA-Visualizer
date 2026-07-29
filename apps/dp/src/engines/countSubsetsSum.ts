import type { ProblemMeta, Step } from '../problems/types';

export const COUNT_SUBSETS_META: ProblemMeta = {
  id: 'count-subsets-sum',
  name: 'Count Subsets with Sum = K',
  category: '2D DP',
  description: 'Count total number of subsets that sum to target K.',
  javaCode: [
    'public int countSubsets(int[] arr, int k) {',
    '    int n = arr.length;',
    '    int[][] dp = new int[n + 1][k + 1];',
    '    for (int i = 0; i <= n; i++) {',
    '        dp[i][0] = 1;',
    '    }',
    '    for (int i = 1; i <= n; i++) {',
    '        for (int j = 1; j <= k; j++) {',
    '            dp[i][j] = dp[i-1][j];',
    '            if (j >= arr[i-1]) {',
    '                dp[i][j] += dp[i-1][j-arr[i-1]];',
    '            }',
    '        }',
    '    }',
    '    return dp[n][k];',
    '}',
  ],
  pseudoCode: [
    'function countSubsets(arr, k):',
    '    create table dp of size (n+1) x (k+1)',
    '    for each row i: dp[i][0] = 1',
    '        (empty subset always sums to 0)',
    '    for i from 1 to n:',
    '        for j from 1 to k:',
    '            dp[i][j] = count without arr[i-1]',
    '            if arr[i-1] fits in j:',
    '                add count using arr[i-1]',
    '    return dp[n][k]',
  ],
  recurrence: 'dp[i][j] = dp[i-1][j] + (j >= arr[i-1] ? dp[i-1][j-arr[i-1]] : 0)',
  baseCases: 'Base: dp[i][0] = 1, dp[0][j>0] = 0',
  timeComplexity: 'O(n × k)',
  spaceComplexity: 'O(n × k)',
};

export function buildCountSubsetsTrace(arr: number[], k: number): Step[] {
  const steps: Step[] = [];
  const n = arr.length;
  if (n === 0) return steps;

  // Initialize (n+1) x (k+1) table filled with nulls
  const table: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    new Array(k + 1).fill(null)
  );

  // Flattened 1D array for compatibility with legacy dpArray state
  const getFlatDp = () => table.flat();

  // 1. Init step
  steps.push({
    type: 'init',
    dpArray: getFlatDp(),
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 3,
    codeLineActivePseudo: 1,
    codeLineActive: 3,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    subsetArr: [...arr],
    subsetK: k,
    msg: `Init: table size (${n + 1}) × (${k + 1})`,
  });

  // 2. Base Case 0: dp[0][j>0] = 0
  for (let j = 1; j <= k; j++) {
    table[0][j] = 0;
  }

  // 3. Base Case: dp[i][0] = 1 for all i = 0..n
  for (let i = 0; i <= n; i++) {
    table[i][0] = 1;
    steps.push({
      type: 'base',
      dpArray: getFlatDp(),
      activeIndex: i * (k + 1),
      fromIndices: [],
      codeLineActiveJava: 4,
      codeLineActivePseudo: 3,
      codeLineActive: 4,
      dpTable: table.map((r) => [...r]),
      activeCell: [i, 0],
      sourceCells: [],
      subsetArr: [...arr],
      subsetK: k,
      msg: `Base: dp[${i}][0] = 1 (empty subset sums to 0)`,
    });
  }

  // 4. Fill Loop: i from 1 to n, j from 1 to k
  for (let i = 1; i <= n; i++) {
    const elem = arr[i - 1];

    for (let j = 1; j <= k; j++) {
      const excludeVal = table[i - 1][j] as number;
      const fits = j >= elem;
      const includeVal = fits ? (table[i - 1][j - elem] as number) : 0;
      const ans = excludeVal + includeVal;
      table[i][j] = ans;

      const sources: [number, number][] = [[i - 1, j]];
      if (fits) {
        sources.push([i - 1, j - elem]);
      }

      steps.push({
        type: 'fill',
        dpArray: getFlatDp(),
        activeIndex: i * (k + 1) + j,
        fromIndices: sources.map(([r, c]) => r * (k + 1) + c),
        codeLineActiveJava: fits ? 10 : 8,
        codeLineActivePseudo: fits ? 9 : 7,
        codeLineActive: fits ? 10 : 8,
        dpTable: table.map((r) => [...r]),
        activeCell: [i, j],
        sourceCells: sources,
        subsetArr: [...arr],
        subsetK: k,
        msg: fits
          ? `dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i - 1}][${j}-${elem}] = ${excludeVal} + ${includeVal} = ${ans}`
          : `dp[${i}][${j}] = dp[${i - 1}][${j}] = ${excludeVal} (arr[${i - 1}]=${elem} > ${j})`,
      });
    }
  }

  // 5. Final Done Step
  const finalAns = table[n][k] as number;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: n * (k + 1) + k,
    fromIndices: [],
    codeLineActiveJava: 14,
    codeLineActivePseudo: 10,
    codeLineActive: 14,
    dpTable: table.map((r) => [...r]),
    activeCell: [n, k],
    sourceCells: [],
    subsetArr: [...arr],
    subsetK: k,
    msg: `Answer: dp[${n}][${k}] = ${finalAns} subset(s) sum to ${k}`,
  });

  return steps;
}
