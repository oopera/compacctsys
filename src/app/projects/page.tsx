export const dynamic = "force-dynamic";

import { Nav } from "@/components/Nav";
import { SubpageHero } from "@/components/SubpageHero";
import { Projects } from "@/components/sections/Projects";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Projects — CompAcctSys",
};

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main>
        <SubpageHero label="Funded work" title="Projects" />
        <Projects standalone />
      </main>
      <Footer />
    </>
  );
}
