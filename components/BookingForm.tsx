"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Villa } from "@/types";
import { MapPin, BedDouble, Star, AlertTriangle, CheckCircle } from "lucide-react";

interface BookingFormProps {
  villa: Villa;
}

export default function BookingForm({ villa }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    guests: "1",
    specialRequest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, villaId: villa.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card p-10 text-center animate-fade-up">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ background: "var(--color-success-bg)" }}
        >
          <CheckCircle size={36} style={{ color: "var(--color-success)" }} />
        </div>
        <h2 className="font-playfair text-2xl font-semibold text-[var(--color-ink)] mb-2">
          Booking Submitted!
        </h2>
        <p className="text-[var(--color-ink-soft)] text-sm mb-6">
          Your booking request for <strong>{villa.title}</strong> has been received. 
          Our team will review and confirm within 24 hours.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/villas")} className="btn btn-outline">
            Browse More Villas
          </button>
          <button onClick={() => router.push("/")} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-5">
      {/* Villa summary */}
      <div
        className="flex gap-4 p-4 rounded-xl mb-2"
        style={{ background: "var(--color-cream-2)" }}
      >
        <img
          src={villa.images[0]}
          alt={villa.title}
          className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair font-semibold text-[var(--color-ink)] mb-0.5">{villa.title}</h3>
          <p className="text-xs text-[var(--color-ink-soft)] flex items-center gap-1 mb-1">
            <MapPin size={11} className="shrink-0" /> {villa.location}
          </p>
          <p className="text-xs text-[var(--color-ink-soft)] line-clamp-2 leading-relaxed mb-2">
            {villa.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-[var(--color-ink-soft)] mb-2">
            <span className="flex items-center gap-1">
              <BedDouble size={11} /> {villa.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <Star size={11} style={{ color: "var(--color-gold)" }} /> {villa.rating}
            </span>
          </div>
          <p className="text-sm font-bold text-[var(--color-amber)]">
            ₹{villa.price.toLocaleString("en-IN")} / night
          </p>
        </div>
      </div>

      <h2 className="font-playfair text-xl font-semibold text-[var(--color-ink)]">
        Your Details
      </h2>

      {/* Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
          Full Name *
        </label>
        <input
          className="input"
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="John Smith"
          required
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
            Email Address *
          </label>
          <input
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
            Phone Number *
          </label>
          <input
            className="input"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            required
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
          Home Address *
        </label>
        <input
          className="input"
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="123 Main St, City, Country"
          required
        />
      </div>

      {/* Guests */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
          Number of Guests *
        </label>
        <select
          className="input"
          name="guests"
          value={form.guests}
          onChange={handleChange}
          required
        >
          {Array.from({ length: villa.bedrooms * 2 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "Guest" : "Guests"}
            </option>
          ))}
        </select>
      </div>

      {/* Special Request */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
          Special Requests (optional)
        </label>
        <textarea
          className="input resize-none"
          name="specialRequest"
          value={form.specialRequest}
          onChange={handleChange}
          rows={3}
          placeholder="Any special requirements, dietary needs, arrival preferences..."
        />
      </div>

      {error && (
        <p className="text-sm text-[var(--color-danger)] p-3 rounded-lg badge-rejected flex items-center gap-2">
          <AlertTriangle size={14} className="shrink-0" /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full py-3.5 text-base"
      >
        {loading ? "Submitting..." : "Submit Booking Request"}
      </button>

      <p className="text-xs text-center text-[var(--color-ink-soft)]">
        No payment required now. Our team will contact you to confirm details.
      </p>
    </form>
  );
}
