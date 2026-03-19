export const dynamic = "force-dynamic";

import { Nav } from "@/components/Nav";
import { SubpageHero } from "@/components/SubpageHero";
import { Publications } from "@/components/sections/Publications";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Publications — CompAcctSys",
};

export default function PublicationsPage() {
  return (
    <>
      <Nav />
      <main>
        <SubpageHero label="Output" title="Publications" />
        <Publications />
      </main>
      <Footer />
    </>
  );
}
