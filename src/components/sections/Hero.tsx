import { HeroCanvas } from "@/components/HeroCanvas";
import { getSiteSettings } from "@/lib/sanity/queries";

export async function Hero() {
  const settings = await getSiteSettings();

  return (
    <section
      id="about"
      className="relative flex min-h-[65vh] flex-col overflow-hidden bg-black"
    >
      <HeroCanvas />

      {/* Top strip */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Research Group
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
          Compliant · Accountable · Trustworthy
        </span>
      </div>

      {/* Main — title fills the space */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-10 pt-16 md:px-10">
        <h1
          className="font-semibold leading-tight tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
        >
          {settings?.groupName ?? "Compliant and Accountable Systems"}
        </h1>

      </div>

      {/* Bottom strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4 md:px-10">
        <div className="flex flex-wrap gap-6">
          {settings?.affiliations?.map((a) => (
            <span key={a} className="font-mono text-[10px] uppercase tracking-wider text-white/30">
              {a}
            </span>
          ))}
        </div>
        {settings?.contactEmail && (
          <a
            href={`mailto:${settings.contactEmail}`}
            className="font-mono text-[10px] text-white/40 transition-colors hover:text-white"
          >
            {settings.contactEmail}
          </a>
        )}
      </div>
    </section>
  );
}
