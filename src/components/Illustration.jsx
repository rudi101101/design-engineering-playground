import { useEffect, useId, useRef } from "react";
import { runSim, cleanup } from "../illustrations/engine.js";

export default function Illustration({ simKey, color, label }) {
  const wrapRef = useRef(null);
  const instanceId = useId();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.innerHTML = "";
    runSim(simKey, color, instanceId, wrap, label);
    return () => {
      cleanup(instanceId);
      wrap.innerHTML = "";
    };
  }, [simKey, color, instanceId, label]);

  return (
    <div className="rounded-[16px] border border-hairline-border bg-pure-white p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-faint-gray">Simulasi Interaktif</span>
      </div>
      <div
        ref={wrapRef}
        className="relative h-[190px] w-full overflow-hidden rounded-[12px] bg-ink"
        aria-label={`Ilustrasi ${label}`}
        role="img"
      />
      <style>{`
        @keyframes dep-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(47, 111, 237, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(47, 111, 237, 0); }
        }
      `}</style>
    </div>
  );
}
