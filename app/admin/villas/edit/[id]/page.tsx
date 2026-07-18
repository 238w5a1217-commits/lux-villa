import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VillaForm from "@/components/VillaForm";
import { Villa } from "@/types";

interface EditVillaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVillaPage({ params }: EditVillaPageProps) {
  const { id } = await params;

  let villa: Villa | null = null;
  try {
    const v = await prisma.villa.findUnique({ where: { id } });
    if (!v) notFound();
    villa = { ...v, createdAt: v.createdAt.toISOString() } as Villa;
  } catch {
    notFound();
  }

  return <VillaForm initialData={villa!} isEdit villaId={id} />;
}
