import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const T1 = { x: 90, y: 55 };
const T2 = { x: 90, y: 140 };
const ROW = { x: 420, y: 97 };

export default function MvccIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [mvcc, setMvcc] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | t1reads | t2writes | t1reads2 | done
  const [t1View, setT1View] = useState(100);
  const [rowVal, setRowVal] = useState(100);
  const [blocked, setBlocked] = useState(false);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setT1View(100);
    setRowVal(100);
    setBlocked(false);
    setPhase("t1reads");

    spawn(T1, ROW, C.accent, 550, {
      arc: 14,
      onDone: () => {
        setT1View(100);
        setPhase("t2writes");
        if (mvcc) {
          spawn(T2, ROW, C.amber, 550, {
            arc: -14,
            onDone: () => {
              setRowVal(150);
              setPhase("t1reads2");
              timers.after(500, () => {
                spawn(ROW, T1, C.accent, 500, {
                  arc: 12,
                  onDone: () => {
                    setPhase("done");
                    setRunning(false);
                  },
                });
              });
            },
          });
        } else {
          setBlocked(true);
          timers.after(900, () => {
            spawn(T2, ROW, C.amber, 550, {
              arc: -14,
              onDone: () => {
                setRowVal(150);
                setBlocked(false);
                setT1View(150);
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
    run: isId ? "T1 baca, T2 tulis, T1 baca lagi" : "T1 reads, T2 writes, T1 reads again",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "T1 mulai transaksi & baca saldo (100). T2 lalu UPDATE saldo jadi 150. T1 baca lagi — apa yang dilihat T1?"
      : "T1 starts a transaction & reads balance (100). T2 then UPDATEs it to 150. T1 reads again — what does T1 see?",
    t1reads: isId ? "T1 membaca snapshot saldo = 100…" : "T1 reads a snapshot of balance = 100…",
    t2writesMvcc: isId
      ? "T2 menulis versi baru (150) tanpa mengunci — T1 tetap bisa membaca versi lamanya"
      : "T2 writes a new version (150) without locking — T1 can still read its own old version",
    t2writesLock: isId ? "T2 ingin menulis, tapi harus MENUNGGU T1 melepas shared lock…" : "T2 wants to write, but must WAIT for T1's shared lock to release…",
    doneMvcc: isId
      ? "T1 tetap melihat 100 sepanjang transaksinya (repeatable read) — MVCC memakai versi baris, bukan lock, untuk reader"
      : "T1 keeps seeing 100 for its whole transaction (repeatable read) — MVCC uses row versions, not locks, for readers",
    doneLock: isId
      ? "dengan locking murni: T2 harus antre di belakang T1 — throughput turun karena reader memblokir writer"
      : "with pure locking: T2 must queue behind T1 — throughput drops because a reader blocks a writer",
  };

  let caption = s.idle;
  if (phase === "t1reads") caption = s.t1reads;
  else if (phase === "t2writes") caption = mvcc ? s.t2writesMvcc : s.t2writesLock;
  else if (phase === "t1reads2") caption = isId ? "T1 membaca lagi dari snapshot yang sama…" : "T1 reads again from the same snapshot…";
  else if (phase === "done") caption = mvcc ? s.doneMvcc : s.doneLock;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={mvcc}
            onClick={() => !running && setMvcc((v) => !v)}
            labelOn="MVCC"
            labelOff={isId ? "LOCKING MURNI" : "PURE LOCKING"}
            tagOn={isId ? "reader tak diblokir" : "readers never blocked"}
            tagOff={isId ? "reader blokir writer" : "readers block writers"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={blocked ? (isId ? "T2 MENUNGGU T1" : "T2 WAITING ON T1") : null}
      badgeColor={C.amber}
      caption={caption}
      cells={[
        { l: "T1 " + (isId ? "MELIHAT" : "SEES"), v: String(t1View), color: t1View === 100 ? C.accent : undefined },
        { l: isId ? "NILAI ASLI" : "ACTUAL VALUE", v: String(rowVal), color: rowVal === 150 ? C.amber : undefined },
        { l: "T2", v: blocked ? (isId ? "menunggu" : "waiting") : phase === "done" ? "OK" : "-", color: blocked ? C.amber : phase === "done" ? C.green : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={T1.x + 40} y1={T1.y} x2={ROW.x - 55} y2={ROW.y - 10} />
        <Wire x1={T2.x + 40} y1={T2.y} x2={ROW.x - 55} y2={ROW.y + 10} color={blocked ? C.amber : C.grid} />

        <SvgNode x={T1.x} y={T1.y} w={90} h={40} label="T1 · READ" value={phase !== "idle" ? t1View : null} valueColor={C.accent} />
        <SvgNode x={T2.x} y={T2.y} w={90} h={40} label="T2 · UPDATE" value={blocked ? "⏳" : phase === "done" || phase === "t1reads2" ? "150" : null} valueColor={blocked ? C.amber : C.amber} stroke={blocked ? C.amber : C.stroke} />

        {mvcc ? (
          <g>
            <rect x={ROW.x - 60} y={ROW.y - 42} width={120} height={30} rx={7} fill={C.node} stroke={C.accent + "aa"} strokeWidth="1.3" />
            <SvgText x={ROW.x} y={ROW.y - 28} size={8} color={C.faint}>
              {isId ? "versi T1" : "T1's version"}
            </SvgText>
            <SvgText x={ROW.x} y={ROW.y - 16} size={11} weight={800} color={C.accent}>
              100
            </SvgText>
            <rect x={ROW.x - 60} y={ROW.y + 12} width={120} height={30} rx={7} fill={C.node} stroke={rowVal === 150 ? C.amber + "aa" : C.stroke} strokeWidth="1.3" />
            <SvgText x={ROW.x} y={ROW.y + 26} size={8} color={C.faint}>
              {isId ? "versi terbaru" : "latest version"}
            </SvgText>
            <SvgText x={ROW.x} y={ROW.y + 38} size={11} weight={800} color={rowVal === 150 ? C.amber : C.dim}>
              {rowVal}
            </SvgText>
          </g>
        ) : (
          <SvgNode x={ROW.x} y={ROW.y} w={110} h={56} label="BALANCE" value={rowVal} valueColor={rowVal === 150 ? C.amber : C.dim} stroke={blocked ? C.amber : C.stroke} />
        )}
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
