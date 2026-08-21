import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPGrid2D } from './DPGrid2D';
import { ZoomControls } from './ZoomControls';
import { LPSReversalInsight } from './LPSReversalInsight';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const LPSviaLCSVisualizer: React.FC = () => {
  const { steps, cur, lpsLcsString } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];
  const s = step?.lpsString || lpsLcsString || 'ABCBAB';
  const reversed = s.split('').reverse().join('');

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = (s.length + 2) * 55 + 100;
    const contentHeight = (s.length + 2) * 45 + 150;

    const scaleX = availableWidth / (contentWidth + 60);
    const scaleY = availableHeight / (contentHeight + 120);
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [lpsLcsString]);

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

  if (!step) {
    return (
      <div style={{ padding: '20px', color: 'var(--muted-color)', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
        Initializing visualization...
      </div>
    );
  }

  const rowLabels = ['∅', ...s.split('')];
  const colLabels = ['∅', ...reversed.split('')];

  const tableData = step.dpTable || [new Array(s.length + 1).fill(null)];
  const activeCell = step.activeCell || null;
  const sourceCells = step.sourceCells || [];
  const isDone = step.type === 'done';
  const answer = isDone && step.dpTable ? (step.dpTable[s.length]?.[s.length] as number) : null;

  return (
    <div
      ref={centerStageRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', position: 'relative' }}
      className="center-stage flex-1 flex flex-col overflow-hidden h-full w-full select-none"
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

      {/* Reversal Insight Card */}
      <div className="shrink-0 z-10 p-4 pb-0 w-full">
        <LPSReversalInsight s={s} reversed={reversed} answer={answer} isDone={isDone} />
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          color: 'var(--muted-color)',
          paddingTop: '8px',
          paddingBottom: '8px',
          fontWeight: 500,
        }}
        className="shrink-0 z-10 pointer-events-none"
      >
        <span>Unfilled</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Source</span>
        <span style={{ color: 'var(--accent-indigo)' }}>● Active (dp[i][j])</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Filled</span>
        <span style={{ color: 'var(--accent-green)' }}>● Match (diagonal)</span>
      </div>

      {/* Grid container with explicit axis labels */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
          }}
          className="flex items-center justify-center p-4 pointer-events-auto"
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            {/* Column Axis Label */}
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-teal)',
                background: 'var(--accent-teal-bg, rgba(20,184,166,0.06))',
                border: '1px dashed var(--accent-teal)',
                borderRadius: '6px',
                padding: '4px 10px',
                marginBottom: '4px',
              }}
            >
              COLUMNS (REVERSED): "{reversed}"
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Row Axis Label */}
              <div
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-blue)',
                  background: 'var(--accent-blue-bg)',
                  border: '1px dashed var(--accent-blue)',
                  borderRadius: '6px',
                  padding: '10px 4px',
                  marginRight: '4px',
                }}
              >
                ROWS (ORIGINAL): "{s}"
              </div>

              <DPGrid2D
                table={tableData}
                rowLabels={rowLabels}
                colLabels={colLabels}
                activeCell={activeCell}
                sourceCells={sourceCells}
                matchType={step.matchType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
