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
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[var(--hero-from)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-sm font-semibold tracking-widest text-white/80 transition-colors hover:text-white">
          {settings?.groupName ?? "CompAcctSys"}
        </a>
        <nav className="hidden gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-medium uppercase tracking-wider text-white/40 transition-colors hover:text-white/80"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
