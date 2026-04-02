"use client";

import { useEffect, useRef } from "react";
import { useCanvasTheme, type CanvasPalette } from "@/hooks/useCanvasTheme";

// ─── Grid scene (Team) ────────────────────────────────────────────────────────

const GRID     = 50;
const DRIFT    = 0.1;
const TRAIL_MS = 750;
const GLOW_R   = GRID;

interface Pt { x: number; y: number; t: number; }

function runGrid(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, offset = 0, raf: number;
  const trail: Pt[] = [];

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
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
            const age  = 1 - (now - pt.t) / TRAIL_MS;
            const prox = Math.max(0, 1 - dist / GLOW_R);
            intensity  = Math.max(intensity, age * prox * prox);
          }
          if (intensity > 0.01) {
            ctx.fillStyle = `rgba(${glow},${intensity * 0.42})`;
            ctx.fillRect(x, y, GRID, GRID);
          }
        }
      }
    }

    ctx.strokeStyle = `rgba(${fg},${lineAlpha})`;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    for (let x = -GRID + ox; x < w + GRID; x += GRID) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = -GRID + oy; y < h + GRID; y += GRID) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    for (let x = -GRID + ox; x < w + GRID; x += GRID) {
      for (let y = -GRID + oy; y < h + GRID; y += GRID) {
        let boost = 0;
        for (const pt of trail) {
          const dist = Math.hypot(pt.x - x, pt.y - y);
          const age  = 1 - (now - pt.t) / TRAIL_MS;
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
const MAX_DIST     = 300;
const NODE_SPEED   = 0.05;
const MOUSE_R      = 200;

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
    w = canvas.width  = canvas.offsetWidth;
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
      if (n.x < MARGIN)     n.vx += (MARGIN - n.x)       * 0.002;
      if (n.x > w - MARGIN) n.vx -= (n.x - (w - MARGIN)) * 0.002;
      if (n.y < MARGIN)     n.vy += (MARGIN - n.y)       * 0.002;
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
// Concentric citation rings — structured knowledge, peer-review layers

interface OrbRing { r: number; count: number; speed: number; phase: number; }

function runOrbits(
  canvas: HTMLCanvasElement,
  paletteRef: React.RefObject<CanvasPalette>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf: number, t = 0;
  let rings: OrbRing[] = [];
  const mouse = { x: -9999, y: -9999 };

  function seed() {
    const maxR = Math.min(w, h) * 0.42;
    rings = [
      { r: maxR * 0.22, count: 4,  speed: 0.0009,  phase: 0 },
      { r: maxR * 0.44, count: 8,  speed: 0.00060, phase: 1.1 },
      { r: maxR * 0.66, count: 13, speed: 0.00040, phase: 0.6 },
      { r: maxR * 0.88, count: 18, speed: 0.00025, phase: 2.0 },
    ];
  }
  function resize() {
    w = canvas.width  = canvas.offsetWidth;
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
    const cx = w / 2, cy = h / 2;
    const mx = mouse.x, my = mouse.y;

    // Collect all particle positions
    const pts: { x: number; y: number; ring: OrbRing }[] = [];
    for (const ring of rings) {
      for (let i = 0; i < ring.count; i++) {
        const angle = ring.phase + (i / ring.count) * Math.PI * 2 + t * ring.speed;
        pts.push({
          x: cx + Math.cos(angle) * ring.r,
          y: cy + Math.sin(angle) * ring.r,
          ring,
        });
      }
    }

    // Faint orbit rings
    ctx.lineWidth = 1;
    for (const ring of rings) {
      ctx.strokeStyle = `rgba(${fg},0.07)`;
      ctx.beginPath();
      ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Cross-ring connections between nearby particles
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        if (a.ring === b.ring) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 55) continue;
        const proximity = 1 - d / 55;
        const mGlow = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - mx, (a.y + b.y) / 2 - my) / MOUSE_R);
        ctx.strokeStyle = mGlow > 0.01
          ? `rgba(${glow},${(0.12 + mGlow * 0.45) * proximity})`
          : `rgba(${fg},${0.12 * proximity})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    // Centre dot
    ctx.fillStyle = `rgba(${fg},0.5)`;
    ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2); ctx.fill();

    // Particles
    for (const pt of pts) {
      const mGlow = Math.max(0, 1 - Math.hypot(pt.x - mx, pt.y - my) / MOUSE_R);
      if (mGlow > 0.01) {
        const glowR = 2 + mGlow * 9;
        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glowR);
        grad.addColorStop(0, `rgba(${glow},${mGlow * 0.6})`);
        grad.addColorStop(1, `rgba(${glow},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, glowR, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(${fg},${0.30 + mGlow * 0.70})`;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.8 + mGlow * 1.5, 0, Math.PI * 2); ctx.fill();
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
const TRAIL_LEN    = 14;

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
    w = canvas.width  = canvas.offsetWidth;
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
      if (p.x < -10)    p.x = w + 10;
      if (p.y > h + 10) p.y = -10;
      if (p.y < -10)    p.y = h + 10;

      const lifeAlpha = Math.sin((p.life / p.maxLife) * Math.PI);
      const mGlow     = Math.max(0, 1 - md / MOUSE_R);

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

// ─── Unified component ────────────────────────────────────────────────────────

export type CanvasVariant = "grid" | "nodes" | "orbits" | "flow";

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
    if (variant === "nodes")  return runNodes(canvas, paletteRef, fullyConnected);
    if (variant === "orbits") return runOrbits(canvas, paletteRef);
    if (variant === "flow")   return runFlow(canvas, paletteRef);
    return runGrid(canvas, paletteRef);
  }, [variant, fullyConnected, paletteRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
