import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const APP = { x: 80, y: 95 };
const LOG = { x: 300, y: 55 };
const DATA = { x: 300, y: 145 };

export default function WriteAheadLogIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [walOn, setWalOn] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | writing | crash | recovering | recovered | lost
  const [logged, setLogged] = useState(false);
  const [dataWritten, setDataWritten] = useState(false);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setLogged(false);
    setDataWritten(false);
    setPhase("writing");

    if (walOn) {
      spawn(APP, LOG, C.accent, 500, {
        arc: 10,
        onDone: () => {
          setLogged(true);
          timers.after(500, () => {
            setPhase("crash");
            timers.after(700, () => {
              setPhase("recovering");
              spawn(LOG, DATA, C.amber, 500, {
                arc: -8,
                onDone: () => {
                  setDataWritten(true);
                  setPhase("recovered");
                  setRunning(false);
                },
              });
            });
          });
        },
      });
    } else {
      spawn(APP, DATA, C.amber, 700, {
        arc: -12,
        onDone: () => {
          setPhase("crash");
          setRunning(false);
        },
      });
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "UPDATE lalu simulasikan crash" : "UPDATE then simulate crash",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "UPDATE saldo sedang berjalan tepat saat listrik mati di tengah penulisan ke disk data"
      : "an UPDATE is in flight exactly when power dies mid-write to the data file",
    writingWal: isId ? "perubahan ditulis ke WAL dulu (append-only, cepat, fsync) — baru nanti ke data file" : "the change is written to the WAL first (append-only, fast, fsync) — the data file follows later",
    writingNoWal: isId ? "menulis langsung ke data file (halaman B-tree acak)…" : "writing straight into the data file (random B-tree pages)…",
    crashWal: isId ? "CRASH! tapi WAL sudah fsync ke disk sebelum crash" : "CRASH! but the WAL was already fsynced to disk before the crash",
    crashNoWal: isId ? "CRASH! separuh halaman data ter-tulis, separuh belum — halaman rusak (torn page)" : "CRASH! half the data pages got written, half didn't — a torn page",
    recovering: isId ? "restart: replay WAL dari record terakhir yang belum ter-apply ke data file" : "on restart: replay the WAL from the last unapplied record into the data file",
    recovered: isId
      ? "pulih sempurna — WAL menjamin durability tanpa harus fsync setiap halaman data acak setiap saat"
      : "fully recovered — the WAL guarantees durability without fsyncing every random data page on every write",
  };

  let caption = s.idle;
  if (phase === "writing") caption = walOn ? s.writingWal : s.writingNoWal;
  else if (phase === "crash") caption = walOn ? s.crashWal : s.crashNoWal;
  else if (phase === "recovering") caption = s.recovering;
  else if (phase === "recovered") caption = s.recovered;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={walOn}
            onClick={() => !running && setWalOn((v) => !v)}
            labelOn="WAL ON"
            labelOff="WAL OFF"
            tagOn={isId ? "log dulu, data nanti" : "log first, data later"}
            tagOff={isId ? "tulis data langsung" : "write data directly"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "crash" ? (isId ? "CRASH!" : "CRASH!") : phase === "recovered" ? (isId ? "DATA PULIH" : "DATA RECOVERED") : null}
      badgeColor={phase === "crash" ? C.red : C.green}
      caption={caption}
      cells={[
        { l: "WAL", v: walOn ? (logged ? "fsync ✓" : "-") : "off", color: walOn ? C.green : C.faint },
        { l: isId ? "FILE DATA" : "DATA FILE", v: dataWritten ? (isId ? "ter-apply" : "applied") : phase === "crash" && !walOn ? (isId ? "rusak" : "torn") : "-", color: dataWritten ? C.green : phase === "crash" && !walOn ? C.red : undefined },
        { l: isId ? "SETELAH RESTART" : "AFTER RESTART", v: phase === "recovered" ? (isId ? "aman" : "safe") : phase === "crash" && !walOn ? (isId ? "hilang" : "lost") : "-", color: phase === "recovered" ? C.green : phase === "crash" && !walOn ? C.red : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={APP.x + 32} y1={APP.y} x2={LOG.x - 60} y2={LOG.y} color={walOn ? C.accent + "88" : C.grid} />
        <Wire x1={APP.x + 32} y1={APP.y} x2={DATA.x - 55} y2={DATA.y} color={!walOn ? C.amber + "88" : C.grid} />
        {walOn && <Wire x1={LOG.x} y1={LOG.y + 18} x2={DATA.x} y2={DATA.y - 18} color={dataWritten ? C.amber : C.grid} dash="3 4" />}

        <SvgNode x={APP.x} y={APP.y} w={72} h={44} label="APP" value="UPDATE" valueColor={C.accent} />
        {walOn && <SvgNode x={LOG.x} y={LOG.y} w={130} h={34} rx={7} label="WAL (append-only)" stroke={logged ? C.green : C.stroke} value={logged ? "fsync ✓" : null} valueColor={C.green} />}
        <SvgNode x={DATA.x} y={DATA.y} w={130} h={40} label={isId ? "FILE DATA (B-tree)" : "DATA FILE (B-tree)"} stroke={phase === "crash" && !walOn ? C.red : dataWritten ? C.green : C.stroke} value={phase === "crash" && !walOn ? (isId ? "rusak" : "torn") : dataWritten ? "OK" : null} valueColor={phase === "crash" && !walOn ? C.red : C.green} />

        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
