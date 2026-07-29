import React from 'react';

export interface PartitionCandidateState {
  L: number;
  windowStart: number;
  windowEnd: number;
  maxInWindow: number;
  candidateValue: number;
  status: 'pending' | 'evaluated-losing' | 'evaluated-winning';
}

interface PartitionWindowCandidatesProps {
  candidates: PartitionCandidateState[];
  activeIndex: number;
}

export const PartitionWindowCandidates: React.FC<PartitionWindowCandidatesProps> = ({
  candidates,
  activeIndex,
}) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '720px',
        margin: '12px auto 0 auto',
        padding: '14px 18px',
        background: 'var(--input-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      className="animate-fadeIn select-none shrink-0"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted-color)',
          }}
        >
          WINDOW CANDIDATES FOR i = {activeIndex}
        </span>
        <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: 'var(--muted-color)' }}>
          <span style={{ opacity: 0.5 }}>● Pending</span>
          <span style={{ color: 'var(--muted-color)' }}>● Losing</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>● Winning</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {candidates.map((cand) => {
          const isWinning = cand.status === 'evaluated-winning';
          const isLosing = cand.status === 'evaluated-losing';
          const isPending = cand.status === 'pending';

          return (
            <div
              key={cand.L}
              style={{
                flex: '1 0 160px',
                minWidth: '150px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: isWinning
                  ? '1.5px solid var(--accent-blue)'
                  : isLosing
                  ? '1px solid var(--border-color)'
                  : '1px dashed var(--border-color)',
                background: isWinning
                  ? 'var(--accent-blue-bg)'
                  : isLosing
                  ? 'var(--cell-unfilled-bg)'
                  : 'transparent',
                opacity: isPending ? 0.45 : 1,
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              {isWinning && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: 'var(--accent-blue)',
                    background: 'var(--accent-blue-bg)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  ✓ BEST
                </span>
              )}

              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: isWinning ? 'var(--accent-blue)' : 'var(--text-color)',
                  marginBottom: '4px',
                }}
              >
                L = {cand.L} (w[{cand.windowStart}..{cand.windowEnd}])
              </div>

              <div style={{ fontSize: '10px', color: 'var(--muted-color)', marginBottom: '4px' }}>
                max = <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{cand.maxInWindow}</span>
              </div>

              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 700,
                  color: isWinning ? 'var(--cell-source-text)' : isLosing ? 'var(--muted-color)' : 'var(--muted-color)',
                  textDecoration: isLosing ? 'line-through' : 'none',
                }}
              >
                {cand.candidateValue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
