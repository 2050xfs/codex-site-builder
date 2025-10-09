import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Editor", href: "#editor" },
      { label: "Deploy", href: "#deploy" },
      { label: "Pricing", href: "#pricing" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="bg-[#05060f]">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <span className="text-sm uppercase tracking-[0.35em] text-blue-300/80">Codex Builder</span>
            <p className="max-w-sm text-sm text-slate-400">
              Build lovable experiences with AI assistance that respects craft. Codex Builder is crafted by designers and engineers that care about the details.
            </p>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/50">
              <span>© {new Date().getFullYear()} Codex Builder</span>
              <span>·</span>
              <Link href="#" className="hover:text-white">
                Privacy
              </Link>
              <span>·</span>
              <Link href="#" className="hover:text-white">
                Terms
              </Link>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">{section.title}</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
