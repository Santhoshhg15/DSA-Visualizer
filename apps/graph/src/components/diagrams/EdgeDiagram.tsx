export function EdgeDiagram() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-48 drop-shadow-lg">
      <defs>
        <marker id="edge-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-[var(--muted-color)]" />
        </marker>
      </defs>

      {/* Edge */}
      <line x1="60" y1="100" x2="140" y2="100" stroke="currentColor" strokeWidth="3" className="text-emerald-500" />
      
      {/* Callout Arrow for Edge */}
      <path d="M 100 50 L 100 85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" className="text-[var(--muted-color)]" markerEnd="url(#edge-arrow)" />
      <text x="100" y="40" textAnchor="middle" stroke="none" fill="currentColor" className="text-[12px] font-bold text-emerald-400">Edge</text>

      {/* Nodes */}
      <g className="font-mono text-sm font-bold" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2">
        <circle cx="60" cy="100" r="16" className="text-blue-400" />
        <text x="60" y="105" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">A</text>
        
        <circle cx="140" cy="100" r="16" className="text-blue-400" />
        <text x="140" y="105" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">B</text>
      </g>

      <text x="100" y="160" textAnchor="middle" stroke="none" fill="currentColor" className="font-mono text-sm font-bold text-[var(--muted-color)]">Edge = (A, B)</text>
    </svg>
  );
}
