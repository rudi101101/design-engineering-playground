import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const PRIMARY = { x: 70, y: 95 };
const REPLICAS = [
  { x: 340, y: 35, delay: 450 },
  { x: 340, y: 95, delay: 850 },
  { x: 340, y: 155, delay: 1350 },
];

export default function BaseIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const particleLayerRef = useRef(null);

  const [strong, setStrong] = useState(false);
  const [primaryVersion, setPrimaryVersion] = useState(1);
  const [replicaVersions, setReplicaVersions] = useState([1, 1, 1]);
  const [writeState, setWriteState] = useState("idle"); // idle | waiting | acked
  const [staleReads, setStaleReads] = useState(0);
  const [lastRead, setLastRead] = useState(null);

  const runIdRef = useRef(0);
  const timeoutsRef = useRef([]);
  const strongRef = useRef(strong);
  strongRef.current = strong;

  function clearTimers() {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }

  useEffect(() => {
    clearTimers();
    runIdRef.current++;
    setPrimaryVersion(1);
    setReplicaVersions([1, 1, 1]);
    setWriteState("idle");
    setStaleReads(0);
    setLastRead(null);
    return clearTimers;
  }, [strong]);

  function spawnParticle(to, color, duration, onArrive) {
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
      const x = PRIMARY.x + (to.x - PRIMARY.x) * t;
      const y = PRIMARY.y + (to.y - PRIMARY.y) * t;
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("opacity", t > 0.85 ? String(1 - (t - 0.85) / 0.15) : "1");
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        circle.remove();
        onArrive();
      }
    }
    requestAnimationFrame(frame);
  }

  function write() {
    clearTimers();
    const myRunId = ++runIdRef.current;
    const newVersion = primaryVersion + 1;
    const strongMode = strongRef.current;
    setPrimaryVersion(newVersion);
    setWriteState(strongMode ? "waiting" : "acked");

    let settled = 0;
    REPLICAS.forEach((r, i) => {
      const t = setTimeout(() => {
        if (runIdRef.current !== myRunId) return;
        spawnParticle(r, "#b3791a", 500, () => {
          if (runIdRef.current !== myRunId) return;
          setReplicaVersions((prev) => {
            const next = [...prev];
            next[i] = newVersion;
            return next;
          });
          settled++;
          if (strongMode && settled === REPLICAS.length) setWriteState("acked");
        });
      }, r.delay - 400);
      timeoutsRef.current.push(t);
    });
  }

  function readRandomReplica() {
    const idx = Math.floor(Math.random() * REPLICAS.length);
    const version = replicaVersions[idx];
    const stale = version !== primaryVersion;
    if (stale) setStaleReads((s) => s + 1);
    setLastRead({ idx, version, stale });
  }

  const allSynced = replicaVersions.every((v) => v === primaryVersion);

  const strings = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    strongLabel: isId ? "STRONG CONSISTENCY" : "STRONG CONSISTENCY",
    strongTag: isId ? "tunggu semua replica" : "waits for all replicas",
    baseLabel: "BASE",
    baseTag: isId ? "eventually consistent" : "eventually consistent",
    write: isId ? "Tulis data baru" : "Write new data",
    read: isId ? "Baca dari replica acak" : "Read random replica",
    waiting: isId ? "menunggu semua replica sinkron..." : "waiting for all replicas to sync...",
    acked: isId ? `ACK dikirim untuk v${primaryVersion}` : `ACK sent for v${primaryVersion}`,
    idleCaption: isId ? "klik “Tulis data baru” untuk melihat propagasi ke tiap replica" : "click “Write new data” to see propagation to each replica",
    strongCaption: isId
      ? "client menunggu — write baru dianggap selesai setelah SEMUA replica ikut ter-update"
      : "the client waits — the write only completes once ALL replicas have caught up",
    baseCaption: isId
      ? "client langsung dapat ACK — replica menyusul async, jadi bisa sementara tidak sinkron"
      : "the client gets an ACK immediately — replicas catch up async, so they can be briefly out of sync",
  };

  let caption = strings.idleCaption;
  if (writeState !== "idle") caption = strong ? strings.strongCaption : strings.baseCaption;

  return (
    <div className="rounded-[20px] border border-hairline-border bg-pure-white p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-caption font-semibold uppercase tracking-wide text-faint-gray">{strings.header}</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setStrong((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-caption font-bold tracking-wide transition"
          style={
            strong
              ? { color: "#2f6fed", borderColor: "#2f6fed55", background: "#e6effd", boxShadow: "0 0 18px -6px #2f6fed55" }
              : { color: "#1f9d5c", borderColor: "#1f9d5c55", background: "#e5f6ea", boxShadow: "0 0 18px -6px #1f9d5c55" }
          }
        >
          {strong ? strings.strongLabel : strings.baseLabel}
          <span className="font-medium" style={{ color: strong ? "#2f6fed99" : "#1f9d5c99" }}>
            {strong ? strings.strongTag : strings.baseTag}
          </span>
        </button>
        <button
          type="button"
          onClick={write}
          disabled={writeState === "waiting"}
          className="rounded-full border px-4 py-1.5 text-caption font-bold tracking-wide text-white transition disabled:opacity-50"
          style={{ background: "#2f6fed", borderColor: "#2f6fed" }}
        >
          {strings.write}
        </button>
        <button
          type="button"
          onClick={readRandomReplica}
          className="rounded-full border border-hairline-border px-4 py-1.5 text-caption font-bold tracking-wide text-slate-gray transition hover:border-indigo-primary"
        >
          {strings.read}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-ink p-3">
        <div className="mb-1 flex justify-center px-1 text-caption font-semibold">
          {writeState === "waiting" && <span style={{ color: "#b3791a" }}>{strings.waiting}</span>}
          {writeState === "acked" && <span style={{ color: allSynced ? "#1f9d5c" : "#b3791a" }}>{strings.acked}</span>}
          {writeState === "idle" && <span>&nbsp;</span>}
        </div>
        <svg viewBox="0 0 420 190" className="h-[170px] w-full">
          {REPLICAS.map((r, i) => (
            <line key={i} x1={PRIMARY.x + 34} y1={PRIMARY.y} x2={r.x - 30} y2={r.y} stroke="#ffffff22" strokeWidth="1.3" strokeDasharray="4 6" />
          ))}

          <g>
            <rect x={PRIMARY.x - 34} y={PRIMARY.y - 24} rx="9" width="68" height="48" fill="#0e1218" stroke="#4fd1ff" strokeWidth="1.6" />
            <text x={PRIMARY.x} y={PRIMARY.y - 5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#4fd1ff" fontFamily="'Inter',sans-serif">
              PRIMARY
            </text>
            <text x={PRIMARY.x} y={PRIMARY.y + 14} textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff" fontFamily="'Inter',sans-serif">
              v{primaryVersion}
            </text>
          </g>

          {REPLICAS.map((r, i) => {
            const synced = replicaVersions[i] === primaryVersion;
            const isLastRead = lastRead && lastRead.idx === i;
            return (
              <g key={i}>
                <rect
                  x={r.x - 30}
                  y={r.y - 20}
                  rx="8"
                  width="60"
                  height="40"
                  fill="#0e1218"
                  stroke={isLastRead ? (lastRead.stale ? "#d8514b" : "#1f9d5c") : synced ? "#3a4552" : "#b3791a"}
                  strokeWidth="1.6"
                />
                <text x={r.x} y={r.y - 4} textAnchor="middle" fontSize="8" fontWeight="700" fill="#8b96a1" fontFamily="'Inter',sans-serif">
                  {isId ? "REPLICA" : "REPLICA"} {i + 1}
                </text>
                <text x={r.x} y={r.y + 13} textAnchor="middle" fontSize="11" fontWeight="800" fill={synced ? "#ffffff" : "#b3791a"} fontFamily="'Inter',sans-serif">
                  v{replicaVersions[i]}
                </text>
              </g>
            );
          })}

          <g ref={particleLayerRef} />
        </svg>
        <p className="mt-1 px-1 text-center text-caption text-faint-gray">{caption}</p>
        {lastRead && (
          <p className="text-center text-caption font-semibold" style={{ color: lastRead.stale ? "#d8514b" : "#1f9d5c" }}>
            {isId ? `Baca dari Replica ${lastRead.idx + 1}: v${lastRead.version}` : `Read from Replica ${lastRead.idx + 1}: v${lastRead.version}`}
            {lastRead.stale ? (isId ? " — BASI (stale)" : " — STALE") : isId ? " — segar" : " — fresh"}
          </p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "MODE" : "MODE"}</p>
          <p className="mt-0.5 truncate text-label font-semibold text-ink">{strong ? (isId ? "strong" : "strong") : "BASE"}</p>
        </div>
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "WRITE ACK" : "WRITE ACK"}</p>
          <p className="mt-0.5 truncate text-label font-semibold text-ink">{strong ? (isId ? "lambat" : "slow") : (isId ? "instan" : "instant")}</p>
        </div>
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "BACA BASI" : "STALE READS"}</p>
          <p className="mt-0.5 truncate text-label font-semibold" style={{ color: staleReads > 0 ? "#d8514b" : "#161a22" }}>
            {staleReads}
          </p>
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
