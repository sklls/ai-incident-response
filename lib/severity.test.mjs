import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreSeverity } from './severity.mjs';

test('financial + all + ongoing + irreversible is S1 and escalates', () => {
  const r = scoreSeverity({ blastRadius:'all', dataSensitivity:'financial',
    reversibility:'irreversible', ongoing:true });
  assert.equal(r.severity, 'S1');
  assert.equal(r.escalate, true);
});

test('low sensitivity, one user, reversible, resolved is S4', () => {
  const r = scoreSeverity({ blastRadius:'one', dataSensitivity:'low',
    reversibility:'reversible', ongoing:false });
  assert.equal(r.severity, 'S4');
  assert.equal(r.escalate, false);
});

test('UNKNOWN blast radius defaults to the MORE severe tier (fail-safe)', () => {
  const known = scoreSeverity({ blastRadius:'one', dataSensitivity:'pii',
    reversibility:'hard', ongoing:true });
  const unknown = scoreSeverity({ blastRadius:'unknown', dataSensitivity:'pii',
    reversibility:'hard', ongoing:true });
  assert.ok(Number(unknown.severity[1]) <= Number(known.severity[1]));
  assert.match(unknown.rationale, /unknown/i);
});

test('fairness case: pii + many + hard + ongoing lands S2 or worse', () => {
  const r = scoreSeverity({ blastRadius:'many', dataSensitivity:'pii',
    reversibility:'hard', ongoing:true });
  assert.ok(['S1','S2'].includes(r.severity));
});
