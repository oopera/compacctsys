"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BtnLink } from "@/components/Btn";

function Reveal({ w, open, children }: { w: string; open: boolean; children: string }) {
  return (
    <span
      className="inline-block whitespace-nowrap"
      style={{
        maxWidth: open ? w : "0px",
        // clip-path doesn't alter the baseline — unlike overflow:hidden
        clipPath: open ? "inset(-50% 0% -50% 0)" : "inset(-50% 100% -50% 0)",
        transition: "max-width 500ms ease-in-out, clip-path 500ms ease-in-out",
      }}
    >
      {children}
    </span>
  );
}

const links = [
  { label: "Team", href: "/team" },
  { label: "Projects", href: "/projects" },
  { label: "Publications", href: "/publications" },
];

export function NavShell({ groupName, showApply = true }: { groupName: string; showApply?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Expanded at top, collapsed when scrolled — hover always re-expands
  const logoExpanded = !scrolled || logoHovered;

  const logoSpans: [string, string][] = [
    ["liant\u00a0", "64px"],
    ["and\u00a0", "46px"],
    ["ountable\u00a0", "92px"],
    ["tems", "44px"],
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--bg)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <Link
          href="/"
          className="py-3 font-mono text-sm font-semibold leading-none tracking-widest text-[var(--text)]"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          Comp<Reveal w={logoSpans[0][1]} open={logoExpanded}>{logoSpans[0][0]}</Reveal
          ><Reveal w={logoSpans[1][1]} open={logoExpanded}>{logoSpans[1][0]}</Reveal
          >Acct<Reveal w={logoSpans[2][1]} open={logoExpanded}>{logoSpans[2][0]}</Reveal
          >Sys<Reveal w={logoSpans[3][1]} open={logoExpanded}>{logoSpans[3][0]}</Reveal>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
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
          {showApply && <BtnLink href="/apply">Apply</BtnLink>}
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
              className={`block border-b border-[var(--border)] px-6 py-4 font-mono text-[10px] uppercase tracking-widest transition-colors hover:text-[var(--main)] ${pathname === l.href ? "text-[var(--text)]" : "text-[var(--muted)]"
                }`}
            >
              {l.label}
            </Link>
          ))}
          {showApply && (
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="block border-b border-[var(--border)] px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[var(--text)] transition-colors hover:text-[var(--main)]"
            >
              Apply
            </Link>
          )}
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Theme</span>
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
