import { useEffect, useRef, useState } from 'react';
import { useCycleStore } from '../../stores/useCycleStore';

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
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const traceContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[cur] || null;
  const activeLine = currentStep?.codeLineActive || 0;

  // Scroll active code line
  useEffect(() => {
    if (activeLine > 0 && codeContainerRef.current) {
      const activeEl = codeContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLine, activeRightTab, isPseudoCode]);

  // Scroll trace newest on top
  useEffect(() => {
    if (traceContainerRef.current) {
      traceContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [cur, activeRightTab]);

  if (activeRightTab === 'graph') {
    const parentSnapshot = currentStep?.parentSnapshot || {};
    const rankSnapshot = currentStep?.rankSnapshot || {};
    const visitedSnapshot = currentStep?.visitedSnapshot || [];
    const recStackSnapshot = currentStep?.recStackSnapshot || [];

    // Adjacency representation
    const adjList: Record<string, string[]> = {};
    nodes.forEach(n => adjList[n.id] = []);
    edges.forEach(e => {
      adjList[e.source].push(e.target);
    });

    const isDirected = algorithmType === 'directed';

    return (
      <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-6 custom-scrollbar h-full bg-[#0d0d0d]">
        {/* GRAPH INFO */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
            Graph Info
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider">Nodes</div>
              <div className="text-[15px] font-mono font-bold text-emerald-400">{nodes.length}</div>
            </div>
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider">Edges</div>
              <div className="text-[15px] font-mono font-bold text-emerald-400">{edges.length}</div>
            </div>
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider">Status</div>
              <div className="text-[11px] font-mono font-bold text-amber-400 truncate mt-1">
                {currentStep ? (currentStep.hasCycle ? '⚠️ Cycle' : currentStep.type === 'complete' ? '✓ Safe' : 'Checking...') : 'Idle'}
              </div>
            </div>
          </div>
        </div>

        {/* ALGORITHM SPECIFIC STATE */}
        {!isDirected ? (
          /* UNION-FIND STATE (UNDIRECTED) */
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
                Union-Find Table
              </h3>
              <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-black/10">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-[var(--input-bg)] border-b border-[var(--border-color)] text-[var(--muted-color)] text-[10px]">
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
                          <td className="px-3 py-1.5 font-bold">{n.id}</td>
                          <td className="px-3 py-1.5">{p}</td>
                          <td className="px-3 py-1.5">{r}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Union-Find Component Pills */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
                Connected Components
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentStep?.unionFindGroups ? (
                  Object.entries(currentStep.unionFindGroups).map(([root, members]) => (
                    <div
                      key={root}
                      className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-mono flex items-center gap-1.5"
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
        ) : (
          /* DFS STATE (DIRECTED) */
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
                Visited Array
              </h3>
              <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto pr-1">
                {nodes.map(n => {
                  const isVis = visitedSnapshot.includes(n.id);
                  const isCurrent = currentStep?.currentNode === n.id;
                  return (
                    <div
                      key={`vis-${n.id}`}
                      className={`flex items-center justify-between p-2 rounded-lg border border-[var(--border-color)] text-xs font-mono ${
                        isCurrent ? 'bg-[#FFB800]/10 border-amber-500/50' : 'bg-[var(--input-bg)]'
                      }`}
                    >
                      <span className={isCurrent ? 'text-amber-400 font-bold' : ''}>{n.id}</span>
                      <span className={isVis ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                        {isVis ? '[✓]' : '[ ]'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
                Recursion Stack
              </h3>
              <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto pr-1">
                {nodes.map(n => {
                  const inStack = recStackSnapshot.includes(n.id);
                  const isCurrent = currentStep?.currentNode === n.id;
                  return (
                    <div
                      key={`rec-${n.id}`}
                      className={`flex items-center justify-between p-2 rounded-lg border border-[var(--border-color)] text-xs font-mono ${
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
          </div>
        )}

        {/* CELL NEIGHBORS (ADJACENCY LIST) */}
        <div className="flex flex-col gap-2 flex-grow overflow-hidden min-h-[160px]">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
            Adjacency List
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin">
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
                  className={`flex items-center justify-between p-2 rounded-lg border border-[var(--border-color)] text-xs font-mono transition-all duration-200 ${bgClass}`}
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
                        const isEdgeActive = currentStep?.highlightEdges?.includes(edgeId);

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
        </div>
      </div>
    );
  }

  if (activeRightTab === 'code') {
    const isDirected = algorithmType === 'directed';
    const codeLines = isPseudoCode
      ? (isDirected ? pseudoCodeDirected : pseudoCodeUndirected)
      : (isDirected ? javaCodeDirected : javaCodeUndirected);

    return (
      <div className="flex-grow flex flex-col bg-[#0d0d0d] h-full">
        <div className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[#111] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-blue-500">💻</span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">
              {isPseudoCode ? 'Pseudo Code' : 'Java Source'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <div className="px-1.5 py-0.5 rounded-[4px] border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] font-mono text-[9px] uppercase font-bold tracking-wider" title="Time Complexity">
                {isDirected ? 'O(V + E)' : 'O(E·α(V))'}
              </div>
              <div className="px-1.5 py-0.5 rounded-[4px] border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7] font-mono text-[9px] uppercase font-bold tracking-wider" title="Space Complexity">
                O(V)
              </div>
            </div>

            <div className="flex items-center bg-[#222] rounded-[4px] p-[2px]">
              <button 
                onClick={() => setIsPseudoCode(true)}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] rounded-[3px] transition-colors ${isPseudoCode ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Pseudo
              </button>
              <button 
                onClick={() => setIsPseudoCode(false)}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] rounded-[3px] transition-colors ${!isPseudoCode ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Java
              </button>
            </div>
          </div>
        </div>

        <div ref={codeContainerRef} className="flex-1 overflow-y-auto p-3 text-[12px] font-mono leading-relaxed custom-scrollbar bg-[#0d0d0d]">
          <div className="flex">
            <div className="flex flex-col text-right pr-3 mr-3 border-r border-gray-800 text-[11px] text-gray-600 select-none">
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
      <div ref={traceContainerRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar h-full bg-[#0d0d0d]">
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
                className={`py-1.5 px-2.5 rounded-lg border font-mono text-[11px] leading-relaxed transition-all duration-200 flex gap-2.5 items-start ${
                  isActive 
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-sm' 
                    : 'bg-black/20 border-transparent hover:bg-black/30'
                }`}
                style={isActive ? { borderLeftWidth: '3px' } : {}}
              >
                <span className="shrink-0">{icon}</span>
                <div className="flex-1 flex flex-col">
                  <div className={`leading-normal ${typeColor}`}>
                    {s.description}
                  </div>
                  <span className="text-[9px] text-gray-600 mt-0.5">
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
    );
  }

  return null;
}
