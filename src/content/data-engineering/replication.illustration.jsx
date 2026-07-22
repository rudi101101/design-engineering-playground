import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, Wire, useParticles, useTimers } from "../../illustrations/simKit.jsx";

const CLIENT = { x: 90, y: 95 };
const PRIMARY = { x: 300, y: 95 };
const REPLICA = { x: 510, y: 95 };

export default function ReplicationIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const { layerRef, spawn } = useParticles();
  const timers = useTimers();

  const [sync, setSync] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | writing | acked | replicating | stale | consistent
  const [primaryVal, setPrimaryVal] = useState(100);
  const [replicaVal, setReplicaVal] = useState(100);
  const [readStale, setReadStale] = useState(false);

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPrimaryVal(100);
    setReplicaVal(100);
    setReadStale(false);
    setPhase("writing");

    spawn(CLIENT, PRIMARY, C.accent, 550, {
      arc: 14,
      onDone: () => {
        setPrimaryVal(150);
        if (sync) {
          setPhase("replicating");
          spawn(PRIMARY, REPLICA, C.amber, 600, {
            arc: 12,
            onDone: () => {
              setReplicaVal(150);
              setPhase("consistent");
              setRunning(false);
            },
          });
        } else {
          setPhase("acked");
          setRunning(false);
          spawn(PRIMARY, REPLICA, C.amber, 1400, {
            arc: 18,
            onDone: () => {
              setReplicaVal(150);
              setPhase("consistent");
            },
          });
          timers.after(500, () => {
            setReadStale(true);
            timers.after(700, () => setReadStale(false));
          });
        }
      },
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Tulis ke primary" : "Write to primary",
    running: isId ? "Berjalan…" : "Running…",
    idle: isId
      ? "client menulis saldo baru ke primary — kapan replica boleh dianggap aman untuk dibaca?"
      : "a client writes a new balance to primary — when is the replica safe to read from?",
    writing: isId ? "menulis ke PRIMARY…" : "writing to PRIMARY…",
    acked: isId
      ? "async: primary langsung ACK ke client — replikasi ke replica jalan di belakang, TIDAK menunggu"
      : "async: primary ACKs the client immediately — replication to the replica happens in the background, unwaited",
    replicating: isId ? "sync: primary MENUNGGU replica konfirmasi sebelum ACK ke client…" : "sync: primary WAITS for the replica to confirm before ACKing the client…",
    consistentSync: isId
      ? "ACK baru dikirim setelah replica ikut ter-update — pembaca replica tidak pernah melihat data basi, tapi latensi tulis naik"
      : "the ACK is sent only after the replica is updated too — replica readers never see stale data, but write latency goes up",
    consistentAsync: isId ? "replica akhirnya menyusul (150) — tapi ada jeda di mana ia masih basi" : "the replica eventually catches up (150) — but there was a window where it was stale",
  };

  let caption = s.idle;
  if (phase === "writing") caption = s.writing;
  else if (phase === "acked") caption = s.acked;
  else if (phase === "replicating") caption = s.replicating;
  else if (phase === "consistent") caption = sync ? s.consistentSync : s.consistentAsync;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={sync}
            onClick={() => !running && setSync((v) => !v)}
            labelOn={isId ? "REPLIKASI SYNC" : "SYNC REPLICATION"}
            labelOff={isId ? "REPLIKASI ASYNC" : "ASYNC REPLICATION"}
            tagOn={isId ? "tunggu replica" : "waits for replica"}
            tagOff={isId ? "ACK segera" : "ACKs immediately"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={readStale ? (isId ? "REPLICA MASIH BACA 100 (BASI)" : "REPLICA STILL READS 100 (STALE)") : null}
      badgeColor={C.amber}
      caption={caption}
      cells={[
        { l: "PRIMARY", v: String(primaryVal), color: primaryVal === 150 ? C.green : undefined },
        { l: "REPLICA", v: String(replicaVal), color: replicaVal === primaryVal ? C.green : C.amber },
        { l: isId ? "ACK KE CLIENT" : "CLIENT ACK", v: phase === "acked" ? (isId ? "cepat" : "fast") : phase === "consistent" && sync ? (isId ? "lebih lambat" : "slower") : "-" },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <Wire x1={CLIENT.x + 34} y1={CLIENT.y} x2={PRIMARY.x - 55} y2={PRIMARY.y} />
        <Wire x1={PRIMARY.x + 55} y1={PRIMARY.y} x2={REPLICA.x - 48} y2={REPLICA.y} color={sync ? C.amber : C.grid} dash={sync ? "3 3" : "4 6"} />

        <SvgNode x={CLIENT.x} y={CLIENT.y} w={74} h={44} label="CLIENT" />
        <SvgNode x={PRIMARY.x} y={PRIMARY.y} w={100} h={56} label="PRIMARY" value={primaryVal} valueColor={primaryVal === 150 ? C.green : C.dim} stroke={phase === "replicating" ? C.amber : C.stroke} />
        <SvgNode x={REPLICA.x} y={REPLICA.y} w={100} h={56} label="REPLICA" value={replicaVal} valueColor={replicaVal === primaryVal ? C.green : C.amber} stroke={readStale ? C.amber : C.stroke} />

        {readStale && (
          <SvgText x={REPLICA.x} y={REPLICA.y + 48} size={9} color={C.amber} weight={700}>
            {isId ? "dibaca sekarang → 100" : "read now → 100"}
          </SvgText>
        )}
        <g ref={layerRef} />
      </svg>
    </SimShell>
  );
}
