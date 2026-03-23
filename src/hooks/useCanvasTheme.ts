"use client";

import { useEffect, useRef } from "react";

export type Theme = "light" | "dark" | "code" | "retro" | "cyberpunk" | "synthwave";

export interface CanvasPalette {
  fg: string;        // "r,g,b" triplet — grid lines, dots, node edges
  glow: string;      // "r,g,b" triplet — mouse-hover accent
  lineAlpha: number; // base opacity for grid/connecting lines
}

/** Parse any CSS colour value (#rrggbb, rgb(...), rgba(...)) → "r,g,b" */
function colorToRgb(raw: string): string {
  raw = raw.trim();
  if (raw.startsWith("#")) {
    const h = raw.slice(1);
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return `${parseInt(full.slice(0, 2), 16)},${parseInt(full.slice(2, 4), 16)},${parseInt(full.slice(4, 6), 16)}`;
  }
  const m = raw.match(/\d+/g);
  return m && m.length >= 3 ? `${m[0]},${m[1]},${m[2]}` : "128,128,128";
}

function readPalette(): CanvasPalette {
  const s = getComputedStyle(document.documentElement);
  return {
    fg:        colorToRgb(s.getPropertyValue("--canvas-fg")),
    glow:      colorToRgb(s.getPropertyValue("--canvas-glow")),
    lineAlpha: parseFloat(s.getPropertyValue("--canvas-line-alpha")) || 0.08,
  };
}

/**
 * Returns refs for the active theme name and the derived canvas palette.
 * Both refs are kept in sync via a MutationObserver on data-theme.
 */
export function useCanvasTheme() {
  const themeRef   = useRef<Theme>("light");
  const paletteRef = useRef<CanvasPalette>({ fg: "255,255,255", glow: "139,92,246", lineAlpha: 0.08 });

  useEffect(() => {
    themeRef.current   = (document.documentElement.dataset.theme ?? "light") as Theme;
    paletteRef.current = readPalette();

    const obs = new MutationObserver(() => {
      themeRef.current   = (document.documentElement.dataset.theme ?? "light") as Theme;
      paletteRef.current = readPalette();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return { themeRef, paletteRef };
}
