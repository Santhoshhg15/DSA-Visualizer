import { create } from 'zustand';
import type { SortStep } from '../algorithms/types';
import { generateBubbleSortSteps } from '../algorithms/bubbleSort';
import { generateSelectionSortSteps } from '../algorithms/selectionSort';
import { generateInsertionSortSteps } from '../algorithms/insertionSort';
import { generateMergeSortSteps } from '../algorithms/mergeSort';
import { generateQuickSortSteps } from '../algorithms/quickSort';

interface SortingState {
  array: number[];
  arraySize: number;
  inputMode: 'random' | 'custom' | 'nearly-sorted' | 'reverse' | 'few-unique';
  selectedAlgorithm: string | null; // 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'
  steps: SortStep[];
  cur: number;
  playing: boolean;
  speed: number; // 0.25 | 0.5 | 0.75 | 1 | 1.5 | 2
  
  // Stats
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  currentPass: number;

  // Recursion Tree
  showRecursionTree: boolean;

  // Actions
  setArray: (arr: number[]) => void;
  setArraySize: (n: number) => void;
  generateArray: () => void;
  setInputMode: (mode: 'random' | 'custom' | 'nearly-sorted' | 'reverse' | 'few-unique') => void;
  setSelectedAlgorithm: (algo: string | null) => void;
  setSteps: (steps: SortStep[]) => void;
  setCur: (n: number) => void;
  setPlaying: (val: boolean) => void;
  setSpeed: (val: number) => void;
  resetSort: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  skipToStart: () => void;
  skipToEnd: () => void;
  setShowRecursionTree: (val: boolean) => void;
}

let playbackInterval: ReturnType<typeof setInterval> | null = null;

function clearPlayback() {
  if (playbackInterval !== null) {
    clearInterval(playbackInterval);
    playbackInterval = null;
  }
}

function startPlayback(
  getState: () => SortingState,
  setState: (fn: (s: SortingState) => Partial<SortingState>) => void
) {
  clearPlayback();
  const intervalMs = 600 / getState().speed;
  playbackInterval = setInterval(() => {
    const state = getState();
    if (!state.playing) {
      clearPlayback();
      return;
    }
    if (state.cur >= state.steps.length - 1) {
      clearPlayback();
      setState(() => ({ playing: false }));
      return;
    }
    const newCur = state.cur + 1;
    const newStep = state.steps[newCur];
    if (newStep) {
      setState(() => ({ 
        cur: newCur,
        comparisons: newStep.comparisons ?? 0,
        swaps: newStep.swaps ?? 0,
        arrayAccesses: newStep.accesses ?? 0,
        currentPass: newStep.pass ?? 0,
      }));
    } else {
      setState(() => ({ cur: newCur }));
    }
  }, intervalMs);
}

export const useSortingStore = create<SortingState>((set, get) => {
  const generateSteps = (algo: string | null, arr: number[]): SortStep[] => {
    if (!algo) return [];
    if (algo === 'bubble') return generateBubbleSortSteps(arr);
    if (algo === 'selection') return generateSelectionSortSteps(arr);
    if (algo === 'insertion') return generateInsertionSortSteps(arr);
    if (algo === 'merge') return generateMergeSortSteps(arr);
    if (algo === 'quick') return generateQuickSortSteps(arr);
    return [];
  };

  const generateValuesForMode = (size: number, mode: string): number[] => {
    switch (mode) {
      case 'reverse': {
        const arr: number[] = [];
        for (let i = 0; i < size; i++) {
          arr.push(Math.round(((size - i) / size) * 80) + 15);
        }
        return arr;
      }
      case 'nearly-sorted': {
        const arr: number[] = [];
        for (let i = 0; i < size; i++) {
          arr.push(Math.round(((i + 1) / size) * 80) + 15);
        }
        // Swap ~10% elements
        const swapCount = Math.max(1, Math.floor(size * 0.1));
        for (let s = 0; s < swapCount; s++) {
          const idx1 = Math.floor(Math.random() * size);
          const idx2 = Math.floor(Math.random() * size);
          const temp = arr[idx1];
          arr[idx1] = arr[idx2];
          arr[idx2] = temp;
        }
        return arr;
      }
      case 'few-unique': {
        const choices = [20, 40, 60, 80];
        const arr: number[] = [];
        for (let i = 0; i < size; i++) {
          arr.push(choices[Math.floor(Math.random() * choices.length)]);
        }
        return arr;
      }
      case 'random':
      default: {
        const arr: number[] = [];
        for (let i = 0; i < size; i++) {
          arr.push(Math.floor(Math.random() * 85) + 10);
        }
        return arr;
      }
    }
  };

  return {
    array: generateValuesForMode(20, 'random'),
    arraySize: 20,
    inputMode: 'random',
    selectedAlgorithm: null,
    steps: [],
    cur: -1,
    playing: false,
    speed: 1,
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    currentPass: 0,
    showRecursionTree: false,

    setArray: (arr) => {
      const { selectedAlgorithm } = get();
      const newSteps = generateSteps(selectedAlgorithm, arr);
      set({
        array: arr,
        steps: newSteps,
        cur: newSteps.length > 0 ? 0 : -1,
        playing: false,
        comparisons: 0,
        swaps: 0,
        arrayAccesses: 0,
        currentPass: 0,
      });
    },
    setArraySize: (n) => {
      set({ arraySize: n });
      get().generateArray();
    },
    generateArray: () => {
      const { arraySize, inputMode, selectedAlgorithm } = get();
      if (inputMode === 'custom') return; // Do not overwrite custom array automatically
      const newArr = generateValuesForMode(arraySize, inputMode);
      const newSteps = generateSteps(selectedAlgorithm, newArr);
      set({
        array: newArr,
        steps: newSteps,
        cur: newSteps.length > 0 ? 0 : -1,
        playing: false,
        comparisons: 0,
        swaps: 0,
        arrayAccesses: 0,
        currentPass: 0,
      });
    },
    setInputMode: (mode) => {
      set({ inputMode: mode });
      if (mode !== 'custom') {
        get().generateArray();
      }
    },
    setSelectedAlgorithm: (algo) => {
      const { array } = get();
      const newSteps = generateSteps(algo, array);
      set({
        selectedAlgorithm: algo,
        steps: newSteps,
        cur: newSteps.length > 0 ? 0 : -1,
        playing: false,
        comparisons: 0,
        swaps: 0,
        arrayAccesses: 0,
        currentPass: 0,
      });
    },
    setSteps: (steps) => {
      clearPlayback();
      set({ steps, cur: 0, playing: false });
    },
    setCur: (n) => {
      clearPlayback();
      const step = get().steps[n];
      if (step) {
        set({
          cur: n,
          comparisons: step.comparisons ?? 0,
          swaps: step.swaps ?? 0,
          arrayAccesses: step.accesses ?? 0,
          currentPass: step.pass ?? 0,
          playing: false
        });
      } else {
        set({ cur: n, playing: false });
      }
    },
    setPlaying: (val) => {
      if (val) {
        set({ playing: true });
        startPlayback(get, set as any);
      } else {
        clearPlayback();
        set({ playing: false });
      }
    },
    setSpeed: (speed) => {
      set({ speed });
      const state = get();
      if (state.playing) {
        startPlayback(get, set as any);
      }
    },
    resetSort: () => {
      clearPlayback();
      set({
        steps: [],
        cur: 0,
        playing: false,
        comparisons: 0,
        swaps: 0,
        arrayAccesses: 0,
        currentPass: 0,
      });
      get().generateArray();
    },
    stepForward: () => {
      clearPlayback();
      const { cur, steps } = get();
      if (cur < steps.length - 1) {
        const newCur = cur + 1;
        const newStep = steps[newCur];
        if (newStep) {
          set({
            cur: newCur,
            playing: false,
            comparisons: newStep.comparisons ?? 0,
            swaps: newStep.swaps ?? 0,
            arrayAccesses: newStep.accesses ?? 0,
            currentPass: newStep.pass ?? 0,
          });
        } else {
          set({ cur: newCur, playing: false });
        }
      }
    },
    stepBackward: () => {
      clearPlayback();
      const { cur, steps } = get();
      if (cur > 0) {
        const newCur = cur - 1;
        const newStep = steps[newCur];
        if (newStep) {
          set({
            cur: newCur,
            playing: false,
            comparisons: newStep.comparisons ?? 0,
            swaps: newStep.swaps ?? 0,
            arrayAccesses: newStep.accesses ?? 0,
            currentPass: newStep.pass ?? 0,
          });
        } else {
          set({ cur: newCur, playing: false });
        }
      }
    },
    skipToStart: () => {
      clearPlayback();
      set({ cur: 0, playing: false });
      const step = get().steps[0];
      if (step) {
        set({
          comparisons: step.comparisons ?? 0,
          swaps: step.swaps ?? 0,
          arrayAccesses: step.accesses ?? 0,
          currentPass: step.pass ?? 0,
        });
      }
    },
    skipToEnd: () => {
      clearPlayback();
      const { steps } = get();
      const endCur = Math.max(0, steps.length - 1);
      set({ cur: endCur, playing: false });
      const step = steps[endCur];
      if (step) {
        set({
          comparisons: step.comparisons ?? 0,
          swaps: step.swaps ?? 0,
          arrayAccesses: step.accesses ?? 0,
          currentPass: step.pass ?? 0,
        });
      }
    },
    setShowRecursionTree: (val) => set({ showRecursionTree: val }),
  };
});
