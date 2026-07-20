import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function TermSidebarNav({ trackSlug, category, terms, activeTermId, seenIds }) {
  const { lang, t } = useLanguage();

  return (
    <nav className="w-full shrink-0 lg:w-[240px]">
      <div className="rounded-2xl border border-hairline-border bg-pure-white p-3 lg:sticky lg:top-20">
        <p className="mb-2 px-2 text-caption font-semibold uppercase tracking-wide text-faint-gray">{category}</p>
        <p className="mb-1 px-2 text-caption text-faint-gray">{t("inCategory")}</p>
        <ul className="flex flex-col gap-0.5">
          {terms.map((term) => {
            const isActive = term.id === activeTermId;
            const isSeen = seenIds.has(term.id);
            return (
              <li key={term.id}>
                <Link
                  to={`/${trackSlug}/${term.id}`}
                  className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-label transition ${
                    isActive ? "bg-indigo-wash font-semibold text-indigo-primary" : "text-slate-gray hover:bg-lavender-canvas"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] ${
                      isSeen ? "bg-success-green text-white" : "border border-hairline-border"
                    }`}
                  >
                    {isSeen ? "✓" : ""}
                  </span>
                  <span className="truncate">{term.name[lang] || term.name.id}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
