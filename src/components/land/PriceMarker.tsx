"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { cn, formatCompactPrice } from "@/lib/utils";
import type { LandPlotComputed } from "@/types/land";

interface PriceMarkerProps {
  plot: LandPlotComputed;
  state: "default" | "hover" | "selected";
  onClick: (slug: string) => void;
}

export function PriceMarker({ plot, state, onClick }: PriceMarkerProps) {
  const sold = plot.status === "sold";
  const active = state !== "default";

  return (
    <AdvancedMarker
      position={plot.coordinates}
      zIndex={active ? 100 : sold ? 1 : 10}
      onClick={() => onClick(plot.slug)}
    >
      <div
        className={cn(
          "cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold shadow-lg transition-all duration-150",
          active
            ? "scale-110 border-accent-gold bg-accent-gold text-deep-blue"
            : sold
              ? "border-white/20 bg-surface/80 text-muted"
              : "border-accent-gold/40 bg-deep-blue/95 text-primary-white"
        )}
      >
        {formatCompactPrice(plot.priceUSD)}
      </div>
    </AdvancedMarker>
  );
}
