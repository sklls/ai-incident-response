---
name: audit-ledger
description: Use when any action in an incident — by the agent or a human — must be recorded so it can be reconstructed and proven un-tampered later, so oversight is evidence rather than memory.
---

## Orient
The memory nothing can quietly edit. Every action is a block, each sealed onto the one before it, so a change to the past breaks the chain exactly where it was touched.

## The knowledge
An audit record is only worth as much as its resistance to being rewritten after the fact — a log you can quietly edit proves nothing, because the version you're shown might not be the version that was written. The ledger solves this with a **hash chain**: each entry is sealed with a cryptographic hash computed over the previous entry's hash plus the new entry's contents, `hash = sha256(prev_hash + canonical(entry))`. Because each block carries the previous block's hash, the entries form a chain; altering any past entry changes its hash, which no longer matches what the next block expects, so verification fails **at exactly the altered point**. This is tamper-*evidence*, not tamper-*proofing* — it doesn't stop an edit, it makes any edit visible, which is what an auditor actually needs. One limit to be honest about: an attacker who can rewrite the *whole* store could recompute every hash and present a clean chain. **Anchoring** the latest hash externally — publishing it periodically to a signed checkpoint or a write-once (WORM) store the attacker can't reach — closes that gap, because an external anchor can't be recomputed.

Append-only is a hard rule, not a preference: entries are never updated or deleted, because the whole value is that the history is complete and fixed. That property is what three governance requirements demand. **EY's "traceability"** quality attribute and the agentic launch-checklist's **"audit-trail reconstruction possible"** both require that the full incident can be rebuilt from the record — which is why the post-mortem reconstructs its timeline from the ledger rather than from memory. The enterprise program-questions name **"evidence"** as a first-class governance concern. And **CERT-In's 2022 Directions** impose a concrete **180-day log-retention** duty, so the record must also persist. The ledger distinguishes agent actions from human ones by actor type, so accountability — who did what, and who authorised it — is reconstructable.

### Sources
EY Agentic AI Governance ("traceability"); agentic launch-checklist #8 (audit-trail reconstruction); CERT-In Directions 2022 (180-day log retention); enterprise program-question "evidence"; SHA-256 / hash-chaining (tamper-evidence).

## Reads
the current chain head (highest `seq` and its `hash` for the incident; `GENESIS` for the first entry).

## The test
`sealEntry(prevHash, seq, entry)` seals a block; `verifyChain(entries)` from `lib/ledger.mjs` returns `{valid, brokenAtSeq}` — the first block whose hash no longer matches, i.e. the exact point of any tampering.

## Procedure
1. Find the chain head for the incident.
2. Seal the new action: `node lib/ledger-cli.mjs --prev <lastHash> --seq <n> --json '{...actor_type, actor, phase, action, rationale...}'`.
3. Write the sealed entry to the `ledger` collection (append-only — never update or delete).
4. Periodically publish the current head hash to an external anchor (signed checkpoint / WORM store) so the chain can't be silently recomputed.
5. On render, `verifyChain` reports any break; a break is a finding, never something to "repair".

## Writes
one sealed, append-only `ledger` block per action, chained to the previous.

## Worked example
Four sealed blocks (#1–#4) verify. Edit block #2's action after the fact → `verifyChain` returns `brokenAtSeq: 2` → the console badge flips to "broken at #2".

## Failure modes
It never updates or deletes an entry, never back-fills, and never "fixes" a broken chain — a break is evidence, and hiding it would defeat the purpose.

## Done when
every action in the incident is a sealed block and `verifyChain` reports the chain valid.

## Connect
Called by every skill for every action. Its sealed record is what `incident-postmortem` reconstructs and what the console verifies live. Backed by the tested `lib/ledger.mjs` + `lib/ledger-cli.mjs`.
