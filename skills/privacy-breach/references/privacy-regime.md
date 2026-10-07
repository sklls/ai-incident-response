# Privacy regime & leak vectors — reference (privacy-breach)

## Scope first (drives severity + clocks)
- **How many?** one session / some / many / all / **unknown** (unknown → worst case).
- **What data?** none / low / PII / sensitive PII / financial.
- DPDP requires the **approximate number of Data Principals** in the report, so counting is a legal step, not just a technical one.

## Common AI leak vectors (what to look for)
| Vector | Mechanism | Evidence | Fix |
|---|---|---|---|
| Cross-session / cross-tenant bleed | cache or retrieval keyed without a tenant/session id | cache config, retrieval logs | scoped key + purge cache |
| Training-data memorisation | model regurgitates memorised records | prompts that elicit verbatim data | dedup/DP training, output filter |
| Membership inference | attacker infers who was in training | repeated probing | DP, query limits |
| Over-broad retrieval | RAG returns another user's docs | retrieval index scope | per-user access filter |
Maps to **OWASP LLM02** (sensitive-information disclosure) and NIST AI 600-1 "data privacy".

## India legal duties
| Instrument | Duty |
|---|---|
| CERT-In Directions 2022 | report the cyber incident within **6 hours** |
| DPDP Act 2023 | initial intimation (without delay) + **72h** detailed report to the Board; notify each affected Data Principal |
| IT Act §43A + SPDI Rules | reasonable security practices; civil liability for negligence with sensitive personal data |
| NITI RAI | purpose-limitation — use data only for its original purpose |
| Puttaswamy (2017) | privacy is a fundamental right → breach is a rights harm |

## Containment & prevention
- Containment: **shut down / safe-mode** — harm compounds every minute live.
- Preventive controls: tenant-isolation test in CI; cross-session leak canary; retention SOP.
