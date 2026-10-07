#!/usr/bin/env node
// Builds and installs the AI incident-response library for Claude Code and/or Codex.
//   node install.mjs build                          regenerate agents/*.md and AGENTS.md from core/instructions.md
//   node install.mjs install --target claude|codex|both [--scope user|project] [--project-dir <dir>] [--dry-run]
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const START = '<!-- ai-incident-response:start -->';
const END = '<!-- ai-incident-response:end -->';

const core = () => readFileSync(join(here, 'core', 'instructions.md'), 'utf8');
const render = (root) => core().replaceAll('{{ROOT}}', root);

const CLAUDE_FM = `---
name: ai-incident-responder
description: Use when an AI system has misbehaved in production — a data leak, a biased model, or an agent acting beyond its authority — and the incident must be triaged, contained, investigated, remediated, disclosed and closed end-to-end, with every consequential step human-approved and recorded in a tamper-evident ledger.
tools: Read, Write, Edit, Glob, Grep, Bash, Skill
model: inherit
---

`;
const claudeAgent = (root) => CLAUDE_FM + render(root);
const codexBlock = (root) =>
  `${START}\n# AI Incident Response\nWhen asked to handle an AI incident (data leak, biased model, agent acting beyond authority), act as follows.\n\n${render(root)}\n${END}\n`;

function upsertBlock(file, block, dry) {
  const old = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const s = old.indexOf(START), e = old.indexOf(END);
  const next = s >= 0 && e > s
    ? old.slice(0, s) + block.trimEnd() + old.slice(e + END.length)
    : (old ? old.trimEnd() + '\n\n' : '') + block;
  if (!dry) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, next); }
}

function copyDir(src, dest, dry) {
  console.log(`  copy ${src} -> ${dest}`);
  if (!dry) cpSync(src, dest, { recursive: true });
}

function args(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') o.dry = true;
    else if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[++i];
    else o._.push(argv[i]);
  }
  return o;
}

const o = args(process.argv.slice(2));
const cmd = o._[0];

if (cmd === 'build') {
  writeFileSync(join(here, 'agents', 'ai-incident-responder.md'), claudeAgent('<library-root>'));
  writeFileSync(join(here, 'AGENTS.md'), codexBlock('.').replace(START + '\n', '').replace('\n' + END + '\n', '\n'));
  console.log('built agents/ai-incident-responder.md and AGENTS.md');
} else if (cmd === 'install') {
  const target = o.target ?? 'both';
  if (!['claude', 'codex', 'both'].includes(target)) throw new Error('--target must be claude|codex|both');
  const scope = o.scope ?? 'user';
  const projectDir = resolve(o['project-dir'] ?? process.cwd());
  const dry = !!o.dry;
  const base = scope === 'project' ? projectDir : homedir();
  // lib/ and seed/ are copied to one shared location so `lib/...` paths in skills resolve.
  const root = join(base, '.ai-incident-response');
  const skills = readdirSync(join(here, 'skills'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

  console.log(`Installing (${target}, ${scope} scope, dry-run=${dry})`);
  copyDir(join(here, 'lib'), join(root, 'lib'), dry);
  copyDir(join(here, 'seed'), join(root, 'seed'), dry);
  copyDir(join(here, 'skills'), join(root, 'skills'), dry);
  const rootFwd = root.replaceAll('\\', '/');

  if (target !== 'codex') {
    const dir = join(base, '.claude');
    for (const s of skills) copyDir(join(here, 'skills', s), join(dir, 'skills', s), dry);
    console.log(`  write ${join(dir, 'agents', 'ai-incident-responder.md')}`);
    if (!dry) { mkdirSync(join(dir, 'agents'), { recursive: true }); writeFileSync(join(dir, 'agents', 'ai-incident-responder.md'), claudeAgent(rootFwd)); }
  }
  if (target !== 'claude') {
    const dir = scope === 'project' ? join(projectDir, '.codex') : join(homedir(), '.codex');
    for (const s of skills) copyDir(join(here, 'skills', s), join(dir, 'skills', s), dry);
    const agentsFile = scope === 'project' ? join(projectDir, 'AGENTS.md') : join(dir, 'AGENTS.md');
    console.log(`  update ${agentsFile}`);
    upsertBlock(agentsFile, codexBlock(rootFwd), dry);
  }
  console.log('done');
} else {
  console.log('usage: node install.mjs build | install --target claude|codex|both [--scope user|project] [--project-dir <dir>] [--dry-run]');
  process.exit(cmd ? 1 : 0);
}
