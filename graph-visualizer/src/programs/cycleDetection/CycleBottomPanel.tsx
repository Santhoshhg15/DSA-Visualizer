import { useCycleStore } from '../../stores/useCycleStore';

export function CycleBottomPanel() {
  const { algorithmType, steps, cur, playing, nodes, edges } = useCycleStore();

  const isIdle = steps.length === 0;
  const currentStep = steps[cur] || null;
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;

  const isDirected = algorithmType === 'directed';

  // State derivations
  const cycleDetected = currentStep?.hasCycle ?? false;

  // DFS Stack Calculation
  const dfsStack = currentStep?.dfsStackSnapshot || [];

  // Union Find merges count
  // Initial component count is nodes.length
  // For each successful union, component count decreases by 1
  let initialComponents = nodes.length;
  let currentComponents = nodes.length;
  if (currentStep?.unionFindGroups) {
    currentComponents = Object.keys(currentStep.unionFindGroups).length;
  }
  const componentMerges = initialComponents - currentComponents;
  const progressPercent =
    initialComponents > 1
      ? (componentMerges / (initialComponents - 1)) * 100
      : 0;

  // Ordered objects to display in the grid (Visited nodes / Processed edges)
  const renderVisitedNodes = () => {
    // DFS nodes visited
    const visitedSnapshot = currentStep?.visitedSnapshot || [];
    const currentNode = currentStep?.currentNode;
    const recStackSnapshot = currentStep?.recStackSnapshot || [];

    return nodes.map((node, idx) => {
      const isCurrent = currentNode === node.id;
      const isVisited = visitedSnapshot.includes(node.id);
      const isStack = recStackSnapshot.includes(node.id);

      let bg = 'bg-[#FF4444]/15';
      let border = 'border-[#FF4444]/50';
      let color = 'text-[#FF4444]';
      let shadow = '';

      if (isCurrent) {
        bg = 'bg-[#FFB800]/30';
        border = 'border-[#FFB800]';
        color = 'text-white';
        shadow = 'shadow-[0_0_8px_rgba(255,184,0,0.5)]';
      } else if (isStack) {
        bg = 'bg-[#7C3AED]/30';
        border = 'border-[#7C3AED] border-dashed';
        color = 'text-white';
        shadow = 'shadow-[0_0_6px_rgba(124,58,237,0.4)]';
      } else if (isVisited) {
        bg = 'bg-[#00C896]/30';
        border = 'border-[#00C896]';
        color = 'text-white';
      }

      return (
        <div
          key={`vnode-${node.id}`}
          className={`w-[40px] h-[40px] flex flex-col items-center justify-center rounded-[6px] border ${bg} ${border} ${shadow} ${color} transition-all duration-300 shrink-0`}
        >
          <span className="font-mono text-[10px] font-bold">{node.id}</span>
          <span className="font-mono text-[8px] opacity-60">{idx}</span>
        </div>
      );
    });
  };

  const renderProcessedEdges = () => {
    // Union-Find edges processed
    return edges.map((edge, idx) => {
      // Find if edge was current/processed/part of cycle
      const isCurrent = currentStep?.highlightEdges?.includes(edge.id);
      const isCycleEdge = currentStep?.cycleEdges?.includes(edge.id);
      
      // Determine if processed in the past
      let isProcessed = false;
      const curIndex = cur;
      const edgeStepIndex = steps.findIndex(
        (s) => s.highlightEdges && s.highlightEdges.includes(edge.id)
      );
      if (edgeStepIndex !== -1 && edgeStepIndex < curIndex) {
        isProcessed = true;
      }

      let bg = 'bg-[#FF4444]/15';
      let border = 'border-[#FF4444]/50';
      let color = 'text-[#FF4444]';
      let shadow = '';

      if (isCycleEdge) {
        bg = 'bg-[#DC2626]/30';
        border = 'border-[#DC2626]';
        color = 'text-white';
        shadow = 'shadow-[0_0_8px_rgba(220,38,38,0.5)]';
      } else if (isCurrent) {
        bg = 'bg-[#FFB800]/30';
        border = 'border-[#FFB800]';
        color = 'text-white';
        shadow = 'shadow-[0_0_8px_rgba(255,184,0,0.5)]';
      } else if (isProcessed) {
        bg = 'bg-[#00C896]/30';
        border = 'border-[#00C896]';
        color = 'text-white';
      }

      return (
        <div
          key={`vedge-${edge.id}`}
          className={`w-[44px] h-[40px] flex flex-col items-center justify-center rounded-[6px] border ${bg} ${border} ${shadow} ${color} transition-all duration-300 shrink-0`}
        >
          <span className="font-mono text-[9px] font-bold">{edge.source}-{edge.target}</span>
          <span className="font-mono text-[8px] opacity-60">{idx}</span>
        </div>
      );
    });
  };

  return (
    <div className="w-full h-[130px] flex flex-row bg-[var(--panel-bg)] border-t border-b border-[var(--border-color)] shrink-0 select-none">
      {/* LEFT - Visited Array or Processed Edges */}
      <div className="w-[55%] flex flex-col border-r border-[var(--border-color)] overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 shrink-0">
          {isDirected ? 'Visited Nodes' : 'Edges Processed'}
        </div>
        <div className="flex-1 overflow-x-auto px-3 pb-2 custom-scrollbar flex items-center">
          {isIdle ? (
            <div className="h-full flex items-center justify-start text-[11px] text-[var(--muted-color)] italic">
              Run algorithm to see tracking
            </div>
          ) : (
            <div className="flex gap-2">
              {isDirected ? renderVisitedNodes() : renderProcessedEdges()}
            </div>
          )}
        </div>
      </div>

      {/* CENTER - Stack / Component Progress */}
      <div className="w-[25%] flex flex-col border-r border-[var(--border-color)] overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 shrink-0">
          {isDirected ? 'DFS Call Stack' : 'Component Progress'}
        </div>
        <div className="flex-1 px-3 pb-2 flex flex-col justify-center overflow-y-auto no-scrollbar">
          {isIdle ? (
            <div className="text-[11px] text-[var(--muted-color)] italic">No progress data</div>
          ) : isDirected ? (
            <div className="flex flex-col gap-0.5 max-h-[80px] overflow-y-auto custom-scrollbar">
              {dfsStack.length > 0 ? (
                dfsStack.slice().reverse().map((node, i) => {
                  const isTop = i === 0;
                  return (
                    <div
                      key={`stack-${node}-${i}`}
                      className={`h-[24px] px-3 rounded flex items-center justify-center font-mono text-xs font-bold border transition-all duration-200 animate-slideInLeft ${
                        isTop
                          ? 'border-[#FFB800] bg-[#FFB800]/20 text-[#FFB800]'
                          : 'border-[#7C3AED]/40 bg-[#7C3AED]/10 text-white'
                      }`}
                    >
                      {node} {isTop && ' (top)'}
                    </div>
                  );
                })
              ) : (
                <div className="text-[10px] text-[var(--muted-color)] italic">Stack empty</div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 justify-center">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-[var(--muted-color)]">Merges:</span>
                <span className="font-bold text-[#00C896]">
                  {componentMerges} / {initialComponents - 1}
                </span>
              </div>
              <div className="w-full bg-[var(--border-color)] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00C896] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono font-bold text-blue-400 mt-0.5">
                {currentComponents} Component{currentComponents !== 1 && 's'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT - Result Output */}
      <div className="w-[20%] flex flex-col overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 shrink-0">
          Result
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
          {isIdle ? (
            <span className="text-[11px] text-[var(--muted-color)] italic">
              Run algorithm to detect cycles
            </span>
          ) : cycleDetected ? (
            <div className="animate-[headShake_0.3s_ease-in-out] flex flex-col items-center">
              <span className="text-sm font-bold text-[#DC2626] font-mono drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                ⚠️ CYCLE DETECTED
              </span>
              <span className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono">
                {isDirected
                  ? `Back edge: ${currentStep?.currentNode} → ${currentStep?.neighborNode}`
                  : `At edge (${currentStep?.nodeA}—${currentStep?.nodeB})`}
              </span>
            </div>
          ) : isPlaybackFinished ? (
            <div className="animate-[bounce_0.3s_ease-in-out] flex flex-col items-center">
              <span className="text-sm font-bold text-[#00C896] font-mono">
                ✓ NO CYCLE FOUND
              </span>
              <span className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono">
                Graph is clean
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5 font-mono text-[11px] text-[var(--muted-color)]">
              {isDirected ? (
                <>
                  <span>Visited: {currentStep?.visitedSnapshot?.length} / {nodes.length}</span>
                  <span>Depth: {dfsStack.length}</span>
                </>
              ) : (
                <>
                  <span>Edges: {cur} / {steps.length}</span>
                  <span>Groups: {currentComponents}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
