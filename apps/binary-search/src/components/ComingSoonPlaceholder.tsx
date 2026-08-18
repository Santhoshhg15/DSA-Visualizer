import React from 'react';
import { Clock, Zap, GitBranch } from 'lucide-react';

interface ComingSoonPlaceholderProps {
  name: string;
}

// Skeleton row component
const SkeletonRow: React.FC<{ width: string; delay?: string }> = ({ width, delay = '0ms' }) => (
  <div
    style={{
      height: '8px',
      width,
      borderRadius: '9999px',
      background: 'var(--border-color)',
      animationDelay: delay,
    }}
    className="animate-pulse"
  />
);

// Fake number-line skeleton
const NumberLineSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '4px' }}>
      {[40, 60, 55, 72, 38, 66].map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}px`,
            borderRadius: '4px 4px 0 0',
            background: i === 3
              ? 'rgba(99,102,241,0.25)'
              : 'rgba(255,255,255,0.05)',
            border: i === 3
              ? '1px solid rgba(99,102,241,0.4)'
              : '1px solid var(--border-color)',
            transition: 'all 0.3s ease',
            animationDelay: `${i * 80}ms`,
          }}
          className="animate-pulse"
        />
      ))}
    </div>
    <div style={{ height: '3px', background: 'var(--border-color)', borderRadius: '9999px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '18%', width: '12%', height: '100%', background: 'var(--accent-indigo)', borderRadius: '9999px', opacity: 0.6 }} />
    </div>
  </div>
);

export const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({ name }) => {
  return (
    <div
      className="center-stage w-full h-full flex flex-col items-center justify-center"
      style={{ padding: '32px 24px' }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {/* Header card */}
        <div
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px 16px 0 0',
            padding: '24px 24px 20px',
            borderBottom: 'none',
          }}
        >
          {/* Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.3)',
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--accent-indigo)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Clock style={{ width: '10px', height: '10px' }} />
              Coming Soon
            </span>
          </div>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '8px',
              lineHeight: 1.2,
            }}
          >
            {name}
          </h2>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--muted-color)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.5,
            }}
          >
            This interactive visualizer is under active development and will be added to the suite soon.
          </p>
        </div>

        {/* Skeleton preview card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid var(--border-color)',
            borderRadius: '0',
            padding: '18px 24px',
            borderTop: 'none',
            borderBottom: 'none',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: 'var(--muted-color)',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              marginBottom: '12px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Preview
          </div>
          <NumberLineSkeleton />
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SkeletonRow width="75%" />
            <SkeletonRow width="55%" delay="100ms" />
            <SkeletonRow width="65%" delay="200ms" />
          </div>
        </div>

        {/* Complexity teaser */}
        <div
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '0 0 16px 16px',
            padding: '14px 24px',
            borderTop: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                background: 'rgba(96,165,250,0.08)',
                border: '1px solid rgba(96,165,250,0.2)',
              }}
            >
              <Zap style={{ width: '11px', height: '11px', color: 'var(--accent-blue)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'JetBrains Mono, monospace' }}>O(N log M)</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                background: 'rgba(129,140,248,0.08)',
                border: '1px solid rgba(129,140,248,0.2)',
              }}
            >
              <GitBranch style={{ width: '11px', height: '11px', color: 'var(--accent-indigo)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-indigo)', fontFamily: 'JetBrains Mono, monospace' }}>O(1)</span>
            </div>
          </div>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--muted-color)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Binary Search on Answer
          </span>
        </div>
      </div>
    </div>
  );
};
