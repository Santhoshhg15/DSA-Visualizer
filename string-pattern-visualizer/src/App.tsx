import { useState, useEffect, useRef } from 'react';
import { useStore } from './store';
import { AlgoSelector } from './components/AlgoSelector';
import { InputPanel } from './components/InputPanel';
import { TextPatternDisplay } from './components/TextPatternDisplay';
import { LPSPanel } from './components/LPSPanel';
import { HashPanel } from './components/HashPanel';
import { TrieGridPanel } from './components/TrieGridPanel';
import { Controls, StepLog } from './components/Controls';
import { TrieTreeCanvas } from './components/TrieTreeCanvas';
import { TriePseudocode } from './components/TriePseudocode';
import { TrieExplanation } from './components/TrieExplanation';
import { Pseudocode } from './components/Pseudocode';
import { ErrorBoundary } from './components/ErrorBoundary';

const ALGO_INFO: Record<string, { title: string; complexity: string; idea: string; color: string }> = {
  naive: {
    title: 'Naive Pattern Search',
    complexity: 'Time: O(n·m) | Space: O(1)',
    idea: 'Slide a window of length m across the text. At each position, compare all m characters.',
    color: 'from-[#ff6eb4] to-[#ff2a85]'
  },
  kmp: {
    title: 'Knuth-Morris-Pratt',
    complexity: 'Time: O(n+m) | Space: O(m)',
    idea: 'Pre-compute the LPS prefix-suffix array. Shift pattern based on LPS index to skip redundancies.',
    color: 'from-[#5ea8ff] to-[#0062ff]'
  },
  rabin: {
    title: 'Rabin-Karp (Rolling Hash)',
    complexity: 'Time: O(n+m) avg | Space: O(1)',
    idea: 'Hash pattern and text windows using rolling update. Characters verified only on hash matches.',
    color: 'from-[#4fffb0] to-[#09d97a]'
  },
  trie: {
    title: 'Trie Word Search II',
    complexity: 'Time: O(M·4^L) | Space: O(chars)',
    idea: 'Build a Trie from words. DFS each grid cell walking the Trie, pruning branches early.',
    color: 'from-[#a371f7] to-[#7928ca]'
  },
  triePlayground: {
    title: 'Trie Prefix Tree',
    complexity: 'Insert/Search/Prefix: O(L)',
    idea: 'Interactive Trie sandbox. Insert words, search for exact matches, and check prefix existence — all animated step-by-step.',
    color: 'from-[#f59e0b] to-[#d97706]'
  },
};

export default function App() {
  const { algo, steps, cur, trieNodes } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logsOpen, setLogsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const canvasRef = useRef<HTMLDivElement>(null);
  const prevIsActive = useRef(false);
  const prevStepsLength = useRef(steps.length);

  // Sync theme class to document body
  useEffect(() => {
    document.body.classList.toggle('light', !darkMode);
  }, [darkMode]);
  
  const step = steps[cur];
  const info = ALGO_INFO[algo];

  // For triePlayground: use the step's trieNodes during animation, otherwise the persistent store nodes
  const trieCanvasNodes = (algo === 'triePlayground' && step?.trieNodes) ? step.trieNodes : trieNodes;

  const isActiveWorkspace = algo === 'triePlayground' 
    ? (Object.keys(trieNodes).length > 1 || steps.length > 0)
    : steps.length > 0;

  useEffect(() => {
    if (
      (!prevIsActive.current && isActiveWorkspace) ||
      (isActiveWorkspace && steps.length > 0 && steps.length !== prevStepsLength.current)
    ) {
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    prevIsActive.current = isActiveWorkspace;
    prevStepsLength.current = steps.length;
  }, [isActiveWorkspace, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-1)] via-[var(--bg-gradient-2)] to-[var(--bg-gradient-3)] text-[var(--text-color)] relative flex flex-col transition-all duration-300">
      {/* Dynamic Background glows (Only visible in dark mode for visual balance) */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[15%] right-[-5%] w-[550px] h-[550px] rounded-full bg-[#0062ff]/10 blur-[140px] pointer-events-none" />
        </>
      )}

      {/* TOP NAV BAR - Always visible but varies by mode */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-[var(--border-color)] bg-[var(--panel-bg)] backdrop-blur-md flex items-center justify-between px-6 z-30 transition-all">
        <div className="flex items-center gap-3 relative">
          {isActiveWorkspace && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-[var(--pill-btn-bg)] border border-[var(--border-color)] hover:bg-[var(--pill-btn-hover)] transition-all hover:scale-105 active:scale-95 text-sm text-[var(--text-color)]"
              title="Toggle Sidebar Configuration"
            >
              ⚙️
            </button>
          )}
          <span className="text-sm font-black bg-gradient-to-r from-[var(--text-color)] to-[var(--muted-color)] bg-clip-text text-transparent">
            Pattern Visualizer Suite
          </span>
        </div>

        {/* Playback Controls — Always in header for all algorithms */}
        {steps.length > 0 && (
          <div className="flex-1 flex justify-center pointer-events-auto relative z-50">
            <Controls variant="header" />
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold bg-[var(--pill-btn-bg)] border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--pill-btn-hover)] transition-all hover:scale-105 active:scale-95"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {steps.length > 0 && algo !== 'triePlayground' && (
            <button
              onClick={() => setLogsOpen(!logsOpen)}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                logsOpen 
                  ? 'bg-[#1f3a52]/60 dark:bg-[#1f3a52]/60 border-[#58a6ff] text-[#58a6ff]' 
                  : 'bg-[var(--pill-btn-bg)] border-[var(--border-color)] text-[var(--muted-color)]'
              }`}
            >
              💻 Console Logs
            </button>
          )}
          <a
            href="/"
            className="text-xs font-semibold text-[var(--muted-color)] hover:text-[#5ea8ff] bg-[var(--pill-btn-bg)] border border-[var(--border-color)] px-4 py-2 rounded-xl transition-all hover:scale-105 flex items-center gap-1.5"
          >
            ← Portal
          </a>
        </div>
      </header>

      {!isActiveWorkspace ? (
        /* ================================= */
        /* EMPTY STATE — HERO MODE           */
        /* ================================= */
        <div className="flex-grow z-20 flex flex-col items-center pt-6 px-6 pb-12 animate-fadeIn w-full mt-16">
          <div className="hero-grid-bg" />
          
          <div className="z-10 max-w-2xl w-full flex flex-col items-center my-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[var(--border-color)] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center text-5xl mb-6 animate-heroFloat">
              {algo.includes('trie') ? '🌲' : '🔍'}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-center mb-4 tracking-tight">
              <span className={`bg-gradient-to-r ${info.color} bg-clip-text text-transparent animate-heroPulse inline-block`}>
                Pattern
              </span>{' '}
              Visualizer
            </h1>
            
            <p className="text-base text-[var(--muted-color)] text-center max-w-xl mb-10 leading-relaxed font-medium">
              Explore string matching algorithms and prefix trees with step-by-step visualizations. Select an algorithm below to begin.
            </p>

            <div className="w-full bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl backdrop-blur-xl animate-fadeInUp" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
              <h2 className="text-[11px] font-black text-[#5ea8ff] uppercase tracking-widest mb-3 text-center">Algorithm Selector</h2>
              <AlgoSelector />
              
              <div className="mt-6 border-t border-[var(--border-color)] pt-6">
                <InputPanel />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================================= */
        /* ACTIVE WORKSPACE — FULL LAYOUT    */
        /* ================================= */
        <div className="flex flex-grow relative z-10 pt-16 min-h-screen items-start">
          
          {/* SIDEBAR COMPONENT (Collapsible Settings) */}
          <aside
            className={`w-80 border-r border-[var(--border-color)] bg-[var(--panel-bg)] backdrop-blur-xl transition-all duration-300 flex-shrink-0 z-20 flex flex-col sticky top-16 h-[calc(100vh-4rem)] animate-slideInLeft ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute'
            }`}
            style={{ marginLeft: sidebarOpen ? '0px' : '-320px' }}
          >
            <div className="p-5 overflow-y-auto space-y-6 flex-grow scrollbar-thin">
              <div>
                <h2 className="text-[11px] font-black text-[#5ea8ff] uppercase tracking-widest mb-3">Algorithm Selector</h2>
                <AlgoSelector />
              </div>

              <div>
                <h2 className="text-[11px] font-black text-[#5ea8ff] uppercase tracking-widest mb-3">Inputs Configuration</h2>
                <InputPanel />
              </div>
            </div>
          </aside>

          {/* MAIN WORKSPACE CANVAS (Focus View) */}
          <main className="flex-grow p-6 pb-32 flex flex-col justify-start relative animate-fadeInUp">
            <div 
              className="w-full flex-grow flex flex-col justify-start" 
              ref={canvasRef}
              style={{ scrollMarginTop: '80px' }}
            >
              {algo === 'triePlayground' ? (
                <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start w-full py-8">
                  {/* Main Visualizer Area */}
                  <div className="w-full">
                    <ErrorBoundary>
                      <TrieTreeCanvas
                        nodes={trieCanvasNodes}
                        activeNodeId={step?.activeNodeId ?? null}
                        activeOperation={step?.activeOperation}
                      />
                    </ErrorBoundary>
                  </div>

                  {/* Right Operation Explanation Panel */}
                  <div className="w-full space-y-6 h-fit animate-slideInRight">
                    <ErrorBoundary>
                      <TrieExplanation
                        step={step}
                        curStepIndex={cur}
                        totalSteps={steps.length}
                      />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <TriePseudocode
                        activeOperation={step?.activeOperation}
                        highlightLine={step?.highlightCodeLine}
                      />
                    </ErrorBoundary>
                  </div>
                </div>
              ) : steps.length > 0 ? (
                <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start w-full py-8">
                  {/* Main Visualizer Area */}
                  <div className="w-full space-y-6">
                    {algo === 'trie' ? (
                      step && <TrieGridPanel step={step} />
                    ) : (
                      <div className="space-y-6">
                        {step && <TextPatternDisplay step={step} />}
                        {algo === 'kmp' && step && <LPSPanel step={step} />}
                        {algo === 'rabin' && step && <HashPanel step={step} />}
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar: Logs and Pseudocode */}
                  <div className="w-full space-y-6 h-fit animate-slideInRight">
                    {logsOpen && <StepLog />}
                    <Pseudocode algo={algo} step={step} />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Floating Controls Removed */}
          </main>
        </div>
      )}
    </div>
  );
}
