import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgText, useTimers } from "../../illustrations/simKit.jsx";

const ROWS = [
  { dept: "Sales", name: "Andi", salary: 90 },
  { dept: "Sales", name: "Budi", salary: 75 },
  { dept: "Sales", name: "Citra", salary: 60 },
  { dept: "Eng", name: "Dewi", salary: 110 },
  { dept: "Eng", name: "Eko", salary: 95 },
];

export default function WindowFunctionIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [useWindow, setUseWindow] = useState(true);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setStep(-1);
    ROWS.forEach((_, i) => {
      timers.after(220 * (i + 1), () => {
        setStep(i);
        if (i === ROWS.length - 1) setRunning(false);
      });
    });
  }

  const groups = { Sales: ROWS.filter((r) => r.dept === "Sales").length, Eng: ROWS.filter((r) => r.dept === "Eng").length };
  const grouped = useWindow ? ROWS.length : Object.keys(groups).length;

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Ranking gaji per departemen" : "Rank salary per department",
    running: isId ? "Menghitung…" : "Computing…",
    idle: isId
      ? "beri ranking gaji di tiap departemen — TANPA menggabungkan barisnya jadi satu ringkasan"
      : "rank salary within each department — WITHOUT collapsing the rows into a single summary",
    doneGroupBy: isId
      ? "GROUP BY meleburkan tiap departemen jadi SATU baris ringkasan — detail per karyawan (nama, ranking) hilang"
      : "GROUP BY collapses each department into a SINGLE summary row — per-employee detail (name, rank) is lost",
    doneWindow: isId
      ? "RANK() OVER (PARTITION BY dept ORDER BY salary DESC) menjaga SEMUA baris asli, hanya menambah kolom ranking di sampingnya"
      : "RANK() OVER (PARTITION BY dept ORDER BY salary DESC) keeps ALL original rows, just adds a ranking column alongside",
  };

  const withRank = [...ROWS]
    .sort((a, b) => (a.dept > b.dept ? 1 : a.dept < b.dept ? -1 : b.salary - a.salary))
    .reduce((acc, r, i, arr) => {
      const rank = arr.filter((x) => x.dept === r.dept && x.salary > r.salary).length + 1;
      acc.push({ ...r, rank });
      return acc;
    }, []);

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge on={useWindow} onClick={() => !running && setUseWindow((v) => !v)} labelOn="RANK() OVER (...)" labelOff="GROUP BY" tagOn={isId ? "baris tetap utuh" : "rows stay intact"} tagOff={isId ? "baris diringkas" : "rows collapsed"} />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      caption={step < 0 ? s.idle : useWindow ? s.doneWindow : s.doneGroupBy}
      cells={[
        { l: isId ? "FUNGSI" : "FUNCTION", v: useWindow ? "window" : "aggregate" },
        { l: isId ? "BARIS MASUK" : "INPUT ROWS", v: String(ROWS.length) },
        { l: isId ? "BARIS KELUAR" : "OUTPUT ROWS", v: step >= 0 ? String(grouped) : "-", color: step >= 0 ? (useWindow ? C.green : C.amber) : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        {useWindow ? (
          withRank.map((r, i) => {
            const active = step >= i;
            const y = 12 + i * 32;
            return (
              <g key={r.name} opacity={active || step < 0 ? 1 : 0.3}>
                <rect x={70} y={y} width={460} height={26} rx={5} fill={C.node} stroke={active ? C.green : C.stroke} strokeWidth={active ? 1.3 : 1} />
                <SvgText x={100} y={y + 17} anchor="start" size={9.5} color={C.dim}>
                  {r.dept}
                </SvgText>
                <SvgText x={220} y={y + 17} anchor="start" size={9.5} color={C.dim}>
                  {r.name}
                </SvgText>
                <SvgText x={350} y={y + 17} anchor="start" size={9.5} color={C.dim}>
                  {r.salary}
                </SvgText>
                <SvgText x={480} y={y + 17} anchor="start" size={9.5} weight={800} color={active ? C.green : C.faint}>
                  {active ? `rank ${r.rank}` : "rank ?"}
                </SvgText>
              </g>
            );
          })
        ) : (
          Object.entries(groups).map(([dept, count], i) => {
            const active = step >= 0;
            const y = 50 + i * 60;
            return (
              <g key={dept} opacity={active ? 1 : 0.3}>
                <rect x={180} y={y} width={240} height={44} rx={8} fill={C.node} stroke={active ? C.amber : C.stroke} strokeWidth={active ? 1.4 : 1} />
                <SvgText x={300} y={y + 20} size={10} weight={800} color={active ? C.amber : C.faint}>
                  {dept}
                </SvgText>
                <SvgText x={300} y={y + 36} size={9} color={C.faint}>
                  {isId ? `${count} baris → 1 ringkasan` : `${count} rows → 1 summary`}
                </SvgText>
              </g>
            );
          })
        )}
      </svg>
    </SimShell>
  );
}
