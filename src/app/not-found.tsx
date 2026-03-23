import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SceneCanvas } from "@/components/SceneCanvas";
import { BtnLink } from "@/components/Btn";

export const metadata = {
  title: "404 — CompAcctSys",
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <section
          className="relative flex min-h-[70vh] flex-col overflow-hidden"
          style={{ background: "var(--hero-bg)" }}
        >
          <SceneCanvas variant="nodes" />
          <div className="relative z-10 flex flex-1 flex-col items-start justify-center">
            <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--hero-muted)" }}>
                Error
              </p>
              <h1
                className="mb-2 font-semibold leading-none tracking-tight"
                style={{ fontSize: "clamp(4rem, 14vw, 12rem)", color: "var(--hero-fg)" }}
              >
                404
              </h1>
              <p
                className="mb-10 max-w-sm text-sm leading-relaxed"
                style={{ color: "var(--hero-muted)" }}
              >
                Page not found.
              </p>
              <BtnLink href="/">← Back to home</BtnLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
