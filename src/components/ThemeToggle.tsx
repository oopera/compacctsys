"use client";

import { useSyncExternalStore, useCallback } from "react";

function subscribe(cb: () => void) {
  // Re-sync when theme changes (from other tabs or programmatic updates)
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function getServerSnapshot() {
  return true; // matches the default in the inline script
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { }
  }, [dark]);

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-[18px] w-[30px] items-center rounded-full border border-[var(--border)] transition-colors duration-300"
      style={{ background: dark ? "var(--bg-alt)" : "var(--border)" }}
    >
      {/* Track icons */}
      <span className="absolute left-[4px] flex items-center text-[var(--muted)]" style={{ opacity: dark ? 0 : 1, transition: "opacity 200ms" }}>
        {/* Sun */}
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
      <span className="absolute right-[4px] flex items-center text-[var(--muted)]" style={{ opacity: dark ? 1 : 0, transition: "opacity 200ms" }}>
        {/* Moon */}
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
      {/* Thumb */}
      <span
        className="absolute h-[12px] w-[12px] rounded-full bg-[var(--text)] shadow-sm"
        style={{
          left: dark ? "calc(100% - 14px)" : "2px",
          transition: "left 250ms ease",
        }}
      />
    </button>
  );
}
