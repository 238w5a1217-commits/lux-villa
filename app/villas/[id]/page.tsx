import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import BackButton from "@/components/BackButton";
import { Villa } from "@/types";
import { MapPin, Star, BedDouble, ShowerHead, Users, CheckCircle } from "lucide-react";

interface VillaDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getVilla(id: string): Promise<Villa | null> {
  try {
    const villa = await prisma.villa.findUnique({ where: { id } });
    if (!villa) return null;
    return { ...villa, createdAt: villa.createdAt.toISOString() } as Villa;
  } catch {
    return null;
  }
}

export default async function VillaDetailPage({ params }: VillaDetailPageProps) {
  const { id } = await params;
  const villa = await getVilla(id);
  if (!villa) notFound();

  return (
    <>
      <Navbar />
      <main className="page-wrap py-8 pb-24">
        <BackButton label="← Back to Villas" />
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-ink-soft)] mb-5 flex items-center gap-2 -mt-2">
          <Link href="/" className="hover:text-[var(--color-amber)]">Home</Link>
          <span>/</span>
          <Link href="/villas" className="hover:text-[var(--color-amber)]">Villas</Link>
          <span>/</span>
          <span className="text-[var(--color-ink)] font-medium">{villa.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---- LEFT: Gallery + Details ---- */}
          <div className="lg:col-span-2">
            <ImageGallery images={villa.images} title={villa.title} />

            {/* Title row */}
            <div className="flex items-start justify-between gap-4 mb-4 mt-6">
              <div>
                <h1 className="font-playfair text-3xl font-semibold text-[var(--color-ink)] mb-1">
                  {villa.title}
                </h1>
                <p className="text-[var(--color-ink-soft)] flex items-center gap-1.5">
                  <MapPin size={14} className="shrink-0" /> {villa.location}
                  <span className="mx-2 text-[var(--color-line)]">|</span>
                  <Star size={14} className="shrink-0" style={{ color: "var(--color-gold)" }} />
                  <strong className="text-[var(--color-ink)]">{villa.rating}</strong>
                  <span className="text-xs ml-0.5">(48 reviews)</span>
                </p>
              </div>
              {villa.featured && (
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "var(--color-amber)" }}
                >
                  Featured
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-7">
              {[
                { value: villa.bedrooms,      label: "Bedrooms",  Icon: BedDouble },
                { value: villa.bathrooms,     label: "Bathrooms", Icon: ShowerHead },
                { value: villa.bedrooms * 2,  label: "Max Guests",Icon: Users },
                { value: villa.rating,        label: "Rating",    Icon: Star },
              ].map((s) => (
                <div key={s.label} className="card p-4 text-center">
                  <div className="flex justify-center mb-1">
                    <s.Icon size={20} style={{ color: "var(--color-amber)" }} />
                  </div>
                  <p className="font-bold text-xl text-[var(--color-ink)]">{s.value}</p>
                  <p className="text-xs text-[var(--color-ink-soft)]">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-7">
              <h2 className="font-playfair text-xl font-semibold text-[var(--color-ink)] mb-3">
                About this Villa
              </h2>
              <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm">
                {villa.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-playfair text-xl font-semibold text-[var(--color-ink)] mb-4">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {villa.amenities.map((a) => (
                  <span
                    key={a}
                    className="px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-1.5"
                    style={{
                      background: "var(--color-cream-2)",
                      borderColor: "var(--color-line)",
                      color: "var(--color-ink)",
                    }}
                  >
                    <CheckCircle size={13} style={{ color: "var(--color-amber)" }} />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ---- RIGHT: Booking card ---- */}
          <div>
            <div className="card p-6 sticky top-20">
              <div className="mb-4">
                <span className="font-playfair text-3xl font-semibold text-[var(--color-ink)]">
                  ₹{villa.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-[var(--color-ink-soft)] ml-1">/ night</span>
              </div>

              {/* Short description in booking card */}
              <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed mb-4 line-clamp-3">
                {villa.description}
              </p>

              <div
                className="rounded-xl p-4 mb-5 space-y-2.5"
                style={{ background: "var(--color-cream-2)" }}
              >
                {[
                  { Icon: MapPin,    label: "Location",  val: villa.location },
                  { Icon: BedDouble, label: "Bedrooms",  val: `${villa.bedrooms} bedrooms` },
                  { Icon: ShowerHead,label: "Bathrooms", val: `${villa.bathrooms} bathrooms` },
                  { Icon: Star,      label: "Rating",    val: `${villa.rating} / 5.0` },
                ].map(({ Icon, label, val }) => (
                  <div key={label} className="flex justify-between text-sm items-center">
                    <span className="text-[var(--color-ink-soft)] flex items-center gap-1.5">
                      <Icon size={13} style={{ color: "var(--color-amber)" }} /> {label}
                    </span>
                    <span className="font-medium text-[var(--color-ink)]">{val}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/booking/${villa.id}`}
                className="btn btn-primary w-full text-base py-3.5 justify-center"
              >
                Book Now →
              </Link>

              <p className="text-xs text-center text-[var(--color-ink-soft)] mt-3">
                No payment required. Confirm your booking details first.
              </p>

              {/* Top amenities */}
              {villa.amenities.length > 0 && (
                <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--color-line)" }}>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3">
                    Top Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {villa.amenities.slice(0, 5).map((a) => (
                      <span
                        key={a}
                        className="text-xs px-2.5 py-1 rounded-lg"
                        style={{ background: "var(--color-cream-2)", color: "var(--color-ink-soft)" }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
