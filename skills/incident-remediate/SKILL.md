---
name: incident-remediate
description: Deploy and validate the fix under a human-approved gate, then restore service.
---

## Framework enforced
EY guardrails 1–5 (least privilege, allowlists, secrets, sandboxing, monitoring); OpenAI six-layer defense; IBM post-launch controls (drift detectors + retrain triggers).

## When to use
After the root cause is known, to fix it durably rather than patch the symptom.

## DB interactions
Reads `incidents` (root_cause); proposes the fix via `approval-gate`; on `approved`, records the deploy + validation in `ledger`; advances `phase`.

## Steps
1. Propose the fix that addresses the root cause (not the symptom) and open `approval-gate` (**GATE**).
2. On `approved`, apply the fix and **validate** it — e.g. re-run `adverseImpact` for fairness, confirm tenant-scoping for privacy, confirm the deterministic guardrail blocks for autonomy.
3. Record the deploy and the validation result in `ledger`; advance the phase.
4. If validation fails, do not restore service — return to investigate.
