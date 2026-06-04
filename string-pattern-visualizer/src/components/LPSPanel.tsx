import type { Step } from '../types';

interface Props { step: Step; }

export function LPSPanel({ step }: Props) {
  const { pattern = '', lps = [], lpsIdx } = step;
  if (!lps.length) return null;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 mb-4">
      <div className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider mb-3">
        LPS Array (Failure Function)
      </div>
      <div className="flex flex-col gap-1.5">
        {/* Pattern chars */}
        <div className="flex gap-1.5 flex-wrap">
          {pattern.split('').map((ch, i) => (
            <div key={i} className="w-9 h-8 flex items-center justify-center text-sm font-mono text-[#8b949e] border border-[#21262d] rounded bg-[#0d1117]">
              {ch}
            </div>
          ))}
        </div>
        {/* LPS values */}
        <div className="flex gap-1.5 flex-wrap">
          {pattern.split('').map((_, i) => {
            const val = lps[i];
            const isCurrent = i === lpsIdx;
            const isFilled = val !== undefined;
            return (
              <div
                key={i}
                className={`w-9 h-8 flex items-center justify-center text-sm font-mono font-semibold rounded border transition-all
                  ${isCurrent
                    ? 'bg-[#388bfd] border-[#58a6ff] text-white'
                    : isFilled
                      ? 'bg-[#1c3248] border-[#388bfd] text-[#58a6ff]'
                      : 'bg-[#0d1117] border-[#21262d] text-[#30363d]'
                  }`}
              >
                {isFilled ? val : '·'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
