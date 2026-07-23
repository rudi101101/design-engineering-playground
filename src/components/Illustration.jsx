import { useEffect, useId, useRef } from "react";
import { runSim, cleanup } from "../illustrations/engine.js";

export default function Illustration({ simKey, color, label, footer }) {
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
    <div className="flex h-full w-full flex-col overflow-y-auto bg-ink">
      <div className="flex items-center gap-2 px-6 pt-6">
        <span className="h-1.5 w-1.5 rounded-full bg-[#4fd1ff]" style={{ animation: "dep-pulse 2s ease-in-out infinite" }} />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-white/50">Simulasi Interaktif</span>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-8">
        <div ref={wrapRef} className="relative h-[220px] w-full max-w-[520px] overflow-hidden rounded-xl" aria-label={`Ilustrasi ${label}`} role="img" />
      </div>
      {footer && <p className="px-6 pb-6 text-center text-[10.5px] font-bold uppercase tracking-[0.6px] text-white/40">{footer}</p>}
      <style>{`
        @keyframes dep-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(79, 209, 255, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(79, 209, 255, 0); }
        }
      `}</style>
    </div>
  );
}
