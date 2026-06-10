import { useIslandsStore } from '../../stores/useIslandsStore';

const ISLAND_COLORS = [
  '#7C3AED', // Island 1: purple
  '#0891B2', // Island 2: cyan
  '#DC2626', // Island 3: red
  '#D97706', // Island 4: amber
  '#059669', // Island 5: emerald
  '#DB2777', // Island 6: pink
];

export function IslandsCanvas() {
  const { grid: initialGrid, steps, cur, playing } = useIslandsStore();
  
  if (!initialGrid || initialGrid.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-[var(--muted-color)]">No grid loaded</div>;
  }

  const rows = initialGrid.length;
  const cols = initialGrid[0].length;

  const currentStep = steps.length > 0 ? steps[cur] : null;
  const isPlaying = playing || (steps.length > 0 && cur > 0 && cur < steps.length - 1);

  // Dynamic sizing based on cols
  let cellSize = 52;
  if (cols >= 8) cellSize = 36;
  else if (cols >= 6) cellSize = 44;
  const gap = 3;

  const getCellStyles = (r: number, c: number) => {
    let bg = '#1a2744'; // WATER default
    let border = 'rgba(30, 58, 110, 0.6)';
    let text = '#4a6fa5';
    let valStr = '0';
    let pulseClass = '';
    let isScanner = false;
    let extraShadow = '';

    const isOriginalLand = initialGrid[r][c] === 1;

    if (!isPlaying && !currentStep) {
      if (isOriginalLand) {
        bg = '#14532d';
        border = '#16a34a';
        text = '#86efac';
        valStr = '1';
      }
    } else if (currentStep) {
      const coord = `${r},${c}`;
      const isCurrent = currentStep.currentCell?.[0] === r && currentStep.currentCell?.[1] === c;
      const inQueue = currentStep.queue.some(q => q[0] === r && q[1] === c);
      const isScannerPos = currentStep.scannerPosition[0] === r && currentStep.scannerPosition[1] === c;
      const isVisited = currentStep.visited.has(coord);
      const isWater = initialGrid[r][c] === 0;

      if (isScannerPos) {
        isScanner = true;
      }

      if (isCurrent) {
        bg = 'rgba(255, 184, 0, 0.4)';
        border = '#FFB800';
        text = '#ffffff';
        valStr = '1';
        pulseClass = 'animate-[nodeCurrentPulse_0.6s_ease-in-out_infinite]';
        extraShadow = '0 0 12px rgba(255,184,0,0.6)';
      } else if (inQueue) {
        bg = 'rgba(255, 140, 0, 0.3)';
        border = '#FF8C00';
        text = '#ffffff';
        valStr = '1';
      } else if (isVisited && isOriginalLand) {
        // Visited / Flooded
        const islandId = currentStep.islandMap[coord] || 1;
        const color = ISLAND_COLORS[(islandId - 1) % ISLAND_COLORS.length];
        bg = color;
        border = 'rgba(0,0,0,0.2)'; // darker shade approximation
        text = '#ffffff';
        valStr = '0';
      } else if (isOriginalLand) {
        // Unvisited Land
        bg = '#14532d';
        border = '#16a34a';
        text = '#86efac';
        valStr = '1';
      } else if (isWater) {
        // Water
        bg = '#1a2744';
        border = 'rgba(30, 58, 110, 0.6)';
        text = '#4a6fa5';
        valStr = '0';
      }
    }

    return {
      style: {
        width: cellSize,
        height: cellSize,
        backgroundColor: bg,
        borderColor: isScanner ? '#3b82f6' : border,
        borderWidth: isScanner ? '2px' : '1px',
        borderStyle: 'solid',
        color: text,
        borderRadius: '6px',
        boxShadow: extraShadow,
        transition: 'all 250ms ease'
      },
      valStr,
      pulseClass
    };
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-[var(--panel-bg)]">
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* The 2D Grid */}
      <div 
        className="relative z-10 flex flex-col"
        style={{ gap: `${gap}px` }}
      >
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`row-${r}`} className="flex flex-row" style={{ gap: `${gap}px` }}>
            {Array.from({ length: cols }).map((_, c) => {
              const { style, valStr, pulseClass } = getCellStyles(r, c);
              return (
                <div 
                  key={`cell-${r}-${c}`}
                  className={`flex items-center justify-center font-mono font-bold text-[13px] ${pulseClass}`}
                  style={style}
                >
                  {valStr}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
