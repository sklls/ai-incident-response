---
name: privacy-breach
description: Specialist for data-exposure incidents — scope the exposure, contain by shutting down, and map DPDP obligations.
---

## Framework enforced
NIST AI 600-1 "data privacy"; OWASP **LLM02** (sensitive-information disclosure); **DPDP Act 2023** + **IT Act §43A/SPDI**; **CERT-In Directions 2022** (6-hour cyber-incident report); NITI purpose-limitation.

## When to use
When an AI system exposes personal or confidential data (e.g. a chatbot showing another customer's details).

## DB interactions
Advises `incident-triage`/`incident-contain`/`incident-investigate`/`regulatory-map`; reads `evidence` (cache/retrieval logs, config).

## Steps
1. **Detect/scope:** classify the data types exposed; determine **1 conversation or many?** (drives severity — unknown → worst-case).
2. **Contain (shape = shut down):** disable the system or drop it to safe-mode; blast radius = all users.
3. **Investigate:** look for a response cache/retrieval keyed **without tenant/session scoping** → cross-session bleed; count affected sessions.
4. **Remediate:** scoped cache key + purge cache; re-enable.
5. **Obligations (tightest clock first):** **CERT-In report within 6 HOURS** of noticing; **DPDP initial intimation without delay + 72h detailed report** to the Board, and notify affected Data Principals without delay; IT Act §43A.
6. **Preventive control:** tenant-isolation test in CI + cross-session leak canary.
