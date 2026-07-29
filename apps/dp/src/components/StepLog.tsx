import React from 'react';
import { useDPStore } from '../store';
import { CheckCircle2, Info, ArrowRightCircle, Sparkles } from 'lucide-react';

export const StepLog: React.FC = () => {
  const { steps, cur } = useDPStore();
  const currentStep = steps[cur] || steps[0];

  if (!currentStep) return null;

  const type = currentStep.type;
  const isDone = type === 'done';

  // Badge styles
  let badgeStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '11px',
    flexShrink: 0,
  };
  let Icon = Info;

  if (type === 'base') {
    badgeStyle = {
      background: 'var(--accent-blue-bg)',
      border: '1px solid var(--accent-blue)',
      color: 'var(--accent-blue)',
      borderRadius: '6px',
      padding: '2px 8px',
      fontSize: '11px',
      flexShrink: 0,
    };
    Icon = Sparkles;
  } else if (type === 'fill') {
    badgeStyle = {
      background: 'var(--accent-indigo-bg)',
      border: '1px solid var(--accent-indigo)',
      color: 'var(--cell-active-text)',
      borderRadius: '6px',
      padding: '2px 8px',
      fontSize: '11px',
      flexShrink: 0,
    };
    Icon = ArrowRightCircle;
  } else if (type === 'done') {
    badgeStyle = {
      background: 'var(--accent-green-bg)',
      border: '1px solid var(--accent-green)',
      color: 'var(--accent-green)',
      borderRadius: '6px',
      padding: '2px 8px',
      fontSize: '11px',
      flexShrink: 0,
    };
    Icon = CheckCircle2;
  }

  const containerStyle: React.CSSProperties = isDone
    ? {
        background: 'var(--accent-green-bg)',
        borderTop: '1px solid var(--accent-green-bg)',
        color: 'var(--accent-green)',
        fontSize: '13px',
        fontFamily: 'JetBrains Mono, monospace',
      }
    : {
        background: 'var(--panel-bg)',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-color)',
        fontSize: '13px',
      };

  return (
    <div
      style={containerStyle}
      className="w-full px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 transition-all overflow-hidden select-none"
    >
      {/* Left: Type Badge */}
      <div style={badgeStyle} className="flex items-center gap-1.5 font-bold font-mono tracking-wider uppercase shrink-0">
        <Icon className="w-3.5 h-3.5" />
        <span>{type}</span>
      </div>

      {/* Center: Message */}
      <p className="flex-1 font-medium font-mono truncate min-w-0 text-[12.5px]">
        {currentStep.msg}
      </p>

      {/* Right: Answer Badge on Done */}
      {isDone && (
        <div
          style={{
            background: 'var(--accent-green-bg)',
            border: '1px solid var(--accent-green)',
            color: 'var(--accent-green)',
            borderRadius: '6px',
            padding: '2px 10px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
          }}
          className="flex items-center gap-1.5 font-bold font-mono shrink-0 shadow-sm"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{currentStep.msg.split('Answer: ')[1] || 'Completed'}</span>
        </div>
      )}
    </div>
  );
};
