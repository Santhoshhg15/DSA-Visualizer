import { useStore } from '../store';

export function BSTHistoryTimeline() {
  const { 
    bstHistory, 
    bstHistoryIndex, 
    undoBST, 
    redoBST, 
    jumpToBSTHistory 
  } = useStore();

  const isUndoDisabled = bstHistoryIndex === 0;
  const isRedoDisabled = bstHistoryIndex === bstHistory.length - 1;

  const btnCls = "px-3 py-1.5 text-[10px] font-bold rounded-lg border border-[var(--border-color)] bg-[var(--pill-btn-bg)] hover:bg-[var(--pill-btn-hover)] text-[var(--text-color)] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-1.5 shadow-sm";

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl backdrop-blur-xl mb-4 space-y-4 hover:border-[var(--border-hover)] transition-all">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.12em]">
          ⏱ Operation History
        </span>
        <div className="flex gap-2">
          <button 
            onClick={undoBST} 
            disabled={isUndoDisabled} 
            className={btnCls}
            title="Undo last operation"
          >
            ◀ Undo
          </button>
          <button 
            onClick={redoBST} 
            disabled={isRedoDisabled} 
            className={btnCls}
            title="Redo operation"
          >
            Redo ▶
          </button>
        </div>
      </div>

      {/* Timeline entries list */}
      <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {bstHistory.map((item, idx) => {
          const isActive = idx === bstHistoryIndex;
          
          return (
            <div
              key={`${item.label}-${idx}`}
              onClick={() => jumpToBSTHistory(idx)}
              className={`group flex items-center gap-3 px-3 py-2 border rounded-xl cursor-pointer transition-all duration-200 active:scale-98
                ${isActive 
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                  : 'bg-[#0c091d]/30 border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--pill-btn-hover)]'
                }`}
            >
              {/* Status bullet */}
              <span className={`w-2 h-2 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-emerald-500 scale-110 shadow-[0_0_6px_#10b981]' 
                  : 'bg-indigo-500/40 group-hover:bg-indigo-400'
                }`} 
              />
              
              {/* Action index */}
              <span className="font-mono text-[9px] text-[var(--muted-color)] bg-[#0b0d12]/30 px-1.5 py-0.5 rounded border border-[var(--border-color)]/20">
                {idx === 0 ? 'init' : `#${idx}`}
              </span>

              {/* Action label */}
              <span className={`text-[11px] font-semibold flex-grow truncate
                ${isActive ? 'text-emerald-400 font-bold' : 'text-[var(--text-color)] opacity-75'}`}>
                {item.label}
              </span>

              {/* Active Indicator tag */}
              {isActive && (
                <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.2 rounded-md">
                  Active
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
