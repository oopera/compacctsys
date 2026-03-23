import { getResearchThemes } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

interface ResearchThemesProps {
  standalone?: boolean;
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

        <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {researchThemes.map((theme, i) => (
            <li
              key={theme.id}
              className="flex gap-8 py-5"
            >
              <span className="w-6 shrink-0 font-mono text-[10px] text-[var(--main)] pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-12">
                <h3 className="w-72 shrink-0 text-sm font-semibold leading-snug text-[var(--text)]">
                  {theme.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--muted)]">
                  {theme.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
