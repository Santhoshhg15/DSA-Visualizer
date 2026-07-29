import type { ProblemMeta, Step } from './types';

export const CLIMBING_STAIRS_META: ProblemMeta = {
  id: 'climbing-stairs',
  name: 'Climbing Stairs',
  category: '1D Dynamic Programming',
  description: 'Count distinct ways to reach top stair using 1 or 2 steps at a time.',
  javaCode: [
    'public int climbStairs(int n) {',
    '    if (n <= 1) return 1;',
    '    int[] dp = new int[n + 1];',
    '    dp[0] = 1;',
    '    dp[1] = 1;',
    '    for (int i = 2; i <= n; i++) {',
    '        dp[i] = dp[i-1] + dp[i-2];',
    '    }',
    '    return dp[n];',
    '}'
  ],
  pseudoCode: [
    'function climbStairs(n):',
    '    if n <= 1: return 1',
    '    dp[0] = 1',
    '    dp[1] = 1',
    '    for i from 2 to n:',
    '        dp[i] = dp[i-1] + dp[i-2]',
    '    return dp[n]',
  ],
  recurrence: 'dp[i] = dp[i-1] + dp[i-2]',
  baseCases: 'Base: dp[0] = dp[1] = 1',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)'
};

export function buildClimbingStairsTrace(n: number): Step[] {
  const steps: Step[] = [];
  const dp: (number | null)[] = new Array(n + 1).fill(null);

  // 1. Init Step
  steps.push({
    type: 'init',
    dpArray: [...dp],
    activeIndex: -1,
    fromIndices: [],
    stairStep: 0,
    codeLineActiveJava: 3,
    codeLineActivePseudo: 1,
    codeLineActive: 3,
    msg: `Init: dp array size n+1 = ${n + 1}`
  });

  // 2. Base Case 0
  dp[0] = 1;
  steps.push({
    type: 'base',
    dpArray: [...dp],
    activeIndex: 0,
    fromIndices: [],
    stairStep: 0,
    codeLineActiveJava: 4,
    codeLineActivePseudo: 3,
    codeLineActive: 4,
    msg: 'Base: dp[0] = 1'
  });

  if (n >= 1) {
    // 3. Base Case 1
    dp[1] = 1;
    steps.push({
      type: 'base',
      dpArray: [...dp],
      activeIndex: 1,
      fromIndices: [],
      stairStep: 1,
      codeLineActiveJava: 5,
      codeLineActivePseudo: 4,
      codeLineActive: 5,
      msg: 'Base: dp[1] = 1'
    });
  }

  // 4. Fill Loop
  for (let i = 2; i <= n; i++) {
    const val1 = dp[i - 1] as number;
    const val2 = dp[i - 2] as number;
    const ans = val1 + val2;
    dp[i] = ans;

    steps.push({
      type: 'fill',
      dpArray: [...dp],
      activeIndex: i,
      fromIndices: [i - 2, i - 1], // [dp[i-2], dp[i-1]]
      stairStep: i,
      codeLineActiveJava: 7,
      codeLineActivePseudo: 6,
      codeLineActive: 7,
      msg: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${val1} + ${val2} = ${ans}`
    });
  }

  // 5. Done Step
  steps.push({
    type: 'done',
    dpArray: [...dp],
    activeIndex: -1,
    fromIndices: [],
    stairStep: n,
    codeLineActiveJava: 9,
    codeLineActivePseudo: 7,
    codeLineActive: 9,
    msg: `Answer: dp[${n}] = ${dp[n]} ways`
  });

  return steps;
}
