"use client";

import { useEffect, useRef } from "react";
import { siteSettings } from "@/lib/data";

const GRID     = 72;
const DRIFT    = 0.12;
const TRAIL_MS = 750;
const GLOW_R   = GRID * 2.2;

interface Pt { x: number; y: number; t: number; }

function FooterCanvas() {
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
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();

      ctx.clearRect(0, 0, w, h);
      const ox = offset % GRID;
      const oy = offset % GRID;

      // Lit cells
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

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth   = 1;
      ctx.beginPath();
      for (let x = -GRID + ox; x < w + GRID; x += GRID) {
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      for (let y = -GRID + oy; y < h + GRID; y += GRID) {
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
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

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden py-14"
      style={{
        background:
          "linear-gradient(135deg, var(--hero-from) 0%, var(--hero-mid) 60%, var(--hero-to) 100%)",
      }}
    >
      <FooterCanvas />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 font-mono text-sm font-semibold tracking-widest text-white/70">
              CompAcctSys
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-white/35">
              Compliant and Accountable Systems Research Group.
              RC-Trust, University of Duisburg-Essen &amp; Dept. CST, University of Cambridge.
            </p>
          </div>
          <div className="text-left md:text-right">
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className="font-mono text-xs text-white/40 transition-colors hover:text-white/70"
            >
              {siteSettings.contactEmail}
            </a>
            <p className="mt-2 font-mono text-[10px] text-white/20">
              © {new Date().getFullYear()} CompAcctSys
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
