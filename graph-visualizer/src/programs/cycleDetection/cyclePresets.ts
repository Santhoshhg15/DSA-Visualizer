import type { Node, Edge } from '../../stores/useGraphStore';

export interface PresetData {
  id: string;
  name: string;
  directed: boolean;
  expectedResult: boolean;
  nodes: Node[];
  edges: Edge[];
  positions: Record<string, { x: number; y: number }>;
}

export const cyclePresets: PresetData[] = [
  // UNDIRECTED PRESETS (Union-Find)
  {
    id: 'undir-with-cycle',
    name: 'Undirected — Has Cycle',
    directed: false,
    expectedResult: true,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'B-C', source: 'B', target: 'C' },
      { id: 'C-D', source: 'C', target: 'D' },
      { id: 'D-B', source: 'D', target: 'B' },
      { id: 'D-E', source: 'D', target: 'E' },
    ],
    positions: {
      A: { x: 350, y: 200 },
      B: { x: 500, y: 200 },
      C: { x: 600, y: 350 },
      D: { x: 480, y: 480 },
      E: { x: 320, y: 400 },
    },
  },
  {
    id: 'undir-no-cycle',
    name: 'Undirected — No Cycle (Tree)',
    directed: false,
    expectedResult: false,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'A-C', source: 'A', target: 'C' },
      { id: 'B-D', source: 'B', target: 'D' },
      { id: 'B-E', source: 'B', target: 'E' },
    ],
    positions: {
      A: { x: 500, y: 150 },
      B: { x: 400, y: 300 },
      C: { x: 600, y: 300 },
      D: { x: 320, y: 450 },
      E: { x: 480, y: 450 },
    },
  },
  {
    id: 'undir-complex',
    name: 'Undirected — Complex Graph',
    directed: false,
    expectedResult: true,
    nodes: [
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
      { id: '6', label: '6' },
    ],
    edges: [
      { id: '1-2', source: '1', target: '2' },
      { id: '2-3', source: '2', target: '3' },
      { id: '3-4', source: '3', target: '4' },
      { id: '4-5', source: '4', target: '5' },
      { id: '5-6', source: '5', target: '6' },
      { id: '6-2', source: '6', target: '2' },
      { id: '1-4', source: '1', target: '4' },
    ],
    positions: {
      '1': { x: 500, y: 150 },
      '2': { x: 650, y: 250 },
      '3': { x: 650, y: 450 },
      '4': { x: 500, y: 550 },
      '5': { x: 350, y: 450 },
      '6': { x: 350, y: 250 },
    },
  },
  // DIRECTED PRESETS (DFS Back-Edge)
  {
    id: 'dir-with-cycle',
    name: 'Directed — Has Cycle',
    directed: true,
    expectedResult: true,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'B-C', source: 'B', target: 'C' },
      { id: 'C-D', source: 'C', target: 'D' },
      { id: 'D-B', source: 'D', target: 'B' },
    ],
    positions: {
      A: { x: 300, y: 350 },
      B: { x: 450, y: 350 },
      C: { x: 600, y: 350 },
      D: { x: 750, y: 350 },
    },
  },
  {
    id: 'dir-no-cycle',
    name: 'Directed — No Cycle (DAG)',
    directed: true,
    expectedResult: false,
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'A-C', source: 'A', target: 'C' },
      { id: 'B-D', source: 'B', target: 'D' },
      { id: 'C-D', source: 'C', target: 'D' },
      { id: 'D-E', source: 'D', target: 'E' },
    ],
    positions: {
      A: { x: 500, y: 150 },
      B: { x: 380, y: 280 },
      C: { x: 620, y: 280 },
      D: { x: 500, y: 420 },
      E: { x: 500, y: 550 },
    },
  },
  {
    id: 'dir-complex',
    name: 'Directed — Complex',
    directed: true,
    expectedResult: true,
    nodes: [
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
      { id: '6', label: '6' },
    ],
    edges: [
      { id: '1-2', source: '1', target: '2' },
      { id: '2-3', source: '2', target: '3' },
      { id: '3-4', source: '3', target: '4' },
      { id: '4-2', source: '4', target: '2' },
      { id: '3-5', source: '3', target: '5' },
      { id: '5-6', source: '5', target: '6' },
      { id: '6-3', source: '6', target: '3' },
    ],
    positions: {
      '1': { x: 500, y: 150 },
      '2': { x: 650, y: 250 },
      '3': { x: 650, y: 450 },
      '4': { x: 500, y: 550 },
      '5': { x: 350, y: 450 },
      '6': { x: 350, y: 250 },
    },
  },
];
