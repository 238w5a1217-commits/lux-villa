import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Home, ClipboardList, Clock, CheckCircle, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

type BookingWithVilla = Prisma.BookingGetPayload<{ include: { villa: true } }>;
type SerializedBooking = Omit<BookingWithVilla, "createdAt" | "villa"> & {
  createdAt: string;
  villa: (Omit<BookingWithVilla["villa"], "createdAt"> & { createdAt: string }) | null;
};

async function getStats() {
  try {
    const [totalVillas, totalBookings, pendingBookings, approvedBookings] =
      await Promise.all([
        prisma.villa.count(),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "Pending" } }),
        prisma.booking.count({ where: { status: "Approved" } }),
      ]);

    const recentBookings = await prisma.booking.findMany({
      include: { villa: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return {
      totalVillas,
      totalBookings,
      pendingBookings,
      approvedBookings,
      recentBookings: recentBookings.map((b: BookingWithVilla) => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        villa: b.villa ? { ...b.villa, createdAt: b.villa.createdAt.toISOString() } : null,
      })),
    };
  } catch {
    return {
      totalVillas: 0,
      totalBookings: 0,
      pendingBookings: 0,
      approvedBookings: 0,
      recentBookings: [],
    };
  }
}

const STATUS_STYLE: Record<string, string> = {
  Pending: "badge-pending",
  Approved: "badge-approved",
  Rejected: "badge-rejected",
};

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const kpis = [
    { label: "Total Villas",   value: stats.totalVillas,    Icon: Home,          color: "var(--color-amber)" },
    { label: "Total Bookings", value: stats.totalBookings,  Icon: ClipboardList, color: "var(--color-success)" },
    { label: "Pending Review", value: stats.pendingBookings, Icon: Clock,        color: "var(--color-gold)" },
    { label: "Approved",       value: stats.approvedBookings, Icon: CheckCircle, color: "var(--color-success)" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: "var(--color-cream)" }}>
      <AdminSidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-semibold text-[var(--color-ink)]">Dashboard</h1>
            <p className="text-[var(--color-ink-soft)] text-sm mt-0.5">Welcome back, Admin</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/villas/add" className="btn btn-primary">
              + Add Villa
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((k) => (
            <div key={k.label} className="card p-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "var(--color-cream-2)" }}
              >
                <k.Icon size={20} style={{ color: k.color }} />
              </div>
              <p className="font-bold text-2xl text-[var(--color-ink)]">{k.value}</p>
              <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-playfair text-xl font-semibold text-[var(--color-ink)]">
              Recent Booking Requests
            </h2>
            <Link href="/admin/bookings" className="text-sm font-semibold text-[var(--color-amber)] hover:underline">
              View All →
            </Link>
          </div>

          {stats.recentBookings.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-ink-soft)]">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-cream-2)" }}>
                  <ClipboardList size={26} style={{ color: "var(--color-amber)" }} />
                </div>
              </div>
              <p className="font-medium">No bookings yet</p>
              <p className="text-sm mt-1">Bookings will appear here once customers submit requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--color-line)" }}>
                    {["Customer", "Villa", "Guests", "Status", "Date", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((b: SerializedBooking) => (
                    <tr
                      key={b.id}
                      style={{ borderBottom: "1px solid var(--color-line)" }}
                      className="hover:bg-[var(--color-cream-2)] transition-colors"
                    >
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[var(--color-ink)]">{b.customerName}</p>
                        <p className="text-xs text-[var(--color-ink-soft)]">{b.email}</p>
                      </td>
                      <td className="py-3 px-3 text-[var(--color-ink-soft)]">
                        {b.villa?.title ?? "—"}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-ink-soft)]">{b.guests}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[b.status]}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-[var(--color-ink-soft)]">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-[var(--color-amber)] hover:text-white"
                          style={{ background: "var(--color-cream-2)", color: "var(--color-ink)" }}
                        >
                          <Eye size={13} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
