"use client";

import { useEffect, useRef } from "react";

const GRID      = 72;        // px between grid lines
const DRIFT     = 0.12;      // px/frame diagonal drift
const TRAIL_MS  = 750;       // ms a trail point stays alive
const GLOW_R    = GRID * 2.2; // px radius of the cell glow

interface Pt { x: number; y: number; t: number; }

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0, h = 0, offset = 0, raf: number;
    const trail: Pt[] = [];

    function resize() {
      w = canvas!.width  = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }
    resize();

    function onMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      // Only track when cursor is over the canvas area
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x >= 0 && y >= 0 && x <= r.width && y <= r.height) {
        trail.push({ x, y, t: performance.now() });
      }
    }
    window.addEventListener("mousemove", onMove);

    function draw() {
      raf = requestAnimationFrame(draw);
      const now = performance.now();

      // Expire old trail points
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();

      ctx.clearRect(0, 0, w, h);

      const ox = offset % GRID;
      const oy = offset % GRID;

      // ── Lit cells (drawn below grid lines) ──────────────────────────────
      if (trail.length) {
        for (let x = -GRID + ox; x < w + GRID; x += GRID) {
          for (let y = -GRID + oy; y < h + GRID; y += GRID) {
            const cx = x + GRID / 2;
            const cy = y + GRID / 2;
            let intensity = 0;
            for (const pt of trail) {
              const dist = Math.hypot(pt.x - cx, pt.y - cy);
              const age  = 1 - (now - pt.t) / TRAIL_MS;
              const prox = Math.max(0, 1 - dist / GLOW_R);
              intensity  = Math.max(intensity, age * prox * prox);
            }
            if (intensity > 0.01) {
              ctx.fillStyle = `rgba(139,92,246,${intensity * 0.38})`;
              ctx.fillRect(x, y, GRID, GRID);
            }
          }
        }
      }

      // ── Grid lines ───────────────────────────────────────────────────────
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth   = 1;
      ctx.beginPath();
      for (let x = -GRID + ox; x < w + GRID; x += GRID) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = -GRID + oy; y < h + GRID; y += GRID) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // ── Intersection dots (brighter + larger near cursor) ────────────────
      for (let x = -GRID + ox; x < w + GRID; x += GRID) {
        for (let y = -GRID + oy; y < h + GRID; y += GRID) {
          let boost = 0;
          for (const pt of trail) {
            const dist = Math.hypot(pt.x - x, pt.y - y);
            const age  = 1 - (now - pt.t) / TRAIL_MS;
            const prox = Math.max(0, 1 - dist / (GRID * 1.5));
            boost = Math.max(boost, age * prox);
          }
          ctx.fillStyle = `rgba(255,255,255,${0.18 + boost * 0.72})`;
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
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
