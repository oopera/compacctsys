"use client";

import { siteSettings } from "@/lib/data";
import { SceneCanvas } from "@/components/SceneCanvas";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden py-8 md:py-14"
      style={{ background: "var(--bg)" }}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 font-mono text-sm font-semibold tracking-widest" style={{ color: "var(--text)" }}>
              CompAcctSys
            </p>
            <p className="max-w-sm text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              Compliant and Accountable Systems Research Group.
              RC-Trust, University of Duisburg-Essen &amp; Dept. CST, University of Cambridge.
            </p>
          </div>
          <div className="text-left md:text-right">
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className="hero-email font-mono text-xs"
              style={{ color: "var(--muted)" }}

            >
              {siteSettings.contactEmail}
            </a>
            <p className="mt-2 font-mono text-[10px]" style={{ color: "var(--muted)" }}>
              © {new Date().getFullYear()} CompAcctSys
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
