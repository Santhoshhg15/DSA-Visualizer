import { create } from 'zustand';
import type { AlgoType, Step, VisualBSTNode } from './types';

interface VisualizerStore {
  algo: AlgoType;
  steps: Step[];
  cur: number;
  playing: boolean;
  speed: number;
  tab: 'setup' | 'visualizer';
  
  // Persistent BST Playground State
  bstNodes: Record<string, VisualBSTNode>;
  bstRootId: string | null;

  // History & Undo State
  bstHistory: { nodes: Record<string, VisualBSTNode>; rootId: string | null; label: string }[];
  bstHistoryIndex: number;

  setAlgo: (a: AlgoType) => void;
  setSteps: (s: Step[]) => void;
  setStepsAndPlay: (s: Step[]) => void;
  setCur: (n: number) => void;
  setPlaying: (b: boolean) => void;
  setSpeed: (n: number) => void;
  setTab: (t: 'setup' | 'visualizer') => void;
  reset: () => void;
  
  // BST state updates
  setBSTState: (nodes: Record<string, VisualBSTNode>, rootId: string | null, label?: string) => void;
  clearBST: () => void;
  undoBST: () => void;
  redoBST: () => void;
  jumpToBSTHistory: (index: number) => void;
}

export const useStore = create<VisualizerStore>((set) => ({
  algo: 'bstPlayground',
  steps: [],
  cur: 0,
  playing: false,
  speed: 1.0,
  tab: 'setup',
  
  bstNodes: {},
  bstRootId: null,
  bstHistory: [{ nodes: {}, rootId: null, label: 'Empty Tree' }],
  bstHistoryIndex: 0,

  setAlgo: (algo) => set({ algo, steps: [], cur: 0, playing: false, tab: 'setup' }),
  setSteps: (steps) => set({ steps, cur: 0, playing: false, tab: 'visualizer' }),
  setStepsAndPlay: (steps) => set({ steps, cur: 0, playing: true, tab: 'visualizer' }),
  setCur: (cur) => set({ cur }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  setTab: (tab) => set({ tab }),
  reset: () => set({ steps: [], cur: 0, playing: false, tab: 'setup' }),
  
  setBSTState: (bstNodes, bstRootId, label) => set((state) => {
    if (label) {
      const nextHistory = state.bstHistory.slice(0, state.bstHistoryIndex + 1);
      nextHistory.push({ nodes: bstNodes, rootId: bstRootId, label });
      return {
        bstNodes,
        bstRootId,
        bstHistory: nextHistory,
        bstHistoryIndex: nextHistory.length - 1
      };
    }
    return { bstNodes, bstRootId };
  }),

  undoBST: () => set((state) => {
    if (state.bstHistoryIndex > 0) {
      const nextIndex = state.bstHistoryIndex - 1;
      const historyItem = state.bstHistory[nextIndex];
      return {
        bstNodes: historyItem.nodes,
        bstRootId: historyItem.rootId,
        bstHistoryIndex: nextIndex,
        steps: [],
        cur: 0,
        playing: false
      };
    }
    return {};
  }),

  redoBST: () => set((state) => {
    if (state.bstHistoryIndex < state.bstHistory.length - 1) {
      const nextIndex = state.bstHistoryIndex + 1;
      const historyItem = state.bstHistory[nextIndex];
      return {
        bstNodes: historyItem.nodes,
        bstRootId: historyItem.rootId,
        bstHistoryIndex: nextIndex,
        steps: [],
        cur: 0,
        playing: false
      };
    }
    return {};
  }),

  jumpToBSTHistory: (index) => set((state) => {
    if (index >= 0 && index < state.bstHistory.length) {
      const historyItem = state.bstHistory[index];
      return {
        bstNodes: historyItem.nodes,
        bstRootId: historyItem.rootId,
        bstHistoryIndex: index,
        steps: [],
        cur: 0,
        playing: false
      };
    }
    return {};
  }),

  clearBST: () => set({
    bstNodes: {},
    bstRootId: null,
    bstHistory: [{ nodes: {}, rootId: null, label: 'Empty Tree' }],
    bstHistoryIndex: 0,
    steps: [],
    cur: 0,
    playing: false
  }),
}));

