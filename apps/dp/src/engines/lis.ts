import type { LISCandidateState, ProblemMeta, Step } from '../problems/types';

export const LIS_META: ProblemMeta = {
  id: 'lis',
  name: 'Longest Increasing Subsequence',
  category: 'Subsequence',
  description: 'Length of longest strictly increasing subsequence',
  javaCode: [
    'public int lengthOfLIS(int[] arr) {',
    '    int n = arr.length;',
    '    int[] dp = new int[n];',
    '    Arrays.fill(dp, 1);',
    '    int maxLen = 1;',
    '    for (int i = 1; i < n; i++) {',
    '        for (int j = 0; j < i; j++) {',
    '            if (arr[j] < arr[i]) {',
    '                dp[i] = Math.max(dp[i], dp[j] + 1);',
    '            }',
    '        }',
    '        maxLen = Math.max(maxLen, dp[i]);',
    '    }',
    '    return maxLen;',
    '}',
  ],
  pseudoCode: [
    'function lengthOfLIS(arr):',
    '    dp[i] = 1 for every index (single element subsequence)',
    '    maxLen = 1',
    '    for i from 1 to n-1:',
    '        for j from 0 to i-1:',
    '            if arr[j] is smaller than arr[i]:',
    '                dp[i] = max(dp[i], dp[j] + 1)',
    '        update maxLen if dp[i] is larger',
    '    return maxLen',
  ],
  recurrence: 'dp[i] = max(dp[j] + 1) for all j < i where arr[j] < arr[i]',
  baseCases: 'Base: dp[i] = 1 for all i | Answer: max(dp[0..n-1])',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(n)',
};

export function buildLisTrace(arr: number[]): Step[] {
  const steps: Step[] = [];
  const n = arr.length;
  if (n === 0) return steps;

  const dp: (number | null)[] = new Array(n).fill(null);

  // Step 1: Init
  steps.push({
    type: 'init',
    dpArray: [...dp],
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 2,
    codeLineActivePseudo: 1,
    codeLineActive: 2,
    lisArr: [...arr],
    lisCandidateStates: [],
    lisMaxLenSoFar: 1,
    msg: `Initialize dp array. Each dp[i] will represent the length of the longest increasing subsequence ending at index i.`,
  });

  // Step 2: Base case — set dp[i] = 1 for all i
  for (let k = 0; k < n; k++) {
    dp[k] = 1;
  }

  steps.push({
    type: 'base',
    dpArray: [...dp],
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 4,
    codeLineActivePseudo: 2,
    codeLineActive: 4,
    lisArr: [...arr],
    lisCandidateStates: [],
    lisMaxLenSoFar: 1,
    msg: `Base case: every element is a subsequence of length 1 by itself`,
  });

  let maxLenSoFar = 1;

  // Step 3: Loop i from 1 to n-1
  for (let i = 1; i < n; i++) {
    const candidateStates: LISCandidateState[] = [];
    let bestValForI = 1;
    let bestJForI = -1;

    for (let j = 0; j < i; j++) {
      const qualifies = arr[j] < arr[i];

      if (qualifies) {
        const val = (dp[j] as number) + 1;
        if (val > bestValForI) {
          bestValForI = val;
          bestJForI = j;
        }

        // Re-evaluate previous candidate statuses so only the best qualified j gets 'evaluated-winning'
        candidateStates.forEach((cs) => {
          if (cs.qualifies) {
            if (cs.resultValue === bestValForI && cs.j === bestJForI) {
              cs.status = 'evaluated-winning';
            } else {
              cs.status = 'evaluated-losing';
            }
          }
        });

        candidateStates.push({
          j,
          arrJ: arr[j],
          qualifies: true,
          resultValue: val,
          status: val === bestValForI ? 'evaluated-winning' : 'evaluated-losing',
        });

        steps.push({
          type: 'candidate',
          dpArray: [...dp],
          activeIndex: i,
          fromIndices: [j],
          codeLineActiveJava: 9,
          codeLineActivePseudo: 7,
          codeLineActive: 9,
          lisArr: [...arr],
          lisCandidateStates: candidateStates.map((cs) => ({ ...cs })),
          lisMaxLenSoFar: maxLenSoFar,
          msg: `Checking j=${j}: arr[${j}]=${arr[j]} < arr[${i}]=${arr[i]} → candidate value dp[${j}]+1 = ${val}`,
        });
      } else {
        candidateStates.push({
          j,
          arrJ: arr[j],
          qualifies: false,
          resultValue: null,
          status: 'disqualified',
        });

        steps.push({
          type: 'candidate',
          dpArray: [...dp],
          activeIndex: i,
          fromIndices: [j],
          codeLineActiveJava: 8,
          codeLineActivePseudo: 6,
          codeLineActive: 8,
          lisArr: [...arr],
          lisCandidateStates: candidateStates.map((cs) => ({ ...cs })),
          lisMaxLenSoFar: maxLenSoFar,
          msg: `Checking j=${j}: arr[${j}]=${arr[j]} ≥ arr[${i}]=${arr[i]} → doesn't qualify, skip`,
        });
      }
    }

    // Commit dp[i]
    dp[i] = bestValForI;
    if (bestValForI > maxLenSoFar) {
      maxLenSoFar = bestValForI;
    }

    steps.push({
      type: 'fill',
      dpArray: [...dp],
      activeIndex: i,
      fromIndices: bestJForI !== -1 ? [bestJForI] : [],
      codeLineActiveJava: 12,
      codeLineActivePseudo: 8,
      codeLineActive: 12,
      lisArr: [...arr],
      lisCandidateStates: candidateStates.map((cs) => ({ ...cs })),
      lisMaxLenSoFar: maxLenSoFar,
      msg:
        bestJForI !== -1
          ? `dp[${i}] = ${bestValForI} (best predecessor: j=${bestJForI} with arr[${bestJForI}]=${arr[bestJForI]})`
          : `dp[${i}] = 1 (no smaller previous element found)`,
    });
  }

  // Final Step: Done
  const finalAnswer = Math.max(...(dp as number[]));
  const finalEndIndex = dp.indexOf(finalAnswer);

  steps.push({
    type: 'done',
    dpArray: [...dp],
    activeIndex: finalEndIndex,
    fromIndices: [],
    codeLineActiveJava: 14,
    codeLineActivePseudo: 9,
    codeLineActive: 14,
    lisArr: [...arr],
    lisCandidateStates: [],
    lisMaxLenSoFar: finalAnswer,
    msg: `Answer: Longest Increasing Subsequence length = ${finalAnswer} (found ending at index ${finalEndIndex})`,
  });

  return steps;
}
