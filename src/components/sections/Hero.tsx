import { siteSettings } from "@/lib/data";

export function Hero() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 pb-24 pt-40">
      <div className="max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--orange)]">
          Research Group
        </p>
        <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight text-[var(--text)] md:text-6xl">
          Compliant and{" "}
          <span className="text-[var(--violet)]">Accountable</span>{" "}
          Systems
        </h1>
        <p className="mb-4 text-lg font-light leading-relaxed text-[var(--muted)]">
          {siteSettings.tagline}
        </p>
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--text)]/80">
          {siteSettings.description}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--muted)]">
            RC-Trust · University of Duisburg-Essen
          </span>
          <span className="rounded-full border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--muted)]">
            Dept. CST · University of Cambridge
          </span>
          <a
            href={`mailto:${siteSettings.contactEmail}`}
            className="rounded-full border border-[var(--violet)]/40 px-3 py-1 font-mono text-xs text-[var(--violet)] transition-colors hover:border-[var(--violet)] hover:bg-[var(--violet)]/10"
          >
            {siteSettings.contactEmail}
          </a>
        </div>
      </div>
    </section>
  );
}
