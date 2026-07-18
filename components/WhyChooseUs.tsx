"use client";

import { Trophy, Lock, Headphones } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Curated Excellence",
    desc: "Every villa is personally inspected and verified to meet our rigorous luxury standards before being listed.",
  },
  {
    icon: Lock,
    title: "Secure Booking",
    desc: "Your booking and payment details are protected with bank-level security. Book with complete confidence.",
  },
  {
    icon: Headphones,
    title: "Dedicated Concierge",
    desc: "A personal concierge team is available 24/7 to assist with every last detail of your stay.",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="feature-grid grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((f) => (
        <div
          key={f.title}
          className="feature-card card p-8 text-center group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
            style={{ background: "var(--color-cream-2)" }}
          >
            <f.icon size={28} style={{ color: "var(--color-amber)" }} />
          </div>
          <h3 className="font-playfair font-semibold text-xl text-[var(--color-ink)] mb-3">
            {f.title}
          </h3>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
