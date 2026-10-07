---
name: incident-remediate
description: Use when the root cause of an AI incident is known and you need to deploy a durable fix — not a symptom patch — under human approval, and prove the fix actually holds before service is restored.
---

## Orient
Fix the cause, not the symptom; gate the change; prove it held before service returns.

## The knowledge
Remediation is where an incident either ends or recurs, and the deciding factor is *where the fix lives*. The deepest lesson from agentic failures is that a control stated only in a prompt is advice, not a limit — the next cleverly worded input talks the model past it. A real fix is **deterministic and outside the model**: a spend cap enforced in code that refuses the transaction regardless of what the model decided. This is the spine of **EY's six guardrails** — least-privilege and time-bound identity, allowlisted actions, vaulted secrets, sandboxed and staged environments, behavioural monitoring, and human escalation — and of **OpenAI's six-layer defense stack** (safety training, monitors/filters, user confirmations, watch mode, network limits, disabled memory). The guardrails are layered on purpose: defence-in-depth means no single control is the only thing standing between a mistake and real-world harm.

The second half of remediation is **validation**, which is non-negotiable because a plausible fix that doesn't actually work is worse than none — it restores false confidence. Validation is specific to the failure: for a fairness fix you re-run the disparate-impact assessment and require it to clear both the four-fifths and significance tests; for an agent fix you confirm the hard limit blocks the exact action that caused the incident; for a privacy fix you confirm cross-session isolation. Durable remediation also installs **post-launch monitoring** — drift detectors with retraining triggers (IBM) — so the fix is watched, not assumed, which is what ISO 42001's corrective-and-preventive requirement and EU AI Act post-market monitoring both demand.

### Sources
EY Agentic AI Governance (guardrails 1–5); OpenAI System Card §3 (six-layer defense); IBM model-performance (drift detectors, retrain triggers); ISO/IEC 42001 A.10 (corrective + preventive); EU AI Act Art. 72 (post-market monitoring). Control catalog: `references/control-catalog.md`.

## Reads
`root_cause` from the `incidents` record; `approvals`.

## Procedure
1. Propose a fix that addresses the cause (not the symptom), preferring a deterministic control outside the model.
2. Open `approval-gate` (**GATE**).
3. On approval, deploy the fix.
4. **Validate**: re-run the failure-specific check (re-compute the gap / confirm the limit blocks / confirm isolation).
5. Install monitoring; restore service only if validation passes; advance the phase.

## The test
Service returns only when the validation check passes — e.g. `disparateImpactAssessment` returns `clear:true`, or the guardrail demonstrably refuses the offending action.

## Writes
the deployed fix and its validation result to the `incidents` record + `ledger`; the monitoring control for the post-mortem.

## Worked example
Root cause: a prompt-only spend cap → propose a deterministic limit outside the model + input sanitising → gate → deploy → re-test: the overpayment is now refused → restore service.

## Failure modes
If validation fails, it does **not** restore service — it returns to investigate. It never ships a prompt-only "we told it not to" fix for a control that must be enforced.

## Done when
the fix is deployed, the failure-specific validation passes, monitoring is in place, and service is safely restored.

## Connect
Called by `incident-commander` after investigation. Uses `approval-gate`; for fairness, re-runs `lib/fairness.mjs`; hands monitoring controls to `incident-postmortem`; logs via `audit-ledger`.

## Resources
`references/control-catalog.md` — EY 6 guardrails and OpenAI's 6-layer defense, with the deterministic-control-outside-the-model pattern.
