import React, { useState, useEffect, useRef } from 'react';
import { useSWStore } from '../store';
import { DPTape } from './DPTape';
import { ZoomControls } from './ZoomControls';
import { FrequencyMapPanel } from './FrequencyMapPanel';
import { type AnagramStep } from '../engines/countAnagramsPattern';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const AnagramVisualizer: React.FC = () => {
  const { steps, cur, anagramText, anagramPattern } = useSWStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = (steps[cur] || steps[0]) as AnagramStep;
  const arr = (anagramText || "cbaebabacd").split('');

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = arr.length * 68 + 120;
    const contentHeight = 450;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
    window.addEventListener('resize', handleFitScreen);
    return () => window.removeEventListener('resize', handleFitScreen);
  }, [anagramText]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
    } else {
      setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
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

  // State mapping for text characters DPTape cells
  const customCellState = (index: number) => {
    if (step.type === 'init') return 'unfilled';
    if (index === step.currentIndex) return 'active';
    if (index < step.currentIndex) return 'filled';
    return 'unfilled';
  };

  // Render unvisited string characters with muted style
  const customCellBadge = (index: number) => {
    if (index > step.currentIndex) {
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
    return (
      <span
        style={{
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {arr[index]}
      </span>
    );
  };

  const activeWindow: [number, number] | null =
    step.type !== 'init' && step.type !== 'done'
      ? [step.windowStart, step.currentIndex]
      : null;

  // Window substring text
  const currentWindowText =
    activeWindow !== null
      ? anagramText.substring(activeWindow[0], activeWindow[1] + 1)
      : '';

  return (
    <div
      ref={centerStageRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
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
          {/* LEGEND 1 (Main Tape) */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cell-unfilled-border)' }} />
              <span>Unvisited</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />
              <span>In current window</span>
            </div>
          </div>

          {/* MAIN TAPE */}
          <DPTape
            customCellState={customCellState}
            customCellBadge={customCellBadge}
            arrValues={arr}
            activeWindow={activeWindow}
          />

          {/* LEGEND 2 (Freq Panel) */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'rgba(74, 222, 128, 0.2)', border: '1px solid var(--accent-green)' }} />
              <span>Matching</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'rgba(96, 165, 250, 0.2)', border: '1px solid var(--accent-blue)' }} />
              <span>Under-count</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'rgba(248, 113, 113, 0.2)', border: '1px solid var(--accent-coral)' }} />
              <span>Over-count</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'rgba(156, 163, 175, 0.15)', border: '1px solid rgba(156, 163, 175, 0.3)' }} />
              <span>Extra (not in pattern)</span>
            </div>
          </div>

          {/* FREQUENCY MAPS PANEL */}
          <FrequencyMapPanel
            pattern={step.pattern}
            patternFreq={step.patternFreq}
            windowFreq={step.windowFreq}
            matches={step.matches}
            requiredMatches={step.requiredMatches}
            currentWindowText={currentWindowText}
          />
        </div>
      </div>
    </div>
  );
};
