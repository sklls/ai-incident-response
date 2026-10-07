# lib — decision logic behind the skills

Plain ES modules, no dependencies. Skills reference these so the rules are tested code, not prose. Run all tests from the repo root with `npm test`.

| Module | Backs skill | Purpose |
|---|---|---|
| `severity.mjs` | `severity-matrix` | `scoreSeverity({blastRadius, dataSensitivity, reversibility, ongoing})` → S1–S4; missing inputs fail safe to worst case |
| `approval.mjs` | `approval-gate` | `decideGate({incidentId, phase, action}, approvals)` → `proceed` only when a matching `approved` record exists; `pending` always holds |
| `fairness.mjs` | `fairness-bias` | `adverseImpact` (four-fifths), `significanceTest`, `disparateImpactAssessment` |
| `ledger.mjs`, `sha256.mjs` | `audit-ledger` | `sealEntry`, chain verification, tamper detection at the right block |
| `ledger-cli.mjs` | `audit-ledger` | CLI to seal an entry: `node lib/ledger-cli.mjs --prev GENESIS --seq 1 --json '{"actor":"agent:Commander","action":"..."}'` |
| `schema.mjs` | all | Shape of the four collections: `incidents`, `evidence`, `approvals`, `ledger` |
| `seed.mjs` | demo | Loads `../seed/*.json` |
| `skill-linter.mjs`, `lint-all.mjs` | all skills | Enforces SKILL.md anatomy |

Each module has a sibling `*.test.mjs` (`node --test`).
