import { getResearchThemes } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

export async function ResearchThemes() {
  const researchThemes = await getResearchThemes();
  return (
    <section id="research" className="bg-[var(--bg-alt)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="Focus areas" title="Research Themes" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {researchThemes.map((theme) => (
            <div
              key={theme.id}
              className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--violet)]/40"
            >
              <div className="mb-4 h-px w-8 bg-[var(--violet)] opacity-60 transition-opacity group-hover:opacity-100" />
              <h3 className="mb-2 text-sm font-semibold leading-snug text-[var(--text)]">
                {theme.title}
              </h3>
              <p className="text-xs leading-relaxed text-[var(--muted)]">
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
