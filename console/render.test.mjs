import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderLedger, renderQueue, renderApprovalCard, renderIncidentDetail } from './render.mjs';
import { sealEntry } from '../lib/ledger.mjs';

test('empty queue renders an empty state, not a crash', () => {
  const html = renderQueue([]);
  assert.match(html, /no (active )?incidents/i);
});

test('ledger drawer shows a verified badge for an intact chain', () => {
  const e1 = sealEntry('GENESIS', 1, { actor_type:'system', action:'opened' });
  const e2 = sealEntry(e1.hash, 2, { actor_type:'agent', action:'severity S1' });
  const html = renderLedger([e1, e2]);
  assert.match(html, /verified/i);
  assert.match(html, /opened/);
});

test('tampered chain renders a BROKEN badge', () => {
  const e1 = sealEntry('GENESIS', 1, { actor_type:'system', action:'opened' });
  const e2 = sealEntry(e1.hash, 2, { actor_type:'agent', action:'x' });
  e1.action = 'tampered';
  assert.match(renderLedger([e1, e2]), /broken/i);
});

test('no pending approval renders nothing actionable', () => {
  assert.match(renderApprovalCard(null), /no pending/i);
});

test('incident detail shows the phase stepper with the active phase', () => {
  const html = renderIncidentDetail(
    { id:'INC-025', title:'Finance agent overpays', phase:'contain', severity:'S1', scope:'x', root_cause:null }, []);
  assert.match(html, /INC-025/);
  assert.match(html, /contain/);
});
