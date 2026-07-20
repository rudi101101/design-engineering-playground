import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export function TermCard({ term, trackId }) {
  const { language } = useLanguage();
  return (
    <Link
      to={`/${trackId}/${term.id}`}
      className="block rounded-notification-card bg-pure-white shadow-card p-4 hover:shadow-card-hover transition-shadow"
      style={{ borderTop: `3px solid ${term.color}` }}
    >
      <span
        className="text-caption font-semibold uppercase"
        style={{ color: term.color }}
      >
        {term.category}
      </span>
      <h3 className="text-card-title font-semibold text-ink mt-1">
        {term.name[language]}
      </h3>
    </Link>
  );
}
