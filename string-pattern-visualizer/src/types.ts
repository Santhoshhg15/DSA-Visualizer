export type AlgoType = 'naive' | 'kmp' | 'rabin' | 'trie' | 'triePlayground';

export type CellState = 'default' | 'window' | 'active' | 'match' | 'mismatch' | 'found' | 'path';

export type StepType = 'info' | 'match' | 'mismatch' | 'found';

export interface VisualTrieNode {
  id: string;
  char: string;
  children: Record<string, string>; // character -> childNodeId
  isEndOfWord: boolean;
  isNew?: boolean;
}

export interface Step {
  type: StepType;
  msg: string;
  // For string algos
  text?: string;
  pattern?: string;
  textH?: Record<number, CellState>;
  patH?: Record<number, CellState>;
  i?: number;
  j?: number;
  foundSoFar?: number[];
  // KMP
  lps?: (number | undefined)[];
  lpsIdx?: number;
  // Rabin-Karp
  hashTxt?: number;
  hashPat?: number;
  spurious?: boolean;
  // Trie
  grid?: string[];
  words?: string[];
  dfsPath?: [number, number][];
  trieWord?: string;
  found?: string[];
  // Trie Prefix Tree Playground
  trieNodes?: Record<string, VisualTrieNode>;
  activeNodeId?: string | null;
  currentNodeChar?: string;
  trieResultStatus?: string;
  highlightCodeLine?: number;
  activeOperation?: 'insert' | 'search' | 'startsWith';
}
