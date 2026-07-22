import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useTimers } from "../../illustrations/simKit.jsx";

const ROWS = 8;
const TARGET = 5; // row index the query is looking for
const ROW_X = 470;
const ROW_Y0 = 28;
const ROW_H = 19;

export default function DatabaseIndexIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [indexed, setIndexed] = useState(false);
  const [running, setRunning] = useState(false);
  const [visited, setVisited] = useState([]); // row indices touched
  const [treeStep, setTreeStep] = useState(0); // 0 none, 1 root, 2 leaf, 3 row
  const [steps, setSteps] = useState(null);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setVisited([]);
    setTreeStep(0);
    setSteps(null);

    if (!indexed) {
      for (let i = 0; i <= TARGET; i++) {
        timers.after(260 * (i + 1), () => {
          setVisited((v) => [...v, i]);
          if (i === TARGET) {
            setSteps(TARGET + 1);
            setRunning(false);
          }
        });
      }
    } else {
      timers.after(300, () => setTreeStep(1));
      timers.after(650, () => setTreeStep(2));
      timers.after(1000, () => {
        setTreeStep(3);
        setVisited([TARGET]);
        setSteps(3);
        setRunning(false);
      });
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Jalankan query" : "Run query",
    running: isId ? "Mencari…" : "Searching…",
    idle: isId
      ? "cari baris dengan id = 6 — bandingkan seq scan (tanpa index) vs index scan (B-tree)"
      : "find the row with id = 6 — compare seq scan (no index) vs index scan (B-tree)",
    seqDone: isId
      ? "seq scan memeriksa baris satu per satu dari atas — 6 baris disentuh hanya untuk menemukan 1"
      : "seq scan checks rows one by one from the top — 6 rows touched just to find 1",
    idxDone: isId
      ? "B-tree: root → leaf → langsung lompat ke baris — 3 langkah, tidak peduli tabel berisi jutaan baris"
      : "B-tree: root → leaf → jump straight to the row — 3 steps, no matter if the table has millions of rows",
  };

  let caption = s.idle;
  if (steps !== null) caption = indexed ? s.idxDone : s.seqDone;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={indexed}
            onClick={() => !running && setIndexed((v) => !v)}
            labelOn={isId ? "DENGAN INDEX" : "WITH INDEX"}
            labelOff={isId ? "TANPA INDEX" : "NO INDEX"}
            tagOn="B-tree"
            tagOff="seq scan"
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      caption={caption}
      cells={[
        { l: isId ? "METODE" : "METHOD", v: indexed ? "index scan" : "seq scan" },
        { l: isId ? "BARIS DISENTUH" : "ROWS TOUCHED", v: steps === null ? "-" : indexed ? "1" : String(TARGET + 1), color: steps === null ? undefined : indexed ? C.green : C.amber },
        { l: isId ? "LANGKAH" : "STEPS", v: steps === null ? "-" : String(steps), color: steps === null ? undefined : indexed ? C.green : C.amber },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgNode x={80} y={95} w={100} h={40} label="QUERY" value="id = 6" valueColor={C.accent} />

        {indexed && (
          <g>
            <SvgNode x={280} y={45} w={80} h={28} rx={7} label="ROOT" stroke={treeStep >= 1 ? C.accent : C.stroke} />
            <SvgNode x={280} y={125} w={80} h={28} rx={7} label="LEAF 4–8" stroke={treeStep >= 2 ? C.accent : C.stroke} />
            <Wire x1={280} y1={59} x2={280} y2={111} color={treeStep >= 2 ? C.accent : C.grid} />
            <Wire x1={130} y1={95} x2={240} y2={50} color={treeStep >= 1 ? C.accent : C.grid} />
            <Wire x1={320} y1={125} x2={ROW_X - 55} y2={ROW_Y0 + TARGET * ROW_H + 8} color={treeStep >= 3 ? C.accent : C.grid} />
          </g>
        )}
        {!indexed && <Wire x1={130} y1={95} x2={ROW_X - 55} y2={ROW_Y0 + 8} />}

        {Array.from({ length: ROWS }, (_, i) => {
          const hit = visited.includes(i);
          const isTarget = i === TARGET;
          const y = ROW_Y0 + i * ROW_H;
          return (
            <g key={i}>
              <rect x={ROW_X - 55} y={y} width={110} height={ROW_H - 3} rx={4} fill={C.node} stroke={hit ? (isTarget ? C.green : C.amber) : C.stroke} strokeWidth={hit ? 1.6 : 1} />
              <SvgText x={ROW_X} y={y + 12} size={9} weight={hit ? 800 : 600} color={hit ? (isTarget ? C.green : C.amber) : C.faint}>
                id = {i + 1} {isTarget && steps !== null && visited.includes(i) ? "✓" : ""}
              </SvgText>
            </g>
          );
        })}
        <SvgText x={ROW_X} y={185} size={9} color={C.faint}>
          {isId ? "TABEL (8 baris)" : "TABLE (8 rows)"}
        </SvgText>
      </svg>
    </SimShell>
  );
}
