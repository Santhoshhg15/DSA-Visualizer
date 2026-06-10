export function CyclicAcyclicDiagram() {
  return (
    <svg viewBox="0 0 300 150" className="w-full h-48 drop-shadow-lg">
      <defs>
        <marker id="cycle-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-red-500" />
        </marker>
        <marker id="dag-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-blue-500" />
        </marker>
      </defs>

      {/* Cyclic (Left) */}
      <g transform="translate(40, 0)">
        <text x="35" y="20" textAnchor="middle" fill="currentColor" className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-widest">Cyclic</text>
        
        {/* Cycle Path */}
        <line x1="35" y1="40" x2="60" y2="75" stroke="currentColor" strokeWidth="2.5" markerEnd="url(#cycle-arrow)" className="text-red-500" />
        <line x1="60" y1="75" x2="35" y2="110" stroke="currentColor" strokeWidth="2.5" markerEnd="url(#cycle-arrow)" className="text-red-500" />
        <line x1="35" y1="110" x2="10" y2="75" stroke="currentColor" strokeWidth="2.5" markerEnd="url(#cycle-arrow)" className="text-red-500" />
        <line x1="10" y1="75" x2="35" y2="40" stroke="currentColor" strokeWidth="2.5" markerEnd="url(#cycle-arrow)" className="text-red-500" />

        <g className="font-mono text-xs font-bold" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2">
          <circle cx="35" cy="40" r="12" className="text-red-400" /><text x="35" y="44" textAnchor="middle" stroke="none" fill="currentColor" className="text-red-400">A</text>
          <circle cx="60" cy="75" r="12" className="text-red-400" /><text x="60" y="79" textAnchor="middle" stroke="none" fill="currentColor" className="text-red-400">B</text>
          <circle cx="35" cy="110" r="12" className="text-red-400" /><text x="35" y="114" textAnchor="middle" stroke="none" fill="currentColor" className="text-red-400">C</text>
          <circle cx="10" cy="75" r="12" className="text-red-400" /><text x="10" y="79" textAnchor="middle" stroke="none" fill="currentColor" className="text-red-400">D</text>
        </g>
      </g>

      {/* Divider */}
      <line x1="150" y1="10" x2="150" y2="140" stroke="currentColor" strokeDasharray="4" strokeWidth="1" className="text-[var(--border-color)]" />

      {/* Acyclic DAG (Right) */}
      <g transform="translate(190, 0)">
        <text x="35" y="20" textAnchor="middle" fill="currentColor" className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-widest">Acyclic (DAG)</text>
        
        {/* Tree Path */}
        <line x1="35" y1="40" x2="60" y2="75" stroke="currentColor" strokeWidth="2" markerEnd="url(#dag-arrow)" className="text-blue-500/60" />
        <line x1="35" y1="40" x2="10" y2="75" stroke="currentColor" strokeWidth="2" markerEnd="url(#dag-arrow)" className="text-blue-500/60" />
        <line x1="60" y1="75" x2="35" y2="110" stroke="currentColor" strokeWidth="2" markerEnd="url(#dag-arrow)" className="text-blue-500/60" />
        <line x1="10" y1="75" x2="35" y2="110" stroke="currentColor" strokeWidth="2" markerEnd="url(#dag-arrow)" className="text-blue-500/60" />

        <g className="font-mono text-xs font-bold" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2">
          <circle cx="35" cy="40" r="12" className="text-blue-400" /><text x="35" y="44" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">A</text>
          <circle cx="60" cy="75" r="12" className="text-blue-400" /><text x="60" y="79" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">B</text>
          <circle cx="35" cy="110" r="12" className="text-blue-400" /><text x="35" y="114" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">D</text>
          <circle cx="10" cy="75" r="12" className="text-blue-400" /><text x="10" y="79" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">C</text>
        </g>
      </g>
    </svg>
  );
}
