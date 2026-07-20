"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { LandPlotComputed } from "@/types/land";

export function LandGallery({ plot }: { plot: LandPlotComputed }) {
  const [active, setActive] = useState(0);
  const sold = plot.status === "sold";

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
        <img
          src={plot.images[active]}
          alt={`${plot.title} — photo ${active + 1}`}
          className={cn("h-full w-full object-cover", sold && "grayscale")}
        />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep-blue/50">
            <span className="rounded-full border border-primary-red/40 bg-primary-red/80 px-6 py-2 font-heading text-xl font-bold uppercase tracking-widest text-primary-white">
              Sold
            </span>
          </div>
        )}
        {plot.status === "reserved" && (
          <div className="absolute top-4 left-4">
            <Badge label="Reserved" variant="gold" />
          </div>
        )}
      </div>

      {plot.images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {plot.images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              className={cn(
                "h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-colors",
                index === active
                  ? "border-accent-gold"
                  : "border-white/10 hover:border-white/30"
              )}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
