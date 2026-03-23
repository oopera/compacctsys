"use client";

import { useState, useEffect, useCallback } from "react";
import { Btn } from "@/components/Btn";

// ─── Syntax highlighter ───────────────────────────────────────────────────────

function highlight(bibtex: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = bibtex.split("\n");

  lines.forEach((line, li) => {
    // Entry type line: @inproceedings{key,
    const entryMatch = line.match(/^(@\w+)\{(\S+),?$/);
    if (entryMatch) {
      nodes.push(
        <span key={li}>
          <span style={{ color: "var(--main)" }}>{entryMatch[1]}</span>
          {"{"}<span style={{ color: "var(--secondary)" }}>{entryMatch[2]}</span>{","}
        </span>
      );
      nodes.push("\n");
      return;
    }

    // Closing brace
    if (line.trim() === "}") {
      nodes.push(<span key={li}>{"}"}</span>);
      nodes.push("\n");
      return;
    }

    // Field line: key = {value},
    const fieldMatch = line.match(/^(\s*)(\w+)(\s*=\s*)\{([\s\S]*?)\}(,?)$/);
    if (fieldMatch) {
      const [, indent, key, eq, val, comma] = fieldMatch;
      nodes.push(
        <span key={li}>
          {indent}
          <span style={{ color: "var(--secondary)" }}>{key}</span>
          <span style={{ color: "var(--muted)" }}>{eq}</span>
          {"{"}<span style={{ color: "var(--text)" }}>{val}</span>{"}"}{comma}
        </span>
      );
      nodes.push("\n");
      return;
    }

    nodes.push(<span key={li}>{line}</span>);
    nodes.push("\n");
  });

  return nodes;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function BibtexModal({ bibtex, onClose }: { bibtex: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [bibtex]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden"
        style={{
          background: "var(--bg-alt)",
          border: "1px solid var(--border)",
          maxHeight: "80vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
            BibTeX
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopy}
              className="font-mono text-[10px] uppercase tracking-widest transition-colors"
              style={{ color: copied ? "var(--main)" : "var(--muted)" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Code block */}
        <pre
          className="overflow-auto p-5 text-xs leading-relaxed"
          style={{
            fontFamily: "var(--font-geist-mono, monospace)",
            color: "var(--text)",
            background: "transparent",
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {highlight(bibtex)}
        </pre>
      </div>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

export function CopyBibtexButton({ bibtex }: { bibtex: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Btn onClick={() => setOpen(true)}>BibTeX</Btn>

      {open && <BibtexModal bibtex={bibtex} onClose={() => setOpen(false)} />}
    </>
  );
}
