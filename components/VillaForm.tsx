"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { Villa } from "@/types";

interface VillaFormProps {
  initialData?: Partial<Villa>;
  isEdit?: boolean;
  villaId?: string;
}

const COMMON_AMENITIES = [
  "Infinity Pool",
  "Private Pool",
  "Ocean View",
  "Sea View",
  "Private Chef",
  "Butler Service",
  "WiFi",
  "Air Conditioning",
  "Gym",
  "Spa",
  "Sauna",
  "Beach Access",
  "Fireplace",
  "Wine Cellar",
  "Outdoor BBQ",
  "Parking",
  "Concierge",
  "Daily Housekeeping",
  "Breakfast Included",
  "Room Service",
];

export default function VillaForm({ initialData, isEdit, villaId }: VillaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    location: initialData?.location ?? "",
    price: initialData?.price?.toString() ?? "",
    description: initialData?.description ?? "",
    bedrooms: initialData?.bedrooms?.toString() ?? "3",
    bathrooms: initialData?.bathrooms?.toString() ?? "2",
    rating: initialData?.rating?.toString() ?? "4.5",
    featured: initialData?.featured ?? false,
    images: initialData?.images?.join("\n") ?? "",
    amenities: initialData?.amenities ?? [],
  });

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      location: form.location,
      price: parseFloat(form.price),
      description: form.description,
      bedrooms: parseInt(form.bedrooms),
      bathrooms: parseInt(form.bathrooms),
      rating: parseFloat(form.rating),
      featured: form.featured,
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      amenities: form.amenities,
    };

    try {
      const url = isEdit ? `/api/villas/${villaId}` : "/api/villas";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      router.push("/admin/villas");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: "var(--color-cream)" }}>
      <AdminSidebar />
      <main className="flex-1 p-8">
        <BackButton label="← Back to Villas" />

        <div className="max-w-3xl">
          <h1 className="font-playfair text-3xl font-semibold text-[var(--color-ink)] mb-6">
            {isEdit ? "Edit Villa" : "Add New Villa"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-[var(--color-ink)]">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                    Villa Title *
                  </label>
                  <input className="input" name="title" value={form.title} onChange={handleChange} placeholder="Ocean Breeze Villa" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                    Location *
                  </label>
                  <input className="input" name="location" value={form.location} onChange={handleChange} placeholder="Bali, Indonesia" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                  Description *
                </label>
                <textarea
                  className="input resize-none"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the villa, its surroundings and unique features..."
                  required
                />
              </div>
            </div>

            {/* Pricing & specs */}
            <div className="card p-6">
              <h2 className="font-semibold text-[var(--color-ink)] mb-4">Pricing & Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                   Price / Night (₹) *
                  </label>
                  <input className="input" type="number" name="price" value={form.price} onChange={handleChange} min="1" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                    Bedrooms *
                  </label>
                  <input className="input" type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} min="1" max="20" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                    Bathrooms *
                  </label>
                  <input className="input" type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} min="1" max="20" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                    Rating
                  </label>
                  <input className="input" type="number" name="rating" value={form.rating} onChange={handleChange} min="1" max="5" step="0.1" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[var(--color-amber)]"
                />
                <label htmlFor="featured" className="text-sm font-medium text-[var(--color-ink)] cursor-pointer">
                  Mark as Featured Villa (shown on homepage)
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="card p-6">
              <h2 className="font-semibold text-[var(--color-ink)] mb-1">Image URLs</h2>
              <p className="text-xs text-[var(--color-ink-soft)] mb-3">One URL per line. First image is the main image.</p>
              <textarea
                className="input resize-none font-mono text-xs"
                name="images"
                value={form.images}
                onChange={handleChange}
                rows={5}
                placeholder="https://images.unsplash.com/photo-xxx&#10;https://images.unsplash.com/photo-yyy"
              />
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="font-semibold text-[var(--color-ink)] mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {COMMON_AMENITIES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    style={{
                      background: form.amenities.includes(a) ? "var(--color-ink)" : "#fff",
                      color: form.amenities.includes(a) ? "#fff" : "var(--color-ink)",
                      borderColor: form.amenities.includes(a) ? "var(--color-ink)" : "var(--color-line)",
                    }}
                  >
                    {form.amenities.includes(a) ? "✓ " : ""}{a}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-[var(--color-danger)] p-3 rounded-lg badge-rejected">⚠ {error}</p>
            )}

            <div className="flex gap-3">
              <Link href="/admin/villas" className="btn btn-outline flex-1 justify-center">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="btn btn-primary flex-1 justify-center">
                {loading ? "Saving..." : isEdit ? "Update Villa" : "Create Villa"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
