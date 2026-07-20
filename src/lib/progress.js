const XP_PER_TERM = 10;

function storageKey(trackSlug) {
  return `dep-progress-${trackSlug}`;
}

function readRaw(trackSlug) {
  if (typeof window === "undefined") return { seen: [] };
  try {
    const raw = window.localStorage.getItem(storageKey(trackSlug));
    if (!raw) return { seen: [] };
    const parsed = JSON.parse(raw);
    return { seen: Array.isArray(parsed.seen) ? parsed.seen : [] };
  } catch {
    return { seen: [] };
  }
}

export function getTrackProgress(trackSlug) {
  const { seen } = readRaw(trackSlug);
  return { seenIds: new Set(seen), xp: seen.length * XP_PER_TERM };
}

export function markTermSeen(trackSlug, termId) {
  const { seen } = readRaw(trackSlug);
  if (seen.includes(termId)) return { seenIds: new Set(seen), xp: seen.length * XP_PER_TERM, isNew: false };
  const next = [...seen, termId];
  window.localStorage.setItem(storageKey(trackSlug), JSON.stringify({ seen: next }));
  return { seenIds: new Set(next), xp: next.length * XP_PER_TERM, isNew: true };
}

export function getCombinedXp(trackSlugs) {
  return trackSlugs.reduce((total, slug) => total + getTrackProgress(slug).xp, 0);
}
