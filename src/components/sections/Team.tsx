import Image from "next/image";
import { getTeam } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamRole, TeamMember } from "@/types";

const roleLabel: Record<TeamRole, string> = {
  pi:        "Principal Investigator",
  postdoc:   "PostDoc",
  phd:       "PhD Candidate",
  associate: "Associate Researcher",
  admin:     "Administrative",
};

const roleOrder: TeamRole[] = ["pi", "postdoc", "associate", "phd", "admin"];

// ─── Icons ────────────────────────────────────────────────────────────────────

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function OrcidIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.881-1.303 3.881-3.731 0-2.009-1.322-3.713-3.881-3.713h-2.297z"/>
    </svg>
  );
}

function ScholarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 12.571 14.978 12 12 12c-2.978 0-5.548.571-6.758 1.769z"/>
      <path d="M12 14c-5.523 0-10 2.239-10 5v1h20v-1c0-2.761-4.477-5-10-5z"/>
      <path d="M19 14.5V19h1.5v-5.5L12 8l-8.5 5.5V19H5v-4.5l7-4.5z" opacity=".4"/>
    </svg>
  );
}

// ─── Link row ─────────────────────────────────────────────────────────────────

interface LinkDef {
  href: string | undefined;
  label: string;
  icon: React.JSX.Element;
}

function MemberLinks({ member }: { member: TeamMember }) {
  const links: LinkDef[] = [
    { href: member.website,  label: "Website",        icon: <GlobeIcon /> },
    { href: member.linkedin, label: "LinkedIn",       icon: <LinkedInIcon /> },
    { href: member.orcid,    label: "ORCID",          icon: <OrcidIcon /> },
    { href: member.scholar,  label: "Google Scholar", icon: <ScholarIcon /> },
  ].filter((l): l is LinkDef & { href: string } => Boolean(l.href));

  if (links.length === 0) return null;

  return (
    <div className="mt-2 flex items-center gap-2.5">
      {links.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="text-[var(--muted)] transition-colors hover:text-[var(--violet)]"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export async function Team() {
  const team = await getTeam();
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
                    {/* Photo */}
                    <div className="relative w-28 shrink-0 self-stretch bg-[var(--bg-alt)]">
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

                    {/* Text */}
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
                      <MemberLinks member={member} />
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
