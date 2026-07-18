"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/villas",    label: "Villas" },
  { href: "/#featured", label: "Featured" },
  { href: "/#explore",  label: "Explore More" },
  { href: "/#why",      label: "Why Choose Us" },
  { href: "/#reviews",  label: "Guest Experiences" },
  { href: "/#footer",   label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--color-line)] shadow-sm">
      <div className="page-wrap">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setIsOpen(false)}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: "linear-gradient(135deg, var(--color-amber), var(--color-amber-light))" }}
            >
              V
            </div>
            <span className="font-playfair font-semibold text-xl text-[var(--color-ink)]">
              LuxVilla
            </span>
          </Link>

          {/* Nav links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname === href.split('#')[0] && pathname !== "/";
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors duration-150 relative ${
                    isActive
                      ? "text-[var(--color-amber)]"
                      : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {label}
                  {/* active underline */}
                  <span
                    className="absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-200"
                    style={{
                      background: "var(--color-amber)",
                      width: isActive ? "100%" : "0%",
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/villas" className="hidden sm:inline-flex btn btn-primary text-sm py-2.5 px-5">
              Browse Villas
            </Link>
            <button 
              className="lg:hidden p-2 text-[var(--color-ink)]" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-[var(--color-line)] bg-white">
          <div className="page-wrap py-4 flex flex-col gap-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-amber)]"
              >
                {label}
              </Link>
            ))}
            <Link 
              href="/villas" 
              onClick={() => setIsOpen(false)}
              className="sm:hidden btn btn-primary text-sm py-2.5 px-5 text-center mt-2"
            >
              Browse Villas
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
