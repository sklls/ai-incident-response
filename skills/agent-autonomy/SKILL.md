---
name: agent-autonomy
description: Specialist for autonomous-agent incidents — separate injection vs misconfig vs defect, contain by revoking authority, and enforce a deterministic guardrail.
---

## Framework enforced
**EY 6 guardrails**; OpenAI System Card §3 (prompt injection + agent errors); Anthropic **harmful compliance vs agentic misalignment**; OWASP **LLM01/LLM06**; **MITRE ATLAS** + NIST adversarial-ML classes (evasion/poisoning/privacy/abuse) for attack attribution; **IT Act §11** (attribution/liability); **RBI FREE-AI Framework 2025** (when BFSI).

## When to use
When an AI agent takes unauthorized or harmful actions through its tools (e.g. a finance agent paying beyond its limit).

## DB interactions
Advises triage/contain/investigate/remediate/regulatory-map; reads `evidence` (tool-call logs, agent config, the triggering input).

## Steps
1. **Detect:** separate the three causes — **misconfiguration** vs **manipulated instructions (prompt injection)** vs **software defect**. Distinguish harmful compliance (user-requested) from agentic misalignment (agent's own goal).
2. **Contain (shape = revoke authority):** revoke the agent's tool credentials / freeze outbound actions immediately.
3. **Investigate:** inspect tool-call logs + the triggering input; look for **indirect prompt injection** in free-text fields (map to **MITRE ATLAS** techniques + the NIST **abuse** class) and for a limit that existed **only as an instruction**, never enforced outside the model.
4. **Remediate:** add a **deterministic guardrail outside the model** (e.g. hard spend limit), sanitize tool inputs, apply least-privilege tool scope.
5. **Obligations:** **IT Act §11** attribution → assign liability; if BFSI, apply **RBI FREE-AI** (accountability + consumer safeguarding) and report per CERT-In 6h if a system compromise; financial-control/fraud reporting.
6. **Preventive control:** money-moving actions require hard limits + human approval above threshold; sanitize all tool inputs.
