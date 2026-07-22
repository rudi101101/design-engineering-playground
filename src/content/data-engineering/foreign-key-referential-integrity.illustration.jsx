import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const APP = { x: 90, y: 95 };
const ORDERS = { x: 300, y: 95 };
const CUSTOMERS = { x: 500, y: 95 };

export default function ForeignKeyIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [fkOn, setFkOn] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | inserting | checking | rejected | orphan
  const [orphans, setOrphans] = useState(0);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPhase("inserting");

    spawn(APP, ORDERS, C.accent, 600, {
      arc: 14,
      onDone: () => {
        if (fkOn) {
          setPhase("checking");
          spawn(ORDERS, CUSTOMERS, C.amber, 500, {
            arc: 10,
            onDone: () => {
              setPhase("rejected");
              setRunning(false);
            },
          });
        } else {
          setOrphans((n) => n + 1);
          setPhase("orphan");
          setRunning(false);
        }
      },
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "INSERT customer_id = 99" : "INSERT customer_id = 99",
    running: isId ? "Menyisipkan…" : "Inserting…",
    idle: isId
      ? "sisipkan order untuk customer_id = 99 — padahal customer 99 tidak ada di tabel customers"
      : "insert an order for customer_id = 99 — but customer 99 doesn't exist in the customers table",
    checking: isId ? "FK memeriksa: apakah customers.id = 99 ada?" : "FK checks: does customers.id = 99 exist?",
    rejected: isId
      ? "ditolak: violates foreign key constraint — data yatim tidak pernah masuk"
      : "rejected: violates foreign key constraint — orphan data never gets in",
    orphan: isId
      ? "tanpa FK: order yatim tersimpan diam-diam, menunjuk customer yang tidak ada — bom waktu untuk JOIN dan laporan"
      : "without FK: an orphan order is silently stored, pointing at a customer that doesn't exist — a time bomb for JOINs and reports",
  };

  let caption = s.idle;
  if (phase === "inserting") caption = isId ? "menyisipkan ke orders…" : "inserting into orders…";
  else if (phase === "checking") caption = s.checking;
  else if (phase === "rejected") caption = s.rejected;
  else if (phase === "orphan") caption = s.orphan;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={fkOn}
            onClick={() => !running && setFkOn((v) => !v)}
            labelOn={isId ? "DENGAN FOREIGN KEY" : "WITH FOREIGN KEY"}
            labelOff={isId ? "TANPA FOREIGN KEY" : "NO FOREIGN KEY"}
            tagOn={isId ? "referensi dijaga" : "references enforced"}
            tagOff={isId ? "bebas masuk" : "anything goes"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "rejected" ? "FK VIOLATION — INSERT REJECTED" : phase === "orphan" ? (isId ? "BARIS YATIM TERSIMPAN" : "ORPHAN ROW STORED") : null}
      badgeColor={phase === "rejected" ? C.green : C.red}
      caption={caption}
      cells={[
        { l: "FOREIGN KEY", v: fkOn ? "ON" : "OFF", color: fkOn ? C.green : C.red },
        { l: "INSERT", v: phase === "rejected" ? (isId ? "ditolak" : "rejected") : phase === "orphan" ? (isId ? "diterima" : "accepted") : "-", color: phase === "rejected" ? C.green : phase === "orphan" ? C.amber : undefined },
        { l: isId ? "BARIS YATIM" : "ORPHAN ROWS", v: String(orphans), color: orphans > 0 ? C.red : C.green },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={APP.x + 40} y1={APP.y} x2={ORDERS.x - 55} y2={ORDERS.y} />
        <Wire x1={ORDERS.x + 55} y1={ORDERS.y} x2={CUSTOMERS.x - 48} y2={CUSTOMERS.y} color={fkOn ? C.amber + "66" : C.grid} dash={fkOn ? "3 3" : "4 6"} />

        <SvgNode x={APP.x} y={APP.y} w={80} h={44} label="APP" value="id=99" valueColor={C.accent} />
        <SvgNode
          x={ORDERS.x}
          y={ORDERS.y}
          w={110}
          h={62}
          label="ORDERS"
          value={phase === "orphan" ? (isId ? "+1 yatim" : "+1 orphan") : phase === "rejected" ? "×" : "customer_id"}
          valueColor={phase === "orphan" ? C.red : phase === "rejected" ? C.green : C.dim}
          stroke={phase === "orphan" ? C.red : phase === "rejected" ? C.green : C.stroke}
        />
        <SvgNode x={CUSTOMERS.x} y={CUSTOMERS.y} w={96} h={62} label="CUSTOMERS" value="id: 1–42" valueColor={C.dim} stroke={phase === "checking" ? C.amber : C.stroke} />

        {fkOn && (
          <SvgText x={(ORDERS.x + CUSTOMERS.x) / 2} y={ORDERS.y - 26} size={9} color={C.amber}>
            FK: orders.customer_id → customers.id
          </SvgText>
        )}
        <SvgText x={CUSTOMERS.x} y={CUSTOMERS.y + 48} size={9} color={C.faint}>
          {isId ? "99 tidak ada ✗" : "99 doesn't exist ✗"}
        </SvgText>
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
