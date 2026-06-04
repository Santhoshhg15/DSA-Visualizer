import { useStore } from '../store';
import { useEffect, useRef } from 'react';

interface ControlsProps {
  variant?: 'floating' | 'header';
}

export function Controls({ variant = 'floating' }: ControlsProps) {
  const { steps, cur, playing, speed, setCur, setPlaying, setSpeed } = useStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        useStore.setState(s => {
          if (s.cur < s.steps.length - 1) return { cur: s.cur + 1 };
          clearInterval(timerRef.current!);
          return { playing: false };
        });
      }, Math.round(1000 / speed));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, speed]);

  if (!steps.length) return null;

  const go = (n: number) => setCur(Math.max(0, Math.min(steps.length - 1, n)));
  const toggle = () => {
    if (!playing && cur >= steps.length - 1) setCur(0);
    setPlaying(!playing);
  };

  const btnCls = "w-8 h-8 flex items-center justify-center rounded-full border border-[var(--pill-btn-border)] bg-[var(--pill-btn-bg)] text-[var(--text-color)] hover:bg-[var(--pill-btn-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.08] active:scale-[0.92] text-xs shadow-sm";

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-3 bg-[var(--pill-btn-bg)]/50 border border-[var(--border-color)] rounded-full px-4 py-1.5 backdrop-blur-md shadow-md">
        {/* First */}
        <button className={btnCls} onClick={() => go(0)} disabled={cur === 0} title="First">
          ⏮
        </button>
        
        {/* Previous */}
        <button className={btnCls} onClick={() => go(cur - 1)} disabled={cur === 0} title="Previous Step">
          <span className="font-bold text-[#58a6ff]">❮</span>
        </button>
        
        {/* Play/Pause */}
        <button
          className={`w-7 h-7 flex items-center justify-center rounded-full border text-[10px] font-semibold transition-all hover:scale-[1.08] active:scale-[0.92] ${
            playing
              ? 'bg-[#3b151b] border-[#f85149] text-[#f85149] hover:bg-[#4d1d23] shadow-[0_0_8px_rgba(248,81,73,0.2)]'
              : 'bg-[#102d3d]/15 dark:bg-[#102d3d] border-[#58a6ff] text-[#58a6ff] hover:bg-[#1a3d54]/20 dark:hover:bg-[#1a3d54] shadow-[0_0_8px_rgba(88,166,255,0.2)]'
          }`}
          onClick={toggle}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        
        {/* Next */}
        <button 
          className={btnCls} 
          onClick={() => go(cur + 1)} 
          disabled={cur === steps.length - 1} 
          title="Next Step"
        >
          <span className="font-bold text-[#58a6ff]">❯</span>
        </button>
        
        {/* Last */}
        <button className={btnCls} onClick={() => go(steps.length - 1)} disabled={cur === steps.length - 1} title="Last">
          ⏭
        </button>

        {/* Step Indicator */}
        <span className="text-[10px] text-[var(--muted-color)] font-mono font-bold bg-[var(--pill-btn-bg)] px-2 py-0.5 rounded border border-[var(--border-color)] whitespace-nowrap">
          {cur + 1} / {steps.length}
        </span>

        {/* Vertical Divider */}
        <div className="w-[1px] h-4 bg-[var(--border-color)]" />

        {/* Speed Slider */}
        <div className="flex items-center gap-1.5">
          <input
            type="range" min={0.25} max={2.0} step={0.25} value={speed}
            onChange={e => setSpeed(+e.target.value)}
            className="w-12 h-1 accent-[#58a6ff] cursor-pointer"
          />
          <span className="text-[9px] text-[#58a6ff] font-mono font-bold w-9 text-right">{speed.toFixed(2)}x</span>
        </div>
      </div>
    );
  }

  // Original bottom-floating pill for standard algorithms
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-[var(--pill-bg)] border border-[var(--border-color)] shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] rounded-full px-5 py-3 flex items-center gap-3 backdrop-blur-xl z-40 hover:border-[var(--border-hover)] transition-all">
      {/* Progress Bar */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-[#21263d]/10 dark:bg-[#21263d] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#58a6ff] to-[#4fffb0] transition-all duration-150 rounded-full"
          style={{ width: `${((cur + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* First */}
      <button className={btnCls} onClick={() => go(0)} disabled={cur === 0} title="First">
        ⏮
      </button>
      
      {/* Previous */}
      <button className={btnCls} onClick={() => go(cur - 1)} disabled={cur === 0} title="Previous Step">
        <span className="font-bold text-[#58a6ff]">❮</span>
      </button>
      
      {/* Play/Pause */}
      <button
        className={`w-9 h-9 flex items-center justify-center rounded-full border text-xs font-semibold transition-all hover:scale-[1.08] active:scale-[0.92] ${
          playing
            ? 'bg-[#3b151b] border-[#f85149] text-[#f85149] hover:bg-[#4d1d23] shadow-[0_0_12px_rgba(248,81,73,0.2)]'
            : 'bg-[#102d3d]/15 dark:bg-[#102d3d] border-[#58a6ff] text-[#58a6ff] hover:bg-[#1a3d54]/20 dark:hover:bg-[#1a3d54] shadow-[0_0_12px_rgba(88,166,255,0.2)]'
        }`}
        onClick={toggle}
        title={playing ? 'Pause' : 'Play'}
      >
        {playing ? '⏸' : '▶'}
      </button>
      
      {/* Next */}
      <button 
        className={btnCls} 
        onClick={() => go(cur + 1)} 
        disabled={cur === steps.length - 1} 
        title="Next Step"
      >
        <span className="font-bold text-[#58a6ff]">❯</span>
      </button>
      
      {/* Last */}
      <button className={btnCls} onClick={() => go(steps.length - 1)} disabled={cur === steps.length - 1} title="Last">
        ⏭
      </button>

      <span className="text-[10px] text-[var(--muted-color)] font-mono font-bold bg-[var(--pill-btn-bg)] px-2.5 py-1 rounded-full border border-[var(--border-color)]">
        {cur + 1} / {steps.length}
      </span>

      {/* Speed Slider */}
      <div className="flex items-center gap-2 ml-auto">
        <input
          type="range" min={0.25} max={2.0} step={0.25} value={speed}
          onChange={e => setSpeed(+e.target.value)}
          className="w-16 accent-[#58a6ff] cursor-pointer"
        />
        <span className="text-[9px] text-[#58a6ff] font-mono font-bold w-9 text-right">{speed.toFixed(2)}x</span>
      </div>
    </div>
  );
}

export function StepLog() {
  const { steps, cur } = useStore();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [cur]);

  if (!steps.length) return null;

  const colorMap: Record<string, string> = {
    info:     'text-[var(--muted-color)]',
    match:    'text-[#047857] dark:text-[#4fffb0]',
    mismatch: 'text-[#be185d] dark:text-[#ff6eb4]',
    found:    'text-[#d97706] dark:text-[#e3b341] font-bold',
  };

  const bgMap: Record<string, string> = {
    info:     'bg-[#161b30]/5 dark:bg-[#161b30]/30 border-[#30364d]/10 dark:border-[#30364d]/30',
    match:    'bg-[#102d24]/10 dark:bg-[#102d24]/55 border-[#1b6b50]/20 dark:border-[#1b6b50]/40',
    mismatch: 'bg-[#3b1225]/10 dark:bg-[#3b1225]/55 border-[#802a4e]/20 dark:border-[#802a4e]/40',
    found:    'bg-[#382b12]/10 dark:bg-[#382b12]/60 border-[#a37924]/20 dark:border-[#a37924]/55',
  };

  return (
    <div className="w-full h-[400px] bg-[var(--panel-bg)] border border-[var(--border-color)] shadow-xl rounded-2xl p-4 backdrop-blur-xl flex flex-col">
      <div className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-wider mb-3 flex items-center justify-between border-b border-[var(--border-color)] pb-2 flex-shrink-0">
        <span className="flex items-center gap-1.5">📝 Trace Logs <span className="text-[8px] font-mono font-normal bg-[var(--pill-btn-bg)] px-1.5 py-0.5 rounded-full text-[var(--muted-color)]">{cur + 1} steps</span></span>
      </div>
      <div 
        ref={listRef} 
        className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
        style={{ scrollBehavior: 'smooth' }}
      >
        {steps.slice(0, cur + 1).map((s, idx) => {
          const isLatest = idx === cur;
          const foundAt = s.foundSoFar ?? s.found ?? [];
          return (
            <div
              key={idx}
              className={`border rounded-lg p-2 transition-all duration-300 ${bgMap[s.type]} ${
                isLatest 
                  ? 'ring-1 ring-[#58a6ff]/60 scale-[0.99] bg-opacity-80 shadow-[inset_0_0_8px_rgba(88,166,255,0.05)]' 
                  : 'opacity-40'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`text-[8px] font-mono px-1 py-0.5 rounded flex-shrink-0 mt-0.5 ${
                  isLatest ? 'bg-[#1f3a52] text-[#58a6ff]' : 'bg-[var(--pill-btn-bg)] text-[var(--muted-color)]'
                }`}>
                  #{idx + 1}
                </span>
                <div className="flex-grow">
                  <p className={`text-[11px] font-mono leading-relaxed ${colorMap[s.type]}`}>{s.msg}</p>
                  {foundAt.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {foundAt.map((f, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-[#1c4a1c]/80 border border-[#3fb950]/50 text-[#aff5b4] text-[9px] font-mono rounded"
                        >
                          {typeof f === 'string' ? f : `@ ${f}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
