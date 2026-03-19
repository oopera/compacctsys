"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Research",     href: "/research" },
  { label: "Team",         href: "/team" },
  { label: "Projects",     href: "/projects" },
  { label: "Publications", href: "/publications" },
];

export function NavShell({ groupName }: { groupName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b-2 border-black bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <Link
          href="/"
          className="font-mono text-xs font-medium uppercase tracking-widest text-black transition-opacity hover:opacity-60"
        >
          {groupName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[10px] uppercase tracking-widest transition-colors"
              style={{ color: pathname === l.href ? "var(--black, #000)" : "rgba(0,0,0,0.4)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col justify-center gap-[5px] p-1 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span
            className="block h-[2px] w-5 bg-black transition-transform origin-center"
            style={{ transform: open ? "translateY(7px) rotate(45deg)" : undefined }}
          />
          <span
            className="block h-[2px] w-5 bg-black transition-opacity"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-[2px] w-5 bg-black transition-transform origin-center"
            style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : undefined }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t-2 border-black bg-white md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-black/10 px-6 py-4 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
              style={{ color: pathname === l.href ? "#000" : "rgba(0,0,0,0.5)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
