import { useEffect, useRef, useState } from 'react';
import { useCycleStore } from '../../stores/useCycleStore';
import { VisitedArrayPanel } from '../../components/VisitedArrayPanel';
import { QueuePanel } from '../../components/QueuePanel';
import { CopyDownloadButtons } from '../../components/CopyDownloadButtons';

const pseudoCodeUndirected = [
  "hasCycle(n, edges):",
  "  initialize parent[i] = i for all i",
  "  initialize rank[i] = 0 for all i",
  "  for each edge (u, v):",
  "    pu = find(u)",
  "    pv = find(v)",
  "    if pu == pv:",
  "      return true  ← CYCLE DETECTED",
  "    union(pu, pv)",
  "  return false",
  "",
  "find(x):",
  "  if parent[x] != x:",
  "    parent[x] = find(parent[x])",
  "  return parent[x]",
  "",
  "union(x, y):",
  "  if rank[x] < rank[y]: parent[x] = y",
  "  elif rank[x] > rank[y]: parent[y] = x",
  "  else: parent[y] = x; rank[x]++"
];

const javaCodeUndirected = [
  "class Solution {",
  "    // Union-Find approach for undirected graph",
  "    int[] parent;",
  "    int[] rank;",
  "",
  "    public boolean hasCycle(int n, int[][] edges) {",
  "        parent = new int[n];",
  "        rank = new int[n];",
  "        for (int i = 0; i < n; i++) {",
  "            parent[i] = i;",
  "            rank[i] = 0;",
  "        }",
  "        for (int[] edge : edges) {",
  "            int u = edge[0];",
  "            int v = edge[1];",
  "            int pu = find(u);",
  "            int pv = find(v);",
  "            if (pu == pv) {",
  "                return true; // Cycle detected",
  "            }",
  "            union(pu, pv);",
  "        }",
  "        return false; // No cycle",
  "    }",
  "",
  "    private int find(int x) {",
  "        if (parent[x] != x) {",
  "            parent[x] = find(parent[x]);",
  "        }",
  "        return parent[x];",
  "    }",
  "",
  "    private void union(int x, int y) {",
  "        if (rank[x] < rank[y]) {",
  "            parent[x] = y;",
  "        } else if (rank[x] > rank[y]) {",
  "            parent[y] = x;",
  "        } else {",
  "            parent[y] = x;",
  "            rank[x]++;",
  "        }",
  "    }",
  "}"
];

const pseudoCodeDirected = [
  "hasCycle(n, adj):",
  "  visited[all] = false",
  "  recStack[all] = false",
  "  for each node i:",
  "    if not visited[i]:",
  "      if dfs(i, adj):",
  "        return true",
  "  return false",
  "",
  "dfs(node, adj):",
  "  visited[node] = true",
  "  recStack[node] = true",
  "  for each neighbor in adj[node]:",
  "    if not visited[neighbor]:",
  "      if dfs(neighbor, adj):",
  "        return true",
  "    elif recStack[neighbor]:",
  "      return true  ← BACK EDGE = CYCLE",
  "  recStack[node] = false",
  "  return false"
];

const javaCodeDirected = [
  "class Solution {",
  "    // DFS back-edge detection for directed graph",
  "    boolean[] visited;",
  "    boolean[] recStack;",
  "",
  "    public boolean hasCycle(int n, List<List<Integer>> adj) {",
  "        visited = new boolean[n];",
  "        recStack = new boolean[n];",
  "        for (int i = 0; i < n; i++) {",
  "            if (!visited[i]) {",
  "                if (dfs(i, adj)) {",
  "                    return true;",
  "                }",
  "            }",
  "        }",
  "        return false;",
  "    }",
  "",
  "    private boolean dfs(int node, List<List<Integer>> adj) {",
  "        visited[node] = true;",
  "        recStack[node] = true;",
  "        for (int neighbor : adj.get(node)) {",
  "            if (!visited[neighbor]) {",
  "                if (dfs(neighbor, adj)) {",
  "                    return true;",
  "                }",
  "            } else if (recStack[neighbor]) {",
  "                return true; // Back edge = cycle",
  "            }",
  "        }",
  "        recStack[node] = false;",
  "        return false;",
  "    }",
  "}"
];

const pseudoCodeUndirectedBfs = [
  "hasCycleBFS(n, adj):",
  "  visited[all] = false",
  "  parent[all] = -1",
  "  for each node i:",
  "    if not visited[i]:",
  "      if bfsCheck(i, adj, visited, parent):",
  "        return true",
  "  return false",
  "",
  "bfsCheck(start, adj, visited, parent):",
  "  queue.enqueue(start)",
  "  visited[start] = true",
  "  while queue is not empty:",
  "    node = queue.dequeue()",
  "    for each neighbor in adj[node]:",
  "      if not visited[neighbor]:",
  "        visited[neighbor] = true",
  "        parent[neighbor] = node",
  "        queue.enqueue(neighbor)",
  "      elif neighbor != parent[node]:",
  "        return true  ← CYCLE DETECTED",
  "  return false"
];

const javaCodeUndirectedBfs = [
  "class Solution {",
  "    public boolean hasCycle(int V, List<List<Integer>> adj) {",
  "        boolean[] visited = new boolean[V];",
  "        int[] parent = new int[V];",
  "        Arrays.fill(parent, -1);",
  "        for (int i = 0; i < V; i++) {",
  "            if (!visited[i]) {",
  "                if (bfsCheck(i, adj, visited, parent)) {",
  "                    return true;",
  "                }",
  "            }",
  "        }",
  "        return false;",
  "    }",
  "",
  "    private boolean bfsCheck(int start, List<List<Integer>> adj, ",
  "                            boolean[] visited, int[] parent) {",
  "        Queue<Integer> q = new LinkedList<>();",
  "        q.add(start);",
  "        visited[start] = true;",
  "        while (!q.isEmpty()) {",
  "            int node = q.poll();",
  "            for (int neighbor : adj.get(node)) {",
  "                if (!visited[neighbor]) {",
  "                    visited[neighbor] = true;",
  "                    parent[neighbor] = node;",
  "                    q.add(neighbor);",
  "                } else if (neighbor != parent[node]) {",
  "                    return true; // Cycle detected",
  "                }",
  "            }",
  "        }",
  "        return false;",
  "    }",
  "}"
];

const pseudoCodeDirectedBfs = [
  "detectCycleKahn(n, adj):",
  "  compute inDegree[i] for all nodes",
  "  enqueue all nodes with inDegree == 0",
  "  count = 0",
  "  while queue is not empty:",
  "    u = queue.dequeue()",
  "    topoOrder.append(u)",
  "    count++",
  "    for each neighbor v of u:",
  "      inDegree[v]--",
  "      if inDegree[v] == 0:",
  "        queue.enqueue(v)",
  "  if count < n:",
  "    return true  ← CYCLE DETECTED (stuck)",
  "  return false"
];

const javaCodeDirectedBfs = [
  "class Solution {",
  "    public boolean isCyclic(int V, List<List<Integer>> adj) {",
  "        int[] inDegree = new int[V];",
  "        for (int u = 0; u < V; u++) {",
  "            for (int v : adj.get(u)) {",
  "                inDegree[v]++;",
  "            }",
  "        }",
  "        Queue<Integer> q = new LinkedList<>();",
  "        for (int i = 0; i < V; i++) {",
  "            if (inDegree[i] == 0) {",
  "                q.add(i);",
  "            }",
  "        }",
  "        int count = 0;",
  "        List<Integer> topo = new ArrayList<>();",
  "        while (!q.isEmpty()) {",
  "            int u = q.poll();",
  "            topo.add(u);",
  "            count++;",
  "            for (int v : adj.get(u)) {",
  "                inDegree[v]--;",
  "                if (inDegree[v] == 0) {",
  "                    q.add(v);",
  "                }",
  "            }",
  "        }",
  "        if (count < V) {",
  "            return true; // Cycle detected",
  "        }",
  "        return false; // Valid DAG, no cycle",
  "    }",
  "}"
];

function syntaxHighlight(code: string, isJava: boolean) {
  if (!isJava) {
    if (code.trim().startsWith('//') || code.trim().startsWith('#')) {
      return <span className="text-gray-500 italic">{code}</span>;
    }
    const pseudoKeywords = ['for', 'each', 'if', 'return', 'while', 'in', 'initialize', 'all', 'not', 'elif', 'else'];
    const tokens = code.split(/([ \(\)\{\}\[\]\.\,;\<\>])/g);
    return tokens.map((token, i) => {
      if (pseudoKeywords.includes(token)) return <span key={i} className="text-blue-400">{token}</span>;
      if (token.includes('CYCLE DETECTED') || token.includes('CYCLE')) return <span key={i} className="text-red-400 font-bold">{token}</span>;
      return token;
    });
  }

  if (code.trim().startsWith('//')) {
    return <span className="text-gray-500 italic">{code}</span>;
  }
  const keywords = ['public', 'private', 'void', 'boolean', 'return', 'if', 'else', 'while', 'for', 'class', 'int', 'new', 'class'];
  const types = ['List', 'List<List<Integer>>', 'Integer', 'boolean[]', 'int[]'];
  const tokens = code.split(/([ \(\)\{\}\[\]\.\,;\<\>])/g);
  return tokens.map((token, i) => {
    if (keywords.includes(token)) return <span key={i} className="text-blue-400">{token}</span>;
    if (types.includes(token)) return <span key={i} className="text-emerald-400">{token}</span>;
    return token;
  });
}

export function CycleRightPanel({ activeRightTab }: { activeRightTab: 'graph' | 'code' | 'trace' }) {
  const { nodes, edges, steps, cur, algorithmType } = useCycleStore();
  const [isPseudoCode, setIsPseudoCode] = useState(true);
  const [adjCollapsed, setAdjCollapsed] = useState(true);
  const [panelWidth, setPanelWidth] = useState(350);

  const [showTracePill, setShowTracePill] = useState(false);
  const userScrolledUp = useRef<boolean>(false);
  const scrollPositions = useRef({
    graph: 0,
    code: 0,
    trace: 0
  });

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const traceContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);

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

  const currentStep = steps[cur] || null;
  const activeLine = currentStep?.codeLineActive || 0;

  // Handle manual scroll in TRACE tab
  const handleTraceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    scrollPositions.current.trace = el.scrollTop;
    
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    userScrolledUp.current = !isAtBottom;
    setShowTracePill(!isAtBottom);
  };

  // Scroll to active trace step
  const handleScrollToActiveTrace = () => {
    userScrolledUp.current = false;
    setShowTracePill(false);
    if (traceContainerRef.current) {
      const activeEntry = traceContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        const container = traceContainerRef.current;
        const elementTop = activeEntry.offsetTop;
        const elementHeight = activeEntry.offsetHeight;
        const containerHeight = container.clientHeight;
        
        if (elementTop + elementHeight > container.scrollTop + containerHeight) {
          container.scrollTo({
            top: elementTop - containerHeight + elementHeight,
            behavior: 'smooth'
          });
        } else if (elementTop < container.scrollTop) {
          container.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // Auto-scroll trace when step changes
  useEffect(() => {
    if (!traceContainerRef.current) return;
    if (userScrolledUp.current) return;
    
    const activeEntry = traceContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeEntry) {
      const container = traceContainerRef.current;
      const elementTop = activeEntry.offsetTop;
      const elementHeight = activeEntry.offsetHeight;
      const containerHeight = container.clientHeight;
      
      if (elementTop + elementHeight > container.scrollTop + containerHeight) {
        container.scrollTo({
          top: elementTop - containerHeight + elementHeight,
          behavior: 'smooth'
        });
      } else if (elementTop < container.scrollTop) {
        container.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }
  }, [cur]);

  // Reset userScrolledUp when a new algorithm starts
  const stepsLength = steps.length;
  const firstStepId = stepsLength > 0 ? steps[0].id : null;
  useEffect(() => {
    userScrolledUp.current = false;
    setShowTracePill(false);
    if (traceContainerRef.current) {
      traceContainerRef.current.scrollTop = 0;
    }
  }, [firstStepId]);

  // Reset userScrolledUp when user switches to TRACE tab
  useEffect(() => {
    if (activeRightTab === 'trace') {
      userScrolledUp.current = false;
      setShowTracePill(false);
    }
  }, [activeRightTab]);

  // Smooth scroll active line during normal playback
  useEffect(() => {
    if (activeRightTab === 'code' && codeContainerRef.current) {
      const activeLineEl = codeContainerRef.current.querySelector('[data-active-line="true"]') as HTMLElement;
      if (activeLineEl) {
        const container = codeContainerRef.current;
        const targetScrollTop = activeLineEl.offsetTop - (container.clientHeight / 2) + (activeLineEl.offsetHeight / 2);
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeLine]);

  // Tab Switch Scroll Memory and Restoration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeRightTab === 'graph' && graphContainerRef.current) {
        graphContainerRef.current.scrollTop = scrollPositions.current.graph;
      } else if (activeRightTab === 'code' && codeContainerRef.current) {
        const activeLineEl = codeContainerRef.current.querySelector('[data-active-line="true"]') as HTMLElement;
        if (activeLineEl) {
          const container = codeContainerRef.current;
          const targetScrollTop = activeLineEl.offsetTop - (container.clientHeight / 2) + (activeLineEl.offsetHeight / 2);
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'instant' as any
          });
        } else {
          codeContainerRef.current.scrollTop = scrollPositions.current.code;
        }
      } else if (activeRightTab === 'trace' && traceContainerRef.current) {
        if (!userScrolledUp.current) {
          const activeEntry = traceContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
          if (activeEntry) {
            const container = traceContainerRef.current;
            const elementTop = activeEntry.offsetTop;
            const elementHeight = activeEntry.offsetHeight;
            const containerHeight = container.clientHeight;
            
            if (elementTop + elementHeight > container.scrollTop + containerHeight) {
              container.scrollTo({
                top: elementTop - containerHeight + elementHeight,
                behavior: 'instant' as any
              });
            } else if (elementTop < container.scrollTop) {
              container.scrollTo({
                top: elementTop,
                behavior: 'instant' as any
              });
            }
          } else {
            traceContainerRef.current.scrollTop = 0;
          }
        } else {
          traceContainerRef.current.scrollTop = scrollPositions.current.trace;
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeRightTab]);

  if (activeRightTab === 'graph') {
    const parentSnapshot = currentStep?.parentSnapshot || {};
    const rankSnapshot = currentStep?.rankSnapshot || {};
    const recStackSnapshot = currentStep?.recStackSnapshot || [];

    // Adjacency representation
    const adjList: Record<string, string[]> = {};
    nodes.forEach(n => adjList[n.id] = []);
    edges.forEach(e => {
      adjList[e.source].push(e.target);
      if (!algorithmType.startsWith('directed')) {
        adjList[e.target].push(e.source);
      }
    });


    return (
      <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 custom-scrollbar h-full bg-[var(--panel-bg)] font-sans">
        {/* GRAPH INFO */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
            Graph Info
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">Nodes</div>
              <div className="text-[14px] font-mono font-bold text-emerald-400 mt-0.5">{nodes.length}</div>
            </div>
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">Edges</div>
              <div className="text-[14px] font-mono font-bold text-emerald-400 mt-0.5">{edges.length}</div>
            </div>
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">Status</div>
              <div className="text-[11px] font-mono font-bold text-amber-400 truncate mt-1">
                {currentStep ? (currentStep.hasCycle ? '⚠️ Cycle' : currentStep.type === 'complete' ? '✓ Safe' : 'Checking...') : 'Idle'}
              </div>
            </div>
          </div>
        </div>

        {/* UNIFIED VISITED ARRAY */}
        {algorithmType !== 'undirected-union-find' && (
          <VisitedArrayPanel
            nodes={nodes.map(n => ({ id: n.id, label: n.label || n.id }))}
            visitedOrder={currentStep?.auxiliaryState?.visitedOrder || []}
            currentNode={currentStep?.currentNode || currentStep?.nodeA || null}
            mode={algorithmType === 'directed-bfs' ? 'indegree' : 'default'}
            extraData={algorithmType === 'directed-bfs' ? currentStep?.inDegreeSnapshot : undefined}
          />
        )}

        {/* UNIFIED BFS QUEUE / DFS STACK */}
        {algorithmType === 'undirected-bfs' && (
          <QueuePanel
            type="bfs-parent"
            items={currentStep?.queueSnapshot || []}
            formatItem={({node, parent}) =>
              parent === '-1'
                ? `${node}(src)`
                : `${node}(p=${parent})`}
          />
        )}
        {algorithmType === 'directed-bfs' && (
          <QueuePanel
            type="topo"
            title="TOPO QUEUE"
            items={currentStep?.queueSnapshot || []}
            formatItem={(n) => n}
          />
        )}
        {algorithmType === 'directed-dfs' && (
          <QueuePanel
            type="dfs-stack"
            items={currentStep?.queueSnapshot || []}
            formatItem={(n) => `dfs(${n})`}
          />
        )}

        {/* ALGORITHM SPECIFIC STATE */}
        {algorithmType === 'undirected-union-find' && (
          /* UNION-FIND STATE (UNDIRECTED) */
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
                Union-Find Table
              </h3>
              <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-black/10">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-[var(--input-bg)] border-b border-[var(--border-color)] text-[var(--muted-color)] text-[10px] font-sans font-semibold uppercase tracking-[0.06em]">
                      <th className="px-3 py-1.5 text-left">NODE</th>
                      <th className="px-3 py-1.5 text-left">PARENT</th>
                      <th className="px-3 py-1.5 text-left">RANK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map(n => {
                      const p = parentSnapshot[n.id] ?? n.id;
                      const r = rankSnapshot[n.id] ?? 0;
                      const isNodeActive = currentStep?.nodeA === n.id || currentStep?.nodeB === n.id;

                      return (
                        <tr
                          key={n.id}
                          className={`border-b border-[var(--border-color)]/30 hover:bg-black/20 ${
                            isNodeActive ? 'bg-[#FFB800]/10 border-l-[3px] border-l-amber-500' : ''
                          }`}
                        >
                          <td className="px-3 py-1.5 font-mono font-semibold">{n.id}</td>
                          <td className="px-3 py-1.5 font-mono font-normal">{p}</td>
                          <td className="px-3 py-1.5 font-mono font-normal">{r}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Union-Find Component Pills */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
                Connected Components
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentStep?.unionFindGroups ? (
                  Object.entries(currentStep.unionFindGroups).map(([root, members]) => (
                    <div
                      key={root}
                      className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-[12px] font-mono font-medium flex items-center gap-1.5"
                    >
                      <span className="font-bold text-blue-400">{root}</span>
                      <span className="text-[var(--muted-color)]">:</span>
                      <span className="text-white">{'{'}{members.join(', ')}{'}'}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-[11px] text-[var(--muted-color)] italic">Not initialized</span>
                )}
              </div>
            </div>
          </div>
        )}

        {algorithmType === 'undirected-bfs' && (
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
              Parent Map
            </h3>
            <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-black/10">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-[var(--input-bg)] border-b border-[var(--border-color)] text-[var(--muted-color)] text-[10px] font-sans font-semibold uppercase tracking-[0.06em]">
                    <th className="px-3 py-1.5 text-left">NODE</th>
                    <th className="px-3 py-1.5 text-left">PARENT</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map(n => {
                    const p = currentStep?.parentTrackingMap?.[n.id] ?? 'none';
                    const isNodeActive = currentStep?.currentNode === n.id || currentStep?.neighborNode === n.id;
                    return (
                      <tr
                        key={n.id}
                        className={`border-b border-[var(--border-color)]/30 hover:bg-black/20 ${
                          isNodeActive ? 'bg-[#FFB800]/10 border-l-[3px] border-l-amber-500' : ''
                        }`}
                      >
                        <td className="px-3 py-1.5 font-mono font-semibold">{n.id}</td>
                        <td className="px-3 py-1.5 font-mono font-normal">{p}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {algorithmType === 'directed-dfs' && (
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
              Recursion Stack Status
            </h3>
            <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto pr-1">
              {nodes.map(n => {
                const inStack = recStackSnapshot.includes(n.id);
                const isCurrent = currentStep?.currentNode === n.id;
                return (
                  <div
                    key={`rec-${n.id}`}
                    className={`flex items-center justify-between p-2 rounded-lg border border-[var(--border-color)] text-[13px] font-mono ${
                      isCurrent ? 'bg-[#FFB800]/10 border-amber-500/50' : 'bg-[var(--input-bg)]'
                    }`}
                  >
                    <span className={isCurrent ? 'text-amber-400 font-bold' : ''}>{n.id}</span>
                    <span className={inStack ? 'text-purple-400 font-bold animate-pulse' : 'text-[var(--muted-color)]'}>
                      {inStack ? '[IN STACK]' : '[ ]'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {algorithmType === 'directed-bfs' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
                In-Degree Table
              </h3>
              <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-black/10">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-[var(--input-bg)] border-b border-[var(--border-color)] text-[var(--muted-color)] text-[10px] font-sans font-semibold uppercase tracking-[0.06em]">
                      <th className="px-3 py-1.5 text-left">NODE</th>
                      <th className="px-3 py-1.5 text-left">IN-DEGREE</th>
                      <th className="px-3 py-1.5 text-left">STATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map(n => {
                      const initialInDegree = edges.filter(e => e.target === n.id).length;
                      const deg = currentStep?.inDegreeSnapshot?.[n.id] ?? initialInDegree;
                      const topo = currentStep?.topoOrder || [];
                      const queueSnapshot = currentStep?.queueSnapshot || [];
                      const isProcessed = topo.includes(n.id);
                      const isInQueue = queueSnapshot.includes(n.id);
                      
                      let stateText = 'Unprocessed';
                      let stateColor = 'text-gray-400';
                      if (isProcessed) {
                        stateText = 'Processed';
                        stateColor = 'text-emerald-400 font-bold';
                      } else if (isInQueue) {
                        stateText = 'In Queue';
                        stateColor = 'text-purple-400 font-bold animate-pulse';
                      }

                      const isNodeActive = currentStep?.currentNode === n.id || currentStep?.neighborNode === n.id;

                      return (
                        <tr
                          key={n.id}
                          className={`border-b border-[var(--border-color)]/30 hover:bg-black/20 ${
                            isNodeActive ? 'bg-[#FFB800]/10 border-l-[3px] border-l-amber-500' : ''
                          }`}
                        >
                          <td className="px-3 py-1.5 font-mono font-semibold">{n.id}</td>
                          <td className="px-3 py-1.5 font-mono font-normal">{deg}</td>
                          <td className={`px-3 py-1.5 ${stateColor}`}>{stateText}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Topological List */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
                Topological Order
              </h3>
              <div className="flex flex-wrap gap-2 items-center min-h-[40px] bg-black/10 border border-[var(--border-color)] rounded-lg p-2.5">
                {currentStep?.topoOrder && currentStep.topoOrder.length > 0 ? (
                  currentStep.topoOrder.map((node, idx) => (
                    <div key={node} className="flex items-center gap-1">
                      <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded font-mono text-xs font-bold animate-[nodeFadeInGreen_0.3s_ease-out_forwards]">
                        {node}
                      </span>
                      {idx < currentStep.topoOrder!.length - 1 && <span className="text-gray-600 text-xs">→</span>}
                    </div>
                  ))
                ) : (
                  <span className="text-[11px] text-[var(--muted-color)] italic">No nodes processed yet</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CELL NEIGHBORS (ADJACENCY LIST) */}
        <div className="w-full flex flex-col bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden shrink-0">
          <div
            className="h-[36px] px-3 flex items-center justify-between bg-[var(--pill-bg)] cursor-pointer hover:bg-[var(--border-color)]/30 transition-colors select-none"
            onClick={() => setAdjCollapsed(c => !c)}
          >
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2 font-sans">
              <span>🔗</span> ADJACENCY LIST
            </h3>
            <button className="text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors">
              <svg
                className={`w-3.5 h-3.5 transform transition-transform duration-200 ${adjCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {!adjCollapsed && (
            <div className="p-2 flex flex-col gap-1.5 max-h-[200px] overflow-y-auto custom-scrollbar">
              {nodes.map((node) => {
                const neighbors = adjList[node.id] || [];
                const isCurrent = currentStep?.currentNode === node.id || currentStep?.nodeA === node.id;
                
                let bgClass = "bg-[var(--input-bg)]";
                let borderStyle = {};
                if (isCurrent) {
                  bgClass = "bg-[#FFB800]/10";
                  borderStyle = { borderLeft: "3px solid #FFB800" };
                }

                return (
                  <div
                    key={`adj-${node.id}`}
                    className={`flex items-center justify-between p-2 rounded-lg border border-[var(--border-color)] text-[13px] font-mono transition-all duration-200 ${bgClass}`}
                    style={borderStyle}
                  >
                    <span className={`font-bold ${isCurrent ? 'text-[#FFB800]' : 'text-emerald-400'}`}>
                      {node.id}
                    </span>
                    <span className="text-[var(--muted-color)]">→</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                      {neighbors.length > 0 ? (
                        neighbors.map((neighbor) => {
                          const edgeId = `${node.id}-${neighbor}`;
                          const isEdgeActive = currentStep?.highlightEdges?.includes(edgeId) || 
                            (currentStep?.highlightEdges && currentStep.highlightEdges.includes(`${neighbor}-${node.id}`));

                          let pillBg = "bg-black/30";
                          let pillColor = "text-[var(--muted-color)]";

                          if (isEdgeActive) {
                            pillBg = "bg-[#FF8C00]/15";
                            pillColor = "text-[#FF8C00]";
                          }

                          return (
                            <span
                              key={`n-${neighbor}`}
                              className={`px-1.5 py-0.5 rounded text-[10px] border border-[var(--border-color)] ${pillColor} ${pillBg}`}
                            >
                              {neighbor}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-gray-600 italic">none</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeRightTab === 'code') {
    let codeLines = pseudoCodeUndirected;
    if (isPseudoCode) {
      if (algorithmType === 'undirected-union-find') codeLines = pseudoCodeUndirected;
      else if (algorithmType === 'undirected-bfs') codeLines = pseudoCodeUndirectedBfs;
      else if (algorithmType === 'directed-dfs') codeLines = pseudoCodeDirected;
      else if (algorithmType === 'directed-bfs') codeLines = pseudoCodeDirectedBfs;
    } else {
      if (algorithmType === 'undirected-union-find') codeLines = javaCodeUndirected;
      else if (algorithmType === 'undirected-bfs') codeLines = javaCodeUndirectedBfs;
      else if (algorithmType === 'directed-dfs') codeLines = javaCodeDirected;
      else if (algorithmType === 'directed-bfs') codeLines = javaCodeDirectedBfs;
    }

    return (
      <div ref={outerContainerRef} className="flex-grow flex flex-col bg-[var(--panel-bg)] min-h-0 overflow-hidden font-sans" style={{ height: 0 }}>
        <div 
          className={`px-3 flex border-b border-[var(--border-color)] bg-[var(--panel-bg)] shrink-0 ${
            isNarrow ? 'flex-col gap-2 py-2.5 h-auto' : 'h-[40px] flex-row items-center justify-between'
          }`}
        >
          {isNarrow ? (
            <>
              {/* Row 1 */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">💻</span>
                  <span className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">
                    {isPseudoCode ? 'Pseudo Code' : 'Java Source'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-1.5 py-0.5 rounded-[4px] border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] font-mono text-[9px] uppercase font-bold tracking-wider" title="Time Complexity">
                    {algorithmType === 'undirected-union-find' ? 'O(E·α(V))' : 'O(V + E)'}
                  </div>
                  <div className="px-1.5 py-0.5 rounded-[4px] border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7] font-mono text-[9px] uppercase font-bold tracking-wider" title="Space Complexity">
                    O(V)
                  </div>
                </div>
              </div>
              
              {/* Row 2 */}
              <div className="flex items-center justify-between w-full border-t border-[var(--border-color)]/50 pt-2">
                <div className="flex items-center bg-[var(--input-bg)] rounded-[4px] p-[2px]">
                  <button 
                    onClick={() => setIsPseudoCode(true)}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors ${isPseudoCode ? 'bg-[var(--surface-elevated)] text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Pseudo
                  </button>
                  <button 
                    onClick={() => setIsPseudoCode(false)}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors ${!isPseudoCode ? 'bg-[var(--surface-elevated)] text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Java
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-[1px] bg-[var(--border-color)]" />
                  <CopyDownloadButtons algorithmKey={algorithmType} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">💻</span>
                <span className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">
                  {isPseudoCode ? 'Pseudo Code' : 'Java Source'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 mr-2">
                  <div className="px-1.5 py-0.5 rounded-[4px] border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] font-mono text-[9px] uppercase font-bold tracking-wider" title="Time Complexity">
                    {algorithmType === 'undirected-union-find' ? 'O(E·α(V))' : 'O(V + E)'}
                  </div>
                  <div className="px-1.5 py-0.5 rounded-[4px] border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7] font-mono text-[9px] uppercase font-bold tracking-wider" title="Space Complexity">
                    O(V)
                  </div>
                </div>

                <div className="flex items-center bg-[var(--input-bg)] rounded-[4px] p-[2px]">
                  <button 
                    onClick={() => setIsPseudoCode(true)}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors ${isPseudoCode ? 'bg-[var(--surface-elevated)] text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Pseudo
                  </button>
                  <button 
                    onClick={() => setIsPseudoCode(false)}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors ${!isPseudoCode ? 'bg-[var(--surface-elevated)] text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Java
                  </button>
                </div>
                <div className="h-4 w-[1px] bg-[var(--border-color)]" />
                <CopyDownloadButtons algorithmKey={algorithmType} />
              </div>
            </>
          )}
        </div>

        <div 
          ref={codeContainerRef} 
          onScroll={(e) => {
            scrollPositions.current.code = e.currentTarget.scrollTop;
          }}
          className="flex-1 overflow-y-auto p-3 text-[13px] font-mono font-normal leading-[1.7] custom-scrollbar bg-[var(--bg-primary)]"
        >
          <div className="flex">
            <div className="flex flex-col text-right pr-3 mr-3 border-r border-gray-800 text-[11px] text-[var(--muted-color)] font-mono select-none">
              {codeLines.map((_, i) => (
                <div key={i} className="py-[2px]">{i + 1}</div>
              ))}
            </div>
            <div className="flex flex-col flex-1">
              {codeLines.map((line, idx) => {
                const isActive = (idx + 1) === activeLine;
                return (
                  <div 
                    key={idx} 
                    data-active={isActive}
                    data-active-line={isActive}
                    className={`py-[2px] pl-2 -ml-2 transition-colors duration-200 whitespace-pre ${
                      isActive 
                        ? 'bg-blue-500/20 text-gray-100 border-l-[3px] border-blue-500' 
                        : 'text-gray-300 border-l-[3px] border-transparent'
                    }`}
                  >
                    {syntaxHighlight(line, !isPseudoCode)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeRightTab === 'trace') {
    return (
      <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden" style={{ height: 0 }}>
        <div 
          ref={traceContainerRef} 
          onScroll={handleTraceScroll}
          className="flex-grow overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar bg-[var(--panel-bg)] min-h-0"
        >
          {steps.length > 0 ? (
            steps.slice(0, cur + 1).slice().reverse().map((s, reverseIdx) => {
              const idx = cur - reverseIdx;
              const isActive = idx === cur;
              let icon = "🔍";
              let typeColor = "text-[var(--text-color)]";

              if (s.type === 'cycle-found' || s.type === 'back-edge-found') {
                icon = "⚠️";
                typeColor = "text-[#DC2626] font-bold";
              } else if (s.type === 'process-edge' || s.type === 'dfs-neighbor') {
                icon = "👉";
                typeColor = "text-[#FF8C00]";
              } else if (s.type === 'dfs-enter') {
                icon = "📥";
                typeColor = "text-[#7C3AED]";
              } else if (s.type === 'dfs-exit') {
                icon = "📤";
                typeColor = "text-purple-400";
              } else if (s.type === 'union') {
                icon = "🤝";
                typeColor = "text-blue-400";
              } else if (s.type === 'complete' || s.type === 'no-cycle') {
                icon = "✅";
                typeColor = "text-[#00C896] font-extrabold";
              }

              return (
                <div
                  key={`trace-${s.id}`}
                  data-active-trace={isActive}
                  data-active={isActive}
                  className={`py-1.5 px-2.5 rounded-lg border font-mono text-[12px] font-normal leading-[1.6] transition-all duration-200 flex gap-2.5 items-start ${
                    isActive 
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-sm font-semibold' 
                      : 'bg-[var(--input-bg)] border-[var(--border-color)] hover:bg-black/20 font-normal'
                  }`}
                  style={isActive ? { borderLeftWidth: '3px' } : {}}
                >
                  <span className="shrink-0">{icon}</span>
                  <div className="flex-1 flex flex-col">
                    <div className={`leading-normal ${typeColor}`}>
                      {s.description}
                    </div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.06em] text-[var(--muted-color)] mt-0.5">
                      Step {s.id + 1} • Line {s.codeLineActive}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-[11px] text-[var(--muted-color)] italic text-center mt-4">
              Run algorithm to see trace entries
            </div>
          )}
        </div>
        {showTracePill && (
          <button
            onClick={handleScrollToActiveTrace}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#3b82f6]/90 border border-[#3b82f6] rounded-full px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-[0.06em] cursor-pointer z-10 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:bg-[#3b82f6] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ↓ Jump to current step
          </button>
        )}
      </div>
    );
  }

  return null;
}
