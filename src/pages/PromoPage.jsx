import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ARROW_ICON = "M5 12h14M13 5l7 7-7 7";
const CHECK_ICON = "M5 13l4 4L19 7";
const EYE_ICON = "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z";
const PLAY_ICON = "M7 4l12 8-12 8V4z";
const LAYERS_ICON = "M12 3L2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5";

const CATEGORIES = [
  "DB Fundamentals",
  "Security",
  "Pipeline",
  "Performa",
  "Storage & Format",
  "Advanced SQL",
  "Governance",
  "Arsitektur",
  "Modern/ML",
  "Modeling",
  "Consistency",
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Icon({ path, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function useRevealSection(selector = ".reveal") {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return undefined;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray(ref.current.querySelectorAll(selector));
      if (els.length === 0) return;
      if (prefersReducedMotion()) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, [selector]);
  return ref;
}

function useCountUp(ref, target) {
  useEffect(() => {
    if (!ref.current) return undefined;
    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        ref.current.textContent = String(target);
        return;
      }
      gsap.to(obj, {
        val: target,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = String(Math.round(obj.val));
        },
      });
    });
    return () => ctx.revert();
  }, [ref, target]);
}

function PromoNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline-border/70 bg-pure-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-indigo-primary text-[15px] font-extrabold text-white">
            D
          </span>
          <span className="hidden text-[15px] font-extrabold tracking-[-0.2px] text-ink sm:inline">
            Design & Engineering Playground
          </span>
        </Link>
        <Link
          to="/dashboard"
          className="rounded-[12px] bg-gradient-to-b from-indigo-primary to-indigo-deep px-4 py-2 text-[13.5px] font-semibold text-white shadow-[var(--shadow-button-tinted)] transition hover:-translate-y-0.5"
        >
          Mulai Belajar Gratis
        </Link>
      </div>
    </header>
  );
}

function PromoHero() {
  const heroRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return undefined;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(heroRef.current.querySelectorAll(".hero-in"));
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" });
      }

      if (!prefersReducedMotion() && dotRef.current) {
        gsap.to(dotRef.current, {
          motionPath: {
            path: "#promo-edge-a",
            align: "#promo-edge-a",
            alignOrigin: [0.5, 0.5],
          },
          duration: 2.4,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden border-b border-hairline-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_10%_10%,rgba(47,111,237,0.10),transparent_60%),radial-gradient(ellipse_50%_70%_at_95%_20%,rgba(124,92,252,0.10),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-20">
        <div>
          <span className="hero-in mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-wash px-3 py-1 text-caption font-semibold uppercase tracking-wide text-indigo-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary" />
            101 Konsep · Animasi Interaktif
          </span>
          <h1 className="hero-in max-w-2xl text-[32px] font-bold leading-[1.15] tracking-[-0.01em] text-ink sm:text-[40px] lg:text-[46px]">
            Data engineering yang akhirnya kelihatan bentuknya.
          </h1>
          <p className="hero-in mt-4 max-w-md text-body leading-relaxed text-slate-gray">
            101 konsep divisualisasikan lewat animasi, studi kasus nyata, dan simulasi yang bisa kamu utak-atik sendiri.
          </p>
          <div className="hero-in mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-b from-indigo-primary to-indigo-deep px-5 py-3 text-[14px] font-semibold text-white shadow-[var(--shadow-button-tinted)] transition hover:-translate-y-0.5"
            >
              Mulai Belajar Gratis
              <Icon path={ARROW_ICON} className="h-4 w-4" />
            </Link>
            <Link
              to="/data-engineering"
              className="rounded-[12px] border border-hairline-border px-5 py-3 text-[14px] font-semibold text-ink transition hover:bg-lavender-canvas"
            >
              Lihat Semua Konsep
            </Link>
          </div>
        </div>

        <div className="hero-in relative mx-auto w-full max-w-md">
          <div className="rounded-[20px] border border-hairline-border bg-pure-white p-5 shadow-[var(--shadow-card-hover)]">
            <p className="mb-3 text-label font-semibold text-slate-gray">Contoh alur: cache warm-up</p>
            <svg viewBox="0 0 440 260" className="w-full">
              <path id="promo-edge-a" d="M134,206 C190,206 190,104 161,104" fill="none" stroke="#2f6fed" strokeWidth="2" />
              <path d="M279,104 C330,104 330,206 306,206" fill="none" stroke="#c7cede" strokeWidth="2" strokeDasharray="5 6" />

              <rect x="16" y="178" width="118" height="56" rx="14" fill="#e6effd" />
              <text x="75" y="211" textAnchor="middle" fontSize="13" fontWeight="700" fill="#161a22">
                Request
              </text>

              <rect x="161" y="76" width="118" height="56" rx="14" fill="#2f6fed" />
              <text x="220" y="109" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">
                Cache
              </text>

              <rect x="306" y="178" width="118" height="56" rx="14" fill="#fbfbfc" stroke="#eef0f3" />
              <text x="365" y="211" textAnchor="middle" fontSize="13" fontWeight="700" fill="#4a5160">
                Database
              </text>

              <circle ref={dotRef} cx="134" cy="206" r="5" fill="#ffffff" stroke="#2f6fed" strokeWidth="2" />
            </svg>
            <p className="mt-3 text-label text-slate-gray">
              Di aplikasinya, diagram statis ini bisa kamu gerakkan dan jelajahi sendiri.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }) {
  const ref = useRef(null);
  useCountUp(ref, value);
  return (
    <div className="reveal flex flex-col items-center px-6 py-4 text-center sm:items-start sm:text-left">
      <span ref={ref} className="text-[34px] font-extrabold tracking-[-0.02em] text-ink">
        0
      </span>
      <span className="mt-1 text-label text-slate-gray">{label}</span>
    </div>
  );
}

function PromoStats() {
  const ref = useRevealSection();
  return (
    <section ref={ref} className="border-b border-hairline-border bg-pure-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 divide-y divide-hairline-border px-5 py-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <StatItem value={101} label="Konsep dijelaskan" />
        <StatItem value={11} label="Kategori topik" />
        <StatItem value={2} label="Bahasa, Indonesia & Inggris" />
      </div>
    </section>
  );
}

function BentoCell({ className = "", icon, title, body, tone = "light" }) {
  const isDark = tone === "dark";
  return (
    <div
      className={`reveal flex h-full flex-col justify-between rounded-[20px] p-6 shadow-[var(--shadow-card)] ${
        isDark ? "bg-gradient-to-br from-indigo-primary to-indigo-deep" : "border border-hairline-border bg-pure-white"
      } ${className}`}
    >
      <div>
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
            isDark ? "bg-white/15 text-white" : "bg-indigo-wash text-indigo-primary"
          }`}
        >
          <Icon path={icon} className="h-5 w-5" />
        </div>
        <h3 className={`text-[17px] font-bold ${isDark ? "text-white" : "text-ink"}`}>{title}</h3>
        <p className={`mt-2 text-[13.5px] leading-relaxed ${isDark ? "text-white/85" : "text-slate-gray"}`}>{body}</p>
      </div>
    </div>
  );
}

function PromoLearningModes() {
  const ref = useRevealSection();
  return (
    <section ref={ref} className="mx-auto max-w-[1200px] px-5 py-20">
      <h2 className="reveal max-w-lg text-[26px] font-bold leading-tight text-ink sm:text-[30px]">
        Satu konsep, tiga cara memahaminya
      </h2>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-stretch">
        <BentoCell
          className="md:w-3/5"
          icon={EYE_ICON}
          tone="dark"
          title="3 Sudut Pandang"
          body="Overview untuk paham konteksnya, Teknis untuk cara kerjanya, Bisnis untuk kenapa ini dipakai di industri."
        />
        <div className="flex flex-col gap-4 md:w-2/5">
          <BentoCell
            icon={LAYERS_ICON}
            title="Animasi Tiap Konsep"
            body="Proses yang susah dibayangkan, seperti replication atau caching, digambarkan lewat animasi yang bisa kamu tonton ulang kapan saja."
          />
          <BentoCell
            icon={PLAY_ICON}
            title="Coba Sendiri"
            body="Beberapa konsep punya simulasi yang bisa kamu gerakkan langsung, bukan cuma video yang diputar otomatis."
          />
        </div>
      </div>
    </section>
  );
}

function PromoCategories() {
  const ref = useRevealSection();
  return (
    <section ref={ref} className="border-y border-hairline-border bg-pure-white py-16">
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="reveal max-w-lg text-[26px] font-bold leading-tight text-ink sm:text-[30px]">
          11 kategori dalam satu track Data Engineering
        </h2>
        <p className="reveal mt-2 max-w-lg text-body text-slate-gray">
          Dari dasar database sampai arsitektur modern, disusun berurutan biar nggak lompat-lompat.
        </p>
        <div className="reveal mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="snap-start shrink-0 rounded-full border border-hairline-border bg-lavender-canvas px-4 py-2 text-[13.5px] font-semibold text-ink"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoGamification() {
  const ref = useRevealSection();
  const items = ["10 XP setiap konsep selesai", "Progress per track terpisah", "Tersimpan lokal, langsung jalan tanpa login"];
  return (
    <section ref={ref} className="mx-auto max-w-[1200px] px-5 py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <h2 className="text-[26px] font-bold leading-tight text-ink sm:text-[30px]">Progress kamu tersimpan otomatis</h2>
          <p className="mt-3 max-w-md text-body text-slate-gray">
            Setiap konsep yang selesai dibaca menambah XP dan menaikkan level. Semua tersimpan di browser kamu, tanpa perlu bikin
            akun.
          </p>
          <ul className="mt-5 space-y-2.5">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-ink">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-wash text-success-green">
                  <Icon path={CHECK_ICON} className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal mx-auto w-full max-w-sm">
          <div
            className="relative overflow-hidden rounded-[16px] p-5"
            style={{ background: "radial-gradient(120% 120% at 100% 0%, #dfe3fb 0%, #f7f0ff 60%)" }}
          >
            <div className="mb-3 flex items-center gap-[7px]">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-indigo-primary shadow-[0_3px_6px_#2f6fed55]">
                <svg width="9" height="9" viewBox="0 0 9 9">
                  <rect width="9" height="9" rx="1.5" fill="#fff" />
                </svg>
              </span>
              <span className="text-label font-bold text-ink">XP Belajar</span>
            </div>
            <p className="text-[11px] text-faint-gray">Level 1</p>
            <p className="mb-3 text-[26px] font-extrabold text-ink">
              80<span className="text-[14px] font-semibold text-faint-gray">/500</span>
            </p>
            <div className="flex gap-[2px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} className={`h-[6px] flex-1 rounded-full ${i < 3 ? "bg-indigo-primary" : "bg-hairline-border"}`} />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-faint-gray">Contoh tampilan setelah menyelesaikan 8 konsep pertama.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoFinalCta() {
  const ref = useRevealSection();
  return (
    <section ref={ref} className="px-5 py-20">
      <div className="reveal mx-auto max-w-[1200px] overflow-hidden rounded-[24px] bg-gradient-to-br from-indigo-primary to-indigo-deep px-8 py-14 text-center">
        <h2 className="mx-auto max-w-lg text-[28px] font-bold leading-tight text-white sm:text-[34px]">
          Mulai dari konsep pertama, hari ini.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-body text-white/80">
          Gratis, tanpa perlu daftar akun. Langsung buka dan pilih konsep pertamamu.
        </p>
        <Link
          to="/dashboard"
          className="mt-7 inline-flex items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-[14px] font-semibold text-indigo-deep transition hover:-translate-y-0.5"
        >
          Mulai Belajar Gratis
          <Icon path={ARROW_ICON} className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function PromoFooter() {
  return (
    <footer className="border-t border-hairline-border bg-pure-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-8 text-label text-slate-gray sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-ink">Design & Engineering Playground</p>
          <p className="mt-1">Belajar lewat animasi interaktif, bukan slide statis.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-faint-gray">Dibangun dengan React, Tailwind, dan GSAP.</span>
          <Link to="/dashboard" className="font-semibold text-indigo-deep hover:underline">
            Buka aplikasi
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function PromoPage() {
  return (
    <div className="min-h-[100dvh] bg-lavender-canvas">
      <PromoNav />
      <PromoHero />
      <PromoStats />
      <PromoLearningModes />
      <PromoCategories />
      <PromoGamification />
      <PromoFinalCta />
      <PromoFooter />
    </div>
  );
}
