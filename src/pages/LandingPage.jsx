import { useLanguage } from '../i18n/LanguageContext';
import { TrackCard } from '../components/TrackCard';
import { getTotalXp, getTrackProgress } from '../lib/progress';
import { tracks } from '../content';

export function LandingPage() {
  const { language, toggleLanguage } = useLanguage();
  const totalXp = getTotalXp(tracks.map((track) => track.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-heading font-bold text-ink">
          Design & Engineering Playground
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="text-label font-semibold text-ink">
            {language === 'id' ? 'ID' : 'EN'}
          </button>
          <span className="text-label font-semibold text-indigo-primary">{totalXp} XP</span>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            seenCount={getTrackProgress(track.id).seen.length}
          />
        ))}
      </div>
    </div>
  );
}
