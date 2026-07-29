import { useEffect, useRef, useState } from 'react';
import { useStore } from './store';
import { EducationPanel } from './components/EducationPanel';
import { PresetSelector } from './components/PresetSelector';
import { OperationsPanel } from './components/OperationsPanel';
import { AlgorithmsPanel } from './components/AlgorithmsPanel';
import { ModifyPanel } from './components/ModifyPanel';
import { GraphCanvas } from './components/GraphCanvas';
import { Controls } from './components/Controls';
import { AdjacencyListPanel } from './components/AdjacencyListPanel';
import { AuxiliaryDataPanel } from './components/AuxiliaryDataPanel';
import { CodePanel } from './components/CodePanel';
import { TraceLogPanel } from './components/TraceLogPanel';
import { AlgorithmOutput } from './components/AlgorithmOutput';
import { useGraphStore } from './stores/useGraphStore';
import { IslandsCanvas } from './programs/numberOfIslands/IslandsCanvas';
import { IslandsPanel } from './programs/numberOfIslands/IslandsPanel';
import { IslandsRightPanel } from './programs/numberOfIslands/IslandsRightPanel';
import { IslandsBottomPanel } from './programs/numberOfIslands/IslandsBottomPanel';
import { useIslandsStore } from './stores/useIslandsStore';
import { CycleCanvas } from './programs/cycleDetection/CycleCanvas';
import { CyclePanel } from './programs/cycleDetection/CyclePanel';
import { CycleRightPanel } from './programs/cycleDetection/CycleRightPanel';
import { CycleBottomPanel } from './programs/cycleDetection/CycleBottomPanel';
import { useCycleStore } from './stores/useCycleStore';
import { BipartiteCanvas } from './programs/bipartite/BipartiteCanvas';
import { BipartitePanel } from './programs/bipartite/BipartitePanel';
import { BipartiteRightPanel } from './programs/bipartite/BipartiteRightPanel';
import { BipartiteBottomPanel } from './programs/bipartite/BipartiteBottomPanel';
import { useBipartiteStore } from './stores/useBipartiteStore';
import { GraphLandingPage } from './pages/GraphLandingPage';


export default function App() {
  const { darkMode, setDarkMode } = useStore();
  const { playing, isEditingGraph, setSteps, setStats, steps, cur } = useGraphStore();
  const [currentSection, setCurrentSection] = useState<'hub' | 'graph' | 'sorting'>('hub');
  const [isFullscreen] = useState(true);
  const [activeView, setActiveView] = useState<'education' | 'workspace'>('education');
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState<'operations' | 'algorithms' | 'programs'>('operations');
  const [activeRightTab, setActiveRightTab] = useState<'graph' | 'code' | 'trace'>('graph');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [showTracePill, setShowTracePill] = useState(false);

  const graphScrollRef = useRef<HTMLDivElement>(null);
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const traceScrollRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef<boolean>(false);
  const scrollPositions = useRef({
    graph: 0,
    code: 0,
    trace: 0
  });
  
  // Selected Program under PROGRAMS tab ('islands' | 'cycle' | 'bipartite')
  const [selectedProgram, setSelectedProgram] = useState<'islands' | 'cycle' | 'bipartite'>('islands');

  const handleSelectAlgorithm = (algoId: string, dijkstraImpl?: 'pq' | 'set') => {
    // Stop any current playbacks
    useGraphStore.getState().setPlaying(false);
    
    // Set workspace mode and selected algorithm
    setActiveWorkspaceMode('algorithms');
    setActiveView('workspace');
    
    if (algoId === 'dijkstra' && dijkstraImpl) {
      useGraphStore.getState().setDijkstraImpl(dijkstraImpl);
    }
    
    useGraphStore.getState().setSelectedAlgorithm(algoId);
    setActiveRightTab('graph');
    setShowLanding(false);
  };

  const handleSelectProgram = (programId: 'islands' | 'cycle' | 'bipartite', variant?: string) => {
    // Stop playbacks in all program stores
    useIslandsStore.getState().setPlaying(false);
    useCycleStore.getState().setPlaying(false);
    useBipartiteStore.getState().setPlaying(false);

    setActiveWorkspaceMode('programs');
    setSelectedProgram(programId);
    setActiveView('workspace');

    if (programId === 'islands') {
      if (variant === 'leetcode') {
        useIslandsStore.getState().setVersion('leetcode');
      } else if (variant === 'gfg') {
        useIslandsStore.getState().setVersion('gfg');
      }
    } else if (programId === 'cycle' && variant) {
      useCycleStore.getState().setAlgorithmType(variant as any);
    }

    setActiveRightTab('graph');
    setShowLanding(false);
  };

  const handleOpenVisualizer = () => {
    window.history.pushState(null, '', '/graph/visualizer');
    window.dispatchEvent(new Event('popstate'));
    setActiveView('workspace');
    setShowLanding(false);
  };

  

  // Location listener for routing
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/sorting')) {
        setCurrentSection('sorting');
        if (path.includes('/visualizer')) {
          setShowLanding(false);
          setActiveView('workspace');
        } else {
          setShowLanding(true);
        }
      } else if (path.startsWith('/graph')) {
        setCurrentSection('graph');
        if (path.includes('/visualizer')) {
          setShowLanding(false);
          setActiveView('workspace');
        } else {
          setShowLanding(true);
        }
      } else {
        setCurrentSection('hub');
        setShowLanding(true);
      }
    };
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Auto-switch right tab to TRACE when algorithm plays
  const islandsPlaying = useIslandsStore(state => state.playing);
  const cyclePlaying = useCycleStore(state => state.playing);
  const bipartitePlaying = useBipartiteStore(state => state.playing);
  
  useEffect(() => {
    if (playing || islandsPlaying || cyclePlaying || bipartitePlaying) {
      setActiveRightTab('trace');
    }
  }, [playing, islandsPlaying, cyclePlaying, bipartitePlaying]);
  
  // Right Panel State
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizingRight, setIsResizingRight] = useState(false);
  
  // Left Panel Mobile Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle right panel resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRight) return;
      const newWidth = document.body.clientWidth - e.clientX;
      if (newWidth >= 260 && newWidth <= 480) {
        setRightPanelWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizingRight(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizingRight]);

  // Handle manual scroll in TRACE tab
  const handleTraceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    scrollPositions.current.trace = el.scrollTop;
    
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    userScrolledUp.current = !isAtBottom;
    setShowTracePill(!isAtBottom);
  };

  // Scroll to active trace step
  const handleScrollToActiveTrace = () => {
    userScrolledUp.current = false;
    setShowTracePill(false);
    if (traceScrollRef.current) {
      const activeEntry = traceScrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        const container = traceScrollRef.current;
        const elementTop = activeEntry.offsetTop;
        const elementHeight = activeEntry.offsetHeight;
        const containerHeight = container.clientHeight;
        
        if (elementTop + elementHeight > container.scrollTop + containerHeight) {
          container.scrollTo({
            top: elementTop - containerHeight + elementHeight,
            behavior: 'smooth'
          });
        } else if (elementTop < container.scrollTop) {
          container.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  const traceCurIndex = cur;
  const activeFirstStepId = steps.length > 0 ? steps[0].id : null;
  const activeCodeLine = steps[cur]?.codeLineActive || 0;

  // Auto-scroll trace when step changes during playback
  useEffect(() => {
    if (!traceScrollRef.current) return;
    if (userScrolledUp.current) return;
    
    const activeEntry = traceScrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeEntry) {
      const container = traceScrollRef.current;
      const elementTop = activeEntry.offsetTop;
      const elementHeight = activeEntry.offsetHeight;
      const containerHeight = container.clientHeight;
      
      if (elementTop + elementHeight > container.scrollTop + containerHeight) {
        container.scrollTo({
          top: elementTop - containerHeight + elementHeight,
          behavior: 'smooth'
        });
      } else if (elementTop < container.scrollTop) {
        container.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }
  }, [traceCurIndex]);

  // Reset userScrolledUp and scroll to top when new algorithm starts
  useEffect(() => {
    userScrolledUp.current = false;
    setShowTracePill(false);
    if (traceScrollRef.current) {
      traceScrollRef.current.scrollTop = 0;
    }
  }, [activeFirstStepId]);

  // Reset userScrolledUp when user switches to TRACE tab
  useEffect(() => {
    if (activeRightTab === 'trace') {
      userScrolledUp.current = false;
      setShowTracePill(false);
    }
  }, [activeRightTab]);

  // Smooth scroll active line during normal playback
  useEffect(() => {
    if (activeRightTab === 'code' && codeScrollRef.current) {
      const activeLine = codeScrollRef.current.querySelector('[data-active-line="true"]') as HTMLElement;
      if (activeLine) {
        const container = codeScrollRef.current;
        const targetScrollTop = activeLine.offsetTop - (container.clientHeight / 2) + (activeLine.offsetHeight / 2);
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCodeLine]);

  // Tab Switch Scroll Memory and Restoration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeRightTab === 'graph' && graphScrollRef.current) {
        graphScrollRef.current.scrollTop = scrollPositions.current.graph;
      } else if (activeRightTab === 'code' && codeScrollRef.current) {
        const activeLine = codeScrollRef.current.querySelector('[data-active-line="true"]') as HTMLElement;
        if (activeLine) {
          const container = codeScrollRef.current;
          const targetScrollTop = activeLine.offsetTop - (container.clientHeight / 2) + (activeLine.offsetHeight / 2);
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'instant' as any
          });
        } else {
          codeScrollRef.current.scrollTop = scrollPositions.current.code;
        }
      } else if (activeRightTab === 'trace' && traceScrollRef.current) {
        if (!userScrolledUp.current) {
          const activeEntry = traceScrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
          if (activeEntry) {
            const container = traceScrollRef.current;
            const elementTop = activeEntry.offsetTop;
            const elementHeight = activeEntry.offsetHeight;
            const containerHeight = container.clientHeight;
            
            if (elementTop + elementHeight > container.scrollTop + containerHeight) {
              container.scrollTo({
                top: elementTop - containerHeight + elementHeight,
                behavior: 'instant' as any
              });
            } else if (elementTop < container.scrollTop) {
              container.scrollTo({
                top: elementTop,
                behavior: 'instant' as any
              });
            }
          } else {
            traceScrollRef.current.scrollTop = 0;
          }
        } else {
          traceScrollRef.current.scrollTop = scrollPositions.current.trace;
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeRightTab]);

  // Scroll window to top when switching views or entering workspace
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    }, 50);
    return () => clearTimeout(timer);
  }, [showLanding, activeView]);

  // Sync theme class & data-theme attribute to DOM
  useEffect(() => {
    document.body.classList.toggle('light', !darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-1)] via-[var(--bg-gradient-2)] to-[var(--bg-gradient-3)] text-[var(--text-color)] relative flex flex-col transition-all duration-300 overflow-x-hidden">
      {/* Dynamic Background glows */}
      {darkMode && (
        <>
          <div className="absolute top-[-12%] left-[5%] w-[650px] h-[650px] rounded-full bg-indigo-600/12 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[8%] right-[-8%] w-[650px] h-[650px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
          <div className="absolute top-[28%] right-[15%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[130px] pointer-events-none" />
        </>
      )}

      {/* Main Container */}
        <div className="w-full flex flex-grow relative z-10 pt-16 min-h-screen items-start flex-col">
          
          {/* TOP NAV BAR */}
          <header className="fixed top-0 left-0 right-0 h-16 border-b border-[var(--border-color)] bg-[var(--panel-bg)] backdrop-blur-md flex items-center justify-between px-6 z-40 transition-all">
            <div className="flex items-center gap-4">
              {activeView === 'workspace' && (
                <button 
                  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  className="lg:hidden p-2 text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors"
                  title="Toggle Panels"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isDrawerOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              )}
              <span className="text-[18px] sm:text-[22px] font-bold bg-gradient-to-r from-[var(--text-color)] to-[var(--muted-color)] bg-clip-text text-transparent select-none">
                {currentSection === 'sorting' ? 'Sorting' : 'Graph'}
              </span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg border text-sm transition-all hover:scale-105 active:scale-95 bg-[var(--pill-btn-bg)] border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--pill-btn-hover)] flex items-center justify-center min-w-[36px]"
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  useGraphStore.getState().setPlaying(false);
                  
                  window.history.pushState(null, '', '/');
                  window.dispatchEvent(new Event('popstate'));
                }}
                className="text-xs font-semibold text-[var(--muted-color)] hover:text-[#10b981] bg-[var(--pill-btn-bg)] border border-[var(--border-color)] px-4 py-2 rounded-xl transition-all hover:scale-105 flex items-center gap-1.5"
              >
                ← Portal
              </a>
            </div>
          </header>

          {/* HERO HEADER */}
          {showLanding ? (
            <GraphLandingPage
              onSelectAlgorithm={handleSelectAlgorithm}
              onSelectProgram={handleSelectProgram}
              onOpenVisualizer={handleOpenVisualizer}
            />
          ) : (
            <main className="w-full flex-grow p-6 pb-32 flex flex-col items-center">
              <div className="max-w-6xl w-full">
              {/* VIEW TOGGLE & HEADER */}
              <div className="text-center py-12">
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[var(--text-color)] via-emerald-400 to-teal-400 bg-clip-text text-transparent leading-tight">
                  {currentSection === 'sorting' ? 'Sorting Visualizer' : 'Graph Visualizer'}
                </h1>
                <p className="text-[var(--muted-color)] text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8">
                  {currentSection === 'sorting' ? 'Visualize and trace sorting execution steps' : 'Learn, Build, and Explore Graph Algorithms'}
                </p>
                
                {currentSection !== 'sorting' && (
                  <div className="inline-flex bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full p-1 shadow-sm">
                    <button
                      onClick={() => setActiveView('education')}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                        activeView === 'education'
                          ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                          : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
                      }`}
                    >
                      📖 Education
                    </button>
                    <button
                      onClick={() => setActiveView('workspace')}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                        activeView === 'workspace'
                          ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                          : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
                      }`}
                    >
                      🛠️ Interactive Workspace
                    </button>
                  </div>
                )}
              </div>

              {/* PHASE 1: EDUCATION PANEL */}
              {activeView === 'education' && currentSection !== 'sorting' && (
                <div className="animate-fadeInUp">
                  <EducationPanel />
                </div>
              )}

              {/* INTERACTIVE WORKSPACE (Phase 2 & 3 & 4 & 5) */}
              {(activeView === 'workspace' || currentSection === 'sorting') && (
                <div 
                  id="interactive-workspace"
                  className={`transition-all duration-500 ease-in-out overflow-hidden flex flex-col lg:flex-row bg-[var(--bg-gradient-1)] shadow-2xl animate-fadeInUp ${
                    isFullscreen 
                      ? 'fixed inset-0 z-50 w-full h-screen rounded-none m-0' 
                      : 'w-full max-w-7xl mx-auto border border-[var(--border-color)] rounded-2xl h-auto lg:h-[750px] relative'
                  }`}
                >
                  {/* Left Panel: Drawer on Mobile, Fixed on Desktop */}
                  <div 
                    className={`
                      ${isDrawerOpen ? 'fixed inset-y-0 left-0 z-40 translate-x-0 w-[280px] shadow-2xl' : 'fixed inset-y-0 left-0 z-40 -translate-x-full w-[280px]'}
                      lg:relative lg:translate-x-0 
                      flex-shrink-0 flex flex-col border-r border-[var(--border-color)] bg-[var(--panel-bg)] 
                      transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                      min-h-screen lg:min-h-0 pt-20 lg:pt-5 gap-4 overflow-hidden
                    `}
                    style={{ 
                      width: leftPanelOpen ? (isFullscreen ? '20rem' : '320px') : '0px',
                      opacity: leftPanelOpen ? 1 : 0,
                      paddingLeft: leftPanelOpen ? '1rem' : '0px',
                      paddingRight: leftPanelOpen ? '1rem' : '0px',
                      paddingBottom: leftPanelOpen ? '1.5rem' : '0px'
                    }}
                    onTransitionEnd={() => {
                      if (window.dispatchEvent) {
                        window.dispatchEvent(new Event('resize'));
                      }
                    }}
                  >

                    {currentSection === 'sorting' ? (
                      <div className="w-full h-full flex flex-col gap-4 overflow-y-auto no-scrollbar relative">
                        {/* Mobile Overlay */}
                        {isDrawerOpen && (
                          <div className="fixed inset-0 bg-black/50 z-[-1] lg:hidden" onClick={() => setIsDrawerOpen(false)} />
                        )}
                        
                        {/* Collapse Button inside the header on desktop / drawer */}
                        <div className="flex justify-end pr-1 pt-1 shrink-0">
                          <button 
                            onClick={() => setLeftPanelOpen(false)} 
                            className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] hover:border-[var(--text-color)]/50 transition-[color,border-color] duration-150"
                            title="Collapse panel"
                          >
                            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                          </button>
                        </div>

                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col gap-4 overflow-y-auto no-scrollbar relative">
                        {/* Mobile Overlay */}
                        {isDrawerOpen && (
                          <div className="fixed inset-0 bg-black/50 z-[-1] lg:hidden" onClick={() => setIsDrawerOpen(false)} />
                        )}

                        {/* Back Button */}
                        <div className="flex items-center shrink-0">
                          <button
                            onClick={() => {
                              useGraphStore.getState().setPlaying(false);
                              useIslandsStore.getState().setPlaying(false);
                              useCycleStore.getState().setPlaying(false);
                              useBipartiteStore.getState().setPlaying(false);
                              setShowLanding(true);
                            }}
                            className="px-3 py-2 text-[10px] font-sans uppercase tracking-[0.06em] text-[var(--muted-color)] hover:text-blue-400 transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-1"
                          >
                            ← GRAPH HOME
                          </button>
                        </div>
                        
                        {/* Header with Workspace Mode Toggle */}
                        <div className="flex items-center justify-between w-full flex-shrink-0 gap-2">
                          {!isEditingGraph ? (
                            <div className="flex bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[8px] p-1 relative flex-grow">
                              {/* Sliding active background */}
                              <div className={`absolute top-1 bottom-1 w-[calc(33.33%-4px)] rounded-[6px] transition-all duration-300 ease-out shadow-sm ${
                                activeWorkspaceMode === 'operations' 
                                  ? 'left-1 bg-emerald-500' 
                                  : activeWorkspaceMode === 'algorithms'
                                    ? 'left-[calc(33.33%+2px)] bg-blue-500'
                                    : 'left-[calc(66.66%+2px)] bg-purple-500'
                              }`} />
                              <button 
                                onClick={() => setActiveWorkspaceMode('operations')}
                                className={`flex-1 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-300 rounded-[6px] relative z-10 ${
                                  activeWorkspaceMode === 'operations' ? 'text-white' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
                                }`}
                              >
                                Operations
                              </button>
                              <button 
                                onClick={() => setActiveWorkspaceMode('algorithms')}
                                className={`flex-1 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-300 rounded-[6px] relative z-10 ${
                                  activeWorkspaceMode === 'algorithms' ? 'text-white' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
                                }`}
                              >
                                Algorithms
                              </button>
                              <button 
                                onClick={() => setActiveWorkspaceMode('programs')}
                                className={`flex-1 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-300 rounded-[6px] relative z-10 ${
                                  activeWorkspaceMode === 'programs' ? 'text-white' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
                                }`}
                              >
                                Programs
                              </button>
                            </div>
                          ) : (
                            <div className="flex-grow"></div>
                          )}
                          
                          {/* Collapse Button inside the header */}
                          <button 
                            onClick={() => setLeftPanelOpen(false)} 
                            className="w-[28px] h-[28px] shrink-0 flex items-center justify-center rounded-[6px] border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] hover:border-[var(--text-color)]/50 transition-[color,border-color] duration-150"
                            title="Collapse panel"
                          >
                            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                          </button>
                        </div>

                        <div className="flex flex-col gap-4 flex-grow relative">
                          {isEditingGraph ? (
                            <div className="animate-fadeInUp">
                              <PresetSelector />
                              <div className="h-px w-full bg-[var(--border-color)] opacity-50 my-4"></div>
                              <ModifyPanel />
                            </div>
                          ) : activeWorkspaceMode === 'operations' ? (
                            <div key="operations" className="flex flex-col gap-4 animate-slideInLeft">
                              <PresetSelector />
                              <div className="h-px w-full bg-[var(--border-color)] opacity-50"></div>
                              <OperationsPanel />
                            </div>
                          ) : activeWorkspaceMode === 'algorithms' ? (
                            <div key="algorithms" className="flex flex-col gap-4 animate-slideInRight">
                              <AlgorithmsPanel />
                            </div>
                          ) : (
                            <div key="programs" className="flex flex-col gap-4 animate-fadeInUp">
                              {selectedProgram === 'cycle' ? (
                                <CyclePanel selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} />
                              ) : selectedProgram === 'bipartite' ? (
                                <BipartitePanel selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} />
                              ) : (
                                <IslandsPanel selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Expand Left Tab Button (Visible when left panel is collapsed) */}
                  {!leftPanelOpen && (
                    <button 
                      onClick={() => setLeftPanelOpen(true)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[var(--panel-bg)] border border-[var(--border-color)] border-l-0 rounded-r-md text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] z-20 flex items-center justify-center shadow-lg transition-colors"
                      title="Expand left panel"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  )}

                  {/* Center Panel: Graph Canvas & Controls */}
                  <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--border-color)] overflow-hidden bg-[var(--panel-bg)] min-h-[400px] lg:min-h-[300px] relative z-10">
                    <div className="flex-1 relative min-h-[200px]">
                      {activeWorkspaceMode === 'programs' ? (
                        selectedProgram === 'cycle' ? (
                          <CycleCanvas />
                        ) : selectedProgram === 'bipartite' ? (
                          <BipartiteCanvas />
                        ) : (
                          <IslandsCanvas />
                        )
                      ) : (
                        <GraphCanvas />
                      )}
                    </div>
                    {activeWorkspaceMode === 'programs' ? (
                      selectedProgram === 'cycle' ? (
                        <CycleBottomPanel />
                      ) : selectedProgram === 'bipartite' ? (
                        <BipartiteBottomPanel />
                      ) : (
                        <IslandsBottomPanel />
                      )
                    ) : (
                      <AlgorithmOutput />
                    )}
                    <div className="pb-4 shrink-0 bg-[var(--bg-gradient-1)] border-[var(--border-color)]">
                      <Controls activeWorkspaceMode={currentSection === 'sorting' ? 'sorting' : activeWorkspaceMode} selectedProgram={selectedProgram} />
                    </div>
                  </div>

                  {/* Right Panel: Data View + Source Code + Trace Log */}
                  <div 
                    className="flex-shrink-0 flex flex-col h-[450px] lg:h-full bg-[var(--panel-bg)] transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] min-h-[400px] lg:min-h-0 relative z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
                    style={{ 
                      width: rightPanelOpen ? (isFullscreen ? rightPanelWidth : (window.innerWidth >= 1024 ? rightPanelWidth : '100%')) : '0px',
                      opacity: rightPanelOpen ? 1 : 0
                    }}
                    onTransitionEnd={() => {
                      if (window.dispatchEvent) {
                        window.dispatchEvent(new Event('resize'));
                      }
                    }}
                  >
                    {/* Resizer Handle */}
                    {rightPanelOpen && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-transparent hover:bg-blue-500/50 cursor-col-resize z-50 transition-colors"
                        onMouseDown={() => setIsResizingRight(true)}
                      ></div>
                    )}

                      <div className="flex-1 flex flex-col h-full w-full min-w-[260px]">
                        {/* ANALYSIS Header Bar */}
                        <div className="h-[44px] border-b border-[var(--border-color)] bg-[var(--panel-bg)] px-3 flex justify-between items-center shrink-0">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-500">🔬</span>
                            <h2 className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--muted-color)]">Analysis</h2>
                          </div>
                          
                          {/* Controls Row */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                if (activeWorkspaceMode === 'programs') {
                                  if (selectedProgram === 'cycle') {
                                    useCycleStore.getState().setSteps([]);
                                  } else if (selectedProgram === 'bipartite') {
                                    useBipartiteStore.getState().setSteps([]);
                                  } else {
                                    useIslandsStore.getState().setSteps([]);
                                  }
                                } else {
                                  setSteps([]);
                                  setStats(null);
                                }
                              }}
                              className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded-[6px] border border-[var(--border-color)] text-[var(--muted-color)] bg-transparent hover:border-red-400 hover:text-red-400 transition-[color,border-color] duration-150"
                            >
                              Clear
                            </button>
                            <button 
                              onClick={() => setRightPanelOpen(false)} 
                              className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] hover:border-[var(--text-color)]/50 transition-[color,border-color] duration-150"
                              title="Collapse panel"
                            >
                              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          </div>
                        </div>

                         {/* Right Panel Tabs */}
                        <div className="flex bg-[var(--input-bg)] border-b border-[var(--border-color)] p-2 flex-shrink-0 gap-1 relative">
                          {/* Sliding active indicator */}
                          <div 
                            className={`absolute top-2 bottom-2 w-[calc(33.33%-6px)] rounded transition-all duration-300 ease-out shadow-sm ${
                              activeRightTab === 'graph' 
                                ? 'left-2 bg-purple-500/20 border border-purple-500/30' 
                                : activeRightTab === 'code'
                                  ? 'left-[calc(33.33%+1px)] bg-blue-500/20 border border-blue-500/30'
                                  : 'left-[calc(66.66%+1px)] bg-orange-500/20 border border-orange-500/30'
                            }`} 
                          />
                          <button 
                            onClick={() => setActiveRightTab('graph')}
                            className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded relative z-10 transition-colors duration-200 ${
                              activeRightTab === 'graph' ? 'text-purple-400 font-extrabold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
                            }`}
                          >
                            Graph
                          </button>
                          <button 
                            onClick={() => setActiveRightTab('code')}
                            className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded relative z-10 transition-colors duration-200 ${
                              activeRightTab === 'code' ? 'text-blue-400 font-extrabold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
                            }`}
                          >
                            Code
                          </button>
                          <button 
                            onClick={() => setActiveRightTab('trace')}
                            className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded relative z-10 transition-colors duration-200 ${
                              activeRightTab === 'trace' ? 'text-orange-400 font-extrabold' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
                            }`}
                          >
                            Trace
                          </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 flex flex-col overflow-hidden relative">
                          {activeWorkspaceMode === 'programs' ? (
                            selectedProgram === 'cycle' ? (
                              <CycleRightPanel activeRightTab={activeRightTab} />
                            ) : selectedProgram === 'bipartite' ? (
                              <BipartiteRightPanel activeRightTab={activeRightTab} />
                            ) : (
                              <IslandsRightPanel activeRightTab={activeRightTab} />
                            )
                          ) : (
                            <>
                              {activeRightTab === 'graph' && (
                                <div 
                                  ref={graphScrollRef}
                                  onScroll={(e) => {
                                    scrollPositions.current.graph = e.currentTarget.scrollTop;
                                  }}
                                  className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar"
                                  style={{ height: 0 }}
                                >
                                  {activeWorkspaceMode === 'algorithms' && (
                                    <AuxiliaryDataPanel 
                                      collapsed={false} 
                                      onToggle={() => {}} 
                                    />
                                  )}
                                  <AdjacencyListPanel 
                                    collapsed={false} 
                                    onToggle={() => {}} 
                                  />
                                </div>
                              )}
                              {activeRightTab === 'code' && (
                                <div className="flex-1 min-h-0 flex flex-col overflow-hidden" style={{ height: 0 }}>
                                  <CodePanel 
                                    collapsed={false} 
                                    onToggle={() => {}} 
                                    codeScrollRef={codeScrollRef}
                                    onScroll={(e) => {
                                      scrollPositions.current.code = e.currentTarget.scrollTop;
                                    }}
                                  />
                                </div>
                              )}
                              {activeRightTab === 'trace' && (
                                <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden" style={{ height: 0 }}>
                                  <TraceLogPanel 
                                    collapsed={false} 
                                    onToggle={() => {}} 
                                    traceScrollRef={traceScrollRef}
                                    onScroll={handleTraceScroll}
                                  />
                                  {showTracePill && (
                                    <button
                                      onClick={handleScrollToActiveTrace}
                                      className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#3b82f6]/90 border border-[#3b82f6] rounded-full px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-[0.06em] cursor-pointer z-10 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:bg-[#3b82f6] transition-colors"
                                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                      ↓ Jump to current step
                                    </button>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                  </div>
                  
                  {/* Expand Right Tab Button (Visible when right panel is collapsed) */}
                  {!rightPanelOpen && (
                    <button 
                      onClick={() => setRightPanelOpen(true)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[var(--panel-bg)] border border-[var(--border-color)] border-r-0 rounded-l-md text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] z-50 flex items-center justify-center shadow-lg transition-colors"
                      title="Expand right panel"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

