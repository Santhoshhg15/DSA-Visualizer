import type { CellState } from '../types';

interface CharCellProps {
  char: string;
  index: number;
  state?: CellState;
  showIndex?: boolean;
  size?: 'sm' | 'md';
}

const stateClasses: Record<CellState, string> = {
  default:  'bg-[var(--cell-default-bg)] border-[var(--cell-default-border)] text-[var(--cell-default-text)] shadow-sm',
  window:   'bg-[var(--cell-window-bg)] border-[var(--cell-window-border)] text-[var(--cell-window-text)] shadow-[0_0_10px_rgba(56,139,253,0.15)] scale-[1.02] border-t-2',
  active:   'bg-[var(--cell-active-bg)] border-[var(--cell-active-border)] text-[var(--cell-active-text)] shadow-[0_0_12px_rgba(88,166,255,0.2)] scale-[1.03]',
  match:    'bg-[var(--cell-match-bg)] border-[var(--cell-match-border)] text-[var(--cell-match-text)] shadow-[0_0_14px_rgba(38,166,68,0.3)] scale-[1.05] border-b-2',
  mismatch: 'bg-[var(--cell-mismatch-bg)] border-[var(--cell-mismatch-border)] text-[var(--cell-mismatch-text)] shadow-[0_0_14px_rgba(234,78,93,0.3)] scale-[1.05] border-b-2',
  found:    'bg-[var(--cell-found-bg)] border-[var(--cell-found-border)] text-[var(--cell-found-text)] font-bold shadow-[0_0_18px_rgba(245,194,66,0.4)] scale-[1.08] ring-1 ring-[var(--cell-found-border)]/30',
  path:     'bg-[var(--cell-path-bg)] border-[var(--cell-path-border)] text-[var(--cell-path-text)] shadow-[0_0_10px_rgba(163,113,247,0.2)] scale-[1.02]',
};

export function CharCell({ char, index, state = 'default', showIndex = true, size = 'md' }: CharCellProps) {
  const sz = size === 'md' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs';
  
  return (
    <div
      className={`relative flex items-center justify-center rounded-lg border font-mono font-bold transition-all duration-300 ${sz} ${stateClasses[state]}`}
    >
      {char}
      {showIndex && (
        <span className="absolute bottom-0.5 right-1.5 text-[8px] opacity-40 leading-none font-medium">
          {index}
        </span>
      )}
    </div>
  );
}
