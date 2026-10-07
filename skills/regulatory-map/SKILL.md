---
name: regulatory-map
description: Map an incident to its regulatory obligations and notification deadlines, India-first, with EU/US as comparison.
---

## Framework enforced
India-first: **DPDP Act 2023 + DPDP Rules 2025**, **CERT-In Directions 2022** (IT Act §70B), **IT Act §11** (attribution → liability) and **§43A/SPDI**, **NITI "Responsible AI for All"**, and **RBI FREE-AI Framework 2025** (BFSI). Comparison lens: **EU AI Act Art. 73** (serious-incident reporting), GDPR Art. 33, EEOC/Title VII. Cross-jurisdiction definition: **OECD common AI-incident framework**.

## When to use
As soon as severity is known for any S1 incident (to start the tightest notification clock), and again during communicate.

## DB interactions
Reads `incidents` (scenario, scope); writes `obligations[]` onto the incident (each with `regulation`, `requirement`, `deadline`, `status`); appends a `ledger` entry.

## Notification clocks (encode the deadline, tightest first)
- **CERT-In (India): 6 HOURS** from noticing any reportable **cyber incident** — data breach, data leak, unauthorized access, system compromise. Triggers on the **privacy** and often the **autonomy** incident. This is the tightest clock — set it first.
- **DPDP Act 2023 (India):** on a personal-data breach, **initial intimation to the Data Protection Board without delay** + a **detailed report within 72 HOURS** of becoming aware; notify **each affected Data Principal without delay**. (Clock starts at awareness, not after investigation.)
- **EU AI Act Art. 73 (comparison):** serious incident ≤ **15 days**; ≤ **10 days** if a death; ≤ **2 days** for widespread infringement / serious-irreversible critical-infrastructure disruption. Initial incomplete report allowed.

## Steps
1. **Classify the harm** using the OECD definition (harm to persons / critical infrastructure / rights or law / property-environment) and tag the NIST AI 600-1 risk category.
2. Branch on `scenario` and raise obligations **with deadlines**:
   - **privacy** → **CERT-In 6h** report + **DPDP initial intimation + 72h detailed** report to the Board + affected Data Principals; IT Act §43A/SPDI. *Comparison:* GDPR Art. 33 (72h).
   - **fairness** → Constitution Art. 14/15 equality + **NITI RAI** (fairness-by-group, right to appeal). *Comparison:* EU AI Act Annex III (high-risk hiring), EEOC/Title VII four-fifths **+ statistical significance**.
   - **autonomy** → **IT Act §11** attribution/liability; if BFSI, **RBI FREE-AI** (7 Sutras — Trust, People First, Fairness & Equity; accountability + consumer safeguarding); **CERT-In 6h** if a system compromise; fraud reporting. *Comparison:* SOX.
3. Set a `deadline` (absolute timestamp) on each clocked obligation; the console counts it down.
4. Write `obligations[]` to the incident; append a `ledger` entry naming the obligations and deadlines raised.
