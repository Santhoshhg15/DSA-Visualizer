import { useGraphStore } from '../stores/useGraphStore';

export function AlgorithmOutput() {
  const nodes = useGraphStore(state => state.nodes);
  const cur = useGraphStore(state => state.cur);
  const steps = useGraphStore(state => state.steps);
  const playing = useGraphStore(state => state.playing);

  const currentStepData = steps.length > 0 && cur >= 0 && cur < steps.length ? steps[cur] : null;
  const auxState = currentStepData?.auxiliaryState;
  const visitedOrder: string[] = auxState?.visitedOrder || [];
  const activeNodes: string[] = currentStepData?.highlightNodes || [];
  const currentNode = activeNodes.length > 0 ? activeNodes[0] : null;
  
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;
  const isIdle = steps.length === 0;

  return (
    <div className="w-full h-[88px] flex flex-row bg-[var(--panel-bg)] border-t border-b border-[var(--border-color)] shrink-0">
      
      {/* LEFT PANEL — Visited Array */}
      <div className="w-[60%] flex flex-col border-r border-[var(--border-color)]">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 font-['Space_Grotesk']">
          VISITED ARRAY
        </div>
        <div className="flex-1 overflow-x-auto flex items-center px-3 pb-2 gap-[6px] custom-scrollbar">
          {nodes.map((node, i) => {
            let bg = 'bg-[var(--input-bg)]';
            let border = 'border-[var(--border-color)]';
            let labelColor = 'text-[var(--muted-color)]';
            let shadow = 'shadow-none';

            if (!isIdle) {
              const isCurrent = node.id === currentNode;
              const isVisited = visitedOrder.includes(node.id);
              
              if (isCurrent) {
                bg = 'bg-[#FFB800]/30';
                border = 'border-[#FFB800]';
                labelColor = 'text-white';
                shadow = 'shadow-[0_0_8px_rgba(255,184,0,0.5)]';
              } else if (isVisited) {
                bg = 'bg-[#00C896]/25';
                border = 'border-[#00C896]';
                labelColor = 'text-white';
              } else {
                bg = 'bg-[#FF4444]/15';
                border = 'border-[#FF4444]/50';
                labelColor = 'text-[#FF4444]';
              }
            }

            return (
              <div key={node.id} className={`w-[32px] h-[36px] flex flex-col items-center justify-center rounded-[6px] border ${bg} ${border} ${shadow} transition-all duration-300 ease-in-out shrink-0`}>
                <div className={`h-[20px] flex items-end justify-center font-mono text-[11px] font-bold ${labelColor}`}>
                  {node.id}
                </div>
                <div className="h-[10px] flex items-start justify-center font-mono text-[9px] text-[var(--muted-color)]">
                  {i}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL — Output */}
      <div className="w-[40%] flex flex-col">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 font-['Space_Grotesk']">
          OUTPUT
        </div>
        <div className="flex-1 overflow-x-auto flex items-center px-3 pb-2 whitespace-nowrap custom-scrollbar">
          {isIdle ? (
            <span className="text-[11px] text-[var(--muted-color)] italic">
              Run an algorithm to see traversal output
            </span>
          ) : (
            <div className="flex items-center">
              {isPlaybackFinished && (
                <span className="text-[11px] text-[var(--muted-color)] mr-2 font-mono">Complete:</span>
              )}
              {visitedOrder.map((nodeId, idx) => {
                const isLast = idx === visitedOrder.length - 1;
                // Last node is amber IF it is the current node in the step OR if algorithm is not finished yet, 
                // wait, requirements: "The last node added (most recently visited): Color: #FFB800. Transitions to green when next node is visited"
                // That just means the last item in visitedOrder is amber.
                // Wait, if playback is finished, all should be green? 
                // Let's say if it's the last item and NOT playback finished, make it amber. If finished, make it green.
                const colorClass = isLast && !isPlaybackFinished ? 'text-[#FFB800]' : 'text-[#00C896]';
                
                return (
                  <div key={`${nodeId}-${idx}`} className="flex items-center">
                    <span className={`font-mono text-[12px] font-bold transition-colors duration-300 ${colorClass}`}>
                      {nodeId}
                    </span>
                    {idx < visitedOrder.length - 1 && (
                      <span className="text-[var(--muted-color)] text-[11px] mx-1">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
