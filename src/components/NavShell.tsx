"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLogo } from "@/components/NavLogo";
import { BtnLink } from "@/components/Btn";

const links = [
  { label: "Team", href: "/team" },
  { label: "Research Themes", href: "/research-themes" },
  { label: "Publications", href: "/publications" },
];

export function NavShell({ groupName }: { groupName: string }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => { closeDrawer(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  function openDrawer() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  function closeDrawer() {
    setVisible(false);
    closeTimer.current = setTimeout(() => setOpen(false), 260);
  }

  function toggleDrawer() {
    open ? closeDrawer() : openDrawer();
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--bg)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-10">
        <NavLogo />

        {/* Desktop nav */}
        <nav className="hidden shrink-0 items-center gap-4 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-2 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors hover:text-[var(--text)] ${pathname === l.href ? "text-[var(--text)]" : "text-[var(--muted)]"
                }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="p-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* Hamburger */}
        <button
          onClick={toggleDrawer}
          aria-label={open ? "Close menu" : "Open menu"}
          className="group relative flex h-8 w-8 cursor-pointer items-center justify-center md:hidden"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className="absolute inset-0 rounded-full border border-[var(--border)] transition-colors duration-200 group-hover:border-[var(--muted)]" aria-hidden />
          <span className="flex flex-col gap-[5px]">
            <span
              className="block h-px w-[14px] origin-center bg-[var(--text)] transition-all duration-300 ease-in-out"
              style={{ transform: visible ? "translateY(6px) rotate(45deg)" : "none" }}
            />
            <span
              className="block h-px w-[14px] bg-[var(--text)] transition-all duration-300 ease-in-out"
              style={{ opacity: visible ? 0 : 1, transform: visible ? "scaleX(0)" : "none" }}
            />
            <span
              className="block h-px w-[14px] origin-center bg-[var(--text)] transition-all duration-300 ease-in-out"
              style={{ transform: visible ? "translateY(-6px) rotate(-45deg)" : "none" }}
            />
          </span>
        </button>
      </div>

      {/* Dropdown — absolute so it overlays content, no layout shift */}
      {open && (
        <nav
          className="absolute left-0 right-0 top-full z-20 border-t border-b border-[var(--border)] bg-[var(--bg)] md:hidden"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 260ms ease, transform 260ms ease",
          }}
        >
          {[...links].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeDrawer}
              className={`flex items-center justify-between border-b border-[var(--border)] px-4 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors hover:text-[var(--text)] ${pathname === l.href ? "text-[var(--text)]" : "text-[var(--muted)]"
                }`}
            >
              {l.label}
              {pathname === l.href && <span className="h-1 w-1 rounded-full bg-[var(--main)]" />}
            </Link>
          ))}
          <div className="flex items-center justify-between px-4 py-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Theme</span>
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
