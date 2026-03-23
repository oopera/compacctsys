import React, { useState, useCallback, useEffect, useRef } from "react";
import { definePlugin } from "sanity";
import { useClient } from "sanity";
import { entries as parseBibtex } from "bibtex-parse";
import { DatabaseIcon } from "@sanity/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawEntry {
  key: string;
  type: string;
  [field: string]: string | number | null | undefined;
}

interface ParsedPublication {
  raw: RawEntry;
  title: string;
  authors: string[];
  venue: string;
  venueShort?: string;
  year: number;
  doi?: string;
  url?: string;
  abstract?: string;
  pubType: string;
  bibtex: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapType(bibtexType: string): string {
  const t = bibtexType.toLowerCase();
  if (["inproceedings", "proceedings", "conference"].includes(t)) return "conference";
  if (["article"].includes(t)) return "journal";
  if (["workshop"].includes(t)) return "workshop";
  if (["misc", "techreport", "unpublished", "preprint"].includes(t)) return "arxiv";
  if (["inbook", "incollection", "book"].includes(t)) return "book-chapter";
  return "other";
}

function parseAuthors(authorStr: string): string[] {
  if (!authorStr) return [];
  return authorStr
    .split(/\s+and\s+/i)
    .map((a) => {
      const trimmed = a.trim();
      // "Last, First" → "First Last"
      if (trimmed.includes(",")) {
        const [last, ...firstParts] = trimmed.split(",").map((s) => s.trim());
        return [...firstParts, last].join(" ");
      }
      return trimmed;
    })
    .filter(Boolean);
}

function reconstructBibtex(entry: RawEntry): string {
  const skip = new Set(["key", "type"]);
  const fields = Object.entries(entry)
    .filter(([k, v]) => !skip.has(k) && v != null)
    .map(([k, v]) => `  ${k.toLowerCase()} = {${v}}`)
    .join(",\n");
  return `@${entry.type}{${entry.key},\n${fields}\n}`;
}

function toPublication(raw: RawEntry): ParsedPublication {
  const str = (key: string): string =>
    (raw[key.toUpperCase()] as string | undefined) ?? "";

  const venue = str("BOOKTITLE") || str("JOURNAL") || str("PUBLISHER") || "";
  const venueShort = str("SERIES") || undefined;
  const yearRaw = raw["YEAR"] ?? raw["year"];
  const year = typeof yearRaw === "number" ? yearRaw : parseInt(String(yearRaw ?? "0"), 10);

  return {
    raw,
    title: str("TITLE"),
    authors: parseAuthors(str("AUTHOR")),
    venue,
    venueShort,
    year: isNaN(year) ? 0 : year,
    doi: str("DOI") || undefined,
    url: str("URL") || undefined,
    abstract: str("ABSTRACT") || undefined,
    pubType: mapType(raw.type),
    bibtex: reconstructBibtex(raw),
  };
}

// ─── Team member helpers ───────────────────────────────────────────────────────

interface TeamMember {
  _id: string;
  name: string;
}

/** Normalise a name for fuzzy matching: lowercase, collapse spaces */
function normaliseName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

function findTeamMember(authorName: string, teamMembers: TeamMember[]): TeamMember | undefined {
  const needle = normaliseName(authorName);
  return teamMembers.find((tm) => normaliseName(tm.name) === needle);
}

// ─── Legend ───────────────────────────────────────────────────────────────────

const FIELD_MAP: { bibtex: string; sanity: string; notes?: string }[] = [
  { bibtex: "title",                  sanity: "title" },
  { bibtex: "author",                 sanity: "authors",     notes: "Split by \"and\". \"Last, First\" is reordered to \"First Last\". Names matched against team members." },
  { bibtex: "booktitle / journal / publisher", sanity: "venue", notes: "First non-empty value used, in that order." },
  { bibtex: "series",                 sanity: "venueShort",  notes: "Short venue abbreviation, e.g. CHI, CSCW." },
  { bibtex: "year",                   sanity: "year" },
  { bibtex: "doi",                    sanity: "doi" },
  { bibtex: "url",                    sanity: "url" },
  { bibtex: "abstract",               sanity: "abstract" },
  { bibtex: "entry type",             sanity: "type",        notes: "inproceedings/proceedings/conference → conference · article → journal · misc/techreport/unpublished/preprint → arxiv · inbook/incollection/book → book-chapter · everything else → other" },
  { bibtex: "(entire entry)",         sanity: "bibtex",      notes: "Reconstructed and stored verbatim for copy-to-clipboard." },
];

function Legend() {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details
      ref={detailsRef}
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      style={{ marginBottom: "1rem", border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}
    >
      <summary style={{
        padding: "0.6rem 0.9rem",
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: "pointer",
        background: "#f9fafb",
        listStyle: "none",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        userSelect: "none",
      }}>
        <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>{open ? "▾" : "▸"}</span>
        Field mapping legend
      </summary>

      <div style={{ padding: "0.75rem 0.9rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "0.3rem 0.5rem", color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>BibTeX field</th>
              <th style={{ textAlign: "left", padding: "0.3rem 0.5rem", color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>Sanity field</th>
              <th style={{ textAlign: "left", padding: "0.3rem 0.5rem", color: "#6b7280", fontWeight: 600 }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {FIELD_MAP.map((row) => (
              <tr key={row.bibtex} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "0.35rem 0.5rem", fontFamily: "monospace", color: "#1d4ed8", whiteSpace: "nowrap" }}>{row.bibtex}</td>
                <td style={{ padding: "0.35rem 0.5rem", fontFamily: "monospace", color: "#059669", whiteSpace: "nowrap" }}>{row.sanity}</td>
                <td style={{ padding: "0.35rem 0.5rem", color: "#6b7280" }}>{row.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: "0.6rem", fontSize: "0.73rem", color: "#9ca3af" }}>
          Fields not listed above (e.g. <code>award</code>, <code>venueShort</code> override, <code>researchThemes</code>) must be set manually after import.
        </p>
      </div>
    </details>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

function BibtexImporterTool() {
  const client = useClient({ apiVersion: "2024-01-01" });

  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedPublication[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [parseError, setParseError] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, "idle" | "importing" | "done" | "error">>({});
  const [importing, setImporting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    client
      .fetch<TeamMember[]>(`*[_type == "teamMember"]{ _id, name }`)
      .then(setTeamMembers)
      .catch(() => {/* non-fatal */});
  }, [client]);

  const handleParse = useCallback(() => {
    setParseError(null);
    setParsed([]);
    setSelected(new Set());
    setStatus({});
    try {
      const entries: RawEntry[] = parseBibtex(raw) as RawEntry[];
      if (entries.length === 0) {
        setParseError("No BibTeX entries found. Check your input.");
        return;
      }
      const pubs = entries.map(toPublication);
      setParsed(pubs);
      setSelected(new Set(pubs.map((p) => p.raw.key)));
    } catch (e) {
      setParseError(`Parse error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [raw]);

  const toggleAll = () => {
    if (selected.size === parsed.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(parsed.map((p) => p.raw.key)));
    }
  };

  const toggleOne = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleImport = async () => {
    setImporting(true);
    const toImport = parsed.filter((p) => selected.has(p.raw.key));

    for (const pub of toImport) {
      setStatus((s) => ({ ...s, [pub.raw.key]: "importing" }));
      try {
        const authors = pub.authors.map((name, i) => {
          const match = findTeamMember(name, teamMembers);
          return {
            _type: "author",
            _key: `author-${i}`,
            name,
            ...(match ? { teamMember: { _type: "reference", _ref: match._id } } : {}),
          };
        });

        await client.create({
          _type: "publication",
          title: pub.title,
          authors,
          venue: pub.venue,
          ...(pub.venueShort ? { venueShort: pub.venueShort } : {}),
          year: pub.year,
          type: pub.pubType,
          ...(pub.doi ? { doi: pub.doi } : {}),
          ...(pub.url ? { url: pub.url } : {}),
          ...(pub.abstract ? { abstract: pub.abstract } : {}),
          bibtex: pub.bibtex,
        });
        setStatus((s) => ({ ...s, [pub.raw.key]: "done" }));
      } catch (e) {
        console.error("Import failed for", pub.raw.key, e);
        setStatus((s) => ({ ...s, [pub.raw.key]: "error" }));
      }
    }
    setImporting(false);
  };

  const doneCount = Object.values(status).filter((s) => s === "done").length;
  const errorCount = Object.values(status).filter((s) => s === "error").length;
  const allDone = doneCount + errorCount > 0 && doneCount + errorCount === Object.keys(status).length;

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>BibTeX Importer</h1>
      <p style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.875rem" }}>
        Paste BibTeX entries below, preview them, then import into Sanity.
      </p>

      <Legend />

      {/* Input area */}
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={"@inproceedings{smith2024example,\n  title     = {An Example Title},\n  author    = {Smith, Alice and Jones, Bob},\n  booktitle = {Proceedings of the Conference},\n  year      = {2024},\n  doi       = {10.1145/1234567.890}\n}"}
        rows={12}
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "monospace",
          fontSize: "0.8rem",
          padding: "0.75rem",
          border: "1px solid #d1d5db",
          borderRadius: 6,
          background: "#f9fafb",
          resize: "vertical",
          marginBottom: "0.75rem",
        }}
      />

      <button
        onClick={handleParse}
        disabled={!raw.trim()}
        style={{
          background: "#1d4ed8",
          color: "white",
          border: "none",
          borderRadius: 6,
          padding: "0.5rem 1.25rem",
          fontWeight: 600,
          cursor: raw.trim() ? "pointer" : "not-allowed",
          opacity: raw.trim() ? 1 : 0.5,
          fontSize: "0.875rem",
        }}
      >
        Parse BibTeX
      </button>

      {/* Error */}
      {parseError && (
        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, color: "#b91c1c", fontSize: "0.875rem" }}>
          {parseError}
        </div>
      )}

      {/* Results */}
      {parsed.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 style={{ fontWeight: 600, fontSize: "1rem", margin: 0 }}>
                {parsed.length} {parsed.length === 1 ? "entry" : "entries"} found
              </h2>
              <button
                onClick={toggleAll}
                style={{ fontSize: "0.75rem", color: "#6b7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                {selected.size === parsed.length ? "Deselect all" : "Select all"}
              </button>
            </div>
            <button
              onClick={handleImport}
              disabled={selected.size === 0 || importing}
              style={{
                background: "#059669",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 1.25rem",
                fontWeight: 600,
                cursor: selected.size > 0 && !importing ? "pointer" : "not-allowed",
                opacity: selected.size > 0 && !importing ? 1 : 0.5,
                fontSize: "0.875rem",
              }}
            >
              {importing ? "Importing…" : `Import ${selected.size} selected`}
            </button>
          </div>

          {allDone && (
            <div style={{ marginBottom: "0.75rem", padding: "0.75rem", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 6, fontSize: "0.875rem", color: "#166534" }}>
              ✓ Imported {doneCount} publication{doneCount !== 1 ? "s" : ""} successfully.
              {errorCount > 0 && ` ${errorCount} failed — check the console for details.`}
            </div>
          )}

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {parsed.map((pub) => {
              const st = status[pub.raw.key] ?? "idle";
              const isSelected = selected.has(pub.raw.key);

              const borderColor =
                st === "done" ? "#86efac" :
                st === "error" ? "#fca5a5" :
                isSelected ? "#93c5fd" : "#e5e7eb";

              const bgColor =
                st === "done" ? "#f0fdf4" :
                st === "error" ? "#fef2f2" :
                isSelected ? "#eff6ff" : "#f9fafb";

              const badge =
                st === "done" ? "✓ Imported" :
                st === "importing" ? "⟳ Importing…" :
                st === "error" ? "✗ Error" : null;

              return (
                <li
                  key={pub.raw.key}
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: 8,
                    background: bgColor,
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onClick={() => toggleOne(pub.raw.key)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(pub.raw.key)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginTop: 2, flexShrink: 0, cursor: "pointer", width: 16, height: 16 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{pub.title || "(no title)"}</span>
                        {badge && (
                          <span style={{
                            fontSize: "0.7rem", fontWeight: 600,
                            color: st === "done" ? "#166534" : st === "error" ? "#b91c1c" : "#1d4ed8",
                            background: st === "done" ? "#dcfce7" : st === "error" ? "#fef2f2" : "#dbeafe",
                            borderRadius: 4, padding: "0.1rem 0.4rem",
                          }}>
                            {badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.2rem", display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                        {pub.authors.map((name, i) => {
                          const matched = findTeamMember(name, teamMembers);
                          return (
                            <React.Fragment key={i}>
                              {i > 0 && <span>,</span>}
                              <span
                                title={matched ? `Linked to team member` : undefined}
                                style={matched ? {
                                  color: "#5b21b6",
                                  fontWeight: 600,
                                  background: "#ede9fe",
                                  borderRadius: 3,
                                  padding: "0 0.25rem",
                                } : undefined}
                              >
                                {name}{matched ? " ✦" : ""}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.15rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        <span>{pub.venue || "—"}</span>
                        {pub.venueShort && (
                          <span style={{ fontFamily: "monospace", background: "#e5e7eb", borderRadius: 3, padding: "0 0.25rem" }}>
                            {pub.venueShort}
                          </span>
                        )}
                        <span>·</span>
                        <span>{pub.year || "—"}</span>
                        <span>·</span>
                        <span style={{ fontFamily: "monospace", background: "#e5e7eb", borderRadius: 3, padding: "0 0.25rem" }}>{pub.pubType}</span>
                        {pub.doi && <><span>·</span><span>DOI: {pub.doi}</span></>}
                        <span style={{ fontFamily: "monospace", color: "#9ca3af" }}>{pub.raw.key}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const bibtexImporterPlugin = definePlugin({
  name: "bibtex-importer",
  tools: [
    {
      name: "bibtex-importer",
      title: "BibTeX Import",
      icon: DatabaseIcon,
      component: BibtexImporterTool,
    },
  ],
});
