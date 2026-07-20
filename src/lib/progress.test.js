import { describe, it, expect, beforeEach } from 'vitest';
import { getTrackProgress, markTermSeen, getTotalXp } from './progress';

describe('progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty progress for a track with no history', () => {
    expect(getTrackProgress('data-engineering')).toEqual({ seen: [], xp: 0 });
  });

  it('marks a term as seen and awards 10 xp', () => {
    const result = markTermSeen('data-engineering', 'etl');
    expect(result.seen).toEqual(['etl']);
    expect(result.xp).toBe(10);
  });

  it('does not award xp twice for the same term', () => {
    markTermSeen('data-engineering', 'etl');
    const result = markTermSeen('data-engineering', 'etl');
    expect(result.seen).toEqual(['etl']);
    expect(result.xp).toBe(10);
  });

  it('sums xp across multiple tracks', () => {
    markTermSeen('data-engineering', 'etl');
    markTermSeen('database', 'normalization');
    expect(getTotalXp(['data-engineering', 'database'])).toBe(20);
  });
});
