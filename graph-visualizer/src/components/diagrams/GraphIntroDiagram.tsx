export function GraphIntroDiagram() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-48 drop-shadow-lg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-emerald-500" />
        </marker>
      </defs>
      
      {/* Edges */}
      <g stroke="currentColor" strokeWidth="2" className="text-emerald-500/50">
        <line x1="100" y1="100" x2="40" y2="40" /> {/* A - B */}
        <line x1="100" y1="100" x2="160" y2="40" /> {/* A - C */}
        <line x1="100" y1="100" x2="40" y2="160" /> {/* A - D */}
        <line x1="40" y1="40" x2="160" y2="160" /> {/* B - E */}
        <line x1="160" y1="40" x2="160" y2="160" /> {/* C - E */}
      </g>

      {/* Nodes */}
      <g className="font-mono text-sm font-bold" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2">
        {/* B */}
        <circle cx="40" cy="40" r="14" className="text-emerald-400" />
        <text x="40" y="45" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">B</text>
        
        {/* C */}
        <circle cx="160" cy="40" r="14" className="text-emerald-400" />
        <text x="160" y="45" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">C</text>
        
        {/* D */}
        <circle cx="40" cy="160" r="14" className="text-emerald-400" />
        <text x="40" y="165" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">D</text>
        
        {/* E */}
        <circle cx="160" cy="160" r="14" className="text-emerald-400" />
        <text x="160" y="165" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">E</text>

        {/* A */}
        <circle cx="100" cy="100" r="14" className="text-blue-400" />
        <text x="100" y="105" textAnchor="middle" stroke="none" fill="currentColor" className="text-blue-400">A</text>
      </g>
    </svg>
  );
}
