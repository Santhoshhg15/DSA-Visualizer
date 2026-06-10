export interface AlgorithmCode {
  pseudoCode: string[];
  javaCode: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

export const algorithmCode: Record<string, AlgorithmCode> = {
  'bfs': {
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudoCode: [
      'BFS(graph, start):',
      '  create queue Q',
      '  mark start as visited',
      '  enqueue start into Q',
      '  while Q is not empty:',
      '    vertex = dequeue from Q',
      '    process vertex',
      '    for each neighbor of vertex:',
      '      if neighbor not visited:',
      '        mark neighbor as visited',
      '        enqueue neighbor into Q'
    ],
    javaCode: [
      'public void bfs(int start) {',
      '  boolean[] visited = new boolean[V];',
      '  Queue<Integer> queue = new LinkedList<>();',
      '  visited[start] = true;',
      '  queue.add(start);',
      '  while (!queue.isEmpty()) {',
      '    int vertex = queue.poll();',
      '    System.out.print(vertex + " ");',
      '    for (int neighbor : adjList.get(vertex)) {',
      '      if (!visited[neighbor]) {',
      '        visited[neighbor] = true;',
      '        queue.add(neighbor);',
      '      }',
      '    }',
      '  }',
      '}'
    ]
  },
  'dfs': {
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudoCode: [
      'DFS(graph, start):',
      '  mark start as visited',
      '  process start',
      '  for each neighbor of start:',
      '    if neighbor not visited:',
      '      DFS(graph, neighbor)'
    ],
    javaCode: [
      'public void dfs(int start) {',
      '  boolean[] visited = new boolean[V];',
      '  dfsHelper(start, visited);',
      '}',
      'private void dfsHelper(int v, boolean[] visited) {',
      '  visited[v] = true;',
      '  System.out.print(v + " ");',
      '  for (int neighbor : adjList.get(v)) {',
      '    if (!visited[neighbor]) {',
      '      dfsHelper(neighbor, visited);',
      '    }',
      '  }',
      '}'
    ]
  },
  'dijkstra': {
    timeComplexity: 'O((V+E) log V)',
    spaceComplexity: 'O(V)',
    pseudoCode: [
      'Dijkstra(graph, source):',
      '  dist[source] = 0',
      '  dist[all others] = INFINITY',
      '  priority queue PQ ← all vertices',
      '  while PQ is not empty:',
      '    u = vertex with min dist in PQ',
      '    remove u from PQ',
      '    for each neighbor v of u:',
      '      alt = dist[u] + weight(u, v)',
      '      if alt < dist[v]:',
      '        dist[v] = alt',
      '        prev[v] = u',
      '  return dist[], prev[]'
    ],
    javaCode: [
      'public int[] dijkstra(int source) {',
      '  int[] dist = new int[V];',
      '  Arrays.fill(dist, Integer.MAX_VALUE);',
      '  dist[source] = 0;',
      '  PriorityQueue<int[]> pq = new PriorityQueue<>(',
      '    Comparator.comparingInt(a -> a[1]));',
      '  pq.offer(new int[]{source, 0});',
      '  while (!pq.isEmpty()) {',
      '    int[] curr = pq.poll();',
      '    int u = curr[0];',
      '    for (int[] edge : adjList.get(u)) {',
      '      int v = edge[0], w = edge[1];',
      '      if (dist[u] + w < dist[v]) {',
      '        dist[v] = dist[u] + w;',
      '        pq.offer(new int[]{v, dist[v]});',
      '      }',
      '    }',
      '  }',
      '  return dist;',
      '}'
    ]
  },
  'kruskal': {
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(E)',
    pseudoCode: [
      'Kruskal(graph):',
      '  sort all edges by weight ascending',
      '  create Union-Find for all vertices',
      '  MST = empty set',
      '  for each edge (u, v, w) in sorted edges:',
      '    if find(u) ≠ find(v):',
      '      add edge to MST',
      '      union(u, v)',
      '  return MST'
    ],
    javaCode: [
      'public List<int[]> kruskal() {',
      '  List<int[]> edges = getAllEdges();',
      '  edges.sort(Comparator.comparingInt(e -> e[2]));',
      '  int[] parent = new int[V];',
      '  for (int i = 0; i < V; i++) parent[i] = i;',
      '  List<int[]> mst = new ArrayList<>();',
      '  for (int[] edge : edges) {',
      '    int u = edge[0], v = edge[1], w = edge[2];',
      '    if (find(parent, u) != find(parent, v)) {',
      '      mst.add(edge);',
      '      union(parent, u, v);',
      '    }',
      '  }',
      '  return mst;',
      '}',
      'private int find(int[] parent, int x) {',
      '  if (parent[x] != x)',
      '    parent[x] = find(parent, parent[x]);',
      '  return parent[x];',
      '}'
    ]
  },
  'prim': {
    timeComplexity: 'O((V+E) log V)',
    spaceComplexity: 'O(V)',
    pseudoCode: [
      'Prim(graph, start):',
      '  key[start] = 0',
      '  key[all others] = INFINITY',
      '  inMST[all] = false',
      '  priority queue PQ ← all vertices',
      '  while PQ is not empty:',
      '    u = vertex with min key in PQ',
      '    inMST[u] = true',
      '    for each neighbor v of u:',
      '      if v not in MST and weight(u,v) < key[v]:',
      '        key[v] = weight(u, v)',
      '        parent[v] = u',
      '  return parent[]'
    ],
    javaCode: [
      'public int[] prim(int start) {',
      '  int[] key = new int[V];',
      '  int[] parent = new int[V];',
      '  boolean[] inMST = new boolean[V];',
      '  Arrays.fill(key, Integer.MAX_VALUE);',
      '  Arrays.fill(parent, -1);',
      '  key[start] = 0;',
      '  PriorityQueue<int[]> pq = new PriorityQueue<>(',
      '    Comparator.comparingInt(a -> a[1]));',
      '  pq.offer(new int[]{start, 0});',
      '  while (!pq.isEmpty()) {',
      '    int u = pq.poll()[0];',
      '    if (inMST[u]) continue;',
      '    inMST[u] = true;',
      '    for (int[] edge : adjList.get(u)) {',
      '      int v = edge[0], w = edge[1];',
      '      if (!inMST[v] && w < key[v]) {',
      '        key[v] = w;',
      '        parent[v] = u;',
      '        pq.offer(new int[]{v, key[v]});',
      '      }',
      '    }',
      '  }',
      '  return parent;',
      '}'
    ]
  },
  'bellman-ford': {
    timeComplexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    pseudoCode: [],
    javaCode: []
  },
  'floyd-warshall': {
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    pseudoCode: [],
    javaCode: []
  }
};
