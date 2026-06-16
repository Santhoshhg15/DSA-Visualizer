import type { Node, Edge, Step } from '../stores/useGraphStore';

export function generatePrimSteps(nodes: Node[], edges: Edge[], startNodeId: string): { steps: Step[], stats: any } {
  const steps: Step[] = [];
  let stepId = 0;
  
  const adj: Record<string, { id: string, src: string, dest: string, w: number }[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    const w = e.weight !== undefined ? e.weight : 1;
    adj[e.source].push({ id: e.id, src: e.source, dest: e.target, w });
    // Prim's operates on undirected edges
    adj[e.target].push({ id: e.id, src: e.target, dest: e.source, w });
  });

  const vis: Record<string, number> = {};
  nodes.forEach(n => vis[n.id] = 0);
  
  const pq: { node: string, dist: number, parent: string | null }[] = [];
  const mstEdges: { id: string, src: string, dest: string, w: number }[] = [];
  const visitedOrder: string[] = [];
  let sum = 0;

  const getAuxState = () => {
    return {
      candidateEdges: [...pq].sort((a,b) => a.dist - b.dist).map(e => ({
        src: e.parent || '?',
        dest: e.node,
        w: e.dist
      })),
      mstCost: sum,
      visitedOrder: [...visitedOrder]
    };
  };

  const addStep = (desc: string, codeLine: number, hNodes: string[] = [], hEdges: string[] = []) => {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [...hNodes, ...visitedOrder], // keep MST nodes highlighted
      highlightEdges: [...hEdges, ...mstEdges.map(e => e.id)], // keep MST edges highlighted
      description: desc,
      codeLineActive: codeLine,
      adjacencySnapshot: {},
      auxiliaryState: getAuxState(),
      queueSnapshot: [...pq].sort((a,b) => a.dist - b.dist).map(e => ({ node: e.node, key: e.dist }))
    });
  };

  addStep(`Initializing Prim's Algorithm. Creating visited array and empty priority queue.`, 13);
  
  pq.push({ node: startNodeId, dist: 0, parent: null });
  addStep(`Adding start node Pair(0, ${startNodeId}) to Priority Queue.`, 14, [startNodeId]);

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const curr = pq.shift()!;
    
    // Highlight the polled node as active
    addStep(`Polling minimum weight pair from PQ: Pair(wt: ${curr.dist}, node: ${curr.node})`, 19, [curr.node]);

    if (vis[curr.node] === 1) {
      addStep(`Node ${curr.node} is already in MST (vis[${curr.node}] == 1). Skipping.`, 20, [curr.node]);
      continue;
    }

    vis[curr.node] = 1;
    sum += curr.dist;
    visitedOrder.push(curr.node);
    
    // Find the edge that connected curr.parent to curr.node, and add to MST edges
    let connectedEdge: any = null;
    if (curr.parent !== null) {
      connectedEdge = edges.find(e => 
        (e.source === curr.parent && e.target === curr.node) ||
        (e.source === curr.node && e.target === curr.parent)
      );
      if (connectedEdge) {
        mstEdges.push({
          id: connectedEdge.id,
          src: curr.parent,
          dest: curr.node,
          w: curr.dist
        });
      }
    }

    addStep(
      `Node ${curr.node} is not in MST. Adding to MST! vis[${curr.node}] = 1. Added weight ${curr.dist} to total. Sum = ${sum}`,
      21,
      [curr.node],
      connectedEdge ? [connectedEdge.id] : []
    );

    const neighbors = adj[curr.node] || [];
    for (const neighbor of neighbors) {
      addStep(`Checking neighbor edge ${curr.node} → ${neighbor.dest} (weight: ${neighbor.w})`, 23, [curr.node, neighbor.dest], [neighbor.id]);
      
      if (vis[neighbor.dest] === 0) {
        pq.push({ node: neighbor.dest, dist: neighbor.w, parent: curr.node });
        addStep(
          `Neighbor ${neighbor.dest} is not in MST (vis == 0). Adding Pair(wt: ${neighbor.w}, node: ${neighbor.dest}) to PQ.`,
          27,
          [curr.node, neighbor.dest],
          [neighbor.id]
        );
      } else {
        addStep(
          `Neighbor ${neighbor.dest} is already in MST (vis == 1). Skipping.`,
          26,
          [curr.node, neighbor.dest],
          [neighbor.id]
        );
      }
    }
  }

  addStep(`Priority Queue is empty. Prim's algorithm complete.`, 31);

  const stats = {
    operation: 'Prim',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: `MST Found (Cost: ${sum})`,
    extra: [
      { label: 'Start Node', value: startNodeId },
      { label: 'MST Cost', value: sum },
      { label: 'Nodes Added', value: `${visitedOrder.length} / ${nodes.length}` }
    ]
  };

  return { steps, stats };
}
