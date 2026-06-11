import { useGraphStore } from '../stores/useGraphStore';

export function StatsPanel() {
  const { stats, nodes } = useGraphStore();

  if (!stats) return null;

  return (
    <div className="absolute top-4 right-4 z-10 w-64 bg-[var(--panel-bg)]/90 backdrop-blur-md border border-[var(--border-color)] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] p-4 transition-all animate-fade-in">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-color)] mb-3 border-b border-[var(--border-color)] pb-2 flex items-center justify-between font-sans">
        <span>📊 Analysis</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{stats.operation}</span>
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-[var(--muted-color)] font-sans">Time Complexity</span>
          <span className="font-mono text-[11px] font-medium text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">{stats.timeComplexity}</span>
        </div>
        
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-[var(--muted-color)] font-sans">Space Complexity</span>
          <span className="font-mono text-[11px] font-medium text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">{stats.spaceComplexity}</span>
        </div>

        <div className="flex justify-between items-center text-[13px]">
          <span className="text-[var(--muted-color)] font-sans">Steps Taken</span>
          <span className="font-mono text-[13px] font-medium text-blue-400">{stats.stepsTaken}</span>
        </div>

        {stats.extra && stats.extra.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-[13px]">
            <span className="text-[var(--muted-color)] font-sans">{item.label}</span>
            <span className="font-mono text-[13px] font-medium text-pink-400">{item.value}</span>
          </div>
        ))}

        <div className="flex justify-between items-center text-[13px] pt-2 border-t border-[var(--border-color)]">
          <span className="text-[var(--muted-color)] font-sans">Result</span>
          <span className={`font-mono text-[13px] font-semibold text-right ml-2 ${
            stats.result.includes('success') || stats.result.includes('found') || stats.result.includes('exists') || stats.result.includes('Success') || stats.result.includes('Complete') || stats.result.includes('Computed')
              ? 'text-emerald-500' 
              : stats.result.includes('Failed') || stats.result.includes('Negative Cycle') || stats.result.includes('Not Found')
              ? 'text-red-500'
              : 'text-[var(--text-color)]'
          }`}>
            {stats.result}
          </span>
        </div>
      </div>

      {/* Disconnected Graph Warning */}
      {stats.extra && stats.extra.some(item => item.label === 'Nodes Visited' && item.value && !item.value.toString().includes(`${nodes.length} / ${nodes.length}`)) && (
        <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-[10px] text-yellow-400 leading-relaxed font-sans">
          <strong>Note:</strong> This graph has disconnected components. The algorithm only reached nodes connected to the start node.
        </div>
      )}

      {/* Negative Cycle Error */}
      {stats.result === 'Negative Cycle Detected' && (
        <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 leading-relaxed font-sans">
          <strong>Error:</strong> Negative cycle detected — no shortest path exists.
        </div>
      )}

      {/* Topological Sort Cycle Error */}
      {stats.result === 'Cycle Detected (Failed)' && (
        <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 leading-relaxed font-sans">
          <strong>Error:</strong> Cycle detected — Topological Sort requires a DAG.
        </div>
      )}
    </div>
  );
}
