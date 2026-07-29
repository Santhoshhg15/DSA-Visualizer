import type { ProblemMeta, Step } from '../problems/types';

export const LPS_META: ProblemMeta = {
  id: 'lps',
  name: 'Longest Palindromic Subsequence',
  category: 'Subsequence',
  description: 'Find length of longest subsequence that reads same forwards and backwards',
  javaCode: [
    'public int longestPalinSubseq(String s) {',
    '    int n = s.length();',
    '    int[][] dp = new int[n][n];',
    '    for (int i = 0; i < n; i++) {',
    '        dp[i][i] = 1;',
    '    }',
    '    for (int len = 2; len <= n; len++) {',
    '        for (int i = 0; i <= n - len; i++) {',
    '            int j = i + len - 1;',
    '            if (s.charAt(i) == s.charAt(j)) {',
    '                dp[i][j] = (len == 2) ? 2 : dp[i+1][j-1] + 2;',
    '            } else {',
    '                dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);',
    '            }',
    '        }',
    '    }',
    '    return dp[0][n-1];',
    '}',
  ],
  pseudoCode: [
    'function longestPalinSubseq(s):',
    '    dp[i][i] = 1 for every single character',
    '    for length from 2 to n:',
    '        for each starting index i of that length:',
    '            j = ending index of this substring',
    '            if s[i] equals s[j]:',
    '                dp[i][j] = dp[i+1][j-1] + 2',
    '                (or just 2 if length is exactly 2)',
    '            else:',
    '                dp[i][j] = max(dp[i+1][j], dp[i][j-1])',
    '    return dp[0][n-1]',
  ],
  recurrence: 'if s[i]=s[j]: dp[i][j] = dp[i+1][j-1] + 2\nelse: dp[i][j] = max(dp[i+1][j], dp[i][j-1])',
  baseCases: 'Base: dp[i][i] = 1',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(n²)',
};

export function buildLpsTrace(s: string): Step[] {
  const steps: Step[] = [];
  const n = s.length;
  if (n === 0) return steps;

  const table: (number | null)[][] = Array.from({ length: n }, () =>
    new Array(n).fill(null)
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
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    matchType: null,
    currentLength: 1,
    lpsString: s,
    msg: `Initialize (${n}×${n}) table for string "${s}". Only the upper triangle (j ≥ i) will be used.`,
  });

  // Step 2: Base case — main diagonal dp[i][i] = 1
  for (let i = 0; i < n; i++) {
    table[i][i] = 1;
  }

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 4,
    codeLineActivePseudo: 2,
    codeLineActive: 4,
    dpTable: table.map((r) => [...r]),
    activeCell: [0, 0],
    sourceCells: [],
    matchType: null,
    currentLength: 1,
    lpsString: s,
    msg: `Base case: every single character is a palindrome of length 1 (main diagonal)`,
  });

  // Step 3: Fill loop by increasing length
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;

      if (s[i] === s[j]) {
        if (len === 2) {
          table[i][j] = 2;
          steps.push({
            type: 'fill',
            dpArray: getFlatDp(),
            activeIndex: i * n + j,
            fromIndices: [],
            codeLineActiveJava: 11,
            codeLineActivePseudo: 7,
            codeLineActive: 11,
            dpTable: table.map((r) => [...r]),
            activeCell: [i, j],
            sourceCells: [],
            matchType: 'match',
            currentLength: len,
            lpsString: s,
            msg: `s[${i}]='${s[i]}' matches s[${j}]='${s[j]}' (adjacent) → dp[${i}][${j}] = 2`,
          });
        } else {
          const prevVal = table[i + 1][j - 1] as number;
          const val = prevVal + 2;
          table[i][j] = val;

          steps.push({
            type: 'fill',
            dpArray: getFlatDp(),
            activeIndex: i * n + j,
            fromIndices: [(i + 1) * n + (j - 1)],
            codeLineActiveJava: 11,
            codeLineActivePseudo: 7,
            codeLineActive: 11,
            dpTable: table.map((r) => [...r]),
            activeCell: [i, j],
            sourceCells: [[i + 1, j - 1]],
            matchType: 'match',
            currentLength: len,
            lpsString: s,
            msg: `s[${i}]='${s[i]}' matches s[${j}]='${s[j]}' → dp[${i}][${j}] = dp[${i + 1}][${j - 1}] + 2 = ${val}`,
          });
        }
      } else {
        const belowVal = table[i + 1][j] as number;
        const leftVal = table[i][j - 1] as number;
        const val = Math.max(belowVal, leftVal);
        table[i][j] = val;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * n + j,
          fromIndices: [(i + 1) * n + j, i * n + (j - 1)],
          codeLineActiveJava: 13,
          codeLineActivePseudo: 10,
          codeLineActive: 13,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [
            [i + 1, j],
            [i, j - 1],
          ],
          matchType: 'mismatch',
          currentLength: len,
          lpsString: s,
          msg: `s[${i}]='${s[i]}' ≠ s[${j}]='${s[j]}' → dp[${i}][${j}] = max(${belowVal}, ${leftVal}) = ${val}`,
        });
      }
    }
  }

  // Final Done step
  const finalAns = table[0][n - 1] as number;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: n - 1,
    fromIndices: [],
    codeLineActiveJava: 18,
    codeLineActivePseudo: 11,
    codeLineActive: 18,
    dpTable: table.map((r) => [...r]),
    activeCell: [0, n - 1],
    sourceCells: [],
    matchType: null,
    currentLength: n,
    lpsString: s,
    msg: `Answer: Longest palindromic subsequence in "${s}" has length ${finalAns}`,
  });

  return steps;
}
