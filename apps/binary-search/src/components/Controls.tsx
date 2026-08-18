import React from 'react';
import { useBSStore, type SpeedOption } from '../store';
import {
  ChevronsLeft,
  ChevronLeft,
  Play,
  Pause,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

export const Controls: React.FC = () => {
  const {
    steps,
    cur,
    playing,
    speedLabel,
    setSpeedLabel,
    togglePlay,
    stepForward,
    stepBackward,
    goToFirst,
    goToLast,
  } = useBSStore();

  const totalSteps = steps.length;
  const progressPct = totalSteps > 1 ? (cur / (totalSteps - 1)) * 100 : 0;
  const speedOptions: SpeedOption[] = ['0.25x', '0.5x', '1x', '1.5x', '2x'];

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Outer Wrapper Bar */}
      <div
        style={{
          width: '100%',
          background: 'var(--panel-bg)',
          borderTop: '1px solid var(--border-color)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        {/* Inner Capsule Container */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '9999px',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {/* Playback Buttons Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* First Step Button */}
            <button
              onClick={goToFirst}
              disabled={cur === 0}
              title="First Step"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: cur === 0 ? 'not-allowed' : 'pointer',
                opacity: cur === 0 ? 0.3 : 1,
                pointerEvents: cur === 0 ? 'none' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-white/10 hover:text-[var(--text-primary)] cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Step Button */}
            <button
              onClick={stepBackward}
              disabled={cur === 0}
              title="Previous Step"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: cur === 0 ? 'not-allowed' : 'pointer',
                opacity: cur === 0 ? 0.3 : 1,
                pointerEvents: cur === 0 ? 'none' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-white/10 hover:text-[var(--text-primary)] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              title={playing ? 'Pause' : 'Play'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                ...(playing
                  ? {
                      background: 'var(--accent-indigo-bg)',
                      border: '1px solid var(--accent-indigo-dim)',
                      color: 'var(--accent-indigo)',
                    }
                  : {
                      background: 'var(--text-primary)',
                      color: 'var(--bg-base)',
                      border: 'none',
                    }),
              }}
              className="hover:opacity-85"
            >
              {playing ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Step Button */}
            <button
              onClick={stepForward}
              disabled={cur === totalSteps - 1}
              title="Next Step"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: cur === totalSteps - 1 ? 'not-allowed' : 'pointer',
                opacity: cur === totalSteps - 1 ? 0.3 : 1,
                pointerEvents: cur === totalSteps - 1 ? 'none' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-white/10 hover:text-[var(--text-primary)] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Step Button */}
            <button
              onClick={goToLast}
              disabled={cur === totalSteps - 1}
              title="Last Step"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: cur === totalSteps - 1 ? 'not-allowed' : 'pointer',
                opacity: cur === totalSteps - 1 ? 0.3 : 1,
                pointerEvents: cur === totalSteps - 1 ? 'none' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-white/10 hover:text-[var(--text-primary)] cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* Left Vertical Divider */}
          <div
            style={{
              width: '1px',
              height: '20px',
              background: 'var(--border-color)',
              margin: '0 4px',
            }}
          />

          {/* Step Counter */}
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              minWidth: '72px',
              textAlign: 'center',
            }}
          >
            Step {cur + 1} / {totalSteps}
          </div>

          {/* Right Vertical Divider */}
          <div
            style={{
              width: '1px',
              height: '20px',
              background: 'var(--border-color)',
              margin: '0 4px',
            }}
          />

          {/* Speed Pills Group */}
          <div
            style={{
              display: 'flex',
              gap: '2px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '3px',
            }}
          >
            {speedOptions.map((opt) => {
              const isActive = speedLabel === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setSpeedLabel(opt)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: 'none',
                    ...(isActive
                      ? {
                          background: 'var(--text-primary)',
                          color: 'var(--bg-base)',
                          fontWeight: 600,
                        }
                      : {
                          background: 'transparent',
                          color: 'var(--text-muted)',
                        }),
                  }}
                  className={!isActive ? 'hover:bg-white/10 hover:text-[var(--text-primary)] cursor-pointer' : ''}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div style={{ width: '100%', height: '2px', background: 'var(--border-color)' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'var(--accent-blue)',
            transition: 'width 0.2s ease',
            borderRadius: '0 1px 1px 0',
          }}
        />
      </div>
    </div>
  );
};
