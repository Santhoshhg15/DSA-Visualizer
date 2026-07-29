import React from 'react';
import { useDPStore } from '../store';

export const HouseRow: React.FC = () => {
  const { steps, cur, n } = useDPStore();
  const step = steps[cur] || steps[0];

  if (!step) return null;

  const houses = step.houses || [2, 7, 9, 3, 1];
  const activeIndex = step.activeIndex;
  const robbedIndices = step.robbedIndices || [];
  const stepType = step.type;

  return (
    <div className="flex items-center justify-center gap-4 py-6 px-4 overflow-x-auto select-none w-full max-w-full">
      {houses.map((val, idx) => {
        const isRobbed = robbedIndices.includes(idx);
        const isActive = idx === activeIndex && stepType !== 'done';
        const isUnvisited = stepType === 'init' || (stepType !== 'done' && stepType !== 'backtrack' && idx > activeIndex);
        const isSkipped = !isUnvisited && !isActive && !isRobbed;

        // Colors & styles
        let strokeColor = 'var(--border-color)';
        let fillColor = 'var(--cell-unfilled-bg)';
        let textColor = 'var(--muted-color)';
        let opacity = 1;
        let badge: string | null = null;
        let badgeBg = 'transparent';
        let badgeColor = 'transparent';
        let isStrikethrough = false;

        if (isUnvisited) {
          strokeColor = 'var(--border-color)';
          fillColor = 'var(--cell-unfilled-bg)';
          opacity = 0.5;
        } else if (isActive) {
          strokeColor = 'var(--cell-active-border)';
          fillColor = 'var(--cell-active-bg)';
          textColor = 'var(--cell-active-text)';
        } else if (isRobbed) {
          strokeColor = 'var(--cell-filled-border)';
          fillColor = 'var(--cell-filled-bg)';
          textColor = 'var(--cell-filled-text)';
          badge = '$';
          badgeBg = 'var(--accent-blue-bg)';
          badgeColor = 'var(--accent-blue)';
        } else if (isSkipped) {
          strokeColor = 'var(--border-color)';
          fillColor = 'var(--cell-unfilled-bg)';
          textColor = 'var(--muted-color)';
          opacity = 0.5;
          badge = '✕';
          badgeBg = 'var(--border-color)';
          badgeColor = 'var(--muted-color)';
          isStrikethrough = true;
        }

        return (
          <div
            key={idx}
            className={`relative flex flex-col items-center transition-all duration-300 ${
              isActive ? 'scale-105 animate-pulse' : ''
            }`}
            style={{ opacity }}
          >
            {/* House Label */}
            <span className="text-[10px] font-mono font-semibold text-[var(--muted-color)] mb-1 uppercase tracking-wider">
              House {idx}
            </span>

            {/* House SVG */}
            <div className="relative w-20 h-24 flex items-center justify-center">
              <svg viewBox="0 0 80 90" className="w-full h-full drop-shadow-md">
                {/* Roof */}
                <path
                  d="M 40 8 L 74 36 L 6 36 Z"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? '2.5' : '2'}
                  strokeLinejoin="round"
                />
                {/* House Body */}
                <rect
                  x="12"
                  y="35"
                  width="56"
                  height="48"
                  rx="4"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? '2.5' : '2'}
                />
                {/* Door Accent */}
                <rect
                  x="33"
                  y="57"
                  width="14"
                  height="26"
                  rx="2"
                  fill="rgba(0, 0, 0, 0.3)"
                  stroke={strokeColor}
                  strokeWidth="1"
                />
              </svg>

              {/* Dollar value text inside house */}
              {!isUnvisited && (
                <div className="absolute top-[48px] inset-x-0 text-center pointer-events-none">
                  <span
                    style={{ color: textColor }}
                    className={`font-mono text-sm font-bold ${
                      isStrikethrough ? 'line-through opacity-70' : ''
                    }`}
                  >
                    ${val}
                  </span>
                </div>
              )}

              {/* Corner status badge */}
              {badge && (
                <div
                  style={{ background: badgeBg, color: badgeColor, borderColor: strokeColor }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold font-mono shadow-sm"
                >
                  {badge}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
