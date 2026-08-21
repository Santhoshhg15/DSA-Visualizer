import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { JavaCodeLine } from '../utils/javaSyntaxHighlight';

export function DPRightPanel({
  setRightPanelOpen,
}: {
  setRightPanelOpen: (v: boolean) => void;
}) {
  const { n, problem, steps, cur, reset, selectedProblemId, subsetTargetK, minCoinsAmount, minCoinsArray, knapsackCapacity, lcsStr1, lcsStr2, lpsString, lpsLcsString, stockPrices, lisArray, uniquePathsRows, uniquePathsCols, minPathRows, minPathCols, minPathCostGrid, partitionArray, targetSumArray, targetSumTarget, editDistString1, editDistString2, deleteOpString1, deleteOpString2, coinChangeIICoins, coinChangeIIAmount, partitionMaxSumK, partitionMaxSumArr } = useDPStore();
  const playing = useDPStore((state) => state.playing);

  const [activeTab, setActiveTab] = useState<'code' | 'trace' | 'stats'>('code');
  const [isPseudoCode, setIsPseudoCode] = useState(false);

  // Auto-switch to trace when playing starts
  useEffect(() => {
    if (playing) {
      setActiveTab('trace');
    }
  }, [playing]);

  const codeScrollRef = useRef<HTMLDivElement>(null);
  const traceScrollRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const [showTracePill, setShowTracePill] = useState(false);
  const outerContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = cur >= 0 && cur < steps.length ? steps[cur] : null;
  const activeLine = isPseudoCode
    ? (currentStep?.codeLineActivePseudo ?? currentStep?.codeLineActive ?? 0)
    : (currentStep?.codeLineActiveJava ?? currentStep?.codeLineActive ?? 0);
  const isDone = currentStep?.type === 'done';

  const isKnapsack = selectedProblemId === 'knapsack';
  const isMinCoins = selectedProblemId === 'minimum-coins';
  const isCountSubsets = selectedProblemId === 'count-subsets-sum';
  const isHouseRobber = selectedProblemId === 'house-robber';
  const isLcs = selectedProblemId === 'lcs';
  const isLps = selectedProblemId === 'lps-interval-dp';
  const isLpsLcs = selectedProblemId === 'lps-via-lcs';
  const isBuySellStocks = selectedProblemId === 'buy-sell-stocks';
  const isLis = selectedProblemId === 'lis';
  const isUniquePaths = selectedProblemId === 'unique-paths';
  const isMinPathSum = selectedProblemId === 'minimum-path-sum';
  const isPartition = selectedProblemId === 'partition-equal-subset';
  const isTargetSum = selectedProblemId === 'target-sum';
  const isEditDistance = selectedProblemId === 'edit-distance';
  const isDeleteOp = selectedProblemId === 'delete-operation';
  const isCoinChangeII = selectedProblemId === 'coin-change-ii';
  const isPartitionMaxSum = selectedProblemId === 'partition-array-max-sum';

  // Auto-scroll trace log when step changes
  useEffect(() => {
    if (activeTab === 'trace' && traceScrollRef.current && !userScrolledUp.current) {
      const container = traceScrollRef.current;
      const activeEntry = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        const elementTop = activeEntry.offsetTop;
        const elementHeight = activeEntry.offsetHeight;
        const containerHeight = container.clientHeight;

        if (elementTop + elementHeight > container.scrollTop + containerHeight) {
          container.scrollTo({
            top: elementTop - containerHeight + elementHeight,
            behavior: 'smooth',
          });
        } else if (elementTop < container.scrollTop) {
          container.scrollTo({
            top: elementTop,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [cur, activeTab]);

  // Auto-scroll/highlight active code line
  useEffect(() => {
    if (activeTab === 'code' && codeScrollRef.current) {
      const container = codeScrollRef.current;
      const activeLineEl = container.querySelector('[data-active-line="true"]') as HTMLElement;
      if (activeLineEl) {
        const targetScrollTop =
          activeLineEl.offsetTop - container.clientHeight / 2 + activeLineEl.offsetHeight / 2;
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [activeLine, activeTab]);

  const handleTraceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    userScrolledUp.current = !isAtBottom;
    setShowTracePill(!isAtBottom);
  };

  const handleScrollToActiveTrace = () => {
    userScrolledUp.current = false;
    setShowTracePill(false);
    if (traceScrollRef.current) {
      const container = traceScrollRef.current;
      const activeEntry = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        container.scrollTo({
          top: activeEntry.offsetTop - container.clientHeight / 2,
          behavior: 'smooth',
        });
      }
    }
  };

  const codeLines = isPseudoCode
    ? (problem.pseudoCode || problem.javaCode)
    : problem.javaCode;

  // Copy and Download logic
  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeLines.join('\n'));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleDownload = () => {
    const filename = isPseudoCode
      ? `${problem.name.replace(/\s+/g, '')}_Pseudocode.txt`
      : `${problem.name.replace(/\s+/g, '')}.java`;
    const header = [
      '// ============================================',
      `// ${problem.name} (${isPseudoCode ? 'Pseudocode' : 'Java Implementation'})`,
      '// DSA Visualizer — Generated Code',
      '// ============================================',
      `// Time Complexity:  ${problem.timeComplexity}`,
      `// Space Complexity: ${problem.spaceComplexity}`,
      '// ============================================',
      '',
      '',
    ].join('\n');
    const blob = new Blob([header + codeLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    reset();
    setActiveTab('code');
  };

  const totalSteps = steps.length;
  const finalAnswer = isDone && currentStep
    ? isKnapsack
      ? (currentStep.dpTable ? currentStep.dpTable[n]?.[knapsackCapacity] : currentStep.dpArray[currentStep.dpArray.length - 1])
      : isMinCoins
      ? (currentStep.dpArray[minCoinsAmount] === 'INF' ? -1 : currentStep.dpArray[minCoinsAmount])
      : isCountSubsets
      ? (currentStep.dpTable ? (currentStep.dpTable[n - 1]?.[subsetTargetK] ?? currentStep.returnValue) : currentStep.returnValue)
      : isLps
      ? (currentStep.dpTable ? currentStep.dpTable[0]?.[(currentStep.dpTable.length || n) - 1] : currentStep.dpArray[n - 1])
      : isLpsLcs
      ? (currentStep.dpTable ? currentStep.dpTable[currentStep.dpTable.length - 1]?.[currentStep.dpTable[0].length - 1] : currentStep.dpArray[currentStep.dpArray.length - 1])
      : isHouseRobber
      ? currentStep.dpArray[n - 1]
      : isUniquePaths
      ? (currentStep.dpTable ? currentStep.dpTable[(currentStep.gridRows || uniquePathsRows) - 1]?.[(currentStep.gridCols || uniquePathsCols) - 1] : currentStep.dpArray[currentStep.dpArray.length - 1])
      : isMinPathSum
      ? (currentStep.dpTable ? currentStep.dpTable[(currentStep.gridRows || minPathRows) - 1]?.[(currentStep.gridCols || minPathCols) - 1] : currentStep.dpArray[currentStep.dpArray.length - 1])
      : isPartition
      ? (currentStep.type === 'odd-sum-exit' ? false : (currentStep.dpTable && currentStep.targetSum !== undefined ? currentStep.dpTable[(currentStep.partitionArr || partitionArray).length]?.[currentStep.targetSum] : currentStep.dpArray[currentStep.dpArray.length - 1]))
      : isTargetSum
      ? (currentStep.type === 'short-circuit' ? 0 : (currentStep.dpTable && currentStep.derivedTarget !== undefined ? currentStep.dpTable[(currentStep.targetSumArr || targetSumArray).length]?.[currentStep.derivedTarget] : currentStep.dpArray[currentStep.dpArray.length - 1]))
      : isEditDistance
      ? (currentStep.dpTable ? currentStep.dpTable[(currentStep.editDistS1 || editDistString1).length]?.[(currentStep.editDistS2 || editDistString2).length] : currentStep.dpArray[currentStep.dpArray.length - 1])
      : isDeleteOp
      ? (currentStep.deleteOpAnswer !== undefined && currentStep.deleteOpAnswer !== null ? currentStep.deleteOpAnswer : (currentStep.dpTable ? ((currentStep.deleteOpS1 || deleteOpString1).length - (currentStep.dpTable[(currentStep.deleteOpS1 || deleteOpString1).length]?.[(currentStep.deleteOpS2 || deleteOpString2).length] as number)) + ((currentStep.deleteOpS2 || deleteOpString2).length - (currentStep.dpTable[(currentStep.deleteOpS1 || deleteOpString1).length]?.[(currentStep.deleteOpS2 || deleteOpString2).length] as number)) : 0))
      : isCoinChangeII
      ? (currentStep.dpTable ? currentStep.dpTable[(currentStep.coinChangeIICoins || coinChangeIICoins).length]?.[currentStep.coinChangeIIAmount ?? coinChangeIIAmount] : currentStep.dpArray[currentStep.dpArray.length - 1])
      : currentStep.dpArray[n]
    : null;

  return (
    <div
      ref={outerContainerRef}
      className="flex-1 flex flex-col h-full bg-[var(--panel-bg)] overflow-hidden"
    >
      {/* 1. ANALYSIS Header Bar */}
      <div className="h-[44px] border-b border-[var(--border-color)] bg-[var(--panel-bg)] px-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 select-none">
          <span className="text-purple-500">🔬</span>
          <h2 className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--muted-color)]">
            Analysis
          </h2>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] rounded-[6px] border border-[var(--border-color)] text-[var(--muted-color)] bg-transparent hover:border-red-400 hover:text-red-400 transition-[color,border-color] duration-150"
          >
            Clear
          </button>

          <button
            onClick={() => setRightPanelOpen(false)}
            className="w-[26px] h-[26px] flex items-center justify-center rounded-[6px] border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--muted-color)] hover:text-[var(--text-color)] hover:border-[var(--border-hover)] transition-[color,border-color] duration-150"
            title="Collapse panel"
          >
            <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. CODE/TRACE/STATS TAB BAR */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-color)',
        }}
        className="shrink-0 select-none"
      >
        <div
          style={{
            display: 'flex',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '3px',
            gap: '3px',
          }}
        >
          {(['code', 'trace', 'stats'] as const).map((tab) => {
            const isActive = activeTab === tab;
            let activeBg = 'transparent';
            let activeColor = 'var(--muted-color)';

            if (isActive) {
              if (tab === 'code') {
                activeBg = 'var(--accent-indigo-bg)';
                activeColor = 'var(--accent-indigo)';
              } else if (tab === 'trace') {
                activeBg = 'var(--accent-blue-bg)';
                activeColor = 'var(--accent-blue)';
              } else if (tab === 'stats') {
                activeBg = 'var(--accent-amber-bg)';
                activeColor = 'var(--accent-amber)';
              }
            }

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s ease',
                  background: activeBg,
                  color: activeColor,
                }}
                className={!isActive ? 'hover:text-[var(--text-color)]' : ''}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TAB CONTENT AREA (Flexible, Scrollable, Fills Remaining Space) */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        {/* 1. CODE TAB */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            {/* SOURCE CODE SUBHEADER */}
            <div
              style={{
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
              }}
              className="shrink-0 select-none"
            >
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--muted-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                }}
              >
                💻 {isPseudoCode ? 'PSEUDOCODE' : 'JAVA SOURCE'}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid var(--accent-amber-bg)',
                    background: 'var(--accent-amber-bg)',
                    color: 'var(--accent-amber)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                  }}
                >
                  {problem.timeComplexity}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid var(--accent-indigo-bg)',
                    background: 'var(--accent-indigo-bg)',
                    color: 'var(--accent-indigo)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                  }}
                >
                  {problem.spaceComplexity}
                </span>
              </div>
            </div>

            {/* PSEUDO / JAVA TOGGLE & ACTION BUTTONS */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 16px',
                borderBottom: '1px solid var(--border-color)',
              }}
              className="shrink-0 select-none"
            >
              {/* Toggle track */}
              <div
                style={{
                  display: 'flex',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '2px',
                  width: 'fit-content',
                }}
              >
                <button
                  onClick={() => setIsPseudoCode(true)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: isPseudoCode ? 700 : 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    border: 'none',
                    background: isPseudoCode ? 'var(--accent-blue-bg)' : 'transparent',
                    color: isPseudoCode ? 'var(--accent-blue)' : 'var(--muted-color)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  PSEUDO
                </button>
                <button
                  onClick={() => setIsPseudoCode(false)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: !isPseudoCode ? 700 : 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    border: 'none',
                    background: !isPseudoCode ? 'var(--accent-teal-bg)' : 'transparent',
                    color: !isPseudoCode ? 'var(--accent-teal)' : 'var(--muted-color)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  JAVA
                </button>
              </div>

              {/* Icon buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handleCopy}
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    border: '1px solid transparent',
                    color: copySuccess ? 'var(--accent-teal)' : 'var(--muted-color)',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20"
                  title={copySuccess ? 'Copied!' : 'Copy Code'}
                >
                  {copySuccess ? '✓' : '⎘'}
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    border: '1px solid transparent',
                    color: 'var(--muted-color)',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20"
                  title="Download File"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* CODE LINES & ACTIVE LINE HIGHLIGHT */}
            <div
              ref={codeScrollRef}
              className="flex-1 overflow-y-auto p-4 text-[13px] font-mono custom-scrollbar bg-[var(--panel-bg)] min-h-0"
            >
              <div className="flex">
                {/* Line numbers column */}
                <div className="flex flex-col text-right pr-3 mr-3 border-r border-[var(--border-color)] text-[13px] text-[var(--muted-color)]/60 select-none">
                  {codeLines.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Code lines column */}
                <div className="flex flex-col flex-1">
                  {codeLines.map((line, idx) => {
                    const isActive = idx + 1 === activeLine;
                    return (
                      <div
                        key={idx}
                        data-active-line={isActive}
                        style={{
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '8px',
                          marginLeft: '-8px',
                          whiteSpace: 'pre',
                          borderRadius: '2px',
                          boxSizing: 'border-box',
                          transition: 'all 0.15s ease',
                          borderLeft: isActive ? '3px solid var(--accent-amber)' : '3px solid transparent',
                          background: isActive ? 'var(--accent-amber-bg)' : 'transparent',
                          color: 'var(--text-color)',
                          fontWeight: isActive ? 500 : 400,
                          opacity: isActive ? 1 : 0.85,
                        }}
                      >
                        {!isPseudoCode ? <JavaCodeLine line={line} /> : line}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TRACE TAB */}
        {activeTab === 'trace' && (
          <div className="flex-1 flex flex-col relative overflow-hidden h-full min-h-0">
            <div
              ref={traceScrollRef}
              onScroll={handleTraceScroll}
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 custom-scrollbar bg-[var(--panel-bg)] min-h-0"
            >
              {steps.length === 0 ? (
                <div className="text-[12px] text-[var(--muted-color)] p-4 text-center">
                  Run the visualizer to start logging steps.
                </div>
              ) : (
                steps.slice(0, cur + 1).map((step, idx) => {
                  const isActive = idx === cur;
                  let accentColor = 'var(--muted-color)';
                  let bgStyle = 'rgba(255, 255, 255, 0.03)';
                  let borderStyle = '1px solid var(--border-color)';

                  if (step.type === 'base') {
                    accentColor = 'var(--accent-blue)';
                    bgStyle = 'var(--accent-blue-bg)';
                  } else if (step.type === 'fill') {
                    accentColor = 'var(--accent-indigo)';
                    bgStyle = 'var(--accent-indigo-bg)';
                  } else if (step.type === 'backtrack') {
                    accentColor = 'var(--accent-amber)';
                    bgStyle = 'var(--accent-amber-bg)';
                  } else if (step.type === 'done') {
                    accentColor = 'var(--accent-teal)';
                    bgStyle = 'var(--accent-teal-bg)';
                  }

                  if (isActive) {
                    borderStyle = `1px solid ${accentColor}`;
                  }

                  return (
                    <div
                      key={idx}
                      data-active={isActive}
                      style={{
                        background: bgStyle,
                        border: borderStyle,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        padding: '10px 12px 10px 14px',
                        transition: 'all 0.15s ease',
                        flexShrink: 0,
                      }}
                      className="text-xs font-mono select-none shrink-0"
                    >
                      {/* Perfectly rounded left accent bar */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '3.5px',
                          background: accentColor,
                        }}
                      />

                      <div className="flex justify-between items-center mb-1">
                        <span
                          style={{ color: 'var(--muted-color)' }}
                          className="text-[9px] font-bold uppercase tracking-wider"
                        >
                          Step {idx + 1} • {step.type}
                        </span>
                        {isActive && (
                          <span
                            style={{ color: accentColor }}
                            className="text-[9px] font-bold uppercase tracking-wider animate-pulse"
                          >
                            ● ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-color)] font-normal text-[11.5px] leading-snug">
                        {step.msg}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {showTracePill && (
              <button
                onClick={handleScrollToActiveTrace}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600/90 border border-blue-500 rounded-full px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-[0.06em] cursor-pointer z-10 shadow-lg hover:bg-blue-500 transition-colors"
              >
                ↓ Jump to current step
              </button>
            )}
          </div>
        )}

        {/* 3. STATS TAB */}
        {activeTab === 'stats' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0">
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1.5">
              DP Statistics
            </h3>

            {/* 2x2 Grid of Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-color)',
                    marginBottom: '6px',
                  }}
                >
                  Steps Taken
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--accent-blue)',
                  }}
                >
                  {cur + 1} / {totalSteps}
                </span>
              </div>

              <div
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-color)',
                    marginBottom: '6px',
                  }}
                >
                  Table Size
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--accent-blue)',
                  }}
                >
                  {isCoinChangeII
                    ? `${currentStep?.coinChangeIIAmount ?? coinChangeIIAmount}`
                    : isDeleteOp
                    ? isDone
                      ? (currentStep?.deleteOpLcsLength ?? (currentStep?.dpTable?.[(currentStep?.deleteOpS1 || deleteOpString1).length]?.[(currentStep?.deleteOpS2 || deleteOpString2).length] as number) ?? '—')
                      : '—'
                    : isEditDistance
                    ? `(${(currentStep?.editDistS1 || editDistString1).length + 1})×(${(currentStep?.editDistS2 || editDistString2).length + 1})`
                    : isTargetSum
                    ? currentStep?.type === 'short-circuit'
                      ? 'N/A'
                      : `(${(currentStep?.targetSumArr || targetSumArray).length + 1})×(${(currentStep?.derivedTarget ?? 0) + 1})`
                    : isPartition
                    ? currentStep?.type === 'odd-sum-exit'
                      ? 'N/A'
                      : `(${(currentStep?.partitionArr || partitionArray).length + 1})×(${(currentStep?.targetSum ?? 0) + 1})`
                    : isMinPathSum
                    ? `${currentStep?.gridRows || minPathRows || 3}×${currentStep?.gridCols || minPathCols || 3}`
                    : isUniquePaths
                    ? `${currentStep?.gridRows || uniquePathsRows || 4}×${currentStep?.gridCols || uniquePathsCols || 4}`
                    : isLis
                    ? `${(currentStep?.lisArr || lisArray || []).length} cells`
                    : isBuySellStocks
                    ? `${(currentStep?.stockPrices || stockPrices).length} days`
                    : isLps
                    ? `(${(currentStep?.lpsString || lpsString || '').length})×(${(currentStep?.lpsString || lpsString || '').length})`
                    : isLpsLcs
                    ? `(${(currentStep?.lpsString || lpsLcsString || '').length + 1})×(${(currentStep?.lpsString || lpsLcsString || '').length + 1})`
                    : isLcs
                    ? `(${(currentStep?.lcsStr1 || lcsStr1 || '').length + 1})×(${(currentStep?.lcsStr2 || lcsStr2 || '').length + 1})`
                    : isKnapsack
                    ? `(${n + 1})×(${knapsackCapacity + 1})`
                    : isMinCoins
                    ? `${minCoinsAmount + 1} cells`
                    : isCountSubsets
                    ? `(${n})×(${subsetTargetK + 1})`
                    : `${n + (isHouseRobber ? 0 : 1)} cells`}
                </span>
              </div>

              <div
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-color)',
                    marginBottom: '6px',
                  }}
                >
                  {isPartitionMaxSum ? 'MAX SUM' : isCoinChangeII ? 'COMBINATIONS FOUND' : isDeleteOp ? 'TOTAL DELETIONS' : isEditDistance ? 'STRING LENGTHS' : isTargetSum ? 'TOTAL SUM' : isPartition ? 'TOTAL SUM' : isMinPathSum ? 'TOTAL GRID COST' : isUniquePaths ? 'GRID SIZE' : isLis ? 'COMPARISONS MADE' : isBuySellStocks ? 'TOTAL DAYS' : isLps || isLpsLcs ? 'STRING LENGTH' : isLcs ? 'STRING LENGTHS' : isKnapsack ? 'Capacity' : isMinCoins ? 'Coin Types' : isCountSubsets ? 'Target Sum' : 'Base Cases'}
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--accent-teal)',
                  }}
                >
                  {isPartitionMaxSum ? (isDone ? finalAnswer : '—') : isCoinChangeII ? (isDone ? finalAnswer : '—') : isDeleteOp ? (isDone ? finalAnswer : '—') : isEditDistance ? `${(currentStep?.editDistS1 || editDistString1).length} × ${(currentStep?.editDistS2 || editDistString2).length}` : isTargetSum ? `${currentStep?.totalSum ?? targetSumArray.reduce((a, b) => a + b, 0)}` : isPartition ? `${currentStep?.totalSum ?? partitionArray.reduce((a, b) => a + b, 0)} (${(currentStep?.totalSum ?? partitionArray.reduce((a, b) => a + b, 0)) % 2 === 0 ? 'even' : 'odd'})` : isMinPathSum ? `${(currentStep?.costGrid || minPathCostGrid || []).flat().reduce((a, b) => a + (b || 0), 0)}` : isUniquePaths ? `${currentStep?.gridRows || uniquePathsRows || 4} × ${currentStep?.gridCols || uniquePathsCols || 4}` : isLis ? `${cur >= 0 ? steps.slice(0, cur + 1).filter((s) => s.type === 'candidate').length : 0}` : isBuySellStocks ? `${(currentStep?.stockPrices || stockPrices).length}` : isLps ? `${(currentStep?.lpsString || lpsString || '').length}` : isLpsLcs ? `${(currentStep?.lpsString || lpsLcsString || '').length}` : isLcs ? `${(currentStep?.lcsStr1 || lcsStr1 || '').length} × ${(currentStep?.lcsStr2 || lcsStr2 || '').length}` : isKnapsack ? `W = ${knapsackCapacity}` : isMinCoins ? minCoinsArray.length : isCountSubsets ? `K = ${subsetTargetK}` : '2'}
                </span>
              </div>

              <div
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-color)',
                    marginBottom: '6px',
                  }}
                >
                  {isPartitionMaxSum ? 'ARRAY SIZE' : isCoinChangeII ? 'COIN TYPES' : isDeleteOp ? 'STRING LENGTHS' : isEditDistance ? 'EDIT DISTANCE' : isTargetSum ? 'WAYS FOUND' : isPartition ? 'PARTITIONABLE' : isMinPathSum ? 'MIN PATH COST' : isUniquePaths ? 'TOTAL PATHS' : isLis ? 'LIS LENGTH' : isBuySellStocks ? 'MAX PROFIT' : isLps || isLpsLcs ? 'LPS LENGTH' : isLcs ? 'LCS LENGTH' : isKnapsack ? 'Max Value' : isMinCoins ? 'Min Coins' : isCountSubsets ? 'Subsets Found' : 'Fill Steps'}
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--accent-indigo)',
                  }}
                >
                  {isPartitionMaxSum
                    ? `n = ${(currentStep?.partitionArr || partitionMaxSumArr).length}`
                    : isCoinChangeII
                    ? `${(currentStep?.coinChangeIICoins || coinChangeIICoins).length}`
                    : isDeleteOp
                    ? `${(currentStep?.deleteOpS1 || deleteOpString1).length} × ${(currentStep?.deleteOpS2 || deleteOpString2).length}`
                    : isEditDistance
                    ? isDone
                      ? finalAnswer
                      : '—'
                    : isTargetSum
                    ? isDone
                      ? finalAnswer
                      : currentStep?.type === 'short-circuit'
                      ? 0
                      : '—'
                    : isPartition
                    ? isDone
                      ? finalAnswer
                        ? 'TRUE'
                        : 'FALSE'
                      : currentStep?.type === 'odd-sum-exit'
                      ? 'FALSE (odd sum)'
                      : '—'
                    : isMinPathSum
                    ? isDone
                      ? finalAnswer
                      : '—'
                    : isUniquePaths
                    ? isDone
                      ? finalAnswer
                      : '—'
                    : isLis
                    ? isDone
                      ? (currentStep?.lisMaxLenSoFar ?? 1)
                      : '—'
                    : isBuySellStocks
                    ? isDone
                      ? `$${currentStep?.stockMaxProfit ?? 0}`
                      : '—'
                    : isLps || isLpsLcs
                    ? isDone
                      ? finalAnswer
                      : '—'
                    : isLcs
                    ? isDone
                      ? finalAnswer
                      : '—'
                    : isKnapsack
                    ? isDone
                      ? finalAnswer
                      : '—'
                    : isMinCoins
                    ? isDone
                      ? finalAnswer === -1
                        ? 'Impossible (-1)'
                        : finalAnswer
                      : '—'
                    : isCountSubsets
                    ? isDone
                      ? finalAnswer
                      : '—'
                    : Math.max(0, n - (isHouseRobber ? 2 : 1))}
                </span>
              </div>

              {isPartitionMaxSum && (
                <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 14px' }}>
                  <span style={{ display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-color)', marginBottom: '6px' }}>
                    MAX PARTITION LENGTH (K)
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 700, color: 'var(--accent-amber)' }}>
                    k = {partitionMaxSumK}
                  </span>
                </div>
              )}

              {isCountSubsets && (
                <>
                  {/* ── Memoization-specific stat cards ─────────────────────── */}
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '10px',
                      marginTop: '2px',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--accent-indigo)',
                    }}
                  >
                    Memoization Stats
                  </div>

                  {/* Cells Computed */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                      }}
                    >
                      Cells Computed
                    </span>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--accent-blue)',
                      }}
                    >
                      {currentStep?.memoStats?.cellsComputed ?? 0}
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          color: 'var(--muted-color)',
                          marginLeft: '4px',
                        }}
                      >
                        / {n * (subsetTargetK + 1)}
                      </span>
                    </span>
                  </div>

                  {/* Memo Hits */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                      }}
                    >
                      ✦ Memo Hits
                    </span>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--accent-green)',
                      }}
                    >
                      {currentStep?.memoStats?.memoHits ?? 0}
                    </span>
                  </div>

                  {/* Subsets Found */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                      }}
                    >
                      Subsets Found
                    </span>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--accent-teal)',
                      }}
                    >
                      {isDone ? finalAnswer : '—'}
                    </span>
                  </div>

                  {/* Table Size */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                      }}
                    >
                      Table Size
                    </span>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--accent-amber)',
                      }}
                    >
                      {n}×{subsetTargetK + 1}
                    </span>
                  </div>
                </>
              )}

              {isEditDistance && (
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--muted-color)',
                      marginBottom: '6px',
                    }}
                  >
                    OPERATIONS USED
                  </span>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--cell-active-text)',
                    }}
                  >
                    {(() => {
                      const history = steps.slice(0, cur + 1);
                      const rep = history.filter((s) => s.winningOperation === 'replace').length;
                      const del = history.filter((s) => s.winningOperation === 'delete').length;
                      const ins = history.filter((s) => s.winningOperation === 'insert').length;
                      return `R:${rep}  D:${del}  I:${ins}`;
                    })()}
                  </span>
                </div>
              )}
            </div>

            {/* Answer badge on done */}
            {isDone && finalAnswer !== null && (
              <div
                style={{
                  padding: '14px 16px',
                  background: 'var(--accent-teal-bg)',
                  border: '1px solid var(--accent-teal-bg)',
                  borderRadius: '8px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-teal)',
                    marginBottom: '4px',
                  }}
                >
                  Final Answer
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--accent-teal)',
                  }}
                >
                  {isKnapsack
                    ? `dp[${n}][${knapsackCapacity}] = ${finalAnswer}`
                    : isMinCoins
                    ? `dp[${minCoinsAmount}] = ${finalAnswer === -1 ? '-1 (Impossible)' : finalAnswer}`
                    : isCountSubsets
                    ? `dp[${n - 1}][${subsetTargetK}] = ${finalAnswer}`
                    : isHouseRobber
                    ? `dp[${n - 1}] = $${finalAnswer}`
                    : `dp[${n}] = ${finalAnswer}`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. RECURRENCE FORMULA PANEL (Pinned at Bottom) */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '12px 16px',
          background: 'var(--panel-bg)',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        <div className="text-[10px] font-semibold tracking-[0.1em] text-[var(--muted-color)] uppercase mb-1.5">
          RECURRENCE FORMULA
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--cell-active-text)',
            marginBottom: '4px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {problem.recurrence}
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'var(--muted-color)',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {problem.baseCases}
        </div>

        {isDone && finalAnswer !== null && (
          <div
            style={{
              marginTop: '8px',
              padding: '6px 10px',
              background: 'var(--accent-green-bg)',
              border: '1px solid var(--accent-green-bg)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: 'var(--accent-green)',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
            className="flex items-center gap-1.5 font-semibold"
          >
            <span>
              {isKnapsack
                ? `dp[${n}][${knapsackCapacity}] = ${finalAnswer}`
                : isMinCoins
                ? `dp[${minCoinsAmount}] = ${finalAnswer === -1 ? '-1 (Impossible)' : finalAnswer}`
                : isCountSubsets
                ? `dp[${n - 1}][${subsetTargetK}] = ${finalAnswer} subset(s)`
                : isHouseRobber
                ? `dp[${n - 1}] = $${finalAnswer}${
                    currentStep?.robbedIndices
                      ? `. Robbed: [${currentStep.robbedIndices.join(', ')}]`
                      : ''
                  }`
                : `dp[${n}] = ${finalAnswer} ways`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
