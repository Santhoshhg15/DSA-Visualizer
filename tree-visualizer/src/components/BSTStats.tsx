import { useMemo } from 'react';
import type { VisualBSTNode } from '../types';

interface Props {
  nodes: Record<string, VisualBSTNode>;
  rootId: string | null;
}

export function BSTStats({ nodes, rootId }: Props) {
  const stats = useMemo(() => {
    if (!rootId || Object.keys(nodes).length === 0) {
      return {
        totalNodes: 0,
        height: 0,
        levels: 0,
        leafNodes: 0,
        internalNodes: 0,
        isValid: true,
        balanceFactor: 0
      };
    }

    // 1. Helper to calculate node height (0-indexed)
    function getNodeHeight(nodeId: string | null): number {
      if (!nodeId || !nodes[nodeId]) return -1;
      const node = nodes[nodeId];
      return Math.max(getNodeHeight(node.leftId), getNodeHeight(node.rightId)) + 1;
    }

    const rootHeight = getNodeHeight(rootId);
    const levels = rootHeight + 1;

    // 2. Count leaves and internal nodes
    let leafNodes = 0;
    let internalNodes = 0;
    for (const id in nodes) {
      const n = nodes[id];
      if (!n.leftId && !n.rightId) {
        leafNodes++;
      } else {
        internalNodes++;
      }
    }

    // 3. Check BST Validity via in-order traversal validation
    const inOrderValues: number[] = [];
    function validateBST(nodeId: string | null) {
      if (!nodeId || !nodes[nodeId]) return;
      const node = nodes[nodeId];
      validateBST(node.leftId);
      inOrderValues.push(node.value);
      validateBST(node.rightId);
    }
    validateBST(rootId);

    let isValid = true;
    for (let i = 1; i < inOrderValues.length; i++) {
      if (inOrderValues[i] <= inOrderValues[i - 1]) {
        isValid = false;
        break;
      }
    }

    // 4. Root Balance Factor
    const rootNode = nodes[rootId];
    const leftHeight = rootNode ? getNodeHeight(rootNode.leftId) : -1;
    const rightHeight = rootNode ? getNodeHeight(rootNode.rightId) : -1;
    const balanceFactor = leftHeight - rightHeight;

    // 5. Min and Max Values in the Tree
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const id in nodes) {
      const v = nodes[id].value;
      if (v < minVal) minVal = v;
      if (v > maxVal) maxVal = v;
    }

    return {
      totalNodes: Object.keys(nodes).length,
      height: rootHeight,
      levels,
      leafNodes,
      internalNodes,
      isValid,
      balanceFactor,
      rootValue: rootNode ? rootNode.value : null,
      minValue: minVal !== Infinity ? minVal : null,
      maxValue: maxVal !== -Infinity ? maxVal : null
    };
  }, [nodes, rootId]);

  if (!rootId || Object.keys(nodes).length === 0) {
    return null;
  }

  const cardCls = "bg-[#0b0d12]/40 border border-[var(--border-color)] rounded-xl p-3 flex flex-col justify-between";
  const labelCls = "text-[9px] font-bold text-[var(--muted-color)] uppercase tracking-wider block mb-1";
  const valCls = "text-base font-extrabold text-white";

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-xl backdrop-blur-xl h-fit flex flex-col space-y-4">
      <div className="border-b border-[var(--border-color)] pb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold text-transparent bg-gradient-to-r from-blue-400 to-[#4fffb0] bg-clip-text uppercase tracking-widest">
          📊 Tree Statistics
        </span>
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border uppercase tracking-wider ${
          stats.isValid 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {stats.isValid ? '✓ Valid BST' : '✗ Invalid BST'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Nodes */}
        <div className={cardCls}>
          <span className={labelCls}>Total Nodes</span>
          <span className={valCls}>{stats.totalNodes}</span>
        </div>

        {/* Root Value */}
        <div className={cardCls}>
          <span className={labelCls}>Root Value</span>
          <span className={`${valCls} text-indigo-400`}>{stats.rootValue ?? '—'}</span>
        </div>

        {/* Tree Height */}
        <div className={cardCls}>
          <span className={labelCls}>Tree Height</span>
          <span className={valCls}>{stats.height} <span className="text-[10px] text-[var(--muted-color)] font-normal">edges</span></span>
        </div>

        {/* Levels */}
        <div className={cardCls}>
          <span className={labelCls}>Levels</span>
          <span className={`${valCls} text-purple-400`}>{stats.levels}</span>
        </div>

        {/* Minimum Value */}
        <div className={cardCls}>
          <span className={labelCls}>Min Value</span>
          <span className={`${valCls} text-emerald-400`}>{stats.minValue ?? '—'}</span>
        </div>

        {/* Maximum Value */}
        <div className={cardCls}>
          <span className={labelCls}>Max Value</span>
          <span className={`${valCls} text-orange-400`}>{stats.maxValue ?? '—'}</span>
        </div>

        {/* Leaf Nodes */}
        <div className={cardCls}>
          <span className={labelCls}>Leaf Nodes</span>
          <span className={`${valCls} text-indigo-400`}>{stats.leafNodes}</span>
        </div>

        {/* Internal Nodes */}
        <div className={cardCls}>
          <span className={labelCls}>Internal Nodes</span>
          <span className={`${valCls} text-teal-400`}>{stats.internalNodes}</span>
        </div>

        {/* Balance Factor */}
        <div className={`${cardCls} col-span-2`}>
          <span className={labelCls}>Balance Factor (Root)</span>
          <span className={`text-sm font-extrabold ${
            Math.abs(stats.balanceFactor) <= 1 
              ? 'text-emerald-400' 
              : 'text-amber-400'
          }`}>
            {stats.balanceFactor > 0 ? `+${stats.balanceFactor}` : stats.balanceFactor}
            <span className="text-[9px] text-[var(--muted-color)] font-normal ml-1">
              ({Math.abs(stats.balanceFactor) <= 1 ? 'Balanced' : 'Imbalanced'})
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
