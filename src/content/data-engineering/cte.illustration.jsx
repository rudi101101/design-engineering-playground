import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const SOURCE = { x: 90, y: 95 };
const REFS = [
  { x: 360, y: 35 },
  { x: 360, y: 95 },
  { x: 360, y: 155 },
];

export default function CteIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const particleLayerRef = useRef(null);
  const sourceRef = useRef(null);

  const [nested, setNested] = useState(true);
  const [running, setRunning] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const [stored, setStored] = useState(false);
  const [litRef, setLitRef] = useState(-1);

  const runIdRef = useRef(0);
  const timeoutsRef = useRef([]);
  const nestedRef = useRef(nested);
  nestedRef.current = nested;

  function clearTimers() {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }

  useEffect(() => {
    clearTimers();
    runIdRef.current++;
    setRunning(false);
    setRunCount(0);
    setStored(false);
    setLitRef(-1);
    return clearTimers;
  }, [nested]);

  function flashSource() {
    const el = sourceRef.current;
    if (!el) return;
    el.setAttribute("fill", "#2f6fed44");
    el.setAttribute("stroke", "#4fd1ff");
    setTimeout(() => {
      if (el) {
        el.setAttribute("fill", "#0e1218");
        el.setAttribute("stroke", "#3a4552");
      }
    }, 260);
  }

  function spawnParticle(from, to, color, duration, onArrive) {
    if (!particleLayerRef.current) {
      onArrive();
      return;
    }
    const NS = "http://www.w3.org/2000/svg";
    const circle = document.createElementNS(NS, "circle");
    circle.setAttribute("r", "4");
    circle.setAttribute("fill", color);
    circle.style.filter = `drop-shadow(0 0 4px ${color})`;
    particleLayerRef.current.appendChild(circle);
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("opacity", t > 0.85 ? String(1 - (t - 0.85) / 0.15) : "1");
      if (t < 1) requestAnimationFrame(frame);
      else {
        circle.remove();
        onArrive();
      }
    }
    requestAnimationFrame(frame);
  }

  function run() {
    if (running) return;
    clearTimers();
    const myRunId = ++runIdRef.current;
    setRunning(true);
    setRunCount(0);
    setStored(false);
    setLitRef(-1);

    if (nestedRef.current) {
      REFS.forEach((r, i) => {
        const t = setTimeout(() => {
          if (runIdRef.current !== myRunId) return;
          flashSource();
          setRunCount((c) => c + 1);
          setLitRef(i);
          spawnParticle(SOURCE, r, "#d8514b", 500, () => {
            if (runIdRef.current !== myRunId) return;
            if (i === REFS.length - 1) setRunning(false);
          });
        }, i * 750);
        timeoutsRef.current.push(t);
      });
    } else {
      flashSource();
      setRunCount(1);
      const t1 = setTimeout(() => {
        if (runIdRef.current !== myRunId) return;
        setStored(true);
        REFS.forEach((r, i) => {
          const t2 = setTimeout(() => {
            if (runIdRef.current !== myRunId) return;
            setLitRef(i);
            spawnParticle(SOURCE, r, "#1f9d5c", 450, () => {
              if (runIdRef.current !== myRunId) return;
              if (i === REFS.length - 1) setRunning(false);
            });
          }, i * 220);
          timeoutsRef.current.push(t2);
        });
      }, 350);
      timeoutsRef.current.push(t1);
    }
  }

  const strings = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    nestedLabel: isId ? "SUBQUERY BERSARANG" : "NESTED SUBQUERY",
    nestedTag: isId ? "dieksekusi tiap dirujuk" : "re-runs on every reference",
    cteLabel: "CTE — WITH",
    cteTag: isId ? "sekali hitung, dipakai ulang" : "computed once, reused",
    run: isId ? "Jalankan Query" : "Run Query",
    running: isId ? "Menjalankan..." : "Running...",
    sourceLabelNested: isId ? "SUBQUERY" : "SUBQUERY",
    sourceLabelCte: stored ? (isId ? "CTE result (tersimpan)" : "CTE result (stored)") : "CTE",
    captionIdle: isId
      ? "klik “Jalankan Query” untuk melihat berapa kali subquery benar-benar dieksekusi"
      : "click “Run Query” to see how many times the subquery actually executes",
    captionNested: isId
      ? "subquery dieksekusi ULANG untuk setiap referensi — 3 referensi = 3x hitung ulang"
      : "the subquery RE-RUNS for every reference — 3 references = 3x recomputed",
    captionCte: isId
      ? "CTE dihitung SEKALI, hasilnya disimpan lalu dipakai ulang oleh semua referensi"
      : "the CTE computes ONCE, its result is stored and reused by every reference",
  };

  let caption = strings.captionIdle;
  if (runCount > 0) caption = nested ? strings.captionNested : strings.captionCte;

  return (
    <div className="rounded-[20px] border border-hairline-border bg-pure-white p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-caption font-semibold uppercase tracking-wide text-faint-gray">{strings.header}</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setNested((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-caption font-bold tracking-wide transition"
          style={
            nested
              ? { color: "#d8514b", borderColor: "#d8514b55", background: "#fdeaea", boxShadow: "0 0 18px -6px #d8514b55" }
              : { color: "#1f9d5c", borderColor: "#1f9d5c55", background: "#e5f6ea", boxShadow: "0 0 18px -6px #1f9d5c55" }
          }
        >
          {nested ? strings.nestedLabel : strings.cteLabel}
          <span className="font-medium" style={{ color: nested ? "#d8514b99" : "#1f9d5c99" }}>
            {nested ? strings.nestedTag : strings.cteTag}
          </span>
        </button>
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="rounded-full border px-4 py-1.5 text-caption font-bold tracking-wide text-white transition disabled:opacity-50"
          style={{ background: "#2f6fed", borderColor: "#2f6fed" }}
        >
          {running ? strings.running : strings.run}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-ink p-3">
        <div className="mb-1 flex justify-end px-1 text-caption font-semibold" style={{ color: nested ? "#d8514b" : "#1f9d5c" }}>
          {isId ? "eksekusi subquery" : "subquery runs"}: {runCount}
        </div>
        <svg viewBox="0 0 460 190" className="h-[170px] w-full">
          {REFS.map((r, i) => (
            <line key={i} x1={SOURCE.x + 40} y1={SOURCE.y} x2={r.x - 34} y2={r.y} stroke="#ffffff22" strokeWidth="1.3" strokeDasharray="4 6" />
          ))}

          <g>
            <rect ref={sourceRef} x={SOURCE.x - 40} y={SOURCE.y - 26} rx="9" width="80" height="52" fill="#0e1218" stroke="#3a4552" strokeWidth="1.6" />
            <text x={SOURCE.x} y={SOURCE.y - 4} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#cfd6dd" fontFamily="'Inter',sans-serif">
              {nested ? strings.sourceLabelNested : "CTE"}
            </text>
            <text x={SOURCE.x} y={SOURCE.y + 15} textAnchor="middle" fontSize="9" fontWeight="700" fill={!nested && stored ? "#1f9d5c" : "#6b7684"} fontFamily="'Inter',sans-serif">
              {!nested && stored ? (isId ? "tersimpan" : "stored") : ""}
            </text>
          </g>

          {REFS.map((r, i) => (
            <g key={i}>
              <rect x={r.x - 34} y={r.y - 17} rx="7" width="68" height="34" fill="#0e1218" stroke={litRef === i ? (nested ? "#d8514b" : "#1f9d5c") : "#3a4552"} strokeWidth="1.5" />
              <text x={r.x} y={r.y + 4} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#8b96a1" fontFamily="'Inter',sans-serif">
                {isId ? "Referensi" : "Reference"} {i + 1}
              </text>
            </g>
          ))}

          <g ref={particleLayerRef} />
        </svg>
        <p className="mt-1 px-1 text-center text-caption text-faint-gray">{caption}</p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "MODE" : "MODE"}</p>
          <p className="mt-0.5 truncate text-label font-semibold text-ink">{nested ? (isId ? "bersarang" : "nested") : "CTE"}</p>
        </div>
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "EKSEKUSI SUBQUERY" : "SUBQUERY RUNS"}</p>
          <p className="mt-0.5 truncate text-label font-semibold" style={{ color: nested ? "#d8514b" : "#1f9d5c" }}>
            {runCount || (nested ? 3 : 1)}x
          </p>
        </div>
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "BIAYA RELATIF" : "RELATIVE COST"}</p>
          <p className="mt-0.5 truncate text-label font-semibold text-ink">{nested ? "3x" : "1x"}</p>
        </div>
      </div>

      <style>{`
        @keyframes dep-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(62, 94, 234, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(62, 94, 234, 0); }
        }
      `}</style>
    </div>
  );
}
