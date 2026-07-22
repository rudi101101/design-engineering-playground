import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const T1 = { x: 90, y: 55 };
const T2 = { x: 90, y: 140 };
const SEQ = { x: 320, y: 97 };
const TABLE = { x: 510, y: 97 };

export default function SequenceAutoIncrementIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [useSeq, setUseSeq] = useState(true);
  const [running, setRunning] = useState(false);
  const [ids, setIds] = useState([]);
  const [conflict, setConflict] = useState(false);
  const [seqVal, setSeqVal] = useState(4);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setIds([]);
    setConflict(false);
    setSeqVal(4);

    if (useSeq) {
      spawn(T1, SEQ, C.accent, 400, {
        arc: 12,
        onDone: () => {
          setSeqVal(5);
          spawn(SEQ, TABLE, C.accent, 350, { arc: 6, onDone: () => setIds((v) => [...v, 5]) });
        },
      });
      timers.after(150, () => {
        spawn(T2, SEQ, C.amber, 400, {
          arc: -12,
          onDone: () => {
            setSeqVal(6);
            spawn(SEQ, TABLE, C.amber, 350, {
              arc: -6,
              onDone: () => {
                setIds((v) => [...v, 6]);
                setRunning(false);
              },
            });
          },
        });
      });
    } else {
      spawn(T1, TABLE, C.red, 500, {
        arc: 12,
        onDone: () => setIds((v) => [...v, 5]),
      });
      timers.after(200, () => {
        spawn(T2, TABLE, C.red, 500, {
          arc: -12,
          onDone: () => {
            setIds((v) => [...v, 5]);
            setConflict(true);
            setRunning(false);
          },
        });
      });
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "T1 & T2 INSERT bersamaan" : "T1 & T2 INSERT concurrently",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "dua transaksi INSERT bersamaan — tabel berisi id 1–4. Bagaimana id berikutnya ditentukan?"
      : "two transactions INSERT concurrently — the table has ids 1–4. How is the next id decided?",
    doneSeq: isId
      ? "SEQUENCE meng-atomik-kan nextval(): T1 dapat 5, T2 dapat 6 — dijamin unik walau race, tanpa lock tabel"
      : "a SEQUENCE atomically increments via nextval(): T1 gets 5, T2 gets 6 — guaranteed unique under race, without table locks",
    doneManual: isId
      ? "MAX(id)+1 secara manual: keduanya membaca MAX = 4 di saat bersamaan, keduanya menghitung 5 — duplicate key!"
      : "manual MAX(id)+1: both read MAX = 4 at the same moment, both compute 5 — duplicate key!",
  };

  let caption = s.idle;
  if (running) caption = isId ? "kedua transaksi INSERT berjalan…" : "both transactions are inserting…";
  else if (ids.length === 2) caption = useSeq ? s.doneSeq : s.doneManual;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge on={useSeq} onClick={() => !running && setUseSeq((v) => !v)} labelOn="SEQUENCE" labelOff="MAX(id) + 1" tagOn={isId ? "atomik" : "atomic"} tagOff={isId ? "rawan race" : "race-prone"} />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={conflict ? "DUPLICATE KEY: id=5" : null}
      badgeColor={C.red}
      caption={caption}
      cells={[
        { l: "T1 → id", v: ids[0] != null ? String(ids[0]) : "-", color: ids[0] != null ? (useSeq ? C.green : C.red) : undefined },
        { l: "T2 → id", v: ids[1] != null ? String(ids[1]) : "-", color: ids[1] != null ? (useSeq ? C.green : C.red) : undefined },
        { l: isId ? "UNIK?" : "UNIQUE?", v: ids.length < 2 ? "-" : useSeq ? (isId ? "ya" : "yes") : (isId ? "tidak" : "no"), color: ids.length < 2 ? undefined : useSeq ? C.green : C.red },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgNode x={T1.x} y={T1.y} w={76} h={38} label="T1" value={ids[0] != null ? `id=${ids[0]}` : null} valueColor={C.accent} />
        <SvgNode x={T2.x} y={T2.y} w={76} h={38} label="T2" value={ids[1] != null ? `id=${ids[1]}` : null} valueColor={conflict ? C.red : C.amber} />

        {useSeq ? (
          <>
            <Wire x1={T1.x + 38} y1={T1.y} x2={SEQ.x - 45} y2={SEQ.y - 8} />
            <Wire x1={T2.x + 38} y1={T2.y} x2={SEQ.x - 45} y2={SEQ.y + 8} />
            <SvgNode x={SEQ.x} y={SEQ.y} w={90} h={46} rx={23} label="SEQUENCE" value={`next=${seqVal}`} valueColor={C.accent} />
            <Wire x1={SEQ.x + 45} y1={SEQ.y} x2={TABLE.x - 50} y2={TABLE.y} />
          </>
        ) : (
          <>
            <Wire x1={T1.x + 38} y1={T1.y} x2={TABLE.x - 50} y2={TABLE.y - 10} color={conflict ? C.red : C.grid} />
            <Wire x1={T2.x + 38} y1={T2.y} x2={TABLE.x - 50} y2={TABLE.y + 10} color={conflict ? C.red : C.grid} />
          </>
        )}

        <SvgNode x={TABLE.x} y={TABLE.y} w={90} h={56} label="TABLE" value={ids.length > 0 ? `[${ids.join(", ")}]` : "id≤4"} valueColor={conflict ? C.red : C.dim} stroke={conflict ? C.red : C.stroke} />
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
