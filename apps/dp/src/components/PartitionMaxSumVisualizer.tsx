import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPTape } from './DPTape';
import { PartitionWindowCandidates } from './PartitionWindowCandidates';
import { ZoomControls } from './ZoomControls';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const PartitionMaxSumVisualizer: React.FC = () => {
  const { steps, cur, partitionMaxSumArr } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];
  const arr = step?.partitionArr || partitionMaxSumArr || [1, 15, 7, 9, 2, 5, 10];

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const contentWidth = (arr.length + 1) * 66 + 60;
    const autoZoom = Math.min(1, availableWidth / contentWidth);

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [partitionMaxSumArr]);

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

  const arrValues = [0, ...arr]; // index 0 is empty prefix
  const activeWindow = step.activeWindow || null;
  const candidates = step.partitionCandidates || (step.candidateStates as any) || [];

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

      {/* CANVAS */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col items-center justify-between p-4 overflow-y-auto">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
            position: 'relative',
            width: '100%',
          }}
          className="flex flex-col items-center justify-center pointer-events-auto"
        >
          <DPTape
            showValueAndDp={true}
            arrValues={arrValues}
            activeWindow={activeWindow}
          />
        </div>

        {/* CANDIDATES PANEL */}
        {step.type !== 'init' && step.type !== 'base' && step.type !== 'done' && (
          <PartitionWindowCandidates
            candidates={candidates}
            activeIndex={step.activeIndex}
          />
        )}
      </div>
    </div>
  );
};
