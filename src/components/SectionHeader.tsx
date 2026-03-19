interface SectionHeaderProps {
  label: string;
  title: string;
  accent?: "violet" | "orange";
  light?: boolean;
}

export function SectionHeader({ label, title, accent = "violet", light = false }: SectionHeaderProps) {
  const accentColor = accent === "orange" ? "var(--orange)" : "var(--violet)";
  const labelColor = light ? "rgba(255,255,255,0.4)" : "var(--muted)";
  const titleColor = light ? "#ffffff" : "var(--text)";
  const borderColor = light ? "rgba(255,255,255,0.12)" : "var(--border)";

  return (
    <div className="mb-16">
      {/* Ruled label row */}
      <div className="flex items-center gap-4 mb-6" style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "1rem" }}>
        <p
          className="shrink-0 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: labelColor }}
        >
          {label}
        </p>
        <div className="flex-1 h-px" style={{ background: borderColor }} />
      </div>

      {/* Title */}
      <h2
        className="text-5xl font-black leading-[1.0] tracking-tighter md:text-6xl"
        style={{ color: titleColor }}
      >
        {title}
      </h2>
    </div>
  );
}
