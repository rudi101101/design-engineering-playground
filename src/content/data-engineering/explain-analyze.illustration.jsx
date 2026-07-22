import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgText, useTimers } from "../../illustrations/simKit.jsx";

export default function ExplainAnalyzeIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [analyze, setAnalyze] = useState(false);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);

  const planOnly = [
    { label: "Seq Scan on orders", est: "cost=0.00..2100.00", real: null },
    { label: "Filter: status = 'paid'", est: "rows=5000 (est)", real: null },
  ];
  const planAnalyze = [
    { label: "Seq Scan on orders", est: "cost=0.00..2100.00", real: "actual time=0.02..38.11 rows=42" },
    { label: "Filter: status = 'paid'", est: "rows=5000 (est)", real: "rows=42 (actual) ⚠ misestimate 119×" },
  ];

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setStep(-1);
    const plan = analyze ? planAnalyze : planOnly;
    plan.forEach((_, i) => {
      timers.after(500 * (i + 1), () => {
        setStep(i);
        if (i === plan.length - 1) setRunning(false);
      });
    });
  }

  const plan = analyze ? planAnalyze : planOnly;

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: analyze ? "EXPLAIN ANALYZE" : "EXPLAIN",
    running: isId ? "Menjalankan query…" : "Running query…",
    idle: isId
      ? "planner memperkirakan 5000 baris cocok filter — tapi apakah tebakannya benar?"
      : "the planner estimates 5000 rows will match the filter — but is that guess right?",
    doneEstimate: isId
      ? "EXPLAIN hanya menunjukkan rencana & PERKIRAAN — query TIDAK benar-benar dijalankan, angka rows bisa jauh meleset"
      : "EXPLAIN only shows the plan & the ESTIMATE — the query is NOT actually executed, the row count can be way off",
    doneActual: isId
      ? "EXPLAIN ANALYZE benar-benar MENJALANKAN query & mengukur waktu nyata — di sini perkiraan 5000 meleset 119× dari kenyataan 42, tanda index yang hilang atau statistik basi"
      : "EXPLAIN ANALYZE actually RUNS the query & measures real timing — here the 5000 estimate is 119× off from the real 42, a sign of a missing index or stale statistics",
  };

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={analyze}
            onClick={() => !running && setAnalyze((v) => !v)}
            labelOn="EXPLAIN ANALYZE"
            labelOff="EXPLAIN"
            tagOn={isId ? "eksekusi nyata" : "actually executes"}
            tagOff={isId ? "hanya perkiraan" : "estimate only"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={step === plan.length - 1 && analyze ? (isId ? "MISESTIMATE 119×" : "119× MISESTIMATE") : null}
      badgeColor={C.amber}
      caption={step < 0 ? s.idle : step === plan.length - 1 ? (analyze ? s.doneActual : s.doneEstimate) : isId ? "membangun rencana query…" : "building the query plan…"}
      cells={[
        { l: isId ? "MODE" : "MODE", v: analyze ? "ANALYZE" : "plan-only" },
        { l: isId ? "EST. ROWS" : "EST. ROWS", v: "5000" },
        { l: isId ? "ROWS NYATA" : "ACTUAL ROWS", v: analyze && step === plan.length - 1 ? "42" : "-", color: analyze && step === plan.length - 1 ? C.red : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        {plan.map((p, i) => {
          const active = step >= i;
          const y = 30 + i * 66;
          return (
            <g key={i} opacity={active ? 1 : 0.3}>
              <rect x={50} y={y} width={500} height={54} rx={8} fill={C.node} stroke={active ? C.accent : C.stroke} strokeWidth={active ? 1.4 : 1} />
              <SvgText x={68} y={y + 20} anchor="start" size={10.5} weight={800} color={C.text}>
                {p.label}
              </SvgText>
              <SvgText x={68} y={y + 36} anchor="start" size={9} color={C.faint}>
                {p.est}
              </SvgText>
              {p.real && active && (
                <SvgText x={68} y={y + 50} anchor="start" size={9} weight={700} color={p.real.includes("⚠") ? C.red : C.green}>
                  {p.real}
                </SvgText>
              )}
            </g>
          );
        })}
      </svg>
    </SimShell>
  );
}
