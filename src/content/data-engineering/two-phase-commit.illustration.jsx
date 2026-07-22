import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const COORD = { x: 300, y: 40 };
const PAY = { x: 130, y: 145 };
const INV = { x: 470, y: 145 };

export default function TwoPhaseCommitIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [use2pc, setUse2pc] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | prepare | voted | commit | done | invFail | payCommitted | inconsistent
  const [payState, setPayState] = useState("-");
  const [invState, setInvState] = useState("-");

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPayState("-");
    setInvState("-");

    if (use2pc) {
      setPhase("prepare");
      spawn(COORD, PAY, C.amber, 500, { arc: 12 });
      spawn(COORD, INV, C.amber, 500, {
        arc: -12,
        onDone: () => {
          setPayState("prepared");
          setInvState("prepared");
          setPhase("voted");
          timers.after(700, () => {
            setPhase("commit");
            spawn(COORD, PAY, C.green, 450, { arc: 10 });
            spawn(COORD, INV, C.green, 450, {
              arc: -10,
              onDone: () => {
                setPayState("committed");
                setInvState("committed");
                setPhase("done");
                setRunning(false);
              },
            });
          });
        },
      });
    } else {
      setPhase("payCommitted");
      spawn(COORD, PAY, C.green, 500, {
        arc: 12,
        onDone: () => {
          setPayState("committed");
          timers.after(500, () => {
            setInvState("failed");
            setPhase("inconsistent");
            setRunning(false);
          });
        },
      });
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Bayar order (2 service)" : "Pay for order (2 services)",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "satu order menyentuh 2 service: Payment & Inventory — keduanya harus commit bersama, atau tidak sama sekali"
      : "one order touches 2 services: Payment & Inventory — both must commit together, or not at all",
    prepare: isId ? "FASE 1 — PREPARE: koordinator tanya kedua service, siap commit?" : "PHASE 1 — PREPARE: coordinator asks both services, ready to commit?",
    voted: isId ? "kedua service menjawab READY — koordinator kunci keputusan" : "both services vote READY — the coordinator locks in the decision",
    commit: isId ? "FASE 2 — COMMIT: koordinator memerintahkan commit ke semua" : "PHASE 2 — COMMIT: coordinator tells everyone to commit",
    done: isId
      ? "commit atomik di kedua service — uang terpotong DAN stok berkurang, atau tidak keduanya"
      : "atomic commit across both services — money is charged AND stock decreases, or neither happens",
    inconsistent: isId
      ? "tanpa koordinasi: Payment sukses duluan, lalu Inventory gagal — pelanggan terbayar tapi stok tak berkurang. Data dua service kini TIDAK KONSISTEN"
      : "without coordination: Payment succeeds first, then Inventory fails — the customer is charged but stock never drops. The two services are now INCONSISTENT",
  };

  let caption = s.idle;
  if (phase === "prepare") caption = s.prepare;
  else if (phase === "voted") caption = s.voted;
  else if (phase === "commit") caption = s.commit;
  else if (phase === "done") caption = s.done;
  else if (phase === "payCommitted") caption = isId ? "Payment commit langsung…" : "Payment commits directly…";
  else if (phase === "inconsistent") caption = s.inconsistent;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={use2pc}
            onClick={() => !running && setUse2pc((v) => !v)}
            labelOn="2PC"
            labelOff={isId ? "TANPA KOORDINASI" : "NO COORDINATION"}
            tagOn={isId ? "prepare → commit" : "prepare → commit"}
            tagOff={isId ? "commit langsung" : "direct commit"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "inconsistent" ? (isId ? "DATA TIDAK KONSISTEN" : "INCONSISTENT STATE") : phase === "done" ? (isId ? "COMMIT ATOMIK" : "ATOMIC COMMIT") : null}
      badgeColor={phase === "inconsistent" ? C.red : C.green}
      caption={caption}
      cells={[
        { l: "PAYMENT", v: payState, color: payState === "committed" ? C.green : payState === "prepared" ? C.amber : undefined },
        { l: "INVENTORY", v: invState, color: invState === "committed" ? C.green : invState === "prepared" ? C.amber : invState === "failed" ? C.red : undefined },
        { l: isId ? "KONSISTEN?" : "CONSISTENT?", v: phase === "done" ? (isId ? "ya" : "yes") : phase === "inconsistent" ? (isId ? "tidak" : "no") : "-", color: phase === "done" ? C.green : phase === "inconsistent" ? C.red : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        {use2pc && (
          <SvgNode x={COORD.x} y={COORD.y} w={130} h={36} rx={9} label={isId ? "KOORDINATOR" : "COORDINATOR"} stroke={phase === "voted" || phase === "commit" ? C.green : C.accent} />
        )}
        {!use2pc && <SvgNode x={COORD.x} y={COORD.y} w={130} h={36} rx={9} label={isId ? "APP (tanpa koordinator)" : "APP (no coordinator)"} stroke={C.amber} />}

        <Wire x1={COORD.x - 30} y1={COORD.y + 18} x2={PAY.x + 10} y2={PAY.y - 20} />
        <Wire x1={COORD.x + 30} y1={COORD.y + 18} x2={INV.x - 10} y2={INV.y - 20} />

        <SvgNode x={PAY.x} y={PAY.y} w={110} h={54} label="PAYMENT" value={payState} valueColor={payState === "committed" ? C.green : payState === "prepared" ? C.amber : C.dim} stroke={payState === "committed" ? C.green : payState === "prepared" ? C.amber : C.stroke} />
        <SvgNode x={INV.x} y={INV.y} w={110} h={54} label="INVENTORY" value={invState} valueColor={invState === "committed" ? C.green : invState === "prepared" ? C.amber : invState === "failed" ? C.red : C.dim} stroke={invState === "failed" ? C.red : invState === "committed" ? C.green : invState === "prepared" ? C.amber : C.stroke} />

        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
