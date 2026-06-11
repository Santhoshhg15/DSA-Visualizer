import { useCycleStore } from '../../stores/useCycleStore';

export function CycleBottomPanel() {
  const { algorithmType, steps, cur, playing, nodes } = useCycleStore();

  const isIdle = steps.length === 0;
  const currentStep = steps[cur] || null;
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;
  const cycleDetected = currentStep?.hasCycle ?? false;

  const getAlgorithmLabel = () => {
    switch (algorithmType) {
      case 'undirected-union-find': return 'Union-Find';
      case 'undirected-bfs': return 'BFS Parent';
      case 'directed-dfs': return 'DFS Back-Edge';
      case 'directed-bfs': return "Kahn's Algorithm";
      default: return 'Cycle Detection';
    }
  };

  const getResultContent = () => {
    if (isIdle) {
      return (
        <span className="text-[11px] text-[var(--muted-color)] italic">
          Run algorithm to detect cycles
        </span>
      );
    }

    if (cycleDetected) {
      let detail = '';
      if (algorithmType === 'undirected-union-find') detail = `Edge (${currentStep?.nodeA}—${currentStep?.nodeB})`;
      else if (algorithmType === 'undirected-bfs') detail = `${currentStep?.neighborNode} visited (curr: ${currentStep?.currentNode})`;
      else if (algorithmType === 'directed-dfs') detail = `Back edge: ${currentStep?.currentNode} → ${currentStep?.neighborNode}`;
      else if (algorithmType === 'directed-bfs') detail = `Stuck: {${currentStep?.stuckNodes?.join(', ')}}`;

      return (
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-[#DC2626] font-mono drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
            ⚠️ CYCLE DETECTED
          </span>
          <span className="text-[11px] text-[var(--muted-color)] font-mono font-normal truncate">
            {detail}
          </span>
        </div>
      );
    }

    if (isPlaybackFinished) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-[#00C896] font-mono">
            ✓ NO CYCLE FOUND
          </span>
          <span className="text-[11px] text-[var(--muted-color)] font-mono font-normal">
            Graph is clean
          </span>
        </div>
      );
    }

    // In-progress stats
    return (
      <div className="flex items-center gap-4 font-mono text-[12px] font-normal text-[var(--muted-color)]">
        {algorithmType === 'undirected-union-find' && (
          <>
            <span>Step: {cur + 1} / {steps.length}</span>
            <span>Groups: {currentStep?.unionFindGroups ? Object.keys(currentStep.unionFindGroups).length : nodes.length}</span>
          </>
        )}
        {algorithmType === 'undirected-bfs' && (
          <>
            <span>Visited: {currentStep?.visitedSnapshot?.length || 0} / {nodes.length}</span>
            <span>Queue: {currentStep?.queueSnapshot?.length || 0}</span>
          </>
        )}
        {algorithmType === 'directed-dfs' && (
          <>
            <span>Visited: {currentStep?.visitedSnapshot?.length || 0} / {nodes.length}</span>
            <span>Depth: {currentStep?.dfsStackSnapshot?.length || 0}</span>
          </>
        )}
        {algorithmType === 'directed-bfs' && (
          <>
            <span>Ordered: {currentStep?.topoOrder?.length || 0} / {nodes.length}</span>
            <span>Queue: {currentStep?.queueSnapshot?.length || 0}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-[80px] flex flex-row bg-[var(--panel-bg)]/60 backdrop-blur-md border-t border-[var(--border-color)] shrink-0 select-none">
      
      {/* FULL WIDTH OUTPUT PANEL */}
      <div className="w-full flex flex-col">
        <div className="h-[28px] flex items-center px-4 gap-2 border-b border-[var(--border-color)]/40">
          <div className={`w-[6px] h-[6px] rounded-full ${cycleDetected ? 'bg-[#DC2626] shadow-[0_0_6px_rgba(220,38,38,0.5)]' : 'bg-[#00C896] shadow-[0_0_6px_rgba(0,200,150,0.5)]'} animate-pulse`} />
          <span className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans">
            OUTPUT — {getAlgorithmLabel()}
          </span>
          {isPlaybackFinished && !cycleDetected && (
            <span className="ml-auto text-[10px] font-semibold font-sans uppercase tracking-[0.06em] text-[#00C896] bg-[#00C896]/10 border border-[#00C896]/30 rounded-full px-2 py-0.5">
              COMPLETE
            </span>
          )}
          {cycleDetected && (
            <span className="ml-auto text-[10px] font-semibold font-sans uppercase tracking-[0.06em] text-[#DC2626] bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-full px-2 py-0.5 animate-pulse">
              CYCLE FOUND
            </span>
          )}
          {!isIdle && !isPlaybackFinished && !cycleDetected && (
            <span className="ml-auto text-[10px] font-semibold font-sans uppercase tracking-[0.06em] text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-full px-2 py-0.5 animate-pulse">
              RUNNING
            </span>
          )}
        </div>
        <div className="flex-1 overflow-x-auto flex items-center px-4 whitespace-nowrap custom-scrollbar">
          {getResultContent()}
        </div>
      </div>

    </div>
  );
}
