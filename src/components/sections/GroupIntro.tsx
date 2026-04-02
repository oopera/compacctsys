import { getSiteSettings } from "@/lib/sanity/queries";

export async function GroupIntro() {
  const settings = await getSiteSettings();

  const text = settings?.description ?? settings?.tagline;
  if (!text) return null;

  return (
    <section className="bg-[var(--bg)] py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <p className="max-w-3xl text-base leading-relaxed text-[var(--text)] md:text-lg">
          {text}
        </p>
      </div>
    </section>
  );
}
