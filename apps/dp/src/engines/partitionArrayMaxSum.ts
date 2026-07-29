import type { ProblemMeta, Step } from '../problems/types';

export const PARTITION_ARRAY_MAX_SUM_META: ProblemMeta = {
  id: 'partition-array-max-sum',
  name: 'Partition Array for Maximum Sum',
  category: 'String DP',
  description: 'Maximize sum by partitioning array into contiguous subarrays of length at most k',
  javaCode: [
    'public int maxSumAfterPartitioning(int[] arr, int k) {',
    '    int n = arr.length;',
    '    int[] dp = new int[n + 1];',
    '    dp[0] = 0;',
    '    for (int i = 1; i <= n; i++) {',
    '        int maxInWindow = 0;',
    '        for (int L = 1; L <= Math.min(k, i); L++) {',
    '            maxInWindow = Math.max(maxInWindow, arr[i-L]);',
    '            dp[i] = Math.max(dp[i], dp[i-L] + maxInWindow * L);',
    '        }',
    '    }',
    '    return dp[n];',
    '}',
  ],
  pseudoCode: [
    'function maxSumAfterPartitioning(arr, k):',
    '    dp[0] = 0',
    '    for i from 1 to n:',
    '        maxInWindow = 0',
    '        for windowLength L from 1 to min(k, i):',
    '            expand window to include arr[i-L]',
    '            maxInWindow = max(maxInWindow, arr[i-L])',
    '            candidate = dp[i-L] + maxInWindow × L',
    '            dp[i] = max(dp[i], candidate)',
    '    return dp[n]',
  ],
  recurrence: 'dp[i] = max over L in [1,k] of (dp[i-L] + max(arr[i-L..i-1])×L)',
  baseCases: 'Base: dp[0] = 0',
  timeComplexity: 'O(n×k)',
  spaceComplexity: 'O(n)',
};

export interface PartitionWindowCandidateState {
  L: number;
  windowStart: number;
  windowEnd: number;
  maxInWindow: number;
  candidateValue: number;
  status: 'pending' | 'evaluated-losing' | 'evaluated-winning';
}

export function buildPartitionMaxSumTrace(arr: number[], k: number): Step[] {
  const steps: Step[] = [];
  const n = arr.length;

  const dp: (number | null)[] = new Array(n + 1).fill(null);

  // Step 1: Init
  steps.push({
    type: 'init',
    dpArray: [...dp],
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 2,
    codeLineActivePseudo: 1,
    codeLineActive: 2,
    partitionArr: arr,
    targetSum: k,
    msg: `Initialize dp array. For each position, we'll try partition windows of length 1 to ${k} ending there.`,
  });

  // Step 2: Base case
  dp[0] = 0;
  steps.push({
    type: 'base',
    dpArray: [...dp],
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 4,
    codeLineActivePseudo: 2,
    codeLineActive: 4,
    partitionArr: arr,
    targetSum: k,
    msg: `dp[0] = 0 (empty prefix has sum 0)`,
  });

  // Step 3: Fill loop
  for (let i = 1; i <= n; i++) {
    const maxK = Math.min(k, i);

    // Build initial pending candidates list for position i
    const candidates: PartitionWindowCandidateState[] = [];
    for (let L = 1; L <= maxK; L++) {
      candidates.push({
        L,
        windowStart: i - L,
        windowEnd: i - 1,
        maxInWindow: 0,
        candidateValue: 0,
        status: 'pending',
      });
    }

    let bestVal = -1;
    let bestL = 1;
    let maxInWindow = 0;

    for (let L = 1; L <= maxK; L++) {
      const windowElem = arr[i - L];
      maxInWindow = Math.max(maxInWindow, windowElem);
      const prevDp = (dp[i - L] as number) ?? 0;
      const candidateVal = prevDp + maxInWindow * L;

      if (candidateVal > bestVal) {
        bestVal = candidateVal;
        bestL = L;
      }

      // Update candidate states so far
      const currentCandidates = candidates.map((cand) => {
        if (cand.L > L) return { ...cand };
        const isCurrentBest = cand.L === bestL;
        return {
          ...cand,
          maxInWindow: Math.max(...arr.slice(i - cand.L, i)),
          candidateValue: ((dp[i - cand.L] as number) ?? 0) + Math.max(...arr.slice(i - cand.L, i)) * cand.L,
          status: (cand.L === bestL ? 'evaluated-winning' : 'evaluated-losing') as 'evaluated-winning' | 'evaluated-losing',
        };
      });

      steps.push({
        type: 'candidate',
        dpArray: [...dp],
        activeIndex: i,
        fromIndices: [i - L],
        codeLineActiveJava: 8,
        codeLineActivePseudo: 8,
        codeLineActive: 8,
        partitionArr: arr,
        targetSum: k,
        activeWindow: [i - L, i - 1],
        partitionCandidates: currentCandidates,
        candidateStates: currentCandidates as any,
        msg: `Window L=${L}: elements [${i - L}..${i - 1}] = [${arr.slice(i - L, i).join(',')}], max=${maxInWindow} → candidate = dp[${i - L}] + ${maxInWindow}×${L} = ${prevDp} + ${maxInWindow * L} = ${candidateVal}`,
      });
    }

    // Commit best candidate to dp[i]
    dp[i] = bestVal;

    const finalCandidates = candidates.map((cand) => ({
      ...cand,
      maxInWindow: Math.max(...arr.slice(i - cand.L, i)),
      candidateValue: ((dp[i - cand.L] as number) ?? 0) + Math.max(...arr.slice(i - cand.L, i)) * cand.L,
      status: (cand.L === bestL ? 'evaluated-winning' : 'evaluated-losing') as 'evaluated-winning' | 'evaluated-losing',
    }));

    steps.push({
      type: 'fill',
      dpArray: [...dp],
      activeIndex: i,
      fromIndices: [i - bestL],
      codeLineActiveJava: 9,
      codeLineActivePseudo: 9,
      codeLineActive: 9,
      partitionArr: arr,
      targetSum: k,
      activeWindow: null,
      partitionCandidates: finalCandidates,
      candidateStates: finalCandidates as any,
      msg: `dp[${i}] = ${bestVal} (best: window length L=${bestL})`,
    });
  }

  // Final Step: Done
  steps.push({
    type: 'done',
    dpArray: [...dp],
    activeIndex: n,
    fromIndices: [],
    codeLineActiveJava: 12,
    codeLineActivePseudo: 10,
    codeLineActive: 12,
    partitionArr: arr,
    targetSum: k,
    activeWindow: null,
    msg: `Answer: Maximum sum after partitioning = ${dp[n]}`,
  });

  return steps;
}
