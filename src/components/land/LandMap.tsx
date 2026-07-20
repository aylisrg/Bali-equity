"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { Layers, MapPinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { BALI_CENTER, DEFAULT_ZOOM } from "@/lib/landConstants";
import { PriceMarker } from "@/components/land/PriceMarker";
import type { LandPlotComputed } from "@/types/land";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";

type MapType = "roadmap" | "hybrid";

interface LandMapProps {
  plots: LandPlotComputed[];
  selectedSlug: string | null;
  hoveredSlug: string | null;
  onPinClick: (slug: string) => void;
  className?: string;
}

/** Fits bounds when the filtered set changes and pans to the selected plot. */
function MapController({
  plots,
  selectedSlug,
}: {
  plots: LandPlotComputed[];
  selectedSlug: string | null;
}) {
  const map = useMap();
  const slugsKey = plots.map((plot) => plot.slug).join(",");
  const lastFitKey = useRef<string | null>(null);

  useEffect(() => {
    if (!map || plots.length === 0 || lastFitKey.current === slugsKey) return;
    lastFitKey.current = slugsKey;
    if (plots.length === 1) {
      map.panTo(plots[0].coordinates);
      map.setZoom(13);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    plots.forEach((plot) => bounds.extend(plot.coordinates));
    map.fitBounds(bounds, 64);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, slugsKey]);

  useEffect(() => {
    if (!map || !selectedSlug) return;
    const plot = plots.find((p) => p.slug === selectedSlug);
    if (plot) map.panTo(plot.coordinates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedSlug]);

  return null;
}

export function MapTypeToggle({
  mapType,
  onChange,
  className,
}: {
  mapType: MapType;
  onChange: (type: MapType) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(mapType === "roadmap" ? "hybrid" : "roadmap")}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-white/15 bg-deep-blue/90 px-3 py-2 text-xs font-semibold text-primary-white shadow-lg backdrop-blur transition-colors hover:border-accent-gold/50",
        className
      )}
    >
      <Layers className="h-4 w-4 text-accent-gold" />
      {mapType === "roadmap" ? "Satellite" : "Map"}
    </button>
  );
}

export function MapFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 bg-surface p-8 text-center",
        className
      )}
    >
      <MapPinOff className="h-10 w-10 text-accent-gold/60" />
      <p className="font-heading text-lg text-primary-white">
        Map is temporarily unavailable
      </p>
      <p className="max-w-xs text-sm text-muted">
        Browse the plot list — every listing includes location details and
        distances.
      </p>
    </div>
  );
}

export function LandMap({
  plots,
  selectedSlug,
  hoveredSlug,
  onPinClick,
  className,
}: LandMapProps) {
  const [mapType, setMapType] = useState<MapType>("roadmap");
  const markers = useMemo(
    () =>
      plots.map((plot) => {
        const state =
          plot.slug === selectedSlug
            ? "selected"
            : plot.slug === hoveredSlug
              ? "hover"
              : "default";
        return { plot, state } as const;
      }),
    [plots, selectedSlug, hoveredSlug]
  );

  if (!API_KEY) {
    return <MapFallback className={className} />;
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId={MAP_ID}
          colorScheme="DARK"
          defaultCenter={BALI_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          mapTypeId={mapType}
          disableDefaultUI
          zoomControl
          gestureHandling="greedy"
          className="h-full w-full"
        >
          <MapController plots={plots} selectedSlug={selectedSlug} />
          {markers.map(({ plot, state }) => (
            <PriceMarker
              key={plot.slug}
              plot={plot}
              state={state}
              onClick={onPinClick}
            />
          ))}
        </Map>
      </APIProvider>
      <MapTypeToggle
        mapType={mapType}
        onChange={setMapType}
        className="absolute top-4 right-4 z-10"
      />
    </div>
  );
}
