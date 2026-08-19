import React, { useState, useEffect, useRef } from 'react';
import { useSWStore } from '../store';
import { DPTape } from './DPTape';
import { ZoomControls } from './ZoomControls';
import { CharacterSetPanel } from './CharacterSetPanel';
import { type LongestSubstrStep } from '../engines/longestSubstrNoRepeat';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const LongestSubstrVisualizer: React.FC = () => {
  const { steps, cur, lsNrString } = useSWStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = (steps[cur] || steps[0]) as LongestSubstrStep;
  const arr = (lsNrString || "abcabcbb").split('');

  // Positions of pointers relative to the DPTape wrapper
  const [leftX, setLeftX] = useState<number>(0);
  const [rightX, setRightX] = useState<number>(0);
  const [pointerY, setPointerY] = useState<number>(0);

  // Pulse animation on right pointer step expansion
  const prevRightRef = useRef<number>(-1);
  const [rightPulse, setRightPulse] = useState<boolean>(false);

  // Pulse animation on new max value change
  const prevMaxRef = useRef<number>(0);
  const [maxPulse, setMaxPulse] = useState<boolean>(false);

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
  }, [lsNrString]);

  // Track position measurements
  useEffect(() => {
    const updatePointers = () => {
      const container = centerStageRef.current;
      const overlayContainer = overlayContainerRef.current;
      if (!container || !overlayContainer) return;

      const cells = container.querySelectorAll('.dp-tape-cell');
      if (cells.length === 0) return;

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
    };

    // Update positions on render/panning changes
    const frameId = requestAnimationFrame(updatePointers);
    return () => cancelAnimationFrame(frameId);
  }, [step, cur, zoom, pan]);

  // Pulse triggers
  useEffect(() => {
    if (step.right !== prevRightRef.current) {
      if (step.type === 'expand' || step.type === 'record') {
        setRightPulse(true);
        const timer = setTimeout(() => setRightPulse(false), 250);
        return () => clearTimeout(timer);
      }
    }
    prevRightRef.current = step.right;
  }, [step]);

  useEffect(() => {
    if (step.maxLen !== prevMaxRef.current && step.maxLen > 0) {
      setMaxPulse(true);
      const timer = setTimeout(() => setMaxPulse(false), 500);
      return () => clearTimeout(timer);
    }
    prevMaxRef.current = step.maxLen;
  }, [step.maxLen]);

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

  // Custom badge handles violating flashing and character rendering
  const customCellBadge = (index: number) => {
    const isViolatingCell = (step.type === 'violation' || step.type === 'shrink') && index === step.right;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isViolatingCell && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9px',
              border: '2.5px solid var(--accent-coral)',
              boxShadow: '0 0 12px rgba(248, 113, 113, 0.4)',
              animation: 'violationFlash 0.3s ease infinite alternate',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}
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
      </div>
    );
  };

  const activeWindow: [number, number] | null =
    step.type !== 'init' && step.type !== 'done' && step.right >= step.left
      ? [step.left, step.right]
      : null;

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
        @keyframes violationFlash {
          from { border-color: var(--accent-coral); box-shadow: 0 0 4px var(--accent-coral); }
          to { border-color: rgba(248, 113, 113, 0.2); box-shadow: 0 0 16px var(--accent-coral); }
        }
        @keyframes rightPulseAnim {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4); }
          70% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(248, 113, 113, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
        }
        @keyframes maxPulseAnim {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); color: var(--accent-green); }
          100% { transform: scale(1); }
        }
        .right-pulse {
          animation: rightPulseAnim 0.25s ease-out;
        }
        .max-pulse {
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
              <span>Outside window</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />
              <span>In current window</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-coral)' }} />
              <span>Violation (duplicate found)</span>
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

            <DPTape
              customCellState={customCellState}
              customCellBadge={customCellBadge}
              arrValues={arr}
              activeWindow={activeWindow}
            />
          </div>

          {/* SEEN CHARACTERS SET PANEL */}
          <CharacterSetPanel seenChars={step.seenChars} />

          {/* MAX LENGTH TRACKER CARD */}
          <div
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '14px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              minWidth: '240px',
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
              MAX LENGTH SO FAR
            </span>

            <div
              className={maxPulse ? 'max-pulse' : ''}
              style={{
                fontSize: '36px',
                fontWeight: 800,
                color: 'var(--accent-indigo)',
                fontFamily: 'JetBrains Mono, monospace',
                lineHeight: 1,
              }}
            >
              {step.maxLen}
            </div>

            <span
              style={{
                fontSize: '10px',
                color: 'var(--muted-color)',
                fontFamily: 'Inter, sans-serif',
                fontStyle: step.bestSubstring ? 'normal' : 'italic',
              }}
            >
              {step.bestSubstring ? `(substring: "${step.bestSubstring}")` : 'No valid substring recorded yet'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
