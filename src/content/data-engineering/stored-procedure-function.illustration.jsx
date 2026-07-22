import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const APP = { x: 80, y: 95 };
const DB = { x: 470, y: 95 };
const STEPS = 3;

export default function StoredProcedureIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [useProc, setUseProc] = useState(false);
  const [running, setRunning] = useState(false);
  const [roundTrips, setRoundTrips] = useState(0);
  const [done, setDone] = useState(false);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setRoundTrips(0);
    setDone(false);

    if (useProc) {
      spawn(APP, DB, C.green, 550, {
        arc: 16,
        onDone: () => {
          setRoundTrips(1);
          setDone(true);
          setRunning(false);
        },
      });
    } else {
      for (let i = 0; i < STEPS; i++) {
        timers.after(i * 480, () => {
          spawn(APP, DB, C.amber, 400, {
            arc: 12,
            onDone: () => {
              setRoundTrips((n) => n + 1);
              if (i === STEPS - 1) {
                setDone(true);
                setRunning(false);
              }
            },
          });
        });
      }
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Proses checkout (3 langkah)" : "Process checkout (3 steps)",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "checkout butuh 3 langkah SQL: kurangi stok, buat order, catat pembayaran"
      : "checkout needs 3 SQL steps: decrement stock, create order, record payment",
    doneClient: isId
      ? "3 round-trip jaringan terpisah dari app ke DB — tiap latensi jaringan terakumulasi, dan logikanya tersebar di kode aplikasi"
      : "3 separate network round-trips from app to DB — each network latency adds up, and the logic is scattered across app code",
    doneProc: isId
      ? "stored procedure membungkus ketiga langkah di dalam DB — 1 round-trip jaringan, dan ketiganya berjalan sebagai satu transaksi atomik di server"
      : "the stored procedure bundles all 3 steps inside the DB — 1 network round-trip, and all three run as one atomic transaction on the server",
  };

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={useProc}
            onClick={() => !running && setUseProc((v) => !v)}
            labelOn={isId ? "STORED PROCEDURE" : "STORED PROCEDURE"}
            labelOff={isId ? "3 QUERY DARI APP" : "3 QUERIES FROM APP"}
            tagOn="1 round-trip"
            tagOff="3 round-trips"
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      caption={!done ? s.idle : useProc ? s.doneProc : s.doneClient}
      cells={[
        { l: isId ? "STRATEGI" : "STRATEGY", v: useProc ? "stored proc" : "3× round-trip" },
        { l: isId ? "ROUND-TRIP" : "ROUND-TRIPS", v: String(roundTrips), color: roundTrips === 1 && done ? C.green : roundTrips > 1 ? C.amber : undefined },
        { l: isId ? "ATOMIK?" : "ATOMIC?", v: done ? (useProc ? (isId ? "ya, di DB" : "yes, in DB") : (isId ? "harus dijaga app" : "app must coordinate")) : "-" },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgNode x={APP.x} y={APP.y} w={80} h={44} label="APP" />
        <Wire x1={APP.x + 40} y1={APP.y} x2={DB.x - 60} y2={DB.y} />

        {useProc ? (
          <SvgNode x={DB.x} y={DB.y} w={130} h={80} label="checkout()" value={roundTrips > 0 ? "3 steps ✓" : null} valueColor={C.green} stroke={C.green} />
        ) : (
          <g>
            <rect x={DB.x - 65} y={DB.y - 46} width={130} height={92} rx={10} fill={C.node} stroke={C.stroke} strokeWidth="1.3" />
            {["1. UPDATE stock", "2. INSERT order", "3. INSERT payment"].map((label, i) => (
              <SvgText key={label} x={DB.x} y={DB.y - 22 + i * 22} size={9} weight={roundTrips > i ? 800 : 600} color={roundTrips > i ? C.amber : C.faint}>
                {label} {roundTrips > i ? "✓" : ""}
              </SvgText>
            ))}
          </g>
        )}
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
