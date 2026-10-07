---
name: incident-postmortem
description: Run a blameless retrospective and record preventive controls, then close the incident.
---

## Framework enforced
The agentic **10-question launch checklist** (S4) and the manager's **10 governance questions** (S2) as the preventive-control source; KPMG governance steps; "named owner, drift alert, shutdown trigger".

## When to use
After service is restored and communications are handled — the final phase.

## DB interactions
Reads the full `ledger` + `incidents` doc; writes preventive controls into the incident record; sets `phase` to `closed`; appends a final `ledger` entry.

## Steps
1. Reconstruct the timeline from the `ledger` (this is why it is append-only and chained).
2. Identify preventive controls drawn from the checklists — e.g. tenant-isolation CI test (privacy), continuous disparate-impact monitoring (fairness), deterministic spend limit + input sanitization (autonomy).
3. Assign each control a named owner and, where relevant, a drift alert / shutdown trigger.
4. Set `phase` to `closed`; append a final `ledger` entry summarizing cause, fix, and controls.
