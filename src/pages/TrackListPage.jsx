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
      <div className="mb-6 flex flex-col gap-1 border-b border-hairline-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading font-bold text-ink">{track.name[lang] || track.name.id}</h1>
          <p className="mt-1 text-label text-slate-gray">
            {learned}/{total} {t("termsLearned")}
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
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-[10px] border border-hairline-border bg-pure-white px-4 py-2 text-body text-ink outline-none focus:border-indigo-primary sm:max-w-xs"
            />
          </div>

          <div className="flex flex-col gap-10">
            {filteredCategories.map((c) => (
              <section key={c.category}>
                <h2 className="mb-3 text-caption font-bold uppercase tracking-wide text-faint-gray">{c.category}</h2>
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
