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
