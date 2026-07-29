import React, { useState } from 'react';
import { useDPStore } from '../store';
import { Play, Zap, Circle, ChevronLeft, ChevronRight } from 'lucide-react';

export const InputPanel: React.FC = () => {
  const { n, setN, run, problem } = useDPStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const presets = [5, 8, 10];

  if (isCollapsed) {
    return (
      <aside
        style={{
          width: '40px',
          transition: 'all 0.25s ease',
          background: 'var(--bg-container)',
          borderRight: '1px solid var(--border)',
          padding: '12px 6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          title="Expand Panel"
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
            transition: 'all 0.15s ease',
          }}
          className="hover:bg-white/10 hover:text-[var(--text-primary)]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: '230px',
        transition: 'all 0.25s ease',
        background: 'var(--bg-container)',
        borderRight: '1px solid var(--border)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflowY: 'auto',
        flexShrink: 0,
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}
    >
      {/* Top Header Row with Collapse Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase">
          INPUT
        </span>
        <button
          onClick={() => setIsCollapsed(true)}
          title="Collapse Panel"
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
            transition: 'all 0.15s ease',
          }}
          className="hover:bg-white/10 hover:text-[var(--text-primary)]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Input Section */}
      <div>
        <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-3">
          Staircase Height
        </h2>

        <div className="space-y-2 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase block mb-1">
            Stairs (n)
          </span>

          <div className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--text-primary)] font-mono leading-none mb-2">
            {n}
          </div>

          <input
            type="range"
            min={2}
            max={15}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            style={{ accentColor: 'var(--accent-blue)' }}
            className="w-full h-1.5 rounded-lg bg-[var(--bg-container)] appearance-none cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>n=2</span>
            <span>n=15</span>
          </div>
        </div>
      </div>

      {/* Presets Section */}
      <div className="space-y-2">
        <span className="text-[11px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase block">
          PRESETS
        </span>
        <div className="flex items-center gap-1.5">
          {presets.map((val) => {
            const isActive = n === val;
            return (
              <button
                key={val}
                onClick={() => setN(val)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                  ...(isActive
                    ? {
                        background: 'var(--cell-active-bg)',
                        border: '1px solid var(--cell-active-border)',
                        color: 'var(--cell-active-text)',
                      }
                    : {
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }),
                }}
                className={!isActive ? 'hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]' : ''}
              >
                n={val}
              </button>
            );
          })}
        </div>
      </div>

      {/* Run Visualizer Button */}
      <button
        onClick={run}
        style={{
          width: '100%',
          padding: '10px 0',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          borderRadius: '9999px',
          border: 'none',
          background: 'var(--text-color)',
          color: 'var(--bg-color)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'opacity 0.2s ease',
        }}
        className="hover:opacity-85 active:scale-[0.98]"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Run Visualizer</span>
      </button>

      {/* Complexity Section */}
      <div className="pt-4 border-t border-[var(--border)] space-y-2 mt-auto">
        <span className="text-[11px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase block">
          COMPLEXITY
        </span>
        <div className="space-y-2 text-[12px]">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Zap className="w-3.5 h-3.5 text-[var(--accent-blue)] shrink-0" />
            <span>Time:</span>
            <strong className="font-mono text-[12px] text-[var(--text-primary)]">{problem.timeComplexity}</strong>
          </div>
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Circle className="w-3 h-3 text-[var(--accent-blue)] shrink-0" />
            <span>Space:</span>
            <strong className="font-mono text-[12px] text-[var(--text-primary)]">{problem.spaceComplexity}</strong>
          </div>
        </div>
      </div>
    </aside>
  );
};
