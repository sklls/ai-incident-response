---
name: incident-communicate
description: Draft internal, customer, and regulator messaging and send only after a human gate.
---

## Framework enforced
**Multi-clock statutory notice** — CERT-In 6h, DPDP initial-intimation + 72h detailed, EU AI Act Art. 73 tiers (see `regulatory-map`); NITI transparency (publish error likelihood + handling); IBM shadow-AI stakeholder communication. External sends are irreversible, so they are gated.

## When to use
After remediation (or in parallel for S1 breaches where a notification clock is running).

## DB interactions
Reads `incidents` (obligations from `regulatory-map`); drafts notices (held, not sent); opens `approval-gate` before any external message; appends a `ledger` entry.

## Steps
1. Call `regulatory-map` to populate `obligations[]` and their deadlines; **act on the tightest clock first (CERT-In 6h before DPDP 72h)**.
2. Draft the audiences each obligation requires: internal (owner/leadership); affected customers / Data Principals; the regulator (CERT-In, Data Protection Board, or EU market-surveillance authority). Use an **initial incomplete report** where the clock demands speed (DPDP initial intimation; EU Art. 73(5)).
3. Open `approval-gate` for each external send (**GATE**) — nothing leaves without an `approved` record.
4. On `approved`, record the (mock) send in `ledger` with recipient, obligation reference, and whether it was an initial or detailed report.
