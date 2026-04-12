import { SceneCanvas } from "@/components/SceneCanvas";
import { getSiteSettings } from "@/lib/sanity/queries";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";

export async function Hero() {
  const settings = await getSiteSettings();
  const description = settings?.description;
  const tagline = settings?.tagline;

  return (
    <section
      id="about"
      className="bg-[var(--bg)]"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-10 py-8 md:py-14 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 md:gap-10 items-stretch">

        {/* Contained canvas graphic — stretches to match text column height */}
        <div
          className="relative w-full overflow-hidden  min-h-64"
          style={{ background: "var(--hero-bg)" }}
        >
          <SceneCanvas variant="nodes" fullyConnected />
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between gap-10 lg:py-2">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Research Group
            </p>
            <h1
              className="font-semibold leading-tight tracking-tight text-[var(--text)]"
              style={{ fontSize: "clamp(1.6rem, 3vw, 3rem)" }}
            >
              {settings?.groupName ?? "Compliant and Accountable Systems"}
            </h1>
            {description ? (
              <div className="text-sm leading-relaxed text-[var(--muted)] max-w-md prose prose-sm">
                <PortableTextRenderer value={description} />
              </div>
            ) : tagline ? (
              <p className="text-sm leading-relaxed text-[var(--muted)] max-w-md">
                {tagline}
              </p>
            ) : null}
          </div>

          {/* Affiliations + email */}
          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-6">
            {settings?.affiliations && settings.affiliations.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {settings.affiliations.map((a) => (
                  <span
                    key={a}
                    className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
            {settings?.contactEmail && (

              <a
                href={`mailto:${settings.contactEmail}`}
                className="truncate font-mono text-[10px] text-[var(--main)] transition-colors hover:underline underline-offset-2"
              >
                {settings.contactEmail}
              </a>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
