import { create } from 'zustand';
import type { AlgoType, Step, VisualTrieNode } from './types';

interface VisualizerStore {
  algo: AlgoType;
  steps: Step[];
  cur: number;
  playing: boolean;
  speed: number;
  // inputs
  textInput: string;
  patInput: string;
  gridInput: string;
  wordsInput: string;
  tab: 'setup' | 'visualizer';
  codeLanguage: 'python' | 'java';
  darkMode: boolean;
  
  // Persistent Trie Playground State
  trieWords: string[];
  trieNodes: Record<string, VisualTrieNode>;

  setAlgo: (a: AlgoType) => void;
  setSteps: (s: Step[]) => void;
  setStepsAndPlay: (s: Step[]) => void;
  setCur: (n: number) => void;
  setPlaying: (b: boolean) => void;
  setSpeed: (n: number) => void;
  setTextInput: (s: string) => void;
  setPatInput: (s: string) => void;
  setGridInput: (s: string) => void;
  setWordsInput: (s: string) => void;
  setTab: (t: 'setup' | 'visualizer') => void;
  setCodeLanguage: (lang: 'python' | 'java') => void;
  setDarkMode: (val: boolean) => void;
  reset: () => void;
  
  // Trie state updates
  setTrieState: (words: string[], nodes: Record<string, VisualTrieNode>) => void;
  clearTrie: () => void;
}

const INITIAL_TRIE_NODES: Record<string, VisualTrieNode> = {
  root: { id: 'root', char: '', children: {}, isEndOfWord: false }
};

export const useStore = create<VisualizerStore>((set) => ({
  algo: 'naive',
  steps: [],
  cur: 0,
  playing: false,
  speed: 1.0,
  textInput: 'AABAACAADAABAABA',
  patInput: 'AABA',
  gridInput: 'OAT,EAA,IHN,PGH',
  wordsInput: 'OAT,EAT,ATE,OATH',
  tab: 'setup',
  codeLanguage: 'python',
  darkMode: true,
  
  trieWords: [],
  trieNodes: INITIAL_TRIE_NODES,

  setAlgo: (algo) => set({ algo, steps: [], cur: 0, playing: false, tab: 'setup' }),
  setSteps: (steps) => set({ steps, cur: 0, playing: false, tab: 'visualizer' }),
  setStepsAndPlay: (steps) => set({ steps, cur: 0, playing: true, tab: 'visualizer' }),
  setCur: (cur) => set({ cur }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  setTextInput: (textInput) => set({ textInput }),
  setPatInput: (patInput) => set({ patInput }),
  setGridInput: (gridInput) => set({ gridInput }),
  setWordsInput: (wordsInput) => set({ wordsInput }),
  setTab: (tab) => set({ tab }),
  setCodeLanguage: (codeLanguage) => set({ codeLanguage }),
  setDarkMode: (darkMode) => set({ darkMode }),
  reset: () => set({ steps: [], cur: 0, playing: false, tab: 'setup' }),
  
  setTrieState: (trieWords, trieNodes) => set({ trieWords, trieNodes }),
  clearTrie: () => set({
    trieWords: [],
    trieNodes: INITIAL_TRIE_NODES,
    steps: [],
    cur: 0,
    playing: false
  }),
}));
