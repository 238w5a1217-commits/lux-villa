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
  const [customAmenity, setCustomAmenity] = useState("");

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setForm((prev) => ({
            ...prev,
            images: prev.images ? prev.images + "\n" + ev.target!.result : ev.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !form.amenities.includes(trimmed)) {
      setForm((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
      setCustomAmenity("");
    }
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
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold text-[var(--color-ink)]">Images</h2>
                <div className="relative overflow-hidden inline-block">
                  <button type="button" className="btn btn-primary text-xs py-1.5 px-3">
                    Upload Images
                  </button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-xs text-[var(--color-ink-soft)] mb-3">Upload image files. First image is the main image.</p>
              
              {form.images.trim() && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {form.images.split("\n").map(s => s.trim()).filter(Boolean).map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-[var(--color-line)] group">
                      <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = form.images.split("\n").map(s => s.trim()).filter(Boolean);
                          newImages.splice(i, 1);
                          setForm(prev => ({ ...prev, images: newImages.join("\n") }));
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="font-semibold text-[var(--color-ink)] mb-3">Amenities</h2>
              
              <div className="flex gap-2 mb-4 max-w-sm">
                <input
                  type="text"
                  className="input py-1.5 text-sm"
                  placeholder="Custom amenity..."
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="btn btn-outline text-xs px-4"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[...new Set([...COMMON_AMENITIES, ...form.amenities])].map((a) => (
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
