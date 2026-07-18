import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/villas/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const villa = await prisma.villa.findUnique({ where: { id } });
    if (!villa) {
      return NextResponse.json({ error: "Villa not found" }, { status: 404 });
    }
    return NextResponse.json(villa);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch villa" }, { status: 500 });
  }
}

// PUT /api/villas/[id]  (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const villa = await prisma.villa.update({ where: { id }, data: body });
    return NextResponse.json(villa);
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to update villa" }, { status: 500 });
  }
}

// DELETE /api/villas/[id]  (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.booking.deleteMany({ where: { villaId: id } });
    await prisma.villa.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to delete villa" }, { status: 500 });
  }
}
