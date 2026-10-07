import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { lintSkill } from './skill-linter.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', 'skills');

let failures = 0, checked = 0;
for (const dir of readdirSync(root)) {
  const f = join(root, dir, 'SKILL.md');
  try { statSync(f); } catch { continue; }
  checked++;
  const r = lintSkill(readFileSync(f, 'utf8'));
  if (!r.valid) { failures++; console.error(`FAIL ${dir}: ${r.errors.join('; ')}`); }
  else console.log(`ok ${dir}`);
}
console.log(`\n${checked - failures}/${checked} skills lint-clean`);
process.exit(failures ? 1 : 0);
