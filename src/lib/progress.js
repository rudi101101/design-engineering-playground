const STORAGE_PREFIX = 'progress:';
const XP_PER_TERM = 10;

export function getTrackProgress(trackId) {
  const raw = localStorage.getItem(STORAGE_PREFIX + trackId);
  if (!raw) return { seen: [], xp: 0 };
  return JSON.parse(raw);
}

export function markTermSeen(trackId, termId) {
  const progress = getTrackProgress(trackId);
  if (progress.seen.includes(termId)) return progress;
  const updated = {
    seen: [...progress.seen, termId],
    xp: progress.xp + XP_PER_TERM,
  };
  localStorage.setItem(STORAGE_PREFIX + trackId, JSON.stringify(updated));
  return updated;
}

export function getTotalXp(trackIds) {
  return trackIds.reduce((sum, id) => sum + getTrackProgress(id).xp, 0);
}
