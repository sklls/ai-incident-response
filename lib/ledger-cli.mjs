import { pathToFileURL } from 'node:url';
import { sealEntry } from './ledger.mjs';

export function buildSealedFromArgs(argv) {
  const get = (flag) => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : undefined; };
  const prev = get('--prev') ?? 'GENESIS';
  const seq = Number(get('--seq'));
  const entry = JSON.parse(get('--json') ?? '{}');
  if (!Number.isInteger(seq)) throw new Error('--seq must be an integer');
  return sealEntry(prev, seq, entry);
}

// CLI entry point — runs only when invoked directly, not when imported (cross-platform).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(buildSealedFromArgs(process.argv.slice(2))));
}
