"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Home, ClipboardList, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/villas",    icon: Home,             label: "Villas" },
  { href: "/admin/bookings",  icon: ClipboardList,    label: "Bookings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside
      className="w-full md:w-60 flex-shrink-0 flex flex-col py-6 px-3 md:min-h-screen"
      style={{ background: "var(--color-ink)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "linear-gradient(135deg, var(--color-amber), var(--color-amber-light))" }}
        >
          V
        </div>
        <span className="font-playfair font-semibold text-lg text-white">LuxVilla</span>
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
        Admin Panel
      </p>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "var(--color-amber) transparent" }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active ? "font-semibold" : "hover:bg-white/10"
              }`}
              style={active ? { background: "var(--color-amber)", color: "#ffffff" } : { color: "rgba(255, 255, 255, 0.75)" }}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-all duration-150 w-full text-left mt-4"
        style={{ color: "rgba(255, 255, 255, 0.75)" }}
      >
        <LogOut size={16} className="shrink-0" />
        Logout
      </button>
    </aside>
  );
}
