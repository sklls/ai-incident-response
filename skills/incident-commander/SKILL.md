---
name: incident-commander
description: Orchestrate an AI incident end-to-end — contain, investigate, remedy — under human gates with a tamper-evident audit trail.
---

## Framework enforced
NIST AI RMF **GOVERN** function; KPMG India 10 trust pillars; Microsoft governance maturity model; the enterprise "10 program questions" (this skill operationalizes *incidents* + *evidence*).

## When to use
An AI system has misbehaved in production and must be contained, investigated, and remedied — e.g. a chatbot leaking data, a hiring model with disparate impact, or a finance agent acting beyond its authority.

## The governing rule (non-negotiable)
The agent may **investigate, analyze, score, draft, and log** autonomously, but may **never** take a consequential action (containment, remediation) or send an external message without an `approved` record in the ledger. It acts on the DB record, never a verbal "ok". **No record, no action.**

## DB interactions
- Reads/writes `incidents` (phase, severity, scope, root_cause, obligations).
- Appends `ledger` for every action via `node lib/ledger-cli.mjs` then an `ArtifactData` write (append-only; never update/delete).
- Reads/writes `approvals` through the `approval-gate` skill.
- Reads `evidence` during investigation.

## Steps
1. **Triage** — invoke `incident-triage`; consult the scenario specialist (`privacy-breach` | `fairness-bias` | `agent-autonomy`) for intake questions; `severity-matrix` sets S1–S4; log.
2. **Contain** — invoke `incident-contain`. This opens `approval-gate`; **pause** and do not act until an `approved` record exists. Then execute and log.
3. **Investigate** — invoke `incident-investigate`; read `evidence`; apply the specialist's analysis; write `root_cause`; log.
4. **Remediate** — invoke `incident-remediate`; open `approval-gate`; on `approved`, apply the fix, validate it, advance; log.
5. **Communicate** — invoke `incident-communicate`; `regulatory-map` adds obligations; draft notices; `approval-gate` before anything is "sent"; log.
6. **Postmortem** — invoke `incident-postmortem`; record preventive controls; set phase to `closed`; log.

At each phase, append a `ledger` entry naming the actor (`agent:Commander`) and rationale, so the record reconstructs the whole incident.
