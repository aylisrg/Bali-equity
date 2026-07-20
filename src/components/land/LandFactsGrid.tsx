import {
  Award,
  Droplets,
  FileCheck,
  LandPlot as LandPlotIcon,
  MapPin,
  Plane,
  Route,
  Umbrella,
  Zap,
} from "lucide-react";
import { formatAres, formatCurrency } from "@/lib/utils";
import { ZONING_LABELS } from "@/lib/landConstants";
import type { LandPlotComputed } from "@/types/land";

interface Fact {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function LandFactsGrid({ plot }: { plot: LandPlotComputed }) {
  const facts: Fact[] = [
    {
      icon: <LandPlotIcon className="h-5 w-5" />,
      label: "Plot size",
      value: formatAres(plot.areSize),
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: "Price per are",
      value: formatCurrency(plot.pricePerAre),
    },
    {
      icon: <FileCheck className="h-5 w-5" />,
      label: "Ownership",
      value:
        plot.tenure.type === "freehold"
          ? "Freehold"
          : `Leasehold ${plot.tenure.leaseYears} yrs${plot.tenure.extensionOption ? " + extension option" : ""}`,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Zoning",
      value: ZONING_LABELS[plot.zoning],
    },
  ];

  if (plot.certificate) {
    facts.push({
      icon: <FileCheck className="h-5 w-5" />,
      label: "Certificate",
      value: plot.certificate,
    });
  }
  if (plot.roadAccess) {
    facts.push({
      icon: <Route className="h-5 w-5" />,
      label: "Road access",
      value: plot.roadAccess,
    });
  }
  if (plot.utilities) {
    facts.push({
      icon: <Zap className="h-5 w-5" />,
      label: "Electricity",
      value: plot.utilities.electricity ? "Available at plot" : "Not connected",
    });
    facts.push({
      icon: <Droplets className="h-5 w-5" />,
      label: "Water",
      value: plot.utilities.water ? "Available at plot" : "Well / delivery",
    });
  }
  if (plot.distances?.beach) {
    facts.push({
      icon: <Umbrella className="h-5 w-5" />,
      label: "Beach",
      value: plot.distances.beach,
    });
  }
  if (plot.distances?.airport) {
    facts.push({
      icon: <Plane className="h-5 w-5" />,
      label: "Airport",
      value: plot.distances.airport,
    });
  }
  if (plot.distances?.landmark) {
    facts.push({
      icon: <MapPin className="h-5 w-5" />,
      label: "Nearby",
      value: plot.distances.landmark,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="rounded-2xl border border-accent-gold/20 p-4"
        >
          <div className="flex items-center gap-2 text-accent-gold">
            {fact.icon}
            <span className="text-xs uppercase tracking-wider text-muted">
              {fact.label}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-primary-white">
            {fact.value}
          </p>
        </div>
      ))}
    </div>
  );
}
