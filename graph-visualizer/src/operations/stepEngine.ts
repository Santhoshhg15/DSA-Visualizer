import type { Node, Edge, Step } from '../stores/useGraphStore';

function cloneAdjacency(nodes: Node[], edges: Edge[], directed: boolean, weighted: boolean): Record<string, string[]> {
  const adjList: Record<string, string[]> = {};
  nodes.forEach(n => adjList[n.id] = []);
  edges.forEach(edge => {
    const suffix = (weighted && edge.weight !== undefined) ? `(${edge.weight})` : '';
    adjList[edge.source].push(`${edge.target}${suffix}`);
    if (!directed) {
      adjList[edge.target].push(`${edge.source}${suffix}`);
    }
  });
  return adjList;
}

function injectSnapshots(steps: Step[], initialNodes: Node[], initialEdges: Edge[], directed: boolean): Step[] {
  let nodes = [...initialNodes];
  let edges = [...initialEdges];

  return steps.map(step => {
    if (step.type === 'add-node' && step.nodeId) {
      if (!nodes.find(n => n.id === step.nodeId)) {
        nodes = [...nodes, { id: step.nodeId, label: step.nodeId }];
      }
    } else if (step.type === 'remove-node' && step.nodeId) {
      nodes = nodes.filter(n => n.id !== step.nodeId);
      edges = edges.filter(e => e.source !== step.nodeId && e.target !== step.nodeId);
    } else if (step.type === 'add-edge' && step.highlightEdges[0]) {
      const eId = step.highlightEdges[0];
      if (eId) {
        const [src, dest] = eId.split('-');
        if (!edges.find(e => e.id === eId || (!directed && e.id === `${dest}-${src}`))) {
          edges = [...edges, { id: eId, source: src, target: dest }];
        }
      }
    } else if (step.type === 'remove-edge' && step.edgeId) {
      const [src, dest] = step.edgeId.split('-');
      edges = edges.filter(e => !(e.id === step.edgeId || (!directed && e.id === `${dest}-${src}`)));
    }
    return {
      ...step,
      nodesSnapshot: nodes,
      edgesSnapshot: edges
    };
  });
}

export function generateAddVertexSteps(
  label: string,
  currentNodes: Node[],
  currentEdges: Edge[],
  directed: boolean,
  weighted: boolean
): Step[] {
  const steps: Step[] = [];
  const adj = cloneAdjacency(currentNodes, currentEdges, directed, weighted);
  let stepId = 0;

  let nodesState = [...currentNodes];
  let edgesState = [...currentEdges];

  steps.push({
    id: stepId++,
    type: 'highlight-node',
    highlightNodes: currentNodes.map(n => n.id),
    highlightEdges: [],
    description: `Checking if vertex ${label} already exists...`,
    codeLineActive: 1,
    adjacencySnapshot: { ...adj },
    nodesSnapshot: [...nodesState],
    edgesSnapshot: [...edgesState]
  });

  if (currentNodes.find(n => n.id === label)) {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [label],
      highlightEdges: [],
      description: `Vertex ${label} already exists. Aborting.`,
      codeLineActive: 2,
      adjacencySnapshot: { ...adj },
      nodesSnapshot: [...nodesState],
      edgesSnapshot: [...edgesState]
    });
    return injectSnapshots(steps, currentNodes, currentEdges, directed);
  }

  nodesState.push({ id: label, label });

  steps.push({
    id: stepId++,
    type: 'add-node',
    nodeId: label,
    highlightNodes: [label],
    highlightEdges: [],
    description: `Vertex ${label} does not exist. Creating new vertex.`,
    codeLineActive: 3,
    adjacencySnapshot: { ...adj },
    nodesSnapshot: [...nodesState],
    edgesSnapshot: [...edgesState]
  });

  adj[label] = [];

  steps.push({
    id: stepId++,
    type: 'update-adjacency',
    nodeId: label,
    highlightNodes: [label],
    highlightEdges: [],
    description: `Adding ${label} to adjacency list with empty neighbors.`,
    codeLineActive: 4,
    adjacencySnapshot: { ...adj },
    nodesSnapshot: [...nodesState],
    edgesSnapshot: [...edgesState]
  });

  steps.push({
    id: stepId++,
    type: 'complete',
    highlightNodes: [label],
    highlightEdges: [],
    description: `Vertex ${label} successfully added. Degree = 0.`,
    codeLineActive: 6,
    adjacencySnapshot: { ...adj },
    nodesSnapshot: [...nodesState],
    edgesSnapshot: [...edgesState]
  });

  return injectSnapshots(steps, currentNodes, currentEdges, directed);
}

export function generateAddEdgeSteps(
  src: string,
  dest: string,
  weight: string,
  currentNodes: Node[],
  currentEdges: Edge[],
  directed: boolean,
  weighted: boolean
): Step[] {
  const steps: Step[] = [];
  const adj = cloneAdjacency(currentNodes, currentEdges, directed, weighted);
  let stepId = 0;

  steps.push({
    id: stepId++,
    type: 'highlight-node',
    highlightNodes: [src],
    highlightEdges: [],
    description: `Checking if vertex ${src} exists...`,
    codeLineActive: 1,
    adjacencySnapshot: { ...adj }
  });

  steps.push({
    id: stepId++,
    type: 'highlight-node',
    highlightNodes: [dest],
    highlightEdges: [],
    description: `Checking if vertex ${dest} exists...`,
    codeLineActive: 2,
    adjacencySnapshot: { ...adj }
  });

  const srcExists = currentNodes.find(n => n.id === src);
  const destExists = currentNodes.find(n => n.id === dest);

  if (!srcExists || !destExists) {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [],
      highlightEdges: [],
      description: `One or both vertices not found. Aborting.`,
      codeLineActive: 3,
      adjacencySnapshot: { ...adj }
    });
    return injectSnapshots(steps, currentNodes, currentEdges, directed);
  }

  const w = weighted && weight ? parseInt(weight, 10) : undefined;
  const suffix = w !== undefined ? `(${w})` : '';

  steps.push({
    id: stepId++,
    type: 'add-edge',
    highlightNodes: [src, dest],
    highlightEdges: [`${src}-${dest}`],
    description: `Both vertices exist. Creating edge ${src}→${dest}.`,
    codeLineActive: 4,
    adjacencySnapshot: { ...adj }
  });

  adj[src] = [...adj[src], `${dest}${suffix}`];

  steps.push({
    id: stepId++,
    type: 'update-adjacency',
    highlightNodes: [src],
    highlightEdges: [`${src}-${dest}`],
    description: `Updating adjacency list for ${src}.`,
    codeLineActive: 5,
    adjacencySnapshot: { ...adj }
  });

  if (!directed) {
    adj[dest] = [...adj[dest], `${src}${suffix}`];
    steps.push({
      id: stepId++,
      type: 'update-adjacency',
      highlightNodes: [dest],
      highlightEdges: [`${src}-${dest}`],
      description: `Undirected graph — also updating ${dest}.`,
      codeLineActive: 8,
      adjacencySnapshot: { ...adj }
    });
  }

  steps.push({
    id: stepId++,
    type: 'complete',
    highlightNodes: [src, dest],
    highlightEdges: [`${src}-${dest}`],
    description: `Edge added successfully. Weight: ${w !== undefined ? w : 'none'}.`,
    codeLineActive: 11,
    adjacencySnapshot: { ...adj }
  });

  return injectSnapshots(steps, currentNodes, currentEdges, directed);
}

export function generateRemoveVertexSteps(
  label: string,
  currentNodes: Node[],
  currentEdges: Edge[],
  directed: boolean,
  weighted: boolean
): Step[] {
  const steps: Step[] = [];
  const adj = cloneAdjacency(currentNodes, currentEdges, directed, weighted);
  let stepId = 0;

  steps.push({
    id: stepId++,
    type: 'highlight-node',
    highlightNodes: currentNodes.map(n => n.id),
    highlightEdges: [],
    description: `Searching for vertex ${label}...`,
    codeLineActive: 1,
    adjacencySnapshot: { ...adj }
  });

  if (!currentNodes.find(n => n.id === label)) {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [],
      highlightEdges: [],
      description: `Vertex ${label} not found. Aborting.`,
      codeLineActive: 2,
      adjacencySnapshot: { ...adj }
    });
    return injectSnapshots(steps, currentNodes, currentEdges, directed);
  }

  const connectedEdges = currentEdges.filter(e => e.source === label || e.target === label);
  const connectedEdgeIds = connectedEdges.map(e => e.id);

  steps.push({
    id: stepId++,
    type: 'highlight-node',
    highlightNodes: [label],
    highlightEdges: connectedEdgeIds,
    description: `Vertex ${label} found. Identifying connected edges...`,
    codeLineActive: 3,
    adjacencySnapshot: { ...adj }
  });

  steps.push({
    id: stepId++,
    type: 'remove-edge',
    highlightNodes: [label],
    highlightEdges: connectedEdgeIds,
    description: `Removing ${connectedEdges.length} connected edges first...`,
    codeLineActive: 4,
    adjacencySnapshot: { ...adj }
  });

  delete adj[label];

  steps.push({
    id: stepId++,
    type: 'remove-node',
    nodeId: label,
    highlightNodes: [],
    highlightEdges: [],
    description: `Removing vertex ${label} from adjacency list...`,
    codeLineActive: 5,
    adjacencySnapshot: { ...adj }
  });

  // Clean up references
  Object.keys(adj).forEach(k => {
    adj[k] = adj[k].filter(v => !v.startsWith(label));
  });

  steps.push({
    id: stepId++,
    type: 'update-adjacency',
    highlightNodes: [],
    highlightEdges: [],
    description: `Cleaning up all references to ${label} in other lists.`,
    codeLineActive: 6,
    adjacencySnapshot: { ...adj }
  });

  steps.push({
    id: stepId++,
    type: 'complete',
    highlightNodes: [],
    highlightEdges: [],
    description: `Vertex ${label} removed successfully.`,
    codeLineActive: 9,
    adjacencySnapshot: { ...adj }
  });

  return injectSnapshots(steps, currentNodes, currentEdges, directed);
}

export function generateRemoveEdgeSteps(
  src: string,
  dest: string,
  currentNodes: Node[],
  currentEdges: Edge[],
  directed: boolean,
  weighted: boolean
): Step[] {
  const steps: Step[] = [];
  const adj = cloneAdjacency(currentNodes, currentEdges, directed, weighted);
  let stepId = 0;

  steps.push({
    id: stepId++,
    type: 'highlight-node',
    highlightNodes: [src],
    highlightEdges: [],
    description: `Locating edge ${src} → ${dest}...`,
    codeLineActive: 1,
    adjacencySnapshot: { ...adj }
  });

  if (!currentNodes.find(n => n.id === src)) {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [],
      highlightEdges: [],
      description: `Source vertex not found.`,
      codeLineActive: 2,
      adjacencySnapshot: { ...adj }
    });
    return injectSnapshots(steps, currentNodes, currentEdges, directed);
  }

  const edgeId1 = `${src}-${dest}`;
  const edgeId2 = `${dest}-${src}`;
  const targetEdge = currentEdges.find(e => e.id === edgeId1 || (!directed && e.id === edgeId2));

  if (!targetEdge) {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [src],
      highlightEdges: [],
      description: `Edge not found.`,
      codeLineActive: 3,
      adjacencySnapshot: { ...adj }
    });
    return injectSnapshots(steps, currentNodes, currentEdges, directed);
  }

  steps.push({
    id: stepId++,
    type: 'highlight-edge',
    highlightNodes: [src, dest],
    highlightEdges: [targetEdge.id],
    description: `Scanning adjacency list of ${src}...`,
    codeLineActive: 3,
    adjacencySnapshot: { ...adj }
  });

  adj[src] = adj[src].filter(v => !v.startsWith(dest));

  steps.push({
    id: stepId++,
    type: 'remove-edge',
    edgeId: targetEdge.id,
    highlightNodes: [src],
    highlightEdges: [],
    description: `Edge found. Removing from ${src}'s list.`,
    codeLineActive: 4,
    adjacencySnapshot: { ...adj }
  });

  if (!directed) {
    adj[dest] = adj[dest].filter(v => !v.startsWith(src));
    steps.push({
      id: stepId++,
      type: 'update-adjacency',
      highlightNodes: [dest],
      highlightEdges: [],
      description: `Undirected — removing reverse edge too.`,
      codeLineActive: 6,
      adjacencySnapshot: { ...adj }
    });
  }

  steps.push({
    id: stepId++,
    type: 'complete',
    highlightNodes: [],
    highlightEdges: [],
    description: `Edge removed successfully.`,
    codeLineActive: 9,
    adjacencySnapshot: { ...adj }
  });

  return injectSnapshots(steps, currentNodes, currentEdges, directed);
}

export function generateSearchEdgeSteps(
  src: string,
  dest: string,
  currentNodes: Node[],
  currentEdges: Edge[],
  directed: boolean,
  weighted: boolean
): Step[] {
  const steps: Step[] = [];
  const adj = cloneAdjacency(currentNodes, currentEdges, directed, weighted);
  let stepId = 0;

  steps.push({
    id: stepId++,
    type: 'highlight-node',
    highlightNodes: [src],
    highlightEdges: [],
    description: `Checking if edge ${src} → ${dest} exists...`,
    codeLineActive: 1,
    adjacencySnapshot: { ...adj }
  });

  if (!currentNodes.find(n => n.id === src)) {
    steps.push({
      id: stepId++,
      type: 'complete',
      highlightNodes: [],
      highlightEdges: [],
      description: `Source vertex not found.`,
      codeLineActive: 2,
      adjacencySnapshot: { ...adj }
    });
    return injectSnapshots(steps, currentNodes, currentEdges, directed);
  }

  const neighbors = adj[src];

  for (let i = 0; i < neighbors.length; i++) {
    const n = neighbors[i];
    steps.push({
      id: stepId++,
      type: 'highlight-node',
      highlightNodes: [src, n.split('(')[0]], // extract base ID if weighted
      highlightEdges: [`${src}-${n.split('(')[0]}`],
      description: `Scanning ${src}'s adjacency list... checking ${n}`,
      codeLineActive: 3,
      adjacencySnapshot: { ...adj }
    });

    if (n.startsWith(dest)) {
      steps.push({
        id: stepId++,
        type: 'found',
        highlightNodes: [dest],
        highlightEdges: [`${src}-${dest}`],
        description: `Edge ${src}→${dest} found! Weight: ${weighted ? n.split('(')[1].replace(')', '') : 'none'}`,
        codeLineActive: 5,
        adjacencySnapshot: { ...adj }
      });
      return injectSnapshots(steps, currentNodes, currentEdges, directed);
    }
  }

  steps.push({
    id: stepId++,
    type: 'not-found',
    highlightNodes: [src],
    highlightEdges: [],
    description: `Edge not found in ${src}'s list.`,
    codeLineActive: 7,
    adjacencySnapshot: { ...adj }
  });

  return injectSnapshots(steps, currentNodes, currentEdges, directed);
}
