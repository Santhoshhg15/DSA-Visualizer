import { useState } from 'react';
import { useGraphStore } from '../stores/useGraphStore';

type ModType = 'Add Vertex' | 'Add Edge' | 'Remove Vertex' | 'Remove Edge' | 'Edit Weight' | 'Flip Edge' | 'Graph Settings';

export function ModifyPanel() {
  const { 
    nodes, graphType, 
    addVertex, addEdge, removeVertex, removeEdge, updateEdgeWeight, toggleEdgeDirection, setGraphType
  } = useGraphStore();
  
  const [activeMod, setActiveMod] = useState<ModType | null>(null);

  // Form states
  const [label, setLabel] = useState('');
  const [src, setSrc] = useState('');
  const [dest, setDest] = useState('');
  const [weight, setWeight] = useState('');

  const handleAction = () => {
    if (activeMod === 'Add Vertex') {
      if (!label) return;
      addVertex(label);
      setLabel('');
    } 
    else if (activeMod === 'Add Edge') {
      if (!src || !dest) return;
      addEdge(src, dest, weight ? parseInt(weight, 10) : undefined);
      setSrc(''); setDest(''); setWeight('');
    }
    else if (activeMod === 'Remove Vertex') {
      if (!src) return;
      removeVertex(src);
      setSrc('');
    }
    else if (activeMod === 'Remove Edge') {
      if (!src || !dest) return;
      removeEdge(src, dest);
      setSrc(''); setDest('');
    }
    else if (activeMod === 'Edit Weight') {
      if (!src || !dest || !weight) return;
      updateEdgeWeight(src, dest, parseInt(weight, 10));
      setSrc(''); setDest(''); setWeight('');
    }
    else if (activeMod === 'Flip Edge') {
      if (!src || !dest) return;
      toggleEdgeDirection(src, dest);
      setSrc(''); setDest('');
    }
  };

  return (
    <div className="w-full flex flex-col flex-shrink-0 animate-fadeInUp font-sans">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-purple-400 uppercase tracking-[0.08em] flex items-center gap-2">
          <span className="text-purple-500">✏️</span> Modify Graph
        </h2>
      </div>
      
      <div className="w-full">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { id: 'Add Vertex', icon: '➕' },
            { id: 'Add Edge', icon: '🔗' },
            { id: 'Remove Vertex', icon: '🗑️' },
            { id: 'Remove Edge', icon: '✂️' },
            { id: 'Edit Weight', icon: '⚖️' },
            { id: 'Flip Edge', icon: '🔄' },
            { id: 'Graph Settings', icon: '⚙️' }
          ].map(op => {
            const isSelected = activeMod === op.id;
            return (
              <button
                key={op.id}
                onClick={() => { setActiveMod(op.id as ModType); setLabel(''); setSrc(''); setDest(''); setWeight(''); }}
                className={`flex flex-col items-center justify-center h-[40px] rounded-[8px] border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-purple-500 border-purple-400 text-white shadow-[0_4px_12px_rgba(168,85,247,0.3)]' 
                    : 'bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--muted-color)] hover:border-purple-500/50 hover:text-[var(--text-color)]'
                }`}
              >
                <span className="text-[14px] leading-none mb-1">{op.icon}</span>
                <span className="text-[10px] uppercase font-semibold tracking-[0.06em] leading-none text-center">
                  {op.id}
                </span>
              </button>
            );
          })}
        </div>
        
        {!activeMod && (
          <p className="text-[13px] text-center text-[var(--muted-color)] mt-4 animate-fadeInUp font-normal leading-[1.7]">
            Select an action to modify the graph immediately.
          </p>
        )}

        <div className={`transition-all duration-300 overflow-hidden ${activeMod ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {activeMod && activeMod !== 'Graph Settings' && (
            <div className="space-y-3 bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--border-color)]">
              {activeMod === 'Add Vertex' && (
                <div className="mb-3">
                  <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Vertex Label</label>
                  <input 
                    type="text" 
                    value={label} 
                    onChange={e => setLabel(e.target.value.toUpperCase().slice(0, 3))}
                    placeholder="e.g. Z"
                    className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-3 text-[13px] text-[var(--text-color)] outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              )}

              {(['Add Edge', 'Remove Edge', 'Edit Weight', 'Flip Edge'].includes(activeMod)) && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Source</label>
                    <select value={src} onChange={e => setSrc(e.target.value)} className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none">
                      <option value="" className="font-sans text-[13px]">Select...</option>
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Target</label>
                    <select value={dest} onChange={e => setDest(e.target.value)} className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none">
                      <option value="" className="font-sans text-[13px]">Select...</option>
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                    </select>
                  </div>
                  {(activeMod === 'Add Edge' || activeMod === 'Edit Weight') && graphType.weighted && (
                    <div className="col-span-2 mt-1">
                      <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Weight</label>
                      <input 
                        type="number" 
                        value={weight} 
                        onChange={e => setWeight(e.target.value)}
                        placeholder="e.g. 5"
                        className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-3 text-[13px] text-[var(--text-color)] outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeMod === 'Remove Vertex' && (
                <div className="mb-3">
                  <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Select Node</label>
                  <select value={src} onChange={e => setSrc(e.target.value)} className="font-mono w-full h-[36px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none">
                    <option value="" className="font-sans text-[13px]">Select...</option>
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                  </select>
                </div>
              )}

              <button 
                onClick={handleAction}
                disabled={
                  (activeMod === 'Add Vertex' && !label) ||
                  (activeMod === 'Remove Vertex' && !src) ||
                  (activeMod === 'Edit Weight' && (!src || !dest || !weight)) ||
                  ((['Add Edge', 'Remove Edge', 'Flip Edge'].includes(activeMod)) && (!src || !dest))
                }
                className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-[var(--border-color)] disabled:text-[var(--muted-color)] disabled:cursor-not-allowed text-white font-semibold h-[36px] rounded-[6px] transition-all text-[11px] uppercase tracking-[0.06em] shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:shadow-none mt-2 cursor-pointer"
              >
                Execute
              </button>
            </div>
          )}

          {activeMod === 'Graph Settings' && (
            <div className="space-y-4 bg-[var(--input-bg)] p-4 rounded-xl border border-[var(--border-color)]">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[11px] font-semibold text-[var(--text-color)] uppercase tracking-[0.06em]">Directed Graph</span>
                <input 
                  type="checkbox" 
                  checked={graphType.directed}
                  onChange={(e) => setGraphType(e.target.checked, graphType.weighted)}
                  className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)] text-purple-500 focus:ring-purple-500 focus:ring-offset-[var(--panel-bg)] cursor-pointer"
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[11px] font-semibold text-[var(--text-color)] uppercase tracking-[0.06em]">Weighted Edges</span>
                <input 
                  type="checkbox" 
                  checked={graphType.weighted}
                  onChange={(e) => setGraphType(graphType.directed, e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)] text-purple-500 focus:ring-purple-500 focus:ring-offset-[var(--panel-bg)] cursor-pointer"
                />
              </label>

              <div className="text-[12px] font-normal leading-[1.6] text-orange-400/80 bg-orange-500/10 p-2 rounded border border-orange-500/20">
                ⚠️ Modifying these settings will immediately apply to all existing edges.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
