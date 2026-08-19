export interface SmallestSubarrayStep {
  type: 'init' | 'expand' | 'valid' | 'shrink' | 'done';
  arr: number[];
  target: number;
  left: number;
  right: number;
  windowSum: number;
  minLen: number | null; // null represents infinity/not found yet
  bestStart: number | null;
  bestEnd: number | null;
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
  // DPTape compatibility properties
  dpArray: (number | string | null)[];
  activeIndex: number;
  fromIndices: number[];
}

export function buildSmallestSubarrayTrace(arr: number[], target: number): SmallestSubarrayStep[] {
  const steps: SmallestSubarrayStep[] = [];
  const n = arr.length;

  let left = 0;
  let windowSum = 0;
  let minLen: number | null = null;
  let bestStart: number | null = null;
  let bestEnd: number | null = null;

  // Helper to push step
  const pushStep = (
    type: SmallestSubarrayStep['type'],
    curLeft: number,
    curRight: number,
    curSum: number,
    codeLineActiveJava: number,
    codeLineActivePseudo: number,
    msg: string
  ) => {
    steps.push({
      type,
      arr: [...arr],
      target,
      left: curLeft,
      right: curRight,
      windowSum: curSum,
      minLen,
      bestStart,
      bestEnd,
      codeLineActiveJava,
      codeLineActivePseudo,
      msg,
      // DPTape compatibility
      dpArray: [...arr],
      activeIndex: curRight,
      fromIndices: [],
    });
  };

  // Init step
  pushStep(
    'init',
    0,
    -1,
    0,
    3, // line 3: int minLen = Integer.MAX_VALUE; (0-indexed is 2, but we use 1-based lines from step 3: line 3)
    2, // line 2: left = 0, windowSum = 0, minLen = infinity
    "Expand the window right, adding to windowSum. Once windowSum ≥ target, shrink from the left to find the smallest valid window."
  );

  for (let right = 0; right < n; right++) {
    windowSum += arr[right];

    // Expand step
    pushStep(
      'expand',
      left,
      right,
      windowSum,
      5, // line 5: windowSum += arr[right];
      4, // line 4: add arr[right] to windowSum
      `Add arr[${right}]=${arr[right]} → windowSum = ${windowSum}`
    );

    while (windowSum >= target) {
      const currentLen = right - left + 1;
      let isNewMin = false;
      if (minLen === null || currentLen < minLen) {
        minLen = currentLen;
        bestStart = left;
        bestEnd = right;
        isNewMin = true;
      }

      // Valid step
      const validMsg = `windowSum=${windowSum} ≥ target=${target} → valid window of length ${currentLen}!${
        isNewMin ? ` New minimum! minLen = ${minLen}` : ''
      }`;
      pushStep(
        'valid',
        left,
        right,
        windowSum,
        7, // line 7: minLen = Math.min(...)
        6, // line 6: this window is valid — check if it's smaller
        validMsg
      );

      // Shrink step
      const originalSum = windowSum;
      windowSum -= arr[left];

      pushStep(
        'shrink',
        left,
        right,
        windowSum,
        8, // line 8: windowSum -= arr[left];
        7, // line 7: remove arr[left] from windowSum
        `Try shrinking: remove arr[${left}]=${arr[left]} → windowSum = ${windowSum}, left moves to ${left + 1}`
      );

      left++;
    }
  }

  // Done step
  const doneMsg =
    minLen !== null
      ? `Answer: smallest subarray with sum ≥ ${target} has length ${minLen} (indices ${bestStart}..${bestEnd})`
      : `Answer: no subarray sums to at least ${target} → 0`;

  pushStep(
    'done',
    left,
    n - 1,
    windowSum,
    12, // line 12: return minLen == Integer.MAX_VALUE ? 0 : minLen;
    9,  // line 9: return minLen, or 0 if never found
    doneMsg
  );

  return steps;
}
