
interface Props {
  activeOperation?: 'insert' | 'search' | 'startsWith' | null;
  highlightLine?: number;
}

const INSERT_CODE = [
  "def insert(self, word: str) -> None:",
  "    node = self.root",
  "    for char in word:",
  "        if char not in node.children:",
  "            node.children[char] = TrieNode()",
  "        node = node.children[char]",
  "    node.isEndOfWord = True"
];

const SEARCH_CODE = [
  "def search(self, word: str) -> bool:",
  "    node = self.root",
  "    for char in word:",
  "        if char not in node.children:",
  "            return False",
  "        node = node.children[char]",
  "    return node.isEndOfWord"
];

const STARTSWITH_CODE = [
  "def startsWith(self, prefix: str) -> bool:",
  "    node = self.root",
  "    for char in prefix:",
  "        if char not in node.children:",
  "            return False",
  "        node = node.children[char]",
  "    return True"
];

export function TriePseudocode({ activeOperation, highlightLine }: Props) {
  const code = (() => {
    if (activeOperation === 'insert') return INSERT_CODE;
    if (activeOperation === 'search') return SEARCH_CODE;
    if (activeOperation === 'startsWith') return STARTSWITH_CODE;
    return null;
  })();

  const title = (() => {
    if (activeOperation === 'insert') return 'Insert(word)';
    if (activeOperation === 'search') return 'Search(word)';
    if (activeOperation === 'startsWith') return 'StartsWith(prefix)';
    return 'Trie Operations Pseudocode';
  })();

  if (!code) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl backdrop-blur-xl h-full flex flex-col justify-center items-center text-[var(--muted-color)] text-xs font-semibold">
        Perform an action (Insert, Search, or StartsWith) to start line tracking
      </div>
    );
  }

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl backdrop-blur-xl h-full flex flex-col">
      <div className="text-[10px] font-black text-transparent bg-gradient-to-r from-blue-400 to-[#4fffb0] bg-clip-text uppercase tracking-widest mb-3 border-b border-[var(--border-color)] pb-2 flex-shrink-0">
        💻 Pseudocode Tracer: {title}
      </div>
      <div className="flex-grow font-mono text-[11px] overflow-y-auto space-y-1 scrollbar-none">
        {code.map((line, idx) => {
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
    </div>
  );
}
