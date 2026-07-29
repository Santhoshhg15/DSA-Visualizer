import type { ProblemMeta, Step } from '../problems/types';

export const KNAPSACK_META: ProblemMeta = {
  id: 'knapsack',
  name: '0/1 Knapsack',
  category: 'Knapsack',
  description: 'Maximize total value without exceeding capacity',
  javaCode: [
    'public int knapsack(int[] weights, int[] values, int W) {',
    '    int n = weights.length;',
    '    int[][] dp = new int[n + 1][W + 1];',
    '    for (int i = 1; i <= n; i++) {',
    '        for (int w = 0; w <= W; w++) {',
    '            dp[i][w] = dp[i-1][w];',
    '            if (weights[i-1] <= w) {',
    '                int included = dp[i-1][w-weights[i-1]]',
    '                               + values[i-1];',
    '                dp[i][w] = Math.max(dp[i][w], included);',
    '            }',
    '        }',
    '    }',
    '    return dp[n][W];',
    '}',
  ],
  pseudoCode: [
    'function knapsack(weights, values, W):',
    '    create table dp of size (n+1) x (W+1), all 0',
    '    for i from 1 to n:',
    '        for w from 0 to W:',
    '            dp[i][w] = value without item i',
    '            if item i\'s weight fits in w:',
    '                compare with value including item i',
    '                keep whichever is larger',
    '    return dp[n][W]',
  ],
  recurrence: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i-1]] + val[i-1])',
  baseCases: 'Base: dp[0][w] = 0, dp[i][0] = 0',
  timeComplexity: 'O(n × W)',
  spaceComplexity: 'O(n × W)',
};

export function buildKnapsackTrace(
  weights: number[],
  values: number[],
  capacity: number
): Step[] {
  const steps: Step[] = [];
  const n = weights.length;
  if (n === 0) return steps;

  // Initialize (n+1) x (W+1) table filled with nulls
  const table: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(null)
  );

  const getFlatDp = () => table.flat();

  // 1. Init step
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
    knapsackCapacity: capacity,
    knapsackWeights: [...weights],
    knapsackValues: [...values],
    msg: `Init: table size (${n + 1}) × (${capacity + 1})`,
  });

  // 2. Base step: dp[0][w] = 0 for all w = 0..W, dp[i][0] = 0 for all i = 0..n
  for (let w = 0; w <= capacity; w++) {
    table[0][w] = 0;
  }
  for (let i = 0; i <= n; i++) {
    table[i][0] = 0;
  }

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
    knapsackCapacity: capacity,
    knapsackWeights: [...weights],
    knapsackValues: [...values],
    msg: `Base case: dp[0][w] = 0 and dp[i][0] = 0 (no items or 0 capacity = 0 value)`,
  });

  // 3. Fill Loop: i from 1 to n, w from 0 to W
  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1];
    const val = values[i - 1];

    for (let w = 0; w <= capacity; w++) {
      if (w === 0) continue; // already initialized in base case

      const excludeVal = table[i - 1][w] as number;

      if (wt > w) {
        // Item doesn't fit in capacity w
        table[i][w] = excludeVal;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (capacity + 1) + w,
          fromIndices: [(i - 1) * (capacity + 1) + w],
          codeLineActiveJava: 5,
          codeLineActivePseudo: 5,
          codeLineActive: 5,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, w],
          sourceCells: [[i - 1, w]],
          decision: 'no-choice',
          knapsackCapacity: capacity,
          knapsackWeights: [...weights],
          knapsackValues: [...values],
          msg: `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${excludeVal} (item${i} w=${wt} doesn't fit in capacity ${w})`,
        });
      } else {
        // Both exclude and include options apply
        const includeVal = (table[i - 1][w - wt] as number) + val;
        const sources: [number, number][] = [
          [i - 1, w],
          [i - 1, w - wt],
        ];

        if (includeVal > excludeVal) {
          table[i][w] = includeVal;

          steps.push({
            type: 'fill',
            dpArray: getFlatDp(),
            activeIndex: i * (capacity + 1) + w,
            fromIndices: sources.map(([r, c]) => r * (capacity + 1) + c),
            codeLineActiveJava: 9,
            codeLineActivePseudo: 8,
            codeLineActive: 9,
            dpTable: table.map((r) => [...r]),
            activeCell: [i, w],
            sourceCells: sources,
            decision: 'include',
            knapsackCapacity: capacity,
            knapsackWeights: [...weights],
            knapsackValues: [...values],
            msg: `dp[${i}][${w}] = max(${excludeVal}, ${includeVal}) = ${includeVal} → INCLUDE item${i} (adds more value)`,
          });
        } else {
          table[i][w] = excludeVal;

          steps.push({
            type: 'fill',
            dpArray: getFlatDp(),
            activeIndex: i * (capacity + 1) + w,
            fromIndices: sources.map(([r, c]) => r * (capacity + 1) + c),
            codeLineActiveJava: 9,
            codeLineActivePseudo: 8,
            codeLineActive: 9,
            dpTable: table.map((r) => [...r]),
            activeCell: [i, w],
            sourceCells: sources,
            decision: 'exclude',
            knapsackCapacity: capacity,
            knapsackWeights: [...weights],
            knapsackValues: [...values],
            msg: `dp[${i}][${w}] = max(${excludeVal}, ${includeVal}) = ${excludeVal} → EXCLUDE item${i} (better without it)`,
          });
        }
      }
    }
  }

  // 4. Final Done Step
  const maxAchieved = table[n][capacity] as number;
  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: n * (capacity + 1) + capacity,
    fromIndices: [],
    codeLineActiveJava: 13,
    codeLineActivePseudo: 9,
    codeLineActive: 13,
    dpTable: table.map((r) => [...r]),
    activeCell: [n, capacity],
    sourceCells: [],
    knapsackCapacity: capacity,
    knapsackWeights: [...weights],
    knapsackValues: [...values],
    msg: `Answer: dp[${n}][${capacity}] = ${maxAchieved} (maximum value achievable within capacity ${capacity})`,
  });

  return steps;
}
