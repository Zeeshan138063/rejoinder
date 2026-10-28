// Structural checks for the Rejoinder plugin. Runs in CI on every push and pull request.
// No network, no secrets: JSON manifests, skill frontmatter, and the Reply Queue page's script.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const ok = (msg) => console.log("ok  " + msg);
const fail = (msg) => { errors.push(msg); console.log("ERR " + msg); };

function json(path) {
  try { const v = JSON.parse(readFileSync(path, "utf8")); ok(path); return v; }
  catch (e) { fail(`${path}: invalid JSON (${e.message})`); return null; }
}

const market = json(".claude-plugin/marketplace.json");
for (const p of market?.plugins ?? []) {
  const root = join(".", p.source);
  if (!existsSync(root)) { fail(`marketplace source ${p.source} does not exist`); continue; }
  const manifest = json(join(root, ".claude-plugin/plugin.json"));
  if (manifest && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(manifest.name ?? "")) fail(`plugin name "${manifest?.name}" is not kebab-case`);
  if (manifest && manifest.name !== p.name) fail(`marketplace lists "${p.name}" but plugin.json says "${manifest.name}"`);
  if (manifest && !/^\d+\.\d+\.\d+$/.test(manifest.version ?? "")) fail(`plugin version "${manifest?.version}" is not semver`);

  const skillsDir = join(root, "skills");
  for (const name of readdirSync(skillsDir)) {
    const dir = join(skillsDir, name);
    if (!statSync(dir).isDirectory()) continue;
    const file = join(dir, "SKILL.md");
    if (!existsSync(file)) { fail(`${dir} has no SKILL.md`); continue; }
    const text = readFileSync(file, "utf8");
    const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
    if (!fm) { fail(`${file}: missing YAML frontmatter`); continue; }
    const nameLine = fm[1].match(/^name:\s*(.+)$/m), descLine = fm[1].match(/^description:\s*(.+)$/m);
    if (!nameLine || nameLine[1].trim() !== name) fail(`${file}: frontmatter name must be "${name}"`);
    if (!descLine || descLine[1].trim().length < 40) fail(`${file}: description missing or too short`);
    if (text.split(/\s+/).length > 3000) fail(`${file}: over 3,000 words; move detail into references/`);
    ok(file);
  }

  const page = join(root, "assets/reply-queue.html");
  if (existsSync(page)) {
    const html = readFileSync(page, "utf8");
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    if (!scripts.length) fail(`${page}: no inline script found`);
    for (const src of scripts) { try { new Function(src); } catch (e) { fail(`${page}: script does not parse (${e.message})`); } }
    if (!/<title>[^<]{2,60}<\/title>/.test(html)) fail(`${page}: missing <title>`);
    if (/<script[^>]+src=/.test(html)) fail(`${page}: external scripts are not allowed in the Reply Queue page`);
    ok(page);
  }
}

// Never ship personal data: block obvious secrets and real-looking tokens.
const secretRe = /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][A-Za-z0-9_\-]{16,}["']|ATATT3[A-Za-z0-9_\-]{20,}|xox[bpoa]-[A-Za-z0-9-]{10,}|sk-ant-[A-Za-z0-9_\-]{10,}/i;
function walk(dir) {
  for (const n of readdirSync(dir)) {
    if ([".git", "node_modules"].includes(n)) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(md|json|html|js|mjs|ya?ml)$/.test(n) && secretRe.test(readFileSync(p, "utf8"))) fail(`${p}: looks like it contains a secret`);
  }
}
walk(".");

if (errors.length) { console.log(`\n${errors.length} problem(s) found.`); process.exit(1); }
console.log("\nAll checks passed.");
