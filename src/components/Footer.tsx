import { siteSettings } from "@/lib/data";

export function Footer() {
  return (
    <footer
      className="py-14"
      style={{
        background:
          "linear-gradient(135deg, var(--hero-from) 0%, var(--hero-mid) 60%, var(--hero-to) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 font-mono text-sm font-semibold tracking-widest text-white/70">
              CompAcctSys
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-white/35">
              Compliant and Accountable Systems Research Group.
              RC-Trust, University of Duisburg-Essen &amp; Dept. CST, University of Cambridge.
            </p>
          </div>
          <div className="text-left md:text-right">
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className="font-mono text-xs text-white/40 transition-colors hover:text-white/70"
            >
              {siteSettings.contactEmail}
            </a>
            <p className="mt-2 font-mono text-[10px] text-white/20">
              © {new Date().getFullYear()} CompAcctSys
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
