import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const APP = { x: 80, y: 95 };
const DB = { x: 500, y: 95 };
const N_USERS = 5;

export default function OrmVsRawSqlIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [naive, setNaive] = useState(true); // naive ORM lazy-loading => N+1
  const [running, setRunning] = useState(false);
  const [queries, setQueries] = useState(0);
  const [done, setDone] = useState(false);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setQueries(0);
    setDone(false);

    if (naive) {
      spawn(APP, DB, C.accent, 350, { arc: 10, onDone: () => setQueries((n) => n + 1) });
      for (let i = 0; i < N_USERS; i++) {
        timers.after(400 + i * 220, () => {
          spawn(APP, DB, C.amber, 300, {
            arc: 8,
            onDone: () => {
              setQueries((n) => n + 1);
              if (i === N_USERS - 1) {
                setDone(true);
                setRunning(false);
              }
            },
          });
        });
      }
    } else {
      spawn(APP, DB, C.green, 500, {
        arc: 14,
        onDone: () => {
          setQueries(1);
          setDone(true);
          setRunning(false);
        },
      });
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Ambil 5 order + nama user" : "Fetch 5 orders + user names",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "tampilkan 5 order beserta nama user pemiliknya — bagaimana query dibangun menentukan jumlah round-trip ke DB"
      : "render 5 orders with their owning user's name — how the query is built decides the number of DB round-trips",
    lazyStep: isId ? "ORM lazy-load: 1 query ambil order, lalu loop memanggil order.user satu-per-satu…" : "ORM lazy-load: 1 query fetches orders, then a loop calls order.user one at a time…",
    doneLazy: isId
      ? "N+1 query: 1 untuk order + 5 untuk tiap user — makin banyak baris, makin banyak round-trip, latensi meledak linear"
      : "N+1 queries: 1 for orders + 5 for each user — the more rows, the more round-trips, latency explodes linearly",
    doneJoin: isId
      ? "satu query JOIN (atau eager loading) mengambil semuanya sekaligus — 1 round-trip, tanpa peduli jumlah baris"
      : "one JOIN query (or eager loading) fetches everything at once — 1 round-trip, regardless of row count",
  };

  let caption = s.idle;
  if (running && naive && queries < N_USERS + 1) caption = s.lazyStep;
  else if (running && !naive) caption = isId ? "menjalankan JOIN…" : "running the JOIN…";
  else if (done) caption = naive ? s.doneLazy : s.doneJoin;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={!naive}
            onClick={() => !running && setNaive((v) => !v)}
            labelOn={isId ? "SATU QUERY JOIN" : "SINGLE JOIN QUERY"}
            labelOff={isId ? "ORM LAZY-LOAD (N+1)" : "ORM LAZY-LOAD (N+1)"}
            tagOn={isId ? "1 round-trip" : "1 round-trip"}
            tagOff="N+1"
            colorOn={C.green}
            colorOff={C.red}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={done && naive ? `${N_USERS + 1} QUERIES (N+1)` : done && !naive ? "1 QUERY" : null}
      badgeColor={done && naive ? C.red : C.green}
      caption={caption}
      cells={[
        { l: isId ? "STRATEGI" : "STRATEGY", v: naive ? "lazy-load" : "JOIN / eager" },
        { l: isId ? "TOTAL QUERY" : "TOTAL QUERIES", v: String(queries), color: queries > 1 ? C.red : queries === 1 && done ? C.green : undefined },
        { l: isId ? "ROUND-TRIP" : "ROUND-TRIPS", v: done ? String(queries) : "-", color: done ? (naive ? C.red : C.green) : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgNode x={APP.x} y={APP.y} w={80} h={44} label="APP" />
        <Wire x1={APP.x + 40} y1={APP.y} x2={DB.x - 50} y2={DB.y} />
        <SvgNode x={DB.x} y={DB.y} w={100} h={56} label="DATABASE" value={`${queries} ${isId ? "query" : "queries"}`} valueColor={naive && queries > 1 ? C.red : C.green} stroke={naive && queries > N_USERS ? C.red : C.stroke} />

        <SvgText x={300} y={20} size={9} color={C.faint}>
          {naive ? (isId ? "1 query order + 5 query user terpisah" : "1 orders query + 5 separate user queries") : (isId ? "1 query JOIN orders ⨝ users" : "1 JOIN query: orders ⨝ users")}
        </SvgText>
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
