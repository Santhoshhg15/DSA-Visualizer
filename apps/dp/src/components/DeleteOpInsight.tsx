import React from 'react';

interface DeleteOpInsightProps {
  s1: string;
  s2: string;
  lcsLength: number | null;
  answer: number | null;
  isDone: boolean;
}

export const DeleteOpInsight: React.FC<DeleteOpInsightProps> = ({
  s1,
  s2,
  lcsLength,
  answer,
  isDone,
}) => {
  const m = s1.length;
  const n = s2.length;

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
        <span>⚡</span>
        <span>LCS REDUCTION INSIGHT</span>
      </div>

      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'var(--text-color)',
        }}
      >
        <div style={{ color: 'var(--muted-color)', marginBottom: '8px' }}>
          Deletions = <span style={{ color: 'var(--accent-blue)' }}>(m - LCS)</span> + <span style={{ color: 'var(--accent-indigo)' }}>(n - LCS)</span>
        </div>

        <div style={{ paddingLeft: '8px', borderLeft: '2px solid var(--accent-indigo-bg)' }}>
          <div>s1 length (m) = {m}, s2 length (n) = {n}</div>

          {isDone && lcsLength !== null && answer !== null ? (
            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>LCS("{s1}", "{s2}") = <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{lcsLength}</span></div>
              <div style={{ fontSize: '12px', color: 'var(--muted-color)' }}>
                Delete from s1: {m} - {lcsLength} = <span style={{ color: 'var(--accent-coral)', fontWeight: 700 }}>{m - lcsLength}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted-color)' }}>
                Delete from s2: {n} - {lcsLength} = <span style={{ color: 'var(--accent-coral)', fontWeight: 700 }}>{n - lcsLength}</span>
              </div>
              <div
                style={{
                  marginTop: '6px',
                  padding: '6px 10px',
                  background: 'var(--accent-coral-bg)',
                  border: '1px solid var(--accent-coral-bg)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--accent-coral)',
                }}
              >
                Total Deletions = ({m} - {lcsLength}) + ({n} - {lcsLength}) = <span style={{ fontWeight: 700, fontSize: '14px' }}>{answer}</span>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--muted-color)' }}>
              Fill the grid to find LCS({s1}, {s2}) first...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
