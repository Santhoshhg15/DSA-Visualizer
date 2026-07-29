import type { ProblemMeta, Step } from '../problems/types';

export const BUY_SELL_STOCKS_META: ProblemMeta = {
  id: 'buy-sell-stocks',
  name: 'Buy and Sell Stocks',
  category: 'Subsequence',
  description: 'Maximum profit from single buy and sell transaction',
  javaCode: [
    'public int maxProfit(int[] prices) {',
    '    int minPrice = Integer.MAX_VALUE;',
    '    int maxProfit = 0;',
    '    for (int i = 0; i < prices.length; i++) {',
    '        if (prices[i] < minPrice) {',
    '            minPrice = prices[i];',
    '        } else if (prices[i] - minPrice > maxProfit) {',
    '            maxProfit = prices[i] - minPrice;',
    '        }',
    '    }',
    '    return maxProfit;',
    '}',
  ],
  pseudoCode: [
    'function maxProfit(prices):',
    '    minPrice = infinity',
    '    maxProfit = 0',
    '    for each day\'s price in prices:',
    '        if this price is lower than minPrice:',
    '            update minPrice to this price',
    '        else if selling today beats maxProfit:',
    '            update maxProfit',
    '    return maxProfit',
  ],
  recurrence: 'minPrice = min(minPrice, prices[i])\nmaxProfit = max(maxProfit, prices[i] - minPrice)',
  baseCases: 'Base: minPrice = ∞, maxProfit = 0',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
};

export function buildBuySellStocksTrace(prices: number[]): Step[] {
  const steps: Step[] = [];
  const n = prices.length;
  if (n === 0) return steps;

  let minPrice = Infinity;
  let minPriceDay = -1;
  let maxProfit = 0;
  let buyDay = -1;
  let sellDay = -1;

  // Step 1: Init
  steps.push({
    type: 'init',
    dpArray: [...prices],
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 2,
    codeLineActivePseudo: 1,
    codeLineActive: 2,
    stockPrices: [...prices],
    stockCurrentDay: -1,
    stockMinPrice: Infinity,
    stockMinPriceDay: -1,
    stockMaxProfit: 0,
    stockBuyDay: -1,
    stockSellDay: -1,
    stockAction: null,
    msg: `Initialize minPrice = ∞, maxProfit = 0`,
  });

  // Step 2: Process each day
  for (let i = 0; i < n; i++) {
    const price = prices[i];

    if (price < minPrice) {
      minPrice = price;
      minPriceDay = i;

      steps.push({
        type: 'process' as any,
        dpArray: [...prices],
        activeIndex: i,
        fromIndices: [],
        codeLineActiveJava: 6,
        codeLineActivePseudo: 6,
        codeLineActive: 6,
        stockPrices: [...prices],
        stockCurrentDay: i,
        stockMinPrice: minPrice,
        stockMinPriceDay: minPriceDay,
        stockMaxProfit: maxProfit,
        stockBuyDay: buyDay,
        stockSellDay: sellDay,
        stockAction: 'update-min',
        msg: `Day ${i}: price $${price} is a new minimum → minPrice = $${price}`,
      });
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
      buyDay = minPriceDay;
      sellDay = i;

      steps.push({
        type: 'process' as any,
        dpArray: [...prices],
        activeIndex: i,
        fromIndices: [minPriceDay],
        codeLineActiveJava: 8,
        codeLineActivePseudo: 8,
        codeLineActive: 8,
        stockPrices: [...prices],
        stockCurrentDay: i,
        stockMinPrice: minPrice,
        stockMinPriceDay: minPriceDay,
        stockMaxProfit: maxProfit,
        stockBuyDay: buyDay,
        stockSellDay: sellDay,
        stockAction: 'update-profit',
        msg: `Day ${i}: selling now gives profit $${price}-$${minPrice}=$${maxProfit}, new best → maxProfit = $${maxProfit}`,
      });
    } else {
      steps.push({
        type: 'process' as any,
        dpArray: [...prices],
        activeIndex: i,
        fromIndices: [],
        codeLineActiveJava: 4,
        codeLineActivePseudo: 4,
        codeLineActive: 4,
        stockPrices: [...prices],
        stockCurrentDay: i,
        stockMinPrice: minPrice,
        stockMinPriceDay: minPriceDay,
        stockMaxProfit: maxProfit,
        stockBuyDay: buyDay,
        stockSellDay: sellDay,
        stockAction: 'no-change',
        msg: `Day ${i}: price $${price} doesn't beat current minPrice ($${minPrice}) or maxProfit ($${maxProfit}), no change`,
      });
    }
  }

  // Step 3: Done
  steps.push({
    type: 'done',
    dpArray: [...prices],
    activeIndex: -1,
    fromIndices: [],
    codeLineActiveJava: 11,
    codeLineActivePseudo: 9,
    codeLineActive: 11,
    stockPrices: [...prices],
    stockCurrentDay: -1,
    stockMinPrice: minPrice,
    stockMinPriceDay: minPriceDay,
    stockMaxProfit: maxProfit,
    stockBuyDay: buyDay,
    stockSellDay: sellDay,
    stockAction: null,
    msg:
      maxProfit > 0
        ? `Answer: Buy on day ${buyDay} (price $${prices[buyDay]}), sell on day ${sellDay} (price $${prices[sellDay]}) → profit = $${maxProfit}`
        : `Answer: No profitable transaction possible (prices only decrease)`,
  });

  return steps;
}
