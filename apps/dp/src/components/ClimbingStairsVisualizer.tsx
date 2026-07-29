import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { StaircaseDiagram } from './StaircaseDiagram';
import { DPTape } from './DPTape';
import { ZoomControls } from './ZoomControls';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const ClimbingStairsVisualizer: React.FC = () => {
  const { n } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Auto-fit zoom when n changes for large staircases
  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = (n + 1) * 60;
    const contentHeight = n * 14 + 180;

    const scaleX = availableWidth / (contentWidth + 60);
    const scaleY = availableHeight / (contentHeight + 100);
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [n]);

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
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
          }}
          className="flex-1 flex flex-col min-h-full min-w-full"
        >
          {/* Top Half: Staircase Diagram */}
          <div
            style={{ background: 'transparent' }}
            className="flex-1 min-h-0 flex items-center justify-center border-b border-[var(--border-color)] overflow-hidden"
          >
            <StaircaseDiagram />
          </div>

          {/* Bottom Half: DP Tape */}
          <div
            style={{ background: 'transparent' }}
            className="flex-1 min-h-0 flex items-center justify-center overflow-hidden"
          >
            <DPTape />
          </div>
        </div>
      </div>
    </div>
  );
};
