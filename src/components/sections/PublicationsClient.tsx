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

  const years = byYear.map(([y]) => y);

  return (
    <div className="lg:grid lg:grid-cols-[120px_1fr] lg:items-start lg:gap-10">
      {/* Year nav sidebar — desktop only */}
      {years.length > 1 && (
        <aside className="hidden lg:flex self-start sticky top-20 flex-col gap-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">
            Year
          </p>
          {years.map((y) => (
            <a
              key={y}
              href={`#year-${y}`}
              className="font-mono text-xs text-[var(--muted)] py-1 transition-colors hover:text-[var(--text)]"
            >
              {y || "—"}
            </a>
          ))}
        </aside>
      )}

      {/* Publications grouped by year */}
      <div>
        {byYear.length === 0 ? (
          <p className="font-mono text-xs text-[var(--muted)]">No publications yet.</p>
        ) : (
          byYear.map(([year, pubs]) => (
            <div key={year} id={`year-${year}`} className="mb-8 md:mb-12 last:mb-0 scroll-mt-20">
              {/* Year heading */}
              <div className="mb-6 flex items-center gap-4">
                <span className="font-mono text-sm font-semibold tracking-widest text-[var(--text)] uppercase">
                  {year || "—"}
                </span>
                <div className="h-[2px] flex-1 bg-[var(--text)]" style={{ opacity: 0.2 }} />
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
                        {pub.venueDisplay ?? pub.venueShort ?? pub.venue}
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
                    {(pub.url || pub.bibtex) && (
                      <div className="flex flex-wrap items-center gap-2">
                        {pub.url && (
                          <BtnLink href={pub.url} external>Publisher ↗</BtnLink>
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
    </div>
  );
}
