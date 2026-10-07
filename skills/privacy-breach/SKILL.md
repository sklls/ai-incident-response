---
name: privacy-breach
description: Use when an AI system exposes personal or confidential data — a chatbot showing one customer another's details, a model leaking memorised training data, a retrieval system crossing tenants — and you must scope the exposure, contain it, and meet the breach clocks.
---

## Orient
Scope first — whose data, how far — because scope drives both severity and the legal clocks. Contain by shutting down; every minute is more exposure.

## The knowledge
A privacy breach is defined by **exposure**, and the first and hardest question is its extent: one person or many, and what kind of data. The DPDP Act defines a personal-data breach as any unauthorised or accidental compromise of the confidentiality, integrity, or availability of personal data. Scope is both technical and legal — the DPDP report must state the **approximate number of Data Principals affected**, so counting is a compliance step. Grade it: how many (one / some / many / all / **unknown** → worst case) and how sensitive (none / low / PII / sensitive PII / financial).

**Common AI leak vectors (what to look for):**
| Vector | Mechanism | Evidence | Fix |
|---|---|---|---|
| Cross-session / cross-tenant bleed | cache or retrieval keyed without a tenant/session id | cache config, retrieval logs | scoped key + purge cache |
| Training-data memorisation | model regurgitates memorised records | prompts eliciting verbatim data | dedup / DP training, output filter |
| Membership inference | attacker infers who was in training | repeated probing | DP, query limits |
| Over-broad retrieval | RAG returns another user's docs | retrieval index scope | per-user access filter |

These map to **OWASP LLM02** (sensitive-information disclosure) and **NIST AI 600-1 "data privacy"** (memorisation, inference). The containment shape is **shutdown or safe-mode**, not a careful fix, because unlike a bias problem the harm compounds every minute the system stays live.

**India legal duties (clock-driven):**
| Instrument | Duty |
|---|---|
| CERT-In Directions 2022 (IT Act §70B) | report the cyber incident within **6 hours** |
| DPDP Act 2023 | initial intimation (without delay) + **72h** detailed report to the Board; notify each affected Data Principal |
| IT Act §43A + SPDI Rules | reasonable security; civil liability for negligence with sensitive personal data |
| NITI RAI | purpose-limitation — use data only for its original purpose |
| Puttaswamy (2017) | privacy is a fundamental right → a breach is a rights harm |

### Sources
DPDP Act 2023 + Rules 2025; CERT-In Directions 2022; IT Act §43A / SPDI Rules; NIST AI 600-1 "data privacy"; OWASP LLM02; NITI purpose-limitation; Puttaswamy (2017).

## Reads
retrieval / cache logs; the system's data-handling config; session-correlation metrics; the report.

## Procedure
1. Classify the data types exposed and determine **1-vs-many** scope (drives severity; unknown → worst case).
2. Recommend **shutdown / safe-mode** to `incident-contain`.
3. For investigation, check cache/tenant scoping and memorisation; count affected sessions/users.
4. Raise the obligations (CERT-In 6h, DPDP 72h, §43A) with deadlines via `regulatory-map`.
5. Preventive control: a tenant-isolation test in CI + a cross-session leak canary + a retention SOP.

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
