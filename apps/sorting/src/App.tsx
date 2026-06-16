import { useEffect, useState, useRef, useCallback } from 'react';
import { useStore } from './store';
import { SortingLandingPage } from './pages/SortingLandingPage';
import { SortingCanvas } from './components/SortingCanvas';
import { SortingLeftPanel } from './components/SortingLeftPanel';
import { SortingRightPanel } from './components/SortingRightPanel';
import { SortingControls } from './components/SortingControls';
import { useSortingStore } from './stores/useSortingStore';
import { generateBubbleSortSteps } from './algorithms/bubbleSort';
import { generateSelectionSortSteps } from './algorithms/selectionSort';
import { generateInsertionSortSteps } from './algorithms/insertionSort';
import { generateMergeSortSteps } from './algorithms/mergeSort';
import { generateQuickSortSteps } from './algorithms/quickSort';

const LEFT_MIN = 180;
const LEFT_MAX = 520;
const RIGHT_MIN = 220;
const RIGHT_MAX = 520;
const LEFT_DEFAULT = 300;
const RIGHT_DEFAULT = 340;

export default function App() {
  const { darkMode } = useStore();
  const [showLanding, setShowLanding] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Resizable panel widths
  const [leftWidth, setLeftWidth] = useState(LEFT_DEFAULT);
  const [rightWidth, setRightWidth] = useState(RIGHT_DEFAULT);

  // Drag state
  const draggingLeft = useRef(false);
  const draggingRight = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  // ── Left divider drag ──────────────────────────────────────────
  const onLeftDividerMouseDown = useCallback((e: React.MouseEvent) => {
    draggingLeft.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = leftWidth;
    e.preventDefault();
  }, [leftWidth]);

  // ── Right divider drag ─────────────────────────────────────────
  const onRightDividerMouseDown = useCallback((e: React.MouseEvent) => {
    draggingRight.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = rightWidth;
    e.preventDefault();
  }, [rightWidth]);

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
      draggingLeft.current = false;
      draggingRight.current = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleSelectSortingAlgorithm = (algoId: string) => {
    useSortingStore.getState().setPlaying(false);
    window.history.pushState(null, '', '/sorting/visualizer');
    window.dispatchEvent(new Event('popstate'));
    useSortingStore.getState().setSelectedAlgorithm(algoId);

    const array = useSortingStore.getState().array;
    let steps: any[] = [];
    if (algoId === 'bubble') steps = generateBubbleSortSteps(array);
    else if (algoId === 'selection') steps = generateSelectionSortSteps(array);
    else if (algoId === 'insertion') steps = generateInsertionSortSteps(array);
    else if (algoId === 'merge') steps = generateMergeSortSteps(array);
    else if (algoId === 'quick') steps = generateQuickSortSteps(array);

    useSortingStore.getState().setSteps(steps);
    useSortingStore.getState().setCur(0);
    setShowLanding(false);
  };

  const handleOpenSortingVisualizer = () => {
    window.history.pushState(null, '', '/sorting/visualizer');
    window.dispatchEvent(new Event('popstate'));
    setShowLanding(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/sorting' || path === '/sorting/') {
        setShowLanding(true);
      } else if (path.includes('/visualizer')) {
        setShowLanding(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState();
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className={`min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] font-sans flex flex-col transition-colors duration-300 ${!showLanding ? 'h-screen overflow-hidden' : ''}`}>
      <header className="w-full h-16 border-b border-[var(--border-color)] bg-[var(--panel-bg)]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setShowLanding(true); window.history.pushState(null, '', '/sorting'); window.dispatchEvent(new Event('popstate')); }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-lg leading-none">🔀</span>
          </div>
          <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-[var(--text-color)] to-[var(--muted-color)] bg-clip-text text-transparent">
            Sorting <span className="font-medium opacity-70">Visualizer</span>
          </h1>
        </div>
        <div className="flex items-center gap-4" />
      </header>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {showLanding ? (
          <SortingLandingPage
            onSelectAlgorithm={handleSelectSortingAlgorithm}
            onOpenVisualizer={handleOpenSortingVisualizer}
          />
        ) : (
          <main className="flex-1 flex overflow-hidden">
            <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-[var(--bg-gradient-1)]">

              {/* ── LEFT PANEL ───────────────────────────────────────────── */}
              {leftPanelOpen && (
                <div
                  className="flex-shrink-0 flex flex-col bg-[var(--panel-bg)] overflow-hidden"
                  style={{ width: leftWidth }}
                >
                  <div className="w-full h-full flex flex-col p-4 overflow-y-auto no-scrollbar gap-3">
                    <SortingLeftPanel onCollapse={() => setLeftPanelOpen(false)} />
                  </div>
                </div>
              )}

              {/* ── LEFT RESIZE HANDLE ───────────────────────────────────── */}
              {leftPanelOpen ? (
                <div
                  onMouseDown={onLeftDividerMouseDown}
                  className="group relative flex-shrink-0 w-[5px] cursor-col-resize z-10 select-none"
                  style={{ background: 'var(--border-color)' }}
                  title="Drag to resize"
                >
                  {/* visible grip strip */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[5px] transition-colors group-hover:bg-blue-500/60 group-active:bg-blue-500" />
                  {/* dotted grip icon in center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                    ))}
                  </div>
                </div>
              ) : (
                /* Expand left tab */
                <button
                  onClick={() => setLeftPanelOpen(true)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[var(--panel-bg)] border border-[var(--border-color)] border-l-0 rounded-r-md text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] z-20 flex items-center justify-center shadow-lg transition-colors"
                  title="Expand left panel"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* ── CENTER — Canvas + Controls ───────────────────────────── */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <div className="flex-1 overflow-hidden relative">
                  <SortingCanvas />
                </div>
                <SortingControls />
              </div>

              {/* ── RIGHT RESIZE HANDLE ──────────────────────────────────── */}
              {rightPanelOpen ? (
                <div
                  onMouseDown={onRightDividerMouseDown}
                  className="group relative flex-shrink-0 w-[5px] cursor-col-resize z-10 select-none"
                  style={{ background: 'var(--border-color)' }}
                  title="Drag to resize"
                >
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[5px] transition-colors group-hover:bg-blue-500/60 group-active:bg-blue-500" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                    ))}
                  </div>
                </div>
              ) : (
                /* Expand right tab */
                <button
                  onClick={() => setRightPanelOpen(true)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[var(--panel-bg)] border border-[var(--border-color)] border-r-0 rounded-l-md text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] z-20 flex items-center justify-center shadow-lg transition-colors"
                  title="Expand right panel"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
              {rightPanelOpen && (
                <div
                  className="flex-shrink-0 flex flex-col bg-[var(--panel-bg)] overflow-hidden"
                  style={{ width: rightWidth }}
                >
                  <SortingRightPanel setRightPanelOpen={setRightPanelOpen} />
                </div>
              )}

            </div>
          </main>
        )}
      </div>
    </div>
  );
}
