import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center px-5 py-24 text-center">
      <p className="text-[48px]">🔍</p>
      <h1 className="mt-2 text-heading font-bold text-ink">{t("notFoundTitle")}</h1>
      <p className="mt-2 text-body text-slate-gray">{t("notFoundBody")}</p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-xl bg-gradient-to-r from-indigo-primary to-indigo-deep px-5 py-2.5 text-body font-semibold text-white shadow-[var(--shadow-button-tinted)]"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
