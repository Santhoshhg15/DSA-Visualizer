export interface BinaryTreeNode {
  id: string;
  leftId: string | null;
  rightId: string | null;
}

interface InternalLayoutNode {
  id: string;
  x: number;
  y: number;
  relX: number;
  depth: number;
  left: InternalLayoutNode | null;
  right: InternalLayoutNode | null;
}

interface SubtreeContour {
  left: number[];
  right: number[];
}

/**
 * Computes coordinate layouts for a binary tree using a contour-merging Reingold-Tilford layout algorithm.
 * This guarantees parent centering, subtree integrity, and zero node overlaps even for highly skewed trees.
 */
export function layoutBinaryTree(
  nodes: Record<string, { leftId: string | null; rightId: string | null }>,
  rootId: string | null,
  options?: {
    siblingSep?: number;
    levelHeight?: number;
  }
): Record<string, { x: number; y: number; depth: number }> {
  const siblingSep = options?.siblingSep ?? 70;
  const levelHeight = options?.levelHeight ?? 80;

  const positions: Record<string, { x: number; y: number; depth: number }> = {};
  if (!rootId || !nodes[rootId]) return positions;

  // Pass 1: Build the internal tree representation and calculate relative offsets + contours
  function layoutNode(nodeId: string, depth: number): { node: InternalLayoutNode; contour: SubtreeContour } {
    const rawNode = nodes[nodeId];
    const internalNode: InternalLayoutNode = {
      id: nodeId,
      x: 0,
      y: depth * levelHeight,
      relX: 0,
      depth,
      left: null,
      right: null
    };

    // Case 1: Leaf node
    if (!rawNode.leftId && !rawNode.rightId) {
      return {
        node: internalNode,
        contour: { left: [0], right: [0] }
      };
    }

    // Case 2: Left child only
    if (rawNode.leftId && !rawNode.rightId) {
      const { node: leftNode, contour: leftContour } = layoutNode(rawNode.leftId, depth + 1);
      internalNode.left = leftNode;
      
      const shift = siblingSep / 2;
      leftNode.relX = -shift;

      const mergedContour: SubtreeContour = {
        left: [0, ...leftContour.left.map(x => x - shift)],
        right: [0, ...leftContour.right.map(x => x - shift)]
      };

      return { node: internalNode, contour: mergedContour };
    }

    // Case 3: Right child only
    if (!rawNode.leftId && rawNode.rightId) {
      const { node: rightNode, contour: rightContour } = layoutNode(rawNode.rightId, depth + 1);
      internalNode.right = rightNode;
      
      const shift = siblingSep / 2;
      rightNode.relX = shift;

      const mergedContour: SubtreeContour = {
        left: [0, ...rightContour.left.map(x => x + shift)],
        right: [0, ...rightContour.right.map(x => x + shift)]
      };

      return { node: internalNode, contour: mergedContour };
    }

    // Case 4: Both children exist
    if (rawNode.leftId && rawNode.rightId) {
      const { node: leftNode, contour: leftContour } = layoutNode(rawNode.leftId, depth + 1);
      const { node: rightNode, contour: rightContour } = layoutNode(rawNode.rightId, depth + 1);
      internalNode.left = leftNode;
      internalNode.right = rightNode;

      // Find minimum shift to prevent subtree overlaps
      let shift = siblingSep;
      const minOverlapLength = Math.min(leftContour.right.length, rightContour.left.length);
      for (let d = 0; d < minOverlapLength; d++) {
        const gap = rightContour.left[d] - leftContour.right[d];
        const needed = siblingSep - gap;
        if (needed > shift) {
          shift = needed;
        }
      }

      // Position children symmetrically relative to parent
      leftNode.relX = -shift / 2;
      rightNode.relX = shift / 2;

      // Merge contours
      const mergedContour: SubtreeContour = {
        left: [0],
        right: [0]
      };

      const maxContourLength = Math.max(leftContour.left.length, rightContour.left.length);
      for (let d = 0; d < maxContourLength; d++) {
        // Left contour
        if (d < leftContour.left.length) {
          mergedContour.left.push(leftContour.left[d] - shift / 2);
        } else {
          mergedContour.left.push(rightContour.left[d] + shift / 2);
        }

        // Right contour
        if (d < rightContour.right.length) {
          mergedContour.right.push(rightContour.right[d] + shift / 2);
        } else {
          mergedContour.right.push(leftContour.right[d] - shift / 2);
        }
      }

      return { node: internalNode, contour: mergedContour };
    }

    return { node: internalNode, contour: { left: [0], right: [0] } };
  }

  const { node: rootNode } = layoutNode(rootId, 0);

  // Pass 2: Traverse pre-order to accumulate offsets and calculate absolute X coordinates
  function calculateAbsoluteX(node: InternalLayoutNode, parentX: number) {
    node.x = parentX + node.relX;
    positions[node.id] = {
      x: node.x,
      y: node.y,
      depth: node.depth
    };

    if (node.left) calculateAbsoluteX(node.left, node.x);
    if (node.right) calculateAbsoluteX(node.right, node.x);
  }

  calculateAbsoluteX(rootNode, 0);

  return positions;
}
