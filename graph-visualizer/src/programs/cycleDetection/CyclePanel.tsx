import { useEffect, useState } from 'react';
import { useCycleStore } from '../../stores/useCycleStore';
import { cyclePresets } from './cyclePresets';
import { generateCycleSteps } from './stepEngine';
import type { Node, Edge } from '../../stores/useGraphStore';

export interface CyclePanelProps {
  selectedProgram: 'islands' | 'cycle';
  setSelectedProgram: (prog: 'islands' | 'cycle') => void;
}

export function CyclePanel({ selectedProgram, setSelectedProgram }: CyclePanelProps) {
  const {
    algorithmType,
    setAlgorithmType,
    currentPreset,
    loadPreset,
    setCustomGraph,
    setSteps,
    reset,
    nodes,
  } = useCycleStore();

  const [customNodes, setCustomNodes] = useState('A, B, C, D, E');
  const [customEdges, setCustomEdges] = useState('A-B\nB-C\nC-D');
  const [error, setError] = useState<string | null>(null);
  const [infoExpanded, setInfoExpanded] = useState(false);

  // Load first preset matching algorithmType on mount
  useEffect(() => {
    if (!currentPreset) {
      handlePresetChange(
        algorithmType.startsWith('directed') ? 'dir-with-cycle' : 'undir-with-cycle'
      );
    }
  }, []);

  const handlePresetChange = (presetId: string) => {
    const preset = cyclePresets.find((p) => p.id === presetId);
    if (preset) {
      reset();
      loadPreset(preset.id, preset);
      const steps = generateCycleSteps(preset.nodes, preset.edges, algorithmType);
      setSteps(steps);
    }
  };

  const handleAlgoChange = (type: 'undirected-union-find' | 'undirected-bfs' | 'directed-dfs' | 'directed-bfs') => {
    setAlgorithmType(type);
    const isDirected = type.startsWith('directed');
    let defaultPresetId = 'undir-with-cycle';
    if (type === 'undirected-bfs') defaultPresetId = 'bfs-parent-cycle';
    else if (type === 'directed-dfs') defaultPresetId = 'dir-with-cycle';
    else if (type === 'directed-bfs') defaultPresetId = 'kahns-cycle';

    const preset = cyclePresets.find((p) => p.id === defaultPresetId);
    if (preset) {
      reset();
      loadPreset(preset.id, preset);
      const steps = generateCycleSteps(preset.nodes, preset.edges, type);
      setSteps(steps);
    }
    // Update placeholders for inputs
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
      const key = algorithmType.startsWith('directed') ? `${u}->${v}` : [u, v].sort().join('-');
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

    // Auto layout in circular format
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
    setCustomGraph(parsedNodes, edgesList, positions, algorithmType.startsWith('directed'));

    // Automatically generate steps and load them
    const steps = generateCycleSteps(parsedNodes, edgesList, algorithmType);
    setSteps(steps);
  };

  const runAlgorithm = () => {
    if (nodes.length === 0) return;
    const store = useCycleStore.getState();
    const steps = generateCycleSteps(store.nodes, store.edges, store.algorithmType);
    setSteps(steps);
  };

  const filteredPresets = cyclePresets.filter((p) => {
    if (algorithmType === 'undirected-union-find') {
      return !p.directed && !p.id.startsWith('bfs-parent');
    }
    if (algorithmType === 'undirected-bfs') {
      return !p.directed && p.id.startsWith('bfs-parent');
    }
    if (algorithmType === 'directed-dfs') {
      return p.directed && !p.id.startsWith('kahns');
    }
    if (algorithmType === 'directed-bfs') {
      return p.directed && p.id.startsWith('kahns');
    }
    return false;
  });

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full h-full text-white animate-fadeInUp">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
          Active Program
        </h3>
      </div>

      {/* Program Selector Cards */}
      <div className="flex flex-col gap-3">
        {/* Card 1: Islands */}
        <button
          onClick={() => setSelectedProgram('islands')}
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
          onClick={() => setSelectedProgram('cycle')}
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
                Union-Find • DFS Back-Edge
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="h-px w-full bg-[var(--border-color)] my-1"></div>

      {/* SECTION 1 — Algorithm Selector */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
            Undirected Algorithms
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAlgoChange('undirected-union-find')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                algorithmType === 'undirected-union-find'
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_6px_rgba(59,130,246,0.3)]'
                  : 'border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:border-blue-500/30'
              }`}
            >
              <span className="text-[11px] font-bold">Union-Find</span>
              <span className="text-[9px] opacity-80 mt-0.5 font-mono">Disjoint Set</span>
            </button>
            <button
              onClick={() => handleAlgoChange('undirected-bfs')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                algorithmType === 'undirected-bfs'
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_6px_rgba(59,130,246,0.3)]'
                  : 'border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:border-blue-500/30'
              }`}
            >
              <span className="text-[11px] font-bold">BFS Parent</span>
              <span className="text-[9px] opacity-80 mt-0.5 font-mono">Queue Track</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
            Directed Algorithms
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAlgoChange('directed-dfs')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                algorithmType === 'directed-dfs'
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_6px_rgba(59,130,246,0.3)]'
                  : 'border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:border-blue-500/30'
              }`}
            >
              <span className="text-[11px] font-bold">DFS Back-Edge</span>
              <span className="text-[9px] opacity-80 mt-0.5 font-mono">Recursion Stack</span>
            </button>
            <button
              onClick={() => handleAlgoChange('directed-bfs')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                algorithmType === 'directed-bfs'
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_6px_rgba(59,130,246,0.3)]'
                  : 'border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:border-blue-500/30'
              }`}
            >
              <span className="text-[11px] font-bold">Kahn's BFS</span>
              <span className="text-[9px] opacity-80 mt-0.5 font-mono">In-Degree Sort</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2 — Preset Selector */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
          Presets
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetChange(preset.id)}
              className={`text-left p-3 rounded-lg border flex items-center justify-between transition-all ${
                currentPreset === preset.id
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:border-blue-500/30 hover:text-white'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold">{preset.name}</span>
                <span className="text-[9px] font-mono tracking-wider opacity-60">
                  {preset.directed ? 'DIRECTED' : 'UNDIRECTED'}
                </span>
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                  preset.expectedResult
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {preset.expectedResult ? 'HAS CYCLE' : 'NO CYCLE'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3 — Custom Graph Input */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-bold text-[var(--muted-color)] uppercase tracking-wider">
          Custom Graph
        </h3>
        <div className="flex flex-col gap-3 p-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[var(--muted-color)] font-bold uppercase">
              Nodes (comma separated)
            </label>
            <input
              type="text"
              value={customNodes}
              onChange={(e) => setCustomNodes(e.target.value)}
              placeholder="A, B, C, D, E"
              className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[var(--muted-color)] font-bold uppercase">
              Edges
            </label>
            <textarea
              rows={3}
              value={customEdges}
              onChange={(e) => setCustomEdges(e.target.value)}
              placeholder={algorithmType.startsWith('directed') ? 'A→B\nB→C' : 'A-B\nB-C'}
              className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>

          {error && <span className="text-[11px] text-red-400 font-semibold">{error}</span>}

          <div className="flex gap-2">
            <button
              onClick={validateAndLoadCustom}
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-md shadow-blue-900/10"
            >
              Load Graph
            </button>
            <button
              onClick={runAlgorithm}
              disabled={nodes.length === 0}
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-md shadow-blue-900/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Run Algorithm
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4 — Algorithm Info */}
      <div className="border border-[var(--border-color)] rounded-xl overflow-hidden mt-1">
        <button
          onClick={() => setInfoExpanded(!infoExpanded)}
          className="w-full px-4 py-2.5 bg-[var(--input-bg)] hover:bg-[var(--input-bg)]/80 transition-colors flex items-center justify-between text-left"
        >
          <span className="text-[10px] font-bold text-[var(--muted-color)] tracking-wider uppercase">
            ▼ About This Algorithm
          </span>
        </button>

        {infoExpanded && (
          <div className="p-3.5 bg-[var(--panel-bg)] flex flex-col gap-3 text-xs leading-relaxed text-[var(--muted-color)]">
            {algorithmType === 'undirected-union-find' && (
              <>
                <p>
                  Union-Find detects cycles by tracking connected components. If adding an edge
                  connects two nodes already in the same component, a cycle exists.
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    Time: O(E × α(V)) ≈ O(E)
                  </span>
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    Space: O(V)
                  </span>
                </div>
              </>
            )}
            {algorithmType === 'undirected-bfs' && (
              <>
                <p>
                  BFS Parent tracking explores the graph layer by layer. If an already visited node
                  is reached that is not the parent of the current node, a cycle exists.
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    Time: O(V + E)
                  </span>
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    Space: O(V)
                  </span>
                </div>
              </>
            )}
            {algorithmType === 'directed-dfs' && (
              <>
                <p>
                  DFS back-edge detection uses a recursion stack. If DFS reaches a node already
                  in the current stack, a back edge (cycle) is found.
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    Time: O(V + E)
                  </span>
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    Space: O(V)
                  </span>
                </div>
              </>
            )}
            {algorithmType === 'directed-bfs' && (
              <>
                <p>
                  Kahn's BFS algorithm calculates in-degrees and processes nodes with 0 in-degree.
                  If the final sorted list count is less than V, a cycle exists.
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    Time: O(V + E)
                  </span>
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono text-[10px]">
                    Space: O(V)
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
