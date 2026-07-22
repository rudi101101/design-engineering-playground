import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, useTimers } from "../../illustrations/simKit.jsx";

export default function TransactionSavepointIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [useSavepoint, setUseSavepoint] = useState(true);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0); // 0..3: insert order, insert item1, insert item2(fails), resolved
  const [failed, setFailed] = useState(false);
  const [rolledAll, setRolledAll] = useState(false);

  const steps = [
    { label: isId ? "INSERT order" : "INSERT order", ok: true },
    { label: isId ? "INSERT item #1" : "INSERT item #1", ok: true },
    { label: isId ? "INSERT item #2" : "INSERT item #2", ok: false },
  ];

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setStep(0);
    setFailed(false);
    setRolledAll(false);

    timers.after(400, () => setStep(1));
    timers.after(800, () => setStep(2));
    timers.after(1200, () => {
      setFailed(true);
      timers.after(900, () => {
        if (!useSavepoint) setRolledAll(true);
        setRunning(false);
      });
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Jalankan transaksi" : "Run transaction",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "satu transaksi: buat order, tambah item #1 (ok), tambah item #2 (gagal — stok habis)"
      : "one transaction: create order, add item #1 (ok), add item #2 (fails — out of stock)",
    withSp: isId
      ? "SAVEPOINT sebelum item #2: hanya item #2 yang dibatalkan (ROLLBACK TO sp) — order & item #1 tetap COMMIT"
      : "SAVEPOINT before item #2: only item #2 is undone (ROLLBACK TO sp) — the order & item #1 still COMMIT",
    noSp: isId
      ? "tanpa savepoint: satu error membatalkan SELURUH transaksi — order & item #1 yang sudah benar ikut hilang"
      : "without a savepoint: one error rolls back the WHOLE transaction — the already-good order & item #1 vanish too",
  };

  let caption = s.idle;
  if (running && !failed) caption = isId ? `${steps[step].label}…` : `${steps[step].label}…`;
  else if (failed) caption = useSavepoint ? s.withSp : s.noSp;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={useSavepoint}
            onClick={() => !running && setUseSavepoint((v) => !v)}
            labelOn={isId ? "DENGAN SAVEPOINT" : "WITH SAVEPOINT"}
            labelOff={isId ? "TANPA SAVEPOINT" : "NO SAVEPOINT"}
            tagOn={isId ? "rollback parsial" : "partial rollback"}
            tagOff={isId ? "rollback total" : "full rollback"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={failed ? (useSavepoint ? (isId ? "ITEM #2 DIBATALKAN SAJA" : "ONLY ITEM #2 UNDONE") : (isId ? "SELURUH TRANSAKSI DIBATALKAN" : "ENTIRE TRANSACTION UNDONE")) : null}
      badgeColor={failed && useSavepoint ? C.green : C.red}
      caption={caption}
      cells={[
        { l: "SAVEPOINT", v: useSavepoint ? "sp_before_item2" : "-", color: useSavepoint ? C.green : undefined },
        { l: "ORDER", v: rolledAll ? (isId ? "hilang" : "lost") : failed ? "COMMIT" : "-", color: rolledAll ? C.red : failed ? C.green : undefined },
        { l: "ITEM #1", v: rolledAll ? (isId ? "hilang" : "lost") : failed ? "COMMIT" : "-", color: rolledAll ? C.red : failed ? C.green : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <rect x={40} y={20} width={520} height={40} rx={8} fill={C.node} stroke={C.accent + "88"} strokeWidth="1.3" />
        <SvgText x={300} y={44} size={10} weight={800} color={C.accent}>
          BEGIN TRANSACTION
        </SvgText>

        {steps.map((st, i) => {
          const active = step >= i;
          const isFailStep = i === 2 && failed;
          const undone = rolledAll && active;
          const x = 90 + i * 190;
          return (
            <g key={i}>
              <rect
                x={x - 80}
                y={78}
                width={160}
                height={40}
                rx={8}
                fill={isFailStep ? "#d8514b22" : active ? (undone ? "#d8514b18" : "#1f9d5c18") : C.node}
                stroke={isFailStep ? C.red : active ? (undone ? C.red : C.green) : C.stroke}
                strokeWidth={active ? 1.5 : 1}
              />
              <SvgText x={x} y={102} size={10} weight={700} color={isFailStep ? C.red : active ? (undone ? C.red : C.green) : C.faint}>
                {st.label} {isFailStep ? "✗" : active ? (undone ? "↺" : "✓") : ""}
              </SvgText>
            </g>
          );
        })}

        {useSavepoint && (
          <g>
            <line x1={280} y1={70} x2={280} y2={135} stroke={C.amber} strokeWidth="1.4" strokeDasharray="3 3" />
            <SvgText x={280} y={150} size={9} color={C.amber} weight={700}>
              SAVEPOINT sp
            </SvgText>
          </g>
        )}

        <SvgText x={300} y={178} size={9} color={C.faint}>
          {failed
            ? useSavepoint
              ? (isId ? "ROLLBACK TO sp → COMMIT" : "ROLLBACK TO sp → COMMIT")
              : "ROLLBACK"
            : isId
            ? "menjalankan langkah demi langkah…"
            : "running step by step…"}
        </SvgText>
      </svg>
    </SimShell>
  );
}
