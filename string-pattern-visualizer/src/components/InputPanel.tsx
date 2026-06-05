import { useState } from 'react';
import { useStore } from '../store';
import { buildNaive } from '../engines/naive';
import { buildKMP } from '../engines/kmp';
import { buildRabin } from '../engines/rabin';
import { buildTrie } from '../engines/trie';
import { traceInsert, traceSearch, traceStartsWith } from '../engines/triePlayground';

export function InputPanel() {
  const {
    algo, textInput, patInput, gridInput, wordsInput,
    setTextInput, setPatInput, setGridInput, setWordsInput,
    setSteps, trieWords, trieNodes, setTrieState, clearTrie,
  } = useStore();

  const [wordInput, setWordInput] = useState('CAT');

  const run = () => {
    let steps;
    if (algo === 'naive')  steps = buildNaive(textInput.trim(), patInput.trim());
    else if (algo === 'kmp')   steps = buildKMP(textInput.trim(), patInput.trim());
    else if (algo === 'rabin') steps = buildRabin(textInput.trim(), patInput.trim());
    else                       steps = buildTrie(gridInput.trim(), wordsInput.trim());
    setSteps(steps);
  };

  const handleInsert = () => {
    const word = wordInput.toUpperCase().trim().replace(/[^A-Z]/g, '');
    if (!word) return;
    const { steps, finalNodes } = traceInsert(word, trieNodes);
    const nextWords = trieWords.includes(word) ? trieWords : [...trieWords, word];
    setTrieState(nextWords, finalNodes);
    setSteps(steps); // Load steps but don't auto-play — user clicks Play
  };

  const handleSearch = () => {
    const word = wordInput.toUpperCase().trim().replace(/[^A-Z]/g, '');
    if (!word) return;
    const steps = traceSearch(word, trieNodes);
    setSteps(steps); // Load steps but don't auto-play — user clicks Play
  };

  const handleStartsWith = () => {
    const prefix = wordInput.toUpperCase().trim().replace(/[^A-Z]/g, '');
    if (!prefix) return;
    const steps = traceStartsWith(prefix, trieNodes);
    setSteps(steps); // Load steps but don't auto-play — user clicks Play
  };

  const inputCls = "bg-[#0b0d12]/80 border border-[#252a38] rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#5ea8ff] focus:ring-1 focus:ring-[#5ea8ff]/50 w-full transition-all placeholder-gray-600";
  const labelCls = "text-[10px] font-black text-[#8b95b3] uppercase tracking-widest mb-1.5 block";
  
  const baseBtnCls = "py-2.5 text-white text-xs font-extrabold rounded-xl transition-all active:scale-95 duration-200 text-center flex-1 min-w-0";
  const insertBtnCls = `${baseBtnCls} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-[0_4px_12px_rgba(16,185,129,0.2)]`;
  const searchBtnCls = `${baseBtnCls} bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-[0_4px_12px_rgba(59,130,246,0.2)]`;
  const startBtnCls = `${baseBtnCls} bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-[0_4px_12px_rgba(245,158,11,0.2)]`;
  const clearBtnCls = "px-4 py-2 bg-[#161b2d] border border-[#30364d] hover:bg-[#21263d] text-[var(--muted-color)] text-xs font-bold rounded-xl transition-all active:scale-95 duration-200 text-center w-full";

  if (algo === 'triePlayground') {
    return (
      <div className="bg-[#13161e]/60 border border-[#252a38] rounded-2xl p-5 shadow-xl backdrop-blur-xl mb-4 space-y-4">
        <div>
          <span className={labelCls}>Word or Prefix</span>
          <input
            value={wordInput}
            onChange={e => setWordInput(e.target.value)}
            maxLength={15}
            placeholder="Type word (e.g. CAT)..."
            className={inputCls}
          />
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleInsert} className={insertBtnCls}>
            Insert
          </button>
          <button onClick={handleSearch} className={searchBtnCls}>
            Search
          </button>
          <button onClick={handleStartsWith} className={startBtnCls}>
            StartsWith
          </button>
        </div>

        <button onClick={clearTrie} className={clearBtnCls}>
          ✕ Clear Tree
        </button>

        {trieWords.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-color)]">
            <span className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1">
              Words in Trie ({trieWords.length}):
            </span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto scrollbar-none">
              {trieWords.map((w, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-lg font-mono">
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#13161e]/60 border border-[#252a38] rounded-2xl p-5 shadow-xl backdrop-blur-xl mb-4">
      {algo !== 'trie' ? (
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <span className={labelCls}>Text Input</span>
            <input
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              maxLength={50}
              placeholder="Enter text payload..."
              className={inputCls}
            />
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-grow">
              <span className={labelCls}>Search Pattern</span>
              <input
                value={patInput}
                onChange={e => setPatInput(e.target.value)}
                maxLength={16}
                placeholder="Search pattern..."
                className={inputCls}
              />
            </div>
            <button
              onClick={run}
              disabled={!textInput || !patInput}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-900 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-extrabold rounded-xl transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(52,211,153,0.3)] active:scale-95 duration-200 flex-shrink-0"
            >
              Visualize ▶
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <span className={labelCls}>Grid (rows, comma-separated)</span>
            <textarea
              value={gridInput}
              onChange={e => setGridInput(e.target.value)}
              rows={2}
              placeholder="OAT,EAA,IHN,PGH"
              className={inputCls + ' resize-none'}
            />
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-grow">
              <span className={labelCls}>Word list (comma-separated)</span>
              <textarea
                value={wordsInput}
                onChange={e => setWordsInput(e.target.value)}
                rows={2}
                placeholder="OAT,EAT,OATH"
                className={inputCls + ' resize-none'}
              />
            </div>
            <button
              onClick={run}
              disabled={!gridInput || !wordsInput}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-900 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-extrabold rounded-xl transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(52,211,153,0.3)] active:scale-95 duration-200 flex-shrink-0"
            >
              Visualize ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
