"use client";

import { useEffect, useRef } from "react";

const GRID = 72; // px between lines
const DRIFT = 0.12; // px per frame diagonal drift

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0, h = 0;
    let offset = 0;
    let raf: number;

    function resize() {
      w = canvas!.width  = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }
    resize();

    function draw() {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);

      const ox = offset % GRID;
      const oy = offset % GRID;

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
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

      // Intersection dots
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      for (let x = -GRID + ox; x < w + GRID; x += GRID) {
        for (let y = -GRID + oy; y < h + GRID; y += GRID) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
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
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
