import { useBipartiteStore } from '../../stores/useBipartiteStore';

export function BipartiteBottomPanel() {
  const { steps, cur, nodes } = useBipartiteStore();

  const isIdle = steps.length === 0;
  const currentStep = steps[cur] || null;

  const colorMap = currentStep?.colorSnapshot || {};
  const group0 = currentStep?.group0Nodes || [];
  const group1 = currentStep?.group1Nodes || [];
  const conflictNodes = currentStep?.conflictNodes || [];
  const currentNode = currentStep?.currentNode || null;
  const isBipartite = currentStep?.isBipartite ?? null;

  // Count colored nodes
  const coloredCount = Object.values(colorMap).filter((val) => val !== -1).length;

  return (
    <div className="h-[120px] shrink-0 border-t border-[var(--border-color)] bg-[var(--panel-bg)]/80 backdrop-blur-md flex items-center px-4 md:px-6 relative gap-4 md:gap-8 overflow-hidden select-none">
      {/* LEFT SECTION - Visited / Colored Array */}
      <div className="flex-1 flex flex-col gap-1.5 h-full py-3 overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-1 shrink-0">
          Color Array
        </div>
        <div className="flex-1 flex flex-row gap-2 overflow-x-auto items-center custom-scrollbar py-1">
          {nodes.map((node, idx) => {
            const colorVal = colorMap[node.id] !== undefined ? colorMap[node.id] : -1;
            const isCurrent = currentNode === node.id;
            const isConflict = conflictNodes.includes(node.id);

            let boxStyle = 'bg-red-500/15 border-red-500/50 text-red-500';
            let shadowStyle = '';
            let animationClass = '';
            let scaleClass = 'scale-100';

            if (isConflict) {
              boxStyle = 'bg-red-600/40 border-red-600 text-white';
              animationClass = 'animate-conflict-flash';
            } else if (colorVal === 0) {
              boxStyle = 'bg-[#FFB800]/25 border-[#FFB800] text-white transition-colors duration-300';
              if (isCurrent) {
                shadowStyle = 'shadow-[0_0_10px_rgba(255,184,0,0.7)]';
                scaleClass = 'scale-105';
              }
            } else if (colorVal === 1) {
              boxStyle = 'bg-[#FF6B00]/25 border-[#FF6B00] text-white transition-colors duration-300';
              if (isCurrent) {
                shadowStyle = 'shadow-[0_0_10px_rgba(255,107,0,0.7)]';
                scaleClass = 'scale-105';
              }
            } else if (isCurrent) {
              boxStyle = 'bg-red-500/30 border-red-500 text-white';
              shadowStyle = 'shadow-[0_0_10px_rgba(239,68,68,0.7)]';
              scaleClass = 'scale-105';
            }

            return (
              <div
                key={`array-box-${node.id}`}
                className={`w-[36px] h-[40px] flex flex-col items-center justify-between py-1 rounded-[6px] border ${boxStyle} ${shadowStyle} ${scaleClass} ${animationClass} shrink-0 font-mono`}
              >
                {/* Top: Node label */}
                <span className="text-[11px] font-bold leading-none">{node.id}</span>
                {/* Middle: Color value */}
                <span className="text-[9px] font-medium leading-none">{colorVal}</span>
                {/* Bottom: Index */}
                <span className="text-[8px] text-[var(--muted-color)] leading-none">{idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-px h-16 bg-[var(--border-color)] opacity-60 self-center hidden md:block"></div>

      {/* RIGHT SECTION - Result Output */}
      <div className="w-[300px] flex flex-col overflow-hidden h-full py-3">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-1 pb-1 shrink-0">
          Result
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 overflow-hidden">
          {isIdle ? (
            <span className="text-[11px] text-[var(--muted-color)] italic">
              Run algorithm to check bipartiteness
            </span>
          ) : isBipartite === false ? (
            <div className="animate-[shake_0.3s_ease-in-out] flex flex-col items-center max-w-full">
              <span className="text-base font-bold text-[#DC2626] font-mono leading-tight">
                ❌ NOT BIPARTITE
              </span>
              <span className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono truncate max-w-full">
                Conflict: {currentStep?.currentNode} &amp; {currentStep?.neighborNode} share color
              </span>
            </div>
          ) : isBipartite === true ? (
            <div className="animate-[bounce_0.3s_ease-in-out] flex flex-col items-center max-w-full">
              <span className="text-base font-bold text-[#00C896] font-mono leading-tight">
                ✓ BIPARTITE
              </span>
              <div className="flex flex-col gap-0.5 mt-1 font-mono text-[9px] text-[var(--muted-color)] w-full truncate text-center">
                <div className="truncate">🟡 G0: {group0.join(', ')}</div>
                <div className="truncate">🟠 G1: {group1.join(', ')}</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5 font-mono text-[11px] text-[var(--muted-color)]">
              <span>Colored: {coloredCount} / {nodes.length} nodes</span>
              <div className="flex gap-2 text-[10px] justify-center mt-0.5">
                <span>🟡 G0: {group0.length}</span>
                <span>🟠 G1: {group1.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
