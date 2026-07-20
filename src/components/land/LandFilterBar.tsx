"use client";

import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { REGION_LABELS, SORT_OPTIONS } from "@/lib/landConstants";
import type { LandSort } from "@/lib/landConstants";
import type { LandFilters } from "@/lib/landFilters";
import { track } from "@/lib/analytics";
import type { LandRegion } from "@/types/land";

interface LandFilterBarProps {
  filters: LandFilters;
  activeCount: number;
  resultCount: number;
  onChange: (filters: LandFilters) => void;
  onOpenSheet: () => void;
  className?: string;
}

export function LandFilterBar({
  filters,
  activeCount,
  resultCount,
  onChange,
  onOpenSheet,
  className,
}: LandFilterBarProps) {
  const toggleRegion = (region: LandRegion) => {
    const regions = filters.regions.includes(region)
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region];
    onChange({ ...filters, regions });
    track({
      name: "land_filter_applied",
      props: { filter: "region", value: region },
    });
  };

  const changeSort = (sort: LandSort) => {
    onChange({ ...filters, sort });
    track({ name: "land_filter_applied", props: { filter: "sort", value: sort } });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onOpenSheet}
        className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-deep-blue/90 px-3 py-1.5 text-xs font-semibold text-primary-white backdrop-blur transition-colors hover:border-accent-gold/50"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-accent-gold" />
        Filters
        {activeCount > 0 && (
          <span className="rounded-full bg-accent-gold px-1.5 text-[10px] font-bold text-deep-blue">
            {activeCount}
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(Object.keys(REGION_LABELS) as LandRegion[]).map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => toggleRegion(region)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors",
              filters.regions.includes(region)
                ? "border-accent-gold bg-accent-gold text-deep-blue"
                : "border-white/15 bg-deep-blue/90 text-primary-white hover:border-accent-gold/50"
            )}
          >
            {REGION_LABELS[region]}
          </button>
        ))}
      </div>

      <div className="hidden shrink-0 items-center gap-2 md:flex">
        <span className="text-xs text-muted">{resultCount} plots</span>
        <select
          value={filters.sort}
          onChange={(event) => changeSort(event.target.value as LandSort)}
          className="rounded-lg border border-white/15 bg-deep-blue px-2 py-1.5 text-xs text-primary-white outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
