export function AdjacencyDiagram() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* The Graph */}
      <svg viewBox="0 0 200 80" className="w-48 h-20 drop-shadow-lg mb-2">
        <line x1="40" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="2" className="text-emerald-500/50" />
        <line x1="100" y1="40" x2="160" y2="40" stroke="currentColor" strokeWidth="2" className="text-emerald-500/50" />
        <path d="M 40 40 Q 100 0 160 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500/50" />
        
        <g className="font-mono text-xs font-bold" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2">
          <circle cx="40" cy="40" r="12" className="text-emerald-400" /><text x="40" y="44" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">A</text>
          <circle cx="100" cy="40" r="12" className="text-emerald-400" /><text x="100" y="44" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">B</text>
          <circle cx="160" cy="40" r="12" className="text-emerald-400" /><text x="160" y="44" textAnchor="middle" stroke="none" fill="currentColor" className="text-emerald-400">C</text>
        </g>
      </svg>

      {/* Representations */}
      <div className="grid grid-cols-2 gap-4 w-full text-xs font-mono">
        {/* List */}
        <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 flex flex-col items-center">
          <div className="text-[var(--muted-color)] text-[10px] uppercase font-bold tracking-widest mb-2 font-sans">Adjacency List</div>
          <div className="space-y-1">
            <div><span className="text-emerald-400">A</span> → [B, C]</div>
            <div><span className="text-emerald-400">B</span> → [A]</div>
            <div><span className="text-emerald-400">C</span> → [A, B]</div>
          </div>
        </div>

        {/* Matrix */}
        <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 flex flex-col items-center">
          <div className="text-[var(--muted-color)] text-[10px] uppercase font-bold tracking-widest mb-2 font-sans">Adjacency Matrix</div>
          <table className="text-center w-full max-w-[120px]">
            <thead>
              <tr className="text-[var(--muted-color)]">
                <th></th><th>A</th><th>B</th><th>C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="text-[var(--muted-color)] font-normal pr-2">A</th>
                <td>0</td><td className="text-emerald-400 font-bold">1</td><td className="text-emerald-400 font-bold">1</td>
              </tr>
              <tr>
                <th className="text-[var(--muted-color)] font-normal pr-2">B</th>
                <td className="text-emerald-400 font-bold">1</td><td>0</td><td>0</td>
              </tr>
              <tr>
                <th className="text-[var(--muted-color)] font-normal pr-2">C</th>
                <td className="text-emerald-400 font-bold">1</td><td>0</td><td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
