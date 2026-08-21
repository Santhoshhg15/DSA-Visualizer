import React from 'react';

interface LPSReversalInsightProps {
  s: string;
  reversed: string;
  answer: number | null;
  isDone: boolean;
}

export const LPSReversalInsight: React.FC<LPSReversalInsightProps> = ({
  s,
  reversed,
  answer,
  isDone,
}) => {
  return (
    <div
      style={{
        background: 'var(--input-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '16px 20px',
        maxWidth: '540px',
        margin: '0 auto 16px auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      className="animate-fadeIn select-none"
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--accent-indigo)',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>💡</span>
        <span>KEY INSIGHT</span>
      </div>

      <div
        style={{
          fontSize: '12px',
          lineHeight: 1.5,
          color: 'var(--text-color)',
          marginBottom: '12px',
        }}
      >
        A palindromic subsequence reads the same both ways — so it must appear in BOTH the original and the reversed string, in the same order.
      </div>

      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'var(--text-color)',
          paddingLeft: '10px',
          borderLeft: '2px solid var(--accent-indigo-bg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>
          LPS(s) = LCS(s, reverse(s))
        </div>

        {/* Stacked comparison chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--muted-color)', width: '60px', textTransform: 'uppercase' }}>original</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(s || '').split('').map((ch, idx) => (
                <div
                  key={`orig-insight-${idx}`}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '1px solid var(--accent-blue)',
                    background: 'var(--accent-blue-bg)',
                    color: 'var(--cell-filled-text)',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--muted-color)', width: '60px', textTransform: 'uppercase' }}>reversed</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(reversed || '').split('').map((ch, idx) => (
                <div
                  key={`rev-insight-${idx}`}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '1px solid var(--accent-teal)',
                    background: 'var(--accent-teal-bg, rgba(20,184,166,0.12))',
                    color: 'var(--accent-teal)',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>
        </div>

        {isDone && answer !== null ? (
          <div
            style={{
              marginTop: '4px',
              padding: '6px 10px',
              background: 'var(--accent-green-bg, rgba(34,197,94,0.12))',
              border: '1px solid var(--accent-green)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent-green)',
            }}
          >
            LCS("{s}", "{reversed}") = {answer} → LPS("{s}") = <span style={{ fontWeight: 700, fontSize: '13px' }}>{answer}</span>
          </div>
        ) : (
          <div style={{ fontSize: '11px', color: 'var(--muted-color)' }}>
            Fill the grid to find LCS(original, reversed) first...
          </div>
        )}
      </div>
    </div>
  );
};
