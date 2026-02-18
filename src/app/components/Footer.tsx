const columns = [
  {
    title: "Shop",
    links: [
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "New Arrivals", href: "/new" },
      { label: "Rings", href: "/shop" },
      { label: "Necklaces", href: "/shop" },
      { label: "Earrings", href: "/shop" },
      { label: "Bracelets", href: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Sizing Guide", href: "#" },
      { label: "Shipping & Returns", href: "#" },
      { label: "Care Guide", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Materials", href: "/materials" },
      { label: "Sustainability", href: "#" },
      { label: "Press", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="font-serif text-2xl tracking-wide text-white">
              Pentae
            </a>
            <p className="mt-3 text-sm leading-relaxed">
              Everyday fine jewelry — designed for real life.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-medium tracking-wide mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <span>&copy; {new Date().getFullYear()} Pentae. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
