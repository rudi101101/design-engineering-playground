import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function TermCard({ term, trackSlug, seen }) {
  const { lang, pick } = useLanguage();
  const { text: description } = pick(term.content.description);

  return (
    <Link
      to={`/${trackSlug}/${term.id}`}
      className="group relative block rounded-2xl border border-hairline-border bg-pure-white p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
    >
      {seen && <span className="absolute left-0 top-4 h-6 w-1 rounded-r-full" style={{ backgroundColor: term.color }} />}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${term.color}1a`, color: term.color }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={term.icon} />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-card-title font-semibold text-ink">{term.name[lang] || term.name.id}</h4>
          <p className="mt-0.5 line-clamp-2 text-label text-slate-gray">{description}</p>
        </div>
      </div>
    </Link>
  );
}
