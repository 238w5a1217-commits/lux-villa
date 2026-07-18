"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Villa } from "@/types";

interface VillaCardProps {
  villa: Villa;
}

export default function VillaCard({ villa }: VillaCardProps) {
  return (
    <Link href={`/villas/${villa.id}`}>
      <div
        className="card group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        style={{ willChange: "transform, box-shadow" }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={villa.images[0]}
            alt={villa.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* dark gradient on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: "linear-gradient(to top, rgba(26,18,8,0.35), transparent)" }}
          />
          {villa.featured && (
            <span
              className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "var(--color-amber)" }}
            >
              Featured
            </span>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold">
            ★ {villa.rating}
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-playfair font-semibold text-[15.5px] text-[var(--color-ink)] mb-0.5 line-clamp-1">
            {villa.title}
          </h3>
          <p className="text-xs text-[var(--color-ink-soft)] mb-2 flex items-center gap-1">
            <MapPin size={11} className="shrink-0" /> {villa.location}
          </p>
          <p className="text-xs text-[var(--color-ink-soft)] mb-3">
            {villa.bedrooms} beds · {villa.bathrooms} baths
          </p>

          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid var(--color-line)" }}
          >
            <div>
              <span className="font-bold text-[15px] text-[var(--color-ink)]">
                ₹{villa.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-[var(--color-ink-soft)] ml-1">/ night</span>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 group-hover:bg-[var(--color-amber)] group-hover:text-white"
              style={{ background: "var(--color-cream-2)", color: "var(--color-amber)" }}
            >
              Book Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
