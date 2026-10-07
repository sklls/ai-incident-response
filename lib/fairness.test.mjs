import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adverseImpact } from './fairness.mjs';

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
