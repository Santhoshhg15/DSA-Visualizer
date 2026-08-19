import React, { useState, useEffect, useRef } from 'react';
import { useSortingStore } from '../stores/useSortingStore';
import { sortingAlgorithmCode } from '../data/sortingAlgorithmCode';

// Extremely basic syntax highlighting helper for Java code
function syntaxHighlight(code: string) {
  if (code.trim().startsWith('//')) {
    return <span className="text-[var(--muted-color)] italic">{code}</span>;
  }
  const keywords = ['public', 'private', 'void', 'return', 'if', 'else', 'while', 'for', 'new', 'boolean', 'int', 'class', 'break'];
  const types = ['Solution', 'int[]'];
  const tokens = code.split(/([ \(\)\{\}\[\]\.\,;\<\>])/g);
  
  return tokens.map((token, i) => {
    if (keywords.includes(token)) {
      return <span key={i} className="text-[#60a5fa]">{token}</span>;
    }
    if (types.includes(token)) {
      return <span key={i} className="text-[#10b981]">{token}</span>;
    }
    return token;
  });
}

export function SortingRightPanel({
  setRightPanelOpen,
}: {
  setRightPanelOpen: (v: boolean) => void;
}) {
  const {
    selectedAlgorithm,
    steps,
    cur,
    comparisons,
    swaps,
    arrayAccesses,
    arraySize,
  } = useSortingStore();

  const [activeTab, setActiveTab] = useState<'code' | 'trace' | 'stats'>('code');
  const [isPseudoCode, setIsPseudoCode] = useState(true);
  
  const playing = useSortingStore(state => state.playing);

  // Auto-switch to trace when playing starts
  useEffect(() => {
    if (playing) {
      setActiveTab('trace');
    }
  }, [playing]);
  
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const traceScrollRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const [showTracePill, setShowTracePill] = useState(false);
  const [panelWidth, setPanelWidth] = useState(350);
  const outerContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = cur >= 0 && cur < steps.length ? steps[cur] : null;
  const activeLine = isPseudoCode
    ? (currentStep?.codeLineActivePseudo || currentStep?.codeLineActive || 0)
    : (currentStep?.codeLineActive || 0);

  // Track panel width for narrow threshold wrapping
  useEffect(() => {
    if (!outerContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setPanelWidth(entry.contentRect.width);
      }
    });
    observer.observe(outerContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = panelWidth < 450;

  // Auto-scroll trace log when step changes
  useEffect(() => {
    if (activeTab === 'trace' && traceScrollRef.current && !userScrolledUp.current) {
      const container = traceScrollRef.current;
      const activeEntry = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        const elementTop = activeEntry.offsetTop;
        const elementHeight = activeEntry.offsetHeight;
        const containerHeight = container.clientHeight;
        
        if (elementTop + elementHeight > container.scrollTop + containerHeight) {
          container.scrollTo({
            top: elementTop - containerHeight + elementHeight,
            behavior: 'smooth'
          });
        } else if (elementTop < container.scrollTop) {
          container.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [cur, activeTab]);

  // Auto-scroll/highlight active code line
  useEffect(() => {
    if (activeTab === 'code' && codeScrollRef.current) {
      const container = codeScrollRef.current;
      const activeLineEl = container.querySelector('[data-active-line="true"]') as HTMLElement;
      if (activeLineEl) {
        const targetScrollTop = activeLineEl.offsetTop - (container.clientHeight / 2) + (activeLineEl.offsetHeight / 2);
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeLine, activeTab]);

  const handleTraceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    userScrolledUp.current = !isAtBottom;
    setShowTracePill(!isAtBottom);
  };

  const handleScrollToActiveTrace = () => {
    userScrolledUp.current = false;
    setShowTracePill(false);
    if (traceScrollRef.current) {
      const container = traceScrollRef.current;
      const activeEntry = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        container.scrollTo({
          top: activeEntry.offsetTop - container.clientHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  };

  // Copy and Download logic for sorting algorithms
  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopy = async () => {
    if (!selectedAlgorithm) return;
    const meta = sortingAlgorithmCode[selectedAlgorithm];
    try {
      await navigator.clipboard.writeText(meta.javaCode.join('\n'));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleDownload = () => {
    if (!selectedAlgorithm) return;
    const meta = sortingAlgorithmCode[selectedAlgorithm];
    const header = [
      '// ============================================',
      `// ${meta.algorithmName}`,
      '// DSA Visualizer — Generated Code',
      '// ============================================',
      `// Time Complexity:  ${meta.timeComplexity}`,
      `// Space Complexity: ${meta.spaceComplexity}`,
      '// ============================================',
      '',
      ''
    ].join('\n');
    const blob = new Blob([header + meta.javaCode.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = meta.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const algoMeta = selectedAlgorithm ? sortingAlgorithmCode[selectedAlgorithm] : null;
  const codeLines = algoMeta
    ? (isPseudoCode ? algoMeta.pseudoCode : algoMeta.javaCode)
    : [];

  // Count sorted elements for progress bar
  const sortedCount = currentStep?.sortedIndices.length || 0;

  return (
    <div 
      ref={outerContainerRef} 
      className="flex-1 flex flex-col h-full bg-[var(--panel-bg)] overflow-hidden"
    >
      {/* ANALYSIS Header Bar */}
      <div className="h-[44px] border-b border-[var(--border-color)] bg-[var(--panel-bg)] px-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 select-none">
          <span className="text-purple-500">🔬</span>
          <h2 className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--muted-color)]">Analysis</h2>
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              useSortingStore.getState().resetSort();
            }}
            className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded-[6px] border border-[var(--border-color)] text-[var(--muted-color)] bg-transparent hover:border-red-400 hover:text-red-400 transition-[color,border-color] duration-150"
          >
            Clear
          </button>

          <button 
            onClick={() => setRightPanelOpen(false)} 
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] hover:border-[var(--text-color)]/50 transition-[color,border-color] duration-150"
            title="Collapse panel"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-[var(--input-bg)] border-b border-[var(--border-color)] p-2 flex-shrink-0 gap-1 relative">
        <div 
          className={`absolute top-2 bottom-2 w-[calc(33.33%-6px)] rounded transition-all duration-300 ease-out shadow-sm ${
            activeTab === 'code' 
              ? 'left-2 bg-purple-500/20 border border-purple-500/30' 
              : activeTab === 'trace'
                ? 'left-[calc(33.33%+1px)] bg-blue-500/20 border border-blue-500/30'
                : 'left-[calc(66.66%+1px)] bg-orange-500/20 border border-orange-500/30'
          }`} 
        />
        <button 
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded relative z-10 transition-colors duration-200 ${
            activeTab === 'code' ? 'text-purple-400 font-extrabold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
          }`}
        >
          Code
        </button>
        <button 
          onClick={() => setActiveTab('trace')}
          className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded relative z-10 transition-colors duration-200 ${
            activeTab === 'trace' ? 'text-blue-400 font-extrabold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
          }`}
        >
          Trace
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded relative z-10 transition-colors duration-200 ${
            activeTab === 'stats' ? 'text-orange-400 font-extrabold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
          }`}
        >
          Stats
        </button>
      </div>

      {/* Tab Content Areas */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* 1. CODE TAB */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            {/* Header bar */}
            <div 
              className={`px-3 flex border-b border-[var(--border-color)] bg-[var(--panel-bg)] shrink-0 select-none ${
                isNarrow ? 'flex-col gap-2 py-2.5 h-auto' : 'h-[40px] flex-row items-center justify-between'
              }`}
            >
              {isNarrow ? (
                <>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-1.5">
                      💻 Source Code
                    </span>
                    {algoMeta && (
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] font-mono text-[9px] uppercase font-bold tracking-wider">
                          {algoMeta.timeComplexity}
                        </span>
                        <span className="px-1.5 py-0.5 rounded border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7] font-mono text-[9px] uppercase font-bold tracking-wider">
                          {algoMeta.spaceComplexity}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full border-t border-[var(--border-color)]/50 pt-2">
                    {algoMeta && (
                      <div className="flex items-center bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[4px] p-[2px]">
                        <button
                          onClick={() => setIsPseudoCode(true)}
                          className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-all cursor-pointer ${
                            isPseudoCode ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-[var(--muted-color)] hover:text-white'
                          }`}
                        >
                          Pseudo
                        </button>
                        <button
                          onClick={() => setIsPseudoCode(false)}
                          className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-all cursor-pointer ${
                            !isPseudoCode ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-[var(--muted-color)] hover:text-white'
                          }`}
                        >
                          Java
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={handleCopy} 
                        disabled={!selectedAlgorithm}
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-transparent text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        title={copySuccess ? "Copied!" : "Copy Java Code"}
                      >
                        {copySuccess ? '✓' : '⎘'}
                      </button>
                      <button 
                        onClick={handleDownload} 
                        disabled={!selectedAlgorithm}
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-transparent text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Download Java File"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-1.5">
                    💻 Source Code
                  </span>
                  <div className="flex items-center gap-3">
                    {algoMeta && (
                      <div className="flex items-center gap-1.5 mr-1">
                        <span className="px-1.5 py-0.5 rounded border border-[#FFB800]/40 bg-[#FFB800]/15 text-[#FFB800] font-mono text-[9px] uppercase font-bold tracking-wider">
                          {algoMeta.timeComplexity}
                        </span>
                        <span className="px-1.5 py-0.5 rounded border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7] font-mono text-[9px] uppercase font-bold tracking-wider">
                          {algoMeta.spaceComplexity}
                        </span>
                      </div>
                    )}
                    {algoMeta && (
                      <div className="flex items-center bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[4px] p-[2px]">
                        <button
                          onClick={() => setIsPseudoCode(true)}
                          className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-all cursor-pointer ${
                            isPseudoCode ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-[var(--muted-color)] hover:text-white'
                          }`}
                        >
                          Pseudo
                        </button>
                        <button
                          onClick={() => setIsPseudoCode(false)}
                          className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-all cursor-pointer ${
                            !isPseudoCode ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-[var(--muted-color)] hover:text-white'
                          }`}
                        >
                          Java
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={handleCopy} 
                        disabled={!selectedAlgorithm}
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-transparent text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        title={copySuccess ? "Copied!" : "Copy Java Code"}
                      >
                        {copySuccess ? '✓' : '⎘'}
                      </button>
                      <button 
                        onClick={handleDownload} 
                        disabled={!selectedAlgorithm}
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-transparent text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Download Java File"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Code lines container */}
            <div 
              ref={codeScrollRef}
              className="flex-1 overflow-y-auto p-3 text-[13px] font-mono leading-[1.7] custom-scrollbar bg-[var(--panel-bg)]"
            >
              {codeLines.length === 0 ? (
                <div className="text-[var(--muted-color)] text-center mt-4">Select an algorithm to view code.</div>
              ) : (
                <div className="flex">
                  <div className="flex flex-col text-right pr-3 mr-3 border-r border-[var(--border-color)] text-[13px] text-[var(--muted-color)]/60 select-none">
                    {codeLines.map((_, i) => (
                      <div key={i} className="py-[2px]">{i + 1}</div>
                    ))}
                  </div>
                  <div className="flex flex-col flex-1">
                    {codeLines.map((line, idx) => {
                      const isActive = (idx + 1) === activeLine;
                      return (
                        <div 
                          key={idx} 
                          data-active-line={isActive}
                          className={`py-[2px] pl-2 -ml-2 transition-colors duration-200 whitespace-pre border-l-[3px] ${
                            isActive 
                              ? 'bg-amber-500/10 text-[var(--text-color)] border-amber-500 font-semibold' 
                              : 'text-[var(--text-color)] border-transparent font-normal'
                          }`}
                        >
                          {isPseudoCode ? line : syntaxHighlight(line)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. TRACE TAB */}
        {activeTab === 'trace' && (
          <div className="flex-1 flex flex-col relative overflow-hidden h-full">
            <div 
              ref={traceScrollRef}
              onScroll={handleTraceScroll}
              className="flex-grow overflow-y-auto p-3 flex flex-col gap-1.5 custom-scrollbar bg-[var(--panel-bg)] min-h-[150px]"
            >
              {steps.length === 0 ? (
                <div className="text-[12px] text-[var(--muted-color)] p-4 text-center">
                  Run an algorithm to start logging steps.
                </div>
              ) : (
                steps.slice(0, cur + 1).map((step, idx) => {
                  const isActive = idx === cur;
                  let colorClass = "border-l-transparent bg-black/10";
                  
                  if (step.type === 'swap') colorClass = "border-l-[#FF6B00] bg-[#FF6B00]/10";
                  else if (step.type === 'compare' || step.type === 'merge-compare') colorClass = "border-l-[#FFB800] bg-[#FFB800]/10";
                  else if (step.type === 'mark-sorted' || step.type === 'complete') colorClass = "border-l-[#00C896] bg-[#00C896]/10";
                  else if (step.type === 'set-pivot') colorClass = "border-l-[#7C3AED] bg-[#7C3AED]/10";
                  else if (step.type === 'set-min' || step.type === 'set-key' || step.type === 'place-key') colorClass = "border-l-[#EC4899] bg-[#EC4899]/10";
                  
                  return (
                    <div
                      key={step.id}
                      data-active={isActive}
                      className={`p-2.5 rounded border-l-[3px] text-xs font-mono transition-all duration-150 ${colorClass}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-color)]">
                          Step {idx + 1} • {step.type}
                        </span>
                        {isActive && <span className="text-[9px] font-bold text-amber-400 animate-pulse">● ACTIVE</span>}
                      </div>
                      <p className="text-[var(--text-color)] font-normal leading-snug">{step.description}</p>
                    </div>
                  );
                })
              )}
            </div>

            {showTracePill && (
              <button
                onClick={handleScrollToActiveTrace}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600/90 border border-blue-500 rounded-full px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-[0.06em] cursor-pointer z-10 shadow-lg hover:bg-blue-500 transition-colors"
              >
                ↓ Jump to current step
              </button>
            )}
          </div>
        )}

        {/* 3. STATS TAB */}
        {activeTab === 'stats' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
              Algorithm Statistics
            </h3>

            {/* 2x2 Grid of Stat Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3">
                <span className="block text-[8px] uppercase font-bold text-[var(--muted-color)] tracking-[0.06em] mb-1">Comparisons</span>
                <span className="font-mono text-xl font-bold text-blue-400">{comparisons}</span>
              </div>
              <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3">
                <span className="block text-[8px] uppercase font-bold text-[var(--muted-color)] tracking-[0.06em] mb-1">Swaps</span>
                <span className="font-mono text-xl font-bold text-blue-400">{swaps}</span>
              </div>
              <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3">
                <span className="block text-[8px] uppercase font-bold text-[var(--muted-color)] tracking-[0.06em] mb-1">Array Accesses</span>
                <span className="font-mono text-xl font-bold text-blue-400">{arrayAccesses}</span>
              </div>
              <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3">
                <span className="block text-[8px] uppercase font-bold text-[var(--muted-color)] tracking-[0.06em] mb-1">Current Pass</span>
                <span className="font-mono text-xl font-bold text-amber-400">
                  {currentStep?.pass ?? currentStep?.currentPass ?? 0} / {Math.max(1, arraySize - 1)}
                </span>
              </div>
            </div>

            {/* Sort Progress */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]">
              <div className="flex justify-between items-center text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em]">
                <span>Sort Progress</span>
                <span className="text-[var(--text-color)] font-mono font-bold">{sortedCount} / {arraySize} Sorted</span>
              </div>
              <div className="w-full bg-[var(--border-color)] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#00C896] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(sortedCount / arraySize) * 100}%` }}
                />
              </div>
            </div>

            {/* Actual vs Theoretical Table */}
            {algoMeta && (
              <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                <h4 className="text-[9px] uppercase font-bold tracking-[0.08em] text-[var(--muted-color)]">
                  This Run vs Theoretical
                </h4>
                <div className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-black/10">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] bg-[var(--input-bg)] text-[9px] text-[var(--muted-color)] font-semibold uppercase tracking-[0.06em]">
                        <th className="p-2">Metric</th>
                        <th className="p-2">Actual</th>
                        <th className="p-2">Theory</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border-color)]/30">
                        <td className="p-2 font-sans font-medium">Comparisons</td>
                        <td className="p-2 text-blue-400 font-bold">{comparisons}</td>
                        <td className="p-2 text-[var(--text-color)]">{algoMeta.avgCase}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-sans font-medium">Swaps / Writes</td>
                        <td className="p-2 text-blue-400 font-bold">{selectedAlgorithm === 'merge' || selectedAlgorithm === 'insertion' ? arrayAccesses : swaps}</td>
                        <td className="p-2 text-[var(--text-color)]">
                          {selectedAlgorithm === 'merge' ? 'O(n log n)' : selectedAlgorithm === 'insertion' ? 'O(n²)' : algoMeta.worstCase}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
