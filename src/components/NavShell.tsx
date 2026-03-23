"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BtnLink } from "@/components/Btn";

const links = [
  { label: "Team",         href: "/team" },
  { label: "Projects",     href: "/projects" },
  { label: "Publications", href: "/publications" },
];

export function NavShell({ groupName }: { groupName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[var(--text)] bg-[var(--bg)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <Link href="/" className="group py-3 font-mono text-xs font-medium tracking-widest text-[var(--text)]">Comp<span className="inline-block max-w-0 overflow-hidden whitespace-nowrap align-text-bottom [transition:max-width_500ms_ease-in-out] group-hover:max-w-[64px]">{"liant\u00a0"}</span><span className="inline-block max-w-0 overflow-hidden whitespace-nowrap align-text-bottom [transition:max-width_500ms_ease-in-out] group-hover:max-w-[46px]">{"and\u00a0"}</span>Acct<span className="inline-block max-w-0 overflow-hidden whitespace-nowrap align-text-bottom [transition:max-width_500ms_ease-in-out] group-hover:max-w-[92px]">{"ountable\u00a0"}</span>Sys<span className="inline-block max-w-0 overflow-hidden whitespace-nowrap align-text-bottom [transition:max-width_500ms_ease-in-out] group-hover:max-w-[44px]">{"tems"}</span></Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-2 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors hover:text-[var(--text)] ${
                pathname === l.href ? "text-[var(--text)]" : "text-[var(--muted)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <BtnLink href="/apply">Apply</BtnLink>
          <div className="p-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col justify-center gap-[5px] p-3 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span
            className="block h-[2px] w-5 bg-[var(--text)] transition-transform origin-center"
            style={{ transform: open ? "translateY(7px) rotate(45deg)" : undefined }}
          />
          <span
            className="block h-[2px] w-5 bg-[var(--text)] transition-opacity"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-[2px] w-5 bg-[var(--text)] transition-transform origin-center"
            style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : undefined }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t border-[var(--border)] bg-[var(--bg)] md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-[var(--border)] px-6 py-4 font-mono text-[10px] uppercase tracking-widest transition-colors hover:text-[var(--main)] ${
                pathname === l.href ? "text-[var(--text)]" : "text-[var(--muted)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/apply"
            onClick={() => setOpen(false)}
            className="block border-b border-[var(--border)] px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[var(--text)] transition-colors hover:text-[var(--main)]"
          >
            Apply
          </Link>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Theme</span>
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
