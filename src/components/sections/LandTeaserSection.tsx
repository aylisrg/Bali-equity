import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LandCard } from "@/components/land/LandCard";
import { SECTION_IDS } from "@/lib/constants";
import type { LandPlotComputed } from "@/types/land";

export function LandTeaserSection({ plots }: { plots: LandPlotComputed[] }) {
  if (plots.length === 0) return null;

  return (
    <SectionWrapper id={SECTION_IDS.land} dark>
      <SectionHeading
        title="Land Opportunities"
        subtitle="Buy the location before it's built on. Verified plots with confirmed zoning, clean titles and road access — explored on an interactive map"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {plots.map((plot) => (
          <LandCard key={plot.slug} plot={plot} surface="teaser" />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button
          variant="secondary"
          size="lg"
          href="/land"
          icon={<ArrowRight className="h-5 w-5" />}
        >
          Browse all plots on the map
        </Button>
      </div>
    </SectionWrapper>
  );
}
