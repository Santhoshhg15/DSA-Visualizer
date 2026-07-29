import type { ProblemMeta, Step } from '../problems/types';

export const PARTITION_EQUAL_SUBSET_META: ProblemMeta = {
  id: 'partition-equal-subset',
  name: 'Partition Equal Subset Sum',
  category: 'Grid DP',
  description: 'Determine if array can be partitioned into two subsets with equal sum',
  javaCode: [
    'public boolean canPartition(int[] arr) {',
    '    int totalSum = 0;',
    '    for (int num : arr) totalSum += num;',
    '    if (totalSum % 2 != 0) return false;',
    '    int target = totalSum / 2;',
    '    int n = arr.length;',
    '    boolean[][] dp = new boolean[n + 1][target + 1];',
    '    for (int i = 0; i <= n; i++) {',
    '        dp[i][0] = true;',
    '    }',
    '    for (int i = 1; i <= n; i++) {',
    '        for (int j = 1; j <= target; j++) {',
    '            dp[i][j] = dp[i-1][j];',
    '            if (j >= arr[i-1]) {',
    '                dp[i][j] = dp[i][j] || dp[i-1][j-arr[i-1]];',
    '            }',
    '        }',
    '    }',
    '    return dp[n][target];',
    '}',
  ],
  pseudoCode: [
    'function canPartition(arr):',
    '    totalSum = sum of all elements',
    '    if totalSum is odd: return false',
    '    target = totalSum / 2',
    '    create boolean table dp of size (n+1) x (target+1)',
    '    for each row i: dp[i][0] = true',
    '        (empty subset always sums to 0)',
    '    for i from 1 to n:',
    '        for j from 1 to target:',
    '            dp[i][j] = can reach j without arr[i-1]',
    '            if arr[i-1] fits in j:',
    '                also true if reachable using arr[i-1]',
    '    return dp[n][target]',
  ],
  recurrence: 'dp[i][j] = dp[i-1][j] OR (j≥arr[i-1] AND dp[i-1][j-arr[i-1]])',
  baseCases: 'Base: dp[i][0] = true, dp[0][j>0] = false',
  timeComplexity: 'O(n×sum)',
  spaceComplexity: 'O(n×sum)',
};

export function buildPartitionTrace(arr: number[]): Step[] {
  const steps: Step[] = [];
  const n = arr.length;
  if (n === 0) return steps;

  const totalSum = arr.reduce((a, b) => a + b, 0);

  // Odd sum short-circuit
  if (totalSum % 2 !== 0) {
    steps.push({
      type: 'odd-sum-exit',
      dpArray: [],
      activeIndex: -1,
      fromIndices: [],
      codeLineActiveJava: 4,
      codeLineActivePseudo: 3,
      codeLineActive: 4,
      partitionArr: [...arr],
      totalSum,
      targetSum: undefined,
      dpTable: [],
      activeCell: null,
      sourceCells: [],
      msg: `Total sum = ${totalSum} is odd — cannot split into two equal halves. Answer: false (no table needed)`,
    });
    return steps;
  }

  const target = totalSum / 2;
  const table: (boolean | null)[][] = Array.from({ length: n + 1 }, () =>
    new Array(target + 1).fill(null)
  );

  const getFlatDp = () => table.flat();

  // Step 1: Init
  steps.push({
    type: 'init',
    dpArray: getFlatDp(),
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 7,
    codeLineActivePseudo: 5,
    codeLineActive: 7,
    partitionArr: [...arr],
    totalSum,
    targetSum: target,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    gridRows: n + 1,
    gridCols: target + 1,
    msg: `Total sum = ${totalSum} (even). Target subset sum = ${target}. Building (${n + 1})×(${target + 1}) boolean table.`,
  });

  // Step 2: Base case — dp[i][0] = true for all i
  for (let i = 0; i <= n; i++) {
    table[i][0] = true;
  }

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 9,
    codeLineActivePseudo: 6,
    codeLineActive: 9,
    partitionArr: [...arr],
    totalSum,
    targetSum: target,
    dpTable: table.map((r) => [...r]),
    activeCell: [0, 0],
    sourceCells: [],
    gridRows: n + 1,
    gridCols: target + 1,
    msg: `Base case: dp[i][0] = true for all i (empty subset always sums to 0)`,
  });

  // Step 3: Fill loop
  for (let i = 1; i <= n; i++) {
    const itemVal = arr[i - 1];

    for (let j = 1; j <= target; j++) {
      const excludeVal = table[i - 1][j] as boolean;

      if (j >= itemVal) {
        const includeVal = table[i - 1][j - itemVal] as boolean;
        const val = excludeVal || includeVal;
        table[i][j] = val;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (target + 1) + j,
          fromIndices: [
            (i - 1) * (target + 1) + j,
            (i - 1) * (target + 1) + (j - itemVal),
          ],
          codeLineActiveJava: 15,
          codeLineActivePseudo: 12,
          codeLineActive: 15,
          partitionArr: [...arr],
          totalSum,
          targetSum: target,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [
            [i - 1, j],
            [i - 1, j - itemVal],
          ],
          gridRows: n + 1,
          gridCols: target + 1,
          msg: `dp[${i}][${j}] = dp[${i - 1}][${j}] OR dp[${i - 1}][${j - itemVal}] = ${excludeVal ? 'T' : 'F'} OR ${includeVal ? 'T' : 'F'} = ${val ? 'T' : 'F'}`,
        });
      } else {
        const val = excludeVal;
        table[i][j] = val;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (target + 1) + j,
          fromIndices: [(i - 1) * (target + 1) + j],
          codeLineActiveJava: 13,
          codeLineActivePseudo: 10,
          codeLineActive: 13,
          partitionArr: [...arr],
          totalSum,
          targetSum: target,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [[i - 1, j]],
          gridRows: n + 1,
          gridCols: target + 1,
          msg: `dp[${i}][${j}] = dp[${i - 1}][${j}] = ${excludeVal ? 'T' : 'F'} (arr[${i - 1}]=${itemVal} > ${j}, doesn't fit)`,
        });
      }
    }
  }

  // Final Step: Done
  const finalAns = table[n][target] as boolean;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: n * (target + 1) + target,
    fromIndices: [],
    codeLineActiveJava: 19,
    codeLineActivePseudo: 13,
    codeLineActive: 19,
    partitionArr: [...arr],
    totalSum,
    targetSum: target,
    dpTable: table.map((r) => [...r]),
    activeCell: [n, target],
    sourceCells: [],
    gridRows: n + 1,
    gridCols: target + 1,
    msg: finalAns
      ? `Answer: TRUE — array can be partitioned into two subsets each summing to ${target}`
      : `Answer: FALSE — no valid partition exists`,
  });

  return steps;
}
