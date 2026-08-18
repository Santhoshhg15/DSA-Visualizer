import React from 'react';

interface PilesArrayProps {
  piles: number[];
  currentSpeed: number | null;
  hoursPerPile: number[] | null;
  h: number;
  /** Index of the bottleneck pile (for connector positioning) */
  onBottleneckIndex?: (idx: number | null) => void;
}

// ── KOKO MONKEY CHARACTER SVG (outline, suite icon language) ──
const KokoCharacter: React.FC<{ state: 'idle' | 'eating' | 'done' }> = ({ state }) => {
  const bodyColor = state === 'eating' ? 'var(--accent-indigo)' : state === 'done' ? 'var(--accent-green)' : 'var(--muted-color)';
  const accentOpacity = state === 'eating' ? 1 : 0.65;

  return (
    <svg
      width="52"
      height="56"
      viewBox="0 0 52 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: accentOpacity, transition: 'all 0.3s ease' }}
      aria-label="Koko the monkey"
    >
      {/* Ears */}
      <circle cx="10" cy="20" r="5" stroke={bodyColor} strokeWidth="2" fill="none" />
      <circle cx="42" cy="20" r="5" stroke={bodyColor} strokeWidth="2" fill="none" />
      {/* Head */}
      <circle cx="26" cy="19" r="12" stroke={bodyColor} strokeWidth="2" fill="none" />
      {/* Face details: eyes */}
      <circle cx="22" cy="17" r="2" fill={bodyColor} />
      <circle cx="30" cy="17" r="2" fill={bodyColor} />
      {/* Nose */}
      <ellipse cx="26" cy="21" rx="3" ry="2" stroke={bodyColor} strokeWidth="1.5" fill="none" />
      {/* Mouth - smile when eating, neutral when idle */}
      {state === 'eating' ? (
        <path d="M 21 25 Q 26 29 31 25" stroke={bodyColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : state === 'done' ? (
        <path d="M 21 24 Q 26 28 31 24" stroke={bodyColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M 22 24 Q 26 26 30 24" stroke={bodyColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* Body */}
      <path d="M 14 32 Q 12 44 16 52" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 38 32 Q 40 44 36 52" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 14 32 L 38 32" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Arms — raised/holding when eating, relaxed otherwise */}
      {state === 'eating' ? (
        <>
          <path d="M 16 34 Q 8 26 6 20" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 36 34 Q 44 26 46 20" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M 16 36 Q 8 40 6 46" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 36 36 Q 44 40 46 46" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
      {/* Tail */}
      <path d="M 36 52 Q 46 54 48 46 Q 50 38 44 38" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Banana held in hand when eating */}
      {state === 'eating' && (
        <path d="M 44 18 Q 48 14 46 10 Q 44 6 40 8" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
};

export const PilesArray: React.FC<PilesArrayProps> = ({
  piles,
  currentSpeed,
  hoursPerPile,
  h,
  onBottleneckIndex,
}) => {
  const isEvaluating = currentSpeed !== null && hoursPerPile !== null;
  const maxHours = isEvaluating && hoursPerPile.length > 0 ? Math.max(...hoursPerPile) : -1;

  // Find the bottleneck pile index (first pile with maxHours)
  let bottleneckIdx: number | null = null;
  if (isEvaluating && hoursPerPile) {
    bottleneckIdx = hoursPerPile.findIndex((hrs) => hrs === maxHours);
  }

  // Notify parent of bottleneck index for connector line positioning
  React.useEffect(() => {
    onBottleneckIndex?.(bottleneckIdx);
  }, [bottleneckIdx, onBottleneckIndex]);

  // Determine Koko character state
  const kokoState = isEvaluating ? 'eating' : 'idle';

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-[18px] shadow-sm select-none animate-fadeInUp font-sans">
      {/* 1. SECTION HEADER */}
      <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-[var(--border-color)] text-xs">
        <div className="flex items-center gap-2">
          {/* Koko icon in header instead of Layers */}
          <svg width="16" height="16" viewBox="0 0 52 56" fill="none" className="shrink-0" aria-hidden="true">
            <circle cx="26" cy="19" r="12" stroke="var(--accent-indigo)" strokeWidth="3" fill="none" />
            <circle cx="22" cy="17" r="2.5" fill="var(--accent-indigo)" />
            <circle cx="30" cy="17" r="2.5" fill="var(--accent-indigo)" />
            <ellipse cx="26" cy="21" rx="3" ry="2" stroke="var(--accent-indigo)" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="text-[10.5px] font-bold tracking-widest text-[var(--muted-color)] uppercase font-sans">
            BANANA PILES
          </span>
          <span className="text-[11px] text-[var(--muted-color)] font-mono font-normal">
            ({piles.length} piles, {h} hours available)
          </span>
        </div>

        {/* Current speed pill badge if evaluating (9999px full pill) */}
        {isEvaluating && (
          <span className="text-[10.5px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[var(--accent-indigo-bg)] text-[var(--accent-indigo)] border border-[var(--accent-indigo)]/30">
            testing speed = {currentSpeed} / hr
          </span>
        )}
      </div>

      {/* 2. KOKO CHARACTER + PILES ROW */}
      <div className="flex items-end justify-center gap-3">
        {/* Koko Character — positioned at left of the tiles row */}
        <div
          style={{ transition: 'all 0.4s ease' }}
          className="flex-shrink-0 flex flex-col items-center gap-1 pb-6"
        >
          <KokoCharacter state={kokoState} />
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider font-sans">
            {isEvaluating ? 'eating' : 'idle'}
          </span>
        </div>

        {/* PILE TILES (10px radius, 12px gap, 22-24px numbers) */}
        <div className="flex flex-wrap items-center justify-center gap-[12px] py-1 flex-1">
          {piles.map((pile, i) => {
            const hrs = hoursPerPile ? hoursPerPile[i] : null;
            const isBottleneck = isEvaluating && hrs !== null && hrs === maxHours;

            return (
              <div
                key={i}
                id={`pile-tile-${i}`}
                className="flex flex-col items-center gap-1.5 relative"
              >
                {/* Bottleneck MAX Badge (9999px full pill) */}
                {isBottleneck && (
                  <span className="absolute -top-2 -right-1.5 z-10 bg-[rgba(99,102,241,0.25)] text-[var(--accent-indigo)] text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-[var(--accent-indigo)]/60 shadow-sm uppercase tracking-wider font-sans">
                    MAX
                  </span>
                )}

                {/* Tile Container (Exact 10px radius, 88px × 84px for bigger text) */}
                <div
                  style={{
                    width: '88px',
                    height: '84px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 4px',
                    transition: 'all 0.25s ease',
                    ...(isEvaluating
                      ? isBottleneck
                        ? {
                            background: 'var(--accent-indigo-bg)',
                            border: '2px solid var(--accent-indigo)',
                            boxShadow: '0 0 16px rgba(99, 102, 241, 0.35)',
                          }
                        : {
                            background: 'var(--accent-blue-bg)',
                            border: '2px solid var(--accent-blue)',
                          }
                      : {
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-color)',
                        }),
                  }}
                >
                  {/* Top Section: Pile size number — 22px, weight 700 */}
                  <div className="flex flex-col items-center leading-none">
                    <span
                      style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}
                      className={
                        isEvaluating
                          ? isBottleneck
                            ? 'text-[var(--accent-indigo)]'
                            : 'text-[var(--accent-blue)]'
                          : 'text-[var(--text-color)]'
                      }
                    >
                      {pile}
                    </span>
                    <span className="text-[8.5px] text-[var(--muted-color)] uppercase font-bold font-sans mt-0.5 tracking-wider">
                      bananas
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div
                    className={`w-full border-t my-1.5 ${
                      isEvaluating
                        ? isBottleneck
                          ? 'border-[var(--accent-indigo)]/40'
                          : 'border-[var(--accent-blue)]/30'
                        : 'border-[var(--border-color)]'
                    }`}
                  />

                  {/* Bottom Section: Hours needed at current speed */}
                  <div className="flex items-center justify-center leading-none">
                    {isEvaluating && hrs !== null ? (
                      <span className="font-mono text-[10px] font-semibold text-[var(--text-primary)]">
                        ⌈{pile}/{currentSpeed}⌉={' '}
                        <strong
                          style={{ fontWeight: 700 }}
                          className={isBottleneck ? 'text-[var(--accent-indigo)]' : 'text-[var(--accent-blue)]'}
                        >
                          {hrs}h
                        </strong>
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-[var(--muted-color)]">—</span>
                    )}
                  </div>
                </div>

                {/* Index label below tile */}
                <span className="text-[10px] font-mono font-semibold text-[var(--muted-color)]">
                  Pile {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
