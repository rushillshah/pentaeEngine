"use client";

import { useState, useRef, useEffect } from "react";
import { UserIcon, CartIcon, MenuIcon, CloseIcon } from "./icons";
import { useAuth } from "./AuthContext";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "New", href: "/new" },
  { label: "Materials", href: "/materials" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

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
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm tracking-wide text-warm-gray hover:text-charcoal transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* User dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              aria-label="Account"
              className="text-charcoal hover:text-gold transition-colors"
              onClick={() => setUserOpen(!userOpen)}
            >
              <UserIcon />
            </button>
            {userOpen && !loading && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-tan rounded-lg shadow-lg py-1 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-tan">
                      <p className="text-sm font-medium text-charcoal">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-warm-gray truncate">{user.email}</p>
                    </div>
                    <a
                      href="/account"
                      className="block px-4 py-2.5 text-sm text-charcoal hover:bg-cream-dark transition-colors"
                    >
                      Account Settings
                    </a>
                    <div className="border-t border-tan" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-warm-gray hover:bg-cream-dark transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/signin"
                      className="block px-4 py-2.5 text-sm text-charcoal hover:bg-cream-dark transition-colors"
                    >
                      Sign In
                    </a>
                    <a
                      href="/signup"
                      className="block px-4 py-2.5 text-sm text-gold hover:bg-cream-dark transition-colors"
                    >
                      Create Account
                    </a>
                  </>
                )}
              </div>
            )}
          </div>

          <button aria-label="Cart" className="text-charcoal hover:text-gold transition-colors">
            <CartIcon />
          </button>
          <button
            aria-label="Menu"
            className="md:hidden text-charcoal"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-tan bg-cream px-6 pb-4">
          <ul className="flex flex-col gap-3 pt-3">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-sm tracking-wide text-warm-gray hover:text-charcoal transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <a
                    href="/account"
                    className="text-sm tracking-wide text-warm-gray hover:text-charcoal transition-colors"
                  >
                    Account Settings
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="text-sm tracking-wide text-warm-gray hover:text-charcoal transition-colors"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/signin"
                    className="text-sm tracking-wide text-warm-gray hover:text-charcoal transition-colors"
                  >
                    Sign In
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="text-sm tracking-wide text-gold hover:text-gold-light transition-colors"
                  >
                    Create Account
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
