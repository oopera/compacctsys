"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Reveal({ w, open, children }: { w: string; open: boolean; children: string }) {
  return (
    <span
      className="inline-block whitespace-nowrap"
      style={{
        maxWidth: open ? w : "0px",
        clipPath: open ? "inset(-50% 0% -50% 0)" : "inset(-50% 100% -50% 0)",
        transition: "max-width 500ms ease-in-out, clip-path 500ms ease-in-out",
      }}
    >
      {children}
    </span>
  );
}

export function NavLogo() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const expanded = !scrolled;

  return (
    <Link
      href="/"
      className="flex-1 min-w-0 py-3 font-mono text-sm font-semibold leading-none tracking-widest whitespace-nowrap text-[var(--text)] overflow-hidden"
    >
      <span className="md:hidden">CompAcctSys</span>
      <span className="hidden md:inline">
        Comp<Reveal w="64px" open={expanded}>{"liant\u00a0"}</Reveal
        ><Reveal w="46px" open={expanded}>{"and\u00a0"}</Reveal
        >Acct<Reveal w="92px" open={expanded}>{"ountable\u00a0"}</Reveal
        >Sys<Reveal w="44px" open={expanded}>{"tems"}</Reveal
        ><span className="hidden lg:contents"><Reveal w="170px" open={expanded}>{"\u00a0Research\u00a0Group"}</Reveal></span>
      </span>
    </Link>
  );
}
