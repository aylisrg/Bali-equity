import type { LandRegion, LandStatus, Zoning } from "@/types/land";

export const REGION_LABELS: Record<LandRegion, string> = {
  "canggu-berawa": "Canggu / Berawa",
  "seseh-cemagi": "Seseh / Cemagi",
  "uluwatu-bukit": "Uluwatu / Bukit",
  ubud: "Ubud",
  "east-bali": "East Bali",
  "nusa-islands": "Nusa Islands",
};

export const ZONING_LABELS: Record<Zoning, string> = {
  tourism: "Tourism zone",
  residential: "Residential zone",
  agricultural: "Agricultural zone",
};

export const ZONING_BADGE_CLASSES: Record<Zoning, string> = {
  tourism: "bg-pink-500/15 text-pink-300 border-pink-400/30",
  residential: "bg-yellow-500/15 text-yellow-300 border-yellow-400/30",
  agricultural: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
};

export const STATUS_LABELS: Record<LandStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export const BALI_CENTER = { lat: -8.65, lng: 115.2 };
export const DEFAULT_ZOOM = 10;
export const DETAIL_ZOOM = 16;

export type LandSort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "ppa-asc"
  | "size-desc";

export const SORT_OPTIONS: { value: LandSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "ppa-asc", label: "Price per are: low to high" },
  { value: "size-desc", label: "Size: large to small" },
];
