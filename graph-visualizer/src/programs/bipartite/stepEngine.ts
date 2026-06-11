import type { Node, Edge } from '../../stores/useGraphStore';
import type { BipartiteStep } from '../../stores/useBipartiteStore';

export function generateBipartiteSteps(
  nodes: Node[],
  edges: Edge[],
  directed: boolean
): BipartiteStep[] {
  const steps: BipartiteStep[] = [];
  let stepId = 0;

  const colorMap: Record<string, number> = {};
  nodes.forEach((n) => {
    colorMap[n.id] = -1;
  });

  const getGroups = (map: Record<string, number>) => {
    const group0: string[] = [];
    const group1: string[] = [];
    Object.entries(map).forEach(([nodeId, val]) => {
      if (val === 0) group0.push(nodeId);
      else if (val === 1) group1.push(nodeId);
    });
    return { group0, group1 };
  };

  const getEdgeId = (u: string, v: string) => {
    if (directed) {
      const e = edges.find((edge) => edge.source === u && edge.target === v);
      return e ? e.id : `${u}-${v}`;
    } else {
      const e = edges.find(
        (edge) =>
          (edge.source === u && edge.target === v) ||
          (edge.source === v && edge.target === u)
      );
      return e ? e.id : `${u}-${v}`;
    }
  };

  // Step helper
  const addStep = (
    type: BipartiteStep['type'],
    description: string,
    codeLineActive: number,
    extra: Partial<BipartiteStep> = {}
  ) => {
    const { group0, group1 } = getGroups(colorMap);
    steps.push({
      id: stepId++,
      type,
      colorSnapshot: { ...colorMap },
      queueSnapshot: [], // filled inside algorithm loop
      highlightNodes: [],
      highlightEdges: [],
      isBipartite: null,
      group0Nodes: group0,
      group1Nodes: group1,
      description,
      codeLineActive,
      ...extra,
    });
  };

  // 1. INIT color loop
  nodes.forEach((n) => {
    colorMap[n.id] = -1;
    addStep(
      'init-color',
      `Initialize color[${n.id}] = -1 (uncolored)`,
      27,
      {
        highlightNodes: [n.id],
      }
    );
  });

  // Build Adjacency List
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (!directed && adj[e.target]) adj[e.target].push(e.source);
  });

  // Sort neighbors to keep it deterministic
  Object.keys(adj).forEach((key) => {
    adj[key].sort();
  });

  const bfsQueue: string[] = [];

  const runBfs = (startNode: string): boolean => {
    // start-component step
    addStep(
      'start-component',
      `Node ${startNode} is uncolored. Starting BFS component from node ${startNode}`,
      29,
      {
        currentNode: startNode,
        highlightNodes: [startNode],
        queueSnapshot: [...bfsQueue],
      }
    );

    // Color source
    colorMap[startNode] = 0;
    addStep(
      'color-source',
      `Color source node ${startNode} = 0 (Yellow group)`,
      6,
      {
        currentNode: startNode,
        highlightNodes: [startNode],
        queueSnapshot: [...bfsQueue],
      }
    );

    // Enqueue source
    bfsQueue.push(startNode);
    addStep(
      'enqueue-source',
      `Enqueue ${startNode}. Queue: [${bfsQueue.join(', ')}]`,
      5,
      {
        currentNode: startNode,
        highlightNodes: [startNode],
        queueSnapshot: [...bfsQueue],
      }
    );

    while (bfsQueue.length > 0) {
      // Dequeue peek & remove
      const node = bfsQueue[0];
      const colorName = colorMap[node] === 0 ? 'Yellow' : 'Orange';

      addStep(
        'dequeue',
        `Dequeue ${node}. color[${node}] = ${colorMap[node]} (${colorName})`,
        8, // peek + remove
        {
          currentNode: node,
          highlightNodes: [node],
          queueSnapshot: [...bfsQueue],
        }
      );

      bfsQueue.shift();
      // update queue snapshot in step helper since we want dequeue step to show queue after removal
      steps[steps.length - 1].queueSnapshot = [...bfsQueue];

      const neighbors = adj[node] || [];
      for (const neighbor of neighbors) {
        const edgeId = getEdgeId(node, neighbor);

        // check if neighbor is uncolored
        addStep(
          'check-neighbor',
          `Checking neighbor ${neighbor} of ${node}. color[${neighbor}] = ${colorMap[neighbor]}`,
          11,
          {
            currentNode: node,
            neighborNode: neighbor,
            highlightNodes: [node, neighbor],
            highlightEdges: [edgeId],
            queueSnapshot: [...bfsQueue],
          }
        );

        if (colorMap[neighbor] === -1) {
          // Color neighbor
          const newColor = 1 - colorMap[node];
          const newColorName = newColor === 0 ? 'Yellow' : 'Orange';
          colorMap[neighbor] = newColor;

          addStep(
            'color-neighbor',
            `color[${neighbor}] = 1 - color[${node}] = ${newColor} (${newColorName})`,
            12,
            {
              currentNode: node,
              neighborNode: neighbor,
              highlightNodes: [node, neighbor],
              highlightEdges: [edgeId],
              queueSnapshot: [...bfsQueue],
            }
          );

          // Enqueue neighbor
          bfsQueue.push(neighbor);
          addStep(
            'enqueue-neighbor',
            `Enqueue ${neighbor}. Queue: [${bfsQueue.join(', ')}]`,
            13,
            {
              currentNode: neighbor,
              highlightNodes: [neighbor],
              queueSnapshot: [...bfsQueue],
            }
          );
        } else if (colorMap[neighbor] === colorMap[node]) {
          // Conflict found!
          const colorVal = colorMap[node];
          const colorName = colorVal === 0 ? 'Yellow' : 'Orange';

          addStep(
            'conflict-found',
            `⚠️ NOT BIPARTITE! color[${neighbor}] == color[${node}] == ${colorVal} (${colorName}). Same color on adjacent nodes!`,
            16,
            {
              currentNode: node,
              neighborNode: neighbor,
              highlightNodes: [node, neighbor],
              highlightEdges: [edgeId],
              conflictEdge: edgeId,
              conflictNodes: [node, neighbor],
              queueSnapshot: [...bfsQueue],
              isBipartite: false,
            }
          );
          return false;
        }
      }
    }

    addStep(
      'component-bipartite',
      `✓ Component is bipartite. No conflicts found.`,
      20,
      {
        queueSnapshot: [...bfsQueue],
      }
    );
    return true;
  };

  // Outer loop
  let conflictFound = false;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    // outer loop step (checking condition)
    addStep(
      'start-component', // just a marker, outer for loop line 28
      `Checking node ${node.id} in outer loop`,
      28,
      {
        highlightNodes: [node.id],
      }
    );

    if (colorMap[node.id] === -1) {
      if (!runBfs(node.id)) {
        conflictFound = true;
        break;
      }
    }
  }

  if (conflictFound) {
    addStep(
      'not-bipartite',
      `✗ Graph is NOT bipartite. Odd cycle detected.`,
      32,
      {
        isBipartite: false,
      }
    );
    addStep(
      'complete',
      `❌ Result: Graph is NOT bipartite`,
      32,
      {
        isBipartite: false,
      }
    );
  } else {
    addStep(
      'complete',
      `✅ Result: Graph IS bipartite`,
      36,
      {
        isBipartite: true,
      }
    );
  }

  // Set the correct isBipartite values on final steps
  steps.forEach((step, idx) => {
    if (idx === steps.length - 1) {
      step.isBipartite = !conflictFound;
    } else if (conflictFound && idx >= steps.findIndex(s => s.type === 'conflict-found')) {
      step.isBipartite = false;
    }
  });

  return steps;
}
