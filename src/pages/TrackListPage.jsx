import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { getTrack, getTermsByCategory } from "../content/index.js";
import { getTrackProgress } from "../lib/progress.js";
import TermCard from "../components/TermCard.jsx";
import CategorySidebar from "../components/CategorySidebar.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

export default function TrackListPage() {
  const { trackSlug } = useParams();
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const track = getTrack(trackSlug);
  const categories = useMemo(() => (track ? getTermsByCategory(trackSlug) : []), [track, trackSlug]);
  const { seenIds } = track ? getTrackProgress(trackSlug) : { seenIds: new Set() };

  if (!track) return <NotFoundPage />;

  const query = search.trim().toLowerCase();
  const filteredCategories = categories
    .filter((c) => activeCategory === "all" || c.category === activeCategory)
    .map((c) => ({
      ...c,
      terms: c.terms.filter((term) => {
        if (!query) return true;
        const name = (term.name[lang] || term.name.id).toLowerCase();
        const toolsMatch = term.tools.some((tool) => tool.toLowerCase().includes(query));
        return name.includes(query) || toolsMatch;
      }),
    }))
    .filter((c) => c.terms.length > 0);

  const total = track.terms.length;
  const learned = track.terms.filter((tm) => seenIds.has(tm.id)).length;

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8">
      <div className="mb-6 flex flex-col gap-2 border-b border-hairline-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.5px] text-ink">{track.name[lang] || track.name.id}</h1>
          <p className="mt-1.5 flex items-center gap-2 text-[11.5px] text-faint-gray">
            <span className="rounded-[6px] bg-success-wash px-2 py-1 text-[11.5px] font-bold text-success-green">
              {learned}/{total}
            </span>
            {t("termsLearned")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          allLabel={t("all")}
          totalCount={total}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <div className="relative w-full sm:max-w-xs">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="pointer-events-none absolute left-[11px] top-1/2 -translate-y-1/2"
              >
                <circle cx="5.5" cy="5.5" r="4.3" stroke="#aab1bd" strokeWidth="1.3" />
                <path d="M8.6 8.6L12 12" stroke="#aab1bd" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-[8px] border border-[#e7e9ee] bg-[#fbfbfc] py-2 pl-8 pr-3 text-[13px] text-ink outline-none transition focus:border-indigo-primary focus:bg-pure-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {filteredCategories.map((c) => (
              <section key={c.category}>
                <h2 className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.6px] text-faint-gray">{c.category}</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {c.terms.map((term) => (
                    <TermCard key={term.id} term={term} trackSlug={trackSlug} seen={seenIds.has(term.id)} />
                  ))}
                </div>
              </section>
            ))}
            {filteredCategories.length === 0 && <p className="py-16 text-center text-body text-slate-gray">🔍 Tidak ada term yang cocok</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
