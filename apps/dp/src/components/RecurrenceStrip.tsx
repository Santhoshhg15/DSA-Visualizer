import React from 'react';
import { useDPStore } from '../store';
import { Calculator } from 'lucide-react';

export const RecurrenceStrip: React.FC = () => {
  const { problem } = useDPStore();

  return (
    <div
      style={{
        background: 'var(--bg-container)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] text-[var(--text-muted)] uppercase">
        <Calculator className="w-3 h-3 text-[var(--accent-indigo)]" />
        <span>RECURRENCE FORMULA</span>
      </div>

      <div className="font-mono text-[14px] font-medium text-[var(--accent-indigo)] px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
        {problem.recurrence}
      </div>

      <div className="font-mono text-[12px] text-[var(--text-secondary)] px-1">
        {problem.baseCases}
      </div>
    </div>
  );
};
