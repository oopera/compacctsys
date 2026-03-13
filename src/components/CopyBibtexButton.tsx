"use client";

import { useState } from "react";

export function CopyBibtexButton({ bibtex }: { bibtex: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-[10px] uppercase tracking-wider transition-colors"
      style={{ color: copied ? "var(--violet)" : "var(--muted)" }}
    >
      {copied ? "Copied!" : "BibTeX"}
    </button>
  );
}
