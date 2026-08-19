import React, { useState, useEffect, useRef } from 'react';
import { useSWStore } from '../store';
import { DPTape } from './DPTape';
import { ZoomControls } from './ZoomControls';
import { type SmallestSubarrayStep } from '../engines/smallestSubarraySumTarget';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const SmallestSubarrayVisualizer: React.FC = () => {
  const { steps, cur, smArray, smTarget } = useSWStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = (steps[cur] || steps[0]) as SmallestSubarrayStep;
  const arr = smArray || [2, 3, 1, 2, 4, 3, 1, 2];

  // Positions of pointers relative to the DPTape wrapper
  const [leftX, setLeftX] = useState<number>(0);
  const [rightX, setRightX] = useState<number>(0);
  const [pointerY, setPointerY] = useState<number>(0);

  // Position and size of the custom active window overlay
  const [windowStyle, setWindowStyle] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Pulse animation on right pointer step expansion
  const prevRightRef = useRef<number>(-1);
  const [rightPulse, setRightPulse] = useState<boolean>(false);

  // Pulse animation on shrink (green border flash)
  const prevLeftRef = useRef<number>(-1);
  const [shrinkPulse, setShrinkPulse] = useState<boolean>(false);

  // Pulse animation on minLen decrease
  const prevMinLenRef = useRef<number | null>(null);
  const [minLenPulse, setMinLenPulse] = useState<boolean>(false);

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = arr.length * 68 + 120;
    const contentHeight = 460;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
    window.addEventListener('resize', handleFitScreen);
    return () => window.removeEventListener('resize', handleFitScreen);
  }, [smArray]);

  // Track position measurements & Window overlay sizing
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

  // Pulse triggers
  useEffect(() => {
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
    if (step.type === 'shrink' && step.left !== prevLeftRef.current) {
      setShrinkPulse(true);
      const timer = setTimeout(() => setShrinkPulse(false), 200);
      return () => clearTimeout(timer);
    }
    prevLeftRef.current = step.left;
  }, [step]);

  useEffect(() => {
    const currentMin = step.minLen;
    const prevMin = prevMinLenRef.current;
    if (currentMin !== null) {
      if (prevMin === null || currentMin < prevMin) {
        setMinLenPulse(true);
        const timer = setTimeout(() => setMinLenPulse(false), 500);
        return () => clearTimeout(timer);
      }
    }
    prevMinLenRef.current = currentMin;
  }, [step.minLen]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
    } else {
      setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
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
        {arr[index]}
      </span>
    );
  };

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
        @keyframes rightPulseAnim {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4); }
          70% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(248, 113, 113, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
        }
        @keyframes shrinkPulseAnim {
          from { border-color: var(--accent-green); box-shadow: 0 0 18px var(--accent-green); }
          to { border-color: var(--accent-amber); box-shadow: 0 0 12px var(--accent-amber-bg); }
        }
        @keyframes minPulseAnim {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); color: var(--accent-green); }
          100% { transform: scale(1); }
        }
        .right-pulse {
          animation: rightPulseAnim 0.25s ease-out;
        }
        .min-pulse {
          animation: minPulseAnim 0.5s ease-in-out;
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
          {/* LEGEND */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cell-unfilled-border)' }} />
              <span>Outside window</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
              <span>In current window</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
              <span>Valid (shrinking to optimize)</span>
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

            {/* Custom Green-flashing active window overlay */}
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
                  ...(shrinkPulse
                    ? {
                        border: '2px solid var(--accent-green)',
                        background: 'rgba(74, 222, 128, 0.15)',
                        boxShadow: '0 0 20px rgba(74, 222, 128, 0.4)',
                        animation: 'shrinkPulseAnim 0.2s ease-out',
                      }
                    : {
                        border: '2px dashed var(--accent-amber)',
                        background: 'var(--accent-amber-bg)',
                        boxShadow: '0 0 16px var(--accent-amber-bg)',
                      }),
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: shrinkPulse ? 'var(--accent-green)' : 'var(--accent-amber)',
                    color: 'var(--bg-color)',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.04em',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {shrinkPulse ? 'SHRINK OPTIMIZE' : 'ACTIVE WINDOW'}
                </div>
              </div>
            )}

            {/* Render DPTape with activeWindow=null since we draw our own overlay */}
            <DPTape
              customCellState={customCellState}
              customCellBadge={customCellBadge}
              arrValues={arr}
              activeWindow={null}
            />
          </div>

          {/* TWO TRACKER CARDS SIDE BY SIDE */}
          <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '520px', justifyContent: 'center' }}>
            {/* WINDOW SUM TRACKER CARD */}
            <div
              style={{
                flex: 1,
                background: 'var(--panel-bg)',
                border: '1.5px solid',
                borderColor: step.windowSum >= smTarget ? 'var(--accent-green)' : 'var(--accent-blue)',
                borderRadius: '16px',
                padding: '14px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'border-color 0.25s ease',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-color)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                WINDOW SUM
              </span>

              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: step.windowSum >= smTarget ? 'var(--accent-green)' : 'var(--accent-blue)',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: 1,
                  transition: 'color 0.25s ease',
                }}
              >
                {step.windowSum}
              </div>

              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--muted-color)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                (target: {smTarget})
              </span>
            </div>

            {/* MIN LENGTH TRACKER CARD */}
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
                gap: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-color)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                MIN LENGTH SO FAR
              </span>

              <div
                className={minLenPulse ? 'min-pulse' : ''}
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: 'var(--accent-indigo)',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: 1,
                }}
              >
                {step.minLen === null ? '∞' : step.minLen}
              </div>

              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--muted-color)',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: step.minLen !== null ? 'normal' : 'italic',
                }}
              >
                {step.minLen !== null ? `(window: indices ${step.bestStart}..${step.bestEnd})` : 'No valid window found yet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
