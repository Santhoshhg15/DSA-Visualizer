import { create } from 'zustand';
import { SW_PROBLEMS, type SWProblem } from './data/swProblems';
import { buildMaxSumSubarrayTrace, type MaxSumWindowStep } from './engines/maxSumSubarrayK';
import { buildFirstNegativeTrace, type FirstNegStep } from './engines/firstNegativeInWindow';
import { generateMaxDequeTrace, type MaxDequeStep } from './engines/maxOfAllSubarraysK';
import { buildAnagramTrace, type AnagramStep } from './engines/countAnagramsPattern';
import { buildLongestSubstrTrace, type LongestSubstrStep } from './engines/longestSubstrNoRepeat';
import { buildSmallestSubarrayTrace, type SmallestSubarrayStep } from './engines/smallestSubarraySumTarget';
import { buildKDistinctTrace, type KDistinctStep } from './engines/longestSubstrKDistinct';
import { buildKadaneTrace, type KadaneStep } from './engines/kadanesMaxSubarray';

export type SpeedOption = '0.25x' | '0.5x' | '1x' | '1.5x' | '2x';

export const SPEED_MAP: Record<SpeedOption, number> = {
  '0.25x': 2400,
  '0.5x': 1200,
  '1x': 800,
  '1.5x': 500,
  '2x': 300,
};

export type SWStep = MaxSumWindowStep | FirstNegStep | MaxDequeStep | AnagramStep | LongestSubstrStep | SmallestSubarrayStep | KDistinctStep | KadaneStep;

interface SWState {
  // Input settings (Max Sum Subarray)
  swArraySize: number;
  swWindowK: number;
  swMaxValue: number;
  swArray: number[];

  // Input settings (First Negative in Window)
  fnArraySize: number;
  fnWindowK: number;
  fnValueRange: number;
  fnArray: number[];

  // Input settings (Max of All Subarrays)
  maxDequeArraySize: number;
  maxDequeWindowK: number;
  maxDequeMaxValue: number;
  maxDequeArray: number[];

  // Input settings (Count Anagrams of a Pattern)
  anagramTextLength: number;
  anagramPatternLength: number;
  anagramAlphabetSize: number;
  anagramText: string;
  anagramPattern: string;

  // Input settings (Longest Substring Without Repeating)
  lsNrStringLength: number;
  lsNrAlphabetSize: number;
  lsNrString: string;

  // Input settings (Smallest Subarray with Sum >= Target)
  smArraySize: number;
  smMaxValue: number;
  smTarget: number;
  smArray: number[];

  // Input settings (Longest Substring with At Most K Distinct)
  kdStringLength: number;
  kdAlphabetSize: number;
  kdK: number;
  kdString: string;

  // Input settings (Kadane's Maximum Subarray Sum)
  kadaneArraySize: number;
  kadaneValueRange: number;
  kadaneArray: number[];

  // Execution steps
  steps: SWStep[];
  cur: number;
  playing: boolean;
  speedLabel: SpeedOption;
  problem: SWProblem;
  theme: 'dark' | 'light';
  timerId: number | null;
  selectedProblemId: string;

  // Actions (Max Sum Subarray)
  setSWArraySize: (size: number) => void;
  setSWWindowK: (k: number) => void;
  setSWMaxValue: (max: number) => void;
  generateSWArray: () => void;

  // Actions (First Negative in Window)
  setFNArraySize: (size: number) => void;
  setFNWindowK: (k: number) => void;
  setFNValueRange: (max: number) => void;
  generateFNArray: () => void;

  // Actions (Max of All Subarrays)
  setMaxDequeArraySize: (size: number) => void;
  setMaxDequeWindowK: (k: number) => void;
  setMaxDequeMaxValue: (max: number) => void;
  generateMaxDequeArray: () => void;

  // Actions (Count Anagrams of a Pattern)
  setAnagramTextLength: (size: number) => void;
  setAnagramPatternLength: (k: number) => void;
  setAnagramAlphabetSize: (size: number) => void;
  generateAnagramInputs: () => void;

  // Actions (Longest Substring Without Repeating)
  setLsNrStringLength: (size: number) => void;
  setLsNrAlphabetSize: (size: number) => void;
  generateLsNrString: () => void;

  // Actions (Smallest Subarray with Sum >= Target)
  setSmArraySize: (size: number) => void;
  setSmMaxValue: (max: number) => void;
  setSmTarget: (target: number) => void;
  generateSmArray: () => void;

  // Actions (Longest Substring with At Most K Distinct)
  setKdStringLength: (size: number) => void;
  setKdAlphabetSize: (size: number) => void;
  setKdK: (k: number) => void;
  generateKdString: () => void;

  // Actions (Kadane's Maximum Subarray Sum)
  setKadaneArraySize: (size: number) => void;
  setKadaneValueRange: (max: number) => void;
  generateKadaneArray: () => void;

  // Shared Actions
  togglePlay: () => void;
  setSpeedLabel: (speed: SpeedOption) => void;
  stepForward: () => void;
  stepBackward: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  reset: () => void;
  toggleTheme: () => void;
  setSelectedProblemId: (id: string) => void;
  regenerateTrace: () => void;
}

function generateRandomArray(count: number, maxVal: number): number[] {
  // values in [-10, maxVal]
  return Array.from({ length: count }, () => {
    const min = -10;
    const max = maxVal;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });
}

function generateFNRandomArray(count: number, maxVal: number): number[] {
  let arr: number[] = [];
  while (true) {
    arr = Array.from({ length: count }, () => {
      const min = -maxVal;
      const max = maxVal;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });
    const negCount = arr.filter(x => x < 0).length;
    if (negCount >= 2) break; // Ensure at least 2 negative numbers
  }
  return arr;
}

function generateKadaneRandomArray(count: number, maxVal: number): number[] {
  let arr: number[] = [];
  while (true) {
    arr = Array.from({ length: count }, () => {
      const min = -maxVal;
      const max = maxVal;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });
    const posCount = arr.filter(x => x > 0).length;
    const negCount = arr.filter(x => x < 0).length;
    // Guarantee mixed sign array with at least 2 positive and at least 2 negative numbers
    if (posCount >= 2 && negCount >= 2) break;
  }
  return arr;
}

function generateRandomString(length: number, alphabetSize: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz'.substring(0, alphabetSize);
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}

function generateAnagramInputsHelper(textLen: number, patLen: number, alphabetSize: number) {
  const text = generateRandomString(textLen, alphabetSize);
  const startIdx = Math.floor(Math.random() * (textLen - patLen + 1));
  const subStr = text.substring(startIdx, startIdx + patLen);
  const shuffled = subStr.split('').sort(() => Math.random() - 0.5).join('');
  return { text, pattern: shuffled };
}

export const useSWStore = create<SWState>((set, get) => {
  const initialArraySize = 8;
  const initialWindowK = 3;
  const initialMaxValue = 15;
  const initialArray = [10, -3, 4, 12, -5, 6, 8, -1]; // Seed array

  const initialFNArraySize = 9;
  const initialFNWindowK = 3;
  const initialFNValueRange = 10;
  const initialFNArray = [12, -1, -7, 8, -15, 3, 0, 9, -2]; // Seed array with negatives

  const initialMaxDequeArraySize = 8;
  const initialMaxDequeWindowK = 3;
  const initialMaxDequeMaxValue = 15;
  const initialMaxDequeArray = [1, 3, -1, -3, 5, 3, 6, 7]; // Seed array (Matches test case [3,3,5,5,6,7])

  const initialAnagramTextLength = 10;
  const initialAnagramPatternLength = 3;
  const initialAnagramAlphabetSize = 3;
  const initialAnagramText = "cbaebabacd";
  const initialAnagramPattern = "abc";

  const initialLsNrStringLength = 10;
  const initialLsNrAlphabetSize = 4;
  const initialLsNrString = "abcabcbb";

  const initialSmArraySize = 8;
  const initialSmMaxValue = 10;
  const initialSmTarget = 7;
  const initialSmArray = [2, 3, 1, 2, 4, 3, 1, 2];

  const initialKdStringLength = 12;
  const initialKdAlphabetSize = 5;
  const initialKdK = 2;
  const initialKdString = "ecebaacbbaee";

  const initialKadaneArraySize = 9;
  const initialKadaneValueRange = 10;
  const initialKadaneArray = [-2, 1, -3, 4, -1, 2, 1, -5, 4]; // Classic Kadane seed array

  const initialProblem = SW_PROBLEMS[0]; // Maximum Sum Subarray of Size K
  const initialSteps = buildMaxSumSubarrayTrace(initialArray, initialWindowK);

  return {
    swArraySize: initialArraySize,
    swWindowK: initialWindowK,
    swMaxValue: initialMaxValue,
    swArray: initialArray,

    fnArraySize: initialFNArraySize,
    fnWindowK: initialFNWindowK,
    fnValueRange: initialFNValueRange,
    fnArray: initialFNArray,

    maxDequeArraySize: initialMaxDequeArraySize,
    maxDequeWindowK: initialMaxDequeWindowK,
    maxDequeMaxValue: initialMaxDequeMaxValue,
    maxDequeArray: initialMaxDequeArray,

    anagramTextLength: initialAnagramTextLength,
    anagramPatternLength: initialAnagramPatternLength,
    anagramAlphabetSize: initialAnagramAlphabetSize,
    anagramText: initialAnagramText,
    anagramPattern: initialAnagramPattern,

    lsNrStringLength: initialLsNrStringLength,
    lsNrAlphabetSize: initialLsNrAlphabetSize,
    lsNrString: initialLsNrString,

    smArraySize: initialSmArraySize,
    smMaxValue: initialSmMaxValue,
    smTarget: initialSmTarget,
    smArray: initialSmArray,

    kdStringLength: initialKdStringLength,
    kdAlphabetSize: initialKdAlphabetSize,
    kdK: initialKdK,
    kdString: initialKdString,

    kadaneArraySize: initialKadaneArraySize,
    kadaneValueRange: initialKadaneValueRange,
    kadaneArray: initialKadaneArray,

    steps: initialSteps,
    cur: 0,
    playing: false,
    speedLabel: '1x',
    problem: initialProblem,
    theme: 'dark',
    timerId: null,
    selectedProblemId: initialProblem.id,

    setSWArraySize: (size: number) => {
      const clampedSize = Math.max(6, Math.min(12, size));
      const { swWindowK, swMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const updatedK = Math.min(clampedSize, swWindowK);
      const newArray = generateRandomArray(clampedSize, swMaxValue);
      const newSteps = buildMaxSumSubarrayTrace(newArray, updatedK);

      set({
        swArraySize: clampedSize,
        swWindowK: updatedK,
        swArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setSWWindowK: (k: number) => {
      const { swArraySize, swArray, timerId } = get();
      if (timerId) clearInterval(timerId);

      const clampedK = Math.max(2, Math.min(swArraySize, k));
      const newSteps = buildMaxSumSubarrayTrace(swArray, clampedK);

      set({
        swWindowK: clampedK,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setSWMaxValue: (max: number) => {
      const { swArraySize, swWindowK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const clampedMax = Math.max(5, Math.min(30, max));
      const newArray = generateRandomArray(swArraySize, clampedMax);
      const newSteps = buildMaxSumSubarrayTrace(newArray, swWindowK);

      set({
        swMaxValue: clampedMax,
        swArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateSWArray: () => {
      const { swArraySize, swWindowK, swMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newArray = generateRandomArray(swArraySize, swMaxValue);
      const newSteps = buildMaxSumSubarrayTrace(newArray, swWindowK);

      set({
        swArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setFNArraySize: (size: number) => {
      const clampedSize = Math.max(6, Math.min(12, size));
      const { fnWindowK, fnValueRange, timerId } = get();
      if (timerId) clearInterval(timerId);

      const updatedK = Math.min(clampedSize, fnWindowK);
      const newArray = generateFNRandomArray(clampedSize, fnValueRange);
      const newSteps = buildFirstNegativeTrace(newArray, updatedK);

      set({
        fnArraySize: clampedSize,
        fnWindowK: updatedK,
        fnArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setFNWindowK: (k: number) => {
      const { fnArraySize, fnArray, timerId } = get();
      if (timerId) clearInterval(timerId);

      const clampedK = Math.max(2, Math.min(fnArraySize, k));
      const newSteps = buildFirstNegativeTrace(fnArray, clampedK);

      set({
        fnWindowK: clampedK,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setFNValueRange: (max: number) => {
      const { fnArraySize, fnWindowK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const clampedMax = Math.max(5, Math.min(20, max));
      const newArray = generateFNRandomArray(fnArraySize, clampedMax);
      const newSteps = buildFirstNegativeTrace(newArray, fnWindowK);

      set({
        fnValueRange: clampedMax,
        fnArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateFNArray: () => {
      const { fnArraySize, fnWindowK, fnValueRange, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newArray = generateFNRandomArray(fnArraySize, fnValueRange);
      const newSteps = buildFirstNegativeTrace(newArray, fnWindowK);

      set({
        fnArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMaxDequeArraySize: (size: number) => {
      const clampedSize = Math.max(6, Math.min(12, size));
      const { maxDequeWindowK, maxDequeMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const updatedK = Math.min(clampedSize, maxDequeWindowK);
      const newArray = generateRandomArray(clampedSize, maxDequeMaxValue);
      const newSteps = generateMaxDequeTrace(newArray, updatedK);

      set({
        maxDequeArraySize: clampedSize,
        maxDequeWindowK: updatedK,
        maxDequeArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMaxDequeWindowK: (k: number) => {
      const { maxDequeArraySize, maxDequeArray, timerId } = get();
      if (timerId) clearInterval(timerId);

      const clampedK = Math.max(2, Math.min(maxDequeArraySize, k));
      const newSteps = generateMaxDequeTrace(maxDequeArray, clampedK);

      set({
        maxDequeWindowK: clampedK,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMaxDequeMaxValue: (max: number) => {
      const { maxDequeArraySize, maxDequeWindowK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const clampedMax = Math.max(5, Math.min(30, max));
      const newArray = generateRandomArray(maxDequeArraySize, clampedMax);
      const newSteps = generateMaxDequeTrace(newArray, maxDequeWindowK);

      set({
        maxDequeMaxValue: clampedMax,
        maxDequeArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateMaxDequeArray: () => {
      const { maxDequeArraySize, maxDequeWindowK, maxDequeMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newArray = generateRandomArray(maxDequeArraySize, maxDequeMaxValue);
      const newSteps = generateMaxDequeTrace(newArray, maxDequeWindowK);

      set({
        maxDequeArray: newArray,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setAnagramTextLength: (size: number) => {
      const clampedSize = Math.max(8, Math.min(15, size));
      const { anagramPatternLength, anagramAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const updatedK = Math.min(clampedSize, anagramPatternLength);
      const inputs = generateAnagramInputsHelper(clampedSize, updatedK, anagramAlphabetSize);
      const newSteps = buildAnagramTrace(inputs.text, inputs.pattern);

      set({
        anagramTextLength: clampedSize,
        anagramPatternLength: updatedK,
        anagramText: inputs.text,
        anagramPattern: inputs.pattern,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setAnagramPatternLength: (k: number) => {
      const { anagramTextLength, anagramAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const clampedK = Math.max(2, Math.min(anagramTextLength, k));
      const inputs = generateAnagramInputsHelper(anagramTextLength, clampedK, anagramAlphabetSize);
      const newSteps = buildAnagramTrace(inputs.text, inputs.pattern);

      set({
        anagramPatternLength: clampedK,
        anagramText: inputs.text,
        anagramPattern: inputs.pattern,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setAnagramAlphabetSize: (size: number) => {
      const { anagramTextLength, anagramPatternLength, timerId } = get();
      if (timerId) clearInterval(timerId);

      const clampedSize = Math.max(2, Math.min(4, size));
      const inputs = generateAnagramInputsHelper(anagramTextLength, anagramPatternLength, clampedSize);
      const newSteps = buildAnagramTrace(inputs.text, inputs.pattern);

      set({
        anagramAlphabetSize: clampedSize,
        anagramText: inputs.text,
        anagramPattern: inputs.pattern,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateAnagramInputs: () => {
      const { anagramTextLength, anagramPatternLength, anagramAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const inputs = generateAnagramInputsHelper(anagramTextLength, anagramPatternLength, anagramAlphabetSize);
      const newSteps = buildAnagramTrace(inputs.text, inputs.pattern);

      set({
        anagramText: inputs.text,
        anagramPattern: inputs.pattern,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLsNrStringLength: (size: number) => {
      const clampedSize = Math.max(8, Math.min(15, size));
      const { lsNrAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const text = generateRandomString(clampedSize, lsNrAlphabetSize);
      const newSteps = buildLongestSubstrTrace(text);

      set({
        lsNrStringLength: clampedSize,
        lsNrString: text,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLsNrAlphabetSize: (size: number) => {
      const clampedSize = Math.max(2, Math.min(6, size));
      const { lsNrStringLength, timerId } = get();
      if (timerId) clearInterval(timerId);

      const text = generateRandomString(lsNrStringLength, clampedSize);
      const newSteps = buildLongestSubstrTrace(text);

      set({
        lsNrAlphabetSize: clampedSize,
        lsNrString: text,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateLsNrString: () => {
      const { lsNrStringLength, lsNrAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const text = generateRandomString(lsNrStringLength, lsNrAlphabetSize);
      const newSteps = buildLongestSubstrTrace(text);

      set({
        lsNrString: text,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setSmArraySize: (size: number) => {
      const clampedSize = Math.max(6, Math.min(12, size));
      const { smMaxValue, smTarget, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = Array.from({ length: clampedSize }, () => Math.floor(Math.random() * smMaxValue) + 1);
      const newSteps = buildSmallestSubarrayTrace(arr, smTarget);

      set({
        smArraySize: clampedSize,
        smArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setSmMaxValue: (max: number) => {
      const clampedMax = Math.max(5, Math.min(20, max));
      const { smArraySize, smTarget, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = Array.from({ length: smArraySize }, () => Math.floor(Math.random() * clampedMax) + 1);
      const newSteps = buildSmallestSubarrayTrace(arr, smTarget);

      set({
        smMaxValue: clampedMax,
        smArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setSmTarget: (target: number) => {
      const clampedTarget = Math.max(10, Math.min(50, target));
      const { smArray, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildSmallestSubarrayTrace(smArray, clampedTarget);

      set({
        smTarget: clampedTarget,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateSmArray: () => {
      const { smArraySize, smMaxValue, smTarget, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = Array.from({ length: smArraySize }, () => Math.floor(Math.random() * smMaxValue) + 1);
      const newSteps = buildSmallestSubarrayTrace(arr, smTarget);

      set({
        smArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKdStringLength: (size: number) => {
      const clampedSize = Math.max(8, Math.min(15, size));
      const { kdAlphabetSize, kdK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const text = generateRandomString(clampedSize, kdAlphabetSize);
      const newSteps = buildKDistinctTrace(text, kdK);

      set({
        kdStringLength: clampedSize,
        kdString: text,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKdAlphabetSize: (size: number) => {
      const clampedSize = Math.max(3, Math.min(6, size));
      const { kdStringLength, kdK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const nextK = Math.min(clampedSize - 1, kdK);
      const text = generateRandomString(kdStringLength, clampedSize);
      const newSteps = buildKDistinctTrace(text, nextK);

      set({
        kdAlphabetSize: clampedSize,
        kdK: nextK,
        kdString: text,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKdK: (k: number) => {
      const { kdAlphabetSize, kdString, timerId } = get();
      const clampedK = Math.max(1, Math.min(kdAlphabetSize - 1, k));
      if (timerId) clearInterval(timerId);

      const newSteps = buildKDistinctTrace(kdString, clampedK);

      set({
        kdK: clampedK,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateKdString: () => {
      const { kdStringLength, kdAlphabetSize, kdK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const text = generateRandomString(kdStringLength, kdAlphabetSize);
      const newSteps = buildKDistinctTrace(text, kdK);

      set({
        kdString: text,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKadaneArraySize: (size: number) => {
      const clampedSize = Math.max(6, Math.min(12, size));
      const { kadaneValueRange, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateKadaneRandomArray(clampedSize, kadaneValueRange);
      const newSteps = buildKadaneTrace(arr);

      set({
        kadaneArraySize: clampedSize,
        kadaneArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKadaneValueRange: (max: number) => {
      const clampedMax = Math.max(5, Math.min(20, max));
      const { kadaneArraySize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateKadaneRandomArray(kadaneArraySize, clampedMax);
      const newSteps = buildKadaneTrace(arr);

      set({
        kadaneValueRange: clampedMax,
        kadaneArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateKadaneArray: () => {
      const { kadaneArraySize, kadaneValueRange, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateKadaneRandomArray(kadaneArraySize, kadaneValueRange);
      const newSteps = buildKadaneTrace(arr);

      set({
        kadaneArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    regenerateTrace: () => {
      const { selectedProblemId, swArray, swWindowK, fnArray, fnWindowK, maxDequeArray, maxDequeWindowK, anagramText, anagramPattern, lsNrString, smArray, smTarget, kdString, kdK, kadaneArray, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = selectedProblemId === 'first-negative-in-window'
        ? buildFirstNegativeTrace(fnArray, fnWindowK)
        : selectedProblemId === 'max-of-all-subarrays-k'
        ? generateMaxDequeTrace(maxDequeArray, maxDequeWindowK)
        : selectedProblemId === 'count-anagrams-pattern'
        ? buildAnagramTrace(anagramText, anagramPattern)
        : selectedProblemId === 'longest-substr-no-repeat'
        ? buildLongestSubstrTrace(lsNrString)
        : selectedProblemId === 'smallest-subarray-sum-target'
        ? buildSmallestSubarrayTrace(smArray, smTarget)
        : selectedProblemId === 'longest-substr-k-distinct'
        ? buildKDistinctTrace(kdString, kdK)
        : selectedProblemId === 'kadanes-max-subarray'
        ? buildKadaneTrace(kadaneArray)
        : buildMaxSumSubarrayTrace(swArray, swWindowK);

      set({
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    togglePlay: () => {
      const { playing, timerId, cur, steps, speedLabel } = get();

      if (playing) {
        if (timerId) clearInterval(timerId);
        set({ playing: false, timerId: null });
      } else {
        if (cur >= steps.length - 1) {
          set({ cur: 0 });
        }

        const delay = SPEED_MAP[speedLabel] || 800;
        const newTimerId = window.setInterval(() => {
          const state = get();
          if (state.cur >= state.steps.length - 1) {
            clearInterval(newTimerId);
            set({ playing: false, timerId: null });
          } else {
            set({ cur: state.cur + 1 });
          }
        }, delay);

        set({ playing: true, timerId: newTimerId });
      }
    },

    setSpeedLabel: (newSpeedLabel: SpeedOption) => {
      set({ speedLabel: newSpeedLabel });
      const { playing, togglePlay } = get();
      if (playing) {
        togglePlay();
        togglePlay();
      }
    },

    stepForward: () => {
      const { cur, steps, timerId } = get();
      if (timerId) clearInterval(timerId);
      if (cur < steps.length - 1) {
        set({ cur: cur + 1, playing: false, timerId: null });
      }
    },

    stepBackward: () => {
      const { cur, timerId } = get();
      if (timerId) clearInterval(timerId);
      if (cur > 0) {
        set({ cur: cur - 1, playing: false, timerId: null });
      }
    },

    goToFirst: () => {
      const { timerId } = get();
      if (timerId) clearInterval(timerId);
      set({ cur: 0, playing: false, timerId: null });
    },

    goToLast: () => {
      const { steps, timerId } = get();
      if (timerId) clearInterval(timerId);
      set({ cur: steps.length - 1, playing: false, timerId: null });
    },

    reset: () => {
      const { timerId } = get();
      if (timerId) clearInterval(timerId);
      set({ cur: 0, playing: false, timerId: null });
    },

    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      set({ theme: nextTheme });
    },

    setSelectedProblemId: (id: string) => {
      const { timerId, swArray, swWindowK, fnArray, fnWindowK, maxDequeArray, maxDequeWindowK, anagramText, anagramPattern, lsNrString, smArray, smTarget, kdString, kdK, kadaneArray } = get();
      if (timerId) clearInterval(timerId);

      const found = SW_PROBLEMS.find((p) => p.id === id) || SW_PROBLEMS[0];
      const newSteps = id === 'first-negative-in-window'
        ? buildFirstNegativeTrace(fnArray, fnWindowK)
        : id === 'max-of-all-subarrays-k'
        ? generateMaxDequeTrace(maxDequeArray, maxDequeWindowK)
        : id === 'count-anagrams-pattern'
        ? buildAnagramTrace(anagramText, anagramPattern)
        : id === 'longest-substr-no-repeat'
        ? buildLongestSubstrTrace(lsNrString)
        : id === 'smallest-subarray-sum-target'
        ? buildSmallestSubarrayTrace(smArray, smTarget)
        : id === 'longest-substr-k-distinct'
        ? buildKDistinctTrace(kdString, kdK)
        : id === 'kadanes-max-subarray'
        ? buildKadaneTrace(kadaneArray)
        : buildMaxSumSubarrayTrace(swArray, swWindowK);

      set({
        selectedProblemId: id,
        problem: found,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },
  };
});
