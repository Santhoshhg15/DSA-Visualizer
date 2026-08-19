export interface KadaneStep {
  type: 'init' | 'extend' | 'restart' | 'update-max' | 'done';
  arr: number[];
  currentIndex: number;
  windowStart: number; // start of current running subarray
  currentSum: number;
  maxSum: number;
  bestStart: number;
  bestEnd: number;
  isRestart: boolean; // true only on the exact step a restart happens
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
  // DPTape compatibility
  dpArray: (number | string | null)[];
  activeIndex: number;
  fromIndices: number[];
}

export function buildKadaneTrace(arr: number[]): KadaneStep[] {
  const steps: KadaneStep[] = [];
  const n = arr.length;
  if (n === 0) return steps;

  let currentSum = arr[0];
  let maxSum = arr[0];
  let windowStart = 0;
  let bestStart = 0;
  let bestEnd = 0;

  // Helper to push step
  const pushStep = (
    type: KadaneStep['type'],
    curIdx: number,
    curStart: number,
    curSum: number,
    curMax: number,
    bStart: number,
    bEnd: number,
    isRestart: boolean,
    codeLineActiveJava: number,
    codeLineActivePseudo: number,
    msg: string
  ) => {
    steps.push({
      type,
      arr: [...arr],
      currentIndex: curIdx,
      windowStart: curStart,
      currentSum: curSum,
      maxSum: curMax,
      bestStart: bStart,
      bestEnd: bEnd,
      isRestart,
      codeLineActiveJava,
      codeLineActivePseudo,
      msg,
      // DPTape compatibility
      dpArray: [...arr],
      activeIndex: curIdx,
      fromIndices: [],
    });
  };

  // Init step
  pushStep(
    'init',
    0,
    0,
    currentSum,
    maxSum,
    0,
    0,
    false,
    1, // line 1: int currentSum = arr[0];
    2, // line 2: currentSum = arr[0]
    `Start with currentSum = maxSum = arr[0] = ${arr[0]}`
  );

  for (let i = 1; i < n; i++) {
    const prevSum = currentSum;
    const extendValue = currentSum + arr[i];
    const restartValue = arr[i];

    let isRestart = false;

    if (extendValue >= restartValue) {
      currentSum = extendValue;
      isRestart = false;
      pushStep(
        'extend',
        i,
        windowStart,
        currentSum,
        maxSum,
        bestStart,
        bestEnd,
        false,
        4, // line 4: currentSum = Math.max(arr[i], currentSum + arr[i]);
        8, // line 8: EXTEND the running subarray by adding arr[i]
        `currentSum(${prevSum}) + arr[${i}](${arr[i]}) = ${extendValue} ≥ arr[${i}] alone → EXTEND the subarray. currentSum = ${currentSum}`
      );
    } else {
      currentSum = restartValue;
      windowStart = i;
      isRestart = true;
      pushStep(
        'restart',
        i,
        windowStart,
        currentSum,
        maxSum,
        bestStart,
        bestEnd,
        true,
        4, // line 4: currentSum = Math.max(arr[i], currentSum + arr[i]);
        6, // line 6: RESTART fresh from arr[i] alone
        `currentSum(${prevSum}) + arr[${i}](${arr[i]}) = ${extendValue} < arr[${i}] alone → previous sum is a drag! RESTART fresh at index ${i}. currentSum = ${currentSum}`
      );
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      bestStart = windowStart;
      bestEnd = i;
      pushStep(
        'update-max',
        i,
        windowStart,
        currentSum,
        maxSum,
        bestStart,
        bestEnd,
        isRestart,
        5, // line 5: maxSum = Math.max(maxSum, currentSum);
        9, // line 9: maxSum = max(maxSum, currentSum)
        `New maximum found! maxSum = ${maxSum} (subarray indices ${bestStart}..${bestEnd})`
      );
    }
  }

  // Final step
  const bestSubarrayValues = arr.slice(bestStart, bestEnd + 1).join(', ');
  pushStep(
    'done',
    n - 1,
    windowStart,
    currentSum,
    maxSum,
    bestStart,
    bestEnd,
    false,
    7, // line 7: return maxSum;
    10, // line 10: return maxSum
    `Answer: maximum subarray sum = ${maxSum} (subarray: indices ${bestStart}..${bestEnd}, values [${bestSubarrayValues}])`
  );

  return steps;
}
