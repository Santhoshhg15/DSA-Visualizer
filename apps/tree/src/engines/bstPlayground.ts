import type { Step, VisualBSTNode } from '../types';

// Helper to deep-copy the BST nodes
function cloneBSTNodes(nodes: Record<string, VisualBSTNode>): Record<string, VisualBSTNode> {
  const next: Record<string, VisualBSTNode> = {};
  for (const id in nodes) {
    next[id] = { ...nodes[id] };
  }
  return next;
}

export function traceBSTInsert(
  val: number,
  currentNodes: Record<string, VisualBSTNode>,
  rootId: string | null
): { steps: Step[]; finalNodes: Record<string, VisualBSTNode>; rootId: string | null } {
  const steps: Step[] = [];
  const nodes = cloneBSTNodes(currentNodes);
  let newRootId = rootId;

  // Clear transient properties
  for (const id in nodes) {
    delete nodes[id].isNew;
  }

  // Case 1: Empty Tree
  if (!newRootId) {
    const newId = `node_${val}`;
    nodes[newId] = {
      id: newId,
      value: val,
      leftId: null,
      rightId: null,
      parentId: null,
      isNew: true
    };
    newRootId = newId;

    steps.push({
      type: 'found',
      msg: `The tree is empty. Created a new root node with value ${val}.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: newId,
      bstValue: val,
      bstResultStatus: `✓ Inserted Root: ${val}`,
      highlightCodeLine: 1, // root = new Node(val)
      activeOperation: 'insert'
    });

    return { steps, finalNodes: nodes, rootId: newRootId };
  }

  // Case 2: Tree not empty, traverse search path
  let activeId = newRootId;
  steps.push({
    type: 'info',
    msg: `Starting insertion of value ${val} at the Root node (${nodes[activeId].value}).`,
    bstNodes: cloneBSTNodes(nodes),
    bstRootId: newRootId,
    activeNodeId: activeId,
    bstValue: val,
    bstResultStatus: `Insert: ${val}`,
    highlightCodeLine: 2, // insertHelper(root, val)
    activeOperation: 'insert'
  });

  let insertedId = '';
  while (activeId) {
    const current: VisualBSTNode = nodes[activeId];
    
    // Check comparison step
    steps.push({
      type: 'info',
      msg: `We compare the target value ${val} with the current node value ${current.value}.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: activeId,
      bstValue: val,
      bstResultStatus: `Comparing ${val} vs ${current.value}`,
      highlightCodeLine: 3, // if val < node.val
      activeOperation: 'insert'
    });

    if (val === current.value) {
      steps.push({
        type: 'mismatch',
        msg: `Duplicate Check: Value ${val} already exists in the BST. Duplicate insertion is ignored.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: newRootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `⚠ Duplicate ignored`,
        highlightCodeLine: 7, // return node
        activeOperation: 'insert'
      });
      break;
    }

    if (val < current.value) {
      steps.push({
        type: 'info',
        msg: `${val} < ${current.value} ➜ The insertion value is less than the current node's value. We descend into the LEFT child.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: newRootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `Left: ${val} < ${current.value}`,
        highlightCodeLine: 4, // node.left = insert(node.left, val)
        activeOperation: 'insert'
      });

      if (current.leftId) {
        activeId = current.leftId;
      } else {
        // Create left child
        const newId = `node_${val}`;
        nodes[newId] = {
          id: newId,
          value: val,
          leftId: null,
          rightId: null,
          parentId: activeId,
          isNew: true
        };
        nodes[activeId].leftId = newId;
        insertedId = newId;

        steps.push({
          type: 'found',
          msg: `The left child of ${current.value} is empty. We create a new leaf node containing ${val} as the left child of ${current.value}.`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: newRootId,
          activeNodeId: newId,
          bstValue: val,
          bstResultStatus: `✓ Node Created`,
          highlightCodeLine: 2, // return new Node(val)
          activeOperation: 'insert'
        });
        break;
      }
    } else {
      steps.push({
        type: 'info',
        msg: `${val} > ${current.value} ➜ The insertion value is greater than the current node's value. We descend into the RIGHT child.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: newRootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `Right: ${val} > ${current.value}`,
        highlightCodeLine: 6, // node.right = insert(node.right, val)
        activeOperation: 'insert'
      });

      if (current.rightId) {
        activeId = current.rightId;
      } else {
        // Create right child
        const newId = `node_${val}`;
        nodes[newId] = {
          id: newId,
          value: val,
          leftId: null,
          rightId: null,
          parentId: activeId,
          isNew: true
        };
        nodes[activeId].rightId = newId;
        insertedId = newId;

        steps.push({
          type: 'found',
          msg: `The right child of ${current.value} is empty. We create a new leaf node containing ${val} as the right child of ${current.value}.`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: newRootId,
          activeNodeId: newId,
          bstValue: val,
          bstResultStatus: `✓ Node Created`,
          highlightCodeLine: 2, // return new Node(val)
          activeOperation: 'insert'
        });
        break;
      }
    }
  }

  if (insertedId) {
    steps.push({
      type: 'found',
      msg: `Successfully inserted ${val} into the BST.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: insertedId,
      bstValue: val,
      bstResultStatus: `✓ Inserted ${val}`,
      highlightCodeLine: 12, // return node
      activeOperation: 'insert'
    });
  }

  return { steps, finalNodes: nodes, rootId: newRootId };
}

export function traceBSTSearch(
  val: number,
  currentNodes: Record<string, VisualBSTNode>,
  rootId: string | null
): Step[] {
  const steps: Step[] = [];
  const nodes = cloneBSTNodes(currentNodes);

  // Clear transient properties
  for (const id in nodes) {
    delete nodes[id].isNew;
  }

  if (!rootId) {
    return [{
      type: 'mismatch',
      msg: 'Tree is empty. Cannot perform search.',
      bstNodes: nodes,
      bstRootId: rootId,
      activeNodeId: null,
      bstValue: val,
      bstResultStatus: 'Empty Tree',
      highlightCodeLine: 0,
      activeOperation: 'search'
    }];
  }

  let activeId: string | null = rootId;
  steps.push({
    type: 'info',
    msg: `Starting search for value ${val} at the Root node (${nodes[activeId].value}).`,
    bstNodes: cloneBSTNodes(nodes),
    bstRootId: rootId,
    activeNodeId: activeId,
    bstValue: val,
    bstResultStatus: `Search: ${val}`,
    highlightCodeLine: 1, // searchHelper(root, val)
    activeOperation: 'search'
  });

  let found = false;
  while (activeId) {
    const current: VisualBSTNode = nodes[activeId];

    steps.push({
      type: 'info',
      msg: `We compare the search key ${val} with the current node value ${current.value}.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: rootId,
      activeNodeId: activeId,
      bstValue: val,
      bstResultStatus: `Comparing ${val} vs ${current.value}`,
      highlightCodeLine: 1, // if node == null or node.val == val
      activeOperation: 'search'
    });

    if (val === current.value) {
      found = true;
      steps.push({
        type: 'found',
        msg: `Match found! The search key ${val} matches the current node value ${current.value}.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: rootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `✓ Found ${val}`,
        highlightCodeLine: 2, // return node
        activeOperation: 'search'
      });
      break;
    }

    if (val < current.value) {
      steps.push({
        type: 'info',
        msg: `${val} < ${current.value} ➜ Since the search key is less than the current node value, we descend into the LEFT child.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: rootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `Left: ${val} < ${current.value}`,
        highlightCodeLine: 4, // return search(node.left, val)
        activeOperation: 'search'
      });
      activeId = current.leftId;
    } else {
      steps.push({
        type: 'info',
        msg: `${val} > ${current.value} ➜ Since the search key is greater than the current node value, we descend into the RIGHT child.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: rootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `Right: ${val} > ${current.value}`,
        highlightCodeLine: 6, // return search(node.right, val)
        activeOperation: 'search'
      });
      activeId = current.rightId;
    }

    if (activeId) {
      steps.push({
        type: 'info',
        msg: `We traverse to the child node containing value ${nodes[activeId].value} to continue our search.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: rootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `Traversing`,
        highlightCodeLine: 1, // search(node, val)
        activeOperation: 'search'
      });
    }
  }

  if (!found) {
    steps.push({
      type: 'mismatch',
      msg: `Search finished. Value ${val} was not found in the BST.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: rootId,
      activeNodeId: null,
      bstValue: val,
      bstResultStatus: `✗ Not Found`,
      highlightCodeLine: 9, // return null / false
      activeOperation: 'search'
    });
  }

  return steps;
}

export function traceBSTDelete(
  val: number,
  currentNodes: Record<string, VisualBSTNode>,
  rootId: string | null
): { steps: Step[]; finalNodes: Record<string, VisualBSTNode>; rootId: string | null } {
  const steps: Step[] = [];
  let nodes = cloneBSTNodes(currentNodes);
  let newRootId = rootId;

  // Clear transient properties
  for (const id in nodes) {
    delete nodes[id].isNew;
  }

  if (!newRootId) {
    steps.push({
      type: 'mismatch',
      msg: 'Tree is empty. Cannot perform deletion.',
      bstNodes: nodes,
      bstRootId: newRootId,
      activeNodeId: null,
      bstValue: val,
      bstResultStatus: 'Empty Tree',
      highlightCodeLine: 0,
      activeOperation: 'delete'
    });
    return { steps, finalNodes: nodes, rootId: newRootId };
  }

  // 1. Search for node to delete
  let activeId: string | null = newRootId;
  steps.push({
    type: 'info',
    msg: `Searching for node containing ${val} to delete, starting at Root (${nodes[activeId].value}).`,
    bstNodes: cloneBSTNodes(nodes),
    bstRootId: newRootId,
    activeNodeId: activeId,
    bstValue: val,
    bstResultStatus: `Delete Search: ${val}`,
    highlightCodeLine: 1, // deleteNode(root, val)
    activeOperation: 'delete'
  });

  let foundId: string | null = null;
  while (activeId) {
    const current: VisualBSTNode = nodes[activeId];

    if (val === current.value) {
      foundId = activeId;
      break;
    }

    if (val < current.value) {
      steps.push({
        type: 'info',
        msg: `${val} < ${current.value}. Search left.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: newRootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `${val} < ${current.value}`,
        highlightCodeLine: 3, // root.left = deleteNode(root.left, val)
        activeOperation: 'delete'
      });
      activeId = current.leftId;
    } else {
      steps.push({
        type: 'info',
        msg: `${val} > ${current.value}. Search right.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: newRootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `${val} > ${current.value}`,
        highlightCodeLine: 5, // root.right = deleteNode(root.right, val)
        activeOperation: 'delete'
      });
      activeId = current.rightId;
    }

    if (activeId) {
      steps.push({
        type: 'info',
        msg: `Check node (${nodes[activeId].value}).`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: newRootId,
        activeNodeId: activeId,
        bstValue: val,
        bstResultStatus: `Checking`,
        highlightCodeLine: 1,
        activeOperation: 'delete'
      });
    }
  }

  if (!foundId) {
    steps.push({
      type: 'mismatch',
      msg: `Value ${val} not found in the BST. Deletion aborted.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: null,
      bstValue: val,
      bstResultStatus: `✗ Not Found`,
      highlightCodeLine: 0,
      activeOperation: 'delete'
    });
    return { steps, finalNodes: nodes, rootId: newRootId };
  }

  const targetNode = nodes[foundId];
  steps.push({
    type: 'found',
    msg: `Located node containing ${val}. Deciding deletion case based on children.`,
    bstNodes: cloneBSTNodes(nodes),
    bstRootId: newRootId,
    activeNodeId: foundId,
    bstValue: val,
    bstResultStatus: `Found target ${val}`,
    highlightCodeLine: 7, // if root.val == val
    activeOperation: 'delete'
  });

  // Case 1: Leaf node (no children)
  if (!targetNode.leftId && !targetNode.rightId) {
    steps.push({
      type: 'found',
      msg: `Node ${val} is a leaf node (0 children). We can simply remove it.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: foundId,
      bstValue: val,
      bstResultStatus: `Case 1: Leaf node`,
      highlightCodeLine: 9, // return null
      activeOperation: 'delete'
    });

    if (targetNode.parentId) {
      const parent = nodes[targetNode.parentId];
      if (parent.leftId === foundId) parent.leftId = null;
      else if (parent.rightId === foundId) parent.rightId = null;
    } else {
      // Root was deleted
      newRootId = null;
    }
    delete nodes[foundId];

    steps.push({
      type: 'info',
      msg: `Removed leaf node containing ${val} successfully.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: null,
      bstValue: val,
      bstResultStatus: `✓ Leaf Removed`,
      highlightCodeLine: 10,
      activeOperation: 'delete'
    });
  }
  // Case 2: One child (only left child)
  else if (targetNode.leftId && !targetNode.rightId) {
    const leftChild = nodes[targetNode.leftId];
    steps.push({
      type: 'found',
      msg: `Node ${val} has only a Left child (${leftChild.value}). We splice it directly to parent.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: foundId,
      bstValue: val,
      bstResultStatus: `Case 2: 1 Child (Left)`,
      highlightCodeLine: 12, // return root.left
      activeOperation: 'delete'
    });

    if (targetNode.parentId) {
      const parent = nodes[targetNode.parentId];
      if (parent.leftId === foundId) parent.leftId = targetNode.leftId;
      else if (parent.rightId === foundId) parent.rightId = targetNode.leftId;
      leftChild.parentId = targetNode.parentId;
    } else {
      newRootId = targetNode.leftId;
      leftChild.parentId = null;
    }
    delete nodes[foundId];

    steps.push({
      type: 'info',
      msg: `Replaced node ${val} with its left child ${leftChild.value} successfully.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: leftChild.id,
      bstValue: val,
      bstResultStatus: `✓ Node Spliced`,
      highlightCodeLine: 13,
      activeOperation: 'delete'
    });
  }
  // Case 2b: One child (only right child)
  else if (!targetNode.leftId && targetNode.rightId) {
    const rightChild = nodes[targetNode.rightId];
    steps.push({
      type: 'found',
      msg: `Node ${val} has only a Right child (${rightChild.value}). We splice it directly to parent.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: foundId,
      bstValue: val,
      bstResultStatus: `Case 2: 1 Child (Right)`,
      highlightCodeLine: 15, // return root.right
      activeOperation: 'delete'
    });

    if (targetNode.parentId) {
      const parent = nodes[targetNode.parentId];
      if (parent.leftId === foundId) parent.leftId = targetNode.rightId;
      else if (parent.rightId === foundId) parent.rightId = targetNode.rightId;
      rightChild.parentId = targetNode.parentId;
    } else {
      newRootId = targetNode.rightId;
      rightChild.parentId = null;
    }
    delete nodes[foundId];

    steps.push({
      type: 'info',
      msg: `Replaced node ${val} with its right child ${rightChild.value} successfully.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: rightChild.id,
      bstValue: val,
      bstResultStatus: `✓ Node Spliced`,
      highlightCodeLine: 16,
      activeOperation: 'delete'
    });
  }
  // Case 3: Two children
  else {
    steps.push({
      type: 'info',
      msg: `Node ${val} has 2 children. Finding inorder successor (minimum value in right subtree) to swap values.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: foundId,
      bstValue: val,
      bstResultStatus: `Case 3: 2 Children`,
      highlightCodeLine: 18, // node.val = minValue(node.right)
      activeOperation: 'delete'
    });

    // Traverse to right subtree first
    let succId = targetNode.rightId!;
    steps.push({
      type: 'info',
      msg: `Step 1: Move to the right child (${nodes[succId].value}) of target node.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: succId,
      bstValue: val,
      bstResultStatus: `Move to Right child`,
      highlightCodeLine: 18,
      activeOperation: 'delete'
    });

    // Walk down left branches of right subtree
    while (nodes[succId].leftId) {
      succId = nodes[succId].leftId!;
      steps.push({
        type: 'info',
        msg: `Step 2: Walk left to child node (${nodes[succId].value}) seeking minimum value.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: newRootId,
        activeNodeId: succId,
        bstValue: val,
        bstResultStatus: `Traverse Left`,
        highlightCodeLine: 18,
        activeOperation: 'delete'
      });
    }

    const successorVal = nodes[succId].value;
    steps.push({
      type: 'found',
      msg: `Found inorder successor node (${successorVal}). We copy its value ${successorVal} to target node.`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: succId,
      bstValue: val,
      bstResultStatus: `Successor: ${successorVal}`,
      highlightCodeLine: 18,
      activeOperation: 'delete'
    });

    // Perform swap visually (update targetNode's value to successorVal)
    nodes[foundId].value = successorVal;
    steps.push({
      type: 'found',
      msg: `Copied value ${successorVal} to target node. Now deleting the original successor node (${successorVal}).`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: foundId,
      bstValue: val,
      bstResultStatus: `Value Swapped`,
      highlightCodeLine: 19, // root.right = deleteNode(root.right, root.val)
      activeOperation: 'delete'
    });

    // Delete successor node (which has 0 or 1 child: only right child since left child is null)
    const succNode = nodes[succId];
    const succParent = nodes[succNode.parentId!];

    // Splice successor's right child (if any)
    if (succNode.rightId) {
      const succRightChild = nodes[succNode.rightId];
      if (succParent.leftId === succId) succParent.leftId = succNode.rightId;
      else succParent.rightId = succNode.rightId;
      succRightChild.parentId = succParent.id;
    } else {
      if (succParent.leftId === succId) succParent.leftId = null;
      else succParent.rightId = null;
    }
    delete nodes[succId];

    steps.push({
      type: 'found',
      msg: `Deleted original successor node and restructured the tree. Deletion complete!`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: newRootId,
      activeNodeId: foundId,
      bstValue: val,
      bstResultStatus: `✓ Deletion Complete`,
      highlightCodeLine: 20, // return root
      activeOperation: 'delete'
    });
  }

  return { steps, finalNodes: nodes, rootId: newRootId };
}

// 4. Traversals Tracing Engine (recursive DFS & BFS)
export function traceBSTTraversal(
  type: 'inorder' | 'preorder' | 'postorder' | 'bfs',
  currentNodes: Record<string, VisualBSTNode>,
  rootId: string | null
): Step[] {
  const steps: Step[] = [];
  const nodes = cloneBSTNodes(currentNodes);

  // Clear transient properties
  for (const id in nodes) {
    delete nodes[id].isNew;
  }

  if (!rootId) {
    return [{
      type: 'mismatch',
      msg: 'Tree is empty. Cannot traverse.',
      bstNodes: nodes,
      bstRootId: rootId,
      activeNodeId: null,
      visitedNodes: [],
      callStack: [],
      queue: [],
      bstResultStatus: 'Empty Tree',
      highlightCodeLine: 0,
      activeOperation: type
    }];
  }

  const visited: string[] = [];

  if (type === 'bfs') {
    // Level-Order traversal using queue
    const queue: string[] = [rootId];
    
    steps.push({
      type: 'info',
      msg: `Initialize BFS Level-Order Traversal. Enqueued Root node (${nodes[rootId].value}).`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: rootId,
      activeNodeId: rootId,
      visitedNodes: [],
      callStack: [],
      queue: [...queue],
      bstResultStatus: 'BFS Start',
      highlightCodeLine: 1, // queue = [root]
      activeOperation: 'bfs'
    });

    while (queue.length > 0) {
      const activeId = queue.shift()!;
      const current: VisualBSTNode = nodes[activeId];

      steps.push({
        type: 'info',
        msg: `Dequeue node (${current.value}) from front of the queue.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: rootId,
        activeNodeId: activeId,
        visitedNodes: [...visited],
        callStack: [],
        queue: [...queue],
        bstResultStatus: `Dequeue ${current.value}`,
        highlightCodeLine: 3, // curr = queue.pop(0)
        activeOperation: 'bfs'
      });

      // Visit node
      visited.push(activeId);
      steps.push({
        type: 'found',
        msg: `Visit node (${current.value}). Add it to visited sequence.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: rootId,
        activeNodeId: activeId,
        visitedNodes: [...visited],
        callStack: [],
        queue: [...queue],
        bstResultStatus: `Visit ${current.value}`,
        highlightCodeLine: 4, // print(curr.val)
        activeOperation: 'bfs'
      });

      // Enqueue Left child
      if (current.leftId) {
        queue.push(current.leftId);
        steps.push({
          type: 'info',
          msg: `Enqueue Left child (${nodes[current.leftId].value}) of current node.`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: activeId,
          visitedNodes: [...visited],
          callStack: [],
          queue: [...queue],
          bstResultStatus: `Enqueue Left: ${nodes[current.leftId].value}`,
          highlightCodeLine: 5, // if curr.left: queue.append(curr.left)
          activeOperation: 'bfs'
        });
      }

      // Enqueue Right child
      if (current.rightId) {
        queue.push(current.rightId);
        steps.push({
          type: 'info',
          msg: `Enqueue Right child (${nodes[current.rightId].value}) of current node.`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: activeId,
          visitedNodes: [...visited],
          callStack: [],
          queue: [...queue],
          bstResultStatus: `Enqueue Right: ${nodes[current.rightId].value}`,
          highlightCodeLine: 7, // if curr.right: queue.append(curr.right)
          activeOperation: 'bfs'
        });
      }
    }

    steps.push({
      type: 'found',
      msg: `BFS Traversal finished successfully! Visited sequence: [${visited.map(id => nodes[id].value).join(', ')}]`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: rootId,
      activeNodeId: null,
      visitedNodes: [...visited],
      callStack: [],
      queue: [],
      bstResultStatus: `BFS Done`,
      highlightCodeLine: 9,
      activeOperation: 'bfs'
    });

  } else {
    // DFS Traversals: inorder, preorder, postorder
    const callStack: string[] = [];

    function traverseDFS(nodeId: string | null) {
      if (!nodeId) {
        // Base case step
        steps.push({
          type: 'info',
          msg: `Reached null pointer. Return to parent frame.`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: null,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Base Case (null)`,
          highlightCodeLine: 1, // if node == null: return
          activeOperation: type
        });
        return;
      }

      const nodeVal = nodes[nodeId].value;
      const frameName = `${type.toUpperCase()}(Node ${nodeVal})`;
      
      callStack.push(frameName);
      steps.push({
        type: 'info',
        msg: `Enter call frame: ${frameName}.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: rootId,
        activeNodeId: nodeId,
        visitedNodes: [...visited],
        callStack: [...callStack],
        bstResultStatus: `Enter ${nodeVal}`,
        highlightCodeLine: 2,
        activeOperation: type
      });

      if (type === 'preorder') {
        // Visit Root
        visited.push(nodeId);
        steps.push({
          type: 'found',
          msg: `Preorder: Visit Node (${nodeVal}) first, appending to result path.`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Preorder: Visit ${nodeVal}`,
          highlightCodeLine: 3, // print(node.val)
          activeOperation: type
        });

        // Traverse Left
        steps.push({
          type: 'info',
          msg: `Preorder: Recursively traverse Left child of Node (${nodeVal}).`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Traverse Left from ${nodeVal}`,
          highlightCodeLine: 4, // traverse(node.left)
          activeOperation: type
        });
        traverseDFS(nodes[nodeId].leftId);

        // Traverse Right
        steps.push({
          type: 'info',
          msg: `Preorder: Recursively traverse Right child of Node (${nodeVal}).`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Traverse Right from ${nodeVal}`,
          highlightCodeLine: 5, // traverse(node.right)
          activeOperation: type
        });
        traverseDFS(nodes[nodeId].rightId);

      } else if (type === 'inorder') {
        // Traverse Left
        steps.push({
          type: 'info',
          msg: `Inorder: Recursively traverse Left child of Node (${nodeVal}).`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Traverse Left from ${nodeVal}`,
          highlightCodeLine: 3, // traverse(node.left)
          activeOperation: type
        });
        traverseDFS(nodes[nodeId].leftId);

        // Visit Root
        visited.push(nodeId);
        steps.push({
          type: 'found',
          msg: `Inorder: Visit Node (${nodeVal}), appending to result path.`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Inorder: Visit ${nodeVal}`,
          highlightCodeLine: 4, // print(node.val)
          activeOperation: type
        });

        // Traverse Right
        steps.push({
          type: 'info',
          msg: `Inorder: Recursively traverse Right child of Node (${nodeVal}).`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Traverse Right from ${nodeVal}`,
          highlightCodeLine: 5, // traverse(node.right)
          activeOperation: type
        });
        traverseDFS(nodes[nodeId].rightId);

      } else if (type === 'postorder') {
        // Traverse Left
        steps.push({
          type: 'info',
          msg: `Postorder: Recursively traverse Left child of Node (${nodeVal}).`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Traverse Left from ${nodeVal}`,
          highlightCodeLine: 3, // traverse(node.left)
          activeOperation: type
        });
        traverseDFS(nodes[nodeId].leftId);

        // Traverse Right
        steps.push({
          type: 'info',
          msg: `Postorder: Recursively traverse Right child of Node (${nodeVal}).`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Traverse Right from ${nodeVal}`,
          highlightCodeLine: 4, // traverse(node.right)
          activeOperation: type
        });
        traverseDFS(nodes[nodeId].rightId);

        // Visit Root
        visited.push(nodeId);
        steps.push({
          type: 'found',
          msg: `Postorder: Visit Node (${nodeVal}), appending to result path.`,
          bstNodes: cloneBSTNodes(nodes),
          bstRootId: rootId,
          activeNodeId: nodeId,
          visitedNodes: [...visited],
          callStack: [...callStack],
          bstResultStatus: `Postorder: Visit ${nodeVal}`,
          highlightCodeLine: 5, // print(node.val)
          activeOperation: type
        });
      }

      callStack.pop();
      steps.push({
        type: 'info',
        msg: `Completed traversal for Node (${nodeVal}). Return/Exit frame.`,
        bstNodes: cloneBSTNodes(nodes),
        bstRootId: rootId,
        activeNodeId: nodeId,
        visitedNodes: [...visited],
        callStack: [...callStack],
        bstResultStatus: `Exit ${nodeVal}`,
        highlightCodeLine: 6,
        activeOperation: type
      });
    }

    traverseDFS(rootId);

    steps.push({
      type: 'found',
      msg: `${type.toUpperCase()} Traversal finished successfully! Visited sequence: [${visited.map(id => nodes[id].value).join(', ')}]`,
      bstNodes: cloneBSTNodes(nodes),
      bstRootId: rootId,
      activeNodeId: null,
      visitedNodes: [...visited],
      callStack: [],
      queue: [],
      bstResultStatus: `${type.toUpperCase()} Done`,
      highlightCodeLine: 0,
      activeOperation: type
    });
  }

  return steps;
}
