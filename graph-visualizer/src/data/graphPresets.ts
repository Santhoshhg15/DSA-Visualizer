import type { Node, Edge } from '../stores/useGraphStore';

export interface GraphPreset {
  id: string;
  name: string;
  description: string;
  directed: boolean;
  weighted: boolean;
  nodes: Node[];
  edges: Edge[];
  defaultPositions: Record<string, { x: number; y: number }>;
}

export const graphPresets: GraphPreset[] = [
  {
    id: 'simple-undirected',
    name: 'Simple Undirected Graph',
    description: 'Basic undirected graph — good for BFS and DFS',
    directed: false,
    weighted: false,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
      { id: 'F', label: 'F' }
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'A-C', source: 'A', target: 'C' },
      { id: 'B-D', source: 'B', target: 'D' },
      { id: 'C-D', source: 'C', target: 'D' },
      { id: 'D-E', source: 'D', target: 'E' },
      { id: 'E-F', source: 'E', target: 'F' },
      { id: 'C-F', source: 'C', target: 'F' }
    ],
    defaultPositions: {
      A: { x: 200, y: 150 },
      B: { x: 350, y: 100 },
      C: { x: 150, y: 300 },
      D: { x: 400, y: 250 },
      E: { x: 550, y: 200 },
      F: { x: 300, y: 400 }
    }
  },
  {
    id: 'numbered-undirected',
    name: 'Simple Numbered Graph',
    description: 'Basic undirected graph with numeric nodes — good for BFS and DFS',
    directed: false,
    weighted: false,
    nodes: [
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
      { id: '6', label: '6' }
    ],
    edges: [
      { id: '1-2', source: '1', target: '2' },
      { id: '1-3', source: '1', target: '3' },
      { id: '2-4', source: '2', target: '4' },
      { id: '3-4', source: '3', target: '4' },
      { id: '4-5', source: '4', target: '5' },
      { id: '3-6', source: '3', target: '6' },
      { id: '5-6', source: '5', target: '6' }
    ],
    defaultPositions: {
      '1': { x: 510, y: 170 },
      '2': { x: 725, y: 170 },
      '3': { x: 440, y: 455 },
      '4': { x: 795, y: 385 },
      '5': { x: 650, y: 595 },
      '6': { x: 1010, y: 310 }
    }
  },
  {
    id: 'simple-directed',
    name: 'Simple Directed Graph',
    description: 'Directed graph — good for DFS and dependency visualization',
    directed: true,
    weighted: false,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' }
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'A-C', source: 'A', target: 'C' },
      { id: 'B-D', source: 'B', target: 'D' },
      { id: 'C-D', source: 'C', target: 'D' },
      { id: 'D-E', source: 'D', target: 'E' }
    ],
    defaultPositions: {
      A: { x: 400, y: 100 },
      B: { x: 250, y: 220 },
      C: { x: 550, y: 220 },
      D: { x: 400, y: 350 },
      E: { x: 400, y: 480 }
    }
  },
  {
    id: 'weighted-undirected',
    name: 'Weighted Undirected Graph',
    description: 'Weighted graph — used for Dijkstra, Kruskal, Prim',
    directed: false,
    weighted: true,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
      { id: 'F', label: 'F' }
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B', weight: 4 },
      { id: 'A-C', source: 'A', target: 'C', weight: 2 },
      { id: 'B-C', source: 'B', target: 'C', weight: 1 },
      { id: 'B-D', source: 'B', target: 'D', weight: 5 },
      { id: 'C-E', source: 'C', target: 'E', weight: 8 },
      { id: 'D-E', source: 'D', target: 'E', weight: 2 },
      { id: 'D-F', source: 'D', target: 'F', weight: 6 },
      { id: 'E-F', source: 'E', target: 'F', weight: 3 }
    ],
    defaultPositions: {
      A: { x: 200, y: 250 },
      B: { x: 300, y: 150 },
      C: { x: 300, y: 350 },
      D: { x: 450, y: 150 },
      E: { x: 450, y: 350 },
      F: { x: 550, y: 250 }
    }
  },
  {
    id: 'weighted-directed',
    name: 'Weighted Directed Graph',
    description: 'Weighted directed graph — used for Bellman-Ford',
    directed: true,
    weighted: true,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' }
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B', weight: 6 },
      { id: 'A-C', source: 'A', target: 'C', weight: 7 },
      { id: 'B-C', source: 'B', target: 'C', weight: 8 },
      { id: 'B-D', source: 'B', target: 'D', weight: -4 },
      { id: 'B-E', source: 'B', target: 'E', weight: 5 },
      { id: 'C-E', source: 'C', target: 'E', weight: -2 },
      { id: 'D-A', source: 'D', target: 'A', weight: 2 },
      { id: 'D-C', source: 'D', target: 'C', weight: -3 },
      { id: 'E-D', source: 'E', target: 'D', weight: 7 }
    ],
    defaultPositions: {
      A: { x: 400, y: 100 },
      B: { x: 200, y: 200 },
      C: { x: 600, y: 200 },
      D: { x: 300, y: 400 },
      E: { x: 500, y: 400 }
    }
  },
  {
    id: 'dag-topological',
    name: 'DAG — Directed Acyclic Graph',
    description: 'No cycles — used for Topological Sort',
    directed: true,
    weighted: false,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
      { id: 'F', label: 'F' }
    ],
    edges: [
      { id: 'A-C', source: 'A', target: 'C' },
      { id: 'A-D', source: 'A', target: 'D' },
      { id: 'B-D', source: 'B', target: 'D' },
      { id: 'B-E', source: 'B', target: 'E' },
      { id: 'C-F', source: 'C', target: 'F' },
      { id: 'D-F', source: 'D', target: 'F' },
      { id: 'E-F', source: 'E', target: 'F' }
    ],
    defaultPositions: {
      A: { x: 150, y: 150 },
      B: { x: 150, y: 350 },
      C: { x: 350, y: 100 },
      D: { x: 350, y: 250 },
      E: { x: 350, y: 400 },
      F: { x: 550, y: 250 }
    }
  },
  {
    id: 'dense-floyd',
    name: 'Dense Graph',
    description: 'All-pairs shortest path — used for Floyd-Warshall',
    directed: true,
    weighted: true,
    nodes: [
      { id: '0', label: '0' },
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' }
    ],
    edges: [
      { id: '0-1', source: '0', target: '1', weight: 3 },
      { id: '0-3', source: '0', target: '3', weight: 7 },
      { id: '1-0', source: '1', target: '0', weight: 8 },
      { id: '1-2', source: '1', target: '2', weight: 2 },
      { id: '2-0', source: '2', target: '0', weight: 5 },
      { id: '2-3', source: '2', target: '3', weight: 1 },
      { id: '3-0', source: '3', target: '0', weight: 2 }
    ],
    defaultPositions: {
      '0': { x: 250, y: 150 },
      '1': { x: 550, y: 150 },
      '2': { x: 550, y: 400 },
      '3': { x: 250, y: 400 }
    }
  },
  {
    id: 'disconnected',
    name: 'Disconnected Graph',
    description: 'Multiple components — shows BFS/DFS component detection',
    directed: false,
    weighted: false,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
      { id: 'F', label: 'F' }
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'A-C', source: 'A', target: 'C' },
      { id: 'B-C', source: 'B', target: 'C' },
      { id: 'D-E', source: 'D', target: 'E' },
      { id: 'D-F', source: 'D', target: 'F' }
    ],
    defaultPositions: {
      A: { x: 200, y: 150 },
      B: { x: 300, y: 250 },
      C: { x: 100, y: 250 },
      D: { x: 550, y: 150 },
      E: { x: 650, y: 250 },
      F: { x: 450, y: 250 }
    }
  }
];
