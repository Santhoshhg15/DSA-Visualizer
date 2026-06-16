import type { Step } from '../types';

interface Props { step: Step; }

export function HashPanel({ step }: Props) {
  const { hashPat, hashTxt, spurious } = step;
  if (hashPat === undefined) return null;

  const isMatch = hashTxt === hashPat;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 mb-4">
      <div className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider mb-3">Rolling Hash</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0d1117] rounded-lg p-3 border border-[#21262d]">
          <div className="text-[10px] text-[#8b949e] mb-1">Pattern hash</div>
          <div className="text-2xl font-mono font-semibold text-[#58a6ff]">{hashPat}</div>
        </div>
        <div className={`rounded-lg p-3 border transition-all ${
          isMatch
            ? 'bg-[#1a2e1a] border-[#3fb950]'
            : 'bg-[#0d1117] border-[#21262d]'
        }`}>
          <div className="text-[10px] text-[#8b949e] mb-1">Window hash</div>
          <div className={`text-2xl font-mono font-semibold ${isMatch ? 'text-[#3fb950]' : 'text-[#e6edf3]'}`}>
            {hashTxt}
          </div>
        </div>
      </div>
      {spurious && (
        <div className="mt-3 text-xs text-[#f85149] bg-[#2d1515] border border-[#6e3535] rounded-lg px-3 py-2">
          ⚠ Hash collision detected — hashes matched but characters differ. Verifying char-by-char.
        </div>
      )}
      {isMatch && !spurious && hashTxt !== undefined && (
        <div className="mt-3 text-xs text-[#3fb950] bg-[#1a2e1a] border border-[#2d6a2d] rounded-lg px-3 py-2">
          Hashes match — verifying characters to confirm (avoid spurious hits)
        </div>
      )}
      <div className="mt-3 text-[10px] text-[#8b949e]">
        base D=256, mod Q=101
      </div>
    </div>
  );
}
