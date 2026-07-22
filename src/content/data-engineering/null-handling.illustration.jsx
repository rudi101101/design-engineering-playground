import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { C, SimShell, ToggleBadge, RunButton, SvgText, useTimers } from "../../illustrations/simKit.jsx";

export default function NullHandlingIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const timers = useTimers();

  const [properOp, setProperOp] = useState(false); // false: phone = NULL, true: phone IS NULL
  const [running, setRunning] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [litRow, setLitRow] = useState(-1);
  const [matches, setMatches] = useState(null);

  const rows = [
    { name: "Andi", phone: "0811…" },
    { name: "Budi", phone: null },
    { name: "Citra", phone: null },
    { name: "Dewi", phone: "0857…" },
  ];
  const nullCount = rows.filter((r) => r.phone === null).length;

  function run() {
    if (running) return;
    setRunning(true);
    timers.clear();
    setEvaluated(false);
    setMatches(null);
    setLitRow(-1);

    rows.forEach((_, i) => {
      timers.after(350 * (i + 1), () => setLitRow(i));
    });
    timers.after(350 * (rows.length + 1), () => {
      setLitRow(-1);
      setMatches(properOp ? nullCount : 0);
      setEvaluated(true);
      setRunning(false);
    });
  }

  const s = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    run: isId ? "Jalankan query" : "Run query",
    running: isId ? "Mengevaluasi…" : "Evaluating…",
    idle: isId
      ? "cari user yang belum punya nomor telepon — perhatikan operator yang dipakai"
      : "find users with no phone number — watch which operator is used",
    doneWrong: isId
      ? "NULL = NULL menghasilkan UNKNOWN, bukan TRUE — WHERE hanya meloloskan TRUE, jadi 0 baris. Budi & Citra “menghilang”"
      : "NULL = NULL evaluates to UNKNOWN, not TRUE — WHERE only passes TRUE, so 0 rows. Budi & Citra “vanish”",
    doneRight: isId
      ? "IS NULL memang dirancang untuk memeriksa ketiadaan nilai — kedua baris ditemukan"
      : "IS NULL is purpose-built to test for absence — both rows are found",
  };

  const query = properOp ? "WHERE phone IS NULL" : "WHERE phone = NULL";

  return (
    <SimShell
      header={s.header}
      controls={
        <>
          <ToggleBadge
            on={properOp}
            onClick={() => !running && setProperOp((v) => !v)}
            labelOn="phone IS NULL"
            labelOff="phone = NULL"
            tagOn={isId ? "cara benar" : "the right way"}
            tagOff={isId ? "jebakan klasik" : "classic trap"}
          />
          <RunButton onClick={run} disabled={running}>
            {running ? s.running : s.run}
          </RunButton>
        </>
      }
      badge={evaluated ? (properOp ? `${matches} ${isId ? "BARIS DITEMUKAN" : "ROWS FOUND"}` : `0 ${isId ? "BARIS — LOGIKA 3 NILAI" : "ROWS — 3-VALUED LOGIC"}`) : null}
      badgeColor={evaluated && !properOp ? C.red : C.green}
      caption={evaluated ? (properOp ? s.doneRight : s.doneWrong) : s.idle}
      cells={[
        { l: "OPERATOR", v: properOp ? "IS NULL" : "= NULL", color: properOp ? C.green : C.red },
        { l: isId ? "NULL DI TABEL" : "NULLS IN TABLE", v: String(nullCount) },
        { l: isId ? "HASIL" : "MATCHES", v: matches === null ? "-" : String(matches), color: matches === null ? undefined : matches > 0 ? C.green : C.red },
      ]}
    >
      <svg viewBox="0 0 600 190" className="h-[170px] w-full">
        <rect x={30} y={30} width={230} height={40} rx={8} fill={C.node} stroke={C.stroke} strokeWidth="1.2" />
        <SvgText x={145} y={48} size={9} color={C.faint} weight={600}>
          SELECT * FROM users
        </SvgText>
        <SvgText x={145} y={62} size={10} weight={800} color={properOp ? C.green : C.red}>
          {query}
        </SvgText>

        {rows.map((r, i) => {
          const y = 28 + i * 34;
          const isNull = r.phone === null;
          const lit = litRow === i;
          const found = evaluated && properOp && isNull;
          const missed = evaluated && !properOp && isNull;
          return (
            <g key={r.name}>
              <rect x={330} y={y} width={230} height={28} rx={6} fill={found ? "#1f9d5c22" : C.node} stroke={lit ? C.accent : found ? C.green : missed ? C.red + "88" : C.stroke} strokeWidth={lit || found ? 1.6 : 1} />
              <SvgText x={370} y={y + 18} size={10} weight={700} color={C.text} anchor="start">
                {r.name}
              </SvgText>
              <SvgText x={520} y={y + 18} size={10} weight={isNull ? 800 : 600} color={isNull ? C.amber : C.dim}>
                {isNull ? "NULL" : r.phone}
              </SvgText>
              {found && (
                <SvgText x={343} y={y + 18} size={10} color={C.green} weight={800}>
                  ✓
                </SvgText>
              )}
              {missed && (
                <SvgText x={343} y={y + 18} size={10} color={C.red} weight={800}>
                  ?
                </SvgText>
              )}
            </g>
          );
        })}

        {evaluated && !properOp && (
          <SvgText x={145} y={120} size={10} weight={700} color={C.amber}>
            NULL = NULL → UNKNOWN
          </SvgText>
        )}
        {evaluated && !properOp && (
          <SvgText x={145} y={138} size={9} color={C.faint}>
            {isId ? "UNKNOWN ≠ TRUE → tidak lolos WHERE" : "UNKNOWN ≠ TRUE → filtered out"}
          </SvgText>
        )}
      </svg>
    </SimShell>
  );
}
