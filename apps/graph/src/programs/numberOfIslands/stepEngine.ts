import type { IslandsStep } from '../../stores/useIslandsStore';

export function generateIslandsSteps(initialGrid: number[][], version: 'leetcode' | 'gfg' = 'leetcode'): IslandsStep[] {
  const steps: IslandsStep[] = [];
  const rows = initialGrid.length;
  if (rows === 0) return steps;
  const cols = initialGrid[0].length;
  
  // Keep original grid completely intact. 
  // We use vis[][] array instead of mutating the grid.
  const vis = Array.from({ length: rows }, () => Array(cols).fill(0));
  
  let stepId = 0;
  let islandsCount = 0;
  
  const visited = new Set<string>();
  const visitedOrder: [number, number][] = [];
  const islandCellsMap: Record<number, [number, number][]> = {};
  const islandMap: Record<string, number> = {};
  let currentScannerPosition: [number, number] = [0, 0];
  let currentIslandCells: [number, number][] = [];

  const pushStep = (
    type: IslandsStep['type'],
    desc: string, 
    codeLine: number, 
    queue: [number, number][] = [],
    currentCell: [number, number] | null = null,
    neighborCheck?: IslandsStep['neighborCheck']
  ) => {
    steps.push({
      id: stepId++,
      type,
      description: desc,
      codeLineActive: codeLine,
      gridSnapshot: initialGrid.map(r => [...r]),
      visSnapshot: vis.map(r => [...r]),
      visited: new Set(visited),
      queue: [...queue],
      currentCell,
      scannerPosition: [...currentScannerPosition],
      islandMap: { ...islandMap },
      islandsCount,
      row: currentCell ? currentCell[0] : currentScannerPosition[0],
      col: currentCell ? currentCell[1] : currentScannerPosition[1],
      queueSnapshot: [...queue],
      islandCount: islandsCount,
      currentIslandCells: [...currentIslandCells],
      auxiliaryState: {
        visitedOrder: [...visitedOrder],
        islandMap: JSON.parse(JSON.stringify(islandCellsMap))
      },
      neighborCheck
    });
  };

  if (version === 'leetcode') {
    // ----------------------------------------------------
    // LeetCode 4-Directional BFS
    // ----------------------------------------------------
    const dRow = [-1, 0, 1, 0];
    const dCol = [0, 1, 0, -1];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        currentScannerPosition = [r, c];
        
        // Line 30: Scan row
        pushStep('scan', `Scanning cell [${r}][${c}] = '${initialGrid[r][c]}'`, 30);
        
        // Line 32: Check land and not visited
        if (initialGrid[r][c] === 1 && vis[r][c] === 0) {
          islandsCount++;
          currentIslandCells = [];
          islandCellsMap[islandsCount] = currentIslandCells;

          // Line 33: Found island, increment count
          pushStep('found-island', `🏝️ Land found at [${r}][${c}]! Starting Island #${islandsCount}`, 33);
          
          // Line 34: bfs(row, col, vis, grid) called
          pushStep('bfs-called', `Calling BFS to traverse Island #${islandsCount} starting at [${r}][${c}]`, 34);

          // BFS Setup
          const queue: [number, number][] = [];
          
          // Line 8: Enqueue starting cell
          queue.push([r, c]);
          pushStep('enqueue', `Enqueue starting cell [${r}][${c}] → Queue size: ${queue.length}`, 8, queue);
          
          // Line 9: Mark visited
          vis[r][c] = 1;
          islandMap[`${r},${c}`] = islandsCount;
          visited.add(`${r},${c}`);
          visitedOrder.push([r, c]);
          currentIslandCells.push([r, c]);
          pushStep('flood', `Mark starting cell [${r}][${c}] as visited (vis[${r}][${c}] = 1)`, 9, queue);
          
          while (queue.length > 0) {
            // Line 12: Dequeue cell
            const currentCell = queue.shift()!;
            pushStep('dequeue', `Dequeue cell [${currentCell[0]}][${currentCell[1]}] ← Queue size: ${queue.length}`, 12, queue, currentCell);
            
            // Line 13: Loop 4 neighbors
            for (let i = 0; i < 4; i++) {
              const nr = currentCell[0] + dRow[i];
              const nc = currentCell[1] + dCol[i];
              
              // Line 14-15: compute neighbor coordinates nr, nc
              const inBounds = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
              const value = inBounds ? (initialGrid[nr][nc] === 1 ? '1' : '0') : 'out-of-bounds';
              const valid = inBounds && initialGrid[nr][nc] === 1 && vis[nr][nc] === 0;

              const nStr = inBounds ? `[${nr}][${nc}]` : 'out-of-bounds';
              pushStep(
                'check-neighbor', 
                `Check neighbor ${nStr} = '${value}' → ${valid ? 'valid land' : 'invalid'}`, 
                13, 
                queue, 
                currentCell,
                { nr, nc, value, valid }
              );
              
              if (valid) {
                // Line 20: Mark visited (vis = 1)
                vis[nr][nc] = 1;
                islandMap[`${nr},${nc}`] = islandsCount;
                visited.add(`${nr},${nc}`);
                visitedOrder.push([nr, nc]);
                currentIslandCells.push([nr, nc]);
                pushStep('flood-neighbor', `Mark neighbor [${nr}][${nc}] = 1 (visited)`, 20, queue, currentCell);

                // Line 21: Enqueue neighbor
                queue.push([nr, nc]);
                pushStep('enqueue-neighbor', `Enqueue neighbor [${nr}][${nc}] → Queue size: ${queue.length}`, 21, queue, currentCell);
              }
            }
          }
          
          // Island Complete
          pushStep('island-complete', `✓ Island #${islandsCount} complete — ${currentIslandCells.length} cells flooded`, 34);
          currentIslandCells = [];
        }
      }
    }
    pushStep('complete', `✅ Algorithm complete. Total islands: ${islandsCount}`, 37);

  } else {
    // ----------------------------------------------------
    // GFG 8-Directional BFS
    // ----------------------------------------------------
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        currentScannerPosition = [r, c];
        
        // Line 36: Scan row
        pushStep('scan', `Scanning cell [${r}][${c}] = '${initialGrid[r][c]}'`, 36);
        
        // Line 38: Check land and not visited
        if (vis[r][c] === 0 && initialGrid[r][c] === 1) {
          islandsCount++;
          currentIslandCells = [];
          islandCellsMap[islandsCount] = currentIslandCells;

          // Line 39: Found island, increment count
          pushStep('found-island', `🏝️ Land found at [${r}][${c}]! Starting Island #${islandsCount}`, 39);
          
          // Line 40: bfs(row, col, vis, grid) called
          pushStep('bfs-called', `Calling BFS to traverse Island #${islandsCount} starting at [${r}][${c}]`, 40);

          // BFS Setup
          const queue: [number, number][] = [];
          
          // Line 6: Mark visited
          vis[r][c] = 1;
          islandMap[`${r},${c}`] = islandsCount;
          visited.add(`${r},${c}`);
          visitedOrder.push([r, c]);
          currentIslandCells.push([r, c]);
          pushStep('flood', `Mark starting cell [${r}][${c}] as visited (vis[${r}][${c}] = 1)`, 6, queue);

          // Line 8: Enqueue starting cell
          queue.push([r, c]);
          pushStep('enqueue', `Enqueue starting cell [${r}][${c}] → Queue size: ${queue.length}`, 8, queue);
          
          while (queue.length > 0) {
            // Line 13: Dequeue cell
            const currentCell = queue.shift()!;
            pushStep('dequeue', `Dequeue cell [${currentCell[0]}][${currentCell[1]}] ← Queue size: ${queue.length}`, 13, queue, currentCell);
            
            // Line 15: Loop delrow
            for (let delrow = -1; delrow <= 1; delrow++) {
              // Line 17: Loop delcol
              for (let delcol = -1; delcol <= 1; delcol++) {
                if (delrow === 0 && delcol === 0) continue; // skip self

                const nr = currentCell[0] + delrow;
                const nc = currentCell[1] + delcol;
                
                // Line 19-20: compute neighbor coordinates nr, nc
                const inBounds = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
                const value = inBounds ? (initialGrid[nr][nc] === 1 ? '1' : '0') : 'out-of-bounds';
                const valid = inBounds && initialGrid[nr][nc] === 1 && vis[nr][nc] === 0;

                const nStr = inBounds ? `[${nr}][${nc}]` : 'out-of-bounds';
                pushStep(
                  'check-neighbor', 
                  `Check neighbor ${nStr} = '${value}' → ${valid ? 'valid land' : 'invalid'}`, 
                  17, 
                  queue, 
                  currentCell,
                  { nr, nc, value, valid }
                );
                
                if (valid) {
                  // Line 25: Mark visited (vis = 1)
                  vis[nr][nc] = 1;
                  islandMap[`${nr},${nc}`] = islandsCount;
                  visited.add(`${nr},${nc}`);
                  visitedOrder.push([nr, nc]);
                  currentIslandCells.push([nr, nc]);
                  pushStep('flood-neighbor', `Mark neighbor [${nr}][${nc}] = 1 (visited)`, 25, queue, currentCell);

                  // Line 26: Enqueue neighbor
                  queue.push([nr, nc]);
                  pushStep('enqueue-neighbor', `Enqueue neighbor [${nr}][${nc}] → Queue size: ${queue.length}`, 26, queue, currentCell);
                }
              }
            }
          }
          
          // Island Complete
          pushStep('island-complete', `✓ Island #${islandsCount} complete — ${currentIslandCells.length} cells flooded`, 40);
          currentIslandCells = [];
        }
      }
    }
    pushStep('complete', `✅ Algorithm complete. Total islands: ${islandsCount}`, 43);
  }
  
  return steps;
}
