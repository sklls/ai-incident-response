---
name: regulatory-map
description: Map an incident to its regulatory obligations and notification deadlines, India-first, with EU/US as comparison.
---

## Framework enforced
India-first: **DPDP Act 2023**, **IT Act §11** (attribution → liability) and **§43A/SPDI**, **NITI "Responsible AI for All"** principles. Comparison lens: EU AI Act (hiring = high-risk, Annex III), GDPR, EEOC.

## When to use
During communicate (and as soon as severity is known for S1 breaches, to start any notification clock).

## DB interactions
Reads `incidents` (scenario, scope); writes `obligations[]` onto the incident (each with `regulation`, `requirement`, `deadline`, `status`); appends a `ledger` entry.

## Steps
1. Branch on `scenario`:
   - **privacy** → DPDP Act 2023 breach notice to the Data Protection Board + affected Data Principals; IT Act §43A/SPDI. *Comparison:* GDPR Art. 33 (72h).
   - **fairness** → Constitution Art. 14/15 equality + NITI RAI (fairness-by-group, right to appeal). *Comparison:* EU AI Act Annex III, EEOC/Title VII four-fifths.
   - **autonomy** → IT Act §11 attribution/liability; RBI/sectoral financial controls; fraud reporting. *Comparison:* SOX.
2. Set a `deadline` on each obligation where a clock applies (e.g. breach notice).
3. Write `obligations[]` to the incident; append a `ledger` entry naming the obligations raised.
