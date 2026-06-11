import { useGraphStore } from '../stores/useGraphStore';

export function TraceLogPanel({ 
  collapsed, 
  onToggle,
  traceScrollRef,
  onScroll
}: { 
  collapsed: boolean; 
  onToggle: () => void;
  traceScrollRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}) {
  const { steps, cur, stats } = useGraphStore();

  return (
    <div className={`w-full flex flex-col bg-[var(--panel-bg)] transition-all duration-300 border-t border-[var(--border-color)] font-sans ${collapsed ? 'h-[40px]' : 'h-full min-h-0'}`}>
      <div 
        className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--panel-bg)] cursor-pointer hover:bg-[var(--input-bg)] transition-colors select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
            <span className="text-orange-500">📋</span> Execution Trace
          </h3>
          {!collapsed && steps.length > 0 && (
            <span className="text-[10px] font-mono font-medium text-[var(--text-color)] bg-[var(--input-bg)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
              Step {cur + 1}/{steps.length}
            </span>
          )}
        </div>
        <button className="text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors cursor-pointer">
          <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div 
          ref={traceScrollRef}
          onScroll={onScroll}
          className="flex-grow overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar bg-[var(--panel-bg)] min-h-[150px]"
        >
          {(!stats || steps.length === 0) ? (
            <div className="text-[13px] text-center text-[var(--muted-color)] mt-4 font-mono font-normal animate-fadeInUp">
              Run an operation or algorithm to see the trace<span className="animate-pulse">_</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {steps.slice(0, cur + 1).slice().reverse().map((step, reverseIdx) => {
                const idx = cur - reverseIdx;
                const isActive = idx === cur;
                
                let icon = "🔍";
                let typeColor = "text-[var(--text-color)]";

                // Map icons and colors by step type or content
                const desc = step.description.toLowerCase();
                if (step.type === 'set-remove-old') {
                  icon = "❌";
                  typeColor = "text-red-400/80";
                } else if (step.type === 'set-add-updated') {
                  icon = "📥";
                  typeColor = "text-emerald-500/80";
                } else if (step.type === 'set-first') {
                  icon = "👑";
                  typeColor = "text-amber-400";
                } else if (step.type === 'complete' || desc.includes('complete') || desc.includes('finished')) {
                  icon = "✅";
                  typeColor = "text-[#00C896] font-bold";
                } else if (step.type === 'found' || desc.includes('found') || desc.includes('discovered')) {
                  icon = "🎯";
                  typeColor = "text-emerald-400 font-bold";
                } else if (step.type === 'not-found' || desc.includes('skip') || desc.includes('already visited')) {
                  icon = "🔴";
                  typeColor = "text-red-400/80";
                } else if (step.type === 'add-node' || step.type === 'add-edge') {
                  icon = "📥";
                  typeColor = "text-blue-400";
                } else if (step.type === 'remove-node' || step.type === 'remove-edge') {
                  icon = "📤";
                  typeColor = "text-red-400";
                } else if (desc.includes('enqueue')) {
                  icon = "📥";
                  typeColor = "text-[#FF8C00]";
                } else if (desc.includes('dequeue')) {
                  icon = "📤";
                  typeColor = "text-[#FFB800]";
                } else if (desc.includes('relax') || desc.includes('update') || desc.includes('distance')) {
                  icon = "⚡";
                  typeColor = "text-purple-400";
                } else if (step.type === 'highlight-edge' || desc.includes('checking neighbor')) {
                  icon = "🔗";
                  typeColor = "text-[var(--muted-color)]";
                } else if (step.type === 'highlight-node') {
                  icon = "📍";
                  typeColor = "text-amber-400/95";
                }

                return (
                  <div
                    key={step.id}
                    data-active-trace={isActive}
                    data-active={isActive}
                    className={`py-1.5 px-2.5 rounded-lg border font-mono text-[12px] leading-relaxed transition-all duration-200 flex gap-2.5 items-start ${
                      isActive 
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-sm font-semibold' 
                        : 'bg-black/20 border-transparent hover:bg-black/30 font-normal'
                    }`}
                    style={isActive ? { borderLeftWidth: '3px' } : {}}
                  >
                    <span className="shrink-0">{icon}</span>
                    <div className="flex-1 flex flex-col">
                      <div className={`leading-normal ${typeColor}`}>
                        {step.description}
                      </div>
                      <span className="text-[9px] font-mono font-normal text-[var(--muted-color)] mt-0.5">
                        Step {idx + 1} • Line {step.codeLineActive}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
