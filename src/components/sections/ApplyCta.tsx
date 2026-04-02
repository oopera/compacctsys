import Link from "next/link";

export function ApplyCta() {
  return (
    <section
      className="py-24 text-center"
      style={{ background: "var(--hero-bg)" }}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-widest mb-4"
        style={{ color: "var(--hero-muted)" }}
      >
        We&apos;re hiring
      </p>
      <h2
        className="text-3xl font-semibold tracking-tight mb-8"
        style={{ color: "var(--hero-fg)" }}
      >
        Join the research team
      </h2>
      <Link
        href="/apply"
        className="inline-flex items-center gap-2 border px-6 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors"
        style={{
          borderColor: "var(--hero-muted)",
          color: "var(--hero-fg)",
        }}
      >
        See open roles ↗
      </Link>
    </section>
  );
}
