import { useGraphStore } from '../stores/useGraphStore';

export function AlgorithmOutput() {
  const cur = useGraphStore(state => state.cur);
  const steps = useGraphStore(state => state.steps);
  const playing = useGraphStore(state => state.playing);
  const selectedAlgorithm = useGraphStore(state => state.selectedAlgorithm);

  const currentStepData = steps.length > 0 && cur >= 0 && cur < steps.length ? steps[cur] : null;
  const auxState = currentStepData?.auxiliaryState;
  const visitedOrder: string[] = auxState?.visitedOrder || [];
  
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;
  const isIdle = steps.length === 0;

  // Algorithm-specific output messages
  const getAlgorithmLabel = () => {
    switch (selectedAlgorithm) {
      case 'bfs': return 'BFS Traversal';
      case 'dfs': return 'DFS Traversal';
      case 'dijkstra': return 'Shortest Distances';
      case 'bellman-ford': return 'Bellman-Ford';
      case 'floyd-warshall': return 'Floyd-Warshall';
      case 'kruskal': return 'Kruskal MST';
      case 'prim': return 'Prim MST';
      case 'topological-sort': return 'Topological Order';
      case 'shortest-path': return 'Shortest Path';
      default: return 'Output';
    }
  };

  // Get MST cost for MST algorithms
  const mstCost = auxState?.mstCost;
  const isMST = selectedAlgorithm === 'kruskal' || selectedAlgorithm === 'prim';

  return (
    <div className="w-full h-[80px] flex flex-row bg-[var(--panel-bg)] backdrop-blur-md border-t border-[var(--border-color)] shrink-0 select-none font-sans">
      
      {/* FULL WIDTH OUTPUT PANEL */}
      <div className="w-full flex flex-col">
        <div className="h-[28px] flex items-center px-4 gap-2 border-b border-[var(--border-color)]/40 bg-[var(--panel-bg)]">
          <div className="w-[6px] h-[6px] rounded-full bg-[#00C896] shadow-[0_0_6px_rgba(0,200,150,0.5)] animate-pulse" />
          <span className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">
            OUTPUT — {getAlgorithmLabel()}
          </span>
          {isPlaybackFinished && (
            <span className="ml-auto text-[9px] font-bold text-[#00C896] bg-[#00C896]/10 border border-[#00C896]/30 rounded-full px-2 py-0.5 tracking-[0.06em] font-sans">
              COMPLETE
            </span>
          )}
          {!isIdle && !isPlaybackFinished && (
            <span className="ml-auto text-[9px] font-bold text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-full px-2 py-0.5 tracking-[0.06em] font-sans animate-pulse">
              RUNNING
            </span>
          )}
        </div>
        <div className="flex-1 overflow-x-auto flex items-center px-4 whitespace-nowrap custom-scrollbar bg-[var(--panel-bg)]">
          {isIdle ? (
            <span className="text-[12px] text-[var(--muted-color)] italic font-normal">
              Run an algorithm to see traversal output
            </span>
          ) : (
            <div className="flex items-center gap-0.5">
              {isMST && mstCost !== undefined && (
                <span className="text-[11px] text-emerald-400 font-mono font-bold mr-3 bg-emerald-400/10 border border-emerald-400/20 rounded px-2 py-0.5">
                  Cost: {mstCost}
                </span>
              )}
              {(selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'shortest-path' || selectedAlgorithm === 'bellman-ford') && auxState?.distanceTable && (
                <>
                  {selectedAlgorithm === 'bellman-ford' && auxState?.hasNegativeCycle ? (
                    <span className="text-[12px] text-red-500 font-mono font-bold mr-3 bg-red-500/10 border border-red-500/20 rounded px-2 py-0.5 animate-pulse">
                      NEGATIVE CYCLE
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 mr-3">
                      {Object.keys(auxState.distanceTable).sort().map((nodeId) => {
                        const distObj = auxState.distanceTable[nodeId];
                        const dist = distObj.distance === Infinity || distObj.distance === 1e8 ? '∞' : distObj.distance;
                        const isVisited = visitedOrder.includes(nodeId);
                        const badgeBg = isVisited 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold shadow-[0_0_6px_rgba(16,185,129,0.1)]' 
                          : 'bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--muted-color)]';
                        return (
                          <span key={nodeId} className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded border transition-all duration-300 ${badgeBg}`}>
                            <span className={isVisited ? 'text-emerald-300 font-bold' : 'text-[var(--text-color)]'}>{nodeId}</span>:<span>{dist}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {visitedOrder.length > 0 && !auxState?.hasNegativeCycle && (
                    <div className="h-4 w-[1px] bg-[var(--border-color)] mr-3" />
                  )}
                </>
              )}
              {(!auxState?.hasNegativeCycle) && visitedOrder.map((nodeId, idx) => {
                const isLast = idx === visitedOrder.length - 1;
                const colorClass = isLast && !isPlaybackFinished ? 'text-[#FFB800]' : 'text-[#00C896]';
                
                return (
                  <div key={`${nodeId}-${idx}`} className="flex items-center">
                    <span className={`font-mono text-[13px] font-bold transition-colors duration-300 ${colorClass}`}>
                      {nodeId}
                    </span>
                    {idx < visitedOrder.length - 1 && (
                      <span className="text-[var(--muted-color)] text-[11px] mx-1 font-mono">→</span>
                    )}
                  </div>
                );
              })}
              {visitedOrder.length === 0 && !isIdle && selectedAlgorithm !== 'dijkstra' && selectedAlgorithm !== 'shortest-path' && selectedAlgorithm !== 'bellman-ford' && (
                <span className="text-[11px] text-[var(--muted-color)] italic font-mono">
                  Initializing...
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
