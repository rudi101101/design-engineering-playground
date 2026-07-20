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
    <div
      ref={wrapRef}
      className="relative h-[160px] w-full overflow-hidden rounded-2xl border border-hairline-border bg-ink"
      aria-label={`Ilustrasi ${label}`}
      role="img"
    />
  );
}
