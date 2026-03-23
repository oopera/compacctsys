import { HeroCanvas } from "@/components/HeroCanvas";
import { getSiteSettings } from "@/lib/sanity/queries";

export async function Hero() {
  const settings = await getSiteSettings();

  return (
    <section
      id="about"
      className="relative flex min-h-[65vh] flex-col overflow-hidden"
      style={{ background: "var(--hero-bg)" }}
    >
      <HeroCanvas />

      {/* Top strip */}
      <div className="relative z-10" style={{ borderBottom: "1px solid var(--hero-line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--hero-muted)" }}>
            Research Group
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--hero-dimmer)" }}>
            Compliant · Accountable · Trustworthy
          </span>
        </div>
      </div>

      {/* Main — title fills the space */}
      <div className="relative z-10 flex flex-1 flex-col justify-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-16 md:px-10">
          <h1
            className="font-semibold leading-tight tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", color: "var(--hero-fg)" }}
          >
            {settings?.groupName ?? "Compliant and Accountable Systems"}
          </h1>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative z-10" style={{ borderTop: "1px solid var(--hero-line)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="flex flex-wrap gap-6">
            {settings?.affiliations?.map((a) => (
              <span key={a} className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--hero-muted)" }}>
                {a}
              </span>
            ))}
          </div>
          {settings?.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="hero-email font-mono text-[10px]"
            >
              {settings.contactEmail}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
