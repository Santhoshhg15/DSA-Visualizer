import { useState, useEffect } from 'react';
import { useGraphStore } from '../stores/useGraphStore';
import { graphPresets } from '../data/graphPresets';

export function PresetSelector() {
  const { currentPreset, loadPreset } = useGraphStore();
  const [isExpanded, setIsExpanded] = useState(!currentPreset);

  // Custom Builder State
  const [isBuildingCustom, setIsBuildingCustom] = useState(false);
  const [customDirected, setCustomDirected] = useState(false);
  const [customWeighted, setCustomWeighted] = useState(false);
  
  const [nodeLabel, setNodeLabel] = useState('');
  const [customNodes, setCustomNodes] = useState<{id: string, label: string}[]>([]);
  
  const [edgeSrc, setEdgeSrc] = useState('');
  const [edgeDest, setEdgeDest] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('');
  const [customEdges, setCustomEdges] = useState<{id: string, source: string, target: string, weight?: number}[]>([]);

  // Auto-collapse on initial preset load
  useEffect(() => {
    if (currentPreset && currentPreset !== 'custom-graph') {
      setIsExpanded(false);
      setIsBuildingCustom(false);
    }
  }, [currentPreset]);

  const resetCustomState = () => {
    setCustomDirected(false);
    setCustomWeighted(false);
    setNodeLabel('');
    setCustomNodes([]);
    setEdgeSrc('');
    setEdgeDest('');
    setEdgeWeight('');
    setCustomEdges([]);
  };

  const handleSelect = (preset: any) => {
    setIsBuildingCustom(false);
    loadPreset(preset.id, {
      nodes: preset.nodes,
      edges: preset.edges,
      directed: preset.directed,
      weighted: preset.weighted,
      positions: preset.defaultPositions || preset.positions
    });
    setIsExpanded(false);
  };

  const handleAddNode = () => {
    if (!nodeLabel) return;
    const label = nodeLabel.toUpperCase().slice(0, 3);
    if (!customNodes.find(n => n.id === label)) {
      setCustomNodes([...customNodes, { id: label, label }]);
    }
    setNodeLabel('');
  };

  const handleRemoveNode = (id: string) => {
    setCustomNodes(customNodes.filter(n => n.id !== id));
    setCustomEdges(customEdges.filter(e => e.source !== id && e.target !== id));
    if (edgeSrc === id) setEdgeSrc('');
    if (edgeDest === id) setEdgeDest('');
  };

  const handleAddEdge = () => {
    if (!edgeSrc || !edgeDest) return;
    const w = edgeWeight ? parseInt(edgeWeight, 10) : undefined;
    const newEdge = { 
      id: `${edgeSrc}-${edgeDest}-${Date.now()}`, 
      source: edgeSrc, 
      target: edgeDest, 
      ...(customWeighted && w !== undefined ? { weight: w } : {}) 
    };
    setCustomEdges([...customEdges, newEdge]);
    setEdgeSrc('');
    setEdgeDest('');
    setEdgeWeight('');
  };

  const handleRemoveEdge = (id: string) => {
    setCustomEdges(customEdges.filter(e => e.id !== id));
  };

  const handleLoadCustomGraph = () => {
    if (customNodes.length < 2 || customEdges.length < 1) return;

    const centerX = 600;
    const centerY = 350;
    const radius = 180;
    const positions: Record<string, {x: number, y: number}> = {};
    
    customNodes.forEach((node, i) => {
      const angle = (i / customNodes.length) * 2 * Math.PI;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    handleSelect({
      id: 'custom-graph',
      name: 'Custom Graph',
      directed: customDirected,
      weighted: customWeighted,
      nodes: customNodes,
      edges: customEdges,
      positions
    });
    resetCustomState();
  };

  const handleCancelCustom = () => {
    setIsBuildingCustom(false);
    resetCustomState();
  };

  const selectedData = currentPreset === 'custom-graph' 
    ? { name: 'Custom Graph', directed: useGraphStore.getState().graphType.directed, weighted: useGraphStore.getState().graphType.weighted }
    : graphPresets.find(p => p.id === currentPreset);

  return (
    <div className="w-full flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
          <span className="text-emerald-500">🎯</span> Graph
        </h2>
        {!isExpanded && !isBuildingCustom && (
          <button 
            onClick={() => setIsExpanded(true)}
            className="text-[10px] font-semibold uppercase tracking-[0.06em] bg-[var(--input-bg)] border border-[var(--border-color)] px-2.5 py-1 rounded text-[var(--text-color)] hover:bg-[var(--border-hover)] transition-colors cursor-pointer"
          >
            Change
          </button>
        )}
      </div>

      <div className="space-y-2">
        {isBuildingCustom ? (
          <div className="space-y-3 bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--border-color)] animate-fadeInUp">
            
            {/* STEP 1: Graph Type */}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-between cursor-pointer group px-2 py-1.5 border border-[var(--border-color)] rounded-[6px] hover:border-[var(--border-hover)] transition-colors">
                <span className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em]">Directed</span>
                <input 
                  type="checkbox" 
                  checked={customDirected}
                  onChange={(e) => setCustomDirected(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[var(--border-color)] bg-[var(--panel-bg)] text-blue-500 focus:ring-blue-500 focus:ring-offset-[var(--panel-bg)] cursor-pointer"
                />
              </label>
              <label className="flex-1 flex items-center justify-between cursor-pointer group px-2 py-1.5 border border-[var(--border-color)] rounded-[6px] hover:border-[var(--border-hover)] transition-colors">
                <span className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em]">Weighted</span>
                <input 
                  type="checkbox" 
                  checked={customWeighted}
                  onChange={(e) => setCustomWeighted(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[var(--border-color)] bg-[var(--panel-bg)] text-purple-500 focus:ring-purple-500 focus:ring-offset-[var(--panel-bg)] cursor-pointer"
                />
              </label>
            </div>

            {/* STEP 2: Add Nodes */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Add Nodes</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={nodeLabel} 
                  onChange={e => setNodeLabel(e.target.value.toUpperCase().slice(0, 3))}
                  onKeyDown={e => e.key === 'Enter' && handleAddNode()}
                  placeholder="Label (e.g. A)"
                  className="flex-1 font-mono h-[32px] bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-emerald-500 transition-colors"
                />
                <button 
                  onClick={handleAddNode}
                  disabled={!nodeLabel}
                  className="px-3 bg-[var(--panel-bg)] hover:bg-emerald-500/20 text-[var(--text-color)] hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)] rounded-[6px] text-[10px] font-semibold uppercase tracking-[0.06em] transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>
              {customNodes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {customNodes.map(n => (
                    <div key={n.id} className="flex items-center gap-1 bg-[var(--panel-bg)] border border-emerald-500/30 rounded-full px-2 py-0.5">
                      <span className="text-[11px] font-mono font-bold text-emerald-400">{n.id}</span>
                      <button onClick={() => handleRemoveNode(n.id)} className="text-[10px] text-[var(--muted-color)] hover:text-red-400 cursor-pointer">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 3: Add Edges */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <label className="block text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.06em] mb-1">Add Edges</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select value={edgeSrc} onChange={e => setEdgeSrc(e.target.value)} className="w-full h-[32px] bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none font-mono">
                  <option value="">Source...</option>
                  {customNodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
                <select value={edgeDest} onChange={e => setEdgeDest(e.target.value)} className="w-full h-[32px] bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none font-mono">
                  <option value="">Target...</option>
                  {customNodes.filter(n => n.id !== edgeSrc).map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                {customWeighted && (
                  <input 
                    type="number" 
                    value={edgeWeight} 
                    onChange={e => setEdgeWeight(e.target.value)}
                    placeholder="Weight"
                    className="w-20 font-mono h-[32px] bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] px-2 text-[13px] text-[var(--text-color)] outline-none focus:border-emerald-500 transition-colors"
                  />
                )}
                <button 
                  onClick={handleAddEdge}
                  disabled={!edgeSrc || !edgeDest}
                  className="flex-1 bg-[var(--panel-bg)] hover:bg-emerald-500/20 text-[var(--text-color)] hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)] rounded-[6px] text-[10px] font-semibold uppercase tracking-[0.06em] transition-colors cursor-pointer"
                >
                  + Add Edge
                </button>
              </div>
              
              {customEdges.length > 0 && (
                <div className="mt-2 space-y-1.5 max-h-[100px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent">
                  {customEdges.map(e => (
                    <div key={e.id} className="flex items-center justify-between bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[4px] px-2 py-1">
                      <div className="font-mono text-[11px] text-[var(--text-color)]">
                        {e.source} <span className="text-[var(--muted-color)]">{customDirected ? '→' : '—'}</span> {e.target}
                        {customWeighted && e.weight !== undefined && <span className="text-purple-400 ml-2">[w:{e.weight}]</span>}
                      </div>
                      <button onClick={() => handleRemoveEdge(e.id)} className="text-[10px] text-[var(--muted-color)] hover:text-red-400 cursor-pointer">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 4: Load & Cancel */}
            <div className="pt-3">
              <button 
                onClick={handleLoadCustomGraph}
                disabled={customNodes.length < 2 || customEdges.length < 1}
                className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-[var(--border-color)] disabled:text-[var(--muted-color)] disabled:cursor-not-allowed text-white font-bold h-[36px] rounded-[6px] transition-all text-sm shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:shadow-none cursor-pointer"
              >
                <span className="text-[11px] font-semibold tracking-[0.06em] uppercase">Load Graph</span>
              </button>
              <div className="text-center mt-2">
                <button onClick={handleCancelCustom} className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-color)] hover:text-[var(--text-color)] underline transition-colors cursor-pointer bg-transparent border-0">
                  Cancel
                </button>
              </div>
            </div>

          </div>
        ) : isExpanded ? (
          <>
            {graphPresets.map((preset) => {
              const isSelected = currentPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelect(preset)}
                  title={preset.description}
                  className={`w-full flex items-center justify-between h-[44px] px-3 rounded-[8px] border transition-all duration-150 ease-out group hover:translate-x-[3px] cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-500/10 border-emerald-500/50 border-l-4 shadow-sm' 
                      : 'bg-[var(--input-bg)] border-[var(--border-color)] border-l-[3px] border-l-transparent hover:border-[var(--border-hover)] hover:bg-[var(--bg-gradient-1)]'
                  }`}
                >
                  <span className={`text-[14px] font-semibold transition-colors ${isSelected ? 'text-emerald-400' : 'text-[var(--text-color)] group-hover:text-emerald-400'}`}>
                    {preset.name}
                  </span>
                  
                  <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] uppercase tracking-[0.06em] ${preset.directed ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {preset.directed ? 'DIR' : 'UNDIR'}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] uppercase tracking-[0.06em] ${preset.weighted ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {preset.weighted ? 'WGT' : 'UNWGT'}
                    </span>
                  </div>
                </button>
              );
            })}
            
            {/* Build Your Own Option */}
            <button
              onClick={() => {
                setIsBuildingCustom(true);
                setIsExpanded(false);
              }}
              className="w-full flex items-center justify-center h-[44px] px-3 rounded-[8px] border border-dashed border-[var(--border-color)] bg-[var(--input-bg)] hover:bg-[var(--bg-gradient-1)] hover:border-emerald-500/50 transition-all duration-150 ease-out group cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-[var(--muted-color)] group-hover:text-emerald-400 tracking-[0.04em] uppercase">
                + Build Your Own
              </span>
            </button>
          </>
        ) : selectedData ? (
          <div className="flex flex-col gap-2">
            <div className="w-full flex items-center justify-between h-[44px] px-3 rounded-[8px] border bg-emerald-500/10 border-emerald-500/50 border-l-[3px]">
              <span className="text-[14px] font-semibold text-emerald-400">
                {selectedData.name}
              </span>
            </div>
            {/* Graph Type Pills */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] text-[9px] font-bold tracking-[0.06em] text-[var(--muted-color)] uppercase">
                {selectedData.directed ? '➡️ DIRECTED' : '↔️ UNDIRECTED'}
              </div>
              <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] text-[9px] font-bold tracking-[0.06em] text-[var(--muted-color)] uppercase">
                {selectedData.weighted ? '⚖️ WEIGHTED' : '➖ UNWEIGHTED'}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
