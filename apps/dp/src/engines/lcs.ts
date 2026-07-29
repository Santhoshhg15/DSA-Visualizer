import type { ProblemMeta, Step } from '../problems/types';

export const LCS_META: ProblemMeta = {
  id: 'lcs',
  name: 'Longest Common Subsequence',
  category: 'Subsequence',
  description: 'Find length of longest subsequence common to two strings',
  javaCode: [
    'public int lcs(String s1, String s2) {',
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
    '    return dp[m][n];',
    '}',
  ],
  pseudoCode: [
    'function lcs(s1, s2):',
    '    create table dp of size (m+1) x (n+1), all 0',
    '    for i from 1 to m:',
    '        for j from 1 to n:',
    '            if s1[i-1] equals s2[j-1]:',
    '                dp[i][j] = dp[i-1][j-1] + 1',
    '            else:',
    '                dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    '    return dp[m][n]',
  ],
  recurrence: 'if s1[i-1] = s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1\nelse: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
  baseCases: 'Base: dp[0][j] = dp[i][0] = 0',
  timeComplexity: 'O(m × n)',
  spaceComplexity: 'O(m × n)',
};

export function buildLcsTrace(s1: string, s2: string): Step[] {
  const steps: Step[] = [];
  const m = s1.length;
  const n = s2.length;

  const table: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(null)
  );

  const getFlatDp = () => table.flat();

  // Step 1: init — table shape (m+1) x (n+1)
  steps.push({
    type: 'init',
    dpArray: getFlatDp(),
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 2,
    codeLineActivePseudo: 2,
    codeLineActive: 2,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    matchType: null,
    lcsStr1: s1,
    lcsStr2: s2,
    msg: `Initialize table of size (${m + 1})×(${n + 1}) for comparing "${s1}" and "${s2}"`,
  });

  // Step 2: base — dp[0][j]=0 and dp[i][0]=0 in one combined step
  for (let j = 0; j <= n; j++) table[0][j] = 0;
  for (let i = 0; i <= m; i++) table[i][0] = 0;

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 2,
    codeLineActivePseudo: 2,
    codeLineActive: 2,
    dpTable: table.map((r) => [...r]),
    activeCell: [0, 0],
    sourceCells: [],
    matchType: null,
    lcsStr1: s1,
    lcsStr2: s2,
    msg: `Base case: empty string has 0 common characters with anything`,
  });

  // Fill loop
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        const prev = table[i - 1][j - 1] as number;
        table[i][j] = prev + 1;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (n + 1) + j,
          fromIndices: [(i - 1) * (n + 1) + (j - 1)],
          codeLineActiveJava: 6,
          codeLineActivePseudo: 6,
          codeLineActive: 6,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [[i - 1, j - 1]],
          matchType: 'match',
          lcsStr1: s1,
          lcsStr2: s2,
          lcsMatch: true,
          msg: `s1[${i - 1}]='${s1[i - 1]}' matches s2[${j - 1}]='${s2[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${table[i][j]}`,
        });
      } else {
        const upVal = table[i - 1][j] as number;
        const leftVal = table[i][j - 1] as number;
        table[i][j] = Math.max(upVal, leftVal);

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (n + 1) + j,
          fromIndices: [(i - 1) * (n + 1) + j, i * (n + 1) + (j - 1)],
          codeLineActiveJava: 8,
          codeLineActivePseudo: 8,
          codeLineActive: 8,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [
            [i - 1, j],
            [i, j - 1],
          ],
          matchType: 'mismatch',
          lcsStr1: s1,
          lcsStr2: s2,
          lcsMatch: false,
          msg: `s1[${i - 1}]='${s1[i - 1]}' ≠ s2[${j - 1}]='${s2[j - 1]}' → dp[${i}][${j}] = max(${upVal}, ${leftVal}) = ${table[i][j]}`,
        });
      }
    }
  }

  // Done step
  const finalAns = table[m][n] as number;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: m * (n + 1) + n,
    fromIndices: [],
    codeLineActiveJava: 12,
    codeLineActivePseudo: 9,
    codeLineActive: 12,
    dpTable: table.map((r) => [...r]),
    activeCell: [m, n],
    sourceCells: [],
    matchType: null,
    lcsStr1: s1,
    lcsStr2: s2,
    msg: `Answer: LCS length of "${s1}" and "${s2}" = ${finalAns}`,
  });

  return steps;
}
