import type { Node, Edge, Step } from '../stores/useGraphStore';

export function generateBellmanFordSteps(nodes: Node[], edges: Edge[], startNodeId: string, directed: boolean): { steps: Step[], stats: any } {
  const steps: Step[] = [];
  let stepId = 0;
  
  // Actually, Bellman-Ford usually runs over all edges.
  // We'll build a flat list of all directed edges for the algorithm.
  const allEdges: { id: string, source: string, target: string, weight: number }[] = [];
  edges.forEach(e => {
    allEdges.push({ id: e.id, source: e.source, target: e.target, weight: e.weight || 0 });
    if (!directed) {
      allEdges.push({ id: e.id, source: e.target, target: e.source, weight: e.weight || 0 });
    }
  });

  const distTable: Record<string, { distance: number, previous: string | null }> = {};
  nodes.forEach(n => distTable[n.id] = { distance: Infinity, previous: null });
  distTable[startNodeId].distance = 0;

  let currentPass = 0;

  const getAuxState = () => {
    const t: any = {};
    for (const k in distTable) {
      t[k] = { ...distTable[k] };
    }
    return { 
      distanceTable: t,
      passNumber: currentPass,
      totalPasses: nodes.length - 1
    };
  };

  const addStep = (desc: string, codeLine: number, hNodes: string[] = [], hEdges: string[] = []) => {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [...hNodes],
      highlightEdges: [...hEdges],
      description: desc,
      codeLineActive: codeLine,
      adjacencySnapshot: {},
      auxiliaryState: getAuxState()
    });
  };

  addStep(`Initializing Bellman-Ford. Setting distances to Infinity.`, 3);
  addStep(`Set source node ${startNodeId} distance to 0.`, 4, [startNodeId]);

  const V = nodes.length;
  addStep(`V = ${V}. We will run V-1 = ${V - 1} relaxation passes.`, 5);

  let anyUpdate = false;

  for (let i = 1; i <= V - 1; i++) {
    currentPass = i;
    addStep(`--- Starting Pass ${i} of ${V - 1} ---`, 6);
    anyUpdate = false;

    for (const edge of allEdges) {
      addStep(`Attempting to relax edge ${edge.source} → ${edge.target} (weight: ${edge.weight})`, 10, [edge.source, edge.target], [edge.id]);
      
      if (distTable[edge.source].distance !== Infinity) {
        const newDist = distTable[edge.source].distance + edge.weight;
        
        if (newDist < distTable[edge.target].distance) {
          distTable[edge.target].distance = newDist;
          distTable[edge.target].previous = edge.source;
          anyUpdate = true;
          addStep(`Distance improved! Updating ${edge.target}'s distance to ${newDist}.`, 12, [edge.source, edge.target], [edge.id]);
        } else {
          addStep(`No improvement. Existing distance ${distTable[edge.target].distance} is shorter or equal.`, 10, [edge.source, edge.target], [edge.id]);
        }
      } else {
        addStep(`Source node ${edge.source} distance is Infinity. Cannot relax.`, 9, [edge.source, edge.target], [edge.id]);
      }
    }

    if (!anyUpdate) {
      addStep(`No updates occurred in Pass ${i}. We can terminate early!`, 17);
      break;
    }
  }

  // Check for negative cycles
  let cycleDetected = false;
  currentPass = V; // representing the negative cycle check pass
  addStep(`--- Pass ${V}: Checking for negative weight cycles ---`, 18);
  
  for (const edge of allEdges) {
    if (distTable[edge.source].distance !== Infinity) {
      const newDist = distTable[edge.source].distance + edge.weight;
      if (newDist < distTable[edge.target].distance) {
        cycleDetected = true;
        addStep(`Negative cycle detected via edge ${edge.source} → ${edge.target}!`, 22, [edge.source, edge.target], [edge.id]);
        break; // Stop at first negative cycle for visualizer simplicity
      }
    }
  }

  if (!cycleDetected) {
    addStep(`No negative cycles detected. Bellman-Ford algorithm complete.`, 23);
  }

  const stats = {
    operation: 'Bellman-Ford',
    timeComplexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: cycleDetected ? `Negative Cycle Detected` : `Shortest Paths Found`,
    extra: [
      { label: 'Passes Completed', value: currentPass },
      { label: 'Negative Cycle', value: cycleDetected ? 'Yes' : 'No' }
    ]
  };

  return { steps, stats };
}
