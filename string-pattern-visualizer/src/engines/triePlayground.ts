import type { Step, VisualTrieNode } from '../types';

// Helper to deep-copy the tree state
function cloneNodes(nodes: Record<string, VisualTrieNode>): Record<string, VisualTrieNode> {
  const next: Record<string, VisualTrieNode> = {};
  for (const id in nodes) {
    next[id] = {
      ...nodes[id],
      children: { ...nodes[id].children },
    };
  }
  return next;
}

export function traceInsert(word: string, currentNodes: Record<string, VisualTrieNode>): { steps: Step[]; finalNodes: Record<string, VisualTrieNode> } {
  const steps: Step[] = [];
  const nodes = cloneNodes(currentNodes);
  const w = word.toUpperCase().trim().replace(/[^A-Z]/g, '');

  if (!w) {
    return {
      steps: [{
        type: 'info',
        msg: 'Cannot insert an empty word.',
        trieNodes: nodes,
        activeNodeId: null,
        trieResultStatus: 'Empty Input',
        highlightCodeLine: 0,
        activeOperation: 'insert'
      }],
      finalNodes: nodes
    };
  }

  // Clear previous transient styles
  for (const id in nodes) {
    delete nodes[id].isNew;
  }

  // Step 1: Initialize insert traversal at root
  let activeId = 'root';
  steps.push({
    type: 'info',
    msg: `Start Insertion of "${w}" at Root node.`,
    trieNodes: cloneNodes(nodes),
    activeNodeId: activeId,
    trieResultStatus: `Insert: "${w}"`,
    highlightCodeLine: 1, // node = root
    activeOperation: 'insert',
    trieWord: ''
  });

  let accum = '';
  for (let idx = 0; idx < w.length; idx++) {
    const char = w[idx];
    accum += char;
    
    // Highlight step: checking children
    steps.push({
      type: 'info',
      msg: `Step ${idx + 1}: Check if character '${char}' exists in children of node (${nodes[activeId].char || 'root'}).`,
      trieNodes: cloneNodes(nodes),
      activeNodeId: activeId,
      currentNodeChar: char,
      trieResultStatus: `Checking child '${char}'`,
      highlightCodeLine: 3, // if char not in node.children
      activeOperation: 'insert',
      trieWord: accum
    });

    if (!nodes[activeId].children[char]) {
      // Create new node
      const newId = `node_${Math.random().toString(36).substr(2, 9)}`;
      nodes[newId] = {
        id: newId,
        char: char,
        children: {},
        isEndOfWord: false,
        isNew: true
      };
      nodes[activeId].children[char] = newId;

      steps.push({
        type: 'found',
        msg: `Node not found. Created a new node for character '${char}'.`,
        trieNodes: cloneNodes(nodes),
        activeNodeId: activeId,
        currentNodeChar: char,
        trieResultStatus: `✓ Node Created`,
        highlightCodeLine: 4, // node.children[char] = new Node()
        activeOperation: 'insert',
        trieWord: accum
      });
    }

    // Move to child node
    activeId = nodes[activeId].children[char];
    steps.push({
      type: 'info',
      msg: `Move down the branch to node containing character '${char}'.`,
      trieNodes: cloneNodes(nodes),
      activeNodeId: activeId,
      currentNodeChar: char,
      trieResultStatus: `Traversing path`,
      highlightCodeLine: 5, // node = node.children[char]
      activeOperation: 'insert',
      trieWord: accum
    });
  }

  // Final Step: Mark End of Word
  nodes[activeId].isEndOfWord = true;
  steps.push({
    type: 'found',
    msg: `Successfully inserted word "${w}". Marked final character '${w[w.length - 1]}' as End Of Word.`,
    trieNodes: cloneNodes(nodes),
    activeNodeId: activeId,
    trieResultStatus: `✓ End of Word`,
    highlightCodeLine: 6, // node.isEndOfWord = true
    activeOperation: 'insert',
    trieWord: w
  });

  return { steps, finalNodes: nodes };
}

export function traceSearch(word: string, currentNodes: Record<string, VisualTrieNode>): Step[] {
  const steps: Step[] = [];
  const nodes = cloneNodes(currentNodes);
  const w = word.toUpperCase().trim().replace(/[^A-Z]/g, '');

  if (!w) {
    return [{
      type: 'info',
      msg: 'Enter a valid word to search.',
      trieNodes: nodes,
      activeNodeId: null,
      trieResultStatus: 'Empty Input',
      highlightCodeLine: 0,
      activeOperation: 'search'
    }];
  }

  // Clear transient styles
  for (const id in nodes) {
    delete nodes[id].isNew;
  }

  // Step 1: Start at root
  let activeId = 'root';
  steps.push({
    type: 'info',
    msg: `Starting search for "${w}" at Root node.`,
    trieNodes: cloneNodes(nodes),
    activeNodeId: activeId,
    trieResultStatus: `Search: "${w}"`,
    highlightCodeLine: 1, // node = root
    activeOperation: 'search',
    trieWord: ''
  });

  let accum = '';
  let foundPath = true;

  for (let idx = 0; idx < w.length; idx++) {
    const char = w[idx];
    
    // Highlight step: checking children
    steps.push({
      type: 'info',
      msg: `Step ${idx + 1}: Check if character '${char}' exists in children of node (${nodes[activeId].char || 'root'}).`,
      trieNodes: cloneNodes(nodes),
      activeNodeId: activeId,
      currentNodeChar: char,
      trieResultStatus: `Looking for '${char}'`,
      highlightCodeLine: 3, // if char not in node.children
      activeOperation: 'search',
      trieWord: accum
    });

    const nextId = nodes[activeId].children[char];
    if (!nextId) {
      foundPath = false;
      steps.push({
        type: 'mismatch',
        msg: `✗ Character '${char}' is missing in children of node (${nodes[activeId].char || 'root'}). Search aborted.`,
        trieNodes: cloneNodes(nodes),
        activeNodeId: activeId,
        currentNodeChar: char,
        trieResultStatus: `✗ Character Missing`,
        highlightCodeLine: 4, // return false
        activeOperation: 'search',
        trieWord: accum
      });
      break;
    }

    accum += char;
    activeId = nextId;

    steps.push({
      type: 'match',
      msg: `✓ Found child node for character '${char}'. Moving down path.`,
      trieNodes: cloneNodes(nodes),
      activeNodeId: activeId,
      currentNodeChar: char,
      trieResultStatus: `✓ Character Found`,
      highlightCodeLine: 5, // node = node.children[char]
      activeOperation: 'search',
      trieWord: accum
    });
  }

  if (foundPath) {
    const isEOW = nodes[activeId].isEndOfWord;
    steps.push({
      type: isEOW ? 'found' : 'mismatch',
      msg: isEOW
        ? `✓ Full word match found! Node for character '${w[w.length - 1]}' is marked as End Of Word.`
        : `✗ Path for "${w}" exists, but node containing '${w[w.length - 1]}' is NOT marked as End Of Word.`,
      trieNodes: cloneNodes(nodes),
      activeNodeId: activeId,
      trieResultStatus: isEOW ? '✓ Word Found' : '✗ Word Not Found',
      highlightCodeLine: 6, // return node.isEndOfWord
      activeOperation: 'search',
      trieWord: w
    });
  }

  return steps;
}

export function traceStartsWith(prefix: string, currentNodes: Record<string, VisualTrieNode>): Step[] {
  const steps: Step[] = [];
  const nodes = cloneNodes(currentNodes);
  const pre = prefix.toUpperCase().trim().replace(/[^A-Z]/g, '');

  if (!pre) {
    return [{
      type: 'info',
      msg: 'Enter a valid prefix to search.',
      trieNodes: nodes,
      activeNodeId: null,
      trieResultStatus: 'Empty Input',
      highlightCodeLine: 0,
      activeOperation: 'startsWith'
    }];
  }

  // Clear transient styles
  for (const id in nodes) {
    delete nodes[id].isNew;
  }

  // Step 1: Start at root
  let activeId = 'root';
  steps.push({
    type: 'info',
    msg: `Starting StartsWith search for prefix "${pre}" at Root node.`,
    trieNodes: cloneNodes(nodes),
    activeNodeId: activeId,
    trieResultStatus: `StartsWith: "${pre}"`,
    highlightCodeLine: 1, // node = root
    activeOperation: 'startsWith',
    trieWord: ''
  });

  let accum = '';
  let foundPath = true;

  for (let idx = 0; idx < pre.length; idx++) {
    const char = pre[idx];
    
    // Highlight step: checking children
    steps.push({
      type: 'info',
      msg: `Step ${idx + 1}: Check if character '${char}' exists in children of node (${nodes[activeId].char || 'root'}).`,
      trieNodes: cloneNodes(nodes),
      activeNodeId: activeId,
      currentNodeChar: char,
      trieResultStatus: `Looking for '${char}'`,
      highlightCodeLine: 3, // if char not in node.children
      activeOperation: 'startsWith',
      trieWord: accum
    });

    const nextId = nodes[activeId].children[char];
    if (!nextId) {
      foundPath = false;
      steps.push({
        type: 'mismatch',
        msg: `✗ Character '${char}' is missing in children of node (${nodes[activeId].char || 'root'}). Prefix does not exist.`,
        trieNodes: cloneNodes(nodes),
        activeNodeId: activeId,
        currentNodeChar: char,
        trieResultStatus: `✗ Prefix Missing`,
        highlightCodeLine: 4, // return false
        activeOperation: 'startsWith',
        trieWord: accum
      });
      break;
    }

    accum += char;
    activeId = nextId;

    steps.push({
      type: 'match',
      msg: `✓ Found child node for character '${char}'. Moving down path.`,
      trieNodes: cloneNodes(nodes),
      activeNodeId: activeId,
      currentNodeChar: char,
      trieResultStatus: `✓ Character Found`,
      highlightCodeLine: 5, // node = node.children[char]
      activeOperation: 'startsWith',
      trieWord: accum
    });
  }

  if (foundPath) {
    steps.push({
      type: 'found',
      msg: `✓ Prefix path exists in the Trie! Found matching prefix branches for "${pre}".`,
      trieNodes: cloneNodes(nodes),
      activeNodeId: activeId,
      trieResultStatus: '✓ Prefix Exists',
      highlightCodeLine: 6, // return true
      activeOperation: 'startsWith',
      trieWord: pre
    });
  }

  return steps;
}
