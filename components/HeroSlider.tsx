"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const heroImages = [
  "https://img.freepik.com/premium-photo/stunning-luxury-villa-with-private-infinity-pool-breathtaking-jungle-views-perfect-place-relax-enjoy-beauty-nature_14117-108605.jpg?w=2000",
  "https://www.luva-villas.com/img/upload_e88323430f08e510ce40cf35e7ea4ee3.webp",
  "https://rpmvacationrentals.com/wp-content/uploads/f038b500-7a24-4fa2-9973-aa079e974bb0.jpeg",
  "https://img.freepik.com/premium-photo/luxury-beachfront-villa-with-private-pool-hot-tub-fitness-area_124507-95648.jpg",
  "https://cdn.homedsgn.com/wp-content/uploads/2017/05/Breathtaking-Luxury-Resort-Villas-09-1150x646.jpg",
];

const DURATION = 5500;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initial ken-burns on first image
  useEffect(() => {
    const first = imgRefs.current[0];
    if (first) {
      gsap.fromTo(
        first,
        { scale: 1.12 },
        { scale: 1, duration: 0.2, ease: "power1.out" }
      );
    }
  }, []);

  // Cross-fade transition when index changes (skip first render)
  const prevIndex = useRef<number>(0);
  useEffect(() => {
    const prev = prevIndex.current;
    const next = index;
    prevIndex.current = index;

    if (prev === next) return; // initial mount

    const prevEl = imgRefs.current[prev];
    const nextEl = imgRefs.current[next];
    if (!prevEl || !nextEl) return;

    // Bring next on top, start invisible, apply ken-burns
    gsap.set(nextEl, { opacity: 0, scale: 1.1, zIndex: 2 });
    gsap.set(prevEl, { zIndex: 1 });

    const tl = gsap.timeline();
    tl.to(nextEl, { opacity: 1, scale: 1, duration: 1.4, ease: "power2.inOut" })
      .to(prevEl, { opacity: 0, duration: 0.6, ease: "power2.in" }, 0.5)
      .set(prevEl, { zIndex: 0, scale: 1 });
  }, [index]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((p) => (p + 1) % heroImages.length);
    }, DURATION);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      {heroImages.map((src, i) => (
        <img
          key={src}
          ref={(el) => { imgRefs.current[i] = el; }}
          src={src}
          alt="Luxury Villa"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === 0 ? 1 : 0,
            zIndex: i === 0 ? 1 : 0,
          }}
        />
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === index ? 24 : 8,
              height: 8,
              background: i === index ? "var(--color-amber-light)" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
