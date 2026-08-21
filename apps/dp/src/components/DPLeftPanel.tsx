import { useState } from 'react';
import { useDPStore } from '../store';
import { DP_PROBLEMS, DP_CATEGORIES, CATEGORY_COLORS } from '../data/dpProblems';

export function DPLeftPanel({ onCollapse }: { onCollapse?: () => void }) {
  const {
    n,
    setN,
    houses,
    houseCount,
    setHouseCount,
    houseMaxValue,
    setHouseMaxValue,
    generateHouseValues,

    subsetElementCount,
    setSubsetElementCount,
    subsetMaxValue,
    setSubsetMaxValue,
    subsetTargetK,
    setSubsetTargetK,
    subsetArray,
    generateSubsetArray,

    minCoinsAmount,
    setMinCoinsAmount,
    minCoinsCoinCount,
    setMinCoinsCoinCount,
    minCoinsMaxValue,
    setMinCoinsMaxValue,
    minCoinsArray,
    generateMinCoinsArray,

    knapsackItemCount,
    setKnapsackItemCount,
    knapsackMaxWeight,
    setKnapsackMaxWeight,
    knapsackMaxValue,
    setKnapsackMaxValue,
    knapsackCapacity,
    setKnapsackCapacity,
    knapsackWeights,
    knapsackValues,
    generateKnapsackItems,

    lcsStringLength,
    lcsAlphabetSize,
    lcsString1,
    lcsString2,
    setLCSStringLength,
    setLCSAlphabetSize,
    generateLCSStrings,
    lcsStr1,
    setLcsStr1,
    lcsStr2,
    setLcsStr2,

    lpsStringLength,
    lpsAlphabetSize,
    lpsString,
    setLPSStringLength,
    setLPSAlphabetSize,
    generateLPSString,

    lpsLcsStringLength,
    lpsLcsAlphabetSize,
    lpsLcsString,
    setLpsLcsStringLength,
    setLpsLcsAlphabetSize,
    generateLpsLcsString,


    stockDayCount,
    stockMaxPrice,
    stockPrices,
    setStockDayCount,
    setStockMaxPrice,
    generateStockPrices,

    lisArraySize,
    lisMaxValue,
    lisArray,
    setLISArraySize,
    setLISMaxValue,
    generateLISArray,

    uniquePathsRows,
    uniquePathsCols,
    setUniquePathsRows,
    setUniquePathsCols,

    minPathRows,
    minPathCols,
    minPathMaxCost,
    setMinPathRows,
    setMinPathCols,
    setMinPathMaxCost,
    generateMinPathGrid,

    partitionElementCount,
    partitionMaxValue,
    partitionArray,
    setPartitionElementCount,
    setPartitionMaxValue,
    generatePartitionArray,

    targetSumElementCount,
    targetSumMaxValue,
    targetSumTarget,
    targetSumArray,
    setTargetSumElementCount,
    setTargetSumMaxValue,
    setTargetSumTarget,
    generateTargetSumArray,

    editDistStringLength,
    editDistAlphabetSize,
    editDistString1,
    editDistString2,
    setEditDistStringLength,
    setEditDistAlphabetSize,
    generateEditDistStrings,

    deleteOpStringLength,
    deleteOpAlphabetSize,
    deleteOpString1,
    deleteOpString2,
    setDeleteOpStringLength,
    setDeleteOpAlphabetSize,
    generateDeleteOpStrings,

    coinChangeIIAmount,
    coinChangeIICoinCount,
    coinChangeIIMaxValue,
    coinChangeIICoins,
    setCoinChangeIIAmount,
    setCoinChangeIICoinCount,
    setCoinChangeIIMaxValue,
    generateCoinChangeIICoins,

    partitionMaxSumSize,
    partitionMaxSumK,
    partitionMaxSumMaxValue,
    partitionMaxSumArr,
    setPartitionMaxSumSize,
    setPartitionMaxSumK,
    setPartitionMaxSumMaxValue,
    generatePartitionMaxSumArray,

    run,
    problem,
    selectedProblemId,
    setSelectedProblemId,
  } = useDPStore();

  const [activeTab, setActiveTab] = useState<'problems' | 'input'>('problems');
  const stairPresets = [5, 8, 10];

  const isHouseRobber = selectedProblemId === 'house-robber';
  const isCountSubsets = selectedProblemId === 'count-subsets-sum';
  const isMinCoins = selectedProblemId === 'minimum-coins';
  const isKnapsack = selectedProblemId === 'knapsack';
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
  const maxPossibleSum = subsetArray.reduce((a, b) => a + b, 0);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden font-sans">
      {/* 1. TOP ROW — "← DP HOME" + Collapse Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-color)',
          height: '48px',
        }}
        className="shrink-0"
      >
        <a
          href="/"
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--muted-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          className="hover:text-[var(--text-color)]"
        >
          ← DP HOME
        </a>

        {onCollapse && (
          <button
            onClick={onCollapse}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--input-bg)',
              color: 'var(--muted-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            className="hover:border-[var(--border-hover)] hover:text-[var(--text-color)]"
            title="Collapse panel"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. PROBLEMS / INPUT TAB SWITCHER */}
      <div
        style={{
          display: 'flex',
          background: 'var(--input-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '3px',
          margin: '12px 16px',
          position: 'relative',
          height: '34px',
        }}
        className="shrink-0"
      >
        <div
          style={{
            position: 'absolute',
            top: '3px',
            bottom: '3px',
            width: 'calc(50% - 4px)',
            borderRadius: '6px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            left: activeTab === 'problems' ? '3px' : 'calc(50% + 1px)',
            background: activeTab === 'problems' ? 'var(--accent-blue)' : 'var(--accent-indigo-dim)',
          }}
        />
        <button
          onClick={() => setActiveTab('problems')}
          style={{
            flex: 1,
            zIndex: 10,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: activeTab === 'problems' ? 'white' : 'var(--muted-color)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
        >
          Problems
        </button>
        <button
          onClick={() => setActiveTab('input')}
          style={{
            flex: 1,
            zIndex: 10,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: activeTab === 'input' ? 'white' : 'var(--muted-color)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
        >
          Input
        </button>
      </div>

      {/* 3. TAB CONTENT AREA */}
      <div
        style={{
          padding: '0 16px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="flex-grow overflow-y-auto no-scrollbar relative min-h-0"
      >
        {activeTab === 'problems' ? (
          <div className="space-y-1 animate-slideInLeft">
            {DP_CATEGORIES.map((category) => {
              const problems = DP_PROBLEMS.filter((p) => p.category === category);
              return (
                <div key={category}>
                  {/* Category header */}
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--muted-color)',
                      padding: '8px 4px 4px 4px',
                      borderBottom: '1px solid var(--border-color)',
                      marginBottom: '4px',
                    }}
                  >
                    {category}
                  </div>

                  {problems.map((prob) => {
                    const isSelected = selectedProblemId === prob.id;
                    const isAvailable = prob.status === 'available';

                    return (
                      <ProblemCard
                        key={prob.id}
                        problem={prob}
                        isSelected={isSelected}
                        isAvailable={isAvailable}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedProblemId(prob.id);
                            setActiveTab('input');
                          }
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between animate-slideInRight min-h-full">
            <div>
              {/* INPUT SECTION TITLE */}
              <h2
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-color)',
                  marginBottom: '12px',
                  marginTop: '4px',
                }}
              >
                {isCoinChangeII
                  ? 'Input Coins & Target Amount'
                  : isDeleteOp || isEditDistance
                  ? 'Input Strings (S1 & S2)'
                  : isTargetSum
                  ? 'Input Array & Target T'
                  : isMinPathSum
                  ? 'Input Cost Grid'
                  : isUniquePaths
                  ? 'Input Grid Dimensions'
                  : isLis
                  ? 'Input Array'
                  : isBuySellStocks
                  ? 'Input Stock Prices'
                  : isLps || isLpsLcs
                  ? 'Input String (s)'
                  : isLcs
                  ? 'Input Strings (S1 & S2)'
                  : isKnapsack
                  ? 'Knapsack Items & Capacity'
                  : isMinCoins
                  ? 'Target Amount & Coins'
                  : isCountSubsets
                  ? 'Subset Array & Target K'
                  : isHouseRobber
                  ? 'House Values'
                  : 'Staircase Height'}
              </h2>

              {selectedProblemId === 'climbing-stairs' ? (
                /* Climbing Stairs Input */
                <>
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      STAIRS (N)
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {n}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={15}
                      value={n}
                      onChange={(e) => setN(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>n=2</span>
                      <span>n=15</span>
                    </div>
                  </div>

                  {/* PRESETS SECTION */}
                  <div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      PRESETS
                    </span>

                    <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                      {stairPresets.map((val) => {
                        const isActive = n === val;
                        return (
                          <button
                            key={val}
                            onClick={() => setN(val)}
                            style={{
                              flex: 1,
                              padding: '8px 0',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: isActive ? 700 : 600,
                              fontFamily: 'Inter, sans-serif',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              textAlign: 'center',
                              border: '1px solid',
                              ...(isActive
                                ? {
                                    background: 'var(--accent-blue-bg)',
                                    borderColor: 'var(--accent-blue)',
                                    color: 'var(--cell-filled-text)',
                                  }
                                : {
                                    background: 'var(--input-bg)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--muted-color)',
                                  }),
                            }}
                            className={!isActive ? 'hover:border-[var(--border-hover)] hover:text-[var(--text-color)]' : ''}
                          >
                            n={val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : isHouseRobber ? (
                /* House Robber Input System */
                <>
                  {/* 1. NUMBER OF HOUSES SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      NUMBER OF HOUSES
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {houseCount}
                    </div>

                    <input
                      type="range"
                      min={4}
                      max={10}
                      step={1}
                      value={houseCount}
                      onChange={(e) => setHouseCount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>n=4</span>
                      <span>n=10</span>
                    </div>
                  </div>

                  {/* 2. MAX HOUSE VALUE SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX HOUSE VALUE
                    </span>

                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {houseMaxValue}
                    </div>

                    <input
                      type="range"
                      min={10}
                      max={99}
                      step={5}
                      value={houseMaxValue}
                      onChange={(e) => setHouseMaxValue(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>10</span>
                      <span>99</span>
                    </div>
                  </div>

                  {/* 3. REGENERATE BUTTON */}
                  <button
                    onClick={generateHouseValues}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      marginBottom: '16px',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Houses</span>
                  </button>

                  {/* 4. CURRENT ARRAY PREVIEW */}
                  <div style={{ marginBottom: '16px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                      }}
                    >
                      CURRENT HOUSES
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        overflowX: 'auto',
                        padding: '6px',
                        background: 'rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                      }}
                      className="no-scrollbar"
                    >
                      {houses.map((val, idx) => (
                        <div
                          key={idx}
                          style={{
                            flexShrink: 0,
                            width: '34px',
                            height: '34px',
                            borderRadius: '6px',
                            border: '1px solid var(--accent-blue)',
                            background: 'var(--accent-blue-bg)',
                            color: 'var(--cell-filled-text)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ${val}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : isCountSubsets ? (
                /* Count Subsets Sum Input System */
                <>
                  {/* 1. NUMBER OF ELEMENTS SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      NUMBER OF ELEMENTS
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {subsetElementCount}
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={6}
                      step={1}
                      value={subsetElementCount}
                      onChange={(e) => setSubsetElementCount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>n=3</span>
                      <span>n=6</span>
                    </div>
                  </div>

                  {/* 2. MAX ELEMENT VALUE SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX ELEMENT VALUE
                    </span>

                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {subsetMaxValue}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={15}
                      step={1}
                      value={subsetMaxValue}
                      onChange={(e) => setSubsetMaxValue(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>2</span>
                      <span>15</span>
                    </div>
                  </div>

                  {/* 3. TARGET SUM (K) SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      TARGET SUM (K)
                    </span>

                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {subsetTargetK}
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={subsetTargetK}
                      onChange={(e) => setSubsetTargetK(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>K=1</span>
                      <span>K=20</span>
                    </div>

                    {subsetTargetK > maxPossibleSum && (
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--accent-amber)',
                          marginTop: '6px',
                          fontWeight: 500,
                        }}
                      >
                        ⚠ K exceeds max possible sum ({maxPossibleSum})
                      </div>
                    )}
                  </div>

                  {/* 4. REGENERATE BUTTON */}
                  <button
                    onClick={generateSubsetArray}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      marginBottom: '16px',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Array</span>
                  </button>

                  {/* 5. CURRENT ARRAY PREVIEW */}
                  <div style={{ marginBottom: '16px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                      }}
                    >
                      CURRENT ARRAY
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        overflowX: 'auto',
                        padding: '6px',
                        background: 'rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                      }}
                      className="no-scrollbar"
                    >
                      {subsetArray.map((val, idx) => (
                        <div
                          key={idx}
                          style={{
                            flexShrink: 0,
                            width: '34px',
                            height: '34px',
                            borderRadius: '6px',
                            border: '1px solid var(--accent-blue)',
                            background: 'var(--accent-blue-bg)',
                            color: 'var(--cell-filled-text)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : isMinCoins ? (
                /* Minimum Coins Input System */
                <>
                  {/* 1. TARGET AMOUNT SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      TARGET AMOUNT
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {minCoinsAmount}
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={25}
                      step={1}
                      value={minCoinsAmount}
                      onChange={(e) => setMinCoinsAmount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>5</span>
                      <span>25</span>
                    </div>
                  </div>

                  {/* 2. NUMBER OF COIN TYPES SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      NUMBER OF COIN TYPES
                    </span>

                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {minCoinsCoinCount}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={1}
                      value={minCoinsCoinCount}
                      onChange={(e) => setMinCoinsCoinCount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>2</span>
                      <span>5</span>
                    </div>
                  </div>

                  {/* 3. MAX COIN VALUE SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX COIN VALUE
                    </span>

                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {minCoinsMaxValue}
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={20}
                      step={1}
                      value={minCoinsMaxValue}
                      onChange={(e) => setMinCoinsMaxValue(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>5</span>
                      <span>20</span>
                    </div>
                  </div>

                  {/* 4. REGENERATE BUTTON */}
                  <button
                    onClick={generateMinCoinsArray}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      marginBottom: '16px',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Coins</span>
                  </button>

                  {/* 5. CURRENT COINS PREVIEW */}
                  <div style={{ marginBottom: '16px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                      }}
                    >
                      CURRENT COINS
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        overflowX: 'auto',
                        padding: '6px',
                        background: 'rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                      }}
                      className="no-scrollbar"
                    >
                      {minCoinsArray.map((val, idx) => (
                        <div
                          key={idx}
                          style={{
                            flexShrink: 0,
                            width: '34px',
                            height: '34px',
                            borderRadius: '6px',
                            border: '1px solid var(--accent-blue)',
                            background: 'var(--accent-blue-bg)',
                            color: 'var(--cell-filled-text)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* 0/1 Knapsack Input System */
                <>
                  {/* 1. NUMBER OF ITEMS SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      NUMBER OF ITEMS
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {knapsackItemCount}
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={6}
                      step={1}
                      value={knapsackItemCount}
                      onChange={(e) => setKnapsackItemCount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>n=3</span>
                      <span>n=6</span>
                    </div>
                  </div>

                  {/* 2. MAX ITEM WEIGHT SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX ITEM WEIGHT
                    </span>

                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {knapsackMaxWeight}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={10}
                      step={1}
                      value={knapsackMaxWeight}
                      onChange={(e) => setKnapsackMaxWeight(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>2</span>
                      <span>10</span>
                    </div>
                  </div>

                  {/* 3. MAX ITEM VALUE SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX ITEM VALUE
                    </span>

                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {knapsackMaxValue}
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={knapsackMaxValue}
                      onChange={(e) => setKnapsackMaxValue(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>5</span>
                      <span>30</span>
                    </div>
                  </div>

                  {/* 4. KNAPSACK CAPACITY SLIDER */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      KNAPSACK CAPACITY (W)
                    </span>

                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {knapsackCapacity}
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={20}
                      step={1}
                      value={knapsackCapacity}
                      onChange={(e) => setKnapsackCapacity(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        color: 'var(--muted-color)',
                        opacity: 0.7,
                      }}
                    >
                      <span>W=5</span>
                      <span>W=20</span>
                    </div>
                  </div>

                  {/* 5. REGENERATE BUTTON */}
                  <button
                    onClick={generateKnapsackItems}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      marginBottom: '16px',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Items</span>
                  </button>

                  {/* 6. CURRENT ITEMS PREVIEW */}
                  <div style={{ marginBottom: '16px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                      }}
                    >
                      CURRENT ITEMS
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        overflowX: 'auto',
                        padding: '6px',
                        background: 'rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                      }}
                      className="no-scrollbar"
                    >
                      {knapsackWeights.map((wt, idx) => (
                        <div
                          key={idx}
                          style={{
                            flexShrink: 0,
                            minWidth: '52px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--accent-blue)',
                            background: 'var(--accent-blue-bg)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '9px',
                              color: 'var(--muted-color)',
                              fontFamily: 'JetBrains Mono, monospace',
                            }}
                          >
                            w:{wt}
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: 'var(--cell-filled-text)',
                              fontFamily: 'JetBrains Mono, monospace',
                            }}
                          >
                            v:{knapsackValues[idx]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'lcs' && (
                <>
                  {/* CARD 1 — STRING LENGTH */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      STRING LENGTH
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {lcsStringLength}
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={8}
                      step={1}
                      value={lcsStringLength}
                      onChange={(e) => setLCSStringLength(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — ALPHABET SIZE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      ALPHABET SIZE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {lcsAlphabetSize}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={1}
                      value={lcsAlphabetSize}
                      onChange={(e) => setLCSAlphabetSize(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateLCSStrings}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Strings</span>
                  </button>

                  {/* STRING PREVIEW DISPLAY — CHARACTER CHIPS */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    {/* STRING 1 */}
                    <div style={{ marginBottom: '12px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--muted-color)',
                          marginBottom: '6px',
                          display: 'block',
                        }}
                      >
                        STRING 1 (s1)
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(lcsString1 || lcsStr1).split('').map((ch, idx) => (
                          <div
                            key={`s1-chip-${idx}`}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              border: '1px solid var(--accent-blue)',
                              background: 'var(--accent-blue-bg)',
                              color: 'var(--cell-filled-text)',
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '13px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {ch}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* STRING 2 */}
                    <div>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--muted-color)',
                          marginBottom: '6px',
                          display: 'block',
                        }}
                      >
                        STRING 2 (s2)
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(lcsString2 || lcsStr2).split('').map((ch, idx) => (
                          <div
                            key={`s2-chip-${idx}`}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              border: '1px solid var(--accent-blue)',
                              background: 'var(--accent-blue-bg)',
                              color: 'var(--cell-filled-text)',
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '13px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {ch}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'lps-interval-dp' && (
                <>
                  {/* CARD 1 — STRING LENGTH */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      STRING LENGTH
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {lpsStringLength}
                    </div>

                    <input
                      type="range"
                      min={4}
                      max={8}
                      step={1}
                      value={lpsStringLength}
                      onChange={(e) => setLPSStringLength(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — ALPHABET SIZE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      ALPHABET SIZE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {lpsAlphabetSize}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={4}
                      step={1}
                      value={lpsAlphabetSize}
                      onChange={(e) => setLPSAlphabetSize(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateLPSString}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate String</span>
                  </button>

                  {/* STRING PREVIEW DISPLAY — SINGLE ROW OF CHARACTER CHIPS */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      STRING (s)
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(lpsString || 'ABCBAB').split('').map((ch, idx) => (
                        <div
                          key={`lps-chip-${idx}`}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid var(--accent-blue)',
                            background: 'var(--accent-blue-bg)',
                            color: 'var(--cell-filled-text)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '13px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {ch}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'lps-via-lcs' && (
                <>
                  {/* CARD 1 — STRING LENGTH */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      STRING LENGTH
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {lpsLcsStringLength}
                    </div>

                    <input
                      type="range"
                      min={4}
                      max={8}
                      step={1}
                      value={lpsLcsStringLength}
                      onChange={(e) => setLpsLcsStringLength(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — ALPHABET SIZE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      ALPHABET SIZE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {lpsLcsAlphabetSize}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={4}
                      step={1}
                      value={lpsLcsAlphabetSize}
                      onChange={(e) => setLpsLcsAlphabetSize(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateLpsLcsString}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate String</span>
                  </button>

                  {/* STRING PREVIEW DISPLAY — TWO ROWS (ORIGINAL & REVERSED) */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--muted-color)',
                          marginBottom: '6px',
                          display: 'block',
                        }}
                      >
                        ORIGINAL (s)
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(lpsLcsString || 'ABCBAB').split('').map((ch, idx) => (
                          <div
                            key={`lpslcs-chip-${idx}`}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              border: '1px solid var(--accent-blue)',
                              background: 'var(--accent-blue-bg)',
                              color: 'var(--cell-filled-text)',
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '13px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {ch}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--muted-color)',
                          marginBottom: '6px',
                          display: 'block',
                        }}
                      >
                        REVERSED (reversed)
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(lpsLcsString || 'ABCBAB').split('').reverse().map((ch, idx) => (
                          <div
                            key={`lpslcs-rev-chip-${idx}`}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              border: '1px solid var(--accent-teal)',
                              background: 'var(--accent-teal-bg, rgba(20,184,166,0.12))',
                              color: 'var(--accent-teal)',
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '13px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {ch}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'buy-sell-stocks' && (
                <>
                  {/* CARD 1 — NUMBER OF DAYS */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      NUMBER OF DAYS
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {stockDayCount}
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={12}
                      step={1}
                      value={stockDayCount}
                      onChange={(e) => setStockDayCount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — MAX STOCK PRICE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX STOCK PRICE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      ${stockMaxPrice}
                    </div>

                    <input
                      type="range"
                      min={20}
                      max={200}
                      step={10}
                      value={stockMaxPrice}
                      onChange={(e) => setStockMaxPrice(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateStockPrices}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Prices</span>
                  </button>

                  {/* CURRENT PRICES PREVIEW — CHIP ROW SHOWING PRICES WITH DAY INDEX */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      STOCK PRICES
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {stockPrices.map((price, idx) => (
                        <div
                          key={`stock-chip-${idx}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <div
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--accent-blue)',
                              background: 'var(--accent-blue-bg)',
                              color: 'var(--cell-filled-text)',
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            ${price}
                          </div>
                          <span
                            style={{
                              fontSize: '9px',
                              color: 'var(--muted-color)',
                              fontFamily: 'JetBrains Mono, monospace',
                            }}
                          >
                            Day {idx}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'lis' && (
                <>
                  {/* CARD 1 — ARRAY SIZE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      ARRAY SIZE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {lisArraySize}
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={10}
                      step={1}
                      value={lisArraySize}
                      onChange={(e) => setLISArraySize(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — MAX VALUE RANGE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX VALUE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {lisMaxValue}
                    </div>

                    <input
                      type="range"
                      min={10}
                      max={50}
                      step={5}
                      value={lisMaxValue}
                      onChange={(e) => setLISMaxValue(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateLISArray}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Array</span>
                  </button>

                  {/* CURRENT ARRAY PREVIEW */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      ARRAY (arr)
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {lisArray.map((val, idx) => (
                        <div
                          key={`lis-chip-${idx}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <div
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--accent-blue)',
                              background: 'var(--accent-blue-bg)',
                              color: 'var(--cell-filled-text)',
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            {val}
                          </div>
                          <span
                            style={{
                              fontSize: '9px',
                              color: 'var(--muted-color)',
                              fontFamily: 'JetBrains Mono, monospace',
                            }}
                          >
                            [{idx}]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'unique-paths' && (
                <>
                  {/* CARD 1 — GRID ROWS (m) */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      GRID ROWS (m)
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {uniquePathsRows}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={7}
                      step={1}
                      value={uniquePathsRows}
                      onChange={(e) => setUniquePathsRows(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — GRID COLUMNS (n) */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      GRID COLUMNS (n)
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {uniquePathsCols}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={7}
                      step={1}
                      value={uniquePathsCols}
                      onChange={(e) => setUniquePathsCols(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </>
              )}

              {selectedProblemId === 'minimum-path-sum' && (
                <>
                  {/* CARD 1 — GRID ROWS (m) */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      GRID ROWS (m)
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {minPathRows}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={1}
                      value={minPathRows}
                      onChange={(e) => setMinPathRows(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — GRID COLUMNS (n) */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      GRID COLUMNS (n)
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {minPathCols}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={1}
                      value={minPathCols}
                      onChange={(e) => setMinPathCols(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 3 — MAX CELL COST */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX CELL COST
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {minPathMaxCost}
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={minPathMaxCost}
                      onChange={(e) => setMinPathMaxCost(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateMinPathGrid}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Grid Costs</span>
                  </button>
                </>
              )}

              {selectedProblemId === 'partition-equal-subset' && (
                <>
                  {/* CARD 1 — NUMBER OF ELEMENTS */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      NUMBER OF ELEMENTS
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {partitionElementCount}
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={6}
                      step={1}
                      value={partitionElementCount}
                      onChange={(e) => setPartitionElementCount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — MAX ELEMENT VALUE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX ELEMENT VALUE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {partitionMaxValue}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={1}
                      value={partitionMaxValue}
                      onChange={(e) => setPartitionMaxValue(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generatePartitionArray}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Array</span>
                  </button>

                  {/* CURRENT ARRAY PREVIEW */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      CURRENT ARRAY
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '10px',
                      }}
                    >
                      {partitionArray.map((val, idx) => (
                        <div
                          key={`partition-chip-${idx}`}
                          style={{
                            padding: '4px 10px',
                            background: 'var(--cell-active-bg)',
                            border: '1px solid var(--accent-indigo-dim)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'var(--cell-active-text)',
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        >
                          [{idx}]: {val}
                        </div>
                      ))}
                    </div>
                    {(() => {
                      const sum = partitionArray.reduce((a, b) => a + b, 0);
                      const isEven = sum % 2 === 0;
                      return (
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            display: 'inline-block',
                            background: isEven ? 'var(--accent-teal-bg)' : 'var(--accent-amber-bg)',
                            border: isEven ? '1px solid var(--accent-teal)' : '1px solid var(--accent-amber)',
                            color: isEven ? 'var(--accent-teal)' : 'var(--accent-amber)',
                          }}
                        >
                          Sum: {sum} ({isEven ? 'even' : 'odd'})
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}

              {selectedProblemId === 'target-sum' && (
                <>
                  {/* CARD 1 — NUMBER OF ELEMENTS */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      NUMBER OF ELEMENTS
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {targetSumElementCount}
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={6}
                      step={1}
                      value={targetSumElementCount}
                      onChange={(e) => setTargetSumElementCount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — MAX ELEMENT VALUE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX ELEMENT VALUE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {targetSumMaxValue}
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={1}
                      value={targetSumMaxValue}
                      onChange={(e) => setTargetSumMaxValue(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 3 — TARGET SUM (T) */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      TARGET SUM (T)
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {targetSumTarget}
                    </div>

                    <input
                      type="range"
                      min={-15}
                      max={15}
                      step={1}
                      value={targetSumTarget}
                      onChange={(e) => setTargetSumTarget(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateTargetSumArray}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Array</span>
                  </button>

                  {/* CURRENT ARRAY PREVIEW */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      CURRENT ARRAY
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '10px',
                      }}
                    >
                      {targetSumArray.map((val, idx) => (
                        <div
                          key={`targetsum-chip-${idx}`}
                          style={{
                            padding: '4px 10px',
                            background: 'var(--cell-active-bg)',
                            border: '1px solid var(--accent-indigo-dim)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'var(--cell-active-text)',
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        >
                          [{idx}]: {val}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--muted-color)',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      Sum: {targetSumArray.reduce((a, b) => a + b, 0)}
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'edit-distance' && (
                <>
                  {/* CARD 1 — STRING LENGTH */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      STRING LENGTH
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {editDistStringLength}
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={7}
                      step={1}
                      value={editDistStringLength}
                      onChange={(e) => setEditDistStringLength(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — ALPHABET SIZE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      ALPHABET SIZE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {editDistAlphabetSize}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={1}
                      value={editDistAlphabetSize}
                      onChange={(e) => setEditDistAlphabetSize(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateEditDistStrings}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Strings</span>
                  </button>

                  {/* CURRENT STRINGS PREVIEW */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      CURRENT STRINGS
                    </span>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--accent-blue)', fontWeight: 600 }}>STRING 1 (s1): </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>
                        "{editDistString1}"
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--accent-indigo)', fontWeight: 600 }}>STRING 2 (s2): </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>
                        "{editDistString2}"
                      </span>
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'delete-operation' && (
                <>
                  {/* CARD 1 — STRING LENGTH */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      STRING LENGTH
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {deleteOpStringLength}
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={8}
                      step={1}
                      value={deleteOpStringLength}
                      onChange={(e) => setDeleteOpStringLength(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — ALPHABET SIZE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      ALPHABET SIZE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {deleteOpAlphabetSize}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={1}
                      value={deleteOpAlphabetSize}
                      onChange={(e) => setDeleteOpAlphabetSize(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateDeleteOpStrings}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Strings</span>
                  </button>

                  {/* CURRENT STRINGS PREVIEW */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      CURRENT STRINGS
                    </span>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--accent-blue)', fontWeight: 600 }}>STRING 1 (s1): </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>
                        "{deleteOpString1}"
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--accent-indigo)', fontWeight: 600 }}>STRING 2 (s2): </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>
                        "{deleteOpString2}"
                      </span>
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'coin-change-ii' && (
                <>
                  {/* CARD 1 — TARGET AMOUNT */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      TARGET AMOUNT
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {coinChangeIIAmount}
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={15}
                      step={1}
                      value={coinChangeIIAmount}
                      onChange={(e) => setCoinChangeIIAmount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 2 — NUMBER OF COIN TYPES */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      NUMBER OF COIN TYPES
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {coinChangeIICoinCount}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={4}
                      step={1}
                      value={coinChangeIICoinCount}
                      onChange={(e) => setCoinChangeIICoinCount(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* CARD 3 — MAX COIN VALUE */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      MAX COIN VALUE
                    </span>

                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-color)',
                        lineHeight: 1,
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {coinChangeIIMaxValue}
                    </div>

                    <input
                      type="range"
                      min={2}
                      max={8}
                      step={1}
                      value={coinChangeIIMaxValue}
                      onChange={(e) => setCoinChangeIIMaxValue(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button
                    onClick={generateCoinChangeIICoins}
                    style={{
                      width: '100%',
                      padding: '9px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Coins</span>
                  </button>

                  {/* CURRENT COINS PREVIEW */}
                  <div
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      AVAILABLE COIN DENOMINATIONS
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {coinChangeIICoins.map((coin, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px',
                            background: 'var(--accent-blue-bg)',
                            border: '1px solid var(--accent-blue)',
                            borderRadius: '6px',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'var(--accent-blue)',
                          }}
                        >
                          {coin}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedProblemId === 'partition-array-max-sum' && (
                <>
                  {/* CARD 1 — ARRAY SIZE */}
                  <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-color)', marginBottom: '6px', display: 'block' }}>
                      ARRAY SIZE
                    </span>
                    <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-color)', lineHeight: 1, marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
                      {partitionMaxSumSize}
                    </div>
                    <input type="range" min={5} max={10} step={1} value={partitionMaxSumSize}
                      onChange={(e) => setPartitionMaxSumSize(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
                  </div>

                  {/* CARD 2 — MAX PARTITION LENGTH (K) */}
                  <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-color)', marginBottom: '6px', display: 'block' }}>
                      MAX PARTITION LENGTH (K)
                    </span>
                    <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-color)', lineHeight: 1, marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
                      {partitionMaxSumK}
                    </div>
                    <input type="range" min={2} max={4} step={1} value={partitionMaxSumK}
                      onChange={(e) => setPartitionMaxSumK(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
                  </div>

                  {/* CARD 3 — MAX ARRAY VALUE */}
                  <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-color)', marginBottom: '6px', display: 'block' }}>
                      MAX ARRAY VALUE
                    </span>
                    <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-color)', lineHeight: 1, marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
                      {partitionMaxSumMaxValue}
                    </div>
                    <input type="range" min={5} max={20} step={1} value={partitionMaxSumMaxValue}
                      onChange={(e) => setPartitionMaxSumMaxValue(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
                  </div>

                  {/* REGENERATE BUTTON */}
                  <button onClick={generatePartitionMaxSumArray}
                    style={{ width: '100%', padding: '9px 0', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-color)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px', transition: 'all 0.15s ease' }}
                    className="hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <span>🔀</span>
                    <span>Regenerate Array</span>
                  </button>

                  {/* CURRENT ARRAY PREVIEW */}
                  <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-color)', marginBottom: '8px', display: 'block' }}>
                      CURRENT ARRAY
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {partitionMaxSumArr.map((val, idx) => (
                        <span key={idx} style={{ padding: '4px 10px', background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber)', borderRadius: '6px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: 'var(--accent-amber)' }}>
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* RUN VISUALIZER BUTTON */}
              <button
                onClick={run}
                style={{
                  width: '100%',
                  padding: '11px 0',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent-blue)',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '20px',
                  transition: 'background 0.15s ease',
                  boxShadow: '0 1px 3px var(--accent-blue-bg)',
                }}
                className="hover:bg-[var(--accent-blue)]"
              >
                <span style={{ fontSize: '11px' }}>▶</span>
                <span>Run Visualizer</span>
              </button>
            </div>

            {/* COMPLEXITY SECTION */}
            <div
              style={{
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-color)',
                  marginBottom: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                }}
              >
                COMPLEXITY
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                }}
              >
                <span style={{ width: '14px', textAlign: 'center', flexShrink: 0, color: 'var(--accent-blue)' }}>
                  ⚡
                </span>
                <span style={{ color: 'var(--muted-color)', fontWeight: 400 }}>Time:</span>
                <strong
                  style={{
                    color: 'var(--text-color)',
                    fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace',
                    marginLeft: '4px',
                  }}
                >
                  {problem.timeComplexity}
                </strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                }}
              >
                <span style={{ width: '14px', textAlign: 'center', flexShrink: 0, color: 'var(--accent-blue)' }}>
                  ◯
                </span>
                <span style={{ color: 'var(--muted-color)', fontWeight: 400 }}>Space:</span>
                <strong
                  style={{
                    color: 'var(--text-color)',
                    fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace',
                    marginLeft: '4px',
                  }}
                >
                  {problem.spaceComplexity}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Problem Card sub-component ─────────────────────────────────── */

function ProblemCard({
  problem,
  isSelected,
  isAvailable,
  onClick,
}: {
  problem: (typeof DP_PROBLEMS)[number];
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={isAvailable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 10px',
        borderRadius: '8px',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        border: '1px solid',
        marginBottom: '3px',
        transition: 'all 0.15s ease',
        opacity: isAvailable ? 1 : 0.4,
        background: isSelected ? 'var(--accent-blue-bg)' : 'transparent',
        borderColor: isSelected
          ? 'var(--accent-blue)'
          : hovered && isAvailable
          ? 'var(--border-color)'
          : 'transparent',
      }}
    >
      {/* Active dot */}
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isSelected ? 'var(--accent-blue)' : 'var(--border-color)',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: isSelected ? 600 : 400,
            color: isSelected ? 'var(--text-color)' : 'var(--muted-color)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {problem.name}
          {!isAvailable && (
            <span
              style={{
                fontSize: '8px',
                padding: '1px 5px',
                borderRadius: '6px',
                background: 'var(--cell-unfilled-border)',
                border: '1px solid var(--border-color)',
                color: 'var(--muted-color)',
              }}
            >
              SOON
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--muted-color)',
            opacity: 0.7,
            marginTop: '1px',
          }}
        >
          {problem.timeComplexity}
        </div>
      </div>

      {/* Category badge */}
      <span
        style={{
          fontSize: '8px',
          padding: '1px 6px',
          borderRadius: '6px',
          border: '1px solid',
          flexShrink: 0,
        }}
        className={CATEGORY_COLORS[problem.category]}
      >
        {problem.badge}
      </span>
    </div>
  );
}
