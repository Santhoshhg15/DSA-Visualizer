import React, { useState, useEffect, useRef } from 'react';

export interface AlgorithmCardData {
  id: string;
  name: string;
  icon: string;
  color: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  category: 'TRAVERSAL' | 'SHORTEST PATH' | 'MST';
  dijkstraImpl?: 'pq' | 'set';
}

export interface ProgramCardData {
  id: 'islands' | 'cycle' | 'bipartite';
  variant?: string;
  name: string;
  icon: string;
  color: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  category: 'GRID PROBLEMS' | 'GRAPH THEORY';
  tags: string[];
  extraBadge: {
    text: string;
    colorClass: string;
  };
}

export interface ConceptData {
  id: string;
  title: string;
  icon: string;
  color: string;
  definition: string;
  description: string;
  facts: string[];
  renderSvg: (inView: boolean) => React.ReactNode;
}

const algorithmsData: AlgorithmCardData[] = [
  // Traversal
  {
    id: 'bfs',
    name: 'BFS — Breadth-First Search',
    icon: '🔵',
    color: '#3b82f6',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores the graph level by level using a Queue. Visits all nodes at distance k before nodes at distance k+1. Ideal for finding shortest paths in unweighted graphs.',
    category: 'TRAVERSAL'
  },
  {
    id: 'dfs',
    name: 'DFS — Depth-First Search',
    icon: '🟣',
    color: '#7C3AED',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores as deep as possible along each branch before backtracking. Uses a recursive call stack. Useful for cycle detection, topological sort, and connected components.',
    category: 'TRAVERSAL'
  },
  // Shortest Path
  {
    id: 'dijkstra',
    name: "Dijkstra's (Priority Queue)",
    icon: '📏',
    color: '#0891B2',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description: 'Finds shortest paths from a source to all vertices in a weighted graph using a Min-Heap. Greedy approach — always processes the nearest unvisited node. Does not work with negative edges.',
    category: 'SHORTEST PATH',
    dijkstraImpl: 'pq'
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's (TreeSet)",
    icon: '🌐',
    color: '#0E7490',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description: 'Same as Dijkstra PQ but uses a TreeSet instead of Priority Queue. Key difference: explicitly removes stale entries before inserting updated distances — no duplicate entries in the set.',
    category: 'SHORTEST PATH',
    dijkstraImpl: 'set'
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    icon: '⚡',
    color: '#D97706',
    timeComplexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    description: 'Finds shortest paths from a source by relaxing all edges V-1 times. Slower than Dijkstra but handles negative edge weights. Can also detect negative weight cycles.',
    category: 'SHORTEST PATH'
  },
  {
    id: 'floyd-warshall',
    name: 'Floyd-Warshall',
    icon: '🔲',
    color: '#DB2777',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    description: 'All-pairs shortest path algorithm using dynamic programming. Computes shortest distances between every pair of vertices. Works with negative edges but not negative cycles.',
    category: 'SHORTEST PATH'
  },
  // MST
  {
    id: 'kruskal',
    name: "Kruskal's MST",
    icon: '🌲',
    color: '#059669',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(E)',
    description: "Builds a Minimum Spanning Tree by sorting all edges by weight and greedily adding edges that don't form a cycle. Uses Union-Find to detect cycles efficiently.",
    category: 'MST'
  },
  {
    id: 'prim',
    name: "Prim's MST",
    icon: '🌿',
    color: '#16A34A',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description: 'Builds MST by starting from a source and greedily picking the minimum weight edge that connects a visited node to an unvisited one. Uses a Priority Queue. Better than Kruskal for dense graphs.',
    category: 'MST'
  }
];

const programsData: ProgramCardData[] = [
  {
    id: 'islands',
    variant: 'leetcode',
    name: 'Number of Islands (LeetCode 4-dir)',
    icon: '🏝️',
    color: '#0891B2',
    timeComplexity: 'O(M × N)',
    spaceComplexity: 'O(min(M, N))',
    description: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands using 4-directional BFS flood fill. Each BFS call marks an entire island as visited.",
    category: 'GRID PROBLEMS',
    tags: ['GRID', 'LEETCODE #200'],
    extraBadge: { text: 'LC #200', colorClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' }
  },
  {
    id: 'islands',
    variant: 'gfg',
    name: 'Number of Islands (GFG 8-dir)',
    icon: '🗺️',
    color: '#0E7490',
    timeComplexity: 'O(M × N)',
    spaceComplexity: 'O(min(M, N))',
    description: 'GFG variant of Number of Islands using 8-directional BFS — includes diagonal neighbors. A diagonal cell is also considered connected, resulting in fewer islands than the 4-directional approach.',
    category: 'GRID PROBLEMS',
    tags: ['GRID', 'GFG'],
    extraBadge: { text: 'GFG', colorClass: 'bg-orange-500/10 border-orange-500/30 text-orange-400' }
  },
  {
    id: 'cycle',
    variant: 'undirected-union-find',
    name: 'Cycle Detection',
    icon: '🔄',
    color: '#7C3AED',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Detect cycles in both undirected and directed graphs using 4 approaches: Union-Find (undirected), BFS Parent Tracking (undirected), DFS Back-Edge (directed), and Kahn\'s Algorithm BFS (directed).',
    category: 'GRAPH THEORY',
    tags: ['GRAPH THEORY'],
    extraBadge: { text: '4 variants', colorClass: 'bg-purple-500/10 border-purple-500/30 text-purple-400' }
  },
  {
    id: 'bipartite',
    name: 'Bipartite Graph Check',
    icon: '🎨',
    color: '#D97706',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Check if a graph can be 2-colored such that no two adjacent nodes share the same color. Uses BFS to assign alternating colors (Yellow/Orange). A graph with an odd cycle is never bipartite.',
    category: 'GRAPH THEORY',
    tags: ['GRAPH THEORY'],
    extraBadge: { text: '2-Coloring', colorClass: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' }
  }
];

const conceptsData: ConceptData[] = [
  {
    id: 'what-is-graph',
    title: 'What is a Graph?',
    icon: '🕸️',
    color: '#10b981',
    definition: 'A non-linear data structure made of Vertices connected by Edges.',
    description: 'Unlike arrays or trees, graphs can represent any relationship between objects — social networks, maps, web pages, dependencies. A graph G is formally defined as G = (V, E) where V is a set of vertices and E is a set of edges connecting pairs of vertices.',
    facts: [
      'Used in GPS, social networks, compilers',
      'Can have cycles unlike trees',
      'G = (V, E) formal definition',
      'Can be directed or undirected'
    ],
    renderSvg: (inView) => (
      <svg viewBox="0 0 300 160" className={`w-full h-full select-none ${inView ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes drawLine {
              from { stroke-dashoffset: 100; }
              to { stroke-dashoffset: 0; }
            }
            .node-circle-c1 {
              fill: rgba(16, 185, 129, 0.2);
              stroke: #10b981;
              stroke-width: 2px;
            }
            .node-text-c1 {
              fill: #10b981;
              font-family: var(--font-mono), monospace;
              font-size: 11px;
              font-weight: 600;
            }
            .edge-line-c1 {
              stroke: rgba(16, 185, 129, 0.5);
              stroke-width: 1.5px;
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
            }
            .active .node-anim {
              transform-origin: center;
              transform-box: fill-box;
              animation: scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .active .edge-anim {
              animation: drawLine 400ms ease-out forwards;
            }
          `}</style>
        </defs>

        {/* Edges */}
        <line x1="150" y1="75" x2="100" y2="35" className="edge-line-c1 edge-anim" style={{ animationDelay: '200ms' }} />
        <line x1="150" y1="75" x2="200" y2="35" className="edge-line-c1 edge-anim" style={{ animationDelay: '250ms' }} />
        <line x1="150" y1="75" x2="90" y2="105" className="edge-line-c1 edge-anim" style={{ animationDelay: '300ms' }} />
        <line x1="100" y1="35" x2="200" y2="35" className="edge-line-c1 edge-anim" style={{ animationDelay: '350ms' }} />
        <line x1="200" y1="35" x2="210" y2="105" className="edge-line-c1 edge-anim" style={{ animationDelay: '400ms' }} />

        {/* Nodes */}
        <g className="node-anim" style={{ animationDelay: '0ms' }}>
          <circle cx="150" cy="75" r="16" className="node-circle-c1" />
          <text x="150" y="75" className="node-text-c1" dominantBaseline="central" textAnchor="middle">A</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '40ms' }}>
          <circle cx="100" cy="35" r="16" className="node-circle-c1" />
          <text x="100" y="35" className="node-text-c1" dominantBaseline="central" textAnchor="middle">B</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '80ms' }}>
          <circle cx="200" cy="35" r="16" className="node-circle-c1" />
          <text x="200" y="35" className="node-text-c1" dominantBaseline="central" textAnchor="middle">C</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '120ms' }}>
          <circle cx="90" cy="105" r="16" className="node-circle-c1" />
          <text x="90" y="105" className="node-text-c1" dominantBaseline="central" textAnchor="middle">D</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '160ms' }}>
          <circle cx="210" cy="105" r="16" className="node-circle-c1" />
          <text x="210" y="105" className="node-text-c1" dominantBaseline="central" textAnchor="middle">E</text>
        </g>
      </svg>
    )
  },
  {
    id: 'what-is-vertex',
    title: 'What is a Vertex (Node)?',
    icon: '⭕',
    color: '#3b82f6',
    definition: 'A fundamental unit of a graph representing an entity or object.',
    description: 'A vertex (plural: vertices) is the basic building block of a graph. It stores data and can be connected to any number of other vertices. Unlike a tree node which has a parent-child constraint, a graph vertex can connect to ANY other vertex freely. Vertices are also called nodes or points.',
    facts: [
      'Also called Node or Point',
      'Can have 0 connections (isolated vertex)',
      'Stores data (label, value, key)',
      'Degree = number of connected edges'
    ],
    renderSvg: (inView) => (
      <svg viewBox="0 0 300 160" className={`w-full h-full select-none ${inView ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes drawLine {
              from { stroke-dashoffset: 100; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-5px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .node-circle-v {
              fill: rgba(59, 130, 246, 0.1);
              stroke: rgba(59, 130, 246, 0.5);
              stroke-width: 2px;
            }
            .node-circle-v-high {
              fill: rgba(59, 130, 246, 0.3);
              stroke: #3b82f6;
              stroke-width: 2px;
              stroke-dasharray: 4 2;
            }
            .node-text-v {
              fill: #3b82f6;
              font-family: var(--font-mono), monospace;
              font-size: 11px;
              font-weight: 600;
            }
            .edge-line-v {
              stroke: rgba(59, 130, 246, 0.3);
              stroke-width: 1.5px;
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
            }
            .vertex-pointer {
              stroke: #3b82f6;
              stroke-width: 1.5px;
              fill: none;
            }
            .vertex-text {
              fill: #3b82f6;
              font-family: var(--font-sans), sans-serif;
              font-size: 10px;
              font-weight: bold;
              letter-spacing: 0.05em;
            }
            .active .node-anim {
              transform-origin: center;
              transform-box: fill-box;
              animation: scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .active .edge-anim {
              animation: drawLine 400ms ease-out forwards;
            }
            .active .pointer-anim {
              animation: fadeIn 300ms ease-out 400ms forwards;
              opacity: 0;
            }
          `}</style>
        </defs>

        {/* Edges */}
        <line x1="70" y1="90" x2="150" y2="90" className="edge-line-v edge-anim" style={{ animationDelay: '150ms' }} />
        <line x1="150" y1="90" x2="230" y2="90" className="edge-line-v edge-anim" style={{ animationDelay: '250ms' }} />

        {/* Node 0 */}
        <g className="node-anim" style={{ animationDelay: '0ms' }}>
          <circle cx="70" cy="90" r="18" className="node-circle-v" />
          <text x="70" y="90" className="node-text-v" dominantBaseline="central" textAnchor="middle">0</text>
          <text x="70" y="122" className="node-text-v" style={{ fontSize: '9px', fill: 'rgba(59,130,246,0.7)' }} textAnchor="middle">Node 0</text>
        </g>

        {/* Node 1 */}
        <g className="node-anim" style={{ animationDelay: '50ms' }}>
          <circle cx="150" cy="90" r="18" className="node-circle-v" />
          <text x="150" y="90" className="node-text-v" dominantBaseline="central" textAnchor="middle">1</text>
          <text x="150" y="122" className="node-text-v" style={{ fontSize: '9px', fill: 'rgba(59,130,246,0.7)' }} textAnchor="middle">Node 1</text>
        </g>

        {/* Node 2 (Highlighted) */}
        <g className="node-anim" style={{ animationDelay: '100ms' }}>
          <circle cx="230" cy="90" r="22" className="node-circle-v-high" />
          <text x="230" y="90" className="node-text-v" dominantBaseline="central" textAnchor="middle">2</text>
          <text x="230" y="126" className="node-text-v" style={{ fontSize: '9px', fill: 'rgba(59,130,246,0.9)', fontWeight: 'bold' }} textAnchor="middle">Node 2</text>
        </g>

        {/* Vertex pointer */}
        <g className="pointer-anim">
          <text x="230" y="32" className="vertex-text" textAnchor="middle">Vertex</text>
          <line x1="230" y1="38" x2="230" y2="54" className="vertex-pointer" />
          <polygon points="227,49 230,55 233,49" fill="#3b82f6" />
        </g>
      </svg>
    )
  },
  {
    id: 'what-is-edge',
    title: 'What is an Edge?',
    icon: '↔️',
    color: '#F59E0B',
    definition: 'A connection between two vertices representing a relationship.',
    description: 'An edge connects two vertices and represents a relationship or path between them. Edges can be directed (one-way, like a one-way road) or undirected (two-way, like a friendship). Edges can also carry a weight representing cost, distance, or capacity.',
    facts: [
      'Directed edge = one-way connection',
      'Undirected edge = two-way connection',
      'Weighted edge carries a cost/distance',
      'Self-loop: edge connecting node to itself'
    ],
    renderSvg: (inView) => (
      <svg viewBox="0 0 400 160" className={`w-full h-full select-none ${inView ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes drawLine {
              from { stroke-dashoffset: 120; }
              to { stroke-dashoffset: 0; }
            }
            .node-circle-e {
              fill: rgba(245, 158, 11, 0.15);
              stroke: #F59E0B;
              stroke-width: 2px;
            }
            .node-text-e {
              fill: #F59E0B;
              font-family: var(--font-mono), monospace;
              font-size: 11px;
              font-weight: 600;
            }
            .edge-line-e {
              stroke: #F59E0B;
              stroke-width: 2px;
              stroke-dasharray: 120;
              stroke-dashoffset: 120;
            }
            .edge-label-text {
              fill: #F59E0B;
              font-family: var(--font-sans), sans-serif;
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 0.05em;
            }
            .active .node-anim {
              transform-origin: center;
              transform-box: fill-box;
              animation: scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .active .edge-anim {
              animation: drawLine 400ms ease-out forwards;
            }
          `}</style>
          <marker id="arrow-amber" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#F59E0B" />
          </marker>
        </defs>

        {/* Left: Undirected Edge */}
        <line x1="60" y1="70" x2="140" y2="70" className="edge-line-e edge-anim" style={{ animationDelay: '150ms' }} />
        
        <g className="node-anim" style={{ animationDelay: '0ms' }}>
          <circle cx="60" cy="70" r="18" className="node-circle-e" />
          <text x="60" y="70" className="node-text-e" dominantBaseline="central" textAnchor="middle">A</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '50ms' }}>
          <circle cx="140" cy="70" r="18" className="node-circle-e" />
          <text x="140" y="70" className="node-text-e" dominantBaseline="central" textAnchor="middle">B</text>
        </g>
        <text x="100" y="115" className="edge-label-text" textAnchor="middle">UNDIRECTED</text>

        {/* Divider */}
        <line x1="200" y1="20" x2="200" y2="140" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Right: Directed Edges */}
        <line x1="240" y1="60" x2="340" y2="60" className="edge-line-e edge-anim" markerEnd="url(#arrow-amber)" style={{ animationDelay: '200ms' }} />
        <line x1="340" y1="60" x2="290" y2="120" className="edge-line-e edge-anim" markerEnd="url(#arrow-amber)" style={{ animationDelay: '300ms' }} />

        <g className="node-anim" style={{ animationDelay: '100ms' }}>
          <circle cx="240" cy="60" r="16" className="node-circle-e" />
          <text x="240" y="60" className="node-text-e" dominantBaseline="central" textAnchor="middle">X</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '150ms' }}>
          <circle cx="340" cy="60" r="16" className="node-circle-e" />
          <text x="340" y="60" className="node-text-e" dominantBaseline="central" textAnchor="middle">Y</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '200ms' }}>
          <circle cx="290" cy="120" r="16" className="node-circle-e" />
          <text x="290" y="120" className="node-text-e" dominantBaseline="central" textAnchor="middle">Z</text>
        </g>
        <text x="290" y="150" className="edge-label-text" textAnchor="middle">DIRECTED</text>
      </svg>
    )
  },
  {
    id: 'directed-vs-undirected',
    title: 'Directed vs Undirected',
    icon: '🔀',
    color: '#8B5CF6',
    definition: 'Graphs where edges have direction (directed) or no direction (undirected).',
    description: 'In an undirected graph, if vertex A is connected to B then B is also connected to A. In a directed graph (digraph), edge A→B does not imply B→A. Social media followers (directed) vs Facebook friends (undirected) are classic real-world examples.',
    facts: [
      'Twitter/Instagram = directed graph',
      'Facebook friends = undirected graph',
      'Directed graphs called digraphs',
      'Undirected: adjacency is symmetric'
    ],
    renderSvg: (inView) => (
      <svg viewBox="0 0 400 160" className={`w-full h-full select-none ${inView ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes drawLine {
              from { stroke-dashoffset: 100; }
              to { stroke-dashoffset: 0; }
            }
            .node-circle-d {
              fill: rgba(139, 92, 246, 0.15);
              stroke: #8B5CF6;
              stroke-width: 1.5px;
            }
            .node-text-d {
              fill: #8B5CF6;
              font-family: var(--font-mono), monospace;
              font-size: 10px;
              font-weight: 600;
            }
            .edge-line-d {
              stroke: rgba(139, 92, 246, 0.5);
              stroke-width: 1.5px;
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
            }
            .edge-line-d-dir {
              stroke: #8B5CF6;
              stroke-width: 1.5px;
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
            }
            .section-label {
              fill: var(--muted-color);
              font-family: var(--font-sans), sans-serif;
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 0.05em;
            }
            .active .node-anim {
              transform-origin: center;
              transform-box: fill-box;
              animation: scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .active .edge-anim {
              animation: drawLine 400ms ease-out forwards;
            }
          `}</style>
          <marker id="arrow-violet" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#8B5CF6" />
          </marker>
        </defs>

        {/* Left: Undirected Graph */}
        <line x1="50" y1="70" x2="100" y2="40" className="edge-line-d edge-anim" style={{ animationDelay: '150ms' }} />
        <line x1="100" y1="40" x2="150" y2="70" className="edge-line-d edge-anim" style={{ animationDelay: '200ms' }} />
        <line x1="50" y1="70" x2="150" y2="70" className="edge-line-d edge-anim" style={{ animationDelay: '250ms' }} />

        <g className="node-anim" style={{ animationDelay: '0ms' }}>
          <circle cx="50" cy="70" r="16" className="node-circle-d" />
          <text x="50" y="70" className="node-text-d" dominantBaseline="central" textAnchor="middle">A</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '40ms' }}>
          <circle cx="100" cy="40" r="16" className="node-circle-d" />
          <text x="100" y="40" className="node-text-d" dominantBaseline="central" textAnchor="middle">B</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '80ms' }}>
          <circle cx="150" cy="70" r="16" className="node-circle-d" />
          <text x="150" y="70" className="node-text-d" dominantBaseline="central" textAnchor="middle">C</text>
        </g>
        <text x="100" y="115" className="section-label" textAnchor="middle">UNDIRECTED</text>

        {/* Divider */}
        <line x1="200" y1="20" x2="200" y2="130" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Right: Directed Graph */}
        <line x1="250" y1="70" x2="300" y2="40" className="edge-line-d-dir edge-anim" markerEnd="url(#arrow-violet)" style={{ animationDelay: '200ms' }} />
        <line x1="300" y1="40" x2="350" y2="70" className="edge-line-d-dir edge-anim" markerEnd="url(#arrow-violet)" style={{ animationDelay: '250ms' }} />
        <line x1="350" y1="70" x2="250" y2="70" className="edge-line-d-dir edge-anim" markerEnd="url(#arrow-violet)" style={{ animationDelay: '300ms' }} />

        <g className="node-anim" style={{ animationDelay: '100ms' }}>
          <circle cx="250" cy="70" r="16" className="node-circle-d" />
          <text x="250" y="70" className="node-text-d" dominantBaseline="central" textAnchor="middle">X</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '140ms' }}>
          <circle cx="300" cy="40" r="16" className="node-circle-d" />
          <text x="300" y="40" className="node-text-d" dominantBaseline="central" textAnchor="middle">Y</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '180ms' }}>
          <circle cx="350" cy="70" r="16" className="node-circle-d" />
          <text x="350" y="70" className="node-text-d" dominantBaseline="central" textAnchor="middle">Z</text>
        </g>
        <text x="300" y="115" className="section-label" textAnchor="middle">DIRECTED</text>
      </svg>
    )
  },
  {
    id: 'weighted-vs-unweighted',
    title: 'Weighted vs Unweighted',
    icon: '⚖️',
    color: '#EC4899',
    definition: 'Graphs where edges carry a numeric value (weight) or have no value.',
    description: 'In a weighted graph, each edge has a numeric value representing cost, distance, time, or capacity. Weighted graphs are used in GPS navigation (distance), network routing (latency), and logistics (cost). Algorithms like Dijkstra and Kruskal require weighted graphs.',
    facts: [
      'Used in GPS, network routing, logistics',
      'Dijkstra works on weighted graphs',
      'Unweighted = BFS for shortest path',
      'Weight can represent cost, time, distance'
    ],
    renderSvg: (inView) => (
      <svg viewBox="0 0 300 160" className={`w-full h-full select-none ${inView ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes drawLine {
              from { stroke-dashoffset: 120; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .node-circle-w {
              fill: rgba(236, 72, 153, 0.15);
              stroke: #EC4899;
              stroke-width: 2px;
            }
            .node-text-w {
              fill: #EC4899;
              font-family: var(--font-mono), monospace;
              font-size: 11px;
              font-weight: 600;
            }
            .edge-line-w {
              stroke: rgba(236, 72, 153, 0.5);
              stroke-width: 2px;
              stroke-dasharray: 120;
              stroke-dashoffset: 120;
            }
            .weight-badge-bg {
              fill: var(--bg-gradient-1);
              stroke: rgba(236, 72, 153, 0.4);
              stroke-width: 1px;
            }
            .weight-badge-text {
              fill: #EC4899;
              font-family: var(--font-mono), monospace;
              font-size: 9px;
              font-weight: 600;
            }
            .active .node-anim {
              transform-origin: center;
              transform-box: fill-box;
              animation: scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .active .edge-anim {
              animation: drawLine 400ms ease-out forwards;
            }
            .active .badge-anim {
              animation: fadeIn 200ms ease-out forwards;
            }
          `}</style>
        </defs>

        {/* Edges */}
        <line x1="50" y1="45" x2="150" y2="45" className="edge-line-w edge-anim" style={{ animationDelay: '150ms' }} />
        <line x1="150" y1="45" x2="100" y2="115" className="edge-line-w edge-anim" style={{ animationDelay: '200ms' }} />
        <line x1="50" y1="45" x2="100" y2="115" className="edge-line-w edge-anim" style={{ animationDelay: '250ms' }} />
        <line x1="100" y1="115" x2="200" y2="115" className="edge-line-w edge-anim" style={{ animationDelay: '300ms' }} />

        {/* Nodes */}
        <g className="node-anim" style={{ animationDelay: '0ms' }}>
          <circle cx="50" cy="45" r="16" className="node-circle-w" />
          <text x="50" y="45" className="node-text-w" dominantBaseline="central" textAnchor="middle">A</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '50ms' }}>
          <circle cx="150" cy="45" r="16" className="node-circle-w" />
          <text x="150" y="45" className="node-text-w" dominantBaseline="central" textAnchor="middle">B</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '100ms' }}>
          <circle cx="100" cy="115" r="16" className="node-circle-w" />
          <text x="100" y="115" className="node-text-w" dominantBaseline="central" textAnchor="middle">C</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '150ms' }}>
          <circle cx="200" cy="115" r="16" className="node-circle-w" />
          <text x="200" y="115" className="node-text-w" dominantBaseline="central" textAnchor="middle">D</text>
        </g>

        {/* Weight badges */}
        <g className="badge-anim" style={{ opacity: 0, animationDelay: '500ms' }}>
          <rect x="92" y="37" width="16" height="14" rx="3" className="weight-badge-bg" />
          <text x="100" y="44" className="weight-badge-text" textAnchor="middle" dominantBaseline="central">4</text>

          <rect x="117" y="73" width="16" height="14" rx="3" className="weight-badge-bg" />
          <text x="125" y="80" className="weight-badge-text" textAnchor="middle" dominantBaseline="central">2</text>

          <rect x="67" y="73" width="16" height="14" rx="3" className="weight-badge-bg" />
          <text x="75" y="80" className="weight-badge-text" textAnchor="middle" dominantBaseline="central">7</text>

          <rect x="142" y="108" width="16" height="14" rx="3" className="weight-badge-bg" />
          <text x="150" y="115" className="weight-badge-text" textAnchor="middle" dominantBaseline="central">1</text>
        </g>
      </svg>
    )
  },
  {
    id: 'list-vs-matrix',
    title: 'Adjacency List vs Matrix',
    icon: '📋',
    color: '#06B6D4',
    definition: 'Two ways to represent a graph\'s connections in memory.',
    description: 'Adjacency List stores each vertex\'s neighbors as a list — efficient for sparse graphs (O(V+E) space). Adjacency Matrix uses a V×V grid where matrix[i][j]=1 means edge exists — efficient for dense graphs (O(V²) space). Most real-world implementations use adjacency lists.',
    facts: [
      'List: O(V+E) space — sparse graphs',
      'Matrix: O(V²) space — dense graphs',
      'List: slower edge lookup O(degree)',
      'Matrix: instant edge lookup O(1)'
    ],
    renderSvg: (inView) => (
      <svg viewBox="0 0 320 160" className={`w-full h-full select-none ${inView ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .cyan-box {
              fill: rgba(6, 182, 212, 0.08);
              stroke: rgba(6, 182, 212, 0.2);
              stroke-width: 1px;
            }
            .matrix-border {
              stroke: var(--border-color);
              stroke-width: 0.5px;
              fill: none;
            }
            .list-text {
              fill: #06B6D4;
              font-family: var(--font-mono), monospace;
              font-size: 11px;
              font-weight: 500;
            }
            .matrix-text {
              fill: var(--text-color);
              font-family: var(--font-mono), monospace;
              font-size: 10px;
              text-anchor: middle;
            }
            .matrix-text-header {
              fill: #06B6D4;
              font-family: var(--font-mono), monospace;
              font-size: 10px;
              font-weight: bold;
              text-anchor: middle;
            }
            .matrix-1 {
              fill: #06B6D4;
              font-weight: bold;
            }
            .matrix-0 {
              fill: var(--muted-color);
              opacity: 0.4;
            }
            .active .anim-list {
              animation: fadeIn 400ms ease-out forwards;
            }
            .active .anim-matrix {
              animation: fadeIn 400ms ease-out 250ms forwards;
              opacity: 0;
            }
          `}</style>
        </defs>

        {/* Left: Adjacency List */}
        <g className="anim-list">
          <rect x="15" y="20" width="125" height="110" rx="6" className="cyan-box" />
          <text x="30" y="45" className="list-text">A → [B, C]</text>
          <text x="30" y="68" className="list-text">B → [A, D]</text>
          <text x="30" y="91" className="list-text">C → [A]</text>
          <text x="30" y="114" className="list-text">D → [B]</text>
        </g>

        {/* Right: Adjacency Matrix */}
        <g className="anim-matrix">
          <text x="210" y="32" className="matrix-text-header">A</text>
          <text x="235" y="32" className="matrix-text-header">B</text>
          <text x="260" y="32" className="matrix-text-header">C</text>
          <text x="285" y="32" className="matrix-text-header">D</text>

          <text x="185" y="55" className="matrix-text-header">A</text>
          <text x="210" y="55" className="matrix-text matrix-0">0</text>
          <text x="235" y="55" className="matrix-text matrix-1">1</text>
          <text x="260" y="55" className="matrix-text matrix-1">1</text>
          <text x="285" y="55" className="matrix-text matrix-0">0</text>

          <text x="185" y="78" className="matrix-text-header">B</text>
          <text x="210" y="78" className="matrix-text matrix-1">1</text>
          <text x="235" y="78" className="matrix-text matrix-0">0</text>
          <text x="260" y="78" className="matrix-text matrix-0">0</text>
          <text x="285" y="78" className="matrix-text matrix-1">1</text>

          <text x="185" y="101" className="matrix-text-header">C</text>
          <text x="210" y="101" className="matrix-text matrix-1">1</text>
          <text x="235" y="101" className="matrix-text matrix-0">0</text>
          <text x="260" y="101" className="matrix-text matrix-0">0</text>
          <text x="285" y="101" className="matrix-text matrix-0">0</text>

          <text x="185" y="124" className="matrix-text-header">D</text>
          <text x="210" y="124" className="matrix-text matrix-0">0</text>
          <text x="235" y="124" className="matrix-text matrix-1">1</text>
          <text x="260" y="124" className="matrix-text matrix-0">0</text>
          <text x="285" y="124" className="matrix-text matrix-0">0</text>

          <line x1="200" y1="40" x2="295" y2="40" className="matrix-border" />
          <line x1="200" y1="63" x2="295" y2="63" className="matrix-border" />
          <line x1="200" y1="86" x2="295" y2="86" className="matrix-border" />
          <line x1="200" y1="109" x2="295" y2="109" className="matrix-border" />
          <line x1="200" y1="132" x2="295" y2="132" className="matrix-border" />

          <line x1="200" y1="40" x2="200" y2="132" className="matrix-border" />
          <line x1="222" y1="40" x2="222" y2="132" className="matrix-border" />
          <line x1="247" y1="40" x2="247" y2="132" className="matrix-border" />
          <line x1="272" y1="40" x2="272" y2="132" className="matrix-border" />
          <line x1="295" y1="40" x2="295" y2="132" className="matrix-border" />
        </g>
      </svg>
    )
  },
  {
    id: 'graph-traversal',
    title: 'Graph Traversal',
    icon: '🚶',
    color: '#F97316',
    definition: 'Systematically visiting every vertex in a graph exactly once.',
    description: 'Graph traversal algorithms visit all reachable vertices from a starting node. BFS uses a Queue and explores level by level (shortest path in unweighted graphs). DFS uses a Stack/Recursion and explores as deep as possible before backtracking. Both run in O(V+E) time.',
    facts: [
      'BFS uses Queue — level by level',
      'DFS uses Stack/Recursion — depth first',
      'Both visit every node exactly once',
      'Both run in O(V + E) time'
    ],
    renderSvg: (inView) => (
      <svg viewBox="0 0 300 160" className={`w-full h-full select-none ${inView ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes drawLine {
              from { stroke-dashoffset: 100; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.5); }
              to { opacity: 1; transform: scale(1); }
            }
            .node-circle-t {
              fill: rgba(249, 115, 22, 0.15);
              stroke: #F97316;
              stroke-width: 2px;
            }
            .node-text-t {
              fill: #F97316;
              font-family: var(--font-mono), monospace;
              font-size: 11px;
              font-weight: 600;
            }
            .edge-line-t {
              stroke: #F97316;
              stroke-width: 2px;
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
            }
            .visit-badge {
              fill: #F97316;
            }
            .visit-text {
              fill: #ffffff;
              font-family: var(--font-mono), monospace;
              font-size: 8px;
              font-weight: bold;
            }
            .active .node-anim {
              transform-origin: center;
              transform-box: fill-box;
              animation: scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .active .edge-anim {
              animation: drawLine 400ms ease-out forwards;
            }
            .active .badge-anim {
              transform-origin: center;
              transform-box: fill-box;
              animation: fadeIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              opacity: 0;
            }
          `}</style>
        </defs>

        {/* Edges */}
        <line x1="150" y1="75" x2="100" y2="35" className="edge-line-t edge-anim" style={{ animationDelay: '200ms' }} />
        <line x1="150" y1="75" x2="200" y2="35" className="edge-line-t edge-anim" style={{ animationDelay: '250ms' }} />
        <line x1="150" y1="75" x2="90" y2="105" className="edge-line-t edge-anim" style={{ animationDelay: '300ms' }} />
        <line x1="100" y1="35" x2="200" y2="35" className="edge-line-t edge-anim" style={{ animationDelay: '350ms' }} />
        <line x1="200" y1="35" x2="210" y2="105" className="edge-line-t edge-anim" style={{ animationDelay: '400ms' }} />

        {/* Nodes */}
        <g className="node-anim" style={{ animationDelay: '0ms' }}>
          <circle cx="150" cy="75" r="16" className="node-circle-t" />
          <text x="150" y="75" className="node-text-t" dominantBaseline="central" textAnchor="middle">A</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '40ms' }}>
          <circle cx="100" cy="35" r="16" className="node-circle-t" />
          <text x="100" y="35" className="node-text-t" dominantBaseline="central" textAnchor="middle">B</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '80ms' }}>
          <circle cx="200" cy="35" r="16" className="node-circle-t" />
          <text x="200" y="35" className="node-text-t" dominantBaseline="central" textAnchor="middle">C</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '120ms' }}>
          <circle cx="90" cy="105" r="16" className="node-circle-t" />
          <text x="90" y="105" className="node-text-t" dominantBaseline="central" textAnchor="middle">D</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '160ms' }}>
          <circle cx="210" cy="105" r="16" className="node-circle-t" />
          <text x="210" y="105" className="node-text-t" dominantBaseline="central" textAnchor="middle">E</text>
        </g>

        {/* Visit Order Badges */}
        <g className="badge-anim" style={{ animationDelay: '550ms' }}>
          <circle cx="150" cy="51" r="7" className="visit-badge" />
          <text x="150" y="51" className="visit-text" textAnchor="middle" dominantBaseline="central">1</text>
        </g>
        <g className="badge-anim" style={{ animationDelay: '590ms' }}>
          <circle cx="100" cy="11" r="7" className="visit-badge" />
          <text x="100" y="11" className="visit-text" textAnchor="middle" dominantBaseline="central">2</text>
        </g>
        <g className="badge-anim" style={{ animationDelay: '630ms' }}>
          <circle cx="200" cy="11" r="7" className="visit-badge" />
          <text x="200" y="11" className="visit-text" textAnchor="middle" dominantBaseline="central">3</text>
        </g>
        <g className="badge-anim" style={{ animationDelay: '670ms' }}>
          <circle cx="90" cy="81" r="7" className="visit-badge" />
          <text x="90" y="81" className="visit-text" textAnchor="middle" dominantBaseline="central">4</text>
        </g>
        <g className="badge-anim" style={{ animationDelay: '710ms' }}>
          <circle cx="210" cy="81" r="7" className="visit-badge" />
          <text x="210" y="81" className="visit-text" textAnchor="middle" dominantBaseline="central">5</text>
        </g>

        <text x="150" y="145" fill="#F97316" fontFamily="var(--font-mono)" fontSize="9px" fontWeight="bold" textAnchor="middle">
          BFS Order: A → B → C → D → E
        </text>
      </svg>
    )
  },
  {
    id: 'connected-components',
    title: 'Connected Components',
    icon: '🔗',
    color: '#14B8A6',
    definition: 'Maximal subgraphs where every vertex is reachable from every other vertex.',
    description: 'A connected component is a group of vertices where you can reach any vertex from any other vertex in the group. A graph may have multiple disconnected components. DFS/BFS can find all components by restarting from any unvisited vertex.',
    facts: [
      'Disconnected graph has 2+ components',
      'Find all: run DFS/BFS from each unvisited',
      'Complete graph has 1 component',
      'Tree is a connected acyclic graph'
    ],
    renderSvg: (inView) => (
      <svg viewBox="0 0 320 160" className={`w-full h-full select-none ${inView ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes drawLine {
              from { stroke-dashoffset: 100; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .halo-1 {
              fill: rgba(20, 184, 166, 0.05);
              stroke: rgba(20, 184, 166, 0.15);
              stroke-width: 1px;
            }
            .halo-2 {
              fill: rgba(8, 145, 178, 0.05);
              stroke: rgba(8, 145, 178, 0.15);
              stroke-width: 1px;
            }
            .node-circle-c1 {
              fill: rgba(20, 184, 166, 0.2);
              stroke: #14B8A6;
              stroke-width: 1.5px;
            }
            .node-circle-c2 {
              fill: rgba(8, 145, 178, 0.2);
              stroke: #0891B2;
              stroke-width: 1.5px;
            }
            .node-text-c1 {
              fill: #14B8A6;
              font-family: var(--font-mono), monospace;
              font-size: 10px;
              font-weight: 600;
            }
            .node-text-c2 {
              fill: #0891B2;
              font-family: var(--font-mono), monospace;
              font-size: 10px;
              font-weight: 600;
            }
            .edge-line-c1 {
              stroke: rgba(20, 184, 166, 0.5);
              stroke-width: 1.5px;
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
            }
            .edge-line-c2 {
              stroke: rgba(8, 145, 178, 0.5);
              stroke-width: 1.5px;
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
            }
            .comp-label {
              font-family: var(--font-sans), sans-serif;
              font-size: 10px;
              font-weight: 600;
            }
            .active .node-anim {
              transform-origin: center;
              transform-box: fill-box;
              animation: scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .active .edge-anim {
              animation: drawLine 400ms ease-out forwards;
            }
            .active .halo-anim {
              animation: fadeIn 500ms ease-out forwards;
            }
          `}</style>
        </defs>

        {/* Component 1 Halo Bubble */}
        <ellipse cx="70" cy="75" rx="55" ry="48" className="halo-1 halo-anim" style={{ opacity: 0, animationDelay: '450ms' }} />

        {/* Component 2 Halo Bubble */}
        <ellipse cx="235" cy="75" rx="48" ry="42" className="halo-2 halo-anim" style={{ opacity: 0, animationDelay: '550ms' }} />

        {/* Edges Comp 1 */}
        <line x1="50" y1="45" x2="95" y2="75" className="edge-line-c1 edge-anim" style={{ animationDelay: '150ms' }} />
        <line x1="95" y1="75" x2="45" y2="95" className="edge-line-c1 edge-anim" style={{ animationDelay: '200ms' }} />
        <line x1="45" y1="95" x2="50" y2="45" className="edge-line-c1 edge-anim" style={{ animationDelay: '250ms' }} />

        {/* Edges Comp 2 */}
        <line x1="210" y1="55" x2="260" y2="95" className="edge-line-c2 edge-anim" style={{ animationDelay: '200ms' }} />

        {/* Nodes Comp 1 */}
        <g className="node-anim" style={{ animationDelay: '0ms' }}>
          <circle cx="50" cy="45" r="14" className="node-circle-c1" />
          <text x="50" y="45" className="node-text-c1" dominantBaseline="central" textAnchor="middle">A</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '40ms' }}>
          <circle cx="95" cy="75" r="14" className="node-circle-c1" />
          <text x="95" y="75" className="node-text-c1" dominantBaseline="central" textAnchor="middle">B</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '80ms' }}>
          <circle cx="45" cy="95" r="14" className="node-circle-c1" />
          <text x="45" y="95" className="node-text-c1" dominantBaseline="central" textAnchor="middle">C</text>
        </g>

        {/* Nodes Comp 2 */}
        <g className="node-anim" style={{ animationDelay: '100ms' }}>
          <circle cx="210" cy="55" r="14" className="node-circle-c2" />
          <text x="210" y="55" className="node-text-c2" dominantBaseline="central" textAnchor="middle">D</text>
        </g>
        <g className="node-anim" style={{ animationDelay: '140ms' }}>
          <circle cx="260" cy="95" r="14" className="node-circle-c2" />
          <text x="260" y="95" className="node-text-c2" dominantBaseline="central" textAnchor="middle">E</text>
        </g>

        {/* Labels */}
        <text x="70" y="142" className="comp-label" fill="#14B8A6" textAnchor="middle">Component 1</text>
        <text x="235" y="142" className="comp-label" fill="#0891B2" textAnchor="middle">Component 2</text>
      </svg>
    )
  }
];

interface GraphLandingPageProps {
  onSelectAlgorithm: (algoId: string, dijkstraImpl?: 'pq' | 'set') => void;
  onSelectProgram: (programId: 'islands' | 'cycle' | 'bipartite', variant?: string) => void;
  onOpenVisualizer: () => void;
}

export function GraphLandingPage({
  onSelectAlgorithm,
  onSelectProgram,
  onOpenVisualizer
}: GraphLandingPageProps) {
  
  const handleScrollToAlgorithms = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('algorithms-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group algorithms by category
  const traversalAlgos = algorithmsData.filter(a => a.category === 'TRAVERSAL');
  const shortestPathAlgos = algorithmsData.filter(a => a.category === 'SHORTEST PATH');
  const mstAlgos = algorithmsData.filter(a => a.category === 'MST');

  // Group programs by category
  const gridPrograms = programsData.filter(p => p.category === 'GRID PROBLEMS');
  const theoryPrograms = programsData.filter(p => p.category === 'GRAPH THEORY');

  return (
    <div className="w-full min-h-screen bg-[var(--bg-gradient-1)] canvas-grid pb-24 text-[var(--text-color)] selection:bg-blue-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-10 py-12 pt-16 animate-fadeInUp" style={{ animationDuration: '400ms' }}>
        {/* Small badge */}
        <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-full px-3.5 py-1 text-[10px] font-semibold uppercase font-sans tracking-[0.08em] text-[#60a5fa] mb-4">
          DSA VISUALIZER — GRAPH MODULE
        </div>
        
        {/* Main Title */}
        <h1 className="text-[36px] font-bold tracking-tight text-[var(--text-color)] mb-2 font-sans">
          Graph Algorithms
        </h1>
        
        {/* Subtitle */}
        <p className="text-[15px] text-[var(--muted-color)] mb-6 font-sans max-w-lg">
          Visualise, trace and understand graph algorithms step by step
        </p>

        {/* Top Open Visualizer Button */}
        <button
          onClick={onOpenVisualizer}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-semibold font-sans px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-200 cursor-pointer active:scale-95 mb-8"
        >
          Open Visualizer →
        </button>
        
        {/* Stats Row */}
        <div className="flex items-center gap-8 justify-center mb-4">
          <div className="text-center">
            <div className="text-[24px] font-bold font-mono text-[#60a5fa]">8</div>
            <div className="text-[11px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)]">Algorithms</div>
          </div>
          <div className="w-px h-8 bg-[var(--border-color)]" />
          <div className="text-center">
            <div className="text-[24px] font-bold font-mono text-[#60a5fa]">3</div>
            <div className="text-[11px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)]">Programs</div>
          </div>
          <div className="w-px h-8 bg-[var(--border-color)]" />
          <div className="text-center">
            <div className="text-[24px] font-bold font-mono text-[#60a5fa]">15+</div>
            <div className="text-[11px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)]">Presets</div>
          </div>
        </div>
      </section>

      {/* Main content wrapper */}
      <div className="max-w-6xl mx-auto">

        {/* 2. GRAPH FUNDAMENTALS SECTION */}
        <section className="mb-14">
          {/* Section Header */}
          <div 
            className="flex items-center gap-3 px-6 md:px-10 mb-6 animate-fadeInUp opacity-0"
            style={{ animationDelay: '200ms', animationDuration: '400ms' }}
          >
            {/* Icon Badge */}
            <div className="flex items-center justify-center rounded-lg border border-[#10b981]/40 bg-[#10b981]/15 p-1.5 text-[18px]">
              🔷
            </div>
            
            <h2 className="text-[22px] font-bold font-sans text-[#10b981] tracking-tight">
              Graph Fundamentals
            </h2>
            
            <div className="flex-grow h-px bg-[var(--border-color)]" />
            
            <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-full px-3.5 py-1 text-[10px] uppercase font-sans tracking-[0.08em] text-[#10b981] font-semibold">
              8 concepts
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-4 md:px-6 lg:px-10 pb-12">
            {conceptsData.map((concept, idx) => (
              <ConceptCard key={concept.id} concept={concept} delay={300 + idx * 100} />
            ))}
          </div>
        </section>

        {/* 3. ALGORITHMS SECTION */}
        <section className="mb-14">
          {/* Section Header */}
          <div 
            id="algorithms-section" 
            className="flex items-center gap-3 px-6 md:px-10 mb-6 animate-fadeInUp opacity-0"
            style={{ animationDelay: '100ms', animationDuration: '500ms' }}
          >
            <span className="text-[11px] font-sans uppercase tracking-[0.08em] text-[var(--muted-color)] font-semibold">
              ALGORITHMS
            </span>
            <div className="flex-grow h-px bg-[var(--border-color)]" />
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full px-3.5 py-1 text-[10px] uppercase font-sans tracking-[0.08em] text-[var(--muted-color)] font-medium">
              8 algorithms
            </div>
          </div>

          {/* Sub-groups */}
          <div className="space-y-6 px-4 md:px-6 lg:px-10">
            
            {/* TRAVERSAL */}
            <div>
              <h3 className="text-[10px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)] mb-2 pl-1">
                TRAVERSAL
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {traversalAlgos.map((algo, idx) => (
                  <AlgorithmCard 
                    key={algo.name} 
                    algo={algo} 
                    delay={idx * 150} 
                    onClick={() => onSelectAlgorithm(algo.id, algo.dijkstraImpl)} 
                  />
                ))}
              </div>
            </div>

            {/* SHORTEST PATH */}
            <div>
              <h3 className="text-[10px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)] mt-4 mb-2 pl-1">
                SHORTEST PATH
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {shortestPathAlgos.map((algo, idx) => (
                  <AlgorithmCard 
                    key={algo.name} 
                    algo={algo} 
                    delay={(traversalAlgos.length + idx) * 150} 
                    onClick={() => onSelectAlgorithm(algo.id, algo.dijkstraImpl)} 
                  />
                ))}
              </div>
            </div>

            {/* MINIMUM SPANNING TREE */}
            <div>
              <h3 className="text-[10px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)] mt-4 mb-2 pl-1">
                MINIMUM SPANNING TREE
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {mstAlgos.map((algo, idx) => (
                  <AlgorithmCard 
                    key={algo.name} 
                    algo={algo} 
                    delay={(traversalAlgos.length + shortestPathAlgos.length + idx) * 150} 
                    onClick={() => onSelectAlgorithm(algo.id, algo.dijkstraImpl)} 
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. PROGRAMS SECTION */}
        <section className="mb-14">
          {/* Section Header */}
          <div 
            className="flex items-center gap-3 px-6 md:px-10 mb-6 animate-fadeInUp opacity-0"
            style={{ animationDelay: '900ms', animationDuration: '500ms' }}
          >
            <span className="text-[11px] font-sans uppercase tracking-[0.08em] text-[var(--muted-color)] font-semibold">
              PROGRAMS
            </span>
            <div className="flex-grow h-px bg-[var(--border-color)]" />
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full px-3.5 py-1 text-[10px] uppercase font-sans tracking-[0.08em] text-[var(--muted-color)] font-medium">
              3 programs
            </div>
          </div>

          <div className="space-y-6 px-4 md:px-6 lg:px-10">
            
            {/* GRID PROBLEMS */}
            <div>
              <h3 className="text-[10px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)] mb-2 pl-1">
                GRID PROBLEMS
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {gridPrograms.map((prog, idx) => (
                  <ProgramCard 
                    key={prog.name} 
                    prog={prog} 
                    delay={1000 + idx * 150} 
                    onClick={() => onSelectProgram(prog.id, prog.variant)} 
                  />
                ))}
              </div>
            </div>

            {/* GRAPH THEORY */}
            <div>
              <h3 className="text-[10px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)] mt-4 mb-2 pl-1">
                GRAPH THEORY
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {theoryPrograms.map((prog, idx) => (
                  <ProgramCard 
                    key={prog.name} 
                    prog={prog} 
                    delay={1000 + (gridPrograms.length + idx) * 150} 
                    onClick={() => onSelectProgram(prog.id, prog.variant)} 
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* 5. ENTER VISUALIZER CTA */}
      <section className="w-full bg-[var(--panel-bg)] border-t border-[var(--border-color)] px-10 py-10 mt-8 flex flex-col items-center text-center gap-4">
        <h2 className="text-[20px] font-bold font-sans text-[var(--text-color)]">
          Ready to visualize?
        </h2>
        <p className="text-[13px] font-sans text-[var(--muted-color)] max-w-md">
          Select a graph preset and run any algorithm step by step
        </p>
        <button
          onClick={onOpenVisualizer}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-semibold font-sans px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-200 cursor-pointer active:scale-95"
        >
          Open Visualizer →
        </button>
        <a 
          href="#algorithms-section"
          onClick={handleScrollToAlgorithms}
          className="text-[12px] font-sans text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors underline decoration-dotted underline-offset-4"
        >
          or jump directly to an algorithm ↑
        </a>
      </section>

    </div>
  );
}

function ConceptCard({ concept, delay }: { concept: ConceptData; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.05 });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[16px] p-5 md:p-7 flex flex-col gap-4 relative overflow-hidden group animate-fadeInUp opacity-0"
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: '400ms'
      }}
    >
      {/* Left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[3px] transition-all duration-200"
        style={{ backgroundColor: concept.color }}
      />

      {/* Subtle hover border styling and shadow */}
      <style>{`
        .group:hover {
          border-color: ${concept.color}80 !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>

      {/* TITLE ROW */}
      <div className="flex items-center gap-2.5">
        <div 
          className="w-9 h-9 flex items-center justify-center rounded-lg border text-[18px] select-none shrink-0"
          style={{
            backgroundColor: `${concept.color}1f`,
            borderColor: `${concept.color}4d`
          }}
        >
          {concept.icon}
        </div>
        <h4 className="text-[18px] font-bold font-sans text-[var(--text-color)]">
          {concept.title}
        </h4>
      </div>

      {/* DEFINITION BOX */}
      <div 
        className="border rounded-lg px-3.5 py-2.5 text-[12px] font-mono font-normal leading-relaxed"
        style={{
          backgroundColor: `${concept.color}14`,
          borderColor: `${concept.color}40`,
          color: concept.color
        }}
      >
        {concept.definition}
      </div>

      {/* DESCRIPTION */}
      <p className="text-[13px] font-sans text-[var(--muted-color)] leading-relaxed">
        {concept.description}
      </p>

      {/* SVG DIAGRAM AREA */}
      <div className="w-full h-[130px] md:h-[160px] bg-[var(--bg-gradient-1)] border border-[var(--border-color)] rounded-lg flex items-center justify-center overflow-hidden relative">
        {concept.renderSvg(inView)}
      </div>

      {/* KEY FACTS */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-color)]/40 mt-auto">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: concept.color }} />
          <span className="text-[10px] font-sans uppercase tracking-[0.08em] text-[var(--muted-color)] font-semibold">
            KEY FACTS
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {concept.facts.map((fact, fIdx) => (
            <div key={fIdx} className="flex items-start gap-2">
              <span className="text-[12px] font-sans leading-none shrink-0" style={{ color: concept.color }}>
                ›
              </span>
              <p className="text-[12px] font-sans text-[var(--muted-color)] leading-relaxed">
                {fact}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

interface AlgorithmCardProps {
  algo: AlgorithmCardData;
  delay: number;
  onClick: () => void;
}

function AlgorithmCard({ algo, delay, onClick }: AlgorithmCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[14px] p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 ease-out hover:border-[#3b82f6]/60 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:transition-[transform] active:duration-[80ms] relative overflow-hidden group animate-fadeInUp opacity-0"
      style={{ animationDelay: `${Math.min(delay, 800)}ms` }}
    >
      {/* Subtle top-left corner radial gradient overlay */}
      <div 
        className="absolute top-0 left-0 w-[120px] h-[120px] pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" 
        style={{ background: `radial-gradient(circle at top left, ${algo.color}0f, transparent 75%)` }}
      />

      {/* Card Header row */}
      <div className="flex items-start justify-between z-10">
        <div className="flex flex-col">
          {/* Icon */}
          <div 
            className="w-8 h-8 flex items-center justify-center rounded-lg border text-[18px] select-none"
            style={{
              backgroundColor: `${algo.color}1f`,
              borderColor: `${algo.color}4d`
            }}
          >
            {algo.icon}
          </div>
          {/* Name */}
          <h4 className="text-[14px] font-semibold font-sans text-[var(--text-color)] mt-2.5">
            {algo.name}
          </h4>
        </div>

        {/* Complexity badges column */}
        <div className="flex flex-col gap-1 items-end shrink-0">
          {/* Time Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#FFB800]/30 bg-[#FFB800]/10 text-xs font-mono">
            <span className="text-[8px] text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans font-semibold">Time</span>
            <span className="text-[11px] font-mono text-[#FFB800] font-medium">{algo.timeComplexity}</span>
          </div>
          {/* Space Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#A855F7]/30 bg-[#A855F7]/10 text-xs font-mono">
            <span className="text-[8px] text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans font-semibold">Space</span>
            <span className="text-[11px] font-mono text-[#A855F7] font-medium">{algo.spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* Card Description */}
      <p className="text-[12px] font-sans text-[var(--muted-color)] leading-[1.6] flex-grow z-10">
        {algo.description}
      </p>

      {/* Card Footer row */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-color)] z-10">
        <span className="text-[9px] font-semibold font-sans uppercase tracking-[0.06em] bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full px-2 py-0.5 text-[var(--muted-color)]">
          {algo.category}
        </span>
        <span className="text-[12px] font-sans font-medium text-[#60a5fa] group-hover:underline">
          Visualize →
        </span>
      </div>
    </div>
  );
}

interface ProgramCardProps {
  prog: ProgramCardData;
  delay: number;
  onClick: () => void;
}

function ProgramCard({ prog, delay, onClick }: ProgramCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[14px] p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 ease-out hover:border-[#3b82f6]/60 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:transition-[transform] active:duration-[80ms] relative overflow-hidden group animate-fadeInUp opacity-0"
      style={{ animationDelay: `${Math.min(delay, 1600)}ms` }}
    >
      {/* Subtle top-left corner radial gradient overlay */}
      <div 
        className="absolute top-0 left-0 w-[120px] h-[120px] pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" 
        style={{ background: `radial-gradient(circle at top left, ${prog.color}0f, transparent 75%)` }}
      />

      {/* Extra Badge (top-right variant pill) */}
      <div className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-[0.06em] border px-2 py-0.5 rounded-full ${prog.extraBadge.colorClass} z-20`}>
        {prog.extraBadge.text}
      </div>

      {/* Card Header row */}
      <div className="flex items-start justify-between z-10">
        <div className="flex flex-col">
          {/* Icon */}
          <div 
            className="w-8 h-8 flex items-center justify-center rounded-lg border text-[18px] select-none"
            style={{
              backgroundColor: `${prog.color}1f`,
              borderColor: `${prog.color}4d`
            }}
          >
            {prog.icon}
          </div>
          {/* Name */}
          <h4 className="text-[14px] font-semibold font-sans text-[var(--text-color)] mt-2.5">
            {prog.name}
          </h4>
        </div>

        {/* Complexity badges column (placed lower to avoid overlap with absolute badge) */}
        <div className="flex flex-col gap-1 items-end shrink-0 mt-6">
          {/* Time Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#FFB800]/30 bg-[#FFB800]/10 text-xs font-mono">
            <span className="text-[8px] text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans font-semibold">Time</span>
            <span className="text-[11px] font-mono text-[#FFB800] font-medium">{prog.timeComplexity}</span>
          </div>
          {/* Space Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#A855F7]/30 bg-[#A855F7]/10 text-xs font-mono">
            <span className="text-[8px] text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans font-semibold">Space</span>
            <span className="text-[11px] font-mono text-[#A855F7] font-medium">{prog.spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* Card Description */}
      <p className="text-[12px] font-sans text-[var(--muted-color)] leading-[1.6] flex-grow z-10">
        {prog.description}
      </p>

      {/* Card Footer row */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-color)] z-10">
        <div className="flex gap-1.5 flex-wrap">
          {prog.tags.map(tag => (
            <span key={tag} className="text-[9px] font-semibold font-sans uppercase tracking-[0.06em] bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full px-2 py-0.5 text-[var(--muted-color)]">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[12px] font-sans font-medium text-[#60a5fa] group-hover:underline shrink-0">
          Visualize →
        </span>
      </div>
    </div>
  );
}
