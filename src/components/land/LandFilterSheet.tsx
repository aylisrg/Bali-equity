"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, formatCurrency } from "@/lib/utils";
import { SORT_OPTIONS, ZONING_LABELS } from "@/lib/landConstants";
import type { LandSort } from "@/lib/landConstants";
import {
  defaultFilters,
  type FilterBounds,
  type LandFilters,
} from "@/lib/landFilters";
import { track } from "@/lib/analytics";
import type { TenureType, Zoning } from "@/types/land";

interface LandFilterSheetProps {
  open: boolean;
  filters: LandFilters;
  bounds: FilterBounds;
  resultCount: number;
  onChange: (filters: LandFilters) => void;
  onClose: () => void;
}

const PRICE_STEP = 10_000;

export function LandFilterSheet({
  open,
  filters,
  bounds,
  resultCount,
  onChange,
  onClose,
}: LandFilterSheetProps) {
  const setPrice = (index: 0 | 1, value: number) => {
    const price: [number, number] = [...filters.price];
    price[index] = value;
    if (price[0] > price[1]) price[index === 0 ? 1 : 0] = value;
    onChange({ ...filters, price });
    track({
      name: "land_filter_applied",
      props: { filter: "price", value: `${price[0]}-${price[1]}` },
    });
  };

  const setSize = (index: 0 | 1, value: number) => {
    const size: [number, number] = [...filters.size];
    size[index] = value;
    if (size[0] > size[1]) size[index === 0 ? 1 : 0] = value;
    onChange({ ...filters, size });
    track({
      name: "land_filter_applied",
      props: { filter: "size", value: `${size[0]}-${size[1]}` },
    });
  };

  const toggleZoning = (zone: Zoning) => {
    const zoning = filters.zoning.includes(zone)
      ? filters.zoning.filter((z) => z !== zone)
      : [...filters.zoning, zone];
    onChange({ ...filters, zoning });
    track({
      name: "land_filter_applied",
      props: { filter: "zoning", value: zone },
    });
  };

  const setTenure = (tenure: TenureType | null) => {
    onChange({ ...filters, tenure });
    track({
      name: "land_filter_applied",
      props: { filter: "tenure", value: tenure ?? "any" },
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-deep-blue p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:inset-x-auto lg:top-20 lg:right-8 lg:bottom-auto lg:w-96 lg:rounded-2xl lg:border"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-primary-white">
                Filters
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-primary-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-primary-white">
                  Price
                </p>
                <div className="space-y-3">
                  <label className="block text-xs text-muted">
                    From {formatCurrency(filters.price[0])}
                    <input
                      type="range"
                      min={bounds.price[0]}
                      max={bounds.price[1]}
                      step={PRICE_STEP}
                      value={filters.price[0]}
                      onChange={(e) => setPrice(0, Number(e.target.value))}
                      className="mt-1 w-full accent-accent-gold"
                    />
                  </label>
                  <label className="block text-xs text-muted">
                    To {formatCurrency(filters.price[1])}
                    <input
                      type="range"
                      min={bounds.price[0]}
                      max={bounds.price[1]}
                      step={PRICE_STEP}
                      value={filters.price[1]}
                      onChange={(e) => setPrice(1, Number(e.target.value))}
                      className="mt-1 w-full accent-accent-gold"
                    />
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-primary-white">
                  Plot size (ares)
                </p>
                <div className="space-y-3">
                  <label className="block text-xs text-muted">
                    From {filters.size[0]} are
                    <input
                      type="range"
                      min={bounds.size[0]}
                      max={bounds.size[1]}
                      step={1}
                      value={filters.size[0]}
                      onChange={(e) => setSize(0, Number(e.target.value))}
                      className="mt-1 w-full accent-accent-gold"
                    />
                  </label>
                  <label className="block text-xs text-muted">
                    To {filters.size[1]} are
                    <input
                      type="range"
                      min={bounds.size[0]}
                      max={bounds.size[1]}
                      step={1}
                      value={filters.size[1]}
                      onChange={(e) => setSize(1, Number(e.target.value))}
                      className="mt-1 w-full accent-accent-gold"
                    />
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-primary-white">
                  Zoning
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(ZONING_LABELS) as Zoning[]).map((zone) => (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => toggleZoning(zone)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        filters.zoning.includes(zone)
                          ? "border-accent-gold bg-accent-gold text-deep-blue"
                          : "border-white/15 text-primary-white hover:border-accent-gold/50"
                      )}
                    >
                      {ZONING_LABELS[zone]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-primary-white">
                  Ownership
                </p>
                <div className="flex gap-2">
                  {(
                    [
                      [null, "Any"],
                      ["leasehold", "Leasehold"],
                      ["freehold", "Freehold"],
                    ] as [TenureType | null, string][]
                  ).map(([value, label]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setTenure(value)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        filters.tenure === value
                          ? "border-accent-gold bg-accent-gold text-deep-blue"
                          : "border-white/15 text-primary-white hover:border-accent-gold/50"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:hidden">
                <p className="mb-2 text-sm font-semibold text-primary-white">
                  Sort by
                </p>
                <select
                  value={filters.sort}
                  onChange={(event) =>
                    onChange({
                      ...filters,
                      sort: event.target.value as LandSort,
                    })
                  }
                  className="w-full rounded-lg border border-white/15 bg-deep-blue px-3 py-2 text-sm text-primary-white outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  onChange({ ...defaultFilters(bounds), sort: filters.sort })
                }
              >
                Reset
              </Button>
              <Button variant="primary" size="sm" fullWidth onClick={onClose}>
                Show {resultCount} plots
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
