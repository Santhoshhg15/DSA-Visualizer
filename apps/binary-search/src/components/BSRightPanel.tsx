import React, { useState, useEffect, useRef } from 'react';
import { useBSStore } from '../store';
import { JavaCodeLine } from '../utils/javaSyntaxHighlight';
import { Copy, Download, Award, Clock, HelpCircle, Layers } from 'lucide-react';

interface BSRightPanelProps {
  onCollapse: () => void;
}

export const BSRightPanel: React.FC<BSRightPanelProps> = ({ onCollapse }) => {
  const {
    problem,
    steps,
    cur,
    playing,
    kokoPiles,
    reset,
  } = useBSStore();

  const [activeTab, setActiveTab] = useState<'code' | 'trace' | 'stats'>('code');
  const [isPseudoCode, setIsPseudoCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const codeScrollRef = useRef<HTMLDivElement>(null);
  const traceScrollRef = useRef<HTMLDivElement>(null);

  const currentStep = cur >= 0 && cur < steps.length ? steps[cur] : null;
  const activeLine = isPseudoCode
    ? (currentStep?.codeLineActivePseudo ?? 0)
    : (currentStep?.codeLineActiveJava ?? 0);
  const isDone = currentStep?.type === 'done';

  // Auto-switch to trace tab when play is clicked
  useEffect(() => {
    if (playing) {
      setActiveTab('trace');
    }
  }, [playing]);

  // Scroll active code line into view
  useEffect(() => {
    if (activeTab === 'code' && codeScrollRef.current) {
      const container = codeScrollRef.current;
      const activeLineEl = container.querySelector('[data-active-line="true"]') as HTMLElement;
      if (activeLineEl) {
        const targetScrollTop =
          activeLineEl.offsetTop - container.clientHeight / 2 + activeLineEl.offsetHeight / 2;
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [activeLine, activeTab]);

  // Scroll active trace step into view
  useEffect(() => {
    if (activeTab === 'trace' && traceScrollRef.current) {
      const container = traceScrollRef.current;
      const activeEntry = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        const targetScrollTop =
          activeEntry.offsetTop - container.clientHeight / 2 + activeEntry.offsetHeight / 2;
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [cur, activeTab]);

  const codeLines = isPseudoCode ? problem.pseudoCode : problem.javaCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeLines.join('\n'));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleDownload = () => {
    const filename = isPseudoCode
      ? `${problem.name.replace(/\s+/g, '')}_Pseudocode.txt`
      : `${problem.name.replace(/\s+/g, '')}.java`;
    const header = [
      '// ============================================',
      `// ${problem.name} (${isPseudoCode ? 'Pseudocode' : 'Java Implementation'})`,
      '// DSA Visualizer Suite — Generated Code',
      '// ============================================',
      `// Time Complexity:  ${problem.timeComplexity}`,
      `// Space Complexity: ${problem.spaceComplexity}`,
      '// ============================================',
      '',
      '',
    ].join('\n');
    const blob = new Blob([header + codeLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Stats calculation
  const totalIterations = steps.filter((s) => s.type === 'narrow').length;
  const initialRangeSize = kokoPiles.length > 0 ? Math.max(...kokoPiles) : 0;
  const finalAnswer = isDone && currentStep ? currentStep.low : null;

  // Calculate hours at final answer speed
  let hoursAtAnswer: number | null = null;
  if (finalAnswer !== null && kokoPiles.length > 0) {
    hoursAtAnswer = kokoPiles.reduce((sum, p) => sum + Math.ceil(p / finalAnswer), 0);
  }

  // Progressive trace log: only show steps from 0 up to current step index (cur + 1)
  const visibleSteps = steps.slice(0, Math.min(steps.length, cur + 1));

  return (
    <div className="w-full h-full flex flex-col font-sans select-none bg-[var(--panel-bg)] overflow-hidden">
      {/* 1. ANALYSIS HEADER BAR */}
      <div className="h-[44px] border-b border-[var(--border-color)] bg-[var(--panel-bg)] px-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 select-none">
          <span className="text-purple-500 text-sm">🔬</span>
          <h2 className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--muted-color)] font-sans">
            Analysis
          </h2>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded-lg border border-[var(--border-color)] text-[var(--muted-color)] bg-transparent hover:border-red-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear
          </button>

          <button
            onClick={onCollapse}
            className="w-[26px] h-[26px] flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
            title="Collapse panel"
          >
            <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTROLS */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '3px',
            gap: '3px',
          }}
        >
          {(['code', 'trace', 'stats'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase' as const,
                  transition: 'all 0.18s ease',
                  ...(isActive
                    ? { background: 'var(--accent-indigo-dim)', color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }
                    : { background: 'transparent', color: 'var(--muted-color)' }),
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE TAB CONTENT AREA */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
        {/* CODE TAB */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Code Options Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                borderBottom: '1px solid var(--border-color)',
                flexShrink: 0,
                background: 'rgba(255,255,255,0.015)',
                gap: '8px',
              }}
            >
              {/* Java / Pseudo Toggle — clear pill with proper padding */}
              <div
                style={{
                  display: 'flex',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '2px',
                  gap: '2px',
                }}
              >
                {[{ label: 'Java', pseudo: false }, { label: 'Pseudo', pseudo: true }].map(({ label, pseudo }) => {
                  const active = isPseudoCode === pseudo;
                  return (
                    <button
                      key={label}
                      onClick={() => setIsPseudoCode(pseudo)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        transition: 'all 0.15s ease',
                        ...(active
                          ? { background: 'var(--accent-indigo-dim)', color: '#fff' }
                          : { background: 'transparent', color: 'var(--muted-color)' }),
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Utility Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handleCopy}
                  title="Copy Code"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: copySuccess ? 'rgba(74,222,128,0.12)' : 'var(--input-bg)',
                    color: copySuccess ? 'var(--accent-green)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Copy style={{ width: '11px', height: '11px' }} />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  title="Download Code"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Download style={{ width: '11px', height: '11px' }} />
                  Download
                </button>
              </div>
            </div>

            {/* Code Lines Display */}
            <div
              ref={codeScrollRef}
              className="flex-1 overflow-y-auto no-scrollbar p-3 font-mono text-xs leading-relaxed bg-[var(--bg-primary)]/10"
            >
              {codeLines.length > 0 ? (
                codeLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isHighlighted = activeLine === lineNum;
                  return (
                    <div
                      key={idx}
                      data-active-line={isHighlighted ? 'true' : 'false'}
                      className={`flex select-text py-0.5 border-l-2 pl-3 ${
                        isHighlighted
                          ? 'bg-[var(--code-active-bg)] border-[var(--accent-indigo)]'
                          : 'border-transparent hover:bg-[var(--bg-card-hover)]/40'
                      }`}
                    >
                      <span className="w-6 shrink-0 text-right pr-3 select-none text-[var(--muted-color)]/60 font-mono text-[10px]">
                        {lineNum}
                      </span>
                      <pre className="flex-1 whitespace-pre-wrap break-all font-mono">
                        <JavaCodeLine line={line} />
                      </pre>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-center p-6 text-[var(--muted-color)] italic font-sans">
                  No implementation code available.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TRACE TAB (Progressive slice: only shows steps from 0 to cur) */}
        {activeTab === 'trace' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div
              ref={traceScrollRef}
              className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2 bg-[var(--bg-primary)]/10"
            >
              {visibleSteps.map((step, idx) => {
                const isSelected = cur === idx;
                const isCompleted = idx < cur;
                return (
                  <div
                    key={idx}
                    data-active={isSelected ? 'true' : 'false'}
                    className={`p-3 rounded-lg border flex flex-col gap-1 transition-all ${
                      isSelected
                        ? 'bg-[var(--accent-indigo-bg)] border-[var(--accent-indigo)] shadow-sm'
                        : isCompleted
                        ? 'bg-[var(--bg-card)]/40 border-[var(--border-color)] opacity-70'
                        : 'bg-[var(--bg-card)]/10 border-[var(--border-color)]/40 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--muted-color)]">
                      <span className="font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--input-bg)] border border-[var(--border-color)]">
                        Step {idx + 1} ({step.type})
                      </span>
                      {isSelected && (
                        <span className="text-[var(--accent-indigo)] font-bold text-[9px] uppercase tracking-wider animate-pulse font-sans px-2 py-0.5 rounded-full bg-[var(--accent-indigo-bg)] border border-[var(--accent-indigo)]/30">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] font-mono leading-relaxed text-[var(--text-color)] mt-1">
                      {step.msg}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (() => {
          // Phase counts for bar chart
          const phaseCounts = {
            init:   steps.filter(s => s.type === 'init').length,
            check:  steps.filter(s => s.type === 'check').length,
            narrow: steps.filter(s => s.type === 'narrow').length,
            done:   steps.filter(s => s.type === 'done').length,
          };
          const maxPhaseCount = Math.max(...Object.values(phaseCounts), 1);
          const bruteForceOps = kokoPiles.length > 0 ? initialRangeSize * kokoPiles.length : 0;
          const binaryOps = kokoPiles.length > 0 ? Math.ceil(Math.log2(initialRangeSize + 1)) * kokoPiles.length : 0;
          const speedup = bruteForceOps > 0 ? (bruteForceOps / Math.max(binaryOps, 1)).toFixed(1) : '—';

          const phaseConfig = [
            { key: 'init',   label: 'Init',   color: 'var(--accent-blue)',   bg: 'var(--accent-blue-bg)' },
            { key: 'check',  label: 'Check',  color: 'var(--accent-indigo)', bg: 'var(--accent-indigo-bg)' },
            { key: 'narrow', label: 'Narrow', color: 'var(--accent-coral)',  bg: 'var(--accent-coral-bg)' },
            { key: 'done',   label: 'Done',   color: 'var(--accent-green)',  bg: 'var(--accent-green-bg)' },
          ] as const;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px 0' }}>

              {/* ── ANSWER HIGHLIGHT CARD ── */}
              {finalAnswer !== null ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))',
                  border: '1.5px solid rgba(74,222,128,0.35)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif' }}>
                    ✓ Answer Found
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>
                      {finalAnswer}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>bananas/hr</span>
                  </div>
                  {hoursAtAnswer !== null && (
                    <span style={{ fontSize: '11px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
                      Uses {hoursAtAnswer}h of {steps[0]?.h}h limit
                    </span>
                  )}
                </div>
              ) : (
                <div style={{
                  background: 'var(--input-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'center',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Answer will appear once the algorithm completes
                </div>
              )}

              {/* ── PHASE BREAKDOWN BAR CHART ── */}
              <div style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '14px 16px',
              }}>
                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                  Phase Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {phaseConfig.map(({ key, label, color, bg }) => {
                    const count = phaseCounts[key];
                    const pct = (count / maxPhaseCount) * 100;
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color, fontFamily: 'JetBrains Mono, monospace', width: '44px', flexShrink: 0 }}>
                          {label}
                        </span>
                        <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: color,
                            borderRadius: '9999px',
                            transition: 'width 0.4s ease',
                            opacity: 0.85,
                          }} />
                        </div>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, color, width: '18px', textAlign: 'right', flexShrink: 0 }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total steps: <strong style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{steps.length}</strong></span>
                  <span>Iterations: <strong style={{ color: 'var(--accent-indigo)', fontFamily: 'JetBrains Mono, monospace' }}>{totalIterations}</strong></span>
                </div>
              </div>

              {/* ── EFFICIENCY vs BRUTE FORCE ── */}
              <div style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '14px 16px',
              }}>
                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                  Efficiency vs Brute Force
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Binary Search', complexity: 'O(N log M)', ops: `~${binaryOps} ops`, color: 'var(--accent-green)', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)' },
                    { label: 'Brute Force',   complexity: 'O(N · M)',  ops: `~${bruteForceOps} ops`, color: 'var(--accent-coral)', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
                  ].map(({ label, complexity, ops, color, bg, border }) => (
                    <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color, fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 800, color, lineHeight: 1, marginBottom: '4px' }}>{complexity}</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted-color)', fontFamily: 'JetBrains Mono, monospace' }}>{ops}</div>
                    </div>
                  ))}
                </div>
                {speedup !== '—' && (
                  <div style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span style={{ fontSize: '14px' }}>⚡</span>
                    <span style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)' }}>
                      Binary search is <strong style={{ color: 'var(--accent-indigo)', fontFamily: 'JetBrains Mono, monospace' }}>{speedup}×</strong> faster on these inputs
                    </span>
                  </div>
                )}
              </div>

              {/* ── SEARCH SPACE INFO ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}>
                {[
                  { label: 'Search Range', value: `[1, ${initialRangeSize}]`, color: 'var(--accent-blue)' },
                  { label: 'Pile Count', value: `${kokoPiles.length} piles`, color: 'var(--accent-indigo)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))}
              </div>

            </div>
          );
        })()}
      </div>

      {/* 4. PINNED SEARCH STRATEGY PANEL */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '12px 16px',
          background: 'var(--panel-bg)',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        <div className="text-[10px] font-bold tracking-[0.1em] text-[var(--muted-color)] uppercase mb-1.5 font-sans">
          SEARCH STRATEGY
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--cell-active-text)',
            marginBottom: '4px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          if canFinish(mid): high = mid <span className="text-[var(--muted-color)] italic font-sans">(try slower)</span>
          <br />
          else: low = mid + 1 <span className="text-[var(--muted-color)] italic font-sans">(need faster)</span>
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'var(--muted-color)',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          Range: [1, max(piles)]
        </div>
      </div>
    </div>
  );
};
