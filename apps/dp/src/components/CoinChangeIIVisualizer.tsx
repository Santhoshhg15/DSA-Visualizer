import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPGrid2D } from './DPGrid2D';
import { ZoomControls } from './ZoomControls';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const CoinChangeIIVisualizer: React.FC = () => {
  const { steps, cur, coinChangeIICoins, coinChangeIIAmount } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];
  const coins = step?.coinChangeIICoins || coinChangeIICoins || [1, 2, 5];
  const amount = step?.coinChangeIIAmount ?? coinChangeIIAmount ?? 8;

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = (amount + 1) * 46 + 120;
    const contentHeight = (coins.length + 1) * 40 + 120;

    const scaleX = availableWidth / (contentWidth + 60);
    const scaleY = availableHeight / (contentHeight + 60);
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [coinChangeIICoins, coinChangeIIAmount]);

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

  const rowLabels = ['∅', ...coins.map((c) => `coin=${c}`)];
  const colLabels = Array.from({ length: amount + 1 }, (_, i) => `${i}`);

  const tableData =
    (step.dpTable as (number | null)[][]) ||
    Array.from({ length: coins.length + 1 }, () => new Array(amount + 1).fill(null));
  const activeCell = step.activeCell || null;
  const sourceCells = step.sourceCells || [];
  const sourceLabels = step.sourceLabels || [];

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
          paddingTop: '12px',
          paddingBottom: '6px',
          fontWeight: 500,
        }}
        className="shrink-0 z-10 pointer-events-none flex-wrap"
      >
        <span>Unfilled</span>
        <span style={{ color: 'var(--accent-indigo)' }}>● Skip (dp[i-1][j])</span>
        <span style={{ color: 'var(--accent-teal)' }}>● Reuse (dp[i][j-coin])</span>
        <span style={{ color: 'var(--accent-indigo)' }}>● Active (dp[i][j])</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Filled</span>
      </div>

      {/* CANVAS */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col items-center justify-start p-4 overflow-y-auto">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
            position: 'relative',
          }}
          className="flex items-center justify-center pointer-events-auto"
        >
          <DPGrid2D
            table={tableData}
            rowLabels={rowLabels}
            colLabels={colLabels}
            activeCell={activeCell}
            sourceCells={sourceCells}
            sourceLabels={sourceLabels}
          />
        </div>
      </div>
    </div>
  );
};
