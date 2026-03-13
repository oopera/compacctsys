import { team } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamRole } from "@/types";

const roleLabel: Record<TeamRole, string> = {
  pi:        "Principal Investigator",
  postdoc:   "PostDoc",
  phd:       "PhD Candidate",
  associate: "Associate Researcher",
  admin:     "Office Manager",
};

const roleOrder: TeamRole[] = ["pi", "postdoc", "associate", "phd", "admin"];

export function Team() {
  const sorted = [...team]
    .filter((m) => m.current)
    .sort((a, b) => a.order - b.order);

  const grouped = roleOrder
    .map((role) => ({ role, members: sorted.filter((m) => m.role === role) }))
    .filter((g) => g.members.length > 0);

  return (
    <section id="team" className="border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="The group" title="Team" accent="orange" />
        <div className="space-y-12">
          {grouped.map(({ role, members }) => (
            <div key={role}>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                {roleLabel[role]}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-start gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--orange)]/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--border)] font-mono text-sm font-semibold text-[var(--violet)]">
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text)]">
                        {member.title ? `${member.title} ` : ""}{member.name}
                      </p>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="mt-0.5 block truncate font-mono text-xs text-[var(--muted)] transition-colors hover:text-[var(--violet)]"
                        >
                          {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
