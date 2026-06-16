import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  activeOperation?: string | null;
  highlightLine?: number;
}

// ── Generic Pseudocode ────────────────────────────────
const INSERT_CODE = [
  "function insert(word):",
  "    node = root",
  "    for each char in word:",
  "        if char not in node.children:",
  "            node.children[char] = new TrieNode()",
  "        node = node.children[char]",
  "    node.isEndOfWord = true"
];

const SEARCH_CODE = [
  "function search(word):",
  "    node = root",
  "    for each char in word:",
  "        if char not in node.children:",
  "            return false",
  "        node = node.children[char]",
  "    return node.isEndOfWord"
];

const STARTSWITH_CODE = [
  "function startsWith(prefix):",
  "    node = root",
  "    for each char in prefix:",
  "        if char not in node.children:",
  "            return false",
  "        node = node.children[char]",
  "    return true"
];

// ── Full Java Class Code (User provided structure) ───
const TRIE_FULL_JAVA_CODE = [
  "class TrieNode",
  "{",
  "    TrieNode[] child;",
  "    boolean isEnd;",
  "",
  "    public TrieNode()",
  "    {",
  "        child = new TrieNode[26];",
  "        isEnd = false;",
  "    }",
  "}",
  "",
  "class Trie",
  "{",
  "    TrieNode root;",
  "",
  "    public Trie()",
  "    {",
  "        root = new TrieNode();",
  "    }",
  "",
  "    public void insert(String word)",
  "    {",
  "        TrieNode current = root;",
  "        for(int i = 0; i < word.length(); i++)",
  "        {",
  "            char ch = word.charAt(i);",
  "            int index = ch - 'a';",
  "            if(current.child[index] == null)",
  "            {",
  "                current.child[index] = new TrieNode();",
  "            }",
  "            current = current.child[index];",
  "        }",
  "        current.isEnd = true;",
  "    }",
  "",
  "    public boolean search(String word)",
  "    {",
  "        TrieNode current = root;",
  "        for(int i = 0; i < word.length(); i++)",
  "        {",
  "            char ch = word.charAt(i);",
  "            int index = ch - 'a';",
  "            if(current.child[index] == null)",
  "            {",
  "                return false;",
  "            }",
  "            current = current.child[index];",
  "        }",
  "        return current.isEnd;",
  "    }",
  "",
  "    public boolean startsWith(String prefix)",
  "    {",
  "        TrieNode current = root;",
  "        for(int i = 0; i < prefix.length(); i++)",
  "        {",
  "            char ch = prefix.charAt(i);",
  "            int index = ch - 'a';",
  "            if(current.child[index] == null)",
  "            {",
  "                return false;",
  "            }",
  "            current = current.child[index];",
  "        }",
  "        return true;",
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
  const classTypes = ['String', 'List', 'ArrayList', 'TrieNode', 'Trie', 'Node'];
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

export function TriePseudocode({ activeOperation, highlightLine }: Props) {
  const [showJavaModal, setShowJavaModal] = useState(false);
  const [modalAnimate, setModalAnimate] = useState(false);
  const [copied, setCopied] = useState(false);

  const genericCode = (() => {
    if (activeOperation === 'insert') return INSERT_CODE;
    if (activeOperation === 'search') return SEARCH_CODE;
    if (activeOperation === 'startsWith') return STARTSWITH_CODE;
    return null;
  })();

  const title = (() => {
    if (activeOperation === 'insert') return 'Trie: Insert';
    if (activeOperation === 'search') return 'Trie: Search';
    if (activeOperation === 'startsWith') return 'Trie: StartsWith';
    return 'Trie Operations';
  })();

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
    navigator.clipboard.writeText(TRIE_FULL_JAVA_CODE.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Early return AFTER all hooks have been called
  if (!genericCode) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl backdrop-blur-xl h-full flex flex-col justify-center items-center text-[var(--muted-color)] text-xs font-semibold">
        Perform an action (Insert, Search, or StartsWith) to start line tracking
      </div>
    );
  }

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl backdrop-blur-xl h-full flex flex-col">
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

      {/* Code list (Generic Pseudocode) */}
      <div className="flex-grow font-mono text-[11px] overflow-y-auto space-y-1 scrollbar-none">
        {genericCode.map((line, idx) => {
          const isHighlighted = idx === highlightLine;
          return (
            <div
              key={idx}
              className={`flex items-center gap-4 px-2 py-0.5 rounded transition-colors duration-150 ${
                isHighlighted
                  ? 'bg-gradient-to-r from-emerald-500/15 to-transparent border-l-2 border-emerald-500 text-white font-semibold'
                  : 'text-[var(--muted-color)]'
              }`}
            >
              <span className="w-4 text-right opacity-30 text-[9px]">{idx + 1}</span>
              <pre className="whitespace-pre">{line}</pre>
            </div>
          );
        })}
      </div>

      {/* VS Code Theme Full Screen Java Overlay Modal */}
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
                  <span className="text-[#f59e0b]">☕</span> Trie.java
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
                  {TRIE_FULL_JAVA_CODE.map((_, idx) => (
                    <span key={idx}>{idx + 1}</span>
                  ))}
                </div>

                {/* Code text */}
                <pre className="pl-4 text-[#d4d4d4] whitespace-pre font-mono">
                  {TRIE_FULL_JAVA_CODE.map((line, idx) => (
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
