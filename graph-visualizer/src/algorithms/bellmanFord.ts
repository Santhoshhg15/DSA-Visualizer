import type { Node, Edge, Step } from '../stores/useGraphStore';

export function generateBellmanFordSteps(nodes: Node[], edges: Edge[], startNodeId: string, directed: boolean): { steps: Step[], stats: any } {
  const steps: Step[] = [];
  let stepId = 0;
  
  const INF = 1e8;
  
  // Build a flat list of all directed edges for the algorithm
  const allEdges: { id: string, source: string, target: string, weight: number }[] = [];
  edges.forEach(e => {
    allEdges.push({ id: e.id, source: e.source, target: e.target, weight: e.weight || 0 });
    if (!directed) {
      allEdges.push({ id: e.id, source: e.target, target: e.source, weight: e.weight || 0 });
    }
  });

  const distTable: Record<string, { distance: number, previous: string | null }> = {};
  nodes.forEach(n => distTable[n.id] = { distance: INF, previous: null });
  distTable[startNodeId].distance = 0;

  let currentPass = 0;
  let cycleDetected = false;

  const getAuxState = () => {
    const t: any = {};
    const visited: string[] = [];
    for (const k in distTable) {
      t[k] = { ...distTable[k] };
      if (distTable[k].distance !== INF) visited.push(k);
    }
    return { 
      distanceTable: t,
      passNumber: currentPass,
      totalPasses: nodes.length - 1,
      visitedOrder: visited,
      hasNegativeCycle: cycleDetected
    };
  };

  const addStep = (desc: string, codeLine: number, hNodes: string[] = [], hEdges: string[] = [], activeEdge?: { source: string, target: string }, pNodes: string[] = [], pEdges: string[] = []) => {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [...hNodes],
      highlightEdges: [...hEdges],
      pathNodes: [...pNodes],
      pathEdges: [...pEdges],
      description: desc,
      codeLineActive: codeLine,
      adjacencySnapshot: {},
      auxiliaryState: getAuxState(),
      queueSnapshot: activeEdge ? [{ src: activeEdge.source, dest: activeEdge.target }] : []
    });
  };

  addStep(`Initializing Bellman-Ford. Creating distance array and setting all distances to 1e8.`, 3);
  addStep(`Set source node ${startNodeId} distance to 0.`, 5, [startNodeId]);

  const V = nodes.length;
  let anyUpdate = false;

  // Run V - 1 relaxation passes
  for (let i = 0; i < V - 1; i++) {
    currentPass = i + 1;
    addStep(`--- Starting Pass ${currentPass} of ${V - 1} ---`, 7);
    anyUpdate = false;

    for (const edge of allEdges) {
      addStep(`Attempting to relax edge ${edge.source} → ${edge.target} (weight: ${edge.weight})`, 8, [edge.source, edge.target], [edge.id], edge);
      
      if (distTable[edge.source].distance !== INF) {
        const newDist = distTable[edge.source].distance + edge.weight;
        
        addStep(`Checking condition: dist[${edge.source}] (${distTable[edge.source].distance}) + weight (${edge.weight}) < dist[${edge.target}] (${distTable[edge.target].distance === INF ? '1e8' : distTable[edge.target].distance})`, 12, [edge.source, edge.target], [edge.id], edge);

        if (newDist < distTable[edge.target].distance) {
          distTable[edge.target].distance = newDist;
          distTable[edge.target].previous = edge.source;
          anyUpdate = true;
          addStep(`Distance improved! Updating dist[${edge.target}] to ${newDist}.`, 13, [edge.source, edge.target], [edge.id], edge);
        } else {
          addStep(`No improvement. Existing distance dist[${edge.target}] is shorter or equal.`, 12, [edge.source, edge.target], [edge.id], edge);
        }
      } else {
        addStep(`Source node dist[${edge.source}] is 1e8 (Infinity). Cannot relax.`, 12, [edge.source, edge.target], [edge.id], edge);
      }
    }

    if (!anyUpdate) {
      addStep(`No updates occurred in Pass ${currentPass}. Early termination possible!`, 16);
      break;
    }
  }

  // Pass V: Check for negative weight cycles
  currentPass = V;
  addStep(`--- Starting Pass ${V} (Checking for negative weight cycles) ---`, 17);
  
  let cycleNodes: string[] = [];
  let cycleEdges: string[] = [];

  for (const edge of allEdges) {
    if (distTable[edge.source].distance !== INF) {
      const newDist = distTable[edge.source].distance + edge.weight;
      
      addStep(`Checking negative cycle on edge ${edge.source} → ${edge.target}: dist[${edge.source}] (${distTable[edge.source].distance}) + wt (${edge.weight}) < dist[${edge.target}] (${distTable[edge.target].distance})`, 22, [edge.source, edge.target], [edge.id], edge);

      if (newDist < distTable[edge.target].distance) {
        cycleDetected = true;
        
        // Trace back the negative cycle using previous pointers starting from edge.source
        const traceNodes: string[] = [];
        const visitedInTrace = new Set<string>();
        let currNode: string | null = edge.source;
        
        while (currNode !== null && !visitedInTrace.has(currNode)) {
          visitedInTrace.add(currNode);
          traceNodes.push(currNode);
          currNode = distTable[currNode].previous;
        }
        
        if (currNode !== null) {
          const idx = traceNodes.indexOf(currNode);
          cycleNodes = traceNodes.slice(idx);
        } else {
          cycleNodes = traceNodes;
        }

        // Construct cycle edges
        for (let j = 0; j < cycleNodes.length; j++) {
          const u = cycleNodes[j];
          const v = cycleNodes[(j + 1) % cycleNodes.length];
          const matchingEdge = edges.find(e =>
            (e.source === u && e.target === v) ||
            (!directed && (e.source === v && e.target === u))
          );
          if (matchingEdge) {
            cycleEdges.push(matchingEdge.id);
          }
        }

        addStep(
          `Negative cycle detected! dist[${edge.source}] (${distTable[edge.source].distance}) + weight (${edge.weight}) < dist[${edge.target}] (${distTable[edge.target].distance}). Returning [-1].`,
          25,
          [edge.source, edge.target],
          [edge.id],
          edge,
          [...cycleNodes],
          [...cycleEdges]
        );
        break; 
      }
    }
  }

  if (!cycleDetected) {
    addStep(`No negative cycles detected. Bellman-Ford algorithm complete.`, 28);
  }

  const stats = {
    operation: 'Bellman-Ford',
    timeComplexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: cycleDetected ? `[-1] (Negative Cycle)` : `Shortest Paths Found`,
    extra: [
      { label: 'Source Node', value: startNodeId },
      { label: 'Negative Cycle', value: cycleDetected ? 'Yes' : 'No' }
    ]
  };

  return { steps, stats };
}
