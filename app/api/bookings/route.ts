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

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
