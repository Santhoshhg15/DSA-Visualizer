import type { ProblemMeta, Step, ThreeWaySourceCell } from '../problems/types';

export const EDIT_DISTANCE_META: ProblemMeta = {
  id: 'edit-distance',
  name: 'Edit Distance',
  category: 'String DP',
  description: 'Minimum operations (insert, delete, replace) to convert s1 into s2',
  javaCode: [
    'public int minDistance(String s1, String s2) {',
    '    int m = s1.length(), n = s2.length();',
    '    int[][] dp = new int[m + 1][n + 1];',
    '    for (int i = 0; i <= m; i++) dp[i][0] = i;',
    '    for (int j = 0; j <= n; j++) dp[0][j] = j;',
    '    for (int i = 1; i <= m; i++) {',
    '        for (int j = 1; j <= n; j++) {',
    '            if (s1.charAt(i-1) == s2.charAt(j-1)) {',
    '                dp[i][j] = dp[i-1][j-1];',
    '            } else {',
    '                dp[i][j] = 1 + Math.min(dp[i-1][j-1],',
    '                           Math.min(dp[i-1][j], dp[i][j-1]));',
    '            }',
    '        }',
    '    }',
    '    return dp[m][n];',
    '}',
  ],
  pseudoCode: [
    'function minDistance(s1, s2):',
    '    dp[i][0] = i for all i (delete i chars)',
    '    dp[0][j] = j for all j (insert j chars)',
    '    for i from 1 to m:',
    '        for j from 1 to n:',
    '            if s1[i-1] equals s2[j-1]:',
    '                dp[i][j] = dp[i-1][j-1]',
    '                (no edit needed, carry diagonal forward)',
    '            else:',
    '                dp[i][j] = 1 + min(',
    '                    replace: dp[i-1][j-1],',
    '                    delete:  dp[i-1][j],',
    '                    insert:  dp[i][j-1])',
    '    return dp[m][n]',
  ],
  recurrence: 'if s1[i-1]=s2[j-1]: dp[i][j] = dp[i-1][j-1] else: dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])',
  baseCases: 'Base: dp[i][0] = i, dp[0][j] = j',
  timeComplexity: 'O(m×n)',
  spaceComplexity: 'O(m×n)',
};

export function buildEditDistanceTrace(s1: string, s2: string): Step[] {
  const steps: Step[] = [];
  const m = s1.length;
  const n = s2.length;

  const table: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(null)
  );

  const getFlatDp = () => table.flat();

  // Step 1: Init
  steps.push({
    type: 'init',
    dpArray: getFlatDp(),
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 2,
    codeLineActivePseudo: 1,
    codeLineActive: 2,
    editDistS1: s1,
    editDistS2: s2,
    matchType: null,
    winningOperation: null,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    gridRows: m + 1,
    gridCols: n + 1,
    msg: `Initialize (${m + 1})×(${n + 1}) table for converting "${s1}" into "${s2}"`,
  });

  // Step 2: Base Cases (both borders at once)
  for (let i = 0; i <= m; i++) table[i][0] = i;
  for (let j = 0; j <= n; j++) table[0][j] = j;

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 3,
    codeLineActivePseudo: 2,
    codeLineActive: 3,
    editDistS1: s1,
    editDistS2: s2,
    matchType: null,
    winningOperation: null,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    gridRows: m + 1,
    gridCols: n + 1,
    msg: `Base case: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars)`,
  });

  // Step 3: Fill loop
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = s1[i - 1];
      const char2 = s2[j - 1];

      if (char1 === char2) {
        const matchVal = table[i - 1][j - 1] as number;
        table[i][j] = matchVal;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (n + 1) + j,
          fromIndices: [(i - 1) * (n + 1) + (j - 1)],
          codeLineActiveJava: 8,
          codeLineActivePseudo: 7,
          codeLineActive: 8,
          editDistS1: s1,
          editDistS2: s2,
          matchType: 'match',
          winningOperation: null,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [[i - 1, j - 1]],
          gridRows: m + 1,
          gridCols: n + 1,
          msg: `s1[${i - 1}]='${char1}' matches s2[${j - 1}]='${char2}' → no edit needed, dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${matchVal}`,
        });
      } else {
        const replaceVal = table[i - 1][j - 1] as number;
        const deleteVal = table[i - 1][j] as number;
        const insertVal = table[i][j - 1] as number;

        const minVal = Math.min(replaceVal, deleteVal, insertVal);
        table[i][j] = 1 + minVal;

        const winningOp: 'replace' | 'delete' | 'insert' =
          replaceVal === minVal
            ? 'replace'
            : deleteVal === minVal
            ? 'delete'
            : 'insert';

        const threeWay: ThreeWaySourceCell[] = [
          { cell: [i - 1, j - 1], operation: 'replace', isWinner: winningOp === 'replace' },
          { cell: [i - 1, j], operation: 'delete', isWinner: winningOp === 'delete' },
          { cell: [i, j - 1], operation: 'insert', isWinner: winningOp === 'insert' },
        ];

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (n + 1) + j,
          fromIndices: [
            (i - 1) * (n + 1) + (j - 1),
            (i - 1) * (n + 1) + j,
            i * (n + 1) + (j - 1),
          ],
          codeLineActiveJava: 10,
          codeLineActivePseudo: 10,
          codeLineActive: 10,
          editDistS1: s1,
          editDistS2: s2,
          matchType: 'mismatch',
          winningOperation: winningOp,
          threeWaySourceCells: threeWay,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [
            [i - 1, j - 1],
            [i - 1, j],
            [i, j - 1],
          ],
          gridRows: m + 1,
          gridCols: n + 1,
          msg: `s1[${i - 1}]='${char1}' ≠ s2[${j - 1}]='${char2}' → dp[${i}][${j}] = 1 + min(replace:${replaceVal}, delete:${deleteVal}, insert:${insertVal}) = 1 + ${minVal} = ${table[i][j]} → ${winningOp.toUpperCase()} wins`,
        });
      }
    }
  }

  // Final Step: Done
  const finalAns = table[m][n] as number;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: m * (n + 1) + n,
    fromIndices: [],
    codeLineActiveJava: 15,
    codeLineActivePseudo: 13,
    codeLineActive: 15,
    editDistS1: s1,
    editDistS2: s2,
    matchType: null,
    winningOperation: null,
    dpTable: table.map((r) => [...r]),
    activeCell: [m, n],
    sourceCells: [],
    gridRows: m + 1,
    gridCols: n + 1,
    msg: `Answer: Minimum edit distance from "${s1}" to "${s2}" = ${finalAns} operations`,
  });

  return steps;
}
