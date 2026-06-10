import type { Node, Edge, Step } from '../stores/useGraphStore';

export function generateDijkstraSteps(nodes: Node[], edges: Edge[], startNodeId: string, directed: boolean): { steps: Step[], stats: any } {
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

  const distTable: Record<string, { distance: number, previous: string | null }> = {};
  nodes.forEach(n => distTable[n.id] = { distance: Infinity, previous: null });
  distTable[startNodeId].distance = 0;

  // Simple Priority Queue implementation
  const pq: { id: string, dist: number }[] = [];
  pq.push({ id: startNodeId, dist: 0 });

  const visited = new Set<string>();

  const getAuxState = () => {
    // deep copy distTable
    const t: any = {};
    for (const k in distTable) {
      t[k] = { ...distTable[k] };
    }
    return { distanceTable: t };
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

  addStep(`Initializing Dijkstra's algorithm. All distances set to Infinity.`, 5);
  addStep(`Set distance of source node ${startNodeId} to 0.`, 6, [startNodeId]);
  addStep(`Add ${startNodeId} to priority queue.`, 7, [startNodeId]);

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const curr = pq.shift()!;
    
    addStep(`Dequeue node ${curr.id} with minimum distance ${curr.dist}`, 9, [curr.id]);

    if (visited.has(curr.id)) continue;
    visited.add(curr.id);

    const neighbors = adj[curr.id] || [];
    addStep(`Iterating through ${neighbors.length} neighbors of ${curr.id}`, 10, [curr.id]);

    for (const edge of neighbors) {
      const neighbor = edge.target;
      const weight = edge.weight !== undefined ? edge.weight : 1; // Default to 1 if unweighted preset used
      
      addStep(`Checking edge ${curr.id} → ${neighbor} (weight: ${weight})`, 10, [curr.id, neighbor], [edge.id]);
      
      if (visited.has(neighbor)) {
        addStep(`Neighbor ${neighbor} is already finalized. Skipping.`, 10, [curr.id, neighbor], [edge.id]);
        continue;
      }

      const newDist = distTable[curr.id].distance + weight;
      addStep(`Calculated new distance to ${neighbor}: ${distTable[curr.id].distance} + ${weight} = ${newDist}`, 11, [curr.id, neighbor], [edge.id]);

      if (newDist < distTable[neighbor].distance) {
        distTable[neighbor].distance = newDist;
        distTable[neighbor].previous = curr.id;
        
        addStep(`Distance improved! Updating ${neighbor}'s distance to ${newDist}.`, 13, [curr.id, neighbor], [edge.id]);
        
        pq.push({ id: neighbor, dist: newDist });
        addStep(`Adding ${neighbor} to priority queue with distance ${newDist}.`, 14, [curr.id, neighbor], [edge.id]);
      } else {
        addStep(`Existing distance ${distTable[neighbor].distance} is shorter or equal. No update.`, 12, [curr.id, neighbor], [edge.id]);
      }
    }
  }

  addStep('Priority queue is empty. Dijkstra\'s algorithm complete.', 19);

  const stats = {
    operation: 'Dijkstra',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: `Shortest Paths Found`,
    extra: [
      { label: 'Source Node', value: startNodeId }
    ]
  };

  return { steps, stats };
}

export function generateShortestPathSteps(nodes: Node[], edges: Edge[], startNodeId: string, targetNodeId: string, directed: boolean): { steps: Step[], stats: any } {
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

  const distTable: Record<string, { distance: number, previous: string | null }> = {};
  nodes.forEach(n => distTable[n.id] = { distance: Infinity, previous: null });
  distTable[startNodeId].distance = 0;

  const pq: { id: string, dist: number }[] = [];
  pq.push({ id: startNodeId, dist: 0 });

  const visited = new Set<string>();

  const getAuxState = () => {
    const t: any = {};
    for (const k in distTable) {
      t[k] = { ...distTable[k] };
    }
    return { distanceTable: t };
  };

  const addStep = (desc: string, codeLine: number, hNodes: string[] = [], hEdges: string[] = [], pNodes: string[] = [], pEdges: string[] = []) => {
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
      auxiliaryState: getAuxState()
    });
  };

  addStep(`Initializing Shortest Path from ${startNodeId} to ${targetNodeId}.`, 5);
  addStep(`Set distance of source node ${startNodeId} to 0.`, 6, [startNodeId]);
  addStep(`Add ${startNodeId} to priority queue.`, 7, [startNodeId]);

  let found = false;

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const curr = pq.shift()!;
    
    addStep(`Dequeue node ${curr.id} with minimum distance ${curr.dist}`, 9, [curr.id]);

    if (curr.id === targetNodeId) {
      addStep(`Target node ${targetNodeId} reached! Stopping search.`, 10, [curr.id]);
      found = true;
      break;
    }

    if (visited.has(curr.id)) continue;
    visited.add(curr.id);

    const neighbors = adj[curr.id] || [];
    addStep(`Iterating through ${neighbors.length} neighbors of ${curr.id}`, 10, [curr.id]);

    for (const edge of neighbors) {
      const neighbor = edge.target;
      const weight = edge.weight !== undefined ? edge.weight : 1;
      
      addStep(`Checking edge ${curr.id} → ${neighbor} (weight: ${weight})`, 10, [curr.id, neighbor], [edge.id]);
      
      if (visited.has(neighbor)) {
        addStep(`Neighbor ${neighbor} is already finalized. Skipping.`, 10, [curr.id, neighbor], [edge.id]);
        continue;
      }

      const newDist = distTable[curr.id].distance + weight;
      addStep(`Calculated new distance to ${neighbor}: ${distTable[curr.id].distance} + ${weight} = ${newDist}`, 11, [curr.id, neighbor], [edge.id]);

      if (newDist < distTable[neighbor].distance) {
        distTable[neighbor].distance = newDist;
        distTable[neighbor].previous = curr.id;
        
        addStep(`Distance improved! Updating ${neighbor}'s distance to ${newDist}.`, 13, [curr.id, neighbor], [edge.id]);
        
        pq.push({ id: neighbor, dist: newDist });
        addStep(`Adding ${neighbor} to priority queue with distance ${newDist}.`, 14, [curr.id, neighbor], [edge.id]);
      } else {
        addStep(`Existing distance ${distTable[neighbor].distance} is shorter or equal. No update.`, 12, [curr.id, neighbor], [edge.id]);
      }
    }
  }

  let finalWeight = distTable[targetNodeId].distance;
  let resultMsg = "";
  
  if (!found || finalWeight === Infinity) {
    addStep(`No path found from ${startNodeId} to ${targetNodeId}.`, 19);
    resultMsg = "No Path Found";
  } else {
    // Reconstruct path
    const pNodes: string[] = [];
    const pEdges: string[] = [];
    let current = targetNodeId;
    while (current !== null) {
      pNodes.unshift(current);
      const prev = distTable[current].previous;
      if (prev) {
        // Find edge
        const edge = edges.find(e => 
          (e.source === prev && e.target === current) || 
          (!directed && e.source === current && e.target === prev)
        );
        if (edge) pEdges.unshift(edge.id);
      }
      current = prev!;
    }
    
    addStep(`Path found with total weight ${finalWeight}: ${pNodes.join(' → ')}`, 19, [], [], pNodes, pEdges);
    resultMsg = `Path Weight: ${finalWeight}`;
  }

  const stats = {
    operation: 'Shortest Path',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: resultMsg,
    extra: [
      { label: 'Source', value: startNodeId },
      { label: 'Destination', value: targetNodeId }
    ]
  };

  return { steps, stats };
}
