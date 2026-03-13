import { siteSettings } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-1 font-mono text-sm font-semibold text-[var(--violet)]">CompAcctSys</p>
            <p className="max-w-sm text-xs leading-relaxed text-[var(--muted)]">
              Compliant and Accountable Systems Research Group.
              RC-Trust, University of Duisburg-Essen &amp; Dept. CST, University of Cambridge.
            </p>
          </div>
          <div className="text-right">
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className="font-mono text-xs text-[var(--muted)] transition-colors hover:text-[var(--violet)]"
            >
              {siteSettings.contactEmail}
            </a>
            <p className="mt-2 font-mono text-[10px] text-[var(--border)]">
              © {new Date().getFullYear()} CompAcctSys
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
