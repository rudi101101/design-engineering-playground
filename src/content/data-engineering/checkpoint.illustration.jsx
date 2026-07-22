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
    <div className="rounded-[20px] border border-hairline-border bg-pure-white p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-caption font-semibold uppercase tracking-wide text-faint-gray">{strings.header}</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setWithCheckpoint((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-caption font-bold tracking-wide transition"
          style={
            withCheckpoint
              ? { color: "#1f9d5c", borderColor: "#1f9d5c55", background: "#e5f6ea", boxShadow: "0 0 18px -6px #1f9d5c55" }
              : { color: "#d8514b", borderColor: "#d8514b55", background: "#fdeaea", boxShadow: "0 0 18px -6px #d8514b55" }
          }
        >
          {withCheckpoint ? strings.ckptLabel : strings.noCkptLabel}
          <span className="font-medium" style={{ color: withCheckpoint ? "#1f9d5c99" : "#d8514b99" }}>
            {withCheckpoint ? strings.ckptTag : strings.noCkptTag}
          </span>
        </button>
        <button
          type="button"
          onClick={simulateCrash}
          disabled={crashing}
          className="rounded-full border px-4 py-1.5 text-caption font-bold tracking-wide text-white transition disabled:opacity-50"
          style={{ background: "#2f6fed", borderColor: "#2f6fed" }}
        >
          {crashing ? strings.crashing : strings.crashBtn}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-ink p-4">
        <div className="mb-2 flex items-center justify-between px-1 text-caption text-faint-gray">
          <span>{strings.walLabel}</span>
          <span>{segments} {isId ? "entri" : "entries"}</span>
        </div>
        <div
          className="h-6 w-full overflow-hidden rounded-md border transition-colors"
          style={{ borderColor: flashing ? "#1f9d5c" : "#3a4552", background: "#0e1218" }}
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
            <p className="mb-1 text-center text-caption font-semibold" style={{ color: "#d8514b" }}>
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

        <p className="mt-3 px-1 text-center text-caption text-faint-gray">{caption}</p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "UKURAN WAL" : "WAL SIZE"}</p>
          <p className="mt-0.5 truncate text-label font-semibold" style={{ color: segments > CHECKPOINT_THRESHOLD ? "#d8514b" : "#161a22" }}>
            {segments} {isId ? "entri" : "entries"}
          </p>
        </div>
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "CHECKPOINT" : "CHECKPOINTS"}</p>
          <p className="mt-0.5 truncate text-label font-semibold text-ink">{withCheckpoint ? checkpoints : (isId ? "tidak ada" : "none")}</p>
        </div>
        <div className="rounded-lg border border-hairline-border bg-lavender-canvas px-2.5 py-2">
          <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{isId ? "WAKTU RECOVERY" : "RECOVERY TIME"}</p>
          <p className="mt-0.5 truncate text-label font-semibold text-ink">{recoveryTime !== null ? `${recoveryTime}s` : "—"}</p>
        </div>
      </div>

      <style>{`
        @keyframes dep-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(62, 94, 234, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(62, 94, 234, 0); }
        }
        @keyframes wal-replay {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
