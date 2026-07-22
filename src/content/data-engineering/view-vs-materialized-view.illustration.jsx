import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const QUERY = { x: 80, y: 95 };
const VIEW = { x: 300, y: 95 };
const BASE = { x: 500, y: 95 };

export default function ViewVsMaterializedViewIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [materialized, setMaterialized] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | recompute | cached | stale
  const [latency, setLatency] = useState(null);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setLatency(null);

    if (materialized) {
      spawn(QUERY, VIEW, C.green, 350, {
        arc: 10,
        onDone: () => {
          setLatency("~4ms");
          setPhase("cached");
          setRunning(false);
        },
      });
    } else {
      setPhase("recompute");
      spawn(QUERY, VIEW, C.amber, 500, {
        arc: 10,
        onDone: () => {
          spawn(VIEW, BASE, C.amber, 700, {
            arc: 14,
            onDone: () => {
              setLatency("~1200ms");
              setPhase("stale");
              setRunning(false);
            },
          });
        },
      });
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Query dashboard revenue" : "Query the revenue dashboard",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "view menjumlahkan jutaan baris order — bandingkan view biasa vs materialized view"
      : "the view aggregates millions of order rows — compare a regular view vs a materialized view",
    recompute: isId ? "regular VIEW hanyalah query tersimpan — dieksekusi ULANG dari nol setiap kali dipanggil…" : "a regular VIEW is just a saved query — it's RE-EXECUTED from scratch on every call…",
    doneStale: isId
      ? "selalu real-time & konsisten, tapi lambat — setiap panggilan menyapu ulang seluruh tabel dasar"
      : "always real-time & consistent, but slow — every call re-scans the entire base table",
    doneCached: isId
      ? "MATERIALIZED VIEW menyimpan hasilnya secara fisik — baca secepat tabel biasa, tapi datanya bisa basi sampai REFRESH berikutnya"
      : "a MATERIALIZED VIEW stores the result physically — reads as fast as a normal table, but the data can be stale until the next REFRESH",
  };

  let caption = s.idle;
  if (phase === "recompute") caption = s.recompute;
  else if (phase === "stale") caption = s.doneStale;
  else if (phase === "cached") caption = s.doneCached;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={materialized}
            onClick={() => !running && setMaterialized((v) => !v)}
            labelOn="MATERIALIZED VIEW"
            labelOff="VIEW"
            tagOn={isId ? "hasil disimpan" : "result stored"}
            tagOff={isId ? "hitung ulang tiap kali" : "recomputed every time"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={latency ? `${isId ? "LATENSI" : "LATENCY"}: ${latency}` : null}
      badgeColor={materialized ? C.green : C.amber}
      caption={caption}
      cells={[
        { l: "TYPE", v: materialized ? "materialized" : "regular" },
        { l: isId ? "LATENSI" : "LATENCY", v: latency ?? "-", color: latency === "~4ms" ? C.green : latency ? C.amber : undefined },
        { l: isId ? "KESEGARAN DATA" : "DATA FRESHNESS", v: materialized ? (isId ? "sampai refresh" : "until refresh") : (isId ? "real-time" : "real-time") },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgNode x={QUERY.x} y={QUERY.y} w={90} h={44} label={isId ? "DASHBOARD" : "DASHBOARD"} />
        <Wire x1={QUERY.x + 45} y1={QUERY.y} x2={VIEW.x - 55} y2={VIEW.y} />
        {!materialized && <Wire x1={VIEW.x + 55} y1={VIEW.y} x2={BASE.x - 55} y2={BASE.y} color={phase === "recompute" || phase === "stale" ? C.amber : C.grid} />}

        <SvgNode
          x={VIEW.x}
          y={VIEW.y}
          w={110}
          h={56}
          label={materialized ? "MAT. VIEW" : "VIEW"}
          value={materialized ? (isId ? "data tersimpan" : "stored data") : (isId ? "query saja" : "just a query")}
          valueColor={materialized ? C.green : C.dim}
          stroke={materialized ? C.green : phase === "recompute" ? C.amber : C.stroke}
        />
        {!materialized && <SvgNode x={BASE.x} y={BASE.y} w={100} h={56} label={isId ? "ORDERS (jutaan baris)" : "ORDERS (millions)"} stroke={phase === "stale" ? C.amber : C.stroke} />}
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
