import type { Step } from '../types';

const D = 256;
const Q = 101;

export function buildRabin(txt: string, pat: string): Step[] {
  const n = txt.length, m = pat.length;
  const st: Step[] = [];
  const found: number[] = [];

  let hPat = 0, hTxt = 0, h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * D) % Q;
  for (let i = 0; i < m; i++) {
    hPat = (D * hPat + pat.charCodeAt(i)) % Q;
    hTxt = (D * hTxt + txt.charCodeAt(i)) % Q;
  }

  st.push({
    text: txt, pattern: pat, hashPat: hPat, hashTxt: hTxt, textH: {}, patH: {},
    msg: `Rabin-Karp: hash(pattern)=${hPat}, hash(first window)=${hTxt}. Using base D=${D}, mod Q=${Q}`,
    type: 'info', foundSoFar: [], highlightCodeLine: 2,
  });

  for (let i = 0; i <= n - m; i++) {
    const wH: Record<number, 'window'> = {};
    for (let k = i; k < i + m; k++) wH[k] = 'window';

    const hashMatch = hTxt === hPat;
    st.push({
      text: txt, pattern: pat, i, j: 0,
      hashPat: hPat, hashTxt: hTxt,
      textH: { ...wH }, patH: {},
      msg: hashMatch
        ? `Hash match at i=${i}: window hash=${hTxt} == pattern hash=${hPat} — verify characters!`
        : `Hash mismatch at i=${i}: window=${hTxt} ≠ pattern=${hPat} — skip this window`,
      type: hashMatch ? 'match' : 'mismatch',
      foundSoFar: [...found], spurious: false,
      highlightCodeLine: hashMatch ? 4 : 3,
    });

    if (hashMatch) {
      let realMatch = true;
      for (let j = 0; j < m; j++) {
        const ok = txt[i + j] === pat[j];
        const tH = { ...wH } as Record<number, any>;
        tH[i + j] = ok ? 'match' : 'mismatch';
        st.push({
          text: txt, pattern: pat, i, j,
          hashPat: hPat, hashTxt: hTxt,
          textH: tH, patH: { [j]: ok ? 'match' : 'mismatch' },
          msg: ok
            ? `Verify text[${i + j}]='${txt[i + j]}' == pattern[${j}]='${pat[j]}' ✓`
            : `⚠ Spurious hit! text[${i + j}]='${txt[i + j]}' ≠ pattern[${j}]='${pat[j]}' — hash collision`,
          type: ok ? 'match' : 'mismatch',
          foundSoFar: [...found], spurious: !ok, highlightCodeLine: 5,
        });
        if (!ok) { realMatch = false; break; }
      }

      if (realMatch) {
        found.push(i);
        const fH: Record<number, 'found'> = {};
        for (let k = i; k < i + m; k++) fH[k] = 'found';
        st.push({
          text: txt, pattern: pat, i,
          hashPat: hPat, hashTxt: hTxt,
          textH: fH, patH: {},
          msg: `✓ Verified match at index ${i}!`,
          type: 'found', foundSoFar: [...found], highlightCodeLine: 6,
        });
      }
    }

    if (i < n - m) {
      hTxt = (D * (hTxt - txt.charCodeAt(i) * h) + txt.charCodeAt(i + m)) % Q;
      if (hTxt < 0) hTxt += Q;
      st.push({
        text: txt, pattern: pat, i: i + 1,
        hashPat: hPat, hashTxt: hTxt,
        textH: { [i]: 'mismatch', [i + m]: 'active' }, patH: {},
        msg: `Rolling hash: remove '${txt[i]}' (ASCII ${txt.charCodeAt(i)}), add '${txt[i + m]}' (ASCII ${txt.charCodeAt(i + m)}) → new window hash = ${hTxt}`,
        type: 'info', foundSoFar: [...found], highlightCodeLine: 8,
      });
    }
  }

  st.push({
    text: txt, pattern: pat, textH: {}, patH: {},
    hashPat: hPat, hashTxt: hTxt,
    msg: found.length
      ? `Rabin-Karp complete. Found at: [${found.join(', ')}]`
      : 'Rabin-Karp complete. Pattern not found.',
    type: 'info', foundSoFar: [...found], highlightCodeLine: 9,
  });

  return st;
}
