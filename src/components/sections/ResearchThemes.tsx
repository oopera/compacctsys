import { getResearchThemes } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

interface ResearchThemesProps {
  standalone?: boolean;
}

// Corner dot — appears at each corner on hover, like grid intersection points
function CornerDot({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "-top-[3px] -left-[3px]",
    tr: "-top-[3px] -right-[3px]",
    bl: "-bottom-[3px] -left-[3px]",
    br: "-bottom-[3px] -right-[3px]",
  }[pos];
  return (
    <span
      className={`absolute ${cls} h-[6px] w-[6px] rounded-full bg-[var(--violet)] opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
    />
  );
}

export async function ResearchThemes({ standalone }: ResearchThemesProps) {
  const researchThemes = await getResearchThemes();
  return (
    <section id="research" className="bg-[var(--bg)] py-12">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {!standalone && <SectionHeader label="Focus areas" title="Research Themes" />}
        {standalone && (
          <div className="mb-6 flex items-center gap-4 border-t border-[var(--border)] pt-4">
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Focus areas</p>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
        )}
        <div className="grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {researchThemes.map((theme) => (
            <div
              key={theme.id}
              className="group relative bg-[var(--surface)] p-8 transition-colors duration-200 hover:bg-black"
            >
              {/* Corner dots */}
              <CornerDot pos="tl" />
              <CornerDot pos="tr" />
              <CornerDot pos="bl" />
              <CornerDot pos="br" />

              <h3 className="mb-3 text-base font-semibold leading-snug text-[var(--text)] transition-colors duration-200 group-hover:text-white">
                {theme.title}
              </h3>
              <p className="text-xs leading-relaxed text-[var(--muted)] transition-colors duration-200 group-hover:text-white/50">
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
