import React from 'react';
import { useDPStore } from '../store';
import { Flag, User } from 'lucide-react';

export const StaircaseDiagram: React.FC = () => {
  const { n, steps, cur } = useDPStore();
  const currentStep = steps[cur] || steps[0];

  // SVG parameters
  const stepWidth = Math.min(48, Math.max(28, 520 / (n + 1)));
  const stepHeightStep = 14;
  const paddingX = 40;
  const paddingY = 40;

  const svgWidth = (n + 1) * stepWidth + paddingX * 2;
  const svgHeight = n * stepHeightStep + 100;

  function getStairStyle(i: number) {
    const val = currentStep ? currentStep.dpArray[i] : null;
    if (val === null) {
      return {
        fill: 'var(--cell-unfilled-bg)',
        stroke: 'var(--cell-unfilled-border)',
        strokeWidth: 1,
        opacity: 1,
        showValue: false,
        valueColor: 'transparent',
        valueFontSize: 13,
        valueFontWeight: 500,
      };
    }
    if (currentStep && i === currentStep.activeIndex) {
      return {
        fill: 'var(--cell-active-bg)',
        stroke: 'var(--cell-active-border)',
        strokeWidth: 2,
        opacity: 1,
        showValue: true,
        valueColor: 'var(--cell-active-text)',
        valueFontSize: 14,
        valueFontWeight: 700,
      };
    }
    return {
      fill: 'var(--cell-filled-bg)',
      stroke: 'var(--cell-filled-border)',
      strokeWidth: 1,
      opacity: 0.85,
      showValue: true,
      valueColor: 'var(--cell-filled-text)',
      valueFontSize: 13,
      valueFontWeight: 500,
    };
  }

  const isDoneState = currentStep ? (currentStep.type === 'done' || currentStep.activeIndex === -1) : false;
  const activeI = (currentStep && currentStep.activeIndex >= 0 && !isDoneState)
    ? currentStep.activeIndex
    : n;

  const activeStairX = activeI * stepWidth;
  const activeStairHeight = Math.max(12, activeI * stepHeightStep + 12);
  const activeStairY = -activeStairHeight;

  const iconX = activeStairX + stepWidth / 2;
  const iconY = activeStairY - 36;

  return (
    <div
      style={{ background: 'transparent' }}
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden p-4"
    >
      {/* Top Banner */}
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-color)]">
          STAIRCASE MODEL
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-color)] font-mono">
          n={n}
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="w-full h-full max-h-[320px] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-w-full max-h-full transition-all duration-300"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${paddingX}, ${svgHeight - paddingY})`}>
            {/* Draw Base Ground line */}
            <line
              x1={-20}
              y1={0}
              x2={(n + 1) * stepWidth + 20}
              y2={0}
              stroke="var(--border-color)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Draw Stairs 0 to n */}
            {Array.from({ length: n + 1 }).map((_, i) => {
              const x = i * stepWidth;
              const h = Math.max(12, i * stepHeightStep + 12);
              const y = -h;

              const style = getStairStyle(i);

              return (
                <g key={i} style={{ opacity: style.opacity, transition: 'opacity 0.25s ease' }}>
                  {/* Step Rect */}
                  <rect
                    x={x}
                    y={y}
                    width={stepWidth}
                    height={h}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    rx={3}
                    style={{ transition: 'fill 0.25s ease, stroke 0.25s ease' }}
                  />

                  {/* Computed DP Value Text inside Stair */}
                  {style.showValue && (
                    <text
                      x={x + stepWidth / 2}
                      y={y + 16}
                      textAnchor="middle"
                      fill={style.valueColor}
                      fontSize={style.valueFontSize}
                      fontWeight={style.valueFontWeight}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {currentStep.dpArray[i]}
                    </text>
                  )}

                  {/* Top Finish Flag on Stair n */}
                  {i === n && (
                    <g transform={`translate(${x + stepWidth / 2 - 8}, ${y - 22})`}>
                      <Flag className="w-4 h-4 text-[var(--accent-indigo)]" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Single Dynamic Person Avatar sitting on activeStair */}
            <g
              transform={`translate(${iconX - 12}, ${iconY})`}
              style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
              className="animate-bounce"
            >
              <circle cx="12" cy="12" r="14" fill="var(--cell-active-bg)" stroke="var(--cell-active-border)" strokeWidth="2" />
              <User className="w-4 h-4 text-[var(--accent-indigo)] transform translate-x-[4px] translate-y-[4px]" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
