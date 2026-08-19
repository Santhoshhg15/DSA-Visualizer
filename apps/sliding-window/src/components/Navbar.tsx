import React from 'react';
import { useSWStore } from '../store';
import { Layers, ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, problem } = useSWStore();

  return (
    <header className="h-[60px] px-6 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl flex items-center justify-between z-50 shrink-0">
      {/* Left: Brand & Portal Link */}
      <div className="flex items-center gap-6">
        <a
          href="/"
          className="flex items-center gap-2 text-[13.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Portal</span>
        </a>

        <div className="h-4 w-[1px] bg-[var(--border)]" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-indigo-bg)] border border-[var(--accent-indigo-bg)] flex items-center justify-center text-[var(--accent-indigo)]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-[var(--text-primary)] leading-none tracking-tight">
              Sliding Window Visualizer
            </h1>
            <span className="text-[11px] font-medium text-[var(--text-muted)] tracking-wide uppercase">
              DSA Suite
            </span>
          </div>
        </div>
      </div>

      {/* Center: Problem Active Badge */}
      <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-container)] text-[13px] font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[var(--accent-indigo)]" />
        <span className="text-[var(--text-muted)]">Problem:</span>
        <span className="text-[var(--text-primary)] font-semibold">{problem.name}</span>
        <span
          style={{
            background: 'var(--accent-indigo-bg)',
            border: '1px solid var(--accent-indigo-bg)',
            color: 'var(--accent-indigo)',
            borderRadius: '9999px',
            fontSize: '11px',
            padding: '2px 10px',
          }}
          className="font-mono font-medium uppercase tracking-wider ml-1"
        >
          {problem.badge}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg-container)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
};
