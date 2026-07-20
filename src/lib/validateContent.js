const REQUIRED_SCALAR_FIELDS = ['id', 'track', 'category', 'color', 'icon', 'simulation'];
const REQUIRED_ARRAY_FIELDS = ['tools', 'prerequisites', 'related'];
const BILINGUAL_FIELD_PATHS = [
  ['name'],
  ['content', 'description'],
  ['content', 'concept'],
  ['content', 'methodology'],
  ['content', 'objective'],
  ['content', 'goal'],
  ['content', 'exampleImplementation'],
  ['content', 'exampleEnterprise'],
  ['content', 'prosAndCons', 'pros'],
  ['content', 'prosAndCons', 'cons'],
];

function getAtPath(obj, path) {
  return path.reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function pathLabel(path) {
  return path.join('.');
}

export function validateTerms(terms) {
  const errors = [];
  const warnings = [];
  const idSet = new Set();

  for (const term of terms) {
    if (idSet.has(term.id)) {
      errors.push(`Duplicate term id: "${term.id}"`);
    }
    idSet.add(term.id);
  }

  for (const term of terms) {
    for (const field of REQUIRED_SCALAR_FIELDS) {
      if (!term[field]) {
        errors.push(`Term "${term.id}" is missing required field: ${field}`);
      }
    }
    for (const field of REQUIRED_ARRAY_FIELDS) {
      if (!Array.isArray(term[field])) {
        errors.push(`Term "${term.id}" is missing required array field: ${field}`);
      }
    }

    for (const path of BILINGUAL_FIELD_PATHS) {
      const value = getAtPath(term, path);
      if (!value || (!value.id && !value.en)) {
        errors.push(`Term "${term.id}" is missing required field: ${pathLabel(path)}`);
        continue;
      }
      if (!value.id) {
        warnings.push(`Term "${term.id}" field "${pathLabel(path)}" is missing an "id" translation`);
      }
      if (!value.en) {
        warnings.push(`Term "${term.id}" field "${pathLabel(path)}" is missing an "en" translation`);
      }
    }
  }

  for (const term of terms) {
    for (const refField of ['prerequisites', 'related']) {
      for (const refId of term[refField] || []) {
        if (!idSet.has(refId)) {
          errors.push(
            `Term "${term.id}" has ${refField} reference to unknown term id: "${refId}"`
          );
        }
      }
    }
  }

  return { errors, warnings };
}
