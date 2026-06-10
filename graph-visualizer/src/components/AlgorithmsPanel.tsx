import { useState, useEffect } from 'react';
import { useGraphStore } from '../stores/useGraphStore';
import { graphPresets } from '../data/graphPresets';

import { generateBfsSteps } from '../algorithms/bfs';
import { generateDfsSteps } from '../algorithms/dfs';
import { generateDijkstraSteps, generateShortestPathSteps } from '../algorithms/dijkstra';
import { generateBellmanFordSteps } from '../algorithms/bellmanFord';
import { generateFloydWarshallSteps } from '../algorithms/floydWarshall';
import { generateKruskalSteps } from '../algorithms/kruskal';
import { generatePrimSteps } from '../algorithms/prim';
import { generateTopologicalSortSteps } from '../algorithms/topologicalSort';

const algorithmCategories = [
  {
    name: 'Traversal',
    algorithms: [
      { id: 'bfs', name: 'BFS (Breadth-First Search)', preset: 'simple-undirected', requiresStartNode: true, desc: 'Explores the graph layer by layer using a Queue.' },
      { id: 'dfs', name: 'DFS (Depth-First Search)', preset: 'simple-directed', requiresStartNode: true, desc: 'Explores as far as possible along each branch before backtracking using a Stack.' }
    ]
  },
  {
    name: 'Shortest Path',
    algorithms: [
      { id: 'shortest-path', name: "Shortest Path (Src → Dest)", preset: 'weighted-undirected', requiresStartNode: true, requiresTargetNode: true, desc: 'Finds shortest path to a specific destination.' },
      { id: 'dijkstra', name: "Dijkstra's Algorithm", preset: 'weighted-undirected', requiresStartNode: true, desc: 'Finds the shortest path from a source to all nodes using a Priority Queue.' },
      { id: 'bellman-ford', name: 'Bellman-Ford', preset: 'weighted-directed', requiresStartNode: true, desc: 'Computes shortest paths, capable of handling and detecting negative weight cycles.' },
      { id: 'floyd-warshall', name: 'Floyd-Warshall', preset: 'dense-floyd', requiresStartNode: false, desc: 'Finds shortest paths between all pairs of vertices using dynamic programming.' }
    ]
  },
  {
    name: 'Minimum Spanning Tree',
    algorithms: [
      { id: 'kruskal', name: "Kruskal's MST", preset: 'weighted-undirected', requiresStartNode: false, desc: 'Builds MST by sorting edges and avoiding cycles using Union-Find.' },
      { id: 'prim', name: "Prim's MST", preset: 'weighted-undirected', requiresStartNode: true, desc: 'Builds MST by expanding from a start node using a Priority Queue.' }
    ]
  },
  {
    name: 'Ordering',
    algorithms: [
      { id: 'topological-sort', name: 'Topological Sort', preset: 'dag-topological', requiresStartNode: false, desc: 'Linearly orders vertices in a DAG such that for every directed edge u→v, u comes before v.' }
    ]
  }
];

export function AlgorithmsPanel() {
  const { nodes, edges, loadPreset, setSelectedAlgorithm, setSteps, graphType, cur, steps, setSpanningTreeMode, setSpanningTreePositions } = useGraphStore();
  
  // Local state for the selected algorithm card before running
  const [activeAlgo, setActiveAlgo] = useState<string | null>(null);
  const [startNode, setStartNode] = useState<string>('');
  const [targetNode, setTargetNode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync startNode and targetNode when nodes list changes
  useEffect(() => {
    if (nodes.length > 0) {
      const startStillExists = nodes.some(n => n.id === startNode);
      if (!startNode || !startStillExists) {
        setStartNode(nodes[0].id);
      }
      const targetStillExists = nodes.some(n => n.id === targetNode);
      if (!targetNode || !targetStillExists) {
        setTargetNode(nodes[nodes.length - 1].id);
      }
    } else {
      setStartNode('');
      setTargetNode('');
    }
  }, [nodes, startNode, targetNode]);

  const handleSelectAlgo = (algo: any) => {
    setActiveAlgo(algo.id);
    setSelectedAlgorithm(algo.id);
    setErrorMsg(null);
    
    // Auto load preset
    const presetData = graphPresets.find(p => p.id === algo.preset);
    if (presetData) {
      loadPreset(presetData.id, {
        nodes: presetData.nodes,
        edges: presetData.edges,
        directed: presetData.directed,
        weighted: presetData.weighted,
        positions: presetData.defaultPositions
      });
      if (presetData.nodes.length > 0) {
        setStartNode(presetData.nodes[0].id);
      }
    }
    
    // Reset spanning tree
    setSpanningTreeMode(false);
    setSpanningTreePositions(null);
  };

  const handleRunAlgorithm = () => {
    setErrorMsg(null);
    if (!activeAlgo) return;

    if (activeAlgo === 'topological-sort' && !graphType.directed) {
      setErrorMsg('Topological Sort requires a Directed Acyclic Graph (DAG).');
      return;
    }

    if (activeAlgo === 'dijkstra') {
      const hasNegativeWeight = edges.some(e => e.weight !== undefined && e.weight < 0);
      if (hasNegativeWeight) {
        setErrorMsg('Dijkstra requires non-negative weights. Switch to Bellman-Ford for negative weights.');
        return;
      }
    }

    // Call the corresponding algorithm step generator
    let generatedSteps: any[] = [];
    
    switch (activeAlgo) {
      case 'bfs':
        generatedSteps = generateBfsSteps(nodes, edges, startNode, graphType.directed).steps;
        useGraphStore.getState().setStats(generateBfsSteps(nodes, edges, startNode, graphType.directed).stats);
        break;
      case 'dfs':
        generatedSteps = generateDfsSteps(nodes, edges, startNode, graphType.directed).steps;
        useGraphStore.getState().setStats(generateDfsSteps(nodes, edges, startNode, graphType.directed).stats);
        break;
      case 'shortest-path':
        {
          const res = generateShortestPathSteps(nodes, edges, startNode, targetNode, graphType.directed);
          generatedSteps = res.steps;
          useGraphStore.getState().setStats(res.stats);
        }
        break;
      case 'dijkstra':
        generatedSteps = generateDijkstraSteps(nodes, edges, startNode, graphType.directed).steps;
        useGraphStore.getState().setStats(generateDijkstraSteps(nodes, edges, startNode, graphType.directed).stats);
        break;
      case 'bellman-ford':
        generatedSteps = generateBellmanFordSteps(nodes, edges, startNode, graphType.directed).steps;
        useGraphStore.getState().setStats(generateBellmanFordSteps(nodes, edges, startNode, graphType.directed).stats);
        break;
      case 'floyd-warshall':
        generatedSteps = generateFloydWarshallSteps(nodes, edges, graphType.directed).steps;
        useGraphStore.getState().setStats(generateFloydWarshallSteps(nodes, edges, graphType.directed).stats);
        break;
      case 'kruskal':
        generatedSteps = generateKruskalSteps(nodes, edges).steps;
        useGraphStore.getState().setStats(generateKruskalSteps(nodes, edges).stats);
        break;
      case 'prim':
        generatedSteps = generatePrimSteps(nodes, edges, startNode).steps;
        useGraphStore.getState().setStats(generatePrimSteps(nodes, edges, startNode).stats);
        break;
      case 'topological-sort':
        generatedSteps = generateTopologicalSortSteps(nodes, edges).steps;
        useGraphStore.getState().setStats(generateTopologicalSortSteps(nodes, edges).stats);
        break;
    }

    if (generatedSteps.length > 0) {
      setSteps(generatedSteps);
    } else {
      setErrorMsg('Algorithm implementation coming soon.');
    }
  };

  return (
    <div className="w-full flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
          <span className="text-blue-500">🧠</span> Algorithms
        </h2>
      </div>

      {!activeAlgo && (
        <p className="text-[13px] text-center text-[var(--muted-color)] mb-4 animate-fadeInUp">
          Select an algorithm below to configure
        </p>
      )}
      {algorithmCategories.map((category) => (
        <div key={category.name} className="space-y-3 mb-6">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
            {category.name}
          </h3>
          <div className="space-y-2">
            {category.algorithms.map((algo) => {
              const isSelected = activeAlgo === algo.id;
              return (
                <div key={algo.id} className="flex flex-col">
                  <button
                    onClick={() => handleSelectAlgo(algo)}
                    className={`w-full text-left px-3 py-2 rounded-[8px] border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                        : 'bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-color)] hover:border-blue-500/50'
                    }`}
                  >
                    <div className="text-[13px] font-semibold">{algo.name}</div>
                    {!isSelected && !activeAlgo && (
                      <div className="text-[11px] text-[var(--muted-color)] mt-1 truncate">
                        {algo.desc}
                      </div>
                    )}
                  </button>
                  
                  {isSelected && (
                    <div className="mt-2 p-3 bg-black/20 border border-[var(--border-color)] rounded-lg animate-fadeInUp">
                      <p className="text-xs text-[var(--muted-color)] mb-3 leading-relaxed">
                        {algo.desc}
                      </p>

                      <div className="flex gap-3">
                        {algo.requiresStartNode && (
                          <div className="flex-1 mt-3">
                            <label className="block text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">
                              Start Node
                            </label>
                            <select 
                              value={startNode} 
                              onChange={e => setStartNode(e.target.value)}
                              className="w-full h-[32px] bg-[var(--bg-gradient-1)] border border-[var(--border-color)] rounded-[6px] px-2 text-[12px] font-medium text-[var(--text-color)] outline-none focus:border-blue-500 transition-colors"
                            >
                              {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                            </select>
                          </div>
                        )}
                        {(algo as any).requiresTargetNode && (
                          <div className="flex-1 mt-3">
                            <label className="block text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">
                              Target Node
                            </label>
                            <select 
                              value={targetNode} 
                              onChange={e => setTargetNode(e.target.value)}
                              className="w-full h-[32px] bg-[var(--bg-gradient-1)] border border-[var(--border-color)] rounded-[6px] px-2 text-[12px] font-medium text-[var(--text-color)] outline-none focus:border-blue-500 transition-colors"
                            >
                              {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                            </select>
                          </div>
                        )}
                      </div>

                      {errorMsg && (
                        <div className="mt-3 mb-3 text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                          {errorMsg}
                        </div>
                      )}

                      <button
                        onClick={handleRunAlgorithm}
                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold h-[36px] rounded-[6px] transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                      >
                        <span className="text-[11px] font-medium tracking-[0.06em] uppercase">
                          {steps.length > 0 && cur === steps.length - 1 ? '↻ Run Again' : '▶ Run Algorithm'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
