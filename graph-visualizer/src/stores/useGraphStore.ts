import { create } from 'zustand';

export interface Node {
  id: string;
  label: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

export interface Step {
  id: number;
  type: 'highlight-node' | 'highlight-edge' | 'add-node' | 'add-edge' | 'remove-node' | 'remove-edge' | 'update-adjacency' | 'found' | 'not-found' | 'complete';
  nodeId?: string;
  edgeId?: string;
  highlightNodes: string[];
  highlightEdges: string[];
  pathEdges?: string[];
  pathNodes?: string[];
  description: string;
  codeLineActive: number;
  adjacencySnapshot: Record<string, string[]>;
  nodesSnapshot?: Node[];
  edgesSnapshot?: Edge[];
  auxiliaryState?: any;
}

export interface GraphState {
  // Graph Data
  currentPreset: string | null;
  nodes: Node[];
  edges: Edge[];
  graphType: {
    directed: boolean;
    weighted: boolean;
  };

  // Canvas
  nodePositions: Record<string, { x: number; y: number }>;
  isEditingGraph: boolean;

  // Algorithm / Playback
  selectedAlgorithm: string | null;
  steps: Step[];
  cur: number; // mapped to currentStep to match Controls component
  playing: boolean;
  speed: number;
  algorithmResult: any | null;
  stats: {
    operation: string;
    timeComplexity: string;
    spaceComplexity: string;
    stepsTaken: number;
    result: string;
    extra?: { label: string; value: string | number }[];
  } | null;

  // Spanning Tree
  spanningTreeMode: boolean;
  spanningTreePositions: Record<string, {x: number, y: number}> | null;

  // Actions
  loadPreset: (presetId: string, data: { nodes: Node[], edges: Edge[], directed: boolean, weighted: boolean, positions: Record<string, {x: number, y: number}> }) => void;
  updateNodePosition: (nodeId: string, x: number, y: number) => void;
  setIsEditingGraph: (val: boolean) => void;
  resetGraph: () => void;
  setSelectedAlgorithm: (algo: string) => void;
  
  // Playback Controls
  // Playback Controls
  setSteps: (steps: Step[]) => void;
  setCur: (step: number) => void;
  setPlaying: (val: boolean) => void;
  setSpeed: (speed: number) => void;

  // Spanning Tree Actions
  setSpanningTreeMode: (val: boolean) => void;
  setSpanningTreePositions: (positions: Record<string, {x: number, y: number}> | null) => void;
  calculateSpanningTreeLayout: (startNodeId?: string) => void;
  
  // State Mutators from operations
  setGraphData: (nodes: Node[], edges: Edge[], positions: Record<string, {x: number, y: number}>) => void;
  setStats: (stats: GraphState['stats']) => void;
  addVertex: (label: string, x?: number, y?: number) => void;
  removeVertex: (label: string) => void;
  addEdge: (src: string, dest: string, weight?: number) => void;
  removeEdge: (src: string, dest: string) => void;
  updateEdgeWeight: (src: string, dest: string, weight: number) => void;
  toggleEdgeDirection: (src: string, dest: string) => void;
  setGraphType: (directed: boolean, weighted: boolean) => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  // Initial state
  currentPreset: null,
  nodes: [],
  edges: [],
  graphType: {
    directed: false,
    weighted: false,
  },
  nodePositions: {},
  isEditingGraph: false,

  selectedAlgorithm: null,
  steps: [],
  cur: 0,
  playing: false,
  speed: 1,
  algorithmResult: null,
  stats: null,
  spanningTreeMode: false,
  spanningTreePositions: null,

  // Actions
  loadPreset: (presetId, data) => set({
    currentPreset: presetId,
    nodes: data.nodes,
    edges: data.edges,
    graphType: {
      directed: data.directed,
      weighted: data.weighted,
    },
    nodePositions: data.positions,
    selectedAlgorithm: null,
    steps: [],
    cur: 0,
    playing: false,
    stats: null,
  }),

  updateNodePosition: (nodeId, x, y) => set((state) => ({
    nodePositions: {
      ...state.nodePositions,
      [nodeId]: { x, y }
    }
  })),

  setIsEditingGraph: (val) => set(() => {
    if (val) {
      return { isEditingGraph: val, playing: false, steps: [] };
    }
    return { isEditingGraph: val };
  }),

  resetGraph: () => set({
    currentPreset: null,
    nodes: [],
    edges: [],
    nodePositions: {},
    steps: [],
    cur: 0,
    playing: false,
    stats: null,
  }),

  setSelectedAlgorithm: (algo) => set({ selectedAlgorithm: algo }),
  
  setSteps: (steps) => set({ steps, cur: 0, playing: true, speed: 1 }),
  setCur: (step) => set({ cur: step }),
  setPlaying: (val) => set({ playing: val }),
  setSpeed: (speed) => set({ speed }),

  setSpanningTreeMode: (val) => set({ spanningTreeMode: val }),
  setSpanningTreePositions: (positions) => set({ spanningTreePositions: positions }),
  
  calculateSpanningTreeLayout: (startNodeId) => {
    const state = get();
    const startNode = startNodeId || (state.nodes.length > 0 ? state.nodes[0].id : null);
    if (!startNode) {
      set({ spanningTreePositions: null });
      return;
    }

    const visited = new Set<string>();
    const queue = [startNode];
    visited.add(startNode);
    
    const levels: Record<string, number> = { [startNode]: 0 };
    const levelNodes: Record<number, string[]> = { 0: [startNode] };

    const adj: Record<string, string[]> = {};
    state.nodes.forEach((n: Node) => adj[n.id] = []);
    state.edges.forEach((e: Edge) => {
      adj[e.source].push(e.target);
      if (!state.graphType.directed) {
        adj[e.target].push(e.source);
      }
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      const neighbors = adj[u];
      neighbors.sort();
      for (const v of neighbors) {
        if (!visited.has(v)) {
          visited.add(v);
          const lvl = levels[u] + 1;
          levels[v] = lvl;
          if (!levelNodes[lvl]) levelNodes[lvl] = [];
          levelNodes[lvl].push(v);
          queue.push(v);
        }
      }
    }

    const positions: Record<string, {x: number, y: number}> = {};
    const canvasWidth = 1000;
    const padding = 150;

    Object.entries(levelNodes).forEach(([levelStr, nodesAtLevel]) => {
      const level = parseInt(levelStr);
      const y = 80 + level * 120;
      const count = nodesAtLevel.length;
      if (count === 1) {
        positions[nodesAtLevel[0]] = { x: canvasWidth / 2, y };
      } else {
        const span = canvasWidth - padding * 2;
        const step = span / (count - 1);
        nodesAtLevel.forEach((nodeId, idx) => {
          positions[nodeId] = { x: padding + idx * step, y };
        });
      }
    });

    let maxLevel = Math.max(...Object.keys(levelNodes).map(k => parseInt(k)));
    if (visited.size < state.nodes.length) {
      maxLevel++;
      const disconnected = state.nodes.filter((n: Node) => !visited.has(n.id));
      const count = disconnected.length;
      const y = 80 + maxLevel * 120;
      if (count === 1) {
        positions[disconnected[0].id] = { x: canvasWidth / 2, y };
      } else {
        const span = canvasWidth - padding * 2;
        const step = span / (count - 1);
        disconnected.forEach((n: Node, idx: number) => {
          positions[n.id] = { x: padding + idx * step, y };
        });
      }
    }

    set({ spanningTreePositions: positions });
  },

  setGraphData: (nodes, edges, positions) => set({ nodes, edges, nodePositions: positions }),
  setStats: (stats) => set({ stats }),

  addVertex: (label, forceX, forceY) => set((state) => {
    if (state.nodes.find(n => n.id === label)) return state;
    
    let x = forceX;
    let y = forceY;

    if (x === undefined || y === undefined) {
      if (state.nodes.length === 0) {
        x = 600;
        y = 350;
      } else {
        let sumX = 0, sumY = 0;
        state.nodes.forEach(n => {
          const pos = state.nodePositions[n.id];
          if (pos) { sumX += pos.x; sumY += pos.y; }
        });
        const centroidX = sumX / state.nodes.length;
        const centroidY = sumY / state.nodes.length;
        const existingCount = state.nodes.length;
        const angle = existingCount * (360 / (existingCount + 1));
        const angleRad = angle * (Math.PI / 180);
        x = centroidX + 120 * Math.cos(angleRad);
        y = centroidY + 120 * Math.sin(angleRad);

        let tooClose = false;
        for (const n of state.nodes) {
          const pos = state.nodePositions[n.id];
          if (pos) {
            const dist = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
            if (dist < 40) tooClose = true;
          }
        }
        if (tooClose) {
          x += (Math.random() * 40 - 20);
          y += (Math.random() * 40 - 20);
        }
      }
    }

    const newNode = { id: label, label };
    return {
      nodes: [...state.nodes, newNode],
      nodePositions: { ...state.nodePositions, [label]: { x, y } }
    };
  }),

  removeVertex: (label) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== label),
    edges: state.edges.filter(e => e.source !== label && e.target !== label),
    nodePositions: Object.fromEntries(Object.entries(state.nodePositions).filter(([k]) => k !== label))
  })),

  addEdge: (src, dest, weight) => set((state) => {
    const edgeId1 = `${src}-${dest}`;
    const edgeId2 = `${dest}-${src}`;
    if (state.edges.find(e => e.id === edgeId1 || (!state.graphType.directed && e.id === edgeId2))) return state;
    return {
      edges: [...state.edges, { id: edgeId1, source: src, target: dest, weight }]
    };
  }),

  removeEdge: (src, dest) => set((state) => {
    const edgeId1 = `${src}-${dest}`;
    const edgeId2 = `${dest}-${src}`;
    return {
      edges: state.edges.filter(e => !(e.id === edgeId1 || (!state.graphType.directed && e.id === edgeId2)))
    };
  }),

  updateEdgeWeight: (src, dest, weight) => set((state) => {
    const edgeId1 = `${src}-${dest}`;
    const edgeId2 = `${dest}-${src}`;
    return {
      edges: state.edges.map(e => 
        (e.id === edgeId1 || (!state.graphType.directed && e.id === edgeId2)) ? { ...e, weight } : e
      )
    };
  }),

  toggleEdgeDirection: (src, dest) => set((state) => {
    if (!state.graphType.directed) return state;
    const edgeId1 = `${src}-${dest}`;
    return {
      edges: state.edges.map(e => 
        e.id === edgeId1 ? { ...e, id: `${dest}-${src}`, source: dest, target: src } : e
      )
    };
  }),

  setGraphType: (directed, weighted) => set((state) => {
    let newEdges = [...state.edges];
    if (weighted && !state.graphType.weighted) {
      newEdges = newEdges.map(e => ({ ...e, weight: e.weight ?? 1 }));
    } else if (!weighted && state.graphType.weighted) {
      newEdges = newEdges.map(e => {
        const { weight, ...rest } = e;
        return rest;
      });
    }

    if (!directed && state.graphType.directed) {
      // Remove duplicate reverse edges
      const seen = new Set<string>();
      newEdges = newEdges.filter(e => {
        const key1 = `${e.source}-${e.target}`;
        const key2 = `${e.target}-${e.source}`;
        if (seen.has(key1) || seen.has(key2)) return false;
        seen.add(key1);
        return true;
      });
    }

    return {
      graphType: { directed, weighted },
      edges: newEdges
    };
  })
}));
