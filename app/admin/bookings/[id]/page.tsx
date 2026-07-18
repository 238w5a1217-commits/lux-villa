import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/AdminSidebar";
import BookingActions from "@/components/BookingActions";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Hash,
  Home,
  IndianRupee,
  Star,
  BedDouble,
  MessageSquare,
  BadgeCheck,
  Clock,
  XOctagon,
} from "lucide-react";

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getBooking(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { villa: true },
    });
    if (!booking) return null;
    return {
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      villa: booking.villa
        ? { ...booking.villa, createdAt: booking.villa.createdAt.toISOString() }
        : null,
    };
  } catch {
    return null;
  }
}

const STATUS_CONFIG = {
  Pending:  { label: "Pending",  Icon: Clock,      bg: "var(--color-warning-bg)",  color: "var(--color-warning)" },
  Approved: { label: "Approved", Icon: BadgeCheck,  bg: "var(--color-success-bg)", color: "var(--color-success)" },
  Rejected: { label: "Rejected", Icon: XOctagon,   bg: "var(--color-danger-bg)",  color: "var(--color-danger)" },
} as const;

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen" style={{ background: "var(--color-cream)" }}>
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "var(--color-cream-2)" }}
            >
              <Hash size={36} style={{ color: "var(--color-amber)" }} />
            </div>
            <h1 className="font-playfair text-2xl font-semibold text-[var(--color-ink)] mb-2">
              Booking Not Found
            </h1>
            <p className="text-[var(--color-ink-soft)] text-sm mb-6">
              The booking ID <code className="font-mono bg-[var(--color-cream-2)] px-2 py-0.5 rounded text-xs">{id}</code> does not exist.
            </p>
            <a
              href="/admin/bookings"
              className="btn btn-primary"
            >
              ← Back to Bookings
            </a>
          </div>
        </main>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG];

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: "var(--color-cream)" }}>
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-5xl">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-1">
            Admin · Bookings
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-playfair text-3xl font-semibold text-[var(--color-ink)]">
                Booking Details
              </h1>
              <p className="text-[var(--color-ink-soft)] text-sm mt-0.5 flex items-center gap-1.5">
                <Hash size={13} />
                <span className="font-mono">{booking.id}</span>
              </p>
            </div>
            {/* Status badge */}
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: statusCfg.bg, color: statusCfg.color }}
            >
              <statusCfg.Icon size={15} />
              {statusCfg.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Villa card ── */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Villa image */}
            {booking.villa && (
              <div className="card overflow-hidden">
                <img
                  src={booking.villa.images[0]}
                  alt={booking.villa.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-1">
                    Booked Villa
                  </p>
                  <h2 className="font-playfair text-lg font-semibold text-[var(--color-ink)] mb-2">
                    {booking.villa.title}
                  </h2>
                  <div className="space-y-2 text-sm text-[var(--color-ink-soft)]">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} style={{ color: "var(--color-amber)" }} />
                      {booking.villa.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee size={13} style={{ color: "var(--color-amber)" }} />
                      <span className="font-bold text-[var(--color-ink)]">
                        ₹{booking.villa.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs">/ night</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble size={13} style={{ color: "var(--color-amber)" }} />
                      {booking.villa.bedrooms} Bedrooms
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={13} style={{ color: "var(--color-gold)" }} />
                      {booking.villa.rating} / 5.0 Rating
                    </div>
                  </div>
                  <a
                    href={`/villas/${booking.villa.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-amber)] hover:underline"
                  >
                    <Home size={12} /> View Villa Page ↗
                  </a>
                </div>
              </div>
            )}

            {/* Booking meta */}
            <div className="card p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-3">
                Booking Info
              </p>
              <InfoRow Icon={Hash}     label="Booking ID"  value={<code className="font-mono text-xs">{booking.id}</code>} />
              <InfoRow Icon={Calendar} label="Date"        value={new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
              <InfoRow Icon={Users}    label="Guests"      value={`${booking.guests} ${booking.guests === 1 ? "Guest" : "Guests"}`} />
            </div>
          </div>

          {/* ── RIGHT: Customer details ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Customer details */}
            <div className="card p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-5">
                Customer Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailCard Icon={User}    label="Full Name"    value={booking.customerName} />
                <DetailCard Icon={Mail}    label="Email"        value={booking.email} />
                <DetailCard Icon={Phone}   label="Phone"        value={booking.phone} />
                <DetailCard Icon={Users}   label="No. of Guests" value={`${booking.guests} ${booking.guests === 1 ? "Guest" : "Guests"}`} />
                <div className="sm:col-span-2">
                  <DetailCard Icon={MapPin}  label="Address"    value={booking.address} />
                </div>
              </div>
            </div>

            {/* Special request */}
            <div className="card p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-3 flex items-center gap-2">
                <MessageSquare size={13} /> Special Requests
              </p>
              {booking.specialRequest ? (
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed bg-[var(--color-cream-2)] rounded-xl p-4">
                  {booking.specialRequest}
                </p>
              ) : (
                <p className="text-sm text-[var(--color-ink-soft)] italic">No special requests provided.</p>
              )}
            </div>

            {/* Status history / current status */}
            <div className="card p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-4">
                Current Status
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: statusCfg.bg }}
                >
                  <statusCfg.Icon size={22} style={{ color: statusCfg.color }} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{statusCfg.label}</p>
                  <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">
                    {booking.status === "Pending" && "Awaiting admin review. Use buttons below to approve or reject."}
                    {booking.status === "Approved" && "This booking has been approved. Customer will be contacted."}
                    {booking.status === "Rejected" && "This booking has been rejected."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="card p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-4">
                Actions
              </p>
              <BookingActions bookingId={booking.id} currentStatus={booking.status} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Small reusable sub-components ─── */

function InfoRow({
  Icon,
  label,
  value,
}: {
  Icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm" style={{ borderBottom: "1px solid var(--color-line)", paddingBottom: "10px" }}>
      <span className="flex items-center gap-1.5 text-[var(--color-ink-soft)] shrink-0">
        <Icon size={13} style={{ color: "var(--color-amber)" }} /> {label}
      </span>
      <span className="font-medium text-[var(--color-ink)] text-right">{value}</span>
    </div>
  );
}

function DetailCard({
  Icon,
  label,
  value,
}: {
  Icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--color-cream-2)", border: "1px solid var(--color-line)" }}
    >
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
        <Icon size={12} style={{ color: "var(--color-amber)" }} />
        {label}
      </div>
      <p className="text-sm font-semibold text-[var(--color-ink)] break-all">{value}</p>
    </div>
  );
}
