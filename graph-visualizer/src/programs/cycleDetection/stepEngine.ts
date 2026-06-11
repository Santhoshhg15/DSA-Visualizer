import type { Node, Edge } from '../../stores/useGraphStore';
import type { CycleStep } from '../../stores/useCycleStore';

export function generateCycleSteps(
  nodes: Node[],
  edges: Edge[],
  algorithmType: 'undirected-union-find' | 'undirected-bfs' | 'directed-dfs' | 'directed-bfs'
): CycleStep[] {
  const steps: CycleStep[] = [];
  let stepId = 0;

  if (algorithmType === 'undirected-union-find') {
    // ----------------------------------------------------
    // UNION-FIND STEP GENERATION (UNDIRECTED)
    // ----------------------------------------------------
    const parent: Record<string, string> = {};
    const rank: Record<string, number> = {};

    const getGroupsSnapshot = (currParent: Record<string, string>): Record<string, string[]> => {
      const groups: Record<string, string[]> = {};
      const findRoot = (x: string): string => {
        let root = x;
        while (currParent[root] !== root) {
          root = currParent[root];
        }
        return root;
      };

      nodes.forEach((node) => {
        const root = findRoot(node.id);
        if (!groups[root]) groups[root] = [];
        groups[root].push(node.id);
      });
      return groups;
    };

    nodes.forEach((node) => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
    });

    steps.push({
      id: stepId++,
      type: 'init',
      parentSnapshot: { ...parent },
      rankSnapshot: { ...rank },
      unionFindGroups: getGroupsSnapshot(parent),
      highlightNodes: [],
      highlightEdges: [],
      hasCycle: null,
      description: `Initialize parents and ranks for all nodes. parent[i] = i, rank[i] = 0.`,
      codeLineActive: 4,
      algorithmType,
    });

    const find = (x: string, edgeId: string): string => {
      steps.push({
        id: stepId++,
        type: 'find',
        nodeA: x,
        parentSnapshot: { ...parent },
        rankSnapshot: { ...rank },
        unionFindGroups: getGroupsSnapshot(parent),
        highlightNodes: [x],
        highlightEdges: [edgeId],
        hasCycle: null,
        description: `Calling find(${x}). Parent of ${x} is currently ${parent[x]}.`,
        codeLineActive: 22,
        algorithmType,
      });

      if (parent[x] !== x) {
        const originalParent = parent[x];
        parent[x] = find(parent[x], edgeId);

        steps.push({
          id: stepId++,
          type: 'find',
          nodeA: x,
          parentA: parent[x],
          parentSnapshot: { ...parent },
          rankSnapshot: { ...rank },
          unionFindGroups: getGroupsSnapshot(parent),
          highlightNodes: [x, parent[x]],
          highlightEdges: [edgeId],
          hasCycle: null,
          description: `Path compression: update parent of ${x} from ${originalParent} to root ${parent[x]}. find(${x}) = ${parent[x]}`,
          codeLineActive: 23,
          algorithmType,
        });
      }
      return parent[x];
    };

    const union = (x: string, y: string, edgeId: string) => {
      const rootX = x;
      const rootY = y;

      steps.push({
        id: stepId++,
        type: 'union',
        nodeA: rootX,
        nodeB: rootY,
        parentSnapshot: { ...parent },
        rankSnapshot: { ...rank },
        unionFindGroups: getGroupsSnapshot(parent),
        highlightNodes: [rootX, rootY],
        highlightEdges: [edgeId],
        hasCycle: null,
        description: `union(${rootX}, ${rootY}) method entry. Merging components.`,
        codeLineActive: 29,
        algorithmType,
      });

      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }

      steps.push({
        id: stepId++,
        type: 'union',
        nodeA: rootX,
        nodeB: rootY,
        parentSnapshot: { ...parent },
        rankSnapshot: { ...rank },
        unionFindGroups: getGroupsSnapshot(parent),
        highlightNodes: [rootX, rootY],
        highlightEdges: [edgeId],
        hasCycle: null,
        description: `Component union complete. Root of ${rootY} is now ${parent[rootY]}. Updated ranks.`,
        codeLineActive: 30,
        algorithmType,
      });
    };

    let cycleDetected = false;
    const safeEdges: string[] = [];

    for (const edge of edges) {
      const u = edge.source;
      const v = edge.target;

      steps.push({
        id: stepId++,
        type: 'process-edge',
        nodeA: u,
        nodeB: v,
        parentSnapshot: { ...parent },
        rankSnapshot: { ...rank },
        unionFindGroups: getGroupsSnapshot(parent),
        highlightNodes: [u, v],
        highlightEdges: [edge.id],
        hasCycle: null,
        description: `Processing edge (${u} — ${v}). Check if they are in the same component.`,
        codeLineActive: 10,
        algorithmType,
      });

      const pu = find(u, edge.id);
      const pv = find(v, edge.id);

      if (pu === pv) {
        cycleDetected = true;
        const cycleCompNodes: string[] = [];
        nodes.forEach((n) => {
          let curr = n.id;
          while (parent[curr] !== curr) {
            curr = parent[curr];
          }
          if (curr === pu) {
            cycleCompNodes.push(n.id);
          }
        });

        steps.push({
          id: stepId++,
          type: 'cycle-found',
          nodeA: u,
          nodeB: v,
          parentA: pu,
          parentSnapshot: { ...parent },
          rankSnapshot: { ...rank },
          unionFindGroups: getGroupsSnapshot(parent),
          highlightNodes: [u, v, pu],
          highlightEdges: [edge.id],
          hasCycle: true,
          cycleNodes: cycleCompNodes,
          cycleEdges: [edge.id],
          description: `⚠️ CYCLE DETECTED! find(${u}) == find(${v}) == ${pu}. Edge (${u}—${v}) connects nodes already in the same component!`,
          codeLineActive: 17,
          algorithmType,
        });
        break;
      }

      union(pu, pv, edge.id);
      safeEdges.push(edge.id);
    }

    if (!cycleDetected) {
      steps.push({
        id: stepId++,
        type: 'no-cycle',
        parentSnapshot: { ...parent },
        rankSnapshot: { ...rank },
        unionFindGroups: getGroupsSnapshot(parent),
        highlightNodes: [],
        highlightEdges: [],
        hasCycle: false,
        description: `✓ No cycle found. All edges processed safely.`,
        codeLineActive: 20,
        algorithmType,
      });
    }

    steps.push({
      id: stepId++,
      type: 'complete',
      parentSnapshot: { ...parent },
      rankSnapshot: { ...rank },
      unionFindGroups: getGroupsSnapshot(parent),
      highlightNodes: [],
      highlightEdges: [],
      hasCycle: cycleDetected,
      description: `✅ Algorithm complete. Result: ${cycleDetected ? 'Cycle Detected' : 'No Cycle Found'}`,
      codeLineActive: 20,
      algorithmType,
    });

  } else if (algorithmType === 'undirected-bfs') {
    // ----------------------------------------------------
    // BFS WITH PARENT TRACKING (UNDIRECTED)
    // ----------------------------------------------------
    const visited = new Set<string>();
    const parentMap = new Map<string, string>(); // Child -> Parent mapping
    const queue: [string, string | null][] = [];

    // Adjacency representation
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.source].push(e.target);
      adj[e.target].push(e.source);
    });

    const getParentMapObj = () => {
      const obj: Record<string, string> = {};
      parentMap.forEach((val, key) => {
        obj[key] = val;
      });
      return obj;
    };

    const getEdgeId = (u: string, v: string) => {
      const edge = edges.find(e => 
        (e.source === u && e.target === v) || 
        (e.source === v && e.target === u)
      );
      return edge ? edge.id : `${u}-${v}`;
    };

    steps.push({
      id: stepId++,
      type: 'init',
      visitedSnapshot: [],
      parentTrackingMap: {},
      queueSnapshot: [],
      highlightNodes: [],
      highlightEdges: [],
      hasCycle: null,
      description: 'Initialize visited array and parent map to empty.',
      codeLineActive: 2,
      algorithmType,
    });

    let cycleDetected = false;

    for (const startNode of nodes) {
      if (visited.has(startNode.id)) continue;

      // Outer loop check
      steps.push({
        id: stepId++,
        type: 'init',
        visitedSnapshot: Array.from(visited),
        parentTrackingMap: getParentMapObj(),
        queueSnapshot: [],
        highlightNodes: [startNode.id],
        highlightEdges: [],
        hasCycle: null,
        description: `Outer loop: node ${startNode.id} is unvisited. Start BFS.`,
        codeLineActive: 4,
        algorithmType,
      });

      // Enqueue start node
      visited.add(startNode.id);
      queue.push([startNode.id, null]);

      steps.push({
        id: stepId++,
        type: 'bfs-enqueue',
        currentNode: startNode.id,
        visitedSnapshot: Array.from(visited),
        parentTrackingMap: getParentMapObj(),
        queueSnapshot: [...queue],
        highlightNodes: [startNode.id],
        highlightEdges: [],
        hasCycle: null,
        description: `Enqueue start node ${startNode.id} with parent = none. Mark visited.`,
        codeLineActive: 11,
        algorithmType,
      });

      while (queue.length > 0) {
        const [curr, parentNode] = queue.shift()!;

        steps.push({
          id: stepId++,
          type: 'bfs-pop',
          currentNode: curr,
          currentParent: parentNode ?? undefined,
          visitedSnapshot: Array.from(visited),
          parentTrackingMap: getParentMapObj(),
          queueSnapshot: [...queue],
          highlightNodes: [curr],
          highlightEdges: [],
          hasCycle: null,
          description: `Dequeue node ${curr} (parent: ${parentNode ?? 'none'}) to check its neighbors.`,
          codeLineActive: 14,
          algorithmType,
        });

        const neighbors = adj[curr] || [];
        for (const neighbor of neighbors) {
          if (neighbor === parentNode) {
            // Skip parent node traversal
            continue;
          }

          const edgeId = getEdgeId(curr, neighbor);

          steps.push({
            id: stepId++,
            type: 'bfs-neighbor',
            currentNode: curr,
            neighborNode: neighbor,
            currentParent: parentNode ?? undefined,
            visitedSnapshot: Array.from(visited),
            parentTrackingMap: getParentMapObj(),
            queueSnapshot: [...queue],
            highlightNodes: [curr, neighbor],
            highlightEdges: [edgeId],
            hasCycle: null,
            description: `Checking neighbor ${neighbor} of ${curr}.`,
            codeLineActive: 15,
            algorithmType,
          });

          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            parentMap.set(neighbor, curr);
            queue.push([neighbor, curr]);

            steps.push({
              id: stepId++,
              type: 'bfs-enqueue',
              currentNode: curr,
              neighborNode: neighbor,
              currentParent: parentNode ?? undefined,
              visitedSnapshot: Array.from(visited),
              parentTrackingMap: getParentMapObj(),
              queueSnapshot: [...queue],
              highlightNodes: [neighbor],
              highlightEdges: [edgeId],
              hasCycle: null,
              description: `Neighbor ${neighbor} is unvisited. Set parent[${neighbor}] = ${curr}, mark visited, and enqueue.`,
              codeLineActive: 16,
              algorithmType,
            });
          } else {
            // Visited and neighbor !== parentNode means cycle is detected!
            cycleDetected = true;

            // Reconstruct Cycle Nodes
            const getPathToRoot = (node: string): string[] => {
              const path: string[] = [node];
              let temp = node;
              while (parentMap.has(temp)) {
                temp = parentMap.get(temp)!;
                path.push(temp);
              }
              return path;
            };

            const path1 = getPathToRoot(curr);
            const path2 = getPathToRoot(neighbor);

            let lca = '';
            for (const val of path1) {
              if (path2.includes(val)) {
                lca = val;
                break;
              }
            }

            let cycleNodesList: string[] = [];
            if (lca) {
              const idx1 = path1.indexOf(lca);
              const idx2 = path2.indexOf(lca);
              const part1 = path1.slice(0, idx1 + 1);
              const part2 = path2.slice(0, idx2).reverse();
              cycleNodesList = [...part1, ...part2];
            } else {
              cycleNodesList = Array.from(new Set([...path1, ...path2]));
            }

            const cycleEdgesList: string[] = [];
            for (let i = 0; i < cycleNodesList.length; i++) {
              const u = cycleNodesList[i];
              const v = cycleNodesList[(i + 1) % cycleNodesList.length];
              cycleEdgesList.push(getEdgeId(u, v));
            }

            steps.push({
              id: stepId++,
              type: 'cycle-found',
              currentNode: curr,
              neighborNode: neighbor,
              currentParent: parentNode ?? undefined,
              visitedSnapshot: Array.from(visited),
              parentTrackingMap: getParentMapObj(),
              queueSnapshot: [...queue],
              highlightNodes: [curr, neighbor],
              highlightEdges: [edgeId],
              hasCycle: true,
              cycleNodes: cycleNodesList,
              cycleEdges: cycleEdgesList,
              description: `⚠️ CYCLE DETECTED! Neighbor ${neighbor} is already visited and is not parent of ${curr}.`,
              codeLineActive: 21,
              algorithmType,
            });
            break;
          }
        }
        if (cycleDetected) break;
      }
      if (cycleDetected) break;
    }

    if (!cycleDetected) {
      steps.push({
        id: stepId++,
        type: 'no-cycle',
        visitedSnapshot: Array.from(visited),
        parentTrackingMap: getParentMapObj(),
        queueSnapshot: [],
        highlightNodes: [],
        highlightEdges: [],
        hasCycle: false,
        description: '✓ BFS complete. No cycle detected in the graph.',
        codeLineActive: 8,
        algorithmType,
      });
    }

    steps.push({
      id: stepId++,
      type: 'complete',
      visitedSnapshot: Array.from(visited),
      parentTrackingMap: getParentMapObj(),
      queueSnapshot: [],
      highlightNodes: [],
      highlightEdges: [],
      hasCycle: cycleDetected,
      description: `✅ Algorithm complete. Result: ${cycleDetected ? 'Cycle Detected' : 'No Cycle Found'}`,
      codeLineActive: 8,
      algorithmType,
    });

  } else if (algorithmType === 'directed-dfs') {
    // ----------------------------------------------------
    // DFS BACK-EDGE STEP GENERATION (DIRECTED)
    // ----------------------------------------------------
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const dfsStack: string[] = [];

    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach((e) => {
      adj[e.source].push(e.target);
    });

    let cycleDetected = false;
    let cycleNodesList: string[] = [];
    let cycleEdgesList: string[] = [];

    const dfs = (node: string): boolean => {
      visited.add(node);
      recStack.add(node);
      dfsStack.push(node);

      steps.push({
        id: stepId++,
        type: 'dfs-enter',
        currentNode: node,
        visitedSnapshot: Array.from(visited),
        recStackSnapshot: Array.from(recStack),
        dfsStackSnapshot: [...dfsStack],
        highlightNodes: [node],
        highlightEdges: [],
        hasCycle: null,
        description: `DFS enter node ${node}. visited[${node}] = true, recStack[${node}] = true`,
        codeLineActive: 115, // mapped to Java helper or pseudo equivalent
        algorithmType,
      });

      const neighbors = adj[node] || [];
      for (const neighbor of neighbors) {
        const edgeId = `${node}-${neighbor}`;
        
        steps.push({
          id: stepId++,
          type: 'dfs-neighbor',
          currentNode: node,
          neighborNode: neighbor,
          visitedSnapshot: Array.from(visited),
          recStackSnapshot: Array.from(recStack),
          dfsStackSnapshot: [...dfsStack],
          highlightNodes: [node, neighbor],
          highlightEdges: [edgeId],
          hasCycle: null,
          description: `Checking neighbor ${neighbor} of ${node}. visited=${visited.has(neighbor)}, inStack=${recStack.has(neighbor)}`,
          codeLineActive: 118,
          algorithmType,
        });

        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) {
            return true;
          }
        } else if (recStack.has(neighbor)) {
          cycleDetected = true;
          const neighborIdx = dfsStack.indexOf(neighbor);
          if (neighborIdx !== -1) {
            cycleNodesList = dfsStack.slice(neighborIdx);
            cycleEdgesList = [];
            for (let i = 0; i < cycleNodesList.length; i++) {
              const u = cycleNodesList[i];
              const v = cycleNodesList[(i + 1) % cycleNodesList.length];
              cycleEdgesList.push(`${u}-${v}`);
            }
          } else {
            cycleNodesList = [neighbor, node];
            cycleEdgesList = [edgeId];
          }

          steps.push({
            id: stepId++,
            type: 'back-edge-found',
            currentNode: node,
            neighborNode: neighbor,
            visitedSnapshot: Array.from(visited),
            recStackSnapshot: Array.from(recStack),
            dfsStackSnapshot: [...dfsStack],
            highlightNodes: [node, neighbor],
            highlightEdges: [edgeId],
            hasCycle: true,
            cycleNodes: cycleNodesList,
            cycleEdges: cycleEdgesList,
            description: `⚠️ CYCLE DETECTED! Back edge found: ${node} → ${neighbor}. ${neighbor} is in current DFS stack!`,
            codeLineActive: 123,
            algorithmType,
          });
          return true;
        }
      }

      recStack.delete(node);
      dfsStack.pop();

      steps.push({
        id: stepId++,
        type: 'dfs-exit',
        currentNode: node,
        visitedSnapshot: Array.from(visited),
        recStackSnapshot: Array.from(recStack),
        dfsStackSnapshot: [...dfsStack],
        highlightNodes: [node],
        highlightEdges: [],
        hasCycle: null,
        description: `DFS exit node ${node}. recStack[${node}] = false`,
        codeLineActive: 127,
        algorithmType,
      });

      return false;
    };

    for (const node of nodes) {
      steps.push({
        id: stepId++,
        type: 'init',
        currentNode: node.id,
        visitedSnapshot: Array.from(visited),
        recStackSnapshot: Array.from(recStack),
        dfsStackSnapshot: [],
        highlightNodes: [],
        highlightEdges: [],
        hasCycle: null,
        description: `Outer DFS loop: checking node ${node.id}`,
        codeLineActive: 105,
        algorithmType,
      });

      if (!visited.has(node.id)) {
        if (dfs(node.id)) {
          break;
        }
      }
    }

    steps.push({
      id: stepId++,
      type: 'complete',
      visitedSnapshot: Array.from(visited),
      recStackSnapshot: Array.from(recStack),
      dfsStackSnapshot: [],
      highlightNodes: [],
      highlightEdges: [],
      hasCycle: cycleDetected,
      cycleNodes: cycleNodesList,
      cycleEdges: cycleEdgesList,
      description: `✅ Algorithm complete. Result: ${cycleDetected ? 'Cycle Detected' : 'No Cycle Found'}`,
      codeLineActive: 112,
      algorithmType,
    });

  } else if (algorithmType === 'directed-bfs') {
    // ----------------------------------------------------
    // KAHN'S ALGORITHM (BFS DIRECTED)
    // ----------------------------------------------------
    const inDegree: Record<string, number> = {};
    nodes.forEach(n => inDegree[n.id] = 0);
    edges.forEach(e => {
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    });

    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.source].push(e.target);
    });

    const topoOrder: string[] = [];
    const queue: string[] = [];

    // Step 1: Compute Indegrees
    steps.push({
      id: stepId++,
      type: 'init',
      inDegreeSnapshot: { ...inDegree },
      topoOrder: [],
      queueSnapshot: [],
      highlightNodes: [],
      highlightEdges: [],
      hasCycle: null,
      description: 'Calculate initial in-degree mapping for all nodes.',
      codeLineActive: 2,
      algorithmType,
    });

    // Step 2: Enqueue all nodes with indegree == 0
    const initialZeros: string[] = [];
    nodes.forEach(n => {
      if (inDegree[n.id] === 0) {
        queue.push(n.id);
        initialZeros.push(n.id);
      }
    });

    steps.push({
      id: stepId++,
      type: 'kahns-enqueue-zero',
      inDegreeSnapshot: { ...inDegree },
      topoOrder: [],
      queueSnapshot: [...queue],
      highlightNodes: initialZeros,
      highlightEdges: [],
      hasCycle: null,
      description: `Identify all nodes with in-degree 0: {${initialZeros.join(', ') || 'none'}}. Enqueue them to start Kahn's BFS.`,
      codeLineActive: 3,
      algorithmType,
    });

    let count = 0;

    while (queue.length > 0) {
      const u = queue.shift()!;
      topoOrder.push(u);
      count++;

      steps.push({
        id: stepId++,
        type: 'kahns-pop',
        currentNode: u,
        inDegreeSnapshot: { ...inDegree },
        topoOrder: [...topoOrder],
        queueSnapshot: [...queue],
        highlightNodes: [u],
        highlightEdges: [],
        hasCycle: null,
        description: `Dequeue node ${u} (in-degree 0). Add to topological order. processedCount = ${count}.`,
        codeLineActive: 6,
        algorithmType,
      });

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        const edgeId = `${u}-${v}`;
        inDegree[v]--;

        steps.push({
          id: stepId++,
          type: 'kahns-decrement',
          currentNode: u,
          neighborNode: v,
          inDegreeSnapshot: { ...inDegree },
          topoOrder: [...topoOrder],
          queueSnapshot: [...queue],
          highlightNodes: [u, v],
          highlightEdges: [edgeId],
          hasCycle: null,
          description: `Explore outgoing edge ${u} → ${v}. Decrement in-degree of ${v} to ${inDegree[v]}.`,
          codeLineActive: 10,
          algorithmType,
        });

        if (inDegree[v] === 0) {
          queue.push(v);

          steps.push({
            id: stepId++,
            type: 'kahns-enqueue',
            currentNode: v,
            inDegreeSnapshot: { ...inDegree },
            topoOrder: [...topoOrder],
            queueSnapshot: [...queue],
            highlightNodes: [v],
            highlightEdges: [edgeId],
            hasCycle: null,
            description: `In-degree of node ${v} became 0. Enqueue ${v}.`,
            codeLineActive: 12,
            algorithmType,
          });
        }
      }
    }

    const hasCycle = count < nodes.length;
    const stuckNodes = nodes.filter(n => inDegree[n.id] > 0).map(n => n.id);
    const cycleEdges = hasCycle
      ? edges.filter(e => inDegree[e.source] > 0 && inDegree[e.target] > 0).map(e => e.id)
      : [];

    steps.push({
      id: stepId++,
      type: hasCycle ? 'cycle-found' : 'no-cycle',
      inDegreeSnapshot: { ...inDegree },
      topoOrder: [...topoOrder],
      queueSnapshot: [],
      highlightNodes: hasCycle ? stuckNodes : [],
      highlightEdges: cycleEdges,
      hasCycle,
      stuckNodes,
      cycleNodes: hasCycle ? stuckNodes : [],
      cycleEdges,
      description: hasCycle
        ? `⚠️ CYCLE DETECTED! Processed count (${count}) < total nodes (${nodes.length}). Stuck nodes with non-zero in-degrees: {${stuckNodes.join(', ')}}.`
        : `✓ NO CYCLE DETECTED. All ${count} nodes successfully ordered. Valid DAG!`,
      codeLineActive: 13,
      algorithmType,
    });

    steps.push({
      id: stepId++,
      type: 'complete',
      inDegreeSnapshot: { ...inDegree },
      topoOrder: [...topoOrder],
      queueSnapshot: [],
      highlightNodes: hasCycle ? stuckNodes : [],
      highlightEdges: cycleEdges,
      hasCycle,
      stuckNodes,
      cycleNodes: hasCycle ? stuckNodes : [],
      cycleEdges,
      description: `✅ Kahn's algorithm complete. Result: ${hasCycle ? 'Cycle Detected' : 'No Cycle Found'}`,
      codeLineActive: 15,
      algorithmType,
    });
  }

  return steps;
}
