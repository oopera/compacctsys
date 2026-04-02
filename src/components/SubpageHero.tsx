import { SceneCanvas, type CanvasVariant } from "@/components/SceneCanvas";

interface SubpageHeroProps {
  label: string;
  title: string;
  scene?: CanvasVariant;
}

export function SubpageHero({ label, title, scene = "grid" }: SubpageHeroProps) {
  return (
    <section
      id="about"
      className="bg-[var(--bg)]"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-14 grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-10 items-start">

        {/* Contained canvas graphic */}
        <div
          className="relative w-full overflow-hidden aspect-video"
          style={{ background: "var(--hero-bg)" }}
        >
          <SceneCanvas variant={scene} />
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-end gap-4 lg:py-2 sm:h-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
            {label}
          </p>
          <h1
            className="font-semibold leading-tight tracking-tight text-[var(--text)]"
            style={{ fontSize: "clamp(1.6rem, 3vw, 3rem)" }}
          >
            {title}
          </h1>
        </div>

      </div>
    </section>
  );
}
