import { HeroCanvas } from "@/components/HeroCanvas";
import { siteSettings } from "@/lib/data";

export function Hero() {
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
          Compliant and
          <br />
          Accountable
          <br />
          Systems
        </h1>
        <p className="mb-10 max-w-lg text-lg font-light leading-relaxed text-white/55">
          {siteSettings.tagline}
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs text-white/50">
            RC-Trust · University of Duisburg-Essen
          </span>
          <span className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs text-white/50">
            Dept. CST · University of Cambridge
          </span>
          <a
            href={`mailto:${siteSettings.contactEmail}`}
            className="rounded-full border border-white/25 px-4 py-1.5 font-mono text-xs text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            {siteSettings.contactEmail}
          </a>
        </div>
      </div>
    </section>
  );
}
