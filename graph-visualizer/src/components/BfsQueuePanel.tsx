import { useState, useRef, useEffect } from 'react';

export interface BfsQueuePanelProps {
  items: any[];
  title?: string;
  queueType?: 'bfs' | 'priority' | 'dfs-stack' | 'bipartite';
  formatItem?: (item: any) => string;
  colorItem?: (item: any, index: number) => string;
  emptyMessage?: string;
}

/** Default formatter based on queue type */
function defaultFormatItem(
  item: any,
  queueType: BfsQueuePanelProps['queueType']
): string {
  if (typeof item === 'string' || typeof item === 'number') return String(item);

  if (queueType === 'priority' && item && typeof item === 'object') {
    const id = item.id ?? item.node ?? item.name ?? '';
    const dist = item.dist ?? item.distance ?? item.cost ?? item.priority ?? '';
    return `${id} (${dist === Infinity ? '∞' : dist})`;
  }

  if (Array.isArray(item)) return item.join(',');
  if (item && typeof item === 'object') {
    return item.id ?? item.node ?? item.label ?? JSON.stringify(item);
  }
  return String(item);
}

const titleDefaults: Record<string, string> = {
  bfs: 'BFS QUEUE',
  priority: 'PRIORITY QUEUE',
  'dfs-stack': 'DFS STACK',
  bipartite: 'BFS QUEUE',
};

const iconMap: Record<string, string> = {
  bfs: '📥',
  priority: '⚡',
  'dfs-stack': '📚',
  bipartite: '🎨',
};

export function BfsQueuePanel({
  items,
  title,
  queueType = 'bfs',
  formatItem,
  colorItem,
  emptyMessage = 'Empty',
}: BfsQueuePanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(items.length);

  const resolvedTitle = title ?? titleDefaults[queueType] ?? 'QUEUE';
  const icon = iconMap[queueType] ?? '📥';
  const isDfsStack = queueType === 'dfs-stack';

  // Auto-scroll to the latest item when items change
  useEffect(() => {
    if (!collapsed && scrollRef.current && items.length > prevCountRef.current) {
      if (isDfsStack) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollTo({
          left: scrollRef.current.scrollWidth,
          behavior: 'smooth',
        });
      }
    }
    prevCountRef.current = items.length;
  }, [items.length, collapsed, isDfsStack]);

  /** Determine pill classes for a given item at index */
  function getPillClasses(index: number): string {
    // If custom colorItem is provided, use it for background
    if (colorItem) {
      return 'border rounded-lg';
    }

    if (isDfsStack) {
      // Top of stack = index 0 after reversal
      const isTop = index === 0;
      if (isTop) {
        return [
          'bg-[#FFB800]/20 border-[#FFB800] text-[#FFB800]',
          'shadow-[0_0_8px_rgba(255,184,0,0.4)]',
          'rounded-lg border',
        ].join(' ');
      }
      return 'bg-[#7C3AED]/15 border-[#7C3AED]/40 text-purple-300 rounded-lg border';
    }

    // BFS / priority / bipartite
    const isFront = index === 0;
    if (isFront) {
      return [
        'bg-[#FFB800]/20 border-[#FFB800] text-[#FFB800]',
        'shadow-[0_0_8px_rgba(255,184,0,0.4)]',
        'rounded-lg border',
      ].join(' ');
    }
    return 'bg-[#3B82F6]/15 border-[#3B82F6]/40 text-[#93C5FD] rounded-lg border';
  }



  return (
    <div className="w-full flex flex-col bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden shrink-0 font-sans">
      {/* Header */}
      <div
        className="h-[36px] px-3 flex items-center justify-between bg-[var(--pill-bg)] cursor-pointer hover:bg-[var(--border-color)]/30 transition-colors select-none"
        onClick={() => setCollapsed((c) => !c)}
      >
        <h3 className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
          <span>{icon}</span> {resolvedTitle}
          {items.length > 0 && (
            <span className="text-[10px] font-mono font-medium text-[var(--muted-color)] bg-[var(--input-bg)] px-1.5 py-0.5 rounded-full border border-[var(--border-color)]">
              {items.length}
            </span>
          )}
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
        <>
          {items.length === 0 ? (
            <div className="flex items-center justify-center py-3 px-2">
              <span className="text-[11px] text-[var(--muted-color)] font-mono italic">
                {emptyMessage}
              </span>
            </div>
          ) : isDfsStack ? (
            <div
              ref={scrollRef}
              className="flex flex-col gap-1.5 p-2 overflow-y-auto custom-scrollbar max-h-[200px]"
            >
              {[...items].reverse().map((item, i) => {
                const label = formatItem
                  ? formatItem(item)
                  : defaultFormatItem(item, queueType);
                const customColor = colorItem ? colorItem(item, i) : undefined;

                return (
                  <div
                    key={`${label}-${i}`}
                    className={`
                      px-3 py-1.5 font-mono text-[11px] font-bold text-center
                      transition-all duration-300
                      animate-slide-down-fade
                      ${getPillClasses(i)}
                    `}
                    style={customColor ? { backgroundColor: customColor + '26', borderColor: customColor + '66', color: customColor } : undefined}
                  >
                    {i === 0 && (
                      <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-color)] block mb-0.5 font-sans">
                        top
                      </span>
                    )}
                    {label}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-1.5 p-2 overflow-x-auto custom-scrollbar items-center"
            >
              {items.map((item, i) => {
                const label = formatItem
                  ? formatItem(item)
                  : defaultFormatItem(item, queueType);
                const customColor = colorItem ? colorItem(item, i) : undefined;

                return (
                  <div
                    key={`${label}-${i}`}
                    className={`
                      flex-shrink-0 px-3 py-1.5 font-mono text-[11px] font-bold
                      transition-all duration-300
                      animate-slide-down-fade
                      ${getPillClasses(i)}
                    `}
                    style={
                      customColor
                        ? {
                            backgroundColor: customColor + '26',
                            borderColor: customColor + '66',
                            color: customColor,
                          }
                        : undefined
                    }
                  >
                    {i === 0 && (
                      <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-color)] block mb-0.5 font-sans">
                        front
                      </span>
                    )}
                    {label}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
