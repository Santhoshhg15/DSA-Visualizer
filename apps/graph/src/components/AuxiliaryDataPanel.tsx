import { useGraphStore } from '../stores/useGraphStore';
import { VisitedArrayPanel } from './VisitedArrayPanel';
import { QueuePanel } from './QueuePanel';

export function AuxiliaryDataPanel({ collapsed, onToggle }: { collapsed?: boolean, onToggle?: () => void }) {
  const { steps, cur, selectedAlgorithm, nodes, edges, graphType, playing, dijkstraImpl } = useGraphStore();

  if (!selectedAlgorithm) {
    return (
      <div className={`w-full flex flex-col bg-[var(--panel-bg)] transition-all duration-300 font-sans ${collapsed ? 'h-[40px]' : 'flex-grow basis-[25%]'}`}>
        <div className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--panel-bg)]">
          <h3 className="text-[11px] font-semibold text-[var(--text-color)] uppercase tracking-[0.08em] flex items-center gap-2">
            <span className="text-purple-500">📊</span> Auxiliary Data
          </h3>
        </div>
        {!collapsed && (
          <div className="flex-1 flex items-center justify-center text-[13px] font-normal leading-[1.7] text-[var(--muted-color)] p-4 text-center">
            Select an algorithm to view auxiliary data.
          </div>
        )}
      </div>
    );
  }

  const currentStepData = steps[cur];
  const auxState = currentStepData?.auxiliaryState || {};

  // Calculate parameters for VisitedArrayPanel
  const hasVisitedPanel = true;

  let visitedMode: 'default' | 'distance' | 'color' | 'indegree' = 'default';
  let visitedExtraData: any = undefined;
  if (selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bellman-ford' || selectedAlgorithm === 'shortest-path') {
    visitedMode = 'distance';
    visitedExtraData = {};
    if (auxState.distanceTable) {
      for (const k in auxState.distanceTable) {
        visitedExtraData[k] = auxState.distanceTable[k].distance;
      }
    }
  } else if (selectedAlgorithm === 'topological-sort') {
    visitedMode = 'indegree';
    visitedExtraData = auxState.inDegreeTable;
  }

  const currentNode = currentStepData?.highlightNodes?.[0] || null;

  const renderContent = () => {
    switch (selectedAlgorithm) {
      case 'bfs':
      case 'dfs':
        return null;

      case 'dijkstra':
      case 'bellman-ford':
        return (
          <div className="space-y-4 font-sans">
            {selectedAlgorithm === 'bellman-ford' && auxState.passNumber !== undefined && (
              <div className="text-[11px] font-semibold text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20 inline-block uppercase tracking-[0.06em]">
                Pass {auxState.passNumber} of {auxState.totalPasses}
              </div>
            )}
            <div>
              <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">Distance Table</h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-color)]">
                    <th className="py-2 font-semibold">Node</th>
                    <th className="py-2 font-semibold">Distance</th>
                    <th className="py-2 font-semibold">Previous</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(auxState.distanceTable || {}).map(([node, data]: [string, any]) => (
                    <tr key={node} className="border-b border-[var(--border-color)] border-opacity-50 text-[12px]">
                      <td className="py-2 font-mono font-bold text-blue-400">{node}</td>
                      <td className="py-2 font-mono font-medium">{data.distance === Infinity || data.distance === 1e8 || data.distance === 1e9 ? '∞' : data.distance}</td>
                      <td className="py-2 font-mono font-medium text-[var(--muted-color)]">{data.previous || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'shortest-path':
        return (
          <div className="space-y-4 font-sans">
            <div>
              <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">Parent Array</h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-color)]">
                    <th className="py-2 font-semibold">Node</th>
                    <th className="py-2 font-semibold">Parent</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(auxState.distanceTable || {}).map(([node, data]: [string, any]) => {
                    const isFinalized = auxState.visitedOrder?.includes(node);
                    const isInQueue = currentStepData?.queueSnapshot?.some((item: any) => item.node === node);
                    let status = 'Unvisited';
                    let statusColor = 'text-[var(--muted-color)]';
                    if (isFinalized) {
                      status = 'Finalized';
                      statusColor = 'text-emerald-400 font-bold';
                    } else if (isInQueue) {
                      status = 'In Queue';
                      statusColor = 'text-amber-400 font-bold';
                    }
                    return (
                      <tr key={node} className="border-b border-[var(--border-color)] border-opacity-50 text-[12px]">
                        <td className="py-2 font-mono font-bold text-blue-400">{node}</td>
                        <td className="py-2 font-mono font-medium">{data.previous || node}</td>
                        <td className={`py-2 font-mono font-medium ${statusColor}`}>{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'floyd-warshall':
        return (
          <div className="space-y-4 font-sans">
            <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">Distance Matrix</h4>
            {auxState.matrix ? (
              <div className="overflow-x-auto">
                <table className="w-full text-center text-[12px] font-mono">
                  <thead>
                    <tr className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-color)]">
                      <th className="p-1 font-semibold"></th>
                      {auxState.nodes.map((n: string) => <th key={n} className="p-1 text-blue-400 font-semibold">{n}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {auxState.nodes.map((n: string, i: number) => (
                      <tr key={n}>
                        <th className="p-1 text-blue-400 font-bold font-mono">{n}</th>
                        {auxState.matrix[i].map((val: any, j: number) => (
                          <td key={j} className="p-1 border border-[var(--border-color)] border-opacity-30 font-medium">
                            {val === Infinity ? '∞' : val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <span className="text-[12px] font-normal text-[var(--muted-color)]">Initializing...</span>
            )}
          </div>
        );

      case 'kruskal':
        return (
          <div className="space-y-4 font-sans">
            <div>
              <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">MST Cost</h4>
              <div className="text-[20px] font-mono font-bold text-[#00C896]">{auxState.mstCost || 0}</div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">Sorted Edges</h4>
              <div className="h-32 overflow-y-auto custom-scrollbar border border-[var(--border-color)] rounded-lg p-2 bg-black/20">
                {(auxState.sortedEdges || []).map((e: any, i: number) => (
                  <div key={i} className={`text-[12px] font-mono p-1 rounded font-normal ${e.active ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold' : 'text-[var(--muted-color)]'}`}>
                    {e.src} → {e.dest} ({e.weight})
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">Union-Find Sets</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(auxState.unionFind || {}).map(([root, members]: [string, any]) => (
                  <span key={root} className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-[11px] font-mono font-medium">
                    {`{${members.join(',')}}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'prim':
        return (
          <div className="space-y-4 font-sans">
            <div>
              <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">MST Cost</h4>
              <div className="text-[20px] font-mono font-bold text-[#00C896]">{auxState.mstCost || 0}</div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">Candidate Edges (PQ)</h4>
              <div className="h-32 overflow-y-auto custom-scrollbar border border-[var(--border-color)] rounded-lg p-2 bg-black/20">
                {(auxState.candidateEdges || []).map((e: any, i: number) => (
                  <div key={i} className="text-[12px] font-mono p-1 rounded text-orange-400 font-medium">
                    {e.src} → {e.dest} ({e.w})
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'topological-sort':
        return (
          <div className="space-y-4 font-sans">
            <div>
              <h4 className="text-[10px] uppercase font-semibold text-[var(--muted-color)] mb-2 tracking-[0.08em]">In-Degree Table</h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-color)]">
                    <th className="py-2 font-semibold">Node</th>
                    <th className="py-2 font-semibold">In-Degree</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(auxState.inDegreeTable || {}).map(([node, deg]: [string, any]) => (
                    <tr key={node} className="border-b border-[var(--border-color)] border-opacity-50 text-[12px]">
                      <td className="py-1 font-mono font-bold text-blue-400">{node}</td>
                      <td className={`py-1 font-mono font-medium ${deg === 0 ? 'text-emerald-400 font-bold' : 'text-[var(--text-color)]'}`}>{deg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full flex flex-col bg-[var(--panel-bg)] transition-all duration-300 font-sans border-t border-[var(--border-color)] ${collapsed ? 'h-[40px]' : 'flex-grow basis-[25%]'}`}>
      <div 
        className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--panel-bg)] cursor-pointer hover:bg-[var(--input-bg)] transition-colors select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-[var(--text-color)] uppercase tracking-[0.08em] flex items-center gap-2">
            <span className="text-purple-500">📊</span> Auxiliary Data
          </h3>
        </div>
        <button className="text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors cursor-pointer">
          <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {!collapsed && (
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
          {/* GRAPH INFO */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
              Graph Info
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[12px] font-mono bg-[var(--input-bg)] p-3 rounded-lg border border-[var(--border-color)]">
              <div className="flex justify-between">
                <span className="text-[var(--muted-color)] font-sans text-[10px] font-semibold uppercase tracking-[0.06em]">NODES:</span>
                <span className="font-bold text-[var(--text-color)]">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-color)] font-sans text-[10px] font-semibold uppercase tracking-[0.06em]">EDGES:</span>
                <span className="font-bold text-[var(--text-color)]">{edges.length}</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-[var(--muted-color)] font-sans text-[10px] font-semibold uppercase tracking-[0.06em]">TYPE:</span>
                <span className="font-bold text-[var(--text-color)]">
                  {graphType.directed ? 'Directed' : 'Undirected'}
                  {graphType.weighted ? ' (Weighted)' : ''}
                </span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-[var(--muted-color)] font-sans text-[10px] font-semibold uppercase tracking-[0.06em]">STATUS:</span>
                <span className={`font-bold ${
                  currentStepData?.type === 'complete' ? 'text-[#00C896]' : playing ? 'text-amber-400' : 'text-gray-400'
                }`}>
                  {currentStepData?.type === 'complete' ? 'Complete' : playing ? 'Running' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          {/* VISITED ARRAY */}
          {hasVisitedPanel && (
            <VisitedArrayPanel
              nodes={nodes.map(n => ({ id: n.id, label: n.label || n.id }))}
              visitedOrder={auxState.visitedOrder || []}
              currentNode={currentNode}
              mode={visitedMode}
              extraData={visitedExtraData}
            />
          )}

          {/* QUEUE PANELS */}
          {selectedAlgorithm === 'bfs' && (
            <QueuePanel
              type="bfs"
              items={currentStepData?.queueSnapshot || []}
              formatItem={(n) => n}
            />
          )}
          {selectedAlgorithm === 'dfs' && (
            <QueuePanel
              type="dfs-stack"
              items={currentStepData?.queueSnapshot || []}
              formatItem={(n) => `dfs(${n})`}
            />
          )}
          {selectedAlgorithm === 'dijkstra' && (
            dijkstraImpl === 'set' ? (
              <QueuePanel
                type="priority"
                title="TREESET"
                items={currentStepData?.queueSnapshot || []}
                formatItem={({node, dist}) => `(${dist === Infinity ? '∞' : dist}, ${node})`}
                colorItem={(item) => {
                  const isOldRemoval = currentStepData?.type === 'set-remove-old' && item.node === currentStepData?.currentNode;
                  const isNewAdd = currentStepData?.type === 'set-add-updated' && item.node === currentStepData?.currentNode;
                  
                  if (isOldRemoval) {
                    return {
                      bg: 'rgba(220, 38, 38, 0.3)',
                      border: '#DC2626',
                      text: '#FF8888',
                    };
                  }
                  if (isNewAdd) {
                    return {
                      bg: 'rgba(0, 200, 150, 0.3)',
                      border: '#00C896',
                      text: '#FFFFFF',
                    };
                  }
                  
                  // First item (minimum)
                  const isFirst = (currentStepData?.queueSnapshot?.[0]?.node === item.node);
                  return isFirst
                    ? {
                        bg: 'rgba(255, 184, 0, 0.3)',
                        border: '#FFB800',
                        text: '#ffffff',
                      }
                    : {
                        bg: 'rgba(59, 130, 246, 0.15)',
                        border: '#3b82f6',
                        text: '#60a5fa',
                      };
                }}
              />
            ) : (
              <QueuePanel
                type="priority"
                items={currentStepData?.queueSnapshot || []}
                formatItem={({node,dist}) =>
                  `${node}(${dist===Infinity?'∞':dist})`}
              />
            )
          )}
          {selectedAlgorithm === 'prim' && (
            <QueuePanel
              type="priority"
              title="PRIORITY QUEUE"
              items={currentStepData?.queueSnapshot || []}
              formatItem={({node,key}) =>
                `${node}(${key===Infinity?'∞':key})`}
            />
          )}
          {selectedAlgorithm === 'topological-sort' && (
            <QueuePanel
              type="topo"
              items={currentStepData?.queueSnapshot || []}
              formatItem={(n) => n}
            />
          )}
          {selectedAlgorithm === 'bellman-ford' && (
            <QueuePanel
              type="bfs"
              title="EDGE RELAXATION"
              items={currentStepData?.queueSnapshot || []}
              formatItem={({src,dest}) => `${src}→${dest}`}
            />
          )}

          {/* ALGORITHM SPECIFIC DATA */}
          {renderContent()}
        </div>
      )}
    </div>
  );
}
