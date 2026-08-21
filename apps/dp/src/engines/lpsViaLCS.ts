import type { ProblemMeta, Step } from '../problems/types';

export const LPS_VIA_LCS_META: ProblemMeta = {
  id: 'lps-via-lcs',
  name: 'Longest Palindromic Subsequence — via LCS',
  category: 'Subsequence',
  description: 'Reverse the string, then find LCS of the original and reversed',
  javaCode: [
    "public int longestPalinSubseqUsingLCS(String s) {",
    "    String reversed = new StringBuilder(s)",
    "                          .reverse().toString();",
    "    int n = s.length();",
    "    int[][] dp = new int[n + 1][n + 1];",
    "    for (int i = 1; i <= n; i++) {",
    "        for (int j = 1; j <= n; j++) {",
    "            if (s.charAt(i-1) == reversed.charAt(j-1)) {",
    "                dp[i][j] = dp[i-1][j-1] + 1;",
    "            } else {",
    "                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);",
    "            }",
    "        }",
    "    }",
    "    return dp[n][n];",
    "}",
  ],
  pseudoCode: [
    "function longestPalinSubseqUsingLCS(s):",
    "    reversed = s written backwards",
    "    build an (n+1) x (n+1) table dp",
    "    for i from 1 to n:",
    "        for j from 1 to n:",
    "            if s[i-1] equals reversed[j-1]:",
    "                dp[i][j] = dp[i-1][j-1] + 1",
    "            else:",
    "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
    "    return dp[n][n]",
    "        (this is LCS(s, reversed) = LPS(s))",
  ],
  recurrence: 'if s[i-1] = rev[j-1]: dp[i][j] = dp[i-1][j-1] + 1\nelse: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\nAnswer: dp[n][n] = LCS(s, reverse(s)) = LPS(s)',
  baseCases: 'Base: dp[0][j] = dp[i][0] = 0',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(n²)',
};

export function buildLpsViaLcsTrace(s: string): Step[] {
  const steps: Step[] = [];
  const n = s.length;
  const reversed = s.split('').reverse().join('');

  const table: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    new Array(n + 1).fill(null)
  );

  const getFlatDp = () => table.flat();

  // Step 1: init
  steps.push({
    type: 'init',
    dpArray: getFlatDp(),
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 5,
    codeLineActivePseudo: 3,
    codeLineActive: 5,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    matchType: null,
    lpsString: s,
    msg: `Reverse "${s}" → "${reversed}". Now find the LCS of these two strings — that IS the longest palindromic subsequence.`,
  });

  // Step 2: base cases
  for (let j = 0; j <= n; j++) table[0][j] = 0;
  for (let i = 0; i <= n; i++) table[i][0] = 0;

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 5,
    codeLineActivePseudo: 3,
    codeLineActive: 5,
    dpTable: table.map((r) => [...r]),
    activeCell: [0, 0],
    sourceCells: [],
    matchType: null,
    lpsString: s,
    msg: `Base case: empty string has 0 common characters with anything`,
  });

  // Fill loop
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === reversed[j - 1]) {
        const prev = table[i - 1][j - 1] as number;
        table[i][j] = prev + 1;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (n + 1) + j,
          fromIndices: [(i - 1) * (n + 1) + (j - 1)],
          codeLineActiveJava: 9,
          codeLineActivePseudo: 6,
          codeLineActive: 9,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [[i - 1, j - 1]],
          matchType: 'match',
          lpsString: s,
          msg: `s[${i - 1}]='${s[i - 1]}' matches reversed[${j - 1}]='${reversed[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${table[i][j]}`,
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
          codeLineActiveJava: 11,
          codeLineActivePseudo: 8,
          codeLineActive: 11,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [
            [i - 1, j],
            [i, j - 1],
          ],
          matchType: 'mismatch',
          lpsString: s,
          msg: `s[${i - 1}]='${s[i - 1]}' ≠ reversed[${j - 1}]='${reversed[j - 1]}' → dp[${i}][${j}] = max(${upVal}, ${leftVal}) = ${table[i][j]}`,
        });
      }
    }
  }

  // Done step
  const finalAns = table[n][n] as number;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: n * (n + 1) + n,
    fromIndices: [],
    codeLineActiveJava: 15,
    codeLineActivePseudo: 9,
    codeLineActive: 15,
    dpTable: table.map((r) => [...r]),
    activeCell: [n, n],
    sourceCells: [],
    matchType: null,
    lpsString: s,
    msg: `Answer: LCS("${s}", "${reversed}") = ${finalAns} → longest palindromic subsequence has length ${finalAns}`,
  });

  return steps;
}
