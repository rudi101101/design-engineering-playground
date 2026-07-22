import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const APP = { x: 80, y: 95 };
const TABLE = { x: 300, y: 95 };
const AUDIT = { x: 500, y: 95 };

export default function TriggerIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [triggerOn, setTriggerOn] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | update | fired | logged | missed
  const [auditRows, setAuditRows] = useState(0);
  const [pathsMissed, setPathsMissed] = useState(0);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPhase("update");

    spawn(APP, TABLE, C.accent, 500, {
      arc: 12,
      onDone: () => {
        if (triggerOn) {
          setPhase("fired");
          timers.after(400, () => {
            spawn(TABLE, AUDIT, C.green, 450, {
              arc: 10,
              onDone: () => {
                setAuditRows((n) => n + 1);
                setPhase("logged");
                setRunning(false);
              },
            });
          });
        } else {
          setPathsMissed((n) => n + 1);
          setPhase("missed");
          setRunning(false);
        }
      },
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "UPDATE via SQL manual" : "UPDATE via manual SQL",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "seorang admin menjalankan UPDATE langsung lewat SQL client — bukan lewat kode aplikasi yang biasa mencatat audit log"
      : "an admin runs an UPDATE directly via a SQL client — not through the app code that normally writes an audit log",
    update: isId ? "UPDATE salary di tabel employees…" : "UPDATE salary on the employees table…",
    fired: isId ? "AFTER UPDATE trigger otomatis menyala di level database…" : "the AFTER UPDATE trigger fires automatically at the database level…",
    logged: isId
      ? "audit log tercatat otomatis — trigger berjalan TIDAK PEDULI dari jalur mana perubahan datang (app, SQL client, migrasi)"
      : "the audit log is written automatically — the trigger fires NO MATTER which path the change came from (app, SQL client, migration)",
    missed: isId
      ? "tanpa trigger: perubahan lewat SQL client langsung ini TIDAK tercatat — audit log hanya andalkan kode aplikasi yang bisa dilewati"
      : "without a trigger: this direct SQL client change is NOT logged — the audit log only relies on app code, which can be bypassed",
  };

  let caption = s.idle;
  if (phase === "update") caption = s.update;
  else if (phase === "fired") caption = s.fired;
  else if (phase === "logged") caption = s.logged;
  else if (phase === "missed") caption = s.missed;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge on={triggerOn} onClick={() => !running && setTriggerOn((v) => !v)} labelOn="AFTER UPDATE TRIGGER" labelOff={isId ? "TANPA TRIGGER" : "NO TRIGGER"} tagOn={isId ? "selalu tercatat" : "always logged"} tagOff={isId ? "bisa terlewat" : "can be bypassed"} />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "missed" ? (isId ? "AUDIT LOG TERLEWAT" : "AUDIT LOG MISSED") : phase === "logged" ? (isId ? "TERCATAT OTOMATIS" : "AUTO-LOGGED") : null}
      badgeColor={phase === "missed" ? C.red : C.green}
      caption={caption}
      cells={[
        { l: "TRIGGER", v: triggerOn ? "ON" : "OFF", color: triggerOn ? C.green : C.red },
        { l: isId ? "AUDIT LOG" : "AUDIT LOG", v: String(auditRows), color: auditRows > 0 ? C.green : undefined },
        { l: isId ? "PERUBAHAN TERLEWAT" : "MISSED CHANGES", v: String(pathsMissed), color: pathsMissed > 0 ? C.red : C.green },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={APP.x + 40} y1={APP.y} x2={TABLE.x - 55} y2={TABLE.y} />
        <Wire x1={TABLE.x + 55} y1={TABLE.y} x2={AUDIT.x - 50} y2={AUDIT.y} color={triggerOn ? C.green + "88" : C.grid} dash={triggerOn ? "3 3" : "4 6"} />

        <SvgNode x={APP.x} y={APP.y} w={90} h={44} label={isId ? "SQL CLIENT" : "SQL CLIENT"} />
        <SvgNode x={TABLE.x} y={TABLE.y} w={110} h={56} label="EMPLOYEES" value={phase === "fired" ? (isId ? "trigger nyala…" : "trigger firing…") : null} valueColor={C.amber} stroke={phase === "fired" ? C.amber : C.stroke} />
        <SvgNode x={AUDIT.x} y={AUDIT.y} w={100} h={56} label="AUDIT_LOG" value={auditRows > 0 ? `${auditRows} row` : pathsMissed > 0 ? "—" : null} valueColor={auditRows > 0 ? C.green : C.red} stroke={pathsMissed > 0 ? C.red : C.stroke} />

        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
