import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const T1 = { x: 100, y: 55 };
const T2 = { x: 100, y: 140 };
const ROW = { x: 420, y: 97 };

export default function LockTypesIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [exclusive, setExclusive] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | t1in | t2wait | t2in | done
  const [holders, setHolders] = useState(0);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setHolders(0);
    setPhase("t1in");

    spawn(T1, ROW, exclusive ? C.red : C.green, 600, {
      arc: 12,
      onDone: () => {
        setHolders(1);
        if (!exclusive) {
          spawn(T2, ROW, C.green, 600, {
            arc: -12,
            onDone: () => {
              setHolders(2);
              setPhase("done");
              setRunning(false);
            },
          });
        } else {
          setPhase("t2wait");
          timers.after(1400, () => {
            setHolders(0);
            setPhase("t2in");
            spawn(T2, ROW, C.red, 600, {
              arc: -12,
              onDone: () => {
                setHolders(1);
                setPhase("done");
                setRunning(false);
              },
            });
          });
        }
      },
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Jalankan T1 & T2" : "Run T1 & T2",
    running: isId ? "Berjalan…" : "Running…",
    idleShared: isId
      ? "dua transaksi membaca baris yang sama — shared lock bisa dipegang bersamaan"
      : "two transactions read the same row — shared locks can be held together",
    idleExcl: isId
      ? "dua transaksi menulis baris yang sama — exclusive lock hanya untuk satu pemegang"
      : "two transactions write the same row — an exclusive lock allows only one holder",
    t1in: isId ? "T1 mengambil lock…" : "T1 acquires the lock…",
    t2waitCap: isId ? "T2 mencoba menulis… harus ANTRE sampai T1 melepas exclusive lock" : "T2 tries to write… it must QUEUE until T1 releases the exclusive lock",
    t2inCap: isId ? "T1 selesai & melepas lock — giliran T2 masuk" : "T1 finished & released — now T2 proceeds",
    doneShared: isId ? "kedua reader memegang shared lock bersamaan — membaca tidak saling blokir" : "both readers hold shared locks at once — reads never block reads",
    doneExcl: isId ? "penulisan diserialisasi: satu per satu, tidak pernah bertabrakan" : "writes are serialized: one at a time, never colliding",
  };

  let caption = exclusive ? s.idleExcl : s.idleShared;
  if (phase === "t1in") caption = s.t1in;
  else if (phase === "t2wait") caption = s.t2waitCap;
  else if (phase === "t2in") caption = s.t2inCap;
  else if (phase === "done") caption = exclusive ? s.doneExcl : s.doneShared;

  const lockColor = exclusive ? C.red : C.green;
  const t2Waiting = phase === "t2wait";

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={!exclusive}
            onClick={() => !running && setExclusive((v) => !v)}
            labelOn={isId ? "SHARED (BACA)" : "SHARED (READ)"}
            labelOff={isId ? "EXCLUSIVE (TULIS)" : "EXCLUSIVE (WRITE)"}
            tagOn={isId ? "boleh bareng" : "held together"}
            tagOff={isId ? "satu pemegang" : "single holder"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={t2Waiting ? (isId ? "T2 MENGANTRE" : "T2 QUEUED") : null}
      badgeColor={C.amber}
      caption={caption}
      cells={[
        { l: "LOCK", v: exclusive ? "exclusive" : "shared", color: lockColor },
        { l: isId ? "PEMEGANG" : "HOLDERS", v: String(holders), color: holders > 0 ? lockColor : undefined },
        { l: "T2", v: t2Waiting ? (isId ? "menunggu" : "waiting") : phase === "done" ? "OK" : "-", color: t2Waiting ? C.amber : phase === "done" ? C.green : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgNode x={T1.x} y={T1.y} w={90} h={40} label={isId ? (exclusive ? "T1 · UPDATE" : "T1 · SELECT") : exclusive ? "T1 · UPDATE" : "T1 · SELECT"} />
        <SvgNode x={T2.x} y={T2.y} w={90} h={40} label={isId ? (exclusive ? "T2 · UPDATE" : "T2 · SELECT") : exclusive ? "T2 · UPDATE" : "T2 · SELECT"} stroke={t2Waiting ? C.amber : C.stroke} value={t2Waiting ? "⏳" : null} valueColor={C.amber} />

        <SvgNode x={ROW.x} y={ROW.y} w={120} h={56} label={isId ? "BARIS #42" : "ROW #42"} value={holders > 0 ? `🔒 ×${holders}` : "—"} stroke={holders > 0 ? lockColor : C.stroke} valueColor={holders > 0 ? lockColor : C.dim} />

        <SvgText x={ROW.x} y={ROW.y + 46} size={9} color={C.faint}>
          {exclusive ? (isId ? "maks 1 exclusive" : "max 1 exclusive") : isId ? "shared: tak terbatas" : "shared: unlimited"}
        </SvgText>
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
