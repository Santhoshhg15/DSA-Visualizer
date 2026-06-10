import { useState, useRef, useEffect } from 'react';
import { useGraphStore } from '../stores/useGraphStore';
import { graphPresets } from '../data/graphPresets';

export function GraphCanvas() {
  const nodes = useGraphStore(state => state.nodes);
  const edges = useGraphStore(state => state.edges);
  const graphType = useGraphStore(state => state.graphType);
  const nodePositions = useGraphStore(state => state.nodePositions);
  const updateNodePosition = useGraphStore(state => state.updateNodePosition);
  const currentPreset = useGraphStore(state => state.currentPreset);
  const cur = useGraphStore(state => state.cur);
  const steps = useGraphStore(state => state.steps);
  const playing = useGraphStore(state => state.playing);
  const isEditingGraph = useGraphStore(state => state.isEditingGraph);
  const setIsEditingGraph = useGraphStore(state => state.setIsEditingGraph);
  const spanningTreeMode = useGraphStore(state => state.spanningTreeMode);
  const spanningTreePositions = useGraphStore(state => state.spanningTreePositions);
  const setSpanningTreeMode = useGraphStore(state => state.setSpanningTreeMode);
  const calculateSpanningTreeLayout = useGraphStore(state => state.calculateSpanningTreeLayout);

  const svgRef = useRef<SVGSVGElement>(null);
  
  // Interaction State
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });

  // Playback state
  const currentStepData = steps.length > 0 && cur >= 0 && cur < steps.length ? steps[cur] : null;
  const activeNodes = currentStepData?.highlightNodes || [];
  const activeEdges = currentStepData?.highlightEdges || [];
  const pathEdges = currentStepData?.pathEdges || [];
  const pathNodes = currentStepData?.pathNodes || [];
  
  const auxState = currentStepData?.auxiliaryState;
  
  const isPlaybackFinished = steps.length > 0 && cur === steps.length - 1 && !playing;
  
  const displayNodes = isPlaybackFinished ? nodes : ((currentStepData?.nodesSnapshot) ? currentStepData.nodesSnapshot : nodes);
  const displayEdges = isPlaybackFinished ? edges : ((currentStepData?.edgesSnapshot) ? currentStepData.edgesSnapshot : edges);
  
  const handleMouseDown = (nodeId: string | null, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if (nodeId) {
      e.stopPropagation();
      e.preventDefault();
      if (!spanningTreeMode) {
        setDraggingNode(nodeId);
      }
    } else {
      // Start panning
      setIsPanning(true);
      setLastPanPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode && svgRef.current) {
      // Calculate inverse transform so dragging works accurately when zoomed/panned
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        // Find the <g> element's actual matrix
        // By converting the point relative to the SVG, then applying inverse pan/zoom manually
        const rect = svgRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;
        
        const graphX = (rawX - pan.x) / zoom;
        const graphY = (rawY - pan.y) / zoom;
        
        updateNodePosition(draggingNode, graphX, graphY);
      }
    } else if (isPanning) {
      const dx = e.clientX - lastPanPos.x;
      const dy = e.clientY - lastPanPos.y;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      setLastPanPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    setIsPanning(false);
  };

  useEffect(() => {
    if (draggingNode || isPanning) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [draggingNode, isPanning]);

  // Zoom logic
  const handleWheel = (e: React.WheelEvent) => {
    if (!svgRef.current) return;
    e.preventDefault();
    const scaleAdjust = e.deltaY > 0 ? 0.9 : 1.1;
    let newZoom = zoom * scaleAdjust;
    newZoom = Math.max(0.4, Math.min(2.5, newZoom)); // Clamp

    // Zoom towards mouse
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = (mouseX - pan.x) * (newZoom / zoom - 1);
    const dy = (mouseY - pan.y) * (newZoom / zoom - 1);

    setPan({ x: pan.x - dx, y: pan.y - dy });
    setZoom(newZoom);
  };

  // Auto-center and fit to screen
  const fitToScreen = () => {
    if (nodes.length === 0 || !svgRef.current) return;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    // Use the effective positions for fit to screen
    const effectivePositions = (spanningTreeMode && spanningTreePositions) ? spanningTreePositions : nodePositions;
    
    nodes.forEach(n => {
      const p = effectivePositions[n.id];
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
    const paddingX = rect.width * 0.1;
    const paddingY = rect.height * 0.1;

    const availableW = rect.width - paddingX * 2;
    const availableH = rect.height - paddingY * 2;

    const scaleX = width > 0 ? availableW / width : 1;
    const scaleY = height > 0 ? availableH / height : 1;
    let targetZoom = Math.min(scaleX, scaleY, 1.5); // Cap initial zoom to 1.5x
    targetZoom = Math.max(0.4, targetZoom);

    // Calculate center
    const graphCenterX = minX + width / 2;
    const graphCenterY = minY + height / 2;
    const canvasCenterX = rect.width / 2;
    const canvasCenterY = rect.height / 2;

    const targetPanX = canvasCenterX - (graphCenterX * targetZoom);
    const targetPanY = canvasCenterY - (graphCenterY * targetZoom);

    setZoom(targetZoom);
    setPan({ x: targetPanX, y: targetPanY });
  };

  // Reset node positions based on preset defaults
  const resetPositions = () => {
    if (!currentPreset) return;
    const presetData = graphPresets.find(p => p.id === currentPreset);
    if (presetData && presetData.defaultPositions) {
      Object.entries(presetData.defaultPositions).forEach(([id, pos]) => {
        updateNodePosition(id, pos.x, pos.y);
      });
      setTimeout(fitToScreen, 50); // fit again after reset
    }
  };

  useEffect(() => {
    // Fit to screen when preset changes or when tree mode toggles
    setTimeout(fitToScreen, 100);
  }, [currentPreset, nodes.length, spanningTreeMode]);

  if (!currentPreset) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[var(--muted-color)] p-8 text-center bg-[var(--bg-gradient-1)]">
        <span className="text-6xl mb-4 opacity-50">🕸️</span>
        <h2 className="text-xl font-bold text-[var(--text-color)] mb-2">No Graph Selected</h2>
        <p>Please select a preset from the left panel to begin.</p>
      </div>
    );
  }

  const NODE_RADIUS = 20;

  return (
    <div className="w-full h-full relative overflow-hidden bg-[var(--panel-bg)] shadow-[inset_0_2px_15px_rgba(0,0,0,0.05)] border-l border-r lg:border-l-0 border-[var(--border-color)]">
      
      {/* Header Badge */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] px-4 py-2 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3">
          <span className="text-sm font-bold text-[var(--text-color)]">
            {graphType.directed ? 'Directed' : 'Undirected'}
          </span>
          <div className="w-1 h-1 rounded-full bg-[var(--border-color)]"></div>
          <span className="text-sm font-bold text-[var(--text-color)]">
            {graphType.weighted ? 'Weighted' : 'Unweighted'}
          </span>
        </div>
      </div>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-fadeInUp p-8">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--panel-bg)]/50 backdrop-blur-sm max-w-md w-full text-center">
            <svg className="w-12 h-12 text-[var(--muted-color)] mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-[22px] font-bold text-[var(--text-color)] mb-2 tracking-tight">Select a graph to begin</h2>
            <p className="text-[13px] text-[var(--muted-color)] leading-relaxed">
              Choose a preset from the left panel
            </p>
          </div>
        </div>
      )}


      {/* SVG Canvas */}
      <svg 
        aria-label="Graph visualization canvas"
        ref={svgRef}
        className={`w-full h-full absolute inset-0 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => handleMouseDown(null, e)}
        onWheel={handleWheel}
      >
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.5" fill="currentColor" className="text-[var(--text-color)] opacity-10" />
          </pattern>
          
          <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
          
          <filter id="drop-shadow-large" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.5" />
          </filter>

          <radialGradient id="node-gradient-default" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="var(--panel-bg)" />
            <stop offset="100%" stopColor="var(--input-bg)" />
          </radialGradient>
          
          <radialGradient id="node-gradient-active" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </radialGradient>
          
          <radialGradient id="node-gradient-visited" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
          </radialGradient>

          {/* Arrowhead for directed graphs */}
          <marker 
            id="arrowhead-default" 
            viewBox="0 0 10 10" 
            refX={NODE_RADIUS + 8} 
            refY="5" 
            markerWidth="5" 
            markerHeight="5" 
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-color)" />
          </marker>
          <marker 
            id="arrowhead-active" 
            viewBox="0 0 10 10" 
            refX={NODE_RADIUS + 8} 
            refY="5" 
            markerWidth="5" 
            markerHeight="5" 
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker 
            id="arrowhead-path" 
            viewBox="0 0 10 10" 
            refX={NODE_RADIUS + 8} 
            refY="5" 
            markerWidth="6" 
            markerHeight="6" 
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#7C3AED" />
          </marker>
          
          <filter id="glow-current" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="rgba(255,184,0,0.9)" />
          </filter>
          
          <filter id="glow-visited" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(0,200,150,0.5)" />
          </filter>
          
          <filter id="glow-path" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="rgba(124,58,237,0.8)" />
          </filter>
          
          <filter id="glow-active-edge" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(255,184,0,0.7)" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#dot-grid)" />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Render Edges */}
        <g>
          {displayEdges.map(edge => {
            const p1 = (spanningTreeMode && spanningTreePositions) ? spanningTreePositions[edge.source] : nodePositions[edge.source];
            const p2 = (spanningTreeMode && spanningTreePositions) ? spanningTreePositions[edge.target] : nodePositions[edge.target];
            if (!p1 || !p2) return null;

            const isAlgorithmActive = steps.length > 0;
            const isActive = activeEdges.includes(edge.id);
            const isPath = pathEdges.includes(edge.id) || (!graphType.directed && pathEdges.includes(`${edge.target}-${edge.source}`));
            
            // Determine if edge is part of spanning tree (parent-child relationship y-wise)
            // Or simpler: BFS algorithm will set path edges? Wait, spanningTreeMode is just visual layout.
            // But how do we know which edges are in the tree? 
            // In tree layout, parent is strictly above child (y1 < y2 or vice versa, and they are exactly 1 level apart).
            // Level is (y - 80) / 120.
            let isTreeEdge = true;
            if (spanningTreeMode) {
              const l1 = Math.round((p1.y - 80) / 120);
              const l2 = Math.round((p2.y - 80) / 120);
              // A valid tree edge has exactly 1 level difference.
              // Note: BFS might have cross edges that are 1 level diff but not in the tree.
              // The real spanning tree is the subset of edges actually taken.
              // We'll just dim edges that are not actively traversed or don't look like tree edges to approximate.
              if (Math.abs(l1 - l2) !== 1) {
                isTreeEdge = false;
              }
            }

            // We can determine visited edge if its source/target are visited and it was active in the past
            // Or simpler: if it's not active or path, but algorithm is running, it's either visited or unvisited.
            // Let's check auxiliaryState or assume unvisited #FF4444 by default during algorithm
            // Wait, visitedEdges is not in the step. I will just check if both nodes are visited
            const sourceVisited = auxState?.visitedOrder?.includes(edge.source) || auxState?.inMST?.has?.(edge.source);
            const targetVisited = auxState?.visitedOrder?.includes(edge.target) || auxState?.inMST?.has?.(edge.target);
            const isVisitedFallback = isAlgorithmActive && !isActive && !isPath && sourceVisited && targetVisited;

            let strokeColor = 'var(--link-default-color)';
            let strokeWidth = 1.5;
            let opacity = 1;
            let edgeClass = 'transition-colors duration-150 cursor-pointer hover:stroke-[var(--muted-color)]';
            let filter = 'none';

            if (isAlgorithmActive) {
              if (isPath) {
                strokeColor = '#7C3AED';
                strokeWidth = 3;
                filter = 'url(#glow-path)';
              } else if (isActive) {
                strokeColor = '#FFB800';
                strokeWidth = 3;
                edgeClass += ' edge-active-flow';
                filter = 'url(#glow-active-edge)';
              } else if (isVisitedFallback) {
                strokeColor = '#00C896';
                strokeWidth = 2.5;
                opacity = 0.8;
              } else {
                // Unvisited
                strokeColor = '#FF4444';
                strokeWidth = 2;
                opacity = 0.4;
              }
            }

            if (spanningTreeMode && !isTreeEdge && !isActive && !isPath) {
              opacity = 0.15;
            }

            const markerEnd = graphType.directed 
              ? (isPath ? 'url(#arrowhead-path)' : (isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)'))
              : 'none';

            // Calculate midpoint for weights
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={edge.id} className="transition-all duration-300" opacity={opacity}>
                <line 
                  x1={p1.x} 
                  y1={p1.y} 
                  x2={p2.x} 
                  y2={p2.y} 
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={markerEnd}
                  className={edgeClass}
                  filter={filter}
                />
                
                {graphType.weighted && edge.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect 
                      x="-14" 
                      y="-9" 
                      width="28" 
                      height="18" 
                      rx="9" 
                      fill="var(--bg-gradient-1)" 
                      stroke={strokeColor} 
                      strokeWidth="1" 
                    />
                    <text 
                      x="0" 
                      y="3.5" 
                      textAnchor="middle" 
                      fontSize="11" 
                      fontWeight="bold" 
                      fill="var(--text-color)"
                      className="font-mono cursor-default select-none"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
        {/* Render Nodes */}
        <g>
          {displayNodes.map(node => {
            const pos = (spanningTreeMode && spanningTreePositions) ? spanningTreePositions[node.id] : nodePositions[node.id];
            if (!pos) return null;

            const isAlgorithmActive = steps.length > 0;
            const isActive = activeNodes.includes(node.id);
            const isPathNode = pathNodes.includes(node.id);
            const isVisited = auxState?.visitedOrder?.includes(node.id) || auxState?.inMST?.has?.(node.id);
            
            let fillColor = 'url(#node-gradient-default)';
            let strokeColor = 'var(--node-default-border)';
            let textColor = 'var(--text-color)';
            let currentRadius = NODE_RADIUS;
            let filter = draggingNode === node.id ? "url(#drop-shadow-large)" : "url(#drop-shadow)";
            let animationClass = '';

            if (isAlgorithmActive) {
              if (isPathNode) {
                fillColor = '#7C3AED';
                strokeColor = '#5B21B6';
                textColor = '#ffffff';
                filter = 'url(#glow-path)';
              } else if (isActive) {
                fillColor = '#FFB800';
                strokeColor = '#FF8C00';
                textColor = '#ffffff';
                filter = 'url(#glow-current)';
                animationClass = 'animate-[nodeCurrentPulse_0.6s_ease-in-out_infinite]';
              } else if (isVisited) {
                fillColor = '#00C896';
                strokeColor = '#00A87A';
                textColor = '#ffffff';
                filter = 'url(#glow-visited)';
              } else {
                fillColor = '#FF4444';
                strokeColor = '#CC0000';
                textColor = '#ffffff';
              }
            } else {
              // Idle state - no algorithm
              fillColor = 'var(--node-default-bg)';
              textColor = 'var(--node-default-text)';
            }

            return (
              <g 
                key={node.id} 
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                className={`group cursor-grab ${draggingNode === node.id ? 'cursor-grabbing' : ''}`}
                style={{ cursor: draggingNode === node.id ? 'grabbing' : 'pointer' }}
              >
                <circle 
                  r={currentRadius} 
                  fill={fillColor} 
                  stroke={strokeColor} 
                  strokeWidth="2.5"
                  filter={filter}
                  className={`transition-all duration-300 ease-out group-hover:scale-[1.05] group-active:scale-[0.95] ${draggingNode === node.id ? 'scale-[1.1]' : 'scale-100'} ${animationClass}`}
                  style={{ transformOrigin: 'center' }}
                />
                <text 
                  x="0" 
                  y="5" 
                  textAnchor="middle" 
                  fontSize="14" 
                  fontWeight="bold" 
                  fill={textColor}
                  className="font-mono pointer-events-none select-none transition-all duration-150 group-hover:scale-[1.05] group-active:scale-[0.95]"
                  style={{ transformOrigin: 'center' }}
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
        <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] transition-colors" title="Zoom In">
          <span className="font-bold text-lg leading-none">+</span>
        </button>
        <button onClick={() => setZoom(z => Math.max(0.4, z - 0.2))} className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] transition-colors" title="Zoom Out">
          <span className="font-bold text-lg leading-none">−</span>
        </button>
        <div className="w-6 h-px bg-[var(--border-color)] mx-auto my-0.5"></div>
        <button onClick={fitToScreen} className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted-color)] hover:text-emerald-400 hover:bg-[var(--input-bg)] transition-colors" title="Fit to Screen">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
        </button>
        <button onClick={resetPositions} className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted-color)] hover:text-orange-400 hover:bg-[var(--input-bg)] transition-colors" title="Reset Positions">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        <button 
          onClick={() => {
            if (spanningTreeMode) {
              setSpanningTreeMode(false);
            } else {
              setSpanningTreeMode(true);
              calculateSpanningTreeLayout();
            }
          }}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${spanningTreeMode ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)]'}`}
          title={spanningTreeMode ? "Disable Tree View" : "Enable Tree View"}
        >
          🌳
        </button>
        <div className="w-6 h-px bg-[var(--border-color)] mx-auto my-0.5"></div>
        <button 
          onClick={() => setIsEditingGraph(!isEditingGraph)}  
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
            isEditingGraph ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-[var(--muted-color)] hover:text-purple-400 hover:bg-[var(--input-bg)]'
          }`}
          title={isEditingGraph ? "Done Editing" : "Edit Graph"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
      </div>
    </div>
  );
}
