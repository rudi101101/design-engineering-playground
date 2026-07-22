import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { getCombinedXp, getTrackProgress } from "../lib/progress.js";
import { trackList, getTermById, getTermsByCategory } from "../content/index.js";

function NavItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 rounded-[8px] px-2.5 py-[9px] text-[13.5px] font-semibold transition ${
        active ? "bg-indigo-primary/10 text-indigo-primary" : "text-slate-gray hover:bg-lavender-canvas"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d={icon} />
      </svg>
      <span className="truncate">{label}</span>
    </Link>
  );
}

function CategoryTermItem({ to, label, active, seen }) {
  return (
    <Link
      to={to}
      className={`flex h-8 items-center gap-2 rounded-[8px] px-2.5 text-label font-medium transition ${
        active ? "bg-indigo-primary/10 font-semibold text-indigo-primary" : "text-slate-gray hover:bg-lavender-canvas"
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
          seen ? "bg-success-green" : "border border-hairline-border"
        }`}
      >
        {seen && (
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4.2L3.2 5.8L6.5 2.2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

const HOME_ICON = "M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10";

function Logo({ appName }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-indigo-primary text-[15px] font-extrabold text-white">
        D
      </span>
      <span className="truncate text-[16px] font-extrabold tracking-[-0.2px] text-ink">{appName}</span>
    </Link>
  );
}

function XpCreditsCard({ xp, level, levelProgress, isId }) {
  const segments = 20;
  const filled = Math.round((levelProgress / 100) * segments);
  return (
    <div
      className="relative overflow-hidden rounded-[12px] p-3.5"
      style={{ background: "radial-gradient(120% 120% at 100% 0%, #dfe3fb 0%, #f7f0ff 60%)" }}
    >
      <div className="mb-2.5 flex items-center gap-[7px]">
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-indigo-primary shadow-[0_3px_6px_#2f6fed55]">
          <svg width="9" height="9" viewBox="0 0 9 9">
            <rect width="9" height="9" rx="1.5" fill="#fff" />
          </svg>
        </span>
        <span className="text-label font-bold text-ink">{isId ? "XP Belajar" : "Learning XP"}</span>
      </div>
      <p className="text-[11px] text-[#8b93a1]">Level {level}</p>
      <p className="mb-2.5 text-[22px] font-extrabold text-ink">
        {xp % 500}
        <span className="text-[13px] font-semibold text-faint-gray">/500</span>
      </p>
      <div className="flex gap-[2px]">
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className="h-4 flex-1 rounded-[3px]"
            style={{
              background:
                i < filled ? "linear-gradient(180deg, #2f6fed, color-mix(in srgb, #2f6fed 55%, #fff))" : "#dfe3ee",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function MobileTopBar() {
  const { lang, toggleLang, t } = useLanguage();
  const xp = getCombinedXp(trackList.map((track) => track.slug));

  return (
    <header className="flex items-center justify-between border-b border-hairline-border bg-pure-white px-4 py-3 lg:hidden">
      <Logo appName={t("appName")} />
      <div className="flex items-center gap-2">
        <span className="rounded-[6px] bg-warning-wash px-2.5 py-1 text-[11.5px] font-bold text-warning-amber">{xp} XP</span>
        <button
          type="button"
          onClick={toggleLang}
          className="rounded-[8px] border border-hairline-border bg-pure-white px-3 py-1 text-[11px] font-bold text-slate-gray"
          aria-label="Toggle language"
        >
          {lang === "id" ? "ID" : "EN"} / {lang === "id" ? "EN" : "ID"}
        </button>
      </div>
    </header>
  );
}

export default function Sidebar() {
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const [, trackSlug, termSlug] = location.pathname.split("/");
  const xp = getCombinedXp(trackList.map((track) => track.slug));
  const level = Math.floor(xp / 500) + 1;
  const levelProgress = Math.round(((xp % 500) / 500) * 100);
  const isId = lang === "id";
  const isHome = location.pathname === "/";

  const currentTerm = termSlug ? getTermById(termSlug) : null;
  const categoryTerms =
    currentTerm && trackSlug
      ? getTermsByCategory(trackSlug).find((c) => c.category === currentTerm.category)?.terms ?? []
      : [];
  const seenIds = trackSlug ? getTrackProgress(trackSlug).seenIds : new Set();

  return (
    <aside className="hidden shrink-0 flex-col border-r border-hairline-border bg-pure-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[250px]">
      <div className="shrink-0 border-b border-hairline-border px-5 py-5">
        <Logo appName={t("appName")} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 pt-4">
        <p className="mb-1.5 px-2.5 text-[10.5px] font-bold uppercase tracking-[0.6px] text-faint-gray">
          {isId ? "Belajar" : "Learn"}
        </p>
        <nav className="flex flex-col gap-0.5">
          <NavItem to="/" icon={HOME_ICON} label={isId ? "Beranda" : "Home"} active={isHome} />
          {trackList.map((track) => (
            <NavItem
              key={track.slug}
              to={`/${track.slug}`}
              icon={track.icon}
              label={track.name[lang] || track.name.id}
              active={location.pathname.startsWith(`/${track.slug}`)}
            />
          ))}
        </nav>

        {currentTerm && categoryTerms.length > 1 && (
          <div className="mt-5">
            <p className="mb-1.5 px-2.5 text-[10.5px] font-bold uppercase tracking-[0.6px] text-faint-gray">{currentTerm.category}</p>
            <nav className="flex flex-col gap-0.5">
              {categoryTerms.map((tm) => (
                <CategoryTermItem
                  key={tm.id}
                  to={`/${trackSlug}/${tm.id}`}
                  label={tm.name[lang] || tm.name.id}
                  active={tm.id === currentTerm.id}
                  seen={seenIds.has(tm.id)}
                />
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="mt-4 flex shrink-0 flex-col gap-3 px-3.5 pb-4">
        <div className="h-px bg-hairline-border" />
        <XpCreditsCard xp={xp} level={level} levelProgress={levelProgress} isId={isId} />
        <button
          type="button"
          onClick={toggleLang}
          className="flex h-9 items-center justify-center rounded-[8px] border border-hairline-border bg-pure-white text-[11px] font-bold text-slate-gray transition hover:border-indigo-primary hover:text-indigo-primary"
        >
          {lang === "id" ? "ID" : "EN"} / {lang === "id" ? "EN" : "ID"}
        </button>
      </div>
    </aside>
  );
}
