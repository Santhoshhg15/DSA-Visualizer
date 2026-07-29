import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import {
  BarChart2,
  ChevronRight,
  Code2,
  Copy,
  Check,
  Download,
} from 'lucide-react';

export const RightPanel: React.FC = () => {
  const { n, problem, steps, cur, reset, selectedProblemId } = useDPStore();
  const [activeTab, setActiveTab] = useState<'code' | 'trace' | 'stats'>('code');
  const [copied, setCopied] = useState(false);

  const currentStep = steps[cur] || steps[0];
  const activeLine = currentStep ? currentStep.codeLineActive : 0;
  const isDone = currentStep?.type === 'done';

  const traceEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll trace log to bottom on step change or tab selection
  useEffect(() => {
    if (activeTab === 'trace') {
      traceEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cur, activeTab]);

  const handleClear = () => {
    reset();
    setActiveTab('code');
  };

  const handleCopy = async () => {
    const javaSource = problem.javaCode.join('\n');
    await navigator.clipboard.writeText(javaSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const javaSource = problem.javaCode.join('\n');
    const blob = new Blob([javaSource], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ClimbingStairs.java';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalSteps = steps.length;
  const finalAnswer = isDone ? currentStep.dpArray[n] : null;

  return (
    <aside
      style={{
        width: '280px',
        background: 'var(--bg-container)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}
    >
      {/* 1. Header Row */}
      <div
        style={{
          height: '48px',
          padding: '0 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BarChart2 className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-[11px] font-semibold tracking-[0.1em] text-[var(--text-muted)] uppercase">
            ANALYSIS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={handleClear}
            className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 px-2 py-1 rounded-md transition-all cursor-pointer"
          >
            CLEAR
          </button>
          <button
            onClick={handleClear}
            className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 p-1 rounded-md transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Tab Bar (3 Tabs: CODE, TRACE, STATS) */}
      <div
        style={{
          height: '44px',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: '4px',
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
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textTransform: 'uppercase',
                ...(isActive
                  ? {
                      background: 'var(--accent-indigo-bg)',
                      color: 'var(--accent-indigo)',
                    }
                  : {
                      background: 'transparent',
                      color: 'var(--text-muted)',
                    }),
              }}
              className={!isActive ? 'hover:bg-white/5 hover:text-[var(--text-secondary)]' : ''}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Source Code Subheader Row (Visible ONLY on CODE tab) */}
      {activeTab === 'code' && (
        <div
          style={{
            height: '36px',
            padding: '0 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Code2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[11px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase">
            SOURCE CODE
          </span>

          <div className="ml-auto flex items-center gap-1">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copy source code"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                border: copied ? '1px solid var(--accent-green)' : '1px solid var(--border)',
                background: 'transparent',
                color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-white/10 hover:text-[var(--text-primary)]"
            >
              {copied ? <Check className="w-3 h-3 text-[var(--accent-green)]" /> : <Copy className="w-3 h-3" />}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              title="Download .java file"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-white/10 hover:text-[var(--text-primary)]"
            >
              <Download className="w-3 h-3" />
            </button>

            {/* Java Badge */}
            <span className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-full border border-[var(--border)] ml-1">
              Java 21
            </span>
          </div>
        </div>
      )}

      {/* 4. Tab Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'code' && (
          <div className="py-3 font-mono text-[13px] leading-relaxed flex-1">
            {problem.javaCode.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isActive = lineNum === activeLine;

              return (
                <div
                  key={lineNum}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '4px 16px',
                    transition: 'all 0.15s ease',
                    background: isActive ? 'var(--accent-indigo-bg)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent-indigo-dim)' : '3px solid transparent',
                    color: isActive ? 'var(--cell-active-text)' : 'var(--text-muted)',
                    fontWeight: isActive ? '600' : '400',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      flexShrink: 0,
                      textAlign: 'right',
                      fontSize: '11px',
                      userSelect: 'none',
                      color: 'var(--text-muted)',
                      opacity: isActive ? 1 : 0.5,
                      fontWeight: isActive ? '700' : '400',
                    }}
                  >
                    {lineNum}
                  </span>
                  <pre className="whitespace-pre font-mono text-[13px]">{lineText}</pre>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'trace' && (
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '12px',
            }}
          >
            {steps.slice(0, cur + 1).map((s, idx) => {
              const isCurrent = idx === cur;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease',
                    ...(isCurrent
                      ? {
                          background: 'var(--accent-indigo-bg)',
                          border: '1px solid var(--accent-indigo-bg)',
                        }
                      : {
                          background: 'transparent',
                          border: '1px solid transparent',
                        }),
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'JetBrains Mono, monospace',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: isCurrent ? 'var(--accent-indigo-bg)' : 'rgba(255, 255, 255, 0.05)',
                      color: isCurrent ? 'var(--cell-active-text)' : 'var(--text-muted)',
                      fontWeight: 600,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '12px',
                      color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {s.msg}
                  </span>
                </div>
              );
            })}
            <div ref={traceEndRef} />
          </div>
        )}

        {activeTab === 'stats' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Card 1 — STEPS TAKEN */}
            <div
              style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <span className="text-[10px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase block mb-1">
                STEPS TAKEN
              </span>
              <div className="text-[24px] font-semibold text-[var(--text-primary)] font-mono">
                {cur + 1} / {totalSteps}
              </div>
            </div>

            {/* Card 2 — ARRAY SIZE */}
            <div
              style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <span className="text-[10px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase block mb-1">
                ARRAY SIZE
              </span>
              <div className="text-[24px] font-semibold text-[var(--text-primary)] font-mono">
                {n + 1} cells
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Recurrence Formula Strip (Pinned to Bottom) */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 16px',
          background: 'var(--bg-container)',
          flexShrink: 0,
        }}
      >
        <div className="text-[10px] font-medium tracking-[0.1em] text-[var(--text-muted)] uppercase mb-1.5">
          RECURRENCE FORMULA
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--cell-active-text)',
            marginBottom: '4px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {problem.recurrence}
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {problem.baseCases}
        </div>

        {/* Answer Badge on DONE step */}
        {isDone && finalAnswer !== null && (
          <div
            style={{
              marginTop: '8px',
              padding: '6px 10px',
              background: 'var(--accent-green-bg)',
              border: '1px solid var(--accent-green-bg)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: 'var(--accent-green)',
            }}
            className="flex items-center gap-1.5 font-semibold"
          >
            <span>
              {selectedProblemId === 'house-robber'
                ? `dp[${n - 1}] = $${finalAnswer}${
                    currentStep?.robbedIndices
                      ? `. Robbed: [${currentStep.robbedIndices.join(', ')}]`
                      : ''
                  }`
                : `dp[${n}] = ${finalAnswer} ways`}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
