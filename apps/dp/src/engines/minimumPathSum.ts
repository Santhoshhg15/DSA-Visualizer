import type { ProblemMeta, Step } from '../problems/types';

export const MINIMUM_PATH_SUM_META: ProblemMeta = {
  id: 'minimum-path-sum',
  name: 'Minimum Path Sum',
  category: 'Grid DP',
  description: 'Path from top-left to bottom-right with minimum sum of cell costs',
  javaCode: [
    'public int minPathSum(int[][] grid) {',
    '    int m = grid.length, n = grid[0].length;',
    '    int[][] dp = new int[m][n];',
    '    dp[0][0] = grid[0][0];',
    '    for (int i = 1; i < m; i++) {',
    '        dp[i][0] = dp[i-1][0] + grid[i][0];',
    '    }',
    '    for (int j = 1; j < n; j++) {',
    '        dp[0][j] = dp[0][j-1] + grid[0][j];',
    '    }',
    '    for (int i = 1; i < m; i++) {',
    '        for (int j = 1; j < n; j++) {',
    '            dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);',
    '        }',
    '    }',
    '    return dp[m-1][n-1];',
    '}',
  ],
  pseudoCode: [
    'function minPathSum(grid):',
    '    dp[0][0] = grid[0][0]',
    '    fill first column: each cell = above cell + own cost',
    '    fill first row: each cell = left cell + own cost',
    '    for i from 1 to m-1:',
    '        for j from 1 to n-1:',
    '            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])',
    '    return dp[m-1][n-1]',
  ],
  recurrence: 'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])',
  baseCases: 'Base: dp[0][0] = grid[0][0]',
  timeComplexity: 'O(m×n)',
  spaceComplexity: 'O(m×n)',
};

export function buildMinPathSumTrace(costGrid: number[][]): Step[] {
  const steps: Step[] = [];
  const m = costGrid.length;
  if (m === 0) return steps;
  const n = costGrid[0].length;
  if (n === 0) return steps;

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
    costGrid: costGrid.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    gridRows: m,
    gridCols: n,
    msg: `Initialize dp table matching the ${m}×${n} cost grid. Each dp[i][j] will hold the minimum cost to reach that cell.`,
  });

  // Step 2: Base case — starting cell (0,0)
  table[0][0] = costGrid[0][0];

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 3,
    codeLineActivePseudo: 2,
    codeLineActive: 3,
    dpTable: table.map((r) => [...r]),
    costGrid: costGrid.map((r) => [...r]),
    activeCell: [0, 0],
    sourceCells: [],
    gridRows: m,
    gridCols: n,
    msg: `dp[0][0] = grid[0][0] = ${costGrid[0][0]} (starting cost)`,
  });

  // Step 3: Base case — first column (i from 1 to m-1)
  for (let i = 1; i < m; i++) {
    const prevVal = table[i - 1][0] as number;
    const ownCost = costGrid[i][0];
    const val = prevVal + ownCost;
    table[i][0] = val;

    steps.push({
      type: 'base',
      dpArray: getFlatDp(),
      activeIndex: i * n,
      fromIndices: [(i - 1) * n],
      codeLineActiveJava: 5,
      codeLineActivePseudo: 3,
      codeLineActive: 5,
      dpTable: table.map((r) => [...r]),
      costGrid: costGrid.map((r) => [...r]),
      activeCell: [i, 0],
      sourceCells: [[i - 1, 0]],
      gridRows: m,
      gridCols: n,
      msg: `dp[${i}][0] = dp[${i - 1}][0] + grid[${i}][0] = ${prevVal} + ${ownCost} = ${val} (only path: straight down)`,
    });
  }

  // Step 4: Base case — first row (j from 1 to n-1)
  for (let j = 1; j < n; j++) {
    const prevVal = table[0][j - 1] as number;
    const ownCost = costGrid[0][j];
    const val = prevVal + ownCost;
    table[0][j] = val;

    steps.push({
      type: 'base',
      dpArray: getFlatDp(),
      activeIndex: j,
      fromIndices: [j - 1],
      codeLineActiveJava: 8,
      codeLineActivePseudo: 4,
      codeLineActive: 8,
      dpTable: table.map((r) => [...r]),
      costGrid: costGrid.map((r) => [...r]),
      activeCell: [0, j],
      sourceCells: [[0, j - 1]],
      gridRows: m,
      gridCols: n,
      msg: `dp[0][${j}] = dp[0][${j - 1}] + grid[0][${j}] = ${prevVal} + ${ownCost} = ${val} (only path: straight across)`,
    });
  }

  // Step 5: Fill loop (i from 1 to m-1, j from 1 to n-1)
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const aboveVal = table[i - 1][j] as number;
      const leftVal = table[i][j - 1] as number;
      const ownCost = costGrid[i][j];
      const chosenMin = Math.min(aboveVal, leftVal);
      const val = ownCost + chosenMin;
      table[i][j] = val;

      steps.push({
        type: 'fill',
        dpArray: getFlatDp(),
        activeIndex: i * n + j,
        fromIndices: [(i - 1) * n + j, i * n + (j - 1)],
        codeLineActiveJava: 12,
        codeLineActivePseudo: 7,
        codeLineActive: 12,
        dpTable: table.map((r) => [...r]),
        costGrid: costGrid.map((r) => [...r]),
        activeCell: [i, j],
        sourceCells: [
          [i - 1, j],
          [i, j - 1],
        ],
        gridRows: m,
        gridCols: n,
        msg: `dp[${i}][${j}] = grid[${i}][${j}] + min(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${ownCost} + min(${aboveVal}, ${leftVal}) = ${ownCost} + ${chosenMin} = ${val}`,
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
    codeLineActiveJava: 15,
    codeLineActivePseudo: 9,
    codeLineActive: 15,
    dpTable: table.map((r) => [...r]),
    costGrid: costGrid.map((r) => [...r]),
    activeCell: [m - 1, n - 1],
    sourceCells: [],
    gridRows: m,
    gridCols: n,
    msg: `Answer: Minimum path sum from (0,0) to (${m - 1},${n - 1}) = ${ans}`,
  });

  return steps;
}
