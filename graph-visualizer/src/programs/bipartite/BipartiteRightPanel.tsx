import { useEffect, useRef, useState } from 'react';
import { useBipartiteStore } from '../../stores/useBipartiteStore';

const pseudoCode = [
  "isBipartite(V, adj):",
  "  color[all] = -1  (uncolored)",
  "  for each node i:",
  "    if color[i] == -1:",
  "      if check(i, adj, color) == false:",
  "        return false",
  "  return true",
  "",
  "check(start, adj, color):",
  "  color[start] = 0  (Yellow group)",
  "  enqueue start",
  "  while queue not empty:",
  "    node = dequeue",
  "    for each neighbor it of node:",
  "      if color[it] == -1:",
  "        color[it] = 1 - color[node]",
  "        enqueue it",
  "      elif color[it] == color[node]:",
  "        return false  ← NOT BIPARTITE",
  "  return true"
];

const javaCode = [
  "private boolean check(int start, int V,",
  "    ArrayList<ArrayList<Integer>> adj,",
  "    int color[]) {",
  "  Queue<Integer> q = new LinkedList<>();",
  "  q.add(start);",
  "  color[start] = 0;",
  "  while (!q.isEmpty()) {",
  "    int node = q.peek();",
  "    q.remove();",
  "    for (int it : adj.get(node)) {",
  "      if (color[it] == -1) {",
  "        color[it] = 1 - color[node];",
  "        q.add(it);",
  "      }",
  "      else if (color[it] == color[node]) {",
  "        return false;",
  "      }",
  "    }",
  "  }",
  "  return true;",
  "}",
  "",
  "public boolean isBipartite(int V,",
  "  ArrayList<ArrayList<Integer>> adj) {",
  "  int color[] = new int[V];",
  "  for (int i = 0; i < V; i++)",
  "    color[i] = -1;",
  "  for (int i = 0; i < V; i++) {",
  "    if (color[i] == -1) {",
  "      if (check(i, V, adj, color)",
  "          == false) {",
  "        return false;",
  "      }",
  "    }",
  "  }",
  "  return true;",
  "}"
];

const mapJavaToPseudo = (javaLine: number): number => {
  switch (javaLine) {
    case 27: return 2;
    case 28: return 3;
    case 29: return 4;
    case 30: return 5;
    case 32: return 6;
    case 36: return 7;
    case 6: return 10;
    case 5: return 11;
    case 7: return 12;
    case 8: return 13;
    case 9: return 13;
    case 10: return 14;
    case 11: return 15;
    case 12: return 16;
    case 13: return 17;
    case 15: return 18;
    case 16: return 19;
    case 20: return 20;
    default: return 1;
  }
};

export function BipartiteRightPanel({ activeRightTab }: { activeRightTab: 'graph' | 'code' | 'trace' }) {
  const nodes = useBipartiteStore((state) => state.nodes);
  const edges = useBipartiteStore((state) => state.edges);
  const directed = useBipartiteStore((state) => state.directed);
  const steps = useBipartiteStore((state) => state.steps);
  const cur = useBipartiteStore((state) => state.cur);

  const [isPseudoCode, setIsPseudoCode] = useState(true);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const activeRowRef = useRef<HTMLTableRowElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const activeCodeLineRef = useRef<HTMLDivElement>(null);
  const traceContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = steps.length > 0 && cur >= 0 && cur < steps.length ? steps[cur] : null;

  // Auto-scroll table row
  useEffect(() => {
    if (activeRowRef.current && tableContainerRef.current) {
      activeRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentStep?.currentNode]);

  // Auto-scroll active code line
  useEffect(() => {
    if (activeCodeLineRef.current && codeContainerRef.current) {
      activeCodeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentStep?.codeLineActive, isPseudoCode]);

  // Auto-scroll trace log to bottom
  useEffect(() => {
    if (traceContainerRef.current) {
      traceContainerRef.current.scrollTop = traceContainerRef.current.scrollHeight;
    }
  }, [cur, steps.length]);

  // Adjacency list mapping
  const adjList: Record<string, string[]> = {};
  nodes.forEach((n) => (adjList[n.id] = []));
  edges.forEach((e) => {
    if (adjList[e.source]) adjList[e.source].push(e.target);
    if (!directed && adjList[e.target]) adjList[e.target].push(e.source);
  });
  Object.keys(adjList).forEach((k) => adjList[k].sort());

  // BFS Queue pills helper
  const queueSnapshot = currentStep?.queueSnapshot || [];
  const colorMap = currentStep?.colorSnapshot || {};
  const group0 = currentStep?.group0Nodes || [];
  const group1 = currentStep?.group1Nodes || [];

  if (activeRightTab === 'graph') {
    let statusText = 'Checking...';
    let statusColor = 'text-amber-400';
    if (currentStep) {
      if (currentStep.isBipartite === true) {
        statusText = '✓ Bipartite';
        statusColor = 'text-[#00C896]';
      } else if (currentStep.isBipartite === false) {
        statusText = '✗ Not Bipartite';
        statusColor = 'text-red-400';
      }
    }

    return (
      <div className="flex-grow flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar h-full">
        {/* GRAPH INFO */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
            Graph Info
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--input-bg)] p-3 rounded-lg border border-[var(--border-color)]">
            <div className="flex justify-between">
              <span className="text-[var(--muted-color)]">NODES:</span>
              <span className="font-bold text-white">{nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-color)]">EDGES:</span>
              <span className="font-bold text-white">{edges.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-color)]">TYPE:</span>
              <span className="font-bold text-white">{directed ? 'Directed' : 'Undirected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-color)]">STATUS:</span>
              <span className={`font-bold ${statusColor}`}>{statusText}</span>
            </div>
          </div>
        </div>

        {/* COLOR ASSIGNMENT TABLE */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
            Color Assignment
          </h3>
          <div
            ref={tableContainerRef}
            className="overflow-x-auto border border-[var(--border-color)] rounded-lg max-h-[160px] custom-scrollbar"
          >
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111] text-[var(--muted-color)] border-b border-[var(--border-color)]">
                <tr>
                  <th className="px-3 py-1.5 font-bold uppercase tracking-wider">Node</th>
                  <th className="px-3 py-1.5 font-bold uppercase tracking-wider">Color</th>
                  <th className="px-3 py-1.5 font-bold uppercase tracking-wider">Group</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] bg-[var(--input-bg)]">
                {nodes.map((node) => {
                  const colorVal = colorMap[node.id] !== undefined ? colorMap[node.id] : -1;
                  const isCurrent = currentStep?.currentNode === node.id;

                  let colorText = '—';
                  let colorClass = 'text-[var(--muted-color)]';
                  if (colorVal === 0) {
                    colorText = '0';
                    colorClass = 'text-[#FFB800] font-bold';
                  } else if (colorVal === 1) {
                    colorText = '1';
                    colorClass = 'text-[#FF6B00] font-bold';
                  }

                  let groupDot = '⬜';
                  let groupName = 'Uncolored';
                  let groupClass = 'text-[var(--muted-color)]';
                  if (colorVal === 0) {
                    groupDot = '🟡';
                    groupName = 'Yellow';
                    groupClass = 'text-[#FFB800]';
                  } else if (colorVal === 1) {
                    groupDot = '🟠';
                    groupName = 'Orange';
                    groupClass = 'text-[#FF6B00]';
                  }

                  return (
                    <tr
                      key={`table-row-${node.id}`}
                      ref={isCurrent ? activeRowRef : null}
                      className={`transition-colors duration-150 ${
                        isCurrent ? 'bg-[#FFB800]/10 border-l-[3px] border-[#FFB800]' : ''
                      }`}
                    >
                      <td className="px-3 py-1.5 text-white font-bold">{node.id}</td>
                      <td className={`px-3 py-1.5 ${colorClass}`}>{colorText}</td>
                      <td className={`px-3 py-1.5 ${groupClass}`}>
                        <span className="mr-1">{groupDot}</span>
                        {groupName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* BFS QUEUE */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-1">
            <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">
              BFS Queue
            </h3>
            {queueSnapshot.length > 0 && (
              <span className="text-[10px] font-bold text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">
                Size: {queueSnapshot.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 p-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg min-h-[48px] overflow-x-auto custom-scrollbar">
            {queueSnapshot.length > 0 ? (
              queueSnapshot.map((nodeId, idx) => {
                const colorVal = colorMap[nodeId];
                let pillClass = 'border-[var(--border-color)] bg-black/30';
                if (colorVal === 0) {
                  pillClass = 'border-[#FFB800] bg-[#FFB800]/20 text-[#FFB800]';
                } else if (colorVal === 1) {
                  pillClass = 'border-[#FF6B00] bg-[#FF6B00]/20 text-[#FF6B00]';
                }

                return (
                  <div key={`queue-pill-${nodeId}-${idx}`} className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-bold font-mono ${pillClass}`}>
                      {nodeId}
                    </span>
                    {idx < queueSnapshot.length - 1 && (
                      <span className="text-gray-600 text-xs">←</span>
                    )}
                  </div>
                );
              })
            ) : (
              <span className="text-[11px] text-[var(--muted-color)] italic">Queue empty</span>
            )}
          </div>
        </div>

        {/* GROUP SUMMARY */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
            Groups
          </h3>
          <div className="grid grid-cols-2 gap-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-3">
            {/* Group 0: Yellow */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-[#FFB800] flex items-center gap-1">
                🟡 GROUP 0
              </span>
              <span className="text-[9px] text-[var(--muted-color)] uppercase tracking-wider">
                Yellow
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {group0.length > 0 ? (
                  group0.map((id) => (
                    <span
                      key={`g0-pill-${id}`}
                      className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30 animate-fadeInUp"
                    >
                      {id}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-[var(--muted-color)] italic">Empty</span>
                )}
              </div>
            </div>

            {/* Group 1: Orange */}
            <div className="flex flex-col gap-1.5 border-l border-[var(--border-color)] pl-3">
              <span className="text-[11px] font-bold text-[#FF6B00] flex items-center gap-1">
                🟠 GROUP 1
              </span>
              <span className="text-[9px] text-[var(--muted-color)] uppercase tracking-wider">
                Orange
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {group1.length > 0 ? (
                  group1.map((id) => (
                    <span
                      key={`g1-pill-${id}`}
                      className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 animate-fadeInUp"
                    >
                      {id}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-[var(--muted-color)] italic">Empty</span>
                )}
              </div>
            </div>
          </div>

          {/* Conflict details inside groups */}
          {currentStep?.type === 'conflict-found' && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-2.5 text-xs text-red-400 font-semibold text-center mt-1 animate-[shake_0.3s_ease-in-out]">
              ⚠️ Conflict: {currentStep.currentNode} and {currentStep.neighborNode} both in{' '}
              {colorMap[currentStep.currentNode!] === 0 ? 'Yellow group' : 'Orange group'}!
            </div>
          )}
        </div>

        {/* ADJACENCY LIST */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em] border-b border-[var(--border-color)] pb-1">
            Adjacency List
          </h3>
          <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            {nodes.map((node) => {
              const neighbors = adjList[node.id] || [];
              const isCurrent = currentStep?.currentNode === node.id;
              const nodeColorVal = colorMap[node.id] !== undefined ? colorMap[node.id] : -1;

              let bgClass = 'bg-[var(--input-bg)]';
              let borderStyle = {};
              if (isCurrent) {
                bgClass = 'bg-[#FFB800]/10';
                borderStyle = { borderLeft: '3px solid #FFB800' };
              }

              let nodeLabelColor = 'text-white';
              if (nodeColorVal === 0) nodeLabelColor = 'text-[#FFB800]';
              else if (nodeColorVal === 1) nodeLabelColor = 'text-[#FF6B00]';

              return (
                <div
                  key={`adj-${node.id}`}
                  className={`flex items-center justify-between p-2 rounded-lg border border-[var(--border-color)] text-xs font-mono transition-all duration-200 ${bgClass}`}
                  style={borderStyle}
                >
                  <span className={`font-bold ${nodeLabelColor}`}>{node.id}</span>
                  <span className="text-[var(--muted-color)]">→</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                    {neighbors.length > 0 ? (
                      neighbors.map((neighbor) => {
                        const neighborColorVal =
                          colorMap[neighbor] !== undefined ? colorMap[neighbor] : -1;

                        const isEdgeActive = currentStep?.highlightNodes?.includes(node.id) &&
                          currentStep?.highlightNodes?.includes(neighbor) &&
                          (currentStep?.type === 'check-neighbor' ||
                           currentStep?.type === 'color-neighbor' ||
                           currentStep?.type === 'conflict-found') &&
                          currentStep?.currentNode === node.id &&
                          currentStep?.neighborNode === neighbor;

                        let pillBg = 'bg-black/30';
                        let pillColor = 'text-[var(--muted-color)]';

                        if (neighborColorVal === 0) {
                          pillColor = 'text-[#FFB800]';
                          pillBg = 'bg-[#FFB800]/10 border-[#FFB800]/30';
                        } else if (neighborColorVal === 1) {
                          pillColor = 'text-[#FF6B00]';
                          pillBg = 'bg-[#FF6B00]/10 border-[#FF6B00]/30';
                        }

                        if (isEdgeActive) {
                          pillBg = 'bg-[#FFB800]/25 border-[#FFB800]';
                          pillColor = 'text-[#FFB800] font-bold';
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
    const activeLine = currentStep?.codeLineActive || 0;
    const mappedActiveLine = isPseudoCode ? mapJavaToPseudo(activeLine) : activeLine;
    const codeLines = isPseudoCode ? pseudoCode : javaCode;

    return (
      <div className="flex-grow flex flex-col bg-[#0d0d0d] h-full overflow-hidden">
        {/* Toggle + Complexity Badges Header */}
        <div className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[#111] shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPseudoCode(true)}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
                isPseudoCode
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-[var(--muted-color)] hover:text-white'
              }`}
            >
              Pseudo
            </button>
            <button
              onClick={() => setIsPseudoCode(false)}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
                !isPseudoCode
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-[var(--muted-color)] hover:text-white'
              }`}
            >
              Java
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className="px-1.5 py-0.5 rounded border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] font-mono text-[9px] uppercase font-bold tracking-wider"
              title="Time Complexity"
            >
              O(V + E)
            </div>
            <div
              className="px-1.5 py-0.5 rounded border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7] font-mono text-[9px] uppercase font-bold tracking-wider"
              title="Space Complexity"
            >
              O(V)
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div
          ref={codeContainerRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-gray-300 custom-scrollbar select-text selection:bg-blue-500/30"
        >
          {codeLines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === mappedActiveLine;
            return (
              <div
                key={`code-line-${lineNum}`}
                ref={isActive ? activeCodeLineRef : null}
                className={`flex w-full items-start py-0.5 px-2 rounded transition-colors duration-150 ${
                  isActive ? 'bg-[#FFB800]/15 border-l-2 border-[#FFB800] text-white' : ''
                }`}
              >
                <span className="w-8 shrink-0 text-right pr-3 text-gray-600 select-none text-[10px]">
                  {lineNum}
                </span>
                <span className="whitespace-pre">{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeRightTab === 'trace') {
    return (
      <div className="flex-grow flex flex-col bg-[#0f0f12] h-full overflow-hidden">
        {/* Header */}
        <div className="h-[36px] px-3 flex items-center border-b border-[var(--border-color)] bg-[#131317] shrink-0 text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">
          Algorithm Steps Trace
        </div>

        {/* Trace List */}
        <div
          ref={traceContainerRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar"
        >
          {steps.length > 0 ? (
            steps.slice(0, cur + 1).map((step, idx) => {
              const isActive = idx === cur;
              let stepBadgeColor = 'bg-gray-500/10 border-gray-500/20 text-gray-400';
              if (step.type === 'conflict-found' || step.type === 'not-bipartite') {
                stepBadgeColor = 'bg-red-500/10 border-red-500/20 text-red-400 font-bold';
              } else if (step.type === 'complete' && step.isBipartite) {
                stepBadgeColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold';
              } else if (step.type === 'color-neighbor' || step.type === 'color-source') {
                stepBadgeColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
              } else if (step.type.startsWith('enqueue')) {
                stepBadgeColor = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
              } else if (step.type === 'dequeue') {
                stepBadgeColor = 'bg-purple-500/10 border-purple-500/20 text-purple-400';
              }

              return (
                <div
                  key={`trace-step-${idx}`}
                  className={`flex flex-col p-2.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FFB800]/10 border-[#FFB800] border-l-[3px]'
                      : 'bg-[#181822]/40 border-[var(--border-color)]/60'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`px-1.5 py-0.5 rounded border text-[9px] uppercase font-bold ${stepBadgeColor}`}>
                      {step.type}
                    </span>
                    <span className="text-[9px] text-[var(--muted-color)]">
                      Step {idx + 1} of {steps.length}
                    </span>
                  </div>
                  <span className={isActive ? 'text-white font-semibold' : 'text-gray-300'}>
                    {step.description}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--muted-color)] text-xs italic">
              Run algorithm to see trace output log
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
