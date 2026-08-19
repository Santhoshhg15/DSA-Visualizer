export interface AnagramStep {
  type: 'init' | 'expand' | 'shrink' | 'check' | 'done';
  text: string;
  pattern: string;
  k: number;
  currentIndex: number;
  windowStart: number;
  patternFreq: Record<string, number>;
  windowFreq: Record<string, number>;
  matches: number;
  requiredMatches: number;
  isValidAnagram: boolean;
  countSoFar: number;
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
  // DPTape compatibility properties
  dpArray: (number | string | null)[];
  activeIndex: number;
  fromIndices: number[];
}

export function buildAnagramTrace(text: string, pattern: string): AnagramStep[] {
  const steps: AnagramStep[] = [];
  const k = pattern.length;
  const n = text.length;

  // Build patternFreq
  const patternFreq: Record<string, number> = {};
  for (const c of pattern) {
    patternFreq[c] = (patternFreq[c] || 0) + 1;
  }
  const requiredMatches = Object.keys(patternFreq).length;

  const windowFreq: Record<string, number> = {};
  let matches = 0;
  let countSoFar = 0;

  // Helper to push step
  const pushStep = (
    type: AnagramStep['type'],
    currentIndex: number,
    isValidAnagram: boolean,
    codeLineActiveJava: number,
    codeLineActivePseudo: number,
    msg: string
  ) => {
    const windowStart = Math.max(0, currentIndex - k + 1);
    steps.push({
      type,
      text,
      pattern,
      k,
      currentIndex,
      windowStart,
      patternFreq: { ...patternFreq },
      windowFreq: { ...windowFreq },
      matches,
      requiredMatches,
      isValidAnagram,
      countSoFar,
      codeLineActiveJava,
      codeLineActivePseudo,
      msg,
      // DPTape compatibility
      dpArray: text.split(''),
      activeIndex: currentIndex,
      fromIndices: [],
    });
  };

  // Init step
  const reqSummary = Object.entries(patternFreq)
    .map(([char, count]) => `'${char}': ${count}`)
    .join(', ');
  pushStep(
    'init',
    -1,
    false,
    3, // line 4: for (char c : pattern.toCharArray()) (0-indexed line 3 is line 4)
    2, // line 3: patternFreq = character frequency map of pattern
    `Pattern "${pattern}" requires frequencies: { ${reqSummary} }. Sliding a window of size ${k} across the text.`
  );

  for (let i = 0; i < n; i++) {
    const enteringChar = text[i];

    // Expand step
    const prevCount = windowFreq[enteringChar] || 0;
    const newCount = prevCount + 1;
    windowFreq[enteringChar] = newCount;

    let expandMsg = `Add '${enteringChar}' at index ${i} to window → windowFreq['${enteringChar}'] = ${newCount}`;

    // Adjust matches
    const required = patternFreq[enteringChar];
    if (required !== undefined) {
      if (newCount === required) {
        matches++;
        expandMsg += ` (matches required count of ${required}! total matches = ${matches}/${requiredMatches})`;
      } else if (prevCount === required) {
        matches--;
        expandMsg += ` (overcounted! total matches = ${matches}/${requiredMatches})`;
      }
    }

    pushStep('expand', i, false, 8, 6, expandMsg);

    // Shrink step
    if (i >= k) {
      const leavingChar = text[i - k];
      const prevLeavingCount = windowFreq[leavingChar];
      const newLeavingCount = prevLeavingCount - 1;

      if (newLeavingCount === 0) {
        delete windowFreq[leavingChar];
      } else {
        windowFreq[leavingChar] = newLeavingCount;
      }

      let shrinkMsg = `Window exceeds size ${k}, remove '${leavingChar}' at index ${i - k} → windowFreq['${leavingChar}'] = ${newLeavingCount}`;

      // Adjust matches
      const reqLeaving = patternFreq[leavingChar];
      if (reqLeaving !== undefined) {
        if (newLeavingCount === reqLeaving) {
          matches++;
          shrinkMsg += ` (restored to required count of ${reqLeaving}! total matches = ${matches}/${requiredMatches})`;
        } else if (prevLeavingCount === reqLeaving) {
          matches--;
          shrinkMsg += ` (undercounted! total matches = ${matches}/${requiredMatches})`;
        }
      }

      pushStep('shrink', i, false, 10, 8, shrinkMsg);
    }

    // Check step
    if (i >= k - 1) {
      const isValid = matches === requiredMatches;
      if (isValid) {
        countSoFar++;
      }

      const windowText = text.substring(i - k + 1, i + 1);
      const checkMsg = isValid
        ? `Window "${windowText}": all ${requiredMatches} distinct character frequencies match patternFreq → ANAGRAM FOUND! (count = ${countSoFar})`
        : `Window "${windowText}": matches are ${matches}/${requiredMatches} → not an anagram.`;

      pushStep('check', i, isValid, 12, 10, checkMsg);
    }
  }

  // Done step
  pushStep(
    'done',
    n,
    false,
    16, // line 17: return count;
    12, // line 13: return count;
    `Answer: ${countSoFar} anagram(s) of "${pattern}" found in "${text}"`
  );

  return steps;
}
