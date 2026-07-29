import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPGrid2D } from './DPGrid2D';
import { ZoomControls } from './ZoomControls';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const LPSVisualizer: React.FC = () => {
  const { steps, cur, lpsString } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];
  const s = step?.lpsString || lpsString || 'ABCBAB';

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = (s.length + 1) * 55 + 60;
    const contentHeight = (s.length + 1) * 45;

    const scaleX = availableWidth / (contentWidth + 60);
    const scaleY = availableHeight / (contentHeight + 120);
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [lpsString]);

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

  const rowLabels = s.split('');
  const colLabels = s.split('');

  const tableData = step.dpTable || [new Array(s.length).fill(null)];
  const activeCell = step.activeCell || null;
  const sourceCells = step.sourceCells || [];
  const currentLength = step.currentLength ?? 1;

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

      {/* TOP ROW — LENGTH BADGE & LEGEND */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          color: 'var(--muted-color)',
          paddingTop: '16px',
          paddingBottom: '8px',
          fontWeight: 500,
        }}
        className="shrink-0 z-10 pointer-events-none flex-wrap"
      >
        {/* LENGTH BAND BADGE */}
        <span
          style={{
            background: 'var(--accent-indigo-bg)',
            border: '1px solid var(--accent-indigo)',
            color: 'var(--cell-active-text)',
            borderRadius: '9999px',
            padding: '3px 12px',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
          }}
        >
          CURRENT LENGTH: {currentLength}
        </span>

        <span>Unfilled</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Source</span>
        <span style={{ color: 'var(--accent-indigo)' }}>● Active (dp[i][j])</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Filled</span>
        <span style={{ color: 'var(--accent-green)' }}>● Match (diagonal)</span>
        <span style={{ color: 'var(--muted-color)' }}>● Invalid (j&lt;i)</span>
      </div>

      {/* CANVAS */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
          }}
          className="flex items-center justify-center p-4 pointer-events-auto"
        >
          <DPGrid2D
            table={tableData}
            rowLabels={rowLabels}
            colLabels={colLabels}
            activeCell={activeCell}
            sourceCells={sourceCells}
            matchType={step.matchType}
            getCellState={(r, c) => (c < r ? 'invalid' : undefined)}
          />
        </div>
      </div>
    </div>
  );
};

export const LpsVisualizer = LPSVisualizer;
