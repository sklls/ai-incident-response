---
name: privacy-breach
description: Use when an AI system exposes personal or confidential data — a chatbot showing one customer another's details, a model leaking memorised training data, a retrieval system crossing tenants — and you must scope the exposure, contain it, and meet the breach clocks.
---

## Orient
Scope first — whose data, how far — because scope drives both severity and the legal clocks. Contain by shutting down; every minute is more exposure.

## The knowledge
A privacy breach is defined by **exposure**, and the first and hardest question is its extent: one person or many, and what kind of data. The DPDP Act defines a personal-data breach as any unauthorised or accidental compromise of the confidentiality, integrity, or availability of personal data, and that scope determines everything downstream. AI systems fail in specific, recognisable ways. **Cross-session / cross-tenant bleed** is the classic: a response cache or retrieval index keyed without a tenant or session identifier serves one user's data to another — the fix is a scoping key, the evidence is in the cache configuration and the retrieval logs. **Memorisation and inference** (NIST AI 600-1 "data privacy") is subtler: a model regurgitates training data verbatim, or an attacker infers membership. On the application surface this maps to **OWASP LLM02, sensitive-information disclosure**. The containment shape is **shutdown or safe-mode**, not a careful fix, because unlike a bias problem the harm compounds every minute the system stays live.

The legal engine is **India-first and clock-driven**. Reporting duties stack: **CERT-In** requires reporting the cyber incident within **6 hours**; the **DPDP Act 2023** requires an initial intimation to the Data Protection Board without delay and a **detailed report within 72 hours**, plus notice to every affected Data Principal without delay; **IT Act §43A** and the SPDI Rules impose reasonable-security obligations whose breach carries civil liability. **NITI's purpose-limitation** principle and the **Puttaswamy** privacy right frame the harm as a rights violation, not merely a security lapse. Scoping accurately matters legally too: the DPDP report must state the approximate number of Data Principals affected.

### Sources
DPDP Act 2023 + DPDP Rules 2025 (breach definition, 72-hour report, Data Principal notice); CERT-In Directions 2022 (6-hour report); IT Act §43A / SPDI Rules; NIST AI 600-1 "data privacy"; OWASP LLM02; NITI purpose-limitation; Puttaswamy (2017). Detail: `references/privacy-regime.md`.

## Reads
retrieval / cache logs; the system's data-handling config; session-correlation metrics; the report.

## Procedure
1. Classify the data types exposed and determine **1-vs-many** scope (drives severity; unknown → worst case).
2. Recommend **shutdown / safe-mode** to `incident-contain`.
3. For investigation, check cache/tenant scoping and memorisation; count affected sessions/users.
4. Raise the obligations (CERT-In 6h, DPDP 72h, §43A) with deadlines via `regulatory-map`.
5. Preventive control: a tenant-isolation test in CI + a cross-session leak canary.

## The test
Scope classification (one|some|many|all|unknown) feeds `severity-matrix`; unknown is scored as the worst case.

## Writes
the exposure scope, the data categories, the recommended containment, and the breach obligations — advising the lifecycle skills.

## Worked example
SupportBot leak → retrieval cache keyed on `hash(query)` with no tenant id → 3 customer sessions received another's account summary over 2 days → **S1**, shut down, CERT-In + DPDP clocks start.

## Failure modes
It never treats unknown scope as "probably one"; it never recommends a slow fix over a shutdown while data is still exposed.

## Done when
the scope and data categories are established, containment is a shutdown, and the breach clocks are running with correct deadlines.

## Connect
Consulted by `incident-triage`, `-contain`, `-investigate`, `-communicate`, and `regulatory-map` whenever the scenario is `privacy`.

## Resources
`references/privacy-regime.md` — DPDP breach rules & contents, CERT-In timing, §43A/SPDI, and the common AI leak vectors.
