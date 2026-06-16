import { useMemo, useState, useEffect, useRef } from 'react';
import type { VisualBSTNode, Step } from '../types';
import { layoutBinaryTree } from '../engines/treeLayout';

interface Props {
  nodes: Record<string, VisualBSTNode>;
  rootId: string | null;
  activeNodeId?: string | null;
  visitedNodes?: string[];
  activeOperation?: string;
  callStack?: string[];
  queue?: string[];
  step?: Step;
}

const NODE_RADIUS = 22;

export function BSTCanvas({
  nodes,
  rootId,
  activeNodeId,
  visitedNodes = [],
  activeOperation = '',
  callStack = [],
  queue = [],
  step,
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, panX: 0, panY: 0 });
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  // Refs to keep zoom/pan accessible inside non-React event listeners
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  // Constants
  const VIEWBOX_W = 800;
  const VIEWBOX_H = 350;
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 4.0;
  const ZOOM_FACTOR = 1.08;

  // Helper: Convert client (screen) coordinates to SVG viewBox coordinates
  const clientToSVG = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * VIEWBOX_W,
      y: ((clientY - rect.top) / rect.height) * VIEWBOX_H,
    };
  };

  // 1. Calculate positions using the Reingold-Tilford layout engine
  const layout = useMemo(() => {
    return layoutBinaryTree(nodes, rootId, { siblingSep: 65, levelHeight: 80 });
  }, [nodes, rootId]);

  // 2. Viewport Auto-Center & Auto-Fit logic
  const resetViewport = () => {
    if (!rootId || Object.keys(layout).length === 0) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    const allPos = Object.values(layout);
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const p of allPos) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const treeW = (maxX - minX) || 1;
    const treeH = (maxY - minY) || 1;

    const padding = 60;
    const scaleX = (VIEWBOX_W - padding * 2) / treeW;
    const scaleY = (VIEWBOX_H - padding * 2) / treeH;
    
    const targetZoom = Math.max(0.4, Math.min(1.4, Math.min(scaleX, scaleY)));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoom(targetZoom);
    setPan({
      x: VIEWBOX_W / 2 - centerX * targetZoom,
      y: VIEWBOX_H / 2 - centerY * targetZoom
    });
    setUserHasInteracted(false);
  };

  // Auto-fit on tree node structure updates, unless user has panned or zoomed
  useEffect(() => {
    if (!userHasInteracted) {
      resetViewport();
    }
  }, [layout, userHasInteracted]);

  // Auto-fit automatically on starting a new animation operation
  useEffect(() => {
    setUserHasInteracted(false);
  }, [activeOperation]);

  // 3. Wheel Zoom — attached via useEffect with { passive: false } to allow preventDefault
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const curZoom = zoomRef.current;
      const curPan = panRef.current;

      // Mouse position in SVG viewBox space
      const rect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * VIEWBOX_W;
      const svgY = ((e.clientY - rect.top) / rect.height) * VIEWBOX_H;

      const direction = e.deltaY < 0 ? 1 : -1;
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM,
        direction > 0 ? curZoom * ZOOM_FACTOR : curZoom / ZOOM_FACTOR
      ));
      const ratio = nextZoom / curZoom;

      // Adjust pan so the SVG point under cursor stays fixed
      const nextPan = {
        x: svgX - (svgX - curPan.x) * ratio,
        y: svgY - (svgY - curPan.y) * ratio,
      };

      setZoom(nextZoom);
      setPan(nextPan);
      setUserHasInteracted(true);
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  // 4. Pan Handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    const svgPt = clientToSVG(e.clientX, e.clientY);
    dragRef.current = { startX: svgPt.x, startY: svgPt.y, panX: pan.x, panY: pan.y };
    setUserHasInteracted(true);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const svgPt = clientToSVG(e.clientX, e.clientY);
    setPan({
      x: dragRef.current.panX + (svgPt.x - dragRef.current.startX),
      y: dragRef.current.panY + (svgPt.y - dragRef.current.startY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  // 4. Find parent-child links for drawing connections
  const links = useMemo(() => {
    const arr: { from: string; to: string; type: 'left' | 'right' }[] = [];
    if (!nodes) return arr;
    for (const parentId in nodes) {
      const node = nodes[parentId];
      if (node) {
        if (node.leftId) arr.push({ from: parentId, to: node.leftId, type: 'left' });
        if (node.rightId) arr.push({ from: parentId, to: node.rightId, type: 'right' });
      }
    }
    return arr;
  }, [nodes]);

  // 5. State-driven Edge Styling (Search, Insert, Delete, and Traversal paths)
  const getEdgeStyle = (toId: string) => {
    const isTargetActive = activeNodeId === toId;
    const isTargetVisited = visitedNodes.includes(toId);
    
    let stroke = 'var(--link-default-color, var(--border-color))';
    let strokeWidth = '1.8';
    let className = '';

    if (isTargetActive) {
      if (activeOperation === 'insert') {
        stroke = '#10b981'; // emerald
        strokeWidth = '2.5';
        className = 'edge-active-flow';
      } else if (activeOperation === 'delete') {
        stroke = '#ef4444'; // rose
        strokeWidth = '2.5';
        className = 'edge-active-flow';
      } else if (activeOperation === 'search') {
        stroke = '#3b82f6'; // blue
        strokeWidth = '2.5';
        className = 'edge-active-flow';
      } else {
        stroke = '#f59e0b'; // amber
        strokeWidth = '2.5';
      }
    } else if (isTargetVisited) {
      stroke = '#10b981';
      strokeWidth = '2.2';
    }

    return { stroke, strokeWidth, className };
  };

  const isTraversal = ['inorder', 'preorder', 'postorder', 'bfs'].includes(activeOperation);

  if (!rootId || Object.keys(nodes).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[380px] p-6 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl backdrop-blur-xl">
        <div className="text-4xl mb-3">🌳</div>
        <p className="text-[var(--muted-color)] text-xs font-bold uppercase tracking-wider">
          BST Playground is Empty
        </p>
        <p className="text-[var(--muted-color)] text-[10px] text-center max-w-xs mt-1.5 leading-relaxed font-semibold">
          Enter a number in the left panel and click <span className="text-[#10b981] font-bold">Insert</span> to construct your tree.
        </p>
      </div>
    );
  }

  const lineTransition = 'all 0.35s ease';

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Main Tree Viewport */}
      <div
        className="w-full overflow-hidden p-4 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl backdrop-blur-xl flex flex-col items-center relative canvas-grid cursor-grab active:cursor-grabbing"
        style={{ minHeight: '380px' }}
      >
        {/* Legend */}
        <div className="absolute top-4 left-4 flex gap-4 text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider z-10 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-blue-400 bg-blue-400/10"></span>
            Comparing / Path
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 bg-emerald-500/10"></span>
            Visited
          </span>
          {activeOperation === 'delete' && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-rose-500 bg-rose-500/10"></span>
              To Delete
            </span>
          )}
        </div>

        {/* Reset View Button */}
        <button
          onClick={resetViewport}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--pill-btn-bg)] hover:bg-[var(--pill-btn-hover)] text-[var(--muted-color)] hover:text-[var(--text-color)] text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 duration-200 z-10 flex items-center gap-1.5 shadow-md"
          title="Reset scale and center tree"
        >
          🔍 Reset View
        </button>

        {/* Interactive SVG Canvas */}
        <svg
          ref={svgRef}
          id="bst-svg-canvas"
          className="w-full select-none mt-6"
          style={{ height: '350px' }}
          viewBox="0 0 800 350"
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <filter id="glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-rose" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Transform group for Pan & Zoom */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Links / Edges */}
            {links.map(link => {
              const fromPos = layout[link.from];
              const toPos = layout[link.to];
              if (!fromPos || !toPos) return null;

              const edgeStyle = getEdgeStyle(link.to);

              return (
                <g key={`link-${link.from}-${link.to}`}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={edgeStyle.stroke}
                    strokeWidth={edgeStyle.strokeWidth}
                    className={edgeStyle.className}
                    opacity="0.75"
                    style={{ transition: lineTransition }}
                  />
                  <text
                    x={(fromPos.x + toPos.x) / 2 + (link.type === 'left' ? -12 : 8)}
                    y={(fromPos.y + toPos.y) / 2 - 2}
                    fill="var(--muted-color)"
                    fontSize="8"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="600"
                    textAnchor="middle"
                    opacity="0.3"
                  >
                    {link.type === 'left' ? 'L' : 'R'}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {Object.keys(nodes).map(nodeId => {
              const node = nodes[nodeId];
              if (!node) return null;
              const pos = layout[nodeId];
              if (!pos) return null;

              const isActive = activeNodeId === nodeId;
              const isVisited = visitedNodes.includes(nodeId);
              const isNew = node.isNew;

              // Determine detailed Node State
              let nodeState: 'default' | 'root' | 'active' | 'visited' | 'comparing' | 'found' | 'inserted' | 'deleted' = 'default';
              
              if (nodeId === rootId) nodeState = 'root';
              if (isVisited) nodeState = 'visited';
              if (isNew) nodeState = 'inserted';
              if (isActive) {
                if (activeOperation === 'search' || activeOperation === 'insert' || activeOperation === 'delete') {
                  nodeState = 'comparing';
                } else {
                  nodeState = 'active';
                }
              }

              if (step?.type === 'found' && activeNodeId === nodeId) {
                if (activeOperation === 'search') nodeState = 'found';
                if (activeOperation === 'insert') nodeState = 'inserted';
                if (activeOperation === 'delete') nodeState = 'deleted';
              }

              // Visual States configuration
              let circleFill = 'var(--node-default-bg, var(--pill-btn-bg))';
              let circleStroke = 'var(--node-default-border, var(--border-color))';
              let glowFilter = '';
              let strokeW = 1.8;
              let textFill = 'var(--node-default-text, var(--text-color))';

              if (nodeState === 'root') {
                circleStroke = '#818cf8'; // Indigo border for root
                circleFill = 'rgba(99, 102, 241, 0.08)';
                textFill = '#a5b4fc';
                strokeW = 2.2;
              }
              
              if (nodeState === 'visited') {
                circleStroke = '#10b981';
                circleFill = 'rgba(16, 185, 129, 0.08)';
                strokeW = 2.2;
                textFill = '#10b981';
              }

              if (nodeState === 'comparing') {
                glowFilter = 'url(#glow-blue)';
                circleStroke = '#3b82f6';
                circleFill = 'rgba(59, 130, 246, 0.22)';
                textFill = '#ffffff';
                strokeW = 3;
              }

              if (nodeState === 'active') {
                glowFilter = 'url(#glow-amber)';
                circleStroke = '#f59e0b';
                circleFill = 'rgba(245, 158, 11, 0.22)';
                textFill = '#ffffff';
                strokeW = 3;
              }

              if (nodeState === 'found') {
                glowFilter = 'url(#glow-cyan)';
                circleStroke = '#06b6d4';
                circleFill = 'rgba(6, 182, 212, 0.25)';
                textFill = '#ffffff';
                strokeW = 3.5;
              }

              if (nodeState === 'inserted') {
                glowFilter = 'url(#glow-emerald)';
                circleStroke = '#10b981';
                circleFill = 'rgba(16, 185, 129, 0.25)';
                textFill = '#ffffff';
                strokeW = 3.5;
              }

              if (nodeState === 'deleted') {
                glowFilter = 'url(#glow-rose)';
                circleStroke = '#ef4444';
                circleFill = 'rgba(239, 68, 68, 0.25)';
                textFill = '#ffffff';
                strokeW = 3.5;
              }

              return (
                <g
                  key={nodeId}
                  className={`bst-node-group ${nodeState === 'inserted' ? 'animate-pulse' : ''}`}
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  }}
                >
                  {/* Visited indicator ring */}
                  {nodeState === 'visited' && (
                    <circle
                      r={NODE_RADIUS + 5}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.5"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    r={NODE_RADIUS}
                    className="bst-node-circle"
                    fill={circleFill}
                    stroke={circleStroke}
                    strokeWidth={strokeW}
                    filter={glowFilter || undefined}
                    style={{ transition: 'stroke 0.25s, fill 0.25s, stroke-width 0.25s' }}
                  />

                  {/* Node Value Label */}
                  <text
                    dy="4.5"
                    className="bst-node-text"
                    textAnchor="middle"
                    fill={textFill}
                    fontSize="12"
                    fontWeight="800"
                    fontFamily="JetBrains Mono, monospace"
                    style={{ transition: 'fill 0.25s' }}
                  >
                    {node.value}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 2. Visual Call Stack / Queue Panels (for DFS & BFS Traversals) */}
      {isTraversal && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {/* Active Call Stack (DFS) */}
          {['inorder', 'preorder', 'postorder'].includes(activeOperation) && (
            <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 backdrop-blur-xl flex flex-col h-[200px] shadow-lg">
              <h4 className="text-[10px] font-black text-[#5ea8ff] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                📚 Call Stack (Recursion)
              </h4>
              <div className="flex-grow flex flex-col-reverse justify-start overflow-y-auto gap-2 scrollbar-thin pr-1">
                {callStack.length > 0 ? (
                  callStack.map((frame, idx) => (
                    <div
                      key={`${frame}-${idx}`}
                      className={`px-4 py-2 border rounded-xl text-center font-mono text-xs font-bold transition-all duration-300 transform scale-95 origin-bottom animate-slideUp
                        ${idx === callStack.length - 1
                          ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#5ea8ff] shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                          : 'bg-[#161b22]/50 border-[var(--border-color)] text-[var(--muted-color)]'
                        }`}
                    >
                      {frame}
                    </div>
                  ))
                ) : (
                  <div className="flex-grow flex items-center justify-center text-[var(--muted-color)] text-[10px] font-bold uppercase tracking-wider">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Queue Representation (BFS) */}
          {activeOperation === 'bfs' && (
            <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 backdrop-blur-xl flex flex-col h-[200px] shadow-lg md:col-span-2">
              <h4 className="text-[10px] font-black text-[#5ea8ff] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                👥 BFS Queue (First-In, First-Out)
              </h4>
              <div className="flex-grow flex items-center justify-start overflow-x-auto gap-3 py-2 scrollbar-thin">
                {queue.length > 0 ? (
                  queue.map((nodeId, idx) => {
                    const nodeVal = nodes[nodeId]?.value ?? '?';
                    const isFront = idx === 0;
                    const isRear = idx === queue.length - 1;

                    return (
                      <div
                        key={`${nodeId}-${idx}`}
                        className={`flex-shrink-0 w-16 h-16 flex flex-col items-center justify-center border rounded-xl font-mono text-center relative transition-all duration-300 animate-slideLeft
                          ${isFront
                            ? 'bg-[#5ea8ff]/20 border-[#5ea8ff] text-[#5ea8ff]'
                            : isRear
                            ? 'bg-[#a371f7]/20 border-[#a371f7] text-[#c4a5fb]'
                            : 'bg-[#161b22]/60 border-[var(--border-color)] text-[var(--text-color)]'
                          }`}
                      >
                        <span className="text-xs font-black">{nodeVal}</span>
                        
                        {/* Pointers */}
                        {isFront && (
                          <span className="absolute -top-5 text-[8px] font-black uppercase text-[#5ea8ff] tracking-wider">
                            Front
                          </span>
                        )}
                        {isRear && (
                          <span className="absolute -bottom-5 text-[8px] font-black uppercase text-[#c4a5fb] tracking-wider">
                            Rear
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-grow flex items-center justify-center text-[var(--muted-color)] text-[10px] font-bold uppercase tracking-wider">
                    Queue is Empty
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visited Path / Output Grid */}
          {['inorder', 'preorder', 'postorder'].includes(activeOperation) && (
            <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 backdrop-blur-xl flex flex-col h-[200px] shadow-lg">
              <h4 className="text-[10px] font-black text-[#5ea8ff] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                📝 Traversal Output Sequence
              </h4>
              <div className="flex-grow flex flex-wrap content-start overflow-y-auto gap-2.5 scrollbar-thin">
                {visitedNodes.length > 0 ? (
                  visitedNodes.map((nodeId, idx) => (
                    <div
                      key={`${nodeId}-${idx}`}
                      className="px-3.5 py-2 bg-[#10b981]/15 border border-[#10b981]/40 text-[#4fffb0] rounded-xl font-mono text-xs font-black animate-scaleUp"
                    >
                      {nodes[nodeId]?.value ?? '?'}
                    </div>
                  ))
                ) : (
                  <div className="flex-grow flex items-center justify-center text-[var(--muted-color)] text-[10px] font-bold uppercase tracking-wider">
                    No nodes visited yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
