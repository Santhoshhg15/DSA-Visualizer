import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPGrid2D } from './DPGrid2D';
import { ZoomControls } from './ZoomControls';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const UniquePathsVisualizer: React.FC = () => {
  const { steps, cur, uniquePathsRows, uniquePathsCols } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];
  const m = step?.gridRows || uniquePathsRows || 4;
  const n = step?.gridCols || uniquePathsCols || 4;
  const isDone = step?.type === 'done';

  // Robot animation step index (0 to (m-1) + (n-1))
  const [robotStep, setRobotStep] = useState(0);

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = n * 50 + 100;
    const contentHeight = m * 45 + 100;

    const scaleX = availableWidth / (contentWidth + 60);
    const scaleY = availableHeight / (contentHeight + 60);
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [uniquePathsRows, uniquePathsCols]);

  // Animate robot traversing from (0,0) -> (0, n-1) -> (m-1, n-1) on done step
  useEffect(() => {
    if (!isDone) {
      setRobotStep(0);
      return;
    }

    const maxRobotSteps = (n - 1) + (m - 1);
    const interval = setInterval(() => {
      setRobotStep((prev) => (prev >= maxRobotSteps ? 0 : prev + 1));
    }, 280);

    return () => clearInterval(interval);
  }, [isDone, m, n]);

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

  const rowLabels = Array.from({ length: m }, (_, i) => `Row ${i}`);
  const colLabels = Array.from({ length: n }, (_, j) => `Col ${j}`);

  const tableData = step.dpTable || Array.from({ length: m }, () => new Array(n).fill(null));
  const activeCell = step.activeCell || null;
  const sourceCells = step.sourceCells || [];

  // Compute robot current grid coordinate based on robotStep
  let robotR = 0;
  let robotC = 0;
  if (isDone) {
    if (robotStep <= n - 1) {
      robotR = 0;
      robotC = robotStep;
    } else {
      robotR = robotStep - (n - 1);
      robotC = n - 1;
    }
  }

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

      {/* TOP LEGEND */}
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
        <span>Unfilled</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Source (above & left)</span>
        <span style={{ color: 'var(--accent-indigo)' }}>● Active (dp[i][j])</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Filled</span>
        {isDone && (
          <span
            style={{
              background: 'var(--accent-blue-bg)',
              border: '1px solid var(--accent-blue)',
              color: 'var(--cell-filled-text)',
              borderRadius: '9999px',
              padding: '2px 10px',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            🤖 ROBOT TRAVERSING SAMPLE PATH
          </span>
        )}
      </div>

      {/* CANVAS */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
            position: 'relative',
          }}
          className="flex items-center justify-center p-4 pointer-events-auto"
        >
          <DPGrid2D
            table={tableData}
            rowLabels={rowLabels}
            colLabels={colLabels}
            activeCell={activeCell}
            sourceCells={sourceCells}
          />

          {/* DECORATIVE ROBOT OVERLAY ON DONE STEP */}
          {isDone && (
            <div
              style={{
                position: 'absolute',
                top: `${56 + robotR * 40}px`,
                left: `${114 + robotC * 48}px`,
                fontSize: '20px',
                transition: 'all 0.25s ease',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 0 8px var(--accent-blue))',
                zIndex: 40,
              }}
            >
              🤖
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
