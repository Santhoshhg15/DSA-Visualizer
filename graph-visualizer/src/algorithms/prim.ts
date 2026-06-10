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

  const inMST = new Set<string>();
  const pq: { id: string, src: string, dest: string, w: number }[] = [];
  const mstEdges: typeof pq = [];
  let mstCost = 0;

  const getAuxState = () => {
    return {
      candidateEdges: [...pq].sort((a,b) => a.w - b.w),
      mstCost
    };
  };

  const addStep = (desc: string, codeLine: number, hNodes: string[] = [], hEdges: string[] = []) => {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [...hNodes, ...Array.from(inMST)], // keep MST nodes highlighted
      highlightEdges: [...hEdges, ...mstEdges.map(e => e.id)], // keep MST edges highlighted
      description: desc,
      codeLineActive: codeLine,
      adjacencySnapshot: {},
      auxiliaryState: getAuxState()
    });
  };

  addStep(`Initializing Prim's Algorithm.`, 1);
  
  inMST.add(startNodeId);
  addStep(`Adding start node ${startNodeId} to MST.`, 4, [startNodeId]);

  pq.push(...(adj[startNodeId] || []));
  addStep(`Adding ${adj[startNodeId]?.length || 0} candidate edges from ${startNodeId} to Priority Queue.`, 5);

  while (pq.length > 0) {
    pq.sort((a, b) => a.w - b.w);
    const currEdge = pq.shift()!;
    
    addStep(`Polling minimum edge ${currEdge.src} → ${currEdge.dest} (weight: ${currEdge.w}) from PQ`, 8, [currEdge.src, currEdge.dest], [currEdge.id]);

    if (inMST.has(currEdge.dest)) {
      addStep(`Node ${currEdge.dest} is already in MST. Skipping edge.`, 9, [currEdge.src, currEdge.dest], [currEdge.id]);
      continue;
    }

    inMST.add(currEdge.dest);
    mstEdges.push(currEdge);
    mstCost += currEdge.w;
    
    addStep(`Node ${currEdge.dest} is not in MST. Adding to MST! New Cost: ${mstCost}`, 11, [currEdge.dest], [currEdge.id]);

    const newCandidates = adj[currEdge.dest] || [];
    let addedCount = 0;
    for (const next of newCandidates) {
      if (!inMST.has(next.dest)) {
        pq.push(next);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      addStep(`Added ${addedCount} new candidate edges from ${currEdge.dest} to PQ.`, 14, [currEdge.dest]);
    }
  }

  addStep('Priority Queue is empty. Prim\'s algorithm complete.', 16);

  const stats = {
    operation: 'Prim',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: `MST Found (Cost: ${mstCost})`,
    extra: [
      { label: 'Start Node', value: startNodeId },
      { label: 'MST Cost', value: mstCost },
      { label: 'Nodes Added', value: `${inMST.size} / ${nodes.length}` }
    ]
  };

  return { steps, stats };
}
