import Image from "next/image";
import { team } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamRole } from "@/types";

const roleLabel: Record<TeamRole, string> = {
  pi:        "Principal Investigator",
  postdoc:   "PostDoc",
  phd:       "PhD Candidate",
  associate: "Associate Researcher",
  admin:     "Administrative",
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
    <section id="team" className="bg-[var(--bg)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="The group" title="Team" accent="orange" />
        <div className="space-y-14">
          {grouped.map(({ role, members }) => (
            <div key={role}>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                {roleLabel[role]}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--orange)]/40"
                  >
                    <div className="relative w-28 shrink-0 bg-[var(--bg-alt)]">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover object-center"
                          sizes="112px"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center font-mono text-lg font-semibold text-white/60"
                          style={{ background: "var(--hero-mid)" }}
                        >
                          {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--text)]">
                        {member.title ? `${member.title} ` : ""}
                        {member.name}
                      </p>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="mt-0.5 block truncate font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--violet)]"
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
