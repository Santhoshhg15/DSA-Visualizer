import type { Step } from '../types';
import type { AlgoType } from '../types';

interface Props {
  algo: AlgoType;
  step?: Step;
}

// ── Naive ──────────────────────────────────────────────
const NAIVE_CODE = [
  "def naiveSearch(text, pattern):",
  "    for i in range(len(text) - len(pat) + 1):",
  "        for j in range(len(pattern)):",
  "            if text[i+j] != pattern[j]:",
  "                break",
  "        else:",
  "            result.append(i)  # found!",
  "    return result",
];

// ── KMP: LPS Build ────────────────────────────────────
const KMP_LPS_CODE = [
  "def buildLPS(pattern):",
  "    lps = [0] * len(pattern)  # lps[0] = 0",
  "    length, i = 0, 1",
  "    while i < len(pattern):",
  "        if pattern[i] == pattern[length]:",
  "            length += 1; lps[i] = length; i += 1",
  "        elif length > 0:",
  "            length = lps[length - 1]  # fallback",
  "        else:",
  "            lps[i] = 0; i += 1",
  "    return lps",
];

// ── KMP: Search ───────────────────────────────────────
const KMP_SEARCH_CODE = [
  "def KMPSearch(text, pattern, lps):",
  "    i, j = 0, 0",
  "    while i < len(text):",
  "        if text[i] == pattern[j]:",
  "            i += 1; j += 1",
  "        if j == len(pattern):",
  "            result.append(i - j); j = lps[j-1]",
  "        elif text[i] != pattern[j]:",
  "            if j != 0: j = lps[j-1]",
  "            else: i += 1",
  "    return result",
];

// ── Rabin-Karp ────────────────────────────────────────
const RABIN_CODE = [
  "def rabinKarp(text, pattern, d=256, q=101):",
  "    h = pow(d, m-1) % q",
  "    hPat = hash(pattern); hTxt = hash(text[0:m])",
  "    for i in range(n - m + 1):",
  "        if hTxt == hPat:",
  "            if text[i:i+m] == pattern:  # verify",
  "                result.append(i)",
  "        if i < n - m:",
  "            hTxt = roll(hTxt, text[i], text[i+m])",
  "    return result",
];

// ── Trie Word Search II ───────────────────────────────
const TRIE_WS_CODE = [
  "def wordSearchII(board, words):",
  "    trie = buildTrie(words)",
  "    for r, c in all_cells:",
  "        dfs(board, r, c, trie.root)",
  "    def dfs(board, r, c, node):",
  "        if out_of_bounds or visited: return",
  "        if char not in node.children: return",
  "        node = node.children[char]",
  "        if node.word: result.append(word)",
  "        for neighbor: dfs(nr, nc, node)",
  "    return result",
];

function getCodeAndTitle(algo: AlgoType, step?: Step): { code: string[]; title: string; accentColor: string } {
  switch (algo) {
    case 'naive':
      return { code: NAIVE_CODE, title: 'Naive Pattern Search', accentColor: 'from-[#ff6eb4] to-[#ff2a85]' };
    case 'kmp': {
      // LPS phase: no textH comparison, no text index references
      // Search phase: message references text[i] comparisons, or 'Pattern found', or 'j jumps', or 'KMP complete'
      const msg = step?.msg || '';
      const isSearchPhase = msg.includes('text[') || msg.includes('Pattern found') || msg.includes('j jumps') || msg.includes('KMP complete');
      if (isSearchPhase) {
        return { code: KMP_SEARCH_CODE, title: 'KMP — Search Phase', accentColor: 'from-[#5ea8ff] to-[#0062ff]' };
      }
      return { code: KMP_LPS_CODE, title: 'KMP — Build LPS Phase', accentColor: 'from-[#5ea8ff] to-[#0062ff]' };
    }
    case 'rabin':
      return { code: RABIN_CODE, title: 'Rabin-Karp (Rolling Hash)', accentColor: 'from-[#4fffb0] to-[#09d97a]' };
    case 'trie':
      return { code: TRIE_WS_CODE, title: 'Trie + Word Search II', accentColor: 'from-[#a371f7] to-[#7928ca]' };
    default:
      return { code: [], title: '', accentColor: '' };
  }
}

export function Pseudocode({ algo, step }: Props) {
  const { code, title, accentColor } = getCodeAndTitle(algo, step);

  if (!code.length) return null;

  const highlightLine = step?.highlightCodeLine ?? -1;

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-[var(--border-color)] pb-2 flex-shrink-0">
        <span className="text-[10px] font-black text-transparent bg-gradient-to-r from-blue-400 to-[#4fffb0] bg-clip-text uppercase tracking-widest">
          💻 Pseudocode Tracer
        </span>
        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase text-white bg-gradient-to-r ${accentColor}`}>
          {title}
        </span>
      </div>

      {/* Code Lines */}
      <div className="font-mono text-[11px] overflow-y-auto space-y-0.5 scrollbar-none">
        {code.map((line, idx) => {
          const isHighlighted = idx === highlightLine;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-2.5 py-1 rounded-lg transition-all duration-200 ${
                isHighlighted
                  ? `bg-gradient-to-r ${accentColor.replace(/to-\[.*?\]/, 'to-transparent').replace(/from-\[.*?\]/, `from-[${getHighlightBg(algo)}]`)} border-l-2 border-current text-white font-semibold shadow-sm`
                  : 'text-[var(--muted-color)] hover:bg-[var(--pill-btn-bg)]/30'
              }`}
              style={isHighlighted ? {
                borderLeftColor: getAccentSolid(algo),
                backgroundColor: `${getAccentSolid(algo)}15`,
              } : undefined}
            >
              <span className={`w-5 text-right text-[9px] flex-shrink-0 ${isHighlighted ? 'opacity-80' : 'opacity-30'}`}>
                {idx + 1}
              </span>
              <pre className="whitespace-pre overflow-x-auto">{line}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getAccentSolid(algo: AlgoType): string {
  switch (algo) {
    case 'naive': return '#ff6eb4';
    case 'kmp': return '#5ea8ff';
    case 'rabin': return '#4fffb0';
    case 'trie': return '#a371f7';
    default: return '#5ea8ff';
  }
}

function getHighlightBg(algo: AlgoType): string {
  switch (algo) {
    case 'naive': return 'rgba(255,110,180,0.15)';
    case 'kmp': return 'rgba(94,168,255,0.15)';
    case 'rabin': return 'rgba(79,255,176,0.15)';
    case 'trie': return 'rgba(163,113,247,0.15)';
    default: return 'rgba(94,168,255,0.15)';
  }
}
