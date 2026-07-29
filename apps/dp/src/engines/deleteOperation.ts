import type { ProblemMeta, Step } from '../problems/types';

export const DELETE_OPERATION_META: ProblemMeta = {
  id: 'delete-operation',
  name: 'Delete Operation for Two Strings',
  category: 'String DP',
  description: 'Minimum deletions to make two strings equal by computing LCS first',
  javaCode: [
    'public int minDistance(String s1, String s2) {',
    '    int m = s1.length(), n = s2.length();',
    '    int[][] dp = new int[m + 1][n + 1];',
    '    for (int i = 1; i <= m; i++) {',
    '        for (int j = 1; j <= n; j++) {',
    '            if (s1.charAt(i-1) == s2.charAt(j-1)) {',
    '                dp[i][j] = dp[i-1][j-1] + 1;',
    '            } else {',
    '                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);',
    '            }',
    '        }',
    '    }',
    '    int lcsLength = dp[m][n];',
    '    return (m - lcsLength) + (n - lcsLength);',
    '}',
  ],
  pseudoCode: [
    'function minDistance(s1, s2):',
    '    compute LCS table dp exactly like LCS problem:',
    '        if s1[i-1] equals s2[j-1]:',
    '            dp[i][j] = dp[i-1][j-1] + 1',
    '        else:',
    '            dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    '    lcsLength = dp[m][n]',
    '    deletions in s1 = m - lcsLength',
    '    deletions in s2 = n - lcsLength',
    '    return deletions in s1 + deletions in s2',
  ],
  recurrence: 'if s1[i-1]=s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1 else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
  baseCases: 'Base: dp[0][j] = dp[i][0] = 0 | Answer = (m - LCS) + (n - LCS)',
  timeComplexity: 'O(m×n)',
  spaceComplexity: 'O(m×n)',
};

export function buildDeleteOpTrace(s1: string, s2: string): Step[] {
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
    deleteOpS1: s1,
    deleteOpS2: s2,
    matchType: null,
    deleteOpLcsLength: null,
    deleteOpAnswer: null,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    gridRows: m + 1,
    gridCols: n + 1,
    msg: `Initialize (${m + 1})×(${n + 1}) table. We'll compute LCS("${s1}", "${s2}") first, then derive the deletion count.`,
  });

  // Step 2: Base Cases
  for (let i = 0; i <= m; i++) table[i][0] = 0;
  for (let j = 0; j <= n; j++) table[0][j] = 0;

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 2,
    codeLineActivePseudo: 2,
    codeLineActive: 2,
    deleteOpS1: s1,
    deleteOpS2: s2,
    matchType: null,
    deleteOpLcsLength: null,
    deleteOpAnswer: null,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    gridRows: m + 1,
    gridCols: n + 1,
    msg: `Base case: LCS of empty string with anything is 0`,
  });

  // Step 3: Fill loop (LCS algorithm)
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = s1[i - 1];
      const char2 = s2[j - 1];

      if (char1 === char2) {
        const val = ((table[i - 1][j - 1] as number) ?? 0) + 1;
        table[i][j] = val;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (n + 1) + j,
          fromIndices: [(i - 1) * (n + 1) + (j - 1)],
          codeLineActiveJava: 6,
          codeLineActivePseudo: 4,
          codeLineActive: 6,
          deleteOpS1: s1,
          deleteOpS2: s2,
          matchType: 'match',
          deleteOpLcsLength: null,
          deleteOpAnswer: null,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [[i - 1, j - 1]],
          gridRows: m + 1,
          gridCols: n + 1,
          msg: `s1[${i - 1}]='${char1}' matches s2[${j - 1}]='${char2}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${val}`,
        });
      } else {
        const top = (table[i - 1][j] as number) ?? 0;
        const left = (table[i][j - 1] as number) ?? 0;
        const val = Math.max(top, left);
        table[i][j] = val;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (n + 1) + j,
          fromIndices: [(i - 1) * (n + 1) + j, i * (n + 1) + (j - 1)],
          codeLineActiveJava: 8,
          codeLineActivePseudo: 6,
          codeLineActive: 8,
          deleteOpS1: s1,
          deleteOpS2: s2,
          matchType: 'mismatch',
          deleteOpLcsLength: null,
          deleteOpAnswer: null,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [
            [i - 1, j],
            [i, j - 1],
          ],
          gridRows: m + 1,
          gridCols: n + 1,
          msg: `s1[${i - 1}]='${char1}' ≠ s2[${j - 1}]='${char2}' → dp[${i}][${j}] = max(${top}, ${left}) = ${val}`,
        });
      }
    }
  }

  // Final Step: Done
  const lcsLength = table[m][n] as number;
  const answer = (m - lcsLength) + (n - lcsLength);

  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: m * (n + 1) + n,
    fromIndices: [],
    codeLineActiveJava: 13,
    codeLineActivePseudo: 10,
    codeLineActive: 13,
    deleteOpS1: s1,
    deleteOpS2: s2,
    matchType: null,
    deleteOpLcsLength: lcsLength,
    deleteOpAnswer: answer,
    dpTable: table.map((r) => [...r]),
    activeCell: [m, n],
    sourceCells: [],
    gridRows: m + 1,
    gridCols: n + 1,
    msg: `LCS("${s1}", "${s2}") = ${lcsLength}. Deletions needed: (${m}-${lcsLength}) + (${n}-${lcsLength}) = ${answer}`,
  });

  return steps;
}
