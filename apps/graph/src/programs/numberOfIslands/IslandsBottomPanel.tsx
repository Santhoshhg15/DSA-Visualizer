import { useIslandsStore } from '../../stores/useIslandsStore';

const ISLAND_COLORS = [
  '#7C3AED', // Island 1: purple
  '#0891B2', // Island 2: cyan
  '#DC2626', // Island 3: red
  '#D97706', // Island 4: amber
  '#059669', // Island 5: emerald
  '#DB2777', // Island 6: pink
];

export function IslandsBottomPanel() {
  const { steps, cur, playing } = useIslandsStore();

  const isIdle = steps.length === 0;
  const currentStep = steps[cur] || null;
  const visitedOrder = currentStep?.auxiliaryState?.visitedOrder || [];
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;
  const currentCell = currentStep?.currentCell;

  return (
    <div className="w-full h-[80px] flex flex-row bg-[var(--panel-bg)]/60 backdrop-blur-md border-t border-[var(--border-color)] shrink-0 select-none">

      {/* FULL WIDTH OUTPUT PANEL */}
      <div className="w-full flex flex-col">
        <div className="h-[28px] flex items-center px-4 gap-2 border-b border-[var(--border-color)]/40">
          <div className="w-[6px] h-[6px] rounded-full bg-[#7C3AED] shadow-[0_0_6px_rgba(124,58,237,0.5)] animate-pulse" />
          <span className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans">
            OUTPUT — Number of Islands
          </span>
          {isPlaybackFinished && (
            <span className="ml-auto text-[10px] font-semibold font-sans uppercase tracking-[0.06em] text-[#00C896] bg-[#00C896]/10 border border-[#00C896]/30 rounded-full px-2 py-0.5">
              COMPLETE
            </span>
          )}
          {!isIdle && !isPlaybackFinished && (
            <span className="ml-auto text-[10px] font-semibold font-sans uppercase tracking-[0.06em] text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-full px-2 py-0.5 animate-pulse">
              RUNNING
            </span>
          )}
        </div>
        <div className="flex-1 overflow-x-auto flex items-center px-4 whitespace-nowrap custom-scrollbar">
          {isIdle ? (
            <span className="text-[11px] text-[var(--muted-color)] italic">
              Run algorithm to see output
            </span>
          ) : (
            <div className="flex items-center gap-3">
              {/* Islands count badge */}
              <span className="text-[12px] font-mono font-semibold text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded px-2 py-0.5">
                Islands: {currentStep?.islandsCount || 0}
              </span>

              {/* Island details */}
              {Array.from({ length: currentStep?.islandsCount || 0 }).map((_, idx) => {
                const id = idx + 1;
                const color = ISLAND_COLORS[(id - 1) % ISLAND_COLORS.length];
                
                const islandCells: [number, number][] = [];
                visitedOrder.forEach(([vr, vc]: [number, number]) => {
                  const coordKey = `${vr},${vc}`;
                  if (currentStep?.islandMap[coordKey] === id) {
                    islandCells.push([vr, vc]);
                  }
                });

                return (
                  <div key={`output-island-${id}`} className="flex items-center gap-1">
                    <span className="font-mono text-[12px] font-semibold" style={{ color }}>
                      I{id}:
                    </span>
                    {islandCells.map(([cr, cc], cIdx) => {
                      const isCellCurrent = currentCell && currentCell[0] === cr && currentCell[1] === cc;
                      return (
                        <div key={`cell-${cr}-${cc}`} className="flex items-center">
                          <span className={`font-mono text-[11px] font-medium ${isCellCurrent ? 'text-[#FFB800]' : ''}`} style={!isCellCurrent ? { color } : {}}>
                            [{cr},{cc}]
                          </span>
                          {cIdx < islandCells.length - 1 && (
                            <span className="text-[var(--muted-color)] text-[10px] font-sans mx-0.5">→</span>
                          )}
                        </div>
                      );
                    })}
                    {idx < (currentStep?.islandsCount || 0) - 1 && (
                      <span className="text-[var(--border-color)] mx-1">│</span>
                    )}
                  </div>
                );
              })}

              {isPlaybackFinished && (
                <span className="text-[12px] font-semibold text-[#00C896] font-mono ml-2">
                  ✓ {currentStep?.islandsCount} islands found
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
