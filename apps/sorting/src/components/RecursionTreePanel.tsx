import { useRef, useEffect, useState } from 'react';
import { useSortingStore } from '../stores/useSortingStore';
import type { RecursionNode, RecursionTreeSnapshot } from '../algorithms/types';

// ─── Constants ───────────────────────────────────────────────────────────────
const NODE_W = 64;
const NODE_H = 26;
const H_GAP = 12;
const V_GAP = 44;
const DEPTH_STEP = NODE_H + V_GAP;

// Node color by state
function nodeColor(node: RecursionNode): { fill: string; stroke: string; text: string } {
  switch (node.state) {
    case 'active':        return { fill: '#1e3a5f', stroke: '#3b82f6', text: '#93c5fd' };
    case 'splitting':     return { fill: '#14303a', stroke: '#0891B2', text: '#67e8f9' };
    case 'left-done':     return { fill: '#1a2a1a', stroke: '#16a34a', text: '#86efac' };
    case 'merging':       return { fill: '#2d1b4e', stroke: '#7C3AED', text: '#c4b5fd' };
    case 'partitioning':  return { fill: '#3a2010', stroke: '#FF6B00', text: '#fdba74' };
    case 'done':          return { fill: '#0a2a1a', stroke: '#10b981', text: '#6ee7b7' };
    case 'pending':
    default:              return { fill: '#1a1a1f', stroke: '#3a3a45', text: '#6B6B80' };
  }
}

function stateLabel(node: RecursionNode): string {
  if (node.isBaseCase && node.state !== 'pending') return 'base';
  switch (node.state) {
    case 'active':       return node.type === 'quick' ? 'call' : 'call';
    case 'splitting':    return 'split';
    case 'left-done':    return 'L✓';
    case 'merging':      return 'merge';
    case 'partitioning': return 'part.';
    case 'done':         return '✓';
    case 'pending':      return '...';
    default:             return '';
  }
}

// ─── Layout ──────────────────────────────────────────────────────────────────
interface LayoutNode {
  node: RecursionNode;
  x: number;
  y: number;
  width: number;
}

function computeLayout(
  nodes: Record<string, RecursionNode>,
  rootId: string | null
): LayoutNode[] {
  if (!rootId || !nodes[rootId]) return [];

  const result: LayoutNode[] = [];

  // Compute width of subtree
  const subtreeWidth = (id: string): number => {
    const n = nodes[id];
    if (!n) return NODE_W;
    if (!n.leftChildId && !n.rightChildId) return NODE_W;
    const lw = n.leftChildId ? subtreeWidth(n.leftChildId) : 0;
    const rw = n.rightChildId ? subtreeWidth(n.rightChildId) : 0;
    return lw + H_GAP + rw;
  };

  // DFS layout
  const layout = (id: string, x: number, y: number, width: number) => {
    const n = nodes[id];
    if (!n) return;

    result.push({ node: n, x, y, width });

    if (n.leftChildId || n.rightChildId) {
      const lw = n.leftChildId ? subtreeWidth(n.leftChildId) : 0;
      const rw = n.rightChildId ? subtreeWidth(n.rightChildId) : 0;
      const totalChildren = lw + (n.leftChildId && n.rightChildId ? H_GAP : 0) + rw;
      const startX = x + width / 2 - totalChildren / 2;

      if (n.leftChildId) {
        layout(n.leftChildId, startX, y + DEPTH_STEP, lw);
      }
      if (n.rightChildId) {
        const rightX = startX + lw + (n.leftChildId ? H_GAP : 0);
        layout(n.rightChildId, rightX, y + DEPTH_STEP, rw);
      }
    }
  };

  const rootWidth = subtreeWidth(rootId);
  layout(rootId, 0, 0, rootWidth);
  return result;
}

// ─── SVG Tree ────────────────────────────────────────────────────────────────
function RecursionTreeSVG({
  snapshot,
  activeNodeId,
}: {
  snapshot: RecursionTreeSnapshot;
  activeNodeId: string | null;
}) {
  const { nodes, rootId } = snapshot;
  const layout = computeLayout(nodes, rootId);

  if (layout.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#6B6B80] text-sm">
        No tree to display.
      </div>
    );
  }

  // Determine SVG canvas size
  const pad = 16;
  const positions: Record<string, { cx: number; cy: number }> = {};
  let maxX = 0, maxY = 0;

  for (const item of layout) {
    const cx = item.x + item.width / 2;
    const cy = item.y + NODE_H / 2;
    positions[item.node.id] = { cx, cy };
    if (cx + NODE_W / 2 > maxX) maxX = cx + NODE_W / 2;
    if (cy + NODE_H / 2 > maxY) maxY = cy + NODE_H / 2;
  }

  const svgW = maxX + pad * 2;
  const svgH = maxY + pad * 2;

  return (
    <svg
      width={svgW}
      height={svgH}
      style={{ minWidth: svgW, minHeight: svgH }}
      className="overflow-visible"
    >
      <defs>
        <filter id="glow-active">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {layout.map(({ node }) => {
        const edges = [];
        if (node.leftChildId && positions[node.leftChildId]) {
          const p = positions[node.id];
          const c = positions[node.leftChildId];
          edges.push(
            <line
              key={`e-l-${node.id}`}
              x1={p.cx + pad} y1={p.cy + NODE_H / 2 + pad}
              x2={c.cx + pad} y2={c.cy - NODE_H / 2 + pad}
              stroke="#2A2A35"
              strokeWidth={1.5}
            />
          );
        }
        if (node.rightChildId && positions[node.rightChildId]) {
          const p = positions[node.id];
          const c = positions[node.rightChildId];
          edges.push(
            <line
              key={`e-r-${node.id}`}
              x1={p.cx + pad} y1={p.cy + NODE_H / 2 + pad}
              x2={c.cx + pad} y2={c.cy - NODE_H / 2 + pad}
              stroke="#2A2A35"
              strokeWidth={1.5}
            />
          );
        }
        return edges;
      })}

      {/* Nodes */}
      {layout.map(({ node }) => {
        const { cx, cy } = positions[node.id];
        const colors = nodeColor(node);
        const isActive = node.id === activeNodeId;
        const label = `[${node.left}..${node.right}]`;
        const subLabel = stateLabel(node);
        const rx = cx + pad - NODE_W / 2;
        const ry = cy + pad - NODE_H / 2;

        return (
          <g key={node.id} filter={isActive ? 'url(#glow-active)' : undefined}>
            <rect
              x={rx}
              y={ry}
              width={NODE_W}
              height={NODE_H}
              rx={6}
              fill={colors.fill}
              stroke={isActive ? '#60a5fa' : colors.stroke}
              strokeWidth={isActive ? 2 : 1.2}
            />
            {/* Range label */}
            <text
              x={cx + pad}
              y={ry + 11}
              textAnchor="middle"
              fill={colors.text}
              fontSize={9}
              fontFamily="JetBrains Mono, monospace"
              fontWeight={isActive ? 'bold' : 'normal'}
            >
              {label}
            </text>
            {/* State label */}
            <text
              x={cx + pad}
              y={ry + 21}
              textAnchor="middle"
              fill={isActive ? '#93c5fd' : '#6B6B80'}
              fontSize={8}
              fontFamily="JetBrains Mono, monospace"
            >
              {subLabel}
            </text>
            {/* Pivot badge for quick sort */}
            {node.type === 'quick' && node.pivotValue !== undefined && node.state !== 'pending' && node.state !== 'done' && (
              <g>
                <rect
                  x={rx + NODE_W - 16}
                  y={ry - 7}
                  width={20}
                  height={10}
                  rx={3}
                  fill="#7C3AED"
                  stroke="#a78bfa"
                  strokeWidth={0.8}
                />
                <text
                  x={rx + NODE_W - 6}
                  y={ry}
                  textAnchor="middle"
                  fill="#e9d5ff"
                  fontSize={7}
                  fontFamily="JetBrains Mono, monospace"
                >
                  p={node.pivotValue}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Legend ──────────────────────────────────────────────────────────────────
const LEGEND_MERGE = [
  { color: '#3b82f6', label: 'Active' },
  { color: '#0891B2', label: 'Splitting' },
  { color: '#16a34a', label: 'Left done' },
  { color: '#7C3AED', label: 'Merging' },
  { color: '#10b981', label: 'Done' },
  { color: '#3a3a45', label: 'Pending' },
];
const LEGEND_QUICK = [
  { color: '#3b82f6', label: 'Active' },
  { color: '#FF6B00', label: 'Partitioning' },
  { color: '#10b981', label: 'Done' },
  { color: '#7C3AED', label: 'Pivot' },
  { color: '#3a3a45', label: 'Pending' },
];

// ─── Main Panel ──────────────────────────────────────────────────────────────
export function RecursionTreePanel() {
  const { cur, steps, selectedAlgorithm, showRecursionTree, setShowRecursionTree } =
    useSortingStore();

  const isRecursive = selectedAlgorithm === 'merge' || selectedAlgorithm === 'quick';
  const step = steps[cur];
  const snapshot = step?.recursionTree;
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(220);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartH = useRef(0);

  // Drag resize handle at top of panel
  const onDividerMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStartY.current = e.clientY;
    dragStartH.current = panelHeight;
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = dragStartY.current - e.clientY;
      setPanelHeight(Math.max(140, Math.min(480, dragStartH.current + delta)));
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  if (!isRecursive) return null;

  const legend = selectedAlgorithm === 'merge' ? LEGEND_MERGE : LEGEND_QUICK;
  const title = selectedAlgorithm === 'merge' ? 'Merge Sort' : 'Quick Sort';

  return (
    <div className="flex-shrink-0 border-t border-[var(--border-color)] bg-[var(--panel-bg)] flex flex-col">
      {/* ── Top drag handle for vertical resize ── */}
      <div
        onMouseDown={onDividerMouseDown}
        className="group h-[5px] cursor-row-resize flex items-center justify-center shrink-0 select-none"
        style={{ background: 'var(--border-color)' }}
      >
        <div className="flex gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
          ))}
        </div>
      </div>

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🌳</span>
          <span className="text-xs font-bold text-[var(--text-color)] tracking-wide uppercase">
            {title} — Recursion Tree
          </span>
          {snapshot && (
            <span className="text-[10px] text-[#6B6B80] bg-[#1a1a1f] border border-[#2A2A35] rounded px-1.5 py-0.5">
              depth {snapshot.maxDepth} · {Object.keys(snapshot.nodes).length} nodes
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            {legend.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-[9px] text-[#6B6B80]">{label}</span>
              </div>
            ))}
          </div>
          {/* Collapse / Expand */}
          <button
            onClick={() => setShowRecursionTree(!showRecursionTree)}
            className="text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors p-1 rounded hover:bg-[var(--input-bg)]"
            title={showRecursionTree ? 'Collapse tree' : 'Expand tree'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showRecursionTree
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Tree canvas ── */}
      {showRecursionTree && (
        <div
          ref={containerRef}
          className="overflow-auto"
          style={{ height: panelHeight }}
        >
          {snapshot ? (
            <div className="p-3 inline-block min-w-full">
              <RecursionTreeSVG
                snapshot={snapshot}
                activeNodeId={snapshot.activeNodeId}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-[#6B6B80] text-sm">
                <div className="text-2xl mb-2">🌳</div>
                <div>Run the algorithm to see the recursion tree.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
