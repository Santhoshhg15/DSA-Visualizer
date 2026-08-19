import React from 'react';
import { useSWStore } from '../store';
import { type MaxDequeStep } from '../engines/maxOfAllSubarraysK';

interface MonotonicDequeStripProps {
  deque: number[];
  arr: number[];
}

export const MonotonicDequeStrip: React.FC<MonotonicDequeStripProps> = ({ deque, arr }) => {
  const { steps, cur } = useSWStore();
  const step = (steps[cur] || steps[0]) as MaxDequeStep;

  if (!step) return null;

  const isEvictBack = step.type === 'evict-back' && step.evictedIndex !== null;
  const isEvictFront = step.type === 'evict-front' && step.evictedIndex !== null;
  const evictedIdx = step.evictedIndex;

  // Render a chip component helper
  const renderChip = (valIndex: number, type: 'stable' | 'evicted-dominated' | 'evicted-expired', isFront = false) => {
    const val = arr[valIndex];
    if (val === undefined) return null;

    if (type === 'evicted-dominated') {
      return (
        <div
          key={`evicted-back-${valIndex}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid var(--accent-coral)',
            background: 'var(--accent-coral-bg)',
            color: 'var(--accent-coral)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11.5px',
            animation: 'chipEvictBack 200ms ease-in forwards',
            position: 'relative',
          }}
        >
          <span>idx {valIndex} ({val})</span>
        </div>
      );
    }

    if (type === 'evicted-expired') {
      return (
        <div
          key={`evicted-front-${valIndex}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--input-bg)',
            color: 'var(--muted-color)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11.5px',
            animation: 'chipEvictFront 200ms ease-in forwards',
            position: 'relative',
          }}
        >
          <span>idx {valIndex} ({val})</span>
        </div>
      );
    }

    // Stable active deque chip
    return (
      <div
        key={`stable-${valIndex}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: isFront ? '6px 12px' : '4px 10px',
          borderRadius: '8px',
          border: isFront ? '2px solid var(--accent-indigo)' : '1px solid var(--accent-indigo)',
          background: isFront ? 'var(--accent-indigo-bg)' : 'var(--input-bg)',
          color: 'var(--accent-indigo)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: isFront ? '12px' : '11.5px',
          fontWeight: isFront ? 700 : 500,
          position: 'relative',
          animation: 'chipEnter 200ms ease-out',
          boxShadow: isFront ? '0 0 10px var(--accent-indigo-bg)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <span>idx {valIndex} ({val})</span>
        {isFront && (
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'var(--accent-indigo)',
              color: '#fff',
              fontSize: '8px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '9999px',
              border: '1.5px solid var(--bg-primary)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              lineHeight: 1,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ★ MAX
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
        MONOTONIC DEQUE (decreasing order, front → back)
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minHeight: '44px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          overflowX: 'auto',
        }}
      >
        {deque.length === 0 && !isEvictBack && !isEvictFront ? (
          <span style={{ fontSize: '12px', color: 'var(--muted-color)', fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}>
            Deque is empty
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Front Eviction Chip (exiting to left) */}
            {isEvictFront && evictedIdx !== null && renderChip(evictedIdx, 'evicted-expired')}

            {/* Stable chips in the deque */}
            {deque.map((valIndex, index) => {
              const isFront = index === 0;
              return renderChip(valIndex, 'stable', isFront);
            })}

            {/* Back Eviction Chip (exiting downward) */}
            {isEvictBack && evictedIdx !== null && renderChip(evictedIdx, 'evicted-dominated')}
          </div>
        )}
      </div>

      <style>{`
        @keyframes chipEnter {
          from {
            opacity: 0;
            transform: translateX(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes chipEvictBack {
          from {
            opacity: 0.8;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(12px) scale(0.9);
          }
        }
        @keyframes chipEvictFront {
          from {
            opacity: 0.8;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-12px) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};
