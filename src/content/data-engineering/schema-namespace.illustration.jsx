import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgNode, SvgText, useTimers } from "../../illustrations/simKit.jsx";

export default function SchemaNamespaceIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [namespaced, setNamespaced] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | creating | conflict | ok

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setPhase("creating");
    timers.after(700, () => {
      setPhase(namespaced ? "ok" : "conflict");
      setRunning(false);
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Team B: CREATE TABLE users" : "Team B: CREATE TABLE users",
    running: isId ? "Membuat tabel…" : "Creating table…",
    idle: isId
      ? "Team A sudah punya tabel bernama users. Sekarang Team B juga ingin membuat tabel users, untuk keperluan berbeda"
      : "Team A already has a table named users. Now Team B also wants a table named users, for a different purpose",
    conflict: isId
      ? "tanpa schema: satu namespace public global — relation \"users\" already exists. Team B terpaksa memakai nama aneh seperti users_b"
      : "without schemas: one flat public namespace — relation \"users\" already exists. Team B is forced into an awkward name like users_b",
    ok: isId
      ? "dengan schema: team_a.users dan team_b.users hidup berdampingan — nama sama, namespace berbeda, tanpa tabrakan"
      : "with schemas: team_a.users and team_b.users coexist peacefully — same name, different namespace, no collision",
  };

  let caption = s.idle;
  if (phase === "creating") caption = isId ? "menjalankan CREATE TABLE…" : "running CREATE TABLE…";
  else if (phase === "conflict") caption = s.conflict;
  else if (phase === "ok") caption = s.ok;

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={namespaced}
            onClick={() => {
              if (running) return;
              setNamespaced((v) => !v);
              setPhase("idle");
            }}
            labelOn={isId ? "DENGAN SCHEMA" : "WITH SCHEMAS"}
            labelOff={isId ? "SATU NAMESPACE (public)" : "ONE NAMESPACE (public)"}
            tagOn="team_a. / team_b."
            tagOff={isId ? "semua rata" : "everything flat"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={phase === "conflict" ? "ERROR: relation \"users\" already exists" : phase === "ok" ? (isId ? "KEDUANYA HIDUP BERDAMPINGAN" : "BOTH COEXIST") : null}
      badgeColor={phase === "conflict" ? C.red : C.green}
      caption={caption}
      cells={[
        { l: isId ? "MODE" : "MODE", v: namespaced ? "schemas" : "public only" },
        { l: "Team A", v: "users", color: phase !== "idle" ? C.green : undefined },
        { l: "Team B", v: phase === "ok" ? "users" : phase === "conflict" ? "users_b (terpaksa)" : "-", color: phase === "ok" ? C.green : phase === "conflict" ? C.red : undefined },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        {namespaced ? (
          <g>
            <rect x={60} y={30} width={220} height={130} rx={10} fill={C.node} stroke={C.accent + "88"} strokeWidth="1.3" />
            <SvgText x={170} y={50} size={10} weight={800} color={C.accent}>
              team_a
            </SvgText>
            <rect x={90} y={65} width={160} height={70} rx={7} fill="#2f6fed14" stroke={C.accent} strokeWidth="1.2" />
            <SvgText x={170} y={104} size={11} weight={700} color={C.accent}>
              users
            </SvgText>

            <rect x={320} y={30} width={220} height={130} rx={10} fill={C.node} stroke={C.green + "88"} strokeWidth="1.3" />
            <SvgText x={430} y={50} size={10} weight={800} color={C.green}>
              team_b
            </SvgText>
            <rect x={350} y={65} width={160} height={70} rx={7} fill="#1f9d5c14" stroke={C.green} strokeWidth="1.2" />
            <SvgText x={430} y={104} size={11} weight={700} color={C.green}>
              users {phase === "ok" ? "✓" : ""}
            </SvgText>
          </g>
        ) : (
          <g>
            <rect x={140} y={30} width={320} height={130} rx={10} fill={C.node} stroke={C.stroke} strokeWidth="1.3" />
            <SvgText x={300} y={50} size={10} weight={800} color={C.dim}>
              public
            </SvgText>
            <rect x={175} y={70} width={250} height={50} rx={7} fill={phase === "conflict" ? "#d8514b22" : "#2f6fed14"} stroke={phase === "conflict" ? C.red : C.accent} strokeWidth="1.3" />
            <SvgText x={300} y={100} size={11} weight={700} color={phase === "conflict" ? C.red : C.accent}>
              users {phase === "conflict" ? "(Team A) — bentrok!" : "(Team A)"}
            </SvgText>
          </g>
        )}
      </svg>
    </SimShell>
  );
}
