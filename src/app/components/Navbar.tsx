"use client";

import { useState } from "react";
import { SearchIcon, UserIcon, CartIcon, MenuIcon, CloseIcon } from "./icons";

const links = ["Shop", "Best Sellers", "New", "Materials", "About"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-tan">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-serif text-2xl tracking-wide text-charcoal">
          Pentae
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l}>
              <a
                href="#"
                className="text-sm tracking-wide text-warm-gray hover:text-charcoal transition-colors"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="text-charcoal hover:text-gold transition-colors">
            <SearchIcon />
          </button>
          <button aria-label="Account" className="hidden md:block text-charcoal hover:text-gold transition-colors">
            <UserIcon />
          </button>
          <button aria-label="Cart" className="text-charcoal hover:text-gold transition-colors">
            <CartIcon />
          </button>
          <button
            aria-label="Menu"
            className="md:hidden text-charcoal"
            onClick={() => setOpen(!open)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-tan bg-cream px-6 pb-4">
          <ul className="flex flex-col gap-3 pt-3">
            {links.map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="text-sm tracking-wide text-warm-gray hover:text-charcoal transition-colors"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
