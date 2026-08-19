export interface LongestSubstrStep {
  type: 'init' | 'expand' | 'violation' | 'shrink' | 'record' | 'done';
  text: string;
  left: number;
  right: number;
  seenChars: string[];
  maxLen: number;
  bestSubstring: string;
  violatingChar: string | null; // set during 'violation'/'shrink' steps only
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
  // DPTape compatibility properties
  dpArray: (number | string | null)[];
  activeIndex: number;
  fromIndices: number[];
}

export function buildLongestSubstrTrace(text: string): LongestSubstrStep[] {
  const steps: LongestSubstrStep[] = [];
  const n = text.length;

  let left = 0;
  let maxLen = 0;
  let bestSubstring = '';
  let seenChars: string[] = [];

  // Helper to push step
  const pushStep = (
    type: LongestSubstrStep['type'],
    curLeft: number,
    curRight: number,
    violatingChar: string | null,
    codeLineActiveJava: number,
    codeLineActivePseudo: number,
    msg: string
  ) => {
    steps.push({
      type,
      text,
      left: curLeft,
      right: curRight,
      seenChars: [...seenChars],
      maxLen,
      bestSubstring,
      violatingChar,
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
    2, // line 3: int maxLen = 0; (0-indexed is 2)
    2, // line 3: left = 0, maxLen = 0
    "Expand the window right one character at a time. If we hit a duplicate, shrink from the left until it's gone."
  );

  for (let right = 0; right < n; right++) {
    const c = text[right];

    // Check for violation
    if (seenChars.includes(c)) {
      // Violation step
      pushStep(
        'violation',
        left,
        right,
        c,
        5, // line 6: while (seen.contains(c))
        4, // line 5: while s[right] is already in seen:
        `'${c}' at index ${right} already exists in the window! Need to shrink from the left.`
      );

      while (seenChars.includes(c)) {
        const removedChar = text[left];
        // Remove from seenChars
        seenChars = seenChars.filter((x) => x !== removedChar);

        // Shrink step (captures removal and pointer move)
        pushStep(
          'shrink',
          left,
          right,
          c,
          6, // line 7: seen.remove(s.charAt(left))
          5, // line 6: remove s[left] from seen
          `Remove '${removedChar}' (index ${left}) from window → left moves to ${left + 1}`
        );

        left++;
      }
    }

    // Expand step
    seenChars.push(c);
    pushStep(
      'expand',
      left,
      right,
      null,
      9, // line 10: seen.add(c)
      7, // line 8: add s[right] to seen
      `Add '${c}' (index ${right}) to window`
    );

    // Record step
    const currentLen = right - left + 1;
    let isNewMax = false;
    if (currentLen > maxLen) {
      maxLen = currentLen;
      bestSubstring = text.substring(left, right + 1);
      isNewMax = true;
    }

    const recordMsg = isNewMax
      ? `Window "${text.substring(left, right + 1)}" has length ${currentLen} → New max! maxLen = ${maxLen}`
      : `Window "${text.substring(left, right + 1)}" has length ${currentLen} (not a new max)`;

    pushStep(
      'record',
      left,
      right,
      null,
      10, // line 11: maxLen = Math.max(...)
      8,  // line 9: maxLen = max(maxLen, window size)
      recordMsg
    );
  }

  // Done step
  pushStep(
    'done',
    left,
    n - 1,
    null,
    12, // line 13: return maxLen;
    9,  // line 10: return maxLen
    `Answer: longest substring without repeats = "${bestSubstring}" (length ${maxLen})`
  );

  return steps;
}
