export type StepType = 'init' | 'base' | 'candidate' | 'fill' | 'backtrack' | 'odd-sum-exit' | 'short-circuit' | 'done'
  | 'call' | 'base-case' | 'memo-hit' | 'compute-nottake' | 'compute-take' | 'return';

export interface CandidateState {
  coin: number;
  value: number | 'unreachable';
  status: 'pending' | 'evaluated-losing' | 'evaluated-winning' | 'impossible';
}

export interface Step {
  type: StepType;
  dpArray: (number | boolean | 'INF' | null)[];
  activeIndex: number;
  fromIndices: number[];
  stairStep?: number;
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  codeLineActive?: number;
  msg: string;

  // House Robber & Knapsack decision fields
  houses?: number[];
  decision?: 'include' | 'exclude' | 'no-choice' | 'rob' | 'skip' | null;
  robbedIndices?: number[];

  // 2D DP / Count Subsets / Knapsack specific fields
  dpTable?: (number | boolean | null)[][];
  activeCell?: [number, number] | null;
  sourceCells?: [number, number][];
  subsetArr?: number[];
  subsetK?: number;

  // Memoization-specific fields (Count Subsets with Memoization)
  callStack?: { index: number; k: number }[];
  returnValue?: number | null;
  memoHitCell?: [number, number] | null;
  inProgressCell?: [number, number] | null;
  memoStats?: { cellsComputed: number; memoHits: number };

  // Knapsack specific fields
  knapsackCapacity?: number;
  knapsackWeights?: number[];
  knapsackValues?: number[];

  // Minimum Coins specific fields
  candidateStates?: CandidateState[];
  minCoinsAmount?: number;
  minCoinsCoins?: number[];

  // LCS & LPS specific fields
  lcsStr1?: string;
  lcsStr2?: string;
  lcsMatch?: boolean;
  matchType?: 'match' | 'mismatch' | null;
  reconstructedLcs?: string;
  currentLength?: number;
  lpsString?: string;

  // Buy and Sell Stocks specific fields
  stockPrices?: number[];
  stockCurrentDay?: number;
  stockMinPrice?: number;
  stockMinPriceDay?: number;
  stockMaxProfit?: number;
  stockBuyDay?: number;
  stockSellDay?: number;
  stockAction?: 'update-min' | 'update-profit' | 'no-change' | null;

  // LIS specific fields
  lisArr?: number[];
  lisCandidateStates?: LISCandidateState[];
  lisMaxLenSoFar?: number;

  // Unique Paths & Minimum Path Sum specific fields
  gridRows?: number;
  gridCols?: number;
  costGrid?: number[][];

  // Partition Equal Subset Sum specific fields
  partitionArr?: number[];
  totalSum?: number;
  targetSum?: number;
  booleanTable?: (boolean | null)[][];

  // Target Sum specific fields
  targetSumArr?: number[];
  targetSumTarget?: number;
  derivedTarget?: number;

  // Edit Distance specific fields
  editDistS1?: string;
  editDistS2?: string;
  winningOperation?: 'replace' | 'delete' | 'insert' | null;
  threeWaySourceCells?: ThreeWaySourceCell[];

  // Delete Operation specific fields
  deleteOpS1?: string;
  deleteOpS2?: string;
  deleteOpLcsLength?: number | null;
  deleteOpAnswer?: number | null;

  // Coin Change II specific fields
  sourceLabels?: ('skip' | 'reuse')[];
  coinChangeIIAmount?: number;
  coinChangeIICoins?: number[];

  // Partition Array for Max Sum specific fields
  activeWindow?: [number, number] | null;
  partitionCandidates?: any[];
}

export interface ThreeWaySourceCell {
  cell: [number, number];
  operation: 'replace' | 'delete' | 'insert';
  isWinner: boolean;
}

export interface LISCandidateState {
  j: number;
  arrJ: number;
  qualifies: boolean;
  resultValue: number | null;
  status: 'disqualified' | 'evaluated-losing' | 'evaluated-winning';
}

export interface ProblemMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  javaCode: string[];
  pseudoCode?: string[];
  recurrence: string;
  baseCases: string;
  timeComplexity: string;
  spaceComplexity: string;
}
