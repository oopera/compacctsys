import { getNews } from "@/lib/sanity/queries";
import { SectionHeader } from "@/components/SectionHeader";
import { NewsCarousel } from "@/components/NewsCarousel";

export async function News() {
  const news = await getNews();

  return (
    <section id="news" className="bg-[var(--bg)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader label="Updates" title="Latest News" />
      </div>

      {news.length === 0 ? (
        <div className="mx-auto max-w-5xl px-6">
          <div className="border border-dashed border-[var(--border)] p-16 text-center">
            <p className="font-mono text-xs text-[var(--muted)]">News items coming soon.</p>
          </div>
        </div>
      ) : (
        <div className="border-t border-[var(--border)]">
          <NewsCarousel items={news} />
        </div>
      )}
    </section>
  );
}
