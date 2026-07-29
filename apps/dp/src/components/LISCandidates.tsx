import React from 'react';
import type { LISCandidateState } from '../problems/types';

interface LISCandidatesProps {
  candidates: LISCandidateState[];
  activeI: number;
  arrI: number;
}

export const LISCandidates: React.FC<LISCandidatesProps> = ({
  candidates,
  activeI,
  arrI,
}) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        marginTop: '16px',
        width: '100%',
        maxWidth: '780px',
      }}
    >
      {/* Legend & Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 8px',
          fontSize: '11px',
          color: 'var(--muted-color)',
          fontWeight: 600,
        }}
      >
        <span>
          EVALUATING PREDECESSORS (j &lt; {activeI}, arr[{activeI}] = {arrI})
        </span>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: 'var(--muted-color)' }}>● Disqualified (≥)</span>
          <span style={{ color: 'var(--muted-color)' }}>● Losing</span>
          <span style={{ color: 'var(--accent-blue)' }}>● Winning (✓ BEST)</span>
        </div>
      </div>

      {/* Horizontal Scrollable Candidates Container */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '8px 4px',
          width: '100%',
        }}
        className="custom-scrollbar"
      >
        {candidates.map((c) => {
          const isDisqualified = c.status === 'disqualified';
          const isWinning = c.status === 'evaluated-winning';
          const isLosing = c.status === 'evaluated-losing';

          return (
            <div
              key={c.j}
              style={{
                position: 'relative',
                minWidth: '130px',
                padding: '10px 12px',
                borderRadius: '10px',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                ...(isDisqualified && {
                  background: 'var(--cell-invalid-bg)',
                  border: '1px solid var(--border-color)',
                  opacity: 0.35,
                  color: 'var(--muted-color)',
                }),
                ...(isLosing && {
                  background: 'var(--panel-bg)',
                  border: '1px solid var(--border-color)',
                  opacity: 0.65,
                  color: 'var(--muted-color)',
                }),
                ...(isWinning && {
                  background: 'var(--cell-filled-bg)',
                  border: '1.5px solid var(--cell-filled-border)',
                  color: 'var(--cell-filled-text)',
                  boxShadow: '0 0 12px var(--accent-blue-bg)',
                }),
              }}
            >
              {/* BEST BADGE */}
              {isWinning && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-7px',
                    right: '8px',
                    background: 'var(--accent-blue)',
                    color: 'var(--text-color)',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontFamily: 'JetBrains Mono, monospace',
                    lineHeight: 1,
                  }}
                >
                  ✓ BEST
                </span>
              )}

              {/* Label */}
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                  opacity: 0.8,
                }}
              >
                j={c.j} (val={c.arrJ})
              </span>

              {/* Result */}
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 700,
                  textDecoration: isLosing ? 'line-through' : 'none',
                }}
              >
                {isDisqualified ? (
                  <span style={{ fontSize: '11px' }}>✕ {c.arrJ} ≥ {arrI}</span>
                ) : (
                  <span>dp[{c.j}]+1 = {c.resultValue}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
