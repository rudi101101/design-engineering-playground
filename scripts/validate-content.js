import { allTerms } from '../src/content/index.js';
import { validateTerms } from '../src/lib/validateContent.js';

const { errors, warnings } = validateTerms(allTerms);

for (const warning of warnings) {
  console.warn(`⚠ ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`✖ ${error}`);
  }
  process.exit(1);
}

console.log(`✔ ${allTerms.length} term(s) validated, 0 errors, ${warnings.length} warning(s).`);
