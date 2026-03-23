"use client";

import { siteSettings } from "@/lib/data";
import { SceneCanvas } from "@/components/SceneCanvas";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden py-14"
      style={{ background: "var(--hero-bg)" }}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 font-mono text-sm font-semibold tracking-widest" style={{ color: "var(--hero-muted)" }}>
              CompAcctSys
            </p>
            <p className="max-w-sm text-xs leading-relaxed" style={{ color: "var(--hero-dimmer)" }}>
              Compliant and Accountable Systems Research Group.
              RC-Trust, University of Duisburg-Essen &amp; Dept. CST, University of Cambridge.
            </p>
          </div>
          <div className="text-left md:text-right">
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className="hero-email font-mono text-xs"
            >
              {siteSettings.contactEmail}
            </a>
            <p className="mt-2 font-mono text-[10px]" style={{ color: "var(--hero-dimmer)" }}>
              © {new Date().getFullYear()} CompAcctSys
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
