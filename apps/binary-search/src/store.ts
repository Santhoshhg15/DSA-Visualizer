import { create } from 'zustand';
import { BS_PROBLEMS, type BSProblem } from './data/bsProblems';
import { buildKokoTrace, type KokoStep } from './engines/kokoEatingBananas';

export type SpeedOption = '0.25x' | '0.5x' | '1x' | '1.5x' | '2x';

export const SPEED_MAP: Record<SpeedOption, number> = {
  '0.25x': 2400,
  '0.5x': 1200,
  '1x': 800,
  '1.5x': 500,
  '2x': 300,
};

interface BSState {
  // Input settings
  kokoPileCount: number;
  kokoMaxPileSize: number;
  kokoHours: number;
  kokoPiles: number[];

  // Execution steps
  steps: KokoStep[];
  cur: number;
  playing: boolean;
  speedLabel: SpeedOption;
  problem: BSProblem;
  theme: 'dark' | 'light';
  timerId: number | null;
  selectedProblemId: string;

  // Actions
  setKokoPileCount: (count: number) => void;
  setKokoMaxPileSize: (size: number) => void;
  setKokoHours: (hours: number) => void;
  generateKokoPiles: () => void;

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

function generateRandomPiles(count: number, maxVal: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * maxVal) + 1);
}

export const useBSStore = create<BSState>((set, get) => {
  const initialPileCount = 5;
  const initialMaxPileSize = 25;
  const initialHours = 8;
  const initialPiles = [4, 11, 20, 23, 10]; // Random standard seed

  const initialProblem = BS_PROBLEMS[0]; // Koko Eating Bananas
  const initialSteps = buildKokoTrace(initialPiles, initialHours);

  return {
    kokoPileCount: initialPileCount,
    kokoMaxPileSize: initialMaxPileSize,
    kokoHours: initialHours,
    kokoPiles: initialPiles,

    steps: initialSteps,
    cur: 0,
    playing: false,
    speedLabel: '1x',
    problem: initialProblem,
    theme: 'dark',
    timerId: null,
    selectedProblemId: initialProblem.id,

    setKokoPileCount: (count: number) => {
      const clampedCount = Math.max(3, Math.min(8, count));
      const { kokoHours, kokoMaxPileSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      // Ensure hours >= pile count
      const updatedHours = Math.max(clampedCount, kokoHours);
      const newPiles = generateRandomPiles(clampedCount, kokoMaxPileSize);
      const newSteps = buildKokoTrace(newPiles, updatedHours);

      set({
        kokoPileCount: clampedCount,
        kokoHours: updatedHours,
        kokoPiles: newPiles,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKokoMaxPileSize: (size: number) => {
      const clampedSize = Math.max(10, Math.min(50, size));
      const { kokoPileCount, kokoHours, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newPiles = generateRandomPiles(kokoPileCount, clampedSize);
      const newSteps = buildKokoTrace(newPiles, kokoHours);

      set({
        kokoMaxPileSize: clampedSize,
        kokoPiles: newPiles,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKokoHours: (hours: number) => {
      const { kokoPileCount, kokoPiles, timerId } = get();
      if (timerId) clearInterval(timerId);

      // Clamp hours to be at least the pile count
      const clampedHours = Math.max(kokoPileCount, Math.min(15, hours));
      const newSteps = buildKokoTrace(kokoPiles, clampedHours);

      set({
        kokoHours: clampedHours,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateKokoPiles: () => {
      const { kokoPileCount, kokoMaxPileSize, kokoHours, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newPiles = generateRandomPiles(kokoPileCount, kokoMaxPileSize);
      const newSteps = buildKokoTrace(newPiles, kokoHours);

      set({
        kokoPiles: newPiles,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    regenerateTrace: () => {
      const { kokoPiles, kokoHours, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildKokoTrace(kokoPiles, kokoHours);
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
      const { timerId } = get();
      if (timerId) clearInterval(timerId);

      const found = BS_PROBLEMS.find((p) => p.id === id) || BS_PROBLEMS[0];
      set({
        selectedProblemId: id,
        problem: found,
        cur: 0,
        playing: false,
        timerId: null,
      });

      if (id === 'koko-eating-bananas') {
        get().regenerateTrace();
      }
    },
  };
});
