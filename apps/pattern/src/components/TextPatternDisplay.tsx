import type { Step } from '../types';
import { CharCell } from './CharCell';

interface Props {
  step: Step;
}

export function TextPatternDisplay({ step }: Props) {
  const { text = '', pattern = '', textH = {}, patH = {} } = step;

  return (
    <div className="grid grid-cols-1 gap-3 mb-4">
      {/* Text row */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
        <div className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>Text</span>
          {step.i !== undefined && (
            <span className="font-mono text-[#58a6ff] normal-case tracking-normal font-normal">i = {step.i}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {text.split('').map((ch, idx) => (
            <CharCell
              key={idx}
              char={ch}
              index={idx}
              state={textH[idx] ?? 'default'}
            />
          ))}
        </div>
      </div>

      {/* Pattern row */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
        <div className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>Pattern</span>
          {step.j !== undefined && (
            <span className="font-mono text-[#3fb950] normal-case tracking-normal font-normal">j = {step.j}</span>
          )}
          {step.hashPat !== undefined && (
            <span className="font-mono text-[#e3b341] normal-case tracking-normal font-normal">
              hash = {step.hashPat}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pattern.split('').map((ch, idx) => (
            <CharCell
              key={idx}
              char={ch}
              index={idx}
              state={patH[idx] ?? 'default'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
