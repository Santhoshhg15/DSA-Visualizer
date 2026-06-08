import { useState } from 'react';
import { useStore } from '../store';
import { parseBulkInput } from '../engines/bulkParser';
import { traceBSTInsert } from '../engines/bstPlayground';
import type { Step } from '../types';

export function BulkGeneratorPanel() {
  const { setBSTState, setSteps, setStepsAndPlay } = useStore();
  const [bulkInput, setBulkInput] = useState('50,30,70,20,40,60,80');
  const [parsedInfo, setParsedInfo] = useState<{ count: number; ignored: string[] } | null>(null);

  const presets: Record<string, string> = {
    balanced: '50,30,70,20,40,60,80',
    leftSkewed: '50,40,30,20,10',
    rightSkewed: '10,20,30,40,50',
    complete: '15,10,20,8,12,18,25',
    random: '15,8,22,4,12,18,30'
  };

  const handleSelectPreset = (presetKey: string) => {
    if (presetKey && presets[presetKey]) {
      setBulkInput(presets[presetKey]);
      setParsedInfo(null);
    }
  };

  const executeGeneration = (animate: boolean) => {
    const { values, invalidTokens } = parseBulkInput(bulkInput);
    
    if (values.length === 0) {
      setParsedInfo({ count: 0, ignored: invalidTokens });
      return;
    }

    setParsedInfo({ count: values.length, ignored: invalidTokens });

    // Construct the BST from scratch
    let tempNodes = {};
    let tempRootId = null;
    let allSteps: Step[] = [];

    for (const val of values) {
      const { steps, finalNodes, rootId } = traceBSTInsert(val, tempNodes, tempRootId);
      allSteps.push(...steps);
      tempNodes = finalNodes;
      tempRootId = rootId;
    }

    const label = `Bulk: [${values.slice(0, 3).join(',')}${values.length > 3 ? '...' : ''}]`;

    if (animate) {
      setBSTState(tempNodes, tempRootId, label);
      setStepsAndPlay(allSteps);
    } else {
      setBSTState(tempNodes, tempRootId, label);
      setSteps([]); // Clear visualizer steps to render root nodes instantly
    }
  };

  const handleClear = () => {
    setBulkInput('');
    setParsedInfo(null);
  };

  // Styling Classes
  const selectCls = "bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-color)] focus:outline-none focus:border-[#5ea8ff] w-full transition-all cursor-pointer font-medium hover:border-[var(--border-hover)]";
  const textareaCls = "bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs font-mono text-[var(--text-color)] focus:outline-none focus:border-[#5ea8ff] w-full h-20 transition-all placeholder-[var(--muted-color)]/30 hover:border-[var(--border-hover)] resize-none scrollbar-thin";
  const labelCls = "text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.12em] mb-2 block";
  
  const baseBtnCls = "py-2.5 text-white text-[11px] font-semibold tracking-wide rounded-xl transition-all active:scale-95 duration-200 text-center flex-1 min-w-0";
  const generateBtnCls = `${baseBtnCls} bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.35)]`;
  const animateBtnCls = `${baseBtnCls} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.35)]`;
  const clearBtnCls = "px-4 py-2 bg-[var(--pill-btn-bg)] border border-[var(--pill-btn-border)] hover:bg-[var(--pill-btn-hover)] hover:text-rose-400 hover:border-rose-500/25 text-[var(--muted-color)] text-xs font-semibold tracking-wide rounded-xl transition-all active:scale-95 duration-200 text-center w-full shadow-sm";

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl backdrop-blur-xl mb-4 space-y-5 hover:border-[var(--border-hover)] transition-all">
      {/* Preset Dropdown */}
      <div>
        <span className={labelCls}>Load Preset Tree</span>
        <select 
          onChange={(e) => handleSelectPreset(e.target.value)} 
          defaultValue=""
          className={selectCls}
        >
          <option value="" disabled>Select Preset...</option>
          <option value="balanced">▼ Balanced BST</option>
          <option value="leftSkewed">▼ Left Skewed BST</option>
          <option value="rightSkewed">▼ Right Skewed BST</option>
          <option value="complete">▼ Complete BST</option>
          <option value="random">▼ Random BST</option>
        </select>
      </div>

      {/* Input Box */}
      <div>
        <span className={labelCls}>Bulk Node Values</span>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="Enter values separated by commas, spaces, or newlines (e.g. 50, 30, 70)..."
          className={textareaCls}
        />
      </div>

      {/* Generate Actions */}
      <div className="flex gap-3">
        <button 
          onClick={() => executeGeneration(false)} 
          className={generateBtnCls}
          title="Build the tree instantly without animation"
        >
          Generate Tree
        </button>
        <button 
          onClick={() => executeGeneration(true)} 
          className={animateBtnCls}
          title="Animate the insertion of values one-by-one"
        >
          Animate Insert
        </button>
      </div>

      {/* Clear Action */}
      <button onClick={handleClear} className={clearBtnCls}>
        Clear Input
      </button>

      {/* Parsed Info Feedback */}
      {parsedInfo && (
        <div className={`p-3 rounded-xl border text-[10px] font-semibold flex flex-col gap-1 ${
          parsedInfo.count > 0 
            ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400' 
            : 'bg-rose-500/5 border-rose-500/15 text-rose-400'
        }`}>
          <span>✓ Parsed {parsedInfo.count} valid nodes.</span>
          {parsedInfo.ignored.length > 0 && (
            <span className="text-amber-400">
              ⚠ Ignored invalid tokens: {parsedInfo.ignored.map(t => `'${t}'`).join(', ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
