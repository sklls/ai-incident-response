# Notification regime & templates — reference (incident-communicate)

## Order of operations (tightest clock first)
CERT-In 6h → DPDP initial intimation (without delay) → DPDP 72h detailed → Data Principal notices. Never work a longer clock before a shorter one. Full clock tables: see `regulatory-map/references/notification-regime.md`.

## Audiences
| Audience | When | Tone & content |
|---|---|---|
| Internal leadership / owner | immediately on S1/S2 | facts, severity, blast radius, next gate |
| Affected customers / Data Principals | without delay | what happened, what data, what to do, how to get help |
| Regulator (CERT-In / DPB / EU authority) | by the clock | the required statutory contents |

## Template — CERT-In initial report (6h)
```
Incident: <one line>  ·  Noticed at: <ts>  ·  System: <name>
Type: data breach / unauthorised access / system compromise
Scope so far: <known / unknown>
Immediate action: <containment taken>
Point of contact: <name, role>
(Initial report; detailed findings to follow.)
```

## Template — DPDP breach notice (initial, then 72h detailed)
```
Nature of breach: <...>
Data categories affected: <...>
Approximate number of Data Principals: <...>
Likely consequences: <...>
Measures taken / proposed: <...>
```

## Template — affected-person notice (NITI transparency)
```
What happened: <plain language>
What data of yours was involved: <...>
What we've done: <containment + fix>
What you can do: <steps>  ·  How to reach us / appeal: <...>
```

Every external message is **drafted but held** until `approval-gate` returns an approved record. Log recipient, obligation, and whether the report was initial or detailed.
