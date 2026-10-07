# Control catalog — reference (incident-remediate)

Defence-in-depth: no single control is the only thing between a mistake and real harm.

## The core rule
A control stated **only in a prompt** is advice — the next input overrides it. A real limit lives in **deterministic code outside the model** that refuses the action regardless of the model's decision.

## EY's six guardrails (deploy fixes against these)
| # | Guardrail | Example fix |
|---|---|---|
| 1 | Identity & access — least privilege, time-bound | scope the agent's credentials; expire them |
| 2 | Action boundaries — allowlists | only pre-approved payees/actions |
| 3 | Secrets — vaulted, rotated | remove hardcoded keys |
| 4 | Environments — sandboxed, staged | test the fix in sandbox before prod |
| 5 | Monitoring — behavioural, anomaly | alert on limit-override attempts |
| 6 | Human escalation — thresholds, kill-switch | approval above a spend threshold |

## OpenAI's six-layer defense (agents)
safety training · monitors/filters · user confirmations · watch mode · network limits · disabled memory. Result: "100% confirmation before completing financial transactions".

## Validation — prove the fix held (failure-specific)
| Failure | Validation |
|---|---|
| Agent overstep | the deterministic limit refuses the exact offending action |
| Fairness | `disparateImpactAssessment` returns `clear:true` (four-fifths + significance) |
| Privacy | cross-session isolation confirmed; cache purged |

## Post-launch monitoring (durable remediation)
Drift detectors with retrain triggers (IBM); continuous disparate-impact monitoring (fairness); ISO 42001 A.10 corrective + preventive; EU AI Act Art. 72 post-market monitoring. A fix is watched, never assumed.
