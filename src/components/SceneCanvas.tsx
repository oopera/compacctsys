"use client";

import { useEffect, useRef } from "react";
import { useCanvasTheme, type CanvasPalette } from "@/hooks/useCanvasTheme";

// ─── Grid scene (Team) ────────────────────────────────────────────────────────

const GRID = 50;
const DRIFT = 0.1;
const TRAIL_MS = 750;
const GLOW_R = GRID;

interface Pt { x: number; y: number; t: number; }

function runGrid(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, offset = 0, raf: number;
  const trail: Pt[] = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (x >= 0 && y >= 0 && x <= r.width && y <= r.height)
      trail.push({ x, y, t: performance.now() });
  }
  window.addEventListener("mousemove", onMove);

  function draw() {
    raf = requestAnimationFrame(draw);
    const now = performance.now();
    while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
    ctx.clearRect(0, 0, w, h);

    const { fg, glow, lineAlpha } = paletteRef.current;
    const ox = offset % GRID, oy = offset % GRID;

    if (trail.length) {
      for (let x = -GRID + ox; x < w + GRID; x += GRID) {
        for (let y = -GRID + oy; y < h + GRID; y += GRID) {
          const cx = x + GRID / 2, cy = y + GRID / 2;
          let intensity = 0;
          for (const pt of trail) {
            const dist = Math.hypot(pt.x - cx, pt.y - cy);
            const age = 1 - (now - pt.t) / TRAIL_MS;
            const prox = Math.max(0, 1 - dist / GLOW_R);
            intensity = Math.max(intensity, age * prox * prox);
          }
          if (intensity > 0.01) {
            ctx.fillStyle = `rgba(${glow},${intensity * 0.42})`;
            ctx.fillRect(x, y, GRID, GRID);
          }
        }
      }
    }

    ctx.strokeStyle = `rgba(${fg},${lineAlpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -GRID + ox; x < w + GRID; x += GRID) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = -GRID + oy; y < h + GRID; y += GRID) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    for (let x = -GRID + ox; x < w + GRID; x += GRID) {
      for (let y = -GRID + oy; y < h + GRID; y += GRID) {
        let boost = 0;
        for (const pt of trail) {
          const dist = Math.hypot(pt.x - x, pt.y - y);
          const age = 1 - (now - pt.t) / TRAIL_MS;
          const prox = Math.max(0, 1 - dist / (GRID * 1.5));
          boost = Math.max(boost, age * prox);
        }
        ctx.fillStyle = `rgba(${fg},${0.18 + boost * 0.72})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + boost * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    offset += DRIFT;
  }

  draw();
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMove);
  };
}

// ─── Node graph scene (Landing) ───────────────────────────────────────────────

const NODE_DENSITY = 1 / 12000;
const MAX_DIST = 300;
const NODE_SPEED = 0.05;
const MOUSE_R = 200;

interface Node { x: number; y: number; vx: number; vy: number; r: number; }

function runNodes(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
  fullyConnected = false,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf: number;
  let nodes: Node[] = [];
  const mouse = { x: -9999, y: -9999 };

  function seed() {
    const count = Math.max(8, Math.round(w * h * NODE_DENSITY));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * NODE_SPEED * 2,
      vy: (Math.random() - 0.5) * NODE_SPEED * 2,
      r: 1.5 + Math.random() * 2.5,
    }));
  }
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    seed();
  }
  resize();

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }
  window.addEventListener("mousemove", onMove);

  function draw() {
    raf = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, w, h);

    const { fg, glow } = paletteRef.current;
    const mx = mouse.x, my = mouse.y;
    const MARGIN = 60;

    for (const n of nodes) {
      n.vx += (Math.random() - 0.5) * 0.015;
      n.vy += (Math.random() - 0.5) * 0.015;
      if (n.x < MARGIN) n.vx += (MARGIN - n.x) * 0.002;
      if (n.x > w - MARGIN) n.vx -= (n.x - (w - MARGIN)) * 0.002;
      if (n.y < MARGIN) n.vy += (MARGIN - n.y) * 0.002;
      if (n.y > h - MARGIN) n.vy -= (n.y - (h - MARGIN)) * 0.002;
      const spd = Math.hypot(n.vx, n.vy);
      if (spd > NODE_SPEED) { n.vx *= NODE_SPEED / spd; n.vy *= NODE_SPEED / spd; }
      n.x += n.vx; n.y += n.vy;
    }

    const maxDist = fullyConnected ? Math.hypot(w, h) : MAX_DIST;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (!fullyConnected && d > MAX_DIST) continue;
        const proximity = fullyConnected
          ? Math.max(0.03, 1 - d / maxDist)
          : 1 - d / MAX_DIST;
        const mGlow = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - mx, (a.y + b.y) / 2 - my) / MOUSE_R);
        ctx.strokeStyle = mGlow > 0.01
          ? `rgba(${glow},${(0.15 + mGlow * 0.6) * proximity})`
          : `rgba(${fg},${0.08 * proximity})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    for (const n of nodes) {
      const mGlow = Math.max(0, 1 - Math.hypot(n.x - mx, n.y - my) / MOUSE_R);
      if (mGlow > 0.01) {
        const glowR = n.r * 3 + mGlow * 10;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        grad.addColorStop(0, `rgba(${glow},${mGlow * 0.55})`);
        grad.addColorStop(1, `rgba(${glow},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(${fg},${0.20 + mGlow * 0.80})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r + mGlow * 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  draw();
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMove);
  };
}

// ─── Orbits scene (Publications) ──────────────────────────────────────────────
// Excitable network — nodes fire when charge exceeds their threshold, sending
// signals to neighbours. Edges strengthen when endpoints co-activate (Hebbian),
// weaken otherwise, and new edges form between co-active nearby nodes.
// A force-directed layout keeps the topology legible as it continuously rewires.

interface ExNode {
  x: number; y: number;
  vx: number; vy: number;
  charge: number;       // 0..1 current excitation level
  refractory: number;   // frames remaining in refractory period
  threshold: number;    // individual firing threshold (0.45..0.75)
  isPacemaker: boolean; // spontaneously self-excites
  paceTimer: number;    // frames until next spontaneous pulse
  pacePeriod: number;
}

interface ExEdge {
  a: number; b: number;
  weight: number;   // 0..1 — grows via co-activation, decays otherwise
  signal: number;   // transient signal brightness, decays per frame
}

const EX_COUNT = 46;
const EX_REFRACTORY = 48;   // frames a node stays silent after firing
const EX_DECAY = 0.020; // charge leak per frame
const EX_CONNECT_R = 0.24;  // initial edge range as fraction of min(w,h)

function runOrbits(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf: number;
  let nodes: ExNode[] = [];
  let edges: ExEdge[] = [];
  const mouse = { x: -9999, y: -9999 };

  function seed() {
    const cr = Math.min(w, h) * EX_CONNECT_R;
    nodes = Array.from({ length: EX_COUNT }, (_, i) => ({
      x: w * 0.1 + Math.random() * w * 0.8,
      y: h * 0.1 + Math.random() * h * 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      charge: 0,
      refractory: Math.floor(Math.random() * EX_REFRACTORY),
      threshold: 0.45 + Math.random() * 0.30,
      isPacemaker: i < 5,
      paceTimer: Math.floor(Math.random() * 240),
      pacePeriod: 150 + Math.floor(Math.random() * 210),
    }));
    edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < cr) {
          edges.push({ a: i, b: j, weight: 0.15 + Math.random() * 0.45, signal: 0 });
        }
      }
    }
  }

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    seed();
  }
  resize();

  function onMove(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }
  window.addEventListener("mousemove", onMove);

  function draw() {
    raf = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, w, h);
    const { fg, glow } = paletteRef.current;
    const cr = Math.min(w, h) * EX_CONNECT_R;

    // ── Simulation ──────────────────────────────────────────────────────────

    // Pacemakers: spontaneous pulse on their own timer
    for (const n of nodes) {
      if (!n.isPacemaker) continue;
      if (--n.paceTimer <= 0) {
        n.charge = Math.min(1, n.charge + 0.75);
        n.paceTimer = n.pacePeriod + Math.floor(Math.random() * 60 - 30);
      }
    }

    // Charge decay; refractory countdown
    for (const n of nodes) {
      if (n.refractory > 0) {
        n.refractory--;
        n.charge = Math.max(0, n.charge - 0.06);
      } else {
        n.charge *= (1 - EX_DECAY);
      }
    }

    // Mouse excites nearby nodes
    for (const n of nodes) {
      const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      if (d < MOUSE_R) n.charge = Math.min(1, n.charge + (1 - d / MOUSE_R) * 0.05);
    }

    // Threshold check — collect firing nodes this frame
    const fired = new Set<number>();
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.refractory === 0 && n.charge >= n.threshold) {
        fired.add(i);
        n.refractory = EX_REFRACTORY;
      }
    }

    // Propagate charge along edges from firing nodes; light up edges
    for (const e of edges) {
      const aFired = fired.has(e.a), bFired = fired.has(e.b);
      if (aFired || bFired) {
        const src = aFired ? e.a : e.b;
        const dst = aFired ? e.b : e.a;
        if (nodes[dst].refractory === 0)
          nodes[dst].charge = Math.min(1, nodes[dst].charge + e.weight * 0.55);
        e.signal = Math.max(e.signal, e.weight);
        // If the other end also fired (both active), bonus strengthening
        if (aFired && bFired) e.weight = Math.min(1, e.weight + 0.008);
      }
      // Hebbian: co-active at moderate charge → slow strengthening
      const coActive = nodes[e.a].charge > 0.25 && nodes[e.b].charge > 0.25;
      e.weight = coActive
        ? Math.min(1, e.weight + 0.0008)
        : Math.max(0, e.weight - 0.0004);
      e.signal *= 0.85;
    }

    // Prune dead edges
    for (let i = edges.length - 1; i >= 0; i--) {
      if (edges[i].weight < 0.04) edges.splice(i, 1);
    }

    // Occasionally sprout new edges between co-active unconnected nearby nodes
    if (Math.random() < 0.04 && edges.length < EX_COUNT * 4) {
      const connected = new Set(edges.flatMap(e => [`${e.a}-${e.b}`, `${e.b}-${e.a}`]));
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].charge < 0.35) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].charge < 0.35) continue;
          if (connected.has(`${i}-${j}`)) continue;
          if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < cr * 1.3) {
            edges.push({ a: i, b: j, weight: 0.12, signal: 0.4 });
            break; // one new edge per opportunity
          }
        }
      }
    }

    // Force-directed layout — repulsion + edge attraction + boundary
    for (let i = 0; i < nodes.length; i++) {
      const ni = nodes[i];
      let fx = 0, fy = 0;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = ni.x - nodes[j].x, dy = ni.y - nodes[j].y;
        const d2 = dx * dx + dy * dy + 0.01;
        const d = Math.sqrt(d2);
        const rep = Math.min(800 / d2, 1.8);
        fx += (dx / d) * rep;
        fy += (dy / d) * rep;
      }
      for (const e of edges) {
        if (e.a !== i && e.b !== i) continue;
        const other = nodes[e.a === i ? e.b : e.a];
        const dx = other.x - ni.x, dy = other.y - ni.y;
        const d = Math.hypot(dx, dy) + 0.01;
        const pull = (d - cr * 0.55) * 0.0006 * e.weight;
        fx += (dx / d) * pull * d;
        fy += (dy / d) * pull * d;
      }
      const mg = 50;
      if (ni.x < mg) fx += (mg - ni.x) * 0.06;
      if (ni.x > w - mg) fx -= (ni.x - (w - mg)) * 0.06;
      if (ni.y < mg) fy += (mg - ni.y) * 0.06;
      if (ni.y > h - mg) fy -= (ni.y - (h - mg)) * 0.06;

      ni.vx = (ni.vx + fx) * 0.82;
      ni.vy = (ni.vy + fy) * 0.82;
      const spd = Math.hypot(ni.vx, ni.vy);
      if (spd > 1.8) { ni.vx *= 1.8 / spd; ni.vy *= 1.8 / spd; }
      ni.x += ni.vx;
      ni.y += ni.vy;
    }

    // ── Render ───────────────────────────────────────────────────────────────

    // Edges
    for (const e of edges) {
      const na = nodes[e.a], nb = nodes[e.b];
      const baseA = e.weight * 0.22;
      const sigA = e.signal * 0.65;
      const alpha = Math.min(0.88, baseA + sigA);
      if (alpha < 0.02) continue;
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = e.signal > 0.12
        ? `rgba(${glow},${alpha})`
        : `rgba(${fg},${alpha})`;
      ctx.lineWidth = 0.5 + e.signal * 1.8;
      ctx.stroke();
    }

    // Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const isFiring = fired.has(i);

      // Glow halo for excited nodes
      if (n.charge > 0.35) {
        const gr = 5 + n.charge * 16;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr);
        grad.addColorStop(0, `rgba(${glow},${n.charge * 0.45})`);
        grad.addColorStop(1, `rgba(${glow},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(n.x, n.y, gr, 0, Math.PI * 2); ctx.fill();
      }

      const r = 1.8 + n.charge * 3.5;
      const alpha = 0.20 + n.charge * 0.80;
      ctx.fillStyle = isFiring
        ? `rgba(${glow},${alpha})`
        : `rgba(${fg},${alpha})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
    }
  }

  draw();
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMove);
  };
}

// ─── Flow field scene (Projects) ──────────────────────────────────────────────
// Particles stream through a structured vector field — process pipelines,
// audit trails, accountability chains in motion

const FLOW_DENSITY = 1 / 9000;
const TRAIL_LEN = 14;

interface FlowParticle {
  x: number; y: number;
  life: number; maxLife: number;
  trail: { x: number; y: number }[];
}

function runFlow(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf: number, t = 0;
  let particles: FlowParticle[] = [];
  const mouse = { x: -9999, y: -9999 };

  function fieldAngle(x: number, y: number): number {
    return Math.sin(x * 0.009 + y * 0.006) * 0.9 + Math.cos(y * 0.008 + x * 0.003) * 0.5;
  }

  function spawn(): FlowParticle {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      life: 0,
      maxLife: 100 + Math.random() * 160,
      trail: [],
    };
  }

  function seed() {
    const count = Math.max(6, Math.round(w * h * FLOW_DENSITY));
    particles = Array.from({ length: count }, spawn);
  }
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    seed();
  }
  resize();

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }
  window.addEventListener("mousemove", onMove);

  function draw() {
    raf = requestAnimationFrame(draw);
    t++;
    ctx.clearRect(0, 0, w, h);

    const { fg, glow } = paletteRef.current;
    const mx = mouse.x, my = mouse.y;

    for (const p of particles) {
      p.life++;
      if (p.life > p.maxLife) { Object.assign(p, spawn()); continue; }

      const angle = fieldAngle(p.x + t * 0.25, p.y);
      const speed = 0.7 + Math.sin(p.x * 0.012 + p.y * 0.009) * 0.35;

      // Mouse vortex
      const md = Math.hypot(p.x - mx, p.y - my);
      const vortex = md < 90 ? (1 - md / 90) * Math.PI * 0.55 : 0;

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > TRAIL_LEN) p.trail.shift();

      p.x += Math.cos(angle + vortex) * speed;
      p.y += Math.sin(angle + vortex) * speed;

      // wrap
      if (p.x > w + 10) p.x = -10;
      if (p.x < -10) p.x = w + 10;
      if (p.y > h + 10) p.y = -10;
      if (p.y < -10) p.y = h + 10;

      const lifeAlpha = Math.sin((p.life / p.maxLife) * Math.PI);
      const mGlow = Math.max(0, 1 - md / MOUSE_R);

      // Trail
      for (let i = 1; i < p.trail.length; i++) {
        const a = (i / p.trail.length) * lifeAlpha * 0.18;
        ctx.strokeStyle = mGlow > 0.01
          ? `rgba(${glow},${a + mGlow * 0.12})`
          : `rgba(${fg},${a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
        ctx.stroke();
      }

      // Head
      ctx.fillStyle = `rgba(${fg},${(0.28 + mGlow * 0.55) * lifeAlpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  draw();
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMove);
  };
}

// ─── Bezier streams scene (Projects) ─────────────────────────────────────────
// Flowing curves drift across the canvas — each a cubic bezier with slowly
// wandering control points. Layers of lines at different speeds and opacities
// create a sense of depth and structured movement.

interface BezierStream {
  sy: number;           // start y (left edge)
  ey: number;           // end y (right edge)
  cp1Phase: number;     // phase offset for cp1 vertical drift
  cp2Phase: number;
  cp1Freq: number;      // oscillation frequency
  cp2Freq: number;
  cp1Amp: number;       // oscillation amplitude (fraction of h)
  cp2Amp: number;
  baseAlpha: number;
  width: number;
}

const BEZIER_COUNT = 22;

function runCloud(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf: number, time = 0;
  let streams: BezierStream[] = [];
  const mouse = { x: -9999, y: -9999 };

  function seed() {
    streams = Array.from({ length: BEZIER_COUNT }, (_, i) => {
      const t = i / (BEZIER_COUNT - 1);
      // Spread start/end points across full height with slight random offset
      const sy = (t + (Math.random() - 0.5) * 0.06) * h;
      const ey = (t + (Math.random() - 0.5) * 0.12) * h;
      return {
        sy, ey,
        cp1Phase: Math.random() * Math.PI * 2,
        cp2Phase: Math.random() * Math.PI * 2,
        cp1Freq: 0.18 + Math.random() * 0.22,
        cp2Freq: 0.15 + Math.random() * 0.20,
        cp1Amp: 0.10 + Math.random() * 0.18,
        cp2Amp: 0.10 + Math.random() * 0.18,
        baseAlpha: 0.10 + Math.random() * 0.22,
        width: 0.6 + Math.random() * 0.8,
      };
    });
  }

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    seed();
  }
  resize();

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }
  window.addEventListener("mousemove", onMove);

  // Sample ~8 points along the bezier to approximate mouse proximity
  function bezierProximity(
    sx: number, sy: number,
    cp1x: number, cp1y: number,
    cp2x: number, cp2y: number,
    ex: number, ey: number,
    mx: number, my: number,
  ): number {
    let minD = Infinity;
    for (let s = 0; s <= 8; s++) {
      const t = s / 8;
      const it = 1 - t;
      const bx = it * it * it * sx + 3 * it * it * t * cp1x + 3 * it * t * t * cp2x + t * t * t * ex;
      const by = it * it * it * sy + 3 * it * it * t * cp1y + 3 * it * t * t * cp2y + t * t * t * ey;
      const d = Math.hypot(bx - mx, by - my);
      if (d < minD) minD = d;
    }
    return minD;
  }

  function draw() {
    raf = requestAnimationFrame(draw);
    time += 0.0008;
    ctx.clearRect(0, 0, w, h);

    const { fg, glow } = paletteRef.current;

    for (const s of streams) {
      const cp1x = w * 0.33;
      const cp1y = s.sy + Math.sin(time * s.cp1Freq + s.cp1Phase) * s.cp1Amp * h;
      const cp2x = w * 0.67;
      const cp2y = s.ey + Math.sin(time * s.cp2Freq + s.cp2Phase) * s.cp2Amp * h;

      const proximity = bezierProximity(0, s.sy, cp1x, cp1y, cp2x, cp2y, w, s.ey, mouse.x, mouse.y);
      const mGlow = Math.max(0, 1 - proximity / MOUSE_R);

      ctx.beginPath();
      ctx.moveTo(0, s.sy);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, w, s.ey);
      ctx.strokeStyle = mGlow > 0.02
        ? `rgba(${glow},${Math.min(1, s.baseAlpha + mGlow * 0.6)})`
        : `rgba(${fg},${s.baseAlpha})`;
      ctx.lineWidth = mGlow > 0.02 ? s.width + mGlow * 1.5 : s.width;
      ctx.stroke();

      // Dots at the two control point positions — faint anchors
      if (mGlow > 0.05) {
        ctx.fillStyle = `rgba(${glow},${mGlow * 0.5})`;
        ctx.beginPath(); ctx.arc(cp1x, cp1y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cp2x, cp2y, 2, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  draw();
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMove);
  };
}

// ─── Pulse grid scene ─────────────────────────────────────────────────────────
// A breathing grid with dot groups that oscillate horizontally along grid lines.
// Dots have spring physics — they drift off their lines and snap back.
// Mouse repels nearby dots and triggers a glow response.

interface PulseDot {
  baseX: number; y: number; baseY: number;
  vy: number;
  frequency: number; amplitude: number; phase: number;
  group: number;
}

function runPulse(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf: number, time = 0;
  let dots: PulseDot[] = [];
  let hLines = 0, hSpacing = 0, vLines = 0, vSpacing = 0;
  const mouse = { x: -9999, y: -9999 };

  function seed() {
    hLines = Math.round(h / 28); hSpacing = h / (hLines + 1);
    vLines = Math.round(w / 28); vSpacing = w / (vLines + 1);

    const GROUPS = 4;
    dots = [];
    for (let g = 0; g < GROUPS; g++) {
      const freq = 0.28 + g * 0.22;
      const amplitude = w * (0.12 + g * 0.055);
      // Not every line gets a dot — stagger by group offset
      for (let i = 1; i <= hLines; i++) {
        if ((i + g) % 2 !== 0) continue; // every other line per group
        const baseY = i * hSpacing;
        dots.push({
          baseX: w / 2 + (Math.random() - 0.5) * w * 0.08,
          y: baseY, baseY,
          vy: 0,
          frequency: freq,
          amplitude,
          phase: i * 0.28 + g * 1.3,
          group: g,
        });
      }
    }
  }

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    seed();
  }
  resize();

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }
  window.addEventListener("mousemove", onMove);

  function draw() {
    raf = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, w, h);
    time += 0.004;

    const { fg, glow, lineAlpha } = paletteRef.current;
    const mx = mouse.x, my = mouse.y;

    // Grid — horizontal lines breathe in opacity
    ctx.lineWidth = 1;
    for (let i = 1; i <= hLines; i++) {
      const y = i * hSpacing;
      const pulse = 0.55 + Math.sin(time * 1.1 + i * 0.18) * 0.45;
      ctx.strokeStyle = `rgba(${fg},${lineAlpha * pulse})`;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    // Vertical lines — fainter, static
    for (let i = 1; i <= vLines; i++) {
      const x = i * vSpacing;
      ctx.strokeStyle = `rgba(${fg},${lineAlpha * 0.5})`;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }

    // Dots
    for (const d of dots) {
      // Horizontal oscillation
      const x = d.baseX + Math.sin(time * d.frequency + d.phase) * d.amplitude;

      // Spring back toward grid line vertically
      d.vy += (d.baseY - d.y) * 0.018;
      d.vy += (Math.random() - 0.5) * 0.04;
      d.vy *= 0.94;
      d.y += d.vy;

      // Mouse repulsion
      const mdx = x - mx, mdy = d.y - my;
      const md = Math.hypot(mdx, mdy);
      const rep = md < 90 ? (1 - md / 90) : 0;
      const dx = rep > 0 ? x + (mdx / md) * rep * 28 : x;
      const dy = rep > 0 ? d.y + (mdy / md) * rep * 28 : d.y;

      const size = (2.2 + Math.sin(time * 1.4 + d.group + d.phase) * 0.5) * (1 + rep * 1.2);
      const alpha = 0.45 + Math.sin(time * 1.0 + d.phase) * 0.3;

      ctx.fillStyle = rep > 0.02
        ? `rgba(${glow},${Math.min(1, alpha + rep * 0.5)})`
        : `rgba(${fg},${alpha})`;
      ctx.beginPath();
      ctx.arc(dx, dy, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  draw();
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMove);
    dots.length = 0;
  };
}

// ─── Flowing bars scene (Team) ────────────────────────────────────────────────
// Horizontal lines crossed by noise-driven bars that yield and shift like water.
// Softness overcoming rigidity — bars animate gently in waves.

const BARS_LINE_SPACING = 11; // px between horizontal guide lines
const BARS_STEP = 8;          // px between bar sample points along x

function barsNoise(x: number, y: number, t: number): number {
  const n = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) +
    Math.sin(x * 0.015 - t) * Math.cos(y * 0.005 + t);
  return (n + 1) / 2;
}

function runAscii(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf: number, time = 0;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }
  window.addEventListener("mousemove", () => { });

  function draw() {
    raf = requestAnimationFrame(draw);
    time += 0.0005;

    const { fg, glow } = paletteRef.current;
    ctx.clearRect(0, 0, w, h);

    const numLines = Math.ceil(h / BARS_LINE_SPACING);

    for (let i = 0; i < numLines; i++) {
      const y = i * BARS_LINE_SPACING + BARS_LINE_SPACING / 2;

      // Horizontal guide line
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${fg},0.15)`;
      ctx.lineWidth = 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      // Noise-driven bars along the line
      for (let x = 0; x < w; x += BARS_STEP) {
        const noiseVal = barsNoise(x, y, time);
        if (noiseVal <= 0.5) continue;

        const barWidth = 3 + noiseVal * 10;
        const barHeight = 2 + noiseVal * 3;
        const ax = x + Math.sin(time + y * 0.0375) * 20 * noiseVal;

        const md = Math.hypot(ax - mouse.x, y - mouse.y);
        const mouseProx = Math.max(0, 1 - md / MOUSE_R);

        ctx.fillStyle = mouseProx > 0.05
          ? `rgba(${glow},${0.65 + mouseProx * 0.35})`
          : `rgba(${fg},0.85)`;
        ctx.fillRect(ax - barWidth / 2, y - barHeight / 2, barWidth, barHeight);
      }
    }
  }

  draw();
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMove);
  };
}

// ─── Unified component ────────────────────────────────────────────────────────

export type CanvasVariant = "grid" | "nodes" | "orbits" | "flow" | "cloud" | "pulse" | "ascii";

export function SceneCanvas({
  variant = "grid",
  fullyConnected = false,
}: {
  variant?: CanvasVariant;
  fullyConnected?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { paletteRef } = useCanvasTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (variant === "nodes") return runNodes(canvas, paletteRef, fullyConnected);
    if (variant === "orbits") return runOrbits(canvas, paletteRef);
    if (variant === "flow") return runFlow(canvas, paletteRef);
    if (variant === "cloud") return runCloud(canvas, paletteRef);
    if (variant === "pulse") return runPulse(canvas, paletteRef);
    if (variant === "ascii") return runAscii(canvas, paletteRef);
    return runGrid(canvas, paletteRef);
  }, [variant, fullyConnected, paletteRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
