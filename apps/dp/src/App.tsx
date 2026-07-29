import { useEffect, useState, useRef, useCallback } from 'react';
import { useDPStore } from './store';
import { DPLeftPanel } from './components/DPLeftPanel';
import { DPRightPanel } from './components/DPRightPanel';
import { ClimbingStairsVisualizer } from './components/ClimbingStairsVisualizer';
import { HouseRobberVisualizer } from './components/HouseRobberVisualizer';
import { CountSubsetsVisualizer } from './components/CountSubsetsVisualizer';
import { MinimumCoinsVisualizer } from './components/MinimumCoinsVisualizer';
import { KnapsackVisualizer } from './components/KnapsackVisualizer';
import { LcsVisualizer } from './components/LcsVisualizer';
import { LPSVisualizer } from './components/LPSVisualizer';
import { StockVisualizer } from './components/StockVisualizer';
import { LISVisualizer } from './components/LISVisualizer';
import { UniquePathsVisualizer } from './components/UniquePathsVisualizer';
import { MinPathSumVisualizer } from './components/MinPathSumVisualizer';
import { PartitionVisualizer } from './components/PartitionVisualizer';
import { TargetSumVisualizer } from './components/TargetSumVisualizer';
import { EditDistanceVisualizer } from './components/EditDistanceVisualizer';
import { DeleteOpVisualizer } from './components/DeleteOpVisualizer';
import { CoinChangeIIVisualizer } from './components/CoinChangeIIVisualizer';
import { PartitionMaxSumVisualizer } from './components/PartitionMaxSumVisualizer';
import { ComingSoonPlaceholder } from './components/ComingSoonPlaceholder';
import { StepLog } from './components/StepLog';
import { Controls } from './components/Controls';
import { DP_PROBLEMS } from './data/dpProblems';

const LEFT_MIN = 180;
const LEFT_MAX = 520;
const RIGHT_MIN = 220;
const RIGHT_MAX = 520;
const LEFT_DEFAULT = 280;
const RIGHT_DEFAULT = 320;

export default function App() {
  const { theme, toggleTheme, selectedProblemId, problem } = useDPStore();

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Resizable panel widths
  const [leftWidth, setLeftWidth] = useState(LEFT_DEFAULT);
  const [rightWidth, setRightWidth] = useState(RIGHT_DEFAULT);

  // Drag state
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const draggingLeft = useRef(false);
  const draggingRight = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  // ── Left divider drag ──────────────────────────────────────────
  const onLeftDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      draggingLeft.current = true;
      setIsResizingLeft(true);
      dragStartX.current = e.clientX;
      dragStartWidth.current = leftWidth;
      e.preventDefault();
    },
    [leftWidth]
  );

  // ── Right divider drag ─────────────────────────────────────────
  const onRightDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      draggingRight.current = true;
      setIsResizingRight(true);
      dragStartX.current = e.clientX;
      dragStartWidth.current = rightWidth;
      e.preventDefault();
    },
    [rightWidth]
  );

  // ── Global mouse move / up ─────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (draggingLeft.current) {
        const delta = e.clientX - dragStartX.current;
        const next = Math.min(LEFT_MAX, Math.max(LEFT_MIN, dragStartWidth.current + delta));
        setLeftWidth(next);
      }
      if (draggingRight.current) {
        const delta = dragStartX.current - e.clientX;
        const next = Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, dragStartWidth.current + delta));
        setRightWidth(next);
      }
    };

    const onMouseUp = () => {
      if (draggingLeft.current) {
        draggingLeft.current = false;
        setIsResizingLeft(false);
      }
      if (draggingRight.current) {
        draggingRight.current = false;
        setIsResizingRight(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Find selected problem name for Coming Soon
  const selectedProblem = DP_PROBLEMS.find((p) => p.id === selectedProblemId);

  const isDragging = isResizingLeft || isResizingRight;

  return (
    <div
      className={`min-h-screen h-screen bg-[var(--bg-color)] text-[var(--text-color)] font-sans flex flex-col transition-colors duration-300 overflow-hidden ${
        isDragging ? 'select-none cursor-col-resize' : ''
      }`}
    >
      {/* ── NAVBAR ───────────────────────────────────────────────────── */}
      <header className="w-full h-16 border-b border-[var(--border-color)] bg-[var(--panel-bg)]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 shrink-0">
        {/* Left side — Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg leading-none">🧮</span>
          </div>
          <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-[var(--text-color)] to-[var(--muted-color)] bg-clip-text text-transparent">
            DP <span className="font-medium opacity-70">Visualizer</span>
          </h1>
        </div>

        {/* Center — Problem badge (Ultra-premium developer glassmorphic capsule) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(12px)',
          }}
          className="hidden md:flex select-none shadow-sm"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--accent-indigo)' }}>✨</span>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted-color)', textTransform: 'uppercase' }}>
              PROBLEM
            </span>
          </div>

          <div style={{ width: '1px', height: '12px', background: 'var(--border-color)' }} />

          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-color)', fontFamily: 'Inter, sans-serif' }}>
            {problem.name}
          </span>

          <span
            style={{
              background: 'var(--accent-indigo-bg)',
              border: '1px solid var(--accent-indigo-bg)',
              color: 'var(--cell-active-text)',
              borderRadius: '5px',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.04em',
            }}
          >
            {selectedProblem?.badge ?? '1D DP'}
          </span>
        </div>

        {/* Right side — Theme toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {theme === 'dark' ? (
              <span className="text-amber-400 text-base">☀️</span>
            ) : (
              <span className="text-indigo-600 text-base">🌙</span>
            )}
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <main className="flex-1 flex overflow-hidden">
          <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-[var(--bg-gradient-1)]">
            {/* ── LEFT PANEL ───────────────────────────────────────────── */}
            <div
              className="flex-shrink-0 flex flex-col bg-[var(--panel-bg)] overflow-hidden"
              style={{
                width: leftPanelOpen ? leftWidth : 0,
                opacity: leftPanelOpen ? 1 : 0,
                transition: isResizingLeft ? 'none' : 'width 300ms ease-in-out, opacity 300ms ease-in-out',
              }}
            >
              <div className="w-full h-full flex flex-col p-4 overflow-y-auto no-scrollbar gap-3">
                <DPLeftPanel onCollapse={() => setLeftPanelOpen(false)} />
              </div>
            </div>

            {/* ── LEFT RESIZE HANDLE ───────────────────────────────────── */}
            <div
              onMouseDown={onLeftDividerMouseDown}
              className="group relative flex-shrink-0 cursor-col-resize z-10 select-none"
              style={{
                background: 'var(--border-color)',
                width: leftPanelOpen ? 5 : 0,
                opacity: leftPanelOpen ? 1 : 0,
                pointerEvents: leftPanelOpen ? 'auto' : 'none',
              }}
              title="Drag to resize"
            >
              {/* visible grip strip */}
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[5px] transition-colors ${isResizingLeft ? 'bg-blue-500' : 'group-hover:bg-blue-500/60 group-active:bg-blue-500'}`} />
              {/* dotted grip icon in center */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] transition-opacity pointer-events-none ${isResizingLeft ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                ))}
              </div>
            </div>

            {/* Expand left tab */}
            <button
              onClick={() => setLeftPanelOpen(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[var(--panel-bg)] border border-[var(--border-color)] border-l-0 rounded-r-md text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] z-20 flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out"
              style={{
                opacity: leftPanelOpen ? 0 : 1,
                pointerEvents: leftPanelOpen ? 'none' : 'auto',
                transform: `translateY(-50%) translateX(${leftPanelOpen ? '-20px' : '0'})`,
              }}
              title="Expand left panel"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* ── CENTER — Visualization + Controls ─────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
              {/* Visualization area */}
              <div className="flex-1 overflow-hidden relative">
                {selectedProblemId === 'climbing-stairs' ? (
                  <ClimbingStairsVisualizer />
                ) : selectedProblemId === 'house-robber' ? (
                  <HouseRobberVisualizer />
                ) : selectedProblemId === 'count-subsets-sum' ? (
                  <CountSubsetsVisualizer />
                ) : selectedProblemId === 'minimum-coins' ? (
                  <MinimumCoinsVisualizer />
                ) : selectedProblemId === 'knapsack' ? (
                  <KnapsackVisualizer />
                ) : selectedProblemId === 'lcs' ? (
                  <LcsVisualizer />
                ) : selectedProblemId === 'lps' ? (
                  <LPSVisualizer />
                ) : selectedProblemId === 'buy-sell-stocks' ? (
                  <StockVisualizer />
                ) : selectedProblemId === 'lis' ? (
                  <LISVisualizer />
                ) : selectedProblemId === 'unique-paths' ? (
                  <UniquePathsVisualizer />
                ) : selectedProblemId === 'minimum-path-sum' ? (
                  <MinPathSumVisualizer />
                ) : selectedProblemId === 'partition-equal-subset' ? (
                  <PartitionVisualizer />
                ) : selectedProblemId === 'target-sum' ? (
                  <TargetSumVisualizer />
                ) : selectedProblemId === 'edit-distance' ? (
                  <EditDistanceVisualizer />
                ) : selectedProblemId === 'delete-operation' ? (
                  <DeleteOpVisualizer />
                ) : selectedProblemId === 'coin-change-ii' ? (
                  <CoinChangeIIVisualizer />
                ) : selectedProblemId === 'partition-array-max-sum' ? (
                  <PartitionMaxSumVisualizer />
                ) : (
                  <ComingSoonPlaceholder name={selectedProblem?.name ?? ''} />
                )}
              </div>

              {/* Step log strip */}
              <StepLog />

              {/* Playback controls bar + progress bar */}
              <Controls />
            </div>

            {/* ── RIGHT RESIZE HANDLE ──────────────────────────────────── */}
            <div
              onMouseDown={onRightDividerMouseDown}
              className="group relative flex-shrink-0 cursor-col-resize z-10 select-none"
              style={{
                background: 'var(--border-color)',
                width: rightPanelOpen ? 5 : 0,
                opacity: rightPanelOpen ? 1 : 0,
                pointerEvents: rightPanelOpen ? 'auto' : 'none',
              }}
              title="Drag to resize"
            >
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[5px] transition-colors ${isResizingRight ? 'bg-blue-500' : 'group-hover:bg-blue-500/60 group-active:bg-blue-500'}`} />
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] transition-opacity pointer-events-none ${isResizingRight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                ))}
              </div>
            </div>

            {/* Expand right tab */}
            <button
              onClick={() => setRightPanelOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[var(--panel-bg)] border border-[var(--border-color)] border-r-0 rounded-l-md text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] z-20 flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out"
              style={{
                opacity: rightPanelOpen ? 0 : 1,
                pointerEvents: rightPanelOpen ? 'none' : 'auto',
                transform: `translateY(-50%) translateX(${rightPanelOpen ? '20px' : '0'})`,
              }}
              title="Expand right panel"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
            <div
              className="flex-shrink-0 flex flex-col bg-[var(--panel-bg)] overflow-hidden"
              style={{
                width: rightPanelOpen ? rightWidth : 0,
                opacity: rightPanelOpen ? 1 : 0,
                transition: isResizingRight ? 'none' : 'width 300ms ease-in-out, opacity 300ms ease-in-out',
              }}
            >
              <div className="w-full h-full flex flex-col overflow-hidden">
                <DPRightPanel setRightPanelOpen={setRightPanelOpen} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
