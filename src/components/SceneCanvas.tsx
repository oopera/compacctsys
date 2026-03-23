"use client";

import { useEffect, useRef } from "react";
import { useCanvasTheme, type Theme } from "@/hooks/useCanvasTheme";

// ─── Per-theme colour tables ──────────────────────────────────────────────────

const PALETTE: Record<Theme, {
  fg: string;       // RGB of nodes/dots/lines
  glow: string;     // RGB of mouse glow
  lineAlpha: number;
}> = {
  light:     { fg: "255,255,255", glow: "139,92,246",  lineAlpha: 0.07 },
  dark:      { fg: "0,0,0",       glow: "251,146,60",  lineAlpha: 0.06 },
  code:      { fg: "148,163,184", glow: "52,211,153",  lineAlpha: 0.08 },
  retro:     { fg: "255,180,0",   glow: "255,140,0",   lineAlpha: 0.10 },
  cyberpunk: { fg: "0,245,212",   glow: "255,45,120",  lineAlpha: 0.09 },
  synthwave: { fg: "255,214,245", glow: "255,113,206", lineAlpha: 0.10 },
};

// ─── Grid scene ───────────────────────────────────────────────────────────────

const GRID     = 72;
const DRIFT    = 0.1;
const TRAIL_MS = 750;
const GLOW_R   = GRID * 1.5;

interface Pt { x: number; y: number; t: number; }

function runGrid(
  canvas: HTMLCanvasElement,
  themeRef: React.RefObject<Theme>,
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

    const { fg, glow, lineAlpha } = PALETTE[themeRef.current ?? "light"];
    const ox = offset % GRID, oy = offset % GRID;

    // Lit cells
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

    // Grid lines
    ctx.strokeStyle = `rgba(${fg},${lineAlpha})`;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    for (let x = -GRID + ox; x < w + GRID; x += GRID) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = -GRID + oy; y < h + GRID; y += GRID) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    // Intersection dots
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

// ─── Node graph scene ─────────────────────────────────────────────────────────

const NODE_COUNT = 42;
const MAX_DIST   = 150;
const MAX_SPEED  = 0.28;
const MOUSE_R    = 200;

interface Node { x: number; y: number; vx: number; vy: number; r: number; }

function runNodes(
  canvas: HTMLCanvasElement,
  themeRef: React.RefObject<Theme>,
): () => void {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf: number;
  let nodes: Node[] = [];
  const mouse = { x: -9999, y: -9999 };

  function seed() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * MAX_SPEED * 2,
      vy: (Math.random() - 0.5) * MAX_SPEED * 2,
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

    const { fg, glow } = PALETTE[themeRef.current ?? "light"];
    const mx = mouse.x, my = mouse.y;

    for (const n of nodes) {
      n.vx += (w * 0.5 - n.x) * 0.00006 + (Math.random() - 0.5) * 0.012;
      n.vy += (h * 0.5 - n.y) * 0.00006 + (Math.random() - 0.5) * 0.012;
      const spd = Math.hypot(n.vx, n.vy);
      if (spd > MAX_SPEED) { n.vx *= MAX_SPEED / spd; n.vy *= MAX_SPEED / spd; }
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) { n.x = 0; n.vx =  Math.abs(n.vx); }
      if (n.x > w) { n.x = w; n.vx = -Math.abs(n.vx); }
      if (n.y < 0) { n.y = 0; n.vy =  Math.abs(n.vy); }
      if (n.y > h) { n.y = h; n.vy = -Math.abs(n.vy); }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > MAX_DIST) continue;
        const proximity = 1 - d / MAX_DIST;
        const mGlow = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - mx, (a.y + b.y) / 2 - my) / MOUSE_R);
        ctx.strokeStyle = mGlow > 0.01
          ? `rgba(${glow},${(0.15 + mGlow * 0.6) * proximity})`
          : `rgba(${fg},${0.10 * proximity})`;
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

// ─── Unified component ────────────────────────────────────────────────────────

export type CanvasVariant = "grid" | "nodes";

export function SceneCanvas({ variant = "grid" }: { variant?: CanvasVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef  = useCanvasTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return variant === "nodes"
      ? runNodes(canvas, themeRef)
      : runGrid(canvas, themeRef);
  }, [variant, themeRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
