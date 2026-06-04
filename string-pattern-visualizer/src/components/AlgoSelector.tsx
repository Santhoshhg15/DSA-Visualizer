import type { AlgoType } from '../types';
import { useStore } from '../store';

const ALGOS: { id: AlgoType; label: string; desc: string }[] = [
  { id: 'naive',  label: 'Naive',        desc: 'O(nm) sliding window' },
  { id: 'kmp',    label: 'KMP',           desc: 'O(n+m) via LPS array' },
  { id: 'rabin',  label: 'Rabin-Karp',    desc: 'O(n+m) rolling hash' },
  { id: 'trie',   label: 'Trie + WS II',  desc: 'Multi-word DFS search' },
  { id: 'triePlayground', label: 'Trie Sandbox', desc: 'Prefix Tree Playground (Insert, Search, StartsWith)' },
];

export function AlgoSelector() {
  const { algo, setAlgo } = useStore();

  const activeGradients: Record<AlgoType, string> = {
    naive: 'from-[#ff6eb4]/20 via-[#ff2a85]/10 to-transparent border-[#ff6eb4] text-white shadow-[0_0_15px_rgba(255,110,180,0.25)]',
    kmp: 'from-[#5ea8ff]/20 via-[#0062ff]/10 to-transparent border-[#5ea8ff] text-white shadow-[0_0_15px_rgba(94,168,255,0.25)]',
    rabin: 'from-[#4fffb0]/20 via-[#09d97a]/10 to-transparent border-[#4fffb0] text-white shadow-[0_0_15px_rgba(79,255,176,0.25)]',
    trie: 'from-[#a371f7]/20 via-[#7928ca]/10 to-transparent border-[#a371f7] text-white shadow-[0_0_15px_rgba(163,113,247,0.25)]',
    triePlayground: 'from-[#f59e0b]/20 via-[#d97706]/10 to-transparent border-[#f59e0b] text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]',
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 mb-4">
      {ALGOS.map((a, idx) => {
        const isActive = algo === a.id;
        const isFullWidth = idx === ALGOS.length - 1 && ALGOS.length % 2 !== 0;
        return (
          <button
            key={a.id}
            onClick={() => setAlgo(a.id)}
            className={`flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
              ${isFullWidth ? 'col-span-2' : ''}
              ${isActive
                ? `bg-gradient-to-br ${activeGradients[a.id]}`
                : 'bg-[#161b22]/60 border-[#30363d] text-[#acbac7] hover:border-[#58a6ff]/50 hover:text-[#e6edf3]'
              }`}
          >
            <span className={`font-extrabold text-sm ${isActive ? 'text-white' : 'text-gray-100'}`}>{a.label}</span>
            <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? 'text-white/80' : 'text-gray-400'}`}>{a.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
