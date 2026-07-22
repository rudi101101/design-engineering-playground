import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgText, useTimers } from "../../illustrations/simKit.jsx";

const COLS = 10;
const ROWS = 3;

export default function TableBloatIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [autovacuum, setAutovacuum] = useState(true);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [vacuumed, setVacuumed] = useState(false);
  const totalCells = COLS * ROWS;

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setTick(0);
    setVacuumed(false);

    const maxTicks = totalCells;
    let i = 0;
    function step() {
      i += 1;
      setTick(i);
      if (autovacuum && i === Math.floor(maxTicks * 0.6)) {
        timers.after(500, () => {
          setVacuumed(true);
          timers.after(500, () => {
            setVacuumed(false);
            setTick(Math.floor(maxTicks * 0.2));
            continueTicks(Math.floor(maxTicks * 0.2));
          });
        });
        return;
      }
      if (i < maxTicks) timers.after(110, step);
      else setRunning(false);
    }
    function continueTicks(from) {
      let j = from;
      function s2() {
        j += 1;
        setTick(j);
        if (j < maxTicks) timers.after(110, s2);
        else setRunning(false);
      }
      timers.after(110, s2);
    }
    step();
  }

  const dead = Math.min(tick, totalCells);
  const pctDead = Math.round((dead / totalCells) * 100);

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Jalankan UPDATE berulang" : "Run repeated UPDATEs",
    running: isId ? "Meng-update…" : "Updating…",
    idle: isId
      ? "setiap UPDATE di Postgres membuat baris versi baru (MVCC) — baris lama jadi 'dead tuple'"
      : "every UPDATE in Postgres creates a new row version (MVCC) — the old row becomes a 'dead tuple'",
    growing: isId ? "dead tuple menumpuk, file tabel makin gemuk di disk…" : "dead tuples pile up, the table file bloats on disk…",
    vacuuming: isId ? "AUTOVACUUM berjalan: menandai ruang dead tuple untuk dipakai ulang" : "AUTOVACUUM runs: marks dead tuple space as reusable",
    doneOn: isId
      ? "ruang dipakai ulang secara berkala — ukuran tabel tetap terkendali"
      : "space gets reclaimed periodically — table size stays under control",
    doneOff: isId
      ? "tanpa vacuum: tabel terus menggemuk, index membengkak, query makin lambat — bloat menumpuk selamanya"
      : "without vacuum: the table keeps bloating, indexes swell, queries get slower — bloat just accumulates forever",
  };

  let caption = s.idle;
  if (vacuumed) caption = s.vacuuming;
  else if (tick > 0 && tick < totalCells) caption = s.growing;
  else if (tick >= totalCells) caption = autovacuum ? s.doneOn : s.doneOff;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge on={autovacuum} onClick={() => !running && setAutovacuum((v) => !v)} labelOn="AUTOVACUUM ON" labelOff="AUTOVACUUM OFF" tagOn={isId ? "ruang dipakai ulang" : "space reclaimed"} tagOff={isId ? "terus menggemuk" : "keeps bloating"} />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={vacuumed ? "VACUUM…" : null}
      badgeColor={C.accent}
      caption={caption}
      cells={[
        { l: isId ? "DEAD TUPLES" : "DEAD TUPLES", v: `${pctDead}%`, color: pctDead > 60 && !autovacuum ? C.red : undefined },
        { l: isId ? "AUTOVACUUM" : "AUTOVACUUM", v: autovacuum ? "ON" : "OFF", color: autovacuum ? C.green : C.red },
        { l: isId ? "UKURAN TABEL" : "TABLE SIZE", v: autovacuum ? (isId ? "stabil" : "stable") : tick >= totalCells ? (isId ? "membengkak" : "swollen") : "-", color: autovacuum ? C.green : tick >= totalCells ? C.red : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgText x={300} y={20} size={9} color={C.faint}>
          {isId ? "FILE TABEL (blok disk)" : "TABLE FILE (disk blocks)"}
        </SvgText>
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const idx = r * COLS + c;
            const isDead = idx < dead && !(vacuumed && idx < dead * 0.7);
            const isReclaimed = vacuumed && idx < dead * 0.7;
            const x = 60 + c * 50;
            const y = 35 + r * 45;
            return (
              <rect
                key={idx}
                x={x}
                y={y}
                width={40}
                height={30}
                rx={4}
                fill={isReclaimed ? C.node : isDead ? "#d8514b33" : C.node}
                stroke={isReclaimed ? C.green : isDead ? C.red : C.stroke}
                strokeWidth={isDead || isReclaimed ? 1.4 : 1}
                strokeDasharray={isReclaimed ? "3 2" : undefined}
              />
            );
          })
        )}
        <SvgText x={300} y={182} size={9} color={C.faint}>
          {isId ? "merah = dead tuple · putus-putus = ruang dipakai ulang" : "red = dead tuple · dashed = reclaimed space"}
        </SvgText>
      </svg>
    </SimShell>
  );
}
