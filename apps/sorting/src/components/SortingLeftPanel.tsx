import { useState } from 'react';
import { useSortingStore } from '../stores/useSortingStore';
import { generateBubbleSortSteps } from '../algorithms/bubbleSort';
import { generateSelectionSortSteps } from '../algorithms/selectionSort';
import { generateInsertionSortSteps } from '../algorithms/insertionSort';
import { generateMergeSortSteps } from '../algorithms/mergeSort';
import { generateQuickSortSteps } from '../algorithms/quickSort';

export function SortingLeftPanel({ onCollapse }: { onCollapse?: () => void }) {
  const {
    array,
    arraySize,
    inputMode,
    selectedAlgorithm,
    playing,
    setArray,
    setArraySize,
    setInputMode,
    setSelectedAlgorithm,
    generateArray,
  } = useSortingStore();

  const [activeTab, setActiveTab] = useState<'array' | 'algorithm'>('array');
  const [customText, setCustomText] = useState('');
  const [customError, setCustomError] = useState('');

  const handleCustomLoad = () => {
    setCustomError('');
    const parts = customText.split(',').map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length === 0) {
      setCustomError('Please enter some numbers.');
      return;
    }
    const nums: number[] = [];

    for (let part of parts) {
      const num = parseInt(part, 10);
      if (isNaN(num)) {
        setCustomError(`Invalid character/number: "${part}"`);
        return;
      }
      if (num < 1 || num > 100) {
        setCustomError('Numbers must be between 1 and 100 for visualization.');
        return;
      }
      nums.push(num);
    }

    if (nums.length < 2) {
      setCustomError('Please enter at least 2 numbers.');
      return;
    }
    if (nums.length > 50) {
      setCustomError('Maximum array size is 50 elements.');
      return;
    }

    setArray(nums);
    setArraySize(nums.length);
  };

  const handleRunAlgorithm = () => {
    if (!selectedAlgorithm) return;

    // Generate fresh steps from current array
    const currentArray = [...array];
    let newSteps: any[] = [];

    if (selectedAlgorithm === 'bubble')
      newSteps = generateBubbleSortSteps(currentArray);
    else if (selectedAlgorithm === 'selection')
      newSteps = generateSelectionSortSteps(currentArray);
    else if (selectedAlgorithm === 'insertion')
      newSteps = generateInsertionSortSteps(currentArray);
    else if (selectedAlgorithm === 'merge')
      newSteps = generateMergeSortSteps(currentArray);
    else if (selectedAlgorithm === 'quick')
      newSteps = generateQuickSortSteps(currentArray);

    // Load steps then play
    useSortingStore.getState().setSteps(newSteps);
    useSortingStore.getState().setCur(0);
    setTimeout(() => {
      useSortingStore.getState().setPlaying(true);
    }, 50);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden font-sans gap-4">
      {/* Home / Porting links */}
      <div className="flex items-center shrink-0">
        <a
          href="/sorting"
          onClick={(e) => {
            e.preventDefault();
            useSortingStore.getState().setPlaying(false);
            window.history.pushState(null, '', '/sorting');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="px-3 py-2 text-[10px] font-sans uppercase tracking-[0.06em] text-[var(--muted-color)] hover:text-blue-400 transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-1"
        >
          ← SORTING HOME
        </a>
        
        {/* Collapse button */}
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="w-[28px] h-[28px] ml-auto flex items-center justify-center rounded-[6px] border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors"
            title="Collapse panel"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[8px] p-1 relative flex-shrink-0">
        <div 
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[6px] transition-all duration-300 ease-out shadow-sm ${
            activeTab === 'array' ? 'left-1 bg-emerald-500' : 'left-[calc(50%+2px)] bg-blue-500'
          }`} 
        />
        <button 
          onClick={() => setActiveTab('array')}
          className={`flex-1 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-300 rounded-[6px] relative z-10 ${
            activeTab === 'array' ? 'text-white' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
          }`}
        >
          Array
        </button>
        <button 
          onClick={() => setActiveTab('algorithm')}
          className={`flex-1 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-300 rounded-[6px] relative z-10 ${
            activeTab === 'algorithm' ? 'text-white' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
          }`}
        >
          Algorithm
        </button>
      </div>

      <div className="flex-grow flex flex-col gap-4 overflow-y-auto no-scrollbar relative min-h-0">
        {activeTab === 'array' ? (
          <div className="space-y-4 animate-slideInLeft">
            {/* Array Size */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">Array Size</h3>
                <span className="text-[12px] font-mono font-bold text-emerald-400">{arraySize} elements</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={arraySize}
                disabled={playing || inputMode === 'custom'}
                onChange={(e) => setArraySize(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
              />
            </div>

            {/* Input Type */}
            <div>
              <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] mb-2">Array Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'random', label: 'Random' },
                  { id: 'custom', label: 'Custom' },
                  { id: 'nearly-sorted', label: 'Nearly Sorted' },
                  { id: 'reverse', label: 'Reverse' },
                  { id: 'few-unique', label: 'Few Unique' },
                ].map((type) => {
                  const isActive = inputMode === type.id;
                  return (
                    <button
                      key={type.id}
                      disabled={playing}
                      onClick={() => setInputMode(type.id as any)}
                      className={`py-1.5 text-[10px] uppercase font-semibold tracking-[0.06em] rounded-md border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--muted-color)] hover:border-[var(--border-hover)] hover:text-[var(--text-color)]'
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom input panel */}
            {inputMode === 'custom' && (
              <div className="space-y-2 bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--border-color)] animate-fadeInUp">
                <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em]">
                  Comma Separated Values
                </label>
                <textarea
                  value={customText}
                  disabled={playing}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. 15, 34, 8, 92, 45, 60"
                  className="w-full h-20 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-2 font-mono text-xs text-[var(--text-color)] outline-none focus:border-emerald-500 transition-colors resize-none"
                />
                {customError && <p className="text-[10px] text-red-400 font-medium">{customError}</p>}
                <button
                  onClick={handleCustomLoad}
                  disabled={playing || !customText}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-1.5 rounded-lg text-[10px] uppercase tracking-[0.06em] transition-colors cursor-pointer"
                >
                  Load Array
                </button>
              </div>
            )}

            {/* Regenerate Button */}
            {inputMode !== 'custom' && (
              <button
                onClick={generateArray}
                disabled={playing}
                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 hover:bg-emerald-500/10 text-[var(--text-color)] font-semibold py-2 rounded-lg text-[10px] uppercase tracking-[0.06em] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                🔀 Regenerate Array
              </button>
            )}

            {/* Array Preview */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] mb-2">
                Current Array
              </h3>
              <div className="flex gap-1 overflow-x-auto p-1 bg-black/10 rounded-lg border border-[var(--border-color)] max-w-full scrollbar-thin">
                {array.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-8 h-8 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-slideInRight">
            {/* Algorithm selector cards */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] mb-1">
                Select Algorithm
              </h3>
              {[
                { id: 'bubble', name: '🫧 Bubble Sort', time: 'O(n²)', space: 'O(1)', desc: 'Repeatedly swap adjacent elements if out of order' },
                { id: 'selection', name: '🔍 Selection Sort', time: 'O(n²)', space: 'O(1)', desc: 'Find minimum element and place at front' },
                { id: 'insertion', name: '🃏 Insertion Sort', time: 'O(n²)', space: 'O(1)', desc: 'Insert each element in its correct position' },
                { id: 'merge', name: '🔀 Merge Sort', time: 'O(n log n)', space: 'O(n)', desc: 'Divide, sort halves, then merge recursively' },
                { id: 'quick', name: '⚡ Quick Sort', time: 'O(n log n)', space: 'O(log n)', desc: 'Partition around pivot recursively' },
              ].map((algo) => {
                const isSelected = selectedAlgorithm === algo.id;
                return (
                  <div
                    key={algo.id}
                    onClick={() => !playing && setSelectedAlgorithm(algo.id)}
                    className={`p-3 rounded-xl border transition-all duration-200 ${
                      playing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500'
                        : 'bg-[var(--input-bg)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[12px] font-bold ${isSelected ? 'text-blue-400' : 'text-[var(--text-color)]'}`}>
                        {algo.name}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mb-1.5">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-[0.06em] bg-amber-500/20 text-amber-400">
                        {algo.time}
                      </span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-[0.06em] bg-purple-500/20 text-purple-400">
                        {algo.space}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--muted-color)] leading-snug">{algo.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Run button */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={handleRunAlgorithm}
                disabled={!selectedAlgorithm || playing}
                className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-[var(--border-color)] disabled:text-[var(--muted-color)] disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-[11px] uppercase tracking-[0.06em] shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:shadow-none cursor-pointer transition-all"
              >
                ▶ Run Algorithm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
