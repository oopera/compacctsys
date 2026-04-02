export const dynamic = "force-dynamic";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { ResearchThemes } from "@/components/sections/ResearchThemes";
import { News } from "@/components/sections/News";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ResearchThemes />
        {/* News in normal flow on mobile only — desktop uses the global slide-in panel */}
        <div className="min-[1600px]:hidden">
          <News />
        </div>
      </main>
      <Footer />
    </>
  );
}
