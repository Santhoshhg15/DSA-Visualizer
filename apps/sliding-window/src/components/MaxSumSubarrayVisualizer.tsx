import React, { useState, useEffect, useRef } from 'react';
import { useSWStore } from '../store';
import { DPTape } from './DPTape';
import { ZoomControls } from './ZoomControls';
import { type MaxSumWindowStep } from '../engines/maxSumSubarrayK';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const MaxSumSubarrayVisualizer: React.FC = () => {
  const { steps, cur, swArray, swWindowK } = useSWStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = (steps[cur] || steps[0]) as MaxSumWindowStep;
  const arr = swArray || [10, -3, 4, 12, -5, 6, 8, -1];
  const k = swWindowK || 3;

  // Tracker state for pulses
  const [windowPulse, setWindowPulse] = useState(false);
  const [maxPulse, setMaxPulse] = useState(false);

  const prevWindowSumRef = useRef<number>(0);
  const prevMaxSumRef = useRef<number>(0);

  useEffect(() => {
    if (!step) return;

    // Trigger window sum pulse when window sum updates
    if (step.windowSum !== prevWindowSumRef.current) {
      setWindowPulse(true);
      const timer = setTimeout(() => setWindowPulse(false), 220);
      prevWindowSumRef.current = step.windowSum;
      return () => clearTimeout(timer);
    }
  }, [step?.windowSum]);

  useEffect(() => {
    if (!step) return;

    // Trigger max sum pulse when max sum updates (or on action if it was a new max)
    if (step.maxSum !== prevMaxSumRef.current && step.maxSum > 0) {
      setMaxPulse(true);
      const timer = setTimeout(() => setMaxPulse(false), 220);
      prevMaxSumRef.current = step.maxSum;
      return () => clearTimeout(timer);
    }
  }, [step?.maxSum]);

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = arr.length * 68 + 120;
    const contentHeight = 360;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [arr]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((z) =>
        Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, parseFloat((z + delta).toFixed(2))))
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, select')) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
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

  if (!step) return null;

  const lastVisitedIndex = (() => {
    if (step.type === 'init') return -1;
    if (step.type === 'build') return step.activeIndex;
    if (step.type === 'slide') return step.windowStart + step.k - 1;
    if (step.type === 'done') return step.arr.length - 1;
    return -1;
  })();

  const customCellState = (index: number) => {
    // In current window:
    const inCurrentWindow =
      step.type !== 'init' &&
      step.type !== 'done' &&
      index >= step.windowStart &&
      index < step.windowStart + step.k;
    if (inCurrentWindow) return 'active';

    // In best window found so far:
    const inBestWindow =
      step.bestWindowStart !== -1 &&
      index >= step.bestWindowStart &&
      index < step.bestWindowStart + step.k;
    if (inBestWindow) return 'filled';

    // Visited:
    if (index <= lastVisitedIndex) return 'filled';

    return 'unfilled';
  };

  const customCellBadge = (index: number) => {
    const inCurrentWindow =
      step.type !== 'init' &&
      step.type !== 'done' &&
      index >= step.windowStart &&
      index < step.windowStart + step.k;
    const inBestWindow =
      step.bestWindowStart !== -1 &&
      index >= step.bestWindowStart &&
      index < step.bestWindowStart + step.k;

    if (inBestWindow && !inCurrentWindow) {
      return (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: 'var(--accent-green)',
            color: 'var(--bg-primary)',
            fontSize: '9px',
            fontWeight: 800,
            padding: '1px 4px',
            borderRadius: '4px',
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          ★ BEST
        </span>
      );
    }

    if (index > lastVisitedIndex) {
      return (
        <span
          style={{
            color: 'var(--muted-color)',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {arr[index]}
        </span>
      );
    }

    return null;
  };

  const activeWindow: [number, number] | null =
    step.type !== 'init' && step.type !== 'done'
      ? [step.windowStart, step.windowStart + step.k - 1]
      : null;

  return (
    <div
      ref={centerStageRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      className="center-stage flex-1 flex flex-col overflow-hidden relative h-full w-full select-none"
    >
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
            gap: '16px',
            width: '100%',
          }}
          className="p-4 pointer-events-auto"
        >
          {/* ARRAY TAPE */}
          <DPTape
            customCellState={customCellState}
            customCellBadge={customCellBadge}
            arrValues={arr}
            activeWindow={activeWindow}
          />

          {/* TWO SIDE-BY-SIDE TRACKERS */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
              width: '100%',
              maxWidth: '520px',
            }}
          >
            {/* WINDOW SUM CARD */}
            <div
              style={{
                flex: 1,
                background: 'var(--input-bg)',
                border: '1.5px solid var(--accent-blue)',
                borderRadius: '12px',
                padding: '12px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                transform: windowPulse ? 'scale(1.1)' : 'scale(1)',
                boxShadow: windowPulse ? '0 0 16px var(--accent-blue-bg)' : 'none',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-color)',
                  marginBottom: '4px',
                }}
              >
                WINDOW SUM
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--cell-source-text)',
                  lineHeight: 1.1,
                }}
              >
                {step.type === 'init' ? '—' : step.windowSum}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--cell-filled-text)',
                  marginTop: '4px',
                  fontWeight: 500,
                }}
              >
                {step.type === 'init'
                  ? '—'
                  : step.type === 'done'
                  ? `(done)`
                  : `(indices ${step.windowStart}..${step.windowStart + step.k - 1})`}
              </span>
            </div>

            {/* MAX SUM SO FAR CARD */}
            <div
              style={{
                flex: 1,
                background: 'var(--input-bg)',
                border: '1.5px solid var(--accent-green)',
                borderRadius: '12px',
                padding: '12px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                transform: maxPulse ? 'scale(1.1)' : 'scale(1)',
                boxShadow: maxPulse ? '0 0 16px var(--accent-green-bg)' : 'none',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-color)',
                  marginBottom: '4px',
                }}
              >
                MAX SUM SO FAR
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--cell-match-text)',
                  lineHeight: 1.1,
                }}
              >
                {step.maxSum === 0 && step.bestWindowStart === -1 ? '—' : step.maxSum}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--cell-match-text)',
                  marginTop: '4px',
                  fontWeight: 500,
                }}
              >
                {step.bestWindowStart === -1
                  ? '—'
                  : `(best window: ${step.bestWindowStart}..${step.bestWindowStart + step.k - 1})`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
