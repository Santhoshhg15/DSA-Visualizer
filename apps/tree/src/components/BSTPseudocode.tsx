import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  activeOperation?: string | null;
  highlightLine?: number;
}

const INSERT_CODE = [
  "function insert(node, val):",
  "    if node == null:",
  "        return new Node(val)",
  "    if val < node.val:",
  "        node.left = insert(node.left, val)",
  "    else if val > node.val:",
  "        node.right = insert(node.right, val)",
  "    return node"
];

const SEARCH_CODE = [
  "function search(node, val):",
  "    if node == null or node.val == val:",
  "        return node",
  "    if val < node.val:",
  "        return search(node.left, val)",
  "    else:",
  "        return search(node.right, val)"
];

const DELETE_CODE = [
  "function deleteNode(root, val):",
  "    if root == null: return null",
  "    if val < root.val:",
  "        root.left = deleteNode(root.left, val)",
  "    else if val > root.val:",
  "        root.right = deleteNode(root.right, val)",
  "    else:",
  "        if root.left == null: return root.right",
  "        if root.right == null: return root.left",
  "        root.val = minValue(root.right)",
  "        root.right = deleteNode(root.right, root.val)",
  "    return root"
];

const INORDER_CODE = [
  "function inorder(node):",
  "    if node == null: return",
  "    inorder(node.left)",
  "    print(node.val)",
  "    inorder(node.right)",
  "    return"
];

const PREORDER_CODE = [
  "function preorder(node):",
  "    if node == null: return",
  "    print(node.val)",
  "    preorder(node.left)",
  "    preorder(node.right)",
  "    return"
];

const POSTORDER_CODE = [
  "function postorder(node):",
  "    if node == null: return",
  "    postorder(node.left)",
  "    postorder(node.right)",
  "    print(node.val)",
  "    return"
];

const BFS_CODE = [
  "function bfs(root):",
  "    queue = [root]",
  "    while queue is not empty:",
  "        curr = queue.pop(0)",
  "        print(curr.val)",
  "        if curr.left:",
  "            queue.append(curr.left)",
  "        if curr.right:",
  "            queue.append(curr.right)"
];

const BST_FULL_JAVA_CODE = [
  "class Node {",
  "    int val;",
  "    Node left, right;",
  "",
  "    public Node(int item) {",
  "        val = item;",
  "        left = right = null;",
  "    }",
  "}",
  "",
  "class BinarySearchTree {",
  "    Node root;",
  "",
  "    public BinarySearchTree() {",
  "        root = null;",
  "    }",
  "",
  "    public void insert(int key) {",
  "        root = insertRec(root, key);",
  "    }",
  "",
  "    private Node insertRec(Node root, int key) {",
  "        if (root == null) {",
  "            root = new Node(key);",
  "            return root;",
  "        }",
  "        if (key < root.val)",
  "            root.left = insertRec(root.left, key);",
  "        else if (key > root.val)",
  "            root.right = insertRec(root.right, key);",
  "        return root;",
  "    }",
  "",
  "    public boolean search(int key) {",
  "        return searchRec(root, key) != null;",
  "    }",
  "",
  "    private Node searchRec(Node root, int key) {",
  "        if (root == null || root.val == key)",
  "            return root;",
  "        if (key < root.val)",
  "            return searchRec(root.left, key);",
  "        return searchRec(root.right, key);",
  "    }",
  "",
  "    public void delete(int key) {",
  "        root = deleteRec(root, key);",
  "    }",
  "",
  "    private Node deleteRec(Node root, int key) {",
  "        if (root == null) return root;",
  "        if (key < root.val)",
  "            root.left = deleteRec(root.left, key);",
  "        else if (key > root.val)",
  "            root.right = deleteRec(root.right, key);",
  "        else {",
  "            if (root.left == null) return root.right;",
  "            else if (root.right == null) return root.left;",
  "            root.val = minValue(root.right);",
  "            root.right = deleteRec(root.right, root.val);",
  "        }",
  "        return root;",
  "    }",
  "",
  "    private int minValue(Node root) {",
  "        int minv = root.val;",
  "        while (root.left != null) {",
  "            minv = root.left.val;",
  "            root = root.left;",
  "        }",
  "        return minv;",
  "    }",
  "}"
];

function highlightJavaTokens(text: string): string {
  let html = text;

  // Highlight strings
  html = html.replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color: #ce9178;">$1</span>');

  // Keywords
  const controlKeywords = ['if', 'for', 'while', 'return', 'break', 'else'];
  controlKeywords.forEach(kw => {
    const reg = new RegExp(`\\b(${kw})\\b`, 'g');
    html = html.replace(reg, '<span style="color: #c586c0;">$1</span>');
  });

  const typeKeywords = ['public', 'private', 'static', 'class', 'void', 'int', 'boolean', 'new'];
  typeKeywords.forEach(kw => {
    const reg = new RegExp(`\\b(${kw})\\b`, 'g');
    html = html.replace(reg, '<span style="color: #569cd6;">$1</span>');
  });

  const classTypes = ['String', 'Node', 'BinarySearchTree', 'System', 'out'];
  classTypes.forEach(t => {
    const reg = new RegExp(`\\b(${t})\\b`, 'g');
    html = html.replace(reg, '<span style="color: #4ec9b0;">$1</span>');
  });

  // Numbers
  html = html.replace(/\b(\d+)\b/g, '<span style="color: #b5cea8;">$1</span>');

  // Methods
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

export function BSTPseudocode({ activeOperation, highlightLine }: Props) {
  const [showJavaModal, setShowJavaModal] = useState(false);
  const [modalAnimate, setModalAnimate] = useState(false);
  const [copied, setCopied] = useState(false);

  const genericCode = (() => {
    if (activeOperation === 'insert') return INSERT_CODE;
    if (activeOperation === 'search') return SEARCH_CODE;
    if (activeOperation === 'delete') return DELETE_CODE;
    if (activeOperation === 'inorder') return INORDER_CODE;
    if (activeOperation === 'preorder') return PREORDER_CODE;
    if (activeOperation === 'postorder') return POSTORDER_CODE;
    if (activeOperation === 'bfs') return BFS_CODE;
    return null;
  })();

  const title = (() => {
    if (activeOperation === 'insert') return 'BST: Insert';
    if (activeOperation === 'search') return 'BST: Search';
    if (activeOperation === 'delete') return 'BST: Delete';
    if (activeOperation === 'inorder') return 'Inorder DFS';
    if (activeOperation === 'preorder') return 'Preorder DFS';
    if (activeOperation === 'postorder') return 'Postorder DFS';
    if (activeOperation === 'bfs') return 'Level-order BFS';
    return 'BST Operations';
  })();

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
    navigator.clipboard.writeText(BST_FULL_JAVA_CODE.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!genericCode) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl backdrop-blur-xl h-full flex flex-col justify-center items-center text-[var(--muted-color)] text-xs font-semibold">
        Perform a tree operation (Insert, Search, Delete, or Traversal) to trace execution.
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

      {/* Code Lines */}
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

      {/* Java Code Modal */}
      {showJavaModal && createPortal(
        <div 
          className={`fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-8 transition-opacity duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            modalAnimate ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseModal}
        >
          <div 
            className={`w-full max-w-4xl h-[85vh] bg-[#1e1e1e] rounded-xl border border-[#333] shadow-2xl flex flex-col overflow-hidden font-mono text-xs transition-all duration-350 transform ${
              modalAnimate 
                ? 'scale-100 translate-y-0 opacity-100 rotate-0 ease-[cubic-bezier(0.34,1.56,0.64,1)]' 
                : 'scale-[0.25] translate-y-[15vh] opacity-0 rotate-1 ease-[cubic-bezier(0.25,1,0.5,1)]'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ transformOrigin: 'bottom center' }}
          >
            {/* Title Bar */}
            <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center justify-between border-b border-[#1e1e1e] flex-shrink-0">
              <div className="flex items-center gap-6">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-pointer hover:opacity-85" onClick={handleCloseModal} />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="bg-[#1e1e1e] px-4 py-1.5 rounded-t-lg border-t-2 border-[#007acc] flex items-center gap-2 text-[11px] font-semibold">
                  <span className="text-[#f59e0b]">☕</span> BST.java
                </div>
              </div>

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

            {/* Code Body */}
            <div className="flex-grow overflow-auto p-6 bg-[#1e1e1e] leading-relaxed scrollbar-thin select-text">
              <div className="flex min-w-max">
                <div className="text-right text-[#858585] pr-4 select-none border-r border-[#333] flex flex-col min-w-[30px] font-sans">
                  {BST_FULL_JAVA_CODE.map((_, idx) => (
                    <span key={idx}>{idx + 1}</span>
                  ))}
                </div>

                <pre className="pl-4 text-[#d4d4d4] whitespace-pre font-mono">
                  {BST_FULL_JAVA_CODE.map((line, idx) => (
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
