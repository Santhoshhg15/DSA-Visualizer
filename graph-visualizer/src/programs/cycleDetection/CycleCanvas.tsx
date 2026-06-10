import { useState, useRef, useEffect } from 'react';
import { useCycleStore } from '../../stores/useCycleStore';
import { cyclePresets } from './cyclePresets';

export function CycleCanvas() {
  const nodes = useCycleStore((state) => state.nodes);
  const edges = useCycleStore((state) => state.edges);
  const graphType = useCycleStore((state) => state.graphType);
  const nodePositions = useCycleStore((state) => state.nodePositions);
  const algorithmType = useCycleStore((state) => state.algorithmType);
  const setAlgorithmType = useCycleStore((state) => state.setAlgorithmType);
  const loadPreset = useCycleStore((state) => state.loadPreset);
  const currentPreset = useCycleStore((state) => state.currentPreset);
  const cur = useCycleStore((state) => state.cur);
  const steps = useCycleStore((state) => state.steps);

  const svgRef = useRef<SVGSVGElement>(null);

  // Interaction State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });

  // Playback state
  const currentStepData =
    steps.length > 0 && cur >= 0 && cur < steps.length ? steps[cur] : null;

  const activeNodes = currentStepData?.highlightNodes || [];
  const activeEdges = currentStepData?.highlightEdges || [];
  const cycleNodes = currentStepData?.cycleNodes || [];
  const cycleEdges = currentStepData?.cycleEdges || [];

  // Snapshot data for lists/arrays
  const visitedSnapshot = currentStepData?.visitedSnapshot || [];
  const recStackSnapshot = currentStepData?.recStackSnapshot || [];
  const unionFindGroups = currentStepData?.unionFindGroups || {};

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

    const width = maxX - minX;
    const height = maxY - minY;

    const rect = svgRef.current.getBoundingClientRect();
    const paddingX = rect.width * 0.15;
    const paddingY = rect.height * 0.15;

    const availableW = rect.width - paddingX * 2;
    const availableH = rect.height - paddingY * 2;

    const scaleX = width > 0 ? availableW / width : 1;
    const scaleY = height > 0 ? availableH / height : 1;
    let targetZoom = Math.min(scaleX, scaleY, 1.3);
    targetZoom = Math.max(0.4, targetZoom);

    const graphCenterX = minX + width / 2;
    const graphCenterY = minY + height / 2;
    const canvasCenterX = rect.width / 2;
    const canvasCenterY = rect.height / 2;

    const targetPanX = canvasCenterX - graphCenterX * targetZoom;
    const targetPanY = canvasCenterY - graphCenterY * targetZoom;

    setZoom(targetZoom);
    setPan({ x: targetPanX, y: targetPanY });
  };

  useEffect(() => {
    setTimeout(fitToScreen, 100);
  }, [currentPreset, nodes.length]);

  const handleAlgoToggle = (type: 'undirected' | 'directed') => {
    setAlgorithmType(type);
    // Find first matching preset and load it
    const defaultPreset = cyclePresets.find((p) => p.directed === (type === 'directed'));
    if (defaultPreset) {
      loadPreset(defaultPreset.id, defaultPreset);
    }
  };

  const NODE_RADIUS = 20;

  // Component colors mapping for Union-Find groups
  const getComponentColor = (nodeId: string): string => {
    if (!currentStepData || algorithmType !== 'undirected') return '#FF4444'; // Red default
    const roots = Object.keys(unionFindGroups);
    // Find which group contains this node
    let groupIndex = -1;
    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      if (unionFindGroups[root].includes(nodeId)) {
        groupIndex = i;
        break;
      }
    }
    if (groupIndex === -1) return '#FF4444';

    const colors = [
      '#7C3AED', // Component 1: purple
      '#0891B2', // Component 2: cyan
      '#059669', // Component 3: emerald
      '#D97706', // Component 4: amber
      '#DB2777', // Component 5: pink
    ];
    return colors[groupIndex % colors.length];
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[var(--panel-bg)] shadow-[inset_0_2px_15px_rgba(0,0,0,0.05)] border-l border-r lg:border-l-0 border-[var(--border-color)]">
      {/* Header Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] px-4 py-2 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3">
          <span className="text-sm font-bold text-[var(--text-color)]">
            {algorithmType === 'directed' ? 'Directed • Unweighted' : 'Undirected • Unweighted'}
          </span>
        </div>
      </div>

      {/* Top Right Toggle */}
      <div className="absolute top-4 right-4 z-10 bg-[var(--panel-bg)]/80 backdrop-blur-md border border-[var(--border-color)] p-1 rounded-xl shadow-lg flex gap-1">
        <button
          onClick={() => handleAlgoToggle('undirected')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            algorithmType === 'undirected'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
          }`}
        >
          UNDIRECTED
        </button>
        <button
          onClick={() => handleAlgoToggle('directed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            algorithmType === 'directed'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
          }`}
        >
          DIRECTED
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
            id="arrow-unvisited"
            viewBox="0 0 10 10"
            refX={NODE_RADIUS + 7}
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF4444" opacity="0.6" />
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
            id="arrow-cycle"
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
          <filter id="glow-current" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFB800" floodOpacity="0.9" />
          </filter>
          <filter id="glow-visited" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00C896" floodOpacity="0.5" />
          </filter>
          <filter id="glow-recstack" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#7C3AED" floodOpacity="0.7" />
          </filter>
          <filter id="glow-cycle" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#DC2626" floodOpacity="0.9" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#dot-grid)" />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Halos for Undirected Union-Find groups */}
          {algorithmType === 'undirected' &&
            steps.length > 0 &&
            nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const compColor = getComponentColor(node.id);
              return (
                <circle
                  key={`halo-${node.id}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="32"
                  fill={compColor}
                  fillOpacity="0.1"
                  className="transition-all duration-300"
                />
              );
            })}

          {/* Render Edges */}
          <g>
            {edges.map((edge) => {
              const p1 = nodePositions[edge.source];
              const p2 = nodePositions[edge.target];
              if (!p1 || !p2) return null;

              const isEdgeActive = activeEdges.includes(edge.id);
              const isEdgeInCycle = cycleEdges.includes(edge.id);

              // Edge state checks
              let edgeColor = '#FF4444'; // default unvisited red
              let edgeWidth = 2;
              let edgeOpacity = 0.4;
              let strokeDash = 'none';
              let filter = 'none';
              let edgeMarker = graphType.directed ? 'url(#arrow-unvisited)' : 'none';

              if (steps.length > 0) {
                if (isEdgeInCycle) {
                  edgeColor = '#DC2626'; // bright red
                  edgeWidth = 3.5;
                  edgeOpacity = 1.0;
                  filter = 'url(#glow-cycle)';
                  edgeMarker = graphType.directed ? 'url(#arrow-cycle)' : 'none';
                } else if (isEdgeActive) {
                  edgeColor = '#FFB800'; // Amber
                  edgeWidth = 3;
                  edgeOpacity = 1.0;
                  filter = 'url(#glow-current)';
                  strokeDash = '5,5'; // Flowing dash representation
                  edgeMarker = graphType.directed ? 'url(#arrow-current)' : 'none';
                } else {
                  // If nodes on both ends have been processed
                  let isProcessed = false;
                  if (algorithmType === 'undirected') {
                    // Check if edge is finished/safe (which means we finished processing it already)
                    const curIndex = cur;
                    // Find if there is a 'union' or 'cycle-found' step in past that contains this edge.
                    // Or simpler: any edge in past is safe unless it's in cycle
                    const edgeStepIndex = steps.findIndex(
                      (s) => s.highlightEdges && s.highlightEdges.includes(edge.id)
                    );
                    if (edgeStepIndex !== -1 && edgeStepIndex < curIndex) {
                      isProcessed = true;
                    }
                  } else {
                    // DFS: check if neighbor check is done and both are visited
                    const srcVisited = visitedSnapshot.includes(edge.source);
                    const tgtVisited = visitedSnapshot.includes(edge.target);
                    isProcessed = srcVisited && tgtVisited;
                  }

                  if (isProcessed) {
                    edgeColor = '#00C896'; // Teal Green
                    edgeWidth = 2.5;
                    edgeOpacity = 0.8;
                    edgeMarker = graphType.directed ? 'url(#arrow-safe)' : 'none';
                  }
                }
              }

              // Badges midpoint coordinates
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <g key={edge.id}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={edgeColor}
                    strokeWidth={edgeWidth}
                    strokeOpacity={edgeOpacity}
                    strokeDasharray={strokeDash}
                    markerEnd={edgeMarker}
                    filter={filter}
                    className="transition-all duration-300"
                  />

                  {/* Midpoint Badges */}
                  {isEdgeInCycle && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-30"
                        y="-8"
                        width="60"
                        height="16"
                        rx="4"
                        fill="#DC2626"
                        fillOpacity="0.2"
                        stroke="#DC2626"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#DC2626"
                        className="font-mono uppercase select-none pointer-events-none"
                      >
                        {algorithmType === 'directed' ? 'BACK EDGE' : 'CYCLE'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Render Nodes */}
          <g>
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isNodeActive = activeNodes.includes(node.id);
              const isNodeInCycle = cycleNodes.includes(node.id);
              const isVisited = visitedSnapshot.includes(node.id);
              const isRecStack = recStackSnapshot.includes(node.id);

              let fillColor = '#FF4444'; // Default red
              let strokeColor = '#CC0000';
              let filter = 'none';
              let strokeDash = 'none';
              let animationClass = '';

              if (steps.length > 0) {
                if (isNodeInCycle) {
                  fillColor = '#DC2626'; // bright red
                  strokeColor = '#991B1B';
                  filter = 'url(#glow-cycle)';
                  animationClass = 'animate-[nodeCycleFlash_1s_ease-in-out_infinite]';
                } else if (isNodeActive) {
                  fillColor = '#FFB800'; // Amber
                  strokeColor = '#FF8C00';
                  filter = 'url(#glow-current)';
                  animationClass = 'animate-[nodeCurrentPulse_0.6s_ease-in-out_infinite]';
                } else if (algorithmType === 'directed') {
                  if (isRecStack) {
                    fillColor = '#7C3AED'; // Purple
                    strokeColor = '#5B21B6';
                    strokeDash = '3,3'; // Dashed border
                    filter = 'url(#glow-recstack)';
                  } else if (isVisited) {
                    fillColor = '#00C896'; // teal green
                    strokeColor = '#00A87A';
                    filter = 'url(#glow-visited)';
                  }
                } else {
                  // Undirected Union-Find: nodes take component colors once processed
                  const hasBeenProcessed = steps.some(
                    (s, idx) =>
                      idx < cur &&
                      (s.nodeA === node.id ||
                        s.nodeB === node.id ||
                        (s.unionFindGroups &&
                          Object.values(s.unionFindGroups).some((g) => g.includes(node.id))))
                  );
                  if (hasBeenProcessed) {
                    fillColor = getComponentColor(node.id);
                    strokeColor = fillColor;
                  }
                }
              }

              return (
                <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                  {isNodeActive && (
                    <circle
                      r={NODE_RADIUS + 8}
                      fill="none"
                      stroke="#FFB800"
                      strokeWidth="1.5"
                      strokeOpacity="0.8"
                      className="animate-ping"
                      style={{ animationDuration: '1.5s' }}
                    />
                  )}
                  <circle
                    r={NODE_RADIUS}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeDasharray={strokeDash}
                    filter={filter}
                    className={`transition-all duration-300 ${animationClass}`}
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="bold"
                    fill="#ffffff"
                    className="font-mono pointer-events-none select-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-[var(--panel-bg)]/80 backdrop-blur-md border border-[var(--border-color)] p-1 rounded-lg shadow-lg">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] transition-colors"
          title="Zoom In"
        >
          <span className="font-bold text-lg leading-none">+</span>
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] transition-colors"
          title="Zoom Out"
        >
          <span className="font-bold text-lg leading-none">−</span>
        </button>
        <div className="w-6 h-px bg-[var(--border-color)] mx-auto my-0.5"></div>
        <button
          onClick={fitToScreen}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted-color)] hover:text-emerald-400 hover:bg-[var(--input-bg)] transition-colors"
          title="Fit to Screen"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
