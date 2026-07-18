"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";
import { Home, Star, Pencil, Trash2 } from "lucide-react";
import { Villa } from "@/types";

export default function AdminVillasPage() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVillas = () => {
    setLoading(true);
    fetch("/api/villas")
      .then((r) => r.json())
      .then((data) => {
        setVillas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchVillas(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will also remove all related bookings.`)) return;
    try {
      const res = await fetch(`/api/villas/${id}`, { method: "DELETE" });
      if (res.ok) fetchVillas();
      else alert("Failed to delete villa.");
    } catch {
      alert("Error deleting villa.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: "var(--color-cream)" }}>
      <AdminSidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-semibold text-[var(--color-ink)]">Villas</h1>
            <p className="text-[var(--color-ink-soft)] text-sm mt-0.5">
              {loading ? "Loading..." : `${villas.length} villa${villas.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <Link href="/admin/villas/add" className="btn btn-primary">
            + Add New Villa
          </Link>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[var(--color-ink-soft)]">Loading villas...</div>
          ) : villas.length === 0 ? (
            <div className="p-16 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-cream-2)" }}>
                  <Home size={26} style={{ color: "var(--color-amber)" }} />
                </div>
              </div>
              <p className="font-semibold text-[var(--color-ink)]">No villas yet</p>
              <p className="text-sm text-[var(--color-ink-soft)] mt-1 mb-5">
                Add your first villa to get started.
              </p>
              <Link href="/admin/villas/add" className="btn btn-primary">+ Add Villa</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)]"
                    style={{ background: "var(--color-cream-2)", borderBottom: "2px solid var(--color-line)" }}
                  >
                    <th className="py-3 px-4">Villa</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Beds</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {villas.map((villa) => (
                    <tr
                      key={villa.id}
                      style={{ borderBottom: "1px solid var(--color-line)" }}
                      className="hover:bg-[var(--color-cream)] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={villa.images[0]}
                            alt={villa.title}
                            className="w-12 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-[var(--color-ink)] line-clamp-1">{villa.title}</p>
                            <p className="text-xs text-[var(--color-ink-soft)]">
                              {villa.amenities.slice(0, 2).join(" · ")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-ink-soft)]">{villa.location}</td>
                      <td className="py-3 px-4 font-bold text-[var(--color-ink)]">
                        ₹{villa.price.toLocaleString("en-IN")}<span className="text-xs font-normal text-[var(--color-ink-soft)]">/night</span>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-ink-soft)]">{villa.bedrooms}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--color-gold)" }}>
                          <Star size={13} fill="currentColor" /> {villa.rating}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            villa.featured ? "badge-approved" : "badge-pending"
                          }`}
                        >
                          {villa.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/villas/edit/${villa.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-[var(--color-ink)] hover:text-white border"
                            style={{ borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                          >
                            <Pencil size={12} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(villa.id, villa.title)}
                            className="inline-flex items-center gap-1.5 btn btn-danger text-xs px-3 py-1.5"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
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
