interface SectionHeaderProps {
  label: string;
  title?: string;
  accent?: "main" | "secondary";
  light?: boolean;
}

export function SectionHeader({ label, title, accent = "main", light = false }: SectionHeaderProps) {
  const accentColor = accent === "secondary" ? "var(--secondary)" : "var(--main)";
  const labelColor = light ? "rgba(255,255,255,0.4)" : "var(--muted)";
  const titleColor = light ? "#ffffff" : "var(--text)";
  const borderColor = light ? "rgba(255,255,255,0.12)" : "var(--border)";

  return (
    <div className="mb-16">
      {/* Ruled label row */}
      <div className="flex items-center gap-4 mb-6"
        style={{
          // borderTop: `1px solid ${borderColor}`, 
          paddingTop: "1rem"
        }}>
        <p
          className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--muted)]"
          style={{ color: labelColor }}
        >
          {label}
        </p>
        <div className="flex-1 h-px" style={{ background: borderColor }} />
      </div>

      {/* Title */}
      <h2
        className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
        style={{ color: titleColor }}
      >
        {title}
      </h2>
    </div>
  );
}
