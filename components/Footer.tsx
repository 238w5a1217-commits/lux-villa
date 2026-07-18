"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MessageCircle,
  Briefcase,
  Globe,
  Camera,
  Home,
  Star,
  Compass,
  Users,
  HelpCircle,
  Mail,
  Shield,
  FileText,
  Send,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  const socialLinks = [
    { icon: MessageCircle, label: "Twitter / X" },
    { icon: Briefcase,     label: "LinkedIn" },
    { icon: Globe,         label: "Facebook" },
    { icon: Camera,        label: "Instagram" },
  ];

  const exploreLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/#featured", label: "Featured", icon: Star },
    { href: "/#explore", label: "Explore More", icon: Compass },
    { href: "/#why", label: "Why Choose Us", icon: HelpCircle },
    { href: "/#reviews", label: "Guest Experiences", icon: Users },
    { href: "/#footer", label: "Contact", icon: Mail },
  ];

  const supportLinks = [
    { href: "/", label: "How It Works", icon: HelpCircle },
    { href: "/#footer", label: "Contact Us", icon: Mail },
    { href: "/", label: "Privacy Policy", icon: Shield },
    { href: "/", label: "Terms of Service", icon: FileText },
  ];

  return (
    <footer
      id="footer"
      style={{ background: "var(--color-ink)", color: "rgba(255,255,255,0.6)" }}
      className="mt-20"
    >
      <div className="page-wrap" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div className="grid grid-cols-1 md:grid-cols-12" style={{ gap: "48px", marginBottom: "64px" }}>

          {/* Brand */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-amber), var(--color-amber-light))",
                }}
              >
                V
              </div>
              <span className="font-playfair font-semibold text-xl text-white">
                LuxVilla
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ lineHeight: "1.75" }}>
              India&apos;s finest collection of luxury villa rentals. Handpicked
              properties, seamless booking, unforgettable stays.
            </p>

            {/* Address */}
            <div className="flex items-start gap-2 text-xs mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
              <MapPin size={13} className="mt-0.5 shrink-0" />
              <span>12 MG Road, Bangalore, Karnataka 560001</span>
            </div>
            <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
              <Phone size={13} className="shrink-0" />
              <span>+91 98765 43210</span>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-[var(--color-amber)]"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <Icon size={15} color="rgba(255,255,255,0.8)" />
                </button>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h4
              className="text-white font-semibold text-xs mb-5 uppercase tracking-wider"
              style={{ letterSpacing: "0.12em" }}
            >
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {exploreLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-2.5 hover:text-white transition-colors duration-150 group"
                  >
                    <Icon
                      size={13}
                      className="shrink-0 transition-colors duration-150 group-hover:text-[var(--color-amber-light)]"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4
              className="text-white font-semibold text-xs mb-5 uppercase tracking-wider"
              style={{ letterSpacing: "0.12em" }}
            >
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              {supportLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-2.5 hover:text-white transition-colors duration-150 group"
                  >
                    <Icon
                      size={13}
                      className="shrink-0 transition-colors duration-150 group-hover:text-[var(--color-amber-light)]"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-5">
            <h4
              className="text-white font-semibold text-xs mb-5 uppercase tracking-wider"
              style={{ letterSpacing: "0.12em" }}
            >
              Get In Touch
            </h4>

            {sent ? (
              <div
                className="rounded-xl p-6 text-center"
                style={{ background: "rgba(212,167,106,0.15)", border: "1px solid rgba(212,167,106,0.3)" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(212,167,106,0.2)" }}>
                  <Send size={20} style={{ color: "var(--color-amber-light)" }} />
                </div>
                <p className="text-white font-semibold text-sm mb-1">Message Sent!</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-xs underline hover:text-white transition-colors"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid var(--color-amber)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.12)";
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid var(--color-amber)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.12)";
                    }}
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Tell us about your dream villa..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-200 resize-none"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid var(--color-amber)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.12)";
                  }}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-5 text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, var(--color-amber), var(--color-amber-light))",
                    color: "#1a1208",
                  }}
                >
                  <Send size={14} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "28px" }}
        >
          <p>© 2026 LuxVilla. All rights reserved.</p>
          <p style={{ color: "rgba(255,255,255,0.35)" }}>
            Crafted with care · Luxury redefined
          </p>
        </div>
      </div>
    </footer>
  );
}
