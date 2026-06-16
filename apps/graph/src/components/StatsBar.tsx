import { useGraphStore } from '../stores/useGraphStore';

export function StatsBar() {
  const { stats, cur, steps } = useGraphStore();

  let statusText = 'Ready';
  let statusColor = 'text-[var(--text-color)]';
  let statusPulse = false;

  if (stats && steps.length > 0) {
    if (cur < steps.length - 1) {
      statusText = 'Running...';
      statusColor = 'text-blue-400';
      statusPulse = true;
    } else {
      const isSuccess = stats.result.toLowerCase().includes('success') || 
                        stats.result.toLowerCase().includes('found') || 
                        stats.result.toLowerCase().includes('exists') || 
                        stats.result.toLowerCase().includes('complete') || 
                        stats.result.toLowerCase().includes('computed');
                        
      const isError = stats.result.toLowerCase().includes('failed') || 
                      stats.result.toLowerCase().includes('negative cycle') || 
                      stats.result.toLowerCase().includes('not found') ||
                      stats.result.toLowerCase().includes('error');

      if (isError) {
        statusText = '✗ Error';
        statusColor = 'text-red-500';
      } else if (isSuccess) {
        statusText = '✓ Complete';
        statusColor = 'text-emerald-500';
      } else {
        // Fallback for generic completion
        statusText = '✓ Complete';
        statusColor = 'text-emerald-500';
      }
    }
  }

  return (
    <div className="w-full h-[40px] flex-shrink-0 flex border-y border-[var(--border-color)] bg-[var(--input-bg)] select-none font-sans">
      <div className="flex-1 flex flex-col items-center justify-center border-r border-[var(--border-color)] bg-[var(--panel-bg)]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-color)] mb-[2px] leading-none">Time</span>
        <span key={`time-${stats?.timeComplexity}`} className="text-[11px] font-mono text-orange-400 font-medium leading-none animate-pulse-accent">{stats ? stats.timeComplexity : '—'}</span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center border-r border-[var(--border-color)] bg-[var(--panel-bg)]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-color)] mb-[2px] leading-none">Space</span>
        <span key={`space-${stats?.spaceComplexity}`} className="text-[11px] font-mono text-purple-400 font-medium leading-none animate-pulse-accent">{stats ? stats.spaceComplexity : '—'}</span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center border-r border-[var(--border-color)] bg-[var(--panel-bg)]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-color)] mb-[2px] leading-none">Steps</span>
        <span key={`step-${cur}`} className="text-[13px] font-mono text-[var(--text-color)] font-medium leading-none animate-pulse-accent">
          {steps.length > 0 ? `${cur + 1} / ${steps.length}` : '— / —'}
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-[var(--panel-bg)]">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-color)] mb-[2px] leading-none">Status</span>
          <span key={`status-${statusText}`} className={`text-[11px] font-semibold uppercase tracking-[0.06em] leading-none ${statusColor} ${statusPulse ? 'animate-pulse' : 'animate-pulse-accent'}`}>
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
}
