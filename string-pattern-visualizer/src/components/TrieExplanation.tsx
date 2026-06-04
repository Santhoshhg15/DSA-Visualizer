import type { Step } from '../types';

interface Props {
  step?: Step;
  curStepIndex: number;
  totalSteps: number;
}

export function TrieExplanation({ step, curStepIndex, totalSteps }: Props) {
  if (!step) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-xl backdrop-blur-xl h-fit flex flex-col justify-center items-center text-[var(--muted-color)] text-xs font-semibold">
        No active operation trace
      </div>
    );
  }

  const opColors = {
    insert: 'from-emerald-500/20 to-teal-600/10 border-emerald-500 text-emerald-400',
    search: 'from-blue-500/20 to-indigo-600/10 border-blue-500 text-blue-400',
    startsWith: 'from-amber-500/20 to-orange-600/10 border-amber-500 text-amber-400',
  };

  const opLabel = {
    insert: 'Insert Word',
    search: 'Search Word',
    startsWith: 'StartsWith Prefix',
  };

  const op = step.activeOperation || 'insert';

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-xl backdrop-blur-xl h-fit flex flex-col space-y-6">
      <div className="border-b border-[var(--border-color)] pb-3 flex items-center justify-between">
        <span className="text-[10px] font-black text-transparent bg-gradient-to-r from-blue-400 to-[#4fffb0] bg-clip-text uppercase tracking-widest">
          📝 Operation Info
        </span>
        <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-bold uppercase bg-gradient-to-r ${opColors[op]}`}>
          {opLabel[op]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Step Index */}
        <div className="bg-[#0b0d12]/40 border border-[var(--border-color)] rounded-xl p-3">
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1">
            Current Step
          </span>
          <span className="text-sm font-extrabold text-white">
            #{curStepIndex + 1} <span className="text-xs text-[var(--muted-color)] font-normal">/ {totalSteps}</span>
          </span>
        </div>

        {/* Current Character */}
        <div className="bg-[#0b0d12]/40 border border-[var(--border-color)] rounded-xl p-3">
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1">
            Current Character
          </span>
          <span className={`text-sm font-extrabold ${step.currentNodeChar ? 'text-[#5ea8ff]' : 'text-[var(--muted-color)]'}`}>
            {step.currentNodeChar ? `'${step.currentNodeChar}'` : 'None'}
          </span>
        </div>

        {/* Visited Node */}
        <div className="bg-[#0b0d12]/40 border border-[var(--border-color)] rounded-xl p-3">
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1">
            Node Visited
          </span>
          <span className="text-[11px] font-mono font-bold text-gray-300 truncate block">
            {step.activeNodeId ? step.activeNodeId.substring(0, 8) : 'None'}
          </span>
        </div>

        {/* Current Word Segment */}
        <div className="bg-[#0b0d12]/40 border border-[var(--border-color)] rounded-xl p-3">
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1">
            Word Path
          </span>
          <span className="text-[11px] font-mono font-extrabold text-emerald-400 truncate block">
            {step.trieWord ? `"${step.trieWord}"` : '""'}
          </span>
        </div>
      </div>

      {/* Result Status */}
      <div className="bg-[#0b0d12]/50 border border-[var(--border-color)] rounded-xl p-4 flex flex-col justify-center items-center text-center space-y-1 shadow-inner">
        <span className="text-[8px] font-black text-[var(--muted-color)] uppercase tracking-widest">
          Result Status
        </span>
        <span className={`text-base font-extrabold tracking-wide uppercase transition-all duration-300 ${
          step.trieResultStatus?.includes('✓') 
            ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]'
            : step.trieResultStatus?.includes('✗')
              ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.35)]'
              : 'text-[#5ea8ff]'
        }`}>
          {step.trieResultStatus || 'In Progress'}
        </span>
      </div>

      {/* Live explanation description */}
      <div className="bg-[#0b0d12]/30 border border-[var(--border-color)] rounded-xl p-3.5 flex-grow">
        <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1.5">
          Detailed Explanation
        </span>
        <p className="text-[11px] text-gray-300 leading-relaxed font-semibold">
          {step.msg}
        </p>
      </div>
    </div>
  );
}
