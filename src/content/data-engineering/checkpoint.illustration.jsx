import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const CHECKPOINT_THRESHOLD = 8;
const MAX_VISUAL_SEGMENTS = 28;

export default function CheckpointIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const [withCheckpoint, setWithCheckpoint] = useState(false);
  const [segments, setSegments] = useState(0);
  const [checkpoints, setCheckpoints] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const [crashing, setCrashing] = useState(false);
  const [recoveryTime, setRecoveryTime] = useState(null);

  const withCheckpointRef = useRef(withCheckpoint);
  withCheckpointRef.current = withCheckpoint;
  const crashingRef = useRef(crashing);
  crashingRef.current = crashing;

  useEffect(() => {
    setSegments(0);
    setCheckpoints(0);
    setCrashing(false);
    setRecoveryTime(null);
  }, [withCheckpoint]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (crashingRef.current) return;
      setSegments((s) => {
        const next = s + 1;
        if (withCheckpointRef.current && next >= CHECKPOINT_THRESHOLD) {
          setFlashing(true);
          setTimeout(() => setFlashing(false), 400);
          setCheckpoints((c) => c + 1);
          return 0;
        }
        return Math.min(next, MAX_VISUAL_SEGMENTS + 20);
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  function simulateCrash() {
    if (crashing) return;
    setCrashing(true);
    setRecoveryTime(null);
    const duration = 400 + segments * 110;
    setTimeout(() => {
      setRecoveryTime(Math.round((duration / 1000) * 10) / 10);
      setCrashing(false);
      setSegments(0);
    }, duration);
  }

  const barWidthPct = Math.min(100, (segments / MAX_VISUAL_SEGMENTS) * 100);

  const strings = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    noCkptLabel: isId ? "TANPA CHECKPOINT" : "NO CHECKPOINT",
    noCkptTag: isId ? "WAL tumbuh tanpa batas" : "WAL grows unbounded",
    ckptLabel: isId ? "DENGAN CHECKPOINT" : "WITH CHECKPOINT",
    ckptTag: isId ? `flush tiap ${CHECKPOINT_THRESHOLD} entri` : `flushes every ${CHECKPOINT_THRESHOLD} entries`,
    crashBtn: isId ? "Simulasikan Crash" : "Simulate Crash",
    crashing: isId ? "me-replay WAL..." : "replaying WAL...",
    walLabel: isId ? "WAL" : "WAL",
    idleCaption: isId
      ? "WAL terus bertambah — checkpoint (bila aktif) akan mem-flush dirty pages dan memangkas log"
      : "the WAL keeps growing — a checkpoint (if enabled) flushes dirty pages and truncates the log",
    crashCaption: isId
      ? `crash! recovery harus me-replay ${segments || "seluruh"} entri WAL sebelum database bisa online kembali`
      : `crash! recovery must replay ${segments || "the entire"} WAL entries before the database comes back online`,
    recoveredCaption: (t) =>
      isId ? `pulih dalam ${t}s — semakin panjang WAL yang harus di-replay, semakin lama recovery` : `recovered in ${t}s — the longer the WAL to replay, the longer recovery takes`,
  };

  let caption = strings.idleCaption;
  if (crashing) caption = strings.crashCaption;
  else if (recoveryTime !== null) caption = strings.recoveredCaption(recoveryTime);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-ink px-6 py-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#4fd1ff]" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-white/40">{strings.header}</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setWithCheckpoint((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wide transition"
          style={
            withCheckpoint
              ? { color: "#4ade80", borderColor: "#1f9d5c55", background: "#1f9d5c22", boxShadow: "0 0 18px -6px #1f9d5c88" }
              : { color: "#f47872", borderColor: "#d8514b55", background: "#d8514b22", boxShadow: "0 0 18px -6px #d8514b88" }
          }
        >
          {withCheckpoint ? strings.ckptLabel : strings.noCkptLabel}
          <span className="font-medium opacity-80">{withCheckpoint ? strings.ckptTag : strings.noCkptTag}</span>
        </button>
        <button
          type="button"
          onClick={simulateCrash}
          disabled={crashing}
          className="rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wide text-white transition disabled:opacity-50"
          style={{ background: "#2f6fed", borderColor: "#2f6fed" }}
        >
          {crashing ? strings.crashing : strings.crashBtn}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <div className="mb-2 flex items-center justify-between px-1 text-[11px] text-white/40">
          <span>{strings.walLabel}</span>
          <span>{segments} {isId ? "entri" : "entries"}</span>
        </div>
        <div
          className="h-6 w-full overflow-hidden rounded-md border transition-colors"
          style={{ borderColor: flashing ? "#1f9d5c" : "#3a4552", background: "#12161d" }}
        >
          <div
            className="h-full rounded-md transition-all duration-300"
            style={{
              width: `${barWidthPct}%`,
              background: withCheckpoint ? "linear-gradient(90deg, #1f9d5c, #4ade80)" : "linear-gradient(90deg, #b3791a, #d8514b)",
            }}
          />
        </div>

        {crashing && (
          <div className="mt-3">
            <p className="mb-1 text-center text-[11px] font-semibold" style={{ color: "#f47872" }}>
              💥 {strings.crashing}
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#4fd1ff]"
                style={{ width: "100%", animation: `wal-replay ${Math.max(0.4, (400 + segments * 110) / 1000)}s linear forwards` }}
              />
            </div>
          </div>
        )}

        <p className="mt-3 px-1 text-center text-[11px] text-white/50">{caption}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-[#7c93ff]">{isId ? "UKURAN WAL" : "WAL SIZE"}</p>
          <p className="mt-0.5 truncate text-[12px] font-semibold" style={{ color: segments > CHECKPOINT_THRESHOLD ? "#f47872" : "#f1f2f4" }}>
            {segments} {isId ? "entri" : "entries"}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-[#7c93ff]">{isId ? "CHECKPOINT" : "CHECKPOINTS"}</p>
          <p className="mt-0.5 truncate text-[12px] font-semibold text-white">{withCheckpoint ? checkpoints : (isId ? "tidak ada" : "none")}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-[#7c93ff]">{isId ? "WAKTU RECOVERY" : "RECOVERY TIME"}</p>
          <p className="mt-0.5 truncate text-[12px] font-semibold text-white">{recoveryTime !== null ? `${recoveryTime}s` : "—"}</p>
        </div>
      </div>

      <style>{`
        @keyframes dep-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(79, 209, 255, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(79, 209, 255, 0); }
        }
        @keyframes wal-replay {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
