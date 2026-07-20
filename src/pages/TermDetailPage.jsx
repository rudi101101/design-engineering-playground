import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { getTrack, getTermById, getTermsByCategory } from "../content/index.js";
import { getGameComponent } from "../content/games.js";
import { getTrackProgress, markTermSeen } from "../lib/progress.js";
import Illustration from "../components/Illustration.jsx";
import MarkdownRenderer from "../components/MarkdownRenderer.jsx";
import TermSidebarNav from "../components/TermSidebarNav.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

function Field({ label, value, isFallback, notTranslatedLabel }) {
  if (!value) return null;
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="mb-2 flex items-center gap-2 text-section-title font-bold text-ink">
        {label}
        {isFallback && <span className="rounded-full bg-warning-wash px-2 py-0.5 text-caption font-semibold text-warning-amber">{notTranslatedLabel}</span>}
      </h3>
      <MarkdownRenderer text={value} />
    </div>
  );
}

export default function TermDetailPage() {
  const { trackSlug, termSlug } = useParams();
  const { lang, t, pick } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [seenIds, setSeenIds] = useState(() => getTrackProgress(trackSlug).seenIds);

  const track = getTrack(trackSlug);
  const term = getTermById(termSlug);
  const categories = useMemo(() => (track ? getTermsByCategory(trackSlug) : []), [track, trackSlug]);
  const categoryTerms = useMemo(() => categories.find((c) => c.category === term?.category)?.terms ?? [], [categories, term]);

  useEffect(() => {
    if (!term || term.track !== trackSlug) return;
    const result = markTermSeen(trackSlug, term.id);
    setSeenIds(result.seenIds);
  }, [term, trackSlug]);

  useEffect(() => {
    setTab("overview");
  }, [termSlug]);

  if (!track || !term || term.track !== trackSlug) return <NotFoundPage />;

  const GameComponent = getGameComponent(term.id);
  const tabs = [
    { key: "overview", label: t("tabOverview") },
    { key: "technical", label: t("tabTechnical") },
    { key: "business", label: t("tabBusiness") },
    ...(GameComponent ? [{ key: "game", label: t("tabGame") }] : []),
  ];

  const idx = categoryTerms.findIndex((tm) => tm.id === term.id);
  const prevTerm = idx > 0 ? categoryTerms[idx - 1] : null;
  const nextTerm = idx >= 0 && idx < categoryTerms.length - 1 ? categoryTerms[idx + 1] : null;

  const description = pick(term.content.description);
  const concept = pick(term.content.concept);
  const methodology = pick(term.content.methodology);
  const objective = pick(term.content.objective);
  const goal = pick(term.content.goal);
  const exampleImplementation = pick(term.content.exampleImplementation);
  const exampleEnterprise = pick(term.content.exampleEnterprise);
  const pros = pick(term.content.prosAndCons.pros);
  const cons = pick(term.content.prosAndCons.cons);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8">
      <div className="mb-5 flex items-center gap-2 text-label text-slate-gray">
        <Link to={`/${trackSlug}`} className="hover:text-indigo-primary">
          ← {track.name[lang] || track.name.id}
        </Link>
        <span>/</span>
        <span>{term.category}</span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${term.color}1a`, color: term.color }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={term.icon} />
              </svg>
            </div>
            <div>
              <span className="rounded-full px-2 py-0.5 text-caption font-semibold" style={{ backgroundColor: `${term.color}1a`, color: term.color }}>
                {term.category}
              </span>
              <h1 className="text-heading font-bold text-ink">{term.name[lang] || term.name.id}</h1>
            </div>
          </div>

          <div className="mb-6">
            <Illustration simKey={term.simulation} color={term.color} label={term.name[lang] || term.name.id} />
          </div>

          <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-hairline-border bg-pure-white p-1">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                type="button"
                onClick={() => setTab(tb.key)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-label font-semibold transition ${
                  tab === tb.key ? "bg-indigo-primary text-white" : "text-slate-gray hover:bg-lavender-canvas"
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-hairline-border bg-pure-white p-5 sm:p-6">
            {tab === "overview" && (
              <>
                <Field label={t("description")} value={description.text} isFallback={description.isFallback} notTranslatedLabel={t("notTranslated")} />
                <Field label={t("concept")} value={concept.text} isFallback={concept.isFallback} notTranslatedLabel={t("notTranslated")} />
                <Field label={t("objective")} value={objective.text} isFallback={objective.isFallback} notTranslatedLabel={t("notTranslated")} />
                <Field label={t("goal")} value={goal.text} isFallback={goal.isFallback} notTranslatedLabel={t("notTranslated")} />
              </>
            )}
            {tab === "technical" && (
              <>
                <Field label={t("methodology")} value={methodology.text} isFallback={methodology.isFallback} notTranslatedLabel={t("notTranslated")} />
                <Field
                  label={t("exampleImplementation")}
                  value={exampleImplementation.text}
                  isFallback={exampleImplementation.isFallback}
                  notTranslatedLabel={t("notTranslated")}
                />
              </>
            )}
            {tab === "business" && (
              <>
                <Field
                  label={t("exampleEnterprise")}
                  value={exampleEnterprise.text}
                  isFallback={exampleEnterprise.isFallback}
                  notTranslatedLabel={t("notTranslated")}
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-xl bg-success-wash p-4">
                    <h4 className="mb-2 text-label font-bold text-success-green">{t("pros")}</h4>
                    <MarkdownRenderer text={pros.text} />
                  </div>
                  <div className="rounded-xl bg-danger-wash p-4">
                    <h4 className="mb-2 text-label font-bold text-danger-red">{t("cons")}</h4>
                    <MarkdownRenderer text={cons.text} />
                  </div>
                </div>
              </>
            )}
            {tab === "game" && GameComponent && <GameComponent term={term} />}
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-hairline-border bg-pure-white p-5">
            {term.prerequisites.length > 0 && (
              <MetaChips label={t("prerequisites")} ids={term.prerequisites} trackSlug={trackSlug} lang={lang} />
            )}
            {term.related.length > 0 && <MetaChips label={t("related")} ids={term.related} trackSlug={trackSlug} lang={lang} />}
            {term.tools.length > 0 && (
              <div>
                <p className="mb-2 text-label font-semibold text-slate-gray">{t("tools")}</p>
                <div className="flex flex-wrap gap-2">
                  {term.tools.map((tool) => (
                    <span key={tool} className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-1 text-label text-slate-gray">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            {prevTerm ? (
              <button
                type="button"
                onClick={() => navigate(`/${trackSlug}/${prevTerm.id}`)}
                className="flex-1 rounded-xl border border-hairline-border bg-pure-white px-4 py-3 text-left text-label text-slate-gray transition hover:border-indigo-primary"
              >
                ← {t("previous")}
                <p className="mt-0.5 truncate text-body font-semibold text-ink">{prevTerm.name[lang] || prevTerm.name.id}</p>
              </button>
            ) : (
              <div className="flex-1" />
            )}
            {nextTerm ? (
              <button
                type="button"
                onClick={() => navigate(`/${trackSlug}/${nextTerm.id}`)}
                className="flex-1 rounded-xl border border-hairline-border bg-pure-white px-4 py-3 text-right text-label text-slate-gray transition hover:border-indigo-primary"
              >
                {t("next")} →<p className="mt-0.5 truncate text-body font-semibold text-ink">{nextTerm.name[lang] || nextTerm.name.id}</p>
              </button>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>

        <TermSidebarNav trackSlug={trackSlug} category={term.category} terms={categoryTerms} activeTermId={term.id} seenIds={seenIds} />
      </div>
    </div>
  );
}

function MetaChips({ label, ids, trackSlug, lang }) {
  return (
    <div>
      <p className="mb-2 text-label font-semibold text-slate-gray">{label}</p>
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => {
          const refTerm = getTermById(id);
          if (!refTerm) return null;
          return (
            <Link
              key={id}
              to={`/${trackSlug}/${id}`}
              className="rounded-lg bg-indigo-wash px-2.5 py-1 text-label font-medium text-indigo-primary transition hover:bg-indigo-primary hover:text-white"
            >
              {refTerm.name[lang] || refTerm.name.id}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
