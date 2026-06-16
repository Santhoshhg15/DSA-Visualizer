import { useEffect, useState } from 'react';
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

export default function App() {
  const { darkMode } = useStore();
  // Removed unused store variables
  const [showLanding, setShowLanding] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

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
        <div className="flex items-center gap-4">

        </div>
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
              {/* LEFT PANEL */}
              <div
                className={`flex-shrink-0 flex flex-col border-r border-[var(--border-color)] bg-[var(--panel-bg)] transition-all duration-300 overflow-hidden ${
                  leftPanelOpen ? 'w-full lg:w-[300px]' : 'w-0'
                }`}
              >
                {leftPanelOpen && (
                  <div className="w-full h-full flex flex-col p-4 overflow-y-auto no-scrollbar gap-3">
                    <SortingLeftPanel onCollapse={() => setLeftPanelOpen(false)} />
                  </div>
                )}
              </div>

              {/* Expand left tab */}
              {!leftPanelOpen && (
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

              {/* CENTER — Canvas + Controls */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Canvas area — fills all space above controls */}
                <div className="flex-1 overflow-hidden relative">
                  <SortingCanvas />
                </div>

                {/* Playback controls bar */}
                <SortingControls />
              </div>

              {/* RIGHT PANEL */}
              <div
                className={`flex-shrink-0 flex flex-col border-l border-[var(--border-color)] bg-[var(--panel-bg)] transition-all duration-300 overflow-hidden ${
                  rightPanelOpen ? 'w-full lg:w-[340px]' : 'w-0'
                }`}
              >
                {rightPanelOpen && (
                  <SortingRightPanel setRightPanelOpen={setRightPanelOpen} />
                )}
              </div>

              {/* Expand right tab */}
              {!rightPanelOpen && (
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
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
