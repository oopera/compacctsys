"use client";

import { useMemo } from "react";
import { CopyBibtexButton } from "@/components/CopyBibtexButton";
import { BtnLink } from "@/components/Btn";
import type { Publication, PublicationType } from "@/types";

const typeLabel: Record<PublicationType, string> = {
  conference: "Conference",
  journal: "Journal",
  workshop: "Workshop",
  arxiv: "Preprint",
  "book-chapter": "Book Chapter",
  demo: "Demo",
  other: "Other",
};

interface Props {
  publications: Publication[];
}

export function PublicationsClient({ publications }: Props) {
  // Group by year, descending
  const byYear = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const pub of publications) {
      const yr = pub.year ?? 0;
      if (!map.has(yr)) map.set(yr, []);
      map.get(yr)!.push(pub);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [publications]);

  return (
    <div>
      {byYear.length === 0 ? (
        <p className="font-mono text-xs text-[var(--muted)]">No publications yet.</p>
      ) : (
        byYear.map(([year, pubs]) => (
          <div key={year} className="mb-8 md:mb-12 last:mb-0">
            {/* Year heading */}
            <div className="mb-6 flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase">
                {year || "—"}
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <ul className="divide-y divide-[var(--border)]">
              {pubs.map((pub) => (
                <li key={pub.id} className="py-5 md:py-8 first:pt-0">

                  {/* Type + award + venue badges */}
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                      style={{
                        color: "var(--main)",
                        borderColor: "color-mix(in srgb, var(--main) 30%, transparent)",
                        background: "color-mix(in srgb, var(--main) 6%, transparent)",
                      }}
                    >
                      {typeLabel[pub.type] ?? pub.type}
                    </span>

                    {pub.award && (
                      <span
                        className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                        style={{
                          color: "var(--secondary)",
                          borderColor: "color-mix(in srgb, var(--secondary) 30%, transparent)",
                          background: "color-mix(in srgb, var(--secondary) 6%, transparent)",
                        }}
                      >
                        Award
                      </span>
                    )}

                    <span className="font-mono text-[10px] text-[var(--muted)]">
                      {pub.venueShort ?? pub.venue}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-lg font-semibold leading-snug text-[var(--text)]">
                    {pub.title}
                  </h3>

                  {/* Authors */}
                  <p className="mb-5 font-mono text-xs text-[var(--muted)]">
                    {pub.authors.map((a, i) => (
                      <span key={i}>
                        {i > 0 && " · "}
                        {a.teamMemberId ? (
                          <span className="text-[var(--text)] font-medium">{a.name}</span>
                        ) : (
                          a.name
                        )}
                      </span>
                    ))}
                  </p>

                  {/* Links */}
                  {(pub.doi || pub.url || pub.bibtex) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {pub.doi && (
                        <BtnLink href={`https://doi.org/${pub.doi}`} external>DOI ↗</BtnLink>
                      )}
                      {pub.url && (
                        <BtnLink href={pub.url} external>PDF ↗</BtnLink>
                      )}
                      {pub.bibtex && <CopyBibtexButton bibtex={pub.bibtex} />}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
