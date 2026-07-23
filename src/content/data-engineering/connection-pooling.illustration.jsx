import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const CLIENTS = 6;
const MAX_CONN = 4;
const POOL_SIZE = 3;
const CLIENT_X = 70;
const POOL = { x: 300, y: 95 };
const DB = { x: 510, y: 95 };

export default function ConnectionPoolingIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [pooled, setPooled] = useState(false);
  const [running, setRunning] = useState(false);
  const [served, setServed] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [openConns, setOpenConns] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    timers.clear();
    setRunning(false);
    setServed(0);
    setRejected(0);
    setOpenConns(0);
    setDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pooled]);

  const clientY = (i) => 30 + i * 26;

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setServed(0);
    setRejected(0);
    setOpenConns(0);
    setDone(false);

    if (!pooled) {
      // burst: every client opens its own connection; DB caps at MAX_CONN
      for (let i = 0; i < CLIENTS; i++) {
        timers.after(i * 160, () => {
          const ok = i < MAX_CONN;
          spawn({ x: CLIENT_X + 30, y: clientY(i) }, DB, ok ? C.accent : C.red, 700, {
            arc: 8,
            onDone: () => {
              if (ok) {
                setOpenConns((c) => c + 1);
                setServed((n) => n + 1);
              } else {
                setRejected((n) => n + 1);
              }
              if (i === CLIENTS - 1) {
                setDone(true);
                setRunning(false);
              }
            },
          });
        });
      }
    } else {
      setOpenConns(POOL_SIZE);
      // clients borrow from the pool; extras queue and reuse released conns
      for (let i = 0; i < CLIENTS; i++) {
        const wave = Math.floor(i / POOL_SIZE);
        timers.after(i * 140 + wave * 500, () => {
          spawn({ x: CLIENT_X + 30, y: clientY(i) }, POOL, C.green, 450, {
            arc: 6,
            onDone: () => {
              spawn(POOL, DB, C.green, 350, {
                arc: 4,
                onDone: () => {
                  setServed((n) => n + 1);
                  if (i === CLIENTS - 1) {
                    setDone(true);
                    setRunning(false);
                  }
                },
              });
            },
          });
        });
      }
    }
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Kirim 6 request" : "Send 6 requests",
    running: isId ? "Melayani…" : "Serving…",
    idleOff: isId
      ? "6 client masing-masing membuka koneksi baru — padahal max_connections DB hanya 4"
      : "6 clients each open a brand-new connection — but the DB max_connections is only 4",
    idleOn: isId
      ? "6 client meminjam dari pool berisi 3 koneksi yang sudah terbuka dan dipakai bergantian"
      : "6 clients borrow from a pool of 3 already-open connections, reused in turns",
    doneOff: isId
      ? "handshake koneksi itu mahal, dan 2 request terakhir ditolak: “too many connections”"
      : "connection handshakes are expensive, and the last 2 requests got “too many connections”",
    doneOn: isId
      ? "tidak ada handshake baru & tidak ada penolakan — koneksi yang selesai langsung dipakai antrean berikutnya"
      : "no new handshakes & no rejections — released connections are immediately reused by the queue",
  };

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={pooled}
            onClick={() => !running && setPooled((v) => !v)}
            labelOn={isId ? "DENGAN POOL" : "WITH POOL"}
            labelOff={isId ? "TANPA POOL" : "NO POOL"}
            tagOn={isId ? "3 koneksi re-use" : "3 conns reused"}
            tagOff={isId ? "koneksi baru terus" : "new conn each time"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={done && !pooled ? "TOO MANY CONNECTIONS" : null}
      badgeColor={C.red}
      caption={done ? (pooled ? s.doneOn : s.doneOff) : pooled ? s.idleOn : s.idleOff}
      cells={[
        { l: isId ? "KONEKSI DB" : "DB CONNS", v: String(openConns), color: openConns >= MAX_CONN ? C.amber : openConns > 0 ? C.green : undefined },
        { l: isId ? "TERLAYANI" : "SERVED", v: `${served}/${CLIENTS}`, color: served === CLIENTS ? C.green : undefined },
        { l: isId ? "DITOLAK" : "REJECTED", v: String(rejected), color: rejected > 0 ? C.red : C.green },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        {Array.from({ length: CLIENTS }, (_, i) => (
          <g key={i}>
            <circle cx={CLIENT_X} cy={clientY(i)} r={9} fill={C.node} stroke={C.stroke} strokeWidth="1.2" />
            <SvgText x={CLIENT_X} y={clientY(i) + 3.5} size={8} color={C.dim}>
              C{i + 1}
            </SvgText>
          </g>
        ))}
        <SvgText x={CLIENT_X} y={185} size={9} color={C.faint}>
          {isId ? "6 CLIENT" : "6 CLIENTS"}
        </SvgText>

        {pooled && (
          <g>
            <SvgNode x={POOL.x} y={POOL.y} w={110} h={70} label="POOL" stroke={C.green} />
            {Array.from({ length: POOL_SIZE }, (_, i) => (
              <rect key={i} x={POOL.x - 39 + i * 27} y={POOL.y + 2} width={24} height={14} rx={4} fill={openConns > 0 ? "#1f9d5c33" : C.node} stroke={C.green} strokeWidth="1" />
            ))}
            <Wire x1={POOL.x + 55} y1={POOL.y} x2={DB.x - 50} y2={DB.y} color={C.green} dash="3 4" />
          </g>
        )}
        {!pooled && <Wire x1={CLIENT_X + 20} y1={95} x2={DB.x - 50} y2={DB.y} />}

        <SvgNode x={DB.x} y={DB.y} w={96} h={64} label="DATABASE" value={`${isId ? "maks" : "max"} ${MAX_CONN}`} valueColor={openConns >= MAX_CONN ? C.amber : C.dim} stroke={done && !pooled ? C.red : C.stroke} />
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
