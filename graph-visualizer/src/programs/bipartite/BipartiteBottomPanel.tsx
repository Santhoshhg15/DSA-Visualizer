import { useBipartiteStore } from '../../stores/useBipartiteStore';

export function BipartiteBottomPanel() {
  const { steps, cur, playing, nodes } = useBipartiteStore();

  const isIdle = steps.length === 0;
  const currentStep = steps[cur] || null;
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;
  const isBipartite = currentStep?.isBipartite ?? null;

  const colorMap = currentStep?.colorSnapshot || {};
  const group0 = currentStep?.group0Nodes || [];
  const group1 = currentStep?.group1Nodes || [];
  const coloredCount = Object.values(colorMap).filter((val) => val !== -1).length;

  const getResultContent = () => {
    if (isIdle) {
      return (
        <span className="text-[11px] text-[var(--muted-color)] italic">
          Run algorithm to check bipartiteness
        </span>
      );
    }

    if (isBipartite === false) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-[#DC2626] font-mono drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
            ❌ NOT BIPARTITE
          </span>
          <span className="text-[11px] text-[var(--muted-color)] font-mono font-normal truncate">
            Conflict: Node {currentStep?.currentNode} and Node {currentStep?.neighborNode} share the same color.
          </span>
        </div>
      );
    }

    if (isBipartite === true && isPlaybackFinished) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-[#00C896] font-mono">
            ✓ BIPARTITE (2-COLORABLE)
          </span>
          <span className="text-[11px] text-[var(--muted-color)] font-mono font-normal">
            Yellow Group (G0): {group0.join(', ') || 'none'} | Orange Group (G1): {group1.join(', ') || 'none'}
          </span>
        </div>
      );
    }

    // In progress
    return (
      <div className="flex items-center gap-4 font-mono text-[12px] font-normal text-[var(--muted-color)]">
        <span>Colored: {coloredCount} / {nodes.length}</span>
        <span>🟡 Yellow (G0): {group0.length}</span>
        <span>🟠 Orange (G1): {group1.length}</span>
        {currentStep?.currentNode && (
          <span className="text-amber-400">Current Node: {currentStep.currentNode}</span>
        )}
      </div>
    );
  };

  const hasConflict = isBipartite === false;
  const isComplete = isPlaybackFinished && isBipartite !== null;

  return (
    <div className="w-full h-[80px] flex flex-row bg-[var(--panel-bg)]/60 backdrop-blur-md border-t border-[var(--border-color)] shrink-0 select-none">
      
      {/* FULL WIDTH OUTPUT PANEL */}
      <div className="w-full flex flex-col">
        <div className="h-[28px] flex items-center px-4 gap-2 border-b border-[var(--border-color)]/40">
          <div className={`w-[6px] h-[6px] rounded-full ${hasConflict ? 'bg-[#DC2626] shadow-[0_0_6px_rgba(220,38,38,0.5)]' : isBipartite === true ? 'bg-[#00C896] shadow-[0_0_6px_rgba(0,200,150,0.5)]' : 'bg-[#FFB800] shadow-[0_0_6px_rgba(255,184,0,0.5)]'} animate-pulse`} />
          <span className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans">
            OUTPUT — Bipartite Graph Check
          </span>
          {isComplete && isBipartite === true && (
            <span className="ml-auto text-[10px] font-semibold font-sans uppercase tracking-[0.06em] text-[#00C896] bg-[#00C896]/10 border border-[#00C896]/30 rounded-full px-2 py-0.5">
              COMPLETE
            </span>
          )}
          {hasConflict && (
            <span className="ml-auto text-[10px] font-semibold font-sans uppercase tracking-[0.06em] text-[#DC2626] bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-full px-2 py-0.5 animate-pulse">
              CONFLICT FOUND
            </span>
          )}
          {!isIdle && !isComplete && !hasConflict && (
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
