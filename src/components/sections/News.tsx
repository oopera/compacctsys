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
              <li key={item.id} className="flex gap-4 md:gap-6 py-5 md:py-8 first:pt-0">
                {item.image && (
                  <div className="relative h-24 w-36 shrink-0 overflow-hidden bg-[var(--bg-alt)]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
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
