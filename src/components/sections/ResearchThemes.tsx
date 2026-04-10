import { getResearchThemes } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

interface ResearchThemesProps {
  standalone?: boolean;
}

export async function ResearchThemes({ standalone }: ResearchThemesProps) {
  const researchThemes = await getResearchThemes();
  return (
    <section id="research" className="bg-[var(--bg)] pt-8 md:pt-14">
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        {/* <SectionHeader label="Focus areas" /> */}

        <ul className="divide-y divide-[var(--border)] list-disc">
          {researchThemes.map((theme, i) => (
            <li
              key={theme.id}
              className="flex gap-2 md:gap-4 py-4 md:py-5"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-12 w-full">
                <div className="flex items-center sm:gap-1">
                  <span className="shrink-0 text-[var(--main)] text-2xl mr-2">
                    &bull;
                  </span>
                  <h3 className="sm:w-72 shrink-0 text-sm leading-snug text-[var(--text)]">
                    {theme.title}
                  </h3>
                </div>
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
