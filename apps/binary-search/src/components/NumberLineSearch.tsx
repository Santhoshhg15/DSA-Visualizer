import React, { useRef, useEffect, useState } from 'react';

interface NumberLineSearchProps {
  low: number;
  high: number;
  mid: number | null;
  rangeMin: number;
  rangeMax: number;
  eliminatedLeft: number;
  eliminatedRight: number;
  stepType?: 'init' | 'check' | 'narrow' | 'done';
}

export const NumberLineSearch: React.FC<NumberLineSearchProps> = ({
  low,
  high,
  mid,
  rangeMin,
  rangeMax,
  stepType,
}) => {
  const trackWrapperRef = useRef<HTMLDivElement>(null);

  const [trackWidth, setTrackWidth] = useState<number>(700);
  const [lowX, setLowX] = useState<number>(0);
  const [highX, setHighX] = useState<number>(0);
  const [midX, setMidX] = useState<number | null>(null);
  const [midPulse, setMidPulse] = useState(false);

  // Trigger pulse animation on mid change
  useEffect(() => {
    if (mid !== null) {
      setMidPulse(false);
      const t = setTimeout(() => setMidPulse(true), 30);
      return () => clearTimeout(t);
    } else {
      setMidPulse(false);
    }
  }, [mid]);

  // Measure actual DOM track width and calculate exact pixel positions
  useEffect(() => {
    const trackEl = trackWrapperRef.current;
    if (!trackEl) return;

    const measureAndCalculate = () => {
      const rect = trackEl.getBoundingClientRect();
      const width = rect.width;
      if (width <= 0) return;
      setTrackWidth(width);

      if (rangeMax === rangeMin) {
        setLowX(width / 2);
        setHighX(width / 2);
        setMidX(mid !== null ? width / 2 : null);
        return;
      }

      const valueToX = (val: number) => {
        const ratio = Math.max(0, Math.min(1, (val - rangeMin) / (rangeMax - rangeMin)));
        return ratio * width;
      };

      setLowX(valueToX(low));
      setHighX(valueToX(high));
      setMidX(mid !== null ? valueToX(mid) : null);
    };

    const frameId = requestAnimationFrame(measureAndCalculate);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measureAndCalculate);
    });
    observer.observe(trackEl);

    window.addEventListener('resize', measureAndCalculate);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', measureAndCalculate);
    };
  }, [low, high, mid, rangeMin, rangeMax]);

  // ── COLLISION AVOIDANCE FOR BADGE OVERLAP PREVENTION ──
  const MIN_BADGE_GAP = 72;

  const items = [
    { id: 'low', trueX: lowX },
    { id: 'high', trueX: highX },
    ...(midX !== null ? [{ id: 'mid', trueX: midX }] : []),
  ].sort((a, b) => a.trueX - b.trueX);

  const adjXMap: Record<string, number> = {};
  items.forEach((item) => { adjXMap[item.id] = item.trueX; });

  for (let i = 1; i < items.length; i++) {
    const prevId = items[i - 1].id;
    const currId = items[i].id;
    if (adjXMap[currId] - adjXMap[prevId] < MIN_BADGE_GAP) {
      adjXMap[currId] = adjXMap[prevId] + MIN_BADGE_GAP;
    }
  }

  const totalTrueCenter = items.length > 0
    ? items.reduce((sum, item) => sum + item.trueX, 0) / items.length : 0;
  const totalAdjCenter = items.length > 0
    ? items.reduce((sum, item) => sum + adjXMap[item.id], 0) / items.length : 0;
  const centerShift = totalAdjCenter - totalTrueCenter;
  items.forEach((item) => { adjXMap[item.id] -= centerShift; });

  const padding = 42;
  items.forEach((item) => {
    if (adjXMap[item.id] < padding) adjXMap[item.id] = padding;
    if (adjXMap[item.id] > trackWidth - padding) adjXMap[item.id] = trackWidth - padding;
  });

  const adjLowX = adjXMap['low'] ?? lowX;
  const adjHighX = adjXMap['high'] ?? highX;
  const adjMidX = midX !== null ? (adjXMap['mid'] ?? midX) : null;

  const isActive = stepType === 'check' || stepType === 'narrow';

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-[18px] shadow-sm select-none animate-fadeInUp font-sans">
      {/* 1. LEGEND (HEADER ROW INSIDE CARD) */}
      <div className="flex flex-wrap items-center justify-between pb-2.5 mb-3 border-b border-[var(--border-color)] text-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs">🎯</span>
          <span className="text-[10.5px] font-bold tracking-widest text-[var(--muted-color)] uppercase font-sans">
            SEARCH SPACE RANGE
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-[11px] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--muted-color)] opacity-50" />
            <span className="text-[var(--text-muted)]">Eliminated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-blue)]" />
            <span className="text-[var(--text-muted)]">Active range</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />
            <span className="text-[var(--text-muted)] font-bold" style={{ fontWeight: 700 }}>low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-coral)]" />
            <span className="text-[var(--text-muted)] font-bold" style={{ fontWeight: 700 }}>high</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-indigo)]" />
            <span className="text-[var(--text-muted)] font-bold" style={{ fontWeight: 700 }}>mid</span>
          </div>
        </div>
      </div>

      {/* 2. MEASURED DOM TRACK & SVG OVERLAY (132px height) */}
      <div ref={trackWrapperRef} className="relative w-full h-[132px]">
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${trackWidth || 700} 132`}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="diag-stripe-pattern" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="var(--muted-color)" strokeWidth="2.5" opacity="0.35" />
            </pattern>

            {/* Glow filter for mid marker pulse */}
            <filter id="mid-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── TRACK BASE (rx=10) ── */}
          <rect x="0" y="82" width={trackWidth} height="20" rx="10"
            fill="var(--input-bg)" stroke="var(--border-color)" strokeWidth="1.5" />

          {/* Eliminated Left Region */}
          {lowX > 0 && (
            <rect x="0" y="82" width={Math.max(0, lowX)} height="20"
              rx={lowX > 10 ? '10' : '0'}
              fill="url(#diag-stripe-pattern)" opacity="0.6" />
          )}

          {/* Active Search Range Fill (rx=10) — full-saturation blue */}
          <rect x={lowX} y="82" width={Math.max(0, highX - lowX)} height="20" rx="10"
            fill="var(--accent-blue)" opacity={isActive ? 1 : 0.7} />

          {/* Eliminated Right Region */}
          {highX < trackWidth && (
            <rect x={highX} y="82" width={Math.max(0, trackWidth - highX)} height="20"
              rx={trackWidth - highX > 10 ? '10' : '0'}
              fill="url(#diag-stripe-pattern)" opacity="0.6" />
          )}

          {/* ── TICK LABELS ── */}
          <text x="0" y="118" fill="var(--muted-color)" fontSize="11"
            fontFamily="JetBrains Mono" textAnchor="start">{rangeMin}</text>
          <text x={trackWidth} y="118" fill="var(--muted-color)" fontSize="11"
            fontFamily="JetBrains Mono" textAnchor="end">{rangeMax}</text>

          {/* ── LOW POINTER ── */}
          <path d={`M ${adjLowX} 58 L ${lowX} 82`}
            stroke="var(--accent-blue)" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points={`${lowX - 5},76 ${lowX + 5},76 ${lowX},82`} fill="var(--accent-blue)" />
          <circle cx={lowX} cy="82" r="3" fill="var(--accent-blue)" />

          {/* Low Pointer Badge — full pill, bold 700, generous padding 10×20 */}
          <g transform={`translate(${adjLowX}, 46)`}>
            <rect x="-36" y="-14" width="72" height="28" rx="9999"
              fill="var(--accent-blue-bg)" stroke="var(--accent-blue)" strokeWidth="1.5" />
            <text x="0" y="5" fill="var(--accent-blue)" fontSize="12"
              fontWeight="700" fontFamily="JetBrains Mono" textAnchor="middle">
              low = {low}
            </text>
          </g>

          {/* ── HIGH POINTER ── */}
          <path d={`M ${adjHighX} 58 L ${highX} 82`}
            stroke="var(--accent-coral)" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points={`${highX - 5},76 ${highX + 5},76 ${highX},82`} fill="var(--accent-coral)" />
          <circle cx={highX} cy="82" r="3" fill="var(--accent-coral)" />

          {/* High Pointer Badge — full pill, bold 700, generous padding */}
          <g transform={`translate(${adjHighX}, 46)`}>
            <rect x="-38" y="-14" width="76" height="28" rx="9999"
              fill="var(--accent-coral-bg)" stroke="var(--accent-coral)" strokeWidth="1.5" />
            <text x="0" y="5" fill="var(--accent-coral)" fontSize="12"
              fontWeight="700" fontFamily="JetBrains Mono" textAnchor="middle">
              high = {high}
            </text>
          </g>

          {/* ── MID POINTER (with pulse glow on new step) ── */}
          {adjMidX !== null && midX !== null && (
            <g>
              {/* Connector line from badge to true track position */}
              <path d={`M ${adjMidX} 20 L ${midX} 82`}
                stroke="var(--accent-indigo)" strokeWidth="2" />

              {/* Pointer Triangle */}
              <polygon points={`${midX - 6},75 ${midX + 6},75 ${midX},82`} fill="var(--accent-indigo)" />

              {/* Pulse ring (outer) when mid just appeared */}
              {midPulse && (
                <circle cx={midX} cy="92" r="10" fill="none"
                  stroke="var(--accent-indigo)" strokeWidth="1.5" opacity="0.4">
                  <animate attributeName="r" from="6" to="14" dur="0.6s" fill="freeze" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="0.6s" fill="freeze" />
                </circle>
              )}

              {/* Static outer glow ring */}
              <circle cx={midX} cy="92" r="7" fill="var(--accent-indigo)" opacity="0.20" />
              <circle cx={midX} cy="92" r="4" fill="var(--accent-indigo)" filter="url(#mid-glow)" />

              {/* Mid Badge — full pill, bold 700, more generous padding, indigo stroke */}
              <g transform={`translate(${adjMidX}, 12)`}>
                <rect x="-40" y="-14" width="80" height="28" rx="9999"
                  fill="var(--accent-indigo-bg)" stroke="var(--accent-indigo)" strokeWidth="2" />
                <text x="0" y="5" fill="var(--accent-indigo)" fontSize="13"
                  fontWeight="700" fontFamily="JetBrains Mono" textAnchor="middle">
                  mid = {mid}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
