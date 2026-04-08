export const dynamic = "force-dynamic";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { News } from "@/components/sections/News";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <News />
      </main>
      <Footer />
    </>
  );
}
