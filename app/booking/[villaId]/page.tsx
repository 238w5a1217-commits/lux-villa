import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { Villa } from "@/types";

interface BookingPageProps {
  params: Promise<{ villaId: string }>;
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

export default async function BookingPage({ params }: BookingPageProps) {
  const { villaId } = await params;
  const villa = await getVilla(villaId);
  if (!villa) notFound();

  return (
    <>
      <Navbar />
      <main className="page-wrap py-8 pb-24">
        <BackButton label="← Back to Villa" />
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-ink-soft)] mb-6 flex items-center gap-2 -mt-2">
          <Link href="/" className="hover:text-[var(--color-amber)]">Home</Link>
          <span>/</span>
          <Link href="/villas" className="hover:text-[var(--color-amber)]">Villas</Link>
          <span>/</span>
          <Link href={`/villas/${villa.id}`} className="hover:text-[var(--color-amber)]">{villa.title}</Link>
          <span>/</span>
          <span className="text-[var(--color-ink)] font-medium">Book</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-2">
              Secure Your Stay
            </p>
            <h1 className="font-playfair text-3xl font-semibold text-[var(--color-ink)]">
              Complete Your Booking
            </h1>
            <p className="text-[var(--color-ink-soft)] text-sm mt-2">
              Fill in your details below. No payment required at this stage.
            </p>
          </div>

          <BookingForm villa={villa} />
        </div>
      </main>
      <Footer />
    </>
  );
}
