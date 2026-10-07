---
name: incident-postmortem
description: Use when an AI incident is remediated and communicated and you need to turn it into preventive controls, assign owners, and close the case — a blameless review that changes the system, not a report that blames a person.
---

## Orient
Turn one incident into the control that stops the next one. Blameless by design: the output is a change to the system, with a name on it.

## The knowledge
A post-mortem is worthless if it produces a narrative and a scolding; it is valuable only if it produces **named, owned preventive controls**. The method converts an incident into controls by asking two questions. For agents: what should have been true before deployment — a named owner, written constraints, least-privilege access, confirmation thresholds, untrusted-content protection, a tested kill-switch and incident playbook, audit-trail reconstruction, liability assignment — and each gap the incident exposed becomes a control. For models, the model-governance controls: report by group, sign a metric threshold, validate on your own data, keep a human override and a manual alternative, name an owner with a drift alert and a shutdown trigger.

Two principles keep it honest. First, **blamelessness** is not politeness, it is accuracy: people act rationally inside the system they're given, so a control beats a reprimand because the next person inherits the control, not the lesson. Second, the post-mortem is only possible because the **ledger is append-only** — the timeline is reconstructed from the sealed record, which is exactly the audit-trail reconstruction good agent governance demands and the "records and learning to closure" that **ISO 42001 Annex A.10** requires. Each control gets an owner and, where relevant, a monitoring alert and a shutdown trigger, so it is a live commitment rather than a line in a document.

### Sources
ISO/IEC 42001 A.10 (corrective + preventive actions, records, learning to closure); KPMG governance steps.

## Reads
the full `ledger` for the incident; the `incidents` record; the monitoring control from `incident-remediate`.

## Procedure
1. Reconstruct the timeline from the `ledger` (this is why it is append-only).
2. Walk the agent-readiness and model-governance controls against the incident; for each gap it exposed, write a preventive control.
3. Assign each control a named owner and, where relevant, a drift alert / shutdown trigger.
4. Set the incident `phase` to `closed`; append a final `ledger` entry summarising cause, fix, and controls.

## The test
No formula — a good post-mortem produces at least one owned control that would have prevented or caught this incident earlier.

## Writes
preventive controls (with owners) onto the `incidents` record; `phase: closed`; a closing `ledger` entry.

## Worked example
INC-025 → control: money-moving actions require a hard limit outside the model **and** human approval above a threshold; owner assigned; monitoring alert on limit-override attempts → case closed.

## Failure modes
It never closes a case without at least one preventive control and an owner, and never attributes the incident to an individual when a system control is the real fix.

## Done when
the case is `closed`, every control has an owner, and the ledger holds a complete, verifiable timeline.

## Connect
Called last by `incident-commander`. Reads the whole `audit-ledger`; draws its controls from the agent-readiness and model-governance lists above; its controls feed back into deployment governance.
