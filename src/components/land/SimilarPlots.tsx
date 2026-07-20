import { LandCard } from "@/components/land/LandCard";
import type { LandPlotComputed } from "@/types/land";

export function SimilarPlots({ plots }: { plots: LandPlotComputed[] }) {
  if (plots.length === 0) return null;

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-primary-white">
        Similar plots
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plots.map((plot) => (
          <LandCard key={plot.slug} plot={plot} surface="similar" />
        ))}
      </div>
    </section>
  );
}
