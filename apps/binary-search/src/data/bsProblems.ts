export interface BSProblem {
  id: string;
  name: string;
  category: string;
  badge: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  status: 'available' | 'coming-soon';
  javaCode: string[];
  pseudoCode: string[];
}

export const BS_PROBLEMS: BSProblem[] = [
  {
    id: 'koko-eating-bananas',
    name: 'Koko Eating Bananas',
    category: 'Search on Answer',
    badge: 'Search on Answer',
    timeComplexity: 'O(n log m)',
    spaceComplexity: 'O(1)',
    description: 'Find minimum eating speed to finish all piles within h hours',
    status: 'available',
    javaCode: [
      "public int minEatingSpeed(int[] piles, int h) {",
      "    int low = 1;",
      "    int high = 0;",
      "    for (int p : piles) high = Math.max(high, p);",
      "    while (low < high) {",
      "        int mid = low + (high - low) / 2;",
      "        if (canFinish(piles, mid, h)) {",
      "            high = mid;",
      "        } else {",
      "            low = mid + 1;",
      "        }",
      "    }",
      "    return low;",
      "}",
      "",
      "private boolean canFinish(int[] piles, int speed, int h) {",
      "    int hours = 0;",
      "    for (int p : piles) {",
      "        hours += (p + speed - 1) / speed;",
      "    }",
      "    return hours <= h;",
      "}"
    ],
    pseudoCode: [
      "function minEatingSpeed(piles, h):",
      "    low = 1, high = max(piles)",
      "    while low < high:",
      "        mid = midpoint of low and high",
      "        if Koko can finish all piles at speed=mid within h hours:",
      "            high = mid   (try a slower speed)",
      "        else:",
      "            low = mid + 1   (need a faster speed)",
      "    return low",
      "",
      "function canFinish(piles, speed, h):",
      "    hours = 0",
      "    for each pile:",
      "        hours += ceil(pile / speed)",
      "    return hours <= h"
    ]
  },
  {
    id: 'find-peak-element',
    name: 'Find Peak Element',
    category: 'Index Search',
    badge: 'Index Search',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    description: 'Find an element greater than both neighbors',
    status: 'coming-soon',
    javaCode: [],
    pseudoCode: []
  }
];

export const BS_CATEGORIES = ['Search on Answer', 'Index Search'];

export const CATEGORY_COLORS: Record<string, string> = {
  'Search on Answer': 'bg-amber-500/15 border-amber-500/40 text-amber-400',
  'Index Search':      'bg-blue-500/15 border-blue-500/40 text-blue-400',
};
