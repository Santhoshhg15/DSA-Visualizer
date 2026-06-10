import type { Step } from '../types';

class TrieNode {
  ch: Record<string, TrieNode> = {};
  word: string | null = null;
}

export function buildTrie(gridRaw: string, wordsRaw: string): Step[] {
  const rows = gridRaw.split(',').map(r => r.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''));
  const words = wordsRaw.split(',').map(w => w.trim().toUpperCase()).filter(Boolean);
  const numCols = rows[0]?.length ?? 0;
  const grid = rows.filter(r => r.length === numCols && r.length > 0);

  if (!grid.length || !words.length) return [];

  const st: Step[] = [];

  // Build trie
  const root = new TrieNode();
  for (const w of words) {
    let node = root;
    for (const c of w) {
      if (!node.ch[c]) node.ch[c] = new TrieNode();
      node = node.ch[c];
    }
    node.word = w;
  }

  st.push({
    grid, words, dfsPath: [], found: [],
    msg: `Built Trie from ${words.length} word(s): [${words.join(', ')}]. Starting DFS on ${grid.length}×${numCols} grid.`,
    type: 'info', highlightCodeLine: 1,
  });

  const found: string[] = [];
  const visited = Array.from({ length: grid.length }, () => Array(numCols).fill(false));
  const dirs: [number, number][] = [[0,1],[0,-1],[1,0],[-1,0]];

  function dfs(r: number, c: number, node: TrieNode, path: [number, number][]) {
    if (r < 0 || r >= grid.length || c < 0 || c >= numCols || visited[r][c]) return;
    const ch = grid[r][c];
    if (!node.ch[ch]) return;

    node = node.ch[ch];
    path = [...path, [r, c]];
    visited[r][c] = true;

    st.push({
      grid, words,
      dfsPath: [...path],
      found: [...found],
      trieWord: path.map(([rr, cc]) => grid[rr][cc]).join(''),
      msg: `DFS at (${r},${c})='${ch}' — current path: "${path.map(([rr, cc]) => grid[rr][cc]).join('')}"`,
      type: 'info', highlightCodeLine: 7,
    });

    if (node.word) {
      found.push(node.word);
      node.word = null;
      st.push({
        grid, words,
        dfsPath: [...path],
        found: [...found],
        trieWord: path.map(([rr, cc]) => grid[rr][cc]).join(''),
        msg: `✓ Found word: "${found[found.length - 1]}"!`,
        type: 'found', highlightCodeLine: 8,
      });
    }

    for (const [dr, dc] of dirs) dfs(r + dr, c + dc, node, [...path]);
    visited[r][c] = false;
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < numCols; c++) {
      dfs(r, c, root, []);
    }
  }

  st.push({
    grid, words, dfsPath: [], found: [...found],
    msg: found.length
      ? `Word Search II complete. Found: [${found.join(', ')}]`
      : 'Word Search II complete. No words found.',
    type: found.length ? 'found' : 'info', highlightCodeLine: 10,
  });

  return st;
}
