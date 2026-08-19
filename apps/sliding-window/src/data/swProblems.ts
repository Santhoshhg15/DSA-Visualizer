export interface SWProblem {
  id: string;
  name: string;
  category: string;
  badge: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  status: 'available' | 'coming-soon';
}

export const SW_PROBLEMS: SWProblem[] = [
  {
    id: 'max-sum-subarray-k',
    name: 'Maximum Sum Subarray of Size K',
    category: 'Fixed Size Window',
    badge: 'Fixed Window',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Find the maximum sum of any contiguous subarray of size exactly K',
    status: 'available',
  },
  {
    id: 'first-negative-in-window',
    name: 'First Negative Number in Every Window of Size K',
    category: 'Fixed Size Window',
    badge: 'Fixed Window',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    description: 'Find the first negative number in each window of size K',
    status: 'available',
  },
  {
    id: 'max-of-all-subarrays-k',
    name: 'Maximum of All Subarrays of Size K',
    category: 'Fixed Size Window',
    badge: 'Fixed Window',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    description: 'Find the maximum element in each window of size K using a monotonic deque',
    status: 'available',
  },
  {
    id: 'count-anagrams-pattern',
    name: 'Count Anagrams of a Pattern in a String',
    category: 'Fixed Size Window',
    badge: 'Fixed Window',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Count how many substrings are anagrams of a given pattern',
    status: 'available',
  },
  {
    id: 'longest-substr-no-repeat',
    name: 'Longest Substring Without Repeating Characters',
    category: 'Variable Size Window',
    badge: 'Variable Window',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n,m))',
    description: 'Find the longest substring with all unique characters',
    status: 'available',
  },
  {
    id: 'smallest-subarray-sum-target',
    name: 'Smallest Subarray with Sum ≥ Target',
    category: 'Variable Size Window',
    badge: 'Variable Window',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Find the smallest contiguous subarray whose sum is at least target',
    status: 'available',
  },
  {
    id: 'longest-substr-k-distinct',
    name: 'Longest Substring with At Most K Distinct Characters',
    category: 'Variable Size Window',
    badge: 'Variable Window',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    description: 'Find the longest substring containing at most K distinct characters',
    status: 'available',
  },
  {
    id: 'kadanes-max-subarray',
    name: 'Maximum Subarray Sum',
    category: "Kadane's Algorithm",
    badge: "Kadane's",
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Find the contiguous subarray with the largest sum',
    status: 'available',
  },
];

export const SW_CATEGORIES = [
  'Fixed Size Window', 'Variable Size Window', "Kadane's Algorithm"
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Fixed Size Window':    'bg-blue-500/15 border-blue-500/40 text-blue-400',
  'Variable Size Window': 'bg-teal-500/15 border-teal-500/40 text-teal-400',
  "Kadane's Algorithm":   'bg-amber-500/15 border-amber-500/40 text-amber-400',
};
