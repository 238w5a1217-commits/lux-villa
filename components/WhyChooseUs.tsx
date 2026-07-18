"use client";

import { Trophy, Lock, Headphones } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Curated Excellence",
    desc: "Every villa is personally inspected and verified to meet our rigorous luxury standards before being listed.",
    image: "https://imagedelivery.net/zoXpF7NA9PJGSgF8n4OxPQ/b0e1215e-b327-46b8-9262-424bc32ac700/public",
  },
  {
    icon: Lock,
    title: "Secure Booking",
    desc: "Your booking and payment details are protected with bank-level security. Book with complete confidence.",
    image: "https://www.schooltripworld.co.uk/wp-content/uploads/2025/03/Icon-022.png",
  },
  {
    icon: Headphones,
    title: "Dedicated Concierge",
    desc: "A personal concierge team is available 24/7 to assist with every last detail of your stay.",
    image: "https://www.ltvplus.com/wp-content/uploads/2024/03/2-1024x576.png",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="feature-grid grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 px-4 max-w-6xl mx-auto">
      {features.map((f, i) => (
        <div
          key={f.title}
          className="relative group rounded-3xl overflow-hidden transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl h-[400px] flex flex-col justify-end p-8 border border-[var(--color-line)]"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${f.image})` }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/80 transition-colors duration-500" />

          {/* Content */}
          <div className="relative z-10 text-white flex flex-col items-start transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <f.icon size={26} className="text-white" />
            </div>

            <h3 className="font-playfair font-bold text-2xl mb-3 tracking-tight">
              {f.title}
            </h3>

            <p className="text-sm text-white/80 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {f.desc}
            </p>

            <div className="mt-6 w-12 h-1 rounded-full bg-[var(--color-amber)] group-hover:w-full transition-all duration-700 ease-out opacity-80" />
          </div>
        </div>
      ))}
    </div>
  );
}
