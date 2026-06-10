import type { Node, Edge, Step } from '../stores/useGraphStore';

export function generateFloydWarshallSteps(nodes: Node[], edges: Edge[], directed: boolean): { steps: Step[], stats: any } {
  const steps: Step[] = [];
  let stepId = 0;
  const V = nodes.length;
  
  // Create a mapping from node.id to index for matrix operations
  const nodeIndex: Record<string, number> = {};
  const indexNode: string[] = [];
  nodes.forEach((n, i) => {
    nodeIndex[n.id] = i;
    indexNode.push(n.id);
  });

  // Initialize distance matrix
  const dist: number[][] = Array(V).fill(0).map(() => Array(V).fill(Infinity));
  for (let i = 0; i < V; i++) dist[i][i] = 0;

  edges.forEach(e => {
    const u = nodeIndex[e.source];
    const v = nodeIndex[e.target];
    const weight = e.weight !== undefined ? e.weight : 1;
    dist[u][v] = weight;
    if (!directed) {
      dist[v][u] = weight;
    }
  });

  let totalUpdates = 0;

  const getAuxState = () => {
    // deep copy matrix
    const matrix = dist.map(row => [...row]);
    return { matrix, nodes: indexNode };
  };

  const addStep = (desc: string, codeLine: number, hNodes: string[] = []) => {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [...hNodes],
      highlightEdges: [],
      description: desc,
      codeLineActive: codeLine,
      adjacencySnapshot: {},
      auxiliaryState: getAuxState()
    });
  };

  addStep(`Initializing Floyd-Warshall distance matrix with edge weights.`, 5);

  for (let k = 0; k < V; k++) {
    addStep(`Considering node ${indexNode[k]} as an intermediate point.`, 6, [indexNode[k]]);
    
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        // Skip irrelevant checks for visual brevity if they are Infinity
        if (dist[i][k] === Infinity || dist[k][j] === Infinity) {
          // addStep(`Path through ${indexNode[k]} from ${indexNode[i]} to ${indexNode[j]} is Infinity. Skipping.`, 9, [indexNode[i], indexNode[k], indexNode[j]]);
          continue; 
        }

        const newDist = dist[i][k] + dist[k][j];
        const oldDist = dist[i][j];

        if (newDist < oldDist) {
          dist[i][j] = newDist;
          totalUpdates++;
          addStep(`Shorter path found! ${indexNode[i]}→${indexNode[j]} improved via ${indexNode[k]} (${dist[i][k]} + ${dist[k][j]} = ${newDist}).`, 11, [indexNode[i], indexNode[k], indexNode[j]]);
        } else {
          // We can optionally visualize EVERY check, but V^3 is a lot.
          // Let's only step on updates, or add a limited number of "no update" steps to keep playback reasonable.
        }
      }
    }
  }

  addStep('Floyd-Warshall algorithm complete. All-pairs shortest paths computed.', 17);

  const stats = {
    operation: 'Floyd-Warshall',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    stepsTaken: steps.length,
    result: `Matrix Computed`,
    extra: [
      { label: 'Matrix Dimensions', value: `${V}x${V}` },
      { label: 'Total Matrix Updates', value: totalUpdates }
    ]
  };

  return { steps, stats };
}
