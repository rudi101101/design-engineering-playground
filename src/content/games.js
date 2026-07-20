const gameModules = import.meta.glob("./data-engineering/*.game.jsx", { eager: true });

const gamesBySlug = {};
for (const path in gameModules) {
  const match = path.match(/([a-z0-9-]+)\.game\.jsx$/);
  if (match) gamesBySlug[match[1]] = gameModules[path].default;
}

export function getGameComponent(termId) {
  return gamesBySlug[termId];
}
