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
  const { selectedPreset: selectedIslandPreset, loadPreset: loadIslandPreset, setSteps: setIslandsSteps, reset: resetIslands } = useIslandsStore();
  const { currentPreset: selectedCyclePreset, loadPreset: loadCyclePreset, setSteps: setCycleSteps, reset: resetCycle } = useCycleStore();

  const handleIslandPresetChange = (presetId: string) => {
    const preset = islandsPresets.find(p => p.id === presetId);
    if (preset) {
      resetIslands();
      loadIslandPreset(preset.id, preset.grid);
      const steps = generateIslandsSteps(preset.grid);
      setIslandsSteps(steps);
    }
  };

  const handleCyclePresetChange = (presetId: string) => {
    const preset = cyclePresets.find(p => p.id === presetId);
    if (preset) {
      resetCycle();
      loadCyclePreset(preset.id, preset);
      const steps = generateCycleSteps(preset.nodes, preset.edges, preset.directed ? 'directed' : 'undirected');
      setCycleSteps(steps);
    }
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
            // Auto load first islands preset if nothing selected
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
            // Auto load first cycle preset if nothing selected
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

      {/* Preset Selector context-dependent list */}
      {selectedProgram === 'islands' ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-[12px] font-bold text-[var(--muted-color)] uppercase tracking-wider">Choose Grid</h3>
          <div className="grid grid-cols-1 gap-2">
            {islandsPresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleIslandPresetChange(preset.id)}
                className={`text-left px-3 py-2 text-[12px] rounded-md border font-medium transition-all ${
                  selectedIslandPreset === preset.id
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-sm'
                    : 'border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:border-emerald-500/30 hover:text-white'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // The Cycle panel has its own detailed algorithm controls, we delegate that there.
        // We render it directly or show its presets. Let's let the main CyclePanel cover custom graph and algorithms type toggles.
        // Wait, the specification says: "Left panel shows CyclePanel". So if selectedProgram is cycle, we actually want left panel to show CyclePanel itself!
        // So we should handle this in App.tsx: when activeWorkspaceMode === 'programs', if selectedProgram is 'cycle', we display CyclePanel, but CyclePanel should still let us select between programs or we can put the program cards inside CyclePanel as well!
        // To be extremely safe, we should place the program selection cards at the top of BOTH IslandsPanel and CyclePanel, or manage it centrally in App.tsx!
        // Let's modify IslandsPanel to have the cards (above grid selector), and let's update CyclePanel to also render the exact same Program Selector Card header! That way they feel completely integrated and allow switching back and forth perfectly.
        null
      )}
    </div>
  );
}
