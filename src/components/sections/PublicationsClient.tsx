"use client";

import { useState, useMemo } from "react";
import { CopyBibtexButton } from "@/components/CopyBibtexButton";
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

  const filterBtn =
    "font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors duration-150";

  return (
    <>
      {/* Filter bar */}
      {(availableTypes.length > 1 || hasAwards || availableVenues.length > 0) && (
        <div className="mb-10 flex flex-wrap gap-2">
          {/* All */}
          <button
            onClick={() => setActive(ALL)}
            className={filterBtn}
            style={
              active === ALL
                ? { color: "var(--violet)", borderColor: "var(--violet)", background: "color-mix(in srgb, var(--violet) 10%, transparent)" }
                : { color: "var(--muted)", borderColor: "var(--border)" }
            }
          >
            All
          </button>

          {/* Type filters */}
          {availableTypes.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={filterBtn}
              style={
                active === t
                  ? { color: "var(--violet)", borderColor: "var(--violet)", background: "color-mix(in srgb, var(--violet) 10%, transparent)" }
                  : { color: "var(--muted)", borderColor: "var(--border)" }
              }
            >
              {typeLabel[t]}
            </button>
          ))}

          {/* Venue sub-filters */}
          {availableVenues.length > 0 && (
            <>
              <span className="self-center mx-1 h-4 w-px bg-[var(--border)]" />
              {availableVenues.map((v) => (
                <button
                  key={v}
                  onClick={() => setActive(VENUE_PREFIX + v)}
                  className={filterBtn}
                  style={
                    active === VENUE_PREFIX + v
                      ? { color: "var(--violet)", borderColor: "var(--violet)", background: "color-mix(in srgb, var(--violet) 10%, transparent)" }
                      : { color: "var(--muted)", borderColor: "var(--border)" }
                  }
                >
                  {venueLabels[v] ?? v}
                </button>
              ))}
            </>
          )}

          {/* Awards filter — only shown if any publication has an award */}
          {hasAwards && (
            <button
              onClick={() => setActive(AWARDED)}
              className={filterBtn}
              style={
                active === AWARDED
                  ? { color: "var(--orange)", borderColor: "var(--orange)", background: "color-mix(in srgb, var(--orange) 10%, transparent)" }
                  : { color: "var(--muted)", borderColor: "var(--border)" }
              }
            >
              Recognised
            </button>
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
                <li key={pub.id} className="group py-8 first:pt-0">

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
                      {pub.venueShort ?? pub.venue}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-lg font-semibold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--violet)]">
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
          </div>
        ))
      )}
    </>
  );
}
