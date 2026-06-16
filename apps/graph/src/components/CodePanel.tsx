import { useGraphStore } from '../stores/useGraphStore';
import { useEffect, useRef, useState } from 'react';
import { algorithmCode } from '../data/algorithmCode';
import { CopyDownloadButtons } from './CopyDownloadButtons';

const operationCodes: Record<string, string[]> = {
  'add-vertex': [
    'public void addVertex(String label) {',
    '    if (adjacencyList.containsKey(label)) {',
    '        return; // vertex already exists',
    '    }',
    '    adjacencyList.put(label, new ArrayList<>());',
    '}'
  ],
  'add-edge': [
    'public void addEdge(String src, String dest, int weight) {',
    '    if (!adjacencyList.containsKey(src) || !adjacencyList.containsKey(dest)) {',
    '        return; // vertex not found',
    '    }',
    '    adjacencyList.get(src).add(new Edge(dest, weight));',
    '    if (!isDirected) {',
    '        adjacencyList.get(dest).add(new Edge(src, weight));',
    '    }',
    '}'
  ],
  'remove-vertex': [
    'public void removeVertex(String label) {',
    '    if (!adjacencyList.containsKey(label)) return;',
    '    adjacencyList.remove(label);',
    '    for (String key : adjacencyList.keySet()) {',
    '        adjacencyList.get(key).removeIf(e -> e.dest.equals(label));',
    '    }',
    '}'
  ],
  'remove-edge': [
    'public void removeEdge(String src, String dest) {',
    '    if (!adjacencyList.containsKey(src)) return;',
    '    adjacencyList.get(src).removeIf(e -> e.dest.equals(dest));',
    '    if (!isDirected) {',
    '        adjacencyList.get(dest).removeIf(e -> e.dest.equals(src));',
    '    }',
    '}'
  ],
  'search-edge': [
    'public boolean hasEdge(String src, String dest) {',
    '    if (!adjacencyList.containsKey(src)) return false;',
    '    for (Edge e : adjacencyList.get(src)) {',
    '        if (e.dest.equals(dest)) return true;',
    '    }',
    '    return false;',
    '}'
  ],
  'bfs': [
    'public List<String> bfs(String start) {',
    '    Queue<String> queue = new LinkedList<>();',
    '    Set<String> visited = new HashSet<>();',
    '    List<String> result = new ArrayList<>();',
    '    queue.add(start);',
    '    visited.add(start);',
    '    while (!queue.isEmpty()) {',
    '        String node = queue.poll();',
    '        result.add(node);',
    '        for (Edge e : adj.get(node)) {',
    '            if (!visited.contains(e.dest)) {',
    '                visited.add(e.dest);',
    '                queue.add(e.dest);',
    '            }',
    '        }',
    '    }',
    '    return result;',
    '}'
  ],
  'dfs': [
    'public void dfs(String node, Set<String> visited, List<String> result) {',
    '    visited.add(node);',
    '    result.add(node);',
    '    for (Edge e : adj.get(node)) {',
    '        if (!visited.contains(e.dest)) {',
    '            dfs(e.dest, visited, result);',
    '        }',
    '    }',
    '}'
  ],
  'dijkstra': [
    'public Map<String, Integer> dijkstra(String src) {',
    '    Map<String, Integer> dist = new HashMap<>();',
    '    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[1]-b[1]);',
    '    for (String v : adj.keySet()) dist.put(v, Integer.MAX_VALUE);',
    '    dist.put(src, 0);',
    '    pq.offer(new int[]{srcId, 0});',
    '    while (!pq.isEmpty()) {',
    '        int[] curr = pq.poll();',
    '        for (Edge e : adj.get(curr[0])) {',
    '            int newDist = dist.get(curr) + e.w;',
    '            if (newDist < dist.get(e.dest)) {',
    '                dist.put(e.dest, newDist);',
    '                pq.offer(new int[]{e.dest, newDist});',
    '            }',
    '        }',
    '    }',
    '    return dist;',
    '}'
  ],
  'bellman-ford': [
    'public Map<String, Integer> bellmanFord(String src) {',
    '    Map<String, Integer> dist = new HashMap<>();',
    '    for (String v : adj.keySet()) dist.put(v, Integer.MAX_VALUE);',
    '    dist.put(src, 0);',
    '    int V = adj.size();',
    '    for (int i = 0; i < V - 1; i++) {',
    '        for (String u : adj.keySet()) {',
    '            for (Edge e : adj.get(u)) {',
    '                if (dist.get(u) != MAX && dist.get(u)+e.w < dist.get(e.dest)) {',
    '                    dist.put(e.dest, dist.get(u)+e.w);',
    '                }',
    '            }',
    '        }',
    '    }',
    '    // Check negative cycle',
    '    for (String u : adj.keySet())',
    '        for (Edge e : adj.get(u))',
    '            if (dist.get(u)+e.w < dist.get(e.dest)) return null;',
    '    return dist;',
    '}'
  ],
  'floyd-warshall': [
    'public int[][] floydWarshall(int[][] graph) {',
    '    int V = graph.length;',
    '    int[][] dist = new int[V][V];',
    '    for (int i=0; i<V; i++)',
    '        for (int j=0; j<V; j++)',
    '            dist[i][j] = graph[i][j];',
    '    for (int k=0; k<V; k++) {',
    '        for (int i=0; i<V; i++) {',
    '            for (int j=0; j<V; j++) {',
    '                if (dist[i][k]+dist[k][j] < dist[i][j]) {',
    '                    dist[i][j] = dist[i][k]+dist[k][j];',
    '                }',
    '            }',
    '        }',
    '    }',
    '    return dist;',
    '}'
  ],
  'kruskal': [
    'public List<Edge> kruskal() {',
    '    List<Edge> edges = getAllEdges();',
    '    Collections.sort(edges, (a,b) -> a.weight - b.weight);',
    '    UnionFind uf = new UnionFind(vertices);',
    '    List<Edge> mst = new ArrayList<>();',
    '    for (Edge e : edges) {',
    '        if (uf.find(e.src) != uf.find(e.dest)) {',
    '            mst.add(e);',
    '            uf.union(e.src, e.dest);',
    '        }',
    '    }',
    '    return mst;',
    '}'
  ],
  'prim': [
    'public List<Edge> prim(String start) {',
    '    Set<String> inMST = new HashSet<>();',
    '    PriorityQueue<Edge> pq = new PriorityQueue<>((a,b)->a.w-b.w);',
    '    inMST.add(start);',
    '    pq.addAll(adj.get(start));',
    '    List<Edge> mst = new ArrayList<>();',
    '    while (!pq.isEmpty()) {',
    '        Edge e = pq.poll();',
    '        if (inMST.contains(e.dest)) continue;',
    '        inMST.add(e.dest);',
    '        mst.add(e);',
    '        for (Edge next : adj.get(e.dest))',
    '            if (!inMST.contains(next.dest)) pq.add(next);',
    '    }',
    '    return mst;',
    '}'
  ],
  'topological-sort': [
    'public List<String> topologicalSort() {',
    '    Map<String, Integer> inDeg = new HashMap<>();',
    '    for (String v : adj.keySet()) inDeg.put(v, 0);',
    '    for (String u : adj.keySet())',
    '        for (Edge e : adj.get(u))',
    '            inDeg.merge(e.dest, 1, Integer::sum);',
    '    Queue<String> q = new LinkedList<>();',
    '    for (String v : inDeg.keySet())',
    '        if (inDeg.get(v) == 0) q.add(v);',
    '    List<String> order = new ArrayList<>();',
    '    while (!q.isEmpty()) {',
    '        String node = q.poll();',
    '        order.add(node);',
    '        for (Edge e : adj.get(node)) {',
    '            inDeg.merge(e.dest, -1, Integer::sum);',
    '            if (inDeg.get(e.dest) == 0) q.add(e.dest);',
    '        }',
    '    }',
    '    if (order.size() != adj.size()) return null;',
    '    return order;',
    '}'
  ]
};

// Extremely basic regex tokenizer for syntax highlighting
function syntaxHighlight(code: string) {
  // Comments
  if (code.trim().startsWith('//')) {
    return <span className="text-[var(--muted-color)] italic">{code}</span>;
  }

  const keywords = ['public', 'void', 'return', 'if', 'else', 'while', 'for', 'new', 'continue', 'break', 'class', 'static', 'int', 'boolean'];
  const types = ['String', 'int[]', 'List', 'Map', 'Set', 'Queue', 'PriorityQueue', 'ArrayList', 'LinkedList', 'HashSet', 'HashMap', 'Edge', 'Integer', 'Pair', 'Solution'];
  
  // Replace words
  let result: React.ReactNode[] = [];
  const tokens = code.split(/([ \(\)\{\}\[\]\.\,;\<\>])/g);
  
  tokens.forEach((token, i) => {
    if (keywords.includes(token)) {
      result.push(<span key={i} className="text-[#60a5fa]">{token}</span>);
    } else if (types.includes(token)) {
      result.push(<span key={i} className="text-[#10b981]">{token}</span>);
    } else {
      result.push(token);
    }
  });

  return result;
}

export function CodePanel({ 
  collapsed, 
  onToggle,
  codeScrollRef,
  onScroll
}: { 
  collapsed: boolean; 
  onToggle: () => void;
  codeScrollRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}) {
  const { steps, cur, stats, selectedAlgorithm, dijkstraImpl } = useGraphStore();
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(350);
  const [isPseudoCode, setIsPseudoCode] = useState(true);

  const currentStepData = steps[cur];
  const activeLine = currentStepData?.codeLineActive || 0;
  
  let opKey = selectedAlgorithm || stats?.operation?.toLowerCase()?.replace(' ', '-') || '';
  if (opKey === 'dijkstra' && dijkstraImpl === 'set') {
    opKey = 'dijkstra-set';
  }
  
  const hasAlgorithmData = !!algorithmCode[opKey];
  const codeLines = hasAlgorithmData 
    ? (isPseudoCode ? algorithmCode[opKey].pseudoCode : algorithmCode[opKey].javaCode)
    : (operationCodes[opKey] || []);

  useEffect(() => {
    if (!outerContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setPanelWidth(entry.contentRect.width);
      }
    });
    observer.observe(outerContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = panelWidth < 450;

  return (
    <div ref={outerContainerRef} className={`w-full flex flex-col bg-[var(--panel-bg)] border-l border-[var(--border-color)] transition-all duration-300 font-sans ${collapsed ? 'h-[40px]' : 'h-full min-h-0'}`}>
      <div 
        className={`px-3 flex border-b border-[var(--border-color)] bg-[var(--panel-bg)] cursor-pointer hover:bg-[var(--input-bg)] transition-colors select-none ${
          isNarrow && !collapsed ? 'flex-col gap-2 py-2.5 h-auto' : 'h-[40px] flex-row items-center justify-between'
        }`}
        onClick={onToggle}
      >
        {isNarrow && !collapsed ? (
          <>
            {/* Row 1 */}
            <div className="flex items-center justify-between w-full">
              <h3 className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
                <span className="text-blue-500">💻</span> {hasAlgorithmData ? (isPseudoCode ? 'Pseudo Code' : 'Java Source') : 'Source Code'}
              </h3>
              {hasAlgorithmData && steps.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="px-1.5 py-0.5 rounded-[4px] border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] font-mono text-[11px] font-medium" title="Time Complexity">
                    {algorithmCode[opKey].timeComplexity}
                  </div>
                  <div className="px-1.5 py-0.5 rounded-[4px] border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7] font-mono text-[11px] font-medium" title="Space Complexity">
                    {algorithmCode[opKey].spaceComplexity}
                  </div>
                </div>
              )}
            </div>
            
            {/* Row 2 */}
            <div className="flex items-center justify-between w-full border-t border-[var(--border-color)]/50 pt-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex-grow">
                {hasAlgorithmData && (
                  <div className="flex items-center bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[4px] p-[2px] w-fit">
                    <button 
                      onClick={() => setIsPseudoCode(true)}
                      className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors cursor-pointer ${isPseudoCode ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'}`}
                    >
                      Pseudo
                    </button>
                    <button 
                      onClick={() => setIsPseudoCode(false)}
                      className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors cursor-pointer ${!isPseudoCode ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'}`}
                    >
                      Java
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasAlgorithmData && <div className="h-4 w-[1px] bg-[var(--border-color)]" />}
                <CopyDownloadButtons algorithmKey={hasAlgorithmData ? opKey : null} />
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
              <span className="text-blue-500">💻</span> {hasAlgorithmData ? (isPseudoCode ? 'Pseudo Code' : 'Java Source') : 'Source Code'}
            </h3>
            
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {hasAlgorithmData && steps.length > 0 && !collapsed && (
                <div className="flex items-center gap-2 mr-1">
                  <div className="px-1.5 py-0.5 rounded-[4px] border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] font-mono text-[11px] font-medium" title="Time Complexity">
                    {algorithmCode[opKey].timeComplexity}
                  </div>
                  <div className="px-1.5 py-0.5 rounded-[4px] border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7] font-mono text-[11px] font-medium" title="Space Complexity">
                    {algorithmCode[opKey].spaceComplexity}
                  </div>
                </div>
              )}
              
              {!collapsed && (
                <>
                  {hasAlgorithmData && (
                    <div className="flex items-center bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[4px] p-[2px]">
                      <button 
                        onClick={() => setIsPseudoCode(true)}
                        className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors cursor-pointer ${isPseudoCode ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'}`}
                      >
                        Pseudo
                      </button>
                      <button 
                        onClick={() => setIsPseudoCode(false)}
                        className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors cursor-pointer ${!isPseudoCode ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'}`}
                      >
                        Java
                      </button>
                    </div>
                  )}
                  {hasAlgorithmData && <div className="h-4 w-[1px] bg-[var(--border-color)]" />}
                  <CopyDownloadButtons algorithmKey={hasAlgorithmData ? opKey : null} />
                </>
              )}
              <button onClick={() => onToggle()} className="text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors ml-1 cursor-pointer">
                <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {!collapsed && (
        <div 
          ref={codeScrollRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-3 text-[13px] font-mono leading-[1.7] custom-scrollbar bg-[var(--panel-bg)]"
        >
          {codeLines.length === 0 ? (
            <div className="text-[var(--muted-color)] text-center mt-4">No code available.</div>
          ) : (
            <div className="flex">
              {/* Line numbers */}
              <div className="flex flex-col text-right pr-3 mr-3 border-r border-[var(--border-color)] text-[13px] text-[var(--muted-color)]/60 select-none">
                {codeLines.map((_, i) => (
                  <div key={i} className="py-[2px]">{i + 1}</div>
                ))}
              </div>
              {/* Code text */}
              <div className="flex flex-col flex-1">
                {codeLines.map((line, idx) => {
                  const isActive = (idx + 1) === activeLine;
                  return (
                    <div 
                      key={idx} 
                      data-active={isActive}
                      data-active-line={isActive}
                      className={`py-[2px] pl-2 -ml-2 transition-colors duration-200 whitespace-pre border-l-[3px] ${
                        isActive 
                          ? 'bg-blue-500/10 text-[var(--text-color)] border-blue-500 font-semibold' 
                          : 'text-[var(--text-color)] border-transparent font-normal'
                      }`}
                    >
                      {syntaxHighlight(line)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
