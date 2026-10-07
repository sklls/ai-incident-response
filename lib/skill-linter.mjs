// Enforces the improved skill anatomy: a trigger-only description, then a body that
// carries real domain knowledge (with sources), a procedure, an output contract, and
// its wiring into the group. These are the parts that make a skill a self-contained tool.
export function lintSkill(text) {
  const errors = [];
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) errors.push('missing YAML frontmatter');
  else {
    if (!/\bname:\s*\S+/.test(fm[1])) errors.push('frontmatter missing name');
    const desc = fm[1].match(/\bdescription:\s*(.+)/);
    if (!desc) errors.push('frontmatter missing description');
    else if (!/use when/i.test(desc[1]))
      errors.push('description must state a trigger ("Use when …"), not summarise the workflow');
  }
  // Required body sections — knowledge, how it acts, what it produces, how it connects.
  for (const section of ['## The knowledge', '## Procedure', '## Writes', '## Connect']) {
    if (!text.includes(section)) errors.push(`missing section: ${section}`);
  }
  // Knowledge must be backed by sources.
  if (!/###?\s*Sources/i.test(text)) errors.push('the knowledge must cite sources (### Sources)');
  return { valid: errors.length === 0, errors };
}
