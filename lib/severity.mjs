const RADIUS = { one:1, some:2, many:3, all:4, unknown:4 }; // unknown == worst (fail-safe)
const SENS   = { none:0, low:1, pii:2, sensitive_pii:3, financial:3 };
const REV    = { reversible:0, hard:1, irreversible:2 };

export function scoreSeverity({ blastRadius, dataSensitivity, reversibility, ongoing }) {
  const r = RADIUS[blastRadius] ?? 4;
  const s = SENS[dataSensitivity] ?? 2;
  const v = REV[reversibility] ?? 1;
  const score = r + s + v + (ongoing ? 1 : 0);        // range ~1..11
  let severity;
  if (score >= 8) severity = 'S1';
  else if (score >= 6) severity = 'S2';
  else if (score >= 4) severity = 'S3';
  else severity = 'S4';
  const escalate = severity === 'S1' || severity === 'S2';
  const parts = [`radius=${blastRadius}`, `sensitivity=${dataSensitivity}`,
    `reversibility=${reversibility}`, `ongoing=${ongoing}`, `score=${score}`];
  if (blastRadius === 'unknown') parts.push('unknown scope treated as worst-case (fail-safe)');
  return { severity, escalate, rationale: parts.join(', ') };
}
