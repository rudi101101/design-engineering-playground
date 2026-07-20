/* eslint-disable */
// Ported from the original data101 (1).html prototype: vanilla SVG-DOM + GSAP
// simulations, one per illustration "sim" key, dispatched via SIM_MAP.
// Kept close to the original implementation per APP-SHELL.md / TECH-STACK.md —
// GSAP is retained, only the mount/cleanup boundary changes (React refs + useEffect).
import gsap from "gsap";

const ST = {};

function sn(tag, a, p) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (a) Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v));
  if (p) p.appendChild(e);
  return e;
}
function bx(p, x, y, w, h, c, l, s) {
  const g = sn("g", {}, p);
  sn("rect", { x, y, width: w, height: h, rx: 5, fill: c + "18", stroke: c + "55", "stroke-width": "1.2" }, g);
  sn("text", { x: x + w / 2, y: y + h / 2 - (s ? 4 : 0), fill: c + "cc", "font-size": "8", "text-anchor": "middle", "font-family": "monospace", "font-weight": "600" }, g).textContent = l;
  if (s) sn("text", { x: x + w / 2, y: y + h / 2 + 8, fill: c + "66", "font-size": "6.5", "text-anchor": "middle", "font-family": "monospace" }, g).textContent = s;
  return g;
}
function tx(p, t, x, y, c, sz, opts = {}) {
  const e = sn("text", { x, y, fill: c, "font-size": sz, "text-anchor": opts.a || "middle", "font-family": "monospace", "font-weight": opts.w || "400" }, p);
  e.textContent = t;
  return e;
}
function pk(s, x, y, c, r = 5) {
  return sn("circle", { cx: x, cy: y, r, fill: c, opacity: 0.9 }, s);
}
function ln(p, x1, y1, x2, y2, c, dash = false) {
  return sn("line", { x1, y1, x2, y2, stroke: c + "55", "stroke-width": "1.3", ...(dash ? { "stroke-dasharray": "5,3" } : {}) }, p);
}
function glow(e, c) {
  e.style.filter = `drop-shadow(0 0 4px ${c})`;
}

export function cleanup(id) {
  if (ST[id]) {
    ST[id].forEach((t) => clearInterval(t));
    delete ST[id];
  }
}
function addTimer(id, t) {
  if (!ST[id]) ST[id] = [];
  ST[id].push(t);
}

function makeSVG(wrap) {
  const W = wrap.offsetWidth || 600,
    H = 120;
  const s = sn("svg", { width: "100%", height: H, viewBox: `0 0 ${W} ${H}` }, wrap);
  return { s, W, H };
}

// ── MEDALLION ──
function simMedallion(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const cols = ["#cd7f32", "#94a3b8", "#fbbf24"];
  const lbs = ["🥉 Bronze", "🥈 Silver", "🥇 Gold"];
  const sbs = ["Raw as-is", "Clean+Valid", "Mart/Agg"];
  const bw = (W - 40) / 3;
  const rects = [];
  lbs.forEach((l, i) => {
    const x = 10 + i * (bw + 5);
    const g = bx(s, x, 18, bw, 70, cols[i], l, sbs[i]);
    rects.push(g.querySelector("rect"));
    if (i < 2) ln(s, x + bw, 52, x + bw + 5, 52, cols[i]);
  });
  const statusL = tx(s, "", W / 2, 108, c + "77", 7.5);
  const msgs = [
    ["Bronze: raw data arrives → unvalidated, may have nulls", 0],
    ["Bronze → Silver: cleaning, dedup, validation applied", 1],
    ["Silver → Gold: aggregation, joins, ready for BI/ML", 2],
    ["Gold layer served to dashboard & ML models ✓", 2],
  ];
  let phase = 0;
  const t = setInterval(() => {
    const [msg, hi] = msgs[phase % msgs.length];
    statusL.textContent = msg;
    rects.forEach((r, i) => gsap.to(r, { attr: { fill: i <= hi ? cols[i] + "44" : cols[i] + "0a" }, duration: 0.4 }));
    if (phase % msgs.length > 0) {
      const pi = (phase % msgs.length) - 1;
      const px = 10 + pi * (bw + 5) + bw;
      const p = pk(s, px, 52, cols[pi]);
      glow(p, cols[pi]);
      gsap.to(p, { attr: { cx: px + 5 + bw / 2 }, duration: 0.5, onComplete: () => p.remove() });
    }
    phase++;
  }, 1100);
  addTimer(id, t);
}

// ── ACID ──
function simAcid(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const rows = [
    { l: "Account A", v: 1000 },
    { l: "Account B", v: 500 },
  ];
  const rR = [],
    vT = [];
  rows.forEach((r, i) => {
    const rect = sn("rect", { x: 8, y: 10 + i * 28, width: 160, height: 22, rx: 4, fill: c + "0e", stroke: c + "30", "stroke-width": "1" }, s);
    tx(s, r.l, 55, 22 + i * 28, c + "88", 8);
    const v = tx(s, `${r.v}`, 140, 22 + i * 28, c + "cc", 8, { w: "700" });
    rR.push(rect);
    vT.push(v);
  });
  bx(s, W - 170, 8, 155, 50, c, "Transaction", "");
  const txL = tx(s, "BEGIN", W - 93, 30, c + "cc", 8, { w: "700" });
  const stL = tx(s, "", W - 93, 46, c + "66", 7);
  const walL = tx(s, "📝 WAL: ", 10, 75, c + "66", 7, { a: "start" });
  walL.setAttribute("opacity", "0");
  let phase = 0;
  const vals = [1000, 500];
  const flow = [
    () => {
      txL.textContent = "BEGIN TXN";
      stL.textContent = "";
      walL.setAttribute("opacity", "0");
      rows.forEach((_, i) => {
        vT[i].textContent = vals[i];
        gsap.to(rR[i], { attr: { fill: c + "0e" }, duration: 0.3 });
      });
    },
    () => {
      txL.textContent = "DEBIT A -300";
      gsap.to(rR[0], { attr: { fill: c + "33", stroke: c }, duration: 0.3 });
      vT[0].textContent = "700";
      walL.setAttribute("opacity", "1");
      walL.textContent = "📝 WAL: A=700";
      stL.textContent = "writing...";
    },
    () => {
      txL.textContent = "CREDIT B +300";
      gsap.to(rR[1], { attr: { fill: c + "33", stroke: c }, duration: 0.3 });
      vT[1].textContent = "800";
      walL.textContent = "📝 WAL: A=700,B=800";
    },
    () => {
      txL.textContent = "COMMIT ✓";
      txL.setAttribute("fill", "#22c55e");
      stL.textContent = "durable!";
      stL.setAttribute("fill", "#22c55e");
      rR.forEach((r) => gsap.to(r, { attr: { fill: "#22c55e22", stroke: "#22c55e55" }, duration: 0.4 }));
    },
    () => {
      txL.setAttribute("fill", c + "cc");
      rows.forEach((_, i) => {
        vT[i].textContent = vals[i];
        gsap.to(rR[i], { attr: { fill: c + "0e", stroke: c + "30" }, duration: 0.3 });
      });
      txL.textContent = "BEGIN again";
      stL.textContent = "";
      walL.textContent = "📝 WAL: ";
    },
    () => {
      txL.textContent = "DEBIT A -300";
      gsap.to(rR[0], { attr: { fill: c + "33", stroke: c }, duration: 0.3 });
      vT[0].textContent = "700";
      walL.setAttribute("opacity", "1");
    },
    () => {
      txL.textContent = "💥 CRASH!";
      txL.setAttribute("fill", "#ef4444");
      stL.textContent = "power failure";
      stL.setAttribute("fill", "#ef4444");
      rR.forEach((r) => gsap.to(r, { attr: { fill: "#ef444422", stroke: "#ef444455" }, duration: 0.3 }));
    },
    () => {
      txL.textContent = "🔄 ROLLBACK";
      txL.setAttribute("fill", "#fbbf24");
      stL.textContent = "replaying WAL";
      stL.setAttribute("fill", "#fbbf24");
      rows.forEach((_, i) => {
        vT[i].textContent = vals[i];
      });
      rR.forEach((r) => gsap.to(r, { attr: { fill: c + "0e", stroke: c + "30" }, duration: 0.5 }));
    },
    () => {
      txL.textContent = "✅ Restored!";
      txL.setAttribute("fill", "#22c55e");
      stL.textContent = "no data lost";
      stL.setAttribute("fill", "#22c55e");
      phase = -1;
    },
  ];
  const t = setInterval(() => {
    flow[(phase + flow.length) % flow.length]();
    phase++;
  }, 950);
  addTimer(id, t);
}

// ── CAP ──
function simCap(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const nodes = [
    { x: W / 2, y: 18, c: "#6366f1", l: "Node A" },
    { x: 55, y: 92, c: "#22d3ee", l: "Node B" },
    { x: W - 55, y: 92, c: "#a855f7", l: "Node C" },
  ];
  const circs = [],
    vers = [];
  nodes.forEach((n) => {
    const ci = sn("circle", { cx: n.x, cy: n.y, r: 18, fill: n.c + "22", stroke: n.c, "stroke-width": "1.5" }, s);
    glow(ci, n.c);
    tx(s, n.l, n.x, n.y + 30, n.c + "88", 6.5);
    const v = tx(s, "v=1", n.x, n.y + 5, n.c + "cc", 7.5, { w: "700" });
    circs.push(ci);
    vers.push(v);
  });
  const lines = [
    sn("line", { x1: nodes[0].x, y1: nodes[0].y + 18, x2: nodes[1].x, y2: nodes[1].y - 18, stroke: "#22c55e66", "stroke-width": "1.5" }, s),
    sn("line", { x1: nodes[0].x, y1: nodes[0].y + 18, x2: nodes[2].x, y2: nodes[2].y - 18, stroke: "#22c55e66", "stroke-width": "1.5" }, s),
    sn("line", { x1: nodes[1].x + 18, y1: nodes[1].y, x2: nodes[2].x - 18, y2: nodes[2].y, stroke: "#22c55e66", "stroke-width": "1.5" }, s),
  ];
  const stL = tx(s, "All nodes consistent ✓", W / 2, 114, "#22c55e", 7.5);
  let ver = 1,
    phase = 0;
  const flow = [
    () => {
      ver++;
      vers[0].textContent = `v=${ver}`;
      stL.textContent = `Write v=${ver} to primary...`;
      stL.setAttribute("fill", "#fbbf24");
      lines.forEach((l) => {
        l.setAttribute("stroke", "#22c55e66");
        l.removeAttribute("stroke-dasharray");
      });
    },
    () => {
      vers[1].textContent = `v=${ver}`;
      vers[2].textContent = `v=${ver}`;
      stL.textContent = `✅ All consistent v=${ver}`;
      stL.setAttribute("fill", "#22c55e");
    },
    () => {
      lines[0].setAttribute("stroke", "#ef444466");
      lines[1].setAttribute("stroke", "#ef444466");
      lines[0].setAttribute("stroke-dasharray", "4,3");
      lines[1].setAttribute("stroke-dasharray", "4,3");
      stL.textContent = "⚡ Network Partition! A ↔ B/C broken";
      stL.setAttribute("fill", "#ef4444");
    },
    () => {
      ver++;
      vers[0].textContent = `v=${ver}`;
      circs[0].setAttribute("fill", "#fbbf2422");
      vers[1].textContent = `v=${ver - 1} stale`;
      vers[2].textContent = `v=${ver - 1} stale`;
      circs[1].setAttribute("fill", "#ef444422");
      circs[2].setAttribute("fill", "#ef444422");
      stL.textContent = "CP: B/C readers BLOCKED until consistent";
      stL.setAttribute("fill", "#ef4444");
    },
    () => {
      stL.textContent = "AP: B/C serve stale data — always available";
      stL.setAttribute("fill", "#f59e0b");
      circs[1].setAttribute("fill", "#f59e0b22");
      circs[2].setAttribute("fill", "#f59e0b22");
    },
    () => {
      lines.forEach((l) => {
        l.setAttribute("stroke", "#22c55e66");
        l.removeAttribute("stroke-dasharray");
      });
      vers.forEach((v) => (v.textContent = `v=${ver}`));
      circs.forEach((ci, i) => ci.setAttribute("fill", nodes[i].c + "22"));
      stL.textContent = `✅ Partition healed — all synced v=${ver}`;
      stL.setAttribute("fill", "#22c55e");
      phase = -1;
    },
  ];
  const t = setInterval(() => {
    flow[(phase + flow.length) % flow.length]();
    phase++;
  }, 1100);
  addTimer(id, t);
}

// ── STREAM ──
function simStream(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 38, 72, 44, c, "Source", "Events");
  bx(s, W / 2 - 48, 12, 96, 96, c, "Processor", "Window/Agg");
  bx(s, W - 77, 38, 72, 44, c, "Sink", "Warehouse");
  ln(s, 77, 60, W / 2 - 48, 60, c);
  ln(s, W / 2 + 48, 60, W - 77, 60, c);
  const stL = tx(s, "", W / 2, 118, c + "66", 7);
  const pcs = ["#6366f1", "#a855f7", "#22d3ee", "#10b981", "#ef4444", "#fbbf24"];
  let pi = 0;
  const t = setInterval(() => {
    const p = pk(s, 77, 55 + Math.random() * 10 - 5, pcs[pi % pcs.length], 4);
    glow(p, pcs[pi % pcs.length]);
    gsap.to(p, {
      attr: { cx: W / 2 - 48, cy: 55 + Math.random() * 15 },
      duration: 0.35,
      onComplete: () => {
        p.setAttribute("fill", c);
        p.setAttribute("r", "3");
        gsap.to(p, {
          attr: { cx: W - 77, cy: 60 },
          duration: 0.35,
          delay: 0.1,
          onComplete: () => {
            stL.textContent = `Event #${pi + 1} processed & emitted to sink`;
            gsap.to(p, { opacity: 0, duration: 0.2, onComplete: () => p.remove() });
          },
        });
      },
    });
    pi++;
  }, 500);
  addTimer(id, t);
}

// ── DAG ──
function simDag(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const tasks = [
    { id: "T", x: 5, y: 50, w: 52, h: 22, l: "⏰ Trigger" },
    { id: "A", x: 72, y: 18, w: 62, h: 22, l: "A: Ingest" },
    { id: "B", x: 72, y: 80, w: 62, h: 22, l: "B: Validate" },
    { id: "C", x: 152, y: 49, w: 68, h: 22, l: "C: Transform" },
    { id: "D", x: 238, y: 49, w: 62, h: 22, l: "D: Load" },
    { id: "E", x: W - 68, y: 49, w: 63, h: 22, l: "✅ Done!" },
  ];
  const ctr = { T: [31, 61], A: [103, 29], B: [103, 91], C: [186, 60], D: [269, 60], E: [W - 36, 60] };
  [
    ["T", "A"],
    ["T", "B"],
    ["A", "C"],
    ["B", "C"],
    ["C", "D"],
    ["D", "E"],
  ].forEach(([a, b]) => {
    const [x1, y1] = ctr[a],
      [x2, y2] = ctr[b];
    ln(s, x1, y1, x2, y2, c);
  });
  const rects = {};
  tasks.forEach((t) => {
    const r = sn("rect", { x: t.x, y: t.y, width: t.w, height: t.h, rx: 4, fill: c + "12", stroke: c + "30", "stroke-width": "1.2" }, s);
    tx(s, t.l, t.x + t.w / 2, t.y + t.h / 2 + 4, c + "77", 7);
    rects[t.id] = r;
  });
  const stL = tx(s, "", W / 2, 115, c + "66", 7.5);
  const seq = ["T", "A", "B", "C", "D", "E"];
  let si = 0,
    prev = null;
  const t = setInterval(() => {
    if (prev) {
      gsap.to(rects[prev], { attr: { fill: c + "12", stroke: c + "30" }, duration: 0.2 });
    }
    const id_ = seq[si % seq.length];
    gsap.to(rects[id_], { attr: { fill: c + "44", stroke: c }, duration: 0.3 });
    stL.textContent = `Running: ${tasks.find((t) => t.id === id_).l}`;
    if (id_ === "E") {
      gsap.to(rects[id_], { attr: { fill: "#22c55e44", stroke: "#22c55e" }, duration: 0.3 });
      stL.textContent = "✅ Pipeline complete!";
      stL.setAttribute("fill", "#22c55e");
    } else stL.setAttribute("fill", c + "66");
    prev = id_;
    si++;
    if (si >= seq.length) si = 0;
  }, 700);
  addTimer(id, t);
}

// ── MVCC ──
function simMvcc(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const versions = [
    { v: "v1 (txn 50)", val: "salary=5000", y: 8 },
    { v: "v2 (txn 100)", val: "salary=6000", y: 34 },
    { v: "v3 (txn 115)", val: "salary=7000", y: 60 },
  ];
  const vR = [];
  versions.forEach((v, i) => {
    const r = sn("rect", { x: 5, y: v.y, width: 195, height: 22, rx: 4, fill: `${c}${((i + 1) * 8).toString(16).padStart(2, "0")}`, stroke: `${c}${((i + 1) * 20).toString(16).padStart(2, "0")}`, "stroke-width": "1" }, s);
    tx(s, v.v, 60, v.y + 14, c + ["44", "77", "aa"][i], 7.5, { a: "start" });
    tx(s, v.val, 160, v.y + 14, c + "cc", 8, { w: "700" });
    vR.push(r);
  });
  bx(s, W - 155, 8, 145, 28, "#22c55e", "Txn A (txn=100)", "sees v2 only");
  bx(s, W - 155, 48, 145, 28, c, "Txn B (txn=115)", "writes new v3!");
  const newR = sn("rect", { x: 5, y: 86, width: 195, height: 22, rx: 4, fill: c + "05", stroke: c + "15", "stroke-width": "1" }, s);
  tx(s, "v4 (txn 120): salary=8000 ← NEW", 100, 100, c + "33", 7);
  ln(s, W - 155, 22, 205, 47, "#22c55e", true);
  const stL = tx(s, "", W / 2, 116, c + "66", 7.5);
  let phase = 0;
  const flow = [
    () => {
      gsap.to(vR[1], { attr: { fill: "#22c55e22", stroke: "#22c55e44" }, duration: 0.4 });
      stL.textContent = "Txn A reads v2 snapshot — no locking needed";
      stL.setAttribute("fill", "#22c55e");
    },
    () => {
      gsap.to(newR, { attr: { fill: c + "22", stroke: c + "55" }, duration: 0.4 });
      stL.textContent = "Txn B writes new v4 — reader not blocked!";
      stL.setAttribute("fill", c + "cc");
    },
    () => {
      stL.textContent = "✓ No blocking! A sees v2, B writes v4 simultaneously";
      stL.setAttribute("fill", "#22d3ee");
    },
    () => {
      vR.forEach((r, i) => gsap.to(r, { attr: { fill: `${c}${((i + 1) * 5).toString(16).padStart(2, "0")}` }, duration: 0.3 }));
      gsap.to(newR, { attr: { fill: c + "05", stroke: c + "15" }, duration: 0.3 });
      phase = -1;
    },
  ];
  const t = setInterval(() => {
    flow[(phase + flow.length) % flow.length]();
    phase++;
  }, 1050);
  addTimer(id, t);
}

// ── DEADLOCK ──
function simDeadlock(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const gA = sn("g", {}, s);
  sn("rect", { x: 5, y: 8, width: 110, height: 34, rx: 5, fill: c + "18", stroke: c, "stroke-width": "1.5" }, gA);
  tx(s, "🔵 Txn A", 60, 24, c + "cc", 8.5, { w: "700" });
  tx(s, "UPDATE orders", 60, 37, c + "66", 7);
  const gB = sn("g", {}, s);
  sn("rect", { x: 5, y: 78, width: 110, height: 34, rx: 5, fill: "#ef444418", stroke: "#ef4444", "stroke-width": "1.5" }, gB);
  tx(s, "🔴 Txn B", 60, 94, "#ef4444cc", 8.5, { w: "700" });
  tx(s, "UPDATE payments", 60, 107, "#ef444466", 7);
  sn("rect", { x: W / 2 - 55, y: 8, width: 110, height: 28, rx: 5, fill: "#22c55e14", stroke: "#22c55e55", "stroke-width": "1.2" }, s);
  tx(s, "🔒 Row: orders", W / 2, 26, "#22c55e", 8);
  sn("rect", { x: W / 2 - 55, y: 78, width: 110, height: 28, rx: 5, fill: "#22c55e14", stroke: "#22c55e55", "stroke-width": "1.2" }, s);
  tx(s, "🔒 Row: payments", W / 2, 96, "#22c55e", 8);
  const stL = tx(s, "", W - 5, 60, c, 8, { a: "end" });
  const klL = tx(s, "", W - 5, 78, "#ef4444", 8, { a: "end" });
  const L1 = sn("line", { x1: 115, y1: 22, x2: W / 2 - 55, y2: 22, stroke: "#22c55e", "stroke-width": "1.8", "stroke-dasharray": "4,3", opacity: "0" }, s);
  const L2 = sn("line", { x1: 115, y1: 92, x2: W / 2 - 55, y2: 92, stroke: "#ef4444", "stroke-width": "1.8", "stroke-dasharray": "4,3", opacity: "0" }, s);
  const L3 = sn("line", { x1: 115, y1: 33, x2: W / 2 - 55, y2: 86, stroke: c, "stroke-width": "1.3", "stroke-dasharray": "5,3", opacity: "0" }, s);
  const L4 = sn("line", { x1: 115, y1: 86, x2: W / 2 - 55, y2: 30, stroke: "#ef4444", "stroke-width": "1.3", "stroke-dasharray": "5,3", opacity: "0" }, s);
  let phase = 0;
  const flow = [
    () => {
      stL.textContent = "A locks Row orders ✓";
      klL.textContent = "";
      gsap.to(L1, { opacity: 1, duration: 0.3 });
    },
    () => {
      stL.textContent = "B locks Row payments ✓";
      gsap.to(L2, { opacity: 1, duration: 0.3 });
    },
    () => {
      stL.textContent = "A wants payments ⏳";
      gsap.to(L3, { opacity: 1, duration: 0.3 });
    },
    () => {
      stL.textContent = "B wants orders ⏳";
      gsap.to(L4, { opacity: 1, duration: 0.3 });
    },
    () => {
      stL.textContent = "💀 DEADLOCK!";
      stL.setAttribute("fill", "#ef4444");
      klL.textContent = "→ Kill B, rollback";
      gB.querySelector("rect").setAttribute("fill", "#ef444444");
    },
    () => {
      [L1, L2, L3, L4].forEach((l) => gsap.to(l, { opacity: 0, duration: 0.3 }));
      stL.textContent = "A commits ✓";
      stL.setAttribute("fill", c);
      klL.textContent = "B retried & succeeded";
      gB.querySelector("rect").setAttribute("fill", "#ef444418");
      phase = -1;
    },
  ];
  const t = setInterval(() => {
    flow[(phase + flow.length) % flow.length]();
    phase++;
  }, 1000);
  addTimer(id, t);
}

// ── SHARDING ──
function simSharding(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 45, 75, 30, c, "Write Req", "user_id: ?");
  bx(s, W / 2 - 40, 25, 80, 70, c, "Router", "hash(user_id)");
  const shards = [
    { x: W - 130, y: 8, c: "#6366f1", r: "0–999K" },
    { x: W - 130, y: 44, c: "#a855f7", r: "1M–1.9M" },
    { x: W - 130, y: 80, c: "#ec4899", r: "2M–2.9M" },
  ];
  const sR = shards.map((sh) => {
    const r = sn("rect", { x: sh.x, y: sh.y, width: 125, height: 26, rx: 4, fill: sh.c + "12", stroke: sh.c + "44", "stroke-width": "1.2" }, s);
    tx(s, `Shard ${shards.indexOf(sh) + 1}: ${sh.r}`, sh.x + 62, sh.y + 16, sh.c + "aa", 7.5);
    return r;
  });
  ln(s, 80, 60, W / 2 - 40, 60, c);
  shards.forEach((sh) => ln(s, W / 2 + 40, 60, sh.x, sh.y + 13, sh.c, true));
  const reqL = tx(s, "uid: ?", 42, 43, c + "99", 7);
  const hashL = tx(s, "", W / 2, 22, c + "66", 7);
  const uids = [102, 1500300, 2100000, 45, 1999000, 2500000];
  let ri = 0;
  const t = setInterval(() => {
    const uid = uids[ri % uids.length];
    reqL.textContent = `uid: ${uid.toLocaleString()}`;
    const si = uid < 1000000 ? 0 : uid < 2000000 ? 1 : 2;
    hashL.textContent = `hash → shard ${si + 1}`;
    sR.forEach((r, i) => gsap.to(r, { attr: { fill: i === si ? shards[i].c + "44" : shards[i].c + "12", stroke: i === si ? shards[i].c : shards[i].c + "44" }, duration: 0.3 }));
    const p = pk(s, 80, 60, c);
    glow(p, c);
    gsap.to(p, {
      attr: { cx: W / 2 - 40 },
      duration: 0.3,
      onComplete: () => {
        p.setAttribute("fill", shards[si].c);
        glow(p, shards[si].c);
        gsap.to(p, { attr: { cx: shards[si].x, cy: shards[si].y + 13 }, duration: 0.4, onComplete: () => gsap.to(p, { opacity: 0, duration: 0.2, onComplete: () => p.remove() }) });
      },
    });
    ri++;
  }, 900);
  addTimer(id, t);
}

// ── REPLICATION ──
function simReplication(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 28, 85, 64, c, "Primary", "Write OK");
  bx(s, W / 2 - 48, 6, 96, 38, "#22c55e", "Replica 1", "SYNC — DR");
  bx(s, W / 2 - 48, 68, 96, 38, c, "Replica 2", "ASYNC — Read");
  bx(s, W - 90, 28, 85, 64, c, "Replica 3", "ASYNC — Read");
  tx(s, "SYNC →", W / 4, 22, "#22c55e", 6.5);
  tx(s, "ASYNC →", W / 4, 78, c + "66", 6.5);
  const stL = tx(s, "", W / 2, 116, c + "66", 7.5);
  const t = setInterval(() => {
    const ps = pk(s, 90, 45, "#22c55e");
    glow(ps, "#22c55e");
    gsap.to(ps, {
      attr: { cx: W / 2 - 48, cy: 25 },
      duration: 0.4,
      onComplete: () => {
        const ack = pk(s, W / 2 - 48, 25, "#22c55eaa", 4);
        gsap.to(ack, {
          attr: { cx: 90, cy: 45 },
          duration: 0.3,
          onComplete: () => {
            stL.textContent = "SYNC: primary waits ACK before returning ✓";
            ack.remove();
            ps.remove();
          },
        });
      },
    });
    setTimeout(() => {
      const pa = pk(s, 90, 75, c, 4);
      gsap.to(pa, { attr: { cx: W / 2 - 48, cy: 87 }, duration: 0.55, onComplete: () => { stL.textContent = "ASYNC: fire & forget, replica syncs in background"; pa.remove(); } });
    }, 200);
    setTimeout(() => {
      const pb = pk(s, 90, 60, c, 4);
      gsap.to(pb, { attr: { cx: W - 90, cy: 60 }, duration: 0.6, onComplete: () => pb.remove() });
    }, 350);
  }, 1200);
  addTimer(id, t);
}

// ── RBAC ──
function simRbac(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const cols = ["claim_id", "NIK 🔒", "jumlah", "status"];
  const cw = Math.floor((W - 10) / cols.length);
  cols.forEach((col, i) => {
    sn("rect", { x: 5 + i * cw, y: 5, width: cw - 3, height: 16, rx: 3, fill: c + "1a", stroke: c + "44", "stroke-width": "1" }, s);
    tx(s, col, 5 + i * cw + cw / 2, 16, c + "99", 7);
  });
  const data = [
    ["CLM-001", "320xxxxx", "5,000", "approved"],
    ["CLM-002", "321xxxxx", "3,200", "pending"],
    ["CLM-003", "322xxxxx", "8,100", "approved"],
  ];
  const cR = [],
    cT = [];
  data.forEach((row, ri) => {
    const rr = [],
      rt = [];
    row.forEach((cell, ci) => {
      const x = 5 + ci * cw,
        y = 24 + ri * 22;
      const r = sn("rect", { x, y, width: cw - 3, height: 18, rx: 2, fill: c + "08", stroke: c + "16", "stroke-width": "1" }, s);
      const t2 = tx(s, cell, x + cw / 2, y + 12, c + "88", 7);
      rr.push(r);
      rt.push(t2);
    });
    cR.push(rr);
    cT.push(rt);
  });
  const rL = tx(s, "👤 ADMIN VIEW", W / 2, 112, c + "cc", 8.5, { w: "700" });
  let admin = true;
  const t = setInterval(() => {
    admin = !admin;
    rL.textContent = admin ? "👤 ADMIN VIEW" : "🔒 ANALYST VIEW";
    rL.setAttribute("fill", admin ? c + "cc" : "#ef4444cc");
    cT.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        if (ci === 1) {
          cell.textContent = admin ? data[ri][1] : "••••••••";
          cell.setAttribute("fill", admin ? c + "88" : "#ef444488");
          gsap.to(cR[ri][ci], { attr: { fill: admin ? c + "08" : "#ef444414", stroke: admin ? c + "16" : "#ef444433" }, duration: 0.3 });
        }
      })
    );
  }, 1500);
  addTimer(id, t);
}

// ── INDEX / BTREE ──
function simBtree(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  tx(s, "❌ No Index: Full Scan", 65, 12, "#ef4444", 7.5, { w: "700" });
  const scanR = [];
  for (let i = 0; i < 6; i++) {
    const r = sn("rect", { x: 5, y: 15 + i * 15, width: 120, height: 13, rx: 3, fill: c + "0a", stroke: c + "1a", "stroke-width": "1" }, s);
    tx(s, `row ${i + 1}: date=2024-0${(i % 9) + 1}`, 65, 22 + i * 15, c + "55", 6.5);
    scanR.push(r);
  }
  tx(s, "✅ B-tree Index", W - 80, 12, "#22c55e", 7.5, { w: "700" });
  const rR = sn("rect", { x: W - 155, y: 18, width: 150, height: 20, rx: 4, fill: "#22c55e18", stroke: "#22c55e44", "stroke-width": "1.2" }, s);
  tx(s, "Root: 2024-06", W - 80, 31, "#22c55e", 7.5);
  const lR = sn("rect", { x: W - 155, y: 52, width: 68, height: 16, rx: 3, fill: "#22c55e0a", stroke: "#22c55e33", "stroke-width": "1" }, s);
  tx(s, "Leaf: Jan-Mar", W - 121, 62, "#22c55e77", 7);
  sn("rect", { x: W - 82, y: 52, width: 68, height: 16, rx: 3, fill: "#22c55e0a", stroke: "#22c55e33", "stroke-width": "1" }, s);
  tx(s, "Leaf: Apr-Jun", W - 48, 62, "#22c55e77", 7);
  sn("line", { x1: W - 80, y1: 38, x2: W - 121, y2: 52, stroke: "#22c55e44", "stroke-width": "1" }, s);
  sn("line", { x1: W - 80, y1: 38, x2: W - 48, y2: 52, stroke: "#22c55e44", "stroke-width": "1" }, s);
  const qL = tx(s, "Query: WHERE date='2024-01'", W / 2, 108, c + "66", 7.5);
  let scanning = false,
    si = 0;
  const t = setInterval(() => {
    if (!scanning) {
      scanR.forEach((r) => gsap.to(r, { attr: { fill: c + "0a" }, duration: 0.1 }));
      si = 0;
      scanning = true;
      qL.textContent = "Full scan: checking ALL 6 rows...";
      qL.setAttribute("fill", "#ef4444");
    } else {
      if (si < scanR.length) {
        gsap.to(scanR[si], { attr: { fill: si < 2 || si === 4 ? "#22c55e22" : c + "0a", stroke: si < 2 || si === 4 ? "#22c55e55" : c + "1a" }, duration: 0.2 });
        si++;
      } else {
        scanning = false;
        qL.textContent = "B-tree: jump to Jan leaf directly → rows 1,3 only!";
        qL.setAttribute("fill", "#22c55e");
        gsap.to(rR, { attr: { fill: "#22c55e44" }, duration: 0.3 });
        gsap.to(lR, { attr: { fill: "#22c55e33" }, duration: 0.3, delay: 0.3 });
        setTimeout(() => {
          gsap.to(rR, { attr: { fill: "#22c55e18" }, duration: 0.3 });
          gsap.to(lR, { attr: { fill: "#22c55e0a" }, duration: 0.3 });
          scanR.forEach((r) => gsap.to(r, { attr: { fill: c + "0a", stroke: c + "1a" }, duration: 0.2 }));
        }, 900);
      }
    }
  }, 240);
  addTimer(id, t);
}

// ── DQ ──
function simDq(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 35, 75, 50, c, "Data", "arrives");
  bx(s, W / 2 - 50, 10, 100, 100, c, "DQ Engine", "null/range/unique");
  bx(s, W - 85, 8, 80, 45, "#22c55e", "✅ Pass", "next layer");
  bx(s, W - 85, 63, 80, 45, "#ef4444", "❌ Fail", "quarantine");
  ln(s, 80, 60, W / 2 - 50, 60, c);
  const stL = tx(s, "", W / 2, 118, c + "66", 7.5);
  const cntL = tx(s, "✅0  ❌0", W / 2, 5, c + "66", 7);
  const recs = [
    { d: "NIK=320xx, amt=5000", ok: true },
    { d: "NIK=NULL, amt=3200", ok: false, r: "NIK is NULL" },
    { d: "NIK=320xx, amt=-100", ok: false, r: "amount < 0" },
    { d: "NIK=320xx, amt=8100", ok: true },
    { d: "claim_id=101 (dup)", ok: false, r: "duplicate ID" },
  ];
  let ri = 0,
    pass = 0,
    fail = 0;
  const t = setInterval(() => {
    const rec = recs[ri % recs.length];
    stL.textContent = `Checking: ${rec.d}`;
    const p = pk(s, 80, 60, c, 5);
    glow(p, c);
    gsap.to(p, {
      attr: { cx: W / 2 - 50 },
      duration: 0.4,
      onComplete: () => {
        p.setAttribute("fill", rec.ok ? "#22c55e" : "#ef4444");
        gsap.to(p, {
          attr: { cx: W - 85, cy: rec.ok ? 30 : 85 },
          duration: 0.4,
          onComplete: () => {
            if (rec.ok) {
              pass++;
              stL.textContent = `✅ PASS — ${rec.d}`;
            } else {
              fail++;
              stL.textContent = `❌ FAIL: ${rec.r} → quarantined`;
            }
            cntL.textContent = `✅${pass}  ❌${fail}`;
            gsap.to(p, { opacity: 0, duration: 0.2, delay: 0.4, onComplete: () => p.remove() });
          },
        });
      },
    });
    ri++;
  }, 1000);
  addTimer(id, t);
}

// ── CACHING ──
function simCaching(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 35, 70, 50, c, "App", "request");
  bx(s, W / 2 - 42, 8, 84, 44, c, "Redis Cache", "TTL: 5min");
  bx(s, W / 2 - 42, 65, 84, 44, c, "Database", "compute");
  bx(s, W - 75, 35, 70, 50, "#22c55e", "Response", "to user");
  ln(s, 75, 60, W / 2 - 42, 60, c);
  const hitL = tx(s, "", W / 2, 60, c + "cc", 8.5, { w: "700" });
  const stL = tx(s, "", W / 2, 116, c + "66", 7.5);
  let ttl = 0;
  const t = setInterval(() => {
    const hit = ttl < 4;
    hitL.textContent = hit ? "🎯 CACHE HIT! (2ms)" : "💨 CACHE MISS → DB";
    hitL.setAttribute("fill", hit ? "#22c55e" : "#ef4444");
    if (hit) {
      stL.textContent = "HIT: return cached result in 2ms (DB not touched)";
      stL.setAttribute("fill", "#22c55e");
      const p = pk(s, 75, 60, c);
      gsap.to(p, { attr: { cx: W / 2 - 42, cy: 30 }, duration: 0.25, onComplete: () => { p.setAttribute("fill", "#22c55e"); gsap.to(p, { attr: { cx: W - 75, cy: 60 }, duration: 0.2, onComplete: () => p.remove() }); } });
    } else {
      stL.textContent = "MISS: query DB (300ms) → store in Redis → serve";
      stL.setAttribute("fill", "#f59e0b");
      const p = pk(s, 75, 60, c);
      gsap.to(p, {
        attr: { cx: W / 2 - 42, cy: 87 },
        duration: 0.3,
        onComplete: () => {
          gsap.to(p, {
            attr: { cy: 30 },
            duration: 0.25,
            onComplete: () => {
              p.setAttribute("fill", "#22c55e");
              gsap.to(p, { attr: { cx: W - 75, cy: 60 }, duration: 0.25, onComplete: () => p.remove() });
            },
          });
        },
      });
      if (ttl >= 6) ttl = 0;
    }
    ttl++;
  }, 900);
  addTimer(id, t);
}

// ── STAR SCHEMA ──
function simStar(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const cx = W / 2,
    cy = 62;
  const fR = sn("rect", { x: cx - 55, y: cy - 24, width: 110, height: 48, rx: 6, fill: c + "20", stroke: c, "stroke-width": "1.8" }, s);
  tx(s, "fact_sales", cx, cy - 10, c + "cc", 8.5, { w: "700" });
  tx(s, "amount, date_sk", cx, cy + 2, c + "66", 6.5);
  tx(s, "cust_sk, store_sk", cx, cy + 13, c + "66", 6.5);
  const dims = [
    { x: 18, y: 8, l: "dim_date", c: "#6366f1" },
    { x: W - 138, y: 8, l: "dim_customer", c: "#a855f7" },
    { x: 18, y: 92, l: "dim_store", c: "#06b6d4" },
    { x: W - 138, y: 92, l: "dim_product", c: "#22c55e" },
  ];
  const dR = dims.map((d) => {
    const r = sn("rect", { x: d.x, y: d.y, width: 118, height: 22, rx: 5, fill: d.c + "14", stroke: d.c + "55", "stroke-width": "1.2" }, s);
    tx(s, d.l, d.x + 59, d.y + 14, d.c + "aa", 8);
    return r;
  });
  const dC = [
    [77, 19],
    [W - 79, 19],
    [77, 103],
    [W - 79, 103],
  ];
  const lns = dC.map((dc, i) => ln(s, dc[0], dc[1], cx, cy, dims[i].c, true));
  const stL = tx(s, "", W / 2, 118, c + "66", 7.5);
  let qi = 0;
  const t = setInterval(() => {
    dR.forEach((r, i) => gsap.to(r, { attr: { fill: dims[i].c + "14", stroke: dims[i].c + "55" }, duration: 0.2 }));
    lns.forEach((l, i) => l.setAttribute("stroke", dims[i].c + "33"));
    gsap.to(fR, { attr: { fill: c + "20" }, duration: 0.2 });
    const di = qi % 4;
    gsap.to(dR[di], { attr: { fill: dims[di].c + "44", stroke: dims[di].c }, duration: 0.35 });
    lns[di].setAttribute("stroke", dims[di].c + "88");
    const p = pk(s, dC[di][0], dC[di][1], dims[di].c);
    glow(p, dims[di].c);
    gsap.to(p, {
      attr: { cx, cy },
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(fR, { attr: { fill: c + "44" }, duration: 0.2, yoyo: true, repeat: 1 });
        stL.textContent = `JOIN fact_sales ↔ ${dims[di].l}`;
        p.remove();
      },
    });
    qi++;
  }, 1000);
  addTimer(id, t);
}

// ── PARTITION ──
function simPartitioning(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const pw = Math.floor((W - 10) / 12);
  const pR = months.map((m, i) => {
    const x = 5 + i * pw;
    const r = sn("rect", { x, y: 28, width: pw - 2, height: 52, rx: 3, fill: c + "0e", stroke: c + "22", "stroke-width": "1" }, s);
    tx(s, m, x + pw / 2, 46, c + "44", 6);
    return r;
  });
  tx(s, "PARTITION BY DATE(created_at)", W / 2, 15, c + "77", 8);
  const cntL = months.map((m, i) => tx(s, "0", 5 + i * pw + pw / 2, 72, c + "44", 6.5));
  const stL = tx(s, "", W / 2, 96, c + "66", 7.5);
  const insertDates = [2, 2, 5, 0, 8, 2, 11, 5, 2, 2, 5, 2];
  let ii = 0;
  const counts = new Array(12).fill(0);
  const t = setInterval(() => {
    if (ii % 9 === 8) {
      stL.textContent = "Query WHERE month='Mar' → prune! scan only Mar partition (1/12 data)";
      stL.setAttribute("fill", "#fbbf24");
      pR.forEach((r, i) => gsap.to(r, { attr: { fill: i === 2 ? c + "55" : c + "06", stroke: i === 2 ? c : c + "18" }, duration: 0.3 }));
      setTimeout(() => {
        pR.forEach((r, i) => gsap.to(r, { attr: { fill: `${c}${Math.min(counts[i] * 4 + 10, 60).toString(16)}`, stroke: c + "22" }, duration: 0.3 }));
        stL.textContent = "Inserting data...";
        stL.setAttribute("fill", c + "66");
      }, 1100);
    } else {
      const mi = insertDates[ii % insertDates.length];
      counts[mi]++;
      gsap.to(pR[mi], {
        attr: { fill: c + "44", stroke: c },
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          const fill = Math.min(counts[mi] * 5 + 10, 60).toString(16).padStart(2, "0");
          gsap.to(pR[mi], { attr: { fill: `${c}${fill}` }, duration: 0.2 });
        },
      });
      cntL[mi].textContent = counts[mi];
      stL.textContent = `INSERT → routed to partition[${mi}] (${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][mi]})`;
    }
    ii++;
  }, 450);
  addTimer(id, t);
}

// ── SCD ──
function simScd(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const cols = ["sk", "id", "address", "eff_date", "exp_date", "current"];
  const cw = Math.floor((W - 10) / 6);
  cols.forEach((col, i) => {
    sn("rect", { x: 5 + i * cw, y: 5, width: cw - 2, height: 14, rx: 2, fill: c + "16", stroke: c + "33", "stroke-width": "1" }, s);
    tx(s, col, 5 + i * cw + cw / 2, 14, c + "88", 6);
  });
  const row1 = ["1", "cust-01", "Jl. Mawar 5", "2022-01", "2024-06", "FALSE"];
  const row2 = ["1", "cust-01", "Jl. Melati 10", "2024-06", "9999-99", "TRUE"];
  const r1rects = [],
    r2rects = [];
  row1.forEach((cell, i) => {
    const x = 5 + i * cw;
    const r = sn("rect", { x, y: 22, width: cw - 2, height: 16, rx: 2, fill: c + "0a", stroke: c + "22", "stroke-width": "1" }, s);
    tx(s, cell, x + cw / 2, 32, i === 5 ? "#ef4444" : c + "77", 6.5);
    r1rects.push(r);
  });
  row2.forEach((cell, i) => {
    const x = 5 + i * cw;
    const r = sn("rect", { x, y: 41, width: cw - 2, height: 16, rx: 2, fill: c + "00", stroke: c + "00", "stroke-width": "1" }, s);
    tx(s, cell, x + cw / 2, 51, c + "00", 6.5);
    r2rects.push(r);
  });
  const stL = tx(s, "One active row (is_current=TRUE)", W / 2, 75, c + "77", 8);
  const chL = tx(s, "", W / 2, 90, "#fbbf24", 7.5);
  const newL = tx(s, "", W / 2, 108, "#22c55e", 7.5);
  let phase = 0;
  const flow = [
    () => {
      stL.textContent = "Normal: one active row";
      chL.textContent = "";
      newL.textContent = "";
    },
    () => {
      chL.textContent = "🔔 Address change detected!";
      r1rects.forEach((r) => gsap.to(r, { attr: { fill: "#fbbf2416", stroke: "#fbbf2444" }, duration: 0.3 }));
    },
    () => {
      stL.textContent = "Type 2: expire old row (is_current=FALSE)";
      if (r1rects[5]) r1rects[5].setAttribute("fill", "#ef444422");
      if (r1rects[4]) r1rects[4].setAttribute("fill", "#ef444422");
    },
    () => {
      stL.textContent = "Insert new row with new address";
      r2rects.forEach((r) => gsap.to(r, { attr: { fill: "#22c55e18", stroke: "#22c55e44" }, duration: 0.4 }));
      s.querySelectorAll("text").forEach((tEl) => {
        if (tEl.getAttribute("fill") === "transparent" || tEl.getAttribute("fill") === c + "00") tEl.setAttribute("fill", "#22c55e88");
      });
      newL.textContent = "✅ New row (is_current=TRUE) — full history preserved!";
      phase = -1;
    },
  ];
  const t = setInterval(() => {
    flow[(phase + flow.length) % flow.length]();
    phase++;
  }, 1050);
  addTimer(id, t);
}

// ── TWOPC ──
function simTwopc(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, W / 2 - 48, 5, 96, 28, c, "Coordinator", "2PC Manager");
  bx(s, 8, 60, 105, 48, c, "DB A: Bank Nusantara", "debit -1000");
  bx(s, W - 113, 60, 105, 48, c, "DB B: Bank Mitra", "credit +1000");
  ln(s, W / 2, 33, 60, 60, c, true);
  ln(s, W / 2, 33, W - 60, 60, c, true);
  const sA = tx(s, "waiting...", 60, 88, c + "66", 7.5);
  const sB = tx(s, "waiting...", W - 60, 88, c + "66", 7.5);
  const cL = tx(s, "", W / 2, 48, c + "88", 7.5);
  const fL = tx(s, "", W / 2, 116, c + "77", 8);
  let phase = 0;
  const flow = [
    () => {
      cL.textContent = "Phase 1: PREPARE →";
      sA.textContent = "preparing...";
      sB.textContent = "preparing...";
      fL.textContent = "";
      [60, W - 60].forEach((x) => {
        const p = pk(s, W / 2, 19, c);
        gsap.to(p, { attr: { cx: x, cy: 60 }, duration: 0.35, onComplete: () => p.remove() });
      });
    },
    () => {
      sA.textContent = "VOTE YES ✓";
      sA.setAttribute("fill", "#22c55e");
      const p = pk(s, 60, 60, "#22c55e", 4);
      gsap.to(p, { attr: { cx: W / 2, cy: 19 }, duration: 0.3, onComplete: () => p.remove() });
    },
    () => {
      sB.textContent = "VOTE YES ✓";
      sB.setAttribute("fill", "#22c55e");
      const p = pk(s, W - 60, 60, "#22c55e", 4);
      gsap.to(p, { attr: { cx: W / 2, cy: 19 }, duration: 0.3, onComplete: () => p.remove() });
    },
    () => {
      cL.textContent = "Phase 2: COMMIT ALL →";
      [60, W - 60].forEach((x) => {
        const p = pk(s, W / 2, 19, "#22c55e");
        gsap.to(p, { attr: { cx: x, cy: 60 }, duration: 0.3, onComplete: () => p.remove() });
      });
    },
    () => {
      sA.textContent = "COMMITTED ✅";
      sB.textContent = "COMMITTED ✅";
      fL.textContent = "✅ Atomic cross-DB commit — both or neither!";
      fL.setAttribute("fill", "#22c55e");
      phase = -1;
    },
  ];
  const t = setInterval(() => {
    flow[(phase + flow.length) % flow.length]();
    phase++;
  }, 950);
  addTimer(id, t);
}

// ── CONNPOOL ──
function simConnpool(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  ["App 1", "App 2", "App 3", "App 4"].forEach((a, i) => {
    sn("rect", { x: 5, y: 8 + i * 27, width: 58, height: 22, rx: 4, fill: c + "10", stroke: c + "30", "stroke-width": "1" }, s);
    tx(s, a, 34, 21 + i * 27, c + "88", 7.5);
  });
  bx(s, W / 2 - 48, 8, 96, 104, c, "PgBouncer Pool", "max: 5 conns");
  bx(s, W - 78, 38, 73, 44, c, "PostgreSQL", "DB");
  const slots = Array.from({ length: 5 }, (_, i) => {
    const r = sn("rect", { x: W / 2 - 40, y: 22 + i * 18, width: 80, height: 14, rx: 3, fill: c + "0a", stroke: c + "22", "stroke-width": "1" }, s);
    tx(s, "idle", W / 2, 22 + i * 18 + 10, c + "33", 6.5);
    return r;
  });
  const stL = tx(s, "", W / 2, 118, c + "66", 7.5);
  const inUse = new Set();
  const t = setInterval(() => {
    const free = [...Array(5).keys()].find((i) => !inUse.has(i));
    if (free === undefined) {
      stL.textContent = "All conns busy — request queued ⏳";
      return;
    }
    const ai = Math.floor(Math.random() * 4);
    inUse.add(free);
    gsap.to(slots[free], { attr: { fill: c + "44", stroke: c }, duration: 0.25 });
    const p = pk(s, 63, 8 + ai * 27 + 11, c, 4);
    gsap.to(p, { attr: { cx: W / 2 - 48 }, duration: 0.3, onComplete: () => p.remove() });
    stL.textContent = `App ${ai + 1} borrowed conn #${free + 1} — reusing existing connection`;
    setTimeout(() => {
      inUse.delete(free);
      gsap.to(slots[free], { attr: { fill: c + "0a", stroke: c + "22" }, duration: 0.25 });
      stL.textContent = `Conn #${free + 1} returned to pool — available for next request`;
    }, 600 + Math.random() * 500);
  }, 450);
  addTimer(id, t);
}

// ── WAL ──
function simWal(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 40, 72, 40, c, "App", "Write req");
  bx(s, W / 2 - 55, 8, 110, 42, "#fbbf24", "WAL Log", "sequential, fast");
  bx(s, W / 2 - 55, 62, 110, 42, c, "Storage", "heap/data pages");
  bx(s, W - 77, 40, 72, 40, "#22c55e", "ACK", "to app");
  ln(s, 77, 60, W / 2 - 55, 29, c);
  ln(s, W / 2 + 55, 29, W - 77, 60, "#22c55e");
  ln(s, W / 2, 50, W / 2, 62, c, true);
  tx(s, "1st: write WAL", W / 4, 22, c + "66", 6.5);
  tx(s, "2nd: ACK", W - 38, 38, "#22c55e77", 6.5);
  tx(s, "3rd: apply async", W / 2, 90, c + "44", 6.5);
  bx(s, 5, 8, 72, 24, "#a855f7", "Debezium", "reads WAL");
  ln(s, W / 2 - 55, 29, 77, 20, "#a855f7", true);
  const walL = tx(s, "", W / 2, 48, "#fbbf24cc", 7, { w: "700" });
  const stL = tx(s, "", W / 2, 112, c + "66", 7.5);
  const ops = ["UPDATE salary=7000", "INSERT claim_id=101", "DELETE order_id=55", "UPDATE status=paid"];
  let oi = 0;
  const t = setInterval(() => {
    const op = ops[oi % ops.length];
    walL.textContent = `LSN-${1000 + oi}: ${op}`;
    const p = pk(s, 77, 60, c);
    glow(p, c);
    gsap.to(p, {
      attr: { cx: W / 2 - 55, cy: 29 },
      duration: 0.35,
      onComplete: () => {
        const ack = pk(s, W / 2 + 55, 29, "#22c55eaa", 4);
        gsap.to(ack, {
          attr: { cx: W - 77, cy: 60 },
          duration: 0.25,
          onComplete: () => {
            stL.textContent = "WAL written → ACK sent immediately → storage updated async";
            ack.remove();
            const sp = pk(s, W / 2, 50, c, 3);
            gsap.to(sp, { attr: { cy: 62 }, duration: 0.3, delay: 0.1, onComplete: () => sp.remove() });
          },
        });
        p.remove();
      },
    });
    oi++;
  }, 1000);
  addTimer(id, t);
}

// ── IDEMPOTENCY ──
function simIdempotency(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 30, 78, 60, c, "Events", "retried?");
  bx(s, W / 2 - 48, 10, 96, 100, c, "Pipeline", "dedup check");
  bx(s, W - 83, 30, 78, 60, c, "Warehouse", "MERGE/UPSERT");
  const evL = tx(s, "event: ?", 44, 28, c + "88", 7);
  const chL = tx(s, "", W / 2, 58, c + "99", 7.5);
  const rL = tx(s, "", W - 44, 28, c, 7);
  const cntL = tx(s, "processed: 0  skipped: 0", W / 2, 118, c + "55", 7.5);
  const seen = new Set();
  const evs = ["event-001", "event-002", "event-001", "event-001", "event-003", "event-002"];
  let ei = 0,
    pc = 0,
    sc = 0;
  const t = setInterval(() => {
    const ev = evs[ei % evs.length];
    evL.textContent = `event: ${ev}`;
    const isNew = !seen.has(ev);
    const p = pk(s, 83, 60, isNew ? c : "#475569", 5);
    if (isNew) glow(p, c);
    gsap.to(p, {
      attr: { cx: W / 2 - 48 },
      duration: 0.35,
      onComplete: () => {
        chL.textContent = isNew ? "New ✓ → process" : "Already seen → SKIP 🔁";
        chL.setAttribute("fill", isNew ? "#22c55e" : "#94a3b8");
        if (isNew) {
          seen.add(ev);
          pc++;
          p.setAttribute("fill", "#22c55e");
          gsap.to(p, { attr: { cx: W - 83 }, duration: 0.3, onComplete: () => { rL.textContent = "MERGE ✓"; rL.setAttribute("fill", "#22c55e"); gsap.to(p, { opacity: 0, duration: 0.2, onComplete: () => p.remove() }); } });
        } else {
          sc++;
          rL.textContent = "(skipped)";
          rL.setAttribute("fill", "#94a3b8");
          gsap.to(p, { opacity: 0, duration: 0.3, delay: 0.3, onComplete: () => p.remove() });
        }
        cntL.textContent = `processed: ${pc}  skipped: ${sc}`;
      },
    });
    ei++;
  }, 1000);
  addTimer(id, t);
}

// ── ELT ──
function simElt(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const stages = [
    { x: 5, y: 38, w: 68, h: 44, l: "Source", sub: "MySQL/API", c },
    { x: 88, y: 38, w: 68, h: 44, l: "Raw Layer", sub: "raw table", c: "#fbbf24" },
    { x: 172, y: 18, w: 80, h: 84, l: "dbt Transform", sub: "staging→mart", c: "#a855f7" },
    { x: 267, y: 38, w: 68, h: 44, l: "Mart Layer", sub: "Analytics", c: "#22c55e" },
    { x: W - 73, y: 38, w: 68, h: 44, l: "BI Tool", sub: "Dashboards", c: "#06b6d4" },
  ];
  stages.forEach((st) => bx(s, st.x, st.y, st.w, st.h, st.c, st.l, st.sub));
  const xs = [
    [73, 156],
    [156, 172],
    [252, 267],
    [335, W - 73],
  ];
  xs.forEach(([x1, x2]) => ln(s, x1, 60, x2, 60, c));
  const stL = tx(s, "", W / 2, 118, c + "66", 7.5);
  const msgs = ["Extracting from source...", "Loading raw → warehouse raw layer...", "dbt transforming: staging→intermediate→mart...", "Mart layer ready for queries!", "Dashboard served to users ✓"];
  let pi = 0;
  const cols = [c, "#fbbf24", "#a855f7", "#22c55e", "#06b6d4"];
  const t = setInterval(() => {
    const si = pi % 5;
    stL.textContent = msgs[si];
    if (si < 4) {
      const fromX = stages[si].x + stages[si].w;
      const p = pk(s, fromX, 60, cols[si]);
      glow(p, cols[si]);
      gsap.to(p, { attr: { cx: stages[si + 1].x }, duration: 0.4, ease: "power2.inOut", onComplete: () => p.remove() });
    }
    pi++;
  }, 700);
  addTimer(id, t);
}

// ── ETL ──
function simEtl(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 35, 70, 50, c, "Source", "OLTP DB");
  bx(s, W / 2 - 55, 10, 110, 100, c, "ETL Engine", "Extract→Transform");
  bx(s, W - 75, 35, 70, 50, c, "DWH", "loaded!");
  ln(s, 75, 60, W / 2 - 55, 60, c);
  ln(s, W / 2 + 55, 60, W - 75, 60, c);
  const stL = tx(s, "", W / 2, 118, c + "66", 7.5);
  const steps = ["Extract: SELECT * FROM source", "Transform: clean NULL values", "Transform: join dimension tables", "Transform: aggregate metrics", "Validate: schema check", "Load to DWH target ✓"];
  let si = 0;
  const t = setInterval(() => {
    stL.textContent = steps[si % steps.length];
    const p = pk(s, 75, 60, c);
    glow(p, c);
    gsap.to(p, {
      attr: { cx: W / 2 - 55 },
      duration: 0.3,
      onComplete: () => {
        p.setAttribute("fill", "#a855f7");
        if (si % steps.length === 5) {
          gsap.to(p, { attr: { cx: W - 75 }, duration: 0.3, onComplete: () => p.remove() });
        } else {
          gsap.to(p, { opacity: 0, duration: 0.2, onComplete: () => p.remove() });
        }
      },
    });
    si++;
  }, 700);
  addTimer(id, t);
}

// ── FOREIGN KEY ──
function simForeignkey(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 8, 160, 50, c, "dim_customer (parent)", "");
  ["sk=1 ✓", "sk=2 ✓", "sk=3 ✓"].forEach((r, i) => tx(s, r, 82, 24 + i * 13, c + "88", 7.5));
  bx(s, 5, 68, 160, 44, c, "fact_orders (child)", "");
  const iL = tx(s, "INSERT customer_sk=?", 82, 88, c + "aa", 8.5);
  bx(s, W - 125, 38, 120, 44, c, "FK Check", "Does PK exist?");
  const rL = tx(s, "", W - 65, 90, c, 8);
  const ins = [
    { v: 1, ok: true },
    { v: 99, ok: false },
    { v: 2, ok: true },
    { v: 404, ok: false },
    { v: 3, ok: true },
  ];
  let ii = 0;
  const t = setInterval(() => {
    const ins_ = ins[ii % ins.length];
    iL.textContent = `INSERT customer_sk=${ins_.v}`;
    const p = pk(s, 160, 90, c);
    glow(p, c);
    gsap.to(p, {
      attr: { cx: W - 125 },
      duration: 0.4,
      onComplete: () => {
        p.setAttribute("fill", ins_.ok ? "#22c55e" : "#ef4444");
        rL.textContent = ins_.ok ? "✅ FK OK — allowed" : "❌ FK VIOLATION — rejected";
        rL.setAttribute("fill", ins_.ok ? "#22c55e" : "#ef4444");
        gsap.to(p, { opacity: 0, duration: 0.2, delay: 0.5, onComplete: () => p.remove() });
      },
    });
    ii++;
  }, 1200);
  addTimer(id, t);
}

// ── UNIQUE ──
function simUnique(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 5, 160, 88, c, "customers", "UNIQUE(email)");
  const rows = [
    { v: "a@mail.com", y: 20 },
    { v: "b@mail.com", y: 38 },
    { v: "c@mail.com", y: 56 },
  ];
  rows.forEach((r) => {
    sn("rect", { x: 8, y: r.y, width: 154, height: 15, rx: 3, fill: c + "0a", stroke: c + "22", "stroke-width": "1" }, s);
    tx(s, r.v, 85, r.y + 10.5, c + "77", 7.5);
  });
  bx(s, W - 145, 28, 140, 60, c, "UNIQUE Index", "binary search");
  const rL = tx(s, "", W - 75, 97, c, 8);
  const iL = tx(s, "INSERT email=?", W - 75, 18, c + "88", 7.5);
  const ins = [
    { v: "d@mail.com", ok: true },
    { v: "a@mail.com", ok: false },
    { v: "e@mail.com", ok: true },
    { v: "b@mail.com", ok: false },
  ];
  let ii = 0;
  const t = setInterval(() => {
    const ins_ = ins[ii % ins.length];
    iL.textContent = `INSERT '${ins_.v}'`;
    const p = pk(s, 160, 55, c);
    glow(p, c);
    gsap.to(p, {
      attr: { cx: W - 145 },
      duration: 0.4,
      onComplete: () => {
        p.setAttribute("fill", ins_.ok ? "#22c55e" : "#ef4444");
        rL.textContent = ins_.ok ? "✅ UNIQUE OK — inserted" : "❌ DUPLICATE — rejected";
        rL.setAttribute("fill", ins_.ok ? "#22c55e" : "#ef4444");
        gsap.to(p, { opacity: 0, duration: 0.2, delay: 0.5, onComplete: () => p.remove() });
      },
    });
    ii++;
  }, 1200);
  addTimer(id, t);
}

// ── CDC ──
function simCdc(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 8, 90, 104, c, "MySQL DB", "");
  const ops = [
    { t: "INSERT", c: "#22c55e" },
    { t: "UPDATE", c: "#fbbf24" },
    { t: "DELETE", c: "#ef4444" },
    { t: "INSERT", c: "#22c55e" },
  ];
  const lR = ops.map((op, i) => {
    const r = sn("rect", { x: 8, y: 14 + i * 23, width: 84, height: 20, rx: 3, fill: op.c + "12", stroke: op.c + "33", "stroke-width": "1" }, s);
    tx(s, op.t, 50, 25 + i * 23, op.c, 8, { w: "700" });
    return r;
  });
  bx(s, W / 2 - 50, 20, 100, 30, c, "Debezium", "reads binlog");
  bx(s, W / 2 - 50, 65, 100, 30, c, "Kafka", "event stream");
  bx(s, W - 95, 20, 90, 40, "#22c55e", "Warehouse", "sink");
  ln(s, 95, 65, W / 2 - 50, 35, c, true);
  ln(s, W / 2 + 50, 35, W / 2 + 50, 65, c);
  ln(s, W / 2 + 50, 80, W - 95, 40, "#22c55e");
  let oi = 0;
  const t = setInterval(() => {
    const op = ops[oi % 4];
    lR.forEach((r, i) => gsap.to(r, { attr: { fill: i === oi % 4 ? ops[i].c + "33" : ops[i].c + "12" }, duration: 0.2 }));
    const p = pk(s, 95, 35 + (oi % 4) * 23, op.c);
    glow(p, op.c);
    gsap.to(p, {
      attr: { cx: W / 2 - 50, cy: 35 },
      duration: 0.45,
      onComplete: () => {
        p.setAttribute("fill", c);
        gsap.to(p, {
          attr: { cy: 80 },
          duration: 0.3,
          onComplete: () => {
            gsap.to(p, { attr: { cx: W - 95, cy: 40 }, duration: 0.35, onComplete: () => gsap.to(p, { opacity: 0, duration: 0.2, onComplete: () => p.remove() }) });
          },
        });
      },
    });
    oi++;
  }, 850);
  addTimer(id, t);
}

// ── COLUMNAR ──
function simColumnar(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const hw = Math.floor((W - 20) / 2);
  tx(s, "Row Storage", hw / 2 + 5, 12, "#94a3b8", 7.5, { w: "700" });
  const rowData = [
    ["id", "name", "salary", "dept"],
    ["1", "John", "5000", "Eng"],
    ["2", "Jane", "6000", "HR"],
    ["3", "Bob", "5500", "Eng"],
  ];
  rowData.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      const cw2 = hw / 4;
      sn("rect", { x: 5 + ci * cw2, y: 16 + ri * 18, width: cw2 - 2, height: 16, rx: 2, fill: ri === 0 ? c + "1a" : c + "0a", stroke: c + "22", "stroke-width": "1" }, s);
      tx(s, cell, 5 + ci * cw2 + cw2 / 2, 26 + ri * 18, ri === 0 ? c + "99" : c + "66", 7);
    });
  });
  tx(s, "Columnar Storage", hw + hw / 2 + 15, 12, "#22c55e", 7.5, { w: "700" });
  const cols = [["salary"], ["5000"], ["6000"], ["5500"]];
  const colR = cols.map((col, i) => {
    const r = sn("rect", { x: hw + 15 + i * (hw / 4), y: 22, width: hw / 4 - 3, height: 70, rx: 3, fill: i === 0 ? c + "18" : c + "0a", stroke: i === 0 ? "#22c55e55" : c + "22", "stroke-width": "1" }, s);
    col.forEach((v, j) => tx(s, v, hw + 15 + i * (hw / 4) + (hw / 4 - 3) / 2, 22 + j * 18 + 13, i === 0 ? "#22c55ecc" : c + "77", 7));
    return r;
  });
  tx(s, "SELECT SUM(salary)...", W / 2, 108, c + "66", 7.5);
  const stL = tx(s, "", W / 2, 120, c + "55", 7);
  let phase = 0;
  const t = setInterval(() => {
    if (phase === 0) {
      stL.textContent = "Row storage: must read ALL columns even though we only need salary";
      s.querySelectorAll("rect").forEach((r, i) => {
        if (i >= 1 && i <= 12) gsap.to(r, { attr: { fill: c + "22" }, duration: 0.2, delay: (i % 4) * 0.1 });
      });
    } else if (phase === 1) {
      stL.textContent = "Columnar: read ONLY salary column — skip id, name, dept entirely!";
      colR.forEach((r, i) => gsap.to(r, { attr: { fill: i === 0 ? "#22c55e33" : c + "0a" }, duration: 0.3 }));
    } else {
      s.querySelectorAll("rect").forEach((r) => gsap.to(r, { attr: { fill: c + "0a" }, duration: 0.2 }));
      colR.forEach((r) => gsap.to(r, { attr: { fill: c + "0a" }, duration: 0.2 }));
      phase = -1;
    }
    phase++;
  }, 1200);
  addTimer(id, t);
}

// ── BASE ──
function simBase(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 28, 85, 64, c, "Primary", "Write OK");
  bx(s, W / 2 - 45, 6, 90, 36, "#22c55e", "Replica 1", "(async)");
  bx(s, W / 2 - 45, 68, 90, 36, c, "Replica 2", "(async)");
  bx(s, W - 90, 28, 85, 64, c, "Replica 3", "(async)");
  const v1 = tx(s, "v=1", W / 2, 28, c + "77", 7);
  const v2 = tx(s, "v=1", W / 2, 90, c + "77", 7);
  const v3 = tx(s, "v=1", W - 47, 58, c + "77", 7);
  const stL = tx(s, "", W / 2, 116, "#fbbf24", 7.5);
  let ver = 1;
  const t = setInterval(() => {
    ver++;
    tx(s, `v=${ver}`, 45, 58, c + "cc", 8, { w: "700" });
    stL.textContent = `Write v=${ver} → ACK immediately, replicas sync in background`;
    const p1 = pk(s, 90, 45, c, 4);
    gsap.to(p1, { attr: { cx: W / 2 - 45, cy: 24 }, duration: 0.5, delay: 0.1, onComplete: () => { v1.textContent = `v=${ver}`; v1.setAttribute("fill", "#22c55e"); p1.remove(); } });
    const p2 = pk(s, 90, 65, c, 4);
    gsap.to(p2, { attr: { cx: W / 2 - 45, cy: 86 }, duration: 0.65, delay: 0.2, onComplete: () => { v2.textContent = `v=${ver}`; p2.remove(); } });
    const p3 = pk(s, 90, 55, c, 4);
    gsap.to(p3, { attr: { cx: W - 90, cy: 60 }, duration: 0.55, delay: 0.3, onComplete: () => { v3.textContent = `v=${ver}`; p3.remove(); } });
  }, 1300);
  addTimer(id, t);
}

// ── VACUUM ──
function simVacuum(wrap, c, id) {
  const { s, W } = makeSVG(wrap);
  const rows = Array.from({ length: 8 }, (_, i) => ({ y: 8 + i * 13, dead: i === 2 || i === 4 || i === 6 }));
  const rects = rows.map((r) => {
    const rect = sn("rect", { x: 5, y: r.y, width: W / 2 - 20, height: 11, rx: 2, fill: r.dead ? "#ef444420" : "#22c55e14", stroke: r.dead ? "#ef444440" : "#22c55e33", "stroke-width": "1" }, s);
    tx(s, r.dead ? "💀 DEAD TUPLE" : "✓ Live row", W / 4, r.y + 8.5, r.dead ? "#ef444488" : "#22c55e77", 6.5);
    return rect;
  });
  tx(s, "← Table Storage", W / 4, 116, c + "55", 7.5);
  bx(s, W / 2 + 10, 8, W / 2 - 15, 56, c, "VACUUM", "running...");
  const stL = tx(s, "", (3 * W) / 4, 75, c + "77", 8);
  const spaceL = tx(s, "", (3 * W) / 4, 92, c + "55", 7.5);
  const deadL = tx(s, `Dead tuples: ${rows.filter((r) => r.dead).length}`, (3 * W) / 4, 108, c + "66", 7.5);
  let phase = 0;
  const t = setInterval(() => {
    if (phase === 0) {
      stL.textContent = "VACUUM triggered (autovacuum)";
      spaceL.textContent = "Finding dead tuples...";
    } else if (phase <= 3) {
      const di = [2, 4, 6][phase - 1];
      gsap.to(rects[di], { attr: { fill: "#fbbf2422", stroke: "#fbbf2444" }, duration: 0.3 });
      stL.textContent = `Removing dead tuple at row ${di + 1}`;
    } else if (phase === 4) {
      rows.filter((r) => r.dead).forEach((_, i) => gsap.to(rects[[2, 4, 6][i]], { attr: { fill: c + "0a", stroke: c + "22" }, duration: 0.5 }));
      deadL.textContent = "Dead tuples: 0";
      stL.textContent = "✅ Dead tuples removed — space reclaimed!";
      spaceL.textContent = "Table size reduced, query faster";
    } else {
      rows.forEach((r, i) => gsap.to(rects[i], { attr: { fill: r.dead ? "#ef444420" : "#22c55e14", stroke: r.dead ? "#ef444440" : "#22c55e33" }, duration: 0.3 }));
      deadL.textContent = "Dead tuples: 3";
      stL.textContent = "New UPDATEs created dead tuples again...";
      phase = -1;
    }
    phase++;
  }, 1000);
  addTimer(id, t);
}

// ── GENERIC fallback ──
function simGeneric(wrap, c, id, label) {
  const { s, W } = makeSVG(wrap);
  bx(s, 5, 35, 78, 50, c, "Input", "data");
  bx(s, W / 2 - 55, 12, 110, 96, c, label || "Process", "concept");
  bx(s, W - 83, 35, 78, 50, c, "Output", "result");
  ln(s, 83, 60, W / 2 - 55, 60, c);
  ln(s, W / 2 + 55, 60, W - 83, 60, c);
  let pi = 0;
  const t = setInterval(() => {
    const p = pk(s, 83, 60, c);
    glow(p, c);
    gsap.to(p, {
      attr: { cx: W / 2 - 55 },
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(p, { attr: { cx: W - 83 }, duration: 0.35, onComplete: () => gsap.to(p, { opacity: 0, duration: 0.2, onComplete: () => p.remove() }) });
      },
    });
    pi++;
  }, 800);
  addTimer(id, t);
}

// ── DISPATCH ──
const SIM_MAP = {
  medallion: simMedallion, acid: simAcid, cap: simCap, stream: simStream, dag: simDag,
  mvcc: simMvcc, deadlock: simDeadlock, sharding: simSharding, replication: simReplication,
  rbac: simRbac, btree: simBtree, dq: simDq, caching: simCaching, star: simStar,
  partitioning: simPartitioning, scd: simScd, twopc: simTwopc, connpool: simConnpool,
  wal: simWal, idempotency: simIdempotency, elt: simElt, etl: simEtl,
  foreignkey: simForeignkey, unique: simUnique, cdc: simCdc, columnar: simColumnar,
  base: simBase, vacuum: simVacuum,
  // aliases (reuse a close-enough simulation for concepts without a bespoke one)
  lakehouse: simElt, lambda: simDag, fabric: simStream, dwlake: simElt, batch: simStream,
  mqueue: simStream, schemrw: simScd, rowcol: simColumnar, iceberg: simScd,
  clustering: simPartitioning, compaction: simVacuum, tiering: simCaching,
  storagetypes: simConnpool, snowflake: simStar, datavault: simScd, semantic: simElt,
  facttypes: simStar, catalog: simDq, lineage: simDag, mdm: simIdempotency,
  classification: simRbac, steward: simDq, mv: simCaching, queryopt: simBtree,
  bloom: simBtree, cbo: simBtree, masking: simRbac, encryption: simUnique,
  audit: simDag, tokenization: simUnique, featurestore: simConnpool, schemareg: simUnique,
  observability: simDq, vectordb: simBtree, llmpipeline: simElt,
  pacelc: simCap, ryw: simMvcc, eventual: simReplication, isolation: simMvcc,
  normalization: simScd, primarykey: simUnique, cardinality: simBtree,
  surrogatekey: simUnique, null: simDq, savepoint: simAcid, locks: simDeadlock,
  bloat: simVacuum, sequence: simUnique, uuid: simUnique, viewmv: simCaching,
  trigger: simScd, storedproc: simEtl, cte: simStream, window: simBtree,
  upsert: simIdempotency, explainplan: simBtree, schema_ns: simConnpool, orm: simElt,
  lateral: simStar, recursive: simDag, pgpartition: simPartitioning, json: simDq,
  fts: simBtree, connstring: simConnpool, computed: simScd, bqpartition: simPartitioning,
  explainopt: simBtree, rowvscol: simColumnar, mesh: simDag, htap: simReplication,
};

export function runSim(simKey, color, instanceId, wrap, label) {
  const fn = SIM_MAP[simKey];
  if (fn) fn(wrap, color, instanceId);
  else simGeneric(wrap, color, instanceId, label);
}
