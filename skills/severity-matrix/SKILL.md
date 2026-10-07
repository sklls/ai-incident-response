---
name: severity-matrix
description: Score incident severity S1–S4 from blast radius, data sensitivity, reversibility and whether it is ongoing, and decide escalation.
---

## Framework enforced
"**Blast radius**" (Session 4 agentic terminology); NIST AI 600-1 risk tagging; enterprise program-question "**tiers**"; manager's governance Q1 ("what happens when it fails?"). S1 aligns with **EU AI Act Art. 73** serious-incident severity (death / critical-infrastructure / widespread harm → tightest reporting band).

## When to use
During triage, and any time new information changes an incident's scope (e.g. a privacy breach's "1 vs many" resolves).

## DB interactions
Reads `incidents`; writes `severity` onto the incident; appends a `ledger` entry with the score rationale.

## Steps
1. Gather the four inputs: `blastRadius` (one|some|many|all|unknown), `dataSensitivity` (none|low|pii|sensitive_pii|financial), `reversibility` (reversible|hard|irreversible), `ongoing` (bool).
2. Run the scorer:
   `node -e "import('./lib/severity.mjs').then(m=>console.log(JSON.stringify(m.scoreSeverity({blastRadius:'unknown',dataSensitivity:'pii',reversibility:'hard',ongoing:true}))))"`
3. **Unknown scope is treated as worst-case** (fail-safe) — never default an unknown blast radius to low severity.
4. Write `severity` and `escalate` to the incident; if `escalate`, notify the named human owner immediately.
5. Append a `ledger` entry recording the score and rationale.
