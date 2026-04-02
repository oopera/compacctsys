"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export function NewsSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  if (pathname.startsWith("/studio")) return null;

  return (
    // The whole aside (panel + tab) shifts together.
    // Closed: translateX(-256px) → only the 20px tab peeks from the left edge.
    // Open:   translateX(0)      → full panel + tab visible.
    <aside
      className={`
        fixed top-[0px] left-0 z-40
        hidden min-[1600px]:flex
        h-[calc(100vh-42px)]
        transition-transform duration-300 ease-in-out
      `}
      style={{
        // Panel width grows with the viewport
        ["--panel-w" as string]: "clamp(14rem, calc(50vw - 36rem), 22rem)",
      }}
    >
      {/* Panel */}
      <div
        className="h-full overflow-y-auto shrink-0"
        style={{ width: "var(--panel-w)", background: "var(--bg)" }}
      >
        {children}
      </div>

      {/* Pull tab — always peeks out at the left edge when closed */}
      {/* <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close news panel" : "Open news panel"}
        className="flex items-center justify-center w-5 shrink-0 self-center h-16 border border-l-0 border-[var(--border)] transition-colors hover:border-[var(--main)]"
        style={{ background: "var(--bg)" }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] select-none"
          style={{ writingMode: "vertical-rl", transform: open ? "rotate(180deg)" : "none" }}
        >
          News
        </span>
      </button> */}
    </aside>
  );
}
