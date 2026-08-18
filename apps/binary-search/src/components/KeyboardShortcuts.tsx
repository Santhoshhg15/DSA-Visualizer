import React, { useEffect, useCallback } from 'react';
import { useBSStore } from '../store';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyCap: React.FC<{ label: string }> = ({ label }) => (
  <kbd
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: label.length > 2 ? '48px' : '28px',
      height: '24px',
      padding: '0 6px',
      borderRadius: '6px',
      background: 'var(--input-bg)',
      border: '1px solid var(--border-color)',
      borderBottom: '2px solid var(--border-color)',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      boxShadow: '0 1px 0 var(--border-color)',
      whiteSpace: 'nowrap' as const,
    }}
  >
    {label}
  </kbd>
);

const shortcuts = [
  { keys: ['→'], action: 'Next step', group: 'Navigation' },
  { keys: ['←'], action: 'Previous step', group: 'Navigation' },
  { keys: ['Space'], action: 'Play / Pause', group: 'Navigation' },
  { keys: ['Shift', '→'], action: 'Jump to last step', group: 'Navigation' },
  { keys: ['Shift', '←'], action: 'Jump to first step', group: 'Navigation' },
  { keys: ['R'], action: 'Reset / Run again', group: 'Controls' },
  { keys: ['?'], action: 'Toggle this shortcuts panel', group: 'Controls' },
  { keys: ['Esc'], action: 'Close this panel', group: 'Controls' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  const { stepForward, stepBackward, togglePlay, goToFirst, goToLast, reset } = useBSStore();

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === '?') { onClose(); return; }
      if (e.key === 'ArrowRight' && e.shiftKey) { goToLast(); return; }
      if (e.key === 'ArrowLeft' && e.shiftKey) { goToFirst(); return; }
      if (e.key === 'ArrowRight') { stepForward(); return; }
      if (e.key === 'ArrowLeft') { stepBackward(); return; }
      if (e.key === ' ') { e.preventDefault(); togglePlay(); return; }
      if (e.key === 'r' || e.key === 'R') { reset(); return; }
    },
    [stepForward, stepBackward, togglePlay, goToFirst, goToLast, reset, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!isOpen) return null;

  const groups = [...new Set(shortcuts.map(s => s.group))];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          animation: 'fade-in-up 0.15s ease-out',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 201,
          width: '380px',
          maxWidth: '90vw',
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          overflow: 'hidden',
          animation: 'badge-pop-in 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard style={{ width: '16px', height: '16px', color: 'var(--accent-indigo)' }} />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Keyboard Shortcuts
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--input-bg)',
              color: 'var(--muted-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X style={{ width: '13px', height: '13px' }} />
          </button>
        </div>

        {/* Shortcut list */}
        <div style={{ padding: '12px 20px 20px' }}>
          {groups.map((group) => (
            <div key={group} style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--muted-color)',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '8px',
                  paddingBottom: '6px',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                {group}
              </div>
              {shortcuts.filter(s => s.group === group).map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {s.action}
                  </span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {s.keys.map((k, ki) => (
                      <React.Fragment key={ki}>
                        <KeyCap label={k} />
                        {ki < s.keys.length - 1 && (
                          <span style={{ fontSize: '9px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.015)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <KeyCap label="?" />
          <span style={{ fontSize: '10px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
            Press anywhere to toggle this panel
          </span>
        </div>
      </div>
    </>
  );
};

// Hook that handles the ? key to open the modal
export const useKeyboardShortcutsToggle = (setOpen: (v: boolean | ((prev: boolean) => boolean)) => void) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?') setOpen(prev => !prev);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setOpen]);
};
