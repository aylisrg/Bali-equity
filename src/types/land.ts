export type LandRegion =
  | "canggu-berawa"
  | "seseh-cemagi"
  | "uluwatu-bukit"
  | "ubud"
  | "east-bali"
  | "nusa-islands";

export type Zoning = "tourism" | "residential" | "agricultural";

export type LandStatus = "available" | "reserved" | "sold";

export type TenureType = "leasehold" | "freehold";

export interface LandCoordinates {
  lat: number;
  lng: number;
}

export interface LandTenure {
  type: TenureType;
  leaseYears?: number;
  extensionOption?: boolean;
}

export interface LandDistances {
  beach?: string;
  airport?: string;
  landmark?: string;
}

export interface LandUtilities {
  electricity: boolean;
  water: boolean;
}

export interface LandPlot {
  /** Derived from the content filename, never stored in JSON. */
  id: string;
  /** Derived from the content filename, never stored in JSON. */
  slug: string;
  title: string;
  region: LandRegion;
  /** Human-readable area label, e.g. "Berawa, Canggu". */
  area: string;
  coordinates: LandCoordinates;
  /** Optional plot boundary polygon; edited by hand in JSON when a survey exists. */
  boundary?: LandCoordinates[];
  /** Plot size in ares (1 are = 100 m²). */
  areSize: number;
  priceUSD: number;
  tenure: LandTenure;
  zoning: Zoning;
  status: LandStatus;
  /** First image is the cover. */
  images: string[];
  highlights: string[];
  distances?: LandDistances;
  roadAccess?: string;
  utilities?: LandUtilities;
  /** e.g. "SHM (freehold title)" or "HGB via PT PMA". */
  certificate?: string;
  description: string;
  investmentNote?: string;
  /** ISO date, e.g. "2026-05-12". */
  publishedAt: string;
  featured?: boolean;
  draft?: boolean;
}

export interface LandPlotComputed extends LandPlot {
  pricePerAre: number;
  sqm: number;
}
