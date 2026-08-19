export interface KDistinctStep {
  type: 'init' | 'expand' | 'over-limit' | 'decrement' | 'remove-fully' | 'record' | 'done';
  text: string;
  k: number;
  left: number;
  right: number;
  freqMap: Record<string, number>;
  maxLen: number;
  bestSubstring: string;
  affectedChar: string | null;
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
  // DPTape compatibility
  dpArray: (number | string | null)[];
  activeIndex: number;
  fromIndices: number[];
}

export function buildKDistinctTrace(text: string, k: number): KDistinctStep[] {
  const steps: KDistinctStep[] = [];
  const n = text.length;

  let left = 0;
  let maxLen = 0;
  let bestSubstring = "";
  const freqMap: Record<string, number> = {};

  const getFreqMapCopy = () => ({ ...freqMap });
  const getDistinctCount = (map: Record<string, number>) => Object.keys(map).length;

  const pushStep = (
    type: KDistinctStep['type'],
    curLeft: number,
    curRight: number,
    affectedChar: string | null,
    codeLineActiveJava: number,
    codeLineActivePseudo: number,
    msg: string
  ) => {
    steps.push({
      type,
      text,
      k,
      left: curLeft,
      right: curRight,
      freqMap: getFreqMapCopy(),
      maxLen,
      bestSubstring,
      affectedChar,
      codeLineActiveJava,
      codeLineActivePseudo,
      msg,
      // DPTape compatibility
      dpArray: text.split(''),
      activeIndex: curRight,
      fromIndices: [],
    });
  };

  // Init step
  pushStep(
    'init',
    0,
    -1,
    null,
    3, // line 3: int maxLen = 0;
    3, // line 3: left = 0, maxLen = 0
    `Expand right, tracking character frequencies. If distinct characters exceed ${k}, shrink from the left.`
  );

  for (let right = 0; right < n; right++) {
    const c = text[right];
    freqMap[c] = (freqMap[c] || 0) + 1;

    // Expand step
    pushStep(
      'expand',
      left,
      right,
      null,
      6, // line 6: freq.put(c, ...)
      5, // line 5: increment count of s[right] in freq
      `Add '${c}' (index ${right}) → freq['${c}'] = ${freqMap[c]}`
    );

    if (getDistinctCount(freqMap) > k) {
      // Over limit step
      pushStep(
        'over-limit',
        left,
        right,
        null,
        7, // line 7: while (freq.size() > k)
        6, // line 6: while freq has MORE than k distinct keys
        `Now tracking ${getDistinctCount(freqMap)} distinct characters, exceeds limit of ${k}! Must shrink.`
      );

      while (getDistinctCount(freqMap) > k) {
        const leftChar = text[left];
        freqMap[leftChar]--;
        const newCount = freqMap[leftChar];

        if (newCount === 0) {
          delete freqMap[leftChar];

          // Remove fully step
          pushStep(
            'remove-fully',
            left,
            right,
            leftChar,
            11, // line 11: freq.remove(leftChar)
            9,  // line 9: remove s[left] from freq entirely
            `'${leftChar}' count reached 0 → remove it entirely from the map (${getDistinctCount(freqMap)} distinct chars remain)`
          );
        } else {
          // Decrement step
          pushStep(
            'decrement',
            left,
            right,
            leftChar,
            9, // line 9: freq.put(leftChar, freq.get(leftChar) - 1)
            7, // line 7: decrement count of s[left]
            `Decrement '${leftChar}' → freq['${leftChar}'] = ${newCount} ('${leftChar}' still present, just fewer occurrences)`
          );
        }

        left++;
      }
    }

    const currentLen = right - left + 1;
    let isNewMax = false;
    if (currentLen > maxLen) {
      maxLen = currentLen;
      bestSubstring = text.substring(left, right + 1);
      isNewMax = true;
    }

    // Record step
    pushStep(
      'record',
      left,
      right,
      null,
      15, // line 15: maxLen = Math.max(...)
      11, // line 11: maxLen = max(maxLen, window size)
      `Window "${text.substring(left, right + 1)}" length ${currentLen} → ${isNewMax ? 'New max!' : 'No new max'}`
    );
  }

  // Done step
  pushStep(
    'done',
    left,
    n - 1,
    null,
    18, // line 18: return maxLen;
    12, // line 12: return maxLen
    `Answer: longest substring with at most ${k} distinct characters = "${bestSubstring}" (length ${maxLen})`
  );

  return steps;
}
