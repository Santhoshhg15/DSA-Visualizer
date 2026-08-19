import React, { useState } from 'react';
import { useSWStore } from '../store';
import { SW_PROBLEMS, SW_CATEGORIES } from '../data/swProblems';
import { Play, Zap, Database, Shuffle, ChevronRight, CheckCircle2, PanelLeftClose } from 'lucide-react';

interface SWLeftPanelProps {
  onCollapse: () => void;
}

// Reusable slider card component
const SliderCard: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  accentVar: string;
  onChange: (v: number) => void;
  hint?: React.ReactNode;
}> = ({ label, value, min, max, step, accentVar, onChange, hint }) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div
      style={{
        background: 'var(--input-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '14px 16px',
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'var(--muted-color)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '20px',
            fontWeight: 700,
            color: `var(${accentVar})`,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>

      {/* Custom track visual */}
      <div
        style={{
          position: 'relative',
          height: '4px',
          background: 'var(--border-color)',
          borderRadius: '9999px',
          marginBottom: '6px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            background: `var(${accentVar})`,
            borderRadius: '9999px',
            transition: 'width 0.1s ease',
          }}
        />
      </div>

      {/* Native range */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{
          accentColor: `var(${accentVar})`,
          width: '100%',
          marginTop: '-16px',
          display: 'block',
          opacity: 0,
          cursor: 'pointer',
          height: '20px',
        }}
      />

      {/* Min/max ticks */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '9px',
          color: 'var(--muted-color)',
          marginTop: '-2px',
        }}
      >
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {hint && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '10px',
            color: 'var(--muted-color)',
            fontStyle: 'italic',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
};

export const SWLeftPanel: React.FC<SWLeftPanelProps> = ({ onCollapse }) => {
  const {
    selectedProblemId,
    setSelectedProblemId,
    problem,
    swArraySize,
    swWindowK,
    swMaxValue,
    swArray,
    setSWArraySize,
    setSWWindowK,
    setSWMaxValue,
    generateSWArray,
    fnArraySize,
    fnWindowK,
    fnValueRange,
    fnArray,
    setFNArraySize,
    setFNWindowK,
    setFNValueRange,
    generateFNArray,
    maxDequeArraySize,
    maxDequeWindowK,
    maxDequeMaxValue,
    maxDequeArray,
    setMaxDequeArraySize,
    setMaxDequeWindowK,
    setMaxDequeMaxValue,
    generateMaxDequeArray,
    anagramTextLength,
    anagramPatternLength,
    anagramAlphabetSize,
    anagramText,
    anagramPattern,
    setAnagramTextLength,
    setAnagramPatternLength,
    setAnagramAlphabetSize,
    generateAnagramInputs,
    lsNrStringLength,
    lsNrAlphabetSize,
    lsNrString,
    setLsNrStringLength,
    setLsNrAlphabetSize,
    generateLsNrString,
    smArraySize,
    smMaxValue,
    smTarget,
    smArray,
    setSmArraySize,
    setSmMaxValue,
    setSmTarget,
    generateSmArray,
    kdStringLength,
    kdAlphabetSize,
    kdK,
    kdString,
    setKdStringLength,
    setKdAlphabetSize,
    setKdK,
    generateKdString,
    kadaneArraySize,
    kadaneValueRange,
    kadaneArray,
    setKadaneArraySize,
    setKadaneValueRange,
    generateKadaneArray,
    reset,
    regenerateTrace,
  } = useSWStore();

  const [activeTab, setActiveTab] = useState<'problems' | 'input'>('problems');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        userSelect: 'none',
      }}
    >
      {/* ── 1. TAB SWITCHER + COLLAPSE BUTTON ROW ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', alignItems: 'center', flexShrink: 0 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '3px',
            gap: '3px',
          }}
        >
          {(['problems', 'input'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  ...(isActive
                    ? {
                        background: tab === 'problems' ? 'var(--accent-blue)' : 'var(--accent-indigo-dim)',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      }
                    : {
                        background: 'transparent',
                        color: 'var(--muted-color)',
                      }),
                }}
              >
                {tab === 'problems' ? 'Problems' : 'Input'}
              </button>
            );
          })}
        </div>

        {/* Collapse button */}
        <button
          onClick={onCollapse}
          title="Collapse panel"
          style={{
            flexShrink: 0,
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--muted-color)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          className="hover:text-[var(--text-color)] hover:bg-[var(--input-bg)]"
        >
          <PanelLeftClose style={{ width: '15px', height: '15px' }} />
        </button>
      </div>

      {/* ── 2. TAB CONTENT ── */}
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingBottom: '8px',
        }}
        className="no-scrollbar"
      >
        {/* ── PROBLEMS TAB ── */}
        {activeTab === 'problems' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {SW_CATEGORIES.map((category) => {
              const problems = SW_PROBLEMS.filter((p) => p.category === category);
              return (
                <div key={category}>
                  {/* Category label */}
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--muted-color)',
                      paddingBottom: '6px',
                      marginBottom: '6px',
                      borderBottom: '1px solid var(--border-color)',
                    }}
                  >
                    {category}
                  </div>

                  {/* Problem rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {problems.map((prob) => {
                      const isSelected = selectedProblemId === prob.id;
                      const isAvailable = prob.status === 'available';

                      return (
                        <button
                          key={prob.id}
                          onClick={() => setSelectedProblemId(prob.id)}
                          disabled={!isAvailable}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            border: `1.5px solid ${isSelected ? 'var(--accent-indigo)' : 'var(--border-color)'}`,
                            background: isSelected
                              ? 'var(--accent-indigo-bg)'
                              : isAvailable
                              ? 'var(--input-bg)'
                              : 'transparent',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            opacity: isAvailable ? 1 : 0.4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            transition: 'all 0.18s ease',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                              }}
                            >
                              {prob.name}
                            </span>
                            {isSelected ? (
                              <CheckCircle2
                                style={{ width: '14px', height: '14px', color: 'var(--accent-indigo)', flexShrink: 0 }}
                              />
                            ) : isAvailable ? (
                              <ChevronRight
                                style={{ width: '13px', height: '13px', color: 'var(--muted-color)', flexShrink: 0 }}
                              />
                            ) : (
                              <span
                                style={{
                                  fontSize: '8px',
                                  fontWeight: 700,
                                  fontFamily: 'JetBrains Mono, monospace',
                                  padding: '2px 6px',
                                  borderRadius: '9999px',
                                  background: 'var(--border-color)',
                                  color: 'var(--muted-color)',
                                  letterSpacing: '0.06em',
                                }}
                              >
                                SOON
                              </span>
                            )}
                          </div>

                          <p
                            style={{
                              fontSize: '11px',
                              color: 'var(--muted-color)',
                              lineHeight: 1.45,
                              margin: 0,
                            }}
                          >
                            {prob.description}
                          </p>

                          {/* Complexity badges */}
                          {isAvailable && (
                            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                              <span
                                style={{
                                  fontSize: '9px',
                                  fontFamily: 'JetBrains Mono, monospace',
                                  fontWeight: 600,
                                  padding: '1.5px 6px',
                                  borderRadius: '9999px',
                                  background: 'rgba(96, 165, 250, 0.12)',
                                  border: '1px solid rgba(96, 165, 250, 0.3)',
                                  color: 'var(--accent-blue)',
                                }}
                              >
                                {prob.timeComplexity}
                              </span>
                              <span
                                style={{
                                  fontSize: '9px',
                                  fontFamily: 'JetBrains Mono, monospace',
                                  fontWeight: 600,
                                  padding: '1.5px 6px',
                                  borderRadius: '9999px',
                                  background: 'rgba(129, 140, 248, 0.12)',
                                  border: '1px solid rgba(129, 140, 248, 0.3)',
                                  color: 'var(--accent-indigo)',
                                }}
                              >
                                {prob.spaceComplexity}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── INPUT TAB ── */}
        {activeTab === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {selectedProblemId === 'max-sum-subarray-k' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="Array Size"
                  value={swArraySize}
                  min={6}
                  max={12}
                  step={1}
                  accentVar="--accent-blue"
                  onChange={setSWArraySize}
                />
                <SliderCard
                  label="Window Size (K)"
                  value={swWindowK}
                  min={2}
                  max={5}
                  step={1}
                  accentVar="--accent-indigo"
                  onChange={setSWWindowK}
                  hint={
                    swWindowK > swArraySize
                      ? `⚠ K must be ≤ Array Size (${swArraySize})`
                      : "K must be ≤ array size"
                  }
                />
                <SliderCard
                  label="Max Element Value"
                  value={swMaxValue}
                  min={5}
                  max={30}
                  step={5}
                  accentVar="--accent-coral"
                  onChange={setSWMaxValue}
                  hint="Generates elements in range [-10, MAX]"
                />

                {/* Current Array Preview */}
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                      }}
                    >
                      Current Array
                    </span>
                    <button
                      onClick={generateSWArray}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Shuffle style={{ width: '11px', height: '11px' }} />
                      Regenerate
                    </button>
                  </div>

                  {/* Array tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {swArray.map((num, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '14px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: num >= 0 ? 'rgba(96, 165, 250, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                            border: num >= 0 ? '1px solid rgba(96, 165, 250, 0.25)' : '1px solid rgba(248, 113, 113, 0.25)',
                            color: num >= 0 ? 'var(--accent-blue)' : 'var(--accent-coral)',
                            lineHeight: 1,
                          }}
                        >
                          {num}
                        </span>
                        <span
                          style={{
                            fontSize: '8px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-color)',
                            fontWeight: 600,
                          }}
                        >
                          [{idx}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={regenerateTrace}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo-dim))',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.15s ease',
                    marginTop: 'auto',
                  }}
                  className="hover:opacity-90 active:scale-[0.98]"
                >
                  <Play style={{ width: '13px', height: '13px', fill: '#fff' }} />
                  Run Visualizer
                </button>
              </>
            ) : selectedProblemId === 'first-negative-in-window' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="Array Size"
                  value={fnArraySize}
                  min={6}
                  max={12}
                  step={1}
                  accentVar="--accent-blue"
                  onChange={setFNArraySize}
                />
                <SliderCard
                  label="Window Size (K)"
                  value={fnWindowK}
                  min={2}
                  max={5}
                  step={1}
                  accentVar="--accent-indigo"
                  onChange={setFNWindowK}
                  hint={
                    fnWindowK > fnArraySize
                      ? `⚠ K must be ≤ Array Size (${fnArraySize})`
                      : "K must be ≤ array size"
                  }
                />
                <SliderCard
                  label="Value Range"
                  value={fnValueRange}
                  min={5}
                  max={20}
                  step={5}
                  accentVar="--accent-coral"
                  onChange={setFNValueRange}
                  hint="Generates elements in range [-MAX, MAX]"
                />

                {/* Current Array Preview */}
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                      }}
                    >
                      Current Array
                    </span>
                    <button
                      onClick={generateFNArray}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Shuffle style={{ width: '11px', height: '11px' }} />
                      Regenerate
                    </button>
                  </div>

                  {/* Array tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {fnArray.map((num, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '14px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: num >= 0 ? 'rgba(96, 165, 250, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                            border: num >= 0 ? '1px solid rgba(96, 165, 250, 0.25)' : '1px solid rgba(248, 113, 113, 0.25)',
                            color: num >= 0 ? 'var(--accent-blue)' : 'var(--accent-coral)',
                            lineHeight: 1,
                          }}
                        >
                          {num}
                        </span>
                        <span
                          style={{
                            fontSize: '8px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-color)',
                            fontWeight: 600,
                          }}
                        >
                          [{idx}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={regenerateTrace}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo-dim))',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.15s ease',
                    marginTop: 'auto',
                  }}
                  className="hover:opacity-90 active:scale-[0.98]"
                >
                  <Play style={{ width: '13px', height: '13px', fill: '#fff' }} />
                  Run Visualizer
                </button>
              </>
            ) : selectedProblemId === 'max-of-all-subarrays-k' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="Array Size"
                  value={maxDequeArraySize}
                  min={6}
                  max={12}
                  step={1}
                  accentVar="--accent-blue"
                  onChange={setMaxDequeArraySize}
                />
                <SliderCard
                  label="Window Size (K)"
                  value={maxDequeWindowK}
                  min={2}
                  max={5}
                  step={1}
                  accentVar="--accent-indigo"
                  onChange={setMaxDequeWindowK}
                  hint={
                    maxDequeWindowK > maxDequeArraySize
                      ? `⚠ K must be ≤ Array Size (${maxDequeArraySize})`
                      : "K must be ≤ array size"
                  }
                />
                <SliderCard
                  label="Max Element Value"
                  value={maxDequeMaxValue}
                  min={5}
                  max={30}
                  step={5}
                  accentVar="--accent-coral"
                  onChange={setMaxDequeMaxValue}
                  hint="Generates elements in range [-10, MAX]"
                />

                {/* Current Array Preview */}
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                      }}
                    >
                      Current Array
                    </span>
                    <button
                      onClick={generateMaxDequeArray}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Shuffle style={{ width: '11px', height: '11px' }} />
                      Regenerate
                    </button>
                  </div>

                  {/* Array tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {maxDequeArray.map((num, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '14px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: num >= 0 ? 'rgba(96, 165, 250, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                            border: num >= 0 ? '1px solid rgba(96, 165, 250, 0.25)' : '1px solid rgba(248, 113, 113, 0.25)',
                            color: num >= 0 ? 'var(--accent-blue)' : 'var(--accent-coral)',
                            lineHeight: 1,
                          }}
                        >
                          {num}
                        </span>
                        <span
                          style={{
                            fontSize: '8px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-color)',
                            fontWeight: 600,
                          }}
                        >
                          [{idx}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={regenerateTrace}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo-dim))',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.15s ease',
                    marginTop: 'auto',
                  }}
                  className="hover:opacity-90 active:scale-[0.98]"
                >
                  <Play style={{ width: '13px', height: '13px', fill: '#fff' }} />
                  Run Visualizer
                </button>
              </>
            ) : selectedProblemId === 'count-anagrams-pattern' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="Text Length"
                  value={anagramTextLength}
                  min={8}
                  max={15}
                  step={1}
                  accentVar="--accent-blue"
                  onChange={setAnagramTextLength}
                />
                <SliderCard
                  label="Pattern Length (K)"
                  value={anagramPatternLength}
                  min={2}
                  max={4}
                  step={1}
                  accentVar="--accent-indigo"
                  onChange={setAnagramPatternLength}
                  hint={
                    anagramPatternLength > anagramTextLength
                      ? `⚠ K must be ≤ Text Length (${anagramTextLength})`
                      : "K must be ≤ text length"
                  }
                />
                <SliderCard
                  label="Alphabet Size"
                  value={anagramAlphabetSize}
                  min={2}
                  max={4}
                  step={1}
                  accentVar="--accent-coral"
                  onChange={setAnagramAlphabetSize}
                  hint="Smaller alphabet yields more anagrams"
                />

                {/* Text and Pattern Preview */}
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                      }}
                    >
                      Inputs Preview
                    </span>
                    <button
                      onClick={generateAnagramInputs}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Shuffle style={{ width: '11px', height: '11px' }} />
                      Regenerate
                    </button>
                  </div>

                  {/* Input previews */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* TEXT */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted-color)', width: '60px' }}>TEXT:</span>
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        {anagramText.split('').map((char, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '12px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(99, 102, 241, 0.08)',
                              border: '1px solid rgba(99, 102, 241, 0.15)',
                              color: 'var(--accent-indigo)',
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* PATTERN */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted-color)', width: '60px' }}>PATTERN:</span>
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        {anagramPattern.split('').map((char, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '12px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(248, 113, 113, 0.08)',
                              border: '1px solid rgba(248, 113, 113, 0.15)',
                              color: 'var(--accent-coral)',
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={regenerateTrace}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo-dim))',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.15s ease',
                    marginTop: 'auto',
                  }}
                  className="hover:opacity-90 active:scale-[0.98]"
                >
                  <Play style={{ width: '13px', height: '13px', fill: '#fff' }} />
                  Run Visualizer
                </button>
              </>
            ) : selectedProblemId === 'longest-substr-no-repeat' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="String Length"
                  value={lsNrStringLength}
                  min={8}
                  max={15}
                  step={1}
                  accentVar="--accent-blue"
                  onChange={setLsNrStringLength}
                />
                <SliderCard
                  label="Alphabet Size"
                  value={lsNrAlphabetSize}
                  min={2}
                  max={6}
                  step={1}
                  accentVar="--accent-indigo"
                  onChange={setLsNrAlphabetSize}
                  hint="Smaller alphabet forces more repeats (larger shrink bursts)"
                />

                {/* String Preview */}
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                      }}
                    >
                      Inputs Preview
                    </span>
                    <button
                      onClick={generateLsNrString}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Shuffle style={{ width: '11px', height: '11px' }} />
                      Regenerate
                    </button>
                  </div>

                  {/* Input previews */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* STRING */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted-color)', width: '60px' }}>STRING:</span>
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        {lsNrString.split('').map((char, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '12px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(99, 102, 241, 0.08)',
                              border: '1px solid rgba(99, 102, 241, 0.15)',
                              color: 'var(--accent-indigo)',
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={regenerateTrace}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo-dim))',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.15s ease',
                    marginTop: 'auto',
                  }}
                  className="hover:opacity-90 active:scale-[0.98]"
                >
                  <Play style={{ width: '13px', height: '13px', fill: '#fff' }} />
                  Run Visualizer
                </button>
              </>
            ) : selectedProblemId === 'smallest-subarray-sum-target' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="Array Size"
                  value={smArraySize}
                  min={6}
                  max={12}
                  step={1}
                  accentVar="--accent-blue"
                  onChange={setSmArraySize}
                />
                <SliderCard
                  label="Max Element Value"
                  value={smMaxValue}
                  min={5}
                  max={20}
                  step={5}
                  accentVar="--accent-indigo"
                  onChange={setSmMaxValue}
                  hint="Generates positive elements in range [1, MAX]"
                />
                <SliderCard
                  label="Target Sum"
                  value={smTarget}
                  min={10}
                  max={50}
                  step={5}
                  accentVar="--accent-coral"
                  onChange={setSmTarget}
                  hint="If target exceeds array sum, no valid subarray exists"
                />

                {/* Array Preview */}
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                      }}
                    >
                      Inputs Preview
                    </span>
                    <button
                      onClick={generateSmArray}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Shuffle style={{ width: '11px', height: '11px' }} />
                      Regenerate
                    </button>
                  </div>

                  {/* Array preview tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {smArray.map((num, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '13px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'rgba(96, 165, 250, 0.08)',
                            border: '1px solid rgba(96, 165, 250, 0.15)',
                            color: 'var(--accent-blue)',
                            lineHeight: 1,
                          }}
                        >
                          {num}
                        </span>
                        <span
                          style={{
                            fontSize: '8px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-color)',
                            fontWeight: 600,
                          }}
                        >
                          [{idx}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={regenerateTrace}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo-dim))',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.15s ease',
                    marginTop: 'auto',
                  }}
                  className="hover:opacity-90 active:scale-[0.98]"
                >
                  <Play style={{ width: '13px', height: '13px', fill: '#fff' }} />
                  Run Visualizer
                </button>
              </>
            ) : selectedProblemId === 'longest-substr-k-distinct' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="String Length"
                  value={kdStringLength}
                  min={8}
                  max={15}
                  step={1}
                  accentVar="--accent-blue"
                  onChange={setKdStringLength}
                />
                <SliderCard
                  label="Alphabet Size"
                  value={kdAlphabetSize}
                  min={3}
                  max={6}
                  step={1}
                  accentVar="--accent-indigo"
                  onChange={setKdAlphabetSize}
                  hint="Sizes 3 to 6 map to character sets [a-c] to [a-f]"
                />
                <SliderCard
                  label="K (Max Distinct)"
                  value={kdK}
                  min={1}
                  max={Math.min(4, kdAlphabetSize - 1)}
                  step={1}
                  accentVar="--accent-coral"
                  onChange={setKdK}
                  hint="K must be less than alphabet size"
                />

                {/* String Preview */}
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                      }}
                    >
                      Inputs Preview
                    </span>
                    <button
                      onClick={generateKdString}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Shuffle style={{ width: '11px', height: '11px' }} />
                      Regenerate
                    </button>
                  </div>

                  {/* Character preview tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {kdString.split('').map((char, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '13px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'rgba(96, 165, 250, 0.08)',
                            border: '1px solid rgba(96, 165, 250, 0.15)',
                            color: 'var(--accent-blue)',
                            lineHeight: 1,
                          }}
                        >
                          {char}
                        </span>
                        <span
                          style={{
                            fontSize: '8px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-color)',
                            fontWeight: 600,
                          }}
                        >
                          [{idx}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={regenerateTrace}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo-dim))',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.15s ease',
                    marginTop: 'auto',
                  }}
                  className="hover:opacity-90 active:scale-[0.98]"
                >
                  <Play style={{ width: '13px', height: '13px', fill: '#fff' }} />
                  Run Visualizer
                </button>
              </>
            ) : selectedProblemId === 'kadanes-max-subarray' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="Array Size"
                  value={kadaneArraySize}
                  min={6}
                  max={12}
                  step={1}
                  accentVar="--accent-amber"
                  onChange={setKadaneArraySize}
                />
                <SliderCard
                  label="Value Range"
                  value={kadaneValueRange}
                  min={5}
                  max={20}
                  step={5}
                  accentVar="--accent-coral"
                  onChange={setKadaneValueRange}
                  hint="Generates mixed values in [-MAX, MAX]"
                />

                {/* Array Preview */}
                <div
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--muted-color)',
                      }}
                    >
                      Inputs Preview
                    </span>
                    <button
                      onClick={generateKadaneArray}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Shuffle style={{ width: '11px', height: '11px' }} />
                      Regenerate
                    </button>
                  </div>

                  {/* Array preview tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {kadaneArray.map((num, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '13px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: num < 0 ? 'rgba(248, 113, 113, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                            border: num < 0 ? '1px solid rgba(248, 113, 113, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                            color: num < 0 ? 'var(--accent-coral)' : 'var(--accent-amber)',
                            lineHeight: 1,
                          }}
                        >
                          {num}
                        </span>
                        <span
                          style={{
                            fontSize: '8px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-color)',
                            fontWeight: 600,
                          }}
                        >
                          [{idx}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={regenerateTrace}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-amber), var(--accent-coral))',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.15s ease',
                    marginTop: 'auto',
                  }}
                  className="hover:opacity-90 active:scale-[0.98]"
                >
                  <Play style={{ width: '13px', height: '13px', fill: '#fff' }} />
                  Run Visualizer
                </button>
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  textAlign: 'center',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--muted-color)',
                  fontSize: '11px',
                  fontStyle: 'italic',
                }}
              >
                Parameters for {problem.name} will appear here when available.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. PINNED COMPLEXITY FOOTER ── */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          marginTop: '4px',
        }}
      >
        <div
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted-color)',
            marginBottom: '8px',
          }}
        >
          Complexity
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { icon: Zap, label: 'Time', value: problem.timeComplexity, color: 'var(--accent-blue)', bg: 'rgba(96,165,250,0.08)' },
            { icon: Database, label: 'Space', value: problem.spaceComplexity, color: 'var(--accent-indigo)', bg: 'rgba(129,140,248,0.08)' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '10px',
                background: bg,
                border: `1px solid ${color}30`,
              }}
            >
              <Icon style={{ width: '13px', height: '13px', color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--muted-color)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
