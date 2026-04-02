import { getProjects } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

interface ProjectsProps {
  standalone?: boolean;
}

export async function Projects({ standalone }: ProjectsProps) {
  const projects = await getProjects();

  return (
    <section id="projects" className="bg-[var(--bg)] pt-8 md:pt-14">
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        {!standalone && <SectionHeader label="Funded work" title="Projects" />}

        {projects.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] p-16 text-center">
            <p className="font-mono text-xs text-[var(--muted)]">No projects yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {projects.map((project) => (
              <li key={project.id} className="group py-4 md:py-7 first:pt-0">

                {/* Status + shortTitle */}
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                    style={
                      project.status === "active"
                        ? {
                          color: "var(--main)",
                          borderColor: "color-mix(in srgb, var(--main) 30%, transparent)",
                          background: "color-mix(in srgb, var(--main) 6%, transparent)",
                        }
                        : {
                          color: "var(--muted)",
                          borderColor: "color-mix(in srgb, var(--muted) 30%, transparent)",
                          background: "transparent",
                        }
                    }
                  >
                    {project.status}
                  </span>

                  {project.shortTitle && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                      {project.shortTitle}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-lg font-semibold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--main)]">
                  {project.title}
                </h3>

                {/* Description */}
                {project.description && (
                  <p className="mb-4 text-sm leading-relaxed text-[var(--muted)]">
                    {project.description}
                  </p>
                )}

                {/* Funders + collaborators */}
                <div className="flex flex-wrap gap-2">
                  {project.funders.map((funder) => (
                    <span
                      key={funder}
                      className="border px-2 py-0.5 font-mono text-[10px]"
                      style={{
                        borderColor: "color-mix(in srgb, var(--secondary) 35%, transparent)",
                        color: "var(--secondary)",
                      }}
                    >
                      {funder}
                    </span>
                  ))}
                  {project.collaborators.map((collab) => (
                    <span
                      key={collab}
                      className="border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)]"
                    >
                      {collab}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
