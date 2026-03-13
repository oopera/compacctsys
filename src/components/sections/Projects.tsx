import { projects } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";

export function Projects() {
  return (
    <section id="projects" className="border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="Funded work" title="Projects" />
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--violet)]/40"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-snug text-[var(--text)]">
                  {project.shortTitle ? (
                    <>
                      <span className="text-[var(--violet)]">{project.shortTitle}</span>
                      {" — "}
                      {project.title}
                    </>
                  ) : (
                    project.title
                  )}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                    project.status === "active"
                      ? "bg-[var(--violet)]/10 text-[var(--violet)]"
                      : "bg-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-[var(--muted)]">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.funders.map((funder) => (
                  <span
                    key={funder}
                    className="rounded-full border border-[var(--orange)]/30 px-2 py-0.5 font-mono text-[10px] text-[var(--orange)]"
                  >
                    {funder}
                  </span>
                ))}
                {project.collaborators.map((collab) => (
                  <span
                    key={collab}
                    className="rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)]"
                  >
                    {collab}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
