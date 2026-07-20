import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.join(__dirname, "..", "src", "content");

const REQUIRED_CONTENT_FIELDS = ["description", "concept", "methodology", "objective", "goal", "exampleImplementation", "exampleEnterprise"];
const BANNED_NAMES = ["Astra", "AHM", "ACC"];

async function loadTrack(trackSlug) {
  const dir = path.join(contentRoot, trackSlug);
  const files = readdirSync(dir).filter((f) => f.endsWith(".js") && f !== "index.js");
  const terms = [];
  for (const file of files) {
    const mod = await import(path.join(dir, file));
    terms.push({ file, term: mod.term });
  }
  return terms;
}

function isBilingual(field, path, warnings) {
  if (!field || typeof field.id !== "string") return false;
  if (field.id.trim().length === 0) return false;
  if ((!field.en || field.en.trim().length === 0)) {
    warnings.push(`  [warn] ${path}: missing EN translation (falls back to ID)`);
  }
  return true;
}

async function main() {
  const errors = [];
  const warnings = [];
  const terms = await loadTrack("data-engineering");

  const idsSeen = new Map();
  for (const { file, term } of terms) {
    const expectedId = file.replace(/\.js$/, "");
    if (term.id !== expectedId) {
      errors.push(`${file}: id "${term.id}" does not match filename slug "${expectedId}"`);
    }
    if (idsSeen.has(term.id)) {
      errors.push(`${file}: duplicate id "${term.id}" (also in ${idsSeen.get(term.id)})`);
    }
    idsSeen.set(term.id, file);

    for (const key of ["id", "track", "category", "color", "icon", "simulation", "name"]) {
      if (!term[key]) errors.push(`${file}: missing required field "${key}"`);
    }
    if (!Array.isArray(term.tools)) errors.push(`${file}: "tools" must be an array`);
    if (!Array.isArray(term.prerequisites)) errors.push(`${file}: "prerequisites" must be an array`);
    if (!Array.isArray(term.related)) errors.push(`${file}: "related" must be an array`);

    if (!term.name || !term.name.id) errors.push(`${file}: name.id is required`);

    for (const field of REQUIRED_CONTENT_FIELDS) {
      const value = term.content?.[field];
      if (!isBilingual(value, `${file}: content.${field}`, warnings)) {
        errors.push(`${file}: content.${field} is missing or empty for both languages`);
      }
    }
    const pc = term.content?.prosAndCons;
    if (!pc || !isBilingual(pc.pros, `${file}: content.prosAndCons.pros`, warnings) || !isBilingual(pc.cons, `${file}: content.prosAndCons.cons`, warnings)) {
      errors.push(`${file}: content.prosAndCons.pros/cons is missing or empty for both languages`);
    }

    const allText = JSON.stringify(term);
    for (const banned of BANNED_NAMES) {
      const re = new RegExp(`\\b${banned}\\b`);
      if (re.test(allText)) {
        errors.push(`${file}: contains banned real company name "${banned}"`);
      }
    }
  }

  const validIds = new Set(idsSeen.keys());
  for (const { file, term } of terms) {
    for (const ref of [...(term.prerequisites || []), ...(term.related || [])]) {
      if (!validIds.has(ref)) {
        errors.push(`${file}: references unknown term id "${ref}" in prerequisites/related`);
      }
    }
  }

  console.log(`Validated ${terms.length} terms in track "data-engineering".`);
  if (warnings.length) {
    console.log(`\n${warnings.length} translation warning(s):`);
    warnings.slice(0, 20).forEach((w) => console.log(w));
    if (warnings.length > 20) console.log(`  ...and ${warnings.length - 20} more`);
  }
  if (errors.length) {
    console.error(`\n${errors.length} ERROR(S):`);
    errors.forEach((e) => console.error(`  [error] ${e}`));
    process.exit(1);
  }
  console.log("\nNo structural errors. Content is valid.");
}

main();
