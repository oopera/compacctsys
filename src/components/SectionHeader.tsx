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

  return (
    <div className="mb-12">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: labelColor }}>
        {label}
      </p>
      <h2
        className="font-serif text-4xl italic leading-tight tracking-tight md:text-5xl"
        style={{ color: titleColor }}
      >
        {title}
      </h2>
      <div className="mt-4 h-px w-12" style={{ background: accentColor }} />
    </div>
  );
}
