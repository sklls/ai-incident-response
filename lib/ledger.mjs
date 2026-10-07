import { sha256hex } from './sha256.mjs';
export { sha256hex };

export function canonical(entry) {
  const { hash, prev_hash, ...rest } = entry;
  const keys = Object.keys(rest).sort();
  return JSON.stringify(rest, keys);
}

export function sealEntry(prevHash, seq, entry) {
  const base = { ...entry, seq, prev_hash: prevHash };
  const hash = sha256hex(prevHash + canonical(base));
  return { ...base, hash };
}

export function verifyChain(entries) {
  let prev = 'GENESIS';
  for (const e of [...entries].sort((a, b) => a.seq - b.seq)) {
    const expected = sha256hex(prev + canonical(e));
    if (e.prev_hash !== prev || e.hash !== expected)
      return { valid: false, brokenAtSeq: e.seq };
    prev = e.hash;
  }
  return { valid: true, brokenAtSeq: null };
}
