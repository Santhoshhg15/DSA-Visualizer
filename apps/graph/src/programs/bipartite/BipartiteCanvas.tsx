import { useState, useRef, useEffect } from 'react';
import { useBipartiteStore } from '../../stores/useBipartiteStore';

export function BipartiteCanvas() {
  const nodes = useBipartiteStore((state) => state.nodes);
  const edges = useBipartiteStore((state) => state.edges);
  const directed = useBipartiteStore((state) => state.directed);
  const nodePositions = useBipartiteStore((state) => state.nodePositions);
  const cur = useBipartiteStore((state) => state.cur);
  const steps = useBipartiteStore((state) => state.steps);

  const svgRef = useRef<SVGSVGElement>(null);

  // Interaction State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });

  // Playback state
  const currentStepData =
    steps.length > 0 && cur >= 0 && cur < steps.length ? steps[cur] : null;

  const activeEdges = currentStepData?.highlightEdges || [];
  const colorMap = currentStepData?.colorSnapshot || {};
  const conflictNodes = currentStepData?.conflictNodes || [];
  const conflictEdge = currentStepData?.conflictEdge || null;
  const currentNode = currentStepData?.currentNode || null;

  const NODE_RADIUS = 24;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsPanning(true);
    setLastPanPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastPanPos.x;
      const dy = e.clientY - lastPanPos.y;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      setLastPanPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isPanning]);

  // Zoom logic
  const handleWheel = (e: React.WheelEvent) => {
    if (!svgRef.current) return;
    e.preventDefault();
    const scaleAdjust = e.deltaY > 0 ? 0.9 : 1.1;
    let newZoom = zoom * scaleAdjust;
    newZoom = Math.max(0.4, Math.min(2.5, newZoom)); // Clamp

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = (mouseX - pan.x) * (newZoom / zoom - 1);
    const dy = (mouseY - pan.y) * (newZoom / zoom - 1);

    setPan({ x: pan.x - dx, y: pan.y - dy });
    setZoom(newZoom);
  };

  // Center and fit
  const fitToScreen = () => {
    if (nodes.length === 0 || !svgRef.current) return;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    nodes.forEach((n) => {
      const p = nodePositions[n.id];
      if (p) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
    });

    if (minX === Infinity) return;

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const rect = svgRef.current.getBoundingClientRect();
    const canvasWidth = rect.width || 800;
    const canvasHeight = rect.height || 500;

    const padding = 60;
    const scaleX = canvasWidth / (graphWidth + padding * 2);
    const scaleY = canvasHeight / (graphHeight + padding * 2);
    const newZoom = Math.min(1.5, Math.max(0.5, Math.min(scaleX, scaleY)));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setPan({
      x: canvasWidth / 2 - centerX * newZoom,
      y: canvasHeight / 2 - centerY * newZoom,
    });
    setZoom(newZoom);
  };

  useEffect(() => {
    // Fit to screen on initial graph load
    if (nodes.length > 0) {
      setTimeout(fitToScreen, 100);
    }
  }, [nodes]);

  // Helper to determine edge state
  const getEdgeState = (edge: any) => {
    const isConflict = conflictEdge === edge.id;
    const isCurrent = activeEdges.includes(edge.id);

    if (isConflict) return 'conflict';
    if (isCurrent) return 'current';

    const sourceColor = colorMap[edge.source];
    const targetColor = colorMap[edge.target];

    if (
      sourceColor !== undefined &&
      targetColor !== undefined &&
      sourceColor !== -1 &&
      targetColor !== -1
    ) {
      if (sourceColor !== targetColor) {
        return 'safe';
      } else {
        return 'conflict'; // Implicit conflict if same color
      }
    }

    return 'unprocessed';
  };

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      {/* Floating Toolbar Controls */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={fitToScreen}
          className="px-3 py-1.5 rounded-lg border text-xs font-semibold bg-[var(--pill-btn-bg)] border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--pill-btn-hover)] transition-all flex items-center gap-1.5 shadow-sm"
          title="Fit Graph to Screen"
        >
          🔍 Fit Graph
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="px-3 py-1.5 rounded-lg border text-xs font-semibold bg-[var(--pill-btn-bg)] border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--pill-btn-hover)] transition-all flex items-center gap-1.5 shadow-sm"
          title="Reset Zoom & Pan"
        >
          🔄 Reset View
        </button>
      </div>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-8">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--panel-bg)]/50 backdrop-blur-sm max-w-md w-full text-center">
            <h2 className="text-[22px] font-bold text-[var(--text-color)] mb-2 tracking-tight">
              Select or Create a Graph
            </h2>
            <p className="text-[13px] text-[var(--muted-color)] leading-relaxed">
              Choose a preset or enter nodes/edges in the left panel.
            </p>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className={`w-full h-full absolute inset-0 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle
              cx="1"
              cy="1"
              r="1.5"
              fill="currentColor"
              className="text-[var(--text-color)] opacity-10"
            />
          </pattern>

          {/* Marker markers for Directed Arcs */}
          <marker
            id="arrow-unprocessed"
            viewBox="0 0 10 10"
            refX={NODE_RADIUS + 7}
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" opacity="0.4" />
          </marker>
          <marker
            id="arrow-current"
            viewBox="0 0 10 10"
            refX={NODE_RADIUS + 7}
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFB800" />
          </marker>
          <marker
            id="arrow-safe"
            viewBox="0 0 10 10"
            refX={NODE_RADIUS + 7}
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#00C896" />
          </marker>
          <marker
            id="arrow-conflict"
            viewBox="0 0 10 10"
            refX={NODE_RADIUS + 7}
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#DC2626" />
          </marker>

          {/* Glow filters */}
          <filter id="glow-group0" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFB800" floodOpacity="0.8" />
          </filter>
          <filter id="glow-group1" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FF6B00" floodOpacity="0.8" />
          </filter>
          <filter id="glow-conflict" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#DC2626" floodOpacity="0.9" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#dot-grid)" />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Halos for colored groups */}
          {steps.length > 0 &&
            nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const nodeColor = colorMap[node.id];
              if (nodeColor === undefined || nodeColor === -1) return null;

              const haloColor = nodeColor === 0 ? '#FFB800' : '#FF6B00';
              return (
                <circle
                  key={`halo-${node.id}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="32"
                  fill={haloColor}
                  fillOpacity="0.08"
                  className="transition-all duration-300"
                />
              );
            })}

          {/* Edges layer */}
          {edges.map((edge) => {
            const p1 = nodePositions[edge.source];
            const p2 = nodePositions[edge.target];
            if (!p1 || !p2) return null;

            const state = getEdgeState(edge);

            let strokeColor = '#64748b';
            let strokeWidth = '1.5px';
            let opacity = 0.4;
            let strokeDash = 'none';
            let animationClass = '';
            let filter = 'none';
            let markerId = 'arrow-unprocessed';

            if (state === 'conflict') {
              strokeColor = '#DC2626';
              strokeWidth = '3.5px';
              opacity = 0.8;
              filter = 'url(#glow-conflict)';
              animationClass = 'animate-pulse-stroke';
              markerId = 'arrow-conflict';
            } else if (state === 'current') {
              strokeColor = '#FFB800';
              strokeWidth = '3px';
              opacity = 1.0;
              strokeDash = '5,5';
              animationClass = 'animate-[edgeDashFlow_0.5s_linear_infinite]';
              filter = 'url(#glow-group0)';
              markerId = 'arrow-current';
            } else if (state === 'safe') {
              strokeColor = '#00C896';
              strokeWidth = '2px';
              opacity = 0.8;
              markerId = 'arrow-safe';
            }

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={`edge-${edge.id}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  opacity={opacity}
                  filter={filter}
                  className={`transition-all duration-300 ${animationClass}`}
                  markerEnd={directed ? `url(#${markerId})` : undefined}
                />

                {/* Conflict Edge label badge */}
                {state === 'conflict' && conflictEdge === edge.id && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-26"
                      y="-8"
                      width="52"
                      height="16"
                      rx="4"
                      fill="#DC2626"
                      fillOpacity="0.2"
                      stroke="#DC2626"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill="#DC2626"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      CONFLICT
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes layer */}
          {nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const nodeColor = colorMap[node.id] !== undefined ? colorMap[node.id] : -1;
            const isConflict = conflictNodes.includes(node.id);
            const isCurrent = currentNode === node.id;

            let fillColor = '#FF4444'; // Red for uncolored
            let strokeColor = '#CC0000';
            let filter = 'none';
            let animationClass = '';
            let scale = 1.0;

            if (steps.length > 0) {
              if (isConflict) {
                fillColor = '#DC2626';
                strokeColor = '#991B1B';
                filter = 'url(#glow-conflict)';
                animationClass = 'animate-conflict-flash';
              } else if (nodeColor === 0) {
                fillColor = '#FFB800'; // Yellow
                strokeColor = '#FF8C00';
                filter = 'url(#glow-group0)';
              } else if (nodeColor === 1) {
                fillColor = '#FF6B00'; // Orange
                strokeColor = '#CC5500';
                filter = 'url(#glow-group1)';
              }
            }

            if (isCurrent) {
              scale = 1.1;
              if (nodeColor === 0) filter = 'url(#glow-group0)';
              else if (nodeColor === 1) filter = 'url(#glow-group1)';
              else filter = 'url(#glow-conflict)';
            }

            const currentRingColor =
              nodeColor === 0 ? '#FFB800' : nodeColor === 1 ? '#FF6B00' : '#FF4444';

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
                className="transition-transform duration-300"
              >
                {/* SVG Ripple Pulse Ring for dequeued current node */}
                {isCurrent && (
                  <circle cx="0" cy="0" r={NODE_RADIUS} fill="none" stroke={currentRingColor} strokeWidth="2.5">
                    <animate attributeName="r" values={`${NODE_RADIUS};${NODE_RADIUS + 12}`} dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Node Circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={NODE_RADIUS}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  filter={filter}
                  className={`transition-all duration-300 ${animationClass}`}
                />

                {/* Node Label Text */}
                <text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.label}
                </text>

                {/* Conflict Header label */}
                {isConflict && (
                  <g transform={`translate(0, -${NODE_RADIUS + 12})`}>
                    <text
                      textAnchor="middle"
                      fill="#DC2626"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      CONFLICT
                    </text>
                  </g>
                )}

                {/* Color info text below node */}
                <text
                  y={NODE_RADIUS + 14}
                  textAnchor="middle"
                  fill={nodeColor === -1 ? 'rgba(255,255,255,0.4)' : '#ffffff'}
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                >
                  color: {nodeColor}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
