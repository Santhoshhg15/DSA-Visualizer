import React, { useEffect, useState, useRef } from 'react';
import { useSWStore } from '../store';

interface NegativeQueueStripProps {
  negQueue: number[];
  arr: number[];
}

export const NegativeQueueStrip: React.FC<NegativeQueueStripProps> = ({ negQueue, arr }) => {
  const { cur } = useSWStore();
  const [evicted, setEvicted] = useState<number | null>(null);
  const prevQueueRef = useRef<number[]>([]);

  useEffect(() => {
    const prevQueue = prevQueueRef.current;
    if (prevQueue.length > 0 && negQueue.length < prevQueue.length) {
      // Check if front was evicted
      const firstPrev = prevQueue[0];
      if (!negQueue.includes(firstPrev)) {
        setEvicted(firstPrev);
        const timer = setTimeout(() => {
          setEvicted(null);
        }, 200);
        prevQueueRef.current = [...negQueue];
        return () => clearTimeout(timer);
      }
    }
    prevQueueRef.current = [...negQueue];
    setEvicted(null);
  }, [negQueue, cur]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
        NEGATIVE INDEX QUEUE
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
        {negQueue.length === 0 && evicted === null ? (
          <span style={{ fontSize: '12px', color: 'var(--muted-color)', fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}>
            No negative numbers in current window
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Evicted Chip (exiting to left) */}
            {evicted !== null && (
              <div
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
                  opacity: 0.5,
                  animation: 'chipExit 200ms ease-in forwards',
                }}
              >
                <span>idx {evicted} ({arr[evicted]})</span>
              </div>
            )}

            {/* Current Queue Chips */}
            {negQueue.map((valIndex, idx) => {
              const isFront = idx === 0;
              const val = arr[valIndex];
              return (
                <div
                  key={valIndex}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: isFront ? '6px 12px' : '4px 10px',
                    borderRadius: '8px',
                    border: isFront ? '2px solid var(--accent-coral)' : '1px solid var(--accent-coral)',
                    background: 'var(--accent-coral-bg)',
                    color: 'var(--accent-coral)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: isFront ? '12px' : '11.5px',
                    fontWeight: isFront ? 700 : 500,
                    transition: 'all 0.2s ease-in-out',
                    animation: 'chipEnter 200ms ease-out',
                    boxShadow: isFront ? '0 0 8px rgba(196,87,75,0.25)' : 'none',
                  }}
                >
                  <span>idx {valIndex} ({val})</span>
                  {isFront && (
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1.5px 5px',
                        background: 'var(--accent-coral)',
                        color: '#fff',
                        borderRadius: '4px',
                        marginLeft: '4px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      ← ANSWER
                    </span>
                  )}
                </div>
              );
            })}
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
        @keyframes chipExit {
          from {
            opacity: 0.5;
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
