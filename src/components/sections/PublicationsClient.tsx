"use client";

import { useState, useMemo } from "react";
import { CopyBibtexButton } from "@/components/CopyBibtexButton";
import { BtnLink, BtnToggle } from "@/components/Btn";
import type { Publication, PublicationType } from "@/types";

const typeLabel: Record<PublicationType, string> = {
  conference:     "Conference",
  journal:        "Journal",
  workshop:       "Workshop",
  arxiv:          "Preprint",
  "book-chapter": "Book Chapter",
  demo:           "Demo",
  other:          "Other",
};

const ALL = "all";
const AWARDED = "awarded";
const VENUE_PREFIX = "venue:";

type Filter = PublicationType | typeof ALL | typeof AWARDED | string; // string covers "venue:CHI" etc.

interface Props {
  publications: Publication[];
}

export function PublicationsClient({ publications }: Props) {
  const [active, setActive] = useState<Filter>(ALL);

  // Collect only types that actually appear in the data
  const availableTypes = useMemo(() => {
    const seen = new Set<PublicationType>();
    for (const p of publications) seen.add(p.type);
    return (Object.keys(typeLabel) as PublicationType[]).filter((t) => seen.has(t));
  }, [publications]);

  const hasAwards = useMemo(() => publications.some((p) => p.award), [publications]);

  // Known venue labels — extend as needed
  const venueLabels: Record<string, string> = { CHI: "CHI", FAccT: "FAccT" };

  const availableVenues = useMemo(() => {
    const seen = new Set<string>();
    for (const p of publications) if (p.venueShort) seen.add(p.venueShort);
    return Object.keys(venueLabels).filter((v) => seen.has(v));
  }, [publications]);

  const filtered = useMemo(() => {
    if (active === ALL) return publications;
    if (active === AWARDED) return publications.filter((p) => p.award);
    if (active.startsWith(VENUE_PREFIX)) {
      const v = active.slice(VENUE_PREFIX.length);
      return publications.filter((p) => p.venueShort === v);
    }
    return publications.filter((p) => p.type === active);
  }, [publications, active]);

  // Group by year, descending
  const byYear = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const pub of filtered) {
      const yr = pub.year ?? 0;
      if (!map.has(yr)) map.set(yr, []);
      map.get(yr)!.push(pub);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [filtered]);

  return (
    <>
      {/* Filter bar */}
      {(availableTypes.length > 1 || hasAwards || availableVenues.length > 0) && (
        <div className="mb-10 flex flex-wrap gap-2">
          <BtnToggle active={active === ALL} onClick={() => setActive(ALL)}>All</BtnToggle>

          {availableTypes.map((t) => (
            <BtnToggle key={t} active={active === t} onClick={() => setActive(active === t ? ALL : t)}>
              {typeLabel[t]}
            </BtnToggle>
          ))}

          {availableVenues.length > 0 && (
            <>
              <span className="self-center mx-1 h-4 w-px bg-[var(--border)]" />
              {availableVenues.map((v) => (
                <BtnToggle key={v} active={active === VENUE_PREFIX + v} onClick={() => setActive(active === VENUE_PREFIX + v ? ALL : VENUE_PREFIX + v)}>
                  {venueLabels[v] ?? v}
                </BtnToggle>
              ))}
            </>
          )}

          {hasAwards && (
            <BtnToggle active={active === AWARDED} accent="var(--secondary)" onClick={() => setActive(active === AWARDED ? ALL : AWARDED)}>
              Recognised
            </BtnToggle>
          )}
        </div>
      )}

      {/* Publications grouped by year */}
      {byYear.length === 0 ? (
        <p className="font-mono text-xs text-[var(--muted)]">No publications match this filter.</p>
      ) : (
        byYear.map(([year, pubs]) => (
          <div key={year} className="mb-12 last:mb-0">
            {/* Year heading */}
            <div className="mb-6 flex items-center gap-4">
              <span className="font-mono text-xs font-semibold tracking-widest text-[var(--muted)] uppercase">
                {year || "—"}
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <ul className="divide-y divide-[var(--border)]">
              {pubs.map((pub) => (
                <li key={pub.id} className="py-8 first:pt-0">

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
                        {pub.award}
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
    </>
  );
}
