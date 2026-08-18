import React, { useState } from 'react';
import { useBSStore } from '../store';
import { BS_PROBLEMS, BS_CATEGORIES } from '../data/bsProblems';
import { Play, Zap, Database, Shuffle, ChevronRight, CheckCircle2, Clock, PanelLeftClose } from 'lucide-react';

interface BSLeftPanelProps {
  onCollapse: () => void;
}

// Reusable slider card component
const SliderCard: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  accentColor: string;
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

      {/* Custom track visual (cosmetic bar under the input) */}
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

      {/* Native range (invisible but functional, overlays the bar) */}
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

export const BSLeftPanel: React.FC<BSLeftPanelProps> = ({ onCollapse }) => {
  const {
    selectedProblemId,
    setSelectedProblemId,
    problem,
    kokoPileCount,
    kokoMaxPileSize,
    kokoHours,
    kokoPiles,
    setKokoPileCount,
    setKokoMaxPileSize,
    setKokoHours,
    generateKokoPiles,
    reset,
  } = useBSStore();

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
        {/* Tab pills container */}
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
            {BS_CATEGORIES.map((category) => {
              const problems = BS_PROBLEMS.filter((p) => p.category === category);
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            {selectedProblemId === 'koko-eating-bananas' ? (
              <>
                {/* Sliders */}
                <SliderCard
                  label="Number of Piles"
                  value={kokoPileCount}
                  min={3}
                  max={8}
                  step={1}
                  accentColor="#60a5fa"
                  accentVar="--accent-blue"
                  onChange={setKokoPileCount}
                />
                <SliderCard
                  label="Max Pile Size"
                  value={kokoMaxPileSize}
                  min={10}
                  max={50}
                  step={5}
                  accentColor="#818cf8"
                  accentVar="--accent-indigo"
                  onChange={setKokoMaxPileSize}
                />
                <SliderCard
                  label="Hours Available (H)"
                  value={kokoHours}
                  min={3}
                  max={15}
                  step={1}
                  accentColor="#f87171"
                  accentVar="--accent-coral"
                  onChange={setKokoHours}
                  hint={
                    kokoHours < kokoPileCount
                      ? `⚠ H = ${kokoHours} < ${kokoPileCount} piles — no solution possible`
                      : `H must be ≥ ${kokoPileCount} (number of piles)`
                  }
                />

                {/* Current Piles Preview */}
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
                      Current Piles
                    </span>
                    <button
                      onClick={generateKokoPiles}
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

                  {/* Pile tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {kokoPiles.map((pile, idx) => (
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
                            background: 'rgba(96, 165, 250, 0.1)',
                            border: '1px solid rgba(96, 165, 250, 0.25)',
                            color: 'var(--accent-blue)',
                            lineHeight: 1,
                          }}
                        >
                          {pile}
                        </span>
                        <span
                          style={{
                            fontSize: '8px',
                            fontFamily: 'Inter, sans-serif',
                            color: 'var(--muted-color)',
                            fontWeight: 600,
                          }}
                        >
                          P{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Run Visualizer */}
                <button
                  onClick={reset}
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
        {/* Hours info strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            padding: '6px 10px',
            borderRadius: '8px',
            background: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.2)',
          }}
        >
          <Clock style={{ width: '11px', height: '11px', color: 'var(--accent-coral)', flexShrink: 0 }} />
          <span style={{ fontSize: '10px', color: 'var(--muted-color)', fontFamily: 'Inter, sans-serif' }}>
            H = <strong style={{ color: 'var(--accent-coral)', fontFamily: 'JetBrains Mono, monospace' }}>{kokoHours}</strong> hours limit
          </span>
        </div>
      </div>
    </div>
  );
};
