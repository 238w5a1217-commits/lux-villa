"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, Loader2 } from "lucide-react";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: string;
}

export default function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState(currentStatus);

  const updateStatus = async (newStatus: "Approved" | "Rejected" | "Pending") => {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Error updating booking.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-[var(--color-cream-2)]"
        style={{ borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }}
      >
        <ArrowLeft size={15} />
        Back to Bookings
      </button>

      <div className="flex items-center gap-2 ml-auto flex-wrap">
        {status !== "Approved" && (
          <button
            onClick={() => updateStatus("Approved")}
            disabled={!!loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--color-success)", color: "#fff" }}
          >
            {loading === "Approved" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CheckCircle size={15} />
            )}
            Approve Booking
          </button>
        )}

        {status !== "Rejected" && (
          <button
            onClick={() => updateStatus("Rejected")}
            disabled={!!loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--color-danger)", color: "#fff" }}
          >
            {loading === "Rejected" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <XCircle size={15} />
            )}
            Reject Booking
          </button>
        )}

        {status !== "Pending" && (
          <button
            onClick={() => updateStatus("Pending")}
            disabled={!!loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-[var(--color-cream-2)] disabled:opacity-50"
            style={{ borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }}
          >
            {loading === "Pending" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RotateCcw size={15} />
            )}
            Reset to Pending
          </button>
        )}
      </div>
    </div>
  );
}
