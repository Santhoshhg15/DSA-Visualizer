import type { Node, Edge } from '../../stores/useGraphStore';
import type { CycleStep } from '../../stores/useCycleStore';

export function generateCycleSteps(
  nodes: Node[],
  edges: Edge[],
  algorithmType: 'undirected' | 'directed'
): CycleStep[] {
  const steps: CycleStep[] = [];
  let stepId = 0;

  if (algorithmType === 'undirected') {
    // ----------------------------------------------------
    // UNION-FIND STEP GENERATION
    // ----------------------------------------------------
    const parent: Record<string, string> = {};
    const rank: Record<string, number> = {};

    // Helper to get active groups (Union-Find Components)
    const getGroupsSnapshot = (currParent: Record<string, string>): Record<string, string[]> => {
      const groups: Record<string, string[]> = {};
      
      // First find root of everyone to ensure we group properly
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

    // Initialize Union-Find structure
    nodes.forEach((node) => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
    });

    // Generate step for Initialization
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
      algorithmType: 'undirected',
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
        algorithmType: 'undirected',
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
          algorithmType: 'undirected',
        });
      }
      return parent[x];
    };

    const union = (x: string, y: string, edgeId: string) => {
      const rootX = x; // pu
      const rootY = y; // pv

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
        algorithmType: 'undirected',
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
        codeLineActive: 30, // mapping union operation finished
        algorithmType: 'undirected',
      });
    };

    let cycleDetected = false;
    const safeEdges: string[] = [];

    for (const edge of edges) {
      const u = edge.source;
      const v = edge.target;

      // 1. Process edge step
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
        algorithmType: 'undirected',
      });

      // 2. Find roots
      const pu = find(u, edge.id);
      const pv = find(v, edge.id);

      // 3. Compare roots
      if (pu === pv) {
        cycleDetected = true;
        
        // Find all nodes in the cycle component
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
          parentA: pu, // root
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
          algorithmType: 'undirected',
        });
        break;
      }

      // 4. Union
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
        algorithmType: 'undirected',
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
      algorithmType: 'undirected',
    });

  } else {
    // ----------------------------------------------------
    // DFS BACK-EDGE STEP GENERATION (DIRECTED)
    // ----------------------------------------------------
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const dfsStack: string[] = [];

    // Adjacency list representation
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
        codeLineActive: 38,
        algorithmType: 'directed',
      });

      const neighbors = adj[node];
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
          codeLineActive: 41,
          algorithmType: 'directed',
        });

        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) {
            return true;
          }
        } else if (recStack.has(neighbor)) {
          // Back-edge cycle detection
          cycleDetected = true;
          
          // Trace cycle nodes from current stack
          const neighborIdx = dfsStack.indexOf(neighbor);
          if (neighborIdx !== -1) {
            cycleNodesList = dfsStack.slice(neighborIdx);
            // Reconstruct the edges forming the cycle
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
            codeLineActive: 46,
            algorithmType: 'directed',
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
        codeLineActive: 49,
        algorithmType: 'directed',
      });

      return false;
    };

    // Outer DFS loop
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
        codeLineActive: 33,
        algorithmType: 'directed',
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
      codeLineActive: 35,
      algorithmType: 'directed',
    });
  }

  return steps;
}
