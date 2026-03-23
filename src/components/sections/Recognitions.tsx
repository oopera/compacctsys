import { getAwardedPublications } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

export async function Recognitions() {
  const pubs = await getAwardedPublications();
  if (pubs.length === 0) return null;

  return (
    <section id="recognitions" className="bg-[var(--bg-alt)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="Honours" title="Recognitions" accent="secondary" />
        <ul className="space-y-4">
          {pubs.map((pub) => (
            <li
              key={pub.id}
              className="border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--secondary)]/40"
            >
              <div className="flex flex-wrap items-start gap-4">
                {/* Award badge */}
                <div
                  className="shrink-0 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest"
                  style={{
                    borderColor: "color-mix(in srgb, var(--secondary) 40%, transparent)",
                    color: "var(--secondary)",
                    background: "color-mix(in srgb, var(--secondary) 6%, transparent)",
                  }}
                >
                  {pub.award}
                </div>

                {/* Paper info */}
                <div className="min-w-0 flex-1">
                  <p className="mb-1 font-mono text-[10px] text-[var(--muted)]">
                    {pub.venueShort ?? pub.venue} · {pub.year}
                  </p>
                  {pub.url || pub.doi ? (
                    <a
                      href={pub.url ?? `https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-1 block text-sm font-semibold leading-snug text-[var(--text)] transition-colors hover:text-[var(--secondary)]"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    <p className="mb-1 text-sm font-semibold leading-snug text-[var(--text)]">
                      {pub.title}
                    </p>
                  )}
                  <p className="text-xs text-[var(--muted)]">
                    {pub.authors.map((a) => a.name).join(", ")}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
