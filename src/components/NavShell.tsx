"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
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
        <Link href="/" className="group font-mono text-xs font-medium tracking-widest text-black">Comp<span className="inline-block max-w-0 overflow-hidden whitespace-nowrap align-text-bottom [transition:max-width_500ms_ease-in-out] group-hover:max-w-[64px]">{"liant\u00a0"}</span><span className="inline-block max-w-0 overflow-hidden whitespace-nowrap align-text-bottom [transition:max-width_500ms_ease-in-out] group-hover:max-w-[46px]">{"and\u00a0"}</span>Acct<span className="inline-block max-w-0 overflow-hidden whitespace-nowrap align-text-bottom [transition:max-width_500ms_ease-in-out] group-hover:max-w-[92px]">{"ountable\u00a0"}</span>Sys<span className="inline-block max-w-0 overflow-hidden whitespace-nowrap align-text-bottom [transition:max-width_500ms_ease-in-out] group-hover:max-w-[44px]">{"tems"}</span></Link>

        {/* Desktop nav */}
        <nav className="hidden gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[10px] uppercase tracking-widest transition-colors hover:text-black ${
                pathname === l.href ? "text-black" : "text-black/40"
              }`}
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
        <nav className="border-t border-[var(--border)] bg-white md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-[var(--border)] px-6 py-4 font-mono text-[10px] uppercase tracking-widest transition-colors hover:text-[var(--violet)] ${
                pathname === l.href ? "text-black" : "text-black/50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
