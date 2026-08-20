export interface DPProblem {
  id: string;
  name: string;
  category: string;
  badge: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  status: 'available' | 'coming-soon';
}

export const DP_PROBLEMS: DPProblem[] = [
  // ── 1D DP ──────────────────────────────
  {
    id: 'climbing-stairs',
    name: 'Climbing Stairs',
    category: '1D DP',
    badge: '1D DP',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Count ways to reach nth stair using 1 or 2 steps',
    status: 'available',
  },
  {
    id: 'house-robber',
    name: 'House Robber',
    category: '1D DP',
    badge: '1D DP',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Max money robbed without alerting adjacent houses',
    status: 'available',
  },
  {
    id: 'count-subsets-sum',
    name: 'Count Subsets with Sum = K',
    category: '2D DP',
    badge: '2D DP',
    timeComplexity: 'O(n×K)',
    spaceComplexity: 'O(n×K + n)',
    description: 'Count subsets whose elements sum to K using top-down memoization',
    status: 'available',
  },
  {
    id: 'minimum-coins',
    name: 'Minimum Coins',
    category: '1D DP',
    badge: '1D DP',
    timeComplexity: 'O(n×amount)',
    spaceComplexity: 'O(amount)',
    description: 'Fewest coins needed to make a target amount',
    status: 'available',
  },
  // ── Knapsack ────────────────────────────
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'Knapsack',
    badge: 'Knapsack',
    timeComplexity: 'O(n×W)',
    spaceComplexity: 'O(n×W)',
    description: 'Max value from items without exceeding weight limit',
    status: 'available',
  },
  // ── Subsequence ─────────────────────────
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'Subsequence',
    badge: 'Subsequence',
    timeComplexity: 'O(m×n)',
    spaceComplexity: 'O(m×n)',
    description: 'Longest subsequence common to two strings',
    status: 'available',
  },
  {
    id: 'lps',
    name: 'Longest Palindromic Subsequence',
    category: 'Subsequence',
    badge: 'Subsequence',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n²)',
    description: 'Longest subsequence that reads same forwards and backwards',
    status: 'available',
  },
  {
    id: 'lis',
    name: 'Longest Increasing Subsequence',
    category: 'Subsequence',
    badge: 'Subsequence',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    description: 'Length of longest strictly increasing subsequence',
    status: 'available',
  },
  {
    id: 'buy-sell-stocks',
    name: 'Buy and Sell Stocks',
    category: 'Subsequence',
    badge: 'Subsequence',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Maximum profit from single buy and sell transaction',
    status: 'available',
  },
  // ── Grid DP ─────────────────────────────
  {
    id: 'unique-paths',
    name: 'Unique Paths',
    category: 'Grid DP',
    badge: 'Grid DP',
    timeComplexity: 'O(m×n)',
    spaceComplexity: 'O(m×n)',
    description: 'Count unique paths from top-left to bottom-right',
    status: 'available',
  },
  {
    id: 'minimum-path-sum',
    name: 'Minimum Path Sum',
    category: 'Grid DP',
    badge: 'Grid DP',
    timeComplexity: 'O(m×n)',
    spaceComplexity: 'O(m×n)',
    description: 'Path from top-left to bottom-right with minimum sum',
    status: 'available',
  },
  {
    id: 'partition-equal-subset',
    name: 'Partition Equal Subset Sum',
    category: 'Grid DP',
    badge: 'Grid DP',
    timeComplexity: 'O(n×sum)',
    spaceComplexity: 'O(n×sum)',
    description: 'Can array be split into two equal-sum subsets',
    status: 'available',
  },
  {
    id: 'target-sum',
    name: 'Target Sum',
    category: 'Grid DP',
    badge: 'Grid DP',
    timeComplexity: 'O(n×sum)',
    spaceComplexity: 'O(n×sum)',
    description: 'Ways to assign + / - signs to reach target sum',
    status: 'available',
  },
  // ── String DP ───────────────────────────
  {
    id: 'edit-distance',
    name: 'Edit Distance',
    category: 'String DP',
    badge: 'String DP',
    timeComplexity: 'O(m×n)',
    spaceComplexity: 'O(m×n)',
    description: 'Min operations to convert one string to another',
    status: 'available',
  },
  {
    id: 'delete-operation',
    name: 'Delete Operation for Two Strings',
    category: 'String DP',
    badge: 'String DP',
    timeComplexity: 'O(m×n)',
    spaceComplexity: 'O(m×n)',
    description: 'Min deletions to make two strings equal',
    status: 'available',
  },
  {
    id: 'coin-change-ii',
    name: 'Coin Change II',
    category: 'String DP',
    badge: 'String DP',
    timeComplexity: 'O(n×amount)',
    spaceComplexity: 'O(amount)',
    description: 'Count combinations to make target amount',
    status: 'available',
  },
  {
    id: 'partition-array-max-sum',
    name: 'Partition Array for Maximum Sum',
    category: 'String DP',
    badge: 'String DP',
    timeComplexity: 'O(n×k)',
    spaceComplexity: 'O(n)',
    description: 'Maximize sum by partitioning array into subarrays of size ≤ k',
    status: 'available',
  },
];

// Group problems by category in display order
export const DP_CATEGORIES = [
  '1D DP',
  '2D DP',
  'Knapsack',
  'Subsequence',
  'Grid DP',
  'String DP',
];

// Badge color map
export const CATEGORY_COLORS: Record<string, string> = {
  '1D DP':       'bg-blue-500/15 border-blue-500/40 text-blue-400',
  '2D DP':       'bg-indigo-500/15 border-indigo-500/40 text-indigo-400',
  'Knapsack':    'bg-amber-500/15 border-amber-500/40 text-amber-400',
  'Subsequence': 'bg-purple-500/15 border-purple-500/40 text-purple-400',
  'Grid DP':     'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
  'String DP':   'bg-rose-500/15 border-rose-500/40 text-rose-400',
};
