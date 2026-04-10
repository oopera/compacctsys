import { getSiteSettings } from "@/lib/sanity/queries";

export async function Footer() {
  const settings = await getSiteSettings();
  const email = settings?.contactEmail;
  const affiliations = settings?.affiliations;

  return (
    <footer
      className="relative overflow-hidden py-8 md:py-14"
      style={{ background: "var(--bg)" }}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-xs" style={{ color: "var(--text)" }}>
              {settings?.groupName ?? "CompAcctSys"}
            </p>
            {affiliations && affiliations.length > 0 && (
              <p className="max-w-sm text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {affiliations.join(" | ")}.
              </p>
            )}
          </div>
          {email && (
            <div className="text-left md:text-right">
              <a
                href={`mailto:${email}`}
                className="truncate font-mono text-[10px] text-[var(--muted)] transition-colors hover:text-[var(--main)]"
              >
                {email}
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
