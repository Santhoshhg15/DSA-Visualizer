import type { ProblemMeta, Step, CandidateState } from '../problems/types';

export const MINIMUM_COINS_META: ProblemMeta = {
  id: 'minimum-coins',
  name: 'Minimum Coins',
  category: '1D DP',
  description: 'Fewest coins needed to make a target amount',
  javaCode: [
    'public int minCoins(int[] coins, int amount) {',
    '    int[] dp = new int[amount + 1];',
    '    Arrays.fill(dp, Integer.MAX_VALUE);',
    '    dp[0] = 0;',
    '    for (int a = 1; a <= amount; a++) {',
    '        for (int c : coins) {',
    '            if (c <= a && dp[a - c] != Integer.MAX_VALUE) {',
    '                dp[a] = Math.min(dp[a], dp[a - c] + 1);',
    '            }',
    '        }',
    '    }',
    '    return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];',
    '}',
  ],
  pseudoCode: [
    'function minCoins(coins, amount):',
    '    dp[0] = 0',
    '    all other dp values = infinity',
    '    for each amount a from 1 to target:',
    '        for each coin c in coins:',
    '            if c fits in a and dp[a-c] is reachable:',
    '                dp[a] = min(dp[a], dp[a-c] + 1)',
    '    if dp[amount] is still infinity: return -1',
    '    return dp[amount]',
  ],
  recurrence: 'dp[a] = min(dp[a-c] + 1) for each coin c <= a',
  baseCases: 'Base: dp[0] = 0, all other dp[a] = ∞',
  timeComplexity: 'O(n × amount)',
  spaceComplexity: 'O(amount)',
};

export function buildMinCoinsTrace(coins: number[], amount: number): Step[] {
  const steps: Step[] = [];
  const dp: (number | 'INF')[] = new Array(amount + 1).fill('INF');

  // 1. Init Step
  steps.push({
    type: 'init',
    dpArray: [...dp],
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 3,
    codeLineActivePseudo: 3,
    codeLineActive: 3,
    minCoinsAmount: amount,
    minCoinsCoins: [...coins],
    msg: `Initialize dp array, all values set to infinity (unreachable)`,
  });

  // 2. Base Step: dp[0] = 0
  dp[0] = 0;
  steps.push({
    type: 'base',
    dpArray: [...dp],
    activeIndex: 0,
    fromIndices: [],
    codeLineActiveJava: 4,
    codeLineActivePseudo: 2,
    codeLineActive: 4,
    minCoinsAmount: amount,
    minCoinsCoins: [...coins],
    msg: `dp[0] = 0 (zero coins needed for amount 0)`,
  });

  // 3. Amount Loop
  for (let a = 1; a <= amount; a++) {
    let bestVal = Infinity;
    let bestCoin = -1;

    // Track candidate states for each coin tried for current amount a
    const candidates: CandidateState[] = coins.map((c) => ({
      coin: c,
      value: 'unreachable',
      status: 'pending',
    }));

    for (let cIdx = 0; cIdx < coins.length; cIdx++) {
      const c = coins[cIdx];
      let msgStr = '';

      if (c > a) {
        candidates[cIdx] = {
          coin: c,
          value: 'unreachable',
          status: 'impossible',
        };
        msgStr = `Coin ${c} doesn't fit (coin ${c} > amount ${a})`;
      } else if (dp[a - c] === 'INF') {
        candidates[cIdx] = {
          coin: c,
          value: 'unreachable',
          status: 'impossible',
        };
        msgStr = `dp[${a - c}] is unreachable, skip coin ${c}`;
      } else {
        const candVal = (dp[a - c] as number) + 1;
        if (candVal < bestVal) {
          // Demote previous winner to losing
          if (bestCoin !== -1) {
            const prevWinnerIdx = coins.indexOf(bestCoin);
            if (prevWinnerIdx !== -1) {
              candidates[prevWinnerIdx].status = 'evaluated-losing';
            }
          }

          bestVal = candVal;
          bestCoin = c;

          candidates[cIdx] = {
            coin: c,
            value: candVal,
            status: 'evaluated-winning',
          };
        } else {
          candidates[cIdx] = {
            coin: c,
            value: candVal,
            status: 'evaluated-losing',
          };
        }
        msgStr = `Trying coin ${c} for amount ${a}: dp[${a - c}]+1 = ${candVal}`;
      }

      // Emit candidate step
      steps.push({
        type: 'candidate',
        dpArray: [...dp],
        activeIndex: a,
        fromIndices: c <= a && dp[a - c] !== 'INF' ? [a - c] : [],
        candidateStates: candidates.map((cand) => ({ ...cand })),
        codeLineActiveJava: 6,
        codeLineActivePseudo: 6,
        codeLineActive: 6,
        minCoinsAmount: amount,
        minCoinsCoins: [...coins],
        msg: msgStr,
      });
    }

    // Commit final dp[a] value
    dp[a] = bestVal === Infinity ? 'INF' : bestVal;

    steps.push({
      type: 'fill',
      dpArray: [...dp],
      activeIndex: a,
      fromIndices: bestCoin !== -1 ? [a - bestCoin] : [],
      candidateStates: candidates.map((cand) => ({ ...cand })),
      codeLineActiveJava: 7,
      codeLineActivePseudo: 7,
      codeLineActive: 7,
      minCoinsAmount: amount,
      minCoinsCoins: [...coins],
      msg:
        bestVal === Infinity
          ? `dp[${a}] = ∞ (no coin combination works)`
          : `dp[${a}] = ${bestVal} (best: coin ${bestCoin})`,
    });
  }

  // 4. Final Done Step
  const finalVal = dp[amount];
  steps.push({
    type: 'done',
    dpArray: [...dp],
    activeIndex: amount,
    fromIndices: [],
    codeLineActiveJava: 12,
    codeLineActivePseudo: 9,
    codeLineActive: 12,
    minCoinsAmount: amount,
    minCoinsCoins: [...coins],
    msg:
      finalVal === 'INF'
        ? `Answer: Amount ${amount} cannot be made with given coins (-1)`
        : `Answer: Minimum coins for amount ${amount} = ${finalVal}`,
  });

  return steps;
}
