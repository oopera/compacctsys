"use client";

import { useState, useEffect, useCallback } from "react";

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
          <span style={{ color: "var(--violet)" }}>{entryMatch[1]}</span>
          {"{"}<span style={{ color: "#f59e0b" }}>{entryMatch[2]}</span>{","}
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
          <span style={{ color: "#34d399" }}>{key}</span>
          <span style={{ color: "var(--muted)" }}>{eq}</span>
          {"{"}<span style={{ color: "#e2e8f0" }}>{val}</span>{"}"}{comma}
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
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "80vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            BibTeX
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopy}
              className="font-mono text-[10px] uppercase tracking-widest transition-colors"
              style={{ color: copied ? "#34d399" : "rgba(255,255,255,0.4)" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-widest text-white/30 transition-colors hover:text-white/70"
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
            color: "#e2e8f0",
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
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] transition-colors hover:text-[var(--text)] cursor-pointer"
      >
        BibTeX
      </button>

      {open && <BibtexModal bibtex={bibtex} onClose={() => setOpen(false)} />}
    </>
  );
}
