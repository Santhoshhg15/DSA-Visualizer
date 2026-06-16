import { useState, useEffect, useRef } from 'react';
import { useStore } from './store';
import { InputPanel } from './components/InputPanel';
import { BulkGeneratorPanel } from './components/BulkGeneratorPanel';
import { Controls } from './components/Controls';
import { BSTCanvas } from './components/BSTCanvas';
import { BSTExplanation } from './components/BSTExplanation';
import { BSTStats } from './components/BSTStats';
import { BSTPseudocode } from './components/BSTPseudocode';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BSTDebugger } from './components/BSTDebugger';
import { BSTHistoryTimeline } from './components/BSTHistoryTimeline';
import { TreeLandingPage } from './pages/TreeLandingPage';
import { traceBSTInsert } from './engines/bstPlayground';
import { parseBulkInput } from './engines/bulkParser';
import type { Step } from './types';

const ALGO_INFO = {
  bstPlayground: {
    title: 'Binary Search Tree',
    complexity: 'Insert/Search/Delete: O(log n) avg | O(n) worst',
    idea: 'Interactive BST Sandbox. Insert, delete, and search values, or run animated traversals (DFS/BFS) complete with call stack and queue visualizer.',
    color: 'from-[#10b981] to-[#059669]'
  },
};

export default function App() {
  const { algo, steps, cur, bstNodes, bstRootId, setBSTState, setStepsAndPlay, setSteps } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const infoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Hero state inputs
  const [heroInput, setHeroInput] = useState('');
  const [heroBulkInput, setHeroBulkInput] = useState('50,30,70,20,40,60,80');
  const [heroPreset, setHeroPreset] = useState('');

  // Derived workspace active state
  const hasTree = bstRootId !== null || steps.length > 0;

  const prevStepsLength = useRef(steps.length);
  const prevHasTree = useRef(hasTree);

  useEffect(() => {
    // Scroll to canvas if a new operation was run (steps increased) or tree was just generated
    if (
      (steps.length > 0 && steps.length !== prevStepsLength.current) ||
      (hasTree && !prevHasTree.current)
    ) {
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // small delay to allow DOM render
    }
    prevStepsLength.current = steps.length;
    prevHasTree.current = hasTree;
  }, [steps.length, hasTree]);

  // Sync theme class to document body
  useEffect(() => {
    document.body.classList.toggle('light', !darkMode);
  }, [darkMode]);

  // Close info popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    };
    if (showInfo) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInfo]);

  const step = steps[cur];
  const info = ALGO_INFO[algo];

  const bstCanvasNodes = step?.bstNodes ? step.bstNodes : bstNodes;
  const bstCanvasRootId = step?.bstRootId !== undefined ? step.bstRootId : bstRootId;

  // Hero inline insert handler
  const handleHeroInsert = () => {
    const val = parseInt(heroInput.trim(), 10);
    if (isNaN(val)) return;
    const { steps: insertSteps, finalNodes, rootId } = traceBSTInsert(val, bstNodes, bstRootId);
    setBSTState(finalNodes, rootId, `Insert ${val}`);
    setStepsAndPlay(insertSteps);
    setHeroInput('');
  };

  // Hero bulk generate handler
  const handleHeroBulkGenerate = () => {
    const { values } = parseBulkInput(heroBulkInput);
    if (values.length === 0) return;

    let tempNodes = {};
    let tempRootId = null;
    let allSteps: Step[] = [];

    for (const val of values) {
      const { steps: s, finalNodes, rootId } = traceBSTInsert(val, tempNodes, tempRootId);
      allSteps.push(...s);
      tempNodes = finalNodes;
      tempRootId = rootId;
    }

    const label = `Bulk: [${values.slice(0, 3).join(',')}${values.length > 3 ? '...' : ''}]`;
    setBSTState(tempNodes, tempRootId, label);
    setSteps([]);
  };

  // Hero bulk animate handler (step-by-step insertion)
  const handleHeroBulkAnimate = () => {
    const { values } = parseBulkInput(heroBulkInput);
    if (values.length === 0) return;

    let tempNodes = {};
    let tempRootId = null;
    let allSteps: Step[] = [];

    for (const val of values) {
      const { steps: s, finalNodes, rootId } = traceBSTInsert(val, tempNodes, tempRootId);
      allSteps.push(...s);
      tempNodes = finalNodes;
      tempRootId = rootId;
    }

    const label = `Bulk: [${values.slice(0, 3).join(',')}${values.length > 3 ? '...' : ''}]`;
    setBSTState(tempNodes, tempRootId, label);
    setStepsAndPlay(allSteps);
  };

  const presets: Record<string, string> = {
    balanced: '50,30,70,20,40,60,80',
    leftSkewed: '50,40,30,20,10',
    rightSkewed: '10,20,30,40,50',
    complete: '15,10,20,8,12,18,25',
    random: '15,8,22,4,12,18,30'
  };

  const handleHeroPreset = (key: string) => {
    if (key && presets[key]) {
      setHeroPreset(key);
      setHeroBulkInput(presets[key]);
    }
  };

  if (showLanding) {
    return <TreeLandingPage onOpenVisualizer={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-1)] via-[var(--bg-gradient-2)] to-[var(--bg-gradient-3)] text-[var(--text-color)] relative flex flex-col transition-all duration-300">
      {/* Dynamic Background glows */}
      {darkMode && (
        <>
          <div className="absolute top-[-12%] left-[5%] w-[650px] h-[650px] rounded-full bg-indigo-600/12 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[8%] right-[-8%] w-[650px] h-[650px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
          <div className="absolute top-[28%] right-[15%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[130px] pointer-events-none" />
        </>
      )}

      {/* Main Container */}
      <div className="flex flex-grow relative z-10 pt-16 min-h-screen items-start">
        
        {/* TOP NAV BAR */}
        <header className="fixed top-0 left-0 right-0 h-16 border-b border-[var(--border-color)] bg-[var(--panel-bg)] backdrop-blur-md flex items-center justify-between px-6 z-30 transition-all">
          <div className="flex items-center gap-3">
            {/* Back to Tree Home */}
            <button
              onClick={() => setShowLanding(true)}
              className="text-[10px] font-sans uppercase tracking-[0.06em] text-[var(--muted-color)] hover:text-[#10b981] transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-1"
            >
              ← TREE HOME
            </button>
            {/* Sidebar toggle — only visible when workspace is active */}
            {hasTree && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-[var(--pill-btn-bg)] border border-[var(--border-color)] hover:bg-[var(--pill-btn-hover)] transition-all hover:scale-105 active:scale-95 text-sm text-[var(--text-color)]"
                title="Toggle Sidebar Configuration"
              >
                ⚙️
              </button>
            )}
            <span className="text-sm font-black bg-gradient-to-r from-[var(--text-color)] to-[var(--muted-color)] bg-clip-text text-transparent">
              Tree Visualizer Suite
            </span>
          </div>

          {/* Playback Controls — center, only when steps exist */}
          {steps.length > 0 && (
            <div className="flex-1 flex justify-center">
              <Controls variant="header" />
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Info popover button */}
            <div className="relative" ref={infoRef}>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-lg border text-sm transition-all hover:scale-105 active:scale-95 ${
                  showInfo 
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                    : 'bg-[var(--pill-btn-bg)] border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--pill-btn-hover)]'
                }`}
                title="Module Information"
              >
                ℹ️
              </button>
              {showInfo && (
                <div className="info-popover">
                  <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase text-white bg-gradient-to-r ${info.color}`}>
                        {info.title}
                      </span>
                    </div>
                    <p className="font-mono text-emerald-500 dark:text-emerald-400 text-[10px] font-bold mb-3">{info.complexity}</p>
                    <p className="text-[11.5px] text-[var(--muted-color)] leading-relaxed font-medium">{info.idea}</p>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/"
              className="text-xs font-semibold text-[var(--muted-color)] hover:text-[#10b981] bg-[var(--pill-btn-bg)] border border-[var(--border-color)] px-4 py-2 rounded-xl transition-all hover:scale-105 flex items-center gap-1.5"
            >
              ← Portal
            </a>
          </div>
        </header>

        {/* ============================== */}
        {/* EMPTY STATE — HERO MODE        */}
        {/* ============================== */}
        {!hasTree ? (
          <main className="hero-empty-state w-full">
            {/* Dot grid background */}
            <div className="hero-grid-bg" />

            {/* Hero content */}
            <div className="relative z-10 flex flex-col items-center max-w-2xl w-full my-auto">
              
              {/* Animated tree icon */}
              <div className="animate-heroFloat mb-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/25 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.15)]">
                  <span className="text-5xl animate-heroPulse">🌳</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-center mb-3 bg-gradient-to-r from-[var(--text-color)] via-emerald-400 to-teal-400 bg-clip-text text-transparent leading-tight">
                Binary Search Tree
              </h1>
              <p className="text-[var(--muted-color)] text-sm md:text-base text-center max-w-md mb-10 leading-relaxed font-medium">
                Build, explore, and visualize BST operations with step-by-step animations, traversals, and a full debugging suite.
              </p>

              {/* ---- Quick Insert Card ---- */}
              <div className="w-full bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl backdrop-blur-xl mb-5 hover:border-[var(--border-hover)] transition-all animate-fadeInUp">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  <span className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.15em]">
                    Quick Insert
                  </span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleHeroInsert()}
                    placeholder="Enter a value (e.g. 15)..."
                    className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm font-mono text-[var(--text-color)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 flex-1 transition-all placeholder-[var(--muted-color)]/40 hover:border-[var(--border-hover)]"
                  />
                  <button
                    onClick={handleHeroInsert}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 hover:scale-105"
                  >
                    Insert →
                  </button>
                </div>
              </div>

              {/* ---- Bulk Generator Card ---- */}
              <div className="w-full bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl backdrop-blur-xl hover:border-[var(--border-hover)] transition-all animate-fadeInUp" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                  <span className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-[0.15em]">
                    Bulk Tree Generator
                  </span>
                </div>

                {/* Preset dropdown */}
                <select
                  value={heroPreset}
                  onChange={(e) => handleHeroPreset(e.target.value)}
                  className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-color)] focus:outline-none focus:border-[#5ea8ff] w-full transition-all cursor-pointer font-medium hover:border-[var(--border-hover)] mb-3"
                >
                  <option value="" disabled>Select Preset...</option>
                  <option value="balanced">▼ Balanced BST</option>
                  <option value="leftSkewed">▼ Left Skewed BST</option>
                  <option value="rightSkewed">▼ Right Skewed BST</option>
                  <option value="complete">▼ Complete BST</option>
                  <option value="random">▼ Random BST</option>
                </select>

                {/* Bulk input textarea */}
                <textarea
                  value={heroBulkInput}
                  onChange={(e) => setHeroBulkInput(e.target.value)}
                  placeholder="Enter values separated by commas, spaces, or newlines..."
                  className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-mono text-[var(--text-color)] focus:outline-none focus:border-[#5ea8ff] w-full h-16 transition-all placeholder-[var(--muted-color)]/30 hover:border-[var(--border-hover)] resize-none scrollbar-thin mb-3"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleHeroBulkGenerate}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] transition-all active:scale-95 hover:scale-[1.02]"
                    title="Build the tree instantly without animation"
                  >
                    Generate Tree
                  </button>
                  <button
                    onClick={handleHeroBulkAnimate}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 hover:scale-[1.02]"
                    title="Animate the insertion of values one-by-one"
                  >
                    Animate Insert
                  </button>
                </div>
              </div>

              {/* Subtle keyboard hint */}
              <p className="text-[10px] text-[var(--muted-color)]/60 mt-6 font-medium tracking-wide">
                Press <kbd className="px-1.5 py-0.5 bg-[var(--pill-btn-bg)] border border-[var(--border-color)] rounded text-[9px] font-mono mx-0.5">Enter</kbd> to quick-insert
              </p>
            </div>
          </main>
        ) : (
          /* ================================= */
          /* ACTIVE WORKSPACE — FULL LAYOUT    */
          /* ================================= */
          <>
            {/* SIDEBAR (Collapsible) */}
            <aside
              className={`w-80 border-r border-[var(--border-color)] bg-[var(--panel-bg)] backdrop-blur-xl transition-all duration-300 flex-shrink-0 z-20 flex flex-col sticky top-16 h-[calc(100vh-4rem)] ${
                sidebarOpen ? 'translate-x-0 animate-slideInLeft' : '-translate-x-full absolute'
              }`}
              style={{ marginLeft: sidebarOpen ? '0px' : '-320px' }}
            >
              <div className="p-6 overflow-y-auto space-y-8 flex-grow scrollbar-thin">
                <div>
                  <h2 className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300 uppercase tracking-[0.15em] mb-4">
                    ⚙️ Tree Operations
                  </h2>
                  <InputPanel />
                </div>

                <div>
                  <h2 className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300 uppercase tracking-[0.15em] mb-4">
                    📦 Bulk Tree Generator
                  </h2>
                  <BulkGeneratorPanel />
                </div>

                <div>
                  <h2 className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300 uppercase tracking-[0.15em] mb-4">
                    ⏱ Tree History Log
                  </h2>
                  <BSTHistoryTimeline />
                </div>
              </div>
            </aside>

            {/* MAIN WORKSPACE CANVAS */}
            <main className="flex-grow p-6 pb-32 flex flex-col justify-start relative">
              <div 
                className="w-full flex-grow flex flex-col justify-start" 
                ref={canvasRef}
                style={{ scrollMarginTop: '80px' }}
              >
                <div className="animate-fadeInUp grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start w-full py-8">
                  {/* Main Visualizer Area */}
                  <div className="w-full">
                    <ErrorBoundary>
                      <BSTCanvas
                        nodes={bstCanvasNodes}
                        rootId={bstCanvasRootId}
                        activeNodeId={step?.activeNodeId ?? null}
                        visitedNodes={step?.visitedNodes}
                        activeOperation={step?.activeOperation}
                        callStack={step?.callStack}
                        queue={step?.queue}
                        step={step}
                      />
                    </ErrorBoundary>
                  </div>

                  {/* Right Operation Panels */}
                  <div className="w-full space-y-6 h-fit animate-slideInRight">
                    <ErrorBoundary>
                      <BSTExplanation
                        step={step}
                        curStepIndex={cur}
                        totalSteps={steps.length}
                      />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <BSTStats
                        nodes={bstCanvasNodes}
                        rootId={bstCanvasRootId}
                      />
                    </ErrorBoundary>
                    <div className="animate-slideInRight-delay">
                      <ErrorBoundary>
                        <BSTPseudocode
                          activeOperation={step?.activeOperation}
                          highlightLine={step?.highlightCodeLine}
                        />
                      </ErrorBoundary>
                      <div className="mt-6">
                        <ErrorBoundary>
                          <BSTDebugger
                            step={step}
                          />
                        </ErrorBoundary>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
