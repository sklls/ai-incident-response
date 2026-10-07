import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateDoc } from './schema.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(readFileSync(join(here, '..', 'seed', f), 'utf8'));

export function loadSeed() {
  const incidents = read('incidents.json');
  const evidence = read('evidence.json');
  const errs = [];
  incidents.forEach((d, i) => { const r = validateDoc('incidents', d); if (!r.valid) errs.push(`incidents[${i}]: ${r.errors.join(';')}`); });
  evidence.forEach((d, i) => { const r = validateDoc('evidence', d); if (!r.valid) errs.push(`evidence[${i}]: ${r.errors.join(';')}`); });
  if (errs.length) throw new Error('seed validation failed:\n' + errs.join('\n'));
  return { incidents, evidence };
}
