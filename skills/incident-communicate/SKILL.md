---
name: incident-communicate
description: Draft internal, customer, and regulator messaging and send only after a human gate.
---

## Framework enforced
DPDP breach-notice duties; NITI transparency (publish error likelihood + handling); IBM shadow-AI stakeholder communication. External sends are irreversible, so they are gated.

## When to use
After remediation (or in parallel for S1 breaches where a notification clock is running).

## DB interactions
Reads `incidents` (obligations from `regulatory-map`); drafts notices (held, not sent); opens `approval-gate` before any external message; appends a `ledger` entry.

## Steps
1. Call `regulatory-map` to populate `obligations[]` and any deadlines.
2. Draft three audiences: internal (owner/leadership), affected customers, and the regulator/auditor.
3. Open `approval-gate` for each external send (**GATE**) — nothing leaves without an `approved` record.
4. On `approved`, record the (mock) send in `ledger` with recipient and obligation reference.
