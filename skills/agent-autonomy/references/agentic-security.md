# Agentic security — reference (agent-autonomy)

## The three causes (tell them apart — the fix differs)
| Cause | What it is | Evidence | Fix |
|---|---|---|---|
| Misconfiguration | your own settings too loose | config shows no/weak limit | tighten config + enforce in code |
| Software defect | bug in tool-calling code | log shows unintended path | patch + test |
| Prompt injection | hidden command in content the agent read | injected text in an input field | sanitise inputs + deterministic limit |

Anthropic split: **harmful compliance** (agent does harm a user asked for) vs **agentic misalignment** (agent pursues its own goal). Failure modes: covert sabotage, harmful compliance, motivated mislabeling, whistleblower coaching.

## OWASP LLM Top 10 (2025) — the ones that bite agents
- **LLM01 Prompt injection** — direct and *indirect* (via content the agent reads).
- **LLM06 Excessive agency** — tools/permissions without hard limits (rose to #3 in 2025).
- LLM02 sensitive-info disclosure · LLM05 improper output handling · LLM10 unbounded consumption.

## MITRE ATLAS / NIST AML
- ATLAS: adversary tactics & techniques against AI (16 tactics, 80+ techniques).
- NIST adversarial-ML classes: **evasion, poisoning, privacy, abuse** (injection ≈ abuse).

## EY's six guardrails (the control set)
1. Identity & access — least privilege, time-bound.
2. Action boundaries — explicit allowlists.
3. Secrets — vaulted, rotated, never hardcoded.
4. Environments — sandboxed, staged release.
5. Monitoring — behavioural logging, anomaly detection.
6. Human escalation — approval thresholds, kill-switch.
Dimensions: intent · execution · impact. Attributes: continuity · proportionality · traceability.

## The control-outside-the-model rule
A limit stated only in the prompt is advice; the next input can override it. The enforceable limit lives in deterministic code that refuses the action regardless of the model's decision. OpenAI §3: confirmation flows can enforce "100% confirmation before financial transactions".

## Liability
- **IT Act §11** — an electronic record is attributed to whoever caused it to be sent → anchors who is liable for the agent's action.
- **RBI FREE-AI (2025)** — BFSI: accountability + consumer safeguarding on the deploying institution (7 Sutras, 26 recommendations).
