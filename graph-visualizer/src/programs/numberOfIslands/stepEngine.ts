import type { IslandsStep } from '../../stores/useIslandsStore';

export function generateIslandsSteps(initialGrid: number[][]): IslandsStep[] {
  const steps: IslandsStep[] = [];
  const rows = initialGrid.length;
  if (rows === 0) return steps;
  const cols = initialGrid[0].length;
  
  // Clone grid to mutate during algorithm
  const grid = initialGrid.map(row => [...row]);
  
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
      gridSnapshot: grid.map(r => [...r]),
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

  const directions = [
    [-1, 0], // UP
    [1, 0],  // DOWN
    [0, -1], // LEFT
    [0, 1]   // RIGHT
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      currentScannerPosition = [i, j];
      
      // Line 5: Scanning cell
      pushStep('scan', `Scanning cell [${i}][${j}] = '${initialGrid[i][j]}'`, 5);
      
      if (grid[i][j] === 1) {
        islandsCount++;
        currentIslandCells = [];
        islandCellsMap[islandsCount] = currentIslandCells;

        // Line 7: Found island (islands++)
        pushStep('found-island', `🏝️ Land found at [${i}][${j}]! Starting Island #${islandsCount}`, 7);
        
        // Line 8: bfs(grid, i, j)
        pushStep('bfs-called', `Calling BFS to traverse Island #${islandsCount} starting at [${i}][${j}]`, 8);

        // BFS Setup
        const queue: [number, number][] = [];
        
        // Enqueue starting cell
        queue.push([i, j]);
        pushStep('enqueue', `Enqueue starting cell [${i}][${j}] → Queue size: ${queue.length}`, 17, queue);
        
        // Mark as visited (flood)
        grid[i][j] = 0; 
        islandMap[`${i},${j}`] = islandsCount;
        visited.add(`${i},${j}`);
        visitedOrder.push([i, j]);
        currentIslandCells.push([i, j]);
        pushStep('flood', `Mark starting cell [${i}][${j}] = '0' (visited)`, 18, queue);
        
        while (queue.length > 0) {
          // Dequeue cell
          const currentCell = queue.shift()!;
          pushStep('dequeue', `Dequeue cell [${currentCell[0]}][${currentCell[1]}] ← Queue size: ${queue.length}`, 22, queue, currentCell);
          
          for (const [dr, dc] of directions) {
            const nr = currentCell[0] + dr;
            const nc = currentCell[1] + dc;
            const inBounds = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
            const value = inBounds ? (initialGrid[nr][nc] === 1 ? '1' : '0') : 'out-of-bounds';
            const valid = inBounds && grid[nr][nc] === 1;

            const nStr = inBounds ? `[${nr}][${nc}]` : 'out-of-bounds';
            pushStep(
              'check-neighbor', 
              `Check neighbor ${nStr} = '${value}' → ${valid ? 'valid land' : 'invalid'}`, 
              28, 
              queue, 
              currentCell,
              { nr, nc, value, valid }
            );
            
            if (valid) {
              // Enqueue neighbor
              queue.push([nr, nc]);
              pushStep('enqueue-neighbor', `Enqueue neighbor [${nr}][${nc}] → Queue size: ${queue.length}`, 31, queue, currentCell);

              // Flood neighbor
              grid[nr][nc] = 0;
              islandMap[`${nr},${nc}`] = islandsCount;
              visited.add(`${nr},${nc}`);
              visitedOrder.push([nr, nc]);
              currentIslandCells.push([nr, nc]);
              pushStep('flood-neighbor', `Mark neighbor [${nr}][${nc}] = '0' (visited)`, 32, queue, currentCell);
            }
          }
        }
        
        // Island Complete
        pushStep('island-complete', `✓ Island #${islandsCount} complete — ${currentIslandCells.length} cells flooded`, 13);
        currentIslandCells = []; // Reset current island cells when BFS finishes
      }
    }
  }
  
  pushStep('complete', `✅ Algorithm complete. Total islands: ${islandsCount}`, 13);
  
  return steps;
}
