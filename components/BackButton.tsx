"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 -ml-3 rounded-lg text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream-2)] transition-all mb-4"
    >
      {label}
    </button>
  );
}
