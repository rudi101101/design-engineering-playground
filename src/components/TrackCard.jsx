import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export function TrackCard({ track, seenCount }) {
  const { language } = useLanguage();
  const total = track.termCount;
  const pct = total === 0 ? 0 : Math.round((seenCount / total) * 100);
  const progressLabel =
    language === 'id'
      ? `${seenCount}/${total} dipelajari`
      : `${seenCount}/${total} learned`;

  return (
    <Link
      to={`/${track.id}`}
      className="block rounded-notification-card bg-pure-white shadow-card p-5 hover:shadow-card-hover transition-shadow"
    >
      <h3 className="text-card-title font-semibold text-ink">{track.name}</h3>
      <p className="text-label text-slate-gray mt-1">{progressLabel}</p>
      <div className="h-1.5 rounded-pill bg-hairline-border mt-3 overflow-hidden">
        <div
          className="h-full rounded-pill bg-indigo-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
