import { useGraphStore } from '../stores/useGraphStore';
import { useIslandsStore } from '../stores/useIslandsStore';
import { useCycleStore } from '../stores/useCycleStore';
import { useBipartiteStore } from '../stores/useBipartiteStore';
import { useSortingStore } from '../sorting/stores/useSortingStore';
import { useEffect, useRef } from 'react';

export function Controls({ activeWorkspaceMode, selectedProgram }: { activeWorkspaceMode?: string; selectedProgram?: string }) {
  if (activeWorkspaceMode === 'sorting') {
    return <SortingControlsInner />;
  }
  if (activeWorkspaceMode === 'programs') {
    if (selectedProgram === 'cycle') {
      return <CycleControlsInner />;
    } else if (selectedProgram === 'bipartite') {
      return <BipartiteControlsInner />;
    }
    return <IslandsControlsInner />;
  }
  return <GraphControlsInner />;
}

function GraphControlsInner() {
  const { steps, cur, playing, speed, setCur, setPlaying, setSpeed } = useGraphStore();
  return <BaseControls steps={steps} cur={cur} playing={playing} speed={speed} setCur={setCur} setPlaying={setPlaying} setSpeed={setSpeed} storeName="graph" />;
}

function IslandsControlsInner() {
  const { steps, cur, playing, speed, setCur, setPlaying, setSpeed } = useIslandsStore();
  return <BaseControls steps={steps} cur={cur} playing={playing} speed={speed} setCur={setCur} setPlaying={setPlaying} setSpeed={setSpeed} storeName="islands" />;
}

function CycleControlsInner() {
  const { steps, cur, playing, speed, setCur, setPlaying, setSpeed } = useCycleStore();
  return <BaseControls steps={steps} cur={cur} playing={playing} speed={speed} setCur={setCur} setPlaying={setPlaying} setSpeed={setSpeed} storeName="cycle" />;
}

function BipartiteControlsInner() {
  const { steps, cur, playing, speed, setCur, setPlaying, setSpeed } = useBipartiteStore();
  return <BaseControls steps={steps} cur={cur} playing={playing} speed={speed} setCur={setCur} setPlaying={setPlaying} setSpeed={setSpeed} storeName="bipartite" />;
}

function SortingControlsInner() {
  const { steps, cur, playing, speed, setCur, setPlaying, setSpeed } = useSortingStore();
  return <BaseControls steps={steps} cur={cur} playing={playing} speed={speed} setCur={setCur} setPlaying={setPlaying} setSpeed={setSpeed} storeName="sorting" />;
}

function BaseControls({ steps, cur, playing, speed, setCur, setPlaying, setSpeed, storeName }: any) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (playing && steps.length > 0) {
      timerRef.current = setInterval(() => {
        let state;
        if (storeName === 'graph') {
          state = useGraphStore.getState();
        } else if (storeName === 'cycle') {
          state = useCycleStore.getState();
        } else if (storeName === 'bipartite') {
          state = useBipartiteStore.getState();
        } else if (storeName === 'sorting') {
          state = useSortingStore.getState();
        } else {
          state = useIslandsStore.getState();
        }
        
        if (state.cur < state.steps.length - 1) {
          setCur(state.cur + 1);
        } else {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setPlaying(false);
        }
      }, Math.round(1000 / speed));
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playing, speed, steps.length]);

  if (!steps.length) return null;

  const go = (n: number) => setCur(Math.max(0, Math.min(steps.length - 1, n)));
  const toggle = () => {
    if (!playing && cur >= steps.length - 1) setCur(0);
    setPlaying(!playing);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percentage = x / rect.width;
    const targetStep = Math.round(percentage * (steps.length - 1));
    go(targetStep);
  };

  const navBtnCls = "w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-color)] hover:text-[var(--text-color)] hover:bg-white/10 dark:hover:bg-black/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all";

  const speeds = [0.25, 0.5, 0.75, 1, 1.5, 2];

  return (
    <div className="flex w-full items-center justify-center py-3 px-2 select-none font-sans">
      <div className="w-full max-w-lg md:w-fit md:min-w-[480px] flex items-center justify-between gap-2 md:gap-4 px-3 md:px-5 py-2 rounded-full border border-[var(--border-color)] bg-[var(--panel-bg)]/85 backdrop-blur-md shadow-lg shadow-black/5 mx-auto">
        
        {/* Navigation Left */}
        <div className="flex items-center gap-1">
          <button className={navBtnCls} onClick={() => go(0)} disabled={cur === 0} title="Skip to Start">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
          <button className={navBtnCls} onClick={() => go(cur - 1)} disabled={cur === 0} title="Previous Step">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>

        {/* Hero Play/Pause Button */}
        <button
          className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-white transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
            playing ? 'bg-orange-500 hover:bg-orange-400' : 'bg-blue-500 hover:bg-blue-400'
          }`}
          onClick={toggle}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        {/* Navigation Right */}
        <div className="flex items-center gap-1">
          <button className={navBtnCls} onClick={() => go(cur + 1)} disabled={cur === steps.length - 1} title="Next Step">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <button className={navBtnCls} onClick={() => go(steps.length - 1)} disabled={cur === steps.length - 1} title="Skip to End">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Progress Track */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-none font-sans">
          <div 
            ref={trackRef}
            onClick={handleTrackClick}
            className="relative w-[160px] h-[20px] flex items-center cursor-pointer group"
          >
            <div className="w-full h-[4px] bg-[var(--border-color)] rounded-full overflow-hidden flex-1 md:w-[160px]">
              <div 
                className="h-full bg-blue-500 transition-all duration-150 rounded-full"
                style={{ width: `${steps.length > 1 ? (cur / (steps.length - 1)) * 100 : 100}%` }}
              />
            </div>
            {/* Draggable Thumb Representation */}
            <div 
              className="absolute w-[12px] h-[12px] rounded-full bg-blue-500 shadow-md transform -translate-x-1/2 transition-all duration-150 group-hover:scale-125"
              style={{ left: `${steps.length > 1 ? (cur / (steps.length - 1)) * 100 : 100}%` }}
            />
          </div>
          
          {/* Step Counter */}
          <span className="text-[13px] font-mono font-medium text-[var(--muted-color)] w-[50px] text-right">
            {cur + 1}/{steps.length}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--border-color)]"></div>

        {/* Unified Speed Control Dropdown */}
        <div className="relative flex items-center">
          <select
            value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="h-[28px] bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] pl-2 pr-6 text-[10px] font-mono font-bold text-[var(--text-color)] outline-none focus:border-blue-500 hover:border-blue-500/50 transition-colors cursor-pointer appearance-none text-center min-w-[64px] uppercase"
            title="Change Playback Speed"
          >
            {speeds.map(s => (
              <option key={s} value={s} className="bg-[var(--panel-bg)] text-[var(--text-color)] font-sans">{s}X</option>
            ))}
          </select>
          <div className="absolute right-2 pointer-events-none text-[var(--muted-color)] flex items-center justify-center">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
