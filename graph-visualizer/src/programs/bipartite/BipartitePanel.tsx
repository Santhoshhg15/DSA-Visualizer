import { useEffect, useState } from 'react';
import { useBipartiteStore } from '../../stores/useBipartiteStore';
import { bipartitePresets } from './bipartitePresets';
import { generateBipartiteSteps } from './stepEngine';
import type { Node, Edge } from '../../stores/useGraphStore';
import { useIslandsStore } from '../../stores/useIslandsStore';
import { useCycleStore } from '../../stores/useCycleStore';
import { islandsPresets } from '../numberOfIslands/islandsPresets';
import { generateIslandsSteps } from '../numberOfIslands/stepEngine';
import { cyclePresets } from '../cycleDetection/cyclePresets';
import { generateCycleSteps } from '../cycleDetection/stepEngine';

export interface BipartitePanelProps {
  selectedProgram: 'islands' | 'cycle' | 'bipartite';
  setSelectedProgram: (prog: 'islands' | 'cycle' | 'bipartite') => void;
}

export function BipartitePanel({ selectedProgram, setSelectedProgram }: BipartitePanelProps) {
  const {
    graphType,
    setGraphType,
    currentPreset,
    loadPreset,
    setCustomGraph,
    setSteps,
    reset,
    nodes,
  } = useBipartiteStore();

  const [customNodes, setCustomNodes] = useState('A, B, C, D, E');
  const [customEdges, setCustomEdges] = useState('A-B\nB-C\nC-D');
  const [error, setError] = useState<string | null>(null);
  const [infoExpanded, setInfoExpanded] = useState(false);

  // Load first preset on mount
  useEffect(() => {
    if (!currentPreset) {
      handlePresetChange(
        graphType === 'directed' ? 'directed-bipartite-4' : 'simple-bipartite-4'
      );
    }
  }, []);

  const handlePresetChange = (presetId: string) => {
    const preset = bipartitePresets.find((p) => p.id === presetId);
    if (preset) {
      reset();
      loadPreset(preset.id, preset);
      const steps = generateBipartiteSteps(preset.nodes, preset.edges, preset.directed);
      setSteps(steps);
    }
  };

  const handleGraphTypeChange = (type: 'undirected' | 'directed') => {
    setGraphType(type);
    const isDirected = type === 'directed';
    const defaultPresetId = isDirected ? 'directed-bipartite-4' : 'simple-bipartite-4';
    handlePresetChange(defaultPresetId);

    if (isDirected) {
      setCustomEdges('A→B\nB→C\nC→D');
    } else {
      setCustomEdges('A-B\nB-C\nC-D');
    }
    setError(null);
  };

  const validateAndLoadCustom = () => {
    setError(null);

    // Parse Nodes
    const nodeList = customNodes
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (nodeList.length < 2) {
      setError('Minimum 2 nodes required.');
      return;
    }
    if (nodeList.length > 8) {
      setError('Maximum 8 nodes allowed.');
      return;
    }

    // Duplicate nodes check
    const nodeSet = new Set(nodeList);
    if (nodeSet.size !== nodeList.length) {
      setError('Duplicate node names are not allowed.');
      return;
    }

    // Parse Edges
    const edgeLines = customEdges
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    const edgesList: Edge[] = [];
    const edgeKeys = new Set<string>();

    for (const line of edgeLines) {
      const match = line.split(/[-→]/);
      if (match.length !== 2) {
        setError(`Invalid edge format: "${line}". Use A-B or A→B.`);
        return;
      }
      const u = match[0].trim();
      const v = match[1].trim();

      if (!nodeSet.has(u) || !nodeSet.has(v)) {
        setError(`Node in edge "${line}" does not exist in node list.`);
        return;
      }
      if (u === v) {
        setError(`Self-loops are not allowed: "${line}".`);
        return;
      }

      // Check duplicates
      const key = graphType === 'directed' ? `${u}->${v}` : [u, v].sort().join('-');
      if (edgeKeys.has(key)) {
        setError(`Duplicate edge detected: "${line}".`);
        return;
      }
      edgeKeys.add(key);

      edgesList.push({
        id: `${u}-${v}`,
        source: u,
        target: v,
      });
    }

    if (edgesList.length < 1) {
      setError('Minimum 1 edge required.');
      return;
    }

    // Circular Auto Layout
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 600;
    const centerY = 350;
    const radius = 180;
    const total = nodeList.length;

    nodeList.forEach((n, i) => {
      const angle = (i / total) * 2 * Math.PI;
      positions[n] = {
        x: Math.round(centerX + radius * Math.cos(angle)),
        y: Math.round(centerY + radius * Math.sin(angle)),
      };
    });

    const parsedNodes: Node[] = nodeList.map((id) => ({ id, label: id }));

    reset();
    setCustomGraph(parsedNodes, edgesList, positions, graphType === 'directed');

    // Automatically generate steps and load them
    const steps = generateBipartiteSteps(parsedNodes, edgesList, graphType === 'directed');
    setSteps(steps);
  };

  const runAlgorithm = () => {
    if (nodes.length === 0) return;
    const store = useBipartiteStore.getState();
    const steps = generateBipartiteSteps(store.nodes, store.edges, store.directed);
    setSteps(steps);
  };

  // Filter presets matching current type
  const isDirected = graphType === 'directed';
  const presetsForType = bipartitePresets.filter((p) => p.directed === isDirected);

  const bipartiteGroup = presetsForType.filter((p) => p.expectedResult === true);
  const nonBipartiteGroup = presetsForType.filter((p) => p.expectedResult === false);

  // External programs handlers
  const handleIslandPresetChange = (presetId: string) => {
    const preset = islandsPresets.find((p) => p.id === presetId);
    if (preset) {
      useIslandsStore.getState().reset();
      useIslandsStore.getState().loadPreset(preset.id, preset.grid);
      const steps = generateIslandsSteps(preset.grid, useIslandsStore.getState().version);
      useIslandsStore.getState().setSteps(steps);
    }
  };

  const handleCyclePresetChange = (presetId: string) => {
    const preset = cyclePresets.find((p) => p.id === presetId);
    if (preset) {
      useCycleStore.getState().reset();
      useCycleStore.getState().loadPreset(preset.id, preset);
      const steps = generateCycleSteps(
        preset.nodes,
        preset.edges,
        useCycleStore.getState().algorithmType
      );
      useCycleStore.getState().setSteps(steps);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full h-full text-white animate-fadeInUp">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
          Active Program
        </h3>
      </div>

      {/* Program selector cards */}
      <div className="flex flex-col gap-3">
        {/* Card 1: Islands */}
        <button
          onClick={() => {
            setSelectedProgram('islands');
            const activePresetId = useIslandsStore.getState().selectedPreset || islandsPresets[0].id;
            handleIslandPresetChange(activePresetId);
          }}
          className={`p-3 border rounded-[10px] text-left transition-all relative overflow-hidden group w-full ${
            selectedProgram === 'islands'
              ? 'border-blue-500 bg-blue-500/10 shadow-md'
              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:border-blue-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="text-xl mt-0.5">🏝️</div>
            <div>
              <h4 className="font-bold text-white text-[13px]">Number of Islands</h4>
              <p className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono">
                Grid BFS • LeetCode #200
              </p>
            </div>
          </div>
        </button>

        {/* Card 2: Cycle Detection */}
        <button
          onClick={() => {
            setSelectedProgram('cycle');
            const activePresetId = useCycleStore.getState().currentPreset || cyclePresets[0].id;
            handleCyclePresetChange(activePresetId);
          }}
          className={`p-3 border rounded-[10px] text-left transition-all relative overflow-hidden group w-full ${
            selectedProgram === 'cycle'
              ? 'border-blue-500 bg-blue-500/10 shadow-md'
              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:border-blue-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="text-xl mt-0.5">🔄</div>
            <div>
              <h4 className="font-bold text-white text-[13px]">Cycle Detection</h4>
              <p className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono">
                Union-Find • DFS • BFS
              </p>
            </div>
          </div>
        </button>

        {/* Card 3: Bipartite Graph Check */}
        <button
          onClick={() => {
            setSelectedProgram('bipartite');
            if (!currentPreset && bipartitePresets.length > 0) {
              handlePresetChange(
                graphType === 'directed' ? 'directed-bipartite-4' : 'simple-bipartite-4'
              );
            }
          }}
          className={`p-3 border rounded-[10px] text-left transition-all relative overflow-hidden group w-full ${
            selectedProgram === 'bipartite'
              ? 'border-blue-500 bg-blue-500/10 shadow-md'
              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:border-blue-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="text-xl mt-0.5">🎨</div>
            <div>
              <h4 className="font-bold text-white text-[13px]">Bipartite Graph Check</h4>
              <p className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono">
                BFS 2-Coloring • Undirected + Directed
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="h-px w-full bg-[var(--border-color)] opacity-50 my-2"></div>

      {/* SECTION 1 — Graph Type Toggle */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
          Graph Type
        </h3>
        <div className="flex bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-1 relative">
          <button
            onClick={() => handleGraphTypeChange('undirected')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              graphType === 'undirected'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
            }`}
          >
            UNDIRECTED
          </button>
          <button
            onClick={() => handleGraphTypeChange('directed')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              graphType === 'directed'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
            }`}
          >
            DIRECTED
          </button>
        </div>
      </div>

      {/* SECTION 2 — Preset Selector */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
          Presets
        </h3>
        <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          {/* Group 1: Bipartite */}
          {bipartiteGroup.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider">
                ✓ BIPARTITE
              </span>
              {bipartiteGroup.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                    currentPreset === preset.id
                      ? 'border-emerald-500/70 bg-emerald-500/10'
                      : 'border-[var(--border-color)] bg-[var(--input-bg)]/55 hover:border-[var(--border-color)]/80'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[12px] truncate max-w-[140px] text-white">
                      {preset.name}
                    </span>
                    <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">
                      Bipartite
                    </span>
                  </div>
                  <div className="flex gap-2 items-center mt-1 text-[9px] text-[var(--muted-color)] font-mono">
                    <span>{preset.nodes.length} nodes</span>
                    <span>•</span>
                    <span>{preset.directed ? 'Directed' : 'Undirected'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Group 2: Not Bipartite */}
          {nonBipartiteGroup.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[10px] font-bold text-red-400 tracking-wider">
                ✗ NOT BIPARTITE
              </span>
              {nonBipartiteGroup.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                    currentPreset === preset.id
                      ? 'border-red-500/70 bg-red-500/10'
                      : 'border-[var(--border-color)] bg-[var(--input-bg)]/55 hover:border-[var(--border-color)]/80'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[12px] truncate max-w-[130px] text-white">
                      {preset.name}
                    </span>
                    <span className="text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded uppercase">
                      Not Bipartite
                    </span>
                  </div>
                  <div className="flex gap-2 items-center mt-1 text-[9px] text-[var(--muted-color)] font-mono">
                    <span>{preset.nodes.length} nodes</span>
                    <span>•</span>
                    <span>{preset.directed ? 'Directed' : 'Undirected'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 — Custom Graph Input */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
          Custom Graph
        </h3>
        <div className="flex flex-col gap-2 bg-[var(--input-bg)] p-3 rounded-lg border border-[var(--border-color)]">
          {/* Nodes input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[var(--muted-color)]">
              NODES (comma separated, max 8)
            </label>
            <input
              type="text"
              value={customNodes}
              onChange={(e) => setCustomNodes(e.target.value)}
              className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-md px-2 py-1 text-xs text-white outline-none focus:border-blue-500 font-mono"
              placeholder="A, B, C, D"
            />
          </div>

          {/* Edges input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[var(--muted-color)]">
              EDGES (one per line)
            </label>
            <textarea
              rows={4}
              value={customEdges}
              onChange={(e) => setCustomEdges(e.target.value)}
              className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-md px-2 py-1 text-xs text-white outline-none focus:border-blue-500 font-mono resize-none"
              placeholder={graphType === 'directed' ? 'A→B\nB→C' : 'A-B\nB-C'}
            />
          </div>

          {error && (
            <div className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-1.5 text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={validateAndLoadCustom}
            className="w-full py-1.5 text-xs font-bold bg-blue-500 hover:bg-blue-400 text-white rounded-md transition-colors"
          >
            Load Custom Graph
          </button>
        </div>
      </div>

      <button
        onClick={runAlgorithm}
        disabled={nodes.length === 0}
        className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Run Algorithm
      </button>

      {/* SECTION 4 — Algorithm Info */}
      <div className="flex flex-col bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden mt-1">
        <button
          onClick={() => setInfoExpanded(!infoExpanded)}
          className="flex justify-between items-center p-2.5 text-left text-xs font-bold tracking-wide text-blue-400 hover:bg-white/5 transition-all"
        >
          <span>{infoExpanded ? '▼' : '▶'} ABOUT BIPARTITE GRAPHS</span>
        </button>

        {infoExpanded && (
          <div className="p-3 text-[11px] leading-relaxed text-[var(--muted-color)] border-t border-[var(--border-color)]/50 flex flex-col gap-2 animate-fadeInUp">
            <p>
              A graph is <strong>bipartite</strong> if its nodes can be divided into two groups such
              that every edge connects a node from one group to the other.
            </p>
            <p>
              Equivalently, a graph is bipartite if and only if it contains <strong>no odd-length
              cycles</strong>.
            </p>
            <p>
              This algorithm uses <strong>BFS 2-coloring</strong>: assign color 0 to the source,
              then assign opposite colors to its neighbors. If any two adjacent nodes share the
              same color, a conflict is detected and the graph is not bipartite.
            </p>
            <div className="flex flex-col gap-1 mt-1 font-mono text-[10px]">
              <div className="flex justify-between">
                <span>Time Complexity:</span>
                <span className="text-amber-400 font-bold">O(V + E)</span>
              </div>
              <div className="flex justify-between">
                <span>Space Complexity:</span>
                <span className="text-purple-400 font-bold">O(V)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
