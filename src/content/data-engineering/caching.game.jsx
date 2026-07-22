import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Handle, Position, getBezierPath, BaseEdge } from "reactflow";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import "reactflow/dist/style.css";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

gsap.registerPlugin(MotionPathPlugin);

const KEY_SPACE = 40; // number of distinct "hot" keys in the simulated workload
const TOTAL_REQUESTS = 1000;

// Zipf-ish distribution: low-index keys are requested far more often than high-index ones,
// so the cache naturally "warms up" fast (matches the cache warm-up inspiration in GAME-LAYER.md).
function simulateBatch(cacheEnabled) {
  const seen = new Set();
  let misses = 0;
  const weights = Array.from({ length: KEY_SPACE }, (_, i) => 1 / (i + 1));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    let r = Math.random() * totalWeight;
    let key = 0;
    for (; key < KEY_SPACE; key++) {
      r -= weights[key];
      if (r <= 0) break;
    }
    if (!cacheEnabled || !seen.has(key)) {
      misses++;
      seen.add(key);
    }
  }
  return misses;
}

function pickWeightedKey() {
  const weights = Array.from({ length: KEY_SPACE }, (_, i) => 1 / (i + 1));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  let key = 0;
  for (; key < KEY_SPACE; key++) {
    r -= weights[key];
    if (r <= 0) break;
  }
  return key;
}

function FlowNode({ data }) {
  return (
    <div
      className="flex w-[120px] flex-col items-center gap-1 rounded-2xl border-2 bg-pure-white px-3 py-3 text-center shadow-[var(--shadow-card)]"
      style={{ borderColor: data.color }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <span className="text-[24px]">{data.emoji}</span>
      <span className="text-label font-bold text-ink">{data.label}</span>
      <span className="text-caption text-slate-gray">{data.sub}</span>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { flowNode: FlowNode };

function PulseEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) {
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const color = data?.state === "hit" ? "#1f9d5c" : data?.state === "miss" ? "#d8514b" : "#c7cad6";
  return <BaseEdge id={id} path={path} style={{ stroke: color, strokeWidth: 2, transition: "stroke 0.3s" }} />;
}

const edgeTypes = { pulse: PulseEdge };

export default function CachingGame() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const flowWrapRef = useRef(null);

  const [guess, setGuess] = useState(400);
  const [revealed, setRevealed] = useState(false);
  const [actualMisses, setActualMisses] = useState(null);

  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [seenKeys, setSeenKeys] = useState(() => new Set());
  const [stats, setStats] = useState({ sent: 0, hits: 0, misses: 0 });
  const [edgeState, setEdgeState] = useState({ cc: "idle", cd: "idle" });

  const nodes = useMemo(
    () => [
      { id: "client", type: "flowNode", position: { x: 0, y: 60 }, data: { label: "Client", sub: isId ? "aplikasi" : "app", emoji: "💻", color: "#2f6fed" }, draggable: true },
      { id: "cache", type: "flowNode", position: { x: 220, y: 60 }, data: { label: "Cache", sub: "Redis, TTL 5m", emoji: "⚡", color: "#f59e0b" }, draggable: true },
      { id: "database", type: "flowNode", position: { x: 440, y: 60 }, data: { label: isId ? "Database" : "Database", sub: isId ? "sumber data" : "source of truth", emoji: "🗄️", color: "#ef4444" }, draggable: true },
    ],
    [isId]
  );

  const [edges, setEdges] = useState([
    { id: "cc", source: "client", target: "cache", type: "pulse", data: { state: "idle" } },
    { id: "cd", source: "cache", target: "database", type: "pulse", data: { state: "idle" } },
  ]);

  const flashEdge = useCallback((edgeId, state) => {
    setEdges((eds) => eds.map((e) => (e.id === edgeId ? { ...e, data: { state } } : e)));
    setTimeout(() => {
      setEdges((eds) => eds.map((e) => (e.id === edgeId ? { ...e, data: { state: "idle" } } : e)));
    }, 500);
  }, []);

  const animateParticle = useCallback((fromSelector, toSelector, color) => {
    const wrap = flowWrapRef.current;
    if (!wrap) return;
    const from = wrap.querySelector(fromSelector);
    const to = wrap.querySelector(toSelector);
    if (!from || !to) return;
    const wrapRect = wrap.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.width = "10px";
    dot.style.height = "10px";
    dot.style.borderRadius = "9999px";
    dot.style.background = color;
    dot.style.boxShadow = `0 0 8px ${color}`;
    dot.style.left = `${fromRect.left - wrapRect.left + fromRect.width / 2}px`;
    dot.style.top = `${fromRect.top - wrapRect.top + fromRect.height / 2}px`;
    dot.style.zIndex = "50";
    wrap.appendChild(dot);
    gsap.to(dot, {
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: (toRect.left - fromRect.left) / 2, y: toRect.top - fromRect.top - 24 },
          { x: toRect.left - fromRect.left, y: toRect.top - fromRect.top },
        ],
        curviness: 1.2,
      },
      duration: 0.5,
      ease: "power1.inOut",
      onComplete: () => dot.remove(),
    });
  }, []);

  const sendRequest = useCallback(() => {
    const key = pickWeightedKey();
    const isHit = cacheEnabled && seenKeys.has(key);

    animateParticle('[data-id="client"]', '[data-id="cache"]', "#2f6fed");
    flashEdge("cc", isHit ? "hit" : "miss");

    if (isHit) {
      setStats((s) => ({ sent: s.sent + 1, hits: s.hits + 1, misses: s.misses }));
    } else {
      setTimeout(() => {
        animateParticle('[data-id="cache"]', '[data-id="database"]', "#ef4444");
        flashEdge("cd", "miss");
      }, 150);
      setSeenKeys((prev) => new Set(prev).add(key));
      setStats((s) => ({ sent: s.sent + 1, hits: s.hits, misses: s.misses + 1 }));
    }
  }, [cacheEnabled, seenKeys, animateParticle, flashEdge]);

  const resetHandsOn = useCallback(() => {
    setSeenKeys(new Set());
    setStats({ sent: 0, hits: 0, misses: 0 });
  }, []);

  const handleReveal = () => {
    setActualMisses(simulateBatch(true));
    setRevealed(true);
  };

  const hitRate = stats.sent > 0 ? Math.round((stats.hits / stats.sent) * 100) : 0;
  const diff = actualMisses !== null ? Math.abs(actualMisses - guess) : null;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-2 text-section-title font-bold text-ink">
          {isId ? "Tebak dulu: seberapa sering cache-mu kena MISS?" : "Predict first: how often will your cache MISS?"}
        </h3>
        <p className="mb-3 text-body text-slate-gray">
          {isId
            ? `Dari ${TOTAL_REQUESTS} request yang datang dengan pola akses realistis (beberapa key jauh lebih populer dari yang lain), berapa banyak menurutmu akan MISS (harus ke database) sebelum cache benar-benar "panas"?`
            : `Out of ${TOTAL_REQUESTS} incoming requests with a realistic access pattern (some keys are far more popular than others), how many do you think will MISS (fall through to the database) before the cache fully "warms up"?`}
        </p>
        {!revealed ? (
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="range"
              min={0}
              max={TOTAL_REQUESTS}
              value={guess}
              onChange={(e) => setGuess(Number(e.target.value))}
              className="w-full max-w-xs accent-indigo-primary"
            />
            <span className="text-body font-semibold text-ink">{guess}</span>
            <button
              type="button"
              onClick={handleReveal}
              className="rounded-xl bg-gradient-to-r from-indigo-primary to-indigo-deep px-4 py-2 text-label font-semibold text-white shadow-[var(--shadow-button-tinted)]"
            >
              {isId ? "Lihat Hasil Sebenarnya" : "Reveal Actual Result"}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4 rounded-xl bg-indigo-wash p-4">
            <div>
              <p className="text-caption text-slate-gray">{isId ? "Tebakanmu" : "Your guess"}</p>
              <p className="text-section-title font-bold text-ink">{guess}</p>
            </div>
            <div>
              <p className="text-caption text-slate-gray">{isId ? "Hasil sebenarnya" : "Actual result"}</p>
              <p className="text-section-title font-bold text-indigo-primary">{actualMisses}</p>
            </div>
            <p className="text-label text-slate-gray">
              {isId ? `Selisih ${diff} dari ${TOTAL_REQUESTS} request.` : `Off by ${diff} out of ${TOTAL_REQUESTS} requests.`}{" "}
              {diff <= 50 ? (isId ? "Cukup akurat! 🎯" : "Pretty accurate! 🎯") : isId ? "Ternyata cache warm-up lebih cepat dari intuisi kebanyakan orang." : "Cache warm-up is usually faster than most people's intuition."}
            </p>
          </div>
        )}
      </section>

      {revealed && (
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-section-title font-bold text-ink">{isId ? "Coba sendiri" : "Try it yourself"}</h3>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-label text-slate-gray">
                <input type="checkbox" checked={cacheEnabled} onChange={(e) => { setCacheEnabled(e.target.checked); resetHandsOn(); }} />
                {isId ? "Cache aktif" : "Cache enabled"}
              </label>
              <button type="button" onClick={resetHandsOn} className="rounded-lg border border-hairline-border px-3 py-1.5 text-label text-slate-gray hover:border-indigo-primary">
                {isId ? "Reset" : "Reset"}
              </button>
            </div>
          </div>

          <div ref={flowWrapRef} className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-hairline-border bg-lavender-canvas">
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView proOptions={{ hideAttribution: true }} panOnDrag={false} zoomOnScroll={false}>
              <Background gap={16} size={1} />
            </ReactFlow>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={sendRequest}
              className="rounded-xl bg-gradient-to-r from-indigo-primary to-indigo-deep px-4 py-2 text-label font-semibold text-white shadow-[var(--shadow-button-tinted)]"
            >
              {isId ? "Kirim Request →" : "Send Request →"}
            </button>
            <span className="text-label text-slate-gray">
              {isId ? "Terkirim" : "Sent"}: <strong className="text-ink">{stats.sent}</strong>
            </span>
            <span className="text-label text-success-green">
              HIT: <strong>{stats.hits}</strong>
            </span>
            <span className="text-label text-danger-red">
              MISS: <strong>{stats.misses}</strong>
            </span>
            <span className="text-label text-slate-gray">
              {isId ? "Hit rate" : "Hit rate"}: <strong className="text-ink">{hitRate}%</strong>
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
