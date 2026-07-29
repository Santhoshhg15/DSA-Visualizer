import React from 'react';

interface TargetSumTransformProps {
  totalSum: number;
  target: number;
  derivedTarget?: number;
  isShortCircuit: boolean;
}

export const TargetSumTransform: React.FC<TargetSumTransformProps> = ({
  totalSum,
  target,
  derivedTarget,
  isShortCircuit,
}) => {
  const sumPlusTarget = target + totalSum;

  return (
    <div
      style={{
        background: 'var(--input-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '16px 20px',
        maxWidth: '520px',
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
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>⚡</span>
        <span>ALGEBRAIC TRANSFORMATION</span>
      </div>

      {isShortCircuit ? (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--accent-amber)',
            lineHeight: 1.5,
            fontFamily: 'JetBrains Mono, monospace',
            padding: '8px 12px',
            background: 'var(--accent-amber-bg)',
            border: '1px solid var(--accent-amber-bg)',
            borderRadius: '8px',
          }}
        >
          ⊘ (target + totalSum = {sumPlusTarget}) is odd, OR |target| ({Math.abs(target)}) exceeds totalSum ({totalSum}) — no valid sign assignment exists. Answer: 0
        </div>
      ) : (
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--text-color)',
          }}
        >
          <div style={{ color: 'var(--muted-color)', marginBottom: '6px' }}>
            totalSum = <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{totalSum}</span>, target = <span style={{ color: 'var(--accent-indigo)', fontWeight: 700 }}>{target}</span>
          </div>

          <div style={{ paddingLeft: '8px', borderLeft: '2px solid var(--accent-indigo-bg)' }}>
            <div>sum(P) - sum(N) = {target}</div>
            <div>sum(P) + sum(N) = {totalSum}</div>
            <div style={{ width: '80%', borderTop: '1px solid var(--border-color)', margin: '6px 0' }} />
            <div>2 · sum(P) = target + totalSum = <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>{sumPlusTarget}</span></div>
            <div>sum(P) = <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{derivedTarget}</span></div>
          </div>

          <div
            style={{
              marginTop: '10px',
              padding: '6px 10px',
              background: 'var(--accent-teal-bg)',
              border: '1px solid var(--accent-teal-bg)',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-teal)',
            }}
          >
            → Reduces to: Count Subsets summing to <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{derivedTarget}</span>
          </div>
        </div>
      )}
    </div>
  );
};
