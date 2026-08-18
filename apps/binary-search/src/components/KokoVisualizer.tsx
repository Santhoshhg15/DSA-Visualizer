import React, { useState, useRef, useCallback } from 'react';
import { useBSStore } from '../store';
import { PilesArray } from './PilesArray';
import { NumberLineSearch } from './NumberLineSearch';
import { FeasibilityCheck } from './FeasibilityCheck';
import { ZoomControls } from './ZoomControls';
import { CheckCircle2, Info } from 'lucide-react';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.4;
const ZOOM_STEP = 0.05;

export const KokoVisualizer: React.FC = () => {
  const { steps, cur, kokoPiles, kokoHours } = useBSStore();
  const currentStep = steps[cur] || steps[0];

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [bottleneckIdx, setBottleneckIdx] = useState<number | null>(null);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleFitScreen = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, parseFloat((z + delta).toFixed(2)))));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, select, svg g, svg circle, svg rect')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleBottleneckIndex = useCallback((idx: number | null) => {
    setBottleneckIdx(idx);
  }, []);

  if (!currentStep) return null;

  const maxPileVal = Math.max(...kokoPiles);
  const rangeMin = 1;
  const rangeMax = maxPileVal;

  const currentLow = currentStep.low;
  const currentHigh = currentStep.high;
  const currentMid = currentStep.mid;
  const currentHoursPerPile = currentStep.hoursPerPile;
  const currentTotalHours = currentStep.totalHours;
  const currentFeasible = currentStep.feasible;

  const eliminatedLeft = currentLow - 1;
  const eliminatedRight = currentHigh + 1;

  const showBreakdown = currentStep.type === 'check' || currentStep.type === 'narrow';
  const isActiveStep = showBreakdown;

  // Determine connector visibility: show during CHECK/NARROW when a bottleneck exists
  const showConnector = isActiveStep && bottleneckIdx !== null;

  return (
    <div
      ref={centerStageRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      className="center-stage flex-1 flex flex-col overflow-hidden relative h-full w-full select-none p-6"
    >
      {/* Pinned Zoom Controls */}
      <ZoomControls
        zoom={zoom}
        setZoom={setZoom}
        minZoom={ZOOM_MIN}
        maxZoom={ZOOM_MAX}
        step={ZOOM_STEP}
        onFitScreen={handleFitScreen}
        onResetPan={() => setPan({ x: 0, y: 0 })}
      />

      {/* Scalable & 360° Pannable Stage Container */}
      <div className="flex-grow flex items-start justify-center min-h-0 min-w-0 overflow-hidden relative pt-4">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center top',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            width: '100%',
            maxWidth: '840px',
          }}
          className="flex flex-col gap-[28px] relative"
        >
          {/* 1. PILES ARRAY SECTION */}
          <PilesArray
            piles={kokoPiles}
            currentSpeed={showBreakdown ? currentMid : null}
            hoursPerPile={showBreakdown ? currentHoursPerPile : null}
            h={kokoHours}
            onBottleneckIndex={handleBottleneckIndex}
          />

          {/* CONNECTOR: thin dashed vertical line from bottleneck pile down to NumberLine section */}
          {showConnector && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                // Approximate center of bottleneck tile relative to the tile row
                // We use a CSS variable approach: center the line in the content area
                left: '50%',
                transform: 'translateX(-50%)',
                // Position it at the gap between Piles card and NumberLine card
                // The gap is 28px; we position the connector in the middle
                top: 'calc(var(--piles-card-height, 180px) + 4px)',
                width: '2px',
                height: '20px',
                background: 'none',
                borderLeft: '2px dashed rgba(99, 102, 241, 0.45)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
          )}

          {/* 2. NUMBER LINE SEARCH SPACE SECTION */}
          <NumberLineSearch
            low={currentLow}
            high={currentHigh}
            mid={currentMid}
            rangeMin={rangeMin}
            rangeMax={rangeMax}
            eliminatedLeft={eliminatedLeft}
            eliminatedRight={eliminatedRight}
            stepType={currentStep.type}
          />

          {/* 3. FEASIBILITY CHECK SUMMARY / DONE STATE CARD */}
          {showBreakdown ? (
            <FeasibilityCheck
              mid={currentMid}
              piles={kokoPiles}
              h={kokoHours}
              hoursPerPile={currentHoursPerPile}
              totalHours={currentTotalHours}
              feasible={currentFeasible}
            />
          ) : (
            <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm text-center animate-fadeInUp font-sans">
              {currentStep.type === 'init' ? (
                <>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Info className="w-4 h-4 text-[var(--accent-indigo)] shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-color)] font-sans">
                      Initialization Step
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto font-sans">
                    Searching speed range{' '}
                    <strong className="text-[var(--text-color)] font-mono">1</strong> to{' '}
                    <strong className="text-[var(--text-color)] font-mono">{rangeMax} bananas/hr</strong>{' '}
                    for limit of{' '}
                    <strong className="text-[var(--text-color)] font-mono">{kokoHours} hours</strong>.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)] shrink-0" />
                    <h4 className="text-xs font-bold font-mono text-[var(--text-color)]">
                      Search Completed —{' '}
                      <span className="text-[var(--accent-green)] font-bold">
                        Minimum Eating Speed: {currentLow} bananas/hour
                      </span>
                    </h4>
                  </div>
                  <p className="text-[11px] text-[var(--muted-color)] leading-snug font-sans">
                    Eating slower takes &gt;{kokoHours} hours; eating faster is unnecessary.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
