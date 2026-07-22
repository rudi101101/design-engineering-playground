import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function TermCard({ term, trackSlug, seen }) {
  const { lang, pick } = useLanguage();
  const { text: description } = pick(term.content.description);
  const isId = lang === "id";

  return (
    <Link
      to={`/${trackSlug}/${term.id}`}
      className="group relative block overflow-hidden rounded-[12px] border border-hairline-border p-[18px] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
      style={{ background: `radial-gradient(130% 130% at 100% 0%, ${term.color}1f 0%, #ffffff 65%)` }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
            style={{ background: term.color, boxShadow: `0 4px 8px ${term.color}66` }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={term.icon} />
            </svg>
          </div>
          <h4 className="truncate text-[12.5px] font-bold leading-[1.25] text-ink">{term.name[lang] || term.name.id}</h4>
        </div>
        {seen && (
          <span className="shrink-0 rounded-[6px] bg-success-wash px-2 py-1 text-[10.5px] font-bold text-success-green">
            {isId ? "Selesai" : "Done"}
          </span>
        )}
      </div>
      <p className="line-clamp-2 text-[11.5px] leading-[1.5] text-faint-gray">{description}</p>
    </Link>
  );
}
