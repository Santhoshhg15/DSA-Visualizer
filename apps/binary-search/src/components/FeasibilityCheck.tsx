import React from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';

interface FeasibilityCheckProps {
  mid: number | null;
  piles: number[];
  h: number;
  hoursPerPile: number[] | null;
  totalHours: number | null;
  feasible: boolean | null;
}

export const FeasibilityCheck: React.FC<FeasibilityCheckProps> = ({
  mid,
  h,
  hoursPerPile,
  totalHours,
  feasible,
}) => {
  if (mid === null || hoursPerPile === null || totalHours === null || feasible === null) {
    return null;
  }

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-[18px] shadow-sm animate-fadeInUp font-sans">
      {/* 1. HEADER ROW WITH OUTLINE ICON & VERDICT BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-2.5 mb-3 gap-2">
        <div>
          <h4 className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 font-sans">
            <Search className="w-3.5 h-3.5 text-[var(--accent-indigo)] shrink-0" />
            <span>
              Feasibility Check: speed = <span className="text-[var(--accent-indigo)] font-mono font-bold">{mid}</span> bananas/hr
            </span>
          </h4>
          <p className="text-[11px] text-[var(--muted-color)] font-mono mt-0.5">
            Computing total hours: <code>hours = sum(ceil(pile / speed))</code>
          </p>
        </div>

        {/* Verdict Badge */}
        <div>
          {feasible ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-green-bg)] text-[var(--accent-green)] border border-[var(--accent-green)]/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>FEASIBLE — try slower (high = {mid})</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-coral-bg)] text-[var(--accent-coral)] border border-[var(--accent-coral)]/20">
              <XCircle className="w-3.5 h-3.5" />
              <span>TOO SLOW — need faster (low = {mid + 1})</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. SUMMARY ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3 font-mono pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[var(--muted-color)] font-sans uppercase font-bold text-[10px]">TOTAL TIME:</span>
          <span className="font-bold text-[var(--text-primary)] text-sm">{totalHours} hours</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[var(--muted-color)] font-sans uppercase font-bold text-[10px]">HOURS LIMIT (H):</span>
          <span className="font-bold text-[var(--text-primary)] text-sm">{h} hours</span>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-sm">
          <span className="text-[var(--muted-color)] font-sans uppercase text-[10px]">VERDICT:</span>
          <span className={`flex items-center gap-1 ${feasible ? 'text-[var(--accent-green)]' : 'text-[var(--accent-coral)]'}`}>
            {totalHours} {feasible ? '≤' : '>'} {h} → {feasible ? 'SUCCESS ✓' : 'FAILED ✕'}
          </span>
        </div>
      </div>
    </div>
  );
};
