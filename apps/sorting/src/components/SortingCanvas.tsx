import { useRef } from 'react';
import { useSortingStore } from '../stores/useSortingStore';
import { sortingAlgorithmCode } from '../data/sortingAlgorithmCode';

export function SortingCanvas() {
  const { array, arraySize, steps, cur, selectedAlgorithm } = useSortingStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentStep = cur >= 0 && cur < steps.length ? steps[cur] : null;

  // Derive visual states
  const activeArray = currentStep ? currentStep.arraySnapshot : array;
  const comparingIndices = currentStep?.comparingIndices || [];
  const swappingIndices = currentStep?.swappingIndices || [];
  const sortedIndices = currentStep?.sortedIndices || [];
  const pivotIndex = currentStep?.pivotIndex ?? null;
  const minIndex = currentStep?.minIndex ?? null;
  const keyIndex = currentStep?.keyIndex ?? null;
  const shiftingIndices = currentStep?.shiftingIndices || [];
  const mergeLeftIndices = currentStep?.mergeLeftIndices || [];
  const mergeRightIndices = currentStep?.mergeRightIndices || [];
  const mergeRange = currentStep?.mergeRange || null;
  const iIndex = currentStep?.iIndex ?? null;
  const jIndex = currentStep?.jIndex ?? null;

  // Determine bar width
  let barWidth = '32px';
  if (arraySize <= 10) barWidth = '60px';
  else if (arraySize <= 20) barWidth = '40px';
  else if (arraySize <= 30) barWidth = '28px';
  else if (arraySize <= 40) barWidth = '20px';
  else if (arraySize <= 50) barWidth = '16px';

  // Get color for a specific bar index
  const getBarColor = (idx: number): string => {
    if (swappingIndices.includes(idx)) return '#FF6B00'; // swapping: orange
    if (comparingIndices.includes(idx)) return '#FFB800'; // comparing: amber
    if (idx === pivotIndex) return '#7C3AED'; // pivot: purple
    if (idx === minIndex || idx === keyIndex) return '#EC4899'; // min/key: pink
    if (shiftingIndices.includes(idx)) return '#0891B2'; // shifting: cyan
    if (mergeLeftIndices.includes(idx)) return 'rgba(59, 130, 246, 0.6)'; // mergeLeft: dim blue
    if (mergeRightIndices.includes(idx)) return 'rgba(124, 58, 237, 0.6)'; // mergeRight: dim purple
    if (sortedIndices.includes(idx)) return '#00C896'; // sorted: green
    return '#3b82f6'; // default: blue
  };

  // Quick Sort pivot value for horizontal line
  const pivotValue = pivotIndex !== null && pivotIndex >= 0 && pivotIndex < activeArray.length
    ? activeArray[pivotIndex]
    : null;

  const algoMeta = selectedAlgorithm ? sortingAlgorithmCode[selectedAlgorithm] : null;

  return (
    <div 
      ref={canvasRef}
      className="flex-1 w-full h-full min-h-[300px] bg-gradient-to-br from-[var(--bg-gradient-1)] via-[var(--bg-gradient-2)] to-[var(--bg-gradient-3)] relative rounded-2xl border border-[var(--border-color)] p-6 flex flex-col justify-end overflow-hidden canvas-grid"
      style={{
        backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
        backgroundSize: '16px 16px'
      }}
    >
      {/* Header Badges */}
      <div className="absolute top-4 left-4 flex gap-2 z-10 select-none">
        {algoMeta && (
          <div className="bg-[var(--panel-bg)]/85 border border-[var(--border-color)] backdrop-blur-md rounded-lg px-3 py-1 text-[11px] font-semibold uppercase font-sans tracking-[0.06em] text-[var(--text-color)] shadow-sm">
            {algoMeta.algorithmName}
          </div>
        )}
        <div className="bg-[var(--panel-bg)]/85 border border-[var(--border-color)] backdrop-blur-md rounded-lg px-3 py-1 text-[11px] font-mono tracking-[0.06em] text-[var(--muted-color)] shadow-sm">
          n = {arraySize}
        </div>
      </div>

      {/* Quick Sort Pivot line overlay */}
      {pivotValue !== null && (
        <div 
          className="absolute left-6 right-6 border-t border-dashed border-[#7C3AED]/50 pointer-events-none transition-all duration-300 z-10"
          style={{ 
            bottom: `calc(${pivotValue}% + 48px)`,
            transform: 'translateY(-50%)'
          }}
        >
          <span className="absolute right-0 -top-5 font-mono text-[9px] font-bold text-[#7C3AED] bg-[var(--panel-bg)]/80 px-1.5 py-0.5 rounded border border-[#7C3AED]/30">
            pivot={pivotValue}
          </span>
        </div>
      )}

      <div 
        className="w-full flex items-end justify-center relative select-none"
        style={{ height: 'calc(100% - 60px)', paddingBottom: '54px' }}
      >
        <div className="flex items-end justify-center gap-[3px] max-w-full h-full">
          {activeArray.map((value, idx) => {
            const barColor = getBarColor(idx);
            
            return (
              <div 
                key={idx}
                className="flex flex-col items-center justify-end relative transition-all duration-150 h-full"
                style={{ width: barWidth }}
              >
                {/* Value Label above bar */}
                {arraySize <= 20 && (
                  <span className="font-mono text-[10px] font-bold text-white mb-1 leading-none text-center select-none animate-fadeInUp">
                    {value}
                  </span>
                )}

                {/* Vertical Bar */}
                <div 
                  className="w-full rounded-t-sm shadow-md transition-all duration-150"
                  style={{ 
                    height: `${value}%`, 
                    backgroundColor: barColor
                  }}
                />

                {/* Index Label below bar */}
                {arraySize <= 30 && (
                  <span className="absolute -bottom-5 font-mono text-[9px] text-[var(--muted-color)] text-center leading-none">
                    {idx}
                  </span>
                )}

                {/* Quick Sort dual pointers i and j */}
                {selectedAlgorithm === 'quick' && (
                  <div className="absolute -bottom-10 flex items-center justify-center gap-0.5 z-20 pointer-events-none select-none">
                    {idx === iIndex && idx === jIndex ? (
                      <span className="px-1 py-0.5 rounded-[4px] text-[9px] font-mono font-bold bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-sm border border-white/30 animate-bounce">
                        i,j
                      </span>
                    ) : (
                      <>
                        {idx === iIndex && (
                          <span className="px-1 py-0.5 rounded-[4px] text-[9px] font-mono font-bold bg-[#3B82F6] text-white shadow-sm border border-blue-400/40 animate-bounce">
                            i
                          </span>
                        )}
                        {idx === jIndex && (
                          <span className="px-1 py-0.5 rounded-[4px] text-[9px] font-mono font-bold bg-[#FF6B00] text-white shadow-sm border border-orange-400/40 animate-bounce">
                            j
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Merge Sort range bracket/underline */}
        {mergeRange && (
          <div 
            className="absolute bottom-6 h-0.5 bg-[#7C3AED]/40 border-b border-[#7C3AED]/60 pointer-events-none transition-all duration-200"
            style={{
              left: `${(mergeRange[0] / activeArray.length) * 100}%`,
              right: `${100 - ((mergeRange[1] + 1) / activeArray.length) * 100}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
