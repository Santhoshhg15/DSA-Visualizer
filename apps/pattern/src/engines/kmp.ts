import type { Step } from '../types';

export function buildKMP(txt: string, pat: string): Step[] {
  const n = txt.length, m = pat.length;
  const st: Step[] = [];
  const found: number[] = [];

  // ── Phase 1: Build LPS ──────────────────────────────────────────────────
  st.push({
    text: txt, pattern: pat, textH: {}, patH: {},
    lps: Array(m).fill(undefined),
    msg: `KMP Phase 1: Build LPS (Longest Proper Prefix-Suffix) array for pattern "${pat}"`,
    type: 'info', foundSoFar: [], highlightCodeLine: 0,
  });

  const lps: number[] = Array(m).fill(0);

  st.push({
    text: txt, pattern: pat, textH: {}, patH: { [0]: 'active' },
    lps: [0, ...Array(m - 1).fill(undefined)],
    lpsIdx: 0,
    msg: `lps[0] = 0 always — a single character has no proper prefix that is also a suffix`,
    type: 'info', foundSoFar: [], highlightCodeLine: 1,
  });

  let len = 0, i = 1;
  while (i < m) {
    if (pat[i] === pat[len]) {
      len++;
      lps[i] = len;
      st.push({
        text: txt, pattern: pat, textH: {}, patH: { [i]: 'match', [len - 1]: 'active' },
        lps: [...lps], lpsIdx: i,
        msg: `pat[${i}]='${pat[i]}' == pat[${len - 1}]='${pat[len - 1]}' → lps[${i}] = ${len}`,
        type: 'match', foundSoFar: [], highlightCodeLine: 5,
      });
      i++;
    } else if (len > 0) {
      const old = len;
      len = lps[len - 1];
      st.push({
        text: txt, pattern: pat, textH: {}, patH: { [i]: 'mismatch' },
        lps: [...lps], lpsIdx: i,
        msg: `Mismatch at pat[${i}]. Fall back: len ${old} → ${len} (using lps[${old - 1}]=${lps[old - 1]})`,
        type: 'mismatch', foundSoFar: [], highlightCodeLine: 7,
      });
    } else {
      lps[i] = 0;
      st.push({
        text: txt, pattern: pat, textH: {}, patH: { [i]: 'mismatch' },
        lps: [...lps], lpsIdx: i,
        msg: `pat[${i}]='${pat[i]}' no match, len=0 → lps[${i}] = 0`,
        type: 'mismatch', foundSoFar: [], highlightCodeLine: 9,
      });
      i++;
    }
  }

  st.push({
    text: txt, pattern: pat, textH: {}, patH: {},
    lps: [...lps],
    msg: `LPS array complete: [${lps.join(', ')}]. KMP Phase 2: Searching text...`,
    type: 'info', foundSoFar: [], highlightCodeLine: 10,
  });

  // ── Phase 2: Search ──────────────────────────────────────────────────────
  let ti = 0, j = 0;
  while (ti < n) {
    const ok = txt[ti] === pat[j];
    st.push({
      text: txt, pattern: pat, i: ti, j,
      textH: { [ti]: ok ? 'match' : 'mismatch' },
      patH: { [j]: ok ? 'match' : 'mismatch' },
      lps: [...lps], lpsIdx: j,
      msg: ok
        ? `text[${ti}]='${txt[ti]}' == pattern[${j}]='${pat[j]}' ✓`
        : `text[${ti}]='${txt[ti]}' ≠ pattern[${j}]='${pat[j]}' ✗`,
      type: ok ? 'match' : 'mismatch', foundSoFar: [...found],
      highlightCodeLine: ok ? 3 : 7,
    });

    if (ok) { ti++; j++; }

    if (j === m) {
      found.push(ti - j);
      const fH: Record<number, 'found'> = {};
      for (let k = ti - j; k < ti; k++) fH[k] = 'found';
      st.push({
        text: txt, pattern: pat, i: ti, j,
        textH: fH, patH: {},
        lps: [...lps],
        msg: `✓ Pattern found at index ${ti - j}! j jumps back to lps[${j - 1}]=${lps[j - 1]} (not 0!)`,
        type: 'found', foundSoFar: [...found], highlightCodeLine: 6,
      });
      j = lps[j - 1];
    } else if (ti < n && txt[ti] !== pat[j]) {
      if (j !== 0) {
        st.push({
          text: txt, pattern: pat, i: ti, j,
          textH: { [ti]: 'mismatch' }, patH: { [j]: 'mismatch' },
          lps: [...lps], lpsIdx: j,
          msg: `Mismatch: j jumps ${j} → ${lps[j - 1]} using lps[${j - 1}]=${lps[j - 1]}. No need to re-check prefix!`,
          type: 'mismatch', foundSoFar: [...found], highlightCodeLine: 8,
        });
        j = lps[j - 1];
      } else {
        ti++;
      }
    }
  }

  st.push({
    text: txt, pattern: pat, textH: {}, patH: {}, lps: [...lps],
    msg: found.length
      ? `KMP complete. Found at: [${found.join(', ')}]`
      : 'KMP complete. Pattern not found.',
    type: 'info', foundSoFar: [...found], highlightCodeLine: 10,
  });

  return st;
}
