import type { Step } from '../types';

interface Props {
  step?: Step;
  curStepIndex: number;
  totalSteps: number;
}

export function BSTExplanation({ step, curStepIndex, totalSteps }: Props) {
  if (!step) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-xl backdrop-blur-xl h-fit flex flex-col justify-center items-center text-[var(--muted-color)] text-xs font-semibold">
        No active operation trace
      </div>
    );
  }

  const opColors: Record<string, string> = {
    insert: 'from-emerald-500/20 to-teal-600/10 border-emerald-500 text-emerald-400',
    search: 'from-blue-500/20 to-indigo-600/10 border-blue-500 text-blue-400',
    delete: 'from-rose-500/20 to-red-600/10 border-rose-500 text-rose-400',
    inorder: 'from-amber-500/20 to-orange-600/10 border-amber-500 text-amber-400',
    preorder: 'from-purple-500/20 to-violet-600/10 border-purple-500 text-purple-400',
    postorder: 'from-pink-500/20 to-fuchsia-600/10 border-pink-500 text-pink-400',
    bfs: 'from-sky-500/20 to-cyan-600/10 border-sky-500 text-sky-400',
  };

  const opLabel: Record<string, string> = {
    insert: 'BST Insert',
    search: 'BST Search',
    delete: 'BST Delete',
    inorder: 'Inorder DFS',
    preorder: 'Preorder DFS',
    postorder: 'Postorder DFS',
    bfs: 'BFS Traversal',
  };

  const op = step.activeOperation || 'insert';
  const activeNodeVal = (step.bstNodes && step.activeNodeId && step.bstNodes[step.activeNodeId])
    ? step.bstNodes[step.activeNodeId].value
    : 'None';

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-xl backdrop-blur-xl h-fit flex flex-col space-y-6">
      <div className="border-b border-[var(--border-color)] pb-3 flex items-center justify-between">
        <span className="text-[10px] font-black text-transparent bg-gradient-to-r from-blue-400 to-[#4fffb0] bg-clip-text uppercase tracking-widest">
          📊 BST Explanation
        </span>
        <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-bold uppercase bg-gradient-to-r ${opColors[op] || opColors.insert}`}>
          {opLabel[op] || 'Operation'}
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

        {/* Target Value */}
        <div className="bg-[#0b0d12]/40 border border-[var(--border-color)] rounded-xl p-3">
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1">
            Target Value
          </span>
          <span className="text-sm font-extrabold text-[#5ea8ff]">
            {step.bstValue !== undefined ? step.bstValue : 'None'}
          </span>
        </div>

        {/* Active Node Value */}
        <div className="bg-[#0b0d12]/40 border border-[var(--border-color)] rounded-xl p-3">
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1">
            Active Node
          </span>
          <span className="text-sm font-extrabold text-gray-300">
            {activeNodeVal}
          </span>
        </div>

        {/* Visited Count (for traversals) */}
        <div className="bg-[#0b0d12]/40 border border-[var(--border-color)] rounded-xl p-3">
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1">
            Visited Nodes
          </span>
          <span className="text-sm font-extrabold text-emerald-400">
            {step.visitedNodes ? step.visitedNodes.length : 0}
          </span>
        </div>
      </div>

      {/* Result Status */}
      <div className="bg-[#0b0d12]/50 border border-[var(--border-color)] rounded-xl p-4 flex flex-col justify-center items-center text-center space-y-1 shadow-inner">
        <span className="text-[8px] font-black text-[var(--muted-color)] uppercase tracking-widest">
          Result Status
        </span>
        <span className={`text-base font-extrabold tracking-wide uppercase transition-all duration-300 ${
          step.bstResultStatus?.includes('✓')
            ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]'
            : step.bstResultStatus?.includes('✗')
              ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.35)]'
              : 'text-[#5ea8ff]'
        }`}>
          {step.bstResultStatus || 'In Progress'}
        </span>
      </div>

      {/* Detailed Log Explanation */}
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
