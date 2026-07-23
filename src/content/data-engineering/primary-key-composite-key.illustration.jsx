import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const APP = { x: 90, y: 95 };
const TABLE = { x: 420, y: 95 };
const BASE_ROWS = [
  { o: 1, p: "A" },
  { o: 1, p: "B" },
  { o: 2, p: "A" },
];

export default function PrimaryKeyIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [pkOn, setPkOn] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | inserting | rejected | duplicated
  const [dups, setDups] = useState(0);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPhase("inserting");

    spawn(APP, TABLE, pkOn ? C.amber : C.red, 650, {
      arc: 16,
      onDone: () => {
        if (pkOn) {
          setPhase("rejected");
        } else {
          setDups((n) => n + 1);
          setPhase("duplicated");
        }
        setRunning(false);
      },
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: "INSERT (1, A)",
    running: isId ? "Menyisipkan…" : "Inserting…",
    idle: isId
      ? "baris (order 1, produk A) sudah ada — coba sisipkan lagi baris yang sama persis"
      : "the row (order 1, product A) already exists — try inserting the exact same row again",
    rejected: isId
      ? "composite PK (order_id, product_id) menolak: duplicate key value — identitas baris tetap unik"
      : "the composite PK (order_id, product_id) rejects it: duplicate key value — row identity stays unique",
    duplicated: isId
      ? "tanpa PK: baris kembar masuk begitu saja — SUM(qty) dobel, UPDATE mengenai dua baris, identitas hilang"
      : "without a PK: the twin row slips in — SUM(qty) doubles, UPDATEs hit two rows, identity is gone",
  };

  let caption = s.idle;
  if (phase === "inserting") caption = isId ? "menyisipkan (1, A)…" : "inserting (1, A)…";
  else if (phase === "rejected") caption = s.rejected;
  else if (phase === "duplicated") caption = s.duplicated;

  const rows = [...BASE_ROWS, ...Array.from({ length: dups }, () => ({ o: 1, p: "A", dup: true }))];

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={pkOn}
            onClick={() => {
              if (running) return;
              setPkOn((v) => !v);
              setPhase("idle");
              setDups(0);
            }}
            labelOn={isId ? "COMPOSITE PK AKTIF" : "COMPOSITE PK ON"}
            labelOff={isId ? "TANPA PRIMARY KEY" : "NO PRIMARY KEY"}
            tagOn="(order_id, product_id)"
            tagOff={isId ? "duplikat bebas" : "duplicates welcome"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "rejected" ? "DUPLICATE KEY — REJECTED" : phase === "duplicated" ? (isId ? "BARIS KEMBAR MASUK" : "TWIN ROW INSERTED") : null}
      badgeColor={phase === "rejected" ? C.green : C.red}
      caption={caption}
      cells={[
        { l: "PRIMARY KEY", v: pkOn ? "composite" : "-", color: pkOn ? C.green : C.red },
        { l: "INSERT (1, A)", v: phase === "rejected" ? (isId ? "ditolak" : "rejected") : phase === "duplicated" ? (isId ? "masuk" : "inserted") : "-", color: phase === "rejected" ? C.green : phase === "duplicated" ? C.red : undefined },
        { l: isId ? "DUPLIKAT" : "DUPLICATES", v: String(dups), color: dups > 0 ? C.red : C.green },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={APP.x + 40} y1={APP.y} x2={TABLE.x - 90} y2={TABLE.y} />
        <SvgNode x={APP.x} y={APP.y} w={80} h={44} label="APP" value="(1, A)" valueColor={C.accent} />

        <rect x={TABLE.x - 85} y={18} width={170} height={158} rx={10} fill={C.node} stroke={phase === "duplicated" ? C.red : pkOn ? C.green + "88" : C.stroke} strokeWidth="1.3" />
        <SvgText x={TABLE.x} y={34} size={9.5} color={C.text} weight={800}>
          ORDER_ITEMS {pkOn ? "· PK(order, product)" : ""}
        </SvgText>
        <SvgText x={TABLE.x - 45} y={52} size={9} color={C.faint}>
          order_id
        </SvgText>
        <SvgText x={TABLE.x + 45} y={52} size={9} color={C.faint}>
          product_id
        </SvgText>
        {rows.map((r, i) => (
          <g key={i}>
            <rect x={TABLE.x - 75} y={60 + i * 24} width={150} height={20} rx={4} fill={r.dup ? "#d8514b22" : "#ffffff08"} stroke={r.dup ? C.red : "#ffffff14"} strokeWidth="1" />
            <SvgText x={TABLE.x - 45} y={74 + i * 24} size={10} weight={r.dup ? 800 : 600} color={r.dup ? C.red : C.dim}>
              {r.o}
            </SvgText>
            <SvgText x={TABLE.x + 45} y={74 + i * 24} size={10} weight={r.dup ? 800 : 600} color={r.dup ? C.red : C.dim}>
              {r.p} {r.dup ? "⚠" : ""}
            </SvgText>
          </g>
        ))}
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
