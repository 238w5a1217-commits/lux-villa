import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// PATCH /api/bookings/[id]  - Approve or Reject  (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { status } = await request.json();

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { villa: true },
    });

    try {
      const { sendEmailUsingClient } = await import("@/lib/email");
      
      let subject = "";
      let messageHtml = "";
      
      if (status === "Approved") {
        subject = `Booking Approved: ${booking.villa.title}`;
        messageHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #2d7a4f;">Booking Approved! 🎉</h2>
            <p>Dear ${booking.customerName},</p>
            <p>Great news! Your booking for <strong>${booking.villa.title}</strong> has been approved by our concierge.</p>
            <p>We are looking forward to hosting you. We will be in touch shortly with further details regarding your arrival.</p>
            <p>Best regards,<br>The LuxVilla Team</p>
          </div>
        `;
      } else if (status === "Rejected") {
        subject = `Booking Update: ${booking.villa.title}`;
        messageHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #b03030;">Booking Update</h2>
            <p>Dear ${booking.customerName},</p>
            <p>We regret to inform you that we are unable to accommodate your booking request for <strong>${booking.villa.title}</strong> at this time.</p>
            <p>If you have any questions, please feel free to reply to this email or explore other available properties on our website.</p>
            <p>Best regards,<br>The LuxVilla Team</p>
          </div>
        `;
      }

      if (subject && messageHtml) {
        await sendEmailUsingClient({
          to: booking.email,
          from: process.env.SMTP_USERNAME || "bookings@luxvilla.com",
          subject: subject,
          html: messageHtml
        });
      }
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
    }

    return NextResponse.json(booking);
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE /api/bookings/[id]  (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
