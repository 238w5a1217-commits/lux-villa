"use client";

import Link from "next/link";
import { MapPin, BedDouble, ShowerHead } from "lucide-react";
import { Villa } from "@/types";

interface FeaturedVillaProps {
  villa: Villa;
  reverse?: boolean;
}

export default function FeaturedVilla({ villa, reverse = false }: FeaturedVillaProps) {
  return (
    <div
      className={`card overflow-hidden flex flex-col md:flex-row ${reverse ? "md:flex-row-reverse" : ""} group`}
    >
      {/* Image */}
      <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto overflow-hidden">
        <img
          src={villa.images[0]}
          alt={villa.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(26,18,8,0.4), transparent)" }}
        />
        <div className="absolute bottom-4 left-4">
          <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--color-amber)" }}>
            ⭐ {villa.rating} · Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-3 flex items-center gap-1.5">
          <MapPin size={12} className="shrink-0" /> {villa.location}
        </p>
        <h3 className="font-playfair font-semibold text-2xl text-[var(--color-ink)] mb-3 leading-tight">
          {villa.title}
        </h3>
        <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-5 line-clamp-3">
          {villa.description}
        </p>

        <div className="flex gap-6 mb-6 text-sm text-[var(--color-ink-soft)]">
          <span className="flex items-center gap-1.5"><BedDouble size={14} /> {villa.bedrooms} Bedrooms</span>
          <span className="flex items-center gap-1.5"><ShowerHead size={14} /> {villa.bathrooms} Bathrooms</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[var(--color-ink)]">
              ₹{villa.price.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-[var(--color-ink-soft)] ml-1">/ night</span>
          </div>
          <Link href={`/villas/${villa.id}`} className="btn btn-primary">
            View Villa →
          </Link>
        </div>
      </div>
    </div>
  );
}
