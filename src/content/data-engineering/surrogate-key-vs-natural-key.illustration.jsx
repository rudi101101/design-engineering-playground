import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgText, useTimers } from "../../illustrations/simKit.jsx";

export default function SurrogateKeyIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [surrogate, setSurrogate] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | changing | cascading | broken | isolated

  const referencingTables = ["orders", "invoices", "shipments", "reviews"];

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPhase("changing");
    timers.after(600, () => {
      setPhase("cascading");
      timers.after(700, () => {
        setPhase(surrogate ? "isolated" : "broken");
        setRunning(false);
      });
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Ubah email jadi kunci bisnis" : "Business changes their email",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "customer memakai email sebagai kunci — lalu perusahaan pindah domain, email berubah"
      : "a customer uses email as the key — then the company changes domains, the email changes",
    changing: isId ? "email berubah: andi@lama.com → andi@baru.com…" : "email changes: andi@old.com → andi@new.com…",
    cascading: isId ? "4 tabel lain mereferensikan email ini sebagai foreign key…" : "4 other tables reference this email as a foreign key…",
    brokenDone: isId
      ? "natural key: SEMUA foreign key di 4 tabel harus di-UPDATE beruntun (cascade) — rawan gagal separuh jalan dan mahal di tabel besar"
      : "natural key: EVERY foreign key across 4 tables must cascade-UPDATE — risky to fail halfway, and expensive on large tables",
    isolatedDone: isId
      ? "surrogate key (id=482, angka buatan) tidak pernah berubah — email cukup di-UPDATE di SATU baris customers, tabel lain tak tersentuh"
      : "the surrogate key (id=482, a made-up number) never changes — the email is updated in just ONE customers row, other tables stay untouched",
  };

  let caption = s.idle;
  if (phase === "changing") caption = s.changing;
  else if (phase === "cascading") caption = s.cascading;
  else if (phase === "broken") caption = s.brokenDone;
  else if (phase === "isolated") caption = s.isolatedDone;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge on={surrogate} onClick={() => !running && setSurrogate((v) => !v)} labelOn={isId ? "SURROGATE KEY (id)" : "SURROGATE KEY (id)"} labelOff={isId ? "NATURAL KEY (email)" : "NATURAL KEY (email)"} tagOn={isId ? "tidak pernah berubah" : "never changes"} tagOff={isId ? "bisa berubah" : "can change"} />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "broken" ? (isId ? "4 CASCADE UPDATE BERISIKO" : "4 RISKY CASCADE UPDATES") : phase === "isolated" ? (isId ? "1 UPDATE, TERISOLASI" : "1 UPDATE, ISOLATED") : null}
      badgeColor={phase === "broken" ? C.red : C.green}
      caption={caption}
      cells={[
        { l: isId ? "KUNCI" : "KEY", v: surrogate ? "id (int)" : "email" },
        { l: isId ? "TABEL TERSENTUH" : "TABLES TOUCHED", v: phase === "broken" ? "5" : phase === "isolated" ? "1" : "-", color: phase === "broken" ? C.red : phase === "isolated" ? C.green : undefined },
        { l: isId ? "STABIL?" : "STABLE?", v: surrogate ? (isId ? "ya" : "yes") : (isId ? "tidak" : "no"), color: surrogate ? C.green : C.red },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <rect x={230} y={70} width={140} height={50} rx={8} fill={C.node} stroke={phase !== "idle" ? C.amber : C.stroke} strokeWidth="1.3" />
        <SvgText x={300} y={90} size={9} color={C.faint}>
          CUSTOMERS
        </SvgText>
        <SvgText x={300} y={106} size={10} weight={800} color={phase !== "idle" ? C.amber : C.dim}>
          {surrogate ? "id=482" : "email ✎"}
        </SvgText>

        {referencingTables.map((t, i) => {
          const angle = -70 + i * 47;
          const rad = (angle * Math.PI) / 180;
          const r = 130;
          const x = 300 + r * Math.sin(rad);
          const y = 155 - r * Math.cos(rad) * 0.55;
          const touched = phase === "cascading" || phase === "broken";
          const failed = phase === "broken" && i === referencingTables.length - 1;
          return (
            <g key={t}>
              <line x1={300} y1={95} x2={x} y2={y} stroke={!surrogate && touched ? (failed ? C.red : C.amber) : C.grid} strokeWidth={!surrogate && touched ? 1.5 : 1} strokeDasharray={surrogate ? "3 3" : undefined} />
              <rect x={x - 40} y={y - 14} width={80} height={26} rx={5} fill={C.node} stroke={!surrogate && touched ? (failed ? C.red : C.amber) : C.stroke} strokeWidth={!surrogate && touched ? 1.4 : 1} />
              <SvgText x={x} y={y + 4} size={8.5} weight={600} color={!surrogate && touched ? (failed ? C.red : C.amber) : C.faint}>
                {t} {failed ? "✗" : !surrogate && touched ? "↺" : ""}
              </SvgText>
            </g>
          );
        })}
      </svg>
    </SimShell>
  );
}
