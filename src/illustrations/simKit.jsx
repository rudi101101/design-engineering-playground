import { useEffect, useRef } from "react";

// Shared palette for interactive sims — dark panel + app accent colors,
// mirroring docs/rate-limiting.html & docs/spend-caps.html reference style.
export const C = {
  accent: "#2f6fed",
  green: "#1f9d5c",
  red: "#d8514b",
  amber: "#b3791a",
  node: "#0e1218",
  stroke: "#3a4552",
  text: "#cfd6dd",
  dim: "#8b96a1",
  faint: "#6b7684",
  grid: "#ffffff22",
};

export function useTimers() {
  const ref = useRef([]);
  useEffect(() => {
    const timers = ref.current;
    return () => timers.forEach(clearTimeout);
  }, []);
  return {
    after(ms, fn) {
      ref.current.push(setTimeout(fn, ms));
    },
    clear() {
      ref.current.forEach(clearTimeout);
      ref.current = [];
    },
  };
}

export function useParticles() {
  const layerRef = useRef(null);
  function spawn(from, to, color, duration = 650, opts = {}) {
    const { arc = 26, r = 5, onDone } = opts;
    const layer = layerRef.current;
    if (!layer) {
      onDone?.();
      return;
    }
    const NS = "http://www.w3.org/2000/svg";
    const circle = document.createElementNS(NS, "circle");
    circle.setAttribute("r", String(r));
    circle.setAttribute("fill", color);
    circle.style.filter = `drop-shadow(0 0 5px ${color})`;
    layer.appendChild(circle);
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * arc;
      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      circle.setAttribute("opacity", t > 0.85 ? String(1 - (t - 0.85) / 0.15) : "1");
      if (t < 1) requestAnimationFrame(frame);
      else {
        circle.remove();
        onDone?.();
      }
    }
    requestAnimationFrame(frame);
  }
  return { layerRef, spawn };
}

export function ToggleBadge({ on, onClick, labelOn, labelOff, tagOn, tagOff, colorOn = C.green, colorOff = C.red, washOn = "#e5f6ea", washOff = "#fdeaea" }) {
  const color = on ? colorOn : colorOff;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-caption font-bold tracking-wide transition"
      style={{ color, borderColor: `${color}55`, background: on ? washOn : washOff, boxShadow: `0 0 18px -6px ${color}55` }}
    >
      {on ? labelOn : labelOff}
      {(tagOn || tagOff) && (
        <span className="font-medium" style={{ color: `${color}99` }}>
          {on ? tagOn : tagOff}
        </span>
      )}
    </button>
  );
}

export function RunButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-caption font-bold tracking-wide text-white transition disabled:opacity-50"
      style={{ background: C.accent, borderColor: C.accent }}
    >
      {children}
    </button>
  );
}

export function SimShell({ header, controls, badge, badgeColor, caption, cells, children }) {
  return (
    <div className="rounded-[16px] border border-hairline-border bg-pure-white p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary" style={{ animation: "sim-pulse 2s ease-in-out infinite" }} />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-faint-gray">{header}</span>
      </div>

      {controls && <div className="mb-3 flex flex-wrap items-center justify-center gap-2">{controls}</div>}

      <div className="relative overflow-hidden rounded-[12px] bg-ink p-3">
        <div className="mb-1 flex justify-center px-1 text-caption text-faint-gray">
          {badge ? (
            <span className="font-bold" style={{ color: badgeColor || C.green }}>
              {badge}
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
        {children}
        {caption && <p className="mt-1 px-1 text-center text-caption text-faint-gray">{caption}</p>}
      </div>

      {cells && cells.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {cells.map((cell) => (
            <div key={cell.l} className="rounded-[8px] border border-hairline-border bg-lavender-canvas px-2.5 py-2">
              <p className="text-[10px] font-bold tracking-wide text-indigo-primary">{cell.l}</p>
              <p className="mt-0.5 truncate text-label font-semibold" style={{ color: cell.color || "#161a22" }}>
                {cell.v}
              </p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes sim-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(47, 111, 237, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(47, 111, 237, 0); }
        }
      `}</style>
    </div>
  );
}

export function SvgNode({ x, y, w = 92, h = 52, rx = 10, label, value, stroke = C.stroke, valueColor = C.dim, fill = C.node, strokeWidth = 1.3 }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} rx={rx} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      {label != null && (
        <text x={x} y={value != null ? y - 6 : y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.text} fontFamily="'Inter',sans-serif">
          {label}
        </text>
      )}
      {value != null && (
        <text x={x} y={y + 14} textAnchor="middle" fontSize="13" fontWeight="800" fill={valueColor} fontFamily="'Inter',sans-serif">
          {value}
        </text>
      )}
    </g>
  );
}

export function SvgText({ x, y, color = C.dim, size = 10, weight = 700, anchor = "middle", children }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color} fontFamily="'Inter',sans-serif">
      {children}
    </text>
  );
}

export function Wire({ x1, y1, x2, y2, color = C.grid, dash = "4 6", width = 1.5 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash} />;
}
