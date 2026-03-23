"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const DURATION = 300; // ms for each fade leg

export function PageTransition() {
  const [opacity, setOpacity] = useState(1); // start covered on first load
  const pathname = usePathname();
  const router   = useRouter();
  const selfNav  = useRef(false); // true when we triggered the navigation

  // Fade in whenever the route settles
  useEffect(() => {
    selfNav.current = false;
    if (pathname.startsWith("/studio")) { setOpacity(0); return; }
    const t = setTimeout(() => setOpacity(0), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  // Keep a live ref to pathname so the click handler is never stale
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  // Intercept internal <a> clicks for fade-out before navigation
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element).closest("a");
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      // Already on this page — let the browser handle it normally (no transition)
      if (href === pathnameRef.current) return;
      // Skip transition for studio routes
      if (href.startsWith("/studio") || pathnameRef.current.startsWith("/studio")) return;

      e.preventDefault();
      selfNav.current = true;
      setOpacity(1); // fade out

      setTimeout(() => router.push(href), DURATION);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] bg-[var(--bg)]"
      style={{ opacity, transition: `opacity ${DURATION}ms ease` }}
    />
  );
}
