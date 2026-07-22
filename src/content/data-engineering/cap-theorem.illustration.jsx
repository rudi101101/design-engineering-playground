import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const A = { x: 150, y: 75 };
const B = { x: 450, y: 75 };
const CLIENT = { x: 450, y: 155 };

export default function CapTheoremIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [cp, setCp] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | writing | partitioned | reading | done
  const [valA, setValA] = useState("v1");
  const [valB, setValB] = useState("v1");
  const [readResult, setReadResult] = useState(null); // null | "stale" | "error" | "ok"

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setValA("v1");
    setValB("v1");
    setReadResult(null);
    setPhase("writing");

    timers.after(500, () => {
      setValA("v2");
      setPhase("partitioned");
      timers.after(700, () => {
        setPhase("reading");
        spawn(CLIENT, B, C.accent, 550, {
          arc: 0,
          onDone: () => {
            setReadResult(cp ? "error" : "stale");
            setPhase("done");
            setRunning(false);
          },
        });
      });
    });
  }

  const partitioned = phase === "partitioned" || phase === "reading" || phase === "done";
  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    cpLabel: "PILIH CP",
    apLabel: "PILIH AP",
    run: isId ? "Simulasikan partisi" : "Simulate partition",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "klik untuk menulis v2 ke Node A, lalu jaringan antar node putus, lalu client membaca dari Node B"
      : "click to write v2 to Node A, then the network partitions, then a client reads from Node B",
    writing: isId ? "menulis v2 ke Node A…" : "writing v2 to Node A…",
    part: isId ? "PARTISI! replikasi A → B terputus" : "PARTITION! replication A → B is cut",
    reading: isId ? "client membaca dari Node B…" : "client reads from Node B…",
    doneCp: isId
      ? "CP: Node B menolak melayani karena tidak yakin datanya terbaru — konsisten, tapi tidak available"
      : "CP: Node B refuses to serve since it can't guarantee freshness — consistent, but not available",
    doneAp: isId
      ? "AP: Node B tetap menjawab dengan v1 yang basi — available, tapi tidak konsisten"
      : "AP: Node B still answers with stale v1 — available, but not consistent",
  };

  let caption = s.idle;
  if (phase === "writing") caption = s.writing;
  else if (phase === "partitioned") caption = s.part;
  else if (phase === "reading") caption = s.reading;
  else if (phase === "done") caption = cp ? s.doneCp : s.doneAp;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={cp}
            onClick={() => !running && setCp((v) => !v)}
            labelOn={s.cpLabel}
            labelOff={s.apLabel}
            tagOn={isId ? "konsistensi dulu" : "consistency first"}
            tagOff={isId ? "availability dulu" : "availability first"}
            colorOn={C.accent}
            colorOff={C.amber}
            washOn="#e6effd"
            washOff="#fdf1dd"
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={partitioned ? (isId ? "JARINGAN TERBELAH" : "NETWORK PARTITIONED") : null}
      badgeColor={C.red}
      caption={caption}
      cells={[
        { l: "MODE", v: cp ? "CP" : "AP" },
        { l: isId ? "PARTISI" : "PARTITION", v: partitioned ? (isId ? "aktif" : "active") : "-", color: partitioned ? C.red : undefined },
        {
          l: isId ? "HASIL BACA" : "READ RESULT",
          v: readResult === "error" ? (isId ? "ditolak" : "rejected") : readResult === "stale" ? "v1 (stale)" : "-",
          color: readResult === "error" ? C.accent : readResult === "stale" ? C.amber : undefined,
        },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={A.x + 46} y1={A.y} x2={B.x - 46} y2={B.y} color={partitioned ? C.red : C.grid} />
        {partitioned && (
          <SvgText x={300} y={A.y - 12} color={C.red} size={13} weight={800}>
            ⚡
          </SvgText>
        )}
        <SvgNode x={A.x} y={A.y} label="NODE A" value={valA} valueColor={valA === "v2" ? C.green : C.dim} />
        <SvgNode
          x={B.x}
          y={B.y}
          label="NODE B"
          value={readResult === "error" ? "×" : valB}
          stroke={readResult === "error" ? C.accent : readResult === "stale" ? C.amber : C.stroke}
          valueColor={readResult === "stale" ? C.amber : C.dim}
        />
        <SvgNode x={CLIENT.x} y={CLIENT.y} w={80} h={30} rx={15} label="CLIENT" />
        <Wire x1={CLIENT.x} y1={CLIENT.y - 15} x2={B.x} y2={B.y + 26} dash="2 4" />
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
