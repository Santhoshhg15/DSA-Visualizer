import { useState, useEffect } from 'react';
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

  // Sync theme class to document body
  useEffect(() => {
    document.body.classList.toggle('light', !darkMode);
  }, [darkMode]);
  
  const step = steps[cur];
  const info = ALGO_INFO[algo];

  // For triePlayground: use the step's trieNodes during animation, otherwise the persistent store nodes
  const trieCanvasNodes = (algo === 'triePlayground' && step?.trieNodes) ? step.trieNodes : trieNodes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-1)] via-[var(--bg-gradient-2)] to-[var(--bg-gradient-3)] text-[var(--text-color)] relative overflow-hidden flex flex-col transition-all duration-300">
      {/* Dynamic Background glows (Only visible in dark mode for visual balance) */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[15%] right-[-5%] w-[550px] h-[550px] rounded-full bg-[#0062ff]/10 blur-[140px] pointer-events-none" />
        </>
      )}

      {/* Main Container: Sidebar + Workspace */}
      <div className="flex flex-grow relative z-10 overflow-hidden h-screen pt-16">
        
        {/* TOP NAV BAR */}
        <header className="absolute top-0 left-0 right-0 h-16 border-b border-[var(--border-color)] bg-[var(--panel-bg)] backdrop-blur-md flex items-center justify-between px-6 z-30 transition-all">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-[var(--pill-btn-bg)] border border-[var(--border-color)] hover:bg-[var(--pill-btn-hover)] transition-all hover:scale-105 active:scale-95 text-sm text-[var(--text-color)]"
              title="Toggle Sidebar Configuration"
            >
              ⚙️
            </button>
            <span className="text-sm font-black bg-gradient-to-r from-[var(--text-color)] to-[var(--muted-color)] bg-clip-text text-transparent">
              Pattern Visualizer Suite
            </span>
          </div>

          {/* Playback Controls — ONLY in header for triePlayground (no floating duplicate) */}
          {steps.length > 0 && algo === 'triePlayground' && (
            <div className="flex-1 flex justify-center">
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

        {/* SIDEBAR COMPONENT (Collapsible Settings) */}
        <aside
          className={`w-80 h-full border-r border-[var(--border-color)] bg-[var(--panel-bg)] backdrop-blur-xl transition-all duration-300 flex-shrink-0 z-20 flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute'
          }`}
          style={{ marginLeft: sidebarOpen ? '0px' : '-320px' }}
        >
          <div className="p-5 overflow-y-auto space-y-6 flex-grow scrollbar-thin">
            <div>
              <h2 className="text-[11px] font-black text-[#5ea8ff] uppercase tracking-widest mb-3">Algorithm Selector</h2>
              <AlgoSelector />
            </div>

            {/* Compact Info Block */}
            <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase text-white bg-gradient-to-r ${info.color}`}>
                  {info.title}
                </span>
                <span className="font-mono text-[#5ea8ff] text-[10px] font-semibold">{info.complexity}</span>
              </div>
              <p className="text-[11px] text-[var(--muted-color)] leading-relaxed font-medium">{info.idea}</p>
            </div>

            <div>
              <h2 className="text-[11px] font-black text-[#5ea8ff] uppercase tracking-widest mb-3">Inputs Configuration</h2>
              <InputPanel />
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE CANVAS (Focus View) */}
        <main className="flex-grow h-full overflow-y-auto p-6 pb-32 flex flex-col justify-start relative scrollbar-none">
          <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col justify-center">
            {algo === 'triePlayground' ? (
              <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full py-8">
                {/* Main Visualizer Area */}
                <div className="lg:col-span-2">
                  <ErrorBoundary>
                    <TrieTreeCanvas
                      nodes={trieCanvasNodes}
                      activeNodeId={step?.activeNodeId ?? null}
                      activeOperation={step?.activeOperation}
                    />
                  </ErrorBoundary>
                </div>

                {/* Right Operation Explanation Panel */}
                <div className="lg:col-span-1 space-y-6 h-fit">
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
              <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full py-8">
                {/* Main Visualizer Area */}
                <div className="lg:col-span-2 space-y-6">
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
                <div className="lg:col-span-1 space-y-6 h-fit">
                  {logsOpen && <StepLog />}
                  <Pseudocode algo={algo} step={step} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl backdrop-blur-md">
                <div className="text-5xl mb-4 animate-pulse">⚙️</div>
                <h3 className="text-lg font-bold text-[var(--text-color)] mb-2">Setup Required</h3>
                <p className="text-[var(--muted-color)] text-sm max-w-xs leading-relaxed">
                  Use the left sidebar configurations to choose parameters and click <span className="text-[#4fffb0] font-bold">Visualize ▶</span>.
                </p>
              </div>
            )}
          </div>

          {/* Floating Controls — only for NON-triePlayground algos (triePlayground uses header controls) */}
          {steps.length > 0 && algo !== 'triePlayground' && (
            <Controls variant="floating" />
          )}
        </main>

      </div>
    </div>
  );
}
