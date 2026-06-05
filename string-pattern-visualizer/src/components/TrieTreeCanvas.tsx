import { useMemo } from 'react';
import type { VisualTrieNode } from '../types';

interface Props {
  nodes: Record<string, VisualTrieNode>;
  activeNodeId?: string | null;
  activeOperation?: 'insert' | 'search' | 'startsWith';
}

const NODE_RADIUS = 20;
const LEVEL_HEIGHT = 85;
const MIN_SLOT_WIDTH = 70;
const PADDING = 50;

export function TrieTreeCanvas({ nodes, activeNodeId, activeOperation }: Props) {
  // 1. Calculate subtree slots to lay out nodes without overlap
  const subtreeSlots = useMemo(() => {
    const slots: Record<string, number> = {};
    if (!nodes) return slots;
    
    function countSlots(nodeId: string): number {
      if (!nodeId) return 1;
      const node = nodes[nodeId];
      if (!node || !node.children || typeof node.children !== 'object' || Object.keys(node.children).length === 0) {
        slots[nodeId] = 1;
        return 1;
      }
      let sum = 0;
      const childKeys = Object.keys(node.children).sort();
      for (const key of childKeys) {
        const childId = node.children[key];
        if (childId) {
          sum += countSlots(childId);
        } else {
          sum += 1;
        }
      }
      slots[nodeId] = sum;
      return sum;
    }
    
    if (nodes['root']) {
      countSlots('root');
    }
    return slots;
  }, [nodes]);

  // 2. Perform DFS to calculate (x, y) layout coordinates
  const layout = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    if (!nodes) return positions;
    const rootSlots = subtreeSlots['root'] || 1;
    const slotWidth = Math.max(MIN_SLOT_WIDTH, 800 / rootSlots);

    function assignPos(nodeId: string, depth: number, offset: number) {
      if (!nodeId) return;
      const node = nodes[nodeId];
      if (!node) return;

      const y = depth * LEVEL_HEIGHT + PADDING;
      const childKeys = node.children && typeof node.children === 'object' ? Object.keys(node.children).sort() : [];

      let x = 0;
      if (childKeys.length === 0) {
        x = offset + slotWidth / 2;
      } else {
        let curOffset = offset;
        const childXs: number[] = [];
        for (const key of childKeys) {
          const childId = node.children[key];
          if (childId) {
            const childSlots = subtreeSlots[childId] || 1;
            assignPos(childId, depth + 1, curOffset);
            if (positions[childId]) {
              childXs.push(positions[childId].x);
            }
            curOffset += childSlots * slotWidth;
          }
        }
        if (childXs.length > 0) {
          x = (childXs[0] + childXs[childXs.length - 1]) / 2;
        } else {
          x = offset + slotWidth / 2;
        }
      }

      positions[nodeId] = { x, y };
    }

    if (nodes['root']) {
      assignPos('root', 0, 0);
    }
    return positions;
  }, [nodes, subtreeSlots]);

  // 3. Compute dynamic viewBox from actual node positions
  const viewBox = useMemo(() => {
    const allPos = Object.values(layout);
    if (allPos.length === 0) return { x: 0, y: 0, w: 800, h: 400 };

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of allPos) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const pad = PADDING + NODE_RADIUS + 15;
    const x = minX - pad;
    const y = minY - pad;
    const w = Math.max(350, maxX - minX + pad * 2);
    const h = Math.max(250, maxY - minY + pad * 2);
    return { x, y, w, h };
  }, [layout]);

  // 4. Find parent-child links for drawing connections
  const links = useMemo(() => {
    const arr: { from: string; to: string; char: string }[] = [];
    if (!nodes) return arr;
    for (const parentId in nodes) {
      const node = nodes[parentId];
      if (node && node.children && typeof node.children === 'object') {
        for (const char in node.children) {
          const childId = node.children[char];
          if (childId) {
            arr.push({ from: parentId, to: childId, char });
          }
        }
      }
    }
    return arr;
  }, [nodes]);

  const getStrokeColor = (toId: string) => {
    const isActiveLink = activeNodeId === toId;
    if (isActiveLink) {
      if (activeOperation === 'insert') return '#10b981';
      if (activeOperation === 'search') return '#3b82f6';
      return '#f59e0b';
    }
    return 'var(--border-color)';
  };

  if (!nodes || !nodes['root']) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--muted-color)] text-xs font-semibold">
        Trie not initialized
      </div>
    );
  }

  const aspectH = Math.max(380, Math.min(650, viewBox.h * 1.15));

  // Smooth transition style for SVG elements
  const nodeTransition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
  const lineTransition = 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <div
      className="w-full overflow-auto p-4 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl backdrop-blur-xl flex flex-col items-center relative"
      style={{ minHeight: '380px' }}
    >
      {/* Legend */}
      <div className="absolute top-4 left-4 flex gap-4 text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-wider z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-dashed border-blue-400 bg-blue-400/10"></span>
          Root
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[var(--pill-btn-bg)] border-2 border-[var(--border-color)]"></span>
          Node
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-emerald-500/10"></span>
          End Of Word
        </span>
      </div>

      <svg
        className="w-full select-none mt-6"
        style={{
          height: `${aspectH}px`,
          transition: 'height 0.4s ease',
        }}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Draw Links with smooth transitions */}
        {links.map(link => {
          const fromPos = layout[link.from];
          const toPos = layout[link.to];
          if (!fromPos || !toPos) return null;

          const isActive = activeNodeId === link.to;
          const strokeColor = getStrokeColor(link.to);

          return (
            <g key={`link-${link.from}-${link.to}`}>
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={strokeColor}
                strokeWidth={isActive ? '3' : '1.5'}
                opacity={isActive ? 1 : 0.6}
                style={{ transition: lineTransition }}
              />
              {/* Edge character label */}
              <text
                x={(fromPos.x + toPos.x) / 2 + 10}
                y={(fromPos.y + toPos.y) / 2 - 4}
                fill="var(--muted-color)"
                fontSize="9"
                fontFamily="Outfit, sans-serif"
                fontWeight="700"
                textAnchor="start"
                opacity="0.5"
                style={{ transition: lineTransition }}
              >
                {link.char}
              </text>
            </g>
          );
        })}

        {/* 2. Draw Nodes with smooth transitions */}
        {Object.keys(nodes).map(nodeId => {
          const node = nodes[nodeId];
          if (!node) return null;
          const pos = layout[nodeId];
          if (!pos) return null;

          const isRoot = nodeId === 'root';
          const isActive = activeNodeId === nodeId;
          const isEndOfWord = node.isEndOfWord;
          const isNew = node.isNew;

          let circleFill = 'var(--pill-btn-bg)';
          let circleStroke = 'var(--border-color)';
          let glowFilter = '';
          let strokeW = 2;
          let textFill = 'var(--text-color)';

          if (isRoot) {
            circleStroke = '#60a5fa';
            circleFill = 'rgba(96, 165, 250, 0.12)';
            strokeW = 2;
            textFill = '#93bbfc';
          }

          if (isActive) {
            if (activeOperation === 'insert') {
              glowFilter = 'url(#glow-emerald)';
              circleStroke = '#10b981';
              circleFill = 'rgba(16, 185, 129, 0.25)';
              textFill = '#ffffff';
            } else if (activeOperation === 'search') {
              glowFilter = 'url(#glow-blue)';
              circleStroke = '#3b82f6';
              circleFill = 'rgba(59, 130, 246, 0.25)';
              textFill = '#ffffff';
            } else {
              glowFilter = 'url(#glow-amber)';
              circleStroke = '#f59e0b';
              circleFill = 'rgba(245, 158, 11, 0.25)';
              textFill = '#ffffff';
            }
            strokeW = 3;
          } else if (isEndOfWord) {
            circleStroke = '#10b981';
            circleFill = 'rgba(16, 185, 129, 0.12)';
            strokeW = 2.5;
            textFill = '#4fffb0';
          } else if (isNew) {
            circleStroke = '#a371f7';
            circleFill = 'rgba(163, 113, 247, 0.12)';
            textFill = '#c4a5fb';
          }

          return (
            <g
              key={nodeId}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: nodeTransition,
              }}
            >
              {/* Double border for End-of-Word nodes */}
              {isEndOfWord && (
                <circle
                  r={NODE_RADIUS + 6}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                  opacity="0.6"
                  style={{ transition: 'all 0.3s' }}
                />
              )}

              {/* Root dashed ring */}
              {isRoot && !isActive && (
                <circle
                  r={NODE_RADIUS + 5}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.35"
                />
              )}

              {/* Main Node Bubble */}
              <circle
                r={NODE_RADIUS}
                fill={circleFill}
                stroke={circleStroke}
                strokeWidth={strokeW}
                filter={glowFilter || undefined}
                style={{ transition: 'stroke 0.3s, fill 0.3s, stroke-width 0.3s' }}
              />

              {/* Node Character */}
              <text
                dy="5"
                textAnchor="middle"
                fill={textFill}
                fontSize="13"
                fontWeight="800"
                fontFamily="Outfit, sans-serif"
                style={{ transition: 'fill 0.3s' }}
              >
                {isRoot ? 'R' : node.char}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
