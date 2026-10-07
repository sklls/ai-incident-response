---
name: regulatory-map
description: Use whenever an AI incident's legal obligations must be identified — which laws apply, who must be told, and by when — India-first, so the tightest notification clock is never discovered after a slower one is already handled.
---

## Orient
Turn "something bad happened" into "here is exactly who you must tell, and by when" — tightest clock first, India-first, with EU/US kept for comparison.

## The knowledge
The job is to map an incident to its concrete duties and deadlines, and the discipline that matters most is **ordering by clock**, because the characteristic failure is handling a well-known 72-hour duty while a tighter 6-hour one silently expires. The map is **India-first**, reflecting where these systems operate. For a **privacy** incident the duties stack: **CERT-In** (IT Act §70B) requires reporting the cyber incident within **6 hours**; the **DPDP Act 2023** requires an initial intimation to the Data Protection Board without delay and a detailed report within **72 hours**, plus notice to every affected Data Principal; **IT Act §43A/SPDI** adds reasonable-security liability. For **fairness**, the frame is rights-based — **Constitution Art. 14/15** equality and **NITI's** fairness-by-group and right-to-appeal — with the **EU AI Act** (hiring = high-risk, Annex III) and **EEOC/Title VII** as comparison. For **autonomy**, the anchors are **IT Act §11** (attribution of the electronic record → who is liable for the agent's action) and, in finance, **RBI's FREE-AI** framework (accountability and consumer protection), with **CERT-In** triggered if a system was compromised.

Two cross-cutting ideas shape the map. The **OECD common AI-incident framework** gives an interoperable harm definition (harm to persons, critical infrastructure, rights/law, property/environment), useful when an incident spans jurisdictions. And the **clock starts at awareness**, not after investigation — so obligations are raised as soon as severity is known, and an *initial* report is used to meet a deadline when the full picture isn't ready. Each obligation is written with an absolute deadline so the console can count it down.

### Sources
DPDP Act 2023 + Rules 2025; CERT-In Directions 2022 (IT Act §70B); IT Act §11, §43A; NITI RAI; RBI FREE-AI (2025); EU AI Act (Art. 73, Annex III); GDPR Art. 33; EEOC; OECD common framework. Full tables: `references/notification-regime.md`.

## Reads
the incident `scenario` and `scope`; the severity (for the EU band).

## Procedure
1. Classify the harm using the OECD definition; tag the NIST 600-1 risk.
2. Branch on `scenario` and raise obligations **with absolute deadlines**, sorted tightest clock first:
   - privacy → CERT-In 6h; DPDP initial + 72h; notify Data Principals; §43A.
   - fairness → Art. 14/15; NITI (fairness-by-group, appeal). Cmp. EU Annex III; EEOC + significance.
   - autonomy → IT Act §11; RBI FREE-AI (BFSI); CERT-In 6h if a system compromise.
3. Write `obligations[]` to the incident; log the obligations and deadlines raised.

## The test
No formula — correctness is the complete, correctly-deadlined obligation set for the scenario, verified against `references/notification-regime.md`.

## Writes
`obligations[]` onto the `incidents` record (each `{regulation, requirement, deadline, status}`), with a `ledger` entry.

## Worked example
A privacy incident → `[{CERT-In, report the cyber incident, +6h}, {DPDP, Board + Data Principals, +72h}, {IT Act §43A, reasonable security, —}]`, sorted 6h first.

## Failure modes
It never lists a longer clock before a shorter one, never omits the 6-hour CERT-In duty for a cyber incident, and flags when a scenario spans jurisdictions.

## Done when
the incident carries the full obligation set with correct, ordered deadlines that the console can count down.

## Connect
Called by `incident-triage`/`-communicate` and consulted by the specialists. Feeds `incident-communicate`'s drafting; the console renders the deadline countdown.

## Resources
`references/notification-regime.md` — the full India-first clock and obligation tables, with EU/US comparison and OECD harm definitions.
