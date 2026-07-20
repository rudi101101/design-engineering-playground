import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { getTrackProgress } from "../lib/progress.js";

export default function TrackCard({ track }) {
  const { lang } = useLanguage();
  const { seenIds } = getTrackProgress(track.slug);
  const total = track.terms.length;
  const learned = track.terms.filter((t) => seenIds.has(t.id)).length;
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <Link
      to={`/${track.slug}`}
      className="group block rounded-[20px] border border-hairline-border bg-pure-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-wash text-indigo-primary">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={track.icon} />
        </svg>
      </div>
      <h3 className="text-card-title font-semibold text-ink">{track.name[lang] || track.name.id}</h3>
      <p className="mt-1 text-label text-slate-gray">
        {learned}/{total} · {pct}%
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-hairline-border">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-primary to-indigo-deep transition-all" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  );
}
