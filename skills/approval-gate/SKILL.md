---
name: approval-gate
description: Enforce the human-in-the-loop gate — request a human decision, block the agent, and proceed only on an approved record in the ledger.
---

## Framework enforced
EY guardrail 6 "**human escalation**" (approval thresholds, kill-switch); OpenAI System Card §3 **confirmation flows** ("100% confirmation before completing financial transactions"); agentic launch-checklist #5 (confirmation thresholds defined).

## When to use
Before any consequential action — containment, remediation deploy, or sending an external communication (customer, regulator, auditor).

## DB interactions
Writes an `approvals` doc (`status: pending`) and a sealed `ledger{REQUEST}` entry; later reads `approvals` to confirm the human decision; the human's APPROVE/REJECT click in the console writes the decision + a `ledger{human}` entry.

## Steps
1. Run `decideGate({incidentId, phase, action}, approvals)` (from `lib/approval.mjs`).
2. If `request`: create an `approvals` doc with `status: pending`, `proposed_action`, `blast_radius`, `severity`; append a sealed `ledger{REQUEST}` entry; then **PAUSE** and tell the user to Approve/Reject in the console.
3. On resume, **re-read** `approvals` and run `decideGate` again:
   - `proceed` (approved) → return control to the caller to execute the action, then log it.
   - `hold` (pending) → refuse to act and wait. **No record, no action.**
   - `blocked` (rejected) → do not act; propose an alternative or escalate per `severity-matrix`.
4. Never infer approval from the conversation — only from an `approved` record in the DB.
