import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/villas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const minBeds = searchParams.get("minBeds");
    const maxPrice = searchParams.get("maxPrice");

    const where: Record<string, unknown> = {};
    if (featured === "true") where.featured = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }
    if (minBeds) where.bedrooms = { gte: parseInt(minBeds) };
    if (maxPrice) where.price = { lte: parseFloat(maxPrice) };

    const villas = await prisma.villa.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(villas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch villas" }, { status: 500 });
  }
}

// POST /api/villas  (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const villa = await prisma.villa.create({ data: body });
    return NextResponse.json(villa, { status: 201 });
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create villa" }, { status: 500 });
  }
}
