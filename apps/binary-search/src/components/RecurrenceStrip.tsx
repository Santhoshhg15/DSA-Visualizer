import React from 'react';

export const RecurrenceStrip: React.FC = () => {
  return (
    <div className="w-full bg-[var(--panel-bg)] border-b border-[var(--border-color)] py-2.5 px-6 flex items-center justify-between overflow-x-auto no-scrollbar gap-4 text-xs font-semibold select-none shadow-sm">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[var(--accent-indigo)] text-sm">🎯</span>
        <span className="text-[var(--muted-color)] uppercase tracking-wider text-[10px] font-bold">SEARCH STRATEGY</span>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-2 bg-[var(--input-bg)] px-3 py-1 rounded border border-[var(--border-color)] font-mono">
          <span className="text-[var(--text-muted)]">if</span>
          <span className="text-[var(--accent-green)]">canFinish(mid)</span>
          <span className="text-[var(--text-color)]">:</span>
          <span className="text-[var(--accent-blue)]">high = mid</span>
          <span className="text-[var(--muted-color)] font-sans italic text-[11px] ml-1">(try slower)</span>
        </div>

        <div className="flex items-center gap-2 bg-[var(--input-bg)] px-3 py-1 rounded border border-[var(--border-color)] font-mono">
          <span className="text-[var(--text-muted)]">else</span>
          <span className="text-[var(--text-color)]">:</span>
          <span className="text-[var(--accent-coral)]">low = mid + 1</span>
          <span className="text-[var(--muted-color)] font-sans italic text-[11px] ml-1">(need faster)</span>
        </div>

        <div className="flex items-center gap-2 bg-[var(--input-bg)] px-3 py-1 rounded border border-[var(--border-color)] font-mono">
          <span className="text-[var(--text-muted)]">Range:</span>
          <span className="text-[var(--accent-indigo)]">[1, max(piles)]</span>
        </div>
      </div>
    </div>
  );
};
