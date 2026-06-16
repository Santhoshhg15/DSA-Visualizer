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
  const finalizedNodes: string[] = [];

  const getAuxState = () => {
    // deep copy distTable
    const t: any = {};
    for (const k in distTable) {
      t[k] = { ...distTable[k] };
    }
    return { 
      distanceTable: t,
      visitedOrder: [...finalizedNodes]
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
      queueSnapshot: pq.map(item => ({ node: item.id, dist: item.dist }))
    });
  };

  addStep(`Initializing Dijkstra's algorithm. All distances set to Infinity.`, 12);
  addStep(`Set distance of source node ${startNodeId} to 0.`, 17, [startNodeId]);
  addStep(`Add ${startNodeId} to priority queue.`, 19, [startNodeId]);

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const curr = pq.shift()!;
    
    addStep(`Dequeue node ${curr.id} with minimum distance ${curr.dist}`, 22, [curr.id]);

    if (visited.has(curr.id)) continue;
    visited.add(curr.id);
    finalizedNodes.push(curr.id);

    const neighbors = adj[curr.id] || [];
    addStep(`Iterating through ${neighbors.length} neighbors of ${curr.id}`, 26, [curr.id]);

    for (const edge of neighbors) {
      const neighbor = edge.target;
      const weight = edge.weight !== undefined ? edge.weight : 1; // Default to 1 if unweighted preset used
      
      addStep(`Checking edge ${curr.id} → ${neighbor} (weight: ${weight})`, 32, [curr.id, neighbor], [edge.id]);
      
      if (visited.has(neighbor)) {
        addStep(`Neighbor ${neighbor} is already finalized. Skipping.`, 32, [curr.id, neighbor], [edge.id]);
        continue;
      }

      const newDist = distTable[curr.id].distance + weight;
      addStep(`Calculated new distance to ${neighbor}: ${distTable[curr.id].distance} + ${weight} = ${newDist}`, 35, [curr.id, neighbor], [edge.id]);

      if (newDist < distTable[neighbor].distance) {
        distTable[neighbor].distance = newDist;
        distTable[neighbor].previous = curr.id;
        
        addStep(`Distance improved! Updating ${neighbor}'s distance to ${newDist}.`, 37, [curr.id, neighbor], [edge.id]);
        
        pq.push({ id: neighbor, dist: newDist });
        addStep(`Adding ${neighbor} to priority queue with distance ${newDist}.`, 40, [curr.id, neighbor], [edge.id]);
      } else {
        addStep(`Existing distance ${distTable[neighbor].distance} is shorter or equal. No update.`, 35, [curr.id, neighbor], [edge.id]);
      }
    }
  }

  addStep('Priority queue is empty. Dijkstra\'s algorithm complete.', 45);

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
  
  const INF = 1e9;

  const adj: Record<string, Edge[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.source].push(e);
    if (!directed) {
      adj[e.target].push({ id: e.id, source: e.target, target: e.source, weight: e.weight });
    }
  });

  const distTable: Record<string, { distance: number, previous: string | null }> = {};
  nodes.forEach(n => distTable[n.id] = { distance: INF, previous: n.id });
  distTable[startNodeId].distance = 0;

  const pq: { id: string, dist: number }[] = [];
  pq.push({ id: startNodeId, dist: 0 });

  const visited = new Set<string>();
  const finalizedNodes: string[] = [];

  const getAuxState = () => {
    const t: any = {};
    for (const k in distTable) {
      t[k] = { ...distTable[k] };
    }
    return { 
      distanceTable: t,
      visitedOrder: [...finalizedNodes]
    };
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
      auxiliaryState: getAuxState(),
      queueSnapshot: pq.map(item => ({ node: item.id, dist: item.dist }))
    });
  };

  addStep(`Initializing distances to 1e9. Initializing parent array such that each node's parent points to itself.`, 15);
  addStep(`Set distance of source node ${startNodeId} to 0.`, 16, [startNodeId]);
  addStep(`Adding source node Pair(0, ${startNodeId}) to priority queue.`, 18, [startNodeId]);

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const curr = pq.shift()!;
    
    addStep(`Dequeue node ${curr.id} with minimum distance ${curr.dist === INF ? '1e9' : curr.dist}`, 22, [curr.id]);

    if (curr.id === targetNodeId) {
      addStep(`Target node ${targetNodeId} reached! Stopping search.`, 22, [curr.id]);
      break;
    }

    if (visited.has(curr.id)) continue;
    visited.add(curr.id);
    finalizedNodes.push(curr.id);

    const neighbors = adj[curr.id] || [];
    addStep(`Iterating through ${neighbors.length} neighbors of ${curr.id}`, 23, [curr.id]);

    for (const edge of neighbors) {
      const neighbor = edge.target;
      const weight = edge.weight !== undefined ? edge.weight : 1;
      
      addStep(`Checking neighbor edge ${curr.id} → ${neighbor} (weight: ${weight})`, 25, [curr.id, neighbor], [edge.id]);
      
      if (visited.has(neighbor)) {
        addStep(`Neighbor ${neighbor} is already finalized. Skipping.`, 25, [curr.id, neighbor], [edge.id]);
        continue;
      }

      const newDist = distTable[curr.id].distance + weight;
      addStep(`Calculating relaxation: dist[${curr.id}] (${distTable[curr.id].distance}) + weight (${weight}) = ${newDist}`, 26, [curr.id, neighbor], [edge.id]);

      if (newDist < distTable[neighbor].distance) {
        distTable[neighbor].distance = newDist;
        distTable[neighbor].previous = curr.id;
        
        addStep(`Distance improved! Updating dist[${neighbor}] to ${newDist} and parent to ${curr.id}.`, 29, [curr.id, neighbor], [edge.id]);
        
        pq.push({ id: neighbor, dist: newDist });
        addStep(`Adding Pair(wt: ${newDist}, node: ${neighbor}) to priority queue.`, 28, [curr.id, neighbor], [edge.id]);
      } else {
        addStep(`No update. Existing distance dist[${neighbor}] (${distTable[neighbor].distance === INF ? '1e9' : distTable[neighbor].distance}) is shorter or equal.`, 26, [curr.id, neighbor], [edge.id]);
      }
    }
  }

  let finalWeight = distTable[targetNodeId].distance;
  let resultMsg = "";
  
  if (finalWeight === INF) {
    addStep(`No path found from ${startNodeId} to ${targetNodeId}. Destination is unreachable.`, 36);
    resultMsg = "No Path Found";
  } else {
    // Reconstruct path with backtracking steps
    const pathNodesList: string[] = [];
    const pathEdgesList: string[] = [];
    let currNode = targetNodeId;
    
    while (distTable[currNode].previous !== currNode) {
      pathNodesList.unshift(currNode);
      const prev = distTable[currNode].previous!;
      // Find edge
      const edge = edges.find(e => 
        (e.source === prev && e.target === currNode) || 
        (!directed && e.source === currNode && e.target === prev)
      );
      if (edge) {
        pathEdgesList.unshift(edge.id);
      }
      
      addStep(
        `Backtracking: From node ${currNode} to its parent ${prev}.`,
        41,
        [currNode, prev],
        edge ? [edge.id] : [],
        [...pathNodesList],
        [...pathEdgesList]
      );
      
      currNode = prev;
    }
    
    // Add source node
    pathNodesList.unshift(startNodeId);
    
    addStep(
      `Path reconstructed successfully: ${pathNodesList.join(' → ')} with total cost ${finalWeight}.`,
      45,
      [],
      [],
      [...pathNodesList],
      [...pathEdgesList]
    );
    
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

export function generateDijkstraSetSteps(
  nodes: Node[],
  edges: Edge[],
  startNodeId: string,
  directed: boolean
): { steps: Step[], stats: any } {
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

  const distTable: Record<string, { distance: number, previous: string | null }> = {};
  nodes.forEach(n => distTable[n.id] = { distance: Infinity, previous: null });

  // simulated TreeSet: unique items sorted by distance then node ID
  let treeset: { node: string, dist: number }[] = [];
  const finalizedNodes: string[] = [];

  const sortSet = (arr: typeof treeset) => {
    arr.sort((a, b) => {
      if (a.dist === b.dist) {
        return a.node.localeCompare(b.node);
      }
      return a.dist - b.dist;
    });
  };

  const getAuxState = () => {
    const t: any = {};
    for (const k in distTable) {
      t[k] = { ...distTable[k] };
    }
    return {
      distanceTable: t,
      visitedOrder: [...finalizedNodes]
    };
  };

  const addStep = (
    type: string,
    currentNode: string | null,
    desc: string,
    codeLine: number,
    hNodes: string[] = [],
    hEdges: string[] = []
  ) => {
    steps.push({
      id: stepId++,
      type: type as any,
      currentNode: currentNode || undefined,
      highlightNodes: [...hNodes],
      highlightEdges: [...hEdges],
      description: desc,
      codeLineActive: codeLine,
      adjacencySnapshot: {},
      auxiliaryState: getAuxState(),
      queueSnapshot: treeset.map(item => ({ node: item.node, dist: item.dist })) // already sorted
    });
  };

  // 17: int[] dist = new int[V];
  addStep('init', null, `Initializing distance array. dist[] created.`, 17);

  // 18: Arrays.fill(dist, (int)1e9);
  addStep('init', null, `All initial distances set to Infinity.`, 18);

  // 19: dist[S] = 0;
  distTable[startNodeId].distance = 0;
  addStep('init', startNodeId, `Set distance of source node ${startNodeId} to 0.`, 19, [startNodeId]);

  // 20: set.add(new Pair(0, S));
  treeset.push({ node: startNodeId, dist: 0 });
  sortSet(treeset);
  addStep('init', startNodeId, `Inserted source entry (0, ${startNodeId}) into TreeSet.`, 20, [startNodeId]);

  while (treeset.length > 0) {
    // 21: while(!set.isEmpty())
    addStep('while', null, `Checking if TreeSet is empty (size = ${treeset.length})`, 21);

    // 22: Pair current = set.first();
    const curr = treeset[0];
    addStep('set-first', curr.node, `[${curr.node}] SET.FIRST(): minimum entry = (${curr.dist}, ${curr.node})`, 22, [curr.node]);

    // 23: int dis = current.distance;
    addStep('set-first', curr.node, `[${curr.node}] Retrieved distance: dis = ${curr.dist}`, 23, [curr.node]);

    // 24: int node = current.node;
    addStep('set-first', curr.node, `[${curr.node}] Retrieved node: node = ${curr.node}`, 24, [curr.node]);

    // 25: set.remove(current);
    treeset.shift();
    finalizedNodes.push(curr.node);
    addStep('dequeue', curr.node, `[${curr.node}] Removed entry (${curr.dist}, ${curr.node}) from TreeSet.`, 25, [curr.node]);

    const neighbors = adj[curr.node] || [];
    addStep('neighbors', curr.node, `Iterating through ${neighbors.length} neighbors of ${curr.node}`, 26, [curr.node]);

    for (const edge of neighbors) {
      const neighbor = edge.target;
      const weight = edge.weight !== undefined ? edge.weight : 1;

      // 28: int adjNode = ...
      addStep('neighbors', curr.node, `Checking neighbor ${neighbor} of ${curr.node}`, 28, [curr.node, neighbor], [edge.id]);

      // 30: int edgeWeight = ...
      addStep('neighbors', curr.node, `Edge weight is ${weight}`, 30, [curr.node, neighbor], [edge.id]);

      const newDist = curr.dist + weight;
      const oldDist = distTable[neighbor].distance;

      // 32: if (dis + edgeWeight < dist[adjNode])
      addStep('relaxation', curr.node, `Checking relaxation: ${curr.dist} + ${weight} = ${newDist} < dist[${neighbor}] (${oldDist === Infinity ? '∞' : oldDist})`, 32, [curr.node, neighbor], [edge.id]);

      if (newDist < oldDist) {
        // 33: if (dist[adjNode] != (int)1e9)
        addStep('relaxation', neighbor, `New distance ${newDist} is shorter! Checking if dist[${neighbor}] is not Infinity.`, 33, [curr.node, neighbor], [edge.id]);

        if (oldDist !== Infinity) {
          // 34: set.remove(new Pair(dist[adjNode], adjNode))
          treeset = treeset.filter(item => item.node !== neighbor);
          addStep('set-remove-old', neighbor, `[${curr.node}] REMOVE OLD: (${oldDist}, ${neighbor}) removed from TreeSet (stale entry)`, 34, [curr.node, neighbor], [edge.id]);
        }

        // 37: dist[adjNode] = dis + edgeWeight;
        distTable[neighbor].distance = newDist;
        distTable[neighbor].previous = curr.node;
        addStep('relaxation', neighbor, `Updated shortest distance of dist[${neighbor}] to ${newDist}.`, 37, [curr.node, neighbor], [edge.id]);

        // 38: set.add(new Pair(dist[adjNode], adjNode));
        treeset.push({ node: neighbor, dist: newDist });
        sortSet(treeset);
        addStep('set-add-updated', neighbor, `[${curr.node}] ADD UPDATED: (${newDist}, ${neighbor}) inserted into TreeSet`, 38, [curr.node, neighbor], [edge.id]);
      } else {
        addStep('relaxation', curr.node, `No update needed. Existing distance is shorter or equal.`, 32, [curr.node, neighbor], [edge.id]);
      }
    }
  }

  // 43: return dist;
  addStep('complete', null, `TreeSet is empty. Dijkstra set-based traversal complete.`, 43);

  const stats = {
    operation: 'Dijkstra (TreeSet)',
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
