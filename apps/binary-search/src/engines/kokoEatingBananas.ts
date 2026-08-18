export interface KokoStep {
  type: 'init' | 'check' | 'narrow' | 'done';
  piles: number[];
  h: number;
  low: number;
  high: number;
  mid: number | null;
  hoursPerPile: number[] | null;
  totalHours: number | null;
  feasible: boolean | null;
  codeLineActiveJava: number;
  codeLineActivePseudo: number;
  msg: string;
}

export function buildKokoTrace(piles: number[], h: number): KokoStep[] {
  const steps: KokoStep[] = [];
  const maxPile = Math.max(...piles);

  let low = 1;
  let high = maxPile;

  // Step 1: Init
  steps.push({
    type: 'init',
    piles: [...piles],
    h,
    low,
    high,
    mid: null,
    hoursPerPile: null,
    totalHours: null,
    feasible: null,
    codeLineActiveJava: 4, // for (int p : piles) high = Math.max(high, p);
    codeLineActivePseudo: 2, // low = 1, high = max(piles)
    msg: `Search range: speed from 1 to ${high} (max pile size). We're searching for the MINIMUM feasible speed.`,
  });

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    // Compute canFinish details
    const hoursPerPile = piles.map((p) => Math.ceil(p / mid));
    const totalHours = hoursPerPile.reduce((sum, hrs) => sum + hrs, 0);
    const feasible = totalHours <= h;

    // Step 2: Check Mid
    steps.push({
      type: 'check',
      piles: [...piles],
      h,
      low,
      high,
      mid,
      hoursPerPile,
      totalHours,
      feasible,
      codeLineActiveJava: 7, // if (canFinish(piles, mid, h)) {
      codeLineActivePseudo: 5, // if Koko can finish all piles at speed=mid within h hours:
      msg: `Trying speed = ${mid}. Checking if Koko can finish all piles within ${h} hours...`,
    });

    // Step 3: Narrow Space
    if (feasible) {
      high = mid;
      steps.push({
        type: 'narrow',
        piles: [...piles],
        h,
        low,
        high,
        mid,
        hoursPerPile,
        totalHours,
        feasible,
        codeLineActiveJava: 8, // high = mid;
        codeLineActivePseudo: 6, // high = mid
        msg: `${totalHours} hours ≤ ${h} limit → speed ${mid} WORKS. Try slower speed: high = ${mid}`,
      });
    } else {
      low = mid + 1;
      steps.push({
        type: 'narrow',
        piles: [...piles],
        h,
        low,
        high,
        mid,
        hoursPerPile,
        totalHours,
        feasible,
        codeLineActiveJava: 10, // low = mid + 1;
        codeLineActivePseudo: 8, // low = mid + 1
        msg: `${totalHours} hours > ${h} limit → speed ${mid} TOO SLOW. Need faster speed: low = ${mid + 1}`,
      });
    }
  }

  // Final Step: Done
  steps.push({
    type: 'done',
    piles: [...piles],
    h,
    low,
    high,
    mid: null,
    hoursPerPile: null,
    totalHours: null,
    feasible: null,
    codeLineActiveJava: 13, // return low;
    codeLineActivePseudo: 9, // return low
    msg: `Binary search completed. Minimum eating speed is ${low} bananas/hour.`,
  });

  return steps;
}
