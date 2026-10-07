---
name: audit-ledger
description: Append every agent and human action to a tamper-evident, append-only ledger so the whole incident can be reconstructed.
---

## Framework enforced
EY "**traceability**" quality attribute; agentic launch-checklist #8 (**audit-trail reconstruction possible**); **ISO/IEC 42001 A.10** (records maintained per incident, detection→closure); **CERT-In 2022** log-retention duty (**180 days**); enterprise program-question "**evidence**".

## When to use
On every action by anyone, at every phase — intake, scoring, approval request, human decision, containment, remediation, communication, closure.

## DB interactions
Appends to `ledger` only. Entries are **never updated or deleted**. Each entry is chained: `hash = sha256(prev_hash + canonical(entry))`.

## Steps
1. Find the current chain head (highest `seq` in `ledger` for the incident, and its `hash`; use `GENESIS` for the first entry).
2. Seal the new entry:
   `node lib/ledger-cli.mjs --prev <lastHash> --seq <n> --json '{"incident_id":"INC-025","ts":"...","actor_type":"agent","actor":"Commander","phase":"contain","action":"freeze payments","rationale":"..."}'`
3. Write the sealed entry to the `ledger` collection via `ArtifactData`.
4. The console verifies the chain on render (`verifyChain`) and shows ⛓ verified / BROKEN — do not attempt to "repair" a broken chain; a break is a finding.
