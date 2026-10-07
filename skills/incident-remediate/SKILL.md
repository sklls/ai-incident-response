---
name: incident-remediate
description: Use when the root cause of an AI incident is known and you need to deploy a durable fix — not a symptom patch — under human approval, and prove the fix actually holds before service is restored.
---

## Orient
Fix the cause, not the symptom; gate the change; prove it held before service returns.

## The knowledge
Remediation is where an incident either ends or recurs, and the deciding factor is *where the fix lives*. The deepest lesson from agentic failures: a control stated **only in a prompt** is advice — the next cleverly worded input talks the model past it. A real fix is **deterministic and outside the model**, in code that refuses the action regardless of what the model decided. Defence-in-depth means layering controls so no single one is the only thing between a mistake and real harm.

**The control set — EY's six guardrails:**
| # | Guardrail | Example fix |
|---|---|---|
| 1 | Identity & access — least privilege, time-bound | scope the agent's credentials; expire them |
| 2 | Action boundaries — allowlists | only pre-approved payees/actions |
| 3 | Secrets — vaulted, rotated | remove hardcoded keys |
| 4 | Environments — sandboxed, staged | test the fix in sandbox before prod |
| 5 | Monitoring — behavioural, anomaly | alert on limit-override attempts |
| 6 | Human escalation — thresholds, kill-switch | approval above a spend threshold |

**OpenAI's six-layer defense** adds: safety training · monitors/filters · user confirmations · watch mode · network limits · disabled memory ("100% confirmation before completing financial transactions").

**The second half is validation**, which is non-negotiable because a plausible fix that doesn't work is worse than none — it restores false confidence. Validation is failure-specific:
| Failure | Validation |
|---|---|
| Agent overstep | the deterministic limit refuses the exact offending action |
| Fairness | `disparateImpactAssessment` returns `clear:true` (four-fifths + significance) |
| Privacy | cross-session isolation confirmed; cache purged |

Durable remediation also installs **post-launch monitoring** — drift detectors with retraining triggers (IBM) — so the fix is watched, not assumed, which is what **ISO 42001 A.10** (corrective + preventive) and **EU AI Act Art. 72** (post-market monitoring) both require.

### Sources
EY Agentic AI Governance (guardrails 1–5); OpenAI System Card §3 (six-layer defense); IBM model-performance (drift detectors, retrain triggers); ISO/IEC 42001 A.10; EU AI Act Art. 72.

## Reads
`root_cause` from the `incidents` record; `approvals`.

## Procedure
1. Propose a fix that addresses the cause, preferring a deterministic control outside the model.
2. Open `approval-gate` (**GATE**).
3. On approval, deploy the fix.
4. **Validate**: re-run the failure-specific check (table above).
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
