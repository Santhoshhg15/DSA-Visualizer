import React, { useState, useEffect, useRef } from 'react';
import { useSWStore } from '../store';
import { DPTape } from './DPTape';
import { ZoomControls } from './ZoomControls';
import { type KDistinctStep } from '../engines/longestSubstrKDistinct';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

interface RenderedChip {
  char: string;
  count: number;
  isExiting: boolean;
  isPulse: boolean;
}

export const KDistinctVisualizer: React.FC = () => {
  const { steps, cur, kdString, kdK } = useSWStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = (steps[cur] || steps[0]) as KDistinctStep;
  const text = kdString || "ecebaacbbaee";

  // Positions of pointers relative to DPTape wrapper
  const [leftX, setLeftX] = useState<number>(0);
  const [rightX, setRightX] = useState<number>(0);
  const [pointerY, setPointerY] = useState<number>(0);

  // Custom active window overlay style
  const [windowStyle, setWindowStyle] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Pulse animation on right pointer step expansion
  const prevRightRef = useRef<number>(-1);
  const [rightPulse, setRightPulse] = useState<boolean>(false);

  // Distinct character count pulse on size change
  const prevSizeRef = useRef<number>(0);
  const [counterPulse, setCounterPulse] = useState<boolean>(false);

  // Max length pulse on increase
  const prevMaxLenRef = useRef<number>(0);
  const [maxLenPulse, setMaxLenPulse] = useState<boolean>(false);

  // Local state for chips to handle fade-out animations on removal
  const [renderedChips, setRenderedChips] = useState<Record<string, RenderedChip>>({});

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = text.length * 68 + 120;
    const contentHeight = 480;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
    window.addEventListener('resize', handleFitScreen);
    return () => window.removeEventListener('resize', handleFitScreen);
  }, [kdString]);

  // Track position measurements & Window overlay bounds
  useEffect(() => {
    const updateLayout = () => {
      const container = centerStageRef.current;
      const overlayContainer = overlayContainerRef.current;
      if (!container || !overlayContainer) return;

      const cells = container.querySelectorAll('.dp-tape-cell');
      if (cells.length === 0) {
        setWindowStyle(null);
        return;
      }

      // Measure origin and exact transform scale factor
      const originRect = overlayContainer.getBoundingClientRect();
      const scale = (originRect.width / (overlayContainer.offsetWidth || 1)) || 1;

      // Left pointer X & Y
      const leftCellIdx = step.left;
      const leftCell = cells[leftCellIdx] as HTMLElement | undefined;
      if (leftCell) {
        const leftRect = leftCell.getBoundingClientRect();
        setLeftX((leftRect.left - originRect.left + leftRect.width / 2) / scale);
        setPointerY((leftRect.top - originRect.top) / scale);
      }

      // Right pointer X
      const rightCellIdx = step.right;
      if (rightCellIdx >= 0) {
        const rightCell = cells[rightCellIdx] as HTMLElement | undefined;
        if (rightCell) {
          const rightRect = rightCell.getBoundingClientRect();
          setRightX((rightRect.left - originRect.left + rightRect.width / 2) / scale);
        }
      } else {
        // Init state
        const firstCell = cells[0] as HTMLElement | undefined;
        if (firstCell) {
          const firstRect = firstCell.getBoundingClientRect();
          setRightX((firstRect.left - originRect.left - 20) / scale);
        }
      }

      // Custom window overlay bounds
      if (step.type !== 'init' && step.type !== 'done' && step.right >= step.left) {
        const rightCell = cells[step.right] as HTMLElement | undefined;
        if (leftCell && rightCell) {
          const leftRect = leftCell.getBoundingClientRect();
          const rightRect = rightCell.getBoundingClientRect();

          setWindowStyle({
            left: (leftRect.left - originRect.left - 4) / scale,
            top: (leftRect.top - originRect.top - 4) / scale,
            width: (rightRect.right - leftRect.left + 8) / scale,
            height: (Math.max(leftRect.height, rightRect.height) + 8) / scale,
          });
        }
      } else {
        setWindowStyle(null);
      }
    };

    const frameId = requestAnimationFrame(updateLayout);
    return () => cancelAnimationFrame(frameId);
  }, [step, cur, zoom, pan]);

  // Pulse & Chip transition triggers
  useEffect(() => {
    // Right pulse
    if (step.right !== prevRightRef.current) {
      if (step.type === 'expand') {
        setRightPulse(true);
        const timer = setTimeout(() => setRightPulse(false), 250);
        return () => clearTimeout(timer);
      }
    }
    prevRightRef.current = step.right;
  }, [step]);

  useEffect(() => {
    // Counter size pulse
    const size = Object.keys(step.freqMap || {}).length;
    if (size !== prevSizeRef.current) {
      setCounterPulse(true);
      const timer = setTimeout(() => setCounterPulse(false), 300);
      prevSizeRef.current = size;
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    // Max length pulse
    if (step.maxLen > prevMaxLenRef.current) {
      setMaxLenPulse(true);
      const timer = setTimeout(() => setMaxLenPulse(false), 500);
      prevMaxLenRef.current = step.maxLen;
      return () => clearTimeout(timer);
    }
    prevMaxLenRef.current = step.maxLen;
  }, [step.maxLen]);

  // Handle exiting/decrement chip transitions
  useEffect(() => {
    const currentMap = step.freqMap || {};
    const nextChips: Record<string, RenderedChip> = {};

    // Standard chips in current window
    Object.keys(currentMap).forEach((char) => {
      const isPulse = step.type === 'decrement' && step.affectedChar === char;
      nextChips[char] = {
        char,
        count: currentMap[char],
        isExiting: false,
        isPulse,
      };
    });

    // Animate exiting chip
    if (step.type === 'remove-fully' && step.affectedChar) {
      const char = step.affectedChar;
      if (renderedChips[char] && !currentMap[char]) {
        nextChips[char] = {
          char,
          count: 0,
          isExiting: true,
          isPulse: false,
        };

        const timer = setTimeout(() => {
          setRenderedChips((prev) => {
            const copy = { ...prev };
            delete copy[char];
            return copy;
          });
        }, 200);

        setRenderedChips(nextChips);
        return () => clearTimeout(timer);
      }
    }

    setRenderedChips(nextChips);
  }, [step, cur]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
    } else {
      setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const customCellState = (index: number) => {
    if (step.type === 'init') return 'unfilled';
    if (index === step.left) return 'active';
    if (index === step.right) return 'active';
    if (index > step.left && index < step.right) return 'filled';
    return 'unfilled';
  };

  const customCellBadge = (index: number) => {
    return (
      <span
        style={{
          fontSize: '16px',
          fontWeight: index >= step.left && index <= step.right ? 800 : 500,
          color: index > step.right ? 'var(--muted-color)' : 'var(--text-color)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {text[index]}
      </span>
    );
  };

  const distinctCount = Object.keys(step.freqMap || {}).length;
  const isOverLimit = distinctCount > kdK;

  return (
    <div
      ref={centerStageRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <style>{`
        @keyframes rightPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4); }
          70% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(248, 113, 113, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
        }
        @keyframes chipFlash {
          0% { border-color: var(--accent-coral); box-shadow: 0 0 8px var(--accent-coral); }
          100% { border-color: var(--border-color); }
        }
        @keyframes countScalePulse {
          0% { transform: scale(1); color: var(--accent-indigo); }
          50% { transform: scale(1.3); color: var(--accent-coral); }
          100% { transform: scale(1); }
        }
        @keyframes counterPulseAnim {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .right-pulse {
          animation: rightPulse 0.25s ease-out;
        }
        .chip-over-limit-flash {
          animation: chipFlash 0.2s ease-in-out;
        }
        .count-scale-pulse {
          animation: countScalePulse 0.15s ease-in-out;
        }
        .counter-pulse {
          animation: counterPulseAnim 0.3s ease-in-out;
        }
        .max-pulse {
          animation: counterPulseAnim 0.5s ease-in-out;
        }
      `}</style>

      <ZoomControls
        zoom={zoom}
        setZoom={setZoom}
        minZoom={ZOOM_MIN}
        maxZoom={ZOOM_MAX}
        step={ZOOM_STEP}
        onFitScreen={handleFitScreen}
        onResetPan={() => setPan({ x: 0, y: 0 })}
      />

      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            width: '100%',
          }}
          className="p-4 pointer-events-auto"
        >
          {/* TAPE LEGEND */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cell-unfilled-border)' }} />
              <span>Outside window</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
              <span>In current window</span>
            </div>
          </div>

          {/* MAIN TAPE CONTAINER WITH POINTERS OVERLAY */}
          <div ref={overlayContainerRef} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            {/* Absolute pointers overlay */}
            {pointerY > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              >
                {/* LEFT POINTER BADGE */}
                {leftX > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${leftX}px`,
                      top: `${pointerY - 54}px`,
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--accent-blue)',
                        background: 'var(--accent-blue-bg)',
                        color: 'var(--accent-blue)',
                        boxShadow: '0 2px 8px rgba(96, 165, 250, 0.15)',
                      }}
                    >
                      left = {step.left}
                    </div>
                    <div style={{ width: '0px', height: '28px', borderLeft: '1.5px dashed var(--accent-blue)', marginTop: '2px' }} />
                  </div>
                )}

                {/* RIGHT POINTER BADGE */}
                {rightX > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${rightX}px`,
                      top: `${pointerY - 54}px`,
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'left 0.15s ease-out, top 0.15s ease',
                    }}
                  >
                    <div
                      className={rightPulse ? 'right-pulse' : ''}
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--accent-coral)',
                        background: 'rgba(248, 113, 113, 0.08)',
                        color: 'var(--accent-coral)',
                        boxShadow: '0 2px 8px rgba(248, 113, 113, 0.15)',
                      }}
                    >
                      right = {step.right}
                    </div>
                    <div style={{ width: '0px', height: '28px', borderLeft: '1.5px dashed var(--accent-coral)', marginTop: '2px' }} />
                  </div>
                )}
              </div>
            )}

            {/* Custom Window Overlay */}
            {windowStyle && (
              <div
                style={{
                  position: 'absolute',
                  left: `${windowStyle.left}px`,
                  top: `${windowStyle.top}px`,
                  width: `${windowStyle.width}px`,
                  height: `${windowStyle.height}px`,
                  borderRadius: '12px',
                  pointerEvents: 'none',
                  zIndex: 15,
                  transition: 'all 0.15s ease',
                  border: isOverLimit ? '2px solid var(--accent-coral)' : '2px dashed var(--accent-amber)',
                  background: isOverLimit ? 'rgba(248, 113, 113, 0.08)' : 'var(--accent-amber-bg)',
                  boxShadow: isOverLimit ? '0 0 16px rgba(248, 113, 113, 0.25)' : '0 0 16px var(--accent-amber-bg)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: isOverLimit ? 'var(--accent-coral)' : 'var(--accent-amber)',
                    color: 'var(--bg-color)',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.04em',
                  }}
                >
                  {isOverLimit ? 'OVER LIMIT: SHRINKING' : 'ACTIVE WINDOW'}
                </div>
              </div>
            )}

            <DPTape
              customCellState={customCellState}
              customCellBadge={customCellBadge}
              arrValues={text.split('')}
              activeWindow={null}
            />
          </div>

          {/* TWO PANEL ROW: Tracker / Counter & Single Frequency Map */}
          <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '640px', flexDirection: 'column' }}>
            
            {/* Top row: Max length StockTracker card & Distinct counter card side-by-side */}
            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
              
              {/* MAX LENGTH STOCKTRACKER CARD */}
              <div
                style={{
                  flex: 1,
                  background: 'var(--panel-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
                  MAX LENGTH SO FAR
                </span>
                <div
                  className={maxLenPulse ? 'max-pulse' : ''}
                  style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}
                >
                  {step.maxLen}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', fontStyle: step.maxLen > 0 ? 'normal' : 'italic' }}>
                  {step.maxLen > 0 ? `(substring: "${step.bestSubstring}")` : 'No valid window recorded yet'}
                </span>
              </div>

              {/* DISTINCT CHARACTERS COUNTER CARD */}
              <div
                className={counterPulse ? 'counter-pulse' : ''}
                style={{
                  flex: 1,
                  background: 'var(--panel-bg)',
                  border: '1.5px solid',
                  borderColor: isOverLimit ? 'var(--accent-coral)' : 'var(--border-color)',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'border-color 0.25s ease',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
                  DISTINCT CHARACTERS
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: isOverLimit ? 'var(--accent-coral)' : 'var(--accent-indigo)' }}>
                    {distinctCount}
                  </span>
                  <span style={{ fontSize: '18px', color: 'var(--muted-color)', fontWeight: 500 }}>/</span>
                  <span style={{ fontSize: '20px', color: 'var(--text-color)', fontWeight: 600 }}>{kdK}</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
                  {isOverLimit ? 'Limit exceeded! Must shrink.' : 'Within allowed limit'}
                </span>
              </div>

            </div>

            {/* Bottom Row: Single frequency map panel */}
            <div
              style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '8px',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
                  CHARACTERS IN WINDOW (max {kdK} distinct allowed)
                </span>
                <div style={{ display: 'flex', gap: '10px', fontSize: '9px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                    <span>In frequency map</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-coral)' }} />
                    <span>Over limit (temporary)</span>
                  </div>
                </div>
              </div>

              {/* Chips container */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  minHeight: '44px',
                  alignItems: 'center',
                }}
              >
                {Object.keys(renderedChips).length === 0 ? (
                  <div style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--muted-color)', width: '100%', textAlign: 'center' }}>
                    Map is empty (window is empty)
                  </div>
                ) : (
                  Object.values(renderedChips).map(({ char, count, isExiting, isPulse }) => {
                    const borderStyle = isExiting
                      ? 'rgba(239, 68, 68, 0)'
                      : isOverLimit
                      ? 'var(--accent-coral)'
                      : 'var(--accent-blue)';

                    const bgStyle = isExiting
                      ? 'rgba(239, 68, 68, 0)'
                      : isOverLimit
                      ? 'rgba(248, 113, 113, 0.08)'
                      : 'rgba(96, 165, 250, 0.08)';

                    const textStyle = isExiting
                      ? 'rgba(239, 68, 68, 0)'
                      : isOverLimit
                      ? 'var(--accent-coral)'
                      : 'var(--accent-blue)';

                    return (
                      <div
                        key={char}
                        className={isOverLimit ? 'chip-over-limit-flash' : ''}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '13px',
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: `1.5px solid ${borderStyle}`,
                          background: bgStyle,
                          color: textStyle,
                          opacity: isExiting ? 0 : 1,
                          transform: isExiting ? 'scale(0.8) translateY(-4px)' : 'scale(1)',
                          transition: 'opacity 0.2s ease, transform 0.2s ease, border-color 0.25s ease, background 0.25s ease, color 0.25s ease',
                        }}
                      >
                        <span style={{ fontWeight: 800 }}>{char}</span>
                        <span style={{ fontSize: '11px', opacity: 0.6 }}>:</span>
                        <span
                          className={isPulse ? 'count-scale-pulse' : ''}
                          style={{ fontSize: '14px', fontWeight: 700, display: 'inline-block' }}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
