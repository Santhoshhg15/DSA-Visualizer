import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Step } from '../types';
import type { AlgoType } from '../types';

interface Props {
  algo: AlgoType;
  step?: Step;
}

// ── Generic Pseudocode ────────────────────────────────
const NAIVE_CODE = [
  "function naiveSearch(text, pattern):",
  "    n = length(text), m = length(pattern)",
  "    for i from 0 to n - m:",
  "        match = true",
  "        for j from 0 to m - 1:",
  "            if text[i + j] != pattern[j]:",
  "                match = false",
  "                break",
  "        if match is true:",
  "            add i to results",
  "    return results"
];

const KMP_LPS_CODE = [
  "function buildLPS(pattern):",
  "    m = length(pattern)",
  "    lps = array of size m filled with 0",
  "    len = 0, i = 1",
  "    while i < m:",
  "        if pattern[i] == pattern[len]:",
  "            len = len + 1; lps[i] = len; i = i + 1",
  "        else if len > 0:",
  "            len = lps[len - 1] // fallback",
  "        else:",
  "            lps[i] = 0; i = i + 1",
  "    return lps"
];

const KMP_SEARCH_CODE = [
  "function KMPSearch(text, pattern, lps):",
  "    n = length(text), m = length(pattern)",
  "    i = 0, j = 0",
  "    while i < n:",
  "        if text[i] == pattern[j]:",
  "            i = i + 1; j = j + 1",
  "        if j == m:",
  "            add (i - j) to results; j = lps[j - 1]",
  "        else if i < n and text[i] != pattern[j]:",
  "            if j != 0: j = lps[j - 1]",
  "            else: i = i + 1",
  "    return results"
];

const RABIN_CODE = [
  "function rabinKarp(text, pattern, d, q):",
  "    n = length(text), m = length(pattern)",
  "    h = d^(m-1) mod q",
  "    hPat = hash(pattern); hTxt = hash(first m chars of text)",
  "    for i from 0 to n - m:",
  "        if hTxt == hPat:",
  "            if text[i ... i+m-1] == pattern: // verify",
  "                add i to results",
  "        if i < n - m:",
  "            hTxt = rollHash(hTxt, text[i], text[i+m])",
  "    return results"
];

const TRIE_WS_CODE = [
  "function wordSearchII(board, words):",
  "    trie = buildTrie(words)",
  "    for each cell (r, c) on board:",
  "        dfs(board, r, c, trie.root)",
  "",
  "function dfs(board, r, c, node):",
  "    if out of bounds or visited: return",
  "    if char not in node.children: return",
  "    node = node.children[char]",
  "    if node contains word: add word to results",
  "    for each neighbor (nr, nc): dfs(board, nr, nc, node)"
];

// ── Java equivalents (Fully wrapped classes) ───────────
const NAIVE_JAVA_CODE = [
  "class NaiveSearch",
  "{",
  "    public static int search(String text, String pattern)",
  "    {",
  "        int n = text.length();",
  "        int m = pattern.length();",
  "        for (int i = 0; i <= n - m; i++)",
  "        {",
  "            int j;",
  "            for (j = 0; j < m; j++)",
  "            {",
  "                if (text.charAt(i + j) != pattern.charAt(j))",
  "                {",
  "                    break;",
  "                }",
  "            }",
  "            if (j == m)",
  "            {",
  "                return i; // Found!",
  "            }",
  "        }",
  "        return -1;",
  "    }",
  "}"
];

const KMP_JAVA_CODE = [
  "class KMP",
  "{",
  "    public static int[] buildLPS(String pattern)",
  "    {",
  "        int[] lps = new int[pattern.length()];",
  "        int len = 0;",
  "        int i = 1;",
  "        while(i < pattern.length())",
  "        {",
  "            if(pattern.charAt(i) == pattern.charAt(len))",
  "            {",
  "                len++;",
  "                lps[i] = len;",
  "                i++;",
  "            }",
  "            else",
  "            {",
  "                if(len != 0)",
  "                {",
  "                    len = lps[len - 1];",
  "                }",
  "                else",
  "                {",
  "                    lps[i] = 0;",
  "                    i++;",
  "                }",
  "            }",
  "        }",
  "        return lps;",
  "    }",
  "",
  "    public static int search(String text, String pattern)",
  "    {",
  "        int[] lps = buildLPS(pattern);",
  "        int i = 0;",
  "        int j = 0;",
  "        while(i < text.length())",
  "        {",
  "            if(text.charAt(i) == pattern.charAt(j))",
  "            {",
  "                i++;",
  "                j++;",
  "            }",
  "            if(j == pattern.length())",
  "            {",
  "                return i - j; // Found!",
  "            }",
  "            else if(i < text.length() &&",
  "                    text.charAt(i) != pattern.charAt(j))",
  "            {",
  "                if(j != 0)",
  "                {",
  "                    j = lps[j - 1];",
  "                }",
  "                else",
  "                {",
  "                    i++;",
  "                }",
  "            }",
  "        }",
  "        return -1;",
  "    }",
  "}"
];

const RABIN_JAVA_CODE = [
  "class RabinKarp",
  "{",
  "    public static int search(String text, String pattern)",
  "    {",
  "        int n = text.length();",
  "        int m = pattern.length();",
  "        int patternHash = 0;",
  "        int windowHash = 0;",
  "        for(int i=0;i<m;i++)",
  "        {",
  "            patternHash += pattern.charAt(i);",
  "            windowHash += text.charAt(i);",
  "        }",
  "        for(int i=0;i<=n-m;i++)",
  "        {",
  "            if(patternHash == windowHash)",
  "            {",
  "                boolean match = true;",
  "                for(int j=0;j<m;j++)",
  "                {",
  "                    if(text.charAt(i+j)!=pattern.charAt(j))",
  "                    {",
  "                        match = false;",
  "                        break;",
  "                    }",
  "                }",
  "                if(match)",
  "                {",
  "                    return i; // Found!",
  "                }",
  "            }",
  "            if(i<n-m)",
  "            {",
  "                windowHash = windowHash",
  "                             - text.charAt(i)",
  "                             + text.charAt(i+m);",
  "            }",
  "        }",
  "        return -1;",
  "    }",
  "}"
];

const TRIE_WS_JAVA_CODE = [
  "class TrieNode",
  "{",
  "    TrieNode[] child = new TrieNode[26];",
  "    boolean isEnd = false;",
  "    String word = null;",
  "}",
  "",
  "class WordSearchII",
  "{",
  "    TrieNode root = new TrieNode();",
  "",
  "    public List<String> wordSearchII(char[][] board, String[] words)",
  "    {",
  "        buildTrie(words);",
  "        List<String> result = new ArrayList<>();",
  "        boolean[][] visited = new boolean[board.length][board[0].length];",
  "        for (int r = 0; r < board.length; r++)",
  "        {",
  "            for (int c = 0; c < board[0].length; c++)",
  "            {",
  "                dfs(board, r, c, root, visited, result);",
  "            }",
  "        }",
  "        return result;",
  "    }",
  "",
  "    private void dfs(char[][] bd, int r, int c, TrieNode node, boolean[][] visited, List<String> res)",
  "    {",
  "        if (r < 0 || r >= bd.length || c < 0 || c >= bd[0].length || visited[r][c]) return;",
  "        char ch = bd[r][c];",
  "        int index = ch - 'a';",
  "        if (node.child[index] == null) return;",
  "        node = node.child[index];",
  "        if (node.isEnd) res.add(node.word);",
  "        visited[r][c] = true;",
  "        int[][] dirs = {{0,1}, {0,-1}, {1,0}, {-1,0}};",
  "        for (int[] dir : dirs)",
  "        {",
  "            dfs(bd, r + dir[0], c + dir[1], node, visited, res);",
  "        }",
  "        visited[r][c] = false;",
  "    }",
  "",
  "    private void buildTrie(String[] words)",
  "    {",
  "        for (String w : words)",
  "        {",
  "            TrieNode curr = root;",
  "            for (char ch : w.toCharArray())",
  "            {",
  "                int idx = ch - 'a';",
  "                if (curr.child[idx] == null) curr.child[idx] = new TrieNode();",
  "                curr = curr.child[idx];",
  "            }",
  "            curr.isEnd = true;",
  "            curr.word = w;",
  "        }",
  "    }",
  "}"
];

function highlightJavaTokens(text: string): string {
  let html = text;

  // Highlight strings: "..."
  html = html.replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color: #ce9178;">$1</span>');

  // Control flow keywords: pink/magenta
  const controlKeywords = ['if', 'for', 'while', 'return', 'break', 'else'];
  controlKeywords.forEach(kw => {
    const reg = new RegExp(`\\b(${kw})\\b`, 'g');
    html = html.replace(reg, '<span style="color: #c586c0;">$1</span>');
  });

  // Structural modifiers: blue
  const typeKeywords = ['public', 'private', 'static', 'class', 'void', 'int', 'boolean', 'new'];
  typeKeywords.forEach(kw => {
    const reg = new RegExp(`\\b(${kw})\\b`, 'g');
    html = html.replace(reg, '<span style="color: #569cd6;">$1</span>');
  });

  // Custom class types: teal
  const classTypes = ['String', 'List', 'ArrayList', 'TrieNode', 'Trie', 'Node', 'RabinKarp', 'KMP', 'NaiveSearch', 'WordSearchII'];
  classTypes.forEach(t => {
    const reg = new RegExp(`\\b(${t})\\b`, 'g');
    html = html.replace(reg, '<span style="color: #4ec9b0;">$1</span>');
  });

  // Numbers: light green
  html = html.replace(/\b(\d+)\b/g, '<span style="color: #b5cea8;">$1</span>');

  // Method calls: yellow
  html = html.replace(/\b(\w+)(?=\()/g, '<span style="color: #dcdcaa;">$1</span>');

  return html;
}

function highlightJava(line: string): string {
  let escaped = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (escaped.includes('//')) {
    const parts = escaped.split('//');
    const codePart = highlightJavaTokens(parts[0]);
    const commentPart = parts.slice(1).join('//');
    return `${codePart}<span style="color: #6a9955;">//${commentPart}</span>`;
  }
  return highlightJavaTokens(escaped);
}

function getCodeAndTitle(algo: AlgoType, step: Step | undefined, lang: 'python' | 'java'): { code: string[]; title: string; filename: string; accentColor: string } {
  const isJava = lang === 'java';
  
  switch (algo) {
    case 'naive':
      return { 
        code: isJava ? NAIVE_JAVA_CODE : NAIVE_CODE, 
        title: 'Naive Search', 
        filename: 'NaiveSearch.java',
        accentColor: 'from-[#ff6eb4] to-[#ff2a85]' 
      };
    case 'kmp': {
      const msg = step?.msg || '';
      const isSearchPhase = msg.includes('text[') || msg.includes('Pattern found') || msg.includes('j jumps') || msg.includes('KMP complete');
      if (isSearchPhase) {
        return { 
          code: isJava ? KMP_JAVA_CODE : KMP_SEARCH_CODE, 
          title: 'KMP (Search)', 
          filename: 'KMP.java',
          accentColor: 'from-[#5ea8ff] to-[#0062ff]' 
        };
      }
      return { 
        code: isJava ? KMP_JAVA_CODE : KMP_LPS_CODE, 
        title: 'KMP (LPS Build)', 
        filename: 'KMP.java',
        accentColor: 'from-[#5ea8ff] to-[#0062ff]' 
      };
    }
    case 'rabin':
      return { 
        code: isJava ? RABIN_JAVA_CODE : RABIN_CODE, 
        title: 'Rabin-Karp', 
        filename: 'RabinKarp.java',
        accentColor: 'from-[#4fffb0] to-[#09d97a]' 
      };
    case 'trie':
      return { 
        code: isJava ? TRIE_WS_JAVA_CODE : TRIE_WS_CODE, 
        title: 'Trie Grid DFS', 
        filename: 'WordSearchII.java',
        accentColor: 'from-[#a371f7] to-[#7928ca]' 
      };
    default:
      return { code: [], title: '', filename: 'Source.java', accentColor: '' };
  }
}

export function Pseudocode({ algo, step }: Props) {
  const [showJavaModal, setShowJavaModal] = useState(false);
  const [modalAnimate, setModalAnimate] = useState(false);
  const [copied, setCopied] = useState(false);

  const { code: genericCode, title, accentColor } = getCodeAndTitle(algo, step, 'python');
  const { code: javaCode, filename } = getCodeAndTitle(algo, step, 'java');

  const highlightLine = step?.highlightCodeLine ?? -1;

  // ALL hooks must be called before any early return (Rules of Hooks)
  const handleOpenModal = () => {
    setShowJavaModal(true);
  };

  useEffect(() => {
    if (showJavaModal) {
      const frame = requestAnimationFrame(() => {
        setModalAnimate(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [showJavaModal]);

  const handleCloseModal = () => {
    setModalAnimate(false);
    setTimeout(() => {
      setShowJavaModal(false);
    }, 350);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(javaCode.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Early return AFTER all hooks have been called
  if (!genericCode.length) return null;

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-3 flex-shrink-0 gap-2">
        <span className="text-[10px] font-black text-transparent bg-gradient-to-r from-blue-400 to-[#4fffb0] bg-clip-text uppercase tracking-widest">
          💻 {title}
        </span>
        
        <button
          onClick={handleOpenModal}
          className="px-2.5 py-1 rounded-xl text-[9px] font-extrabold transition-all border border-[var(--border-color)] bg-[var(--pill-btn-bg)] hover:bg-[var(--pill-btn-hover)] text-[var(--text-color)] hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-sm"
          title="Open Java Code in Full Screen VS Code Mode"
        >
          ☕ View Java Code
        </button>
      </div>

      {/* Code Lines (Generic Pseudocode) */}
      <div className="font-mono text-[11px] overflow-y-auto space-y-0.5 scrollbar-none">
        {genericCode.map((line, idx) => {
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

      {/* VS Code Theme Full Screen Java Overlay Modal (Rendered outside local stacking context) */}
      {showJavaModal && createPortal(
        <div 
          className={`fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-8 transition-opacity duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            modalAnimate ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseModal}
        >
          {/* Modal Container: Animated with macOS Genie-like scale & bounce cubic bezier curves */}
          <div 
            className={`w-full max-w-4xl h-[85vh] bg-[#1e1e1e] rounded-xl border border-[#333] shadow-2xl flex flex-col overflow-hidden font-mono text-xs transition-all duration-350 transform ${
              modalAnimate 
                ? 'scale-100 translate-y-0 opacity-100 rotate-0 ease-[cubic-bezier(0.34,1.56,0.64,1)]' 
                : 'scale-[0.25] translate-y-[15vh] opacity-0 rotate-1 ease-[cubic-bezier(0.25,1,0.5,1)]'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ transformOrigin: 'bottom center' }}
          >
            {/* Title Bar (VS Code Look) */}
            <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center justify-between border-b border-[#1e1e1e] flex-shrink-0">
              <div className="flex items-center gap-6">
                {/* Traffic Light Dots */}
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-pointer hover:opacity-85" onClick={handleCloseModal} />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                {/* Active Tab filename */}
                <div className="bg-[#1e1e1e] px-4 py-1.5 rounded-t-lg border-t-2 border-[#007acc] flex items-center gap-2 text-[11px] font-semibold">
                  <span className="text-[#f59e0b]">☕</span> {filename}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white text-[10px] font-bold transition-all flex items-center gap-1.5 active:scale-95"
                >
                  {copied ? '✓ Copied' : '📋 Copy Code'}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded hover:bg-[#ff5f56]/20 text-gray-400 hover:text-white transition-all text-sm font-black active:scale-90"
                  title="Close Window"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Code Body - Single Scroll Container with sync scroll */}
            <div className="flex-grow overflow-auto p-6 bg-[#1e1e1e] leading-relaxed scrollbar-thin select-text">
              <div className="flex min-w-max">
                {/* Line Numbers */}
                <div className="text-right text-[#858585] pr-4 select-none border-r border-[#333] flex flex-col min-w-[30px] font-sans">
                  {javaCode.map((_, idx) => (
                    <span key={idx}>{idx + 1}</span>
                  ))}
                </div>

                {/* Code text */}
                <pre className="pl-4 text-[#d4d4d4] whitespace-pre font-mono">
                  {javaCode.map((line, idx) => (
                    <div
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: highlightJava(line) || '&nbsp;' }}
                    />
                  ))}
                </pre>
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="bg-[#007acc] text-white px-4 py-1 flex items-center justify-between text-[10px] select-none flex-shrink-0">
              <div>Java Code Viewer (VS Code Theme)</div>
              <div>UTF-8</div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
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

function getAccentSolid(algo: AlgoType): string {
  switch (algo) {
    case 'naive': return '#ff6eb4';
    case 'kmp': return '#5ea8ff';
    case 'rabin': return '#4fffb0';
    case 'trie': return '#a371f7';
    default: return '#5ea8ff';
  }
}
