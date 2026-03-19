import { getResearchThemes } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

export async function ResearchThemes() {
  const researchThemes = await getResearchThemes();
  return (
    <section id="research" className="bg-[var(--bg-alt)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="Focus areas" title="Research Themes" />
        <div className="grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {researchThemes.map((theme) => (
            <div
              key={theme.id}
              className="group relative bg-[var(--surface)] p-8 transition-colors hover:bg-[var(--bg)]"
            >
              {/* Left accent bar on hover */}
              <div
                className="absolute left-0 top-8 bottom-8 w-[2px] opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: "var(--violet)" }}
              />
              <h3 className="mb-3 text-base font-semibold leading-snug text-[var(--text)]">
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
