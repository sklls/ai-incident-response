---
name: incident-communicate
description: Use when an AI incident triggers a duty to tell people — regulators, affected customers, internal leadership — and you must draft the right notices, meet the legal clocks, and send nothing without human approval.
---

## Orient
Tell the people with a right to know, in the order the law demands, tightest clock first — and send nothing without a human's sign-off.

## The knowledge
Notification is a legal act with hard deadlines, and the single most common failure is working the clocks out of order — handling the 72-hour duty while the 6-hour one quietly expires. In India the ladder is steep: **CERT-In's 2022 Directions** (under IT Act §70B) require reporting a cyber incident — which includes a data breach or unauthorised access — within **6 hours** of noticing it; the **DPDP Act 2023** then requires an **initial intimation to the Data Protection Board without delay and a detailed report within 72 hours**, plus notice to **every affected Data Principal without delay**. The clock starts at *awareness*, not after the investigation finishes, which is why drafting begins during containment, not after. The DPDP report has required contents: the breach's nature, the data categories, the approximate number affected, the likely consequences, and the measures taken. For comparison, the **EU AI Act Art. 73** tiers serious-incident reporting at 15 days (default), 10 days (a death), and 2 days (critical-infrastructure or widespread harm), and permits an initial incomplete report to meet the deadline.

The second discipline is **audience separation and the gate**. Internal leadership, affected customers, and the regulator need different messages at different moments, and every external message is drafted but **held** until a human approves it, because a notice is legally binding and cannot be recalled. **NITI's transparency** guidance adds that affected people should get the error likelihood and a handling path, not just a boilerplate apology. Speed and accuracy trade off, so the law's answer — used deliberately here — is the *initial* report that meets the clock, followed by the detailed one.

### Sources
CERT-In Directions 2022 (IT Act §70B, 6-hour reporting); DPDP Act 2023 + DPDP Rules 2025 (initial intimation + 72-hour report; content requirements); EU AI Act Art. 73 (tiered deadlines); NITI RAI (transparency); IBM shadow-AI (stakeholder communication). Clocks & templates: `references/notification-regime.md`.

## Reads
the `obligations[]` set by `regulatory-map` (each with a deadline); `approvals`.

## Procedure
1. Call `regulatory-map` to populate `obligations[]` and their deadlines; sort by clock, **tightest first**.
2. Draft per audience: internal, affected customers / Data Principals, regulator (CERT-In, the Board, or the EU authority).
3. Where the clock is tight, prepare an **initial** report now and a detailed one to follow.
4. Open `approval-gate` for each external send (**GATE**); on approval, record recipient, obligation, and report type.

## The test
No formula — correctness is meeting each obligation's deadline with the required content, verified against `references/notification-regime.md`.

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

## Resources
`references/notification-regime.md` — CERT-In / DPDP / EU Art.73 clocks, required contents, and draft notice templates.
