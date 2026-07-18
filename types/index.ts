export interface Villa {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images: string[];
  amenities: string[];
  rating: number;
  bedrooms: number;
  bathrooms: number;
  featured: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  villaId: string;
  villa?: Villa;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  guests: number;
  specialRequest?: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  createdAt: string;
}
