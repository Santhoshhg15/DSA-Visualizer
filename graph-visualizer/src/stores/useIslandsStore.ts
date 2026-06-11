import { create } from 'zustand';

export interface IslandsStep {
  id: number;
  type: 'scan' | 'found-island' | 'bfs-called' | 'enqueue' | 'flood' | 'dequeue' | 'check-neighbor' | 'enqueue-neighbor' | 'flood-neighbor' | 'island-complete' | 'complete';
  description: string;
  codeLineActive: number;
  
  // State at this step
  gridSnapshot: number[][];      // The grid exactly at this step (with 0s and 1s)
  visited: Set<string>;          // Set of "r,c" coordinates
  visSnapshot?: number[][];      // Visited 2D snapshot array
  queue: [number, number][];     // Queue of coordinates
  currentCell: [number, number] | null; // Cell currently being processed
  scannerPosition: [number, number];    // Outer loop position
  islandMap: Record<string, number>;    // Map of "r,c" -> island ID (1, 2, 3...)
  islandsCount: number;

  // Derived/Visual state fields
  row: number;
  col: number;
  queueSnapshot: [number, number][];
  islandCount: number;
  currentIslandCells: [number, number][];

  auxiliaryState: {
    visitedOrder: [number, number][];
    islandMap: Record<number, [number, number][]>;
  };

  neighborCheck?: {
    nr: number;
    nc: number;
    value: string;
    valid: boolean;
  };
}

export interface IslandsState {
  // Data
  selectedPreset: string | null;
  grid: number[][];
  version: 'leetcode' | 'gfg';
  
  // Playback
  steps: IslandsStep[];
  cur: number;
  playing: boolean;
  speed: number;

  // Actions
  loadPreset: (presetId: string, gridData: number[][]) => void;
  setVersion: (version: 'leetcode' | 'gfg') => void;
  setSteps: (steps: IslandsStep[]) => void;
  setCur: (step: number) => void;
  setPlaying: (val: boolean) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

export const useIslandsStore = create<IslandsState>((set) => ({
  selectedPreset: null,
  grid: [],
  version: 'leetcode',
  
  steps: [],
  cur: 0,
  playing: false,
  speed: 1,

  loadPreset: (presetId, gridData) => set({
    selectedPreset: presetId,
    grid: gridData,
    steps: [],
    cur: 0,
    playing: false
  }),

  setVersion: (version) => set({ version, steps: [], cur: 0, playing: false }),
  setSteps: (steps) => set({ steps }),
  setCur: (cur) => set({ cur }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  reset: () => set({ cur: 0, playing: false })
}));
