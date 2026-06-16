import { useState } from 'react';
import { useGraphStore } from '../stores/useGraphStore';
import { 
  generateAddVertexSteps, 
  generateAddEdgeSteps, 
  generateRemoveVertexSteps, 
  generateRemoveEdgeSteps, 
  generateSearchEdgeSteps 
} from '../operations/stepEngine';

type OperationType = 'Add Vertex' | 'Add Edge' | 'Remove Vertex' | 'Remove Edge' | 'Search Edge';

export function OperationsPanel() {
  const { 
    nodes, edges, graphType, setSteps, setStats, currentPreset,
    addVertex, addEdge, removeVertex, removeEdge,
    setGraphData, setPlaying
  } = useGraphStore();
  const [activeOp, setActiveOp] = useState<OperationType | null>(null);

  // Form states
  const [label, setLabel] = useState('');
  const [src, setSrc] = useState('');
  const [dest, setDest] = useState('');
  const [weight, setWeight] = useState('');
  
  // Bug 4 state
  const [recentlyAddedVertex, setRecentlyAddedVertex] = useState<string | null>(null);

  const handleClear = () => {
    setGraphData([], [], {});
    setSteps([]);
    setStats(null);
    setPlaying(false);
    setActiveOp(null);
  };

  const handleVisualize = () => {
    let steps: any[] = [];
    let timeC = 'O(1)';
    let spaceC = 'O(1)';
    let result = '';

    if (activeOp === 'Add Vertex') {
      if (!label) return;
      
      steps = generateAddVertexSteps(label, nodes, edges, graphType.directed, graphType.weighted);
      addVertex(label);
      setRecentlyAddedVertex(label);
      
      timeC = 'O(1)';
      spaceC = 'O(1)';
      result = steps[steps.length - 1].description;
    } 
    else if (activeOp === 'Add Edge') {
      if (!src || !dest) return;
      steps = generateAddEdgeSteps(src, dest, weight, nodes, edges, graphType.directed, graphType.weighted);
      addEdge(src, dest, weight ? parseInt(weight, 10) : undefined);
      
      timeC = 'O(1)';
      spaceC = 'O(1)';
      result = steps[steps.length - 1].description;
    }
    else if (activeOp === 'Remove Vertex') {
      if (!src) return;
      steps = generateRemoveVertexSteps(src, nodes, edges, graphType.directed, graphType.weighted);
      removeVertex(src);
      
      timeC = 'O(V + E)';
      spaceC = 'O(1)';
      result = steps[steps.length - 1].description;
    }
    else if (activeOp === 'Remove Edge') {
      if (!src || !dest) return;
      steps = generateRemoveEdgeSteps(src, dest, nodes, edges, graphType.directed, graphType.weighted);
      removeEdge(src, dest);
      
      timeC = 'O(E)';
      spaceC = 'O(1)';
      result = steps[steps.length - 1].description;
    }
    else if (activeOp === 'Search Edge') {
      if (!src || !dest) return;
      steps = generateSearchEdgeSteps(src, dest, nodes, edges, graphType.directed, graphType.weighted);
      timeC = 'O(E)';
      spaceC = 'O(1)';
      result = steps[steps.length - 1].description;
    }

    setSteps(steps);
    setStats({
      operation: activeOp || '',
      timeComplexity: timeC,
      spaceComplexity: spaceC,
      stepsTaken: steps.length,
      result: result
    });
  };

  if (!currentPreset) return null;

  return (
    <div className="w-full flex flex-col flex-shrink-0 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
          <span className="text-blue-500">⚙️</span> Operations
        </h2>
        <button 
          onClick={handleClear}
          className="text-[10px] font-semibold uppercase tracking-[0.06em] bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors cursor-pointer"
        >
          Clear Canvas
        </button>
      </div>
      
      <div className="w-full">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { id: 'Add Vertex', icon: '➕' },
            { id: 'Add Edge', icon: '🔗' },
            { id: 'Remove Vertex', icon: '🗑️' },
            { id: 'Remove Edge', icon: '✂️' },
            { id: 'Search Edge', icon: '🔍' }
          ].map(op => {
            const isSelected = activeOp === op.id;
            return (
              <button
                key={op.id}
                onClick={() => { setActiveOp(op.id as OperationType); setLabel(''); setSrc(''); setDest(''); setWeight(''); setRecentlyAddedVertex(null); }}
                className={`flex flex-col items-center justify-center h-[40px] rounded-[8px] border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-500 border-blue-400 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]' 
                    : 'bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--muted-color)] hover:border-[var(--border-hover)] hover:text-[var(--text-color)]'
                }`}
              >
                <span className="text-[14px] leading-none mb-1">{op.icon}</span>
                <span className="text-[10px] uppercase font-semibold tracking-[0.06em] leading-none">
                  {op.id}
                </span>
              </button>
            );
          })}
        </div>
        
        {!activeOp && (
          <p className="text-[13px] text-center text-[var(--muted-color)] mt-4 animate-fadeInUp font-normal leading-[1.7]">
            Select an operation above to configure
          </p>
        )}

        {/* Input Form sliding container */}
        <div className={`transition-all duration-300 overflow-hidden ${activeOp ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {activeOp && (
            <div className="space-y-3 bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--border-color)]">
              {activeOp === 'Add Vertex' && (
                <div className="mb-3">
                  <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Vertex Label</label>
                  <input 
                    type="text" 
                    value={label} 
                    onChange={e => setLabel(e.target.value.toUpperCase().slice(0, 3))}
                    placeholder="e.g. Z"
                    className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-3 text-[13px] text-[var(--text-color)] outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              )}

              {(activeOp === 'Add Edge' || activeOp === 'Remove Edge' || activeOp === 'Search Edge') && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Source Node</label>
                    <select value={src} onChange={e => setSrc(e.target.value)} className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none">
                      <option value="" className="font-sans text-[13px]">Select...</option>
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Target Node</label>
                    <select value={dest} onChange={e => setDest(e.target.value)} className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none">
                      <option value="" className="font-sans text-[13px]">Select...</option>
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                    </select>
                  </div>
                  {activeOp === 'Add Edge' && graphType.weighted && (
                    <div className="col-span-2 mt-1">
                      <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Weight (Optional)</label>
                      <input 
                        type="number" 
                        value={weight} 
                        onChange={e => setWeight(e.target.value)}
                        placeholder="e.g. 5"
                        className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-3 text-[13px] text-[var(--text-color)] outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeOp === 'Remove Vertex' && (
                <div className="mb-3">
                  <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Select Node</label>
                  <select value={src} onChange={e => setSrc(e.target.value)} className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none">
                    <option value="" className="font-sans text-[13px]">Select...</option>
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                  </select>
                </div>
              )}

              <button 
                onClick={handleVisualize}
                disabled={
                  (activeOp === 'Add Vertex' && !label) ||
                  (activeOp === 'Remove Vertex' && !src) ||
                  ((activeOp === 'Add Edge' || activeOp === 'Remove Edge' || activeOp === 'Search Edge') && (!src || !dest))
                }
                className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-[var(--border-color)] disabled:text-[var(--muted-color)] disabled:cursor-not-allowed text-white font-semibold h-[36px] rounded-[6px] transition-all text-[11px] uppercase tracking-[0.06em] shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:shadow-none mt-2 cursor-pointer"
              >
                Visualize
              </button>

              {/* Follow-up connections panel */}
              {activeOp === 'Add Vertex' && recentlyAddedVertex && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl animate-fadeInUp">
                  <h3 className="text-[10px] font-semibold text-blue-400 uppercase tracking-[0.08em] mb-2 flex justify-between items-center">
                    <span>Connect {recentlyAddedVertex}</span>
                    <button 
                      onClick={() => setRecentlyAddedVertex(null)}
                      className="text-[var(--muted-color)] hover:text-red-400 transition-colors cursor-pointer"
                      title="Dismiss"
                    >✕</button>
                  </h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent">
                    {nodes.filter(n => n.id !== recentlyAddedVertex).map(n => (
                      <div key={n.id} className="flex items-center gap-2 bg-[var(--panel-bg)] p-2 rounded-[6px] border border-[var(--border-color)] hover:border-blue-500/50 transition-colors">
                        <span className="text-[13px] font-mono font-bold w-6 text-[var(--text-color)]">{n.id}</span>
                        {graphType.weighted && (
                          <input 
                            type="number" 
                            placeholder="W" 
                            className="w-12 h-[24px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[4px] px-1 text-[11px] text-center font-mono outline-none focus:border-blue-500 transition-colors text-[var(--text-color)]"
                            id={`weight-${n.id}`}
                          />
                        )}
                        <button 
                          onClick={(e) => {
                            const btn = e.currentTarget;
                            const wInput = document.getElementById(`weight-${n.id}`) as HTMLInputElement;
                            const w = wInput?.value ? parseInt(wInput.value, 10) : undefined;
                            addEdge(recentlyAddedVertex, n.id, w);
                            btn.textContent = '✓ Added';
                            btn.classList.add('bg-green-500', 'text-white', 'pointer-events-none');
                            btn.classList.remove('bg-blue-500/20', 'text-blue-400');
                          }}
                          className="ml-auto px-2 py-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white text-[10px] font-semibold uppercase tracking-[0.06em] rounded transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                    {nodes.length <= 1 && (
                      <p className="text-[12px] text-[var(--muted-color)] text-center py-2 font-normal">No other vertices to connect to.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
