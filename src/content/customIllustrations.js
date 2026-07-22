const illustrationModules = import.meta.glob("./data-engineering/*.illustration.jsx", { eager: true });

const illustrationsBySlug = {};
for (const path in illustrationModules) {
  const match = path.match(/([a-z0-9-]+)\.illustration\.jsx$/);
  if (match) illustrationsBySlug[match[1]] = illustrationModules[path].default;
}

export function getCustomIllustration(termId) {
  return illustrationsBySlug[termId];
}
