import type { Node, Edge, Step } from '../stores/useGraphStore';

export function generateDfsSteps(nodes: Node[], edges: Edge[], startNodeId: string, directed: boolean): { steps: Step[], stats: any } {
  const steps: Step[] = [];
  let stepId = 0;
  
  const adj: Record<string, Edge[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.source].push(e);
    if (!directed) {
      adj[e.target].push({ id: e.id, source: e.target, target: e.source, weight: e.weight });
    }
  });

  const stack: string[] = []; // Used just for display in DFS recursive
  const visited = new Set<string>();
  const result: string[] = [];
  let maxDepth = 0;

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
      adjacencySnapshot: {},
      auxiliaryState: {
        collection: [...stack],
        visitedOrder: [...result]
      }
    });
  };

  const dfs = (nodeId: string, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);
    stack.push(nodeId);
    
    addStep(`Visiting node ${nodeId} at depth ${depth}`, 1, [nodeId]);
    
    visited.add(nodeId);
    addStep(`Marking ${nodeId} as visited`, 4, [nodeId]);
    
    result.push(nodeId);
    addStep(`Adding ${nodeId} to traversal result`, 5, [nodeId]);

    const neighbors = adj[nodeId] || [];
    addStep(`Iterating through ${neighbors.length} neighbors of ${nodeId}`, 6, [nodeId]);

    for (const edge of neighbors) {
      addStep(`Checking neighbor ${edge.target} of ${nodeId}`, 7, [nodeId, edge.target], [edge.id]);
      
      if (!visited.has(edge.target)) {
        addStep(`Neighbor ${edge.target} is unvisited. Recursively calling DFS.`, 8, [nodeId, edge.target], [edge.id]);
        dfs(edge.target, depth + 1);
        addStep(`Backtracking to node ${nodeId}`, 9, [nodeId]);
      } else {
        addStep(`Neighbor ${edge.target} is already visited. Skipping.`, 9, [nodeId, edge.target], [edge.id]);
      }
    }
    
    addStep(`Finished exploring all neighbors of ${nodeId}`, 10, [nodeId]);
    stack.pop();
  };

  dfs(startNodeId, 1);

  addStep('DFS traversal complete.', 11);

  const stats = {
    operation: 'DFS',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: `Traversal Complete`,
    extra: [
      { label: 'Nodes Visited', value: `${visited.size} / ${nodes.length}` },
      { label: 'Max Recursion Depth', value: maxDepth }
    ]
  };

  return { steps, stats };
}
