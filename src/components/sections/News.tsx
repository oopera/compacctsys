import { news } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";

export function News() {
  return (
    <section id="news" className="border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader label="Updates" title="Latest News" />
        {news.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-12 text-center">
            <p className="font-mono text-xs text-[var(--muted)]">
              News items coming soon.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {news.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--violet)]/40"
              >
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
                    className="mt-3 inline-block font-mono text-xs text-[var(--violet)] hover:underline"
                  >
                    Read more →
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
