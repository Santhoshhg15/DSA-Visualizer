import { useGraphStore } from '../stores/useGraphStore';

export function AuxiliaryDataPanel({ collapsed, onToggle }: { collapsed?: boolean, onToggle?: () => void }) {
  const { steps, cur, selectedAlgorithm } = useGraphStore();

  if (!selectedAlgorithm) {
    return (
      <div className={`w-full flex flex-col bg-[var(--panel-bg)] transition-all duration-300 ${collapsed ? 'h-[40px]' : 'flex-grow basis-[25%]'}`}>
        <div className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--pill-bg)]">
          <h3 className="text-[10px] font-bold text-[var(--text-color)] uppercase tracking-widest flex items-center gap-2">
            <span className="text-purple-500">📊</span> Auxiliary Data
          </h3>
        </div>
        {!collapsed && (
          <div className="flex-1 flex items-center justify-center text-[12px] text-[var(--muted-color)] p-4 text-center">
            Select an algorithm to view auxiliary data.
          </div>
        )}
      </div>
    );
  }

  const currentStepData = steps[cur];
  const auxState = currentStepData?.auxiliaryState || {};

  const renderContent = () => {
    switch (selectedAlgorithm) {
      case 'bfs':
      case 'dfs':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">
                {selectedAlgorithm === 'bfs' ? 'Queue' : 'Stack'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(auxState.collection || []).length === 0 ? (
                  <span className="text-xs text-[var(--muted-color)]">Empty</span>
                ) : (
                  (auxState.collection || []).map((node: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded text-xs font-mono">
                      {node}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">Visited Order</h4>
              <div className="text-xs font-mono text-[var(--text-color)] break-words">
                {(auxState.visitedOrder || []).join(' → ')}
              </div>
            </div>
          </div>
        );

      case 'dijkstra':
      case 'bellman-ford':
        return (
          <div className="space-y-4">
            {selectedAlgorithm === 'bellman-ford' && auxState.passNumber !== undefined && (
              <div className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20 inline-block">
                Pass {auxState.passNumber} of {auxState.totalPasses}
              </div>
            )}
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">Distance Table</h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="py-2">Node</th>
                    <th className="py-2">Distance</th>
                    <th className="py-2">Previous</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(auxState.distanceTable || {}).map(([node, data]: [string, any]) => (
                    <tr key={node} className="border-b border-[var(--border-color)] border-opacity-50">
                      <td className="py-2 font-mono font-bold text-blue-400">{node}</td>
                      <td className="py-2 font-mono">{data.distance === Infinity ? '∞' : data.distance}</td>
                      <td className="py-2 font-mono text-[var(--muted-color)]">{data.previous || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'floyd-warshall':
        return (
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">Distance Matrix</h4>
            {auxState.matrix ? (
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs font-mono">
                  <thead>
                    <tr>
                      <th className="p-1"></th>
                      {auxState.nodes.map((n: string) => <th key={n} className="p-1 text-blue-400">{n}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {auxState.nodes.map((n: string, i: number) => (
                      <tr key={n}>
                        <th className="p-1 text-blue-400">{n}</th>
                        {auxState.matrix[i].map((val: any, j: number) => (
                          <td key={j} className="p-1 border border-[var(--border-color)] border-opacity-30">
                            {val === Infinity ? '∞' : val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <span className="text-xs text-[var(--muted-color)]">Initializing...</span>
            )}
          </div>
        );

      case 'kruskal':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">MST Cost</h4>
              <div className="text-xl font-mono text-emerald-400">{auxState.mstCost || 0}</div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">Sorted Edges</h4>
              <div className="h-32 overflow-y-auto custom-scrollbar border border-[var(--border-color)] rounded-lg p-2 bg-black/20">
                {(auxState.sortedEdges || []).map((e: any, i: number) => (
                  <div key={i} className={`text-xs font-mono p-1 rounded ${e.active ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-[var(--muted-color)]'}`}>
                    {e.src} → {e.dest} ({e.weight})
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">Union-Find Sets</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(auxState.unionFind || {}).map(([root, members]: [string, any]) => (
                  <span key={root} className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-xs font-mono">
                    {`{${members.join(',')}}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'prim':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">MST Cost</h4>
              <div className="text-xl font-mono text-emerald-400">{auxState.mstCost || 0}</div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">Candidate Edges (PQ)</h4>
              <div className="h-32 overflow-y-auto custom-scrollbar border border-[var(--border-color)] rounded-lg p-2 bg-black/20">
                {(auxState.candidateEdges || []).map((e: any, i: number) => (
                  <div key={i} className="text-xs font-mono p-1 rounded text-orange-400">
                    {e.src} → {e.dest} ({e.w})
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'topological-sort':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">Queue (In-Degree 0)</h4>
                <div className="flex flex-wrap gap-2">
                  {(auxState.queue || []).length === 0 ? (
                    <span className="text-xs text-[var(--muted-color)]">Empty</span>
                  ) : (
                    (auxState.queue || []).map((node: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded text-xs font-mono">
                        {node}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">In-Degree Table</h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="py-2">Node</th>
                    <th className="py-2">In-Degree</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(auxState.inDegreeTable || {}).map(([node, deg]: [string, any]) => (
                    <tr key={node} className="border-b border-[var(--border-color)] border-opacity-50">
                      <td className="py-1 font-mono font-bold text-blue-400">{node}</td>
                      <td className={`py-1 font-mono ${deg === 0 ? 'text-emerald-400' : 'text-[var(--text-color)]'}`}>{deg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-[var(--muted-color)] mb-2">Sorted Order</h4>
              <div className="text-xs font-mono text-[var(--text-color)] break-words">
                {(auxState.visitedOrder || []).join(' → ')}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full flex flex-col bg-[var(--panel-bg)] transition-all duration-300 ${collapsed ? 'h-[40px]' : 'flex-grow basis-[25%]'}`}>
      <div 
        className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--pill-bg)] cursor-pointer hover:bg-[var(--border-color)] transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-bold text-[var(--text-color)] uppercase tracking-widest flex items-center gap-2">
            <span className="text-purple-500">📊</span> Auxiliary Data
          </h3>
        </div>
        <button className="text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors">
          <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {!collapsed && (
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      )}
    </div>
  );
}
