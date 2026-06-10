export function DirectedUndirectedDiagram() {
  return (
    <svg viewBox="0 0 300 150" className="w-full h-48 drop-shadow-lg">
      <defs>
        <marker id="dir-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-blue-500" />
        </marker>
      </defs>

      {/* Undirected Half (Left) */}
      <g transform="translate(40, 0)">
        <text x="35" y="20" textAnchor="middle" fill="currentColor" className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-widest">Undirected</text>
        <line x1="10" y1="100" x2="60" y2="100" stroke="currentColor" strokeWidth="2" className="text-emerald-500/50" />
        <line x1="35" y1="50" x2="10" y2="100" stroke="currentColor" strokeWidth="2" className="text-emerald-500/50" />
        <line x1="35" y1="50" x2="60" y2="100" stroke="currentColor" strokeWidth="2" className="text-emerald-500/50" />
        
        <g className="font-mono text-xs font-bold" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2">
          <circle cx="35" cy="50" r="12" className="text-emerald-400" /><text x="35" y="54" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">A</text>
          <circle cx="10" cy="100" r="12" className="text-emerald-400" /><text x="10" y="104" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">B</text>
          <circle cx="60" cy="100" r="12" className="text-emerald-400" /><text x="60" y="104" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">C</text>
        </g>
      </g>

      {/* Divider */}
      <line x1="150" y1="10" x2="150" y2="140" stroke="currentColor" strokeDasharray="4" strokeWidth="1" className="text-[var(--border-color)]" />

      {/* Directed Half (Right) */}
      <g transform="translate(190, 0)">
        <text x="35" y="20" textAnchor="middle" fill="currentColor" className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-widest">Directed</text>
        <line x1="10" y1="100" x2="50" y2="100" stroke="currentColor" strokeWidth="2" markerEnd="url(#dir-arrow)" className="text-blue-500/60" />
        <line x1="35" y1="50" x2="13" y2="90" stroke="currentColor" strokeWidth="2" markerEnd="url(#dir-arrow)" className="text-blue-500/60" />
        <line x1="35" y1="50" x2="57" y2="90" stroke="currentColor" strokeWidth="2" markerEnd="url(#dir-arrow)" className="text-blue-500/60" />
        
        <g className="font-mono text-xs font-bold" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2">
          <circle cx="35" cy="50" r="12" className="text-blue-400" /><text x="35" y="54" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">A</text>
          <circle cx="10" cy="100" r="12" className="text-blue-400" /><text x="10" y="104" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">B</text>
          <circle cx="60" cy="100" r="12" className="text-blue-400" /><text x="60" y="104" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">C</text>
        </g>
      </g>
    </svg>
  );
}
