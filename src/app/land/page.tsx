import type { Metadata } from "next";
import { getAllPlots } from "@/lib/land";
import { SITE_URL } from "@/lib/constants";
import { LandExplorer } from "@/components/land/LandExplorer";

export const metadata: Metadata = {
  title: "Land for Sale in Bali — Map Search | Equity Bali",
  description:
    "Browse verified land plots for sale in Bali on an interactive map. Leasehold and freehold, confirmed zoning, road access and clean titles — Canggu, Seseh, Uluwatu, Ubud and beyond.",
  alternates: { canonical: `${SITE_URL}/land` },
  openGraph: {
    title: "Land for Sale in Bali — Map Search | Equity Bali",
    description:
      "Verified land plots across Bali with confirmed zoning and clean titles. Explore on the map.",
    type: "website",
  },
};

export default function LandPage() {
  const plots = getAllPlots();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Land for Sale in Bali",
    itemListElement: plots.map((plot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: plot.title,
      url: `${SITE_URL}/land/${plot.slug}`,
    })),
  };

  return (
    <main className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <h1 className="sr-only">Land for sale in Bali</h1>
      <LandExplorer plots={plots} />
    </main>
  );
}
