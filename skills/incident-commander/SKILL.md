---
name: incident-commander
description: Use when an AI system has misbehaved in production and must be contained, investigated, and remedied end-to-end — a leak, a biased model, or an agent acting beyond its authority — and someone must own the response and prove every decision afterward.
---

## Orient
Run the same disciplined lifecycle every time, consult the right specialist at each phase, and never take a consequential action without a human-approved record. The commander sequences work; it does not decide outcomes itself.

## The knowledge
Incident response is a recognised discipline, not improvisation. The field's two anchors are **NIST SP 800-61r3 (2025)**, which frames response as part of ongoing risk management across the CSF 2.0 functions (Identify, Protect, Detect, Respond, Recover) rather than a siloed team activity, and **ISO/IEC 42001 Annex A.10**, which requires an AI management system to define incident types, detection and reporting channels, root-cause analysis, corrective *and* preventive actions, and records kept from detection to closure. This lifecycle is the operational form of that clause.

The commander's job is **sequencing and accountability**, which maps to NIST AI RMF's **GOVERN** (the accountability architecture) and **MANAGE** (prioritise and respond) functions. Three ideas govern how it runs. First, containment precedes understanding — you stop harm before you know the cause, because every minute of investigation is more exposure. Second, consequential actions are gated: the commander can investigate, analyse, score, draft and log on its own, but containment, remediation and external notices require a human-approved record, never a verbal "go ahead". Third, the record is the product — if a decision isn't in the tamper-evident ledger with who made it and why, it didn't happen, and the incident can't be defended to an auditor or regulator. This is why Gartner finds 40%+ of agentic projects fail on weak risk controls: the controls exist on paper but not in the run.

### Sources
NIST SP 800-61r3 (Incident Response, 2025); ISO/IEC 42001:2023 Annex A.10; NIST AI RMF 1.0 (GOVERN, MANAGE); KPMG India Architecture of Trust (10 pillars); Microsoft AI Governance Maturity Model; enterprise "10 program questions".

## Reads
the incoming report; the `incidents` record; approval decisions from `approvals`; the `ledger` head.

## Procedure
1. Open a case in `incidents`; log intake.
2. **Triage** — call `incident-triage`; it sets severity via `severity-matrix` and tags the failure type.
3. **Contain** — call `incident-contain`; it opens `approval-gate`. **Pause**; proceed only on an `approved` record.
4. **Investigate** — call `incident-investigate`; write the root cause.
5. **Remediate** — call `incident-remediate`; second gate; validate the fix held.
6. **Communicate** — call `incident-communicate`; `regulatory-map` sets obligations; gate each external send.
7. **Post-mortem** — call `incident-postmortem`; record preventive controls; set phase `closed`.
At every phase, append a sealed `ledger` entry naming the actor (`agent:Commander`) and the rationale.

## The test
The only hard rule it enforces on every consequential step: **proceed only when `decideGate` returns `proceed`** (an `approved` record exists). Otherwise hold. No record, no action.

## Writes
the evolving `incidents` record (phase, severity, scope, root_cause, obligations) and an append-only `ledger` trail that reconstructs the whole incident.

## Worked example
A finance agent pays beyond its limit → open INC-025 → triage returns S1 → request containment and **wait** → on approval, freeze payments → investigate (prompt injection) → remediate behind a second gate → notify under IT Act §11 → write controls → close. Every step is a sealed ledger block.

## Failure modes
If a gate is never answered, it holds indefinitely rather than guessing. If a specialist can't classify the failure, it escalates to the named human owner. It never self-approves, never edits the ledger, never restores service before the fix is validated.

## Done when
the incident is `closed`, the root cause and preventive controls are recorded, every consequential action has a matching human approval in the ledger, and the chain verifies.

## Connect
The entry point for every incident. Calls the Tier-1 lifecycle in order, consults the Tier-2 specialist for the failure type, and relies on the Tier-3 primitives (`severity-matrix`, `approval-gate`, `audit-ledger`, `regulatory-map`). Shares one contract with the console: the four DB collections.
