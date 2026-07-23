import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const ROWS = 12;
const LOW_VALUES = ["pending", "approved", "rejected", "paid"];
const LOW_COLORS = { pending: "#b3791a", approved: "#1f9d5c", rejected: "#d8514b", paid: "#2f6fed" };
const HIGH_PALETTE = ["#4fd1ff", "#a78bfa", "#f472b6", "#fb923c", "#34d399", "#60a5fa", "#f87171", "#c084fc", "#facc15", "#2dd4bf", "#e879f9", "#93c5fd"];

function generateLowRows() {
  return Array.from({ length: ROWS }, () => {
    const v = LOW_VALUES[Math.floor(Math.random() * LOW_VALUES.length)];
    return { value: v, color: LOW_COLORS[v] };
  });
}

function generateHighRows() {
  const shuffled = [...HIGH_PALETTE].sort(() => Math.random() - 0.5);
  return Array.from({ length: ROWS }, (_, i) => ({ value: `id-${1000 + i}`, color: shuffled[i % shuffled.length] }));
}

export default function CardinalityIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const [low, setLow] = useState(true);
  const [rows, setRows] = useState(() => generateLowRows());
  const swatchRefs = useRef([]);

  useEffect(() => {
    const nextRows = low ? generateLowRows() : generateHighRows();
    setRows(nextRows);
  }, [low]);

  useEffect(() => {
    swatchRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateX(-6px)";
      const start = performance.now() + i * 60;
      function frame(now) {
        const t = Math.max(0, Math.min(1, (now - start) / 220));
        el.style.opacity = String(t);
        el.style.transform = `translateX(${-6 * (1 - t)}px)`;
        if (now < start + 220) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }, [rows]);

  const distinctCount = new Set(rows.map((r) => r.value)).size;
  const ratio = Math.round((distinctCount / ROWS) * 100);

  const strings = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    lowLabel: isId ? "LOW CARDINALITY" : "LOW CARDINALITY",
    lowTag: isId ? "kolom status" : "status column",
    highLabel: isId ? "HIGH CARDINALITY" : "HIGH CARDINALITY",
    highTag: isId ? "kolom user_id" : "user_id column",
    captionLow: isId
      ? "nilai berulang terus — cocok dikelompokkan cepat dengan bitmap index"
      : "values repeat constantly — well suited to fast grouping with a bitmap index",
    captionHigh: isId
      ? "hampir setiap baris unik — bitmap tidak berguna, butuh B-tree/hash index untuk pencarian titik"
      : "almost every row is unique — a bitmap is useless here, needs a B-tree/hash index for point lookups",
    ratioLabel: isId ? "DISTINCT/TOTAL" : "DISTINCT/TOTAL",
    indexLabel: isId ? "INDEX DISARANKAN" : "RECOMMENDED INDEX",
    indexVal: low ? (isId ? "Bitmap Index" : "Bitmap Index") : "B-tree / Hash",
    selectivityLabel: isId ? "SELEKTIVITAS" : "SELECTIVITY",
    selectivityVal: low ? (isId ? "rendah" : "low") : (isId ? "tinggi" : "high"),
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-ink px-6 py-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#4fd1ff]" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-white/40">{strings.header}</span>
      </div>

      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={() => setLow((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wide transition"
          style={
            low
              ? { color: "#e0a13d", borderColor: "#b3791a55", background: "#b3791a22", boxShadow: "0 0 18px -6px #b3791a88" }
              : { color: "#7c9dff", borderColor: "#2f6fed55", background: "#2f6fed22", boxShadow: "0 0 18px -6px #2f6fed88" }
          }
        >
          {low ? strings.lowLabel : strings.highLabel}
          <span className="font-medium opacity-80">{low ? strings.lowTag : strings.highTag}</span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <div className="flex gap-6">
          <div className="flex flex-1 flex-col gap-1.5">
            {rows.map((r, i) => (
              <div
                key={i}
                ref={(el) => (swatchRefs.current[i] = el)}
                className="flex items-center gap-2 rounded-md px-2 py-1"
                style={{ background: "#12161d", border: `1px solid ${r.color}55` }}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: r.color }} />
                <span className="truncate text-[10px] font-mono" style={{ color: `${r.color}cc` }}>
                  {r.value}
                </span>
              </div>
            ))}
          </div>
          <div className="flex w-[150px] shrink-0 flex-col justify-center gap-4 text-center">
            <div>
              <p className="text-[28px] font-extrabold text-white">{ratio}%</p>
              <p className="text-[11px] text-white/40">
                {distinctCount}/{ROWS} {isId ? "unik" : "unique"}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-3 px-1 text-center text-[11px] text-white/50">{low ? strings.captionLow : strings.captionHigh}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-[#7c93ff]">{strings.ratioLabel}</p>
          <p className="mt-0.5 truncate text-[12px] font-semibold text-white">
            {distinctCount}/{ROWS} ({ratio}%)
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-[#7c93ff]">{strings.indexLabel}</p>
          <p className="mt-0.5 truncate text-[12px] font-semibold text-white">{strings.indexVal}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-[#7c93ff]">{strings.selectivityLabel}</p>
          <p className="mt-0.5 truncate text-[12px] font-semibold text-white">{strings.selectivityVal}</p>
        </div>
      </div>

      <style>{`
        @keyframes dep-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(79, 209, 255, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(79, 209, 255, 0); }
        }
      `}</style>
    </div>
  );
}
