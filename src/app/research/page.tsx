export const dynamic = "force-dynamic";

import { Nav } from "@/components/Nav";
import { SubpageHero } from "@/components/SubpageHero";
import { ResearchThemes } from "@/components/sections/ResearchThemes";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Research — CompAcctSys",
};

export default function ResearchPage() {
  return (
    <>
      <Nav />
      <main>
        <SubpageHero label="Focus areas" title="Research" />
        <ResearchThemes />
      </main>
      <Footer />
    </>
  );
}
