---
name: approval-gate
description: Use when a consequential action in an incident — containment, a remediation deploy, an external notice — needs human authorisation, and the agent must not proceed on anything less than a recorded approval.
---

## Orient
Make human oversight real, not decorative: write the request, halt the agent, and read the database for the answer. A yes in the room is not a yes.

## The knowledge
The gate is the mechanism that turns "human oversight" from a principle into an enforceable control. Oversight fails in practice in two ways, and the gate is built against both. The first is **rubber-stamping** — Anthropic's own data notes that 93% of permission prompts get approved, which it calls "approval fatigue"; a gate that only surfaces a prompt doesn't help if the human clicks yes reflexively, so the gate records *what* was proposed with its blast radius and severity, so the approval is specific and accountable, not a blanket click. The second is **oversight that leaves no trace** — if the authorisation lives only in a hallway conversation, it can't be reconstructed, so the oversight is unprovable and, for governance purposes, didn't happen.

So the gate's discipline is: the agent **acts only on a recorded decision**, never on conversation. It reads the state and branches — no matching record means it must file a request and wait; pending means hold; approved means proceed; rejected means hold and offer another way. This is the operational form of **EY's guardrail 6** (human escalation with approval thresholds and a kill-switch), **OpenAI's confirmation flows** ("100% confirmation before completing financial transactions"), and the EU AI Act's human-oversight requirement. The separation is strict: the agent may *propose*, a *human* approves, and the decision — with the approver's name — is sealed into the ledger. That is what makes the difference between oversight you can prove and oversight you merely remember.

### Sources
EY Agentic AI Governance (guardrail 6 — human escalation); OpenAI System Card §3 (confirmation flows); Anthropic (approval-fatigue finding); confirmation thresholds for consequential agent actions. EU AI Act Art. 14 (human oversight, comparison).

## Reads
the `approvals` collection for the current request; the console surfaces the request to a human.

## The test
`decideGate({incidentId, phase, action}, approvals)` from `lib/approval.mjs` → `request` (no record — file & wait) · `hold` (pending) · `proceed` (approved) · `blocked` (rejected). It matches on incident + phase + action, so an approval for a different action does not unlock this one.

## Procedure
1. Run `decideGate`. If `request`: write an `approvals` doc (`status: pending`) with `proposed_action`, `blast_radius`, `severity`; seal a `ledger{REQUEST}` entry; **pause** and ask the human to act in the console.
2. On resume, re-read `approvals` and run `decideGate` again.
3. `proceed` → let the caller act, then log it. `hold` → wait. `blocked` → do not act; escalate or propose an alternative.

## Writes
the `approvals` request and the resulting decision; `ledger` entries for the request and the human decision (with the approver's name).

## Worked example
Request: freeze payments; record pending → `hold` (the agent waits). Human approves in the console → record approved → `proceed` (the agent freezes and logs).

## Failure modes
It never infers approval from the conversation, never treats pending as proceed, and never lets one approval cover a different action. No record, no action.

## Done when
the agent has either a recorded `approved` to act on, or a recorded `rejected`/`pending` that it is correctly honouring.

## Connect
Called by `incident-contain`, `-remediate`, and `-communicate` before any consequential step. Writes to `audit-ledger`. Backed by the tested `lib/approval.mjs`; the console reads/writes the same `approvals` collection.
