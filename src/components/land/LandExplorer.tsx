"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { track } from "@/lib/analytics";
import {
  applyFilters,
  countActiveFilters,
  defaultFilters,
  getFilterBounds,
  type LandFilters,
} from "@/lib/landFilters";
import { LandCard } from "@/components/land/LandCard";
import { LandFilterBar } from "@/components/land/LandFilterBar";
import { LandFilterSheet } from "@/components/land/LandFilterSheet";
import { LandMap } from "@/components/land/LandMap";
import { MobileBottomCards } from "@/components/land/MobileBottomCards";
import { Button } from "@/components/ui/Button";
import type { LandPlotComputed } from "@/types/land";

export function LandExplorer({ plots }: { plots: LandPlotComputed[] }) {
  const bounds = useMemo(() => getFilterBounds(plots), [plots]);
  const [filters, setFilters] = useState<LandFilters>(() =>
    defaultFilters(bounds)
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => applyFilters(plots, filters),
    [plots, filters]
  );
  const activeCount = countActiveFilters(filters, bounds);

  // Drop a selection that no longer survives the filters.
  useEffect(() => {
    if (selectedSlug && !filtered.some((plot) => plot.slug === selectedSlug)) {
      setSelectedSlug(null);
    }
  }, [filtered, selectedSlug]);

  const handlePinClick = (slug: string) => {
    setSelectedSlug(slug);
    track({ name: "land_pin_clicked", props: { slug } });
    if (isDesktop) {
      listRef.current
        ?.querySelector(`[data-slug="${slug}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const toggleMobileView = () => {
    const view = mobileView === "map" ? "list" : "map";
    setMobileView(view);
    track({ name: "map_view_toggled", props: { view } });
  };

  const filterBar = (
    <LandFilterBar
      filters={filters}
      activeCount={activeCount}
      resultCount={filtered.length}
      onChange={setFilters}
      onOpenSheet={() => setSheetOpen(true)}
    />
  );

  return (
    <div className="relative h-[calc(100dvh-4rem)] lg:grid lg:grid-cols-[42%_58%] xl:grid-cols-[40%_60%]">
      {/* Card list: full-screen overlay on mobile, left column on desktop */}
      <div
        ref={listRef}
        className={cn(
          "absolute inset-0 z-10 overflow-y-auto bg-deep-blue lg:static lg:z-auto lg:h-full",
          mobileView === "map" && "hidden lg:block"
        )}
      >
        <div className="sticky top-0 z-20 border-b border-white/5 bg-deep-blue/95 px-4 py-3 backdrop-blur">
          {filterBar}
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
            <p className="text-muted">No plots match your filters.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilters(defaultFilters(bounds))}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 p-4 pb-28 lg:pb-8 xl:grid-cols-2">
            {filtered.map((plot) => (
              <LandCard
                key={plot.slug}
                plot={plot}
                surface="catalog"
                selected={plot.slug === selectedSlug}
                onHoverChange={setHoveredSlug}
              />
            ))}
          </div>
        )}
      </div>

      {/* Map: base layer on mobile, right column on desktop */}
      <div className="absolute inset-0 lg:static lg:h-full">
        <LandMap
          plots={filtered}
          selectedSlug={selectedSlug}
          hoveredSlug={hoveredSlug}
          onPinClick={handlePinClick}
        />
        <div
          className={cn(
            "absolute inset-x-0 top-3 z-10 px-4 lg:hidden",
            mobileView === "list" && "hidden"
          )}
        >
          {filterBar}
        </div>
        <div
          className={cn(
            "absolute inset-x-0 bottom-24 z-10 lg:hidden",
            mobileView === "list" && "hidden"
          )}
        >
          <MobileBottomCards
            plots={filtered}
            selectedSlug={selectedSlug}
            onSelect={setSelectedSlug}
          />
        </div>
      </div>

      {/* Mobile map/list toggle */}
      <button
        type="button"
        onClick={toggleMobileView}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-accent-gold px-5 py-2.5 text-sm font-bold text-deep-blue shadow-xl lg:hidden"
      >
        {mobileView === "map" ? (
          <>
            <List className="h-4 w-4" /> List
          </>
        ) : (
          <>
            <MapIcon className="h-4 w-4" /> Map
          </>
        )}
      </button>

      <LandFilterSheet
        open={sheetOpen}
        filters={filters}
        bounds={bounds}
        resultCount={filtered.length}
        onChange={setFilters}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
