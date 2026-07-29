import React from 'react';
import type { CandidateState } from '../problems/types';

interface CoinCandidatesProps {
  amount: number;
  candidates: CandidateState[];
}

export const CoinCandidates: React.FC<CoinCandidatesProps> = ({ amount, candidates }) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        background: 'var(--input-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
      className="select-none animate-fadeIn"
    >
      {/* Title */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--muted-color)',
        }}
      >
        Candidate Coins for Amount {amount}
      </div>

      {/* Candidate Cards Row */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          maxWidth: '100%',
          padding: '4px',
        }}
        className="no-scrollbar"
      >
        {candidates.map((cand, idx) => {
          const isPending = cand.status === 'pending';
          const isLosing = cand.status === 'evaluated-losing';
          const isWinning = cand.status === 'evaluated-winning';
          const isImpossible = cand.status === 'impossible';

          let borderStyle = '1px solid var(--cell-unfilled-border)';
          let bgStyle = 'var(--cell-unfilled-bg)';
          let textColor = 'var(--muted-color)';
          let opacity = 1;

          if (isPending) {
            borderStyle = '1px solid var(--cell-unfilled-border)';
            bgStyle = 'var(--cell-unfilled-bg)';
            opacity = 0.4;
          } else if (isLosing) {
            borderStyle = '1px solid var(--muted-color)';
            bgStyle = 'var(--panel-bg)';
            opacity = 0.6;
          } else if (isWinning) {
            borderStyle = '1.5px solid var(--cell-filled-border)';
            bgStyle = 'var(--cell-filled-bg)';
            textColor = 'var(--cell-filled-text)';
          } else if (isImpossible) {
            borderStyle = '1.5px solid var(--cell-unreachable-border)';
            bgStyle = 'var(--cell-unreachable-bg)';
            textColor = 'var(--muted-color)';
            opacity = 0.5;
          }

          return (
            <div
              key={idx}
              style={{
                position: 'relative',
                minWidth: '95px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: borderStyle,
                background: bgStyle,
                color: textColor,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Winning Badge */}
              {isWinning && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-4px',
                    background: 'var(--accent-blue-bg)',
                    color: 'var(--accent-blue)',
                    border: '1px solid var(--accent-blue)',
                    fontSize: '9px',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  ✓ BEST
                </div>
              )}

              {/* Coin Label */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isWinning ? 'var(--cell-filled-text)' : 'var(--muted-color)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Coin {cand.coin}
              </span>

              {/* Computed Value */}
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                  textDecoration: isLosing ? 'line-through' : 'none',
                }}
              >
                {isImpossible
                  ? 'unreachable'
                  : isPending
                  ? 'pending'
                  : `dp[${amount}-${cand.coin}]+1 = ${cand.value}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Candidate Legend */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          fontSize: '10px',
          color: 'var(--muted-color)',
          marginTop: '2px',
          fontWeight: 500,
        }}
      >
        <span style={{ opacity: 0.5 }}>● Pending</span>
        <span style={{ color: 'var(--muted-color)' }}>● Losing</span>
        <span style={{ color: 'var(--accent-blue)' }}>● Winning</span>
        <span style={{ color: 'var(--cell-unreachable-text)' }}>● Impossible</span>
      </div>
    </div>
  );
};
