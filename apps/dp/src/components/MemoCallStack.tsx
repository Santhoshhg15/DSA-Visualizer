import React, { useEffect, useRef, useState } from 'react';

export interface CallFrame {
  index: number;
  k: number;
}

interface MemoCallStackProps {
  callStack: CallFrame[];
  arr: number[];
  returnValue?: number | null;
  stepType?: string;
}

interface PoppingFrame {
  id: string;
  frame: CallFrame;
  depth: number;
  returnVal: number | null;
  phase: 'flash' | 'fadeout';
}

const MAX_INDENT_DEPTH = 4;
const INDENT_PX = 12;
const MAX_POPPING = 4; // prevent accumulation during fast auto-play

export const MemoCallStack: React.FC<MemoCallStackProps> = ({
  callStack = [],
  arr = [],
  returnValue = null,
  stepType = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeFrameRef = useRef<HTMLDivElement>(null);

  const [poppingFrames, setPoppingFrames] = useState<PoppingFrame[]>([]);

  // ── Refs that hold the PREVIOUS render's values ──────────────────────────
  // CRITICAL: we update these ONLY inside the useEffect (after render), never
  // during render itself. Updating refs during render would overwrite the "prev"
  // snapshot before the effect can read it, breaking pop detection.
  const prevLengthRef = useRef<number>(0);
  const prevTopFrameRef = useRef<CallFrame | null>(null);
  const frameCounterRef = useRef(0);

  // Hold a stable mutable ref to the latest callStack so we can access it
  // inside the effect without adding the array object to deps (which would
  // create a new reference every render and cause an infinite loop).
  const callStackRef = useRef<CallFrame[]>(callStack);
  callStackRef.current = callStack; // safe — this is just a ref, not setState

  // Refs for pending animation timeouts so we can clear them on cleanup
  const t1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Pop-detection effect ─────────────────────────────────────────────────
  // Depends only on primitives (length, returnValue, stepType) — NOT on the
  // callStack array reference — so it fires exactly once per genuine change,
  // never on spurious parent re-renders.
  useEffect(() => {
    const prevLen = prevLengthRef.current;
    const currStack = callStackRef.current;
    const currLen = currStack.length;
    const prevTopFrame = prevTopFrameRef.current;

    // Detect a pop (stack shrank)
    if (prevLen > currLen && prevTopFrame !== null) {
      const depth = prevLen - 1;
      const id = `pop-${frameCounterRef.current++}`;
      const retVal =
        stepType === 'return' || stepType === 'base-case' || stepType === 'memo-hit'
          ? (returnValue ?? null)
          : null;

      // Cap simultaneous exit-animations so fast auto-play can't accumulate
      setPoppingFrames((pf) => [
        ...pf.slice(-(MAX_POPPING - 1)),
        { id, frame: prevTopFrame, depth, returnVal: retVal, phase: 'flash' },
      ]);

      // Phase 1 (flash, 280ms) → Phase 2 (fadeout, 280ms) → remove
      t1Ref.current = setTimeout(() => {
        setPoppingFrames((pf) =>
          pf.map((p) => (p.id === id ? { ...p, phase: 'fadeout' } : p))
        );
        t2Ref.current = setTimeout(() => {
          setPoppingFrames((pf) => pf.filter((p) => p.id !== id));
        }, 280);
      }, 280);
    }

    // ALWAYS sync refs after pop/push/no-change — this is the "previous snapshot"
    // for the NEXT time this effect runs.
    prevLengthRef.current = currLen;
    prevTopFrameRef.current = currLen > 0 ? currStack[currLen - 1] : null;

    // Cleanup: clear any pending timeouts when deps change before they fire
    return () => {
      if (t1Ref.current !== null) {
        clearTimeout(t1Ref.current);
        t1Ref.current = null;
      }
      if (t2Ref.current !== null) {
        clearTimeout(t2Ref.current);
        t2Ref.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStack.length, returnValue, stepType]);

  // ── Auto-scroll: keep the active (deepest) frame visible ─────────────────
  useEffect(() => {
    if (activeFrameRef.current) {
      activeFrameRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [callStack.length]);

  const depth = callStack.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Header with live depth counter ──────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--muted-color)',
          }}
        >
          Call Stack
        </span>
        {depth > 0 && (
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--muted-color)',
            }}
          >
            depth:{' '}
            <span style={{ color: 'var(--accent-indigo)', fontWeight: 700 }}>
              {depth}
            </span>
          </span>
        )}
      </div>

      {/* ── Frame list ──────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="custom-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          position: 'relative',
          paddingBottom: '4px',
        }}
      >
        {/* Empty state */}
        {depth === 0 && poppingFrames.length === 0 && (
          <div
            style={{
              padding: '20px 0',
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--muted-color)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            Stack empty
          </div>
        )}

        {/* Vertical connector line */}
        {depth > 1 && (
          <div
            style={{
              position: 'absolute',
              left: '8px',
              top: '12px',
              bottom: '12px',
              width: '1px',
              background: 'var(--border-color)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {/* Live stack frames */}
        {callStack.map((frame, i) => {
          const isActive = i === callStack.length - 1;
          const indentDepth = Math.min(i, MAX_INDENT_DEPTH);
          const marginLeft = indentDepth * INDENT_PX;
          const elemLabel =
            frame.index >= 0 && frame.index < arr.length
              ? `arr[${frame.index}] = ${arr[frame.index]}`
              : 'index out of bounds';

          return (
            <div
              key={i}
              ref={isActive ? activeFrameRef : null}
              style={{
                marginLeft,
                flexShrink: 0,
                position: 'relative',
                zIndex: 1,
                background: isActive ? 'var(--cell-active-bg)' : 'var(--bg-card, var(--input-bg))',
                border: isActive ? '1.5px solid var(--accent-indigo)' : '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 10px',
                opacity: isActive ? 1 : 0.7,
                transition: 'all 0.15s ease',
              }}
            >
              {/* Line 1: depth badge + call signature + ACTIVE pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                {/* Circular depth badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    minWidth: '18px',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    background: isActive ? 'var(--accent-indigo-bg)' : 'var(--input-bg)',
                    border: isActive ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)',
                    color: isActive ? 'var(--accent-indigo)' : 'var(--muted-color)',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>

                {/* Call signature — NEVER wraps */}
                <span
                  style={{
                    flex: 1,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: isActive ? 'var(--text-color)' : 'var(--text-secondary, var(--muted-color))',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                  }}
                >
                  {'▸ '}
                  <span style={{ color: 'var(--muted-color)' }}>solve(</span>
                  <span style={{ color: 'var(--accent-blue)' }}>i=</span>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{frame.index}</span>
                  <span style={{ color: 'var(--muted-color)' }}>, </span>
                  <span style={{ color: 'var(--accent-teal)' }}>k=</span>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>{frame.k}</span>
                  <span style={{ color: 'var(--muted-color)' }}>)</span>
                </span>

                {/* ACTIVE pill — flex-shrink:0 so it never gets squeezed */}
                {isActive && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      fontFamily: 'JetBrains Mono, monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: 'var(--accent-indigo-bg)',
                      border: '1px solid var(--accent-indigo)',
                      color: 'var(--accent-indigo)',
                      borderRadius: '9999px',
                      padding: '1px 6px',
                      flexShrink: 0,
                      marginLeft: 'auto',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Line 2: array value — own line, never floats beside signature */}
              <div
                style={{
                  marginTop: '3px',
                  marginLeft: '24px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--muted-color)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {elemLabel}
              </div>
            </div>
          );
        })}

        {/* Exit-animating (popping) frames */}
        {poppingFrames.map((pf) => {
          const indentDepth = Math.min(pf.depth, MAX_INDENT_DEPTH);
          const marginLeft = indentDepth * INDENT_PX;
          const isFadeout = pf.phase === 'fadeout';
          const elemLabel =
            pf.frame.index >= 0 && pf.frame.index < arr.length
              ? `arr[${pf.frame.index}] = ${arr[pf.frame.index]}`
              : 'index out of bounds';

          return (
            <div
              key={pf.id}
              style={{
                marginLeft,
                flexShrink: 0,
                position: 'relative',
                zIndex: 2,
                background: 'var(--accent-green-bg, rgba(74,222,128,0.08))',
                border: '1.5px solid var(--accent-green)',
                borderRadius: '8px',
                padding: '8px 10px',
                opacity: isFadeout ? 0 : 1,
                transform: isFadeout ? 'translateY(-8px)' : 'translateY(0)',
                transition: isFadeout
                  ? 'opacity 0.25s ease, transform 0.25s ease'
                  : 'border-color 0.15s ease',
                pointerEvents: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    minWidth: '18px',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    background: 'var(--accent-green-bg, rgba(74,222,128,0.12))',
                    border: '1px solid var(--accent-green)',
                    color: 'var(--accent-green)',
                    flexShrink: 0,
                  }}
                >
                  {pf.depth + 1}
                </span>

                <span
                  style={{
                    flex: 1,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--accent-green)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                  }}
                >
                  {'▸ '}solve(i={pf.frame.index}, k={pf.frame.k})
                </span>

                {/* Return value badge */}
                {pf.returnVal !== null && pf.returnVal !== undefined && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      fontFamily: 'JetBrains Mono, monospace',
                      background: 'var(--accent-green-bg, rgba(74,222,128,0.12))',
                      border: '1px solid var(--accent-green)',
                      color: 'var(--accent-green)',
                      borderRadius: '9999px',
                      padding: '1px 6px',
                      flexShrink: 0,
                      marginLeft: 'auto',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    → {pf.returnVal}
                  </span>
                )}
              </div>

              <div
                style={{
                  marginTop: '3px',
                  marginLeft: '24px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--accent-green)',
                  opacity: 0.7,
                  whiteSpace: 'nowrap',
                }}
              >
                {elemLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
