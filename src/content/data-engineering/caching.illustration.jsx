import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const NODES = { client: { x: 60, y: 110 }, cache: { x: 300, y: 110 }, db: { x: 540, y: 110 } };

export default function CachingIllustration() {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const svgRef = useRef(null);
  const particleLayerRef = useRef(null);
  const [cacheOn, setCacheOn] = useState(false);
  const [stats, setStats] = useState({ hits: 0, misses: 0 });
  const spawnCountRef = useRef(0);
  const cacheOnRef = useRef(cacheOn);
  cacheOnRef.current = cacheOn;

  useEffect(() => {
    setStats({ hits: 0, misses: 0 });
    spawnCountRef.current = 0;
  }, [cacheOn]);

  useEffect(() => {
    const NS = "http://www.w3.org/2000/svg";
    let stopped = false;

    function spawnParticle() {
      if (stopped || !particleLayerRef.current) return;
      const on = cacheOnRef.current;
      spawnCountRef.current += 1;
      const warmth = Math.min(0.85, spawnCountRef.current / 14);
      const isHit = on && Math.random() < warmth;

      setStats((s) => (isHit ? { ...s, hits: s.hits + 1 } : { ...s, misses: s.misses + 1 }));

      const circle = document.createElementNS(NS, "circle");
      circle.setAttribute("r", "4");
      const color = !on ? "#d8514b" : isHit ? "#1f9d5c" : "#b3791a";
      circle.setAttribute("fill", color);
      circle.style.filter = `drop-shadow(0 0 4px ${color})`;
      particleLayerRef.current.appendChild(circle);

      const start = performance.now();
      const dur = isHit ? 550 : 1050;

      function frame(now) {
        const t = Math.min(1, (now - start) / dur);
        let x, y;
        if (isHit) {
          x = NODES.client.x + (NODES.cache.x - NODES.client.x) * t;
          y = NODES.client.y;
        } else if (t < 0.42) {
          const lt = t / 0.42;
          x = NODES.client.x + (NODES.cache.x - NODES.client.x) * lt;
          y = NODES.client.y;
        } else {
          const lt = (t - 0.42) / 0.58;
          x = NODES.cache.x + (NODES.db.x - NODES.cache.x) * lt;
          y = NODES.cache.y;
        }
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("opacity", t > 0.85 ? String(1 - (t - 0.85) / 0.15) : "1");
        if (t < 1) requestAnimationFrame(frame);
        else circle.remove();
      }
      requestAnimationFrame(frame);
    }

    const interval = setInterval(spawnParticle, 480);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, []);

  const strings = {
    off: isId ? "CACHE OFF" : "CACHE OFF",
    on: isId ? "CACHE ON" : "CACHE ON",
    offTag: isId ? "selalu ke database" : "always hits database",
    onTag: isId ? "cache-aside, TTL 5m" : "cache-aside, TTL 5m",
    captionOff: isId
      ? "tanpa cache — setiap request tetap jalan ke database, walau isinya sama persis"
      : "no cache — every request still hits the database, even for identical reads",
    captionOn: isId
      ? "cache-aside — makin lama, makin banyak request yang 'memantul' di cache tanpa menyentuh database"
      : "cache-aside — over time, more requests 'bounce' off the cache without ever touching the database",
    strategy: isId ? "STRATEGI" : "STRATEGY",
    strategyVal: cacheOn ? "cache-aside" : (isId ? "tanpa cache" : "no cache"),
    ttl: "TTL",
    ttlVal: cacheOn ? "5 min" : "n/a",
    result: isId ? "HASIL" : "RESULT",
    resultVal: cacheOn ? (isId ? "makin cepat" : "gets faster") : (isId ? "selalu lambat" : "always slow"),
  };

  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? Math.round((stats.hits / total) * 100) : 0;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-ink px-6 py-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#4fd1ff]" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-white/40">{isId ? "Simulasi Interaktif" : "Interactive Simulation"}</span>
      </div>

      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={() => setCacheOn((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wide transition"
          style={
            cacheOn
              ? { color: "#4ade80", borderColor: "#1f9d5c55", background: "#1f9d5c22", boxShadow: "0 0 18px -6px #1f9d5c88" }
              : { color: "#f47872", borderColor: "#d8514b55", background: "#d8514b22", boxShadow: "0 0 18px -6px #d8514b88" }
          }
        >
          {cacheOn ? strings.on : strings.off}
          <span className="font-medium opacity-80">{cacheOn ? strings.onTag : strings.offTag}</span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="mb-1 flex w-full max-w-[520px] justify-end px-1 text-[11px] text-white/40">
          <span style={{ color: "#f47872" }}>{isId ? "DB" : "DB"}: {stats.misses}</span>
          <span className="mx-2 text-white/20">|</span>
          <span style={{ color: "#4ade80" }}>{isId ? "cache" : "cache"}: {stats.hits}</span>
          <span className="mx-2 text-white/20">|</span>
          <span>{hitRate}%</span>
        </div>
        <svg ref={svgRef} viewBox="0 0 600 190" className="h-auto w-full max-w-[520px]">
          <line x1={NODES.client.x + 34} y1={NODES.client.y} x2={NODES.cache.x - 26} y2={NODES.cache.y} stroke="#ffffff22" strokeWidth="1.5" strokeDasharray="4 6" />
          <line x1={NODES.cache.x + 26} y1={NODES.cache.y} x2={NODES.db.x - 40} y2={NODES.db.y} stroke="#ffffff22" strokeWidth="1.5" strokeDasharray="4 6" />

          <g>
            <rect x={NODES.client.x - 30} y={NODES.client.y - 18} rx="10" width="60" height="36" fill="#0e1218" stroke="#3a4552" strokeWidth="1.3" />
            <text x={NODES.client.x} y={NODES.client.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#cfd6dd" fontFamily="'Inter',sans-serif">
              {isId ? "CLIENT" : "CLIENT"}
            </text>
          </g>

          <g>
            <circle cx={NODES.cache.x} cy={NODES.cache.y} r="26" fill="#0e1218" stroke={cacheOn ? "#1f9d5c" : "#3a4552"} strokeWidth="2" />
            <text x={NODES.cache.x} y={NODES.cache.y - 34} textAnchor="middle" fontSize="10" fontWeight="700" fill={cacheOn ? "#1f9d5c" : "#6b7684"} fontFamily="'Inter',sans-serif">
              {isId ? "CACHE" : "CACHE"}
            </text>
            <text x={NODES.cache.x} y={NODES.cache.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill={cacheOn ? "#1f9d5c" : "#6b7684"} fontFamily="'Inter',sans-serif">
              {cacheOn ? "ON" : "OFF"}
            </text>
          </g>

          <g>
            <circle cx={NODES.db.x} cy={NODES.db.y} r="30" fill="#12161d" stroke="#d8514b" strokeWidth="2" opacity={cacheOn ? 0.55 : 1} />
            <text x={NODES.db.x} y={NODES.db.y - 40} textAnchor="middle" fontSize="10" fontWeight="700" fill="#f47872" fontFamily="'Inter',sans-serif">
              {isId ? "DATABASE" : "DATABASE"}
            </text>
            <text x={NODES.db.x} y={NODES.db.y + 4} textAnchor="middle" fontSize="9" fill="#8b96a1" fontFamily="'Inter',sans-serif">
              {cacheOn ? (isId ? "terlindungi" : "protected") : (isId ? "menanggung beban" : "under load")}
            </text>
          </g>

          <g ref={particleLayerRef} />
        </svg>
        <p className="mt-3 max-w-[440px] px-1 text-center text-[11px] text-white/50">{cacheOn ? strings.captionOn : strings.captionOff}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { l: strings.strategy, v: strings.strategyVal },
          { l: strings.ttl, v: strings.ttlVal },
          { l: strings.result, v: strings.resultVal },
        ].map((cell) => (
          <div key={cell.l} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
            <p className="text-[10px] font-bold tracking-wide text-[#7c93ff]">{cell.l}</p>
            <p className="mt-0.5 truncate text-[12px] font-semibold text-white">{cell.v}</p>
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
