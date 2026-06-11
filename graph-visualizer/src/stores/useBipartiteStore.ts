import { create } from 'zustand';
import type { Node, Edge } from './useGraphStore';

export interface BipartiteStep {
  id: number;
  type:
    | 'init-color'
    | 'start-component'
    | 'color-source'
    | 'enqueue-source'
    | 'dequeue'
    | 'check-neighbor'
    | 'color-neighbor'
    | 'enqueue-neighbor'
    | 'conflict-found'
    | 'component-bipartite'
    | 'not-bipartite'
    | 'complete';
  currentNode?: string;
  neighborNode?: string;
  colorSnapshot: Record<string, number>; // -1 = uncolored, 0 = yellow, 1 = orange
  queueSnapshot: string[];
  highlightNodes: string[];
  highlightEdges: string[];
  conflictEdge?: string;
  conflictNodes?: string[];
  isBipartite: boolean | null;
  group0Nodes: string[]; // yellow group
  group1Nodes: string[]; // orange group
  description: string;
  codeLineActive: number;
}

export interface BipartiteState {
  // Config
  graphType: 'undirected' | 'directed';
  currentPreset: string | null;

  // Graph data
  nodes: Node[];
  edges: Edge[];
  directed: boolean;
  nodePositions: Record<string, { x: number; y: number }>;

  // Algorithm state
  colorMap: Record<string, number>; // -1 = uncolored, 0 = yellow, 1 = orange
  group0: string[];
  group1: string[];
  conflictNodes: string[];
  conflictEdge: string | null;

  // Playback
  steps: BipartiteStep[];
  cur: number;
  playing: boolean;
  speed: number;

  // Result
  isBipartite: boolean | null;

  // Actions
  setGraphType: (t: 'undirected' | 'directed') => void;
  loadPreset: (
    id: string,
    data: {
      nodes: Node[];
      edges: Edge[];
      directed: boolean;
      positions: Record<string, { x: number; y: number }>;
    }
  ) => void;
  setCustomGraph: (
    nodes: Node[],
    edges: Edge[],
    positions: Record<string, { x: number; y: number }>,
    directed: boolean
  ) => void;
  setSteps: (steps: BipartiteStep[]) => void;
  setCur: (n: number) => void;
  setPlaying: (val: boolean) => void;
  setSpeed: (val: number) => void;
  reset: () => void;
}

export const useBipartiteStore = create<BipartiteState>((set) => ({
  graphType: 'undirected',
  currentPreset: null,

  nodes: [],
  edges: [],
  directed: false,
  nodePositions: {},

  colorMap: {},
  group0: [],
  group1: [],
  conflictNodes: [],
  conflictEdge: null,

  steps: [],
  cur: 0,
  playing: false,
  speed: 1,

  isBipartite: null,

  setGraphType: (t) =>
    set({
      graphType: t,
      currentPreset: null,
      steps: [],
      cur: 0,
      playing: false,
      isBipartite: null,
      colorMap: {},
      group0: [],
      group1: [],
      conflictNodes: [],
      conflictEdge: null,
    }),

  loadPreset: (id, data) =>
    set({
      currentPreset: id,
      nodes: data.nodes,
      edges: data.edges,
      directed: data.directed,
      nodePositions: data.positions,
      steps: [],
      cur: 0,
      playing: false,
      isBipartite: null,
      colorMap: {},
      group0: [],
      group1: [],
      conflictNodes: [],
      conflictEdge: null,
    }),

  setCustomGraph: (nodes, edges, positions, directed) =>
    set({
      currentPreset: 'custom',
      nodes,
      edges,
      directed,
      nodePositions: positions,
      steps: [],
      cur: 0,
      playing: false,
      isBipartite: null,
      colorMap: {},
      group0: [],
      group1: [],
      conflictNodes: [],
      conflictEdge: null,
    }),

  setSteps: (steps) => set({ steps, cur: 0, playing: false }),
  setCur: (cur) => {
    set((state) => {
      const step = state.steps[cur];
      if (!step) return { cur };

      return {
        cur,
        colorMap: step.colorSnapshot,
        group0: step.group0Nodes,
        group1: step.group1Nodes,
        conflictNodes: step.conflictNodes || [],
        conflictEdge: step.conflictEdge || null,
        isBipartite: step.isBipartite,
      };
    });
  },
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  reset: () =>
    set({
      cur: 0,
      playing: false,
      isBipartite: null,
      colorMap: {},
      group0: [],
      group1: [],
      conflictNodes: [],
      conflictEdge: null,
    }),
}));
