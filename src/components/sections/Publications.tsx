import { getPublications } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";
import { PublicationsClient } from "./PublicationsClient";

interface PublicationsProps {
  standalone?: boolean;
}

export async function Publications({ standalone }: PublicationsProps) {
  const publications = await getPublications();

  return (
    <section id="publications" className="bg-[var(--bg)] py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {!standalone && <SectionHeader label="Output" title="Publications" accent="orange" />}

        {publications.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] p-16 text-center">
            <p className="font-mono text-xs text-[var(--muted)]">
              Publications will be imported from BibTeX.
            </p>
          </div>
        ) : (
          <PublicationsClient publications={publications} />
        )}
      </div>
    </section>
  );
}
