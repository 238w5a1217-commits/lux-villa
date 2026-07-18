import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VillaCard from "@/components/VillaCard";
import FeaturedVilla from "@/components/FeaturedVilla";
import ReviewSection from "@/components/ReviewSection";
import HeroSlider from "@/components/HeroSlider";
import LandingAnimations from "@/components/LandingAnimations";
import WhyChooseUs from "@/components/WhyChooseUs";
import { Villa } from "@/types";

async function getFeaturedVillas(): Promise<Villa[]> {
  try {
    const villas = await prisma.villa.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
    });
    return villas.map((v: any) => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
    })) as Villa[];
  } catch {
    return [];
  }
}

async function getAllVillas(): Promise<Villa[]> {
  try {
    const villas = await prisma.villa.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    return villas.map((v: any) => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
    })) as Villa[];
  } catch {
    return [];
  }
}



export default async function HomePage() {
  const [featuredVillas, latestVillas] = await Promise.all([
    getFeaturedVillas(),
    getAllVillas(),
  ]);

  return (
    <>
      <LandingAnimations />
      <Navbar />
      <main>

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: "92vh" }}>
          <HeroSlider />

          {/* Overlay gradient */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(130deg, rgba(26,18,8,0.88) 0%, rgba(26,18,8,0.55) 55%, rgba(26,18,8,0.25) 100%)",
            }}
          />

          {/* Hero content */}
          <div className="page-wrap relative z-10 flex flex-col justify-center" style={{ minHeight: "78vh" }}>
            <div className="max-w-2xl pt-24 pb-10">

              <span
                className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-7"
                style={{
                  background: "rgba(212,167,106,0.18)",
                  color: "var(--color-amber-light)",
                  border: "1px solid rgba(212,167,106,0.4)",
                  backdropFilter: "blur(6px)",
                }}
              >
                ✦ World-Class Luxury Villa Rentals
              </span>

              <h1 className="hero-title font-playfair text-5xl md:text-7xl font-semibold text-white leading-[1.1] mb-6">
                Find Your
                <br />
                <span style={{ color: "var(--color-amber-light)" }}>Perfect </span>
                Villa Escape
              </h1>

              <p className="hero-sub text-white/70 text-lg leading-relaxed mb-9 max-w-xl">
                Discover handpicked luxury villas across the world's most
                breathtaking destinations. Book seamlessly, live beautifully.
              </p>

              <div className="hero-btns flex gap-4 flex-wrap">
                <Link href="/villas" className="btn btn-primary text-base py-3.5 px-8" style={{ fontSize: 15 }}>
                  Browse Villas →
                </Link>
                <Link
                  href="#featured"
                  className="btn text-base py-3.5 px-8"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.28)",
                    backdropFilter: "blur(6px)",
                    fontSize: 15,
                  }}
                >
                  See Featured
                </Link>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="relative z-10"
            style={{ background: "rgba(20,13,5,0.82)", backdropFilter: "blur(12px)" }}
          >
            <div className="page-wrap py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                {[
                  { value: "200+", label: "Luxury Villas" },
                  { value: "50+",  label: "Destinations" },
                  { value: "4.9★", label: "Average Rating" },
                  { value: "10K+", label: "Happy Guests" },
                ].map((stat) => (
                  <div key={stat.label} className="hero-stat">
                    <p
                      className="font-playfair text-2xl md:text-3xl font-semibold"
                      style={{ color: "var(--color-amber-light)" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURED VILLAS ═══════════════ */}
        {featuredVillas.length > 0 && (
          <section id="featured" className="page-wrap" style={{ paddingTop: "80px", paddingBottom: "96px" }}>
            <div className="section-reveal flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-2">
                  Handpicked
                </p>
                <h2 className="section-title">Featured Villas</h2>
              </div>
              <Link href="/villas" className="text-sm font-semibold text-[var(--color-amber)] hover:underline">
                View All →
              </Link>
            </div>

            <div className="flex flex-col" style={{ gap: "32px" }}>
              {featuredVillas.slice(0, 3).map((villa, idx) => (
                <div key={villa.id} className="featured-card">
                  <FeaturedVilla villa={villa} reverse={idx % 2 === 1} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════ VILLA GRID ═══════════════ */}
        {latestVillas.length > 0 && (
          <section id="explore" className="page-wrap" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
            <div
              className="villa-grid rounded-3xl"
              style={{ background: "var(--color-cream-2)", padding: "56px 40px" }}
            >
              <div className="section-reveal flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-2">
                    Latest Listings
                  </p>
                  <h2 className="section-title">Explore More Villas</h2>
                </div>
                <Link href="/villas" className="text-sm font-semibold text-[var(--color-amber)] hover:underline">
                  See All →
                </Link>
              </div>

              <div className="overflow-hidden relative">
                <div className="animate-marquee gap-5 pb-4">
                  {[...latestVillas, ...latestVillas, ...latestVillas].map((villa, idx) => (
                    <div key={`${villa.id}-${idx}`} className="villa-grid-card w-[280px] sm:w-[320px] shrink-0">
                      <VillaCard villa={villa} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════ WHY LUXVILLA ═══════════════ */}
        <section id="why" className="features-section page-wrap" style={{ paddingBottom: "96px" }}>
          <div className="section-reveal text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-3">
              Why Choose Us
            </p>
            <h2 className="section-title">The LuxVilla Difference</h2>
            <p className="text-[var(--color-ink-soft)] text-base mt-3 max-w-md mx-auto">
              More than luxury — a commitment to exceptional experiences from
              the moment you book.
            </p>
          </div>

          <WhyChooseUs />
        </section>

        {/* ═══════════════ REVIEWS ═══════════════ */}
        <section id="reviews" className="reviews-section page-wrap">
          <ReviewSection />
        </section>

        {/* ═══════════════ CTA BANNER ═══════════════ */}
        <section id="contact" className="page-wrap" style={{ paddingBottom: "96px" }}>
          <div
            className="cta-banner rounded-3xl py-16 px-10 text-center text-white overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, var(--color-ink) 0%, #3d2c1a 60%, #5c3d20 100%)",
            }}
          >
            {/* decorative circles */}
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
              style={{ background: "var(--color-amber-light)" }}
            />
            <div
              className="absolute -bottom-20 -left-12 w-72 h-72 rounded-full opacity-[0.07]"
              style={{ background: "var(--color-amber)" }}
            />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-amber-light)" }}>
                Start Your Journey
              </p>
              <h2 className="font-playfair text-3xl md:text-5xl font-semibold mb-4 leading-tight">
                Ready to Find Your<br />Dream Villa?
              </h2>
              <p className="text-white/60 text-base mb-8 max-w-lg mx-auto">
                Browse our full collection of luxury villas and secure your
                perfect getaway today.
              </p>
              <Link href="/villas" className="btn btn-primary text-base py-4 px-10" style={{ fontSize: 15 }}>
                Browse All Villas →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
