import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { getTrack, getTermById, getTermsByCategory } from "../content/index.js";
import { getGameComponent } from "../content/games.js";
import { getCustomIllustration } from "../content/customIllustrations.js";
import { getTrackProgress, markTermSeen } from "../lib/progress.js";
import Illustration from "../components/Illustration.jsx";
import MarkdownRenderer from "../components/MarkdownRenderer.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

function Section({ n, id, label, value, isFallback, notTranslatedLabel, onVisible, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!onVisible) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(label);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible, label]);

  if (!value && !children) return null;

  return (
    <section
      ref={ref}
      id={id}
      className="mb-4 scroll-mt-6 rounded-[12px] border border-hairline-border bg-pure-white p-[18px] last:mb-0"
    >
      <div className="mb-3.5 flex items-center justify-between gap-2 border-b border-[#f0f1f4] pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-[6px] bg-indigo-wash px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-indigo-primary">{n}</span>
          <h2 className="text-[14px] font-bold text-ink">{label}</h2>
        </div>
        {isFallback && (
          <span className="shrink-0 rounded-[6px] bg-warning-wash px-2 py-1 text-[10.5px] font-bold text-warning-amber">{notTranslatedLabel}</span>
        )}
      </div>
      {value && <MarkdownRenderer text={value} />}
      {children}
    </section>
  );
}

export default function TermDetailPage() {
  const { trackSlug, termSlug } = useParams();
  const { lang, t, pick } = useLanguage();
  const navigate = useNavigate();
  const [seenIds, setSeenIds] = useState(() => getTrackProgress(trackSlug).seenIds);
  const [activeSection, setActiveSection] = useState("");

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
    window.scrollTo({ top: 0 });
  }, [termSlug]);

  if (!track || !term || term.track !== trackSlug) return <NotFoundPage />;

  const GameComponent = getGameComponent(term.id);
  const CustomIllustration = getCustomIllustration(term.id);
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
    <div>
      {/* Top bar: breadcrumb + prev/next concept, Meetcan workspace-header pattern */}
      <div className="flex flex-col gap-3 border-b border-hairline-border bg-pure-white px-5 py-[14px] sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to={`/${trackSlug}`}
            aria-label={t("allConcepts")}
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] border border-[#e7e9ee] transition hover:border-indigo-primary"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 1L2 6L8 11" stroke="#4a5160" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px]"
            style={{ backgroundColor: `${term.color}1a`, color: term.color }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={term.icon} />
            </svg>
          </span>
          <span className="truncate text-[14.5px] font-bold text-ink">{term.name[lang] || term.name.id}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {prevTerm && (
            <button
              type="button"
              onClick={() => navigate(`/${trackSlug}/${prevTerm.id}`)}
              className="max-w-[180px] truncate rounded-[8px] border border-hairline-border bg-pure-white px-3 py-[6px] text-[11px] font-bold text-slate-gray transition hover:border-indigo-primary hover:text-indigo-primary"
            >
              ← {prevTerm.name[lang] || prevTerm.name.id}
            </button>
          )}
          {idx >= 0 && (
            <span className="text-[11.5px] font-medium text-faint-gray">
              {idx + 1}/{categoryTerms.length}
            </span>
          )}
          {nextTerm && (
            <button
              type="button"
              onClick={() => navigate(`/${trackSlug}/${nextTerm.id}`)}
              className="max-w-[180px] truncate rounded-[8px] border border-hairline-border bg-pure-white px-3 py-[6px] text-[11px] font-bold text-slate-gray transition hover:border-indigo-primary hover:text-indigo-primary"
            >
              {nextTerm.name[lang] || nextTerm.name.id} →
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left: continuous scroll narrative inside one outer card, Dashboard body pattern */}
        <div className="min-w-0 flex-1 lg:mr-[460px] xl:mr-[560px]">
          <div className="mx-auto max-w-[860px] px-5 py-5 sm:px-7">
            <div className="rounded-[16px] border border-hairline-border bg-pure-white p-4 shadow-[var(--shadow-card)] sm:p-[22px]">
              <div className="relative mb-4">
                <div
                  className="relative z-[2] overflow-hidden rounded-[12px] border border-hairline-border p-[18px]"
                  style={{ background: `radial-gradient(130% 130% at 100% 0%, ${term.color}30 0%, #ffffff 65%)` }}
                >
                  <div className="mb-3.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
                        style={{
                          background: `linear-gradient(135deg, ${term.color}, color-mix(in srgb, ${term.color} 65%, #000))`,
                          boxShadow: `0 4px 8px ${term.color}66`,
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={term.icon} />
                        </svg>
                      </div>
                      <span className="truncate text-[12.5px] font-bold leading-[1.25] text-ink">{term.category}</span>
                    </div>
                    {GameComponent && (
                      <a
                        href="#term-game-section"
                        className="shrink-0 whitespace-nowrap rounded-[8px] border border-hairline-border bg-pure-white px-2.5 py-[5px] text-[10.5px] font-bold text-slate-gray transition hover:border-indigo-primary hover:text-indigo-primary"
                      >
                        ▶ {t("jumpToDemo")}
                      </a>
                    )}
                  </div>
                  <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.3px] text-ink">
                    {term.name[lang] || term.name.id}
                  </h1>
                </div>
                <div className="relative z-[1] mx-[1.5px] -mt-2.5 flex items-center justify-between rounded-b-[12px] border border-hairline-border bg-[#eef0f2] px-4 pb-2.5 pt-[18px] text-[11.5px] font-bold text-success-green">
                  <span className="flex items-center gap-1">
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <path d="M4 1L7 6H1L4 1Z" fill="#1f9d5c" />
                    </svg>
                    {idx + 1}/{categoryTerms.length}
                  </span>
                  <span className="font-medium text-faint-gray">{term.category}</span>
                </div>
              </div>

              <Section n="01" label={t("description")} value={description.text} isFallback={description.isFallback} notTranslatedLabel={t("notTranslated")} onVisible={setActiveSection} />
          <Section n="02" label={t("concept")} value={concept.text} isFallback={concept.isFallback} notTranslatedLabel={t("notTranslated")} onVisible={setActiveSection} />
          <Section n="03" label={t("objective")} value={objective.text} isFallback={objective.isFallback} notTranslatedLabel={t("notTranslated")} onVisible={setActiveSection} />
          <Section n="04" label={t("methodology")} value={methodology.text} isFallback={methodology.isFallback} notTranslatedLabel={t("notTranslated")} onVisible={setActiveSection} />
          <Section n="05" label={t("goal")} value={goal.text} isFallback={goal.isFallback} notTranslatedLabel={t("notTranslated")} onVisible={setActiveSection} />
          <Section
            n="06"
            label={t("exampleImplementation")}
            value={exampleImplementation.text}
            isFallback={exampleImplementation.isFallback}
            notTranslatedLabel={t("notTranslated")}
            onVisible={setActiveSection}
          />
          <Section
            n="07"
            label={t("exampleEnterprise")}
            value={exampleEnterprise.text}
            isFallback={exampleEnterprise.isFallback}
            notTranslatedLabel={t("notTranslated")}
            onVisible={setActiveSection}
          />
          <Section n="08" label={`${t("pros")} & ${t("cons")}`} onVisible={setActiveSection}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[12px] border border-success-green/20 bg-success-wash p-4">
                <h4 className="mb-2 inline-block rounded-[6px] bg-pure-white px-[9px] py-1 text-[11.5px] font-bold text-success-green">{t("pros")}</h4>
                <MarkdownRenderer text={pros.text} />
              </div>
              <div className="rounded-[12px] border border-danger-red/20 bg-danger-wash p-4">
                <h4 className="mb-2 inline-block rounded-[6px] bg-pure-white px-[9px] py-1 text-[11.5px] font-bold text-danger-red">{t("cons")}</h4>
                <MarkdownRenderer text={cons.text} />
              </div>
            </div>
          </Section>

          {GameComponent && (
            <section
              id="term-game-section"
              className="mb-4 scroll-mt-6 rounded-[12px] border border-hairline-border bg-pure-white p-[18px]"
            >
              <div className="mb-3.5 flex items-center gap-2 border-b border-[#f0f1f4] pb-3">
                <span className="rounded-[6px] bg-indigo-wash px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-indigo-primary">09</span>
                <h2 className="text-[14px] font-bold text-ink">{t("tabGame")}</h2>
              </div>
              <GameComponent term={term} />
            </section>
          )}

          <div className="flex flex-col gap-4 rounded-[12px] border border-hairline-border p-[18px]">
            {term.prerequisites.length > 0 && <MetaChips label={t("prerequisites")} ids={term.prerequisites} trackSlug={trackSlug} lang={lang} />}
            {term.related.length > 0 && <MetaChips label={t("related")} ids={term.related} trackSlug={trackSlug} lang={lang} />}
            {term.tools.length > 0 && (
              <div>
                <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.6px] text-faint-gray">{t("tools")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {term.tools.map((tool) => (
                    <span key={tool} className="rounded-[6px] bg-[#f3f4f7] px-2 py-1 text-[11px] font-semibold text-slate-gray">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
          </div>
        </div>

        {/* Right: diagram docked full-bleed and full-height — truly fixed to the viewport, never scrolls */}
        <div className="w-full shrink-0 lg:fixed lg:right-0 lg:top-0 lg:h-screen lg:w-[460px] xl:w-[560px]">
          {CustomIllustration ? (
            <CustomIllustration term={term} />
          ) : (
            <Illustration simKey={term.simulation} color={term.color} label={term.name[lang] || term.name.id} footer={activeSection} />
          )}
        </div>
      </div>
    </div>
  );
}

function MetaChips({ label, ids, trackSlug, lang }) {
  return (
    <div>
      <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.6px] text-faint-gray">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const refTerm = getTermById(id);
          if (!refTerm) return null;
          return (
            <Link
              key={id}
              to={`/${trackSlug}/${id}`}
              className="rounded-[6px] bg-indigo-wash px-2 py-1 text-[11.5px] font-bold text-indigo-primary transition hover:bg-indigo-primary hover:text-white"
            >
              {refTerm.name[lang] || refTerm.name.id}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
