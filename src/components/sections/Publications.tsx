import { getPublications } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";
import { CopyBibtexButton } from "@/components/CopyBibtexButton";
import { PublicationType } from "@/types";

const typeLabel: Record<PublicationType, string> = {
  conference:     "Conference",
  journal:        "Journal",
  workshop:       "Workshop",
  arxiv:          "Preprint",
  "book-chapter": "Book Chapter",
  demo:           "Demo",
  other:          "Other",
};

export async function Publications() {
  const publications = await getPublications();

  return (
    <section id="publications" className="bg-[var(--bg)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader label="Output" title="Publications" accent="orange" />

        {publications.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] p-16 text-center">
            <p className="font-mono text-xs text-[var(--muted)]">
              Publications will be imported from BibTeX.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {publications.map((pub) => (
              <li key={pub.id} className="group py-10 first:pt-0">

                {/* Type + award + venue badges */}
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                    style={{
                      color: "var(--violet)",
                      borderColor: "color-mix(in srgb, var(--violet) 30%, transparent)",
                      background: "color-mix(in srgb, var(--violet) 6%, transparent)",
                    }}
                  >
                    {typeLabel[pub.type] ?? pub.type}
                  </span>

                  {pub.award && (
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                      style={{
                        color: "var(--orange)",
                        borderColor: "color-mix(in srgb, var(--orange) 30%, transparent)",
                        background: "color-mix(in srgb, var(--orange) 6%, transparent)",
                      }}
                    >
                      {pub.award}
                    </span>
                  )}

                  <span className="font-mono text-[10px] text-[var(--muted)]">
                    {pub.venueShort ?? pub.venue}{pub.year ? ` · ${pub.year}` : ""}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 font-serif text-2xl italic leading-snug tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--violet)] md:text-3xl">
                  {pub.title}
                </h3>

                {/* Authors */}
                <p className="mb-5 font-mono text-xs text-[var(--muted)]">
                  {pub.authors.map((a) => a.name).join(" · ")}
                </p>

                {/* Links */}
                {(pub.doi || pub.url || pub.bibtex) && (
                  <div className="flex items-center gap-5">
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                      >
                        DOI ↗
                      </a>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                      >
                        PDF ↗
                      </a>
                    )}
                    {pub.bibtex && <CopyBibtexButton bibtex={pub.bibtex} />}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
