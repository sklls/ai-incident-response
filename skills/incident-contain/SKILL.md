---
name: incident-contain
description: Stop the harm from spreading, under a human-approved gate, before investigating the cause.
---

## Framework enforced
EY guardrail 6 (kill-switch, approval thresholds); OpenAI confirmation flows; agentic launch-checklist #9 (kill-switch, rollback, incident playbook tested).

## When to use
Immediately after triage, before root-cause analysis — containment does not wait for the cause.

## DB interactions
Reads `incidents`; proposes an action through `approval-gate` (writes `approvals`); on `approved`, records the action in `ledger`; may set a holding state on the incident.

## Steps
1. Ask the scenario specialist for the correct **shape** of containment (shut down vs human-review vs revoke authority).
2. Propose the containment action and open `approval-gate` (**GATE** — pause for a human).
3. On an `approved` record only, execute containment and append a `ledger{agent: done}` entry.
4. If `rejected`, hold and escalate or propose an alternative. **No record, no action.**
