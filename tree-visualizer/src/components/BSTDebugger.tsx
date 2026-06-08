import { useMemo } from 'react';
import type { Step } from '../types';

interface Props {
  step?: Step;
}

export function BSTDebugger({ step }: Props) {
  const debuggerData = useMemo(() => {
    if (!step || !step.activeNodeId || !step.bstNodes) return null;
    
    const nodes = step.bstNodes;
    const activeNode = nodes[step.activeNodeId];
    if (!activeNode) return null;

    const leftNode = activeNode.leftId ? nodes[activeNode.leftId] : null;
    const rightNode = activeNode.rightId ? nodes[activeNode.rightId] : null;
    
    const targetVal = step.bstValue;
    const currentVal = activeNode.value;

    let expr = '';
    let evalResult = '';
    let decision = '';

    if (targetVal !== undefined) {
      if (targetVal === currentVal) {
        expr = `val == node.val`;
        evalResult = `${targetVal} == ${currentVal} ➜ true`;
        decision = `Duplicate / Target Found`;
      } else if (targetVal < currentVal) {
        expr = `val < node.val`;
        evalResult = `${targetVal} < ${currentVal} ➜ true`;
        decision = `Move Left`;
      } else {
        expr = `val > node.val`;
        evalResult = `${targetVal} > ${currentVal} ➜ true`;
        decision = `Move Right`;
      }
    }

    return {
      targetVal,
      currentVal,
      leftVal: leftNode ? leftNode.value : 'null',
      rightVal: rightNode ? rightNode.value : 'null',
      expr,
      evalResult,
      decision,
      opName: step.activeOperation ?? 'Operation'
    };
  }, [step]);

  const blockHeaderCls = "text-[9px] font-black text-[#58a6ff] uppercase tracking-widest mb-2 border-b border-[var(--border-color)] pb-1";
  
  if (!debuggerData) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-xl backdrop-blur-xl h-fit flex flex-col justify-center items-center text-[var(--muted-color)] text-xs font-semibold py-8">
        <div className="text-xl mb-1.5 opacity-60">🔎</div>
        Debugger Scope is inactive.
        <span className="text-[10px] opacity-60 font-normal mt-0.5">Run an operation to inspect local variables.</span>
      </div>
    );
  }

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-xl backdrop-blur-xl h-fit flex flex-col space-y-4 font-mono text-[11px]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 flex-shrink-0">
        <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#4fffb0] uppercase tracking-widest">
          🔎 Local Scope Debugger
        </span>
        <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold border uppercase tracking-wider bg-blue-500/10 border-blue-500/20 text-blue-400">
          Scope: {debuggerData.opName}
        </span>
      </div>

      {/* Variables Section */}
      <div>
        <div className={blockHeaderCls}>Variables (Locals)</div>
        <div className="space-y-1.5 text-[var(--text-color)]">
          <div className="flex justify-between hover:bg-[var(--pill-btn-hover)] px-1.5 py-0.5 rounded transition-all">
            <span className="text-[#c586c0]">val <span className="text-[9px] text-[var(--muted-color)] font-sans">(integer)</span></span>
            <span className="font-bold text-[#b5cea8]">{debuggerData.targetVal ?? 'undefined'}</span>
          </div>

          <div className="flex flex-col border border-[var(--border-color)]/40 bg-[#0b0d12]/30 rounded-xl p-2.5 mt-2">
            <div className="flex justify-between font-bold text-indigo-400 mb-1 border-b border-[var(--border-color)]/20 pb-1 text-[10px]">
              <span>node</span>
              <span>Node Object</span>
            </div>
            <div className="space-y-1 pl-2.5">
              <div className="flex justify-between">
                <span className="text-[var(--muted-color)]">.val</span>
                <span className="text-[#b5cea8] font-bold">{debuggerData.currentVal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-color)]">.left</span>
                <span className={debuggerData.leftVal !== 'null' ? 'text-emerald-400 font-semibold' : 'text-[var(--muted-color)]'}>
                  {debuggerData.leftVal !== 'null' ? `Node(${debuggerData.leftVal})` : 'null'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-color)]">.right</span>
                <span className={debuggerData.rightVal !== 'null' ? 'text-orange-400 font-semibold' : 'text-[var(--muted-color)]'}>
                  {debuggerData.rightVal !== 'null' ? `Node(${debuggerData.rightVal})` : 'null'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparisons Section */}
      {debuggerData.expr && (
        <div className="pt-2">
          <div className={blockHeaderCls}>Expression Evaluator</div>
          <div className="bg-[#0b0d12]/40 border border-[var(--border-color)]/50 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--muted-color)]">Expression:</span>
              <span className="text-[#569cd6] font-bold">{debuggerData.expr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-color)]">Evaluation:</span>
              <span className="text-[#4fffb0] font-bold">{debuggerData.evalResult}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border-color)]/30 pt-1.5 mt-1.5">
              <span className="text-[var(--muted-color)]">Branch Decision:</span>
              <span className="text-orange-400 font-black uppercase tracking-wider text-[10px]">{debuggerData.decision}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
