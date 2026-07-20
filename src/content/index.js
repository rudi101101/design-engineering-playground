import { dataEngineeringTerms } from "./data-engineering/index.js";

export const tracks = {
  "data-engineering": {
    slug: "data-engineering",
    name: { id: "Data Engineering", en: "Data Engineering" },
    icon: "M12 3L2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5",
    terms: dataEngineeringTerms,
  },
};

export const trackList = Object.values(tracks);

const globalRegistry = new Map();
for (const track of trackList) {
  for (const term of track.terms) {
    globalRegistry.set(term.id, term);
  }
}

export function getTermById(id) {
  return globalRegistry.get(id);
}

export function getTrack(trackSlug) {
  return tracks[trackSlug];
}

export function getTermsByCategory(trackSlug) {
  const track = tracks[trackSlug];
  if (!track) return [];
  const byCategory = new Map();
  for (const term of track.terms) {
    if (!byCategory.has(term.category)) byCategory.set(term.category, []);
    byCategory.get(term.category).push(term);
  }
  return [...byCategory.entries()].map(([category, terms]) => ({ category, terms }));
}

export { globalRegistry };
