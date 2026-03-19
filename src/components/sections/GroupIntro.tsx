import { getSiteSettings } from "@/lib/sanity/queries";

export async function GroupIntro() {
  const settings = await getSiteSettings();

  const text = settings?.description ?? settings?.tagline;
  if (!text) return null;

  return (
    <section className="bg-[var(--bg)] py-16">
      <div className="mx-auto max-w-5xl px-6">
        <p className="max-w-3xl text-xl leading-relaxed text-[var(--text)] md:text-2xl">
          {text}
        </p>
      </div>
    </section>
  );
}
