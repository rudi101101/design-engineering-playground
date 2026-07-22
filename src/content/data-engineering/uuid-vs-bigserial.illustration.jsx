import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgText, useTimers } from "../../illustrations/simKit.jsx";

const N = 8;

export default function UuidVsBigserialIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [useUuid, setUseUuid] = useState(false);
  const [running, setRunning] = useState(false);
  const [inserted, setInserted] = useState(0);

  const bigserialIds = [101, 102, 103, 104, 105, 106, 107, 108];
  const uuidIds = ["a1f3…", "7c02…", "e94b…", "1d88…", "b6f1…", "0a3e…", "d271…", "44c9…"];

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setInserted(0);
    for (let i = 1; i <= N; i++) {
      timers.after(i * 180, () => {
        setInserted(i);
        if (i === N) setRunning(false);
      });
    }
  }

  const ids = useUuid ? uuidIds : bigserialIds;

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? `INSERT ${N} baris berurutan` : `INSERT ${N} rows in sequence`,
    running: isId ? "Menyisipkan…" : "Inserting…",
    idle: isId
      ? "bandingkan bagaimana ID diberikan dan di mana baris baru mendarat di B-tree index"
      : "compare how ids are assigned and where new rows land in the B-tree index",
    doneBigserial: isId
      ? "bigserial naik urut — setiap INSERT menambah di ujung kanan halaman index terakhir, cache-friendly, tapi ID mudah ditebak"
      : "bigserial increases sequentially — every INSERT appends to the rightmost index page, cache-friendly, but ids are guessable",
    doneUuid: isId
      ? "UUID v4 acak — INSERT tersebar ke halaman index acak (page split lebih sering), tapi aman digabung antar-server tanpa tabrakan & tidak ditebak"
      : "UUID v4 is random — INSERTs scatter across random index pages (more page splits), but merges safely across servers without collisions and isn't guessable",
  };

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={useUuid}
            onClick={() => !running && setUseUuid((v) => !v)}
            labelOn="UUID v4"
            labelOff="BIGSERIAL"
            tagOn={isId ? "acak, aman digabung" : "random, merge-safe"}
            tagOff={isId ? "urut, cache-friendly" : "sequential, cache-friendly"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      caption={inserted === N ? (useUuid ? s.doneUuid : s.doneBigserial) : s.idle}
      cells={[
        { l: isId ? "TIPE ID" : "ID TYPE", v: useUuid ? "uuid (16B)" : "bigint (8B)" },
        { l: isId ? "DISISIPKAN" : "INSERTED", v: `${inserted}/${N}` },
        { l: isId ? "POLA INDEX" : "INDEX PATTERN", v: useUuid ? (isId ? "acak" : "scattered") : (isId ? "berurutan" : "sequential"), color: useUuid ? C.amber : C.green },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgText x={300} y={16} size={9} color={C.faint}>
          {isId ? "HALAMAN B-TREE INDEX" : "B-TREE INDEX PAGES"}
        </SvgText>
        {Array.from({ length: N }, (_, i) => {
          const hit = i < inserted;
          const seqX = 60 + i * 62;
          const uuidPositions = [280, 60, 460, 340, 120, 400, 200, 520];
          const x = useUuid ? uuidPositions[i] : seqX;
          const y = useUuid ? 60 + (i % 3) * 40 : 60;
          return (
            <g key={i} opacity={hit ? 1 : 0.25}>
              <rect x={x} y={y} width={52} height={30} rx={5} fill={hit ? (useUuid ? "#b3791a22" : "#1f9d5c22") : C.node} stroke={hit ? (useUuid ? C.amber : C.green) : C.stroke} strokeWidth={hit ? 1.4 : 1} />
              <SvgText x={x + 26} y={y + 19} size={8.5} weight={700} color={hit ? (useUuid ? C.amber : C.green) : C.faint}>
                {ids[i]}
              </SvgText>
            </g>
          );
        })}
        <SvgText x={300} y={178} size={9} color={C.faint}>
          {useUuid ? (isId ? "tersebar → lebih banyak page split" : "scattered → more page splits") : (isId ? "menempel di ujung kanan → append cepat" : "appends to the right edge → fast writes")}
        </SvgText>
      </svg>
    </SimShell>
  );
}
