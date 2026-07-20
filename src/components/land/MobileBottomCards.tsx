"use client";

import { useEffect, useRef } from "react";
import { LandCard } from "@/components/land/LandCard";
import type { LandPlotComputed } from "@/types/land";

interface MobileBottomCardsProps {
  plots: LandPlotComputed[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}

/** Airbnb-style swipeable mini-card rail shown over the map on mobile. */
export function MobileBottomCards({
  plots,
  selectedSlug,
  onSelect,
}: MobileBottomCardsProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmaticScroll = useRef(false);

  // Pin tap → scroll the rail to that card.
  useEffect(() => {
    if (!selectedSlug || !railRef.current) return;
    const index = plots.findIndex((plot) => plot.slug === selectedSlug);
    if (index < 0) return;
    const rail = railRef.current;
    const card = rail.children[index] as HTMLElement | undefined;
    if (!card) return;
    programmaticScroll.current = true;
    rail.scrollTo({
      left: card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
    const release = setTimeout(() => {
      programmaticScroll.current = false;
    }, 500);
    return () => clearTimeout(release);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug]);

  // Swipe end → select the centered card so the map pans to it.
  const handleScroll = () => {
    if (programmaticScroll.current) return;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const rail = railRef.current;
      if (!rail) return;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      let closest = 0;
      let closestDistance = Infinity;
      Array.from(rail.children).forEach((child, index) => {
        const element = child as HTMLElement;
        const childCenter = element.offsetLeft + element.clientWidth / 2;
        const distance = Math.abs(childCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });
      const plot = plots[closest];
      if (plot && plot.slug !== selectedSlug) onSelect(plot.slug);
    }, 120);
  };

  if (plots.length === 0) return null;

  return (
    <div
      ref={railRef}
      onScroll={handleScroll}
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {plots.map((plot) => (
        <LandCard
          key={plot.slug}
          plot={plot}
          surface="catalog"
          variant="compact"
          selected={plot.slug === selectedSlug}
        />
      ))}
    </div>
  );
}
