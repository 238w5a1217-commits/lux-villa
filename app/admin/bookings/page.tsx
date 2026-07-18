"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { Eye, ClipboardList } from "lucide-react";
import { Booking } from "@/types";

const STATUS_STYLE: Record<string, string> = {
  Pending: "badge-pending",
  Approved: "badge-approved",
  Rejected: "badge-rejected",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "Pending" | "Approved" | "Rejected">("all");

  const fetchBookings = () => {
    setLoading(true);
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Approved: bookings.filter((b) => b.status === "Approved").length,
    Rejected: bookings.filter((b) => b.status === "Rejected").length,
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: "var(--color-cream)" }}>
      <AdminSidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-playfair text-3xl font-semibold text-[var(--color-ink)]">Booking Requests</h1>
            <p className="text-[var(--color-ink-soft)] text-sm mt-0.5">
              {loading ? "Loading..." : `${bookings.length} total booking${bookings.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "Pending", "Approved", "Rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border"
              style={{
                background: filter === s ? "var(--color-ink)" : "#fff",
                color: filter === s ? "#fff" : "var(--color-ink-soft)",
                borderColor: filter === s ? "var(--color-ink)" : "var(--color-line)",
              }}
            >
              {s === "all" ? "All" : s}{" "}
              <span className="ml-1 text-xs opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[var(--color-ink-soft)]">Loading bookings...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-cream-2)" }}>
                  <ClipboardList size={26} style={{ color: "var(--color-amber)" }} />
                </div>
              </div>
              <p className="font-semibold text-[var(--color-ink)]">No bookings found</p>
              <p className="text-sm text-[var(--color-ink-soft)] mt-1">
                {filter !== "all" ? `No ${filter.toLowerCase()} bookings.` : "Customers haven't booked yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)]"
                    style={{ background: "var(--color-cream-2)", borderBottom: "2px solid var(--color-line)" }}
                  >
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Villa</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Special Request</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr
                      key={b.id}
                      style={{ borderBottom: "1px solid var(--color-line)" }}
                      className="hover:bg-[var(--color-cream)] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[var(--color-ink)]">{b.customerName}</p>
                        <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">{b.address}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {b.villa ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={b.villa.images[0]}
                              alt={b.villa.title}
                              className="w-10 h-8 object-cover rounded-md flex-shrink-0"
                            />
                            <span className="font-medium text-[var(--color-ink)] line-clamp-1 text-xs">
                              {b.villa.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[var(--color-ink-soft)]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-xs text-[var(--color-ink)]">{b.email}</p>
                        <p className="text-xs text-[var(--color-ink-soft)]">{b.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--color-ink-soft)] text-center font-bold">
                        {b.guests}
                      </td>
                      <td className="py-3.5 px-4 max-w-[180px]">
                        <p className="text-xs text-[var(--color-ink-soft)] line-clamp-2">
                          {b.specialRequest || "—"}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[var(--color-ink-soft)]">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
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
