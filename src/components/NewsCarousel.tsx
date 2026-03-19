"use client";

import Image from "next/image";
import { useRef } from "react";
import type { NewsItem } from "@/types";

export function NewsCarousel({ items }: { items: NewsItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Mouse drag to scroll
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  function onMouseDown(e: React.MouseEvent) {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!drag.current.active || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = drag.current.scrollLeft - (x - drag.current.startX);
  }

  function onMouseUp() {
    drag.current.active = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  }

  return (
    <div
      ref={trackRef}
      className="flex gap-6 overflow-x-auto select-none"
      style={{
        cursor: "grab",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        scrollSnapType: "x mandatory",
        paddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2 + 2.5rem))",
        paddingRight: "max(1.5rem, calc((100vw - 72rem) / 2 + 2.5rem))",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {items.map((item) => (
        <article
          key={item.id}
          className="group flex w-72 shrink-0 flex-col border border-[var(--border)] md:w-80"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* Image */}
          <div className="relative h-44 w-full shrink-0 bg-[var(--bg-alt)]">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                draggable={false}
                className="object-cover"
                sizes="320px"
              />
            ) : (
              <div className="h-full w-full bg-[var(--bg-alt)]" />
            )}
          </div>

          {/* Text */}
          <div className="flex flex-1 flex-col p-5">
            <p className="mb-2 font-mono text-[10px] text-[var(--muted)]">
              {new Date(item.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h3 className="mb-2 text-sm font-semibold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--violet)]">
              {item.title}
            </h3>
            {item.body && (
              <p className="line-clamp-3 text-xs leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            )}
            {item.externalUrl && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--violet)]"
              >
                Read more ↗
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
