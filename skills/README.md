# Skills

Fourteen skills in three tiers. Each directory holds one self-contained `SKILL.md` (frontmatter `name` + `description`, then Orient, The knowledge, Reads, Procedure, The test, Writes, Worked example, Failure modes, Done when, Connect).

## Tier 1 — Lifecycle (run in this order)

| Skill | Use it to |
|---|---|
| `incident-commander` | Own the whole incident; sequence the other skills; entry point |
| `incident-triage` | Classify the failure type, score severity, assign an owner |
| `incident-contain` | Halt the harm before the cause is known — human-approved |
| `incident-investigate` | Find the real root cause from evidence, auditor-grade |
| `incident-remediate` | Deploy a durable fix under approval and prove it holds |
| `incident-communicate` | Draft regulator/customer/leadership notices; meet legal clocks |
| `incident-postmortem` | Blameless review → preventive controls → close the case |

## Tier 2 — Failure-type specialists

| Skill | Failure type |
|---|---|
| `privacy-breach` | Personal or confidential data exposed (cross-tenant cache, memorised data) |
| `fairness-bias` | Unequal outcomes across groups (four-fifths rule, significance test) |
| `agent-autonomy` | Agent acts beyond authority; prompt injection; missing hard limits |

## Tier 3 — Primitives

| Skill | Provides |
|---|---|
| `severity-matrix` | S1–S4 from blast radius, data sensitivity, reversibility, liveness (unknown → worst case) |
| `approval-gate` | `decideGate`: proceed only on an `approved` record |
| `audit-ledger` | Append-only SHA-256 hash chain; tamper detection |
| `regulatory-map` | Obligations, recipients and deadlines, India-first |

## Flow

```
report → incident-commander
           ├─ incident-triage   (severity-matrix + failure tag)
           ├─ incident-contain  (approval-gate)  ← specialist: privacy-breach | fairness-bias | agent-autonomy
           ├─ incident-investigate
           ├─ incident-remediate (approval-gate)
           ├─ incident-communicate (regulatory-map, approval-gate per send)
           └─ incident-postmortem → closed
         every step → audit-ledger
```

## Authoring and checks

`node lib/lint-all.mjs` validates all skills against the anatomy above. Evaluation results are in `../EVAL-REPORT.md`.
