export interface MaxSumWindowStep {
  type: 'init' | 'build' | 'slide' | 'done';
  arr: number[];
  k: number;
  windowStart: number;
  windowSum: number;
  maxSum: number;
  bestWindowStart: number;
  action: 'add' | 'remove-add' | null;   // null on init/done
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
  dpArray: (number | null)[];
  activeIndex: number;
  fromIndices: number[];
}

export function buildMaxSumSubarrayTrace(arr: number[], k: number): MaxSumWindowStep[] {
  const steps: MaxSumWindowStep[] = [];
  const n = arr.length;

  // Step 1: init
  // javaCode line 1: int windowSum = 0;
  // pseudoCode line 1: windowSum = sum of first k elements
  steps.push({
    type: 'init',
    arr,
    k,
    windowStart: 0,
    windowSum: 0,
    maxSum: 0,
    bestWindowStart: -1,
    action: null,
    codeLineActiveJava: 1,
    codeLineActivePseudo: 1,
    msg: `Initialize window sum to 0. We will build the first window of size ${k} by summing the first ${k} elements.`,
    dpArray: [...arr],
    activeIndex: -1,
    fromIndices: [],
  });

  // Steps 2 to k+1: build
  let runningSum = 0;
  for (let i = 0; i < k; i++) {
    runningSum += arr[i];
    // javaCode line 3: windowSum += arr[i];
    // pseudoCode line 1: windowSum = sum of first k elements
    steps.push({
      type: 'build',
      arr,
      k,
      windowStart: 0,
      windowSum: runningSum,
      maxSum: 0,
      bestWindowStart: -1,
      action: 'add',
      codeLineActiveJava: 3,
      codeLineActivePseudo: 1,
      msg: `Add arr[${i}] = ${arr[i]} to the initial window sum → windowSum = ${runningSum}`,
      dpArray: [...arr],
      activeIndex: i,
      fromIndices: [],
    });
  }

  // After initial window built: establish maxSum = windowSum
  // javaCode line 5: int maxSum = windowSum;
  // pseudoCode line 2: maxSum = windowSum
  let currentMax = runningSum;
  let bestStart = 0;
  steps.push({
    type: 'build',
    arr,
    k,
    windowStart: 0,
    windowSum: runningSum,
    maxSum: currentMax,
    bestWindowStart: bestStart,
    action: null,
    codeLineActiveJava: 5,
    codeLineActivePseudo: 2,
    msg: `First window of size ${k} is complete. Initial windowSum = ${runningSum}. This is our starting maxSum.`,
    dpArray: [...arr],
    activeIndex: k - 1,
    fromIndices: [],
  });

  // For i from k to n-1: slide
  for (let i = k; i < n; i++) {
    const prevSum = runningSum;
    const removedVal = arr[i - k];
    const addedVal = arr[i];
    runningSum = runningSum - removedVal + addedVal;
    const windowStart = i - k + 1;

    // javaCode line 7: windowSum = windowSum - arr[i - k] + arr[i];
    // pseudoCode line 6: windowSum = windowSum - arr[i-k] + arr[i]
    steps.push({
      type: 'slide',
      arr,
      k,
      windowStart,
      windowSum: runningSum,
      maxSum: currentMax,
      bestWindowStart: bestStart,
      action: 'remove-add',
      codeLineActiveJava: 7,
      codeLineActivePseudo: 6,
      msg: `Slide window right: remove arr[${i - k}] = ${removedVal}, add arr[${i}] = ${addedVal} → windowSum = ${prevSum} - ${removedVal} + ${addedVal} = ${runningSum}`,
      dpArray: [...arr],
      activeIndex: i,
      fromIndices: [i - k],
    });

    const isNewMax = runningSum > currentMax;
    if (isNewMax) {
      currentMax = runningSum;
      bestStart = windowStart;
    }

    // javaCode line 8: maxSum = Math.max(maxSum, windowSum);
    // pseudoCode line 7: maxSum = max(maxSum, windowSum)
    steps.push({
      type: 'slide',
      arr,
      k,
      windowStart,
      windowSum: runningSum,
      maxSum: currentMax,
      bestWindowStart: bestStart,
      action: isNewMax ? 'remove-add' : null, // pulse on update
      codeLineActiveJava: 8,
      codeLineActivePseudo: 7,
      msg: `Compare windowSum (${runningSum}) with maxSum (${currentMax - (isNewMax ? runningSum - currentMax : 0)})${
        isNewMax
          ? ` → New max found! Update maxSum = ${currentMax} (window indices ${bestStart}..${bestStart + k - 1})`
          : ` → No change. maxSum remains ${currentMax}`
      }`,
      dpArray: [...arr],
      activeIndex: i,
      fromIndices: [],
    });
  }

  // Final step: type 'done'
  // javaCode line 10: return maxSum;
  // pseudoCode line 8: return maxSum
  steps.push({
    type: 'done',
    arr,
    k,
    windowStart: n - k,
    windowSum: runningSum,
    maxSum: currentMax,
    bestWindowStart: bestStart,
    action: null,
    codeLineActiveJava: 10,
    codeLineActivePseudo: 8,
    msg: `Visualization complete. The maximum sum of any size-${k} subarray is ${currentMax} (window at indices ${bestStart}..${bestStart + k - 1}).`,
    dpArray: [...arr],
    activeIndex: -1,
    fromIndices: [],
  });

  return steps;
}
