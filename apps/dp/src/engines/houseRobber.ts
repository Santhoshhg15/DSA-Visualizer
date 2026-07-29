import type { ProblemMeta, Step } from '../problems/types';

export const HOUSE_ROBBER_META: ProblemMeta = {
  id: 'house-robber',
  name: 'House Robber',
  category: '1D DP',
  description: 'Maximize total money robbed without robbing two adjacent houses.',
  javaCode: [
    'public int rob(int[] houses) {',
    '    int n = houses.length;',
    '    if (n == 0) return 0;',
    '    if (n == 1) return houses[0];',
    '    int[] dp = new int[n];',
    '    dp[0] = houses[0];',
    '    dp[1] = Math.max(houses[0], houses[1]);',
    '    for (int i = 2; i < n; i++) {',
    '        dp[i] = Math.max(dp[i-1], dp[i-2] + houses[i]);',
    '    }',
    '    return dp[n-1];',
    '}'
  ],
  pseudoCode: [
    'function rob(houses):',
    '    if houses is empty: return 0',
    '    if only one house: return its value',
    '    dp[0] = value of house 0',
    '    dp[1] = max(house 0, house 1)',
    '    for i from 2 to n-1:',
    '        dp[i] = max(skip house i, rob house i)',
    '    return dp[n-1]',
  ],
  recurrence: 'dp[i] = max(dp[i-1], dp[i-2] + houses[i])',
  baseCases: 'Base: dp[0] = houses[0], dp[1] = max(houses[0], houses[1])',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)'
};

export function buildHouseRobberTrace(houses: number[]): Step[] {
  const steps: Step[] = [];
  const n = houses.length;
  if (n === 0) return steps;

  const dp: (number | null)[] = new Array(n).fill(null);

  // 1. Init step
  steps.push({
    type: 'init',
    dpArray: [...dp],
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 5,
    codeLineActivePseudo: 1,
    codeLineActive: 5,
    houses: [...houses],
    decision: null,
    robbedIndices: [],
    msg: `Init: dp array of size n = ${n}`
  });

  // 2. Base Case 0
  dp[0] = houses[0];
  steps.push({
    type: 'base',
    dpArray: [...dp],
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 6,
    codeLineActivePseudo: 4,
    codeLineActive: 6,
    houses: [...houses],
    decision: 'rob',
    robbedIndices: [],
    msg: `Base: dp[0] = $${houses[0]}`
  });

  if (n > 1) {
    // 3. Base Case 1
    const rob1Decision: 'rob' | 'skip' = houses[1] > houses[0] ? 'rob' : 'skip';
    dp[1] = Math.max(houses[0], houses[1]);
    steps.push({
      type: 'base',
      dpArray: [...dp],
      activeIndex: 1,
      fromIndices: [0],
      codeLineActiveJava: 7,
      codeLineActivePseudo: 5,
      codeLineActive: 7,
      houses: [...houses],
      decision: rob1Decision,
      robbedIndices: [],
      msg: `Base: dp[1] = max($${houses[0]}, $${houses[1]}) = $${dp[1]}`
    });
  }

  // 4. Fill Loop
  for (let i = 2; i < n; i++) {
    const skipVal = dp[i - 1] as number;
    const robVal = (dp[i - 2] as number) + houses[i];
    const chosenVal = Math.max(skipVal, robVal);
    dp[i] = chosenVal;
    const isRob = robVal > skipVal;

    steps.push({
      type: 'fill',
      dpArray: [...dp],
      activeIndex: i,
      fromIndices: [i - 2, i - 1],
      codeLineActiveJava: 9,
      codeLineActivePseudo: 7,
      codeLineActive: 9,
      houses: [...houses],
      decision: isRob ? 'rob' : 'skip',
      robbedIndices: [],
      msg: isRob
        ? `dp[${i}] = max($${skipVal}, $${dp[i-2]}+$${houses[i]}) = $${chosenVal} → ROB house ${i}`
        : `dp[${i}] = max($${skipVal}, $${dp[i-2]}+$${houses[i]}) = $${chosenVal} → SKIP house ${i}`
    });
  }

  // 5. Backtrack Pass (Walk backward from n-1 to determine chosen set)
  const finalRobbed: number[] = [];
  let curr = n - 1;
  while (curr >= 0) {
    if (curr === 0) {
      finalRobbed.push(0);
      break;
    }
    if (curr === 1) {
      if (houses[1] > houses[0]) {
        finalRobbed.push(1);
      } else {
        finalRobbed.push(0);
      }
      break;
    }
    const skipVal = dp[curr - 1] as number;
    const robVal = (dp[curr - 2] as number) + houses[curr];
    if (robVal > skipVal) {
      finalRobbed.push(curr);
      curr -= 2;
    } else {
      curr -= 1;
    }
  }

  const progressiveRobbed: number[] = [];
  curr = n - 1;
  while (curr >= 0) {
    if (curr === 0) {
      progressiveRobbed.push(0);
      steps.push({
        type: 'backtrack',
        dpArray: [...dp],
        activeIndex: 0,
        fromIndices: [],
        codeLineActiveJava: 9,
        codeLineActivePseudo: 7,
        codeLineActive: 9,
        houses: [...houses],
        decision: 'rob',
        robbedIndices: [...progressiveRobbed].sort((a, b) => a - b),
        msg: `Backtrack: At house 0 → Rob house 0 ($${houses[0]})`
      });
      break;
    }
    if (curr === 1) {
      if (houses[1] > houses[0]) {
        progressiveRobbed.push(1);
        steps.push({
          type: 'backtrack',
          dpArray: [...dp],
          activeIndex: 1,
          fromIndices: [],
          codeLineActiveJava: 7,
          codeLineActivePseudo: 5,
          codeLineActive: 7,
          houses: [...houses],
          decision: 'rob',
          robbedIndices: [...progressiveRobbed].sort((a, b) => a - b),
          msg: `Backtrack: dp[1] from house 1 → Rob house 1 ($${houses[1]})`
        });
      } else {
        progressiveRobbed.push(0);
        steps.push({
          type: 'backtrack',
          dpArray: [...dp],
          activeIndex: 1,
          fromIndices: [],
          codeLineActiveJava: 7,
          codeLineActivePseudo: 5,
          codeLineActive: 7,
          houses: [...houses],
          decision: 'skip',
          robbedIndices: [...progressiveRobbed].sort((a, b) => a - b),
          msg: `Backtrack: dp[1] = dp[0] → Skip house 1, Rob house 0`
        });
      }
      break;
    }

    const skipVal = dp[curr - 1] as number;
    const robVal = (dp[curr - 2] as number) + houses[curr];
    if (robVal > skipVal) {
      progressiveRobbed.push(curr);
      steps.push({
        type: 'backtrack',
        dpArray: [...dp],
        activeIndex: curr,
        fromIndices: [curr - 2],
        codeLineActiveJava: 9,
        codeLineActivePseudo: 7,
        codeLineActive: 9,
        houses: [...houses],
        decision: 'rob',
        robbedIndices: [...progressiveRobbed].sort((a, b) => a - b),
        msg: `Backtrack: dp[${curr}] ≠ dp[${curr-1}] → Rob house ${curr} ($${houses[curr]})`
      });
      curr -= 2;
    } else {
      steps.push({
        type: 'backtrack',
        dpArray: [...dp],
        activeIndex: curr,
        fromIndices: [curr - 1],
        codeLineActiveJava: 9,
        codeLineActivePseudo: 7,
        codeLineActive: 9,
        houses: [...houses],
        decision: 'skip',
        robbedIndices: [...progressiveRobbed].sort((a, b) => a - b),
        msg: `Backtrack: dp[${curr}] = dp[${curr-1}] → Skip house ${curr}`
      });
      curr -= 1;
    }
  }

  // 6. Final Done Step
  const sortedRobbed = [...finalRobbed].sort((a, b) => a - b);
  steps.push({
    type: 'done',
    dpArray: [...dp],
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 11,
    codeLineActivePseudo: 8,
    codeLineActive: 11,
    houses: [...houses],
    decision: null,
    robbedIndices: sortedRobbed,
    msg: `Answer: dp[${n - 1}] = $${dp[n - 1]}. Robbed: [${sortedRobbed.join(', ')}]`
  });

  return steps;
}
