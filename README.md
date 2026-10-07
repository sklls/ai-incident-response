# AI Incident Response Agent

A skill library and agent that works in **both Claude Code and Codex** (packaged as a Claude plugin and an `AGENTS.md` + skills install) that runs the full response to an AI incident — a data leak, a biased model, or an agent acting beyond its authority — through one disciplined lifecycle, with a human-approval gate on every consequential step and a tamper-evident audit ledger of every decision.

> **Governing rule: no record, no action.** The agent proceeds only when an `approved` record exists. A verbal "go ahead" is not approval.

## What's in the package

```
ai-incident-response/
├── .claude-plugin/
│   ├── plugin.json            plugin manifest
│   └── marketplace.json       local marketplace entry (for /plugin install)
├── core/instructions.md       single source of truth for the agent's instructions
├── agents/ai-incident-responder.md   Claude Code agent (generated from core/)
├── AGENTS.md                  Codex / generic-agent entry (generated from core/)
├── install.mjs                builds and installs for Claude, Codex, or both
├── skills/                    14 skills — see skills/README.md
├── lib/                       tested decision logic (severity, gate, fairness, ledger) — see lib/README.md
├── seed/                      3 demo incidents + evidence packs
├── DEMO.md                    3-minute run script (INC-025)
├── EVAL-REPORT.md / EVAL-DETAIL.md     per-skill evaluation (with-skill vs baseline)
└── AUDIT-REPORT.md / AUDIT-DETAIL.md   whole-agent cross-model audit (Opus/Sonnet/Haiku)
```

## The agent

`ai-incident-responder` owns an incident from report to closed case:

1. **Triage** — classify the failure, grade severity S1–S4, assign an owner
2. **Contain** — stop the harm *(human approval required)*
3. **Investigate** — find the real root cause from logs, config, data
4. **Remediate** — durable fix, validated before service returns *(approval required)*
5. **Communicate** — regulator / customer / leadership notices on legal clocks *(approval per send)*
6. **Post-mortem** — blameless review, preventive controls, close the case

Every step appends a SHA-256 hash-chained ledger entry naming the actor and rationale.

## The skills

| Tier | Skills |
|---|---|
| 1 — Lifecycle | `incident-commander`, `incident-triage`, `incident-contain`, `incident-investigate`, `incident-remediate`, `incident-communicate`, `incident-postmortem` |
| 2 — Specialists | `privacy-breach`, `fairness-bias`, `agent-autonomy` |
| 3 — Primitives | `severity-matrix`, `approval-gate`, `audit-ledger`, `regulatory-map` |

Each `SKILL.md` is self-contained (domain knowledge inlined, no external references).

## Install and use

One command installs for either tool (Node 18+, no dependencies):

```
node install.mjs install --target claude          # ~/.claude/skills + ~/.claude/agents
node install.mjs install --target codex           # ~/.codex/skills + block in ~/.codex/AGENTS.md
node install.mjs install --target both --scope project --project-dir <your-repo>   # per-project
node install.mjs install --target both --dry-run  # preview
```

The installer also copies `skills/`, `lib/` and `seed/` to `~/.ai-incident-response/` (or `<project>/.ai-incident-response/`) and writes that absolute path into the agent instructions, so the `lib/...` paths the skills mention resolve. Re-running is safe: the Codex `AGENTS.md` block is replaced between markers, never duplicated.

**Claude Code plugin alternative:** `/plugin marketplace add ./` then `/plugin install ai-incident-response@ai-incident-response`.

**Use it**

- Claude Code: "Use the ai-incident-responder agent: our chatbot is showing one customer another's data."
- Codex: "Handle this AI incident: …" — the `AGENTS.md` block makes it act as the commander and load `incident-commander` first.

**How it's portable:** every `SKILL.md` is plain markdown with `name`/`description` frontmatter, which both tools read. The instructions live once in `core/instructions.md`; after editing it run `node install.mjs build` to regenerate the Claude agent file and `AGENTS.md`. Where a tool has no skill mechanism, the instructions tell the agent to read `skills/<name>/SKILL.md` directly.

> Codex's skill-folder location and skill support vary by version. The `AGENTS.md` block works regardless, because it points at the skill files by path. Confirm the folder against your Codex version's docs.

## Verify

Requires Node 18+. No dependencies.

```
npm test                    # 48 unit tests: severity, gate, fairness, ledger, schema, seed, linter
node lib/lint-all.mjs       # lint all 14 skills
```

## Evidence it works

- **Per-skill eval** (`EVAL-REPORT.md`): with-skill passes 55/55 assertions on Opus, Sonnet and Haiku; baseline without skills scores 87% / 84% / 72%.
- **Whole-agent audit** (`AUDIT-REPORT.md`): 18 end-to-end runs across the three models.
- **Unit tests:** 48/48 passing.

## Regulatory coverage

India-first: CERT-In (6-hour reporting), DPDP Act breach notice, IT Act §11 liability, plus NITI guidance. Anchored to NIST SP 800-61r3, NIST AI RMF 1.0 (GOVERN/MANAGE), and ISO/IEC 42001 Annex A.10. This is decision support, not legal advice — have counsel confirm obligations before filing.

## Limits

- The agent never self-approves; a human must answer each gate.
- The demo console (a hosted artifact) is not included in this package; `DEMO.md` describes it and `seed/` holds the data.
- Seed incidents are fictional.

## License

MIT — see `LICENSE`.
