import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPGrid2D } from './DPGrid2D';
import { ZoomControls } from './ZoomControls';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const PartitionVisualizer: React.FC = () => {
  const { steps, cur, partitionArray } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];
  const arr = step?.partitionArr || partitionArray || [1, 5, 11, 5];
  const totalSum = step?.totalSum ?? arr.reduce((a, b) => a + b, 0);
  const isOddExit = step?.type === 'odd-sum-exit';
  const target = step?.targetSum ?? (totalSum % 2 === 0 ? totalSum / 2 : 0);

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    if (isOddExit) {
      setZoom(1);
      return;
    }

    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = (target + 1) * 46 + 100;
    const contentHeight = (arr.length + 1) * 40 + 100;

    const scaleX = availableWidth / (contentWidth + 60);
    const scaleY = availableHeight / (contentHeight + 60);
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [partitionArray, isOddExit]);

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
    const targetEl = e.target as HTMLElement;
    if (targetEl.closest('button, input, a, select')) return;

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

  const rowLabels = ['∅', ...arr.map((val, i) => `arr[${i}]=${val}`)];
  const colLabels = Array.from({ length: target + 1 }, (_, j) => `${j}`);

  const tableData =
    (step.dpTable as (boolean | null)[][]) ||
    Array.from({ length: arr.length + 1 }, () => new Array(target + 1).fill(null));
  const activeCell = step.activeCell || null;
  const sourceCells = step.sourceCells || [];

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
      {!isOddExit && (
        <ZoomControls
          zoom={zoom}
          setZoom={setZoom}
          minZoom={ZOOM_MIN}
          maxZoom={ZOOM_MAX}
          step={ZOOM_STEP}
          onFitScreen={handleFitScreen}
          onResetPan={() => setPan({ x: 0, y: 0 })}
        />
      )}

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
        <span style={{ color: 'var(--accent-blue)' }}>● Source (above & diagonal)</span>
        <span style={{ color: 'var(--accent-indigo)' }}>● Active (dp[i][j])</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Filled</span>
        <span
          style={{
            marginLeft: '8px',
            paddingLeft: '12px',
            borderLeft: '1px solid var(--border-color)',
            color: 'var(--cell-match-text)',
          }}
        >
          T = true (reachable), F = false
        </span>
      </div>

      {/* CANVAS */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        {isOddExit ? (
          <div
            style={{
              padding: '32px 48px',
              background: 'var(--grid-wrapper-bg)',
              border: '1.5px dashed var(--accent-amber-bg)',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              maxWidth: '480px',
            }}
            className="animate-fadeIn"
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⊘</div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--accent-amber)',
                marginBottom: '8px',
              }}
            >
              Sum is odd ({totalSum}) — partition impossible
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--muted-color)',
                lineHeight: 1.5,
              }}
            >
              An array with an odd total sum cannot be split into two integer subsets with equal sums. No DP table needed!
            </div>
          </div>
        ) : (
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
              booleanMode={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
