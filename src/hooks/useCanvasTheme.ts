"use client";

import { useEffect, useRef } from "react";

export type Theme = "light" | "dark" | "code" | "retro" | "cyberpunk" | "synthwave";

/** Returns a ref whose .current is always the active theme name, updated via MutationObserver. */
export function useCanvasTheme() {
  const themeRef = useRef<Theme>("light");

  useEffect(() => {
    themeRef.current = (document.documentElement.dataset.theme ?? "light") as Theme;
    const obs = new MutationObserver(() => {
      themeRef.current = (document.documentElement.dataset.theme ?? "light") as Theme;
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return themeRef;
}
