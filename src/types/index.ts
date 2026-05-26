export type AccountType =
  | "customer"
  | "vendor"
  | "delivery-agent"
  | "logistics-company"
  | "service-provider"
  | "apartment-host"
  | "tenant-admin"
  | "super-admin";

export interface NavItem {
  label: string;
  href: string;
}

export interface MetricCard {
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "success" | "warning";
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: string;
  categorySlug?: string;
  vendor: string;
  vendorSlug?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  eta: string;
  location: string;
  image: string;
  inStock: boolean;
  verified: boolean;
  fastDelivery: boolean;
  highlight?: string;
  description: string;
  reviewCount?: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  rate: string;
  rating: number;
  summary: string;
  location: string;
  image: string;
}

export interface Apartment {
  id: string;
  name: string;
  zone: string;
  nightlyRate: number;
  rooms: string;
  summary: string;
  host: string;
  image: string;
  badge?: string;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: string;
  status: string;
  timestamp: string;
}
