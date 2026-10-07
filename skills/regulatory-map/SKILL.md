---
name: regulatory-map
description: Use whenever an AI incident's legal obligations must be identified — which laws apply, who must be told, and by when — India-first, so the tightest notification clock is never discovered after a slower one is already handled.
---

## Orient
Turn "something bad happened" into "here is exactly who you must tell, and by when" — tightest clock first, India-first, with EU/US kept for comparison.

## The knowledge
The job is to map an incident to its concrete duties and deadlines, and the discipline that matters most is **ordering by clock**, because the characteristic failure is handling a well-known 72-hour duty while a tighter 6-hour one silently expires. The **clock starts at awareness**, not after investigation, so obligations are raised as soon as severity is known, and an *initial* report is used to meet a deadline when the full picture isn't ready.

### India — the clocks, tightest first
| Trigger | Instrument | Who to tell | Deadline |
|---|---|---|---|
| Any cyber incident (breach, leak, unauthorised access, system compromise) | CERT-In Directions 2022 (IT Act §70B) | CERT-In | **6 hours** of noticing |
| Personal-data breach | DPDP Act 2023 | Data Protection Board — initial intimation | **without delay** |
| Personal-data breach | DPDP Act 2023 | Data Protection Board — detailed report | **72 hours** |
| Personal-data breach | DPDP Act 2023 | each affected Data Principal | **without delay** |
| Sensitive personal data, negligence | IT Act §43A / SPDI Rules | civil liability | — |
| Agent action / attribution | IT Act §11 | anchors who is liable | — |
| BFSI AI | RBI FREE-AI (2025) | institution accountability | — |

**DPDP breach report — required contents:** nature of the breach · data categories affected · approximate number of Data Principals · likely consequences · measures taken/proposed.

### By scenario
- **Privacy** → CERT-In **6h**; DPDP initial + **72h** to the Board; notify Data Principals; IT Act §43A/SPDI reasonable-security liability; NITI purpose-limitation; Puttaswamy (privacy is a fundamental right).
- **Fairness** → rights-based: Constitution **Art. 14/15** (equality; no discrimination on religion, race, caste, sex, place of birth), NITI fairness-by-group + right to appeal. Comparison: EU AI Act Annex III (hiring = high-risk), EEOC/Title VII (four-fifths + significance).
- **Autonomy** → **IT Act §11** (attribution of the electronic record → who is liable for the agent's action); RBI FREE-AI (BFSI accountability + consumer protection); CERT-In **6h** if a system was compromised.

### EU (comparison) — EU AI Act Art. 73 serious-incident tiers
Default serious incident ≤ **15 days**; a death may have been caused ≤ **10 days**; widespread / serious-irreversible critical-infrastructure disruption ≤ **2 days**. Initial incomplete report permitted (Art. 73(5)); Art. 72 = post-market monitoring. GDPR Art. 33 = 72h breach notice.

### Cross-jurisdiction — OECD common AI-incident harm types
harm to persons · disruption of critical infrastructure · violation of rights or law · harm to property/environment. Useful when an incident spans borders.

### Sources
DPDP Act 2023 + Rules 2025; CERT-In Directions 2022 (IT Act §70B); IT Act §11, §43A; NITI RAI; RBI FREE-AI (2025); EU AI Act (Art. 72, 73, Annex III); GDPR Art. 33; EEOC; OECD common framework.

## Reads
the incident `scenario` and `scope`; the severity (for the EU band).

## Procedure
1. Classify the harm using the OECD types; tag the NIST 600-1 risk.
2. Branch on `scenario` and raise obligations **with absolute deadlines**, sorted tightest clock first (see tables above).
3. Write `obligations[]` to the incident; log the obligations and deadlines raised.

## The test
Correctness is the complete, correctly-deadlined obligation set for the scenario, matching the clock tables above.

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
