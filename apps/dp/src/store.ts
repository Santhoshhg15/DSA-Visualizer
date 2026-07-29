import { create } from 'zustand';
import { buildClimbingStairsTrace, CLIMBING_STAIRS_META } from './problems/climbingStairs';
import { buildHouseRobberTrace, HOUSE_ROBBER_META } from './engines/houseRobber';
import { buildCountSubsetsTrace, COUNT_SUBSETS_META } from './engines/countSubsetsSum';
import { buildMinCoinsTrace, MINIMUM_COINS_META } from './engines/minimumCoins';
import { buildKnapsackTrace, KNAPSACK_META } from './engines/knapsack';
import { buildLcsTrace, LCS_META } from './engines/lcs';
import { buildLpsTrace, LPS_META } from './engines/lps';
import { buildBuySellStocksTrace, BUY_SELL_STOCKS_META } from './engines/buySellStocks';
import { buildLisTrace, LIS_META } from './engines/lis';
import { buildUniquePathsTrace, UNIQUE_PATHS_META } from './engines/uniquePaths';
import { buildMinPathSumTrace, MINIMUM_PATH_SUM_META } from './engines/minimumPathSum';
import { buildPartitionTrace, PARTITION_EQUAL_SUBSET_META } from './engines/partitionEqualSubset';
import { buildTargetSumTrace, TARGET_SUM_META } from './engines/targetSum';
import { buildEditDistanceTrace, EDIT_DISTANCE_META } from './engines/editDistance';
import { buildDeleteOpTrace, DELETE_OPERATION_META } from './engines/deleteOperation';
import { buildCoinChangeIITrace, COIN_CHANGE_II_META } from './engines/coinChangeII';
import { buildPartitionMaxSumTrace, PARTITION_ARRAY_MAX_SUM_META } from './engines/partitionArrayMaxSum';
import type { ProblemMeta, Step } from './problems/types';

export type SpeedOption = '0.25x' | '0.5x' | '1x' | '1.5x' | '2x';

export const SPEED_MAP: Record<SpeedOption, number> = {
  '0.25x': 2400,
  '0.5x': 1200,
  '1x': 800,
  '1.5x': 500,
  '2x': 300,
};

function generateRandomArray(count: number, maxVal: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * maxVal) + 1);
}

function generateRandomGrid(m: number, n: number, maxVal: number): number[][] {
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => Math.floor(Math.random() * maxVal) + 1)
  );
}

function generateRandomCoins(count: number, maxVal: number): number[] {
  const set = new Set<number>();
  set.add(1); // Guarantee reachability by default
  while (set.size < count) {
    set.add(Math.floor(Math.random() * (maxVal - 1)) + 2);
  }
  return Array.from(set).sort((a, b) => a - b);
}

function generateRandomItems(count: number, maxWt: number, maxVal: number) {
  const weights = Array.from({ length: count }, () => Math.floor(Math.random() * (maxWt - 1)) + 1);
  const values = Array.from({ length: count }, () => Math.floor(Math.random() * (maxVal - 4)) + 5);
  return { weights, values };
}

function generateRandomString(length: number, alphabetSize: number): string {
  const letters = 'ABCDE'.slice(0, alphabetSize);
  return Array.from({ length }, () =>
    letters[Math.floor(Math.random() * letters.length)]
  ).join('');
}

interface DPState {
  n: number;
  houses: number[];
  houseValues: number[];
  houseCount: number;
  houseMaxValue: number;

  // Count Subsets Sum state
  subsetElementCount: number;
  subsetMaxValue: number;
  subsetTargetK: number;
  subsetArray: number[];

  // Minimum Coins state
  minCoinsAmount: number;
  minCoinsCoinCount: number;
  minCoinsMaxValue: number;
  minCoinsArray: number[];

  // Knapsack state
  knapsackItemCount: number;
  knapsackMaxWeight: number;
  knapsackMaxValue: number;
  knapsackCapacity: number;
  knapsackWeights: number[];
  knapsackValues: number[];

  // LCS state
  lcsStringLength: number;
  lcsAlphabetSize: number;
  lcsString1: string;
  lcsString2: string;
  lcsStr1: string;
  lcsStr2: string;

  // LPS state
  lpsStringLength: number;
  lpsAlphabetSize: number;
  lpsString: string;

  // Buy and Sell Stocks state
  stockDayCount: number;
  stockMaxPrice: number;
  stockPrices: number[];

  // LIS state
  lisArraySize: number;
  lisMaxValue: number;
  lisArray: number[];

  // Unique Paths state
  uniquePathsRows: number;
  uniquePathsCols: number;

  // Minimum Path Sum state
  minPathRows: number;
  minPathCols: number;
  minPathMaxCost: number;
  minPathCostGrid: number[][];

  // Partition Equal Subset Sum state
  partitionElementCount: number;
  partitionMaxValue: number;
  partitionArray: number[];

  // Target Sum state
  targetSumElementCount: number;
  targetSumMaxValue: number;
  targetSumTarget: number;
  targetSumArray: number[];

  // Edit Distance state
  editDistStringLength: number;
  editDistAlphabetSize: number;
  editDistString1: string;
  editDistString2: string;

  // Delete Operation state
  deleteOpStringLength: number;
  deleteOpAlphabetSize: number;
  deleteOpString1: string;
  deleteOpString2: string;

  // Coin Change II state
  coinChangeIIAmount: number;
  coinChangeIICoinCount: number;
  coinChangeIIMaxValue: number;
  coinChangeIICoins: number[];

  // Partition Array for Maximum Sum state
  partitionMaxSumSize: number;
  partitionMaxSumK: number;
  partitionMaxSumMaxValue: number;
  partitionMaxSumArr: number[];

  steps: Step[];
  cur: number;
  playing: boolean;
  speedLabel: SpeedOption;
  problem: ProblemMeta;
  theme: 'dark' | 'light';
  timerId: number | null;
  selectedProblemId: string;

  setN: (n: number) => void;
  setHouses: (houses: number[]) => void;
  setHouseCount: (count: number) => void;
  setHouseMaxValue: (maxVal: number) => void;
  generateHouseValues: () => void;

  setSubsetElementCount: (count: number) => void;
  setSubsetMaxValue: (maxVal: number) => void;
  setSubsetTargetK: (k: number) => void;
  generateSubsetArray: () => void;

  setMinCoinsAmount: (amount: number) => void;
  setMinCoinsCoinCount: (count: number) => void;
  setMinCoinsMaxValue: (maxVal: number) => void;
  generateMinCoinsArray: () => void;

  setKnapsackItemCount: (count: number) => void;
  setKnapsackMaxWeight: (maxWt: number) => void;
  setKnapsackMaxValue: (maxVal: number) => void;
  setKnapsackCapacity: (cap: number) => void;
  generateKnapsackItems: () => void;

  setLCSStringLength: (len: number) => void;
  setLCSAlphabetSize: (size: number) => void;
  generateLCSStrings: () => void;
  setLcsStr1: (str: string) => void;
  setLcsStr2: (str: string) => void;

  setLPSStringLength: (len: number) => void;
  setLPSAlphabetSize: (size: number) => void;
  generateLPSString: () => void;

  setStockDayCount: (count: number) => void;
  setStockMaxPrice: (maxPrice: number) => void;
  generateStockPrices: () => void;

  setLISArraySize: (size: number) => void;
  setLISMaxValue: (maxVal: number) => void;
  generateLISArray: () => void;

  setUniquePathsRows: (m: number) => void;
  setUniquePathsCols: (n: number) => void;

  setMinPathRows: (m: number) => void;
  setMinPathCols: (n: number) => void;
  setMinPathMaxCost: (maxCost: number) => void;
  generateMinPathGrid: () => void;

  setPartitionElementCount: (count: number) => void;
  setPartitionMaxValue: (maxVal: number) => void;
  generatePartitionArray: () => void;

  setTargetSumElementCount: (count: number) => void;
  setTargetSumMaxValue: (maxVal: number) => void;
  setTargetSumTarget: (target: number) => void;
  generateTargetSumArray: () => void;

  setEditDistStringLength: (len: number) => void;
  setEditDistAlphabetSize: (size: number) => void;
  generateEditDistStrings: () => void;

  setDeleteOpStringLength: (len: number) => void;
  setDeleteOpAlphabetSize: (size: number) => void;
  generateDeleteOpStrings: () => void;

  setCoinChangeIIAmount: (amt: number) => void;
  setCoinChangeIICoinCount: (count: number) => void;
  setCoinChangeIIMaxValue: (maxVal: number) => void;
  generateCoinChangeIICoins: () => void;

  setPartitionMaxSumSize: (size: number) => void;
  setPartitionMaxSumK: (k: number) => void;
  setPartitionMaxSumMaxValue: (maxVal: number) => void;
  generatePartitionMaxSumArray: () => void;

  run: () => void;
  setCur: (idx: number | ((prev: number) => number)) => void;
  togglePlay: () => void;
  setSpeedLabel: (speed: SpeedOption) => void;
  toggleTheme: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  setSelectedProblemId: (id: string) => void;
}

export const useDPStore = create<DPState>((set, get) => {
  const initialN = 5;
  const initialHouseCount = 6;
  const initialHouseMaxVal = 30;
  const initialHouses = generateRandomArray(initialHouseCount, initialHouseMaxVal);

  const initialSubsetCount = 4;
  const initialSubsetMaxVal = 8;
  const initialSubsetK = 10;
  const initialSubsetArray = [2, 3, 5, 6];

  const initialMinCoinsAmount = 11;
  const initialMinCoinsCoinCount = 3;
  const initialMinCoinsMaxVal = 10;
  const initialMinCoinsArray = [1, 3, 5];

  const initialKnapsackItemCount = 4;
  const initialKnapsackMaxWeight = 6;
  const initialKnapsackMaxValue = 15;
  const initialKnapsackCapacity = 10;
  const initialKnapsackWeights = [2, 3, 4, 5];
  const initialKnapsackValues = [3, 4, 5, 6];

  const initialLcsLength = 5;
  const initialLcsAlphabet = 3;
  const initialLcsStr1 = generateRandomString(initialLcsLength, initialLcsAlphabet);
  const initialLcsStr2 = generateRandomString(initialLcsLength, initialLcsAlphabet);

  const initialLpsLength = 6;
  const initialLpsAlphabet = 2;
  const initialLpsString = generateRandomString(initialLpsLength, initialLpsAlphabet);

  const initialStockDayCount = 7;
  const initialStockMaxPrice = 100;
  const initialStockPrices = [7, 1, 5, 3, 6, 4, 8];

  const initialLisArraySize = 7;
  const initialLisMaxValue = 20;
  const initialLisArray = [10, 9, 2, 5, 3, 7, 18];

  const initialUniquePathsRows = 4;
  const initialUniquePathsCols = 4;

  const initialMinPathRows = 3;
  const initialMinPathCols = 3;
  const initialMinPathMaxCost = 15;
  const initialMinPathCostGrid = [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ];

  const initialSteps = buildClimbingStairsTrace(initialN);

  return {
    n: initialN,
    houses: initialHouses,
    houseValues: initialHouses,
    houseCount: initialHouseCount,
    houseMaxValue: initialHouseMaxVal,

    subsetElementCount: initialSubsetCount,
    subsetMaxValue: initialSubsetMaxVal,
    subsetTargetK: initialSubsetK,
    subsetArray: initialSubsetArray,

    minCoinsAmount: initialMinCoinsAmount,
    minCoinsCoinCount: initialMinCoinsCoinCount,
    minCoinsMaxValue: initialMinCoinsMaxVal,
    minCoinsArray: initialMinCoinsArray,

    knapsackItemCount: initialKnapsackItemCount,
    knapsackMaxWeight: initialKnapsackMaxWeight,
    knapsackMaxValue: initialKnapsackMaxValue,
    knapsackCapacity: initialKnapsackCapacity,
    knapsackWeights: initialKnapsackWeights,
    knapsackValues: initialKnapsackValues,

    lcsStringLength: initialLcsLength,
    lcsAlphabetSize: initialLcsAlphabet,
    lcsString1: initialLcsStr1,
    lcsString2: initialLcsStr2,
    lcsStr1: initialLcsStr1,
    lcsStr2: initialLcsStr2,

    lpsStringLength: initialLpsLength,
    lpsAlphabetSize: initialLpsAlphabet,
    lpsString: initialLpsString,

    stockDayCount: initialStockDayCount,
    stockMaxPrice: initialStockMaxPrice,
    stockPrices: initialStockPrices,

    lisArraySize: initialLisArraySize,
    lisMaxValue: initialLisMaxValue,
    lisArray: initialLisArray,

    uniquePathsRows: initialUniquePathsRows,
    uniquePathsCols: initialUniquePathsCols,

    minPathRows: initialMinPathRows,
    minPathCols: initialMinPathCols,
    minPathMaxCost: initialMinPathMaxCost,
    minPathCostGrid: initialMinPathCostGrid,

    partitionElementCount: 4,
    partitionMaxValue: 8,
    partitionArray: [1, 5, 11, 5],

    targetSumElementCount: 4,
    targetSumMaxValue: 5,
    targetSumTarget: 3,
    targetSumArray: [1, 2, 3, 1],

    editDistStringLength: 5,
    editDistAlphabetSize: 3,
    editDistString1: 'horse',
    editDistString2: 'ros',

    deleteOpStringLength: 5,
    deleteOpAlphabetSize: 3,
    deleteOpString1: 'sea',
    deleteOpString2: 'eat',

    coinChangeIIAmount: 8,
    coinChangeIICoinCount: 3,
    coinChangeIIMaxValue: 5,
    coinChangeIICoins: [1, 2, 5],

    partitionMaxSumSize: 7,
    partitionMaxSumK: 3,
    partitionMaxSumMaxValue: 15,
    partitionMaxSumArr: [1, 15, 7, 9, 2, 5, 10],

    steps: initialSteps,
    cur: 0,
    playing: false,
    speedLabel: '1x',
    problem: CLIMBING_STAIRS_META,
    theme: 'dark',
    timerId: null,
    selectedProblemId: 'climbing-stairs',

    setN: (newN: number) => {
      const clamped = Math.max(2, Math.min(15, newN));
      const newSteps = buildClimbingStairsTrace(clamped);
      const { timerId } = get();
      if (timerId) clearInterval(timerId);

      set({
        n: clamped,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setHouses: (newHouses: number[]) => {
      const { timerId } = get();
      if (timerId) clearInterval(timerId);
      const newSteps = buildHouseRobberTrace(newHouses);

      set({
        houses: newHouses,
        houseValues: newHouses,
        houseCount: newHouses.length,
        n: newHouses.length,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setHouseCount: (count: number) => {
      const clamped = Math.max(4, Math.min(10, count));
      const { houseMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newHouses = generateRandomArray(clamped, houseMaxValue);
      const newSteps = buildHouseRobberTrace(newHouses);

      set({
        houseCount: clamped,
        houses: newHouses,
        houseValues: newHouses,
        n: clamped,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setHouseMaxValue: (maxVal: number) => {
      const clamped = Math.max(10, Math.min(99, maxVal));
      const { houseCount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newHouses = generateRandomArray(houseCount, clamped);
      const newSteps = buildHouseRobberTrace(newHouses);

      set({
        houseMaxValue: clamped,
        houses: newHouses,
        houseValues: newHouses,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateHouseValues: () => {
      const { houseCount, houseMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newHouses = generateRandomArray(houseCount, houseMaxValue);
      const newSteps = buildHouseRobberTrace(newHouses);

      set({
        houses: newHouses,
        houseValues: newHouses,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setSubsetElementCount: (count: number) => {
      const clamped = Math.max(3, Math.min(6, count));
      const { subsetMaxValue, subsetTargetK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newArr = generateRandomArray(clamped, subsetMaxValue);
      const newSteps = buildCountSubsetsTrace(newArr, subsetTargetK);

      set({
        subsetElementCount: clamped,
        subsetArray: newArr,
        n: clamped,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setSubsetMaxValue: (maxVal: number) => {
      const clamped = Math.max(2, Math.min(15, maxVal));
      const { subsetElementCount, subsetTargetK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newArr = generateRandomArray(subsetElementCount, clamped);
      const newSteps = buildCountSubsetsTrace(newArr, subsetTargetK);

      set({
        subsetMaxValue: clamped,
        subsetArray: newArr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setSubsetTargetK: (k: number) => {
      const clamped = Math.max(1, Math.min(20, k));
      const { subsetArray, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildCountSubsetsTrace(subsetArray, clamped);

      set({
        subsetTargetK: clamped,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateSubsetArray: () => {
      const { subsetElementCount, subsetMaxValue, subsetTargetK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newArr = generateRandomArray(subsetElementCount, subsetMaxValue);
      const newSteps = buildCountSubsetsTrace(newArr, subsetTargetK);

      set({
        subsetArray: newArr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMinCoinsAmount: (amount: number) => {
      const clamped = Math.max(5, Math.min(25, amount));
      const { minCoinsArray, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildMinCoinsTrace(minCoinsArray, clamped);

      set({
        minCoinsAmount: clamped,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMinCoinsCoinCount: (count: number) => {
      const clamped = Math.max(2, Math.min(5, count));
      const { minCoinsMaxValue, minCoinsAmount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newCoins = generateRandomCoins(clamped, minCoinsMaxValue);
      const newSteps = buildMinCoinsTrace(newCoins, minCoinsAmount);

      set({
        minCoinsCoinCount: clamped,
        minCoinsArray: newCoins,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMinCoinsMaxValue: (maxVal: number) => {
      const clamped = Math.max(5, Math.min(20, maxVal));
      const { minCoinsCoinCount, minCoinsAmount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newCoins = generateRandomCoins(minCoinsCoinCount, clamped);
      const newSteps = buildMinCoinsTrace(newCoins, minCoinsAmount);

      set({
        minCoinsMaxValue: clamped,
        minCoinsArray: newCoins,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateMinCoinsArray: () => {
      const { minCoinsCoinCount, minCoinsMaxValue, minCoinsAmount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newCoins = generateRandomCoins(minCoinsCoinCount, minCoinsMaxValue);
      const newSteps = buildMinCoinsTrace(newCoins, minCoinsAmount);

      set({
        minCoinsArray: newCoins,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKnapsackItemCount: (count: number) => {
      const clamped = Math.max(3, Math.min(6, count));
      const { knapsackMaxWeight, knapsackMaxValue, knapsackCapacity, timerId } = get();
      if (timerId) clearInterval(timerId);

      const { weights, values } = generateRandomItems(clamped, knapsackMaxWeight, knapsackMaxValue);
      const newSteps = buildKnapsackTrace(weights, values, knapsackCapacity);

      set({
        knapsackItemCount: clamped,
        knapsackWeights: weights,
        knapsackValues: values,
        n: clamped,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKnapsackMaxWeight: (maxWt: number) => {
      const clamped = Math.max(2, Math.min(10, maxWt));
      const { knapsackItemCount, knapsackMaxValue, knapsackCapacity, timerId } = get();
      if (timerId) clearInterval(timerId);

      const { weights, values } = generateRandomItems(knapsackItemCount, clamped, knapsackMaxValue);
      const newSteps = buildKnapsackTrace(weights, values, knapsackCapacity);

      set({
        knapsackMaxWeight: clamped,
        knapsackWeights: weights,
        knapsackValues: values,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKnapsackMaxValue: (maxVal: number) => {
      const clamped = Math.max(5, Math.min(30, maxVal));
      const { knapsackItemCount, knapsackMaxWeight, knapsackCapacity, timerId } = get();
      if (timerId) clearInterval(timerId);

      const { weights, values } = generateRandomItems(knapsackItemCount, knapsackMaxWeight, clamped);
      const newSteps = buildKnapsackTrace(weights, values, knapsackCapacity);

      set({
        knapsackMaxValue: clamped,
        knapsackWeights: weights,
        knapsackValues: values,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setKnapsackCapacity: (cap: number) => {
      const clamped = Math.max(5, Math.min(20, cap));
      const { knapsackWeights, knapsackValues, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildKnapsackTrace(knapsackWeights, knapsackValues, clamped);

      set({
        knapsackCapacity: clamped,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateKnapsackItems: () => {
      const { knapsackItemCount, knapsackMaxWeight, knapsackMaxValue, knapsackCapacity, timerId } = get();
      if (timerId) clearInterval(timerId);

      const { weights, values } = generateRandomItems(knapsackItemCount, knapsackMaxWeight, knapsackMaxValue);
      const newSteps = buildKnapsackTrace(weights, values, knapsackCapacity);

      set({
        knapsackWeights: weights,
        knapsackValues: values,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLCSStringLength: (len: number) => {
      const clamped = Math.max(3, Math.min(8, len));
      const { lcsAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const str1 = generateRandomString(clamped, lcsAlphabetSize);
      const str2 = generateRandomString(clamped, lcsAlphabetSize);
      const newSteps = buildLcsTrace(str1, str2);

      set({
        lcsStringLength: clamped,
        lcsString1: str1,
        lcsString2: str2,
        lcsStr1: str1,
        lcsStr2: str2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLCSAlphabetSize: (size: number) => {
      const clamped = Math.max(2, Math.min(5, size));
      const { lcsStringLength, timerId } = get();
      if (timerId) clearInterval(timerId);

      const str1 = generateRandomString(lcsStringLength, clamped);
      const str2 = generateRandomString(lcsStringLength, clamped);
      const newSteps = buildLcsTrace(str1, str2);

      set({
        lcsAlphabetSize: clamped,
        lcsString1: str1,
        lcsString2: str2,
        lcsStr1: str1,
        lcsStr2: str2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateLCSStrings: () => {
      const { lcsStringLength, lcsAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const str1 = generateRandomString(lcsStringLength, lcsAlphabetSize);
      const str2 = generateRandomString(lcsStringLength, lcsAlphabetSize);
      const newSteps = buildLcsTrace(str1, str2);

      set({
        lcsString1: str1,
        lcsString2: str2,
        lcsStr1: str1,
        lcsStr2: str2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLcsStr1: (str1: string) => {
      const cleaned = str1.slice(0, 10);
      const { lcsStr2, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildLcsTrace(cleaned, lcsStr2);
      set({
        lcsStr1: cleaned,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLcsStr2: (str2: string) => {
      const cleaned = str2.slice(0, 10);
      const { lcsStr1, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildLcsTrace(lcsStr1, cleaned);
      set({
        lcsStr2: cleaned,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLPSStringLength: (len: number) => {
      const clamped = Math.max(4, Math.min(8, len));
      const { lpsAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const str = generateRandomString(clamped, lpsAlphabetSize);
      const newSteps = buildLpsTrace(str);

      set({
        lpsStringLength: clamped,
        lpsString: str,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLPSAlphabetSize: (size: number) => {
      const clamped = Math.max(2, Math.min(4, size));
      const { lpsStringLength, timerId } = get();
      if (timerId) clearInterval(timerId);

      const str = generateRandomString(lpsStringLength, clamped);
      const newSteps = buildLpsTrace(str);

      set({
        lpsAlphabetSize: clamped,
        lpsString: str,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateLPSString: () => {
      const { lpsStringLength, lpsAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const str = generateRandomString(lpsStringLength, lpsAlphabetSize);
      const newSteps = buildLpsTrace(str);

      set({
        lpsString: str,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setStockDayCount: (count: number) => {
      const clamped = Math.max(5, Math.min(12, count));
      const { stockMaxPrice, timerId } = get();
      if (timerId) clearInterval(timerId);

      const prices = generateRandomArray(clamped, stockMaxPrice);
      const newSteps = buildBuySellStocksTrace(prices);

      set({
        stockDayCount: clamped,
        stockPrices: prices,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setStockMaxPrice: (maxPrice: number) => {
      const clamped = Math.max(20, Math.min(200, maxPrice));
      const { stockDayCount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const prices = generateRandomArray(stockDayCount, clamped);
      const newSteps = buildBuySellStocksTrace(prices);

      set({
        stockMaxPrice: clamped,
        stockPrices: prices,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateStockPrices: () => {
      const { stockDayCount, stockMaxPrice, timerId } = get();
      if (timerId) clearInterval(timerId);

      const prices = generateRandomArray(stockDayCount, stockMaxPrice);
      const newSteps = buildBuySellStocksTrace(prices);

      set({
        stockPrices: prices,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLISArraySize: (size: number) => {
      const clamped = Math.max(5, Math.min(10, size));
      const { lisMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(clamped, lisMaxValue);
      const newSteps = buildLisTrace(arr);

      set({
        lisArraySize: clamped,
        lisArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setLISMaxValue: (maxVal: number) => {
      const clamped = Math.max(10, Math.min(50, maxVal));
      const { lisArraySize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(lisArraySize, clamped);
      const newSteps = buildLisTrace(arr);

      set({
        lisMaxValue: clamped,
        lisArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateLISArray: () => {
      const { lisArraySize, lisMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(lisArraySize, lisMaxValue);
      const newSteps = buildLisTrace(arr);

      set({
        lisArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setUniquePathsRows: (m: number) => {
      const clampedM = Math.max(2, Math.min(7, m));
      const { uniquePathsCols, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildUniquePathsTrace(clampedM, uniquePathsCols);
      set({
        uniquePathsRows: clampedM,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setUniquePathsCols: (n: number) => {
      const clampedN = Math.max(2, Math.min(7, n));
      const { uniquePathsRows, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildUniquePathsTrace(uniquePathsRows, clampedN);
      set({
        uniquePathsCols: clampedN,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMinPathRows: (m: number) => {
      const clampedM = Math.max(2, Math.min(5, m));
      const { minPathCols, minPathMaxCost, timerId } = get();
      if (timerId) clearInterval(timerId);

      const grid = generateRandomGrid(clampedM, minPathCols, minPathMaxCost);
      const newSteps = buildMinPathSumTrace(grid);

      set({
        minPathRows: clampedM,
        minPathCostGrid: grid,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMinPathCols: (n: number) => {
      const clampedN = Math.max(2, Math.min(5, n));
      const { minPathRows, minPathMaxCost, timerId } = get();
      if (timerId) clearInterval(timerId);

      const grid = generateRandomGrid(minPathRows, clampedN, minPathMaxCost);
      const newSteps = buildMinPathSumTrace(grid);

      set({
        minPathCols: clampedN,
        minPathCostGrid: grid,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setMinPathMaxCost: (maxCost: number) => {
      const clamped = Math.max(5, Math.min(30, maxCost));
      const { minPathRows, minPathCols, timerId } = get();
      if (timerId) clearInterval(timerId);

      const grid = generateRandomGrid(minPathRows, minPathCols, clamped);
      const newSteps = buildMinPathSumTrace(grid);

      set({
        minPathMaxCost: clamped,
        minPathCostGrid: grid,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateMinPathGrid: () => {
      const { minPathRows, minPathCols, minPathMaxCost, timerId } = get();
      if (timerId) clearInterval(timerId);

      const grid = generateRandomGrid(minPathRows, minPathCols, minPathMaxCost);
      const newSteps = buildMinPathSumTrace(grid);

      set({
        minPathCostGrid: grid,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setPartitionElementCount: (count: number) => {
      const clampedCount = Math.max(3, Math.min(6, count));
      const { partitionMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(clampedCount, partitionMaxValue);
      const newSteps = buildPartitionTrace(arr);

      set({
        partitionElementCount: clampedCount,
        partitionArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setPartitionMaxValue: (maxVal: number) => {
      const clampedMax = Math.max(2, Math.min(12, maxVal));
      const { partitionElementCount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(partitionElementCount, clampedMax);
      const newSteps = buildPartitionTrace(arr);

      set({
        partitionMaxValue: clampedMax,
        partitionArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generatePartitionArray: () => {
      const { partitionElementCount, partitionMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(partitionElementCount, partitionMaxValue);
      const newSteps = buildPartitionTrace(arr);

      set({
        partitionArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setTargetSumElementCount: (count: number) => {
      const clampedCount = Math.max(3, Math.min(6, count));
      const { targetSumMaxValue, targetSumTarget, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(clampedCount, targetSumMaxValue);
      const newSteps = buildTargetSumTrace(arr, targetSumTarget);

      set({
        targetSumElementCount: clampedCount,
        targetSumArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setTargetSumMaxValue: (maxVal: number) => {
      const clampedMax = Math.max(1, Math.min(8, maxVal));
      const { targetSumElementCount, targetSumTarget, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(targetSumElementCount, clampedMax);
      const newSteps = buildTargetSumTrace(arr, targetSumTarget);

      set({
        targetSumMaxValue: clampedMax,
        targetSumArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setTargetSumTarget: (target: number) => {
      const clampedTarget = Math.max(-15, Math.min(15, target));
      const { targetSumArray, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildTargetSumTrace(targetSumArray, clampedTarget);

      set({
        targetSumTarget: clampedTarget,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateTargetSumArray: () => {
      const { targetSumElementCount, targetSumMaxValue, targetSumTarget, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(targetSumElementCount, targetSumMaxValue);
      const newSteps = buildTargetSumTrace(arr, targetSumTarget);

      set({
        targetSumArray: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setEditDistStringLength: (len: number) => {
      const clampedLen = Math.max(3, Math.min(7, len));
      const { editDistAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const s1 = generateRandomString(clampedLen, editDistAlphabetSize);
      const s2 = generateRandomString(clampedLen, editDistAlphabetSize);
      const newSteps = buildEditDistanceTrace(s1, s2);

      set({
        editDistStringLength: clampedLen,
        editDistString1: s1,
        editDistString2: s2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setEditDistAlphabetSize: (size: number) => {
      const clampedSize = Math.max(2, Math.min(5, size));
      const { editDistStringLength, timerId } = get();
      if (timerId) clearInterval(timerId);

      const s1 = generateRandomString(editDistStringLength, clampedSize);
      const s2 = generateRandomString(editDistStringLength, clampedSize);
      const newSteps = buildEditDistanceTrace(s1, s2);

      set({
        editDistAlphabetSize: clampedSize,
        editDistString1: s1,
        editDistString2: s2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateEditDistStrings: () => {
      const { editDistStringLength, editDistAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const s1 = generateRandomString(editDistStringLength, editDistAlphabetSize);
      const s2 = generateRandomString(editDistStringLength, editDistAlphabetSize);
      const newSteps = buildEditDistanceTrace(s1, s2);

      set({
        editDistString1: s1,
        editDistString2: s2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setDeleteOpStringLength: (len: number) => {
      const clampedLen = Math.max(3, Math.min(8, len));
      const { deleteOpAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const s1 = generateRandomString(clampedLen, deleteOpAlphabetSize);
      const s2 = generateRandomString(clampedLen, deleteOpAlphabetSize);
      const newSteps = buildDeleteOpTrace(s1, s2);

      set({
        deleteOpStringLength: clampedLen,
        deleteOpString1: s1,
        deleteOpString2: s2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setDeleteOpAlphabetSize: (size: number) => {
      const clampedSize = Math.max(2, Math.min(5, size));
      const { deleteOpStringLength, timerId } = get();
      if (timerId) clearInterval(timerId);

      const s1 = generateRandomString(deleteOpStringLength, clampedSize);
      const s2 = generateRandomString(deleteOpStringLength, clampedSize);
      const newSteps = buildDeleteOpTrace(s1, s2);

      set({
        deleteOpAlphabetSize: clampedSize,
        deleteOpString1: s1,
        deleteOpString2: s2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateDeleteOpStrings: () => {
      const { deleteOpStringLength, deleteOpAlphabetSize, timerId } = get();
      if (timerId) clearInterval(timerId);

      const s1 = generateRandomString(deleteOpStringLength, deleteOpAlphabetSize);
      const s2 = generateRandomString(deleteOpStringLength, deleteOpAlphabetSize);
      const newSteps = buildDeleteOpTrace(s1, s2);

      set({
        deleteOpString1: s1,
        deleteOpString2: s2,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setCoinChangeIIAmount: (amt: number) => {
      const clampedAmt = Math.max(5, Math.min(15, amt));
      const { coinChangeIICoins, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildCoinChangeIITrace(coinChangeIICoins, clampedAmt);

      set({
        coinChangeIIAmount: clampedAmt,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setCoinChangeIICoinCount: (count: number) => {
      const clampedCount = Math.max(2, Math.min(4, count));
      const { coinChangeIIMaxValue, coinChangeIIAmount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const raw = generateRandomArray(clampedCount - 1, coinChangeIIMaxValue);
      const coins = Array.from(new Set([1, ...raw])).sort((a, b) => a - b);
      const newSteps = buildCoinChangeIITrace(coins, coinChangeIIAmount);

      set({
        coinChangeIICoinCount: clampedCount,
        coinChangeIICoins: coins,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setCoinChangeIIMaxValue: (maxVal: number) => {
      const clampedMax = Math.max(2, Math.min(8, maxVal));
      const { coinChangeIICoinCount, coinChangeIIAmount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const raw = generateRandomArray(coinChangeIICoinCount - 1, clampedMax);
      const coins = Array.from(new Set([1, ...raw])).sort((a, b) => a - b);
      const newSteps = buildCoinChangeIITrace(coins, coinChangeIIAmount);

      set({
        coinChangeIIMaxValue: clampedMax,
        coinChangeIICoins: coins,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generateCoinChangeIICoins: () => {
      const { coinChangeIICoinCount, coinChangeIIMaxValue, coinChangeIIAmount, timerId } = get();
      if (timerId) clearInterval(timerId);

      const raw = generateRandomArray(coinChangeIICoinCount - 1, coinChangeIIMaxValue);
      const coins = Array.from(new Set([1, ...raw])).sort((a, b) => a - b);
      const newSteps = buildCoinChangeIITrace(coins, coinChangeIIAmount);

      set({
        coinChangeIICoins: coins,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setPartitionMaxSumSize: (size: number) => {
      const clampedSize = Math.max(5, Math.min(10, size));
      const { partitionMaxSumMaxValue, partitionMaxSumK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(clampedSize, partitionMaxSumMaxValue);
      const newSteps = buildPartitionMaxSumTrace(arr, partitionMaxSumK);

      set({
        partitionMaxSumSize: clampedSize,
        partitionMaxSumArr: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setPartitionMaxSumK: (k: number) => {
      const clampedK = Math.max(2, Math.min(4, k));
      const { partitionMaxSumArr, timerId } = get();
      if (timerId) clearInterval(timerId);

      const newSteps = buildPartitionMaxSumTrace(partitionMaxSumArr, clampedK);

      set({
        partitionMaxSumK: clampedK,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setPartitionMaxSumMaxValue: (maxVal: number) => {
      const clampedMax = Math.max(5, Math.min(20, maxVal));
      const { partitionMaxSumSize, partitionMaxSumK, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(partitionMaxSumSize, clampedMax);
      const newSteps = buildPartitionMaxSumTrace(arr, partitionMaxSumK);

      set({
        partitionMaxSumMaxValue: clampedMax,
        partitionMaxSumArr: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    generatePartitionMaxSumArray: () => {
      const { partitionMaxSumSize, partitionMaxSumK, partitionMaxSumMaxValue, timerId } = get();
      if (timerId) clearInterval(timerId);

      const arr = generateRandomArray(partitionMaxSumSize, partitionMaxSumMaxValue);
      const newSteps = buildPartitionMaxSumTrace(arr, partitionMaxSumK);

      set({
        partitionMaxSumArr: arr,
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    run: () => {
      const { selectedProblemId, n, houses, subsetArray, subsetTargetK, minCoinsArray, minCoinsAmount, knapsackWeights, knapsackValues, knapsackCapacity, lcsStr1, lcsStr2, lpsString, stockPrices, lisArray, uniquePathsRows, uniquePathsCols, minPathCostGrid, partitionArray, targetSumArray, targetSumTarget, editDistString1, editDistString2, deleteOpString1, deleteOpString2, coinChangeIICoins, coinChangeIIAmount, partitionMaxSumArr, partitionMaxSumK, timerId } = get();
      if (timerId) clearInterval(timerId);

      let newSteps: Step[];
      if (selectedProblemId === 'house-robber') {
        newSteps = buildHouseRobberTrace(houses);
      } else if (selectedProblemId === 'count-subsets-sum') {
        newSteps = buildCountSubsetsTrace(subsetArray, subsetTargetK);
      } else if (selectedProblemId === 'minimum-coins') {
        newSteps = buildMinCoinsTrace(minCoinsArray, minCoinsAmount);
      } else if (selectedProblemId === 'knapsack') {
        newSteps = buildKnapsackTrace(knapsackWeights, knapsackValues, knapsackCapacity);
      } else if (selectedProblemId === 'lcs') {
        newSteps = buildLcsTrace(lcsStr1, lcsStr2);
      } else if (selectedProblemId === 'lps') {
        newSteps = buildLpsTrace(lpsString);
      } else if (selectedProblemId === 'buy-sell-stocks') {
        newSteps = buildBuySellStocksTrace(stockPrices);
      } else if (selectedProblemId === 'lis') {
        newSteps = buildLisTrace(lisArray);
      } else if (selectedProblemId === 'unique-paths') {
        newSteps = buildUniquePathsTrace(uniquePathsRows, uniquePathsCols);
      } else if (selectedProblemId === 'minimum-path-sum') {
        newSteps = buildMinPathSumTrace(minPathCostGrid);
      } else if (selectedProblemId === 'partition-equal-subset') {
        newSteps = buildPartitionTrace(partitionArray);
      } else if (selectedProblemId === 'target-sum') {
        newSteps = buildTargetSumTrace(targetSumArray, targetSumTarget);
      } else if (selectedProblemId === 'edit-distance') {
        newSteps = buildEditDistanceTrace(editDistString1, editDistString2);
      } else if (selectedProblemId === 'delete-operation') {
        newSteps = buildDeleteOpTrace(deleteOpString1, deleteOpString2);
      } else if (selectedProblemId === 'coin-change-ii') {
        newSteps = buildCoinChangeIITrace(coinChangeIICoins, coinChangeIIAmount);
      } else if (selectedProblemId === 'partition-array-max-sum') {
        newSteps = buildPartitionMaxSumTrace(partitionMaxSumArr, partitionMaxSumK);
      } else {
        newSteps = buildClimbingStairsTrace(n);
      }

      set({
        steps: newSteps,
        cur: 0,
        playing: false,
        timerId: null,
      });
    },

    setCur: (val) => {
      const { steps } = get();
      set((state) => {
        const nextCur = typeof val === 'function' ? val(state.cur) : val;
        const clamped = Math.max(0, Math.min(steps.length - 1, nextCur));
        return { cur: clamped };
      });
    },

    stepForward: () => {
      const { cur, steps } = get();
      if (cur < steps.length - 1) {
        set({ cur: cur + 1 });
      }
    },

    stepBackward: () => {
      const { cur } = get();
      if (cur > 0) {
        set({ cur: cur - 1 });
      }
    },

    goToFirst: () => {
      const { timerId } = get();
      if (timerId) clearInterval(timerId);
      set({ cur: 0, playing: false, timerId: null });
    },

    goToLast: () => {
      const { steps, timerId } = get();
      if (timerId) clearInterval(timerId);
      set({ cur: steps.length - 1, playing: false, timerId: null });
    },

    reset: () => {
      const { timerId } = get();
      if (timerId) clearInterval(timerId);
      set({ cur: 0, playing: false, timerId: null });
    },

    togglePlay: () => {
      const { playing, timerId, cur, steps, speedLabel } = get();

      if (playing) {
        if (timerId) clearInterval(timerId);
        set({ playing: false, timerId: null });
      } else {
        if (cur >= steps.length - 1) {
          set({ cur: 0 });
        }

        const delay = SPEED_MAP[speedLabel] || 800;
        const newTimerId = window.setInterval(() => {
          const state = get();
          if (state.cur >= state.steps.length - 1) {
            clearInterval(newTimerId);
            set({ playing: false, timerId: null });
          } else {
            set({ cur: state.cur + 1 });
          }
        }, delay);

        set({ playing: true, timerId: newTimerId });
      }
    },

    setSpeedLabel: (newSpeedLabel: SpeedOption) => {
      set({ speedLabel: newSpeedLabel });
      const { playing, togglePlay } = get();
      if (playing) {
        togglePlay();
        togglePlay();
      }
    },

    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      set({ theme: nextTheme });
    },

    setSelectedProblemId: (id: string) => {
      const { timerId, n, houses, subsetArray, subsetTargetK, minCoinsArray, minCoinsAmount, knapsackWeights, knapsackValues, knapsackCapacity, lcsStr1, lcsStr2 } = get();
      if (timerId) clearInterval(timerId);

      if (id === 'house-robber') {
        const newSteps = buildHouseRobberTrace(houses);
        set({
          selectedProblemId: id,
          problem: HOUSE_ROBBER_META,
          steps: newSteps,
          n: houses.length,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'count-subsets-sum') {
        const newSteps = buildCountSubsetsTrace(subsetArray, subsetTargetK);
        set({
          selectedProblemId: id,
          problem: COUNT_SUBSETS_META,
          steps: newSteps,
          n: subsetArray.length,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'minimum-coins') {
        const newSteps = buildMinCoinsTrace(minCoinsArray, minCoinsAmount);
        set({
          selectedProblemId: id,
          problem: MINIMUM_COINS_META,
          steps: newSteps,
          n: minCoinsAmount,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'knapsack') {
        const newSteps = buildKnapsackTrace(knapsackWeights, knapsackValues, knapsackCapacity);
        set({
          selectedProblemId: id,
          problem: KNAPSACK_META,
          steps: newSteps,
          n: knapsackWeights.length,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'lcs') {
        const newSteps = buildLcsTrace(lcsStr1, lcsStr2);
        set({
          selectedProblemId: id,
          problem: LCS_META,
          steps: newSteps,
          n: lcsStr1.length,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'lps') {
        const { lpsString } = get();
        const newSteps = buildLpsTrace(lpsString);
        set({
          selectedProblemId: id,
          problem: LPS_META,
          steps: newSteps,
          n: lpsString.length,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'buy-sell-stocks') {
        const { stockPrices } = get();
        const newSteps = buildBuySellStocksTrace(stockPrices);
        set({
          selectedProblemId: id,
          problem: BUY_SELL_STOCKS_META,
          steps: newSteps,
          n: stockPrices.length,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'lis') {
        const { lisArray } = get();
        const newSteps = buildLisTrace(lisArray);
        set({
          selectedProblemId: id,
          problem: LIS_META,
          steps: newSteps,
          n: lisArray.length,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'unique-paths') {
        const { uniquePathsRows, uniquePathsCols } = get();
        const newSteps = buildUniquePathsTrace(uniquePathsRows, uniquePathsCols);
        set({
          selectedProblemId: id,
          problem: UNIQUE_PATHS_META,
          steps: newSteps,
          n: uniquePathsRows * uniquePathsCols,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'minimum-path-sum') {
        const { minPathCostGrid } = get();
        const newSteps = buildMinPathSumTrace(minPathCostGrid);
        set({
          selectedProblemId: id,
          problem: MINIMUM_PATH_SUM_META,
          steps: newSteps,
          n: minPathCostGrid.length * minPathCostGrid[0].length,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'partition-equal-subset') {
        const { partitionArray } = get();
        const newSteps = buildPartitionTrace(partitionArray);
        const totalSum = partitionArray.reduce((a, b) => a + b, 0);
        const target = totalSum % 2 === 0 ? totalSum / 2 : 0;
        set({
          selectedProblemId: id,
          problem: PARTITION_EQUAL_SUBSET_META,
          steps: newSteps,
          n: (partitionArray.length + 1) * (target + 1),
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'target-sum') {
        const { targetSumArray, targetSumTarget } = get();
        const newSteps = buildTargetSumTrace(targetSumArray, targetSumTarget);
        const totalSum = targetSumArray.reduce((a, b) => a + b, 0);
        const derived = (targetSumTarget + totalSum) % 2 === 0 && Math.abs(targetSumTarget) <= totalSum ? (targetSumTarget + totalSum) / 2 : 0;
        set({
          selectedProblemId: id,
          problem: TARGET_SUM_META,
          steps: newSteps,
          n: (targetSumArray.length + 1) * (derived + 1),
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'edit-distance') {
        const { editDistString1, editDistString2 } = get();
        const newSteps = buildEditDistanceTrace(editDistString1, editDistString2);
        set({
          selectedProblemId: id,
          problem: EDIT_DISTANCE_META,
          steps: newSteps,
          n: (editDistString1.length + 1) * (editDistString2.length + 1),
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'delete-operation') {
        const { deleteOpString1, deleteOpString2 } = get();
        const newSteps = buildDeleteOpTrace(deleteOpString1, deleteOpString2);
        set({
          selectedProblemId: id,
          problem: DELETE_OPERATION_META,
          steps: newSteps,
          n: (deleteOpString1.length + 1) * (deleteOpString2.length + 1),
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'coin-change-ii') {
        const { coinChangeIICoins, coinChangeIIAmount } = get();
        const newSteps = buildCoinChangeIITrace(coinChangeIICoins, coinChangeIIAmount);
        set({
          selectedProblemId: id,
          problem: COIN_CHANGE_II_META,
          steps: newSteps,
          n: (coinChangeIICoins.length + 1) * (coinChangeIIAmount + 1),
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else if (id === 'partition-array-max-sum') {
        const { partitionMaxSumArr, partitionMaxSumK } = get();
        const newSteps = buildPartitionMaxSumTrace(partitionMaxSumArr, partitionMaxSumK);
        set({
          selectedProblemId: id,
          problem: PARTITION_ARRAY_MAX_SUM_META,
          steps: newSteps,
          n: partitionMaxSumArr.length + 1,
          cur: 0,
          playing: false,
          timerId: null,
        });
      } else {
        const newSteps = buildClimbingStairsTrace(n);
        set({
          selectedProblemId: id,
          problem: CLIMBING_STAIRS_META,
          steps: newSteps,
          cur: 0,
          playing: false,
          timerId: null,
        });
      }
    },
  };
});
