"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VillaCard from "@/components/VillaCard";
import { Home } from "lucide-react";
import { Villa } from "@/types";

export default function VillasPage() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [filtered, setFiltered] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minBeds, setMinBeds] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetch("/api/villas")
      .then((r) => r.json())
      .then((data) => {
        setVillas(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...villas];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q)
      );
    }

    result = result.filter((v) => v.price <= maxPrice);
    if (minBeds > 0) result = result.filter((v) => v.bedrooms >= minBeds);

    if (sortBy === "priceLow") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHigh") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFiltered(result);
  }, [villas, search, maxPrice, minBeds, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearch("");
    setMaxPrice(500000);
    setMinBeds(0);
    setSortBy("newest");
  };

  return (
    <>
      <Navbar />
      <main className="page-wrap py-10 pb-24">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-2">
            Luxury Collection
          </p>
          <h1 className="font-playfair text-4xl font-semibold text-[var(--color-ink)]">
            Browse Villas
          </h1>
          <p className="text-[var(--color-ink-soft)] mt-2">
            {loading ? "Loading..." : `${filtered.length} villa${filtered.length !== 1 ? "s" : ""} available`}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-7">
          {/* ---- SIDEBAR FILTERS ---- */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="card p-5 sticky top-20 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[var(--color-ink)]">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[var(--color-amber)] hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                  Search
                </label>
                <input
                  className="input text-sm"
                  type="text"
                  placeholder="Location, villa name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                  Max Price (₹)
                </label>
                <input
                  className="input text-sm w-full"
                  type="number"
                  min={0}
                  placeholder="e.g. 50000"
                  value={maxPrice === 500000 ? "" : maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : 500000)}
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-2">
                  Min Bedrooms
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinBeds(n)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                      style={{
                        background: minBeds === n ? "var(--color-ink)" : "#fff",
                        color: minBeds === n ? "#fff" : "var(--color-ink)",
                        borderColor: minBeds === n ? "var(--color-ink)" : "var(--color-line)",
                      }}
                    >
                      {n === 0 ? "Any" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                  Sort By
                </label>
                <select
                  className="input text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* ---- VILLA GRID ---- */}
          <div className="flex-1">
            {loading ? (
              <div className="flex overflow-x-auto gap-5 pb-6 -mx-8 px-8 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[80vw] flex-none sm:w-auto rounded-xl overflow-hidden animate-pulse"
                    style={{ background: "var(--color-cream-2)" }}
                  >
                    <div className="aspect-[4/3]" style={{ background: "var(--color-line)" }} />
                    <div className="p-4 space-y-2">
                      <div className="h-4 rounded" style={{ background: "var(--color-line)", width: "70%" }} />
                      <div className="h-3 rounded" style={{ background: "var(--color-line)", width: "50%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-cream-2)" }}>
                  <Home size={32} style={{ color: "var(--color-amber)" }} />
                </div>
              </div>
                <h3 className="font-playfair text-xl font-semibold text-[var(--color-ink)] mb-2">
                  No villas found
                </h3>
                <p className="text-[var(--color-ink-soft)] text-sm mb-5">
                  Try adjusting your filters to find the perfect villa.
                </p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 -mx-8 px-8 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {filtered.map((villa) => (
                  <div key={villa.id} className="w-[80vw] flex-none snap-center sm:w-auto">
                    <VillaCard villa={villa} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
