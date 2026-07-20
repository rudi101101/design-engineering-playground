import { useLanguage } from "../i18n/LanguageContext.jsx";
import { trackList } from "../content/index.js";
import { getCombinedXp } from "../lib/progress.js";
import TrackCard from "../components/TrackCard.jsx";

export default function LandingPage() {
  const { t } = useLanguage();
  const xp = getCombinedXp(trackList.map((track) => track.slug));
  const totalTerms = trackList.reduce((sum, track) => sum + track.terms.length, 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_15%_20%,rgba(62,94,234,0.10),transparent_60%),radial-gradient(ellipse_50%_70%_at_90%_10%,rgba(124,92,252,0.10),transparent_55%)]" />
        <div className="relative mx-auto max-w-[1280px] px-5 py-16 sm:py-20">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-wash px-3 py-1 text-caption font-semibold uppercase tracking-wide text-indigo-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary" />
            {totalTerms} konsep · Animasi interaktif
          </span>
          <h1 className="max-w-2xl text-heading font-bold leading-tight text-ink sm:text-[40px]">{t("appName")}</h1>
          <p className="mt-3 max-w-xl text-body text-slate-gray">{t("tagline")}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-warning-wash px-4 py-1.5 text-label font-semibold text-warning-amber">{xp} XP terkumpul</span>
            <span className="text-label text-slate-gray">
              {trackList.length} track · {totalTerms} term
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-10">
        <h2 className="mb-5 text-section-title font-bold text-ink">Pilih Track</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trackList.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      </section>
    </>
  );
}
