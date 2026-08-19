export interface MaxDequeStep {
  type: 'init' | 'evict-back' | 'add' | 'evict-front' | 'record' | 'done';
  arr: number[];
  k: number;
  currentIndex: number;
  windowStart: number;
  deque: number[]; // current deque state, front to back
  evictedIndex: number | null; // which index was just evicted
  evictionReason: 'dominated' | 'expired' | null;
  resultSoFar: (number | null)[];
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
  // DPTape compatibility properties
  dpArray: (number | null)[];
  activeIndex: number;
  fromIndices: number[];
}

export function generateMaxDequeTrace(arr: number[], k: number): MaxDequeStep[] {
  const steps: MaxDequeStep[] = [];
  const n = arr.length;
  const resultLen = n - k + 1;
  const resultSoFar: (number | null)[] = Array(resultLen).fill(null);
  const dq: number[] = [];

  // Helper to push step
  const pushStep = (
    type: MaxDequeStep['type'],
    currentIndex: number,
    evictedIndex: number | null,
    evictionReason: MaxDequeStep['evictionReason'],
    codeLineActiveJava: number,
    codeLineActivePseudo: number,
    msg: string
  ) => {
    // Window start index
    const windowStart = Math.max(0, currentIndex - k + 1);
    steps.push({
      type,
      arr,
      k,
      currentIndex,
      windowStart,
      deque: [...dq],
      evictedIndex,
      evictionReason,
      resultSoFar: [...resultSoFar],
      codeLineActiveJava,
      codeLineActivePseudo,
      msg,
      dpArray: arr.map(x => x),
      activeIndex: currentIndex,
      fromIndices: [],
    });
  };

  // Step 1: Init
  pushStep(
    'init',
    -1,
    null,
    null,
    2, // line 3: Deque<Integer> dq = new ArrayDeque<>(); (0-indexed line 2 is line 3)
    1, // line 1: dq = empty deque of indices
    "Maintain a deque of indices where values stay in decreasing order. The front is always the current window's maximum."
  );

  for (let i = 0; i < n; i++) {
    // 1. Evict dominated candidates from back
    while (dq.length > 0 && arr[dq[dq.length - 1]] <= arr[i]) {
      const evicted = dq.pop()!;
      pushStep(
        'evict-back',
        i,
        evicted,
        'dominated',
        5, // line 6: dq.pollLast(); (0-indexed is line 5)
        4, // line 5: remove from back (it can never win now) (0-indexed is line 4)
        `arr[${evicted}] = ${arr[evicted]} ≤ arr[${i}] = ${arr[i]} → index ${evicted} is dominated by index ${i} and can never be the maximum again, remove from the back of deque.`
      );
    }

    // 2. Add current index to back
    dq.push(i);
    pushStep(
      'add',
      i,
      null,
      null,
      7, // line 8: dq.addLast(i); (0-indexed is 7)
      5, // line 6: add index i to the back (0-indexed is 5)
      `Add index ${i} (value ${arr[i]}) to the back of the deque.`
    );

    // 3. Evict expired candidate from front
    if (dq.length > 0 && dq[0] <= i - k) {
      const evicted = dq.shift()!;
      pushStep(
        'evict-front',
        i,
        evicted,
        'expired',
        9, // line 10: dq.pollFirst(); (0-indexed is 9)
        7, // line 8: remove from front (0-indexed is 7)
        `Index ${evicted} has fallen outside the window (current window starts at index ${i - k + 1}) → remove from the front of deque.`
      );
    }

    // 4. Record result for current window
    if (i >= k - 1) {
      const maxVal = arr[dq[0]];
      const resIdx = i - k + 1;
      resultSoFar[resIdx] = maxVal;
      pushStep(
        'record',
        i,
        null,
        null,
        12, // line 13: result[i-k+1] = arr[dq.peekFirst()]; (0-indexed is 12)
        9,  // line 10: this window's max = arr[front of dq] (0-indexed is 9)
        `Window [${resIdx}..${i}]: maximum value is arr[deque.front()] = arr[${dq[0]}] = ${maxVal}.`
      );
    }
  }

  // Done step
  pushStep(
    'done',
    n,
    null,
    null,
    15, // line 16: return result; (0-indexed is 15)
    10, // line 11: return all window maximums (0-indexed is 10)
    `Answer: [${resultSoFar.join(', ')}]`
  );

  return steps;
}
