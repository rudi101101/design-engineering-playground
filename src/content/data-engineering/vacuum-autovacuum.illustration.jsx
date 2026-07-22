import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, RunButton, SvgText, useTimers } from "../../illustrations/simKit.jsx";

const BLOCKS = 16;

export default function VacuumAutovacuumIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | deleting | scanning | marking | reclaimed

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setDead(0);
    setPhase("deleting");

    let n = 0;
    const target = 10;
    function tickDelete() {
      n += 1;
      setDead(n);
      if (n < target) timers.after(90, tickDelete);
      else {
        timers.after(500, () => {
          setPhase("scanning");
          timers.after(900, () => {
            setPhase("marking");
            timers.after(700, () => {
              setPhase("reclaimed");
              setDead(0);
              setRunning(false);
            });
          });
        });
      }
    }
    tickDelete();
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "DELETE 10 baris lalu VACUUM" : "DELETE 10 rows then VACUUM",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "10 baris di-DELETE — di Postgres, DELETE tidak langsung membebaskan ruang, hanya menandai baris sebagai dead"
      : "10 rows get DELETEd — in Postgres, DELETE doesn't free space immediately, it just marks rows as dead",
    deleting: isId ? "DELETE berjalan — baris jadi dead tuple, ruang belum dipakai ulang…" : "DELETE runs — rows become dead tuples, space isn't reclaimed yet…",
    scanning: isId ? "VACUUM memindai halaman untuk menemukan dead tuple…" : "VACUUM scans pages to find dead tuples…",
    marking: isId ? "menandai ruang dead tuple sebagai bebas dipakai ulang (free space map)" : "marks dead tuple space as reusable (free space map)",
    reclaimed: isId
      ? "ruang bebas dikembalikan ke free space map — INSERT berikutnya memakainya lagi tanpa memperbesar file tabel"
      : "space is returned to the free space map — the next INSERT reuses it without growing the table file",
  };

  let caption = s.idle;
  if (phase === "deleting") caption = s.deleting;
  else if (phase === "scanning") caption = s.scanning;
  else if (phase === "marking") caption = s.marking;
  else if (phase === "reclaimed") caption = s.reclaimed;

  return (
    <SimShell
      header={s.header}
      controls={
        <RunButton onClick={run} disabled={running}>
          {running ? s.running : s.run}
        </RunButton>
      }
      badge={phase === "scanning" ? "VACUUM: SCANNING" : phase === "marking" ? "VACUUM: MARKING FREE SPACE" : phase === "reclaimed" ? (isId ? "RUANG DIPAKAI ULANG" : "SPACE RECLAIMED") : null}
      badgeColor={phase === "reclaimed" ? C.green : C.accent}
      caption={caption}
      cells={[
        { l: isId ? "DEAD TUPLES" : "DEAD TUPLES", v: phase === "reclaimed" ? "0" : String(dead), color: dead > 0 ? C.red : C.green },
        { l: isId ? "FASE" : "PHASE", v: phase === "idle" ? "-" : phase },
        { l: isId ? "FREE SPACE MAP" : "FREE SPACE MAP", v: phase === "reclaimed" ? (isId ? "ter-update" : "updated") : "-", color: phase === "reclaimed" ? C.green : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        {Array.from({ length: BLOCKS }, (_, i) => {
          const isDead = i < dead;
          const isScanning = phase === "scanning" && i === dead % BLOCKS;
          const isReclaimed = phase === "reclaimed" || phase === "marking";
          const col = i % 8;
          const row = Math.floor(i / 8);
          const x = 60 + col * 62;
          const y = 40 + row * 60;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={48}
              height={44}
              rx={6}
              fill={isDead && !isReclaimed ? "#d8514b22" : C.node}
              stroke={isScanning ? C.accent : isDead && !isReclaimed ? C.red : isReclaimed && i < 10 ? C.green : C.stroke}
              strokeWidth={isScanning ? 1.8 : isDead ? 1.4 : 1}
              strokeDasharray={isReclaimed && i < 10 ? "3 2" : undefined}
            />
          );
        })}
        <SvgText x={300} y={178} size={9} color={C.faint}>
          {phase === "reclaimed" ? (isId ? "putus-putus = bebas dipakai ulang" : "dashed = free for reuse") : isId ? "merah = dead tuple menunggu VACUUM" : "red = dead tuple awaiting VACUUM"}
        </SvgText>
      </svg>
    </SimShell>
  );
}
