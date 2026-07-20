"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { DETAIL_ZOOM } from "@/lib/landConstants";
import { MapFallback, MapTypeToggle } from "@/components/land/LandMap";
import { PriceMarker } from "@/components/land/PriceMarker";
import type { LandCoordinates, LandPlotComputed } from "@/types/land";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";

/** Imperative polygon helper — @vis.gl/react-google-maps has no <Polygon>. */
function MapPolygon({ path }: { path: LandCoordinates[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const polygon = new google.maps.Polygon({
      paths: path,
      strokeColor: "#C4B193",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: "#C4B193",
      fillOpacity: 0.2,
    });
    polygon.setMap(map);
    return () => polygon.setMap(null);
  }, [map, path]);

  return null;
}

export function LandDetailMap({ plot }: { plot: LandPlotComputed }) {
  const [mapType, setMapType] = useState<"roadmap" | "hybrid">("hybrid");

  if (!API_KEY) {
    return (
      <div className="h-80 overflow-hidden rounded-2xl border border-white/10 md:h-[420px]">
        <MapFallback />
      </div>
    );
  }

  return (
    <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 md:h-[420px]">
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId={MAP_ID}
          colorScheme="DARK"
          defaultCenter={plot.coordinates}
          defaultZoom={DETAIL_ZOOM}
          mapTypeId={mapType}
          disableDefaultUI
          zoomControl
          gestureHandling="cooperative"
          className="h-full w-full"
        >
          {plot.boundary && plot.boundary.length >= 3 ? (
            <MapPolygon path={plot.boundary} />
          ) : (
            <PriceMarker plot={plot} state="selected" onClick={() => {}} />
          )}
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
