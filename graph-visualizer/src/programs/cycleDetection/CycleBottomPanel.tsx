import { useCycleStore } from '../../stores/useCycleStore';

export function CycleBottomPanel() {
  const { algorithmType, steps, cur, playing, nodes, edges } = useCycleStore();

  const isIdle = steps.length === 0;
  const currentStep = steps[cur] || null;
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;

  // State derivations
  const cycleDetected = currentStep?.hasCycle ?? false;

  // DFS Stack
  const dfsStack = currentStep?.dfsStackSnapshot || [];
  // BFS Queue (Undirected BFS or Kahn's)
  const bfsQueue = currentStep?.queueSnapshot || [];

  // Union Find merges count
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

  // Left Section renders
  const renderVisitedNodes = () => {
    const visitedSnapshot = currentStep?.visitedSnapshot || [];
    const currentNode = currentStep?.currentNode;

    return nodes.map((node, idx) => {
      const isCurrent = currentNode === node.id;
      const isVisited = visitedSnapshot.includes(node.id);

      let bg = 'bg-white/5';
      let border = 'border-white/10';
      let color = 'text-gray-400';
      let shadow = '';

      if (isCurrent) {
        bg = 'bg-[#FFB800]/30';
        border = 'border-[#FFB800]';
        color = 'text-white';
        shadow = 'shadow-[0_0_8px_rgba(255,184,0,0.5)]';
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

  const renderVisitedNodesDfs = () => {
    const visitedSnapshot = currentStep?.visitedSnapshot || [];
    const currentNode = currentStep?.currentNode;
    const recStackSnapshot = currentStep?.recStackSnapshot || [];

    return nodes.map((node, idx) => {
      const isCurrent = currentNode === node.id;
      const isVisited = visitedSnapshot.includes(node.id);
      const isStack = recStackSnapshot.includes(node.id);

      let bg = 'bg-white/5';
      let border = 'border-white/10';
      let color = 'text-gray-400';
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
    return edges.map((edge, idx) => {
      const isCurrent = currentStep?.highlightEdges?.includes(edge.id);
      const isCycleEdge = currentStep?.cycleEdges?.includes(edge.id);
      
      let isProcessed = false;
      const curIndex = cur;
      const edgeStepIndex = steps.findIndex(
        (s) => s.highlightEdges && s.highlightEdges.includes(edge.id)
      );
      if (edgeStepIndex !== -1 && edgeStepIndex < curIndex) {
        isProcessed = true;
      }

      let bg = 'bg-white/5';
      let border = 'border-white/10';
      let color = 'text-gray-400';
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

  const renderInDegreeTrackerBoxes = () => {
    const inDegreeSnapshot = currentStep?.inDegreeSnapshot || {};
    const topo = currentStep?.topoOrder || [];
    const queueSnapshot = currentStep?.queueSnapshot || [];
    const stuckNodes = currentStep?.stuckNodes || [];

    return nodes.map((node) => {
      const initialInDegree = edges.filter(e => e.target === node.id).length;
      const deg = inDegreeSnapshot[node.id] ?? initialInDegree;
      const isProcessed = topo.includes(node.id);
      const isInQueue = queueSnapshot.includes(node.id);
      const isStuck = stuckNodes.includes(node.id);

      let bg = 'bg-white/5';
      let border = 'border-white/10';
      let color = 'text-gray-400';
      let shadow = '';

      if (isStuck) {
        bg = 'bg-[#DC2626]/30';
        border = 'border-[#DC2626]';
        color = 'text-white';
        shadow = 'shadow-[0_0_8px_rgba(220,38,38,0.5)]';
      } else if (isProcessed) {
        bg = 'bg-[#00C896]/30';
        border = 'border-[#00C896]';
        color = 'text-white';
      } else if (isInQueue) {
        bg = 'bg-[#7C3AED]/30';
        border = 'border-[#7C3AED]';
        color = 'text-white';
        shadow = 'shadow-[0_0_6px_rgba(124,58,237,0.4)]';
      } else if (deg === 0) {
        bg = 'bg-[#FFB800]/20';
        border = 'border-[#FFB800]/50';
        color = 'text-white';
      }

      return (
        <div
          key={`indegree-${node.id}`}
          className={`w-[45px] h-[40px] flex flex-col items-center justify-center rounded-[6px] border ${bg} ${border} ${shadow} ${color} transition-all duration-300 shrink-0`}
        >
          <span className="font-mono text-[10px] font-bold">{node.id}</span>
          <span className="font-mono text-[8px] opacity-80">in:{deg}</span>
        </div>
      );
    });
  };

  const getLeftLabel = () => {
    if (algorithmType === 'undirected-union-find') return 'Edges Processed';
    if (algorithmType === 'directed-bfs') return 'Live In-Degree Tracker';
    return 'Visited Nodes';
  };

  const renderLeftSection = () => {
    if (algorithmType === 'undirected-union-find') return renderProcessedEdges();
    if (algorithmType === 'directed-dfs') return renderVisitedNodesDfs();
    if (algorithmType === 'undirected-bfs') return renderVisitedNodes();
    if (algorithmType === 'directed-bfs') return renderInDegreeTrackerBoxes();
    return null;
  };

  const getCenterLabel = () => {
    if (algorithmType === 'undirected-union-find') return 'Component Progress';
    if (algorithmType === 'directed-dfs') return 'DFS Call Stack';
    return 'BFS Queue';
  };

  return (
    <div className="w-full h-130px flex flex-row bg-[var(--panel-bg)] border-t border-b border-[var(--border-color)] shrink-0 select-none">
      {/* LEFT SECTION */}
      <div className="w-[55%] flex flex-col border-r border-[var(--border-color)] overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 shrink-0">
          {getLeftLabel()}
        </div>
        <div className="flex-1 overflow-x-auto px-3 pb-2 custom-scrollbar flex items-center">
          {isIdle ? (
            <div className="h-full flex items-center justify-start text-[11px] text-[var(--muted-color)] italic">
              Run algorithm to see tracking
            </div>
          ) : (
            <div className="flex gap-2">
              {renderLeftSection()}
            </div>
          )}
        </div>
      </div>

      {/* CENTER SECTION */}
      <div className="w-[25%] flex flex-col border-r border-[var(--border-color)] overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 shrink-0">
          {getCenterLabel()}
        </div>
        <div className="flex-1 px-3 pb-2 flex flex-col justify-center overflow-y-auto no-scrollbar">
          {isIdle ? (
            <div className="text-[11px] text-[var(--muted-color)] italic">No progress data</div>
          ) : algorithmType === 'undirected-union-find' ? (
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
          ) : algorithmType === 'directed-dfs' ? (
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
          ) : algorithmType === 'undirected-bfs' ? (
            // Undirected BFS queue: list of [node, parent] pairs
            <div className="flex flex-row gap-1 max-h-[80px] overflow-x-auto custom-scrollbar items-center py-1">
              {bfsQueue.length > 0 ? (
                bfsQueue.map(([node, parent], i) => {
                  const isFront = i === 0;
                  return (
                    <div
                      key={`q-node-${node}-${i}`}
                      className={`h-[28px] px-2 rounded flex flex-col items-center justify-center font-mono text-[10px] font-bold border transition-all duration-200 shrink-0 ${
                        isFront
                          ? 'border-[#FFB800] bg-[#FFB800]/20 text-[#FFB800]'
                          : 'border-[#3B82F6]/40 bg-[#3B82F6]/10 text-white'
                      }`}
                    >
                      <span>{node}</span>
                      <span className="text-[8px] opacity-60 leading-none">p={parent ?? '∅'}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-[10px] text-[var(--muted-color)] italic">Queue empty</div>
              )}
            </div>
          ) : (
            // Kahn's directed BFS queue: list of nodes
            <div className="flex flex-row gap-1 max-h-[80px] overflow-x-auto custom-scrollbar items-center py-1">
              {bfsQueue.length > 0 ? (
                bfsQueue.map((node, i) => {
                  const isFront = i === 0;
                  return (
                    <div
                      key={`q-node-${node}-${i}`}
                      className={`h-[28px] px-3 rounded flex items-center justify-center font-mono text-xs font-bold border transition-all duration-200 shrink-0 ${
                        isFront
                          ? 'border-[#FFB800] bg-[#FFB800]/20 text-[#FFB800]'
                          : 'border-[#7C3AED]/40 bg-[#7C3AED]/10 text-white'
                      }`}
                    >
                      {node} {isFront && ' (front)'}
                    </div>
                  );
                })
              ) : (
                <div className="text-[10px] text-[var(--muted-color)] italic">Queue empty</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION - Result Output */}
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
              <span className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono truncate max-w-full">
                {algorithmType === 'undirected-union-find' && `At edge (${currentStep?.nodeA}—${currentStep?.nodeB})`}
                {algorithmType === 'undirected-bfs' && `Neighbor ${currentStep?.neighborNode} visited (current: ${currentStep?.currentNode})`}
                {algorithmType === 'directed-dfs' && `Back edge: ${currentStep?.currentNode} → ${currentStep?.neighborNode}`}
                {algorithmType === 'directed-bfs' && `Stuck nodes: {${currentStep?.stuckNodes?.join(', ')}}`}
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
              {algorithmType === 'undirected-union-find' && (
                <>
                  <span>Edges: {cur} / {steps.length}</span>
                  <span>Groups: {currentComponents}</span>
                </>
              )}
              {algorithmType === 'undirected-bfs' && (
                <>
                  <span>Visited: {currentStep?.visitedSnapshot?.length} / {nodes.length}</span>
                  <span>Queue: {bfsQueue.length}</span>
                </>
              )}
              {algorithmType === 'directed-dfs' && (
                <>
                  <span>Visited: {currentStep?.visitedSnapshot?.length} / {nodes.length}</span>
                  <span>Depth: {dfsStack.length}</span>
                </>
              )}
              {algorithmType === 'directed-bfs' && (
                <>
                  <span>Ordered: {currentStep?.topoOrder?.length} / {nodes.length}</span>
                  <span>Queue: {bfsQueue.length}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
