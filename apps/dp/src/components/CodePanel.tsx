import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { Code2, ListOrdered, Copy, Check, Download } from 'lucide-react';

export const CodePanel: React.FC = () => {
  const { problem, steps, cur } = useDPStore();
  const [activeTab, setActiveTab] = useState<'code' | 'trace'>('code');
  const [copied, setCopied] = useState(false);

  const currentStep = steps[cur] || steps[0];
  const activeLine = currentStep
    ? currentStep.codeLineActiveJava || currentStep.codeLineActive || 0
    : 0;

  const traceEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll trace log to bottom on step changes or tab switch
  useEffect(() => {
    if (activeTab === 'trace') {
      traceEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cur, activeTab]);

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
    a.download = `${problem.name.replace(/\s+/g, '')}.java`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col border border-[var(--border)] bg-[var(--bg-container)] rounded-[12px] overflow-hidden shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-container)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeTab === 'code' ? (
            <Code2 className="w-4 h-4 text-[var(--accent-indigo)]" />
          ) : (
            <ListOrdered className="w-4 h-4 text-[var(--accent-indigo)]" />
          )}
          <span className="text-[12px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
            {activeTab === 'code' ? 'JAVA TRACE SOURCE' : 'EXECUTION LOG TRACE'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy source code"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: copied ? '1px solid var(--accent-green)' : '1px solid var(--border)',
              background: 'transparent',
              color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              transition: 'all 0.15s ease',
            }}
            className="hover:bg-white/10 hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[var(--accent-green)]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            title="Download .java file"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              transition: 'all 0.15s ease',
            }}
            className="hover:bg-white/10 hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Badge */}
          <span className="text-[11px] font-mono text-[var(--text-muted)] opacity-60 ml-1">
            {activeTab === 'code' ? 'Java 21' : `Step ${cur + 1}/${steps.length}`}
          </span>
        </div>
      </div>

      {/* Tab Switcher Bar */}
      <div className="px-3 pt-3">
        <div
          style={{
            display: 'flex',
            gap: '2px',
            padding: '4px',
            background: 'var(--border-color)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            marginBottom: '8px',
          }}
        >
          <button
            onClick={() => setActiveTab('code')}
            style={{
              flex: 1,
              padding: '6px 0',
              border: 'none',
              borderRadius: '7px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              ...(activeTab === 'code'
                ? {
                    background: 'var(--bg-card-hover)',
                    color: 'var(--text-primary)',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.3)',
                  }
                : {
                    background: 'transparent',
                    color: 'var(--text-muted)',
                  }),
            }}
          >
            CODE
          </button>
          <button
            onClick={() => setActiveTab('trace')}
            style={{
              flex: 1,
              padding: '6px 0',
              border: 'none',
              borderRadius: '7px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              ...(activeTab === 'trace'
                ? {
                    background: 'var(--bg-card-hover)',
                    color: 'var(--text-primary)',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.3)',
                  }
                : {
                    background: 'transparent',
                    color: 'var(--text-muted)',
                  }),
            }}
          >
            TRACE
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      {activeTab === 'code' ? (
        /* CODE TAB: Java Source Code */
        <div className="px-3 pb-3 font-mono text-[13px] leading-relaxed overflow-y-auto flex-1 bg-[var(--bg-container)]">
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
                  padding: '4px 10px',
                  paddingLeft: '8px',
                  marginLeft: '-8px',
                  transition: 'all 0.15s ease',
                  background: isActive ? 'var(--accent-amber-bg)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-amber)' : '3px solid transparent',
                  color: 'var(--text-color)',
                  fontWeight: isActive ? 500 : 400,
                  opacity: isActive ? 1 : 0.85,
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
      ) : (
        /* TRACE TAB: Execution Trace Log */
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '0 12px 12px 12px',
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
                        background: 'var(--code-active-bg)',
                        border: '1px solid var(--code-active-border)',
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
                    background: isCurrent ? 'var(--accent-indigo-bg)' : 'var(--border-color)',
                    color: isCurrent ? 'var(--accent-indigo)' : 'var(--text-muted)',
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
    </div>
  );
};
