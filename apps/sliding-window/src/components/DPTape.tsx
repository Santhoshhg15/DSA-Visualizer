import React, { useRef, useEffect, useState } from 'react';
import { useSWStore } from '../store';

interface ArrowData {
  srcX: number;
  srcY: number;
  tgtX: number;
  tgtY: number;
  offsetY: number;
}

export type DPTapeCellState = 'unfilled' | 'source' | 'active' | 'filled' | 'unreachable';

export interface DPTapeProps {
  customCellState?: (index: number) => DPTapeCellState | undefined;
  customCellBadge?: (index: number) => React.ReactNode;
  showValueAndDp?: boolean;
  arrValues?: (number | string)[];
  activeWindow?: [number, number] | null;
  tintNegatives?: boolean;
  customDpArray?: (number | null)[];
}

export const DPTape: React.FC<DPTapeProps> = ({
  customCellState,
  customCellBadge,
  showValueAndDp = false,
  arrValues = [],
  activeWindow,
  tintNegatives = false,
  customDpArray,
}) => {
  const { steps, cur, selectedProblemId } = useSWStore();
  const step = steps[cur] || steps[0];

  const dpArray = customDpArray || step?.dpArray || [];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [arrows, setArrows] = useState<ArrowData[]>([]);
  const [windowStyle, setWindowStyle] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  const effectiveWindow = activeWindow !== undefined ? activeWindow : (step as any)?.activeWindow || null;

  // Reset cellRefs array length when dpArray length changes
  if (step && cellRefs.current.length !== dpArray.length) {
    cellRefs.current = new Array(dpArray.length).fill(null);
  }

  // Window overlay measurement
  useEffect(() => {
    if (!effectiveWindow) {
      setWindowStyle(null);
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();

      const startCellIdx = effectiveWindow[0];
      const endCellIdx = effectiveWindow[1];

      const startEl = cellRefs.current[startCellIdx];
      const endEl = cellRefs.current[endCellIdx];

      if (startEl && endEl) {
        const sRect = startEl.getBoundingClientRect();
        const eRect = endEl.getBoundingClientRect();
        const scale = (wrapperRect.width / (wrapper.offsetWidth || 1)) || 1;
        const left = (sRect.left - wrapperRect.left - 4) / scale;
        const top = (sRect.top - wrapperRect.top - 4) / scale;
        const width = (eRect.right - sRect.left + 8) / scale;
        const height = (sRect.height + 8) / scale;
        setWindowStyle({ left, top, width, height });
      } else {
        setWindowStyle(null);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [effectiveWindow, step, cur]);

  // Measure cell positions after DOM render via requestAnimationFrame
  useEffect(() => {
    if (!step || (step.type as string) !== 'slide' || !step.fromIndices || step.fromIndices.length === 0) {
      setArrows([]);
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const activeEl = cellRefs.current[step.activeIndex];
      if (!activeEl) return;

      const activeRect = activeEl.getBoundingClientRect();
      const tgtX = activeRect.left - wrapperRect.left + activeRect.width / 2;
      const tgtY = activeRect.top - wrapperRect.top;

      const computed: ArrowData[] = [];
      const offsets = [75, 40];

      step.fromIndices.forEach((idx, arrIdx) => {
        const el = cellRefs.current[idx];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        computed.push({
          srcX: rect.left - wrapperRect.left + rect.width / 2,
          srcY: rect.top - wrapperRect.top,
          tgtX,
          tgtY,
          offsetY: offsets[arrIdx] || 40,
        });
      });

      setArrows(computed);
    });

    return () => cancelAnimationFrame(frameId);
  }, [step, cur]);

  function buildPath(a: ArrowData): string {
    const midX = (a.srcX + a.tgtX) / 2;
    const midY = Math.min(a.srcY, a.tgtY) - a.offsetY;
    return `M ${a.srcX} ${a.srcY} Q ${midX} ${midY} ${a.tgtX} ${a.tgtY}`;
  }

  function getCellState(index: number): DPTapeCellState {
    if (customCellState) {
      const override = customCellState(index);
      if (override) return override;
    }
    if (!step) return 'unfilled';
    const val = dpArray[index];
    if ((val as any) === 'INF') return 'unreachable';
    if (val === null) return 'unfilled';
    if (index === step.activeIndex) return 'active';
    if (((step.type as string) === 'fill' || (step.type as string) === 'candidate') && step.fromIndices.includes(index)) return 'source';
    return 'filled';
  }

  if (!step) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 0',
        backgroundColor: 'transparent',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      {/* Legend row */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          color: 'var(--muted-color)',
          marginBottom: '8px',
          fontWeight: 500,
        }}
      >
        <span>● Unvisited</span>
        <span style={{ color: 'var(--accent-amber)' }}>● In current window</span>
        <span style={{ color: 'var(--accent-green)' }}>● Part of best window found</span>
      </div>

      {/* Tape wrapper */}
      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          display: 'flex',
          gap: '8px',
          padding: '80px 16px 16px 16px',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        {/* Amber window overlay */}
        {windowStyle && (
          <div
            style={{
              position: 'absolute',
              left: `${windowStyle.left}px`,
              top: `${windowStyle.top}px`,
              width: `${windowStyle.width}px`,
              height: `${windowStyle.height}px`,
              border: '2px dashed var(--accent-amber)',
              borderRadius: '12px',
              background: 'var(--accent-amber-bg)',
              pointerEvents: 'none',
              zIndex: 15,
              boxShadow: '0 0 16px var(--accent-amber-bg)',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent-amber)',
                color: 'var(--bg-color)',
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
              }}
            >
              ACTIVE WINDOW
            </div>
          </div>
        )}
        {/* SVG overlay */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <marker
              id="arrowhead-indigo"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L6,3 z" fill="var(--accent-indigo-dim)" />
            </marker>
          </defs>

          {((step.type as string) === 'fill' || (step.type as string) === 'candidate' || (step.type as string) === 'slide') &&
            arrows.map((arrow, idx) => (
              <path
                key={`${cur}-arrow-${idx}`}
                d={buildPath(arrow)}
                stroke="var(--accent-indigo-dim)"
                strokeOpacity="0.7"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#arrowhead-indigo)"
                style={{
                  opacity: 0,
                  animation: 'fadeInArrow 200ms ease forwards',
                }}
              />
            ))}
        </svg>

        {/* Cell divs */}
        {dpArray.map((val, i) => {
          const state = getCellState(i);
          const badge = customCellBadge ? customCellBadge(i) : null;
          const origVal = arrValues[i] !== undefined ? arrValues[i] : null;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                className="dp-tape-cell"
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                style={{
                  position: 'relative',
                  width: showValueAndDp ? '58px' : '52px',
                  height: showValueAndDp ? '68px' : '52px',
                  display: 'flex',
                  flexDirection: showValueAndDp ? 'column' : 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: showValueAndDp ? '4px 2px' : '0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                  ...(state === 'unfilled' && {
                    background: 'var(--cell-unfilled-bg)',
                    border: '1px solid var(--cell-unfilled-border)',
                    color: 'transparent',
                  }),
                  ...(state === 'unreachable' && {
                    background: 'var(--cell-unreachable-bg)',
                    border: '1.5px solid var(--cell-unreachable-border)',
                    color: 'var(--cell-unreachable-text)',
                  }),
                  ...(state === 'source' && {
                    background: 'var(--cell-source-bg)',
                    border: '1.5px solid var(--cell-source-border)',
                    color: 'var(--cell-source-text)',
                  }),
                  ...(state === 'active' && {
                    background: 'var(--cell-active-bg)',
                    border: '1.5px solid var(--cell-active-border)',
                    color: 'var(--cell-active-text)',
                  }),
                  ...(state === 'filled' && {
                    background: 'var(--cell-filled-bg)',
                    border: '1.5px solid var(--cell-filled-border)',
                    color: 'var(--cell-filled-text)',
                  }),
                  ...(tintNegatives && origVal !== null && typeof origVal === 'number' && origVal < 0 && {
                    background: 'var(--accent-coral-bg)',
                    border: '1.5px solid var(--accent-coral)',
                    color: 'var(--accent-coral)',
                  }),
                }}
              >
                {badge}

                {!badge && (showValueAndDp ? (
                  <>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--text-color)',
                        lineHeight: 1,
                      }}
                    >
                      {origVal !== null ? origVal : ''}
                    </span>
                    <div
                      style={{
                        width: '80%',
                        borderTop: '1px solid var(--border-color)',
                        margin: '3px 0',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        fontFamily: 'JetBrains Mono, monospace',
                        opacity: state === 'unfilled' ? 0.4 : 1,
                      }}
                    >
                      dp={val !== null ? val : '—'}
                    </span>
                  </>
                ) : (
                  <>{(val as any) === 'INF' ? '∞' : val !== null ? val : ''}</>
                ))}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--muted-color)',
                  fontWeight: state === 'active' ? '700' : '400',
                }}
              >
                {`[${i}]`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
