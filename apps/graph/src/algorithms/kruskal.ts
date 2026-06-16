import type { Node, Edge, Step } from '../stores/useGraphStore';

class UnionFind {
  parent: Record<string, string> = {};
  
  constructor(nodes: Node[]) {
    nodes.forEach(n => this.parent[n.id] = n.id);
  }

  find(i: string): string {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i: string, j: string) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
    }
  }

  getSets(): Record<string, string[]> {
    const sets: Record<string, string[]> = {};
    for (const key in this.parent) {
      const root = this.find(key);
      if (!sets[root]) sets[root] = [];
      sets[root].push(key);
    }
    return sets;
  }
}

export function generateKruskalSteps(nodes: Node[], edges: Edge[]): { steps: Step[], stats: any } {
  const steps: Step[] = [];
  let stepId = 0;
  
  // Kruskal operates on undirected edges usually.
  // We'll just collect all edges and assume undirected preset was loaded.
  const allEdges = [...edges].map(e => ({
    id: e.id,
    src: e.source,
    dest: e.target,
    weight: e.weight !== undefined ? e.weight : 1,
    active: false,
    status: 'pending' // pending, accepted, rejected
  }));

  const uf = new UnionFind(nodes);
  const mstEdges: typeof allEdges = [];
  let mstCost = 0;
  let rejectedCount = 0;
  const mstNodes = new Set<string>();

  const getAuxState = () => {
    return {
      sortedEdges: allEdges.map(e => ({ ...e })),
      unionFind: uf.getSets(),
      mstCost,
      visitedOrder: Array.from(mstNodes)
    };
  };

  const addStep = (desc: string, codeLine: number, hNodes: string[] = [], hEdges: string[] = []) => {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [...hNodes],
      highlightEdges: [...hEdges], // MST edges should ideally stay highlighted...
      // We will highlight the MST edges constantly by injecting them
      description: desc,
      codeLineActive: codeLine,
      adjacencySnapshot: {},
      auxiliaryState: getAuxState()
    });
  };

  addStep(`Initializing Kruskal's Algorithm. Extracting all edges.`, 1);

  allEdges.sort((a, b) => a.weight - b.weight);
  addStep(`Sorted ${allEdges.length} edges by weight in ascending order.`, 3);

  addStep(`Initialized Union-Find structure with ${nodes.length} disjoint sets.`, 4);

  for (let i = 0; i < allEdges.length; i++) {
    const edge = allEdges[i];
    edge.active = true;

    // Highlight all currently accepted MST edges plus the one being considered
    const currentMstEdgeIds = mstEdges.map(e => e.id);
    
    addStep(`Considering edge ${edge.src} → ${edge.dest} (weight: ${edge.weight})`, 6, [edge.src, edge.dest], [...currentMstEdgeIds, edge.id]);

    const rootSrc = uf.find(edge.src);
    const rootDest = uf.find(edge.dest);

    addStep(`Checking for cycles: Root(${edge.src}) = ${rootSrc}, Root(${edge.dest}) = ${rootDest}`, 7, [edge.src, edge.dest], [...currentMstEdgeIds, edge.id]);

    if (rootSrc !== rootDest) {
      edge.status = 'accepted';
      mstEdges.push(edge);
      mstCost += edge.weight;
      uf.union(edge.src, edge.dest);
      mstNodes.add(edge.src);
      mstNodes.add(edge.dest);
      currentMstEdgeIds.push(edge.id);
      
      addStep(`No cycle! Adding edge to MST and merging sets. New MST Cost: ${mstCost}`, 10, [edge.src, edge.dest], currentMstEdgeIds);
    } else {
      edge.status = 'rejected';
      rejectedCount++;
      addStep(`Cycle detected! Edge ${edge.src} → ${edge.dest} would form a cycle. Rejecting.`, 11, [edge.src, edge.dest], currentMstEdgeIds);
    }

    edge.active = false;

    if (mstEdges.length === nodes.length - 1) {
      addStep(`MST complete! ${mstEdges.length} edges collected for ${nodes.length} vertices.`, 13, [], mstEdges.map(e => e.id));
      break;
    }
  }

  if (mstEdges.length < nodes.length - 1) {
    addStep(`Algorithm terminated. Only found ${mstEdges.length} edges. The graph might be disconnected.`, 14);
  }

  const stats = {
    operation: 'Kruskal',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    stepsTaken: steps.length,
    result: `MST Found (Cost: ${mstCost})`,
    extra: [
      { label: 'MST Cost', value: mstCost },
      { label: 'Edges in MST', value: mstEdges.length },
      { label: 'Edges Rejected', value: rejectedCount }
    ]
  };

  return { steps, stats };
}
