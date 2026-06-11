import { useEffect, useRef, useState } from 'react';
import { useIslandsStore } from '../../stores/useIslandsStore';
import { CopyDownloadButtons } from '../../components/CopyDownloadButtons';

const ISLAND_COLORS = [
  '#7C3AED', // Island 1: purple
  '#0891B2', // Island 2: cyan
  '#DC2626', // Island 3: red
  '#D97706', // Island 4: amber
  '#059669', // Island 5: emerald
  '#DB2777', // Island 6: pink
];

const pseudoCodeLeetCode = [
  "numIslands(grid):", // 1
  "  vis[n][m] = all zeros", // 2
  "  count = 0", // 3
  "  for each cell (row, col):", // 4
  "    if grid[row][col]=='1' and not vis:", // 5
  "      count++", // 6
  "      bfs(row, col, vis, grid)", // 7
  "  return count", // 8
  "", // 9
  "bfs(row, col, vis, grid):", // 10
  "  enqueue (row, col)", // 11
  "  mark vis[row][col] = 1", // 12
  "  dRow = [-1, 0, 1, 0]", // 13
  "  dCol = [0, 1, 0, -1]", // 14
  "  while queue not empty:", // 15
  "    (r, c) = dequeue", // 16
  "    for i in 0..3:", // 17
  "      nRow = r + dRow[i]", // 18
  "      nCol = c + dCol[i]", // 19
  "      if inBounds and '1' and not vis:", // 20
  "        vis[nRow][nCol] = 1", // 21
  "        enqueue (nRow, nCol)" // 22
];

const javaCodeLeetCode = [
  "class Solution {", // 1
  "    private void bfs(int row, int col,", // 2
  "                     int[][] vis, char[][] grid) {", // 3
  "        int n = grid.length;", // 4
  "        int m = grid[0].length;", // 5
  "        Queue<Pair> q = new LinkedList<>();", // 6
  "        // Initialize queue", // 7
  "        q.add(new Pair(row, col));", // 8
  "        vis[row][col] = 1;", // 9
  "        int[] dRow = {-1, 0, 1, 0};", // 10
  "        int[] dCol = {0, 1, 0, -1};", // 11
  "        while (!q.isEmpty()) {", // 12
  "            Pair curr = q.poll();", // 13
  "            for (int i = 0; i < 4; i++) {", // 14
  "                int nRow = curr.row + dRow[i];", // 15
  "                int nCol = curr.col + dCol[i];", // 16
  "                if (nRow >= 0 && nRow < n &&", // 17
  "                    nCol >= 0 && nCol < m &&", // 18
  "                    grid[nRow][nCol] == '1' &&", // 19
  "                    vis[nRow][nCol] == 0) {", // 20
  "                    vis[nRow][nCol] = 1;", // 21
  "                    q.add(new Pair(nRow, nCol));", // 22
  "                }", // 23
  "            }", // 24
  "        }", // 25
  "    }", // 26
  "    // Helper fields", // 27
  "    // Scan grid", // 28
  "    public int numIslands(char[][] grid) {", // 29
  "        int n = grid.length; int m = grid[0].length;", // 30
  "        int[][] vis = new int[n][m]; int count = 0;", // 31
  "        for (int row = 0; row < n; row++) {", // 32
  "            for (int col = 0; col < m; col++) {", // 33
  "                if (grid[row][col] == '1' && vis[row][col] == 0) {", // 34
  "                    count++;", // 35
  "                    bfs(row, col, vis, grid);", // 36
  "                }", // 37
  "            }", // 38
  "        }", // 39
  "        return count;", // 40
  "    }", // 41
  "}" // 42
];

const pseudoCodeGfg = [
  "numIslands(grid):", // 1
  "  vis[n][m] = all zeros", // 2
  "  cnt = 0", // 3
  "  for each cell (row, col):", // 4
  "    if not vis and grid=='1':", // 5
  "      cnt++", // 6
  "      bfs(row, col, vis, grid)", // 7
  "  return cnt", // 8
  "", // 9
  "bfs(ro, co, vis, grid):", // 10
  "  mark vis[ro][co] = 1", // 11
  "  enqueue (ro, co)", // 12
  "  while queue not empty:", // 13
  "    (row, col) = dequeue", // 14
  "    for delrow in -1..1:", // 15
  "      for delcol in -1..1:", // 16
  "        nrow = row + delrow", // 17
  "        ncol = col + delcol", // 18
  "        if inBounds and '1' and not vis:", // 19
  "          vis[nrow][ncol] = 1", // 20
  "          enqueue (nrow, ncol)" // 21
];

const javaCodeGfg = [
  "class Solution {", // 1
  "    private void bfs(int ro, int co,", // 2
  "                     int[][] vis, char[][] grid) {", // 3
  "        // Initialize visit", // 4
  "        // Start traversal", // 5
  "        vis[ro][co] = 1;", // 6
  "        Queue<Pair> q = new LinkedList<>();", // 7
  "        q.add(new Pair(ro, co));", // 8
  "        int n = grid.length;", // 9
  "        int m = grid[0].length;", // 10
  "        while (!q.isEmpty()) {", // 11
  "            int row = q.peek().first;", // 12
  "            int col = q.peek().second; q.remove();", // 13
  "            // Check 8 directions", // 14
  "            for (int delrow = -1; delrow <= 1; delrow++) {", // 15
  "                // inner loop", // 16
  "                for (int delcol = -1; delcol <= 1; delcol++) {", // 17
  "                    // Calculate nrow", // 18
  "                    int nrow = row + delrow;", // 19
  "                    int ncol = col + delcol;", // 20
  "                    if (nrow >= 0 && nrow < n &&", // 21
  "                        ncol >= 0 && ncol < m &&", // 22
  "                        grid[nrow][ncol] == '1' &&", // 23
  "                        vis[nrow][ncol] == 0) {", // 24
  "                        vis[nrow][ncol] = 1;", // 25
  "                        q.add(new Pair(nrow, ncol));", // 26
  "                    }", // 27
  "                }", // 28
  "            }", // 29
  "        }", // 30
  "    }", // 31
  "    // Grid scan", // 32
  "    public int numIslands(char[][] grid) {", // 33
  "        int n = grid.length; int m = grid[0].length;", // 34
  "        int[][] vis = new int[n][m]; int cnt = 0;", // 35
  "        for (int row = 0; row < n; row++) {", // 36
  "            for (int col = 0; col < m; col++) {", // 37
  "                if (vis[row][col] == 0 && grid[row][col] == '1') {", // 38
  "                    cnt++;", // 39
  "                    bfs(row, col, vis, grid);", // 40
  "                }", // 41
  "            }", // 42
  "        }", // 43
  "        return cnt;", // 44
  "    }", // 45
  "}" // 46
];

function syntaxHighlight(code: string, isJava: boolean) {
  if (!isJava) {
    if (code.trim().startsWith('//') || code.trim().startsWith('#')) {
      return <span className="text-gray-500 italic">{code}</span>;
    }
    const pseudoKeywords = ['for', 'each', 'if', 'return', 'while', 'in', 'and', 'not', 'or', 'to'];
    const tokens = code.split(/([ \(\)\{\}\[\]\.\,;\<\>])/g);
    return tokens.map((token, i) => {
      if (pseudoKeywords.includes(token)) return <span key={i} className="text-blue-400">{token}</span>;
      return token;
    });
  }

  if (code.trim().startsWith('//')) {
    return <span className="text-gray-500 italic">{code}</span>;
  }
  const keywords = ['public', 'private', 'void', 'int', 'return', 'if', 'else', 'while', 'for', 'new', 'class'];
  const types = ['Queue', 'LinkedList', 'char', 'Map', 'Set', 'HashSet', 'HashMap', 'Pair'];
  const tokens = code.split(/([ \(\)\{\}\[\]\.\,;\<\>])/g);
  return tokens.map((token, i) => {
    if (keywords.includes(token)) return <span key={i} className="text-blue-400">{token}</span>;
    if (types.includes(token)) return <span key={i} className="text-emerald-400">{token}</span>;
    return token;
  });
}

export function IslandsRightPanel({ activeRightTab }: { activeRightTab: 'graph' | 'code' | 'trace' }) {
  const { grid, steps, cur, version } = useIslandsStore();
  const [isPseudoCode, setIsPseudoCode] = useState(true);
  const [panelWidth, setPanelWidth] = useState(350);

  const [showTracePill, setShowTracePill] = useState(false);
  const userScrolledUp = useRef<boolean>(false);
  const scrollPositions = useRef({
    graph: 0,
    code: 0,
    trace: 0
  });

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const traceContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!outerContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setPanelWidth(entry.contentRect.width);
      }
    });
    observer.observe(outerContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = panelWidth < 450;

  const currentStep = steps[cur] || null;
  const activeLine = currentStep?.codeLineActive || 0;

  // Derive counts
  let rows = grid.length;
  let cols = rows > 0 ? grid[0].length : 0;
  let totalLand = 0;
  let totalWater = 0;
  grid.forEach(row => row.forEach(val => {
    if (val === 1) totalLand++;
    else totalWater++;
  }));

  // Build Adjacency List for original grid
  const landCells: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) landCells.push([r, c]);
    }
  }

  const getNeighbors = (r: number, c: number) => {
    const list: [number, number][] = [];
    const dirs = version === 'leetcode'
      ? [[-1, 0], [1, 0], [0, -1], [0, 1]]
      : [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        list.push([nr, nc]);
      }
    }
    return list;
  };

  // Handle manual scroll in TRACE tab
  const handleTraceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    scrollPositions.current.trace = el.scrollTop;
    
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    userScrolledUp.current = !isAtBottom;
    setShowTracePill(!isAtBottom);
  };

  // Scroll to active trace step
  const handleScrollToActiveTrace = () => {
    userScrolledUp.current = false;
    setShowTracePill(false);
    if (traceContainerRef.current) {
      const activeEntry = traceContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEntry) {
        const container = traceContainerRef.current;
        const elementTop = activeEntry.offsetTop;
        const elementHeight = activeEntry.offsetHeight;
        const containerHeight = container.clientHeight;
        
        if (elementTop + elementHeight > container.scrollTop + containerHeight) {
          container.scrollTo({
            top: elementTop - containerHeight + elementHeight,
            behavior: 'smooth'
          });
        } else if (elementTop < container.scrollTop) {
          container.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // Auto-scroll trace when step changes
  useEffect(() => {
    if (!traceContainerRef.current) return;
    if (userScrolledUp.current) return;
    
    const activeEntry = traceContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeEntry) {
      const container = traceContainerRef.current;
      const elementTop = activeEntry.offsetTop;
      const elementHeight = activeEntry.offsetHeight;
      const containerHeight = container.clientHeight;
      
      if (elementTop + elementHeight > container.scrollTop + containerHeight) {
        container.scrollTo({
          top: elementTop - containerHeight + elementHeight,
          behavior: 'smooth'
        });
      } else if (elementTop < container.scrollTop) {
        container.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }
  }, [cur]);

  // Reset userScrolledUp when a new algorithm starts
  const stepsLength = steps.length;
  const firstStepId = stepsLength > 0 ? steps[0].id : null;
  useEffect(() => {
    userScrolledUp.current = false;
    setShowTracePill(false);
    if (traceContainerRef.current) {
      traceContainerRef.current.scrollTop = 0;
    }
  }, [firstStepId]);

  // Reset userScrolledUp when user switches to TRACE tab
  useEffect(() => {
    if (activeRightTab === 'trace') {
      userScrolledUp.current = false;
      setShowTracePill(false);
    }
  }, [activeRightTab]);

  // Smooth scroll active line during normal playback
  useEffect(() => {
    if (activeRightTab === 'code' && codeContainerRef.current) {
      const activeLineEl = codeContainerRef.current.querySelector('[data-active-line="true"]') as HTMLElement;
      if (activeLineEl) {
        const container = codeContainerRef.current;
        const targetScrollTop = activeLineEl.offsetTop - (container.clientHeight / 2) + (activeLineEl.offsetHeight / 2);
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeLine]);

  // Tab Switch Scroll Memory and Restoration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeRightTab === 'graph' && graphContainerRef.current) {
        graphContainerRef.current.scrollTop = scrollPositions.current.graph;
      } else if (activeRightTab === 'code' && codeContainerRef.current) {
        const activeLineEl = codeContainerRef.current.querySelector('[data-active-line="true"]') as HTMLElement;
        if (activeLineEl) {
          const container = codeContainerRef.current;
          const targetScrollTop = activeLineEl.offsetTop - (container.clientHeight / 2) + (activeLineEl.offsetHeight / 2);
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'instant' as any
          });
        } else {
          codeContainerRef.current.scrollTop = scrollPositions.current.code;
        }
      } else if (activeRightTab === 'trace' && traceContainerRef.current) {
        if (!userScrolledUp.current) {
          const activeEntry = traceContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
          if (activeEntry) {
            const container = traceContainerRef.current;
            const elementTop = activeEntry.offsetTop;
            const elementHeight = activeEntry.offsetHeight;
            const containerHeight = container.clientHeight;
            
            if (elementTop + elementHeight > container.scrollTop + containerHeight) {
              container.scrollTo({
                top: elementTop - containerHeight + elementHeight,
                behavior: 'instant' as any
              });
            } else if (elementTop < container.scrollTop) {
              container.scrollTo({
                top: elementTop,
                behavior: 'instant' as any
              });
            }
          } else {
            traceContainerRef.current.scrollTop = 0;
          }
        } else {
          traceContainerRef.current.scrollTop = scrollPositions.current.trace;
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeRightTab]);

  if (activeRightTab === 'graph') {
    const queue = currentStep?.queue || [];
    const islandMap = currentStep?.islandMap || {};
    const currCell = currentStep?.currentCell;

    // Legends cell counts
    const islandCounts: Record<number, number> = {};
    if (currentStep) {
      Object.entries(currentStep.islandMap).forEach(([_, idx]) => {
        islandCounts[idx] = (islandCounts[idx] || 0) + 1;
      });
    }

    return (
      <div 
        ref={graphContainerRef}
        onScroll={(e) => {
          scrollPositions.current.graph = e.currentTarget.scrollTop;
        }}
        className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-4 gap-6 custom-scrollbar min-h-0 bg-[var(--panel-bg)]"
        style={{ height: 0 }}
      >
        {/* GRID INFO */}
        <div className="flex flex-col gap-2 font-sans">
          <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
            Grid Info
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">Rows</div>
              <div className="text-[14px] font-mono font-bold text-emerald-400 mt-0.5">{rows}</div>
            </div>
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">Cols</div>
              <div className="text-[14px] font-mono font-bold text-emerald-400 mt-0.5">{cols}</div>
            </div>
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">Land</div>
              <div className="text-[14px] font-mono font-bold text-emerald-400 mt-0.5">{totalLand}</div>
            </div>
            <div className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2">
              <div className="text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-[0.06em]">Water</div>
              <div className="text-[14px] font-mono font-bold text-emerald-400 mt-0.5">{totalWater}</div>
            </div>
          </div>
        </div>

        {/* ISLAND LEGEND */}
        <div className="flex flex-col gap-2 font-sans">
          <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1">
            Island Legend
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentStep && currentStep.islandsCount > 0 ? (
              Array.from({ length: currentStep.islandsCount }).map((_, idx) => {
                const id = idx + 1;
                const color = ISLAND_COLORS[(id - 1) % ISLAND_COLORS.length];
                const count = islandCounts[id] || 0;
                return (
                  <div
                    key={`legend-${id}`}
                    className="flex items-center gap-2 px-3 py-1 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full animate-fadeInUp text-[11px] font-mono font-medium"
                    style={{ borderColor: `${color}40` }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="font-semibold" style={{ color }}>Island {id}</span>
                    <span className="text-[var(--muted-color)] font-mono font-medium">[{count} cells]</span>
                  </div>
                );
              })
            ) : (
              <span className="text-[11px] text-[var(--muted-color)] italic">No islands found yet</span>
            )}
          </div>
        </div>

        {/* CELL NEIGHBORS (ADJACENCY LIST) */}
        <div className="flex flex-col gap-2 flex-grow overflow-hidden min-h-[160px]">
          <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em] border-b border-[var(--border-color)] pb-1 font-sans">
            Cell Neighbors
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 custom-scrollbar">
            {landCells.map(([r, c]) => {
              const coord = `${r},${c}`;
              const neighbors = getNeighbors(r, c);
              const isCurrent = currCell && currCell[0] === r && currCell[1] === c;
              const isVisited = currentStep?.visited.has(coord);
              const islandId = isVisited ? islandMap[coord] || 1 : null;
              const islandColor = islandId ? ISLAND_COLORS[(islandId - 1) % ISLAND_COLORS.length] : null;

              // Compute highlighting classes
              let bgClass = "bg-[var(--input-bg)]";
              let borderStyle = {};
              if (isCurrent) {
                bgClass = "bg-[#FFB800]/10";
                borderStyle = { borderLeft: "3px solid #FFB800" };
              } else if (isVisited && islandColor) {
                bgClass = "";
                borderStyle = { borderLeft: `3px solid ${islandColor}`, backgroundColor: `${islandColor}12` };
              }

              return (
                <div
                  key={`adj-${coord}`}
                  className={`flex items-center justify-between p-2 rounded-lg border border-[var(--border-color)] text-[13px] font-mono transition-all duration-200 ${bgClass}`}
                  style={borderStyle}
                >
                  <span className={`font-bold ${isCurrent ? 'text-[#FFB800]' : (islandColor ? '' : 'text-emerald-400')}`} style={!isCurrent && islandColor ? { color: islandColor } : {}}>
                    [{r},{c}]
                  </span>
                  <span className="text-[var(--muted-color)] font-sans">→</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                    {neighbors.length > 0 ? (
                      neighbors.map(([nr, nc]) => {
                        const nCoord = `${nr},${nc}`;
                        const nInQueue = queue.some(q => q[0] === nr && q[1] === nc);
                        const nIsVisited = currentStep?.visited.has(nCoord);
                        const nIslandId = nIsVisited ? islandMap[nCoord] || 1 : null;
                        const nIslandColor = nIslandId ? ISLAND_COLORS[(nIslandId - 1) % ISLAND_COLORS.length] : null;

                        let pillBg = "bg-black/30";
                        let pillColor = "text-[var(--muted-color)]";

                        if (nInQueue) {
                          pillBg = "bg-[#FF8C00]/15";
                          pillColor = "text-[#FF8C00]";
                        } else if (nIsVisited && nIslandColor) {
                          pillBg = `${nIslandColor}18`;
                          pillColor = "text-white";
                        }

                        return (
                          <span
                            key={`n-${nCoord}`}
                            className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-medium border ${pillColor} ${pillBg}`}
                            style={nIsVisited && nIslandColor ? { borderColor: nIslandColor, backgroundColor: `${nIslandColor}18` } : {}}
                          >
                            [{nr},{nc}]
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[10px] text-gray-600 italic">none</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BFS QUEUE */}
        <div className="flex flex-col gap-2 shrink-0 font-sans">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-1">
            <h3 className="text-[10px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">
              BFS Queue
            </h3>
            <span className="px-1.5 py-0.5 rounded-[4px] bg-[#FF8C00]/15 text-[#FF8C00] font-mono text-[10px] uppercase font-semibold border border-[#FF8C00]/40">
              Size: {queue.length}
            </span>
          </div>

          <div className="bg-black/20 p-3 rounded-lg border border-[var(--border-color)] flex flex-col gap-2">
            {queue.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {queue.map(([qr, qc]) => (
                    <span
                      key={`q-${qr}-${qc}`}
                      className="px-2 py-0.5 rounded text-[11px] border border-[#FF8C00] bg-[#FF8C00]/15 text-[#FF8C00] font-mono font-bold transition-all duration-200"
                    >
                      [{qr},{qc}]
                    </span>
                  ))}
                </div>
                <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.06em] text-[var(--muted-color)] flex justify-between mt-1">
                  <span>Front (pop)</span>
                  <span>Back (push)</span>
                </div>
              </>
            ) : (
              <div className="text-[11px] text-[var(--muted-color)] italic">Queue empty</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeRightTab === 'code') {
    const codeLines = isPseudoCode 
      ? (version === 'leetcode' ? pseudoCodeLeetCode : pseudoCodeGfg) 
      : (version === 'leetcode' ? javaCodeLeetCode : javaCodeGfg);

    const islandAlgoKey = version === 'leetcode' ? 'number-of-islands-4dir' : 'number-of-islands-8dir';

    return (
      <div ref={outerContainerRef} className="flex-grow flex flex-col bg-[var(--panel-bg)] min-h-0 overflow-hidden font-sans" style={{ height: 0 }}>
        {/* Toggle + Complexity badges in code panel header */}
        <div 
          className={`px-3 flex border-b border-[var(--border-color)] bg-[var(--panel-bg)] shrink-0 ${
            isNarrow ? 'flex-col gap-2 py-2.5 h-auto' : 'h-[40px] flex-row items-center justify-between'
          }`}
        >
          {isNarrow ? (
            <>
              {/* Row 1 */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">💻</span>
                  <span className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">
                    {isPseudoCode ? 'Pseudo Code' : 'Java Source'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#FFB800]/30 bg-[#FFB800]/10 text-xs font-mono">
                    <span className="text-[8px] text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans font-semibold">Time</span>
                    <span className="text-[11px] font-mono text-[#FFB800] font-medium">O(M × N)</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#A855F7]/30 bg-[#A855F7]/10 text-xs font-mono">
                    <span className="text-[8px] text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans font-semibold">Space</span>
                    <span className="text-[11px] font-mono text-[#A855F7] font-medium">{version === 'leetcode' ? 'O(min(M, N))' : 'O(M × N)'}</span>
                  </div>
                </div>
              </div>
              
              {/* Row 2 */}
              <div className="flex items-center justify-between w-full border-t border-[var(--border-color)]/50 pt-2">
                <div className="flex items-center bg-[var(--input-bg)] rounded-[4px] p-[2px]">
                  <button 
                    onClick={() => setIsPseudoCode(true)}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors ${isPseudoCode ? 'bg-[var(--surface-elevated)] text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Pseudo
                  </button>
                  <button 
                    onClick={() => setIsPseudoCode(false)}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors ${!isPseudoCode ? 'bg-[var(--surface-elevated)] text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Java
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-[1px] bg-gray-700" />
                  <CopyDownloadButtons algorithmKey={islandAlgoKey} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">💻</span>
                <span className="text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-[0.08em]">
                  {isPseudoCode ? 'Pseudo Code' : 'Java Source'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 mr-2">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#FFB800]/30 bg-[#FFB800]/10 text-xs font-mono">
                    <span className="text-[8px] text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans font-semibold">Time</span>
                    <span className="text-[11px] font-mono text-[#FFB800] font-medium">O(M × N)</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#A855F7]/30 bg-[#A855F7]/10 text-xs font-mono">
                    <span className="text-[8px] text-[var(--muted-color)] uppercase tracking-[0.08em] font-sans font-semibold">Space</span>
                    <span className="text-[11px] font-mono text-[#A855F7] font-medium">{version === 'leetcode' ? 'O(min(M, N))' : 'O(M × N)'}</span>
                  </div>
                </div>

                <div className="flex items-center bg-[var(--input-bg)] rounded-[4px] p-[2px]">
                  <button 
                    onClick={() => setIsPseudoCode(true)}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors ${isPseudoCode ? 'bg-[var(--surface-elevated)] text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Pseudo
                  </button>
                  <button 
                    onClick={() => setIsPseudoCode(false)}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[3px] transition-colors ${!isPseudoCode ? 'bg-[var(--surface-elevated)] text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Java
                  </button>
                </div>
                <div className="h-4 w-[1px] bg-[var(--border-color)]" />
                <CopyDownloadButtons algorithmKey={islandAlgoKey} />
              </div>
            </>
          )}
        </div>

        {/* Code View */}
        <div 
          ref={codeContainerRef}
          onScroll={(e) => {
            scrollPositions.current.code = e.currentTarget.scrollTop;
          }}
          className="flex-1 overflow-y-auto p-3 text-[13px] font-mono font-normal leading-[1.7] custom-scrollbar bg-[var(--bg-primary)]"
        >
          <div className="flex">
            <div className="flex flex-col text-right pr-3 mr-3 border-r border-gray-800 text-[11px] text-[var(--muted-color)] font-mono select-none">
              {codeLines.map((_, i) => (
                <div key={i} className="py-[2px]">{i + 1}</div>
              ))}
            </div>
            <div className="flex flex-col flex-1">
              {codeLines.map((line, idx) => {
                const isActive = (idx + 1) === activeLine;
                return (
                  <div 
                    key={idx} 
                    data-active={isActive}
                    data-active-line={isActive}
                    className={`py-[2px] pl-2 -ml-2 transition-colors duration-200 whitespace-pre ${
                      isActive 
                        ? 'bg-blue-500/20 text-gray-100 border-l-[3px] border-blue-500' 
                        : 'text-gray-300 border-l-[3px] border-transparent'
                    }`}
                  >
                    {syntaxHighlight(line, !isPseudoCode)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeRightTab === 'trace') {
    // Execution Trace tab
    return (
      <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden" style={{ height: 0 }}>
        <div 
          ref={traceContainerRef}
          onScroll={handleTraceScroll}
          className="flex-grow overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar bg-[var(--panel-bg)] min-h-0"
        >
          {steps.length > 0 ? (
            steps.slice(0, cur + 1).slice().reverse().map((s, reverseIdx) => {
              const idx = cur - reverseIdx;
              const isActive = idx === cur;
              let icon = "🔍";
              let typeColor = "text-[var(--text-color)]";

              if (s.type === 'found-island') {
                icon = "🏝️";
                typeColor = "text-[#7C3AED] font-bold";
              } else if (s.type === 'enqueue' || s.type === 'enqueue-neighbor') {
                icon = "📥";
                typeColor = "text-[#FF8C00]";
              } else if (s.type === 'dequeue') {
                icon = "📤";
                typeColor = "text-[#FFB800]";
              } else if (s.type === 'flood' || s.type === 'flood-neighbor') {
                icon = "🌊";
                typeColor = "text-blue-400";
              } else if (s.type === 'island-complete') {
                icon = "✓";
                typeColor = "text-emerald-400 font-bold";
              } else if (s.type === 'complete') {
                icon = "✅";
                typeColor = "text-[#00C896] font-extrabold";
              } else if (s.type === 'check-neighbor') {
                icon = s.neighborCheck?.valid ? "🟢" : "🔴";
                typeColor = s.neighborCheck?.valid ? "text-emerald-500/70" : "text-red-500/70";
              }

              return (
                <div
                  key={`trace-${s.id}`}
                  data-active-trace={isActive}
                  data-active={isActive}
                  className={`py-1.5 px-2.5 rounded-lg border font-mono text-[12px] font-normal leading-[1.6] transition-all duration-200 flex gap-2.5 items-start ${
                    isActive 
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-sm font-semibold' 
                      : 'bg-[var(--input-bg)] border-[var(--border-color)] hover:bg-black/20'
                  }`}
                  style={isActive ? { borderLeftWidth: '3px' } : {}}
                >
                  <span className="shrink-0">{icon}</span>
                  <div className="flex-1 flex flex-col font-sans">
                    <div className={`leading-normal font-mono ${isActive ? 'font-semibold' : 'font-normal'} ${typeColor}`}>
                      {s.description}
                    </div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.06em] text-[var(--muted-color)] mt-0.5">
                      Step {s.id + 1} • Line {s.codeLineActive}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-[11px] text-[var(--muted-color)] italic text-center mt-4">
              Run algorithm to see trace entries
            </div>
          )}
        </div>
        {showTracePill && (
          <button
            onClick={handleScrollToActiveTrace}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#3b82f6]/90 border border-[#3b82f6] rounded-full px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-[0.06em] cursor-pointer z-10 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:bg-[#3b82f6] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ↓ Jump to current step
          </button>
        )}
      </div>
    );
  }

  return null;
}
