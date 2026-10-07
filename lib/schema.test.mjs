import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDoc, COLLECTIONS, PHASES, SEVERITIES } from './schema.mjs';

test('COLLECTIONS are the four spec collections', () => {
  assert.deepEqual([...COLLECTIONS].sort(),
    ['approvals', 'evidence', 'incidents', 'ledger']);
});

test('PHASES are in spec order', () => {
  assert.deepEqual(PHASES,
    ['triage','contain','investigate','remediate','communicate','postmortem','closed']);
});

test('a well-formed incident validates', () => {
  const doc = { id:'INC-025', title:'Finance agent overpays', scenario:'autonomy',
    affected_system:'PayAgent', phase:'triage', severity:'S1', owner:'IR-Commander',
    opened_at:'2026-10-07T14:00:00Z', scope:'several payments' };
  assert.equal(validateDoc('incidents', doc).valid, true);
});

test('an incident with a bad phase is rejected with a message', () => {
  const doc = { id:'INC-1', title:'x', scenario:'privacy', affected_system:'s',
    phase:'wrong', severity:'S2', owner:'o', opened_at:'t', scope:'s' };
  const r = validateDoc('incidents', doc);
  assert.equal(r.valid, false);
  assert.match(r.errors.join(' '), /phase/);
});

test('a ledger entry requires seq, actor_type, action, hash', () => {
  const r = validateDoc('ledger', { incident_id:'INC-1' });
  assert.equal(r.valid, false);
  assert.match(r.errors.join(' '), /seq|actor_type|action|hash/);
});

test('an approval requires a status in the allowed set', () => {
  const ok = validateDoc('approvals', { id:'A1', incident_id:'INC-1', phase:'contain',
    proposed_action:'kill', blast_radius:'all', severity:'S1', status:'pending' });
  assert.equal(ok.valid, true);
  const bad = validateDoc('approvals', { id:'A1', incident_id:'INC-1', phase:'contain',
    proposed_action:'kill', blast_radius:'all', severity:'S1', status:'maybe' });
  assert.equal(bad.valid, false);
});
