import type { ProblemMeta, Step } from '../problems/types';

export const TARGET_SUM_META: ProblemMeta = {
  id: 'target-sum',
  name: 'Target Sum',
  category: 'Grid DP',
  description: 'Count ways to assign + / - signs to array elements to reach target sum',
  javaCode: [
    'public int findTargetSumWays(int[] arr, int target) {',
    '    int totalSum = 0;',
    '    for (int num : arr) totalSum += num;',
    '    if ((target + totalSum) % 2 != 0',
    '        || Math.abs(target) > totalSum) {',
    '        return 0;',
    '    }',
    '    int subsetSum = (target + totalSum) / 2;',
    '    int n = arr.length;',
    '    int[][] dp = new int[n + 1][subsetSum + 1];',
    '    dp[0][0] = 1;',
    '    for (int i = 1; i <= n; i++) {',
    '        for (int j = 0; j <= subsetSum; j++) {',
    '            dp[i][j] = dp[i-1][j];',
    '            if (j >= arr[i-1]) {',
    '                dp[i][j] += dp[i-1][j-arr[i-1]];',
    '            }',
    '        }',
    '    }',
    '    return dp[n][subsetSum];',
    '}',
  ],
  pseudoCode: [
    'function findTargetSumWays(arr, target):',
    '    totalSum = sum of all elements',
    '    if (target+totalSum) is odd or target too extreme:',
    '        return 0 (no valid assignment exists)',
    '    subsetSum = (target + totalSum) / 2',
    '        (this becomes our new derived target)',
    '    dp[0][0] = 1 (one way: empty subset sums to 0)',
    '    for i from 1 to n:',
    '        for j from 0 to subsetSum:',
    '            dp[i][j] = ways without arr[i-1]',
    '            if arr[i-1] fits in j:',
    '                add ways using arr[i-1]',
    '    return dp[n][subsetSum]',
  ],
  recurrence: 'dp[i][j] = dp[i-1][j] + (j≥arr[i-1] ? dp[i-1][j-arr[i-1]] : 0)',
  baseCases: 'Base: dp[0][0] = 1, dp[0][j>0] = 0',
  timeComplexity: 'O(n×sum)',
  spaceComplexity: 'O(n×sum)',
};

export function buildTargetSumTrace(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  const n = arr.length;
  if (n === 0) return steps;

  const totalSum = arr.reduce((a, b) => a + b, 0);

  // Short-circuit condition
  if (
    (target + totalSum) % 2 !== 0 ||
    Math.abs(target) > totalSum ||
    target + totalSum < 0
  ) {
    steps.push({
      type: 'short-circuit',
      dpArray: [],
      activeIndex: -1,
      fromIndices: [],
      codeLineActiveJava: 5,
      codeLineActivePseudo: 4,
      codeLineActive: 5,
      targetSumArr: [...arr],
      totalSum,
      targetSumTarget: target,
      derivedTarget: undefined,
      dpTable: [],
      activeCell: null,
      sourceCells: [],
      msg: `(target + totalSum) is odd, OR |target| exceeds totalSum — no valid sign assignment exists. Answer: 0`,
    });
    return steps;
  }

  const derivedTarget = (target + totalSum) / 2;
  const table: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    new Array(derivedTarget + 1).fill(null)
  );

  const getFlatDp = () => table.flat();

  // Step 1: Init
  steps.push({
    type: 'init',
    dpArray: getFlatDp(),
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 9,
    codeLineActivePseudo: 5,
    codeLineActive: 9,
    targetSumArr: [...arr],
    totalSum,
    targetSumTarget: target,
    derivedTarget,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    gridRows: n + 1,
    gridCols: derivedTarget + 1,
    msg: `totalSum=${totalSum}, target=${target} → derived subset sum target = ${derivedTarget}. Building (${n + 1})×(${derivedTarget + 1}) table.`,
  });

  // Step 2: Base case — dp[0][0] = 1
  table[0][0] = 1;

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 11,
    codeLineActivePseudo: 7,
    codeLineActive: 11,
    targetSumArr: [...arr],
    totalSum,
    targetSumTarget: target,
    derivedTarget,
    dpTable: table.map((r) => [...r]),
    activeCell: [0, 0],
    sourceCells: [],
    gridRows: n + 1,
    gridCols: derivedTarget + 1,
    msg: `dp[0][0] = 1 (one way: use no elements, sum = 0)`,
  });

  // Step 3: Fill loop
  for (let i = 1; i <= n; i++) {
    const itemVal = arr[i - 1];

    for (let j = 0; j <= derivedTarget; j++) {
      const excludeVal = (table[i - 1][j] as number | null) ?? 0;

      if (j >= itemVal) {
        const includeVal = (table[i - 1][j - itemVal] as number | null) ?? 0;
        const val = excludeVal + includeVal;
        table[i][j] = val;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (derivedTarget + 1) + j,
          fromIndices: [
            (i - 1) * (derivedTarget + 1) + j,
            (i - 1) * (derivedTarget + 1) + (j - itemVal),
          ],
          codeLineActiveJava: 16,
          codeLineActivePseudo: 12,
          codeLineActive: 16,
          targetSumArr: [...arr],
          totalSum,
          targetSumTarget: target,
          derivedTarget,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [
            [i - 1, j],
            [i - 1, j - itemVal],
          ],
          gridRows: n + 1,
          gridCols: derivedTarget + 1,
          msg: `dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i - 1}][${j - itemVal}] = ${excludeVal} + ${includeVal} = ${val}`,
        });
      } else {
        const val = excludeVal;
        table[i][j] = val;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (derivedTarget + 1) + j,
          fromIndices: [(i - 1) * (derivedTarget + 1) + j],
          codeLineActiveJava: 14,
          codeLineActivePseudo: 10,
          codeLineActive: 14,
          targetSumArr: [...arr],
          totalSum,
          targetSumTarget: target,
          derivedTarget,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [[i - 1, j]],
          gridRows: n + 1,
          gridCols: derivedTarget + 1,
          msg: `dp[${i}][${j}] = dp[${i - 1}][${j}] = ${excludeVal} (arr[${i - 1}]=${itemVal} > ${j})`,
        });
      }
    }
  }

  // Final Step: Done
  const finalAns = table[n][derivedTarget] as number;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: n * (derivedTarget + 1) + derivedTarget,
    fromIndices: [],
    codeLineActiveJava: 20,
    codeLineActivePseudo: 13,
    codeLineActive: 20,
    targetSumArr: [...arr],
    totalSum,
    targetSumTarget: target,
    derivedTarget,
    dpTable: table.map((r) => [...r]),
    activeCell: [n, derivedTarget],
    sourceCells: [],
    gridRows: n + 1,
    gridCols: derivedTarget + 1,
    msg: `Answer: ${finalAns} way(s) to assign +/- signs so the expression equals ${target}`,
  });

  return steps;
}
