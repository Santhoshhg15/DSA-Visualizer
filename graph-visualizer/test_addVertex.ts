import assert from 'assert';
import { useGraphStore } from './src/stores/useGraphStore';

function runTest() {
  // Get initial state
  const store = useGraphStore.getState();

  // Set up an initial graph with two nodes
  useGraphStore.setState({
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' }
    ],
    nodePositions: {
      'A': { x: 100, y: 100 },
      'B': { x: 200, y: 100 }
    }
  });

  // Call the logic we want to test
  useGraphStore.getState().addVertex('Z');

  // Verify
  const state = useGraphStore.getState();
  const zPos = state.nodePositions['Z'];

  console.log("Calculated Position for Z:", zPos);

  // Assertions
  assert(zPos !== undefined, "Position for Z should be calculated");
  assert(typeof zPos.x === 'number', "x position should be a number");
  assert(typeof zPos.y === 'number', "y position should be a number");

  // The centroid of (100,100) and (200,100) is (150, 100).
  // The logic adds 120 * cos(angleRad) and 120 * sin(angleRad)
  // Since existing nodes = 2, angle = 2 * (360 / 3) = 240 degrees
  // 240 deg = 4.18879 rad.
  // x = 150 + 120 * cos(240 deg) = 150 - 60 = 90
  // y = 100 + 120 * sin(240 deg) = 100 - 103.92 = -3.92
  
  console.log("Expected roughly x: 90, y: -3.92 (or subject to randomness if too close)");

  console.log("✅ Test passed! Z vertex was successfully added and positioned.");
}

runTest();
