import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const NODES = { a: { x: 150, y: 95 }, b: { x: 450, y: 95 } };
const START_A = 1000;
const START_B = 500;
const AMOUNT = 300;
const TOTAL = START_A + START_B;

export default function AcidIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const particleLayerRef = useRef(null);

  const [atomic, setAtomic] = useState(false);
  const [running, setRunning] = useState(false);
  const [balA, setBalA] = useState(START_A);
  const [balB, setBalB] = useState(START_B);
  const [phase, setPhase] = useState("idle"); // idle | debiting | crashed | rollback | crediting | done-ok | done-lost
  const [runs, setRuns] = useState(0);

  const atomicRef = useRef(atomic);
  atomicRef.current = atomic;
  const timeoutsRef = useRef([]);

  function clearTimers() {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }

  useEffect(() => {
    setBalA(START_A);
    setBalB(START_B);
    setPhase("idle");
    clearTimers();
    return clearTimers;
  }, [atomic]);

  function spawnParticle(from, to, color, duration, onDone) {
    if (!particleLayerRef.current) {
      onDone();
      return;
    }
    const NS = "http://www.w3.org/2000/svg";
    const circle = document.createElementNS(NS, "circle");
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", color);
    circle.style.filter = `drop-shadow(0 0 5px ${color})`;
    particleLayerRef.current.appendChild(circle);

    const start = performance.now();
    let done = false;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      let x, y;
      if (t < 1) {
        x = from.x + (to.x - from.x) * t;
        y = from.y - Math.sin(t * Math.PI) * 26;
      } else {
        x = to.x;
        y = to.y;
      }
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("opacity", t > 0.85 ? String(1 - (t - 0.85) / 0.15) : "1");
      if (t < 1) {
        requestAnimationFrame(frame);
      } else if (!done) {
        done = true;
        circle.remove();
        onDone();
      }
    }
    requestAnimationFrame(frame);
  }

  function runTransfer() {
    if (running) return;
    clearTimers();
    setRunning(true);
    setBalA(START_A);
    setBalB(START_B);
    setRuns((r) => r + 1);
    setPhase("debiting");

    // Always crash mid-transfer so toggling ATOMIC/NON-ATOMIC always shows a clear,
    // deterministic contrast — a random crash chance made the two modes look identical
    // whenever no crash happened to occur.
    const willCrash = true;

    // leg 1: A -> midpoint (debit happens)
    const mid = { x: (NODES.a.x + NODES.b.x) / 2, y: 60 };
    spawnParticle(NODES.a, mid, "#b3791a", 650, () => {
      setBalA(START_A - AMOUNT);

      if (willCrash) {
        setPhase("crashed");
        const t1 = setTimeout(() => {
          if (atomicRef.current) {
            setPhase("rollback");
            const t2 = setTimeout(() => {
              setBalA(START_A);
              setBalB(START_B);
              setPhase("done-ok");
              setRunning(false);
            }, 700);
            timeoutsRef.current.push(t2);
          } else {
            setPhase("done-lost");
            setRunning(false);
          }
        }, 900);
        timeoutsRef.current.push(t1);
        return;
      }

      // leg 2: midpoint -> B (credit happens)
      spawnParticle(mid, NODES.b, "#1f9d5c", 650, () => {
        setBalB(START_B + AMOUNT);
        setPhase("done-ok");
        setRunning(false);
      });
    });
  }

  const total = balA + balB;
  const totalOk = total === TOTAL;

  const strings = {
    header: isId ? "Simulasi Interaktif" : "Interactive Simulation",
    nonAtomic: isId ? "TANPA ATOMICITY" : "NON-ATOMIC",
    nonAtomicTag: isId ? "tanpa rollback" : "no rollback",
    acidLabel: isId ? "TRANSAKSI ACID" : "ACID TRANSACTION",
    acidTag: isId ? "auto-rollback saat crash" : "auto-rollback on crash",
    run: isId ? "Jalankan transfer" : "Run transfer",
    running: isId ? "Mentransfer…" : "Transferring…",
    crashed: isId ? "CRASH — 300 hilang!" : "CRASHED — 300 missing!",
    rolledBack: isId ? "di-rollback — tidak ada data hilang" : "rolled back — no data lost",
    idleCaption: isId
      ? "klik “Jalankan transfer” untuk mengirim 300 dari Akun A ke Akun B"
      : "click “Run transfer” to send 300 from Account A to Account B",
    debitCaption: isId ? "mendebit Akun A…" : "debiting Account A…",
    creditCaption: isId ? "mengkredit Akun B…" : "crediting Account B…",
    crashNonAtomicCaption: isId
      ? "listrik mati tepat setelah debit — tanpa atomicity, kredit ke B tidak pernah terjadi dan 300 lenyap begitu saja"
      : "power died right after the debit — without atomicity, the credit to B never happens and 300 simply vanishes",
    crashAcidCaption: isId
      ? "listrik mati tepat setelah debit — tapi transaksi ACID otomatis rollback lewat undo log, saldo A kembali seperti semula"
      : "power died right after the debit — but the ACID transaction auto-rolls-back via the undo log, restoring A's balance",
    doneOkCaption: isId
      ? "transfer selesai normal — A berkurang, B bertambah, total tetap 1500"
      : "transfer completed normally — A decreases, B increases, total stays 1500",
    mode: isId ? "MODE" : "MODE",
    modeVal: atomic ? (isId ? "ACID" : "ACID") : (isId ? "non-atomic" : "non-atomic"),
    totalLabel: isId ? "TOTAL" : "TOTAL",
    result: isId ? "HASIL" : "RESULT",
    resultLost: isId ? "uang hilang" : "money lost",
    resultSafe: isId ? "aman" : "safe",
    resultPending: isId ? "menunggu" : "pending",
  };

  let resultVal = strings.resultPending;
  if (phase === "done-lost") resultVal = strings.resultLost;
  else if (phase === "done-ok") resultVal = strings.resultSafe;
  else if (phase === "crashed") resultVal = atomic ? (isId ? "rollback…" : "rolling back…") : strings.resultLost;
  else if (phase === "rollback") resultVal = isId ? "rollback…" : "rolling back…";

  let caption = strings.idleCaption;
  if (phase === "debiting") caption = strings.debitCaption;
  else if (phase === "crashed" || phase === "rollback") caption = atomic ? strings.crashAcidCaption : strings.crashNonAtomicCaption;
  else if (phase === "done-ok" && runs > 0) caption = strings.doneOkCaption;
  else if (phase === "done-lost") caption = strings.crashNonAtomicCaption;

  const showCrashBadge = phase === "crashed" || phase === "rollback" || phase === "done-lost";
  const crashIsFatal = !atomic && (phase === "crashed" || phase === "done-lost");

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-ink px-6 py-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#4fd1ff]" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-white/40">{strings.header}</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setAtomic((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wide transition"
          style={
            atomic
              ? { color: "#4ade80", borderColor: "#1f9d5c55", background: "#1f9d5c22", boxShadow: "0 0 18px -6px #1f9d5c88" }
              : { color: "#f47872", borderColor: "#d8514b55", background: "#d8514b22", boxShadow: "0 0 18px -6px #d8514b88" }
          }
        >
          {atomic ? strings.acidLabel : strings.nonAtomic}
          <span className="font-medium opacity-80">{atomic ? strings.acidTag : strings.nonAtomicTag}</span>
        </button>

        <button
          type="button"
          onClick={runTransfer}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wide text-white transition disabled:opacity-50"
          style={{ background: "#2f6fed", borderColor: "#2f6fed" }}
        >
          {running ? strings.running : strings.run}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="mb-1 flex justify-center px-1 text-[11px]">
          {showCrashBadge ? (
            <span className="font-bold" style={{ color: crashIsFatal ? "#f47872" : "#4ade80" }}>
              {crashIsFatal ? strings.crashed : strings.rolledBack}
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
        <svg viewBox="0 0 600 190" className="h-auto w-full max-w-[520px]">
          <line x1={NODES.a.x + 46} y1={NODES.a.y} x2={NODES.b.x - 46} y2={NODES.b.y} stroke="#ffffff22" strokeWidth="1.5" strokeDasharray="4 6" />

          <g>
            <rect x={NODES.a.x - 46} y={NODES.a.y - 26} rx="10" width="92" height="52" fill="#12161d" stroke={phase === "crashed" || phase === "rollback" ? "#d8514b" : "#3a4552"} strokeWidth="1.3" />
            <text x={NODES.a.x} y={NODES.a.y - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#cfd6dd" fontFamily="'Inter',sans-serif">
              {isId ? "AKUN A" : "ACCOUNT A"}
            </text>
            <text x={NODES.a.x} y={NODES.a.y + 14} textAnchor="middle" fontSize="13" fontWeight="800" fill={balA < START_A ? "#e0a13d" : "#c3c9d1"} fontFamily="'Inter',sans-serif">
              {balA}
            </text>
          </g>

          <g>
            <rect x={NODES.b.x - 46} y={NODES.b.y - 26} rx="10" width="92" height="52" fill="#12161d" stroke={phase === "crashed" || phase === "rollback" ? "#d8514b" : "#3a4552"} strokeWidth="1.3" />
            <text x={NODES.b.x} y={NODES.b.y - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#cfd6dd" fontFamily="'Inter',sans-serif">
              {isId ? "AKUN B" : "ACCOUNT B"}
            </text>
            <text x={NODES.b.x} y={NODES.b.y + 14} textAnchor="middle" fontSize="13" fontWeight="800" fill={balB > START_B ? "#4ade80" : "#c3c9d1"} fontFamily="'Inter',sans-serif">
              {balB}
            </text>
          </g>

          <text x="300" y="175" textAnchor="middle" fontSize="10" fontWeight="700" fill={totalOk ? "#4ade80" : "#f47872"} fontFamily="'Inter',sans-serif">
            {strings.totalLabel} = {total}
          </text>

          <g ref={particleLayerRef} />
        </svg>
        <p className="mt-3 max-w-[440px] px-1 text-center text-[11px] text-white/50">{caption}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { l: strings.mode, v: strings.modeVal },
          { l: strings.totalLabel, v: total, ok: totalOk },
          { l: strings.result, v: resultVal },
        ].map((cell) => (
          <div key={cell.l} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
            <p className="text-[10px] font-bold tracking-wide text-[#7c93ff]">{cell.l}</p>
            <p
              className="mt-0.5 truncate text-[12px] font-semibold"
              style={cell.l === strings.totalLabel ? { color: cell.ok ? "#4ade80" : "#f47872" } : { color: "#f1f2f4" }}
            >
              {cell.v}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes dep-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(79, 209, 255, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(79, 209, 255, 0); }
        }
      `}</style>
    </div>
  );
}
