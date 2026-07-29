import React, { useRef, useEffect, useState } from 'react';
import type { ThreeWaySourceCell } from '../problems/types';

export interface DPGrid2DProps {
  table: (number | boolean | null)[][];
  rowLabels: string[];
  colLabels: string[];
  activeCell: [number, number] | null;
  sourceCells: [number, number][];
  sourceLabels?: ('skip' | 'reuse')[];
  threeWaySourceCells?: ThreeWaySourceCell[];
  matchType?: 'match' | 'mismatch' | null;
  getCellState?: (r: number, c: number) => 'unfilled' | 'source' | 'active' | 'filled' | 'invalid' | undefined;
  showCostAndDp?: boolean;
  costGrid?: number[][];
  booleanMode?: boolean;
}

interface Arrow2D {
  path: string;
  color?: string;
  strokeWidth?: number;
  label?: string;
  labelColor?: string;
  markerId?: string;
  labelX?: number;
  labelY?: number;
}

export const DPGrid2D: React.FC<DPGrid2DProps> = ({
  table,
  rowLabels,
  colLabels,
  activeCell,
  sourceCells,
  sourceLabels,
  threeWaySourceCells,
  matchType = null,
  getCellState,
  showCostAndDp = false,
  costGrid = [],
  booleanMode = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const [arrows, setArrows] = useState<Arrow2D[]>([]);

  const rowCount = table.length;
  const colCount = colLabels.length;

  // Reset/sync 2D cellRefs array structure when table dimensions change
  if (cellRefs.current.length !== rowCount) {
    cellRefs.current = Array.from({ length: rowCount }, () =>
      new Array(colCount).fill(null)
    );
  }

  // Default cell state logic with override
  const computeCellState = (r: number, c: number): 'unfilled' | 'source' | 'active' | 'filled' | 'invalid' => {
    if (getCellState) {
      const customState = getCellState(r, c);
      if (customState) return customState;
    }
    const val = table[r]?.[c];
    if (activeCell && activeCell[0] === r && activeCell[1] === c) return 'active';
    if (sourceCells.some(([sr, sc]) => sr === r && sc === c)) return 'source';
    if (val === null || val === undefined) return 'unfilled';
    return 'filled';
  };

  // Measure cell positions after render to compute 2D SVG arrow paths
  useEffect(() => {
    if (!activeCell) {
      setArrows([]);
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();

      const [tr, tc] = activeCell;
      const targetEl = cellRefs.current[tr]?.[tc];
      if (!targetEl) return;
      const targetRect = targetEl.getBoundingClientRect();
      const tgtX = targetRect.left - wrapperRect.left + targetRect.width / 2;
      const tgtY = targetRect.top - wrapperRect.top + targetRect.height / 2;

      const computed: Arrow2D[] = [];

      if (threeWaySourceCells && threeWaySourceCells.length > 0 && matchType !== 'match') {
        threeWaySourceCells.forEach(({ cell: [sr, sc], operation, isWinner }) => {
          const srcEl = cellRefs.current[sr]?.[sc];
          if (!srcEl) return;
          const srcRect = srcEl.getBoundingClientRect();
          const srcX = srcRect.left - wrapperRect.left + srcRect.width / 2;
          const srcY = srcRect.top - wrapperRect.top + srcRect.height / 2;

          let pathStr = '';
          const midX = (srcX + tgtX) / 2;
          const midY = (srcY + tgtY) / 2;

          let color = 'rgba(99, 102, 241, 0.85)';
          let labelColor = isWinner ? 'var(--cell-active-text)' : 'var(--accent-indigo)';
          let markerId = 'arrowhead-2d-indigo';
          let labelStr = '';
          let labelX = midX;
          let labelY = midY;

          if (operation === 'replace') {
            const controlX = midX;
            const controlY = Math.min(srcY, tgtY) - 18;
            pathStr = `M ${srcX} ${srcY} Q ${controlX} ${controlY} ${tgtX} ${tgtY}`;
            color = 'rgba(129, 140, 248, 0.85)';
            labelColor = isWinner ? 'var(--cell-active-text)' : 'var(--accent-indigo)';
            markerId = 'arrowhead-2d-indigo';
            labelStr = isWinner ? 'REPLACE ✓' : 'REPLACE';
            labelX = midX - 8;
            labelY = midY - 14;
          } else if (operation === 'delete') {
            pathStr = `M ${srcX} ${srcY} L ${tgtX} ${tgtY}`;
            color = 'rgba(248, 113, 113, 0.85)';
            labelColor = isWinner ? 'var(--accent-coral)' : 'var(--accent-coral)';
            markerId = 'arrowhead-2d-red';
            labelStr = isWinner ? 'DELETE ✓' : 'DELETE';
            labelX = midX - 22;
            labelY = midY;
          } else if (operation === 'insert') {
            pathStr = `M ${srcX} ${srcY} L ${tgtX} ${tgtY}`;
            color = 'rgba(96, 165, 250, 0.85)';
            labelColor = isWinner ? 'var(--cell-source-text)' : 'var(--accent-blue)';
            markerId = 'arrowhead-2d-blue';
            labelStr = isWinner ? 'INSERT ✓' : 'INSERT';
            labelX = midX;
            labelY = midY - 10;
          }

          computed.push({
            path: pathStr,
            color,
            strokeWidth: isWinner ? 2.5 : 1.5,
            label: labelStr,
            labelColor,
            markerId,
            labelX,
            labelY,
          });
        });
      } else if (matchType === 'match' && sourceCells.length > 0) {
        const [sr, sc] = sourceCells[0];
        const srcEl = cellRefs.current[sr]?.[sc];
        if (srcEl) {
          const srcRect = srcEl.getBoundingClientRect();
          const srcX = srcRect.left - wrapperRect.left + srcRect.width / 2;
          const srcY = srcRect.top - wrapperRect.top + srcRect.height / 2;
          const midX = (srcX + tgtX) / 2;
          const midY = (srcY + tgtY) / 2;
          const controlX = midX;
          const controlY = Math.min(srcY, tgtY) - 18;
          const pathStr = `M ${srcX} ${srcY} Q ${controlX} ${controlY} ${tgtX} ${tgtY}`;

          computed.push({
            path: pathStr,
            color: 'rgba(34, 197, 94, 0.85)',
            strokeWidth: 2.5,
            label: 'MATCH (no edit)',
            labelColor: 'var(--cell-match-text)',
            markerId: 'arrowhead-2d-green',
            labelX: midX,
            labelY: midY - 14,
          });
        }
      } else if (sourceCells.length > 0) {
        sourceCells.forEach(([sr, sc], sIdx) => {
            const srcEl = cellRefs.current[sr]?.[sc];
            if (!srcEl) return;
            const srcRect = srcEl.getBoundingClientRect();
            const srcX = srcRect.left - wrapperRect.left + srcRect.width / 2;
            const srcY = srcRect.top - wrapperRect.top + srcRect.height / 2;

            const sLabel = sourceLabels?.[sIdx];

            if (sLabel === 'reuse') {
              // Same-row horizontal curve — dips BELOW the row line
              // srcX is LEFT of tgtX (source is j-coin, target is j)
              const midX = (srcX + tgtX) / 2;
              // srcY ≈ tgtY (same row), so curve down by 30px from row center
              const controlY = srcY + 30;
              const pathStr = `M ${srcX} ${srcY} Q ${midX} ${controlY} ${tgtX} ${tgtY}`;

              computed.push({
                path: pathStr,
                color: 'rgba(52, 211, 153, 0.85)',
                strokeWidth: 2,
                label: 'REUSE coin',
                labelColor: 'var(--accent-teal)',
                markerId: 'arrowhead-2d-teal',
                labelX: midX,
                labelY: srcY + 36,
              });
            } else if (sLabel === 'skip') {
              // Vertical straight arrow from row above (same column)
              const pathStr = `M ${srcX} ${srcY} L ${tgtX} ${tgtY}`;
              const midX = (srcX + tgtX) / 2;
              const midY = (srcY + tgtY) / 2;

              computed.push({
                path: pathStr,
                color: 'rgba(99, 102, 241, 0.85)',
                strokeWidth: 2,
                label: 'SKIP coin',
                labelColor: 'var(--accent-indigo)',
                markerId: 'arrowhead-2d-indigo',
                labelX: midX - 28,
                labelY: midY,
              });
            } else {
              // Default fallback — generic indigo arrow (used by other 2D problems)
              const isDiagonal = sr !== tr && sc !== tc;
              let pathStr = '';

              if (isDiagonal) {
                const controlX = (srcX + tgtX) / 2;
                const controlY = Math.min(srcY, tgtY) - 20;
                pathStr = `M ${srcX} ${srcY} Q ${controlX} ${controlY} ${tgtX} ${tgtY}`;
              } else {
                pathStr = `M ${srcX} ${srcY} L ${tgtX} ${tgtY}`;
              }

              computed.push({ path: pathStr });
            }
          });
        }

      setArrows(computed);
    });

    return () => cancelAnimationFrame(frameId);
  }, [table, activeCell, sourceCells, sourceLabels, threeWaySourceCells, matchType]);

  const isGreenMatch = matchType === 'match';
  const cellHeight = showCostAndDp ? '58px' : '36px';
  const cellWidth = showCostAndDp ? '56px' : '44px';

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '12px',
        background: 'var(--grid-wrapper-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        boxShadow: 'var(--grid-wrapper-shadow)',
      }}
      className="select-none"
    >
      {/* SVG Overlay for arrows */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <defs>
          <marker
            id="arrowhead-2d-indigo"
            markerWidth="6"
            markerHeight="6"
            refX="4"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="var(--accent-indigo-dim)" />
          </marker>
          <marker
            id="arrowhead-2d-green"
            markerWidth="6"
            markerHeight="6"
            refX="4"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="var(--accent-green)" />
          </marker>
          <marker
            id="arrowhead-2d-red"
            markerWidth="6"
            markerHeight="6"
            refX="4"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="var(--accent-coral)" />
          </marker>
          <marker
            id="arrowhead-2d-blue"
            markerWidth="6"
            markerHeight="6"
            refX="4"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="var(--accent-blue)" />
          </marker>
          <marker
            id="arrowhead-2d-teal"
            markerWidth="6"
            markerHeight="6"
            refX="4"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="var(--accent-teal)" />
          </marker>
        </defs>

        {arrows.map((arr, idx) => (
          <React.Fragment key={`arrow2d-${idx}`}>
            <path
              d={arr.path}
              stroke={arr.color || (isGreenMatch ? 'rgba(34, 197, 94, 0.85)' : 'rgba(99, 102, 241, 0.85)')}
              strokeWidth={arr.strokeWidth || (isGreenMatch ? 2.5 : 2)}
              fill="none"
              markerEnd={`url(#${arr.markerId || (isGreenMatch ? 'arrowhead-2d-green' : 'arrowhead-2d-indigo')})`}
              style={{
                animation: 'fadeInArrow 150ms ease forwards',
              }}
            />
            {arr.label && arr.labelX !== undefined && arr.labelY !== undefined && (
              <text
                x={arr.labelX}
                y={arr.labelY}
                fill={arr.labelColor || 'var(--accent-indigo)'}
                fontSize="9"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ pointerEvents: 'none' }}
              >
                {arr.label}
              </text>
            )}
          </React.Fragment>
        ))}
      </svg>

      {/* Grid Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `90px repeat(${colCount}, ${cellWidth})`,
          gap: '6px',
          alignItems: 'center',
        }}
      >
        {/* Top-Left Corner Empty Cell */}
        <div style={{ width: '90px', height: '32px' }} />

        {/* Column Headers */}
        {colLabels.map((cLabel, cIdx) => {
          const isChar = cLabel !== '∅' && !cLabel.includes('=') && cLabel.length === 1;

          return (
            <div
              key={`col-hdr-${cIdx}`}
              style={{
                width: cellWidth,
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isChar ? '14px' : '11px',
                fontWeight: isChar ? 700 : 600,
                color: activeCell && activeCell[1] === cIdx ? (isChar ? 'var(--accent-green)' : 'var(--accent-indigo)') : 'var(--muted-color)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {cLabel}
            </div>
          );
        })}

        {/* Rows: Row Label + Data Cells */}
        {table.map((row, rIdx) => {
          const rLabel = rowLabels[rIdx] || `i=${rIdx}`;
          const isChar = rLabel !== '∅' && !rLabel.includes('=') && rLabel.length === 1;

          return (
            <React.Fragment key={`row-grp-${rIdx}`}>
              {/* Row Label */}
              <div
                style={{
                  width: '90px',
                  height: cellHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '10px',
                  fontSize: isChar ? '14px' : '11px',
                  fontWeight: isChar ? 700 : 600,
                  color: activeCell && activeCell[0] === rIdx ? (isChar ? 'var(--accent-green)' : 'var(--accent-indigo)') : 'var(--muted-color)',
                  fontFamily: 'JetBrains Mono, monospace',
                  whiteSpace: 'nowrap',
                }}
              >
                {rLabel}
              </div>

              {/* Row Data Cells */}
              {row.map((val, cIdx) => {
                const state = computeCellState(rIdx, cIdx);
                const cellKey = `${rIdx}-${cIdx}`;
                const cellCost = costGrid[rIdx]?.[cIdx];
                const isTrueVal = val === true;

                return (
                  <div
                    key={cellKey}
                    ref={(el) => {
                      if (!cellRefs.current[rIdx]) {
                        cellRefs.current[rIdx] = [];
                      }
                      cellRefs.current[rIdx][cIdx] = el;
                    }}
                    style={{
                      width: cellWidth,
                      height: cellHeight,
                      display: 'flex',
                      flexDirection: showCostAndDp ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: showCostAndDp ? '2px' : '0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      fontFamily: 'JetBrains Mono, monospace',
                      transition: 'all 0.15s ease',
                      ...(booleanMode && isTrueVal && {
                        boxShadow: 'inset 0 0 0 1px var(--cell-bool-true-glow)',
                      }),
                      ...(state === 'invalid' && {
                        background: 'var(--cell-invalid-bg)',
                        border: '1px dashed var(--cell-invalid-border)',
                        color: 'var(--cell-invalid-text)',
                        opacity: 0.3,
                        cursor: 'default',
                      }),
                      ...(state === 'unfilled' && {
                        background: 'var(--cell-unfilled-bg)',
                        border: '1px solid var(--cell-unfilled-border)',
                        color: showCostAndDp ? 'var(--text-color)' : 'transparent',
                      }),
                      ...(state === 'source' && {
                        background: isGreenMatch ? 'var(--cell-match-bg)' : 'var(--cell-source-bg)',
                        border: isGreenMatch ? '1.5px solid var(--cell-match-border)' : '1.5px solid var(--cell-source-border)',
                        color: booleanMode && isTrueVal ? 'var(--cell-match-text)' : isGreenMatch ? 'var(--cell-match-text)' : 'var(--cell-source-text)',
                      }),
                      ...(state === 'active' && {
                        background: isGreenMatch ? 'var(--cell-match-active-bg)' : 'var(--cell-active-bg)',
                        border: isGreenMatch ? '1.5px solid var(--cell-match-active-border)' : '1.5px solid var(--cell-active-border)',
                        color: booleanMode && isTrueVal ? 'var(--cell-match-active-text)' : isGreenMatch ? 'var(--cell-match-active-text)' : 'var(--cell-active-text)',
                      }),
                      ...(state === 'filled' && {
                        background: booleanMode && isTrueVal ? 'var(--cell-bool-filled-bg)' : 'var(--cell-filled-bg)',
                        border: booleanMode && isTrueVal ? '1.5px solid var(--cell-bool-filled-border)' : '1.5px solid var(--cell-filled-border)',
                        color: booleanMode && isTrueVal ? 'var(--cell-bool-filled-text)' : 'var(--cell-filled-text)',
                      }),
                    }}
                  >
                    {booleanMode ? (
                      <>{val === true ? 'T' : val === false ? 'F' : ''}</>
                    ) : showCostAndDp ? (
                      <>
                        <span
                          style={{
                            fontSize: '9px',
                            color: 'var(--muted-color)',
                            lineHeight: 1,
                            fontWeight: 600,
                          }}
                        >
                          cost:{cellCost !== undefined ? cellCost : 0}
                        </span>
                        <div
                          style={{
                            width: '80%',
                            borderTop: '1px solid var(--border-color)',
                            margin: '2px 0',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            fontFamily: 'JetBrains Mono, monospace',
                            opacity: state === 'unfilled' ? 0.3 : 1,
                          }}
                        >
                          {val !== null ? String(val) : '—'}
                        </span>
                      </>
                    ) : (
                      <>{state === 'invalid' ? '·' : val !== null ? String(val) : ''}</>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
