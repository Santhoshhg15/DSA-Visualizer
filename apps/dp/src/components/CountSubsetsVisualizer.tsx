import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPGrid2D } from './DPGrid2D';
import { ZoomControls } from './ZoomControls';
import { MemoCallStack } from './MemoCallStack';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

// Step-type color chip mapping for the legend banner
const STEP_BADGE_MAP: Record<string, { label: string; color: string }> = {
  call: { label: '📞 Call', color: 'var(--accent-blue)' },
  'base-case': { label: '⏹ Base', color: 'var(--accent-green)' },
  'memo-hit': { label: '⚡ Memo Hit', color: 'var(--accent-amber)' },
  'compute-nottake': { label: '↖ notTake', color: 'var(--accent-indigo)' },
  'compute-take': { label: '↙ take', color: 'var(--accent-teal)' },
  return: { label: '← Return', color: 'var(--accent-coral)' },
  init: { label: '⚙ Init', color: 'var(--muted-color)' },
  done: { label: '✅ Done', color: 'var(--accent-teal)' },
};

export const CountSubsetsVisualizer: React.FC = () => {
  const { steps, cur, subsetArray, subsetTargetK } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];

  const currentArr = step?.subsetArr || subsetArray || [2, 3, 5, 6];
  const currentK = step?.subsetK !== undefined ? step.subsetK : subsetTargetK;

  // Auto-fit zoom & reset pan when grid dimensions change
  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 500;

    const contentWidth = (currentK + 2) * 55;
    const contentHeight = (currentArr.length + 2) * 45;

    const scaleX = availableWidth / (contentWidth + 60);
    const scaleY = availableHeight / (contentHeight + 120);
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [subsetTargetK, subsetArray]);

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
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!step) {
    return (
      <div style={{ padding: '20px', color: 'var(--muted-color)', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
        Initializing visualization...
      </div>
    );
  }

  const stepType = (step.type || '') as string;
  const badge = STEP_BADGE_MAP[stepType] || { label: stepType, color: 'var(--muted-color)' };

  // Build row and column headers (n rows, not n+1 since memoization table is n×(k+1))
  const rowLabels = (currentArr || []).map((val, idx) => `arr[${idx}]=${val}`);
  const colLabels = Array.from({ length: (currentK || 0) + 1 }, (_, c) => `${c}`);

  // Table matrix from step snapshot
  const tableData = (step.dpTable || [new Array((currentK || 0) + 1).fill(null)]) as (number | null)[][];
  const activeCell = step.activeCell || null;
  const sourceCells = step.sourceCells || [];
  const memoHitCell = step.memoHitCell || null;
  const inProgressCell = step.inProgressCell || null;

  // Custom cell-state resolver for memo semantics
  const getCellState = (r: number, c: number) => {
    // memo-hit takes priority: shows cached-value green flash
    if (memoHitCell && memoHitCell[0] === r && memoHitCell[1] === c) return 'memo-hit' as const;
    // in-progress: call is open, children haven't returned yet
    if (inProgressCell && inProgressCell[0] === r && inProgressCell[1] === c) return 'in-progress' as const;
    // active: current call frame (e.g. base case, compute step)
    if (activeCell && activeCell[0] === r && activeCell[1] === c) return 'active' as const;
    if (sourceCells && Array.isArray(sourceCells) && sourceCells.some(([sr, sc]) => sr === r && sc === c)) return 'source' as const;
    const val = tableData?.[r]?.[c];
    if (val === null || val === undefined) return 'unfilled' as const;
    return 'filled' as const;
  };

  const callStack = (step as any)?.callStack as { index: number; k: number }[] || [];
  const memoStats = (step as any)?.memoStats as { cellsComputed: number; memoHits: number } | null;
  const returnValue = (step as any)?.returnValue as number | null | undefined;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
    >
      {/* ─── Top HUD bar ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--panel-bg)',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        {/* Step type badge */}
        {badge && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              background: `${badge.color}22`,
              border: `1px solid ${badge.color}55`,
              color: badge.color,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.03em',
              transition: 'all 0.2s ease',
            }}
          >
            {badge.label}
          </span>
        )}

        {/* Return value chip */}
        {returnValue !== null && returnValue !== undefined && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'var(--accent-coral-bg, rgba(239,68,68,0.12))',
              border: '1px solid var(--accent-coral, #ef4444)',
              color: 'var(--accent-coral, #ef4444)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            returns {returnValue}
          </span>
        )}

        {/* Memo stats */}
        {memoStats && (
          <>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--muted-color)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              computed: <b style={{ color: 'var(--accent-blue)' }}>{memoStats.cellsComputed}</b>
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--muted-color)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              memo hits: <b style={{ color: 'var(--accent-amber, #f59e0b)' }}>{memoStats.memoHits}</b>
            </span>
          </>
        )}

        {/* Legend chips */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: '10px',
            fontSize: '10px',
            color: 'var(--muted-color)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span>⬜ Uncomputed (—)</span>
          <span style={{ color: 'var(--accent-indigo)' }}>◈ In Progress</span>
          <span style={{ color: 'var(--accent-blue)' }}>● Active</span>
          <span style={{ color: 'var(--accent-blue)' }}>◆ Source</span>
          <span style={{ color: 'var(--accent-green)' }}>✦ Memo Hit</span>
          <span style={{ color: 'var(--cell-filled-text, #9ca3af)' }}>● Filled</span>
        </div>
      </div>

      {/* ─── Main body: call-stack sidebar + scrollable canvas ─────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Call Stack Sidebar */}
        <div
          style={{
            width: '260px',
            flexShrink: 0,
            borderRight: '1px solid var(--border-color)',
            background: 'var(--panel-bg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '14px 12px',
            gap: '6px',
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <MemoCallStack
              callStack={callStack}
              arr={currentArr}
              returnValue={returnValue}
              stepType={stepType}
            />
          </div>

          {/* Memo stats mini-cards */}
          {memoStats && (
            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '10px',
                marginTop: 'auto',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--muted-color)',
                  marginBottom: '8px',
                }}
              >
                Memo Stats
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-card, var(--input-bg))',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 8px',
                    textAlign: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--muted-color)',
                      marginBottom: '4px',
                    }}
                  >
                    Computed
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '20px', lineHeight: 1 }}>
                    {memoStats.cellsComputed}
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--bg-card, var(--input-bg))',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 8px',
                    textAlign: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--muted-color)',
                      marginBottom: '4px',
                    }}
                  >
                    ✦ Hits
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '20px', lineHeight: 1 }}>
                    {memoStats.memoHits}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Canvas */}
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
          {/* Zoom & Pan Controls */}
          <ZoomControls
            zoom={zoom}
            setZoom={setZoom}
            minZoom={ZOOM_MIN}
            maxZoom={ZOOM_MAX}
            step={ZOOM_STEP}
            onFitScreen={handleFitScreen}
            onResetPan={() => setPan({ x: 0, y: 0 })}
          />

          {/* Scalable & 360° Pannable Canvas */}
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
                getCellState={getCellState}
                showUnfilledDash={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
