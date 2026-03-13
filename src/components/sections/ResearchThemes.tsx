import { researchThemes } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";

export function ResearchThemes() {
  return (
    <section id="research" className="border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="Focus areas" title="Research Themes" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {researchThemes.map((theme) => (
            <div
              key={theme.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--violet)]/40"
            >
              <div className="mb-3 h-px w-8 bg-[var(--violet)]" />
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
