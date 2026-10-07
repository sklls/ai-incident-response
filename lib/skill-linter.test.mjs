import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintSkill } from './skill-linter.mjs';

// A skill now follows the improved anatomy: trigger-only description, then a body
// that carries real domain knowledge, a procedure, an output contract, and its
// wiring into the group.
const good = `---
name: incident-contain
description: Use when an incident must be stopped before its cause is known — a leak still leaking, payments still going out, a model still auto-deciding.
---
## Orient
Stop the harm before you understand it; never act without a human-approved record.
## The knowledge
Containment buys time safely. The shape differs by failure: shut down, route to a human, or revoke access.
### Sources
EY Agentic AI Governance (guardrail 6); OpenAI System Card §3; Google SAIF.
## Reads
the live incident; the specialist's recommended containment shape.
## Procedure
1. Ask the specialist for the containment shape. 2. Open approval-gate. 3. On approved, act and log.
## The test
No decision rule — the gate's approved record is the precondition to act.
## Writes
an approved, recorded containment action onto the incident + ledger.
## Worked example
Finance agent overpaying → propose "freeze payments" → gated → on approval, freeze + log.
## Failure modes
If rejected, hold and offer another way. Stop and escalate if no safe containment exists.
## Done when
the harm is halted and the action is on the record.
## Connect
Called by incident-commander after triage; uses approval-gate + audit-ledger; hands to incident-investigate.
`;

test('a well-formed skill passes', () => {
  const r = lintSkill(good);
  assert.equal(r.valid, true, r.errors.join('; '));
});

test('missing The knowledge section fails', () => {
  assert.equal(lintSkill(good.replace('## The knowledge','## Nope')).valid, false);
});

test('missing Procedure section fails', () => {
  assert.equal(lintSkill(good.replace('## Procedure','## Nope')).valid, false);
});

test('missing Writes (output contract) fails', () => {
  assert.equal(lintSkill(good.replace('## Writes','## Nope')).valid, false);
});

test('missing Connect (group wiring) fails', () => {
  assert.equal(lintSkill(good.replace('## Connect','## Nope')).valid, false);
});

test('a skill that cites no sources is flagged', () => {
  assert.equal(lintSkill(good.replace('### Sources','### Nope')).valid, false);
});

test('missing frontmatter name fails', () => {
  assert.equal(lintSkill(good.replace('name: incident-contain','x: y')).valid, false);
});

test('a bare description with no "Use when" trigger is flagged', () => {
  const r = lintSkill(good.replace(/description: Use when[^\n]*/,'description: Stops the bleeding.'));
  assert.equal(r.valid, false);
  assert.match(r.errors.join(' '), /trigger|Use when/i);
});
