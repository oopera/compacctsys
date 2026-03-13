export const dynamic = "force-dynamic";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { ResearchThemes } from "@/components/sections/ResearchThemes";
import { Team } from "@/components/sections/Team";
import { Projects } from "@/components/sections/Projects";
import { Publications } from "@/components/sections/Publications";
import { News } from "@/components/sections/News";
import { Recognitions } from "@/components/sections/Recognitions";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ResearchThemes />
        <Team />
        <Projects />
        <Publications />
        <Recognitions />
        <News />
      </main>
      <Footer />
    </>
  );
}
