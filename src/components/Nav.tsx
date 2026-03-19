import { getSiteSettings } from "@/lib/sanity/queries";

const links = [
  { label: "About",        href: "#about" },
  { label: "Research",     href: "#research" },
  { label: "Team",         href: "#team" },
  { label: "Projects",     href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "News",         href: "#news" },
];

export async function Nav() {
  const settings = await getSiteSettings();

  return (
    <header className="fixed top-0 z-50 w-full border-b-2 border-black bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <a href="#" className="font-mono text-xs font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-60">
          {settings?.groupName ?? "CompAcctSys"}
        </a>
        <nav className="hidden gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[10px] uppercase tracking-widest text-black/40 transition-colors hover:text-black"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
