import type { Metadata } from "next";
import { getAllPlots } from "@/lib/land";
import { SITE_URL } from "@/lib/constants";
import { organizationSchema } from "@/lib/seo";
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

  const itemList = {
    "@type": "ItemList",
    name: "Land for Sale in Bali",
    numberOfItems: plots.length,
    itemListElement: plots.map((plot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/land/${plot.slug}`,
      name: plot.title,
    })),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Land", item: `${SITE_URL}/land` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), itemList, breadcrumb],
  };

  return (
    <main className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Land for sale in Bali</h1>
      <LandExplorer plots={plots} />
    </main>
  );
}
