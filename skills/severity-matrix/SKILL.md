---
name: severity-matrix
description: Use whenever an AI incident needs a severity grade — at triage, and again whenever the facts change — to turn blast radius, data sensitivity, reversibility and whether it's still live into an S1–S4 tier that sets the response urgency.
---

## Orient
One grade, read by everyone, before anyone argues about the response. Four readings in, S1–S4 out; unknown spread rounds up to the worst case.

## The knowledge
Severity is the shared unit of urgency, and its value is coordination: a single grade that triage, containment, communication and leadership all read the same way. It is deliberately simple so it can't be gamed in the heat of an incident. The method weighs four readings. **Blast radius** — how far the harm reached — is the dominant term and the one most often unknown; the agentic literature uses "blast radius" precisely because an agent's reach, not its intent, determines the damage. **Data sensitivity** escalates financial and special-category personal data. **Reversibility** separates a mistake you can undo from one you can't. And whether the harm is **still live** adds urgency because an ongoing incident is still accumulating damage.

The one firm habit is the **fail-safe default**: when blast radius is unknown, score it as the worst case, never the best. Under-triage is the dangerous error — a real emergency filed as routine loses the containment window and the notification clock. The tiers also carry downstream meaning: S1 and S2 **auto-escalate** to a named owner at once, and the top band lines up with the **EU AI Act Art. 73** notion of a serious incident (death, critical-infrastructure disruption, or widespread harm), which is what triggers the tightest reporting deadlines. Severity is re-run, not set once — as scope resolves from "unknown" to "three sessions" or "ten thousand", the grade and the obligations move with it.

### Sources
"Blast radius" (agentic terminology, Session 4); NIST AI 600-1 risk tagging; EU AI Act Art. 73 serious-incident bands; enterprise program-question "tiers"; manager's governance Q1 ("what happens when it fails?").

## Reads
the four inputs from triage/specialist: `blastRadius`, `dataSensitivity`, `reversibility`, `ongoing`.

## The test
`scoreSeverity({blastRadius, dataSensitivity, reversibility, ongoing})` from `lib/severity.mjs` → `{severity, escalate, rationale}`. Scoring: spread 1–4 (unknown = 4), data 0–3, reversibility 0–2, +1 if ongoing; total → S1 ≥8 · S2 ≥6 · S3 ≥4 · S4. S1/S2 escalate.

## Procedure
1. Gather the four readings; mark any as unknown.
2. Run `scoreSeverity`; unknown spread is scored as `all` (fail-safe).
3. Write `severity` and `escalate`; if escalating, notify the named owner at once.
4. Re-run whenever the facts change; log each change.

## Writes
`severity` (S1–S4) and the escalation flag onto the `incidents` record, with a `ledger` entry recording the score and rationale.

## Worked example
Finance agent: spread = all payments, data = financial, reversibility = irreversible, still live = yes → score 10 → **S1, escalate**. If spread were "unknown" with the rest the same → still S1.

## Failure modes
It never defaults unknown scope to low; it never leaves an S1/S2 un-escalated.

## Done when
the incident carries a defensible severity and, if S1/S2, the owner has been notified.

## Connect
Called by `incident-triage` and by any skill whose findings change the facts. Its grade sets urgency for the whole lifecycle and the band for `regulatory-map`. Backed by the tested `lib/severity.mjs`.
