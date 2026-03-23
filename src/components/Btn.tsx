import Link from "next/link";

const cls =
  "border border-[var(--border)] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[var(--text)] transition-colors hover:bg-[var(--text)] hover:text-[var(--bg)]";

export function BtnLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-block ${cls} ${className ?? ""}`}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`inline-block ${cls} ${className ?? ""}`}>
      {children}
    </Link>
  );
}

const toggleBase =
  "border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-150 cursor-pointer";

export function BtnToggle({
  active,
  accent = "var(--violet)",
  onClick,
  children,
}: {
  active: boolean;
  accent?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={toggleBase}
      style={
        active
          ? { color: accent, borderColor: accent, background: `color-mix(in srgb, ${accent} 10%, transparent)` }
          : { color: "var(--muted)", borderColor: "var(--border)" }
      }
    >
      {children}
    </button>
  );
}

export function Btn({
  onClick,
  children,
  className,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button onClick={onClick} className={`cursor-pointer ${cls} ${className ?? ""}`}>
      {children}
    </button>
  );
}
