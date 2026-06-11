import { useRef, useEffect } from 'react';

export interface QueuePanelProps {
  type: 'bfs' | 'dfs-stack' | 'priority' | 'topo' | 'bipartite' | 'islands' | 'bfs-parent' | 'none';
  items: any[];
  formatItem: (item: any) => string;
  colorItem?: (item: any, index: number) => {
    bg: string;
    border: string;
    text: string;
  };
  title?: string; // override default header
}

const defaultTitles: Record<string, string> = {
  bfs: 'BFS QUEUE',
  'dfs-stack': 'DFS CALL STACK',
  priority: 'PRIORITY QUEUE',
  topo: 'TOPO QUEUE',
  bipartite: 'BFS QUEUE',
  islands: 'BFS QUEUE',
  'bfs-parent': 'BFS QUEUE',
};

export function QueuePanel({
  type,
  items,
  formatItem,
  colorItem,
  title,
}: QueuePanelProps) {
  const prevItemsLength = useRef(items.length);

  useEffect(() => {
    prevItemsLength.current = items.length;
  }, [items.length]);

  if (type === 'none') return null;

  const resolvedTitle = title ?? defaultTitles[type] ?? 'QUEUE';
  
  const directionText =
    title === 'EDGE RELAXATION'
      ? 'CURRENT EDGE'
      : title === 'TREESET'
      ? 'Auto-sorted • No duplicates'
      : type === 'dfs-stack'
      ? 'TOP (current) ↑ ↓ BOTTOM'
      : type === 'topo'
      ? 'NEXT TO PROCESS → → →'
      : 'FRONT → → → BACK';

  const isDfsStack = type === 'dfs-stack';

  // Reverse items for DFS stack so that index 0 is TOP (most recent call)
  const renderedItems = isDfsStack ? [...items].reverse() : items;

  // Default color resolver if no custom colorItem is provided
  const getColors = (item: any, index: number) => {
    if (colorItem) {
      return colorItem(item, index);
    }

    const isFirst = index === 0;

    switch (type) {
      case 'dfs-stack':
        return isFirst
          ? {
              bg: 'rgba(255, 184, 0, 0.3)',
              border: '#FFB800',
              text: '#ffffff',
            }
          : {
              bg: 'rgba(124, 58, 237, 0.2)',
              border: '#7C3AED',
              text: '#A78BFA',
            };

      case 'priority':
        return isFirst
          ? {
              bg: 'rgba(255, 184, 0, 0.3)',
              border: '#FFB800',
              text: '#ffffff',
            }
          : {
              bg: 'rgba(59, 130, 246, 0.15)',
              border: '#3b82f6',
              text: '#60a5fa',
            };

      case 'topo':
        return isFirst
          ? {
              bg: 'rgba(0, 200, 150, 0.35)',
              border: '#00C896',
              text: '#ffffff',
            }
          : {
              bg: 'rgba(0, 200, 150, 0.2)',
              border: '#00C896',
              text: '#00C896',
            };

      case 'bipartite': {
        const color = item?.color;
        if (color === 0) {
          return {
            bg: 'rgba(255, 184, 0, 0.25)',
            border: '#FFB800',
            text: '#FFB800',
          };
        }
        if (color === 1) {
          return {
            bg: 'rgba(255, 107, 0, 0.25)',
            border: '#FF6B00',
            text: '#FF6B00',
          };
        }
        return {
          bg: 'rgba(255, 68, 68, 0.2)',
          border: '#FF4444',
          text: '#FF4444',
        };
      }

      case 'bfs':
      case 'islands':
      case 'bfs-parent':
      default:
        return isFirst
          ? {
              bg: 'rgba(255, 184, 0, 0.3)',
              border: '#FFB800',
              text: '#ffffff',
            }
          : {
              bg: 'rgba(255, 140, 0, 0.2)',
              border: '#FF8C00',
              text: '#FF8C00',
            };
    }
  };

  return (
    <div className="w-full flex flex-col mb-3 shrink-0 select-none font-sans">
      {/* Dynamic styles injected inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-20px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 200ms ease forwards;
        }
        .animate-slide-in-down {
          animation: slideInDown 200ms ease forwards;
        }
      `}} />

      {/* Header row */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-color)]">
          {resolvedTitle}
        </span>
        <span className="text-[10px] font-mono font-medium bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-2 py-0.5 text-[var(--text-color)]">
          Size: {items.length}
        </span>
      </div>

      {/* Direction indicator */}
      {items.length > 0 && (
        <div className="text-[9px] text-[var(--muted-color)] opacity-60 tracking-[0.06em] mb-1.5 uppercase font-semibold">
          {directionText}
        </div>
      )}

      {/* Queue content area */}
      <div
        className={`w-full bg-[var(--input-bg)]/60 border border-[var(--border-color)] rounded-lg p-2 min-h-[44px] flex ${
          isDfsStack
            ? 'flex-col items-stretch gap-1'
            : 'flex-row flex-wrap gap-1.5 items-center'
        }`}
      >
        {renderedItems.length === 0 ? (
          <div className="w-full text-center py-1.5 text-[11px] text-[var(--muted-color)] font-mono italic">
            {isDfsStack ? 'Stack empty' : 'Queue empty'}
          </div>
        ) : (
          renderedItems.map((item, index) => {
            const isFirst = index === 0;
            const colors = getColors(item, index);
            const label = formatItem(item);
            
            // Generate enter animation class if items were added
            const animationClass = isDfsStack
              ? 'animate-slide-in-down'
              : 'animate-slide-in-right';

            return (
              <div
                key={`${label}-${index}`}
                className={`flex flex-col ${isDfsStack ? 'items-center w-full' : 'items-start'} ${animationClass}`}
              >
                {/* FIRST item top label */}
                {isFirst && (
                  <span className="text-[8px] uppercase tracking-[0.06em] text-[var(--muted-color)] opacity-70 mb-0.5 font-semibold">
                    {isDfsStack ? 'TOP' : title === 'TREESET' ? 'SET.FIRST()' : 'FRONT'}
                  </span>
                )}
                <div
                  className={`
                    font-mono font-bold text-[11px] leading-none
                    flex items-center justify-center border transition-all duration-300
                    ${isDfsStack ? 'w-full py-2 rounded-md' : 'px-2.5 h-[28px] rounded-full'}
                    ${isFirst && !isDfsStack ? 'h-[30px] px-3' : ''}
                  `}
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                    borderWidth: isFirst ? '1.5px' : '1px',
                    boxShadow: isFirst ? `0 0 10px ${colors.border}4D` : undefined,
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
