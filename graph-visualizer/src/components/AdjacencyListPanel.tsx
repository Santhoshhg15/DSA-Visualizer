import { useRef } from 'react';
import { useGraphStore } from '../stores/useGraphStore';

export function AdjacencyListPanel({ collapsed, onToggle }: { collapsed?: boolean, onToggle?: () => void }) {
  const { nodes, edges, graphType, currentPreset, steps, cur } = useGraphStore();
  const listRef = useRef<HTMLDivElement>(null);
  const currentRowRef = useRef<HTMLDivElement>(null);



  if (!currentPreset) {
    return (
      <div className={`w-full flex flex-col bg-[var(--panel-bg)] transition-all duration-300 font-sans ${collapsed ? 'h-[40px]' : 'flex-grow basis-[25%]'}`}>
        <div className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--panel-bg)]">
          <h3 className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
            <span className="text-purple-500">📝</span> Adjacency List
          </h3>
        </div>
        {!collapsed && (
          <div className="flex-1 flex items-center justify-center text-[12px] text-[var(--muted-color)] p-4 text-center font-normal">
            Select a graph to see adjacency list
          </div>
        )}
      </div>
    );
  }

  // Always compute from live graph or the store
  const adjList: Record<string, { id: string, weight?: number }[]> = {};
  
  nodes.forEach(n => {
    adjList[n.id] = [];
  });

  edges.forEach(edge => {
    adjList[edge.source]?.push({ id: edge.target, weight: edge.weight });
    if (!graphType.directed) {
      adjList[edge.target]?.push({ id: edge.source, weight: edge.weight });
    }
  });

  const displayNodes = nodes.map(n => n.id);

  const currentStepData = steps.length > 0 && cur >= 0 && cur < steps.length ? steps[cur] : null;
  const auxState = currentStepData?.auxiliaryState;
  const visitedOrder: string[] = auxState?.visitedOrder || [];
  const activeNodes: string[] = currentStepData?.highlightNodes || [];
  const currentNode = activeNodes.length > 0 ? activeNodes[0] : null;

  return (
    <div className={`w-full flex flex-col bg-[var(--panel-bg)] border-t border-[var(--border-color)] transition-all duration-300 font-sans ${collapsed ? 'h-[40px]' : 'flex-grow basis-[25%]'}`}>
      <div 
        className="h-[40px] px-3 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--panel-bg)] cursor-pointer hover:bg-[var(--input-bg)] transition-colors select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] flex items-center gap-2">
            <span className="text-purple-500">📝</span> Adjacency List
          </h3>
          {!collapsed && (
            <span className="text-[10px] font-mono font-medium text-[var(--text-color)] bg-[var(--input-bg)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
              {displayNodes.length} nodes
            </span>
          )}
        </div>
        <button className="text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors cursor-pointer">
          <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 custom-scrollbar bg-[var(--panel-bg)] min-h-[150px]">
          {displayNodes.map((nodeId) => {
            const neighbors = adjList[nodeId] || [];
            const isCurrent = nodeId === currentNode;
            const isVisited = visitedOrder.includes(nodeId) && !isCurrent;
            
            let bgClass = "bg-[var(--input-bg)]";
            let borderStyle = {};
            let textCls = "text-[var(--text-color)]";
            
            if (isCurrent) {
              bgClass = "bg-[#FFB800]/10";
              borderStyle = { borderLeft: "3px solid #FFB800", borderColor: "rgba(255, 184, 0, 0.4)" };
              textCls = "text-[#FFD166] font-bold";
            } else if (isVisited) {
              bgClass = "bg-[#00C896]/10";
              borderStyle = { borderLeft: "3px solid #00C896", borderColor: "rgba(0, 200, 150, 0.4)" };
              textCls = "text-[#00C896] font-semibold";
            }
            
            return (
              <div 
                key={nodeId} 
                ref={isCurrent ? currentRowRef : null}
                className={`flex items-center justify-between p-2 rounded-lg border border-[var(--border-color)] text-xs font-mono transition-all duration-200 ${bgClass}`}
                style={borderStyle}
              >
                <span className={`text-[13px] font-mono font-bold w-6 shrink-0 ${textCls}`}>{nodeId}</span>
                <span className="text-[var(--muted-color)] mx-2 shrink-0">→</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                  {neighbors.length === 0 ? (
                    <span className="text-[11px] text-[var(--muted-color)] italic font-mono">none</span>
                  ) : (
                    neighbors.map((neighbor, i) => {
                      const nIsCurrent = neighbor.id === currentNode;
                      const nIsVisited = visitedOrder.includes(neighbor.id) && !nIsCurrent;
                      
                      let pillBg = 'bg-black/30';
                      let pillBorder = 'border-[var(--border-color)]';
                      let pillText = 'text-[var(--muted-color)]';
                      
                      if (nIsCurrent) {
                        pillBg = 'bg-[#FFB800]/20';
                        pillBorder = 'border-[#FFB800]/50';
                        pillText = 'text-[#FFD166] font-bold';
                      } else if (nIsVisited) {
                        pillBg = 'bg-[#00C896]/20';
                        pillBorder = 'border-[#00C896]/50';
                        pillText = 'text-[#00C896] font-semibold';
                      }

                      let suffix = '';
                      if (graphType.weighted && neighbor.weight !== undefined) {
                        suffix = `:${neighbor.weight}`;
                      }
                      
                      return (
                        <span 
                          key={`${neighbor.id}-${i}`}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-medium border transition-all duration-200 ${pillBg} ${pillBorder} ${pillText}`}
                        >
                          {neighbor.id}{suffix}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
