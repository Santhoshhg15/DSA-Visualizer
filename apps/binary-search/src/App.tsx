import { useEffect, useState, useRef, useCallback } from 'react';
import { useBSStore } from './store';
import { BSLeftPanel } from './components/BSLeftPanel';
import { BSRightPanel } from './components/BSRightPanel';
import { KokoVisualizer } from './components/KokoVisualizer';
import { ComingSoonPlaceholder } from './components/ComingSoonPlaceholder';
import { StepLog } from './components/StepLog';
import { Controls } from './components/Controls';
import { BS_PROBLEMS } from './data/bsProblems';
import { Target } from 'lucide-react';

const LEFT_MIN = 180;
const LEFT_MAX = 520;
const RIGHT_MIN = 220;
const RIGHT_MAX = 520;
const LEFT_DEFAULT = 280;
const RIGHT_DEFAULT = 320;

export default function App() {
  const { theme, toggleTheme, selectedProblemId, problem } = useBSStore();

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

  // Find selected problem name
  const selectedProblem = BS_PROBLEMS.find((p) => p.id === selectedProblemId);

  const isDragging = isResizingLeft || isResizingRight;

  return (
    <div
      className={`min-h-screen h-screen bg-[var(--bg-color)] text-[var(--text-color)] font-sans flex flex-col transition-colors duration-300 overflow-hidden ${
        isDragging ? 'select-none cursor-col-resize' : ''
      }`}
    >
      {/* ── NAVBAR ───────────────────────────────────────────────────── */}
      <header className="w-full h-16 border-b border-[var(--border-color)] bg-[var(--panel-bg)]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 shrink-0">
        {/* Left side — Brand with clean outline icon */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Target className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-[var(--text-color)] to-[var(--muted-color)] bg-clip-text text-transparent">
            Binary Search <span className="font-medium opacity-70">Visualizer</span>
          </h1>
        </div>

        {/* Center — Breadcrumb + Problem badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(12px)',
          }}
          className="hidden md:flex select-none shadow-sm"
        >
          {/* Breadcrumb: Binary Search > Problem name */}
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
            Binary Search
          </span>
          <span style={{ fontSize: '12px', color: 'var(--border-hover)', fontFamily: 'Inter, sans-serif' }}>›</span>
          <button
            onClick={() => setLeftPanelOpen(true)}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-color)',
              fontFamily: 'Inter, sans-serif',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            className="hover:text-[var(--accent-indigo)] transition-colors"
            title="Open left panel"
          >
            {problem.name}
          </button>

          <div style={{ width: '1px', height: '12px', background: 'var(--border-color)', margin: '0 4px' }} />

          <span
            style={{
              background: 'var(--accent-indigo-bg)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: 'var(--accent-indigo)',
              borderRadius: '5px',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.04em',
            }}
          >
            {selectedProblem?.badge ?? 'Search on Answer'}
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
                <BSLeftPanel onCollapse={() => setLeftPanelOpen(false)} />
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
                {selectedProblemId === 'koko-eating-bananas' ? (
                  <KokoVisualizer />
                ) : (
                  <ComingSoonPlaceholder name={selectedProblem?.name ?? ''} />
                )}
              </div>

              {/* Step log strip */}
              <StepLog />

              {/* Player controls */}
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
              {/* visible grip strip */}
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[5px] transition-colors ${isResizingRight ? 'bg-blue-500' : 'group-hover:bg-blue-500/60 group-active:bg-blue-500'}`} />
              {/* dotted grip icon in center */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] transition-opacity pointer-events-none ${isResizingRight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                ))}
              </div>
            </div>

            {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
            <div
              className="flex-shrink-0 flex flex-col bg-[var(--panel-bg)] overflow-hidden"
              style={{
                width: rightPanelOpen ? rightWidth : 0,
                opacity: rightPanelOpen ? 1 : 0,
                transition: isResizingRight ? 'none' : 'width 300ms ease-in-out, opacity 300ms ease-in-out',
              }}
            >
              <div className="w-full h-full flex flex-col p-4 overflow-y-auto no-scrollbar gap-3">
                <BSRightPanel onCollapse={() => setRightPanelOpen(false)} />
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
          </div>
        </main>
      </div>
    </div>
  );
}
