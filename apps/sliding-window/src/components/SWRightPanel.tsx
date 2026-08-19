import React, { useState, useEffect, useRef } from 'react';
import { useSWStore } from '../store';
import { JavaCodeLine } from '../utils/javaSyntaxHighlight';
import { Copy, Download, Zap, Database, Award, CheckCircle2 } from 'lucide-react';

interface SWRightPanelProps {
  onCollapse: () => void;
}

export const SWRightPanel: React.FC<SWRightPanelProps> = ({ onCollapse }) => {
  const {
    selectedProblemId,
    problem,
    steps,
    cur,
    playing,
    swArray,
    swWindowK,
    fnArray,
    fnWindowK,
    maxDequeArray,
    maxDequeWindowK,
    anagramText,
    anagramPattern,
    anagramPatternLength,
    lsNrString,
    smArray,
    smTarget,
    kdString,
    kdK,
    reset,
  } = useSWStore();

  const [activeTab, setActiveTab] = useState<'code' | 'trace' | 'stats'>('code');
  const [isPseudoCode, setIsPseudoCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const codeScrollRef = useRef<HTMLDivElement>(null);
  const traceScrollRef = useRef<HTMLDivElement>(null);

  const currentStep = cur >= 0 && cur < steps.length ? steps[cur] : null;
  const activeLine = isPseudoCode
    ? (currentStep?.codeLineActivePseudo ?? -1)
    : (currentStep?.codeLineActiveJava ?? -1);
  const isDone = currentStep?.type === 'done';

  // Auto-switch to trace tab when play is clicked
  useEffect(() => {
    if (playing) {
      setActiveTab('trace');
    }
  }, [playing]);

  // Scroll active code line into view
  useEffect(() => {
    if (activeTab === 'code' && codeScrollRef.current) {
      const container = codeScrollRef.current;
      const activeLineEl = container.querySelector('[data-active-line="true"]') as HTMLElement;
      if (activeLineEl) {
        const targetScrollTop =
          activeLineEl.offsetTop - container.clientHeight / 2 + activeLineEl.offsetHeight / 2;
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [activeLine, activeTab]);

  // Scroll active trace step into view
  useEffect(() => {
    if (activeTab === 'trace' && traceScrollRef.current) {
      const container = traceScrollRef.current;
      const activeEntry = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        const targetScrollTop =
          activeEntry.offsetTop - container.clientHeight / 2 + activeEntry.offsetHeight / 2;
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [cur, activeTab]);

  const maxSumPseudo = [
    "function maxSumSubarray(arr, k):",
    "    windowSum = sum of first k elements",
    "    maxSum = windowSum",
    "    for i from k to n-1:",
    "        remove arr[i-k] from the window (slide left edge)",
    "        add arr[i] to the window (slide right edge)",
    "        windowSum = windowSum - arr[i-k] + arr[i]",
    "        maxSum = max(maxSum, windowSum)",
    "    return maxSum",
  ];

  const maxSumJava = [
    "public int maxSumSubarray(int[] arr, int k) {",
    "    int windowSum = 0;",
    "    for (int i = 0; i < k; i++) {",
    "        windowSum += arr[i];",
    "    }",
    "    int maxSum = windowSum;",
    "    for (int i = k; i < arr.length; i++) {",
    "        windowSum = windowSum - arr[i - k] + arr[i];",
    "        maxSum = Math.max(maxSum, windowSum);",
    "    }",
    "    return maxSum;",
    "}",
  ];

  const firstNegPseudo = [
    "function firstNegativeInWindow(arr, k):",
    "    negIndices = empty queue",
    "    for i from 0 to n-1:",
    "        if arr[i] is negative:",
    "            add index i to the back of negIndices",
    "        if window of size k has formed (i >= k-1):",
    "            while front of negIndices is outside window:",
    "                remove it from the front",
    "            answer for this window = arr[front] or 0",
    "                                      if queue is empty",
    "    return all window answers",
  ];

  const firstNegJava = [
    "public int[] firstNegativeInWindow(int[] arr, int k) {",
    "    int n = arr.length;",
    "    int[] result = new int[n - k + 1];",
    "    Deque<Integer> negIndices = new ArrayDeque<>();",
    "    for (int i = 0; i < n; i++) {",
    "        if (arr[i] < 0) {",
    "            negIndices.addLast(i);",
    "        }",
    "        if (i >= k - 1) {",
    "            while (!negIndices.isEmpty()",
    "                   && negIndices.peekFirst() <= i - k) {",
    "                negIndices.pollFirst();",
    "            }",
    "            result[i - k + 1] = negIndices.isEmpty()",
    "                                 ? 0 : arr[negIndices.peekFirst()];",
    "        }",
    "    }",
    "    return result;",
    "}",
  ];

  const maxDequePseudo = [
    "function maxOfAllSubarrays(arr, k):",
    "    dq = empty deque of indices (values stay decreasing)",
    "    for i from 0 to n-1:",
    "        while back of dq points to a SMALLER value:",
    "            remove from back (it can never win now)",
    "        add index i to the back",
    "        if front of dq has fallen outside the window:",
    "            remove from front",
    "        if window of size k has formed:",
    "            this window's max = arr[front of dq]",
    "    return all window maximums",
  ];

  const maxDequeJava = [
    "public int[] maxOfAllSubarrays(int[] arr, int k) {",
    "    int n = arr.length;",
    "    int[] result = new int[n - k + 1];",
    "    Deque<Integer> dq = new ArrayDeque<>();",
    "    for (int i = 0; i < n; i++) {",
    "        while (!dq.isEmpty() && arr[dq.peekLast()] <= arr[i]) {",
    "            dq.pollLast();",
    "        }",
    "        dq.addLast(i);",
    "        if (dq.peekFirst() <= i - k) {",
    "            dq.pollFirst();",
    "        }",
    "        if (i >= k - 1) {",
    "            result[i - k + 1] = arr[dq.peekFirst()];",
    "        }",
    "    }",
    "    return result;",
    "}",
  ];

  const anagramPseudo = [
    "function countAnagrams(text, pattern):",
    "    k = length of pattern",
    "    patternFreq = character frequency map of pattern",
    "    windowFreq = empty character frequency map",
    "    count = 0",
    "    for i from 0 to text.length-1:",
    "        add text[i] to windowFreq",
    "        if window exceeds size k:",
    "            remove text[i-k] from windowFreq",
    "        if window has size k AND",
    "           windowFreq matches patternFreq exactly:",
    "            count++",
    "    return count",
  ];

  const anagramJava = [
    "public int countAnagrams(String text, String pattern) {",
    "    int k = pattern.length();",
    "    int[] patternFreq = new int[26];",
    "    int[] windowFreq = new int[26];",
    "    for (char c : pattern.toCharArray()) {",
    "        patternFreq[c - 'a']++;",
    "    }",
    "    int count = 0;",
    "    for (int i = 0; i < text.length(); i++) {",
    "        windowFreq[text.charAt(i) - 'a']++;",
    "        if (i >= k) {",
    "            windowFreq[text.charAt(i - k) - 'a']--;",
    "        }",
    "        if (i >= k - 1 &&",
    "            java.util.Arrays.equals(patternFreq, windowFreq)) {",
    "            count++;",
    "        }",
    "    }",
    "    return count;",
    "}",
  ];

  const longestSubstrPseudo = [
    "function lengthOfLongestSubstring(s):",
    "    seen = empty set of characters",
    "    left = 0, maxLen = 0",
    "    for right from 0 to n-1:",
    "        while s[right] is already in seen:",
    "            remove s[left] from seen",
    "            move left forward by 1",
    "        add s[right] to seen",
    "        maxLen = max(maxLen, window size)",
    "    return maxLen",
  ];

  const longestSubstrJava = [
    "public int lengthOfLongestSubstring(String s) {",
    "    Set<Character> seen = new HashSet<>();",
    "    int left = 0;",
    "    int maxLen = 0;",
    "    for (int right = 0; right < s.length(); right++) {",
    "        char c = s.charAt(right);",
    "        while (seen.contains(c)) {",
    "            seen.remove(s.charAt(left));",
    "            left++;",
    "        }",
    "        seen.add(c);",
    "        maxLen = Math.max(maxLen, right - left + 1);",
    "    }",
    "    return maxLen;",
    "}",
  ];

  const kdistinctPseudo = [
    "function longestSubstrKDistinct(s, k):",
    "    freq = empty character frequency map",
    "    left = 0, maxLen = 0",
    "    for right from 0 to n-1:",
    "        increment count of s[right] in freq",
    "        while freq has MORE than k distinct keys:",
    "            decrement count of s[left]",
    "            if that count reaches 0:",
    "                remove s[left] from freq entirely",
    "            move left forward by 1",
    "        maxLen = max(maxLen, window size)",
    "    return maxLen",
  ];

  const kdistinctJava = [
    "public int longestSubstrKDistinct(String s, int k) {",
    "    Map<Character, Integer> freq = new HashMap<>();",
    "    int left = 0;",
    "    int maxLen = 0;",
    "    for (int right = 0; right < s.length(); right++) {",
    "        char c = s.charAt(right);",
    "        freq.put(c, freq.getOrDefault(c, 0) + 1);",
    "        while (freq.size() > k) {",
    "            char leftChar = s.charAt(left);",
    "            freq.put(leftChar, freq.get(leftChar) - 1);",
    "            if (freq.get(leftChar) == 0) {",
    "                freq.remove(leftChar);",
    "            }",
    "            left++;",
    "        }",
    "        maxLen = Math.max(maxLen, right - left + 1);",
    "    }",
    "    return maxLen;",
    "}",
  ];

  // Also define code for smallest subarray
  const smallestSubarrayPseudo = [
    "function smallestSubarraySum(arr, target):",
    "    left = 0, windowSum = 0, minLen = infinity",
    "    for right from 0 to n-1:",
    "        add arr[right] to windowSum",
    "        while windowSum >= target:",
    "            this window is valid — check if it's smaller",
    "            remove arr[left] from windowSum",
    "            move left forward by 1",
    "    return minLen, or 0 if never found",
  ];

  const smallestSubarrayJava = [
    "public int smallestSubarraySum(int[] arr, int target) {",
    "    int left = 0;",
    "    long windowSum = 0;",
    "    int minLen = Integer.MAX_VALUE;",
    "    for (int right = 0; right < arr.length; right++) {",
    "        windowSum += arr[right];",
    "        while (windowSum >= target) {",
    "            minLen = Math.min(minLen, right - left + 1);",
    "            windowSum -= arr[left];",
    "            left++;",
    "        }",
    "    }",
    "    return minLen == Integer.MAX_VALUE ? 0 : minLen;",
    "}",
  ];

  const kadanePseudo = [
    "function maxSubArray(arr):",
    "    currentSum = arr[0]",
    "    maxSum = arr[0]",
    "    for i from 1 to n-1:",
    "        if currentSum is negative (a drag on the total):",
    "            RESTART fresh from arr[i] alone",
    "        else:",
    "            EXTEND the running subarray by adding arr[i]",
    "        maxSum = max(maxSum, currentSum)",
    "    return maxSum",
  ];

  const kadaneJava = [
    "public int maxSubArray(int[] arr) {",
    "    int currentSum = arr[0];",
    "    int maxSum = arr[0];",
    "    for (int i = 1; i < arr.length; i++) {",
    "        currentSum = Math.max(arr[i], currentSum + arr[i]);",
    "        maxSum = Math.max(maxSum, currentSum);",
    "    }",
    "    return maxSum;",
    "}",
  ];

  const pseudoCodeLines =
    selectedProblemId === 'first-negative-in-window'
      ? firstNegPseudo
      : selectedProblemId === 'max-of-all-subarrays-k'
      ? maxDequePseudo
      : selectedProblemId === 'count-anagrams-pattern'
      ? anagramPseudo
      : selectedProblemId === 'longest-substr-no-repeat'
      ? longestSubstrPseudo
      : selectedProblemId === 'smallest-subarray-sum-target'
      ? smallestSubarrayPseudo
      : selectedProblemId === 'longest-substr-k-distinct'
      ? kdistinctPseudo
      : selectedProblemId === 'kadanes-max-subarray'
      ? kadanePseudo
      : maxSumPseudo;

  const javaCodeLines =
    selectedProblemId === 'first-negative-in-window'
      ? firstNegJava
      : selectedProblemId === 'max-of-all-subarrays-k'
      ? maxDequeJava
      : selectedProblemId === 'count-anagrams-pattern'
      ? anagramJava
      : selectedProblemId === 'longest-substr-no-repeat'
      ? longestSubstrJava
      : selectedProblemId === 'smallest-subarray-sum-target'
      ? smallestSubarrayJava
      : selectedProblemId === 'longest-substr-k-distinct'
      ? kdistinctJava
      : selectedProblemId === 'kadanes-max-subarray'
      ? kadaneJava
      : maxSumJava;

  const codeLines = isPseudoCode ? pseudoCodeLines : javaCodeLines;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeLines.join('\n'));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleDownload = () => {
    const filename = isPseudoCode
      ? `${problem.name.replace(/\s+/g, '')}_Pseudocode.txt`
      : `${problem.name.replace(/\s+/g, '')}.java`;
    const header = [
      '// ============================================',
      `// ${problem.name} (${isPseudoCode ? 'Pseudocode' : 'Java Implementation'})`,
      '// DSA Visualizer Suite — Generated Code',
      '// ============================================',
      `// Time Complexity:  ${problem.timeComplexity}`,
      `// Space Complexity: ${problem.spaceComplexity}`,
      '// ============================================',
      '',
      '',
    ].join('\n');
    const blob = new Blob([header + codeLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Stats calculations
  const isFN = selectedProblemId === 'first-negative-in-window';
  const isMaxDeque = selectedProblemId === 'max-of-all-subarrays-k';
  const isAnagram = selectedProblemId === 'count-anagrams-pattern';
  const isLsNr = selectedProblemId === 'longest-substr-no-repeat';
  const isSm = selectedProblemId === 'smallest-subarray-sum-target';
  const isKd = selectedProblemId === 'longest-substr-k-distinct';
  const isKadane = selectedProblemId === 'kadanes-max-subarray';

  const finalAnswerMaxSum = !isFN && !isMaxDeque && !isAnagram && !isLsNr && !isSm && !isKd && !isKadane && isDone && currentStep ? (currentStep as any).maxSum : null;
  const finalAnswerFN = isFN && isDone && currentStep ? (currentStep as any).resultSoFar : null;
  const finalAnswerMaxDeque = isMaxDeque && isDone && currentStep ? (currentStep as any).resultSoFar : null;
  const finalAnswerAnagram = isAnagram && isDone && currentStep ? (currentStep as any).countSoFar : null;
  const finalAnswerLsNr = isLsNr && isDone && currentStep ? (currentStep as any).maxLen : null;
  const finalAnswerSm = isSm && isDone && currentStep ? (currentStep as any).minLen : null;
  const finalAnswerKd = isKd && isDone && currentStep ? (currentStep as any).maxLen : null;

  const windowsEvaluated = isLsNr
    ? lsNrString.length
    : isAnagram
    ? anagramText.length - anagramPatternLength + 1
    : isMaxDeque
    ? maxDequeArray.length - maxDequeWindowK + 1
    : isFN
    ? fnArray.length - fnWindowK + 1
    : isSm
    ? smArray.length
    : isKd
    ? kdString.length
    : swArray.length - swWindowK + 1;

  // Total negatives found (First Negative)
  const totalNegativesFound = isFN ? fnArray.filter(x => x < 0).length : 0;

  // Zero windows count (First Negative)
  const finalStep = steps[steps.length - 1] as any;
  const zeroWindowsCount = isFN && finalStep && finalStep.resultSoFar
    ? finalStep.resultSoFar.filter((x: any) => x === 0).length
    : 0;

  // Total evictions count (Max Deque)
  const totalEvictions = isMaxDeque
    ? steps.filter(s => s.type === 'evict-back' || s.type === 'evict-front').length
    : 0;

  // Max ever seen in result windows (Max Deque)
  const maxEverSeen = isMaxDeque && finalStep && finalStep.resultSoFar
    ? Math.max(...finalStep.resultSoFar.filter((x: any) => x !== null && typeof x === 'number'))
    : 0;

  // Distinct characters in pattern (Anagram)
  const distinctCharsInPattern = isAnagram && finalStep ? (finalStep as any).requiredMatches : 0;

  // Violations count (Longest Substring)
  const violationsCount = isLsNr ? steps.filter(s => s.type === 'violation').length : 0;

  // Best substring (Longest Substring)
  const bestSubstring = isLsNr && finalStep ? (finalStep as any).bestSubstring : '';

  // Shrink operations count (Smallest Subarray)
  const shrinkOperationsCount = isSm ? steps.filter(s => s.type === 'shrink').length : 0;

  // Total array sum (Smallest Subarray)
  const totalArraySum = isSm ? smArray.reduce((a, b) => a + b, 0) : 0;

  // Full removal count (K Distinct)
  const fullRemovalCount = isKd ? steps.filter(s => s.type === 'remove-fully').length : 0;

  // Best substring (K Distinct)
  const kdBestSubstring = isKd && finalStep ? (finalStep as any).bestSubstring : '';

  // Progressive trace log: only show steps from 0 up to current step index
  const visibleSteps = steps.slice(0, Math.min(steps.length, cur + 1));

  return (
    <div className="w-full h-full flex flex-col font-sans select-none bg-[var(--panel-bg)] overflow-hidden">
      {/* 1. ANALYSIS HEADER BAR */}
      <div className="h-[44px] border-b border-[var(--border-color)] bg-[var(--panel-bg)] px-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 select-none">
          <span className="text-purple-500 text-sm">🔬</span>
          <h2 className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--muted-color)] font-sans">
            Analysis
          </h2>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded-lg border border-[var(--border-color)] text-[var(--muted-color)] bg-transparent hover:border-red-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear
          </button>

          <button
            onClick={onCollapse}
            className="w-[26px] h-[26px] flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
            title="Collapse panel"
          >
            <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTROLS */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '3px',
            gap: '3px',
          }}
        >
          {(['code', 'trace', 'stats'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase' as const,
                  transition: 'all 0.18s ease',
                  ...(isActive
                    ? { background: 'var(--accent-indigo-dim)', color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }
                    : { background: 'transparent', color: 'var(--muted-color)' }),
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE TAB CONTENT AREA */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
        {/* CODE TAB */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Code Options Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                borderBottom: '1px solid var(--border-color)',
                flexShrink: 0,
                background: 'rgba(255,255,255,0.015)',
                gap: '8px',
              }}
            >
              {/* Java / Pseudo Toggle */}
              <div
                style={{
                  display: 'flex',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '2px',
                  gap: '2px',
                }}
              >
                {[{ label: 'Java', pseudo: false }, { label: 'Pseudo', pseudo: true }].map(({ label, pseudo }) => {
                  const active = isPseudoCode === pseudo;
                  return (
                    <button
                      key={label}
                      onClick={() => setIsPseudoCode(pseudo)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        transition: 'all 0.15s ease',
                        ...(active
                          ? { background: 'var(--accent-indigo-dim)', color: '#fff' }
                          : { background: 'transparent', color: 'var(--muted-color)' }),
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Utility Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handleCopy}
                  title="Copy Code"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: copySuccess ? 'rgba(74,222,128,0.12)' : 'var(--input-bg)',
                    color: copySuccess ? 'var(--accent-green)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Copy style={{ width: '11px', height: '11px' }} />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  title="Download Code"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Download style={{ width: '11px', height: '11px' }} />
                  Download
                </button>
              </div>
            </div>

            {/* Code Lines Display */}
            <div
              ref={codeScrollRef}
              className="flex-1 overflow-y-auto no-scrollbar p-3 font-mono text-xs leading-relaxed bg-[var(--bg-primary)]/10"
            >
              {codeLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isHighlighted = activeLine === idx;
                return (
                  <div
                    key={idx}
                    data-active-line={isHighlighted ? 'true' : 'false'}
                    className={`flex select-text py-0.5 border-l-2 pl-3 ${
                      isHighlighted
                        ? 'bg-[var(--code-active-bg)] border-[var(--accent-indigo)]'
                        : 'border-transparent hover:bg-[var(--bg-card-hover)]/40'
                    }`}
                  >
                    <span className="w-6 shrink-0 text-right pr-3 select-none text-[var(--muted-color)]/60 font-mono text-[10px]">
                      {lineNum}
                    </span>
                    <pre className="flex-1 whitespace-pre-wrap break-all font-mono">
                      <JavaCodeLine line={line} />
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRACE TAB */}
        {activeTab === 'trace' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div
              ref={traceScrollRef}
              className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2 bg-[var(--bg-primary)]/10"
            >
              {visibleSteps.map((step, idx) => {
                const isSelected = cur === idx;
                const isCompleted = idx < cur;
                return (
                  <div
                    key={idx}
                    data-active={isSelected ? 'true' : 'false'}
                    className={`p-3 rounded-lg border flex flex-col gap-1 transition-all ${
                      isSelected
                        ? 'bg-[var(--accent-indigo-bg)] border-[var(--accent-indigo)] shadow-sm'
                        : isCompleted
                        ? 'bg-[var(--bg-card)]/40 border-[var(--border-color)] opacity-70'
                        : 'bg-[var(--bg-card)]/10 border-[var(--border-color)]/40 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--muted-color)]">
                      <span className="font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--input-bg)] border border-[var(--border-color)]">
                        Step {idx + 1} ({step.type})
                      </span>
                      {isSelected && (
                        <span className="text-[var(--accent-indigo)] font-bold text-[9px] uppercase tracking-wider animate-pulse font-sans px-2 py-0.5 rounded-full bg-[var(--accent-indigo-bg)] border border-[var(--accent-indigo)]/30">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] font-mono leading-relaxed text-[var(--text-color)] mt-1">
                      {step.msg}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px 14px' }}>
            {/* Answer Card */}
            {isKd ? (
              finalAnswerKd !== null ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Max Length Found
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>
                      {finalAnswerKd}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>
                      chars: "{kdBestSubstring}"
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )
            ) : isSm ? (
              finalAnswerSm !== null ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Min Length Found
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>
                      {finalAnswerSm === null ? 0 : finalAnswerSm}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>elements</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )
            ) : isLsNr ? (
              finalAnswerLsNr !== null ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Max Length Found
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>
                      {finalAnswerLsNr}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>
                      chars: "{bestSubstring}"
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )
            ) : isAnagram ? (
              finalAnswerAnagram !== null ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Anagrams Counted
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>
                      {finalAnswerAnagram}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>anagram(s) found</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )
            ) : isMaxDeque ? (
              finalAnswerMaxDeque !== null ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Result Array Computed
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1.2, wordBreak: 'break-all' }}>
                      [{finalAnswerMaxDeque.join(', ')}]
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )
            ) : isFN ? (
              finalAnswerFN !== null ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Result Array Computed
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1.2, wordBreak: 'break-all' }}>
                      [{finalAnswerFN.join(', ')}]
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )
            ) : isKadane ? (
              finalStep?.type === 'done' ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Max Subarray Sum Found
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>
                      {(finalStep as any)?.maxSum ?? '—'}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>
                      (indices {(finalStep as any)?.bestStart}..{(finalStep as any)?.bestEnd})
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )
            ) : (
              finalAnswerMaxSum !== null ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Max Sum Found
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>
                      {finalAnswerMaxSum}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>total</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )
            )}

            {/* Grid Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {isKd ? (
                [
                  { label: 'Steps Taken', value: `${steps.length}`, color: 'var(--accent-blue)' },
                  { label: 'Full Removals', value: `${fullRemovalCount}`, color: 'var(--accent-coral)' },
                  { label: 'Max Length Found', value: finalAnswerKd !== null ? `${finalAnswerKd}` : '—', color: 'var(--accent-green)' },
                  { label: 'K (Distinct Limit)', value: `${kdK}`, color: 'var(--accent-indigo)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                  </div>
                ))
              ) : isSm ? (
                [
                  { label: 'Steps Taken', value: `${steps.length}`, color: 'var(--accent-blue)' },
                  { label: 'Shrink Operations', value: `${shrinkOperationsCount}`, color: 'var(--accent-indigo)' },
                  { label: 'Min Length Found', value: finalAnswerSm !== null ? `${finalAnswerSm}` : '—', color: 'var(--accent-green)' },
                  { label: 'Target', value: `${smTarget}`, color: 'var(--accent-coral)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                  </div>
                ))
              ) : isLsNr ? (
                [
                  { label: 'Steps Taken', value: `${steps.length}`, color: 'var(--accent-blue)' },
                  { label: 'Violations (Shrinks)', value: `${violationsCount}`, color: 'var(--accent-indigo)' },
                  { label: 'Max Length Found', value: finalAnswerLsNr !== null ? `${finalAnswerLsNr}` : '—', color: 'var(--accent-green)' },
                  { label: 'Best Substring', value: finalAnswerLsNr !== null ? `"${bestSubstring}"` : '—', color: 'var(--accent-coral)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                  </div>
                ))
              ) : isAnagram ? (
                [
                  { label: 'Steps Taken', value: `${steps.length}`, color: 'var(--accent-blue)' },
                  { label: 'Windows Checked', value: `${windowsEvaluated}`, color: 'var(--accent-indigo)' },
                  { label: 'Anagrams Found', value: finalAnswerAnagram !== null ? `${finalAnswerAnagram}` : '—', color: 'var(--accent-green)' },
                  { label: 'Distinct Chars in Pattern', value: `${distinctCharsInPattern}`, color: 'var(--accent-coral)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))
              ) : isMaxDeque ? (
                [
                  { label: 'Steps Taken', value: `${steps.length}`, color: 'var(--accent-blue)' },
                  { label: 'Total Evictions', value: `${totalEvictions}`, color: 'var(--accent-indigo)' },
                  { label: 'Windows Evaluated', value: `${windowsEvaluated}`, color: 'var(--accent-green)' },
                  { label: 'Max Ever Seen', value: finalAnswerMaxDeque !== null ? `${maxEverSeen}` : '—', color: 'var(--accent-coral)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))
              ) : isFN ? (
                [
                  { label: 'Steps Taken', value: `${steps.length}`, color: 'var(--accent-blue)' },
                  { label: 'Total Negatives Found', value: `${totalNegativesFound}`, color: 'var(--accent-indigo)' },
                  { label: 'Windows with No Negatives', value: finalAnswerFN !== null ? `${zeroWindowsCount}` : '—', color: 'var(--accent-green)' },
                  { label: 'Windows Evaluated', value: `${windowsEvaluated}`, color: 'var(--accent-coral)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))
              ) : isKadane ? (
                [
                  { label: 'Steps Taken', value: `${steps.length}`, color: 'var(--accent-blue)' },
                  { label: 'Restarts Triggered', value: `${steps.filter((s: any) => s.type === 'restart').length}`, color: 'var(--accent-coral)' },
                  { label: 'Max Sum Found', value: (finalStep as any)?.maxSum !== undefined ? `${(finalStep as any).maxSum}` : '—', color: 'var(--accent-green)' },
                  { label: 'Best Subarray Length', value: (finalStep as any)?.bestStart !== undefined ? `${(finalStep as any).bestEnd - (finalStep as any).bestStart + 1}` : '—', color: 'var(--accent-indigo)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))
              ) : (
                [
                  { label: 'Steps Taken', value: `${steps.length}`, color: 'var(--accent-blue)' },
                  { label: 'Window Size (K)', value: `${swWindowK}`, color: 'var(--accent-indigo)' },
                  { label: 'Max Sum Found', value: finalAnswerMaxSum !== null ? `${finalAnswerMaxSum}` : '—', color: 'var(--accent-green)' },
                  { label: 'Windows Evaluated', value: `${windowsEvaluated}`, color: 'var(--accent-coral)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. PINNED SEARCH STRATEGY PANEL */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '12px 16px',
          background: 'var(--panel-bg)',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        <div className="text-[10px] font-bold tracking-[0.1em] text-[var(--muted-color)] uppercase mb-1.5 font-sans">
          WINDOW STRATEGY
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--cell-active-text)',
            marginBottom: '4px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {isKd ? (
            <>
              freq[s[right]]++
              <br />
              while freq.size() &gt; k: freq[s[left]]--; left++
              <br />
              maxLen = max(maxLen, right - left + 1)
            </>
          ) : isSm ? (
            <>
              windowSum += arr[right]
              <br />
              while windowSum &gt;= target: minLen = min(minLen, right-left+1); left++
            </>
          ) : isLsNr ? (
            <>
              while s[right] in seen: remove s[left], left++
              <br />
              seen.add(s[right])
              <br />
              maxLen = max(maxLen, right - left + 1)
            </>
          ) : isAnagram ? (
            <>
              windowFreq[text[i]]++
              <br />
              if window size &gt; k: windowFreq[text[i-k]]--
              <br />
              if matches === requiredMatches: valid anagram found
            </>
          ) : isMaxDeque ? (
            <>
              while arr[dq.back()] ≤ arr[i]: dq.removeLast() (dominated)
              <br />
              dq.addLast(i)
              <br />
              if dq.front() ≤ i-k: dq.removeFirst() (expired)
              <br />
              windowMax = arr[dq.front()]
            </>
          ) : isFN ? (
            <>
              if arr[i] &lt; 0: queue.addLast(i)
              <br />
              while queue.front ≤ i - k: queue.removeFirst()
              <br />
              answer = queue.isEmpty() ? 0 : arr[queue.front()]
            </>
          ) : isKadane ? (
            <>
              currentSum = max(arr[i], currentSum + arr[i])
              <br />
              maxSum = max(maxSum, currentSum)
              <br />
              Base: currentSum = maxSum = arr[0]
            </>
          ) : (
            <>
              windowSum = windowSum - arr[i-k] + arr[i]
              <br />
              maxSum = max(maxSum, windowSum)
            </>
          )}
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'var(--muted-color)',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {isKd
            ? "Asymmetric window: left edge shrinks to evict distinct characters"
            : isSm
            ? "Asymmetric window: shrink greedily from left when sum ≥ target"
            : isLsNr
            ? "Asymmetric window: left edge only advances to resolve violations"
            : isAnagram
            ? "Frequency maps comparison using running matches count"
            : isMaxDeque
            ? "Monotonic deque elements are kept in decreasing order"
            : isFN
            ? "Queue tracks indices of negatives in window"
            : isKadane
            ? "Dynamic window: restarts fresh whenever currentSum becomes negative"
            : "Base: windowSum = sum of first k elements"}
        </div>
      </div>
    </div>
  );
};
