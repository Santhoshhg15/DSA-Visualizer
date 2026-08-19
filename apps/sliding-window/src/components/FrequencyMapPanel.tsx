import React from 'react';

interface FrequencyMapPanelProps {
  pattern: string;
  patternFreq: Record<string, number>;
  windowFreq: Record<string, number>;
  matches: number;
  requiredMatches: number;
  currentWindowText: string;
}

export const FrequencyMapPanel: React.FC<FrequencyMapPanelProps> = ({
  pattern,
  patternFreq,
  windowFreq,
  matches,
  requiredMatches,
  currentWindowText,
}) => {
  const isAnagramFound = matches === requiredMatches && requiredMatches > 0;

  // Distinct characters in pattern (sorted)
  const patternKeys = Object.keys(patternFreq).sort();
  // Distinct characters in window with count > 0 (sorted)
  const windowKeys = Object.keys(windowFreq)
    .filter((k) => windowFreq[k] > 0)
    .sort();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <style>{`
        @keyframes anagramPulse {
          0% { transform: scale(1); box-shadow: 0 4px 20px rgba(74, 222, 128, 0.15); }
          50% { transform: scale(1.02); box-shadow: 0 4px 30px rgba(74, 222, 128, 0.35); }
          100% { transform: scale(1); box-shadow: 0 4px 20px rgba(74, 222, 128, 0.15); }
        }
        .anagram-pulse {
          animation: anagramPulse 2s infinite ease-in-out;
        }
      `}</style>

      {/* Side-by-side Frequency Maps */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        {/* Pattern Frequency Panel */}
        <div
          style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--muted-color)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '8px',
            }}
          >
            Pattern: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-color)', textTransform: 'none' }}>"{pattern}"</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {patternKeys.map((char) => (
              <div
                key={char}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-color)',
                }}
              >
                <span style={{ fontWeight: 800, color: 'var(--accent-indigo)' }}>{char}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted-color)' }}>:</span>
                <span style={{ fontSize: '15px', fontWeight: 700 }}>{patternFreq[char]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Window Frequency Panel */}
        <div
          style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--muted-color)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '8px',
            }}
          >
            Current Window: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-color)', textTransform: 'none' }}>"{currentWindowText || ' '}"</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {windowKeys.length === 0 ? (
              <div
                style={{
                  fontSize: '11px',
                  fontStyle: 'italic',
                  color: 'var(--muted-color)',
                  padding: '6px 0',
                }}
              >
                Window is empty
              </div>
            ) : (
              windowKeys.map((char) => {
                const count = windowFreq[char];
                const target = patternFreq[char] || 0;

                let border = 'var(--border-color)';
                let background = 'var(--bg-card)';
                let color = 'var(--text-color)';
                let indicator: React.ReactNode = null;

                if (target === 0) {
                  // EXTRA (not in pattern at all)
                  border = 'rgba(156, 163, 175, 0.3)';
                  background = 'rgba(156, 163, 175, 0.05)';
                  color = 'var(--muted-color)';
                  indicator = <span style={{ fontSize: '8px', opacity: 0.8 }}>(extra)</span>;
                } else if (count === target) {
                  // MATCHING
                  border = 'var(--accent-green)';
                  background = 'rgba(74, 222, 128, 0.08)';
                  color = 'var(--accent-green)';
                  indicator = <span style={{ fontSize: '9px', fontWeight: 900 }}>✓</span>;
                } else if (count < target) {
                  // UNDER
                  border = 'var(--accent-blue)';
                  background = 'rgba(96, 165, 250, 0.08)';
                  color = 'var(--accent-blue)';
                } else {
                  // OVER
                  border = 'var(--accent-coral)';
                  background = 'rgba(248, 113, 113, 0.08)';
                  color = 'var(--accent-coral)';
                  indicator = <span style={{ fontSize: '8px', fontWeight: 600 }}>✕ too many</span>;
                }

                return (
                  <div
                    key={char}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '14px',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background,
                      color,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontWeight: 800 }}>{char}</span>
                    <span style={{ fontSize: '11px', opacity: 0.6 }}>:</span>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>{count}</span>
                    {indicator}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Match Counter Display */}
      <div
        className={isAnagramFound ? 'anagram-pulse' : ''}
        style={{
          alignSelf: 'center',
          minWidth: '280px',
          background: isAnagramFound
            ? 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(52,211,153,0.05))'
            : 'var(--panel-bg)',
          border: isAnagramFound
            ? '2px solid var(--accent-green)'
            : '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '16px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.3s ease',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: isAnagramFound ? 'var(--accent-green)' : 'var(--muted-color)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {isAnagramFound ? '✓ ANAGRAM FOUND!' : 'CHARACTERS MATCHING'}
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '4px',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <span
            style={{
              fontSize: '36px',
              fontWeight: 800,
              color: isAnagramFound ? 'var(--accent-green)' : 'var(--accent-indigo)',
              lineHeight: 1,
            }}
          >
            {matches}
          </span>
          <span style={{ fontSize: '20px', color: 'var(--muted-color)', fontWeight: 500 }}>/</span>
          <span style={{ fontSize: '24px', color: 'var(--text-color)', fontWeight: 600 }}>
            {requiredMatches}
          </span>
        </div>

        <span
          style={{
            fontSize: '9px',
            color: 'var(--muted-color)',
            fontFamily: 'Inter, sans-serif',
            marginTop: '2px',
          }}
        >
          {isAnagramFound
            ? 'All target counts matched exactly!'
            : `${requiredMatches - matches} more distinct match(es) needed`}
        </span>
      </div>
    </div>
  );
};
