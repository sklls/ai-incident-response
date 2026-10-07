export function adverseImpact(groups) {
  const rates = {};
  for (const g of groups) rates[g.name] = g.total > 0 ? g.selected / g.total : null;
  const defined = Object.values(rates).filter(v => v !== null);
  let ratio = null, pass = false, note = '';
  if (defined.length < 2) {
    note = 'insufficient groups (single group) — cannot compute four-fifths';
  } else {
    const max = Math.max(...defined);
    const min = Math.min(...defined);
    if (max > 0) {
      ratio = min / max;
      pass = ratio >= 0.8;
      note = pass ? 'passes four-fifths' : 'FAILS four-fifths (disparate impact)';
    } else {
      note = 'no positive selection rate';
    }
  }
  return { rates, ratio, pass, note };
}

// Two-proportion z-test between the lowest-rate and highest-rate groups.
// EEOC (2023): four-fifths is a rule of thumb; a statistically significant gap
// can be unlawful even when four-fifths passes — so we test significance too.
export function significanceTest(groups, alpha = 0.05) {
  const zCrit = 1.96; // two-sided, alpha = 0.05
  const valid = (groups || []).filter(g => g.total > 0)
    .map(g => ({ name: g.name, p: g.selected / g.total, n: g.total, x: g.selected }));
  if (valid.length < 2) {
    return { z: null, significant: false, note: 'insufficient groups for a significance test' };
  }
  valid.sort((a, b) => a.p - b.p);
  const lo = valid[0], hi = valid[valid.length - 1];
  const pPool = (lo.x + hi.x) / (lo.n + hi.n);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / lo.n + 1 / hi.n));
  if (se === 0) return { z: 0, significant: false, note: 'no variance to test' };
  const z = (hi.p - lo.p) / se;
  const significant = Math.abs(z) > zCrit;
  return {
    z, significant,
    note: significant
      ? `statistically significant gap between ${lo.name} and ${hi.name} (|z|=${Math.abs(z).toFixed(2)} > ${zCrit})`
      : `gap not statistically significant (|z|=${Math.abs(z).toFixed(2)})`,
  };
}

// Combined EEOC-aware verdict: a tool is "clear" only if it BOTH passes four-fifths
// AND shows no statistically significant disparity.
export function disparateImpactAssessment(groups) {
  const ai = adverseImpact(groups);
  const sig = significanceTest(groups);
  const clear = ai.pass === true && sig.significant === false;
  let note;
  if (clear) note = 'clear: passes four-fifths and no statistically significant gap';
  else if (ai.pass && sig.significant)
    note = 'CAUTION: passes four-fifths but the gap is statistically significant — may still be unlawful (EEOC)';
  else note = ai.note;
  return { fourFifthsPass: ai.pass, ratio: ai.ratio, z: sig.z, significant: sig.significant, clear, note };
}
