import { useSortingStore } from '../stores/useSortingStore';

export function SortingControls() {
  const {
    steps, cur, playing, speed,
    setPlaying, setSpeed,
    stepForward, stepBackward,
    skipToStart, skipToEnd,
    setCur,
  } = useSortingStore();

  const totalSteps = steps.length;
  const hasSteps = totalSteps > 0;
  const isFinished = cur >= totalSteps - 1;

  const handlePlayPause = () => {
    if (isFinished) {
      // Restart from beginning
      setCur(0);
      setTimeout(() => setPlaying(true), 50);
    } else {
      setPlaying(!playing);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 px-4 py-3 border-t border-[var(--border-color)] bg-[var(--panel-bg)]">
      {/* Main pill controls row */}
      <div className="flex items-center gap-3 bg-[var(--panel-bg)]/85 backdrop-blur-md border border-[var(--border-color)] rounded-full px-5 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.3)] min-w-[480px] justify-between">
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          {/* Skip to start */}
          <button
            onClick={skipToStart}
            disabled={!hasSteps || cur === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-color)] hover:text-[var(--text-color)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Skip to start"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>

          {/* Previous step */}
          <button
            onClick={stepBackward}
            disabled={!hasSteps || cur === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-color)] hover:text-[var(--text-color)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous step"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm12 0L8 12l10 6z"/>
            </svg>
          </button>

          {/* Play / Pause — hero button */}
          <button
            onClick={handlePlayPause}
            disabled={!hasSteps}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-400 disabled:bg-[var(--border-color)] disabled:cursor-not-allowed text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all active:scale-95"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next step */}
          <button
            onClick={stepForward}
            disabled={!hasSteps || isFinished}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-color)] hover:text-[var(--text-color)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next step"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          {/* Skip to end */}
          <button
            onClick={skipToEnd}
            disabled={!hasSteps || isFinished}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-color)] hover:text-[var(--text-color)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Skip to end"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zm2.5-6L16 6v12l-7.5-6zM16 6h2v12h-2z"/>
            </svg>
          </button>
        </div>

        {/* Progress scrubber */}
        <div className="flex items-center gap-2 flex-1 mx-3">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={cur}
            disabled={!hasSteps}
            onChange={(e) => setCur(parseInt(e.target.value, 10))}
            className="flex-1 h-1 rounded-full accent-blue-500 bg-[var(--border-color)] disabled:opacity-30 cursor-pointer"
          />
          <span className="text-[12px] font-mono text-[var(--muted-color)] whitespace-nowrap min-w-[52px] text-right">
            {hasSteps ? `${cur + 1}/${totalSteps}` : '0/0'}
          </span>
        </div>

        {/* Speed control */}
        <div className="flex items-center bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] p-[2px]">
          {[0.25, 0.5, 1, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded transition-colors cursor-pointer min-w-[28px] ${
                speed === s
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-[var(--muted-color)] hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Status row below pill */}
      {hasSteps && (
        <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--muted-color)]">
          <span>
            {playing ? (
              <span className="text-blue-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block"/>
                Running...
              </span>
            ) : isFinished ? (
              <span className="text-[#00C896]">
                ✓ Complete
              </span>
            ) : (
              <span>Paused</span>
            )}
          </span>
          <span>Speed: {speed}x</span>
        </div>
      )}
    </div>
  );
}
