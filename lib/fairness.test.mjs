import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adverseImpact, significanceTest, disparateImpactAssessment } from './fairness.mjs';

test('clear disparate impact fails the four-fifths rule', () => {
  const r = adverseImpact([
    { name:'A', selected:50, total:100 },   // 0.50
    { name:'B', selected:20, total:100 },   // 0.20  -> ratio 0.40
  ]);
  assert.equal(r.rates.A, 0.5);
  assert.ok(Math.abs(r.ratio - 0.4) < 1e-9);
  assert.equal(r.pass, false);
});

test('near-parity passes', () => {
  const r = adverseImpact([
    { name:'A', selected:80, total:100 },
    { name:'B', selected:75, total:100 },
  ]);
  assert.ok(r.ratio >= 0.8);
  assert.equal(r.pass, true);
});

test('a zero-total group does not divide by zero', () => {
  const r = adverseImpact([
    { name:'A', selected:0, total:0 },
    { name:'B', selected:40, total:100 },
  ]);
  assert.equal(r.rates.A, null);
  assert.ok(r.pass === true || r.pass === false); // defined, no throw
});

test('a single group yields a safe, defined verdict (not a crash)', () => {
  const r = adverseImpact([{ name:'A', selected:30, total:100 }]);
  assert.equal(r.ratio, null);
  assert.equal(r.pass, false);
  assert.match(r.note, /single group|insufficient/i);
});

// --- EEOC: four-fifths is a rule of thumb; a statistically significant gap can be unlawful even if 4/5 passes ---

test('a large, clear gap is statistically significant', () => {
  const r = significanceTest([
    { name:'A', selected:50, total:100 },
    { name:'B', selected:20, total:100 },
  ]);
  assert.equal(r.significant, true);
  assert.ok(Math.abs(r.z) > 1.96);
});

test('a tiny gap on a small sample is not significant', () => {
  const r = significanceTest([
    { name:'A', selected:16, total:20 },
    { name:'B', selected:15, total:20 },
  ]);
  assert.equal(r.significant, false);
});

test('significance is safe with degenerate input (single/zero-total group)', () => {
  assert.doesNotThrow(() => significanceTest([{ name:'A', selected:1, total:0 }]));
  const r = significanceTest([{ name:'A', selected:30, total:100 }]);
  assert.equal(r.significant, false);
});

test('a tool can PASS four-fifths yet still fail significance at large N (EEOC caveat)', () => {
  // ratio 0.90 passes four-fifths, but at large N the gap is significant
  const groups = [
    { name:'A', selected:5000, total:10000 },   // 0.50
    { name:'B', selected:4500, total:10000 },   // 0.45 -> ratio 0.90 (passes 0.8)
  ];
  const ai = adverseImpact(groups);
  const sig = significanceTest(groups);
  assert.equal(ai.pass, true);           // four-fifths says OK
  assert.equal(sig.significant, true);   // significance says NOT ok
  const verdict = disparateImpactAssessment(groups);
  assert.equal(verdict.clear, false);    // combined verdict is cautious
  assert.match(verdict.note, /significan/i);
});
