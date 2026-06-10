import type { Node, Edge, Step } from '../stores/useGraphStore';

export function generateBfsSteps(nodes: Node[], edges: Edge[], startNodeId: string, directed: boolean): { steps: Step[], stats: any } {
  const steps: Step[] = [];
  let stepId = 0;
  
  // Build adjacency list for logic
  const adj: Record<string, Edge[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.source].push(e);
    if (!directed) {
      adj[e.target].push({ id: e.id, source: e.target, target: e.source, weight: e.weight });
    }
  });

  const queue: string[] = [];
  const visited = new Set<string>();
  const result: string[] = [];

  const addStep = (
    desc: string, 
    codeLine: number, 
    hNodes: string[] = [], 
    hEdges: string[] = []
  ) => {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [...hNodes],
      highlightEdges: [...hEdges],
      description: desc,
      codeLineActive: codeLine,
      adjacencySnapshot: {}, // not heavily used in algorithms unless requested
      auxiliaryState: {
        collection: [...queue],
        visitedOrder: [...result]
      }
    });
  };

  addStep(`Initializing BFS from node ${startNodeId}`, 1);
  
  queue.push(startNodeId);
  addStep(`Enqueue start node ${startNodeId}`, 4, [startNodeId]);
  
  visited.add(startNodeId);
  addStep(`Mark ${startNodeId} as visited`, 5, [startNodeId]);

  while (queue.length > 0) {
    addStep(`Checking if queue is empty (size = ${queue.length})`, 6);
    
    const node = queue.shift()!;
    addStep(`Dequeue node ${node}`, 7, [node]);
    
    result.push(node);
    addStep(`Add ${node} to traversal result`, 8, [node]);

    const neighbors = adj[node] || [];
    addStep(`Iterating through ${neighbors.length} neighbors of ${node}`, 9, [node]);

    for (const edge of neighbors) {
      addStep(`Checking neighbor ${edge.target} of ${node}`, 10, [node, edge.target], [edge.id]);
      
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        addStep(`Neighbor ${edge.target} is unvisited. Marking as visited.`, 11, [node, edge.target], [edge.id]);
        
        queue.push(edge.target);
        addStep(`Enqueue neighbor ${edge.target}`, 12, [node, edge.target], [edge.id]);
      } else {
        addStep(`Neighbor ${edge.target} is already visited. Skipping.`, 13, [node, edge.target], [edge.id]);
      }
    }
  }

  addStep('Queue is empty. BFS traversal complete.', 16);

  // If there are unvisited nodes (e.g. disconnected graph), we can count components
  let components = 1;
  for (const n of nodes) {
    if (!visited.has(n.id)) {
      components++;
      // We could optionally continue BFS for disconnected components here if requested,
      // but standard BFS from a source stops here. We will just report standard BFS.
    }
  }

  const stats = {
    operation: 'BFS',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: `Traversal Complete`,
    extra: [
      { label: 'Nodes Visited', value: `${visited.size} / ${nodes.length}` },
      { label: 'Components Found', value: components }
    ]
  };

  return { steps, stats };
}
