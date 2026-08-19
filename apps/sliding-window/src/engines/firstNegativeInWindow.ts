export interface FirstNegStep {
  type: 'init' | 'scan' | 'evict' | 'record' | 'done';
  arr: number[];
  k: number;
  currentIndex: number;
  windowStart: number;
  negQueue: number[];
  resultSoFar: (number | null)[];
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
  // DPTape compatibility properties
  dpArray: (number | null)[];
  activeIndex: number;
  fromIndices: number[];
}

export function buildFirstNegativeTrace(arr: number[], k: number): FirstNegStep[] {
  const steps: FirstNegStep[] = [];
  const n = arr.length;
  const numWindows = n - k + 1;
  const resultSoFar: (number | null)[] = new Array(numWindows).fill(null);

  // Deque state tracked in JS
  let negQueue: number[] = [];

  // Step 1: Init
  steps.push({
    type: 'init',
    arr: [...arr],
    k,
    currentIndex: -1,
    windowStart: 0,
    negQueue: [],
    resultSoFar: [...resultSoFar],
    codeLineActiveJava: 3,
    codeLineActivePseudo: 1,
    msg: "Scan left to right. Track a queue of negative-number indices. The front of the queue is always the first negative in the current window.",
    dpArray: [...arr],
    activeIndex: -1,
    fromIndices: [],
  });

  for (let i = 0; i < n; i++) {
    const isNegative = arr[i] < 0;

    // Scan step (incoming element)
    if (isNegative) {
      negQueue.push(i);
    }

    steps.push({
      type: 'scan',
      arr: [...arr],
      k,
      currentIndex: i,
      windowStart: Math.max(0, i - k + 1),
      negQueue: [...negQueue],
      resultSoFar: [...resultSoFar],
      codeLineActiveJava: isNegative ? 6 : 5,
      codeLineActivePseudo: isNegative ? 4 : 3,
      msg: isNegative
        ? `arr[${i}] = ${arr[i]} is negative → add index ${i} to the back of the queue`
        : `arr[${i}] = ${arr[i]} is not negative, nothing added to queue`,
      dpArray: [...arr],
      activeIndex: i,
      fromIndices: [...negQueue],
    });

    // If window of size k has formed
    if (i >= k - 1) {
      const windowStart = i - k + 1;

      // Eviction step: remove elements that fell out of window bounds
      while (negQueue.length > 0 && negQueue[0] <= i - k) {
        const evictedIndex = negQueue.shift()!;
        steps.push({
          type: 'evict',
          arr: [...arr],
          k,
          currentIndex: i,
          windowStart,
          negQueue: [...negQueue],
          resultSoFar: [...resultSoFar],
          codeLineActiveJava: 11,
          codeLineActivePseudo: 7,
          msg: `Index ${evictedIndex} has fallen outside the window (window now starts at ${windowStart}) → remove from front of queue`,
          dpArray: [...arr],
          activeIndex: i,
          fromIndices: [...negQueue],
        });
      }

      // Record step: write answer for current window
      const hasNeg = negQueue.length > 0;
      const answer = hasNeg ? arr[negQueue[0]] : 0;
      resultSoFar[windowStart] = answer;

      steps.push({
        type: 'record',
        arr: [...arr],
        k,
        currentIndex: i,
        windowStart,
        negQueue: [...negQueue],
        resultSoFar: [...resultSoFar],
        codeLineActiveJava: 13,
        codeLineActivePseudo: 8,
        msg: hasNeg
          ? `Window [${windowStart}..${i}]: first negative = ${answer} (from index ${negQueue[0]})`
          : `Window [${windowStart}..${i}]: no negative number found → answer = 0`,
        dpArray: [...arr],
        activeIndex: i,
        fromIndices: [...negQueue],
      });
    }
  }

  // Step Last: done
  steps.push({
    type: 'done',
    arr: [...arr],
    k,
    currentIndex: -1,
    windowStart: n - k,
    negQueue: [...negQueue],
    resultSoFar: [...resultSoFar],
    codeLineActiveJava: 17,
    codeLineActivePseudo: 10,
    msg: `Answer: [${resultSoFar.join(', ')}]`,
    dpArray: [...arr],
    activeIndex: -1,
    fromIndices: [...negQueue],
  });

  return steps;
}
