import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const CLIENT = { x: 80, y: 95 };
const SINGLE = { x: 470, y: 95 };
const SHARDS = [
  { x: 380, y: 40 },
  { x: 470, y: 95 },
  { x: 380, y: 150 },
];

export default function ShardingIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [sharded, setSharded] = useState(false);
  const [running, setRunning] = useState(false);
  const [load, setLoad] = useState([0, 0, 0]);
  const [singleLoad, setSingleLoad] = useState(0);
  const [done, setDone] = useState(false);

  const REQS = 9;

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setLoad([0, 0, 0]);
    setSingleLoad(0);
    setDone(false);

    for (let i = 0; i < REQS; i++) {
      timers.after(i * 150, () => {
        if (sharded) {
          const shardIdx = i % 3;
          const target = SHARDS[shardIdx];
          spawn(CLIENT, target, C.accent, 450, {
            arc: 8,
            onDone: () => {
              setLoad((l) => {
                const next = [...l];
                next[shardIdx] += 1;
                return next;
              });
              if (i === REQS - 1) {
                setDone(true);
                setRunning(false);
              }
            },
          });
        } else {
          spawn(CLIENT, SINGLE, C.amber, 450, {
            arc: 8,
            onDone: () => {
              setSingleLoad((n) => n + 1);
              if (i === REQS - 1) {
                setDone(true);
                setRunning(false);
              }
            },
          });
        }
      });
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Kirim 9 request" : "Send 9 requests",
    running: isId ? "Mendistribusikan…" : "Distributing…",
    idle: isId
      ? "9 request masuk berdasarkan user_id % 3 — bandingkan satu database vs 3 shard"
      : "9 requests arrive keyed by user_id % 3 — compare a single database vs 3 shards",
    doneSingle: isId
      ? "satu database menanggung semua 9 request — ia yang menjadi bottleneck saat traffic naik"
      : "a single database absorbs all 9 requests — it becomes the bottleneck as traffic grows",
    doneSharded: isId
      ? "beban terbagi rata 3-3-3 ke shard berbeda — tiap shard hanya menangani sepertiga beban, dan bisa diskalakan sendiri-sendiri"
      : "load is spread evenly 3-3-3 across shards — each shard handles a third of the load, and can scale independently",
  };

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={sharded}
            onClick={() => {
              if (running) return;
              setSharded((v) => !v);
              setLoad([0, 0, 0]);
              setSingleLoad(0);
              setDone(false);
            }}
            labelOn={isId ? "3 SHARD" : "3 SHARDS"}
            labelOff={isId ? "SATU DATABASE" : "SINGLE DATABASE"}
            tagOn="user_id % 3"
            tagOff={isId ? "semua beban" : "all the load"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      caption={done ? (sharded ? s.doneSharded : s.doneSingle) : s.idle}
      cells={
        sharded
          ? [
              { l: "SHARD 0", v: String(load[0]), color: load[0] > 0 ? C.green : undefined },
              { l: "SHARD 1", v: String(load[1]), color: load[1] > 0 ? C.green : undefined },
              { l: "SHARD 2", v: String(load[2]), color: load[2] > 0 ? C.green : undefined },
            ]
          : [{ l: isId ? "BEBAN DB" : "DB LOAD", v: String(singleLoad), color: singleLoad >= REQS ? C.amber : undefined }]
      }
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <SvgNode x={CLIENT.x} y={CLIENT.y} w={80} h={44} label="CLIENTS" />

        {sharded ? (
          SHARDS.map((sh, i) => (
            <g key={i}>
              <Wire x1={CLIENT.x + 40} y1={CLIENT.y} x2={sh.x - 55} y2={sh.y} />
              <SvgNode x={sh.x} y={sh.y} w={110} h={44} label={`SHARD ${i}`} value={load[i] > 0 ? `${load[i]} req` : null} valueColor={C.green} />
            </g>
          ))
        ) : (
          <g>
            <Wire x1={CLIENT.x + 40} y1={CLIENT.y} x2={SINGLE.x - 60} y2={SINGLE.y} color={singleLoad >= REQS ? C.amber : C.grid} />
            <SvgNode x={SINGLE.x} y={SINGLE.y} w={120} h={64} label="DATABASE" value={singleLoad > 0 ? `${singleLoad} req` : null} valueColor={singleLoad >= REQS ? C.amber : C.dim} stroke={singleLoad >= REQS ? C.amber : C.stroke} />
          </g>
        )}
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
