import { getResearchThemes } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

interface ResearchThemesProps {
  standalone?: boolean;
}

// Corner dot — appears at each corner on hover
function CornerDot({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "-top-[3px] -left-[3px]",
    tr: "-top-[3px] -right-[3px]",
    bl: "-bottom-[3px] -left-[3px]",
    br: "-bottom-[3px] -right-[3px]",
  }[pos];
  return (
    <span
      className={`absolute ${cls} h-[6px] w-[6px] rounded-full bg-[var(--main)] opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
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

        <div className="grid gap-px border border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {researchThemes.map((theme, i) => (
            <div
              key={theme.id}
              className="group relative overflow-hidden p-8 transition-colors duration-300"
            >
              {/* Corner dots */}
              <CornerDot pos="tl" />
              <CornerDot pos="tr" />
              <CornerDot pos="bl" />
              <CornerDot pos="br" />

              {/* Accent bar — slides in from left on hover */}
              <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-[var(--main)] transition-transform duration-300 group-hover:scale-y-100" />

              {/* Index */}
              <p className="mb-5 font-mono text-[10px] text-[var(--main)] transition-opacity duration-300">
                {String(i + 1).padStart(2, "0")}
              </p>

              <h3 className="mb-3 text-sm font-semibold leading-snug text-[var(--text)] transition-colors duration-300">
                {theme.title}
              </h3>
              <p className="text-xs leading-relaxed text-[var(--muted)] transition-colors duration-300">
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
