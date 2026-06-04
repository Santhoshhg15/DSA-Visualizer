import type { Step } from '../types';

export function buildNaive(txt: string, pat: string): Step[] {
  const n = txt.length, m = pat.length;
  const st: Step[] = [];
  const found: number[] = [];

  st.push({
    text: txt, pattern: pat, i: 0, j: 0, textH: {}, patH: {},
    msg: `Naive Search: Text length=${n}, Pattern length=${m}. Sliding window one position at a time.`,
    type: 'info', foundSoFar: [], highlightCodeLine: 0,
  });

  for (let i = 0; i <= n - m; i++) {
    const wH: Record<number, 'window'> = {};
    for (let k = i; k < i + m; k++) wH[k] = 'window';

    st.push({
      text: txt, pattern: pat, i, j: 0, textH: { ...wH }, patH: {},
      msg: `Window at i=${i}: checking substring "${txt.slice(i, i + m)}" against pattern "${pat}"`,
      type: 'info', foundSoFar: [...found], highlightCodeLine: 1,
    });

    let matched = true;
    for (let j = 0; j < m; j++) {
      const tH = { ...wH } as Record<number, string>;
      const ok = txt[i + j] === pat[j];
      tH[i + j] = ok ? 'match' : 'mismatch';

      st.push({
        text: txt, pattern: pat, i, j,
        textH: tH as Record<number, any>,
        patH: { [j]: ok ? 'match' : 'mismatch' },
        msg: ok
          ? `text[${i + j}]='${txt[i + j]}' == pattern[${j}]='${pat[j]}' ✓`
          : `text[${i + j}]='${txt[i + j]}' ≠ pattern[${j}]='${pat[j]}' ✗ — shift window right`,
        type: ok ? 'match' : 'mismatch', foundSoFar: [...found],
        highlightCodeLine: ok ? 2 : 3,
      });

      if (!ok) { matched = false; break; }
    }

    if (matched) {
      found.push(i);
      const fH: Record<number, 'found'> = {};
      for (let k = i; k < i + m; k++) fH[k] = 'found';
      st.push({
        text: txt, pattern: pat, i, j: m - 1, textH: fH, patH: {},
        msg: `✓ Pattern found at index ${i}!`,
        type: 'found', foundSoFar: [...found], highlightCodeLine: 6,
      });
    }
  }

  st.push({
    text: txt, pattern: pat, textH: {}, patH: {},
    msg: found.length
      ? `Search complete. Pattern found at indices: [${found.join(', ')}]`
      : 'Search complete. Pattern not found in text.',
    type: 'info', foundSoFar: [...found], highlightCodeLine: 7,
  });

  return st;
}
