import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, useTimers } from "../../illustrations/simKit.jsx";

const T1 = { x: 90, y: 95 };
const T2 = { x: 510, y: 95 };
const RA = { x: 300, y: 42 };
const RB = { x: 300, y: 148 };

function Edge({ from, to, color, dash }) {
  return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="1.6" strokeDasharray={dash} />;
}

export default function DeadlockIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [detector, setDetector] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | l1 | l2 | w1 | cycle | killed | stuck | done

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPhase("l1");
    timers.after(600, () => setPhase("l2"));
    timers.after(1200, () => setPhase("w1"));
    timers.after(1800, () => setPhase("cycle"));
    timers.after(2800, () => {
      if (detector) {
        setPhase("killed");
        timers.after(900, () => {
          setPhase("done");
          setRunning(false);
        });
      } else {
        setPhase("stuck");
        setRunning(false);
      }
    });
  }

  const p = phase;
  const holds1 = p !== "idle";
  const holds2 = p !== "idle" && p !== "l1";
  const wants1 = p === "w1" || p === "cycle" || p === "stuck";
  const wants2 = p === "cycle" || p === "stuck";
  const t2Dead = p === "killed" || p === "done";

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Picu deadlock" : "Trigger deadlock",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "T1 mengunci Row A lalu minta Row B; T2 mengunci Row B lalu minta Row A — saling menunggu"
      : "T1 locks Row A then wants Row B; T2 locks Row B then wants Row A — each waits on the other",
    l1: isId ? "T1 mengunci Row A ✓" : "T1 locks Row A ✓",
    l2: isId ? "T2 mengunci Row B ✓" : "T2 locks Row B ✓",
    w1: isId ? "T1 minta Row B… masih dipegang T2, T1 menunggu" : "T1 wants Row B… held by T2, T1 waits",
    cycle: isId ? "T2 minta Row A… dipegang T1 — siklus tunggu melingkar terbentuk!" : "T2 wants Row A… held by T1 — a circular wait forms!",
    killed: isId ? "detektor memutus siklus: T2 di-rollback sebagai korban" : "the detector breaks the cycle: T2 is rolled back as the victim",
    done: isId ? "T1 mendapat Row B dan selesai; T2 tinggal di-retry oleh aplikasi" : "T1 acquires Row B and finishes; the app simply retries T2",
    stuck: isId ? "tanpa deteksi: keduanya menunggu selamanya — sistem menggantung" : "no detection: both wait forever — the system hangs",
  };

  const captions = { idle: s.idle, l1: s.l1, l2: s.l2, w1: s.w1, cycle: s.cycle, killed: s.killed, done: s.done, stuck: s.stuck };

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={detector}
            onClick={() => !running && setDetector((v) => !v)}
            labelOn={isId ? "DETEKTOR AKTIF" : "DETECTOR ON"}
            labelOff={isId ? "TANPA DETEKTOR" : "NO DETECTOR"}
            tagOn={isId ? "korban di-rollback" : "victim rolled back"}
            tagOff={isId ? "menunggu selamanya" : "waits forever"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={p === "cycle" || p === "stuck" ? "DEADLOCK!" : p === "killed" ? (isId ? "SIKLUS DIPUTUS" : "CYCLE BROKEN") : null}
      badgeColor={p === "killed" ? C.green : C.red}
      caption={captions[p]}
      cells={[
        { l: "T1", v: p === "done" ? (isId ? "selesai ✓" : "done ✓") : wants1 ? (isId ? "menunggu B" : "waiting B") : holds1 ? (isId ? "pegang A" : "holds A") : "-", color: p === "done" ? C.green : wants1 ? C.amber : undefined },
        { l: "T2", v: t2Dead ? "rollback" : wants2 ? (isId ? "menunggu A" : "waiting A") : holds2 ? (isId ? "pegang B" : "holds B") : "-", color: t2Dead ? C.red : wants2 ? C.amber : undefined },
        { l: isId ? "STATUS" : "STATE", v: p === "stuck" ? (isId ? "menggantung" : "hung") : p === "done" ? "OK" : p === "cycle" ? "deadlock" : "-", color: p === "stuck" || p === "cycle" ? C.red : p === "done" ? C.green : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        {holds1 && <Edge from={{ x: T1.x + 40, y: T1.y - 10 }} to={{ x: RA.x - 45, y: RA.y + 5 }} color={C.green} />}
        {holds2 && !t2Dead && <Edge from={{ x: T2.x - 40, y: T2.y + 10 }} to={{ x: RB.x + 45, y: RB.y - 5 }} color={C.green} />}
        {wants1 && <Edge from={{ x: T1.x + 40, y: T1.y + 10 }} to={{ x: RB.x - 45, y: RB.y - 5 }} color={C.amber} dash="4 4" />}
        {wants2 && <Edge from={{ x: T2.x - 40, y: T2.y - 10 }} to={{ x: RA.x + 45, y: RA.y + 5 }} color={C.amber} dash="4 4" />}
        {(p === "killed" || p === "done") && <Edge from={{ x: T1.x + 40, y: T1.y + 10 }} to={{ x: RB.x - 45, y: RB.y - 5 }} color={C.green} />}

        <SvgNode x={T1.x} y={T1.y} w={80} h={44} label="T1" value={p === "done" ? "✓" : wants1 ? "…" : null} valueColor={p === "done" ? C.green : C.amber} stroke={wants1 && p !== "done" ? C.amber : C.stroke} />
        <SvgNode x={T2.x} y={T2.y} w={80} h={44} label="T2" value={t2Dead ? "×" : wants2 ? "…" : null} valueColor={t2Dead ? C.red : C.amber} stroke={t2Dead ? C.red : wants2 ? C.amber : C.stroke} />
        <SvgNode x={RA.x} y={RA.y} w={90} h={30} rx={7} label="ROW A" stroke={holds1 ? C.green : C.stroke} />
        <SvgNode x={RB.x} y={RB.y} w={90} h={30} rx={7} label="ROW B" stroke={p === "done" ? C.green : holds2 && !t2Dead ? C.green : C.stroke} />

        {(p === "cycle" || p === "stuck") && (
          <SvgText x={300} y={100} color={C.red} size={12} weight={800}>
            ⟳ {isId ? "saling menunggu" : "circular wait"}
          </SvgText>
        )}
      </svg>
    </SimShell>
  );
}
