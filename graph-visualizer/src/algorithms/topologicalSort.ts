import type { Node, Edge, Step } from '../stores/useGraphStore';

export function generateTopologicalSortSteps(nodes: Node[], edges: Edge[]): { steps: Step[], stats: any } {
  const steps: Step[] = [];
  let stepId = 0;
  
  // Build adjacency list for logic
  const adj: Record<string, Edge[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.source].push(e);
  });

  const inDeg: Record<string, number> = {};
  nodes.forEach(n => inDeg[n.id] = 0);

  const queue: string[] = [];
  const result: string[] = [];

  const getAuxState = () => {
    return {
      queue: [...queue],
      inDegreeTable: { ...inDeg },
      visitedOrder: [...result]
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
      auxiliaryState: getAuxState(),
      queueSnapshot: [...queue]
    });
  };

  addStep(`Initializing Topological Sort. Setting in-degree of all nodes to 0.`, 3);

  // Compute in-degree
  edges.forEach(e => {
    inDeg[e.target]++;
  });
  
  addStep(`Computed in-degrees for all nodes by scanning directed edges.`, 6);

  // Find initial 0 in-degree nodes
  nodes.forEach(n => {
    if (inDeg[n.id] === 0) {
      queue.push(n.id);
    }
  });

  addStep(`Enqueued all nodes with an initial in-degree of 0: [${queue.join(', ')}]`, 9);

  while (queue.length > 0) {
    const node = queue.shift()!;
    addStep(`Dequeue node ${node}`, 12, [node]);

    result.push(node);
    addStep(`Add ${node} to sorted order`, 13, [node]);

    const neighbors = adj[node] || [];
    if (neighbors.length > 0) {
      addStep(`Iterating through ${neighbors.length} outgoing edges from ${node}`, 14, [node]);
    }

    for (const edge of neighbors) {
      inDeg[edge.target]--;
      addStep(`Decremented in-degree of neighbor ${edge.target} to ${inDeg[edge.target]}`, 15, [node, edge.target], [edge.id]);

      if (inDeg[edge.target] === 0) {
        queue.push(edge.target);
        addStep(`In-degree of ${edge.target} is now 0. Enqueueing ${edge.target}`, 17, [node, edge.target], [edge.id]);
      }
    }
  }

  let cycleDetected = false;
  if (result.length !== nodes.length) {
    cycleDetected = true;
    addStep(`Queue empty, but only processed ${result.length}/${nodes.length} nodes. Cycle detected! Not a DAG.`, 21);
  } else {
    addStep(`Successfully processed all nodes. Topological order complete.`, 22);
  }

  const stats = {
    operation: 'Topological Sort',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: cycleDetected ? `Cycle Detected (Failed)` : `Sorted Successfully`,
    extra: [
      { label: 'Nodes Processed', value: `${result.length} / ${nodes.length}` },
      { label: 'Cycle Detected', value: cycleDetected ? 'Yes' : 'No' }
    ]
  };

  return { steps, stats };
}
