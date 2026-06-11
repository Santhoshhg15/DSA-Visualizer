import { useIslandsStore } from '../../stores/useIslandsStore';
import { useCycleStore } from '../../stores/useCycleStore';
import { islandsPresets } from './islandsPresets';
import { generateIslandsSteps } from './stepEngine';
import { cyclePresets } from '../cycleDetection/cyclePresets';
import { generateCycleSteps } from '../cycleDetection/stepEngine';

export interface IslandsPanelProps {
  selectedProgram: 'islands' | 'cycle';
  setSelectedProgram: (prog: 'islands' | 'cycle') => void;
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
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-wider">Active Program</h3>
      </div>
      
      {/* Selector Cards Container */}
      <div className="flex flex-col gap-3">
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
              ? 'border-blue-500 bg-blue-500/10 shadow-md'
              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:border-blue-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="text-xl mt-0.5">🏝️</div>
            <div>
              <h4 className="font-bold text-white text-[13px]">Number of Islands</h4>
              <p className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono">Grid BFS • LeetCode #200</p>
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
              ? 'border-blue-500 bg-blue-500/10 shadow-md'
              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:border-blue-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="text-xl mt-0.5">🔄</div>
            <div>
              <h4 className="font-bold text-white text-[13px]">Cycle Detection</h4>
              <p className="text-[10px] text-[var(--muted-color)] mt-0.5 font-mono">Union-Find • DFS Back-Edge</p>
            </div>
          </div>
        </button>
      </div>

      <div className="h-px w-full bg-[var(--border-color)] my-2"></div>

      {selectedProgram === 'islands' && (
        <>
          {/* Version Selector Toggle */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-wider">BFS Version</h3>
            <div className="flex bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-1 relative">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md transition-all duration-300 ease-out shadow-sm bg-blue-500 ${
                  version === 'leetcode' ? 'left-1' : 'left-[calc(50%+3px)]'
                }`}
              />
              <button
                onClick={() => handleVersionChange('leetcode')}
                className={`flex-1 py-1.5 text-center text-xs font-bold transition-all relative z-10 ${
                  version === 'leetcode' ? 'text-white' : 'text-[var(--muted-color)] hover:text-white'
                }`}
              >
                LEETCODE <span className="text-[9px] opacity-75 font-mono ml-0.5">[LC #200]</span>
              </button>
              <button
                onClick={() => handleVersionChange('gfg')}
                className={`flex-1 py-1.5 text-center text-xs font-bold transition-all relative z-10 ${
                  version === 'gfg' ? 'text-white' : 'text-[var(--muted-color)] hover:text-white'
                }`}
              >
                GFG <span className="text-[9px] opacity-75 font-mono ml-0.5">[8-DIR]</span>
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-[var(--border-color)] my-1"></div>

          {/* Preset Selector */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-wider">Choose Grid</h3>
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
                    className={`text-left px-3 py-2 text-[12px] rounded-md border font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-sm'
                        : 'border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:border-emerald-500/30 hover:text-white'
                    }`}
                  >
                    <span>{preset.name}</span>
                    {expectedText && (
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
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
