import { HeroCanvas } from "@/components/HeroCanvas";
import { getSiteSettings } from "@/lib/sanity/queries";

export async function Hero() {
  const settings = await getSiteSettings();

  return (
    <section
      id="about"
      className="relative flex min-h-[92vh] items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--hero-from) 0%, var(--hero-mid) 50%, var(--hero-to) 100%)",
      }}
    >
      <HeroCanvas />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <p className="mb-5 font-mono text-xs uppercase tracking-widest text-white/40">
          Research Group
        </p>
        <h1 className="mb-6 font-serif italic text-6xl leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
          {settings?.groupName ?? "Compliant and Accountable Systems"}
        </h1>
        {settings?.tagline && (
          <p className="mb-10 max-w-lg text-lg font-light leading-relaxed text-white/55">
            {settings.tagline}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {settings?.affiliations?.map((affiliation) => (
            <span
              key={affiliation}
              className="border border-white/15 px-4 py-1.5 font-mono text-xs text-white/50"
            >
              {affiliation}
            </span>
          ))}
          {settings?.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="border border-white/25 px-4 py-1.5 font-mono text-xs text-white/70 transition-colors hover:border-white/50 hover:text-white"
            >
              {settings.contactEmail}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
