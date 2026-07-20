// Build-time data loader for land plots. Server components only —
// client components must receive plots via props.
import fs from "node:fs";
import path from "node:path";
import type { LandPlot, LandPlotComputed } from "@/types/land";

const CONTENT_DIR = path.join(process.cwd(), "content", "land");

const REGIONS = [
  "canggu-berawa",
  "seseh-cemagi",
  "uluwatu-bukit",
  "ubud",
  "east-bali",
  "nusa-islands",
];
const ZONINGS = ["tourism", "residential", "agricultural"];
const STATUSES = ["available", "reserved", "sold"];
const TENURES = ["leasehold", "freehold"];

function fail(file: string, message: string): never {
  throw new Error(`Invalid land plot "${file}": ${message}`);
}

function isCoordinate(value: unknown): value is { lat: number; lng: number } {
  if (typeof value !== "object" || value === null) return false;
  const { lat, lng } = value as Record<string, unknown>;
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function validatePlot(raw: unknown, file: string): asserts raw is Omit<LandPlot, "id" | "slug"> {
  if (typeof raw !== "object" || raw === null) fail(file, "not a JSON object");
  const plot = raw as Record<string, unknown>;

  for (const field of ["title", "area", "description", "publishedAt"]) {
    if (typeof plot[field] !== "string" || !(plot[field] as string).trim()) {
      fail(file, `missing or empty string field "${field}"`);
    }
  }
  if (!REGIONS.includes(plot.region as string)) {
    fail(file, `region must be one of ${REGIONS.join(", ")}`);
  }
  if (!ZONINGS.includes(plot.zoning as string)) {
    fail(file, `zoning must be one of ${ZONINGS.join(", ")}`);
  }
  if (!STATUSES.includes(plot.status as string)) {
    fail(file, `status must be one of ${STATUSES.join(", ")}`);
  }
  if (!isCoordinate(plot.coordinates)) {
    fail(file, "coordinates must be { lat, lng } numbers");
  }
  if (plot.boundary !== undefined) {
    if (!Array.isArray(plot.boundary) || !plot.boundary.every(isCoordinate)) {
      fail(file, "boundary must be an array of { lat, lng } points");
    }
  }
  if (typeof plot.areSize !== "number" || plot.areSize <= 0) {
    fail(file, "areSize must be a positive number");
  }
  if (typeof plot.priceUSD !== "number" || plot.priceUSD <= 0) {
    fail(file, "priceUSD must be a positive number");
  }
  const tenure = plot.tenure as Record<string, unknown> | undefined;
  if (!tenure || !TENURES.includes(tenure.type as string)) {
    fail(file, `tenure.type must be one of ${TENURES.join(", ")}`);
  }
  if (tenure.type === "leasehold" && typeof tenure.leaseYears !== "number") {
    fail(file, "leasehold plots require tenure.leaseYears");
  }
  if (!Array.isArray(plot.images) || plot.images.length === 0) {
    fail(file, "images must be a non-empty array");
  }
  if (!Array.isArray(plot.highlights)) {
    fail(file, "highlights must be an array");
  }
}

let cache: LandPlotComputed[] | null = null;

export function getAllPlots(): LandPlotComputed[] {
  if (cache) return cache;
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort();

  const plots = files.map((file) => {
    const raw: unknown = JSON.parse(
      fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")
    );
    validatePlot(raw, file);
    const slug = file.replace(/\.json$/, "");
    return {
      ...raw,
      id: slug,
      slug,
      pricePerAre: Math.round(raw.priceUSD / raw.areSize),
      sqm: Math.round(raw.areSize * 100),
    };
  });

  cache = plots
    .filter((plot) => !plot.draft)
    .sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) {
        return a.featured ? -1 : 1;
      }
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  return cache;
}

export function getPlotBySlug(slug: string): LandPlotComputed | undefined {
  return getAllPlots().find((plot) => plot.slug === slug);
}

export function getSimilarPlots(
  plot: LandPlotComputed,
  count = 3
): LandPlotComputed[] {
  return getAllPlots()
    .filter((other) => other.slug !== plot.slug && other.status !== "sold")
    .sort((a, b) => {
      const sameRegionA = a.region === plot.region ? 0 : 1;
      const sameRegionB = b.region === plot.region ? 0 : 1;
      if (sameRegionA !== sameRegionB) return sameRegionA - sameRegionB;
      return (
        Math.abs(a.pricePerAre - plot.pricePerAre) -
        Math.abs(b.pricePerAre - plot.pricePerAre)
      );
    })
    .slice(0, count);
}

export function getFeaturedPlots(count = 3): LandPlotComputed[] {
  const all = getAllPlots().filter((plot) => plot.status !== "sold");
  return all.slice(0, count);
}
