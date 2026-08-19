import React, { useState, useEffect, useRef } from 'react';
import { useSWStore } from '../store';
import { DPTape } from './DPTape';
import { ZoomControls } from './ZoomControls';
import { type KadaneStep } from '../engines/kadanesMaxSubarray';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const KadaneVisualizer: React.FC = () => {
  const { steps, cur, kadaneArray } = useSWStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = (steps[cur] || steps[0]) as KadaneStep;
  const arr = kadaneArray || [-2, 1, -3, 4, -1, 2, 1, -5, 4];

  // Positions of pointers relative to container
  const [leftX, setLeftX] = useState<number>(0);
  const [rightX, setRightX] = useState<number>(0);
  const [pointerY, setPointerY] = useState<number>(0);

  // Position and size of active window overlay
  const [windowStyle, setWindowStyle] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Pulse animation on restart
  const [restartFlash, setRestartFlash] = useState<boolean>(false);
  const [restartLabelVisible, setRestartLabelVisible] = useState<boolean>(false);

  // Pulse animation on maxSum increase
  const prevMaxSumRef = useRef<number>(-Infinity);
  const [maxSumPulse, setMaxSumPulse] = useState<boolean>(false);

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
  }, [kadaneArray]);

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

      const originRect = overlayContainer.getBoundingClientRect();
      const scale = (originRect.width / (overlayContainer.offsetWidth || 1)) || 1;

      const startIdx = step.windowStart;
      const endIdx = step.currentIndex;

      const startCell = cells[startIdx] as HTMLElement | undefined;
      const endCell = cells[endIdx] as HTMLElement | undefined;

      if (startCell) {
        const sRect = startCell.getBoundingClientRect();
        setLeftX((sRect.left - originRect.left + sRect.width / 2) / scale);
        setPointerY((sRect.top - originRect.top) / scale);
      }

      if (endCell) {
        const eRect = endCell.getBoundingClientRect();
        setRightX((eRect.left - originRect.left + eRect.width / 2) / scale);
      }

      if (step.type !== 'init' && step.type !== 'done' && endIdx >= startIdx) {
        if (startCell && endCell) {
          const sRect = startCell.getBoundingClientRect();
          const eRect = endCell.getBoundingClientRect();

          setWindowStyle({
            left: (sRect.left - originRect.left - 4) / scale,
            top: (sRect.top - originRect.top - 4) / scale,
            width: (eRect.right - sRect.left + 8) / scale,
            height: (Math.max(sRect.height, eRect.height) + 8) / scale,
          });
        }
      } else {
        setWindowStyle(null);
      }
    };

    const frameId = requestAnimationFrame(updateLayout);
    return () => cancelAnimationFrame(frameId);
  }, [step, cur, zoom, pan]);

  // Restart trigger
  useEffect(() => {
    if (step.isRestart || step.type === 'restart') {
      setRestartFlash(true);
      setRestartLabelVisible(true);
      const timer1 = setTimeout(() => setRestartFlash(false), 250);
      const timer2 = setTimeout(() => setRestartLabelVisible(false), 800);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setRestartFlash(false);
      setRestartLabelVisible(false);
    }
  }, [step]);

  // Max sum pulse trigger
  useEffect(() => {
    if (step.maxSum > prevMaxSumRef.current) {
      if (step.type === 'update-max') {
        setMaxSumPulse(true);
        const timer = setTimeout(() => setMaxSumPulse(false), 500);
        return () => clearTimeout(timer);
      }
    }
    prevMaxSumRef.current = step.maxSum;
  }, [step.maxSum, step.type]);

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
    // Is in current running window?
    if (index >= step.windowStart && index <= step.currentIndex) {
      return 'active';
    }
    // Is in best subarray found so far?
    if (step.bestStart !== null && step.bestEnd !== null && index >= step.bestStart && index <= step.bestEnd) {
      return 'filled';
    }
    return 'unfilled';
  };

  const customCellBadge = (index: number) => {
    const isInCurrent = index >= step.windowStart && index <= step.currentIndex;
    const isInBest = step.bestStart !== null && step.bestEnd !== null && index >= step.bestStart && index <= step.bestEnd;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
        <span
          style={{
            fontSize: '16px',
            fontWeight: isInCurrent || isInBest ? 800 : 500,
            color: isInCurrent
              ? 'var(--accent-amber)'
              : isInBest
              ? 'var(--accent-green)'
              : 'var(--muted-color)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {arr[index]}
        </span>
        {isInBest && !isInCurrent && (
          <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '0.05em' }}>
            ★ BEST
          </span>
        )}
      </div>
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
        @keyframes restartFlashAnim {
          0% { border-color: var(--accent-coral); box-shadow: 0 0 20px var(--accent-coral); }
          50% { background: rgba(248, 113, 113, 0.25); }
          100% { border-color: var(--accent-amber); box-shadow: 0 0 12px var(--accent-amber-bg); }
        }
        @keyframes restartLabelAnim {
          0% { opacity: 0; transform: translateY(4px) scale(0.9); }
          20% { opacity: 1; transform: translateY(-4px) scale(1.05); }
          80% { opacity: 1; transform: translateY(-4px) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
        @keyframes maxPulseAnim {
          0% { transform: scale(1); }
          50% { transform: scale(1.12); color: var(--accent-green); }
          100% { transform: scale(1); }
        }
        .max-sum-pulse {
          animation: maxPulseAnim 0.5s ease-in-out;
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
              <span>Outside current subarray</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
              <span>In current running subarray</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
              <span>Part of best subarray found</span>
            </div>
            {restartLabelVisible && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-coral)' }} />
                <span style={{ color: 'var(--accent-coral)', fontWeight: 700 }}>● Restart point</span>
              </div>
            )}
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
                {/* LEFT POINTER BADGE (START OF RUNNING SUBARRAY) */}
                {leftX > 0 && step.type !== 'init' && (
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
                        border: '1.5px solid var(--accent-amber)',
                        background: 'var(--accent-amber-bg)',
                        color: 'var(--accent-amber)',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)',
                      }}
                    >
                      start = {step.windowStart}
                    </div>
                    <div style={{ width: '0px', height: '28px', borderLeft: '1.5px dashed var(--accent-amber)', marginTop: '2px' }} />
                  </div>
                )}

                {/* RIGHT POINTER BADGE (CURRENT ELEMENT) */}
                {rightX > 0 && step.type !== 'init' && (
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
                      i = {step.currentIndex}
                    </div>
                    <div style={{ width: '0px', height: '28px', borderLeft: '1.5px dashed var(--accent-blue)', marginTop: '2px' }} />
                  </div>
                )}

                {/* FLOATING "RESTART HERE" LABEL */}
                {restartLabelVisible && rightX > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${rightX}px`,
                      top: `${pointerY - 82}px`,
                      transform: 'translateX(-50%)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'var(--accent-coral)',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(248, 113, 113, 0.4)',
                      animation: 'restartLabelAnim 0.8s ease-in-out forwards',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ⚡ RESTART HERE
                  </div>
                )}
              </div>
            )}

            {/* Custom Active Window Overlay (Running Subarray Span) */}
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
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(restartFlash
                    ? {
                        border: '2px solid var(--accent-coral)',
                        background: 'rgba(248, 113, 113, 0.18)',
                        boxShadow: '0 0 20px rgba(248, 113, 113, 0.4)',
                        animation: 'restartFlashAnim 0.25s ease-out',
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
                    background: restartFlash ? 'var(--accent-coral)' : 'var(--accent-amber)',
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
                  {restartFlash ? 'ABANDON & RESTART' : 'RUNNING SUBARRAY'}
                </div>
              </div>
            )}

            {/* DPTape */}
            <DPTape
              customCellState={customCellState}
              customCellBadge={customCellBadge}
              arrValues={arr}
              activeWindow={null}
              tintNegatives={true}
            />
          </div>

          {/* TWO TRACKER CARDS SIDE BY SIDE (NEAR PORT OF STOCK TRACKERS) */}
          <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '560px', justifyContent: 'center' }}>
            {/* CURRENT SUM TRACKER CARD */}
            <div
              style={{
                flex: 1,
                background: 'var(--panel-bg)',
                border: '1.5px solid',
                borderColor: step.currentSum < 0 ? 'var(--accent-coral)' : 'var(--accent-blue)',
                borderRadius: '16px',
                padding: '14px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'border-color 0.25s ease',
                boxShadow: step.currentSum < 0 ? '0 0 12px rgba(248, 113, 113, 0.15)' : 'none',
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
                CURRENT SUM
              </span>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: step.currentSum < 0 ? 'var(--accent-coral)' : 'var(--accent-blue)',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: 1.1,
                  transition: 'color 0.25s ease',
                }}
              >
                {step.currentSum}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--muted-color)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                (subarray: indices {step.windowStart}..{step.currentIndex})
              </span>
            </div>

            {/* MAX SUM SO FAR TRACKER CARD */}
            <div
              style={{
                flex: 1,
                background: 'var(--panel-bg)',
                border: '1.5px solid var(--accent-green)',
                borderRadius: '16px',
                padding: '14px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 0 12px rgba(74, 222, 128, 0.1)',
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
                MAX SUM SO FAR
              </span>
              <span
                className={maxSumPulse ? 'max-sum-pulse' : ''}
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--accent-green)',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: 1.1,
                }}
              >
                {step.maxSum}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--muted-color)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                (best: indices {step.bestStart}..{step.bestEnd})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
