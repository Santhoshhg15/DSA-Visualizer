import { useEffect, useState, useRef, useCallback } from 'react';
import { useSWStore } from './store';
import { SWLeftPanel } from './components/SWLeftPanel';
import { SWRightPanel } from './components/SWRightPanel';
import { MaxSumSubarrayVisualizer } from './components/MaxSumSubarrayVisualizer';
import { FirstNegativeVisualizer } from './components/FirstNegativeVisualizer';
import { MaxDequeVisualizer } from './components/MaxDequeVisualizer';
import { AnagramVisualizer } from './components/AnagramVisualizer';
import { LongestSubstrVisualizer } from './components/LongestSubstrVisualizer';
import { SmallestSubarrayVisualizer } from './components/SmallestSubarrayVisualizer';
import { KDistinctVisualizer } from './components/KDistinctVisualizer';
import { KadaneVisualizer } from './components/KadaneVisualizer';
import { ComingSoonPlaceholder } from './components/ComingSoonPlaceholder';
import { StepLog } from './components/StepLog';
import { Controls } from './components/Controls';
import { Navbar } from './components/Navbar';

const LEFT_MIN = 180;
const LEFT_MAX = 520;
const RIGHT_MIN = 220;
const RIGHT_MAX = 520;
const LEFT_DEFAULT = 280;
const RIGHT_DEFAULT = 320;

export default function App() {
  const { theme, selectedProblemId, problem } = useSWStore();

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Resizable panel widths
  const [leftWidth, setLeftWidth] = useState(LEFT_DEFAULT);
  const [rightWidth, setRightWidth] = useState(RIGHT_DEFAULT);

  // Drag state
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const draggingLeft = useRef(false);
  const draggingRight = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  // Left divider drag
  const onLeftDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      draggingLeft.current = true;
      setIsResizingLeft(true);
      dragStartX.current = e.clientX;
      dragStartWidth.current = leftWidth;
      e.preventDefault();
    },
    [leftWidth]
  );

  // Right divider drag
  const onRightDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      draggingRight.current = true;
      setIsResizingRight(true);
      dragStartX.current = e.clientX;
      dragStartWidth.current = rightWidth;
      e.preventDefault();
    },
    [rightWidth]
  );

  // Global mouse move / up
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (draggingLeft.current) {
        const delta = e.clientX - dragStartX.current;
        const next = Math.min(LEFT_MAX, Math.max(LEFT_MIN, dragStartWidth.current + delta));
        setLeftWidth(next);
      }
      if (draggingRight.current) {
        const delta = dragStartX.current - e.clientX;
        const next = Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, dragStartWidth.current + delta));
        setRightWidth(next);
      }
    };

    const onMouseUp = () => {
      if (draggingLeft.current) {
        draggingLeft.current = false;
        setIsResizingLeft(false);
      }
      if (draggingRight.current) {
        draggingRight.current = false;
        setIsResizingRight(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isDragging = isResizingLeft || isResizingRight;

  return (
    <div
      className={`min-h-screen h-screen bg-[var(--bg-color)] text-[var(--text-color)] font-sans flex flex-col transition-colors duration-300 overflow-hidden ${
        isDragging ? 'select-none cursor-col-resize' : ''
      }`}
    >
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <main className="flex-1 flex overflow-hidden">
          <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-[var(--bg-gradient-1)]">
            {/* LEFT PANEL */}
            <div
              className="flex-shrink-0 flex flex-col bg-[var(--panel-bg)] overflow-hidden"
              style={{
                width: leftPanelOpen ? leftWidth : 0,
                opacity: leftPanelOpen ? 1 : 0,
                transition: isResizingLeft ? 'none' : 'width 300ms ease-in-out, opacity 300ms ease-in-out',
              }}
            >
              <div className="w-full h-full flex flex-col p-4 overflow-y-auto no-scrollbar gap-3">
                <SWLeftPanel onCollapse={() => setLeftPanelOpen(false)} />
              </div>
            </div>

            {/* LEFT RESIZE HANDLE */}
            <div
              onMouseDown={onLeftDividerMouseDown}
              className="group relative flex-shrink-0 cursor-col-resize z-10 select-none"
              style={{
                background: 'var(--border-color)',
                width: leftPanelOpen ? 5 : 0,
                opacity: leftPanelOpen ? 1 : 0,
                pointerEvents: leftPanelOpen ? 'auto' : 'none',
              }}
              title="Drag to resize"
            >
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[5px] transition-colors ${isResizingLeft ? 'bg-blue-500' : 'group-hover:bg-blue-500/60 group-active:bg-blue-500'}`} />
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] transition-opacity pointer-events-none ${isResizingLeft ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                ))}
              </div>
            </div>

            {/* Expand left tab */}
            <button
              onClick={() => setLeftPanelOpen(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[var(--panel-bg)] border border-[var(--border-color)] border-l-0 rounded-r-md text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] z-20 flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out"
              style={{
                opacity: leftPanelOpen ? 0 : 1,
                pointerEvents: leftPanelOpen ? 'none' : 'auto',
                transform: `translateY(-50%) translateX(${leftPanelOpen ? '-20px' : '0'})`,
              }}
              title="Expand left panel"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* CENTER — Visualization + Controls */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
              {/* Visualization area */}
              <div className="flex-1 overflow-hidden relative">
                {selectedProblemId === 'max-sum-subarray-k' ? (
                  <MaxSumSubarrayVisualizer />
                ) : selectedProblemId === 'first-negative-in-window' ? (
                  <FirstNegativeVisualizer />
                ) : selectedProblemId === 'max-of-all-subarrays-k' ? (
                  <MaxDequeVisualizer />
                ) : selectedProblemId === 'count-anagrams-pattern' ? (
                  <AnagramVisualizer />
                ) : selectedProblemId === 'longest-substr-no-repeat' ? (
                  <LongestSubstrVisualizer />
                ) : selectedProblemId === 'smallest-subarray-sum-target' ? (
                  <SmallestSubarrayVisualizer />
                ) : selectedProblemId === 'longest-substr-k-distinct' ? (
                  <KDistinctVisualizer />
                ) : selectedProblemId === 'kadanes-max-subarray' ? (
                  <KadaneVisualizer />
                ) : (
                  <ComingSoonPlaceholder name={problem.name} />
                )}
              </div>

              {/* Step log strip */}
              <StepLog />

              {/* Playback controls bar + progress bar */}
              <Controls />
            </div>

            {/* RIGHT RESIZE HANDLE */}
            <div
              onMouseDown={onRightDividerMouseDown}
              className="group relative flex-shrink-0 cursor-col-resize z-10 select-none"
              style={{
                background: 'var(--border-color)',
                width: rightPanelOpen ? 5 : 0,
                opacity: rightPanelOpen ? 1 : 0,
                pointerEvents: rightPanelOpen ? 'auto' : 'none',
              }}
              title="Drag to resize"
            >
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[5px] transition-colors ${isResizingRight ? 'bg-blue-500' : 'group-hover:bg-blue-500/60 group-active:bg-blue-500'}`} />
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] transition-opacity pointer-events-none ${isResizingRight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                ))}
              </div>
            </div>

            {/* Expand right tab */}
            <button
              onClick={() => setRightPanelOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[var(--panel-bg)] border border-[var(--border-color)] border-r-0 rounded-l-md text-[var(--muted-color)] hover:text-blue-400 hover:bg-[var(--input-bg)] z-20 flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out"
              style={{
                opacity: rightPanelOpen ? 0 : 1,
                pointerEvents: rightPanelOpen ? 'none' : 'auto',
                transform: `translateY(-50%) translateX(${rightPanelOpen ? '20px' : '0'})`,
              }}
              title="Expand right panel"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* RIGHT PANEL */}
            <div
              className="flex-shrink-0 flex flex-col bg-[var(--panel-bg)] overflow-hidden"
              style={{
                width: rightPanelOpen ? rightWidth : 0,
                opacity: rightPanelOpen ? 1 : 0,
                transition: isResizingRight ? 'none' : 'width 300ms ease-in-out, opacity 300ms ease-in-out',
              }}
            >
              <div className="w-full h-full flex flex-col overflow-hidden">
                <SWRightPanel onCollapse={() => setRightPanelOpen(false)} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
