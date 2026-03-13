interface SectionHeaderProps {
  label: string;
  title: string;
  accent?: "violet" | "orange";
}

export function SectionHeader({ label, title, accent = "violet" }: SectionHeaderProps) {
  const accentClass = accent === "orange" ? "text-[var(--orange)]" : "text-[var(--violet)]";
  return (
    <div className="mb-12">
      <p className={`mb-2 font-mono text-xs uppercase tracking-widest ${accentClass}`}>{label}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)]">{title}</h2>
      <div className={`mt-3 h-px w-16 ${accent === "orange" ? "bg-[var(--orange)]" : "bg-[var(--violet)]"}`} />
    </div>
  );
}
