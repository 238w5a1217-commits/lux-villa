import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/bookings  (admin only)
export async function GET() {
  try {
    await requireAdmin();
    const bookings = await prisma.booking.findMany({
      include: { villa: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST /api/bookings  (customer, no auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { villaId, customerName, email, phone, address, guests, specialRequest } = body;

    if (!villaId || !customerName || !email || !phone || !address || !guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const villa = await prisma.villa.findUnique({ where: { id: villaId } });
    if (!villa) {
      return NextResponse.json({ error: "Villa not found" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        villaId,
        customerName,
        email,
        phone,
        address,
        guests: parseInt(guests),
        specialRequest: specialRequest || "",
        status: "Pending",
      },
    });

    try {
      const { sendEmailUsingClient } = await import("@/lib/email");
      await sendEmailUsingClient({
        to: email,
        from: process.env.SMTP_USERNAME || "bookings@luxvilla.com",
        subject: `Booking Confirmation for ${villa.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #d4a76a;">LuxVilla Booking Received</h2>
            <p>Dear ${customerName},</p>
            <p>Thank you for choosing LuxVilla! We have received your booking request for <strong>${villa.title}</strong>.</p>
            <p><strong>Booking Details:</strong></p>
            <ul>
              <li><strong>Guests:</strong> ${guests}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Status:</strong> Pending Approval</li>
            </ul>
            <p>Our concierge team will review your request and get back to you shortly.</p>
            <p>Best regards,<br>The LuxVilla Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
