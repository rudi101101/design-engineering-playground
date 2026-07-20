import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { getCombinedXp } from "../lib/progress.js";
import { trackList } from "../content/index.js";

export default function Header() {
  const { lang, toggleLang, t } = useLanguage();
  const xp = getCombinedXp(trackList.map((track) => track.slug));

  return (
    <header className="sticky top-0 z-20 border-b border-hairline-border bg-pure-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-primary to-indigo-deep text-sm font-extrabold text-white">
            D
          </span>
          <span className="hidden text-card-title font-semibold text-ink sm:inline">{t("appName")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-warning-wash px-3 py-1 text-label font-semibold text-warning-amber">{xp} XP</span>
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full border border-hairline-border bg-pure-white px-3 py-1 text-label font-semibold text-slate-gray transition hover:border-indigo-primary hover:text-indigo-primary"
            aria-label="Toggle language"
          >
            {lang === "id" ? "ID" : "EN"} / {lang === "id" ? "EN" : "ID"}
          </button>
        </div>
      </div>
    </header>
  );
}
