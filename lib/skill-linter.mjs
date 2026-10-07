export function lintSkill(text) {
  const errors = [];
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) errors.push('missing YAML frontmatter');
  else {
    if (!/\bname:\s*\S+/.test(fm[1])) errors.push('frontmatter missing name');
    if (!/\bdescription:\s*\S+/.test(fm[1])) errors.push('frontmatter missing description');
  }
  for (const section of ['## Framework enforced','## When to use','## Steps']) {
    if (!text.includes(section)) errors.push(`missing section: ${section}`);
  }
  return { valid: errors.length === 0, errors };
}
