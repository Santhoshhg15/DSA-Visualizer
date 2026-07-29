import React from 'react';

interface ComingSoonPlaceholderProps {
  name: string;
}

export const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({ name }) => {
  return (
    <div className="center-stage flex-1 flex items-center justify-center">
      <div style={{ textAlign: 'center', color: 'var(--muted-color)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-color)',
            marginBottom: '8px',
          }}
        >
          Coming Soon
        </div>
        <div style={{ fontSize: '13px' }}>
          {name} visualizer is under construction
        </div>
      </div>
    </div>
  );
};
