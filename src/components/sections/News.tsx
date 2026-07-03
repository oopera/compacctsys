import Image from "next/image";
import { getNews } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";
import { BtnLink } from "@/components/Btn";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";

export async function News() {
  const news = await getNews();

  return (
    <section id="news" className="bg-[var(--bg)] py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <SectionHeader label="News" />

        {news.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] p-16 text-center">
            <p className="font-mono text-xs text-[var(--muted)]">News items coming soon.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {news.map((item) => (
              <li
                key={item.id}
                id={item.slug}
                className="py-5 first:pt-0 md:py-8 scroll-mt-20"
              >
                {item.image && (
                  <div className="relative mb-5 aspect-video w-full max-w-[514px] overflow-hidden bg-[var(--bg-alt)]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 514px) 100vw, 514px"
                    />
                  </div>
                )}
                <div>
                  <p className="mb-1 font-mono text-[10px] text-[var(--muted)]">
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mb-1 text-base font-semibold leading-snug text-[var(--text)]">
                    {item.title}
                  </h3>
                  {item.body && (
                    <div className="text-sm leading-relaxed text-[var(--muted)] prose prose-sm">
                      <PortableTextRenderer value={item.body} />
                    </div>
                  )}
                  {item.externalUrl && (
                    <BtnLink href={item.externalUrl} external className="mt-3 w-fit">
                      Read more ↗
                    </BtnLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
