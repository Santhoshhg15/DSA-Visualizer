import React from 'react';

interface CharacterSetPanelProps {
  seenChars: string[];
}

export const CharacterSetPanel: React.FC<CharacterSetPanelProps> = ({ seenChars }) => {
  // Sort alphabetically for stable layout, or keep in order. Let's keep alphabetical.
  const sortedChars = [...seenChars].sort();

  return (
    <div
      style={{
        background: 'var(--panel-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      <style>{`
        @keyframes chipSlideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .seen-chip {
          animation: chipSlideIn 0.2s ease-out forwards;
        }
      `}</style>

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
        Characters in Window (Seen Set)
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          minHeight: '38px',
          alignItems: 'center',
        }}
      >
        {sortedChars.length === 0 ? (
          <div
            style={{
              fontSize: '11px',
              fontStyle: 'italic',
              color: 'var(--muted-color)',
            }}
          >
            Set is empty (no characters in window)
          </div>
        ) : (
          sortedChars.map((char) => (
            <div
              key={char}
              className="seen-chip"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--accent-blue)',
                background: 'rgba(96, 165, 250, 0.08)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(96, 165, 250, 0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              {char}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
