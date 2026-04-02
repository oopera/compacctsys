export const dynamic = "force-dynamic";

import { Nav } from "@/components/Nav";
import { SubpageHero } from "@/components/SubpageHero";
import { Team } from "@/components/sections/Team";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Team — CompAcctSys",
};

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main>
        <SubpageHero label="People" title="Team" scene="grid" />
        <Team standalone />
      </main>
      <Footer />
    </>
  );
}
