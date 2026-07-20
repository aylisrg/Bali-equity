import type {
  LandPlotComputed,
  LandRegion,
  TenureType,
  Zoning,
} from "@/types/land";
import type { LandSort } from "@/lib/landConstants";

export interface LandFilters {
  price: [number, number];
  size: [number, number];
  regions: LandRegion[];
  zoning: Zoning[];
  tenure: TenureType | null;
  sort: LandSort;
}

export interface FilterBounds {
  price: [number, number];
  size: [number, number];
}

export function getFilterBounds(plots: LandPlotComputed[]): FilterBounds {
  const prices = plots.map((plot) => plot.priceUSD);
  const sizes = plots.map((plot) => plot.areSize);
  return {
    price: [Math.min(...prices), Math.max(...prices)],
    size: [Math.min(...sizes), Math.max(...sizes)],
  };
}

export function defaultFilters(bounds: FilterBounds): LandFilters {
  return {
    price: [...bounds.price] as [number, number],
    size: [...bounds.size] as [number, number],
    regions: [],
    zoning: [],
    tenure: null,
    sort: "newest",
  };
}

export function countActiveFilters(
  filters: LandFilters,
  bounds: FilterBounds
): number {
  let count = 0;
  if (
    filters.price[0] !== bounds.price[0] ||
    filters.price[1] !== bounds.price[1]
  ) {
    count += 1;
  }
  if (filters.size[0] !== bounds.size[0] || filters.size[1] !== bounds.size[1]) {
    count += 1;
  }
  count += filters.regions.length > 0 ? 1 : 0;
  count += filters.zoning.length > 0 ? 1 : 0;
  count += filters.tenure ? 1 : 0;
  return count;
}

export function applyFilters(
  plots: LandPlotComputed[],
  filters: LandFilters
): LandPlotComputed[] {
  const filtered = plots.filter((plot) => {
    if (plot.priceUSD < filters.price[0] || plot.priceUSD > filters.price[1]) {
      return false;
    }
    if (plot.areSize < filters.size[0] || plot.areSize > filters.size[1]) {
      return false;
    }
    if (filters.regions.length > 0 && !filters.regions.includes(plot.region)) {
      return false;
    }
    if (filters.zoning.length > 0 && !filters.zoning.includes(plot.zoning)) {
      return false;
    }
    if (filters.tenure && plot.tenure.type !== filters.tenure) {
      return false;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.priceUSD - b.priceUSD;
      case "price-desc":
        return b.priceUSD - a.priceUSD;
      case "ppa-asc":
        return a.pricePerAre - b.pricePerAre;
      case "size-desc":
        return b.areSize - a.areSize;
      case "newest":
      default:
        return b.publishedAt.localeCompare(a.publishedAt);
    }
  });
}
