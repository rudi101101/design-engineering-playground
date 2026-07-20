import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Footer() {
  const { lang } = useLanguage();
  return (
    <footer className="border-t border-hairline-border bg-pure-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-5 py-8 text-label text-slate-gray sm:flex-row sm:items-center sm:justify-between">
        <p>
          {lang === "id"
            ? "Design & Engineering Playground — belajar lewat animasi interaktif."
            : "Design & Engineering Playground — learn through interactive animation."}
        </p>
        <p className="text-faint-gray">
          {lang === "id" ? "Dibangun dengan React, Tailwind, dan GSAP." : "Built with React, Tailwind, and GSAP."}
        </p>
      </div>
    </footer>
  );
}
