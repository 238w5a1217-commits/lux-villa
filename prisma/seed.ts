import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const allImages = [
  "https://img.freepik.com/premium-photo/stunning-luxury-villa-with-private-infinity-pool-breathtaking-jungle-views-perfect-place-relax-enjoy-beauty-nature_14117-108605.jpg?w=2000",
  "https://www.luva-villas.com/img/upload_e88323430f08e510ce40cf35e7ea4ee3.webp",
  "https://villascroatia.com/wp-content/uploads/2020/08/modern-luxury-villa-pool-medulin-croatia-15-1.jpg",
  "https://media.vrbo.com/lodging/19000000/18980000/18979200/18979106/7fa81e67.c10.jpg",
  "https://rpmvacationrentals.com/wp-content/uploads/f038b500-7a24-4fa2-9973-aa079e974bb0.jpeg",
  "https://www.luxuryvacationvillas.co.uk/wp-content/uploads/2020/11/60738173_1249039951938204_8033735498239311872_o.jpg",
  "https://www.qantas.com/travelinsider/en/explore/asia/indonesia/bali/best-villas-bali/_jcr_content/verticalGalleryMain/gallery/galleryItems/382_1739240912225.img.1440.high.jpg/1739240935386.jpg",
  "https://www.avhotels.eu/img/contenidos/av_villas/slider/01.jpg",
  "https://img.freepik.com/premium-photo/luxury-beachfront-villa-with-private-pool-hot-tub-fitness-area_124507-95648.jpg",
  "https://lirp.cdn-website.com/1ce73612/dms3rep/multi/opt/Wymara+four+and+five+bedroom+villas+1c-300dpi-96ca6ac2-1920w.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://newhomes.id/assets/cities/id/houses/green-hills/sunrise-villas-bali/1-1.jpg",
  "https://img.freepik.com/premium-photo/luxury-villas-offering-private-pools-aweinspiring-ocean-views-step-into-world-elegance-as-you-bask-comfort-seclusion-your-own-private-haven-generated-by-ai_855332-2102.jpg",
  "https://www.fiveelementsinfra.com/blogs/wp-content/uploads/2026/03/gated_villas_tukkuguda.webp",
  "https://cloudfront.wheretostay.com/images/locations/caribbean/portrait/Global-Getaways-Turks-and-Caicos-228.jpg",
  "https://tse1.mm.bing.net/th/id/OIP.BwbljL-KP7hgLtXmGqz79gHaD4?r=0&pid=Api&P=0&h=180",
  "https://www.villascostarica.com/wp-content/uploads/2019/10/1-night-time-view-1280x720.jpg",
  "https://forumvillas.com/wp-content/uploads/2022/09/4b823df8.f10.jpg",
  "https://www.offplan-dubai.com/wp-content/uploads/2025/03/mira-banner.jpg",
  "https://www.propzilla.ae/images/dar-global-d-villas/desktop-banner.webp",
  "https://www.seyvillas.com/img/objects/199/2530x1467_75/villa-270-pool-deck-view-4273.jpg",
  "https://hrimgs.co/w:500/h:500/@orbi/df4f2d16-f5a6-4d2d-b478-5393a68d12bf-homerunner.jpg",
  "https://www.villaexperts.es/wp-content/uploads/2022/01/ND-OT-V14-i.jpg",
  "https://www.fotolog.net/wp-content/uploads/2025/03/Pullman-Maldives_0581-1024x682-1.jpg",
  "https://www.emaarmisr.com/wp-content/uploads/2025/10/Emaar-Misr-Marassi-Red-Sea-Horizon-Villas-Smaller-Cover.jpg",
  "https://cdn.homedsgn.com/wp-content/uploads/2017/05/Breathtaking-Luxury-Resort-Villas-09-1150x646.jpg"
];

const villas = [
  {
    title: "Ocean Breeze Villa",
    location: "Bali, Indonesia",
    price: 850,
    description: "A breathtaking oceanfront villa perched on a cliffside in Bali. This architectural masterpiece offers panoramic views of the Indian Ocean, with an infinity pool that seems to merge with the horizon. Every morning you'll wake to the sound of waves crashing below.",
    images: allImages.slice(0, 4),
    amenities: ["Infinity Pool", "Ocean View", "Private Chef", "Butler Service", "Beach Access", "WiFi", "Air Conditioning", "Gym"],
    rating: 4.9,
    bedrooms: 5,
    bathrooms: 5,
    featured: true,
  },
  {
    title: "Santorini Sunset Villa",
    location: "Santorini, Greece",
    price: 1200,
    description: "Perched on the volcanic caldera of Santorini with unobstructed views of the famous sunset. This iconic white-washed villa with traditional Cycladic architecture features a private plunge pool, outdoor dining terrace, and exquisite cave-style interiors.",
    images: allImages.slice(4, 8),
    amenities: ["Caldera View", "Plunge Pool", "Outdoor Dining", "WiFi", "Air Conditioning", "Daily Housekeeping", "Concierge"],
    rating: 4.8,
    bedrooms: 3,
    bathrooms: 3,
    featured: true,
  },
  {
    title: "Tuscan Vineyard Estate",
    location: "Tuscany, Italy",
    price: 980,
    description: "A restored 16th-century stone farmhouse set amid rolling hills, olive groves and private vineyards in the heart of Tuscany. The estate includes a large stone-edged pool, a fully equipped Italian kitchen, and breathtaking countryside views from every window.",
    images: allImages.slice(8, 12),
    amenities: ["Private Vineyard", "Stone Pool", "Italian Kitchen", "Wine Cellar", "Fireplace", "WiFi", "Outdoor BBQ", "Parking"],
    rating: 4.7,
    bedrooms: 6,
    bathrooms: 4,
    featured: true,
  },
  {
    title: "Maldives Water Villa",
    location: "North Malé Atoll, Maldives",
    price: 2100,
    description: "Float above the crystal-clear turquoise waters of the Indian Ocean in this extraordinary overwater villa. Step directly from your glass-floored bedroom into the warm lagoon below. Includes a private deck, outdoor bathtub, and direct lagoon access.",
    images: allImages.slice(12, 16),
    amenities: ["Overwater Deck", "Glass Floor", "Direct Lagoon Access", "Outdoor Bathtub", "Snorkeling Gear", "WiFi", "Room Service", "Sunset Lounge"],
    rating: 5.0,
    bedrooms: 2,
    bathrooms: 2,
    featured: true,
  },
  {
    title: "Amalfi Clifftop Retreat",
    location: "Positano, Italy",
    price: 760,
    description: "Suspended dramatically on the Amalfi Coast cliffs, this Italian retreat offers terraced gardens cascading down to a private boat jetty. A serene hideaway with lemon-scented breezes, handmade local ceramics and unmatched views of the Tyrrhenian Sea.",
    images: allImages.slice(16, 20),
    amenities: ["Private Jetty", "Terraced Garden", "Sea View", "WiFi", "Breakfast Included", "Air Conditioning", "Concierge"],
    rating: 4.6,
    bedrooms: 4,
    bathrooms: 3,
    featured: false,
  },
  {
    title: "Moroccan Desert Palace",
    location: "Marrakech, Morocco",
    price: 430,
    description: "An authentic Moroccan riad transformed into a luxury desert palace. Featuring hand-carved plasterwork, intricate zellige tile mosaics, a rooftop terrace with Atlas Mountain views, a traditional hammam, and a stunning central courtyard with a mosaic fountain.",
    images: allImages.slice(20, 24),
    amenities: ["Traditional Hammam", "Rooftop Terrace", "Courtyard Fountain", "WiFi", "Breakfast Included", "Air Conditioning", "Private Chef"],
    rating: 4.7,
    bedrooms: 5,
    bathrooms: 4,
    featured: false,
  },
  {
    title: "Swiss Alpine Chalet",
    location: "Zermatt, Switzerland",
    price: 1450,
    description: "A majestic timber chalet with direct views of the iconic Matterhorn peak. This ski-in/ski-out property features an indoor jacuzzi, sauna, panoramic lounge with a stone fireplace, and a private chef available for après-ski dining experiences.",
    images: [allImages[24], allImages[0], allImages[1], allImages[2]],
    amenities: ["Ski-in/Ski-out", "Indoor Jacuzzi", "Sauna", "Matterhorn View", "Stone Fireplace", "WiFi", "Private Chef", "Ski Storage"],
    rating: 4.9,
    bedrooms: 7,
    bathrooms: 5,
    featured: false,
  },
  {
    title: "Phuket Hillside Sanctuary",
    location: "Phuket, Thailand",
    price: 620,
    description: "A private hillside paradise above the Andaman Sea with sweeping views across three bays. This contemporary Thai-style villa features natural wood finishes, a 25-metre infinity pool, an outdoor sala for alfresco dining and a dedicated villa host.",
    images: allImages.slice(3, 7),
    amenities: ["Infinity Pool", "Bay View", "Outdoor Sala", "Villa Host", "WiFi", "Air Conditioning", "Daily Housekeeping", "Airport Transfer"],
    rating: 4.8,
    bedrooms: 4,
    bathrooms: 4,
    featured: false,
  }
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.booking.deleteMany();
  await prisma.villa.deleteMany();
  await prisma.admin.deleteMany();

  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.admin.create({
    data: {
      email: "admin@villa.com",
      password: hashedPassword,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  for (const villa of villas) {
    const created = await prisma.villa.create({ data: villa });
    console.log(`✅ Villa created: ${created.title}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
