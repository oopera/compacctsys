import { getPublications } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";
import { CopyBibtexButton } from "@/components/CopyBibtexButton";

export async function Publications() {
  const publications = await getPublications();
  return (
    <section id="publications" className="bg-[var(--bg)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="Output" title="Publications" accent="orange" />
        {publications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-16 text-center">
            <p className="font-mono text-xs text-[var(--muted)]">
              Publications will be imported from BibTeX.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {publications.map((pub) => (
              <li
                key={pub.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  {pub.award && (
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                      style={{ background: "color-mix(in srgb, var(--orange) 10%, transparent)", color: "var(--orange)" }}
                    >
                      {pub.award}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-[var(--muted)]">
                    {pub.venueShort ?? pub.venue} · {pub.year}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-[var(--text)]">{pub.title}</h3>
                <div className="mt-1 flex items-center justify-between gap-4">
                  <p className="text-xs text-[var(--muted)]">
                    {pub.authors.map((a) => a.name).join(", ")}
                  </p>
                  <div className="flex shrink-0 items-center gap-3">
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                      >
                        DOI
                      </a>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                      >
                        PDF
                      </a>
                    )}
                    {pub.bibtex && <CopyBibtexButton bibtex={pub.bibtex} />}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
