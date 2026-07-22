import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const APP = { x: 90, y: 95 };
const TABLE = { x: 440, y: 95 };

export default function UpsertIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [upsert, setUpsert] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | flying | conflict | merged | error
  const [stock, setStock] = useState(10);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPhase("flying");

    spawn(APP, TABLE, C.accent, 600, {
      arc: 16,
      onDone: () => {
        setPhase("conflict");
        timers.after(700, () => {
          if (upsert) {
            setStock((v) => v + 5);
            setPhase("merged");
          } else {
            setPhase("error");
          }
          setRunning(false);
        });
      },
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "INSERT sku-7 (+5)" : "INSERT sku-7 (+5)",
    running: isId ? "Menyisipkan…" : "Inserting…",
    idle: isId
      ? "produk sku-7 sudah ada (stok 10) — kirim INSERT sku-7 dengan tambahan stok 5"
      : "product sku-7 already exists (stock 10) — send an INSERT for sku-7 adding 5 stock",
    conflict: isId ? "bentrok! sku-7 sudah ada di primary key…" : "conflict! sku-7 already exists in the primary key…",
    merged: isId
      ? "ON CONFLICT (sku) DO UPDATE: baris yang ada di-update jadi 15 — satu perintah, atomik, tanpa race"
      : "ON CONFLICT (sku) DO UPDATE: the existing row is updated to 15 — one statement, atomic, race-free",
    error: isId
      ? "INSERT biasa gagal: duplicate key. Pola cek-dulu-baru-insert juga rawan race saat dua request datang bersamaan"
      : "plain INSERT fails: duplicate key. Check-then-insert is also racy when two requests arrive at once",
  };

  let caption = s.idle;
  if (phase === "flying") caption = isId ? "mengirim INSERT…" : "sending INSERT…";
  else if (phase === "conflict") caption = s.conflict;
  else if (phase === "merged") caption = s.merged;
  else if (phase === "error") caption = s.error;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={upsert}
            onClick={() => !running && setUpsert((v) => !v)}
            labelOn="UPSERT"
            labelOff={isId ? "INSERT BIASA" : "PLAIN INSERT"}
            tagOn="ON CONFLICT DO UPDATE"
            tagOff={isId ? "tabrak lalu error" : "collide & error"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "error" ? "DUPLICATE KEY ERROR" : phase === "merged" ? (isId ? "DI-MERGE: 10 → 15" : "MERGED: 10 → 15") : phase === "conflict" ? (isId ? "KONFLIK KEY…" : "KEY CONFLICT…") : null}
      badgeColor={phase === "error" ? C.red : phase === "merged" ? C.green : C.amber}
      caption={caption}
      cells={[
        { l: "MODE", v: upsert ? "UPSERT" : "INSERT" },
        { l: isId ? "STOK sku-7" : "sku-7 STOCK", v: String(stock), color: stock > 10 ? C.green : undefined },
        { l: isId ? "HASIL" : "RESULT", v: phase === "error" ? "error" : phase === "merged" ? (isId ? "ter-update" : "updated") : "-", color: phase === "error" ? C.red : phase === "merged" ? C.green : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={APP.x + 40} y1={APP.y} x2={TABLE.x - 95} y2={TABLE.y} />
        <SvgNode x={APP.x} y={APP.y} w={84} h={48} label="APP" value="sku-7, +5" valueColor={C.accent} />

        <rect x={TABLE.x - 90} y={35} width={180} height={120} rx={10} fill={C.node} stroke={phase === "error" ? C.red : phase === "merged" ? C.green : C.stroke} strokeWidth="1.3" />
        <SvgText x={TABLE.x} y={53} size={9.5} weight={800} color={C.text}>
          PRODUCTS · PK(sku)
        </SvgText>
        <rect x={TABLE.x - 75} y={64} width={150} height={24} rx={5} fill="#ffffff08" stroke="#ffffff14" />
        <SvgText x={TABLE.x - 40} y={80} size={10} color={C.dim}>
          sku-3
        </SvgText>
        <SvgText x={TABLE.x + 40} y={80} size={10} color={C.dim}>
          24
        </SvgText>
        <rect
          x={TABLE.x - 75}
          y={94}
          width={150}
          height={24}
          rx={5}
          fill={phase === "merged" ? "#1f9d5c22" : phase === "conflict" || phase === "error" ? "#d8514b22" : "#ffffff08"}
          stroke={phase === "merged" ? C.green : phase === "conflict" || phase === "error" ? C.red : "#ffffff14"}
        />
        <SvgText x={TABLE.x - 40} y={110} size={10} weight={800} color={phase === "merged" ? C.green : phase === "conflict" || phase === "error" ? C.red : C.dim}>
          sku-7
        </SvgText>
        <SvgText x={TABLE.x + 40} y={110} size={10} weight={800} color={stock > 10 ? C.green : C.dim}>
          {stock}
        </SvgText>
        <SvgText x={TABLE.x} y={145} size={9} color={C.faint}>
          {upsert ? "INSERT … ON CONFLICT (sku) DO UPDATE SET stock = stock + 5" : "INSERT INTO products VALUES ('sku-7', 5)"}
        </SvgText>
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
