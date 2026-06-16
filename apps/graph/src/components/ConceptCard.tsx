import type { ReactNode } from 'react';

interface ConceptCardProps {
  title: string;
  definition: string;
  explanation: string;
  keyFacts: string[];
  children: ReactNode;
}

export function ConceptCard({ title, definition, explanation, keyFacts, children }: ConceptCardProps) {
  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] border-l-4 border-l-emerald-500 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col h-full hover:border-[var(--border-hover)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 group">
      <h2 className="text-xl font-bold mb-2 text-[var(--text-color)] group-hover:text-emerald-400 transition-colors">
        {title}
      </h2>
      <p className="font-mono text-sm font-semibold text-emerald-500 mb-4 bg-emerald-500/10 inline-block px-3 py-1 rounded-lg w-fit">
        {definition}
      </p>
      
      <p className="text-[var(--muted-color)] text-sm mb-6 leading-relaxed flex-grow">
        {explanation}
      </p>

      {/* Diagram Panel */}
      <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-4 mb-6 flex items-center justify-center min-h-[220px]">
        {children}
      </div>

      {/* Key Facts */}
      <div>
        <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
          Key Facts
        </h3>
        <ul className="space-y-2">
          {keyFacts.map((fact, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-color)]">
              <span className="text-emerald-500 font-bold mt-0.5">›</span>
              <span className="leading-tight opacity-90">{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
