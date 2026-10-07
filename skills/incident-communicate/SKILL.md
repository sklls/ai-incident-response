---
name: incident-communicate
description: Use when an AI incident triggers a duty to tell people — regulators, affected customers, internal leadership — and you must draft the right notices, meet the legal clocks, and send nothing without human approval.
---

## Orient
Tell the people with a right to know, in the order the law demands, tightest clock first — and send nothing without a human's sign-off.

## The knowledge
Notification is a legal act with hard deadlines, and the single most common failure is working the clocks out of order — handling the 72-hour duty while the 6-hour one quietly expires. The clock starts at *awareness*, not after the investigation finishes, which is why drafting begins during containment.

**Order of operations (tightest clock first):** CERT-In **6h** (IT Act §70B — any cyber incident, incl. a data breach or unauthorised access) → DPDP **initial intimation** to the Data Protection Board (without delay) → DPDP **72h detailed** report → notice to **every affected Data Principal** (without delay). The **DPDP report contents** are fixed: nature of the breach · data categories · approximate number of Data Principals · likely consequences · measures taken. For comparison, the **EU AI Act Art. 73** tiers serious-incident reporting at **15 days** (default), **10 days** (a death), **2 days** (critical-infrastructure/widespread), and permits an initial incomplete report to meet the deadline.

The second discipline is **audience separation and the gate**. Three audiences need different messages at different moments, and every external message is drafted but **held** until a human approves it, because a notice is legally binding and cannot be recalled:

| Audience | When | Content |
|---|---|---|
| Internal leadership / owner | immediately on S1/S2 | facts, severity, blast radius, next gate |
| Affected customers / Data Principals | without delay | what happened, what data, what to do, how to get help / appeal |
| Regulator (CERT-In / DPB / EU authority) | by the clock | the required statutory contents |

**NITI's transparency** guidance adds that affected people should get the error likelihood and a handling path, not a boilerplate apology. Speed and accuracy trade off, so the law's answer — used deliberately here — is the *initial* report that meets the clock, followed by the detailed one.

**Draft templates (fill and gate before sending):**
- *CERT-In 6h initial:* incident one-liner · noticed-at · type · scope so far · immediate action · point of contact · "(initial; details to follow)".
- *DPDP notice:* nature · data categories · approx. number of Data Principals · likely consequences · measures taken/proposed.
- *Affected-person notice (NITI):* what happened (plain) · what data of yours · what we've done · what you can do · how to reach us / appeal.

### Sources
CERT-In Directions 2022 (IT Act §70B, 6-hour reporting); DPDP Act 2023 + DPDP Rules 2025 (initial intimation + 72-hour report; contents); EU AI Act Art. 73 (tiered deadlines); NITI RAI (transparency); IBM shadow-AI (stakeholder communication).

## Reads
the `obligations[]` set by `regulatory-map` (each with a deadline); `approvals`.

## Procedure
1. Call `regulatory-map` to populate `obligations[]`; sort by clock, **tightest first**.
2. Draft per audience; where the clock is tight, prepare an **initial** report now and a detailed one to follow.
3. Open `approval-gate` for each external send (**GATE**); on approval, record recipient, obligation, and report type.

## The test
Correctness is meeting each obligation's deadline with the required content (contents listed above).

## Writes
the (mock) notices sent, each logged with recipient, obligation reference, and whether it was an initial or detailed report.

## Worked example
Confirmed privacy breach → regulatory-map returns CERT-In 6h + DPDP 72h → draft the CERT-In initial report first → gate → send → then the DPDP detailed report to the Board + affected Data Principals.

## Failure modes
It never sends without an approved record, never works a longer clock before a shorter one, and uses an initial report rather than missing a deadline waiting for completeness.

## Done when
every triggered obligation has an approved, logged notice (initial where needed), within its deadline.

## Connect
Called by `incident-commander` after remediation (or earlier for S1 breaches whose clock is already running). Uses `regulatory-map` + `approval-gate`; logs via `audit-ledger`.
