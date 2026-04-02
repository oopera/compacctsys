"use client";

import Link from "next/link";
import { useState } from "react";

const cls =
  "border border-[var(--border)] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[var(--text)] transition-colors hover:bg-[var(--text)] hover:text-[var(--bg)]";

export function BtnLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-block ${cls} ${className ?? ""}`}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`inline-block ${cls} ${className ?? ""}`}>
      {children}
    </Link>
  );
}

const toggleBase =
  "shrink-0 whitespace-nowrap border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-150 cursor-pointer";

export function BtnToggle({
  active,
  accent = "var(--main)",
  onClick,
  children,
}: {
  active: boolean;
  accent?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  let style: React.CSSProperties;
  if (active && hovered) {
    // filled on hover when active
    style = { color: "var(--bg)", borderColor: accent, background: accent };
  } else if (active) {
    style = { color: accent, borderColor: accent, background: `color-mix(in srgb, ${accent} 10%, transparent)` };
  } else if (hovered) {
    // border sharpens on hover when inactive
    style = { color: "var(--text)", borderColor: "var(--text)" };
  } else {
    style = { color: "var(--muted)", borderColor: "var(--border)" };
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={toggleBase}
      style={style}
    >
      {children}
    </button>
  );
}

export function Btn({
  onClick,
  children,
  className,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button onClick={onClick} className={`cursor-pointer ${cls} ${className ?? ""}`}>
      {children}
    </button>
  );
}
