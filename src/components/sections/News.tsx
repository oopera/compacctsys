import Image from "next/image";
import { getNews } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";

export async function News() {
  const news = await getNews();
  return (
    <section id="news" className="bg-[var(--bg-alt)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="Updates" title="Latest News" />
        {news.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-16 text-center">
            <p className="font-mono text-xs text-[var(--muted)]">News items coming soon.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {news.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--violet)]/40"
              >
                {item.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="mb-1 font-mono text-[10px] text-[var(--muted)]">
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-[var(--muted)]">{item.body}</p>
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block font-mono text-xs transition-colors hover:underline"
                      style={{ color: "var(--violet)" }}
                    >
                      Read more →
                    </a>
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
