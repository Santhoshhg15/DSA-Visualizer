import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPTape } from './DPTape';
import { CoinCandidates } from './CoinCandidates';
import { ZoomControls } from './ZoomControls';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const MinimumCoinsVisualizer: React.FC = () => {
  const { steps, cur, minCoinsAmount, minCoinsArray } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];

  const currentAmount = step?.minCoinsAmount !== undefined ? step.minCoinsAmount : minCoinsAmount;
  const candidateStates = step?.candidateStates || [];
  const showCandidates = step?.type === 'candidate' || step?.type === 'fill';

  // Auto-fit zoom when amount changes
  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = (currentAmount + 2) * 60;
    const contentHeight = 360;

    const scaleX = availableWidth / (contentWidth + 60);
    const scaleY = availableHeight / (contentHeight + 100);
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [minCoinsAmount, minCoinsArray]);

  // Ctrl / Cmd + Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((z) =>
        Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, parseFloat((z + delta).toFixed(2))))
      );
    }
  };

  // 360° Free Drag Handlers
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
      {/* Pinned Zoom & Pan Controls */}
      <ZoomControls
        zoom={zoom}
        setZoom={setZoom}
        minZoom={ZOOM_MIN}
        maxZoom={ZOOM_MAX}
        step={ZOOM_STEP}
        onFitScreen={handleFitScreen}
        onResetPan={() => setPan({ x: 0, y: 0 })}
      />

      {/* Scalable & 360° Pannable Canvas Container */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-full min-w-full gap-4 p-4"
        >
          {/* Top: DP Tape */}
          <div className="flex-1 min-h-0 flex items-center justify-center w-full">
            <DPTape />
          </div>

          {/* Bottom: Candidate Coins Evaluated for Current Amount */}
          {showCandidates && candidateStates.length > 0 && (
            <div className="shrink-0 mb-4 pointer-events-auto">
              <CoinCandidates
                amount={step.activeIndex >= 0 ? step.activeIndex : 0}
                candidates={candidateStates}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
