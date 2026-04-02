export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { SubpageHero } from "@/components/SubpageHero";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { BtnLink } from "@/components/Btn";
import { getApplyPage, getSiteSettings } from "@/lib/sanity/queries";

export const metadata = {
  title: "Apply — CompAcctSys",
};

export default async function ApplyPage() {
  const [data, settings] = await Promise.all([getApplyPage(), getSiteSettings()]);

  if (data?.showApplyPage === false) notFound();

  const positions    = data?.positions            ?? [];
  const expectations = data?.expectations         ?? [];
  const checklist    = data?.applicationChecklist ?? [];
  const contactEmail = data?.applicationEmail ?? settings?.contactEmail ?? "";

  return (
    <>
      <Nav />
      <main>
        <SubpageHero label="Join Us" title="Apply" />

        {/* Positions */}
        <section className="bg-[var(--bg)] py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-10">
            <SectionHeader label="Opportunities" title="Open Positions" accent="main" />

            {data?.intro && (
              <p className="mb-12 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                {data.intro}
              </p>
            )}

            {positions.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
                {positions.map((p) => (
                  <div key={p.role} className="flex flex-col border border-[var(--border)] p-8">
                    {p.type && (
                      <span className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                        {p.type}
                      </span>
                    )}
                    <h3 className="mb-4 text-lg font-semibold text-[var(--text)]">{p.role}</h3>
                    {p.description && (
                      <p className="text-sm leading-relaxed text-[var(--muted)]">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[var(--border)] p-16 text-center">
                <p className="font-mono text-xs text-[var(--muted)]">
                  No positions listed at this time. Check back soon or get in touch.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* What we look for */}
        {expectations.length > 0 && (
          <section className="bg-[var(--bg-alt)] py-24">
            <div className="mx-auto max-w-6xl px-4 md:px-10">
              <SectionHeader label="Culture" title="What We Look For" accent="secondary" />
              <div className="grid gap-8 md:grid-cols-2">
                {expectations.map((e) => (
                  <div key={e.heading} className="flex gap-5">
                    <div className="mt-1 h-2 w-2 shrink-0" style={{ background: "var(--main)" }} />
                    <div>
                      <h4 className="mb-1 font-semibold text-[var(--text)]">{e.heading}</h4>
                      {e.body && (
                        <p className="text-sm leading-relaxed text-[var(--muted)]">{e.body}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to apply */}
        {(data?.howToApply || checklist.length > 0 || contactEmail) && (
          <section className="bg-[var(--bg)] py-24">
            <div className="mx-auto max-w-6xl px-4 md:px-10">
              <SectionHeader label="Process" title="How to Apply" accent="main" />
              <div className="max-w-2xl">
                {data?.howToApply && (
                  <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">
                    {data.howToApply}
                  </p>
                )}
                {checklist.length > 0 && (
                  <ul className="mb-8 space-y-3">
                    {checklist.map((item) => (
                      <li key={item} className="flex gap-4 text-sm leading-relaxed text-[var(--muted)]">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: "var(--main)" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {contactEmail && (
                  <BtnLink href={`mailto:${contactEmail}?subject=Application Enquiry`} external>
                    Get in Touch ↗
                  </BtnLink>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
