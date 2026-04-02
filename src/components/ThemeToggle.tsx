"use client";

import { useEffect, useRef, useState } from "react";
import type { Theme } from "@/hooks/useCanvasTheme";

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  // {
  //   value: "code",
  //   label: "Code",
  //   icon: (
  //     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  //     </svg>
  //   ),
  // },
  // {
  //   value: "retro",
  //   label: "Retro",
  //   icon: (
  //     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <circle cx="12" cy="12" r="9" />
  //       <polyline points="12 7 12 12 15 15" />
  //     </svg>
  //   ),
  // },
  // {
  //   value: "cyberpunk",
  //   label: "Cyber",
  //   icon: (
  //     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  //     </svg>
  //   ),
  // },
  // {
  //   value: "synthwave",
  //   label: "Synth",
  //   icon: (
  //     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M2 12 Q5 4 8 12 Q11 20 14 12 Q17 4 20 12 Q21.5 16 22 12" />
  //     </svg>
  //   ),
  // },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setTheme((document.documentElement.dataset.theme ?? "light") as Theme);
  }, []);

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function select(t: Theme) {
    setTheme(t);
    setOpen(false);
    document.documentElement.dataset.theme = t;
    localStorage.setItem("theme", t);
  }

  if (!mounted) return <span className="w-[14px]" />;

  const current = THEMES.find((t) => t.value === theme)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
        aria-label="Select theme"
      >
        {current.icon}
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-28 overflow-hidden"
          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        >
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => select(t.value)}
              className="flex w-full items-center gap-2.5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors"
              style={{
                color: t.value === theme ? "var(--text)" : "var(--muted)",
                background: t.value === theme ? "var(--bg-alt)" : "transparent",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
