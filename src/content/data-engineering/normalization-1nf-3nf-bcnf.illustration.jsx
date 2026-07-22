import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgText, useTimers } from "../../illustrations/simKit.jsx";

export default function NormalizationIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [normalized, setNormalized] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | update | anomaly | clean

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPhase("update");
    timers.after(700, () => {
      setPhase(normalized ? "clean" : "anomaly");
      setRunning(false);
    });
  }

  const flatRows = [
    { order: 101, product: "Keyboard", customer: "Andi", city: "Jakarta" },
    { order: 102, product: "Mouse", customer: "Andi", city: "Jakarta" },
    { order: 103, product: "Monitor", customer: "Andi", city: "Jakarta" },
  ];

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "UPDATE kota Andi → Bandung" : "UPDATE Andi's city → Bandung",
    running: isId ? "Meng-update…" : "Updating…",
    idle: isId
      ? "tabel flat menyimpan city berulang di tiap baris order milik Andi — Andi baru saja pindah kota"
      : "the flat table repeats city on every one of Andi's order rows — Andi just moved cities",
    anomaly: isId
      ? "update anomaly: lupa update salah satu baris → data Andi kini TIDAK KONSISTEN, kota berbeda di baris berbeda untuk orang yang sama"
      : "update anomaly: forget to update one row → Andi's data is now INCONSISTENT, different cities for the same person",
    clean: isId
      ? "3NF: city hanya ada SEKALI di tabel customers — UPDATE satu baris, otomatis benar di semua order Andi (via foreign key)"
      : "3NF: city lives in exactly ONE place in the customers table — UPDATE one row, it's automatically correct for all of Andi's orders (via foreign key)",
  };

  let caption = s.idle;
  if (phase === "update") caption = isId ? "menjalankan UPDATE…" : "running the UPDATE…";
  else if (phase === "anomaly") caption = s.anomaly;
  else if (phase === "clean") caption = s.clean;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge on={normalized} onClick={() => !running && setNormalized((v) => !v)} labelOn="3NF (TERNORMALISASI)" labelOff={isId ? "TABEL FLAT (BELUM NORMAL)" : "FLAT TABLE (UNNORMALIZED)"} tagOn={isId ? "city 1 tempat" : "city in 1 place"} tagOff={isId ? "city berulang" : "city repeated"} />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "anomaly" ? (isId ? "DATA TIDAK KONSISTEN" : "INCONSISTENT DATA") : phase === "clean" ? (isId ? "SATU SUMBER KEBENARAN" : "SINGLE SOURCE OF TRUTH") : null}
      badgeColor={phase === "anomaly" ? C.red : C.green}
      caption={caption}
      cells={[
        { l: isId ? "SKEMA" : "SCHEMA", v: normalized ? "3NF" : "flat" },
        { l: isId ? "SALINAN 'CITY'" : "'CITY' COPIES", v: normalized ? "1" : "3", color: normalized ? C.green : C.amber },
        { l: isId ? "RISIKO ANOMALI" : "ANOMALY RISK", v: normalized ? (isId ? "tidak ada" : "none") : (isId ? "tinggi" : "high"), color: normalized ? C.green : C.red },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        {!normalized ? (
          <g>
            <SvgText x={300} y={16} size={9} color={C.faint}>
              ORDERS (flat)
            </SvgText>
            {flatRows.map((r, i) => {
              const y = 26 + i * 42;
              const changed = phase === "anomaly" && i < 2;
              const missed = phase === "anomaly" && i === 2;
              return (
                <g key={r.order}>
                  <rect x={60} y={y} width={480} height={34} rx={6} fill={C.node} stroke={missed ? C.red : changed ? C.green : C.stroke} strokeWidth={missed || changed ? 1.5 : 1} />
                  <SvgText x={100} y={y + 21} anchor="start" size={9.5} color={C.dim}>
                    #{r.order}
                  </SvgText>
                  <SvgText x={180} y={y + 21} anchor="start" size={9.5} color={C.dim}>
                    {r.product}
                  </SvgText>
                  <SvgText x={320} y={y + 21} anchor="start" size={9.5} color={C.dim}>
                    {r.customer}
                  </SvgText>
                  <SvgText x={450} y={y + 21} anchor="start" size={10} weight={800} color={missed ? C.red : changed ? C.green : C.dim}>
                    {missed ? "Jakarta ⚠" : changed ? "Bandung ✓" : r.city}
                  </SvgText>
                </g>
              );
            })}
          </g>
        ) : (
          <g>
            <rect x={60} y={30} width={190} height={130} rx={8} fill={C.node} stroke={C.green} strokeWidth="1.3" />
            <SvgText x={155} y={48} size={9.5} weight={800} color={C.text}>
              CUSTOMERS
            </SvgText>
            <SvgText x={155} y={68} size={9.5} color={C.dim}>
              Andi
            </SvgText>
            <SvgText x={155} y={84} size={11} weight={800} color={phase === "clean" ? C.green : C.dim}>
              {phase === "clean" ? "Bandung ✓" : "Jakarta"}
            </SvgText>

            <rect x={330} y={22} width={220} height={146} rx={8} fill={C.node} stroke={C.stroke} strokeWidth="1.3" />
            <SvgText x={440} y={40} size={9.5} weight={800} color={C.text}>
              ORDERS (FK → customer)
            </SvgText>
            {[101, 102, 103].map((o, i) => (
              <SvgText key={o} x={440} y={62 + i * 20} size={9.5} color={C.dim}>
                #{o} → customer: Andi
              </SvgText>
            ))}
            <line x1={250} y1={95} x2={330} y2={95} stroke={C.green} strokeWidth="1.4" strokeDasharray="3 3" />
          </g>
        )}
      </svg>
    </SimShell>
  );
}
