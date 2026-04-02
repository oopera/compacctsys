import Image from "next/image";
import { getNews } from "@/lib/sanity/queries";
import { BtnLink } from "@/components/Btn";

export async function SidebarNews() {
    const news = await getNews();

    return (
        <div className="px-6 py-8">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                News
            </p>

            {news.length === 0 ? (
                <p className="font-mono text-xs text-[var(--muted)]">Coming soon.</p>
            ) : (
                <ul className="divide-y divide-[var(--border)]">
                    {news.map((item) => (
                        <li key={item.id} className="py-5 first:pt-0">
                            {item.image && (
                                <div className="relative mb-3 h-28 w-full overflow-hidden bg-[var(--bg-alt)]">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="280px"
                                    />
                                </div>
                            )}
                            <p className="mb-1 font-mono text-[10px] text-[var(--muted)]">
                                {new Date(item.date).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                            <h3 className="mb-1 text-sm font-semibold leading-snug text-[var(--text)]">
                                {item.title}
                            </h3>
                            {item.body && (
                                <p className="text-xs leading-relaxed text-[var(--muted)] line-clamp-3">
                                    {item.body}
                                </p>
                            )}
                            {item.externalUrl && (
                                <BtnLink href={item.externalUrl} external className="mt-2 w-fit text-[10px]">
                                    Read more ↗
                                </BtnLink>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
