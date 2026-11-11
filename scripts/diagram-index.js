#!/usr/bin/env node
/* Builds assets/diagrams/index.json from the catalog in diagrams.js.
 *
 * Usage:
 *   node scripts/diagram-index.js          write assets/diagrams/index.json
 *   node scripts/diagram-index.js --check  fail if the file is stale or an asset is missing
 *
 * The index is the list of deep-link slugs: <site>#diagrama/<slug>, where <slug> is the file
 * stem under assets/diagrams/. Slugs are stable; never rename an existing file.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const target = path.join(root, 'assets', 'diagrams', 'index.json');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'diagrams.js'), 'utf8'), sandbox);
const { AP_DIAGRAMS: diagrams, AP_CATEGORIES: categories } = sandbox.window;

const entries = diagrams.map((item) => ({
  slug: item.id,
  title: item.title,
  category: item.category,
  boxes: item.boxes
}));
const output = `${JSON.stringify(entries, null, 2)}\n`;

const problems = [];
const seen = new Set();
for (const item of diagrams) {
  if (seen.has(item.id)) problems.push(`duplicate slug: ${item.id}`);
  seen.add(item.id);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.id)) problems.push(`slug is not kebab-case: ${item.id}`);
  if (!categories.some((entry) => entry.id === item.category)) problems.push(`unknown category for ${item.id}: ${item.category}`);
  for (const file of [`${item.id}.svg`, `${item.id}.png`, `thumbs/${item.id}.webp`, `view/${item.id}.webp`]) {
    if (!fs.existsSync(path.join(root, 'assets', 'diagrams', file))) problems.push(`missing asset: assets/diagrams/${file}`);
  }
}

if (process.argv.includes('--check')) {
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (current !== output) problems.push('assets/diagrams/index.json is stale; run node scripts/diagram-index.js');
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
  console.log(`ok: ${entries.length} diagrams, index.json is current`);
} else {
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
  fs.writeFileSync(target, output);
  console.log(`wrote assets/diagrams/index.json (${entries.length} diagrams)`);
}
