import { useState } from 'react';
import { useStore } from '../store';
import { traceBSTInsert, traceBSTSearch, traceBSTDelete, traceBSTTraversal } from '../engines/bstPlayground';

export function InputPanel() {
  const {
    setStepsAndPlay, bstNodes, bstRootId, setBSTState, clearBST
  } = useStore();

  const [bstValInput, setBstValInput] = useState('15');

  // BST Handlers
  const handleBSTInsert = () => {
    const val = parseInt(bstValInput.trim(), 10);
    if (isNaN(val)) return;
    const { steps, finalNodes, rootId } = traceBSTInsert(val, bstNodes, bstRootId);
    setBSTState(finalNodes, rootId, `Insert ${val}`);
    setStepsAndPlay(steps);
  };

  const handleBSTSearch = () => {
    const val = parseInt(bstValInput.trim(), 10);
    if (isNaN(val)) return;
    const steps = traceBSTSearch(val, bstNodes, bstRootId);
    setStepsAndPlay(steps);
  };

  const handleBSTDelete = () => {
    const val = parseInt(bstValInput.trim(), 10);
    if (isNaN(val)) return;
    const { steps, finalNodes, rootId } = traceBSTDelete(val, bstNodes, bstRootId);
    setBSTState(finalNodes, rootId, `Delete ${val}`);
    setStepsAndPlay(steps);
  };

  const handleBSTTraversal = (type: 'inorder' | 'preorder' | 'postorder' | 'bfs') => {
    const steps = traceBSTTraversal(type, bstNodes, bstRootId);
    setStepsAndPlay(steps);
  };

  const inputCls = "bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm font-mono text-[var(--text-color)] focus:outline-none focus:border-[#5ea8ff] focus:ring-1 focus:ring-[#5ea8ff]/50 w-full transition-all placeholder-[var(--muted-color)]/30 hover:border-[var(--border-hover)]";
  const labelCls = "text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.12em] mb-2 block";
  
  const baseBtnCls = "py-2.5 text-white text-xs font-semibold tracking-wide rounded-xl transition-all active:scale-95 duration-200 text-center flex-1 min-w-0";
  const insertBtnCls = `${baseBtnCls} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.35)]`;
  const searchBtnCls = `${baseBtnCls} bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.35)]`;
  const roseBtnCls = `${baseBtnCls} bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.35)]`;
  const clearBtnCls = "px-4 py-2.5 bg-[var(--pill-btn-bg)] border border-[var(--pill-btn-border)] hover:bg-[var(--pill-btn-hover)] hover:text-rose-400 hover:border-rose-500/25 text-[var(--muted-color)] text-xs font-semibold tracking-wide rounded-xl transition-all active:scale-95 duration-200 text-center w-full shadow-sm";

  const bstValues = Object.values(bstNodes).map(n => n.value).sort((a, b) => a - b);

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl backdrop-blur-xl mb-4 space-y-6 hover:border-[var(--border-hover)] transition-all">
      <div>
        <span className={labelCls}>Node Value (Integer)</span>
        <input
          type="number"
          value={bstValInput}
          onChange={e => setBstValInput(e.target.value)}
          placeholder="Type value (e.g. 15)..."
          className={inputCls}
        />
      </div>

      {/* BST Mutation buttons */}
      <div className="flex gap-3">
        <button onClick={handleBSTInsert} className={insertBtnCls}>
          Insert
        </button>
        <button onClick={handleBSTSearch} className={searchBtnCls}>
          Search
        </button>
        <button onClick={handleBSTDelete} className={roseBtnCls}>
          Delete
        </button>
      </div>

      {/* BST Traversal buttons */}
      <div className="pt-4 border-t border-[var(--border-color)]">
        <span className={labelCls}>Run Traversal</span>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleBSTTraversal('inorder')}
            disabled={bstValues.length === 0}
            className={`${baseBtnCls} bg-indigo-500/10 dark:bg-indigo-950/40 border border-indigo-500/20 dark:border-indigo-700/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 dark:hover:bg-indigo-900/50 disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            Inorder
          </button>
          <button
            onClick={() => handleBSTTraversal('preorder')}
            disabled={bstValues.length === 0}
            className={`${baseBtnCls} bg-indigo-500/10 dark:bg-indigo-950/40 border border-indigo-500/20 dark:border-indigo-700/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 dark:hover:bg-indigo-900/50 disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            Preorder
          </button>
          <button
            onClick={() => handleBSTTraversal('postorder')}
            disabled={bstValues.length === 0}
            className={`${baseBtnCls} bg-indigo-500/10 dark:bg-indigo-950/40 border border-indigo-500/20 dark:border-indigo-700/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 dark:hover:bg-indigo-900/50 disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            Postorder
          </button>
          <button
            onClick={() => handleBSTTraversal('bfs')}
            disabled={bstValues.length === 0}
            className={`${baseBtnCls} bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/20 dark:border-cyan-700/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 dark:hover:bg-cyan-900/50 disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            Level (BFS)
          </button>
        </div>
      </div>

      <button onClick={clearBST} className={clearBtnCls}>
        ✕ Clear Tree
      </button>

      {bstValues.length > 0 && (
        <div className="pt-4 border-t border-[var(--border-color)]">
          <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.12em] block mb-2">
            Nodes in BST ({bstValues.length}):
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
            {bstValues.map((val) => (
              <span key={val} className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-[10px] font-semibold rounded-xl font-mono">
                {val}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
