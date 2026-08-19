import React, { useState, useEffect, useRef } from 'react';
import { useSWStore } from '../store';
import { DPTape } from './DPTape';
import { ZoomControls } from './ZoomControls';
import { NegativeQueueStrip } from './NegativeQueueStrip';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const FirstNegativeVisualizer: React.FC = () => {
  const { steps, cur, fnArray, fnWindowK } = useSWStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = (steps[cur] || steps[0]) as any; // Cast as any for flexibility with union step types
  const arr = fnArray || [12, -1, -7, 8, -15, 3, 0, 9, -2];
  const k = fnWindowK || 3;

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = arr.length * 68 + 120;
    const contentHeight = 420;

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

  const currentIndex = step.currentIndex !== undefined ? step.currentIndex : -1;

  // Render unvisited non-negatives as gray text
  const customCellBadge = (index: number) => {
    if (index > currentIndex && arr[index] >= 0) {
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

  const customCellState = (index: number) => {
    if (step.type === 'init') return 'unfilled';
    if (index === currentIndex) return 'active';
    if (index < currentIndex) return 'filled';
    return 'unfilled';
  };

  const activeWindow: [number, number] | null =
    step.type !== 'init' && step.type !== 'done'
      ? [step.windowStart, currentIndex]
      : null;

  // Result Tape logic
  const resultCellState = (index: number) => {
    const val = step.resultSoFar?.[index];
    if (val === undefined || val === null) return 'unfilled';
    if (val === 0) return 'unfilled';
    return 'filled';
  };

  const resultCellBadge = (index: number) => {
    const val = step.resultSoFar?.[index];
    if (val === undefined || val === null) return null;
    if (val === 0) {
      return (
        <span style={{ color: 'var(--muted-color)', fontSize: '16px', fontWeight: '600' }}>
          0
        </span>
      );
    }
    return null;
  };

  const resultValues = step.resultSoFar ? step.resultSoFar.map((v: any) => v ?? 0) : [];

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
            gap: '24px',
            width: '100%',
          }}
          className="p-4 pointer-events-auto"
        >
          {/* LEGEND 1 */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cell-unfilled-border)' }} />
              <span>Unvisited</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />
              <span>In current window</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-coral)' }} />
              <span>Negative number</span>
            </div>
          </div>

          {/* MAIN TAPE */}
          <DPTape
            customCellState={customCellState}
            customCellBadge={customCellBadge}
            arrValues={arr}
            activeWindow={activeWindow}
            tintNegatives={true}
          />

          {/* QUEUE LEGEND & QUEUE STRIP */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'var(--accent-coral-bg)', border: '1px solid var(--accent-coral)' }} />
                  <span>In queue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'var(--accent-coral)', border: '1px solid var(--accent-coral)' }} />
                  <span>Front (current answer)</span>
                </div>
              </div>
            </div>

            <NegativeQueueStrip
              negQueue={step.negQueue || []}
              arr={arr}
            />
          </div>

          {/* RESULT TAPE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '640px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
              RESULT (first negative per window)
            </div>
            <DPTape
              customCellState={resultCellState}
              customCellBadge={resultCellBadge}
              arrValues={resultValues}
              activeWindow={null}
              tintNegatives={true}
              customDpArray={step.resultSoFar || []}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
