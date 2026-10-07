import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decideGate } from './approval.mjs';

const req = { incidentId:'INC-025', phase:'contain', action:'freeze payments' };

test('no approval record -> request (and block)', () => {
  assert.equal(decideGate(req, []).decision, 'request');
});

test('empty collection never throws', () => {
  assert.doesNotThrow(() => decideGate(req, undefined));
});

test('pending -> hold, never proceed (no record, no action)', () => {
  const a = [{ id:'A1', incident_id:'INC-025', phase:'contain',
    proposed_action:'freeze payments', status:'pending' }];
  assert.equal(decideGate(req, a).decision, 'hold');
});

test('approved -> proceed with the approval id', () => {
  const a = [{ id:'A1', incident_id:'INC-025', phase:'contain',
    proposed_action:'freeze payments', status:'approved' }];
  const r = decideGate(req, a);
  assert.equal(r.decision, 'proceed');
  assert.equal(r.approvalId, 'A1');
});

test('rejected -> blocked', () => {
  const a = [{ id:'A1', incident_id:'INC-025', phase:'contain',
    proposed_action:'freeze payments', status:'rejected' }];
  assert.equal(decideGate(req, a).decision, 'blocked');
});

test('an approval for a different action does not unlock this one', () => {
  const a = [{ id:'A1', incident_id:'INC-025', phase:'contain',
    proposed_action:'something else', status:'approved' }];
  assert.equal(decideGate(req, a).decision, 'request');
});
