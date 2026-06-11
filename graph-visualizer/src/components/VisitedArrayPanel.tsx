import { useRef, useEffect, useState } from 'react';

export interface VisitedArrayPanelProps {
  nodes: { id: string; label: string }[];
  visitedOrder: string[];
  currentNode: string | null;
  title?: string;
  mode?: 'default' | 'distance' | 'color' | 'indegree';
  extraData?: Record<string, any>;
}

type NodeStatus = 'unvisited' | 'current' | 'visited';

function getNodeStatus(
  nodeId: string,
  visitedOrder: string[],
  currentNode: string | null
): NodeStatus {
  if (currentNode === nodeId) return 'current';
  if (visitedOrder.includes(nodeId)) return 'visited';
  return 'unvisited';
}

const statusConfig = {
  unvisited: {
    bg: 'bg-[#FF4444]/15',
    border: 'border-[#FF4444]/50',
    text: 'text-[#FF4444]',
    bracket: '[ ]',
    shadow: '',
  },
  current: {
    bg: 'bg-[#FFB800]/30',
    border: 'border-[#FFB800]',
    text: 'text-white',
    bracket: '[→]',
    shadow: 'shadow-[0_0_12px_rgba(255,184,0,0.45)]',
  },
  visited: {
    bg: 'bg-[#00C896]/25',
    border: 'border-[#00C896]',
    text: 'text-white',
    bracket: '[✓]',
    shadow: '',
  },
} as const;

function formatExtraValue(
  nodeId: string,
  mode: VisitedArrayPanelProps['mode'],
  extraData?: Record<string, any>
): string | null {
  if (!extraData || mode === 'default') return null;
  const val = extraData[nodeId];
  if (val === undefined || val === null) return null;

  switch (mode) {
    case 'distance':
      return val === Infinity ? '∞' : String(val);
    case 'color':
      return String(val);
    case 'indegree':
      return String(val);
    default:
      return String(val);
  }
}

export function VisitedArrayPanel({
  nodes,
  visitedOrder,
  currentNode,
  title = 'VISITED ARRAY',
  mode = 'default',
  extraData,
}: VisitedArrayPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current node
  useEffect(() => {
    if (!collapsed && currentRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = currentRef.current;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      // Only scroll if the element is outside the visible area
      if (
        elRect.left < containerRect.left ||
        elRect.right > containerRect.right
      ) {
        const targetScrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentNode, collapsed]);

  const hasExtra = mode !== 'default' && extraData;

  return (
    <div className="w-full flex flex-col bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden shrink-0 font-sans">
      {/* Header */}
      <div
        className="h-[36px] px-3 flex items-center justify-between bg-[var(--pill-bg)] cursor-pointer hover:bg-[var(--border-color)]/30 transition-colors select-none"
        onClick={() => setCollapsed((c) => !c)}
      >
        <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
          <span className="text-[#00C896]">✓</span> {title}
          <span className="text-[9px] font-mono text-[var(--muted-color)]/60">
            ({visitedOrder.length}/{nodes.length})
          </span>
        </h3>
        <button className="text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors cursor-pointer">
          <svg
            className={`w-3.5 h-3.5 transform transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div
          ref={scrollRef}
          className="flex gap-2.5 p-3 overflow-x-auto custom-scrollbar"
        >
          {nodes.map((node, idx) => {
            const status = getNodeStatus(node.id, visitedOrder, currentNode);
            const config = statusConfig[status];
            const extra = formatExtraValue(node.id, mode, extraData);
            const isCurrent = status === 'current';

            return (
              <div key={node.id} className="flex flex-col items-center flex-shrink-0">
                <div
                  ref={isCurrent ? currentRef : undefined}
                  className={`
                    flex-shrink-0 flex flex-col items-center justify-center
                    w-[36px] rounded-md border
                    ${config.bg} ${config.border} ${config.shadow}
                    transition-all duration-300
                    ${hasExtra ? 'h-[54px]' : 'h-[46px]'}
                  `}
                >
                  {/* Status bracket */}
                  <span
                    className={`text-[12px] font-mono font-semibold leading-none ${config.text} ${
                      isCurrent ? 'animate-pulse' : ''
                    }`}
                  >
                    {config.bracket}
                  </span>

                  {/* Node ID */}
                  <span
                    className={`text-[10px] font-mono font-semibold leading-tight mt-1 ${config.text}`}
                  >
                    {node.label || node.id}
                  </span>

                  {/* Extra value */}
                  {hasExtra && (
                    <span className="text-[9px] font-mono text-[var(--muted-color)] leading-none mt-0.5">
                      {extra ?? '—'}
                    </span>
                  )}
                </div>
                {/* Index label */}
                <span className="text-[9px] font-mono font-normal text-[var(--muted-color)] mt-1 select-none">
                  {idx}
                </span>
              </div>
            );
          })}

          {nodes.length === 0 && (
            <span className="text-[11px] text-[var(--muted-color)] font-mono py-2 px-1">
              No nodes
            </span>
          )}
        </div>
      )}
    </div>
  );
}
