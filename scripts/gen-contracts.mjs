// Mirror every src/pages/**/*.contract.ts (its exported CONTRACT template
// literal) to contracts/<pov>/<page>.md so the spec is readable outside
// Storybook. Single source of truth stays in the .contract.ts.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = join(root, 'projects/cadence-ui/src/pages');
const outDir = join(root, 'contracts');

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith('.contract.ts')) out.push(p);
  }
  return out;
}

const files = walk(pagesDir);
let n = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const m = src.match(/export const CONTRACT\s*=\s*`([\s\S]*?)`;\s*$/m);
  if (!m) { console.warn('  ! no CONTRACT in', relative(root, f)); continue; }
  const md = m[1].replace(/\\`/g, '`').replace(/\\\$/g, '$').trim() + '\n';
  const pov = basename(dirname(f));               // staff | agent | client
  const name = basename(f).replace('.contract.ts', '.md');
  const dest = join(outDir, pov, name);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, md);
  console.log('  ✓', relative(root, dest));
  n++;
}
console.log(`Generated ${n} contract doc(s).`);
