import type { ProblemMeta, Step } from '../problems/types';

export const COIN_CHANGE_II_META: ProblemMeta = {
  id: 'coin-change-ii',
  name: 'Coin Change II',
  category: 'String DP',
  description: 'Count distinct combinations to make target amount using unlimited coins',
  javaCode: [
    'public int change(int amount, int[] coins) {',
    '    int n = coins.length;',
    '    int[][] dp = new int[n + 1][amount + 1];',
    '    for (int i = 0; i <= n; i++) {',
    '        dp[i][0] = 1;',
    '    }',
    '    for (int i = 1; i <= n; i++) {',
    '        for (int j = 1; j <= amount; j++) {',
    '            dp[i][j] = dp[i-1][j];',
    '            if (j >= coins[i-1]) {',
    '                dp[i][j] += dp[i][j-coins[i-1]];',
    '            }',
    '        }',
    '    }',
    '    return dp[n][amount];',
    '}',
  ],
  pseudoCode: [
    'function change(amount, coins):',
    '    create table dp of size (n+1) x (amount+1)',
    '    for each row i: dp[i][0] = 1',
    '        (one way to make amount 0: use no coins)',
    '    for i from 1 to n:',
    '        for j from 1 to amount:',
    '            dp[i][j] = ways WITHOUT using coin i at all',
    '            if coin i fits in j:',
    '                add ways using coin i at least once',
    '                (reuse coin i within the SAME row,',
    '                 since it can be used multiple times)',
    '    return dp[n][amount]',
  ],
  recurrence: 'dp[i][j] = dp[i-1][j] + (j≥coins[i-1] ? dp[i][j-coins[i-1]] : 0)',
  baseCases: 'Base: dp[i][0] = 1 | Note: reuse term reads from ROW i, not i-1',
  timeComplexity: 'O(n×amount)',
  spaceComplexity: 'O(n×amount)',
};

export function buildCoinChangeIITrace(coins: number[], amount: number): Step[] {
  const steps: Step[] = [];
  const n = coins.length;

  const table: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    new Array(amount + 1).fill(null)
  );

  const getFlatDp = () => table.flat();

  // Step 1: Init
  steps.push({
    type: 'init',
    dpArray: getFlatDp(),
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 2,
    codeLineActivePseudo: 2,
    codeLineActive: 2,
    coinChangeIIAmount: amount,
    coinChangeIICoins: coins,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    sourceLabels: [],
    gridRows: n + 1,
    gridCols: amount + 1,
    msg: `Initialize (${n + 1})×(${amount + 1}) table. Each coin can be used UNLIMITED times.`,
  });

  // Step 2: Base Cases
  for (let i = 0; i <= n; i++) {
    table[i][0] = 1;
  }

  steps.push({
    type: 'base',
    dpArray: getFlatDp(),
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 4,
    codeLineActivePseudo: 3,
    codeLineActive: 4,
    coinChangeIIAmount: amount,
    coinChangeIICoins: coins,
    dpTable: table.map((r) => [...r]),
    activeCell: null,
    sourceCells: [],
    sourceLabels: [],
    gridRows: n + 1,
    gridCols: amount + 1,
    msg: `Base case: dp[i][0] = 1 (one way to make amount 0 — use no coins)`,
  });

  // Step 3: Fill loop
  for (let i = 1; i <= n; i++) {
    const coin = coins[i - 1];
    for (let j = 1; j <= amount; j++) {
      const excludeVal = (table[i - 1][j] as number) ?? 0;

      if (j >= coin) {
        const includeVal = (table[i][j - coin] as number) ?? 0;
        const total = excludeVal + includeVal;
        table[i][j] = total;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (amount + 1) + j,
          fromIndices: [(i - 1) * (amount + 1) + j, i * (amount + 1) + (j - coin)],
          codeLineActiveJava: 10,
          codeLineActivePseudo: 9,
          codeLineActive: 10,
          coinChangeIIAmount: amount,
          coinChangeIICoins: coins,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [
            [i - 1, j],
            [i, j - coin],
          ],
          sourceLabels: ['skip', 'reuse'],
          gridRows: n + 1,
          gridCols: amount + 1,
          msg: `dp[${i}][${j}] = dp[${i - 1}][${j}] (skip coin ${coin}) + dp[${i}][${j - coin}] (reuse coin ${coin}) = ${excludeVal} + ${includeVal} = ${total}`,
        });
      } else {
        table[i][j] = excludeVal;

        steps.push({
          type: 'fill',
          dpArray: getFlatDp(),
          activeIndex: i * (amount + 1) + j,
          fromIndices: [(i - 1) * (amount + 1) + j],
          codeLineActiveJava: 8,
          codeLineActivePseudo: 7,
          codeLineActive: 8,
          coinChangeIIAmount: amount,
          coinChangeIICoins: coins,
          dpTable: table.map((r) => [...r]),
          activeCell: [i, j],
          sourceCells: [[i - 1, j]],
          sourceLabels: ['skip'],
          gridRows: n + 1,
          gridCols: amount + 1,
          msg: `dp[${i}][${j}] = dp[${i - 1}][${j}] = ${excludeVal} (coin ${coin} > ${j}, doesn't fit)`,
        });
      }
    }
  }

  // Final Step: Done
  const answer = table[n][amount] as number;

  steps.push({
    type: 'done',
    dpArray: getFlatDp(),
    activeIndex: n * (amount + 1) + amount,
    fromIndices: [],
    codeLineActiveJava: 14,
    codeLineActivePseudo: 12,
    codeLineActive: 14,
    coinChangeIIAmount: amount,
    coinChangeIICoins: coins,
    dpTable: table.map((r) => [...r]),
    activeCell: [n, amount],
    sourceCells: [],
    sourceLabels: [],
    gridRows: n + 1,
    gridCols: amount + 1,
    msg: `Answer: ${answer} way(s) to make amount ${amount} using coins [${coins.join(', ')}] with unlimited reuse`,
  });

  return steps;
}
