import type { ProblemMeta, Step } from '../problems/types';

export const UNIQUE_PATHS_META: ProblemMeta = {
  id: 'unique-paths',
  name: 'Unique Paths',
  category: 'Grid DP',
  description: 'Count unique paths from top-left to bottom-right in an m×n grid',
  javaCode: [
    'public int uniquePaths(int m, int n) {',
    '    int[][] dp = new int[m][n];',
    '    for (int i = 0; i < m; i++) {',
    '        dp[i][0] = 1;',
    '    }',
    '    for (int j = 0; j < n; j++) {',
    '        dp[0][j] = 1;',
    '    }',
    '    for (int i = 1; i < m; i++) {',
    '        for (int j = 1; j < n; j++) {',
    '            dp[i][j] = dp[i-1][j] + dp[i][j-1];',
    '        }',
    '    }',
    '    return dp[m-1][n-1];',
    '}',
  ],
  pseudoCode: [
    'function uniquePaths(m, n):',
    '    create table dp of size m x n',
    '    fill first column with 1s (only one way down)',
    '    fill first row with 1s (only one way across)',
    '    for i from 1 to m-1:',
    '        for j from 1 to n-1:',
    '            dp[i][j] = dp[i-1][j] + dp[i][j-1]',
    '    return dp[m-1][n-1]',
  ],
  recurrence: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]',
  baseCases: 'Base: dp[0][j] = 1, dp[i][0] = 1',
  timeComplexity: 'O(m×n)',
  spaceComplexity: 'O(m×n)',
};

export function buildUniquePathsTrace(m: number, n: number): Step[] {
  const steps: Step[] = [];
  if (m <= 0 || n <= 0) return steps;

  const table: (number | null)[][] = Array.from({ length: m }, () =>
    new Array(n).fill(null)
  );

  const getFlatDp = () => table.flat();

  // Step 1: Init
  steps.push({
    type: 'init',
    dpArray: getFlatDp(),
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 1,
    codeLineActivePseudo: 1,
    codeLineActive: 1,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    gridRows: m,
    gridCols: n,
    msg: `Initialize a ${m}×${n} grid. Robot starts at top-left (0,0), needs to reach bottom-right (${m - 1},${n - 1}).`,
  });

  // Step 2: Base case — set dp[i][0] = 1 and dp[0][j] = 1
  for (let i = 0; i < m; i++) {
    table[i][0] = 1;
  }
  for (let j = 0; j < n; j++) {
    table[0][j] = 1;
  }

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 3,
    codeLineActivePseudo: 3,
    codeLineActive: 3,
    dpTable: table.map((r) => [...r]),
    activeCell: [0, 0],
    sourceCells: [],
    gridRows: m,
    gridCols: n,
    msg: `Base case: only 1 way to reach any cell in the first row or first column (straight line path)`,
  });

  // Step 3: Fill loop
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const aboveVal = table[i - 1][j] as number;
      const leftVal = table[i][j - 1] as number;
      const val = aboveVal + leftVal;
      table[i][j] = val;

      steps.push({
        type: 'fill',
        dpArray: getFlatDp(),
        activeIndex: i * n + j,
        fromIndices: [(i - 1) * n + j, i * n + (j - 1)],
        codeLineActiveJava: 10,
        codeLineActivePseudo: 7,
        codeLineActive: 10,
        dpTable: table.map((r) => [...r]),
        activeCell: [i, j],
        sourceCells: [
          [i - 1, j],
          [i, j - 1],
        ],
        gridRows: m,
        gridCols: n,
        msg: `dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i}][${j - 1}] = ${aboveVal} + ${leftVal} = ${val}`,
      });
    }
  }

  // Final Done Step
  const ans = table[m - 1][n - 1] as number;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: (m - 1) * n + (n - 1),
    fromIndices: [],
    codeLineActiveJava: 13,
    codeLineActivePseudo: 8,
    codeLineActive: 13,
    dpTable: table.map((r) => [...r]),
    activeCell: [m - 1, n - 1],
    sourceCells: [],
    gridRows: m,
    gridCols: n,
    msg: `Answer: ${ans} unique paths from (0,0) to (${m - 1},${n - 1})`,
  });

  return steps;
}
