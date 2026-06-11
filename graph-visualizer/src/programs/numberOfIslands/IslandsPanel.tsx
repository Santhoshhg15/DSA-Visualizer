import { useIslandsStore } from '../../stores/useIslandsStore';
import { useCycleStore } from '../../stores/useCycleStore';
import { useBipartiteStore } from '../../stores/useBipartiteStore';
import { islandsPresets } from './islandsPresets';
import { generateIslandsSteps } from './stepEngine';
import { cyclePresets } from '../cycleDetection/cyclePresets';
import { generateCycleSteps } from '../cycleDetection/stepEngine';
import { bipartitePresets } from '../bipartite/bipartitePresets';
import { generateBipartiteSteps } from '../bipartite/stepEngine';

export interface IslandsPanelProps {
  selectedProgram: 'islands' | 'cycle' | 'bipartite';
  setSelectedProgram: (prog: 'islands' | 'cycle' | 'bipartite') => void;
}

export function IslandsPanel({ selectedProgram, setSelectedProgram }: IslandsPanelProps) {
  const { 
    selectedPreset: selectedIslandPreset, 
    loadPreset: loadIslandPreset, 
    setSteps: setIslandsSteps, 
    reset: resetIslands,
    version,
    setVersion
  } = useIslandsStore();

  const { currentPreset: selectedCyclePreset, loadPreset: loadCyclePreset, setSteps: setCycleSteps, reset: resetCycle } = useCycleStore();
  const { currentPreset: selectedBipartitePreset, loadPreset: loadBipartitePreset, setSteps: setBipartiteSteps, reset: resetBipartite } = useBipartiteStore();

  const handleIslandPresetChange = (presetId: string, currentVersion: 'leetcode' | 'gfg' = version) => {
    const preset = islandsPresets.find(p => p.id === presetId);
    if (preset) {
      resetIslands();
      loadIslandPreset(preset.id, preset.grid);
      const steps = generateIslandsSteps(preset.grid, currentVersion);
      setIslandsSteps(steps);
    }
  };

  const handleCyclePresetChange = (presetId: string) => {
    const preset = cyclePresets.find(p => p.id === presetId);
    if (preset) {
      resetCycle();
      loadCyclePreset(preset.id, preset);
      const steps = generateCycleSteps(preset.nodes, preset.edges, preset.directed ? 'directed-dfs' : 'undirected-union-find');
      setCycleSteps(steps);
    }
  };

  const handleVersionChange = (newVersion: 'leetcode' | 'gfg') => {
    setVersion(newVersion);
    const activePresetId = selectedIslandPreset || islandsPresets[0].id;
    handleIslandPresetChange(activePresetId, newVersion);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full h-full text-white animate-fadeInUp">
      <div className="flex items-center gap-2 mb-2 font-sans">
        <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">Active Program</h3>
      </div>
      
      {/* Selector Cards Container */}
      <div className="flex flex-col gap-3 font-sans">
        {/* Card 1: Islands */}
        <button
          onClick={() => {
            setSelectedProgram('islands');
            if (!selectedIslandPreset && islandsPresets.length > 0) {
              handleIslandPresetChange(islandsPresets[0].id);
            }
          }}
          className={`p-3 border rounded-[10px] text-left transition-all relative overflow-hidden group w-full ${
            selectedProgram === 'islands'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:border-blue-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="text-xl mt-0.5">🏝️</div>
            <div>
              <h4 className="font-semibold text-white text-[14px]">Number of Islands</h4>
              <p className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono font-medium">Grid BFS • LeetCode #200</p>
            </div>
          </div>
        </button>

        {/* Card 2: Cycle Detection */}
        <button
          onClick={() => {
            setSelectedProgram('cycle');
            if (!selectedCyclePreset && cyclePresets.length > 0) {
              handleCyclePresetChange(cyclePresets[0].id);
            }
          }}
          className={`p-3 border rounded-[10px] text-left transition-all relative overflow-hidden group w-full ${
            selectedProgram === 'cycle'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:border-blue-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="text-xl mt-0.5">🔄</div>
            <div>
              <h4 className="font-semibold text-white text-[14px]">Cycle Detection</h4>
              <p className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono font-medium">Union-Find • DFS • BFS</p>
            </div>
          </div>
        </button>

        {/* Card 3: Bipartite Graph Check */}
        <button
          onClick={() => {
            setSelectedProgram('bipartite');
            const activePresetId = selectedBipartitePreset || bipartitePresets[0].id;
            const preset = bipartitePresets.find(p => p.id === activePresetId);
            if (preset) {
              resetBipartite();
              loadBipartitePreset(preset.id, preset);
              const steps = generateBipartiteSteps(preset.nodes, preset.edges, preset.directed);
              setBipartiteSteps(steps);
            }
          }}
          className={`p-3 border rounded-[10px] text-left transition-all relative overflow-hidden group w-full ${
            selectedProgram === 'bipartite'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:border-blue-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="text-xl mt-0.5">🎨</div>
            <div>
              <h4 className="font-semibold text-white text-[14px]">Bipartite Graph Check</h4>
              <p className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono font-medium">BFS 2-Coloring • Undirected + Directed</p>
            </div>
          </div>
        </button>
      </div>

      <div className="h-px w-full bg-[var(--border-color)] my-2"></div>

      {selectedProgram === 'islands' && (
        <>
          {/* Version Selector Toggle */}
          <div className="flex flex-col gap-2 font-sans">
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">BFS Version</h3>
            <div className="flex bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-1 relative">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md transition-all duration-300 ease-out shadow-sm bg-blue-500 ${
                  version === 'leetcode' ? 'left-1' : 'left-[calc(50%+3px)]'
                }`}
              />
              <button
                onClick={() => handleVersionChange('leetcode')}
                className={`flex-1 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.04em] transition-all relative z-10 ${
                  version === 'leetcode' ? 'text-white' : 'text-[var(--muted-color)] hover:text-white'
                }`}
              >
                LEETCODE <span className="text-[9px] opacity-75 font-mono ml-0.5">[LC #200]</span>
              </button>
              <button
                onClick={() => handleVersionChange('gfg')}
                className={`flex-1 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.04em] transition-all relative z-10 ${
                  version === 'gfg' ? 'text-white' : 'text-[var(--muted-color)] hover:text-white'
                }`}
              >
                GFG <span className="text-[9px] opacity-75 font-mono ml-0.5">[8-DIR]</span>
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-[var(--border-color)] my-1"></div>

          {/* Preset Selector */}
          <div className="flex flex-col gap-3 font-sans">
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">Choose Grid</h3>
            <div className="grid grid-cols-1 gap-2">
              {islandsPresets.map(preset => {
                let expectedText = "";
                if (preset.id === 'diagonal-difference') {
                  expectedText = version === 'leetcode' ? "5 islands" : "1 island";
                }
                const isSelected = selectedIslandPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleIslandPresetChange(preset.id)}
                    className={`text-left px-3 py-2 text-[14px] rounded-md border font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:border-emerald-500/30 hover:text-white'
                    }`}
                  >
                    <span>{preset.name}</span>
                    {expectedText && (
                      <span className={`text-[9px] font-sans font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded border ${
                        version === 'leetcode' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {expectedText}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
