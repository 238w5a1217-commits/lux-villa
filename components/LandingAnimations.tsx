"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Observe a PARENT element. When it enters the viewport,
 * ALL matching children reveal together (with nth-child stagger from CSS).
 * Elements are visible by default — JS only hides them after mount.
 */
function observeGroup(parentSelector: string, childSelector: string, fromClass?: string) {
  const parents = document.querySelectorAll<Element>(parentSelector);
  parents.forEach((parent) => {
    const children = parent.querySelectorAll<Element>(childSelector);
    if (!children.length) return;

    // Mark hidden AFTER paint so SSR content is always visible first
    children.forEach((el) => {
      el.classList.add("reveal-hidden");
      if (fromClass) el.classList.add(fromClass);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            children.forEach((el) => {
              el.classList.remove("reveal-hidden");
              el.classList.add("reveal-visible");
            });
            io.disconnect();
          }
        });
      },
      { threshold: 0.1 } // fire as soon as 10% of parent is visible
    );

    io.observe(parent);
  });
}

/** Observe a single element */
function observeEl(selector: string, fromClass?: string) {
  document.querySelectorAll<Element>(selector).forEach((el) => {
    el.classList.add("reveal-hidden");
    if (fromClass) el.classList.add(fromClass);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove("reveal-hidden");
            el.classList.add("reveal-visible");
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    io.observe(el);
  });
}

export default function LandingAnimations() {
  useEffect(() => {
    // Wait one frame so the browser has painted SSR content
    const raf = requestAnimationFrame(() => {

      /* ── Hero entrance: GSAP only (no scroll, plays immediately) ── */
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-badge", { opacity: 0, y: 18, duration: 0.65, delay: 0.1 })
        .from(".hero-title", { opacity: 0, y: 38, duration: 0.75 }, "-=0.35")
        .from(".hero-sub",   { opacity: 0, y: 26, duration: 0.65 }, "-=0.45")
        .from(".hero-btns",  { opacity: 0, y: 18, duration: 0.55 }, "-=0.35")
        .from(".hero-stat",  { opacity: 0, y: 16, duration: 0.45, stagger: 0.08 }, "-=0.25");

      /* ── Section headings: each one individually ── */
      observeEl(".section-reveal", "from-left");

      /* ── Featured villa cards: alternate sides, each card individually ── */
      document.querySelectorAll<Element>(".featured-card").forEach((el, i) => {
        el.classList.add("reveal-hidden");
        el.classList.add(i % 2 === 0 ? "from-left" : "from-right");

        const io = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              el.classList.remove("reveal-hidden");
              el.classList.add("reveal-visible");
              io.disconnect();
            }
          },
          { threshold: 0.12 }
        );
        io.observe(el);
      });

      /* ── Villa grid: ALL 4 cards together when grid enters view ── */
      observeGroup(".villa-grid", ".villa-grid-card", "from-scale");

      /* ── Feature cards: ALL 3 together when grid enters view ── */
      observeGroup(".feature-grid", ".feature-card");

      /* ── Review cards: ALL 3 together when grid enters view ── */
      observeGroup(".review-grid", ".review-card");

      /* ── CTA banner ── */
      observeEl(".cta-banner", "from-scale");

    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
