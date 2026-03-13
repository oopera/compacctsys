const links = [
  { label: "About",        href: "#about" },
  { label: "Research",     href: "#research" },
  { label: "Team",         href: "#team" },
  { label: "Projects",     href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "News",         href: "#news" },
];

export function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-sm font-semibold tracking-widest text-[var(--violet)]">
          CompAcctSys
        </a>
        <nav className="hidden gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
