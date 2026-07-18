import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Outfit({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LuxVilla — Luxury Villa Rentals",
  description:
    "Discover and book world-class luxury villas. Breathtaking locations, premium amenities, and seamless booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter antialiased bg-cream text-ink">{children}</body>
    </html>
  );
}
