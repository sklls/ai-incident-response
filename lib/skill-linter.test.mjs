import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintSkill } from './skill-linter.mjs';

const good = `---
name: incident-contain
description: Stop the bleeding under a human-approved gate.
---
## Framework enforced
EY guardrail 6 (kill-switch); OpenAI confirmation flows; launch-checklist #9.
## When to use
After triage, when an incident needs containment.
## DB interactions
Reads: incidents, approvals. Writes: ledger, approvals.
## Steps
1. Propose containment. 2. Open approval-gate. 3. On approved, act and log.
`;

test('a well-formed skill passes', () => {
  assert.equal(lintSkill(good).valid, true);
});

test('missing Framework enforced section fails', () => {
  assert.equal(lintSkill(good.replace('## Framework enforced','## Nope')).valid, false);
});

test('missing frontmatter name fails', () => {
  assert.equal(lintSkill(good.replace('name: incident-contain','x: y')).valid, false);
});
