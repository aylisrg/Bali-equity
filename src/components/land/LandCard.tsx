"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn, formatAres, formatCurrency } from "@/lib/utils";
import { track } from "@/lib/analytics";
import {
  REGION_LABELS,
  ZONING_BADGE_CLASSES,
  ZONING_LABELS,
} from "@/lib/landConstants";
import type { LandPlotComputed } from "@/types/land";

interface LandCardProps {
  plot: LandPlotComputed;
  surface: "catalog" | "teaser" | "similar";
  variant?: "full" | "compact";
  selected?: boolean;
  onHoverChange?: (slug: string | null) => void;
}

function tenureLabel(plot: LandPlotComputed): string {
  if (plot.tenure.type === "freehold") return "Freehold";
  const ext = plot.tenure.extensionOption ? " + extension" : "";
  return `Leasehold ${plot.tenure.leaseYears} yrs${ext}`;
}

export function LandCard({
  plot,
  surface,
  variant = "full",
  selected,
  onHoverChange,
}: LandCardProps) {
  const sold = plot.status === "sold";
  const href = `/land/${plot.slug}`;
  const onClick = () =>
    track({ name: "land_card_clicked", props: { slug: plot.slug, surface } });

  if (variant === "compact") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex w-72 shrink-0 snap-center overflow-hidden rounded-xl border bg-deep-blue/95 backdrop-blur transition-colors",
          selected ? "border-accent-gold/60" : "border-white/10"
        )}
      >
        <img
          src={plot.images[0]}
          alt={plot.title}
          className={cn("h-24 w-28 shrink-0 object-cover", sold && "grayscale")}
        />
        <div className="min-w-0 px-3 py-2">
          <p className="truncate text-sm font-semibold text-primary-white">
            {plot.title}
          </p>
          <p className="truncate text-xs text-muted">{plot.area}</p>
          <p className="mt-1 text-sm font-bold text-primary-white">
            {formatCurrency(plot.priceUSD)}
            <span className="ml-1 text-xs font-normal text-muted">
              · {formatCurrency(plot.pricePerAre)}/are
            </span>
          </p>
          <p className="text-xs text-accent-gold">{tenureLabel(plot)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      data-slug={plot.slug}
      onMouseEnter={() => onHoverChange?.(plot.slug)}
      onMouseLeave={() => onHoverChange?.(null)}
      className={cn(
        "group block overflow-hidden rounded-2xl border bg-surface transition-all duration-300",
        selected
          ? "border-accent-gold/60 shadow-lg shadow-accent-gold/10"
          : "border-white/10 hover:border-accent-gold/30"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={plot.images[0]}
          alt={plot.title}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
            sold && "grayscale"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {plot.status === "reserved" && <Badge label="Reserved" variant="gold" />}
          {sold && <Badge label="Sold" variant="red" />}
          {plot.featured && !sold && plot.status !== "reserved" && (
            <Badge label="Featured" variant="gold" />
          )}
        </div>
        <span
          className={cn(
            "absolute top-3 right-3 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            ZONING_BADGE_CLASSES[plot.zoning]
          )}
        >
          {ZONING_LABELS[plot.zoning]}
        </span>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-primary-white/90">
          <MapPin className="h-3.5 w-3.5 text-accent-gold" />
          {plot.area} · {REGION_LABELS[plot.region]}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-primary-white">
          {plot.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{formatAres(plot.areSize)}</p>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <span className="block text-xs text-muted">Price</span>
            <span className="text-lg font-bold text-primary-white">
              {formatCurrency(plot.priceUSD)}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-muted">Per are</span>
            <span className="text-lg font-bold text-accent-gold">
              {formatCurrency(plot.pricePerAre)}
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm font-medium text-accent-gold">
          {tenureLabel(plot)}
        </p>

        {plot.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {plot.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
