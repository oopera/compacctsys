import Image from "next/image";
import { getTeam, getPastTeam } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamRole, TeamMember, TeamMemberLinkProvider } from "@/types";

const roleLabel: Record<TeamRole, string> = {
  pi: "Principal Investigator",
  postdoc: "PostDoc",
  phd: "PhD Candidate",
  "research-assistant": "Research Assistant",
  "research-intern": "Research Intern",
  associate: "Associate Researcher",
  admin: "Administrative",
};

const roleOrder: TeamRole[] = ["pi", "postdoc", "associate", "phd", "research-assistant", "research-intern", "admin"];

// ─── Icons ────────────────────────────────────────────────────────────────────

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function OrcidIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.881-1.303 3.881-3.731 0-2.009-1.322-3.713-3.881-3.713h-2.297z" />
    </svg>
  );
}

function ScholarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 12.571 14.978 12 12 12c-2.978 0-5.548.571-6.758 1.769z" />
      <path d="M12 14c-5.523 0-10 2.239-10 5v1h20v-1c0-2.761-4.477-5-10-5z" />
      <path d="M19 14.5V19h1.5v-5.5L12 8l-8.5 5.5V19H5v-4.5l7-4.5z" opacity=".4" />
    </svg>
  );
}

// ─── Links ────────────────────────────────────────────────────────────────────

const providerMeta: Record<TeamMemberLinkProvider, { label: string; icon: React.JSX.Element }> = {
  website: { label: "Personal Website", icon: <GlobeIcon /> },
  linkedin: { label: "LinkedIn", icon: <LinkedInIcon /> },
  orcid: { label: "ORCID", icon: <OrcidIcon /> },
  scholar: { label: "Google Scholar", icon: <ScholarIcon /> },
};

function MemberLinks({ member }: { member: TeamMember }) {
  if (!member.links?.length) return null;
  return (
    <div className="flex items-center gap-3">
      {member.links.map(({ provider, url }) => {
        const meta = providerMeta[provider] ?? { label: provider, icon: <GlobeIcon /> };
        return (
          <a
            key={provider}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={meta.label}
            title={meta.label}
            className="text-[var(--muted)] transition-colors hover:text-[var(--main)]"
          >
            {meta.icon}
          </a>
        );
      })}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface TeamProps {
  standalone?: boolean;
}

export async function Team({ standalone }: TeamProps) {
  const [team, pastTeam] = await Promise.all([
    getTeam(),
    standalone ? getPastTeam() : Promise.resolve([]),
  ]);

  const sorted = [...team].sort((a, b) => a.order - b.order);

  // Flatten into ordered list with role attached
  const members = roleOrder.flatMap((role) =>
    sorted.filter((m) => m.role === role)
  );

  const pastSorted = roleOrder.flatMap((role) =>
    pastTeam.filter((m) => m.role === role)
  );

  return (
    <section id="team" className="bg-[var(--bg)] pt-14">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {!standalone && <SectionHeader label="The group" title="Team" accent="secondary" />}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <div key={member.id} className="group flex flex-col">

              {/* Square photo */}
              <div className="relative aspect-square w-full overflow-hidden bg-[var(--bg-alt)]">
                {member.photo ? (
                  <>
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </>
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center font-mono text-2xl font-semibold text-white/40"
                    style={{ background: "var(--hero-mid)" }}
                  >
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mt-3 flex flex-1 flex-col">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  {roleLabel[member.role]}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-[var(--text)]">
                  {member.title ? `${member.title} ` : ""}{member.name}
                </p>

                {member.bio && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
                    {member.bio}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-2">
                  {member.email ? (
                    <a
                      href={`mailto:${member.email}`}
                      className="truncate font-mono text-[10px] text-[var(--muted)] transition-colors hover:text-[var(--main)]"
                    >
                      {member.email}
                    </a>
                  ) : <span />}
                  <MemberLinks member={member} />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Past members — standalone page only */}
      {standalone && pastSorted.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 md:px-10 mt-14">
          <div className="mb-4 flex items-center gap-14">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Past Members
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <ul className="divide-y divide-[var(--border)]">
            {pastSorted.map((member) => (
              <li key={member.id} className="flex items-center justify-between gap-4 py-7">
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-medium text-[var(--text)]">
                    {member.title ? `${member.title} ` : ""}{member.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                    {roleLabel[member.role]}
                  </span>
                </div>
                <MemberLinks member={member} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
