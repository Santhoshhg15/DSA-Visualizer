export interface IslandsPreset {
  id: string;
  name: string;
  grid: number[][];
}

export const islandsPresets: IslandsPreset[] = [
  {
    id: "preset-1",
    name: "Classic Grid (LeetCode)",
    grid: [
      [1, 1, 1, 1, 0],
      [1, 1, 0, 1, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: "preset-2",
    name: "Multiple Islands",
    grid: [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1]
    ]
  },
  {
    id: "preset-3",
    name: "Large Archipelago",
    grid: [
      [1, 0, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1]
    ]
  },
  {
    id: "preset-4",
    name: "C-Shape Island",
    grid: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ]
  },
  {
    id: "preset-5",
    name: "Lake in Island",
    grid: [
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1]
    ]
  },
  {
    id: "diagonal-difference",
    name: "Diagonal Test",
    grid: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1]
    ]
  }
];
