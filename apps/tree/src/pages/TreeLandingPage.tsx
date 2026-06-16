import { useRef, useState } from 'react';

/* ─────────────────── section header ─────────────────── */

function SectionHeader({ icon, title, color, pill, delay = '100ms' }: { icon: string; title: string; color: string; pill: string; delay?: string }) {
  return (
    <div
      className="flex items-center gap-3 mb-6"
      style={{
        animation: 'fadeInUp 400ms ease forwards',
        animationDelay: delay,
        opacity: 0
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}50` }}
      >
        {icon}
      </div>
      <span className="text-[22px] font-bold whitespace-nowrap" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </span>
      <div className="flex-grow h-px" style={{ background: '#2A2A35' }} />
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full whitespace-nowrap"
        style={{ background: `${color}15`, border: `1px solid ${color}35`, color }}
      >
        {pill}
      </span>
    </div>
  );
}

/* ──────────────────── concept card ──────────────────── */

interface ConceptCardProps {
  accent: string;
  icon: string;
  title: string;
  definition: string;
  description: string;
  svgContent: React.ReactNode;
  facts: string[];
  svgHeight?: number;
  delay?: number;
  compact?: boolean;
}

function ConceptCard({ accent, icon, title, definition, description, svgContent, facts, svgHeight = 160, delay = 0, compact = false }: ConceptCardProps) {
  const [hovered, setHovered] = useState(false);
  const pad = compact ? 'p-5' : 'p-6';

  return (
    <div
      className={`bg-[#131316] border rounded-2xl ${pad} relative overflow-hidden transition-all duration-300`}
      style={{
        borderColor: hovered ? `${accent}80` : '#2A2A35',
        boxShadow: hovered ? `0 0 24px ${accent}18` : 'none',
        animation: 'fadeInUp 400ms ease forwards',
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: accent }} />

      {/* Title row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
          style={{ background: `${accent}1F`, border: `1px solid ${accent}4D` }}
        >
          {icon}
        </div>
        <span className="text-[16px] font-bold text-[#F0F0F5]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </span>
      </div>

      {/* Definition box */}
      <div
        className="rounded-lg p-2.5 px-3.5 mb-3"
        style={{ background: `${accent}14`, border: `1px solid ${accent}40` }}
      >
        <p className="text-xs leading-relaxed" style={{ color: accent, fontFamily: "'JetBrains Mono', monospace" }}>
          {definition}
        </p>
      </div>

      {/* Description */}
      <p className="text-[13px] text-[#6B6B80] leading-relaxed mb-3">{description}</p>

      {/* SVG diagram area */}
      <div
        className="bg-[#0D0D0F] border border-[#2A2A35] w-full flex items-center justify-center mb-3"
        style={{
          borderRadius: 10,
          height: svgHeight,
          animation: 'fadeIn 500ms ease forwards',
          animationDelay: `${delay}ms`,
          opacity: 0,
        }}
      >
        {svgContent}
      </div>

      {/* Key facts */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-[6px] h-[6px] rounded-full" style={{ background: accent }} />
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6B6B80]">KEY FACTS</span>
        </div>
        <ul className="space-y-0.5">
          {facts.map((f, i) => (
            <li key={i} className="text-[11px] text-[#6B6B80] flex items-start gap-1.5">
              <span style={{ color: accent }} className="mt-px">›</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════ SVG DIAGRAMS ═══════════════════════ */

/* --- Section 2: Fundamentals --- */

function SvgWhatIsTree() {
  const nodes: [string, number, number][] = [['A', 200, 30], ['B', 100, 90], ['C', 300, 90], ['D', 50, 150], ['E', 150, 150], ['F', 250, 150], ['G', 350, 150]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  return (
    <svg viewBox="0 0 400 190" width="100%" height="100%">
      {/* Level labels */}
      <text x="12" y="35" fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">L0</text>
      <text x="12" y="95" fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">L1</text>
      <text x="12" y="155" fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">L2</text>
      {/* Root label */}
      <text x="200" y="12" fontSize="9" fill="#6B6B80" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">Root</text>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][1]} y1={nodes[a][2]} x2={nodes[b][1]} y2={nodes[b][2]} stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      ))}
      {nodes.map(([label, cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={18} fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="2" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10b981" fontFamily="'JetBrains Mono', monospace">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function SvgTerminology() {
  const c = '#3b82f6';
  return (
    <svg viewBox="0 0 400 190" width="100%" height="100%">
      {/* Edges */}
      <line x1="200" y1="35" x2="120" y2="90" stroke={`${c}66`} strokeWidth="1.5" />
      <line x1="200" y1="35" x2="280" y2="90" stroke={`${c}66`} strokeWidth="1.5" />
      <line x1="120" y1="90" x2="80" y2="150" stroke={`${c}66`} strokeWidth="1.5" />
      <line x1="280" y1="90" x2="320" y2="150" stroke={`${c}66`} strokeWidth="1.5" />
      {/* Nodes */}
      {([['A', 200, 35], ['B', 120, 90], ['C', 280, 90], ['D', 80, 150], ['E', 320, 150]] as [string, number, number][]).map(([l, x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={16} fill={`${c}25`} stroke={c} strokeWidth="2" />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">{l}</text>
        </g>
      ))}
      {/* Annotations */}
      <line x1="240" y1="25" x2="218" y2="30" stroke={c} strokeWidth="0.8" strokeDasharray="3 2" />
      <text x="242" y="22" fontSize="9" fill={c} fontFamily="'JetBrains Mono', monospace">Root</text>
      <text x="80" y="178" fontSize="9" fill={c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">Leaf</text>
      <text x="320" y="178" fontSize="9" fill={c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">Leaf</text>
      {/* Sibling brace */}
      <path d="M 120 110 Q 200 125 280 110" stroke={c} strokeWidth="0.8" strokeDasharray="3 2" fill="none" />
      <text x="200" y="130" fontSize="8" fill={c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">Siblings</text>
      {/* Height */}
      <text x="375" y="35" fontSize="8" fill="#6B6B80" textAnchor="end" fontFamily="'JetBrains Mono', monospace">Height=2</text>
      <line x1="370" y1="40" x2="370" y2="145" stroke="#6B6B80" strokeWidth="0.6" strokeDasharray="3 2" />
    </svg>
  );
}

function SvgParentChild() {
  const c = '#7C3AED';
  return (
    <svg viewBox="0 0 400 180" width="100%" height="100%">
      {/* Parent pill */}
      <rect x="160" y="8" width="80" height="18" rx="9" fill={`${c}25`} stroke={`${c}60`} strokeWidth="1" />
      <text x="200" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">PARENT</text>
      {/* Edges */}
      <line x1="200" y1="50" x2="80" y2="120" stroke={`${c}50`} strokeWidth="1.5" />
      <line x1="200" y1="50" x2="200" y2="120" stroke={`${c}50`} strokeWidth="1.5" />
      <line x1="200" y1="50" x2="320" y2="120" stroke={`${c}50`} strokeWidth="1.5" />
      {/* Parent node */}
      <circle cx="200" cy="40" r="16" fill={`${c}20`} stroke={c} strokeWidth="2" />
      <text x="200" y="44" textAnchor="middle" fontSize="11" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">P</text>
      {/* Children */}
      {([['C1', 80], ['C2', 200], ['C3', 320]] as [string, number][]).map(([l, x], i) => (
        <g key={i}>
          <circle cx={x} cy={120} r={16} fill={`${c}20`} stroke={c} strokeWidth="2" />
          <text x={x} y={124} textAnchor="middle" fontSize="10" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">{l}</text>
          <text x={x} y={150} textAnchor="middle" fontSize="8" fill={c} fontFamily="'JetBrains Mono', monospace">CHILD</text>
        </g>
      ))}
      {/* Siblings brace */}
      <path d="M 80 160 Q 200 175 320 160" stroke={c} strokeWidth="0.8" strokeDasharray="3 2" fill="none" />
      <text x="200" y="178" textAnchor="middle" fontSize="8" fill={c} fontFamily="'JetBrains Mono', monospace">SIBLINGS</text>
    </svg>
  );
}

function SvgHeightDepth() {
  const c = '#FFB800';
  const nodes: [string, number, number][] = [['A', 200, 20], ['B', 130, 65], ['C', 270, 65], ['D', 100, 110], ['E', 160, 110], ['F', 100, 155]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [3, 5]];
  return (
    <svg viewBox="0 0 400 185" width="100%" height="100%">
      {/* Depth annotations right */}
      {[['Depth 0', 20], ['Depth 1', 65], ['Depth 2', 110], ['Depth 3', 155]].map(([label, y], i) => (
        <g key={i}>
          <line x1="30" y1={y as number} x2="370" y2={y as number} stroke={`${c}15`} strokeWidth="0.6" strokeDasharray="4 3" />
          <text x="375" y={(y as number) + 3} fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">{label}</text>
        </g>
      ))}
      {/* Height bracket left */}
      <line x1="40" y1="20" x2="40" y2="155" stroke={c} strokeWidth="1" />
      <line x1="35" y1="20" x2="45" y2="20" stroke={c} strokeWidth="1" />
      <line x1="35" y1="155" x2="45" y2="155" stroke={c} strokeWidth="1" />
      <text x="28" y="92" fontSize="8" fill={c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" transform="rotate(-90 28 92)">Height = 3</text>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][1]} y1={nodes[a][2]} x2={nodes[b][1]} y2={nodes[b][2]} stroke={`${c}50`} strokeWidth="1.5" />
      ))}
      {nodes.map(([label, cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={14} fill={`${c}20`} stroke={c} strokeWidth="2" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function SvgSubtree() {
  const c = '#0891B2';
  const nodes: [string, number, number][] = [['A', 200, 25], ['B', 120, 80], ['C', 280, 80], ['D', 80, 140], ['E', 160, 140], ['F', 280, 140]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  const subtreeNodes = new Set([1, 3, 4]);
  return (
    <svg viewBox="0 0 400 180" width="100%" height="100%">
      {/* Subtree highlight */}
      <rect x="55" y="60" width="130" height="100" rx="12" fill={`${c}14`} stroke={c} strokeWidth="1.2" strokeDasharray="6 3" />
      <text x="120" y="175" textAnchor="middle" fontSize="8" fill={c} fontFamily="'JetBrains Mono', monospace">Subtree of B</text>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][1]} y1={nodes[a][2]} x2={nodes[b][1]} y2={nodes[b][2]}
          stroke={subtreeNodes.has(a) && subtreeNodes.has(b) ? `${c}70` : `${c}25`} strokeWidth="1.5" />
      ))}
      {nodes.map(([label, cx, cy], i) => {
        const inSub = subtreeNodes.has(i);
        return (
          <g key={i} opacity={inSub ? 1 : 0.45}>
            <circle cx={cx} cy={cy} r={16} fill={`${c}${inSub ? '20' : '10'}`} stroke={c} strokeWidth="2" />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SvgDegree() {
  const c = '#EC4899';
  return (
    <svg viewBox="0 0 400 165" width="100%" height="100%">
      {/* Group 1: degree 0 */}
      <circle cx="65" cy="50" r="16" fill={`${c}20`} stroke={c} strokeWidth="2" />
      <text x="65" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">X</text>
      <text x="65" y="82" textAnchor="middle" fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">degree = 0</text>
      <rect x="40" y="88" width="50" height="14" rx="7" fill={`${c}20`} stroke={`${c}50`} strokeWidth="0.8" />
      <text x="65" y="98" textAnchor="middle" fontSize="7" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">LEAF</text>

      {/* Group 2: degree 2 */}
      <circle cx="200" cy="35" r="16" fill={`${c}20`} stroke={c} strokeWidth="2" />
      <text x="200" y="39" textAnchor="middle" fontSize="10" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">Y</text>
      <line x1="200" y1="51" x2="170" y2="90" stroke={`${c}50`} strokeWidth="1.5" />
      <line x1="200" y1="51" x2="230" y2="90" stroke={`${c}50`} strokeWidth="1.5" />
      <circle cx="170" cy="100" r="12" fill={`${c}15`} stroke={c} strokeWidth="1.5" />
      <circle cx="230" cy="100" r="12" fill={`${c}15`} stroke={c} strokeWidth="1.5" />
      <text x="200" y="130" textAnchor="middle" fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">degree = 2</text>

      {/* Group 3: degree 3 */}
      <circle cx="335" cy="35" r="16" fill={`${c}20`} stroke={c} strokeWidth="2" />
      <text x="335" y="39" textAnchor="middle" fontSize="10" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">Z</text>
      <line x1="335" y1="51" x2="295" y2="90" stroke={`${c}50`} strokeWidth="1.5" />
      <line x1="335" y1="51" x2="335" y2="90" stroke={`${c}50`} strokeWidth="1.5" />
      <line x1="335" y1="51" x2="375" y2="90" stroke={`${c}50`} strokeWidth="1.5" />
      <circle cx="295" cy="100" r="12" fill={`${c}15`} stroke={c} strokeWidth="1.5" />
      <circle cx="335" cy="100" r="12" fill={`${c}15`} stroke={c} strokeWidth="1.5" />
      <circle cx="375" cy="100" r="12" fill={`${c}15`} stroke={c} strokeWidth="1.5" />
      <text x="335" y="130" textAnchor="middle" fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">degree = 3</text>
    </svg>
  );
}

function SvgTreeVsGraph() {
  const tc = '#FF6B00';
  return (
    <svg viewBox="0 0 400 170" width="100%" height="100%">
      {/* LEFT: tree */}
      {/* Tree edges */}
      <line x1="100" y1="30" x2="60" y2="70" stroke={`${tc}60`} strokeWidth="1.5" />
      <line x1="100" y1="30" x2="140" y2="70" stroke={`${tc}60`} strokeWidth="1.5" />
      <line x1="60" y1="70" x2="40" y2="115" stroke={`${tc}60`} strokeWidth="1.5" />
      <line x1="60" y1="70" x2="80" y2="115" stroke={`${tc}60`} strokeWidth="1.5" />
      {/* Tree nodes */}
      {([[100, 30], [60, 70], [140, 70], [40, 115], [80, 115]] as [number, number][]).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={12} fill={`${tc}20`} stroke={tc} strokeWidth="2" />
        </g>
      ))}
      <text x="100" y="145" textAnchor="middle" fontSize="9" fontWeight="bold" fill={tc} fontFamily="'JetBrains Mono', monospace">TREE ✓</text>
      <text x="100" y="158" textAnchor="middle" fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">acyclic</text>

      {/* Divider */}
      <line x1="200" y1="15" x2="200" y2="155" stroke="#2A2A35" strokeWidth="1" />

      {/* RIGHT: graph with cycle */}
      <line x1="300" y1="30" x2="260" y2="70" stroke="#6B6B80" strokeWidth="1.5" />
      <line x1="300" y1="30" x2="340" y2="70" stroke="#6B6B80" strokeWidth="1.5" />
      <line x1="260" y1="70" x2="280" y2="115" stroke="#6B6B80" strokeWidth="1.5" />
      <line x1="340" y1="70" x2="320" y2="115" stroke="#6B6B80" strokeWidth="1.5" />
      {/* Cycle edge */}
      <line x1="280" y1="115" x2="320" y2="115" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
      <line x1="260" y1="70" x2="340" y2="70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
      {([[300, 30], [260, 70], [340, 70], [280, 115], [320, 115]] as [number, number][]).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={12} fill="rgba(107,107,128,0.15)" stroke="#6B6B80" strokeWidth="2" />
        </g>
      ))}
      <text x="300" y="145" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">GRAPH</text>
      <text x="300" y="158" textAnchor="middle" fontSize="8" fill="#ef4444" fontFamily="'JetBrains Mono', monospace">has cycle</text>
    </svg>
  );
}

function SvgApplications() {
  const c = '#00C896';
  const rect = (x: number, y: number, label: string) => (
    <g>
      <rect x={x - 25} y={y - 11} width="50" height="22" rx="4" fill={`${c}18`} stroke={`${c}4D`} strokeWidth="1" />
      <text x={x} y={y + 3} textAnchor="middle" fontSize="10" fill={c} fontFamily="'JetBrains Mono', monospace">{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 400 185" width="100%" height="100%">
      {/* Edges */}
      <line x1="200" y1="36" x2="100" y2="70" stroke={`${c}40`} strokeWidth="1.2" />
      <line x1="200" y1="36" x2="200" y2="70" stroke={`${c}40`} strokeWidth="1.2" />
      <line x1="200" y1="36" x2="300" y2="70" stroke={`${c}40`} strokeWidth="1.2" />
      <line x1="100" y1="82" x2="100" y2="110" stroke={`${c}40`} strokeWidth="1.2" />
      <line x1="100" y1="132" x2="60" y2="155" stroke={`${c}40`} strokeWidth="1.2" />
      <line x1="100" y1="132" x2="140" y2="155" stroke={`${c}40`} strokeWidth="1.2" />
      {rect(200, 25, '/')}
      {rect(100, 70, 'home')}
      {rect(200, 70, 'etc')}
      {rect(300, 70, 'usr')}
      {rect(100, 120, 'user')}
      {rect(60, 165, 'docs')}
      {rect(140, 165, 'pics')}
      <text x="200" y="185" textAnchor="middle" fontSize="9" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">File System Tree</text>
    </svg>
  );
}

/* --- Section 3: Types of Trees --- */

function SvgBinaryTree() {
  const c = '#3b82f6';
  const nodes: [string, number, number][] = [['A', 150, 25], ['B', 80, 65], ['C', 220, 65], ['D', 50, 105], ['E', 110, 105]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4]];
  return (
    <svg viewBox="0 0 300 120" width="100%" height="100%">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][1]} y1={nodes[a][2]} x2={nodes[b][1]} y2={nodes[b][2]} stroke={`${c}50`} strokeWidth="1.5" />
      ))}
      {nodes.map(([l, cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={14} fill={`${c}20`} stroke={c} strokeWidth="2" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">{l}</text>
        </g>
      ))}
    </svg>
  );
}

function SvgBST() {
  const cL = '#10b981';
  const cR = '#3b82f6';
  const nodes: [string, number, number, string][] = [
    ['50', 150, 20, '#F0F0F5'], ['30', 80, 60, cL], ['70', 220, 60, cR],
    ['20', 45, 100, cL], ['40', 115, 100, cL], ['60', 185, 100, cR], ['80', 255, 100, cR],
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  return (
    <svg viewBox="0 0 300 120" width="100%" height="100%">
      {edges.map(([a, b], i) => {
        const col = b <= 2 ? (b === 1 ? cL : cR) : (nodes[b][3]);
        return <line key={i} x1={nodes[a][1]} y1={nodes[a][2]} x2={nodes[b][1]} y2={nodes[b][2]} stroke={`${col}50`} strokeWidth="1.5" />;
      })}
      {nodes.map(([l, cx, cy, col], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={14} fill={`${col}20`} stroke={col} strokeWidth="2" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill={col} fontFamily="'JetBrains Mono', monospace">{l}</text>
        </g>
      ))}
      <text x="55" y="16" fontSize="9" fill={cL} fontFamily="'JetBrains Mono', monospace">{'< 50'}</text>
      <text x="230" y="16" fontSize="9" fill={cR} fontFamily="'JetBrains Mono', monospace">{'> 50'}</text>
    </svg>
  );
}

function SvgAVL() {
  const c = '#7C3AED';
  return (
    <svg viewBox="0 0 300 120" width="100%" height="100%">
      {/* Balanced tree left */}
      <line x1="75" y1="25" x2="45" y2="60" stroke={`${c}50`} strokeWidth="1.5" />
      <line x1="75" y1="25" x2="105" y2="60" stroke={`${c}50`} strokeWidth="1.5" />
      <line x1="45" y1="60" x2="30" y2="95" stroke={`${c}50`} strokeWidth="1.5" />
      {[[75, 25], [45, 60], [105, 60], [30, 95]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={12} fill={`${c}20`} stroke={c} strokeWidth="2" />
      ))}
      <text x="75" y="115" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10b981" fontFamily="'JetBrains Mono', monospace">✓</text>

      {/* Unbalanced chain right */}
      <line x1="220" y1="20" x2="240" y2="45" stroke="#6B6B80" strokeWidth="1.5" />
      <line x1="240" y1="45" x2="260" y2="70" stroke="#6B6B80" strokeWidth="1.5" />
      <line x1="260" y1="70" x2="280" y2="95" stroke="#6B6B80" strokeWidth="1.5" />
      {[[220, 20], [240, 45], [260, 70], [280, 95]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={10} fill="rgba(107,107,128,0.15)" stroke="#6B6B80" strokeWidth="1.5" />
      ))}
      <text x="250" y="115" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444" fontFamily="'JetBrains Mono', monospace">✗</text>

      {/* Rotation arrow */}
      <path d="M 195 55 Q 175 40 180 65" stroke={c} strokeWidth="1" fill="none" markerEnd="url(#arrowAVL)" />
      <defs>
        <marker id="arrowAVL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill={c} />
        </marker>
      </defs>
      <text x="172" y="45" fontSize="7" fill={c} fontFamily="'JetBrains Mono', monospace">rotate</text>
    </svg>
  );
}

function SvgHeap() {
  const c = '#FFB800';
  const nodes: [string, number, number][] = [['90', 150, 20], ['70', 80, 60], ['80', 220, 60], ['50', 45, 100], ['60', 115, 100], ['75', 190, 100]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  return (
    <svg viewBox="0 0 300 120" width="100%" height="100%">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][1]} y1={nodes[a][2]} x2={nodes[b][1]} y2={nodes[b][2]} stroke={`${c}50`} strokeWidth="1.5" />
      ))}
      {nodes.map(([l, cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={14} fill={`${c}20`} stroke={c} strokeWidth="2" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill={c} fontFamily="'JetBrains Mono', monospace">{l}</text>
        </g>
      ))}
      <text x="150" y="118" textAnchor="middle" fontSize="8" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">MAX-HEAP: parent ≥ children</text>
    </svg>
  );
}

function SvgNary() {
  const c = '#EC4899';
  const nodes: [number, number][] = [[150, 18], [60, 55], [150, 55], [240, 55], [30, 92], [90, 92], [130, 92], [170, 92], [240, 92]];
  const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [2, 7], [3, 8]];
  return (
    <svg viewBox="0 0 300 110" width="100%" height="100%">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={`${c}50`} strokeWidth="1.5" />
      ))}
      {nodes.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={11} fill={`${c}20`} stroke={c} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

/* --- Section 4: Traversals --- */

interface TraversalSvgProps {
  order: number[];  // visit order: node indices
  accent: string;
  showLevels?: boolean;
}

function TraversalSvg({ order, accent, showLevels = false }: TraversalSvgProps) {
  const nodes: [string, number, number][] = [['1', 200, 30], ['2', 120, 90], ['3', 280, 90], ['4', 70, 150], ['5', 170, 150], ['6', 330, 150]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  // orderMap: node index → visit number (1-based)
  const orderMap = new Map<number, number>();
  order.forEach((nodeIdx, visitIdx) => { orderMap.set(nodeIdx, visitIdx + 1); });

  return (
    <svg viewBox="0 0 400 190" width="100%" height="100%">
      {showLevels && (
        <>
          {[['Level 0', 30], ['Level 1', 90], ['Level 2', 150]].map(([label, y], i) => (
            <g key={i}>
              <line x1="25" y1={y as number} x2="385" y2={y as number} stroke={`${accent}18`} strokeWidth="0.6" strokeDasharray="5 3" />
              <text x="20" y={(y as number) - 6} fontSize="7" fill="#6B6B80" fontFamily="'JetBrains Mono', monospace">{label}</text>
            </g>
          ))}
        </>
      )}
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][1]} y1={nodes[a][2]} x2={nodes[b][1]} y2={nodes[b][2]} stroke={`${accent}40`} strokeWidth="1.5" />
      ))}
      {nodes.map(([label, cx, cy], i) => {
        const visitNum = orderMap.get(i);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={18} fill={`${accent}20`} stroke={accent} strokeWidth="2" />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill={accent} fontFamily="'JetBrains Mono', monospace">{label}</text>
            {visitNum !== undefined && (
              <>
                <circle cx={cx + 14} cy={cy - 14} r={8} fill={accent} />
                <text x={cx + 14} y={cy - 10} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0D0D0F" fontFamily="'JetBrains Mono', monospace">{visitNum}</text>
              </>
            )}
          </g>
        );
      })}
      {/* Visit sequence pills at bottom */}
      <g>
        {order.map((nodeIdx, i) => {
          const x = 80 + i * 50;
          const label = nodes[nodeIdx][0];
          return (
            <g key={i}>
              <rect x={x - 12} y={175} width="24" height="14" rx="4" fill={`${accent}25`} stroke={`${accent}50`} strokeWidth="0.8" />
              <text x={x} y={185} textAnchor="middle" fontSize="8" fontWeight="bold" fill={accent} fontFamily="'JetBrains Mono', monospace">{label}</text>
              {i < order.length - 1 && (
                <text x={x + 18} y={185} textAnchor="middle" fontSize="9" fill="#6B6B80">→</text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */

export function TreeLandingPage({ onOpenVisualizer }: { onOpenVisualizer: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => { scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div
      ref={scrollRef}
      className="w-full h-screen overflow-y-auto"
      style={{
        backgroundColor: '#0D0D0F',
        backgroundImage: 'radial-gradient(#2A2A35 1.2px, transparent 1.2px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="max-w-[900px] mx-auto px-5">
        {/* ═══════════ SECTION 1 — HERO ═══════════ */}
        <section className="flex flex-col items-center pt-12 pb-8">
          {/* Badge */}
          <span
            className="rounded-full px-3.5 py-1 font-semibold mb-5"
            style={{
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#34d399',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              animation: 'fadeInUp 400ms ease forwards',
              animationDelay: '0ms',
              opacity: 0,
            }}
          >
            DSA VISUALIZER — TREE MODULE
          </span>

          {/* Title */}
          <h1
            className="font-bold tracking-tight text-center mb-2"
            style={{
              fontSize: 36,
              color: '#F0F0F5',
              fontFamily: "'Space Grotesk', sans-serif",
              animation: 'fadeInUp 400ms ease forwards',
              animationDelay: '80ms',
              opacity: 0,
            }}
          >
            Tree Data Structures
          </h1>

          {/* Subtitle */}
          <p
            className="text-center mb-6 max-w-[480px]"
            style={{
              fontSize: 15,
              color: '#6B6B80',
              animation: 'fadeInUp 400ms ease forwards',
              animationDelay: '160ms',
              opacity: 0,
            }}
          >
            Master tree fundamentals, traversals, and properties with visual examples
          </p>

          {/* Stats row */}
          <div
            className="flex items-center gap-0 mb-7"
            style={{
              animation: 'fadeInUp 400ms ease forwards',
              animationDelay: '240ms',
              opacity: 0,
            }}
          >
            {[
              { num: '8', label: 'Concepts' },
              { num: '5', label: 'Tree Types' },
              { num: '4', label: 'Traversals' },
            ].map((s, i) => (
              <div key={i} className="flex items-center">
                {i > 0 && <div className="w-px mx-5" style={{ height: 32, background: '#2A2A35' }} />}
                <div className="flex flex-col items-center">
                  <span style={{ fontSize: 24, fontWeight: 'bold', color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>{s.num}</span>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#6B6B80' }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onOpenVisualizer}
            className="font-semibold py-2.5 px-7 rounded-lg text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: '#10b981',
              boxShadow: '0 0 20px rgba(16,185,129,0.25)',
              animation: 'fadeInUp 400ms ease forwards',
              animationDelay: '320ms',
              opacity: 0,
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = '#059669';
              (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(16,185,129,0.4)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = '#10b981';
              (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(16,185,129,0.25)';
            }}
          >
            Open Tree Visualizer →
          </button>
        </section>

        {/* ═══════════ SECTION 2 — TREE FUNDAMENTALS ═══════════ */}
        <section className="pb-12 px-0 sm:px-5">
          <SectionHeader icon="🌳" title="Tree Fundamentals" color="#10b981" pill="8 concepts" delay="0ms" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ConceptCard
              accent="#10b981" icon="🌳" title="What is a Tree?"
              definition="A hierarchical non-linear data structure with a root node and subtrees of children, forming a parent-child relationship."
              description="Unlike arrays or linked lists, trees represent hierarchical relationships. Every tree has exactly one root node. Each node can have zero or more children. There are no cycles in a tree — it is a connected acyclic graph."
              svgContent={<SvgWhatIsTree />}
              facts={['Exactly ONE root node', 'Every non-root has one parent', 'N nodes → N-1 edges', 'Trees are acyclic']}
              delay={80}
            />
            <ConceptCard
              accent="#3b82f6" icon="📖" title="Tree Terminology"
              definition="Key terms used to describe the structure and properties of tree nodes and edges."
              description="Understanding tree terminology is essential before working with any tree algorithm. These terms describe node relationships, positions, and structural measurements."
              svgContent={<SvgTerminology />}
              facts={['Root: topmost node', 'Leaf: no children', 'Height: longest path to leaf', 'Depth: distance from root', 'Degree: number of children', 'Siblings: same parent']}
              delay={160}
            />
            <ConceptCard
              accent="#7C3AED" icon="👨‍👧" title="Parent & Child"
              definition="The fundamental relationship between connected nodes — upper is parent, lower is child."
              description="Every node except root has exactly one parent. A parent can have multiple children. Child nodes of the same parent are siblings."
              svgContent={<SvgParentChild />}
              facts={['One parent → zero or more children', 'Siblings share same parent', 'Root has no parent', 'Leaf has zero children']}
              delay={240}
            />
            <ConceptCard
              accent="#FFB800" icon="📏" title="Height & Depth"
              definition="Height is longest path from node to leaf. Depth is distance from root to node."
              description="Measured in edges. Tree height = height of root. Depth of root = 0. These measures analyze time complexity."
              svgContent={<SvgHeightDepth />}
              facts={['Depth of root = 0', 'Height of leaf = 0', 'Tree height = max depth', 'Height determines worst-case time']}
              delay={320}
            />
            <ConceptCard
              accent="#0891B2" icon="🔁" title="Subtree & Recursion"
              definition="A subtree is any node and all descendants. Trees have a natural recursive structure."
              description="Every node is root of its own subtree. This is why most tree algorithms use recursion."
              svgContent={<SvgSubtree />}
              facts={['Every node is root of its subtree', 'Algorithms are naturally recursive', 'Left/right subtrees independent', 'Base case: null or leaf']}
              delay={400}
            />
            <ConceptCard
              accent="#EC4899" icon="🔢" title="Degree of a Node"
              definition="Degree = number of children. Tree degree = max degree of any node."
              description="Binary tree max degree 2. General tree has no restriction. Leaf nodes always degree 0."
              svgContent={<SvgDegree />}
              facts={['Degree 0 = leaf', 'Binary tree: max 2', 'N-ary tree: max N', 'Tree degree = max of all nodes']}
              delay={480}
            />
            <ConceptCard
              accent="#FF6B00" icon="⚖️" title="Tree vs Graph"
              definition="A tree is a connected, acyclic, undirected graph with N-1 edges for N nodes."
              description="Every tree is a graph but not vice versa. Trees have no cycles, exactly one path between any two nodes."
              svgContent={<SvgTreeVsGraph />}
              facts={['Tree: N nodes, N-1 edges', 'Exactly ONE path between any 2 nodes', 'Graph: can have cycles', 'All trees are graphs, not vice versa']}
              delay={560}
            />
            <ConceptCard
              accent="#00C896" icon="🌐" title="Real-World Applications"
              definition="Trees model hierarchical relationships found everywhere in computing."
              description="File systems, HTML DOM, compilers (AST), databases (B-Trees), decision trees in ML."
              svgContent={<SvgApplications />}
              facts={['File systems', 'HTML DOM', 'Compilers: AST', 'Databases: B-Trees', 'AI/ML: Decision trees']}
              delay={640}
            />
          </div>
        </section>

        {/* ═══════════ SECTION 3 — TYPES OF TREES ═══════════ */}
        <section className="pb-12 px-0 sm:px-5">
          <SectionHeader icon="🌲" title="Types of Trees" color="#3b82f6" pill="5 types" delay="0ms" />

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            <ConceptCard compact accent="#3b82f6" icon="🔵" title="Binary Tree"
              definition="Each node has at most 2 children: left and right."
              description="Most common tree type. Base for BST, AVL, Heap."
              svgContent={<SvgBinaryTree />} svgHeight={120}
              facts={['Max degree 2', 'No ordering', 'Full: 0 or 2 children', 'Perfect: all leaves same level']}
              delay={80}
            />
            <ConceptCard compact accent="#10b981" icon="🔍" title="Binary Search Tree"
              definition="Left subtree < root, right subtree > root."
              description="O(log n) search/insert/delete balanced. In-order = sorted."
              svgContent={<SvgBST />} svgHeight={120}
              facts={['Left < root', 'Right > root', 'In-order = sorted', 'Search O(log n) avg']}
              delay={160}
            />
            <ConceptCard compact accent="#7C3AED" icon="⚖️" title="AVL Tree"
              definition="Self-balancing BST, height difference ≤ 1."
              description="O(log n) guaranteed via rotations."
              svgContent={<SvgAVL />} svgHeight={120}
              facts={['Balance Factor ≤ 1', 'O(log n) guaranteed', '4 rotation types', 'Height O(log n)']}
              delay={240}
            />
            <ConceptCard compact accent="#FFB800" icon="🏔️" title="Heap"
              definition="Complete binary tree with heap property: parent ≥ (max) or ≤ (min) children."
              description="Priority queues. O(log n) insert/delete. Used in Heap Sort, Dijkstra's."
              svgContent={<SvgHeap />} svgHeight={120}
              facts={['Always complete', 'Max: parent ≥ children', 'Min: parent ≤ children', 'Insert/Delete O(log n)']}
              delay={320}
            />
            <ConceptCard compact accent="#EC4899" icon="🌿" title="N-ary / General Tree"
              definition="Each node can have any number of children."
              description="File systems, org charts, HTML DOM, Trie."
              svgContent={<SvgNary />} svgHeight={120}
              facts={['No limit on children', 'File systems', 'HTML DOM', 'Trie: up to 26 children']}
              delay={400}
            />
          </div>
        </section>

        {/* ═══════════ SECTION 4 — TREE TRAVERSALS ═══════════ */}
        <section className="pb-12 px-0 sm:px-5">
          <SectionHeader icon="🔄" title="Tree Traversals" color="#FFB800" pill="4 traversals" delay="0ms" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inorder: 4(idx3)→2(idx1)→5(idx4)→1(idx0)→3(idx2)→6(idx5) */}
            <ConceptCard
              accent="#10b981" icon="↩️" title="Inorder (LNR)"
              definition="Visit LEFT, then ROOT, then RIGHT."
              description="BST inorder = sorted ascending. Infix notation."
              svgContent={<TraversalSvg order={[3, 1, 4, 0, 2, 5]} accent="#10b981" />}
              facts={['Left→Node→Right', 'BST = sorted', 'Expression trees infix', 'Base: null = return']}
              delay={80}
            />
            {/* Preorder: 1(0)→2(1)→4(3)→5(4)→3(2)→6(5) */}
            <ConceptCard
              accent="#3b82f6" icon="⬇️" title="Preorder (NLR)"
              definition="Visit ROOT first, then LEFT, then RIGHT."
              description="Tree copying, serialization, prefix expressions."
              svgContent={<TraversalSvg order={[0, 1, 3, 4, 2, 5]} accent="#3b82f6" />}
              facts={['Node→Left→Right', 'Root first', 'Copying/serialization', 'Prefix expressions']}
              delay={160}
            />
            {/* Postorder: 4(3)→5(4)→2(1)→6(5)→3(2)→1(0) */}
            <ConceptCard
              accent="#7C3AED" icon="⬆️" title="Postorder (LRN)"
              definition="Visit LEFT, then RIGHT, then ROOT last."
              description="Safe tree deletion, postfix expressions, directory sizes."
              svgContent={<TraversalSvg order={[3, 4, 1, 5, 2, 0]} accent="#7C3AED" />}
              facts={['Left→Right→Node', 'Root last', 'Safe deletion', 'Directory sizes', 'Postfix']}
              delay={240}
            />
            {/* Level order: 1(0)→2(1)→3(2)→4(3)→5(4)→6(5) */}
            <ConceptCard
              accent="#FFB800" icon="➡️" title="Level Order (BFS)"
              definition="Level by level, top to bottom, left to right. Uses Queue."
              description="BFS approach. Shortest path, completeness check, level serialization."
              svgContent={<TraversalSvg order={[0, 1, 2, 3, 4, 5]} accent="#FFB800" showLevels />}
              facts={['Uses Queue (FIFO)', 'Level by level', 'Shortest path', 'Completeness check']}
              delay={320}
            />
          </div>
        </section>

        {/* ═══════════ SECTION 5 — CTA ═══════════ */}
        <section
          className="py-10 flex flex-col items-center border-t"
          style={{
            background: '#131316',
            borderColor: '#2A2A35',
            animation: 'fadeInUp 400ms ease forwards',
            animationDelay: '0ms',
            opacity: 0,
          }}
        >
          <span className="text-5xl mb-4">🌳</span>
          <h2 className="font-bold text-center mb-2" style={{ fontSize: 20, color: '#F0F0F5', fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to build trees?
          </h2>
          <p className="text-center mb-6" style={{ fontSize: 13, color: '#6B6B80' }}>
            Insert nodes, traverse, and watch the BST come alive step by step
          </p>
          <button
            onClick={onOpenVisualizer}
            className="font-semibold py-2.5 px-7 rounded-lg text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer mb-4"
            style={{
              background: '#10b981',
              boxShadow: '0 0 20px rgba(16,185,129,0.25)',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = '#059669';
              (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(16,185,129,0.4)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = '#10b981';
              (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(16,185,129,0.25)';
            }}
          >
            Open Tree Visualizer →
          </button>
          <button
            onClick={scrollToTop}
            className="text-xs transition-colors cursor-pointer bg-transparent border-none"
            style={{ color: '#6B6B80' }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = '#34d399'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = '#6B6B80'; }}
          >
            or review concepts again ↑
          </button>
        </section>
      </div>
    </div>
  );
}
