import { create } from 'zustand';
import type { Node, Edge } from './useGraphStore';

export interface CycleStep {
  id: number;
  type:
    | 'init'
    | 'process-edge'
    | 'find'
    | 'union'
    | 'cycle-found'
    | 'no-cycle'
    | 'dfs-enter'
    | 'dfs-neighbor'
    | 'back-edge-found'
    | 'dfs-exit'
    | 'complete'
    | 'bfs-pop'
    | 'bfs-neighbor'
    | 'bfs-enqueue'
    | 'kahns-enqueue-zero'
    | 'kahns-pop'
    | 'kahns-decrement'
    | 'kahns-enqueue';
  nodeA?: string;
  nodeB?: string;
  parentA?: string;
  parentB?: string;
  parentSnapshot?: Record<string, string>;
  rankSnapshot?: Record<string, number>;
  unionFindGroups?: Record<string, string[]>;
  currentNode?: string;
  neighborNode?: string;
  visitedSnapshot?: string[];
  recStackSnapshot?: string[];
  dfsStackSnapshot?: string[];
  cycleNodes?: string[];
  cycleEdges?: string[];
  highlightNodes: string[];
  highlightEdges: string[];
  hasCycle: boolean | null;
  description: string;
  codeLineActive: number;
  algorithmType: 'undirected-union-find' | 'undirected-bfs' | 'directed-dfs' | 'directed-bfs';
  parentTrackingMap?: Record<string, string>;
  currentParent?: string;
  inDegreeSnapshot?: Record<string, number>;
  processedCount?: number;
  topoOrder?: string[];
  stuckNodes?: string[];
  queueSnapshot?: any[];
}

export interface CycleState {
  algorithmType: 'undirected-union-find' | 'undirected-bfs' | 'directed-dfs' | 'directed-bfs';
  currentPreset: string | null;

  nodes: Node[];
  edges: Edge[];
  graphType: { directed: boolean; weighted: false };
  nodePositions: Record<string, { x: number; y: number }>;

  steps: CycleStep[];
  cur: number;
  playing: boolean;
  speed: number;

  hasCycle: boolean | null;
  cycleNodes: string[];
  cycleEdges: string[];

  parentMap: Record<string, string>;
  rankMap: Record<string, number>;

  visitedSet: string[];
  recStackSet: string[];

  setAlgorithmType: (type: 'undirected-union-find' | 'undirected-bfs' | 'directed-dfs' | 'directed-bfs') => void;
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
  setSteps: (steps: CycleStep[]) => void;
  setCur: (n: number) => void;
  setPlaying: (val: boolean) => void;
  setSpeed: (val: number) => void;
  reset: () => void;
}

export const useCycleStore = create<CycleState>((set) => ({
  algorithmType: 'undirected-union-find',
  currentPreset: null,

  nodes: [],
  edges: [],
  graphType: { directed: false, weighted: false },
  nodePositions: {},

  steps: [],
  cur: 0,
  playing: false,
  speed: 1,

  hasCycle: null,
  cycleNodes: [],
  cycleEdges: [],

  parentMap: {},
  rankMap: {},

  visitedSet: [],
  recStackSet: [],

  setAlgorithmType: (type) =>
    set({
      algorithmType: type,
      currentPreset: null,
      steps: [],
      cur: 0,
      playing: false,
      hasCycle: null,
      cycleNodes: [],
      cycleEdges: [],
      parentMap: {},
      rankMap: {},
      visitedSet: [],
      recStackSet: [],
    }),

  loadPreset: (id, data) =>
    set({
      currentPreset: id,
      nodes: data.nodes,
      edges: data.edges,
      graphType: { directed: data.directed, weighted: false },
      nodePositions: data.positions,
      steps: [],
      cur: 0,
      playing: false,
      hasCycle: null,
      cycleNodes: [],
      cycleEdges: [],
      parentMap: {},
      rankMap: {},
      visitedSet: [],
      recStackSet: [],
    }),

  setCustomGraph: (nodes, edges, positions, directed) =>
    set({
      currentPreset: 'custom',
      nodes,
      edges,
      graphType: { directed, weighted: false },
      nodePositions: positions,
      steps: [],
      cur: 0,
      playing: false,
      hasCycle: null,
      cycleNodes: [],
      cycleEdges: [],
      parentMap: {},
      rankMap: {},
      visitedSet: [],
      recStackSet: [],
    }),

  setSteps: (steps) => set({ steps, cur: 0, playing: false }),
  setCur: (cur) => set({ cur }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  reset: () =>
    set({
      cur: 0,
      playing: false,
      hasCycle: null,
      cycleNodes: [],
      cycleEdges: [],
      parentMap: {},
      rankMap: {},
      visitedSet: [],
      recStackSet: [],
    }),
}));
