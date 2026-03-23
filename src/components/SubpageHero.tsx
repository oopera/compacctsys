import { HeroCanvas } from "@/components/HeroCanvas";

interface SubpageHeroProps {
  label: string;
  title: string;
}

export function SubpageHero({ label, title }: SubpageHeroProps) {
  return (
    <section
      className="relative flex min-h-[30vh] flex-col overflow-hidden"
      style={{ background: "var(--hero-bg)" }}
    >
      <HeroCanvas />
      <div className="relative z-10 flex flex-1 flex-col justify-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-20 md:px-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--hero-muted)" }}>
            {label}
          </p>
          <h1
            className="font-semibold leading-tight tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", color: "var(--hero-fg)" }}
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
