import { useRef, useEffect, useState, useCallback } from 'react';
import { useSortingStore } from '../stores/useSortingStore';
import type { RecursionNode, RecursionTreeSnapshot } from '../algorithms/types';

// ─── Constants ───────────────────────────────────────────────────────────────
const NODE_W = 68;
const NODE_H = 28;
const H_GAP = 14;
const V_GAP = 48;
const DEPTH_STEP = NODE_H + V_GAP;
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 4.0;

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
    case 'active':       return 'call';
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

function computeLayout(nodes: Record<string, RecursionNode>, rootId: string | null): LayoutNode[] {
  if (!rootId || !nodes[rootId]) return [];
  const result: LayoutNode[] = [];

  const subtreeWidth = (id: string): number => {
    const n = nodes[id];
    if (!n) return NODE_W;
    if (!n.leftChildId && !n.rightChildId) return NODE_W;
    const lw = n.leftChildId ? subtreeWidth(n.leftChildId) : 0;
    const rw = n.rightChildId ? subtreeWidth(n.rightChildId) : 0;
    return lw + H_GAP + rw;
  };

  const layout = (id: string, x: number, y: number, width: number) => {
    const n = nodes[id];
    if (!n) return;
    result.push({ node: n, x, y, width });
    if (n.leftChildId || n.rightChildId) {
      const lw = n.leftChildId ? subtreeWidth(n.leftChildId) : 0;
      const rw = n.rightChildId ? subtreeWidth(n.rightChildId) : 0;
      const totalChildren = lw + (n.leftChildId && n.rightChildId ? H_GAP : 0) + rw;
      const startX = x + width / 2 - totalChildren / 2;
      if (n.leftChildId) layout(n.leftChildId, startX, y + DEPTH_STEP, lw);
      if (n.rightChildId) {
        const rightX = startX + lw + (n.leftChildId ? H_GAP : 0);
        layout(n.rightChildId, rightX, y + DEPTH_STEP, rw);
      }
    }
  };

  layout(rootId, 0, 0, subtreeWidth(rootId));
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
  if (layout.length === 0) return null;

  const pad = 20;
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
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <filter id="rtp-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {layout.map(({ node }) => {
        const edges = [];
        const p = positions[node.id];
        if (node.leftChildId && positions[node.leftChildId]) {
          const c = positions[node.leftChildId];
          const child = nodes[node.leftChildId];
          edges.push(
            <line key={`el-${node.id}`}
              x1={p.cx + pad} y1={p.cy + NODE_H / 2 + pad}
              x2={c.cx + pad} y2={c.cy - NODE_H / 2 + pad}
              stroke={child?.state === 'done' ? '#10b981' : child?.state !== 'pending' ? '#3b82f6' : '#2A2A35'}
              strokeWidth={1.5}
              strokeOpacity={child?.state === 'pending' ? 0.35 : 0.8}
              strokeDasharray={child?.state === 'pending' ? '4 3' : undefined}
            />
          );
        }
        if (node.rightChildId && positions[node.rightChildId]) {
          const c = positions[node.rightChildId];
          const child = nodes[node.rightChildId];
          edges.push(
            <line key={`er-${node.id}`}
              x1={p.cx + pad} y1={p.cy + NODE_H / 2 + pad}
              x2={c.cx + pad} y2={c.cy - NODE_H / 2 + pad}
              stroke={child?.state === 'done' ? '#10b981' : child?.state !== 'pending' ? '#3b82f6' : '#2A2A35'}
              strokeWidth={1.5}
              strokeOpacity={child?.state === 'pending' ? 0.35 : 0.8}
              strokeDasharray={child?.state === 'pending' ? '4 3' : undefined}
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
          <g key={node.id} filter={isActive ? 'url(#rtp-glow)' : undefined}>
            {isActive && (
              <rect x={rx - 2} y={ry - 2} width={NODE_W + 4} height={NODE_H + 4}
                rx={8} fill="none" stroke="#60a5fa" strokeWidth={1.5} strokeOpacity={0.5}
              />
            )}
            <rect x={rx} y={ry} width={NODE_W} height={NODE_H} rx={6}
              fill={colors.fill}
              stroke={isActive ? '#60a5fa' : colors.stroke}
              strokeWidth={isActive ? 2 : 1.2}
            />
            <text x={cx + pad} y={ry + 12} textAnchor="middle"
              fill={colors.text} fontSize={9.5}
              fontFamily="JetBrains Mono, monospace"
              fontWeight={isActive ? 'bold' : 'normal'}
            >{label}</text>
            <text x={cx + pad} y={ry + 23} textAnchor="middle"
              fill={isActive ? '#93c5fd' : '#6B6B80'} fontSize={8}
              fontFamily="JetBrains Mono, monospace"
            >{subLabel}</text>
            {/* Pivot badge (quick sort) */}
            {node.type === 'quick' && node.pivotValue !== undefined &&
              node.state !== 'pending' && node.state !== 'done' && (
              <g>
                <rect x={rx + NODE_W - 14} y={ry - 8} width={22} height={11}
                  rx={3} fill="#7C3AED" stroke="#a78bfa" strokeWidth={0.8} />
                <text x={rx + NODE_W - 3} y={ry - 0.5} textAnchor="middle"
                  fill="#e9d5ff" fontSize={7.5} fontFamily="JetBrains Mono, monospace"
                >p={node.pivotValue}</text>
              </g>
            )}
            {/* Mid badge (merge sort) */}
            {node.type === 'merge' && node.mid !== undefined &&
              (node.state === 'splitting' || node.state === 'merging' || node.state === 'left-done') && (
              <g>
                <rect x={rx - 8} y={ry - 8} width={20} height={11}
                  rx={3} fill="#0891B2" stroke="#67e8f9" strokeWidth={0.8} />
                <text x={rx + 2} y={ry - 0.5} textAnchor="middle"
                  fill="#e0f7fa" fontSize={7.5} fontFamily="JetBrains Mono, monospace"
                >m={node.mid}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Zoom/Pan Canvas ─────────────────────────────────────────────────────────
function ZoomPanCanvas({
  snapshot,
  initialZoom = 1,
}: {
  snapshot: RecursionTreeSnapshot | undefined;
  initialZoom?: number;
}) {
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

  // Wheel zoom — proportional, cursor-centered
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Smooth proportional zoom: 8% per notch
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom(prev => {
      const next = clampZoom(prev * factor);
      const scale = next / prev;
      setPan(p => ({
        x: mouseX - (mouseX - p.x) * scale,
        y: mouseY - (mouseY - p.y) * scale,
      }));
      return next;
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // Pan drag
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    };
    const onUp = () => { isPanning.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const zoomIn  = (e: React.MouseEvent) => { e.stopPropagation(); setZoom(z => clampZoom(z * 1.2)); };
  const zoomOut = (e: React.MouseEvent) => { e.stopPropagation(); setZoom(z => clampZoom(z * 0.8)); };
  const reset   = (e: React.MouseEvent) => { e.stopPropagation(); setZoom(initialZoom); setPan({ x: 20, y: 20 }); };

  // cursor style via class is unreliable when isPanning changes — use style
  const [isDragging, setIsDragging] = useState(false);
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    onMouseDown(e);
  };
  useEffect(() => {
    const onUp = () => setIsDragging(false);
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
      >
        {snapshot ? (
          <div style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            display: 'inline-block',
          }}>
            <RecursionTreeSVG snapshot={snapshot} activeNodeId={snapshot.activeNodeId} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[#6B6B80] text-sm">
              <div className="text-3xl mb-3">🌳</div>
              <div>Run the algorithm to see the recursion tree.</div>
              <div className="text-xs mt-2 text-[#3a3a45]">Scroll to zoom · Drag to pan</div>
            </div>
          </div>
        )}
      </div>

      {/* Zoom controls — bottom right */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
        <button onClick={zoomIn}
          className="w-7 h-7 rounded bg-[#131316] border border-[#2A2A35] text-[#6B6B80] hover:text-white hover:border-blue-500/50 flex items-center justify-center text-base font-bold transition-colors shadow"
          title="Zoom in">+</button>
        <button onClick={reset}
          className="w-7 h-7 rounded bg-[#131316] border border-[#2A2A35] text-[#6B6B80] hover:text-white hover:border-blue-500/50 flex items-center justify-center text-sm transition-colors shadow"
          title="Reset view">⊙</button>
        <button onClick={zoomOut}
          className="w-7 h-7 rounded bg-[#131316] border border-[#2A2A35] text-[#6B6B80] hover:text-white hover:border-blue-500/50 flex items-center justify-center text-base font-bold transition-colors shadow"
          title="Zoom out">−</button>
      </div>

      {/* Zoom % badge — bottom left */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <span className="text-[9px] font-mono text-[#6B6B80] bg-[#0d0d0f]/90 border border-[#2A2A35] rounded px-1.5 py-0.5">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
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
// This component is ALWAYS rendered in normal document flow.
// In NORMAL mode: renders as a fixed-height panel below the bar chart.
// In MAXIMIZED mode: renders as flex-1 (fills the center column), bar chart hidden by App.tsx.
// NO fixed/absolute/z-index on the outer container — guaranteed no overlap.

export function RecursionTreePanel() {
  const {
    cur, steps, selectedAlgorithm,
    showRecursionTree, setShowRecursionTree,
    recursionTreeMaximized, setRecursionTreeMaximized,
  } = useSortingStore();

  const isRecursive = selectedAlgorithm === 'merge' || selectedAlgorithm === 'quick';
  const step = steps[cur];
  const snapshot = step?.recursionTree;

  // Vertical resize handle (normal mode only)
  const [panelHeight, setPanelHeight] = useState(260);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartH = useRef(0);

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
      setPanelHeight(Math.max(140, Math.min(520, dragStartH.current + delta)));
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Not a recursive algorithm — render nothing
  if (!isRecursive) return null;

  const legend = selectedAlgorithm === 'merge' ? LEGEND_MERGE : LEGEND_QUICK;
  const title  = selectedAlgorithm === 'merge' ? 'Merge Sort' : 'Quick Sort';

  const HEADER_H = 37;
  const totalNormalHeight = showRecursionTree ? panelHeight + HEADER_H : HEADER_H;

  return (
    <div
      className="border-t border-[var(--border-color)] bg-[var(--panel-bg)] flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative"
      style={{
        flex: recursionTreeMaximized ? '1 1 100%' : `0 0 ${totalNormalHeight}px`,
      }}
    >
      {/* Dot-grid background (only visible when maximized, transitions opacity) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: 'radial-gradient(#2A2A35 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: recursionTreeMaximized ? 0.4 : 0,
        }}
      />

      {/* Top drag handle — resize panel height */}
      <div
        onMouseDown={onDividerMouseDown}
        className="group cursor-row-resize flex items-center justify-center shrink-0 select-none transition-all duration-300"
        style={{
          height: recursionTreeMaximized ? 0 : 5,
          opacity: recursionTreeMaximized ? 0 : 1,
          pointerEvents: recursionTreeMaximized ? 'none' : 'auto',
          background: 'var(--border-color)',
        }}
      >
        <div className="flex gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          {/* ← Bar Chart button */}
          <div
            className="flex items-center overflow-hidden transition-all duration-300"
            style={{
              width: recursionTreeMaximized ? '92px' : '0px',
              opacity: recursionTreeMaximized ? 1 : 0,
              marginRight: recursionTreeMaximized ? '12px' : '0px',
            }}
          >
            <button
              onClick={() => setRecursionTreeMaximized(false)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#2A2A35] bg-[#1a1a1f] text-[#6B6B80] hover:text-white hover:border-blue-500/50 transition-all whitespace-nowrap"
              title="Back to bar chart"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Bar Chart
            </button>
          </div>

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

        <div className="flex items-center gap-1.5">
          {/* Legend */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            {legend.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-[9px] text-[#6B6B80]">{label}</span>
              </div>
            ))}
          </div>

          {/* Hint */}
          <div
            className="hidden md:flex items-center overflow-hidden transition-all duration-300"
            style={{
              width: recursionTreeMaximized ? '140px' : '0px',
              opacity: recursionTreeMaximized ? 1 : 0,
              marginRight: recursionTreeMaximized ? '8px' : '0px',
            }}
          >
            <span className="text-[10px] text-[#3a3a45] whitespace-nowrap">
              Scroll to zoom · Drag to pan
            </span>
          </div>

          {/* Maximize / Minimize toggle */}
          <button
            onClick={() => {
              setRecursionTreeMaximized(!recursionTreeMaximized);
              if (!recursionTreeMaximized) {
                setShowRecursionTree(true);
              }
            }}
            className="text-[#6B6B80] hover:text-blue-400 transition-colors p-1.5 rounded hover:bg-[var(--input-bg)]"
            title={recursionTreeMaximized ? 'Minimize tree panel' : 'Maximize tree — fills center area'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {recursionTreeMaximized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 9V4H4v5h5zm6 0h5V4h-5v5zm0 6h5v5h-5v-5zm-6 0H4v5h5v-5z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 8V4h4M4 16v4h4M20 8V4h-4M20 16v4h-4" />
              )}
            </svg>
          </button>

          {/* Collapse / Expand */}
          <div
            className="flex items-center overflow-hidden transition-all duration-300"
            style={{
              width: recursionTreeMaximized ? '0px' : '28px',
              opacity: recursionTreeMaximized ? 0 : 1,
              pointerEvents: recursionTreeMaximized ? 'none' : 'auto',
            }}
          >
            <button
              onClick={() => setShowRecursionTree(!showRecursionTree)}
              className="text-[#6B6B80] hover:text-[var(--text-color)] transition-colors p-1 rounded hover:bg-[var(--input-bg)]"
              title={showRecursionTree ? 'Collapse tree panel' : 'Expand tree panel'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showRecursionTree
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7-7-7-7" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tree canvas */}
      <div
        className="flex-1 overflow-hidden relative z-10 transition-opacity duration-300"
        style={{
          opacity: showRecursionTree || recursionTreeMaximized ? 1 : 0,
          pointerEvents: showRecursionTree || recursionTreeMaximized ? 'auto' : 'none',
        }}
      >
        <ZoomPanCanvas snapshot={snapshot} initialZoom={recursionTreeMaximized ? 0.7 : 0.85} />
      </div>
    </div>
  );
}
