import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const APP = { x: 85, y: 95 };
const GATE = { x: 300, y: 95 };
const TABLE = { x: 510, y: 95 };

export default function UniqueCheckConstraintIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [constraintsOn, setConstraintsOn] = useState(true);
  const [running, setRunning] = useState(false);
  const [attempt, setAttempt] = useState(null); // { label, kind: "dup" | "invalid" }
  const [phase, setPhase] = useState("idle");
  const [badRows, setBadRows] = useState(0);

  function runAttempt(kind) {
    if (running) return;
    setRunning(true);
    timers.clear();
    const label = kind === "dup" ? "andi@mail.com" : "age = -5";
    setAttempt({ label, kind });
    setPhase("flying");

    spawn(APP, GATE, C.accent, 550, {
      arc: 12,
      onDone: () => {
        if (constraintsOn) {
          setPhase("blocked");
          setRunning(false);
        } else {
          spawn(GATE, TABLE, C.red, 500, {
            arc: 10,
            onDone: () => {
              setBadRows((n) => n + 1);
              setPhase("leaked");
              setRunning(false);
            },
          });
        }
      },
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    idle: isId
      ? "email andi@mail.com sudah terdaftar — coba INSERT email kembar, atau umur -5 tahun"
      : "andi@mail.com is already registered — try inserting a duplicate email, or an age of -5",
    flying: isId ? "INSERT berjalan…" : "INSERT in flight…",
    blockedDup: isId
      ? "UNIQUE menolak: email sudah ada — tidak akan pernah ada dua akun dengan email sama"
      : "UNIQUE rejects it: email already exists — two accounts can never share an email",
    blockedInvalid: isId
      ? "CHECK (age >= 0) menolak: umur negatif tidak masuk akal — aturan bisnis dijaga di level database"
      : "CHECK (age >= 0) rejects it: negative age is nonsense — the business rule is enforced at the database level",
    leaked: isId
      ? "tanpa constraint: data rusak masuk diam-diam — baru ketahuan nanti saat login dobel atau laporan aneh"
      : "without constraints: broken data slips in silently — you only find out later via double logins or weird reports",
  };

  let caption = s.idle;
  if (phase === "flying") caption = s.flying;
  else if (phase === "blocked") caption = attempt?.kind === "dup" ? s.blockedDup : s.blockedInvalid;
  else if (phase === "leaked") caption = s.leaked;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={constraintsOn}
            onClick={() => !running && setConstraintsOn((v) => !v)}
            labelOn={isId ? "CONSTRAINT AKTIF" : "CONSTRAINTS ON"}
            labelOff={isId ? "TANPA CONSTRAINT" : "NO CONSTRAINTS"}
            tagOn="UNIQUE + CHECK"
            tagOff={isId ? "gerbang terbuka" : "gate open"}
          />
          <RunButton onClick={() => runAttempt("dup")} disabled={running}>
            {isId ? "Email kembar" : "Duplicate email"}
          </RunButton>
          <RunButton onClick={() => runAttempt("invalid")} disabled={running}>
            age = -5
          </RunButton>
        </>
      }
      badge={phase === "blocked" ? (attempt?.kind === "dup" ? "UNIQUE VIOLATION" : "CHECK VIOLATION") : phase === "leaked" ? (isId ? "DATA RUSAK MASUK" : "BAD DATA STORED") : null}
      badgeColor={phase === "blocked" ? C.green : C.red}
      caption={caption}
      cells={[
        { l: "CONSTRAINT", v: constraintsOn ? "ON" : "OFF", color: constraintsOn ? C.green : C.red },
        { l: "INSERT", v: phase === "blocked" ? (isId ? "ditolak" : "rejected") : phase === "leaked" ? (isId ? "lolos" : "leaked in") : "-", color: phase === "blocked" ? C.green : phase === "leaked" ? C.red : undefined },
        { l: isId ? "BARIS RUSAK" : "BAD ROWS", v: String(badRows), color: badRows > 0 ? C.red : C.green },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={APP.x + 38} y1={APP.y} x2={GATE.x - 52} y2={GATE.y} />
        <Wire x1={GATE.x + 52} y1={GATE.y} x2={TABLE.x - 48} y2={TABLE.y} />

        <SvgNode x={APP.x} y={APP.y} w={76} h={44} label="INSERT" value={attempt ? attempt.label : "…"} valueColor={C.accent} />
        <SvgNode
          x={GATE.x}
          y={GATE.y}
          w={104}
          h={66}
          label={isId ? "GERBANG" : "GATE"}
          value={constraintsOn ? "UNIQUE · CHECK" : "—"}
          valueColor={constraintsOn ? C.green : C.faint}
          stroke={phase === "blocked" ? C.green : constraintsOn ? C.green + "88" : C.stroke}
        />
        <SvgNode x={TABLE.x} y={TABLE.y} w={96} h={62} label="USERS" value={badRows > 0 ? `⚠ +${badRows}` : "42 rows"} valueColor={badRows > 0 ? C.red : C.dim} stroke={badRows > 0 ? C.red : C.stroke} />

        <SvgText x={GATE.x} y={GATE.y + 52} size={9} color={C.faint}>
          {constraintsOn ? "email UNIQUE · CHECK(age ≥ 0)" : isId ? "tidak ada penjaga" : "nobody guarding"}
        </SvgText>
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
