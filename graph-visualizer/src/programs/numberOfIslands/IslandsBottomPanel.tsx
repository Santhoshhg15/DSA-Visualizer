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
  const { grid, steps, cur, playing } = useIslandsStore();

  const isIdle = steps.length === 0;
  const currentStep = steps[cur] || null;
  const visitedOrder = currentStep?.auxiliaryState?.visitedOrder || [];
  const currentCell = currentStep?.currentCell;
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;

  // Find all land cells in the original grid
  const allLandCells: [number, number][] = [];
  grid.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val === 1) allLandCells.push([r, c]);
    });
  });

  // Reorder allLandCells: visited ones first (in visit order), then unvisited ones (by coordinate order)
  const visitedKeys = new Set(visitedOrder.map(([r, c]) => `${r},${c}`));
  const unvisitedLand = allLandCells.filter(([r, c]) => !visitedKeys.has(`${r},${c}`));
  const orderedLandCells = [
    ...visitedOrder,
    ...unvisitedLand
  ];

  return (
    <div className="w-full h-[120px] flex flex-row bg-[var(--panel-bg)] border-t border-b border-[var(--border-color)] shrink-0 select-none">
      {/* LEFT PANEL — Visited Cells */}
      <div className="w-[60%] flex flex-col border-r border-[var(--border-color)] overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 font-['Space_Grotesk'] shrink-0">
          Visited Cells
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-2 custom-scrollbar">
          {isIdle ? (
            <div className="h-full flex items-center justify-start text-[11px] text-[var(--muted-color)] italic">
              Run algorithm to see visited cells
            </div>
          ) : (
            <div className="grid grid-flow-col auto-cols-[40px] grid-rows-2 gap-2 h-full items-center">
              {orderedLandCells.map(([r, c], idx) => {
                const coordKey = `${r},${c}`;
                const isCurrent = currentCell && currentCell[0] === r && currentCell[1] === c;
                const isVisited = visitedKeys.has(coordKey);
                
                let bg = "bg-[#FF4444]/15";
                let border = "border-[#FF4444]/50";
                let color = "text-[#FF4444]";
                let shadow = "";
                let style = {};

                if (isCurrent) {
                  bg = "bg-[#FFB800]/30";
                  border = "border-[#FFB800]";
                  color = "text-white";
                  shadow = "shadow-[0_0_8px_rgba(255,184,0,0.5)]";
                } else if (isVisited) {
                  const islandId = currentStep?.islandMap[coordKey] || 1;
                  const islandColor = ISLAND_COLORS[(islandId - 1) % ISLAND_COLORS.length];
                  bg = "";
                  border = "";
                  color = "text-white";
                  style = {
                    backgroundColor: `${islandColor}40`,
                    borderColor: islandColor
                  };
                }

                return (
                  <div
                    key={`vcell-${coordKey}`}
                    className={`w-[40px] h-[40px] flex flex-col items-center justify-center rounded-[6px] border ${bg} ${border} ${shadow} ${color} transition-all duration-300 shrink-0`}
                    style={style}
                  >
                    <span className="font-mono text-[9px] font-bold">
                      {r},{c}
                    </span>
                    <span className="font-mono text-[8px] opacity-60">
                      {idx}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL — Output */}
      <div className="w-[40%] flex flex-col overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.08em] px-3 pt-2 pb-1 font-['Space_Grotesk'] shrink-0">
          Output
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-2 custom-scrollbar flex flex-col gap-2">
          {isIdle ? (
            <div className="h-full flex items-center justify-start text-[11px] text-[var(--muted-color)] italic">
              Run algorithm to see output
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 font-mono text-xs">
              {Array.from({ length: currentStep?.islandsCount || 0 }).map((_, idx) => {
                const id = idx + 1;
                const color = ISLAND_COLORS[(id - 1) % ISLAND_COLORS.length];
                
                // Get all visited cells for this island in order
                const islandCells: [number, number][] = [];
                visitedOrder.forEach(([vr, vc]) => {
                  const coordKey = `${vr},${vc}`;
                  if (currentStep?.islandMap[coordKey] === id) {
                    islandCells.push([vr, vc]);
                  }
                });

                const isCurrentIsland = currentStep?.islandsCount === id && !isPlaybackFinished;

                return (
                  <div key={`output-island-${id}`} className="flex flex-col gap-0.5 animate-fadeInUp">
                    <div className="flex items-center flex-wrap">
                      <span className="font-bold mr-1.5" style={{ color }}>
                        Island {id}:
                      </span>
                      <div className="flex items-center flex-wrap">
                        {islandCells.map(([cr, cc], cIdx) => {
                          const isCellCurrent = currentCell && currentCell[0] === cr && currentCell[1] === cc;
                          return (
                            <div key={`cell-${cr}-${cc}`} className="flex items-center">
                              <span className={`font-bold text-[11px] ${isCellCurrent ? 'text-[#FFB800]' : ''}`} style={!isCellCurrent ? { color } : {}}>
                                [{cr},{cc}]
                              </span>
                              {cIdx < islandCells.length - 1 && (
                                <span className="text-[var(--muted-color)] text-[10px] mx-1">→</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Complete sub-status */}
                    {(!isCurrentIsland || (isPlaybackFinished && id === currentStep?.islandsCount)) && (
                      <div className="text-[10px] font-semibold pl-4" style={{ color }}>
                        ✓ Island {id} complete — {islandCells.length} cells
                      </div>
                    )}
                  </div>
                );
              })}

              {isPlaybackFinished && (
                <div className="mt-2 text-sm font-bold text-[#00C896] animate-[nodeCurrentPulse_0.6s_ease-in-out_1] flex items-center gap-1">
                  <span>✓ Total: {currentStep?.islandsCount} islands found</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
