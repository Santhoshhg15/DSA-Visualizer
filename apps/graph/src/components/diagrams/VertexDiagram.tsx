export function VertexDiagram() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-48 drop-shadow-lg">
      <g className="font-mono text-sm font-bold" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2">
        {/* Node 0 */}
        <circle cx="50" cy="80" r="16" className="text-emerald-400" />
        <text x="50" y="85" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">0</text>
        <text x="50" y="115" textAnchor="middle" stroke="none" fill="currentColor" className="text-[10px] text-[var(--muted-color)]">Node 0</text>
        
        {/* Node 1 */}
        <circle cx="100" cy="120" r="16" className="text-blue-400" />
        <text x="100" y="125" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">1</text>
        <text x="100" y="155" textAnchor="middle" stroke="none" fill="currentColor" className="text-[10px] text-[var(--muted-color)]">Node 1</text>

        {/* Callout Arrow for Node 1 */}
        <path d="M 150 70 Q 130 70 112 105" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" className="text-[var(--muted-color)]" markerEnd="url(#arrow)" />
        <text x="150" y="65" textAnchor="middle" stroke="none" fill="currentColor" className="text-[11px] text-[var(--muted-color)]">Vertex</text>

        {/* Node 2 */}
        <circle cx="150" cy="80" r="16" className="text-pink-400" />
        <text x="150" y="85" textAnchor="middle" stroke="none" fill="currentColor" className="text-pink-400">2</text>
        <text x="150" y="115" textAnchor="middle" stroke="none" fill="currentColor" className="text-[10px] text-[var(--muted-color)]">Node 2</text>
      </g>
    </svg>
  );
}
